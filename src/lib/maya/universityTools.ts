import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { searchKnowledge, searchPrograms } from '@/lib/qdrant';
import { ProgramDegreeType } from '@prisma/client';

/**
 * Tool to search the university knowledge base using semantic search.
 */
export const search_knowledge = new DynamicStructuredTool({
  name: 'search_knowledge',
  description: 'Search the university knowledge base for specific information using semantic search. Use this for general questions about admissions, campus life, scholarships, or specific course details not found in structured data.',
  schema: z.object({
    universityId: z.string().describe('The unique ID of the university.'),
    query: z.string().describe('The search query or question to search for.'),
  }),
  func: async ({ universityId, query }: { universityId: string; query: string }) => {
    try {
      const results = await searchKnowledge(universityId, query);
      if (!results || results.length === 0) {
        return 'No relevant information found in the knowledge base.';
      }
      return JSON.stringify(results.map(r => ({
        content: r.payload?.content,
        category: r.payload?.category,
        score: r.score
      })), null, 2);
    } catch (error) {
      console.error('Error in search_knowledge tool:', error);
      return 'An error occurred while searching the knowledge base.';
    }
  },
});

/**
 * Tool to list programs offered by a university.
 * Supports both structured DB queries and semantic search via Qdrant.
 */
export const list_programs = new DynamicStructuredTool({
  name: 'list_programs',
  description:
    'List or discover programs offered by a university. ' +
    'Use useSemanticSearch=true for vague, open-ended queries (e.g. "programs related to AI", "low tuition options", "best programs for data science career"). ' +
    'Use useSemanticSearch=false (default) for exact lookups filtered by degreeType or department.',
  schema: z.object({
    universityId: z.string().describe('The unique ID of the university.'),
    degreeType: z
      .nativeEnum(ProgramDegreeType)
      .optional()
      .describe('Filter by degree level (e.g., BS, MS, MBA, PHD). Only used when useSemanticSearch is false.'),
    department: z
      .string()
      .optional()
      .describe('Filter by department name (e.g., Computer Science). Only used when useSemanticSearch is false.'),
    query: z
      .string()
      .optional()
      .describe('A semantic search query to find relevant programs. Required when useSemanticSearch is true.'),
    useSemanticSearch: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        'Set to true to use semantic/vector search to find programs by meaning. ' +
        'Set to false (default) to use exact structured DB filters (degreeType, department).'
      ),
  }),
  func: async ({
    universityId,
    degreeType,
    department,
    query,
    useSemanticSearch,
  }: {
    universityId: string;
    degreeType?: ProgramDegreeType;
    department?: string;
    query?: string;
    useSemanticSearch?: boolean;
  }) => {
    try {
      // ── Semantic Mode ─────────────────────────────────────────────────
      if (useSemanticSearch) {
        if (!query) {
          return 'A query string is required for semantic search. Please provide what kind of programs the student is looking for.';
        }

        const results = await searchPrograms(query, universityId, 10);

        if (!results || results.length === 0) {
          return '[]';
        }

        // Return the same shape as the structured results for UI consistency
        const programs = results.map((r) => ({
          id: r.payload?.programId,
          name: r.payload?.name,
          department: r.payload?.department,
          degreeType: r.payload?.degreeType,
          durationMonths: r.payload?.durationMonths,
          tuitionPerYear: r.payload?.tuitionPerYear,
          applyUrl: r.payload?.applyUrl,
          _relevanceScore: Math.round((r.score ?? 0) * 100) / 100,
        }));

        return JSON.stringify(programs, null, 2);
      }

      // ── Structured Mode ───────────────────────────────────────────────
      const programs = await prisma.program.findMany({
        where: {
          universityId,
          ...(degreeType && { degreeType }),
          ...(department && { department: { contains: department, mode: 'insensitive' } }),
        },
        select: {
          id: true,
          name: true,
          department: true,
          degreeType: true,
          durationMonths: true,
          tuitionPerYear: true,
          applyUrl: true,
        } as any,
      });

      if (programs.length === 0) {
        return '[]';
      }

      return JSON.stringify(programs, null, 2);
    } catch (error) {
      console.error('Error in list_programs tool:', error);
      return 'An error occurred while listing programs.';
    }
  },
});

/**
 * Tool to get detailed information about a specific program.
 */
export const get_program_details = new DynamicStructuredTool({
  name: 'get_program_details',
  description: 'Get full details for a specific program, including tuition, duration, and requirements.',
  schema: z.object({
    programId: z.string().describe('The unique ID of the program.'),
  }),
  func: async ({ programId }: { programId: string }) => {
    try {
      const program = await prisma.program.findUnique({
        where: { id: programId },
        include: {
          university: {
            select: {
              id: true,
              name: true,
              website: true
            }
          }
        }
      });

      if (!program) {
        return 'Program not found.';
      }

      // Supplement with admissions requirements from Qdrant if possible
      let requirements = 'Visit the university website for detailed requirements.';
      try {
        const searchResults = await searchKnowledge(program.universityId, `Admissions requirements for ${program.name}`, 3);
        if (searchResults && searchResults.length > 0) {
          requirements = searchResults.map(r => r.payload?.content).join('\n\n');
        }
      } catch (e) {
        console.warn('Could not fetch additional requirements from Qdrant:', e);
      }

      return JSON.stringify({
        ...program,
        admissionsRequirements: requirements
      }, null, 2);
    } catch (error) {
      console.error('Error in get_program_details tool:', error);
      return 'An error occurred while fetching program details.';
    }
  },
});

/**
 * Tool to get upcoming deadlines for a program or university.
 */
export const get_deadlines = new DynamicStructuredTool({
  name: 'get_deadlines',
  description: 'Get upcoming application deadlines for a specific program.',
  schema: z.object({
    programId: z.string().describe('The unique ID of the program.'),
  }),
  func: async ({ programId }: { programId: string }) => {
    try {
      const deadlines = await prisma.deadline.findMany({
        where: { programId },
        orderBy: { applicationDeadline: 'asc' },
      });

      if (deadlines.length === 0) {
        return 'No deadlines found for this program.';
      }

      return JSON.stringify(deadlines, null, 2);
    } catch (error) {
      console.error('Error in get_deadlines tool:', error);
      return 'An error occurred while fetching deadlines.';
    }
  },
});

export const toolbox = [search_knowledge, list_programs, get_program_details, get_deadlines];
