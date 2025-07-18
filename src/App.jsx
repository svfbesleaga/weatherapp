import React, { useState, useEffect } from 'react';
import WeatherWidget from './components/WeatherWidget';
import ActivityWidget from './components/ActivityWidget';
import FunFact from './components/FunFact';
import Chatbot from './components/Chatbot';
import './App.css';

// Preload all background images to prevent blank screen transitions
function preloadBackgroundImages() {
  const imageFiles = [
    '/ai-bg-default.png',
    '/ai-bg-sunny.png',
    '/ai-bg-sunny-day.png',
    '/ai-bg-sunny-night.png',
    '/ai-bg-rain.png',
    '/ai-bg-rain-day.png',
    '/ai-bg-rain-night.png',
    '/ai-bg-cloudy.png',
    '/ai-bg-cloudy-day.png',
    '/ai-bg-cloudy-night.png',
    '/ai-bg-snow.png',
    '/ai-bg-snow-day.png',
    '/ai-bg-snow-evening.png',
    '/ai-bg-storm.png',
    '/ai-bg-storm-day.png'
  ];

  imageFiles.forEach(imagePath => {
    const img = new Image();
    img.src = imagePath;
    // Preload silently - only log errors in development
    if (import.meta.env.DEV) {
      img.onload = () => console.log(`✅ Preloaded: ${imagePath}`);
      img.onerror = () => console.warn(`❌ Failed to preload: ${imagePath}`);
    }
  });
}

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
  const [funFacts, setFunFacts] = useState(['banana', 'apple']); // Default fun facts
  const [messages, setMessages] = useState([]);
  const [isGeneratingActivities, setIsGeneratingActivities] = useState(false);
  const [isGeneratingFunFacts, setIsGeneratingFunFacts] = useState(false);
  const [showActivityWidget, setShowActivityWidget] = useState(true);
  const [showFunFactWidget, setShowFunFactWidget] = useState(false);

  // Preload background images on component mount
  useEffect(() => {
    preloadBackgroundImages();
  }, []);

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
    }}>
      <WeatherWidget weatherInfo={weatherInfo} timeOfDay={tod} />
      {showFunFactWidget && (
        <FunFact 
          funFacts={funFacts} 
          isGenerating={isGeneratingFunFacts}
          weatherInfo={weatherInfo}
          onClose={() => setShowFunFactWidget(false)}
        />
      )}
      {showActivityWidget && (
        <ActivityWidget 
          activities={activities} 
          isGenerating={isGeneratingActivities}
          onClose={() => setShowActivityWidget(false)}
        />
      )}
      <div className="chatbot-wrapper">
        <Chatbot
          messages={messages}
          setMessages={setMessages}
          setWeatherInfo={setWeatherInfo}
          setActivities={setActivities}
          setFunFacts={setFunFacts}
          setIsGeneratingActivities={setIsGeneratingActivities}
          setIsGeneratingFunFacts={setIsGeneratingFunFacts}
          resetActivityWidget={() => setShowActivityWidget(true)}
          resetFunFactWidget={() => {
            // Show FunFact widget with 3 second delay after ActivityWidget
            setTimeout(() => setShowFunFactWidget(true), 1000);
          }}
          timeOfDay={tod}
        />
      </div>
    </div>
  );
}

export default App;
