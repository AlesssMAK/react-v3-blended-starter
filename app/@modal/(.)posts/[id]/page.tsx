import { fetchPostById } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import PostPreviewClient from './PostPreview.client';

interface PostPreviewProps {
  params: Promise<{ id: string }>;
}

export default async function PostPreview({ params }: PostPreviewProps) {
  const queryClient = new QueryClient();

  const { id } = await params;
  const parsedId = Number(id);

  await queryClient.prefetchQuery({
    queryKey: ['post', parsedId],
    queryFn: () => fetchPostById(parsedId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostPreviewClient />
    </HydrationBoundary>
  );
}
