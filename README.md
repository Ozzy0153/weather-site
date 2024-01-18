# Weather Site

## Overview

The Local Weather web application provides users with real-time weather information, including the current weather and a 14-day extended forecast. The application uses the OpenWeatherMap API to fetch weather data based on the user's location.

## Setup Instructions

1. **Obtain OpenWeatherMap API Key:**
   - Visit [OpenWeatherMap](https://openweathermap.org/) and sign up for a free account.
   - Obtain your API key from the account dashboard.

2. **Clone the Repository:**
   ```bash
   gh repo clone Ozzy0153/weather-site
   cd <repository-directory>
   ```
   
# Configuration

1. Open `script.js` in a text editor.
2. Replace the `apiKey` variable with your OpenWeatherMap API key.

# Run the Application

1. Open a terminal in the project directory.
2. Run the Express server:
   ```bash
   node server.js
    ```
   - Visit http://localhost:3000 in your web browser.
  
# API Usage

The application uses the following OpenWeatherMap APIs:

## One Call API:

- **Endpoint:** [https://api.openweathermap.org/data/2.5/onecall](https://api.openweathermap.org/data/2.5/onecall)
- **Purpose:** Fetches current weather, hourly forecast, and 14-day extended forecast based on latitude and longitude.

## Reverse Geocoding API:

- **Endpoint:** [https://api.openweathermap.org/geo/1.0/reverse](https://api.openweathermap.org/geo/1.0/reverse)
- **Purpose:** Retrieves the city name and country code based on latitude and longitude.


# Key Design Decisions

## Responsive Design:

The application is designed to be responsive, ensuring a consistent user experience across various devices.

## Leaflet Map Integration:

Utilizes the Leaflet library to display an interactive map with the user's location marker.

## Dynamic Forecast Display:

The 14-day extended forecast is dynamically generated and displayed based on the API response.

## Error Handling:

Implements error handling for better user experience in case of API errors or geolocation issues.

## Express Server:

A simple Express server is used to serve static files and run the application locally.

# Project Structure

- **index.html:**
  HTML file containing the structure of the web page.

- **style.css:**
  CSS file for styling the web page.

- **script.js:**
  JavaScript file containing the main logic for fetching and displaying weather data.

- **server.js:**
  Express server file to serve static files.


## Conclusion

The Local Weather web application provides users with a comprehensive weather experience, including real-time and extended. The modular structure allows for easy maintenance and future enhancements.
