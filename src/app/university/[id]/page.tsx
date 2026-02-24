import UniversityChatInterface from '@/components/UniversityChatInterface'

export default function UniversityChat({ params }: { params: { id: string } }) {
  return <UniversityChatInterface universityId={params.id} />
}