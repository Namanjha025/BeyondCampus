import PersonChatInterface from '@/components/PersonChatInterfaceNew'

interface PersonChatProps {
  params: Promise<{ id: string }>
}

export default async function PersonChat({ params }: PersonChatProps) {
  const { id } = await params
  return <PersonChatInterface personId={id} />
}