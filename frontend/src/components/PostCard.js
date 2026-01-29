import React, { useState } from "react";
import { toggleLike, deletePost } from "../services/apiPosts";
import { fullImageUrl } from "../utils/imageUrl";



export default function PostCard({ post, onDelete, onLike, currentUser}) {
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    const res = await toggleLike(post.id);

    if (res.data.message === "Post liked") {
      setLikeCount(likeCount + 1);
      setLiked(true);
    } else {
      setLikeCount(likeCount - 1);
      setLiked(false);
    }
  };

  const handleDelete = async () => {
    await deletePost(post.id);
    onDelete(post.id);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <img src={fullImageUrl(post.user.profile_pic)} style={styles.avatar} alt="" />
          <div>
            <strong>{post.user.full_name}</strong>
            <div style={styles.date}>Posted on - {post.created_at 
    ? new Date(post.created_at).toLocaleString()
    : "Just now"}
</div>
          </div>
        </div>
        
        {currentUser?.id === post.user.id &&(
        <button onClick={handleDelete} style={styles.deleteBtn}>×</button>)}         {/* change done for */}
      </div>

      <p>{post.content}</p>

      {post.image && (
        <img src={fullImageUrl(post.image)} style={styles.postImg} alt="" />
      )}

      <button onClick={handleLike} style={liked ? styles.likeActive : styles.likeBtn}>
        👍 {likeCount}
      </button>

    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userInfo: { display: "flex", gap: 10, alignItems: "center" },
  avatar: { width: 45, height: 45, borderRadius: "50%" },
  date: { color: "#777", fontSize: 12 },
  deleteBtn: {
    background: "white",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
  },
  postImg: { width: "100%", borderRadius: 10, marginTop: 10 },
  likeBtn: {
    marginTop: 10,
    background: "white",
    border: "1px solid #007bff",
    padding: "6px 15px",
    borderRadius: 8,
    cursor: "pointer",
  },
  likeActive: {
    marginTop: 10,
    background: "#007bff",
    color: "white",
    border: "1px solid #007bff",
    padding: "6px 15px",
    borderRadius: 8,
    cursor: "pointer",
  },
};
