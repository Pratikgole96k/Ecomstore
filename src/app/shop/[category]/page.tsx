import { redirect } from 'next/navigation';

export default function CategoryRedirectPage({
  params,
}: {
  params: { category: string };
}) {
  redirect(`/shop?category=${params.category}`);
}
