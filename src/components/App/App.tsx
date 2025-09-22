import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import { Post } from "../../types/post";
import PostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isEditPost, setIsEditPost] = useState<boolean>(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [debouncedQuery] = useDebounce(query, 300);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCreatePost(false);
    setIsEditPost(false);
    setEditPost(null);
  };

  const createPost = () => {
    setIsCreatePost(true);
    setIsEditPost(false);
  };

  const disabledCreatePost = () => {
    setIsCreatePost(false);
  };

  const { data, isSuccess } = useQuery({
    queryKey: ["posts", debouncedQuery, page],
    queryFn: () => fetchPosts(debouncedQuery, page),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / 8) : 0;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const startEditPost = (postToEdit: Post) => {
    setEditPost(postToEdit);
    setIsEditPost(true);
    setIsCreatePost(false);
    openModal();
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onChange={onChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <button
          className={css.button}
          onClick={() => {
            openModal();
            createPost();
          }}
        >
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {isCreatePost && (
            <PostForm
              onClose={() => {
                closeModal();
                disabledCreatePost();
              }}
            />
          )}
          {isEditPost && editPost && (
            <EditPostForm
              initialValues={editPost}
              onClose={() => {
                closeModal();
                setEditPost(null);
              }}
            />
          )}
        </Modal>
      )}

      {isSuccess && data?.posts?.length > 0 && (
        <PostList posts={data?.posts} openModal={openModal} toggleEditPost={startEditPost} />
      )}
    </div>
  );
}
