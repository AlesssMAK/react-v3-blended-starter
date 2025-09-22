import axios from "axios";
import { Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

interface fetchPostsRequest {
  posts: Post[];
  totalCount: number;
}

interface NewPost {
  title: string;
  body: string;
}

interface EditPost {
  id: number;
  title: string;
  body: string;
}

export const fetchPosts = async (searchText: string, page: number): Promise<fetchPostsRequest> => {
  const params = {
    q: searchText,
    _page: page,
    _limit: 8,
  };

  const res = await axios.get<Post[]>("/posts", { params });
  console.log(res);

  const totalCount = Number(res.headers["x-total-count"]);

  return { posts: res.data, totalCount };
};

export const createPost = async (newPost: NewPost) => {
  const { data } = await axios.post<Post>("/posts", newPost);
  return data;
};

export const editPost = async (newDataPost: EditPost) => {
  const { data } = await axios.patch<Post>(`/posts/${newDataPost.id}`, newDataPost);
  return data;
};

export const deletePost = async (postId: number) => {
  const { data } = await axios.delete<Post>(`/posts/${postId}`);
  return data;
};
