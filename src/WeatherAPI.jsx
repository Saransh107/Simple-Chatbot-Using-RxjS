import React, { useState, useEffect } from 'react';

const WeatherApi = ({ onCityInput }) => {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = '2c62fc2d299bab4de59a565cb684f76e'; // Replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual API key

  const fetchData = () => {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(apiURL)
      .then((response) => response.json())
      .then((data) => {
        const { name, main, weather, wind } = data;
        setWeatherData({
          name: name,
          temperature: main.temp,
          description: weather[0].description,
          humidity: main.humidity,
          windSpeed: wind.speed,
        });
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setWeatherData(null);
      });
  };

  useEffect(() => {
    if (cityName) {
      fetchData();
    }
  }, [cityName]);

  const handleCityInputChange = (event) => {
    setCityName(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name"
        value={cityName}
        onChange={handleCityInputChange}
      />
      {weatherData && (
        <div>
          <h2>Weather in {weatherData.name}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Description: {weatherData.description}</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Wind Speed: {weatherData.windSpeed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApi;

