
// Function to get weather data for a specific location
async function getWeather(location) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=503efcb5968f2f41971e53253c7ac360`);
    const data = await response.json();
    return data;
}

// Function to get weather data for multiple locations
async function getWeatherForMultipleLocations(locations) {
    const weatherData = [];
    for (const location of locations) {
        const data = await getWeather(location);
        weatherData.push(data);
    }
    return weatherData;
}

// When the page loads, get the weather for multiple locations and display it in the header
window.addEventListener('load', async () => {
    const locations = ['Lagos', 'Ogun', 'Abuja'];  // Replace with your specific locations
    const weatherData = await getWeatherForMultipleLocations(locations);
    
    const headerWeatherElement = document.getElementById('header-weather');
    headerWeatherElement.innerHTML = '';  // Clear the header
    

    // Add the weather data for each location to the header
for (let i = 0; i < weatherData.length; i++) {
    const data = weatherData[i];
    const span = document.createElement('span');
    
    // Create the text content
    const text = document.createElement('span');
    text.innerHTML = `${data.name}: ${Math.round(data.main.temp - 273.15)} <sup>o</sup> C and ${data.weather[0].description} &nbsp;`;
    span.appendChild(text);
    
    // Create the weather icon
    const icon = document.createElement('img');
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    icon.alt = `${data.weather[0].description} icon`;
    icon.style.width = '35px';  // Set the width of the image
    icon.style.height = '35px';  // Set the height of the image
    icon.style.verticalAlign = 'middle';  // Align the image vertically in the middle
    span.appendChild(icon);
    
    headerWeatherElement.appendChild(span);
    
    // Add a space after each location, except the last one
    if (i < weatherData.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        headerWeatherElement.appendChild(space);
    }
}

});