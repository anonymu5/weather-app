const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
//initially 
const apiErrorContainer = document.querySelector(".api-error-container");
let currenttab=userTab;
//d1845658f92b31c64bd94f06f7188c9c
const API_KEY="bd5e378503939ddaee76f12ad7a97608";
currenttab.classList.add("current-tab");
function switchtab(clickedtab){
    apiErrorContainer.classList.remove("active");
    if(clickedtab!=currenttab){
        currenttab.classList.remove("current-tab");
        currenttab=clickedtab;
        currenttab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click",()=>{
    switchtab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchtab(searchTab);
});
const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon}=coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //API Call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
    apiErrorContainer.classList.add("active");
    apiErrorImg.style.display = "none";
    apiErrorMessage.innerText = `Error: ${error?.message}`;
    apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}
function renderweatherinfo(weatherinfo){
    const cityname=document.querySelector("[data-cityName]");
    const countryicon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weathericon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    cityname.innerText=weatherinfo?.name;
    countryicon.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherinfo?.weather?.[0]?.description;
    weathericon.src=`http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherinfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherinfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherinfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherinfo?.clouds?.all} %`;

}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);

    }
    else{
        grantAccessBtn.style.display = "none";
    messageText.innerText = "Geolocation is not supported by this browser.";
    }
}
function showposition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantaccessbutton=document.querySelector("[data-grantAccess]");
getfromSessionStorage();
grantaccessbutton.addEventListener("click",getLocation);
const searchinput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=searchinput.value;
    if(cityname==="")
        return;
    else
        fetchsearchinfo(cityname);
        searchinput.value = "";
})
 async function fetchsearchinfo(cityName){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    apiErrorContainer.classList.remove("active");
    try{
        const response= await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderweatherinfo(data);
    }
        catch(error){
            loadingScreen.classList.remove("active");
            apiErrorContainer.classList.add("active");
            apiErrorMessage.innerText = `${error?.message}`;
            apiErrorBtn.style.display = "none";
        }
    
}