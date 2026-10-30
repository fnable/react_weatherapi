import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./Auth";
import Weather from "./Weather";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [logoutError, setLogoutError] = useState("");

  // Check whether the user is logged in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Wait until Firebase checks the saved login session.
  if (authLoading) {
    return <p style={{ textAlign: "center" }}>Checking login...</p>;
  }

  // Show login/register when the user is signed out.
  if (!user) {
    return <Auth />;
  }

  // Show the weather app when the user is signed in.
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>🌤️ Weather App</h1>
          <p>Logged in as {user.email}</p>
        </div>

        <button
          onClick={async () => {
            try {
              setLogoutError("");
              await signOut(auth);
            } catch {
              setLogoutError("Unable to log out. Please try again.");
            }
          }}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </header>

      {logoutError && <p style={styles.error}>{logoutError}</p>}
      <Weather />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "650px",
    margin: "50px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },
  logoutButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "20px",
  },
};

export default App;