import React, {useState, useEffect} from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar/SearchBar';
import './App.css';
import WeatherCard from './components/WeatherCard/WeatherCard';
import fetchWeather from './services/fetchWeather';

// This is used for FMI API, but the returned data is not correct
const App = () => {
  const [searchKey, setSearchKey] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [data, setData] = useState([]);
  const [cities, setCities] = useState({total: 0, loaded: 0, data: [] });

  const fetchCities = async () => {
    try{
      const response = await axios.get(`/cities?search_key=${searchKey}&start_index=${startIndex}`);
      let updatedCities;
      if (searchKey) {
        updatedCities = response.data;
      } else {
        updatedCities = {
          total: response.data.total,
          loaded: cities.loaded + response.data.loaded,
          data: [...cities.data, ...response.data.data]
        };
      }

      setCities(updatedCities);
      fetchWeather(setData, updatedCities.data);
    } catch (error){
      console.error('Error fetching weather data:', error);
    }
  }

  const handleLoadMore = async () => {
    setStartIndex(prevIndex => prevIndex + 10);
  };

   const handleSearchInputChange = (value) => {
    setSearchKey(value);
    setStartIndex(0); 
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCities();
  };

  useEffect(() => {fetchCities()}, [searchKey, startIndex]);

  return (
    <div className="weather-container">
      <h1>Weather Forecast</h1>
      <SearchBar searchKey={searchKey} onInputChange={handleSearchInputChange} onSubmit={handleSearchSubmit} />
      <div className="weather-list">
        {data?.length > 0 && data.map((data, index) => (
          <WeatherCard 
            key={index} 
            city={data?.info?.name ? data.info.name : ''} 
            temperature={data?.data?.temperature?.timeValuePairs[0].value} 
            windSpeed={data?.data?.windspeedms?.timeValuePairs[0].value} 
            windDirection={data?.data?.winddirection?.timeValuePairs[0].value} 
            humidity={data?.data?.humidity?.timeValuePairs[0].value} 
            />
        ))}
      </div>
      {cities.total > cities.loaded &&
      <div className="vertical-center">
         <button className="loadmore-button" onClick={handleLoadMore}>Load More</button>
      </div>
      }
    </div>
  );
}


// This is used for OpenWeatherApi which has filter and loadmore functionality
// eslint-disable-next-line no-lone-blocks
{/*
const App = () => {
  const [searchKey, setSearchKey] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [weatherData, setWeatherData] = useState({ total: 0, loaded: 0, data: [] });

  const uniqueCities = data => data.reduce((accumulator, current) => {
    if (!accumulator.find((item) => item.city === current.city)) {
      accumulator.push(current);
    }
    return accumulator.sort((a,b) => a.city.localeCompare(b.city));
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`/weather?search_key=${searchKey}&start_index=${startIndex}`);
      const newData = response.data.data || [];
      let updatedData;

      if (searchKey) {
        updatedData = newData;
      } else {
        updatedData = [...weatherData.data, ...newData];
      }
     
      setWeatherData({
        total: response.data.total,
        loaded: weatherData.loaded + newData.length,
        data: updatedData,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleLoadMore = async () => {
    setStartIndex(prevIndex => prevIndex + 10);
  };

   const handleSearchInputChange = (value) => {
    setSearchKey(value);
    setStartIndex(0); 
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  useEffect(() => {
    fetchWeatherData();
  }, [searchKey, startIndex]);

  return (
    <div className="weather-container">
      <h1>Weather Forecast</h1>
      <SearchBar searchKey={searchKey} onInputChange={handleSearchInputChange} onSubmit={handleSearchSubmit} />
      <div className="weather-list">
        {weatherData?.data.length > 0 && uniqueCities(weatherData.data).map((data, index) => (
          <WeatherCard 
            key={index} 
            city={data.city} 
            temperature={data.temperature} 
            windSpeed={data.wind.speed} 
            windDirection={data.wind.direction} 
            humidity={data.humidity} 
            />
        ))}
      </div>
      {weatherData.total > uniqueCities(weatherData.data).length &&
      <div className="vertical-center">
         <button className="loadmore-button" onClick={handleLoadMore}>Load More</button>
      </div>
      }
    </div>
  );
}
*/}

export default App;
