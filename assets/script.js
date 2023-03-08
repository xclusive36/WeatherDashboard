// OpenWeatherMap API key
const WEATHER_API = "4c320bd2083d8de685713a6244f1d98a";

// When the search button is clicked, get the city name from the input field
$("#search-form").submit(function (event) {
  event.preventDefault();
  const city = $("#search-input").val();

  const geo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WEATHER_API}`;
  $.get(geo, (getData) => {
    return getData;
  }).then((getData) => {
    const lat = getData[0].lat;
    const lon = getData[0].lon;
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API}&units=imperial`;

    const date = dayjs().format("MMM D, YYYY");
    $("#current-weather-date").text(date);

    $.get(url, (weatherData) => {
      console.log(weatherData.list[0].weather[0].icon);
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
});

$(document).ready(() => {});
