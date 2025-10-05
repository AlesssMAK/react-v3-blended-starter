'use client';

// import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
// import { fetchPostById, fetchUserById } from '@/lib/api';
// import { useParams, useRouter } from 'next/navigation';

import css from './PostPreview.module.css';
import { useEffect, useState } from 'react';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { User } from '@/types/user';

export default function PostPreviewClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  const parsedId = Number(id);

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', parsedId],
    queryFn: () => fetchPostById(parsedId),
    refetchOnMount: false,
  });

  const handleClickBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!post) return;
    const fn = async () => {
      const response = await fetchUserById(post.userId);
      setUser(response);
    };
    fn();
  }, [post]);

  if (isLoading) return <p>Loding...</p>;
  if (error || !post) return <p>Opss...</p>;

  return (
    <Modal onClose={handleClickBack}>
      <button className={css.backBtn} onClick={handleClickBack}>
        ← Back
      </button>
      <div className={css.post}>
        <div className={css.wrapper}>
          <div className={css.header}>
            <h2>{post.title}</h2>
          </div>

          <p className={css.content}>{post.body}</p>
        </div>
        <p className={css.user}>{user?.name}</p>
      </div>
    </Modal>
  );
}
