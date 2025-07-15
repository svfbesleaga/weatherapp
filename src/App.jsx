import React, { useState } from 'react';
import WeatherWidget from './components/WeatherWidget';
import ActivityWidget from './components/ActivityWidget';
import Chatbot from './components/Chatbot';
import './App.css';

function extractWeatherStatusFromWeatherInfo(weatherInfo) {
  if (!weatherInfo || !weatherInfo.desc) return 'default';
  const text = weatherInfo.desc.toLowerCase();
  if (text.includes('rain') || text.includes('shower')) return 'rain';
  if (text.includes('cloud')) return 'cloudy';
  if (text.includes('sun') || text.includes('clear')) return 'sunny';
  if (text.includes('snow')) return 'snow';
  if (text.includes('storm') || text.includes('thunder')) return 'storm';
  return 'default';
}

function getTimeOfDay(weatherInfo) {
  if (!weatherInfo || !weatherInfo.sunrise || !weatherInfo.sunset || typeof weatherInfo.timezone !== 'number') {
    // Fallback to local time if weather data is incomplete
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) return 'day';
    if (hour >= 18 && hour < 21) return 'evening';
    return 'night';
  }
  
  // Get current time in UTC seconds
  const nowUTC = Math.floor(Date.now() / 1000);
  
  // Add timezone offset to get local time in the city
  const localNow = nowUTC + weatherInfo.timezone;
  
  // Check if current local time is between sunrise and sunset
  if (localNow >= weatherInfo.sunrise && localNow <= weatherInfo.sunset) {
    // During daylight hours
    if (localNow >= weatherInfo.sunset - 3600) {
      // Within 1 hour of sunset
      return 'evening';
    }
    if (localNow <= weatherInfo.sunrise + 3600) {
      // Within 1 hour of sunrise
      return 'evening';
    }
    return 'day';
  } else {
    // After sunset or before sunrise
    return 'night';
  }
}

function App() {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [activities, setActivities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isGeneratingActivities, setIsGeneratingActivities] = useState(false);

  // Determine weather status and time of day
  const weatherStatus = extractWeatherStatusFromWeatherInfo(weatherInfo);
  const tod = getTimeOfDay(weatherInfo);

  // Helper to get background image based on weather and time of day
  function getWeatherBgImage(weather, tod) {
    const timeKey = `/ai-bg-${weather}-${tod}.png`;
    const weatherKey = `/ai-bg-${weather}.png`;
    const defaultKey = '/ai-bg-default.png';
    // Check if the image exists in public (skip preloading for now)
    // Try time-of-day image, then fallback to weather, then default
    if (weather && tod && ["day","night","evening"].includes(tod)) {
      if (["sunny","rain","cloudy","snow","storm"].includes(weather)) {
        if (tod !== 'day') {
          // Prefer time-of-day specific if available
          return timeKey;
        }
        return weatherKey;
      }
    }
    return defaultKey;
  }

  const bgImage = getWeatherBgImage(weatherStatus, tod);

  return (
    <div className="homepage-container" style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      minWidth: '100vw',
      width: '100vw',
      height: '100vh',
      transition: 'background 1s',
    }}>
      <WeatherWidget weatherInfo={weatherInfo} timeOfDay={tod} />
      <ActivityWidget activities={activities} isGenerating={isGeneratingActivities} />
      <div style={{ position: 'fixed', right: '2.5rem', bottom: '2.5rem', zIndex: 100 }}>
        <Chatbot
          messages={messages}
          setMessages={setMessages}
          setWeatherInfo={setWeatherInfo}
          setActivities={setActivities}
          setIsGeneratingActivities={setIsGeneratingActivities}
          timeOfDay={tod}
        />
      </div>
    </div>
  );
}

export default App;
