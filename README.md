
# Weather app
App shows the latest measured temperature, wind speed and direction for all the
cities in Finland. Use the open API from Finnish Meteorological Institute for the
data: https://en.ilmatieteenlaitos.fi/open-data-manual

## Features
-   **Search:** Users can search for cities to get real-time weather information.
-   **Load More:** Users can load more cities to view weather details.
-   **Responsive Design:** The app is designed to work seamlessly across different devices and screen sizes.

## Installation
1.  **Clone the Repository:**
    `git clone <repository-url>`
2.  **Run app:**
    `docker-compose up`  

## App Structure
The app follows the following structure:
-   **`/some`**:
	-    **`docker-compose.yml`**: Contains the frontend code files.
	-   **`/client`**: Contains the frontend code files.
	    -   **`/src`**: Contains the React components and styles.
	    -   **`Dockerfile`**: Contains information to containerise this folder`.
	-   **`/backend`**: Contains the backend server files.
	    -   **`Dockerfile`**: Contains information to containerise this folder`.
	    -   **`fi.json`**: Contains cities in Finland, json file
	    -   **`server.js`**: Contains Http logic

## Usage
-   **Access the App:**
    -   Open your browser and go to `http://localhost:3000` to access the app, `http://localhost:8000/cities` to access server.
-   **Search for Cities:**
    -   Type the name of the city in the search bar and press Enter.
-   **Load More Cities:**
    -   Click the "Load More" button to load additional cities.

## Descriptions
The app contains client and server sides. 
Server returns city list based on search text and cursor. It will load first 10 cities and when load more is pressed, it loads the next 10 cities. Server was written with Express due to its simplicity and scalability. It has Express-Cache-Headers  for cache.
City list will be passed to Metolib library in client to load each city's data and display each weather card. Metolib itself has built in cache. Front-end was built in React.js, components were styled with css.
This app was built with help of ChatGPT and online sources for the backend. I was struggeling in getting data from FMI but finally achieved it. There is one issue that even though the right list of cities was given, it returned wrong data. I have tried with the first city and the returned data is wrong, so I am not sure if the problem is from API itself or myself. 
 
> **_NOTE:_**  The commented code is for OpenWeatherAPI

## Troubleshooting
Even though the right cities list has been passed but the Metolib return wrong data.

