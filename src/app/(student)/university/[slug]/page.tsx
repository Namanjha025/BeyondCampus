import UniversityChatInterface from '@/components/UniversityChatInterface';
import { use } from 'react';

export default function UniversityChat({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <UniversityChatInterface universitySlug={slug} />;
}
