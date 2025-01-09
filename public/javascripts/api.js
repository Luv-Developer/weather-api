const city = document.getElementById("city")
const button = document.getElementById("submit")
const cityname = document.getElementById("cityname")
const citytime = document.getElementById("citytime")
const citytemp = document.getElementById("citytemp")
function getdata(city){
    return new Promise(async(resolve,reject)=>{
        let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=ec5b58a0f5b045d1b7e123216250601&q=${city.value}&aqi=yes`)
        let data = await response.json()
        cityname.innerText = `${data.location.name} , ${data.location.region} , ${data.location.country}`
        citytime.innerText = `Time is ${data.location.localtime}`
        citytemp.innerText = `Temperature is ${data.current.temp_c}°C`
        console.log(data)
    })
}
button.addEventListener("click",()=>{
    getdata(city)
})