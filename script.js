const btn = document.getElementById("search-btn");
const div = document.getElementById("weather-info");
const inputTag = document.getElementById("city");

async function handler() {
  const city = inputTag.value.trim().toLowerCase();
  if (!city) {
    div.innerText = "Please Enter a City Name";
    return;
  }

  inputTag.value = "";
  div.innerText = "Loading...";
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=26686b531a7540ff90a95637251210&q=${city}&aqi=no`
    );
    const data = await response.json();
    // console.log(data);

    cityName(data, city);
  } catch (error) {
    console.error(error);
    div.innerText = "Something went wrong. Please try again.";
  }
}

btn.addEventListener("click", handler);
inputTag.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handler();
  }
});

function cityName(data, city) {
  if (data.error) {
    div.innerText = "City Name Not Found in Our Record";
  } else {
    let suggest = "";
    if (city !== data.location.name.toLowerCase()) {
      suggest = `( Did you mean <b>'${data.location.name}' </b>? )`;
    }
    const { date, hour, minute, period } = time(data);
    const dayORnight = daySelector(data);
    div.innerHTML = `
            <p>Location: ${data.location.name}, ${data.location.country} ${suggest}</p>
            <p>Date: ${date}</p>
            <p>Time: ${hour}:${minute} ${period}</p>
            <p>Day or Night: ${dayORnight}</p>
            <p>Weather: ${data.current.condition.text}</p>
            <span id = "tempChange">Temperature: ${data.current.temp_c}\u00B0C</span>
            <select name="tempConversion" id="tempConversion">
              <option value="celsius">C</option>
              <option value="Fahrenheit">F</option>
            </select>
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind Speed: ${data.current.wind_kph} kph</p>
            `;
    tempChanger(data);
  }
}
const time = (data) => {
  const localTime = data.location.localtime;
  let timesplit = localTime.split(" ")[1].split(":");
  const date = localTime.split(" ")[0];
  let hour = parseInt(timesplit[0]);
  const period = hour >= 12 ? "pm" : "am";
  const minute = timesplit[1];
  hour = hour % 12 || 12;
  return { date, hour, minute, period };
};

function daySelector(data) {
  let dayORnight;
  if (data.current.is_day == 0) {
    dayORnight = "Night";
  } else {
    dayORnight = "Day";
  }
  return dayORnight;
}
function tempChanger(data) {
  const drop = document.getElementById("tempConversion");
  drop.addEventListener("change", () => {
    const tempId = document.getElementById("tempChange");
    // console.log(drop.value);
    if (drop.value === "Fahrenheit") {
      tempId.innerText = `Temperature: ${data.current.temp_f}\u00B0F`;
    } else {
      tempId.innerText = `Temperature: ${data.current.temp_c}\u00B0C`;
    }
  });
}
