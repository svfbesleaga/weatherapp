import React from 'react';
import './WeatherWidget.css';
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiDaySunnyOvercast } from 'react-icons/wi';

function getWeatherIcon(icon, desc) {
  // OpenWeatherMap icon codes: https://openweathermap.org/weather-conditions
  if (!icon && !desc) return <WiDaySunnyOvercast size={90} />;
  if (icon && icon.startsWith('01')) return <WiDaySunny size={90} />;
  if (icon && icon.startsWith('02')) return <WiCloudy size={90} />;
  if (icon && icon.startsWith('03')) return <WiCloudy size={90} />;
  if (icon && icon.startsWith('04')) return <WiCloudy size={90} />;
  if (icon && icon.startsWith('09')) return <WiRain size={90} />;
  if (icon && icon.startsWith('10')) return <WiRain size={90} />;
  if (icon && icon.startsWith('11')) return <WiThunderstorm size={90} />;
  if (icon && icon.startsWith('13')) return <WiSnow size={90} />;
  if (icon && icon.startsWith('50')) return <WiCloudy size={90} />;
  // Fallback by description
  if (desc) {
    const d = desc.toLowerCase();
    if (d.includes('rain')) return <WiRain size={90} />;
    if (d.includes('storm') || d.includes('thunder')) return <WiThunderstorm size={90} />;
    if (d.includes('snow')) return <WiSnow size={90} />;
    if (d.includes('cloud')) return <WiCloudy size={90} />;
    if (d.includes('sun') || d.includes('clear')) return <WiDaySunny size={90} />;
  }
  return <WiDaySunnyOvercast size={90} />;
}

function getTimeOfDayIcon(timeOfDay) {
  if (timeOfDay === 'night') return '🌙';
  if (timeOfDay === 'evening') return '🌇';
  return '☀️';
}

export default function WeatherWidget({ weatherInfo, timeOfDay }) {
  if (!weatherInfo) return null;
  const weatherIcon = getWeatherIcon(weatherInfo.icon, weatherInfo.desc);
  return (
    <div className="weather-widget">
      <div className="widget-header">
        <span className="widget-location">{weatherInfo.city}</span>
        <div className="widget-icon">
          {weatherIcon}
        </div>
      </div>
      <div className="widget-main">
        <span className="widget-temp">{Math.round(weatherInfo.temp)}°C</span>
        <div className="widget-details">
          <div><span>Pressure:</span> <b>{weatherInfo.pressure} hPa</b></div>
          <div><span>Humidity:</span> <b>{weatherInfo.humidity}%</b></div>
          <div><span>Condition:</span> <b style={{textTransform:'capitalize'}}>{weatherInfo.desc}</b></div>
          <div className="widget-tod"><span>Time:</span> <b>{getTimeOfDayIcon(timeOfDay)} {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</b></div>
        </div>
      </div>
    </div>
  );
} 