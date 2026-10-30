import { useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = encodeURIComponent(
    import.meta.env.VITE_WEATHER_API_KEY || import.meta.env.WEATHER_API_KEY
  );

  const fetchWeather = async (event) => {
    event.preventDefault();

    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <section>
      <form onSubmit={fetchWeather} style={styles.searchForm}>
        <input
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Enter city name..."
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.searchButton}>
          {loading ? "Loading..." : "Get Weather"}
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
          <h3 style={styles.temperature}>{weather.current.temp_c}°C</h3>
          <p>Humidity: {weather.current.humidity}%</p>
          <p>Wind: {weather.current.wind_kph} km/h</p>
        </div>
      )}
    </section>
  );
}

const styles = {
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
  error: {
    color: "red",
    marginTop: "20px",
  },
  weatherCard: {
    marginTop: "30px",
    padding: "20px",
    borderRadius: "12px",
  },
  temperature: {
    fontSize: "32px",
    margin: "10px",
  },
};

export default Weather;