// variables
let searchHistory = { city: [] };

// functions
// initialize to create buttons from history
function init() {}
// fetch function
function handleCoordinates(searchCity) {
  const fetchUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      handleCurrentWeather(data.coord, data.name);
    });
}
// take coordinates from the serach and fetch us the weather data for that city
function handleCurrentWeather(coordinates, city) {
  const lat = coordinates.lat;
  const lon = coordinates.lon;

  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayCurrentWeather(data.current, city);
      displayFiveDayForecast(data.daily);
    });
}
// display current weather function
function displayCurrentWeather(currentCityData, cityName) {
  let weatherIcon = `http://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;
  console.log(currentCityData);
  document.querySelector(
    "#currentDayWeather"
  ).innerHTML = `<h2>${cityName} ${moment
    .unix(currentCityData.dt)
    .format("MMM Do YY")} <img src="${weatherIcon}"></h2> <div>Temp: ${
    currentCityData.temp
  } \xB0F</div>
    <div>Wind speed ${
      currentCityData.wind_speed
    } miles per hour</div> <div>Humidity: ${
    currentCityData.humidity
  }%</div><div class="" id="uvIndex">UV Index: ${currentCityData.uvi}</div>`;
  //   UV Index color coding
  const uvIndexValue = currentCityData.uvi;
  console.log(uvIndexValue);
  if (uvIndexValue <= 2) {
    document.getElementById("uvIndex").classList.add("bgc-green");
  } else if (uvIndexValue <= 5) {
    document.getElementById("uvIndex").classList.add("bgc-yellow");
  } else {
    document.getElementById("uvIndex").classList.add("bgc-red");
  }
}
// display five day forecast
function displayFiveDayForecast(fiveDayCityData) {
  const cityData = fiveDayCityData.slice(1, 6);
  document.querySelector("#fiveDayForecast").innerHTML = "";

  cityData.forEach((day) => {
    let weatherIcon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    document.querySelector("#fiveDayForecast").innerHTML += `<div><div>${moment
      .unix(day.dt)
      .format("MMM Do YY")}</div> <div><img src="${weatherIcon}"></div>
        <div>Temp: ${day.temp.day} \xB0F</div><div>Wind speed: ${
      day.wind_speed
    } miles per hour</div> <div>Humidity: ${day.humidity}%</div></div>`;
  });
}
// handle form submit
function handleFormSubmit(event) {
  event.preventDefault();
  const city = document.querySelector("#searchInput").value.trim();
  document.querySelector(
    "#searchHistory"
  ).innerHTML += `<button data-city="${city}">${city}</button>`;
  handleCoordinates(city);
  // set local storage with the city
  searchHistory.city.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function handleHistory(event) {
  const city = event.target.getAttribute("data-city");
  handleCoordinates(city);
}

// listeners
// on page load, show any past cities searched
init();
// search for city
// click on city to show weather
document
  .querySelector("#searchForm")
  .addEventListener("submit", handleFormSubmit);
document
  .querySelector("#searchHistory")
  .addEventListener("click", handleHistory);
