import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });
      


      // Save token in localStorage
      localStorage.setItem("token", response.data.access);

      alert("Login Successful!");                                              //ye hta diyaa abhii
      navigate("/profile");  // After login redirect
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Social Network Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Login</button>
        </form>

        <p style={styles.linkText}>
          Don’t have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#e8eaf6",
    height: "100vh",
    display: "flex",
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
    fontSize: "23px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    fontSize: "14px",
    color: "#2c3e50",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #0d6efd",
    fontSize: "14px",
    marginBottom: "15px",
  },
  button: {
    background: "#0d6efd",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    marginTop: "5px",
  },
  linkText: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#0d6efd",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px",
    textAlign: "center"
  },
};
