import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Clear from "./clear.png";
import cloud from './cloud.png';
import dizzle from './drizzle.png';
import rain from './rain.png';
import snow from './snow.png';
import './WeatherSty.css'

const WeatherComp = () => {

  const [city, setcity] = useState("Mumbai")
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState("")  // State to store error message
  const inpRef = useRef()

  const allIcons = {
    "01d" : Clear,
    "01n" : Clear,
    "02d" : cloud,
    "02n" : cloud,
    "03d" : cloud,
    "03n" : cloud,
    "04d" : dizzle,
    "04n" : dizzle,
    "09d" : rain,
    "09n" : rain,
    "10d" : rain,
    "10n" : rain,
    "13d" : snow,
    "13n" : snow,
  }

  const getWindDirection = (degrees) => {
    if (degrees >= 337.5 || degrees < 22.5) return 'N';
    if (degrees >= 22.5 && degrees < 67.5) return 'NE';
    if (degrees >= 67.5 && degrees < 112.5) return 'E';
    if (degrees >= 112.5 && degrees < 157.5) return 'SE';
    if (degrees >= 157.5 && degrees < 202.5) return 'S';
    if (degrees >= 202.5 && degrees < 247.5) return 'SW';
    if (degrees >= 247.5 && degrees < 292.5) return 'W';
    if (degrees >= 292.5 && degrees < 337.5) return 'NW';
    return ''; 
  };

  const FeatchWeather = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`)
      console.log(response.data)
      const icon = allIcons[response.data.weather[0].icon] || Clear;
      setWeather({
        Tempe: Math.floor(response.data.main.temp),
        FeelsLike: Math.floor(response.data.main.feels_like), 
        MaxTemp: Math.floor(response.data.main.temp_max), 
        MinTemp: Math.floor(response.data.main.temp_min),
        Humidity: response.data.main.humidity,
        WindSpeed: response.data.wind.speed,
        WindDirection: response.data.wind.deg,
        Country: response.data.sys.country,
        icon : icon
      })
    } catch (err) {
      console.error("Error fetching weather data", err);
      setError("Failed to fetch weather data. Please try again!"); // Error if API call fails
    }
  }
  

  useEffect(() => {
    FeatchWeather(city)
  }, [city])

  const search = () => {
    const newCity = inpRef.current.value.trim();
    if (!newCity) {
      setError("City name cannot be empty!");  // Show error if input is empty
      return;
    }
    setError("");  // Clear error if input is valid
    setcity(newCity);
    inpRef.current.value = "";
  }

  return (
    <>
      <div className='Container'>
        <div className='ContentContainer'>

          <div className='SearchBox'>
            <input ref={inpRef} type="text" placeholder='Search by City' />
            <button onClick={search}>Search</button>
          </div>

          {error && <p className="error">{error}</p>} {/* Show error message if exists */}

          {
            weather ? <div className='Main'>
              <div className='imageTemp'>
                <div className='imageContainer'>
                  <span>{weather.Country}</span> 
                  <img src={weather.icon} alt="Img" />
                  <p>{city}</p> 
                </div>
                <div className='Temp'>
                  <p>{weather.Tempe} <sup>o</sup>c</p> 
                  <div>
                    Feels Like : {weather.FeelsLike} <sup>o</sup>c
                  </div>
                  <div>
                    Max : {weather.MaxTemp} <sup>o</sup>c
                  </div>
                  <div>
                    Min : {weather.MinTemp} <sup>o</sup>c
                  </div>
                </div>
              </div>
              <hr style={{margin: "5px 0px"}} />
              <div className="windHumidity">
                <div className='Hum'>
                  Humidity: {weather.Humidity}
                </div>
                <div className='Wind'>
                  <h2>Wind</h2>
                  <p>Wind Direction: {getWindDirection(weather.WindDirection)}</p>
                  <p>Wind Speed: {weather.WindSpeed} M/s</p>
                </div>
              </div>
            </div> :
              <p>Loading...</p> 
          }
        </div>
      </div>
    </>
  )
}

export default WeatherComp
