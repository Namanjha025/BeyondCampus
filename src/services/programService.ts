import { PrismaClient, Program } from '@prisma/client';
import { embedPrograms } from '@/lib/qdrant';

const prisma = new PrismaClient();

export class ProgramService {
  /**
   * Fetch all programs for a specific university
   */
  static async getProgramsByUniversity(universityId: string) {
    return await prisma.program.findMany({
      where: { universityId },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Add a new program to a university
   */
  static async createProgram(universityId: string, data: Partial<Program>) {
    return await prisma.program.create({
      data: {
        ...(data as any),
        universityId,
      },
    });
  }

  /**
   * Update an existing program
   */
  static async updateProgram(id: string, data: Partial<Program>) {
    return await prisma.program.update({
      where: { id },
      data: data as any,
    });
  }

  /**
   * Delete a program
   */
  static async deleteProgram(id: string) {
    return await prisma.program.delete({
      where: { id },
    });
  }

  /**
   * Get a single program by ID
   */
  static async getProgramById(id: string) {
    return await prisma.program.findUnique({
      where: { id },
    });
  }

  /**
   * Embed a single program into Qdrant and stamp embeddedAt.
   * Non-fatal: errors are logged but never thrown so CRUD responses are never blocked.
   */
  static async embedSingleProgram(program: Program) {
    try {
      await embedPrograms(program.universityId, [
        {
          id: program.id,
          name: program.name,
          department: program.department ?? null,
          degreeType: program.degreeType,
          durationMonths: program.durationMonths ?? null,
          tuitionPerYear: program.tuitionPerYear ?? null,
          applyUrl: (program as any).applyUrl ?? null,
          universityId: program.universityId,
        },
      ]);

      // Stamp embeddedAt so the UI shows "Vectorized" immediately
      await prisma.program.update({
        where: { id: program.id },
        data: { embeddedAt: new Date() } as any,
      });

      console.log(`[ProgramService] Embedded program: ${program.name} (${program.id})`);
    } catch (err) {
      console.error(`[ProgramService] embedSingleProgram failed for ${program.id} (non-fatal):`, err);
    }
  }
}
