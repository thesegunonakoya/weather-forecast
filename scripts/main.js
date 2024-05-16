const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "503efcb5968f2f41971e53253c7ac360";

const createWeatherCard = (cityName, weatherItem, index) => {
    const temperature = weatherItem.main.temp - 273.15;
    let temperatureDescription = "";

    if (temperature > 25) {
        temperatureDescription = "Its hotter than usual, almost like we are in hell";
    } else if (temperature < 10) {
        temperatureDescription = "Its colder than usual, maybe winter is coming idk";
    } else {
        temperatureDescription = "normal";
    }

    if(index === 0) { 
        const date = new Date(weatherItem.dt_txt);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    
        return `<div class="details">
                <h2>${cityName} (${dayOfWeek})</h2>
                <h6>Temperature: ${temperature.toFixed(2)} <sup>o</sup> C (${temperatureDescription})</h6>
                <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherItem.main.humidity}%</h6>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h6>${weatherItem.weather[0].description}</h6>
            </div>`;
    } else { 
        const date = new Date(weatherItem.dt_txt);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    
        return `<li class="card day-${index}">
                    <h3>${dayOfWeek}</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${temperature.toFixed(2)} <sup>o</sup> C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    

    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}








const saveLocation = (location) => {
    let locations = JSON.parse(localStorage.getItem('locations')) || [];
    
    locations.push(location);
    
    localStorage.setItem('locations', JSON.stringify(locations));
}

const getLocations = () => {
    return JSON.parse(localStorage.getItem('locations')) || [];
}

searchButton.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    
    saveLocation(cityName);
    
    getCityCoordinates();
});


window.addEventListener('load', () => {
    let locations = getLocations();
    
    locations = locations.slice(Math.max(locations.length - 5, 0)).reverse();
    
    const locationListElement = document.getElementById('location-list');
    
    locationListElement.innerHTML = '';
    
    locations.forEach(location => {
        const listItem = document.createElement('h6');
        listItem.textContent = location;
        locationListElement.appendChild(listItem);
    });
});


locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());

