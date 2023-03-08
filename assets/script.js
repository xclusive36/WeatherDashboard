// OpenWeatherMap API key
const WEATHER_API = "4c320bd2083d8de685713a6244f1d98a";

let searchHistory = [];
const getStorageHistory = localStorage.getItem("WeatherDashboardSearchHistory");
if (getStorageHistory) searchHistory = JSON.parse(getStorageHistory);

// Function to get the current weather data for the city specified
const citySearch = (city) => {
  const geo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WEATHER_API}`;
  $.get(geo, (getData) => {
    if (getData.length === 0) {
      alert("City not found");
      return;
    }
    return getData;
  }).then((getData) => {
    const lat = getData[0].lat;
    const lon = getData[0].lon;
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API}&units=imperial`;

    const date = dayjs().format("MMM D, YYYY");
    $("#current-weather-date").text(date);

    $.get(url, (weatherData) => {
      0;
      $("#current-weather-city").text(weatherData.city.name);
      $("#card-temp-data").text(weatherData.list[0].main.temp);
      $("#card-wind-data").text(weatherData.list[0].wind.speed);
      $("#card-humidity-data").text(weatherData.list[0].main.humidity);
      $("#current-weather-icon").attr(
        "src",
        `https://openweathermap.org/img/w/${weatherData.list[0].weather[0].icon}.png`
      );
      $("#current-weather-icon").removeClass("hide");
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
  $("#search-history-list").empty();
  searchHistory = [];
  localStorage.setItem(
    "WeatherDashboardSearchHistory",
    JSON.stringify(searchHistory)
  );
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

$(document).ready(() => {});
