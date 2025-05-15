import { useEffect, useRef, useState } from "react";
import { IoIosSearch, IoIosCloseCircle } from "react-icons/io";
import clear_icon from "./assets/clear.png";
import cloud_icon from "./assets/cloud.png";
import drizzle_icon from "./assets/drizzle.png";
import rain_icon from "./assets/rain.png";
import snow_icon from "./assets/snow.png";
import wind_icon from "./assets/wind.png";
import humidity_icon from "./assets/humidity.png";

function App() {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
  if (!city || city.trim() === "") {
    alert("Please Enter City Name!");
    return;
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
      import.meta.env.VITE_APP_ID
    }`;
    console.log("Fetching URL:", url); // Debug log
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data.message); // Log error message
      setWeatherData(false);
      return;
    }

    const icons = allIcons[data.weather[0].icon] || clear_icon;
    setWeatherData({
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      temprature: Math.floor(data.main.temp),
      location: data.name,
      icon: icons,
    });
  } catch (error) {
    console.error("Fetch Error:", error.message); // Log fetch errors
    setWeatherData(false);
  }
};

  useEffect(() => {
    search("Islamabad");
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search(inputRef.current.value);
    }
  };

  const handleClearInput = () => {
    inputRef.current.value = "";
    inputRef.current.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800/90 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] rounded-xl p-6 w-full max-w-sm transition-all duration-300">
        <div className="relative flex items-center gap-2 mb-5">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search City..."
            className="py-2 px-4 w-full rounded-full bg-gray-700/50 border border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300 focus:outline-none transition-all duration-300 text-cyan-200 placeholder-cyan-400/50"
            onKeyDown={handleKeyPress}
            aria-label="Search city"
          />
          {inputRef.current?.value && (
            <button
              className="absolute right-12 text-cyan-400 hover:text-cyan-300 pr-4 transition-colors duration-200"
              onClick={handleClearInput}
              aria-label="Clear input"
            >
              <IoIosCloseCircle className="text-lg" />
            </button>
          )}
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 px-3 py-2 rounded-full transition-all duration-300"
            onClick={() => search(inputRef.current.value)}
            aria-label="Search"
          >
            <IoIosSearch className="text-lg" />
          </button>
        </div>

        {weatherData ? (
          <div className="animate-weatherIn">
            <div className="py-3">
              <img
                src={weatherData.icon}
                alt="Weather icon"
                className="w-32 mx-auto mb-3 transform transition-transform duration-500 hover:scale-110"
              />
              <h1 className="text-5xl font-extrabold text-center text-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {weatherData.temprature}°C
              </h1>
              <p className="text-xl font-medium text-center text-cyan-200/80 mt-1">
                {weatherData.location}
              </p>
            </div>

            <div className="flex justify-between items-center text-cyan-200 mt-6">
              <div className="flex flex-col items-center">
                <img
                  src={humidity_icon}
                  alt="Humidity icon"
                  className="w-6 mb-1"
                />
                <p className="text-base font-semibold">{weatherData.humidity}%</p>
                <span className="text-xs text-cyan-400/70">Humidity</span>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={wind_icon}
                  alt="Wind icon"
                  className="w-6 mb-1"
                />
                <p className="text-base font-semibold">
                  {weatherData.windSpeed} km/h
                </p>
                <span className="text-xs text-cyan-400/70">Wind Speed</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-cyan-300 text-base font-medium animate-weatherIn">
            City not found! Try again.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;