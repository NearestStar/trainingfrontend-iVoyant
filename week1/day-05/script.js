const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if(city===""){
        console.log("Please enter a city");
        return;
    }
    weatherResult.classList.remove("error");
    weatherResult.textContent = "Loading weather...";
    getCoordinates(city);
    cityInput.value = "";
});

async function getCoordinates(city) {
    try{
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
        );
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            weatherResult.textContent = "City not found";
            weatherResult.classList.add("error");
            return;
        }
        const location = data.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m`
        );
        const weatherData = await weatherResponse.json();
        const temperature = weatherData.current.temperature_2m;
        const weatherCode = weatherData.current.weather_code;
        const humidity = weatherData.current.relative_humidity_2m;
        const windSpeed = weatherData.current.wind_speed_10m;
        const condition = getWeatherCondition(weatherCode);
        const icon = getWeatherIcon(weatherCode);
        console.log(weatherCode);
        weatherResult.innerHTML = `
            <h2>${city}</h2>
            <p>${icon} ${condition}</p>
            <p>🌡️ Temperature: ${temperature} °C</p>
            <p>💧 Humidity: ${humidity}%</p>
            <p>💨 Wind Speed: ${windSpeed} km/h</p>
        `;
    } catch(error){
        weatherResult.textContent = "Unable to fetch weather data.";
        weatherResult.classList.add("error");
    }
}

function getWeatherCondition(code) {
    if (code === 0){
        return "Clear Sky";
    } else if (code >= 1 && code <= 3) {
        return "Cloudy";
    } else if (code >= 45 && code <= 48) {
        return "Foggy";
    } else if (code >= 51 && code <= 67) {
        return "Rainy";
    } else if (code >= 71 && code <= 77) {
        return "Snowy";
    } else if (code >= 80 && code <= 82) {
        return "Rain Showers";
    } else {
        return "Unknown";
    }
}

function getWeatherIcon(code) {
    if (code === 0) {
        return "☀️";
    } else if (code >= 1 && code <= 3) {
        return "🌤️";
    } else if (code >= 45 && code <= 48) {
        return "🌫️";
    } else if (code >= 51 && code <= 67) {
        return "🌧️";
    } else if (code >= 71 && code <= 77) {
        return "❄️";
    } else if (code >= 80 && code <= 82) {
        return "🌦️";
    } else if (code >= 95) {
        return "⛈️";
    } else {
        return "❓";
    }
}