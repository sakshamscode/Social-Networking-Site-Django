import React, { useState } from "react";
import axios from "axios";
import defaultPic from "../assets/user_placeholder.png";
import { useNavigate } from "react-router-dom";


// Convert dd-mm-yyyy → yyyy-mm-dd
const normalizeDateForBackend = (dateStr) => {
  if (!dateStr) return "";
  // accept dd-mm-yyyy or dd/mm/yyyy or yyyy-mm-dd
  if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
    // already yyyy-mm-dd
    return dateStr;
  }
  const sep = dateStr.includes("-") ? "-" : "/";
  const parts = dateStr.split(sep); // e.g. ["24","12","2025"]
  if (parts.length !== 3) return dateStr;
  let [d, m, y] = parts;
  // If they entered yyyy-mm-dd accidentally
  if (d.length === 4) { [y,m,d] = parts; }
  // pad
  d = d.padStart(2, "0");
  m = m.padStart(2, "0");
  return `${y}-${m}-${d}`;
};


export default function Signup() {
  
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    dob: "",
    email: "",
    password: "",
    confirm_password: "",
    profile_pic: null,
  });

  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
  const file = e.target.files[0];
  setForm({ ...form, profile_pic: file });

  // Preview generate
  if (file) {
    setPreview(URL.createObjectURL(file));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Password match validation
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match!");
      return;
    }

    setError("");

    let formData = new FormData();
    formData.append("full_name", form.full_name);
    formData.append("dob", normalizeDateForBackend(form.dob));
    formData.append("email", form.email);
    formData.append("password", form.password);
    if (form.profile_pic) {
    formData.append("profile_pic", form.profile_pic);
  }

    try {
      await axios.post("http://127.0.0.1:8000/api/signup/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Signup Successful!");
      navigate("/");  //redirect to login page immediately
    } catch (error) {
      setError("Signup failed. Check console.");
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      {/* <h2 style={styles.title}>Join Social Network</h2> */}
      <div style={styles.card}>
        <h2 style={styles.title}>Join Social Network</h2>

        {/* Profile Image Upload */}
        <div style={styles.imageWrapper}>
          <img
            src={preview || defaultPic}
            alt="profile"
            style={styles.profileImg}
          />
          <label style={styles.uploadBtn}>
            Upload Profile Pic
            <input type="file" style={{ display: "none" }} onChange={handleFile} />
          </label>
        </div>

        {/* Error Message */}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.labelmain}>Full Name</label>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          
          <label style={styles.labelmain}>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            style={styles.input}
            required
          />
          
          <label style={styles.labelmain}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <div style={styles.passwordRow}>

            <div style={styles.inputBox}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={styles.passwordInput}
              />
            </div>

            <div style={styles.inputBox}>
              <label style={styles.label}>Re-Password</label>
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={form.confirm_password}
                onChange={handleChange}
                style={styles.passwordInput}
              />
           </div>

          </div>
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

const styles = { 
  container: {
    backgroundColor: "#e8eaf6",
    height: "100vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "420px",
    background: "#fff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "bold",
    textAlign: "center",
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "column", 
    alignItems: "center",
    gap: "10px",
  },

  profileImg: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    marginBottom: "10px",
  },

  
  uploadBtn: {
    background: "white",
    color: "#0d6efd",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    border: "1px solid #0d6efd",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #0d6efd",
    fontSize: "14px",
    marginBottom: "12px",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    background: "#0d6efd",
    border: "none",
    color: "white",
    fontSize: "15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  passwordRow: {
    display: "flex",
    gap: "15px",
    width: "100%",
  },

  inputBox: {
   flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: "14px",
    marginBottom: "3px",
    marginLeft: "4px",
    color: "#040607ff",
    fontWeight: 100,
  },

  passwordInput: {
    height: "38px",
    borderRadius: "6px",
    // border: "1px solid #ccc",
    paddingLeft: "10px",
    fontSize: "14px",
    border: "1px solid #0d6efd",
  },
  labelmain:{
    fontSize: "14px",
    marginBottom: "-5px",
    marginLeft: "3px",
    color: "#040607ff",
    fontWeight: 100,
  }

};

