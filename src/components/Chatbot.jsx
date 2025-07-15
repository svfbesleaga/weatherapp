import React, { useRef, useEffect, useState } from 'react';
import styles from './Chatbot.module.css';

const OPENAI_API_URL = import.meta.env.VITE_OPENAI_API_URL;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL;

function extractCity(text) {
  // Simple regex for demo: look for 'in <city>' or 'at <city>'
  const match = text.match(/(?:in|at) ([A-Za-z\s]+)/i);
  if (match) return match[1].trim();
  return null;
}

async function fetchWeather(city) {
  const url = `${WEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather not found');
  const data = await res.json();
  return {
    city: data.name,
    temp: data.main.temp,
    desc: data.weather[0].description,
    icon: data.weather[0].icon,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
    sunrise: data.sys.sunrise, // unix UTC
    sunset: data.sys.sunset,   // unix UTC
    timezone: data.timezone,   // seconds offset from UTC
  };
}

function Chatbot({ messages, setMessages, setWeatherInfo, setActivities, setIsGeneratingActivities, timeOfDay }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(true); // Start minimized
  const [error, setError] = useState('');
  const [firstOpen, setFirstOpen] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Only allow city names (letters and spaces)
  const isValidCity = (text) => /^[A-Za-z\s]+$/.test(text.trim());

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!isValidCity(input)) {
      // Only show error as chat message, not as UI error
      setInput('');
      return;
    }
    setInput('');
    setLoading(true);
    
    // Clear old activities first
    if (setActivities) {
      setActivities([]);
    }
    
    let weatherInfo = null;
    let city = input.trim();
    try {
      weatherInfo = await fetchWeather(city);
      if (!weatherInfo || !weatherInfo.city) {
        setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: 'City not found. Please enter a valid city name.' }]);
        setInput('');
        setLoading(false);
        return;
      }
      setWeatherInfo(weatherInfo);
      setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: `Weather in ${weatherInfo.city}: ${weatherInfo.temp}°C, ${weatherInfo.desc}.` }]);
      
      // Start generating activities (show loading state)
      if (setIsGeneratingActivities) {
        setIsGeneratingActivities(true);
      }
      
    } catch (e) {
      setWeatherInfo(null);
      setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: 'City not found. Please enter a valid city name.' }]);
      setInput('');
      setLoading(false);
      return;
    }
    // Compose system prompt
    let systemPrompt = `You are a helpful assistant named FlorAI. You are only allowed to answer questions about the weather, and suggest activities based on the weather. You are not allowed to answer questions about anything else.`;
    if (weatherInfo) {
      systemPrompt += `\nThe current weather in ${weatherInfo.city} is ${weatherInfo.temp}°C, ${weatherInfo.desc}.`;
      if (timeOfDay) {
        systemPrompt += `\nIt is currently ${timeOfDay.toUpperCase()} in ${weatherInfo.city}.`;
      }
      systemPrompt += `\nBased on these conditions, suggest some suitable activities for the user. Be specific and creative, and explain why each activity fits the weather and time of day. If it is NIGHT, avoid suggesting activities that are not possible or safe at night (such as visiting parks or outdoor attractions that may be closed). Consider the user's location (${weatherInfo.city}), the weather, and the time of day (${timeOfDay.toUpperCase()}), and suggest activities that are relevant or unique to that city or region, not just generic weather-based suggestions. Output the activities as a numbered list, each on a new line.`;
    }
    // Call GPT with 5s longer timeout
    try {
      const fetchWithTimeout = (url, options, timeoutMs) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeoutMs))
        ]);
      };
      const response = await fetchWithTimeout(
        OPENAI_API_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.filter(m => m.sender === 'user' || m.sender === 'bot').map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
              })),
              { role: 'user', content: input }
            ]
          })
        },
        35000 // 35 seconds (default + 5s extra)
      );
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No response.';
      setMessages(msgs => [
        ...msgs,
        { sender: 'bot', text: "Suggesting some activities for you to do .. " }
      ]);
      // Extract activities from reply
      if (setActivities && weatherInfo) {
        const acts = (reply.match(/\d+\.\s+(.+?)(?=\n\d+\.|$)/gs) || []).map(s => s.replace(/^\d+\.\s+/, '').trim());
        
        // If no activities were extracted or list is empty, generate defaults
        if (!acts || acts.length === 0) {
          const weather = weatherInfo.desc.toLowerCase();
          const temp = weatherInfo.temp;
          const city = weatherInfo.city;
          const isNight = timeOfDay === 'night';
          const isEvening = timeOfDay === 'evening';
          const isCold = temp < 10;
          const isWarm = temp > 25;
          
          let defaultActivities = [];
          
          if (weather.includes('rain') || weather.includes('shower')) {
            if (isNight || isEvening) {
              defaultActivities = [
                `Enjoy a cozy evening at a warm café in ${city} with a hot drink`,
                `Visit an indoor cinema to watch a movie`,
                `Explore a local bookstore and browse for interesting reads`,
                `Try a traditional restaurant for a hearty dinner`,
                `Visit a museum or art gallery if open in the evening`
              ];
            } else {
              defaultActivities = [
                `Visit an indoor museum or cultural center in ${city}`,
                `Explore covered markets and local shops`,
                `Enjoy coffee and pastries at a cozy café`,
                `Visit a library or indoor cultural space`,
                `Try indoor activities like bowling or arcade games`
              ];
            }
          } else if (weather.includes('snow')) {
            if (isNight || isEvening) {
              defaultActivities = [
                `Take evening photos of snow-covered landmarks in ${city}`,
                `Warm up at a traditional pub or tavern`,
                `Enjoy hot chocolate at a cozy winter café`,
                `Visit heated indoor attractions or venues`,
                `Take a romantic evening walk through snowy streets`
              ];
            } else {
              defaultActivities = [
                `Build a snowman in a local park in ${city}`,
                `Take scenic photos of the winter landscape`,
                `Try winter sports if facilities are available nearby`,
                `Visit warm indoor attractions like museums`,
                `Enjoy hot drinks at mountain lodges or cafés`
              ];
            }
          } else if (weather.includes('sun') || weather.includes('clear')) {
            if (isNight || isEvening) {
              defaultActivities = [
                `Take an evening stroll through ${city}'s illuminated streets`,
                `Enjoy outdoor dining at a restaurant terrace`,
                `Visit rooftop bars or outdoor venues for night views`,
                `Explore night markets or evening festivals`,
                `Take sunset/evening photos at scenic viewpoints`
              ];
            } else {
              defaultActivities = [
                `Take a walking tour of ${city}'s main attractions`,
                `Visit outdoor parks and gardens`,
                `Explore local markets and street vendors`,
                `Have a picnic in a scenic location`,
                `Take photos at famous landmarks and viewpoints`
              ];
            }
          } else if (weather.includes('cloud')) {
            if (isNight || isEvening) {
              defaultActivities = [
                `Explore ${city}'s nightlife and entertainment districts`,
                `Visit local pubs or bars for drinks and socializing`,
                `Take an evening city tour to see illuminated buildings`,
                `Enjoy dinner at a restaurant with local cuisine`,
                `Visit cultural venues or attend evening events`
              ];
            } else {
              defaultActivities = [
                `Explore the historic center of ${city}`,
                `Visit local museums and cultural sites`,
                `Walk through parks and public spaces`,
                `Browse local shops and markets`,
                `Try local cafés and taste regional specialties`
              ];
            }
          } else {
            // Generic fallback for any weather
            if (isNight || isEvening) {
              defaultActivities = [
                `Discover ${city}'s evening dining scene`,
                `Take a nighttime walk through the city center`,
                `Visit local bars or entertainment venues`,
                `Explore illuminated landmarks and buildings`,
                `Enjoy live music or cultural performances`
              ];
            } else {
              defaultActivities = [
                `Explore the main attractions of ${city}`,
                `Visit local museums and cultural sites`,
                `Try regional food at recommended restaurants`,
                `Walk through the city's historic areas`,
                `Browse local shops and markets`
              ];
            }
          }
          
          setActivities(defaultActivities);
        } else {
          setActivities(acts);
        }
        
        // Stop generating activities loading state
        if (setIsGeneratingActivities) {
          setIsGeneratingActivities(false);
        }
      }
    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { sender: 'bot', text: 'Error: Could not reach OpenAI.' }
      ]);
      
      // Stop generating activities loading state on error
      if (setIsGeneratingActivities) {
        setIsGeneratingActivities(false);
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (error && isValidCity(e.target.value)) setError('');
  };

  if (minimized) {
    return (
      <button
        className={styles.floatingChatBtn}
        onClick={() => { setMinimized(false); setFirstOpen(false); }}
        aria-label="Open chat"
      >
        <div className={styles.chatDots}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    );
  }

  return (
    <div className={styles.chatbotContainer}>
      <button
        className={styles.minimizeBtn}
        onClick={() => setMinimized(true)}
        aria-label="Minimize chat"
        style={{ position: 'absolute', top: 8, right: 8, zIndex: 101 }}
      >
        –
      </button>
      <div className={styles.messagesArea}>
        {firstOpen && (
          <div className={styles.botMsg} style={{ marginBottom: 8 }}>
            Please provide a city name
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.sender === 'user' ? styles.userMsg : styles.botMsg
            }
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className={styles.botMsg}>...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter city name..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot; 