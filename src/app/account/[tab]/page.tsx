import { redirect } from 'next/navigation';

export default async function AccountTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  redirect(`/dashboard/distributor/${tab}`);
}