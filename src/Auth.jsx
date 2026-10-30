import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const messages = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Please enter a valid email.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Check your connection.",
      };

      setError(messages[err.code] || `Authentication failed: ${err.code}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.h1}>{isRegistering ? "Create Account" : "Welcome Back"}</h1>

        <p>
          {isRegistering
            ? "Register to access your weather app."
            : "Log in to check the weather."}
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isRegistering ? "new-password" : "current-password"}
          minLength={6}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading
            ? "Please wait..."
            : isRegistering
              ? "Register"
              : "Login"}
        </button>

        <p>
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
            style={styles.link}
          >
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100vw",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#f0f4f8",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minWidth: "30vw",
    padding: "30px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
    maxWidth: "85%",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    maxWidth: "90%",
  },
  link: {
    border: "none",
    background: "none",
    color: "#2563eb",
    cursor: "pointer",
    textDecoration: "underline",
  },
  error: {
    color: "red",
    overflowWrap: "anywhere",
  },
  h1: {
    margin: "0",
    color: "#111827",
    center: "textAlign",
  },
};

export default Auth;