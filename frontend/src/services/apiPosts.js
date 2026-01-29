
import API from "../utils/api";


export const fetchProfile = () => API.get("/api/profile/");
export const updateProfile = (formData) => API.patch("/api/profile/", formData);

export const fetchPosts = () => API.get("/api/posts/");
export const createPost = (formData) => API.post("/api/posts/", formData);

export const toggleLike = (postId) => API.post(`/api/posts/${postId}/like/`);

export const deletePost = (postId) => API.delete(`/api/posts/${postId}/delete/`);

export const fetchPostById = (id) => API.get(`/posts/${id}/`);