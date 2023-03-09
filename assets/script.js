// OpenWeatherMap API key
const WEATHER_API = "4c320bd2083d8de685713a6244f1d98a";

let searchHistory = []; // Array to hold the search history
const getStorageHistory = localStorage.getItem("WeatherDashboardSearchHistory"); // Get the search history from local storage
if (getStorageHistory) searchHistory = JSON.parse(getStorageHistory); // If there is a search history, set the search history array to the search history from local storage

const add5DayForecastCard = (weatherObj) => {
  // append card to the forecast-cards div
  const objDate = dayjs.unix(weatherObj.dt).format("MMM D, YYYY");
  $("#forecast-cards").append(`
              <div class="forecast-card">
                <h4>${objDate}</h4>
                <img
                  id="forecast-weather-icon"
                  src="https://openweathermap.org/img/w/${weatherObj.weather[0].icon}.png"
                  alt="weather icon"
                />
                <p id="current-weather-temp">
                  Temp: <span id="temp-data">${weatherObj.main.temp}°F</span>
                </p>
                <p id="current-weather-wind">
                  Wind: <span id="wind-data">${weatherObj.wind.speed} MPH</span>
                </p>
                <p id="current-weather-humidity">
                  Humidity: <span id="humidity-data">${weatherObj.main.humidity}%</span>
                </p>
              </div>`);
};

// Function to get the current weather data for the city specified
const citySearch = (city) => {
  const geo = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WEATHER_API}`;
  $.get(geo, (getData) => {
    if (getData.length === 0) {
      alert("City not found"); // If the city is not found, alert the user
      return; // If the city is not found, return
    }
    return getData; // Return the data
  }).then((getData) => {
    const lat = getData[0].lat; // Get the latitude and longitude for the city
    const lon = getData[0].lon; // Get the latitude and longitude for the city
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API}&units=imperial`;

    $.get(url, (weatherData) => {
      // Get the weather data for the city
      $("#current-weather-city").text(weatherData.city.name); // Set the city name
      const date = dayjs.unix(weatherData.list[0].dt).format("MMM D, YYYY"); // Get the date
      $("#current-weather-date").text(date); // Set the date
      $("#card-temp-data").text(weatherData.list[0].main.temp + "°F"); // Set the temperature
      $("#card-wind-data").text(weatherData.list[0].wind.speed + " MPH"); // Set the wind speed
      $("#card-humidity-data").text(weatherData.list[0].main.humidity + "%"); // Set the humidity
      $("#current-weather-icon").attr(
        "src",
        `https://openweathermap.org/img/w/${weatherData.list[0].weather[0].icon}.png`
      ); // Set the weather icon
      $("#current-weather-icon").removeClass("hide"); // Show the weather icon

      $("#forecast-cards").empty(); // Clear the forecast cards

      const dayArray = [4, 12, 20, 28, 36]; // Array of indexes for the 5 days of the forecast
      dayArray.forEach((day) => {
        // Loop through the array
        let objDate = dayjs
          .unix(weatherData.list[day].dt)
          .format("MMM D, YYYY"); // Get the date for the forecast
        add5DayForecastCard(weatherData.list[day]); // Add the forecast card to the page
      });
    });
  });
};

const addNewCityButton = (city) => {
  // Add the city to the search history
  $("#search-history-list").prepend(
    `<button onClick="citySearch('${city}')" class="btn btn-secondary search-history-button">${city}</button>`
  );
};

const clearSearchHistory = () => {
  // Clear the search history
  $("#search-history-list").empty(); // Clear the search history from the page
  searchHistory = []; // Clear the search history array
  localStorage.setItem(
    "WeatherDashboardSearchHistory",
    JSON.stringify(searchHistory)
  ); // Clear the search history from local storage
};

searchHistory.forEach((city) => addNewCityButton(city)); // Add the search history to the page

// When the search button is clicked, get the city name from the input field
// and pass it to the citySearch function
$("#search-form").submit(function (event) {
  event.preventDefault(); // Prevent the form from submitting
  const city = $("#search-input").val(); // Get the city name from the input field
  citySearch(city); // Get the weather data for the city
  addNewCityButton(city); // Add the city to the search history
  searchHistory.unshift(city); // Add the city to the search history array
  localStorage.setItem(
    "WeatherDashboardSearchHistory",
    JSON.stringify(searchHistory)
  ); // Save the search history to local storage
  $("#search-input").val(""); // Clear the input field
});

$(document).ready(() => {
  // When the page loads, get the weather data for the last city searched
  if (searchHistory.length > 0) {
    // If there is a search history
    citySearch(searchHistory[0]); // Get the weather data for the last city searched
  } else {
    citySearch("Denver"); // If there is no search history, get the weather data for Denver
  }
});
