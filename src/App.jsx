import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./Auth";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);

  const apiKey = encodeURIComponent(import.meta.env.VITE_WEATHER_API_KEY || import.meta.env.WEATHER_API_KEY);

  // Check whether the user is logged in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch weather for the entered city.
  const fetchWeather = async (e) => {
    e?.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError("Please enter a city name.");
      return;
    }

    setWeatherLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(trimmedCity)}&aqi=no`
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(
          data.error?.message === "No matching location found."
            ? "City not found."
            : data.error?.message || "Unable to fetch weather."
        );
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch {
      setError("Error fetching weather data. Check your internet connection.");
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

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
              await signOut(auth);
            } catch {
              setError("Unable to log out. Please try again.");
            }
          }}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </header>

      <form onSubmit={fetchWeather} style={styles.searchForm}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          style={styles.input}
        />

        <button
          type="submit"
          disabled={weatherLoading}
          style={styles.searchButton}
        >
          {weatherLoading ? "Loading..." : "Get Weather"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {weather && (
        <div style={styles.weatherCard}>
          <h2>
            {weather.location.name}, {weather.location.country}
          </h2>

          <img
            src={`https:${weather.current.condition.icon}`}
            alt={weather.current.condition.text}
          />

          <p>{weather.current.condition.text}</p>

          <h3 style={styles.temperature}>
            {weather.current.temp_c}°C
          </h3>

          <p>Humidity: {weather.current.humidity}%</p>
          <p>Wind: {weather.current.wind_kph} km/h</p>
        </div>
      )}
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
  searchForm: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  searchButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
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
  weatherCard: {
    marginTop: "30px",
    padding: "20px",
    borderRadius: "12px",
    background: "#f0f4f8",
  },
  temperature: {
    fontSize: "32px",
    margin: "10px",
  },
};

export default App;