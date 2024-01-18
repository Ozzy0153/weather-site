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

    getWeather();
    getExtendedForecast();
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    // Almaty coords
    lat = 43.25654;
    lon = -76.92848;

    getWeather();
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
            throw error; // Rethrow the error to be caught by the calling function
        });
}


function getWeather() {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            const currentWeather = data.current;
            const feelsLike = currentWeather.feels_like;
            const humidity = currentWeather.humidity;
            const pressure = currentWeather.pressure;
            const windSpeed = currentWeather.wind_speed;
            const rainVolume3h = data.hourly && data.hourly[0] && data.hourly[0].rain && data.hourly[0].rain['3h'];
            const weatherInfo = document.getElementById('weather-info');
            weatherInfo.innerHTML = `
        <p>Temperature: ${currentWeather.temp} &deg;C</p>
        <p>Weather: ${currentWeather.weather[0].description}</p>
        <p>Feels Like: ${feelsLike} &deg;C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Pressure: ${pressure} hPa</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Rain Volume (last 3 hours): ${rainVolume3h || 0} mm</p>
      `;

            getCityName(lat, lon)
                .then(cityData => {
                    const { cityName, countryCode } = cityData;
                    weatherInfo.innerHTML = `<p>City: ${cityName}, ${countryCode}</p>` + weatherInfo.innerHTML;
                    initMap(lat, lon);
                })
                .catch(error => {
                    console.error('Error fetching city name:', error);
                });

            getExtendedForecast();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}


function initMap(lat, lon) {
    const map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map);
}

function getExtendedForecast() {
    const extendedForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;

    fetch(extendedForecastUrl)
        .then(response => response.json())
        .then(data => {
            const extendedForecast = data.daily;

            if (extendedForecast) {
                const forecastContainer = document.getElementById('extended-forecast-container');
                forecastContainer.innerHTML = '<h2 style="text-align: center; margin-bottom: 0;">14-Day Extended Forecast</h2>';

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