import { PrismaClient, UniversityType } from '@prisma/client';

const prisma = new PrismaClient();

const universities = [
  {
    name: 'MIT',
    city: 'Cambridge',
    state: 'MA',
    type: UniversityType.PRIVATE,
    location: 'Cambridge, MA',
    logo: 'MIT',
    logoColor: 'bg-red-600',
    description:
      'Massachusetts Institute of Technology. Pioneering innovation in technology and engineering since 1861...',
    specialties: ['Engineering', 'Computer Science', 'Physics', 'Mathematics'],
    ranking: 2,
    qsRanking: '#1 QS World Rankings',
    admissionRate: '4.1%',
    studentCount: '11,934 students',
    counselorName: 'MIT Admissions',
    counselorTitle: 'Admissions Office',
    category: 'tech',
    website: 'https://www.mit.edu',
  },
  {
    name: 'Stanford University',
    city: 'Stanford',
    state: 'CA',
    type: UniversityType.PRIVATE,
    location: 'Stanford, CA',
    logo: 'S',
    logoColor: 'bg-red-700',
    description:
      'Stanford University. Where Silicon Valley dreams take shape and innovation thrives...',
    specialties: ['Computer Science', 'Engineering', 'Business', 'Medicine'],
    ranking: 6,
    qsRanking: '#5 QS World Rankings',
    admissionRate: '3.9%',
    studentCount: '17,249 students',
    counselorName: 'Stanford Admissions',
    counselorTitle: 'Admissions Office',
    category: 'tech',
    website: 'https://www.stanford.edu',
  },
  {
    name: 'Harvard University',
    city: 'Cambridge',
    state: 'MA',
    type: UniversityType.PRIVATE,
    location: 'Cambridge, MA',
    logo: 'H',
    logoColor: 'bg-red-800',
    description:
      "Cultivating leaders and scholars in America's oldest university...",
    specialties: ['Liberal Arts', 'Business', 'Law', 'Medicine'],
    ranking: 3,
    qsRanking: '#4 QS World Rankings',
    admissionRate: '3.4%',
    studentCount: '23,000 students',
    counselorName: 'Harvard Admissions',
    counselorTitle: 'Admissions Office',
    category: 'ivy',
    website: 'https://www.harvard.edu',
  },
  {
    name: 'UC Berkeley',
    city: 'Berkeley',
    state: 'CA',
    type: UniversityType.PUBLIC,
    location: 'Berkeley, CA',
    logo: 'B',
    logoColor: 'bg-blue-700',
    description:
      'Leading public research university driving global progress...',
    specialties: ['Research', 'Public Education', 'Engineering'],
    ranking: 15,
    qsRanking: '#10 QS World Rankings',
    admissionRate: '11.4%',
    studentCount: '45,000 students',
    counselorName: 'UC Berkeley Admissions',
    counselorTitle: 'Admissions Office',
    category: 'public',
    website: 'https://www.berkeley.edu',
  },
  {
    name: 'Carnegie Mellon',
    city: 'Pittsburgh',
    state: 'PA',
    type: UniversityType.PRIVATE,
    location: 'Pittsburgh, PA',
    logo: 'CMU',
    logoColor: 'bg-gray-700',
    description:
      'Where computer science meets creativity and robots come to life...',
    specialties: ['Computer Science', 'Robotics', 'Engineering'],
    ranking: 24,
    qsRanking: '#28 QS World Rankings',
    admissionRate: '13.5%',
    studentCount: '15,800 students',
    counselorName: 'CMU Admissions',
    counselorTitle: 'Admissions Office',
    category: 'tech',
    website: 'https://www.cmu.edu',
  },
  {
    name: 'Yale University',
    city: 'New Haven',
    state: 'CT',
    type: UniversityType.PRIVATE,
    location: 'New Haven, CT',
    logo: 'Y',
    logoColor: 'bg-blue-900',
    description:
      'Gothic architecture houses centuries of academic excellence...',
    specialties: ['Law', 'Liberal Arts', 'Arts'],
    ranking: 5,
    qsRanking: '#16 QS World Rankings',
    admissionRate: '4.4%',
    studentCount: '14,500 students',
    counselorName: 'Yale Admissions',
    counselorTitle: 'Admissions Office',
    category: 'ivy',
    website: 'https://www.yale.edu',
  },
  {
    name: 'Princeton University',
    city: 'Princeton',
    state: 'NJ',
    type: UniversityType.PRIVATE,
    location: 'Princeton, NJ',
    logo: 'P',
    logoColor: 'bg-orange-600',
    description:
      'Intimate learning environment fostering intellectual curiosity...',
    specialties: ['Mathematics', 'Sciences', 'Public Policy'],
    ranking: 1,
    qsRanking: '#17 QS World Rankings',
    admissionRate: '5.8%',
    studentCount: '8,400 students',
    counselorName: 'Princeton Admissions',
    counselorTitle: 'Admissions Office',
    category: 'ivy',
    website: 'https://www.princeton.edu',
  },
  {
    name: 'Columbia University',
    city: 'New York',
    state: 'NY',
    type: UniversityType.PRIVATE,
    location: 'New York, NY',
    logo: 'C',
    logoColor: 'bg-blue-600',
    description:
      'Manhattan campus where journalism and world affairs converge...',
    specialties: ['Urban Studies', 'Journalism', 'Law'],
    ranking: 12,
    qsRanking: '#23 QS World Rankings',
    admissionRate: '3.7%',
    studentCount: '33,000 students',
    counselorName: 'Columbia Admissions',
    counselorTitle: 'Admissions Office',
    category: 'ivy',
    website: 'https://www.columbia.edu',
  },
];

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}

async function main() {
  console.log('Seeding universities...');

  for (const uniData of universities) {
    const { admissionRate, studentCount, location, ...rest } = uniData;
    const slug = slugify(uniData.name);

    await (prisma as any).university.upsert({
      where: { name: uniData.name }, // This assumes uniqueness on name for seeding
      update: {
        ...rest,
        slug,
        acceptanceRate: parseFloat(admissionRate.replace('%', '')),
        enrollmentSize: parseInt(studentCount.replace(/[^0-9]/g, '')),
      },
      create: {
        ...rest,
        slug,
        acceptanceRate: parseFloat(admissionRate.replace('%', '')),
        enrollmentSize: parseInt(studentCount.replace(/[^0-9]/g, '')),
      },
    });
    console.log(`- ${uniData.name} (${slug})`);
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
