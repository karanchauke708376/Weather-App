
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grand-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grandAccess]");
const searchInput = document.querySelector("[data-searchInput]");
const CityNotFound = document.querySelector("[HandleErrorCity]");



// Initially variable Need ?
let oldTab = userTab;
const API_KEY = '7aa80c4c32a14b2b932a38c4d166f8af';
// const API_KEY = 'd1845658f92b31c64bd94f06f7188c9c'; Love Bhaiya API 

oldTab.classList.add('current-Tab');
getfromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove('current-Tab');
        oldTab = newTab;
        oldTab.classList.add('current-Tab');


        if(!searchForm.classList.contains('active')) {
            // kya search form wala container is invisible , if yes then make it visible
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        } else {
            // main pehle search wale tab par tha , ab your weather tab visible karna h
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            // ab mai your weather tab mai aaya hoo , toh weather bhi display karna padega , so let's check local storage first
            // for co-ordinate, if we haved saved them there.
            getfromSessionStorage();
        }

    }
}

userTab.addEventListener('click' , () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
})

searchTab.addEventListener('click' , () => {
    // Pass clicked tab as input parameter
    switchTab(searchTab);
})

// check if co-ordinate are already present in session storage
function getfromSessionStorage() {
        const localCoordinates = sessionStorage.getItem('user-coordinates');
        if(!localCoordinates) {
            // agar local coordinates nhi mile
            grantAccessContainer.classList.add("active");
        } else {
            const coordinates = JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove('active');
    // make loader visible 
    loadingScreen.classList.add('active');


// API Call 
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err) {
        
        loadingScreen.classList.remove('active');
        // hw
        console.log('Please Try Later . . . . ');
        
    }
}

function renderWeatherInfo(WeatherInfo) {
    // firstly , we have to to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-WeatherDesc]");
    const weatherIcon = document.querySelector("[data-WeatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch value from weatherinfo object and put it UI element

    console.log(WeatherInfo);

    cityName.innerText = WeatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${WeatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = WeatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${WeatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${WeatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${WeatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${WeatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${WeatherInfo?.clouds?.all} %`;

}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } 
    else {
        console.log("Please Give Me Access Allow Yes Location External");
    }
}
function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates' , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


grantAccessButton.addEventListener('click' , getLocation);

searchForm.addEventListener("submit" , (e) => {
        e.preventDefault();
        let cityName = searchInput.value;

        if(cityName === "")
        return;
    else 
    fetchSearchWeatherInfo(cityName);

})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        userInfoContainer.classList.remove("active");
        CityNotFound.classList.add("active");
        
        Console.log("City Not Found");


    }
} 