const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='07e32e2b23e56432bdc953d6f731e2a3';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);




function GetInfo() {

    var newName = document.getElementById("cityInput");
    var cityName = document.getElementById("cityName");
    cityName.innerHTML = "--"+newName.value+"--";

    var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + newName.value + '&appid=07e32e2b23e56432bdc953d6f731e2a3';

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

    //Getting the min and max values for each day
    for(i = 0; i<5; i++){
        document.getElementById("day" + (i+1) + "Min").innerHTML = "Night: " + Number(data.list[i].main.temp_min - 273.15).toFixed(1)+ "°";
        //Number(1.3450001).toFixed(2); // 1.35
    }

    for(i = 0; i<5; i++){
        document.getElementById("day" + (i+1) + "Max").innerHTML = "Day: " + Number(data.list[i].main.temp_max - 273.15).toFixed(2) + "°";
    }
    //------------------------------------------------------------

    //Getting Weather Icons
    for(i = 0; i<5; i++){
        document.getElementById("img" + (i+1)).src = "http://openweathermap.org/img/wn/"+
        data.list[i].weather[0].icon
        +".png";
    }
    
    // Add a click event to each icon
    let icons = document.getElementsByClassName('icons');
    for(let i = 0; i < icons.length; i++){
        icons[i].addEventListener('click', (function(i) {
            return function() {
                // On click, change the background image
                let weather = data.list[i].weather[0].main.toLowerCase(); // Get the weather condition
                let city = document.getElementById("cityInput").value; // Get the city name
                console.log(weather)
                console.log(city)
                document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + weather + "," + city + "')";
            }
        })(i));
    }
    //------------------------------------------------------------
    //console.log(data)
    //console.log(data.list[0].main)
    // Call the showWeatherData function with the data from the API
    showWeatherData(data);



})

.catch(err => alert("Something Went Wrong: Try Checking Your Internet Coneciton"))
}

function DefaultScreen(){
    document.getElementById("cityInput").defaultValue = "London";
    GetInfo();
}


//Getting and displaying the text for the upcoming five days of the week
var d = new Date();
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];

//Function to get the correct integer for the index of the days array
function CheckDay(day){
    if(day + d.getDay() > 6){
        return day + d.getDay() - 7;
    }
    else{
        return day + d.getDay();
    }
}

    for(i = 0; i<5; i++){
        document.getElementById("day" + (i+1)).innerHTML = weekday[CheckDay(i)];
    }
    //------------------------------------------------------------


document.getElementById("cityInput").addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
         // Cancel the default action, if needed
        event.preventDefault();
        // Call the GetInfo function
        GetInfo();
    }
});

function showWeatherData (data){
    let {list} = data;
    let {main, wind} = list[0];
    let {feels_like, humidity, pressure, temp} = main;
    let {speed: wind_speed} = wind;

    // Convert temperatures from Kelvin to Celsius
    feels_like = (feels_like - 273.15).toFixed(2);
    temp = (temp - 273.15).toFixed(2);

    timezone.innerHTML = data.city.timezone;
    countryEl.innerHTML = data.city.coord.lat + 'N ' + data.city.coord.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div>Feels Like</div>
        <div>${feels_like}&#176;C</div>
    </div>
    <div class="weather-item">
        <div>Temperature</div>
        <div>${temp}&#176;C</div>
    </div>
    `;

    let otherDayForcast = ''
    list.forEach((item, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${item.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(item.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${(item.main.temp_min - 273.15).toFixed(2)}&#176;C</div>
                <div class="temp">Day - ${(item.main.temp_max - 273.15).toFixed(2)}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(item.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${(item.main.temp_min - 273.15).toFixed(2)}&#176;C</div>
                <div class="temp">Day - ${(item.main.temp_max - 273.15).toFixed(2)}&#176;C</div>
            </div>
            
            `
        }
    })

    weatherForecastEl.innerHTML = otherDayForcast;
}

var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + newName.value + '&appid=07e32e2b23e56432bdc953d6f731e2a3';


fetch(url)
    .then(response => response.json())
    .then(data => {
                    document.getElementById("day1Min").innerHTML = Math.round(data.list[0].main.temp_min - 273.15, -2);
                    document.getElementById("day2Min").innerHTML = Math.round(data.list[1].main.temp_min - 273.15, -2);
                    document.getElementById("day3Min").innerHTML = Math.round(data.list[2].main.temp_min - 273.15, -2);
                    document.getElementById("day4Min").innerHTML = Math.round(data.list[3].main.temp_min - 273.15, -2);
                    document.getElementById("day5Min").innerHTML = Math.round(data.list[4].main.temp_min - 273.15, -2);

                    document.getElementById("day1Max").innerHTML = Math.round(data.list[0].main.temp_max - 273.15, -2);
                    document.getElementById("day2Max").innerHTML = Math.round(data.list[0].main.temp_max - 273.15, -2);
                    document.getElementById("day3Max").innerHTML = Math.round(data.list[0].main.temp_max - 273.15, -2);
                    document.getElementById("day4Max").innerHTML = Math.round(data.list[0].main.temp_max - 273.15, -2);
                    document.getElementById("day5Max").innerHTML = Math.round(data.list[0].main.temp_max - 273.15, -2);

                    document.getElementById("img1").src = "http://openweathermap.org/img/w/"+
                    data.list[0].weather[0].icon
                    +".png";
                    document.getElementById("img2").src = "http://openweathermap.org/img/w/"+
                    data.list[1].weather[0].icon
                    +".png";
                    document.getElementById("img3").src = "http://openweathermap.org/img/w/"+
                    data.list[2].weather[0].icon
                    +".png";
                    document.getElementById("img4").src = "http://openweathermap.org/img/w/"+
                    data.list[3].weather[0].icon
                    +".png";
                    document.getElementById("img5").src = "http://openweathermap.org/img/w/"+
                    data.list[4].weather[0].icon
                    +".png";


                    document.getElementById("day1").innerHTML = weekday[CheckDay(0)];
                    document.getElementById("day2").innerHTML = weekday[CheckDay(1)];
                    document.getElementById("day3").innerHTML = weekday[CheckDay(2)];
                    document.getElementById("day4").innerHTML = weekday[CheckDay(3)];
                    document.getElementById("day5").innerHTML = weekday[CheckDay(4)];

                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                })
                .catch(error => console.error('Hata:', error));

