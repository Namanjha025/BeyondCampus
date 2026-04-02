import { PrismaClient } from '@prisma/client';
import { embedPrograms, qdrantClient, PROGRAMS_COLLECTION } from '../../src/lib/qdrant';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Program Vector Migration...');

  // 1. Fetch all programs from DB
  const allPrograms = await prisma.program.findMany({
    select: {
      id: true,
      name: true,
      department: true,
      degreeType: true,
      durationMonths: true,
      tuitionPerYear: true,
      applyUrl: true,
      universityId: true,
    },
  });

  if (allPrograms.length === 0) {
    console.log('Ø No programs found in database. Migration skipped.');
    return;
  }

  console.log(`📦 Found ${allPrograms.length} programs to migrate.`);

  // 2. Clear the shared programs collection if it exists to ensure a clean start
  try {
    const exists = await qdrantClient.collectionExists(PROGRAMS_COLLECTION);
    if (exists.exists) {
      console.log(`🗑️  Clearing existing '${PROGRAMS_COLLECTION}' collection...`);
      await qdrantClient.deleteCollection(PROGRAMS_COLLECTION);
    }
  } catch (err) {
    console.warn('⚠️  Could not clear collection (it might not exist):', err);
  }

  // 3. Group by university and embed (though embedPrograms handles a list, 
  // keeping the universityId grouping is cleaner for the existing function)
  const groupedByUni: Record<string, typeof allPrograms> = {};
  for (const p of allPrograms) {
    if (!groupedByUni[p.universityId]) {
      groupedByUni[p.universityId] = [];
    }
    groupedByUni[p.universityId].push(p);
  }

  const universityIds = Object.keys(groupedByUni);
  console.log(`🏢 Migrating programs for ${universityIds.length} universities...`);

  for (const uniId of universityIds) {
    const programs = groupedByUni[uniId];
    console.log(`   - ${uniId}: Embedding ${programs.length} programs...`);
    
    await embedPrograms(uniId, programs as any);

    // Update embeddedAt in DB
    await prisma.program.updateMany({
      where: { id: { in: programs.map(p => p.id) } },
      data: { embeddedAt: new Date() } as any,
    });
  }

  console.log('✅ Migration completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
