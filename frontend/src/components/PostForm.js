import React, { useState } from "react";
import { createPost } from "../services/apiPosts";

export default function PostForm({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
  if (!content && !image) return alert("Write something or add an image!");

  setLoading(true);
  try {
    const fd = new FormData();
    fd.append("content", content);
    if (image) fd.append("image", image);

    //Create post – this returns only ID
    const res = await createPost(fd);

    //Send complete post to Profile.js
    onPostCreated(res.data);

    setContent("");
    clearImage();

  } catch (err) {
    alert("Failed to post!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>Add Post</h3>

      <textarea
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.text}
      />

      {preview && (
        <div style={{ position: "relative", marginTop: 10 }}>
          <img src={preview} style={styles.preview} alt="" />
          <button style={styles.closeBtn} onClick={clearImage}>×</button>
        </div>
      )}

      <div style={styles.row}>
        <label style={styles.addImg}>
          Add Image
          <input type="file" hidden accept="image/*" onChange={handleImage} />
        </label>

        <button style={styles.postBtn} onClick={handleSubmit}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: 25,
  },
  heading: { margin: 0, marginBottom: 10 },
  text: {
    width: "100%",
    minHeight: 100,
    borderRadius: 10,
    padding: 10,
    border: "1px solid #ccc",
    outline: "none",
    resize: "none",
    boxSizing: "border-box", 
  },
  preview: { width: "100%", borderRadius: 10 },
  closeBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.6)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: 20,
  },
  row: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addImg: {
    border: "1px solid #007bff",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#007bff",
  },
  postBtn: {
    background: "#007bff",
    color: "white",
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
};
