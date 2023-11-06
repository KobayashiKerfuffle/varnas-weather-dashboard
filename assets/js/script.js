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
    const geocodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    fetch(geocodingApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.coord) {
                const lat = data.coord.lat;
                const lon = data.coord.lon;
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
            displayCurrentWeather(data.list[0], city);
            displayForecast(data.list);
            updateSearchHistory(city);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(weatherData, city) {
    currentWeatherContainer.innerHTML = '';

    let weatherCard = document.createElement('div');
    weatherCard.className = 'current-day';

    let cityEl = document.createElement('h2');
    cityEl.textContent = city;

    let date = new Date(weatherData.dt * 1000).toDateString();
    let dateEl = document.createElement('p');
    dateEl.textContent = date;

    let iconCode = weatherData.weather[0].icon;
    let iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
    let iconEl = document.createElement('img');
    iconEl.src = iconUrl;
    iconEl.alt = weatherData.weather[0].description;

    let temperature = document.createElement('p');
    temperature.textContent = `Temperature: ${weatherData.main.temp} °C`;

    let windSpeed = document.createElement('p');
    windSpeed.textContent = `Wind Speed: ${weatherData.wind.speed} km/h`;

    let humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;

    weatherCard.appendChild(cityEl);
    weatherCard.appendChild(dateEl);
    weatherCard.appendChild(iconEl);
    weatherCard.appendChild(temperature);
    weatherCard.appendChild(windSpeed);
    weatherCard.appendChild(humidity);

    currentWeatherContainer.appendChild(weatherCard);
}

function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0);

    let filteredForecastData = forecastData.filter(weatherPoint => {
        let forecastDate = new Date(weatherPoint.dt * 1000);
        return forecastDate >= currentDate;
    });

    filteredForecastData.forEach((weatherPoint, index) => {
        if (index % 8 === 0) {
            let forecastDayEl = document.createElement('div');
            forecastDayEl.className = 'forecast-day';

            let date = new Date(weatherPoint.dt * 1000).toDateString();
            let dateEl = document.createElement('p');
            dateEl.textContent = date;

            let iconCode = weatherPoint.weather[0].icon;
            let iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
            let iconEl = document.createElement('img');
            iconEl.src = iconUrl;
            iconEl.alt = weatherPoint.weather[0].description;

            let tempEl = document.createElement('p');
            tempEl.textContent = `Temp: ${weatherPoint.main.temp} °C`;

            let windEl = document.createElement('p');
            windEl.textContent = `Wind: ${weatherPoint.wind.speed} km/h`;

            let humidityEl = document.createElement('p');
            humidityEl.textContent = `Humidity: ${weatherPoint.main.humidity}%`;

            forecastDayEl.appendChild(dateEl);
            forecastDayEl.appendChild(iconEl);
            forecastDayEl.appendChild(tempEl);
            forecastDayEl.appendChild(windEl);
            forecastDayEl.appendChild(humidityEl);

            forecastContainer.appendChild(forecastDayEl);
        }
    });
}

function updateSearchHistory(city) {
    let cityButton = document.createElement('button');
    cityButton.textContent = city;
    cityButton.className = 'history-button';
    cityButton.onclick = () => getCoordinates(city);
    searchHistoryContainer.appendChild(cityButton);

    let searchHistory = localStorage.getItem('searchHistory') ?
                        JSON.parse(localStorage.getItem('searchHistory')) : [];
    
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

window.onload = () => {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.forEach(city => {
        let cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.className = 'history-button';
        cityButton.onclick = () => getCoordinates(city);
        searchHistoryContainer.appendChild(cityButton);
    });
};

