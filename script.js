const apiKey = '67e555f583cae46b00ca6cda82a265d6';

const heroSection = document.querySelector('.hero');
const mainContentSection = document.querySelector('.main-content');


async function getWeather() {
    const city = document.getElementById('city-input').value;
    if (!city) {
        alert("Please enter a city name");
        
        heroSection.classList.add('hidden');
        mainContentSection.classList.add('hidden');
        return;
    }

    try {
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const weatherData = await weatherRes.json();

        if (weatherData.cod === '404') {
            alert("City not found. Please try again.");
            heroSection.classList.add('hidden'); 
            mainContentSection.classList.add('hidden');
            return;
        }

        heroSection.classList.remove('hidden');
        mainContentSection.classList.remove('hidden');

        document.getElementById('city').innerText = `${weatherData.name}, ${weatherData.sys.country}`;
        document.getElementById('temp').innerText = `${Math.round(weatherData.main.temp)}°C`;

        const iconCode = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById('weather-icon').src = iconUrl;
        document.getElementById('weather-icon').alt = weatherData.weather[0].description;

        document.getElementById('description').innerText = weatherData.weather[0].description;

        document.getElementById('feels-like').innerText = `${Math.round(weatherData.main.feels_like)}°C`;
        document.getElementById('humidity').innerText = `${weatherData.main.humidity}%`;
        document.getElementById('pressure').innerText = `${weatherData.main.pressure} hPa`;
        document.getElementById('visibility').innerText = `${(weatherData.visibility / 1000).toFixed(1)} km`;
        document.getElementById('wind').innerText = `${weatherData.wind.speed} m/s`;
        document.getElementById('sea-level').innerText = `${weatherData.main.sea_level} m`;

        const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
        document.getElementById('sunrise').innerText = sunrise;
        document.getElementById('sunset').innerText = sunset;

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastRes.json();

        if (forecastData.cod === '404' || !forecastData.list) {
             console.error("Forecast data not found or invalid:", forecastData);
             alert("Could not fetch forecast data for this city.");
             document.getElementById('forecast').innerHTML = '';
             return;
        }

        const forecastDiv = document.getElementById('forecast');
        forecastDiv.innerHTML = '';

        const dailyData = {};

        forecastData.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!dailyData[date]) {
                dailyData[date] = item;
            }
        });

        Object.keys(dailyData).slice(0,5).forEach(date => {
            const item = dailyData[date];
            const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

            const options = { weekday: 'short', day: 'numeric', month: 'short' };
            const dayName = new Date(item.dt * 1000).toLocaleDateString('en-US', options); 

            const forecastHTML = `
                <div class="forecast-day">
                    <h4>${dayName}</h4>
                    <img src="${icon}" alt="${item.weather[0].description}" />
                    <p>${Math.round(item.main.temp)}°C</p>
                    <p style="font-size:0.9rem; text-transform: capitalize;">${item.weather[0].description}</p>
                </div>
            `;

            forecastDiv.innerHTML += forecastHTML;
        });

    } catch (err) {
        console.error(err);
        alert("An error occurred while fetching weather data. Please try again.");
        heroSection.classList.add('hidden');
        mainContentSection.classList.add('hidden');
    }
}
