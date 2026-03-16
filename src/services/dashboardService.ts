import { prisma } from '@/lib/database';

export class DashboardService {
  /**
   * Aggregate system-wide statistics for the admin dashboard
   */
  static async getSystemStats() {
    const [
      totalUniversities,
      totalPrograms,
      totalStudents,
      totalApplications,
      recentApplications,
      recentUniversities,
    ] = await Promise.all([
      prisma.university.count(),
      prisma.program.count(),
      prisma.user.count({ where: { role: 'STUDENT' } } as any),
      prisma.application.count(),
      prisma.application.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
          program: {
            select: { name: true, university: { select: { name: true } } },
          },
        },
      }),
      prisma.university.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          logo: true,
          logoColor: true,
          createdAt: true,
        } as any,
      }),
    ]);

    return {
      counts: {
        universities: totalUniversities,
        programs: totalPrograms,
        students: totalStudents,
        applications: totalApplications,
      },
      recentApplications,
      recentUniversities,
    };
  }
}
