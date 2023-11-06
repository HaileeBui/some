import express from 'express';
import cors from 'cors';
import cacheHeaders from 'express-cache-headers';
import axios from 'axios';
import fi from './fi.json' assert { type: "json" }; 

const app = express();
app.use(cors());
app.use(cacheHeaders());

app.use(express.static('public'));
const PORT = 8000;
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const regex = /[åäö]/i;
const citiesData = fi.map(city => city.city).sort().filter(str => !regex.test(str))
const citiesDataOpenWeather = [
  'Alastaro', 'Alavieska',
  'Alavus', 'Asikkala',
  'Askola', 'Aura',
  'Beijing', 'London', 'Oslo', 'Helsinki', 'Turku'
]
// This endpoint is used for OpenWeather API requests
app.get('/weather', async (req, res) => {
  const searchKey = req.query.search_key || ''; // Get the search key from the query parameter
  const startIndex = parseInt(req.query.start_index) || 0; // Get the start index from the query parameter, default is 0
  const citiesPerPage = 10; // Number of cities to load per page

  const searchedCities = citiesDataOpenWeather
    .filter(city => city.toLowerCase().includes(searchKey.toLowerCase()));
  // Filter cities based on the search key
  const filteredCities = searchedCities.slice(startIndex, startIndex + citiesPerPage);

  // Fetch weather data for filtered cities from OpenWeatherMap API
  const weatherDataPromises = filteredCities.map(city =>
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=<API_KEY>&units=metric`)
      .then(response => {
        const { temp, humidity } = response.data.main;
        const { speed, deg } = response.data.wind;
        return {
          city: response.data.name,
          temperature: temp,
          humidity,
          wind: {
            speed,
            direction: deg,
          },
        };
      })
      .catch(error => {
        // Handle errors for individual cities
        console.error(`Error fetching weather data for ${city}:`, error);
        // Returning null for the city with an error
        return null;
      })
  );

  try {
    const weatherDataResponses = await Promise.all(weatherDataPromises);
    const validWeatherData = weatherDataResponses.filter(data => data !== null);

    const responseData = {
      total: citiesDataOpenWeather.length,
      loaded: validWeatherData.length,
      data: validWeatherData,
    };
    res.json(responseData);
  } catch (error) {
    // Handle API request errors
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// This endpoint is used for FMI requests
app.get('/cities', async (req, res) => {
  const searchKey = req.query.search_key || ''; 
  const startIndex = parseInt(req.query.start_index) || 0; 
  const citiesPerPage = 10;

  const searchedCities = citiesData
    .filter(city => city.toLowerCase().includes(searchKey.toLowerCase()));
  // Filter cities based on the search key
  const filteredCities = searchedCities.slice(startIndex, startIndex + citiesPerPage);
  const responseData = {
    total: searchedCities.length,
    loaded: filteredCities.length,
    data: filteredCities,
  };
  res.json(responseData);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});