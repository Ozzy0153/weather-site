const apiKey = '0a3e35c8fae01568ff89bf8cdcb37eb6';
let lat;
let lon;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    console.error('Geolocation is not supported by this browser.');
}

function success(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    getWeatherByCity();
    getExtendedForecast();
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);

    lat = 51.098009;
    lon = 71.434096;

    getWeatherByCity();
    getExtendedForecast();
}
function getCityName(lat, lon) {
    const reverseGeocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

    return fetch(reverseGeocodingUrl)
        .then(response => response.json())
        .then(geoData => {
            const cityName = geoData[0].name;
            const countryCode = geoData[0].country;
            return { cityName, countryCode };
        })
        .catch(error => {
            console.error('Error fetching city name:', error);
            throw error;
        });
}


function getWeatherByCity() {
    const cityInput = document.getElementById('cityInput').value;

    const weatherByCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;

    fetch(weatherByCityUrl)
        .then(response => response.json())
        .then(data => {
            const currentWeather = data.main;
            const weatherDescription = data.weather[0].description;
            const weatherInfo = document.getElementById('weather-info');
            weatherInfo.innerHTML = `
                <p>Temperature: ${currentWeather.temp} &deg;C</p>
                <p>Weather: ${weatherDescription}</p>
                <p>Feels Like: ${currentWeather.feels_like} &deg;C</p>
                <p>Humidity: ${currentWeather.humidity}%</p>
                <p>Pressure: ${currentWeather.pressure} hPa</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            `;

            const lat = data.coord.lat;
            const lon = data.coord.lon;

            getCityName(lat, lon)
                .then(cityData => {
                    const { cityName, countryCode } = cityData;
                    weatherInfo.innerHTML = `<p>City: ${cityName}, ${countryCode}</p>` + weatherInfo.innerHTML;
                    initMap(lat, lon);
                })
                .catch(error => {
                    console.error('Error fetching city name:', error);
                });

            getExtendedForecast(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching weather data by city:', error);
        });
}


let map;  // Declare a global variable to store the map object

function initMap(lat, lon) {
    if (map) {
        map.remove();  // Remove the existing map if it exists
    }

    map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

    L.marker([lat, lon]).addTo(map);
}


function getExtendedForecast(lat, lon) {
    const extendedForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;

    fetch(extendedForecastUrl)
        .then(response => response.json())
        .then(data => {
            const extendedForecast = data.daily;

            if (extendedForecast) {
                const forecastContainer = document.getElementById('extended-forecast-container');
                forecastContainer.innerHTML = '<h2 style="text-align: center; margin-bottom: 0;">7 - Days Extended Forecast</h2>';

                extendedForecast.forEach(day => {
                    const date = new Date(day.dt * 1000);
                    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);

                    forecastContainer.innerHTML += `
            <div class="forecast-day">
              <p class="day-of-week">${dayOfWeek}</p>
              <p class="temperature">Max: ${day.temp.max} &deg;C | Min: ${day.temp.min} &deg;C</p>
              <p class="wind">Wind: ${getWindDirection(day.wind_deg)}</p>
              <p class="sunrise-sunset">Sunrise: ${formatTime(day.sunrise)} | Sunset: ${formatTime(day.sunset)}</p>
            </div>
          `;
                });
            } else {
                console.error('Extended forecast data not found in the API response:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching extended forecast:', error);
        });
}



function getWindDirection(degrees) {
    const directions = ['North', 'NorthEast', 'East', 'SouthEast', 'South', 'SouthWest', 'West', 'NorthWest'];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
}

function formatTime(timestamp) {
    const time = new Date(timestamp * 1000);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}