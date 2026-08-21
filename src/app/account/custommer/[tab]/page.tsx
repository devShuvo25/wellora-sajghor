import { redirect } from 'next/navigation';

export default async function LegacyCustomerTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  redirect(`/dashboard/customer/${tab}`);
}