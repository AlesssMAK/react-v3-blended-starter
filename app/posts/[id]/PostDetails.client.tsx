'use client';

import { useParams, useRouter } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';

import { fetchPostById, fetchUserById } from '@/lib/api';

import css from './PostDetails.module.css';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export default function PostDetailsClient() {
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
    <>
      {post && (
        <main className={css.main}>
          <div className={css.container}>
            <div className={css.item}>
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
                {user && <p className={css.user}>Author: {user?.name}</p>}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
