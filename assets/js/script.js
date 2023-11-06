const apiKey = '61ad647193749c872d03d5d641f20d7c';
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const currentWeatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast-container');
const searchHistoryContainer = document.getElementById('search-history');

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    getCoordinates(city);
});

function getCoordinates(city) {
    const geocodingApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    
    fetch(geocodingApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.city) {
                const lat = data.city.coord.lat;
                const lon = data.city.coord.lon;
                getWeatherData(lat, lon, city);
            } else {
                alert('City not found!');
            }
        })
        .catch(error => console.error('Error fetching coordinates:', error));
}

function getWeatherData(lat, lon, city) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data.list[0]);
            displayForecast(data.list);
            updateSearchHistory(city);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(weatherData) {
    currentWeatherContainer.innerHTML = '';
    
    // Assuming weatherData contains all the necessary weather details
    let temperature = document.createElement('p');
    temperature.textContent = `Temperature: ${weatherData.main.temp} °C`;

    let humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;

    let windSpeed = document.createElement('p');
    windSpeed.textContent = `Wind Speed: ${weatherData.wind.speed} km/h`;

    currentWeatherContainer.appendChild(temperature);
    currentWeatherContainer.appendChild(humidity);
    currentWeatherContainer.appendChild(windSpeed);
}

function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';

    forecastData.forEach((weatherPoint, index) => {
        if (index % 8 === 0) { // Choosing the data point of the same time every day for consistency
            let forecastDayEl = document.createElement('div');
            forecastDayEl.className = 'forecast-day';

            // Date Element
            let date = new Date(weatherPoint.dt * 1000).toDateString(); // Convert Unix timestamp to Date
            let dateEl = document.createElement('p');
            dateEl.textContent = date;

            // Weather Icon Element
            let iconCode = weatherPoint.weather[0].icon;
            let iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
            let iconEl = document.createElement('img');
            iconEl.src = iconUrl;
            iconEl.alt = weatherPoint.weather[0].description;

            // Temperature Element
            let tempEl = document.createElement('p');
            tempEl.textContent = `Temp: ${weatherPoint.main.temp} °C`;

            // Wind Speed Element
            let windEl = document.createElement('p');
            windEl.textContent = `Wind: ${weatherPoint.wind.speed} km/h`;

            // Humidity Element
            let humidityEl = document.createElement('p');
            humidityEl.textContent = `Humidity: ${weatherPoint.main.humidity}%`;

            // Appending elements to the forecast day element
            forecastDayEl.appendChild(dateEl);
            forecastDayEl.appendChild(iconEl);
            forecastDayEl.appendChild(tempEl);
            forecastDayEl.appendChild(windEl);
            forecastDayEl.appendChild(humidityEl);

            // Appending the forecast day element to the container
            forecastContainer.appendChild(forecastDayEl);
        }
    });
}

function updateSearchHistory(city) {
    let cityEl = document.createElement('p');
    cityEl.textContent = city;
    searchHistoryContainer.appendChild(cityEl);

    // Implement local storage for search history
    let searchHistory = localStorage.getItem('searchHistory') ?
                        JSON.parse(localStorage.getItem('searchHistory')) : [];
    
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

// Load search history on page load
window.onload = () => {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.forEach(city => {
        let cityEl = document.createElement('p');
        cityEl.textContent = city;
        searchHistoryContainer.appendChild(cityEl);
    });
};
