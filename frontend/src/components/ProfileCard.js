import React, { useState, useEffect } from "react";
import defaultPic from "../assets/user_placeholder.png";
import { updateProfile } from "../services/apiPosts";
import { fullImageUrl } from "../utils/imageUrl";

export default function ProfileCard({ profile, onProfileUpdated }) {
  const [editingField, setEditingField] = useState(null);
  const [name, setName] = useState(profile?.full_name || "");
  const [dob, setDob] = useState(profile?.dob || "");
  const [preview, setPreview] = useState(profile?.profile_pic || null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile?.full_name || "");
    setDob(profile?.dob || "");
    setPreview(profile?.profile_pic || null);
    setFile(null);
  }, [profile]);

  // ---------------- Avatar ----------------
  const handleAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setEditingField("avatar");
  };

   //-------------LOG OUT LOGIC--------
    const handleLogout = () => {
     if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      }
    };

     //---------Calculate age---------
  const calculateAge =(dob) =>{
    if(!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let age= today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth()-birthDate.getMonth();

    if(monthDiff<0 || (monthDiff === 0 && today.getDate()<birthDate.getDate())){
      age--;
    }
    return age;
  };

  const age = calculateAge(dob);
 

  const saveAvatar = async () => {
    if (!file) return setEditingField(null);
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("profile_pic", file);
      const res = await updateProfile(fd);
      onProfileUpdated?.(res.data);
      setFile(null);
      setEditingField(null);
    } catch (err) {
      alert("Avatar update failed");
    } finally {
      setSaving(false);
    }
  };

  const cancelAvatar = () => {
    setPreview(profile?.profile_pic || null);
    setFile(null);
    setEditingField(null);
  };

  // ---------------- Name & DOB ----------------
  const startEdit = (field) => {
    if (field === "name") setName(profile?.full_name || "");
    if (field === "dob") setDob(profile?.dob || "");
    setEditingField(field);
  };

  const saveField = async (field) => {
    setSaving(true);
    try {
      const fd = new FormData();
      if (field === "name") fd.append("full_name", name);
      if (field === "dob") fd.append("dob", dob);
      const res = await updateProfile(fd);
      onProfileUpdated?.(res.data);
      setEditingField(null);
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const cancelField = () => {
    setName(profile?.full_name || "");
    setDob(profile?.dob || "");
    setEditingField(null);
  };

  return (
    <div style={styles.card}>
      {/* Avatar Area */}
      <div style={{ position: "relative" }}>
        <img
          src={
            preview?.startsWith("blob:")
              ? preview
              : fullImageUrl(preview || profile?.profile_pic) || defaultPic
          }
          style={styles.avatar}
          alt = "profile"
        />

        {/* Avatar Edit Button */}
        <label htmlFor="avatarInput" style={styles.editAvatarIcon}>
          ✎
        </label>
        <input
          type="file"
          id="avatarInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatar}
        />
      </div>

      {/* Avatar Save Options */}
      {editingField === "avatar" && (
        <div style={styles.row}>
          <button onClick={saveAvatar} disabled={saving} style={styles.saveBtn}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={cancelAvatar} style={styles.cancelBtn}>Cancel</button>
        </div>
      )}

      {/* Name Section */}
      {editingField === "name" ? (
        <div style={styles.row}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <button onClick={() => saveField("name")} style={styles.saveBtn}>
            Save
          </button>
          <button onClick={cancelField} style={styles.cancelBtn}>Cancel</button>
        </div>
      ) : (
        <div style={styles.centerRow}>
          <h2 style={styles.name}>{profile?.full_name}</h2>
          <button onClick={() => startEdit("name")} style={styles.smallEdit}>✎</button>
        </div>
      
      )}

      {/* Email */}
      <p style={styles.email}>{profile?.email}</p>

      {/* DOB Section */}
      {editingField === "dob" ? (
        <div style={styles.row}>
          <input
            type="date"
            value={dob || ""}
            onChange={(e) => setDob(e.target.value)}
            style={styles.input}
          />
          <button onClick={() => saveField("dob")} style={styles.saveBtn}>
            Save
          </button>
          <button onClick={cancelField} style={styles.cancelBtn}>Cancel</button>
        </div>
      ) : (
        <div style={styles.dobSection}>
          <div style={styles.dobBox}>DOB - {profile?.dob}</div>
          <button onClick={() => startEdit("dob")} style={styles.smallEdit}>✎</button>
        </div>
      )}


      <p style={styles.email}>Age: {age}</p>

      
      {/* Share */}
      <button style={styles.share}>Share Profile</button>
      <button
  onClick={handleLogout}
  style={{
    marginTop: "0px",
    padding: "6px 14px",
    fontSize: "13px",
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft : "-5px",
    
  }}
>
  Logout
</button> 


    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: 25,
    borderRadius: 20,
    width: "88%",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
  },
  editAvatarIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    background: "white",
    borderRadius: "50%",
    padding: "5px 7px",
    cursor: "pointer",
    border: "1px solid #ccc",
  },
  centerRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  name: { fontSize: 22, margin: 0, marginLeft:"35px" },
  email: { fontSize: 14, color: "#555", marginTop: -4, },

  dobSection: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: "-10px",
    
  },
  dobBox: {
    background: "#f0f3fa",
    padding: "8px 14px",
    borderRadius: 10,
    fontSize: 14,
    marginLeft :"35px"
  },

  smallEdit: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "#0d6efd",
  },

  share: {
    background: "none",
    color: "#0d6efd",
    border: "none",
    fontSize: 14,
    cursor: "pointer",
    marginTop: "-20px",
    marginLeft:"0px"
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },

  input: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #d0d7e6",
  },

  saveBtn: {
    background: "#0d6efd",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#eee",
    border: "none",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
};
