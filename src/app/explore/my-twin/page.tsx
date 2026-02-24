import { redirect } from 'next/navigation'

// For now, redirect to the networking my-twin page to maintain existing functionality
export default function MyTwin() {
  redirect('/networking/my-twin')
}