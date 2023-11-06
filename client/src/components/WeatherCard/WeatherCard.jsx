import React from "react";
import { FaWind, FaWater } from "react-icons/fa";
import "./WeatherCard.css";

const WeatherCard = ({
  city,
  temperature,
  windSpeed,
  windDirection,
  humidity,
}) => {
  const getDirection = (angle) => {
    const directions = [
      "↑ N",
      "↗ NE",
      "→ E",
      "↘ SE",
      "↓ S",
      "↙ SW",
      "← W",
      "↖ NW",
    ];
    return directions[Math.round(angle / 45) % 8];
  };

  const formatNullValue = (value) => (isNaN(value) ? "0" : value);

  return (
    <div className="weather-card">
      <div className="header">
        <p className="city">{city}</p>
        <div className="separator" />
      </div>

      <div className="content">
        <p className="temperature">
          {formatNullValue(temperature)}
          <span className="temperature-unit">°C</span>
        </p>
        <div className="right-side">
          <div className="info">
            <FaWind className="icon" />
            {formatNullValue(windSpeed)}
            <span className="unit">m/s</span>
            <p> {getDirection(windDirection)}</p>
          </div>
          <div className="info">
            <FaWater className="icon" />
            {formatNullValue(humidity)}
            <span className="unit">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
