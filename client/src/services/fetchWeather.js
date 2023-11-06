import Metolib from '@fmidev/metolib';

const SERVER_URL = 'https://opendata.fmi.fi/wfs'
var STORED_QUERY_OBSERVATION = "fmi::observations::weather::multipointcoverage";

const PARAMS_OBJ = {
  begin : new Date(),
  end : new Date((new Date()).getTime() + 26 * 60 * 60 * 1000),
  requestParameter : "temperature,windspeedms,humidity,winddirection",
  timestep: 60 * 60 * 1000,
}

const fetchWeather = (setData, cities) => {
  const connection = new Metolib.WfsConnection();
  const fetchPromises = [];

  if (connection.connect(SERVER_URL, STORED_QUERY_OBSERVATION)) {
    console.log('cities', cities)
    cities.forEach(city => {
      const fetchPromise = new Promise((resolve, reject) => {
        connection.getData({
            begin: PARAMS_OBJ.begin,
            end: PARAMS_OBJ.end,
            requestParameter: PARAMS_OBJ.requestParameter,
            timestep: PARAMS_OBJ.timestep,
            sites: city, // Fetch data for individual city
            callback: (data, errors) => {
                if (errors.length > 0) {
                    errors.forEach(err => {
                        console.error(`FMI API error for ${city}: ` + err.errorText);
                    });
                    resolve(null); // Resolve with null for cities with errors
                } else {
                    resolve(data.locations[0]); // Resolve with data for successful cities
                }
            }
    			});
      });
    	fetchPromises.push(fetchPromise);
  	});

  // Wait for all fetchPromises to resolve (either with data or null for errors)
  	Promise.all(fetchPromises).then(results => {
    // Filter out null values (cities with errors) and set the state with the fetched data
    	const filteredData = results.filter(data => data !== null);
    	setData(filteredData.sort((a,b) => a.info.name.localeCompare(b.info.name)));
    	connection.disconnect();
    });
  }
}

export default fetchWeather;