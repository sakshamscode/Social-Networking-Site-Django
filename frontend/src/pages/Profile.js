import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import { fetchProfile } from "../services/apiPosts";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { fetchPosts } from "../services/apiPosts";



export default function Profile() {
  
  
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    fetchProfile().then((res) => setProfile(res.data));
  }, []);

  const updateLocalProfile = async () => {
  try {
    const res = await fetchProfile();
    setProfile(res.data);
  } catch (err) {
    console.log("Fresh profile fetch error", err);
  }
};
const [posts, setPosts] = useState([]);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;
  loadProfile();
  loadPosts();
}, []);


const loadProfile = async () => {
    try {
        const res = await fetchProfile();
        setProfile(res.data);
    } catch (err) {
        console.log("Profile load error:", err);
    }
};
const loadPosts = async () => {
  const res = await fetchPosts();
  setPosts(res.data);
};


const handleNewPost = (p) => {
  setPosts([p, ...posts]);   // real-time add
};

const handleDeletePost = (id) => {
  setPosts(posts.filter((x) => x.id !== id));
};


  return (
    <div style={styles.page}>
      {/* Left Side */}
      <div style={styles.leftColumn}>
        {profile && (
          <ProfileCard profile={profile} onProfileUpdated={updateLocalProfile} />
        )}
      </div>

      {/* Right side*/}
      <div style={styles.rightColumn}>
        <PostForm onPostCreated={handleNewPost} />

  {posts.map((p) => (
    <PostCard 
        key={p.id}
        post={p}
        currentUser={profile}
        onDelete={handleDeletePost}
    />
))}

      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    padding: 40,
    background: "#e7e9f3",
    minHeight: "100vh",
    gap: 30,
  },
  leftColumn: {
    width: 320,
  },
  rightColumn: {
    flex: 1,
  },
};
