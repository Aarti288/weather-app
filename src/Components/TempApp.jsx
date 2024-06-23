import { useEffect,useState } from "react";
import weatherbackgroundImg from "../Assets/weather-background.jpg"

function TempApp(){
    const [city,setCity]=useState("")
    const [search,setSearch]=useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [data,setData]=useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [forecastData, setForecastData] = useState([]);

    
 

    const handleSearch=(e)=>{
        e.preventDefault();
        setCity(search);

    }
    useEffect(() => {
      fetchWeatherDataByCity(city);
    }, [city]);
    const fetchWeatherDataByCity = (city) => {
      if (city) {
        const apiKey = 'bb86078759f4f909cdf466ad36ee54ac'; 
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&cnt=5`;
  
        fetch(weatherApiUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('City not found');
            }
            return response.json();
          })
          .then(data => {
            if (data.cod === 200) {
              setWeatherData(data);
              setData(true)
              console.log("data is:",data);
              fetchForecastData(forecastApiUrl);
            } else {
              throw new Error(data.message || 'Failed to fetch weather data');
            }
          })
          .catch(error => {
            console.error('Error fetching weather data:', error.message);
            setErrorMessage(error.message);
          });
      }
    };
  
    const fetchForecastData = (url) => {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
          }
          return response.json();
        })
        .then(data => {
          if (data.cod === '200' && data.list && data.list.length >= 5) {
            const nextFourDays = data.list.slice(1, 5); // Get the next four days excluding today
            setForecastData(nextFourDays);
            console.log(forecastData);
            console.log('Forecast data:', nextFourDays);
          } else {
            throw new Error('Failed to fetch forecast data');
          }
        })
        .catch(error => {
          console.error('Error fetching forecast data:', error.message);
          setErrorMessage(error.message);
        });
    };
  

    const formatTime = (timestamp, timezone) => {
      return new Date((timestamp + timezone) * 1000).toLocaleTimeString('en-US', { timeZone: 'UTC' });
    };
  
    const formatDate = (timezone) => {
      return new Date(Date.now() + timezone * 1000).toLocaleDateString('en-US', { timeZone: 'UTC' });
    };


     return(
        <div className="h-screen flex flex-col">
          <div className="border-3 bg-blue-500 h-16 text-white flex items-center justify-center text-2xl font-bold">Weather Dashboard</div>

          <div className="flex-1 bg-gray-200 mx-4 py-2 flex">
          <div className="mx-auto w-1/2 bg-blue-200 p-4">
  <form className="flex flex-col space-y-4">
    <h2 className="text-xl font-bold">Enter a City Name</h2>
    <input
      type="text"
      className="w-full px-3 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500"
      placeholder="City name"
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
    />
    <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
      Search
    </button>
    <div className="my-4 border-b-2 border-gray-400">OR</div>
    <div className="bg-gray-500 text-sm text-white flex items-center justify-center p-3 rounded-md">
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 20h4v-2c0-2.206-1.794-4-4-4s-4 1.794-4 4v2h4zm4-10V6l-4 4-4-4v4h8z"
        ></path>
      </svg>
      Use Current Location
    </div>
  </form>
</div>
            <div className="w-1/2 bg-blue-200">
              <div className="bg-blue-500 m-12" style={{ backgroundImage: `url(${weatherbackgroundImg})`,backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',}}>
              {data ?
                (
                <>
               
                <h2 className="text-left text-xl font-bold text-white ml-10">{weatherData?.name}({formatDate(weatherData.timezone)}) ({new Date().toLocaleTimeString()})</h2>
                <div className="flex w-full space-x-4 flex m-10">
                <div className="w-1/2 text-left">
                 <p className="text-xl font-bold text-white">Temperature:{(weatherData.main.temp - 273.15).toFixed(2)} °C</p>
                 <p className="text-xl font-bold text-white">pressure:{weatherData?.main?.pressure}hpa</p>
                 <p className="text-xl font-bold text-white">Humedity:{weatherData?.main?.humidity}</p>
                 <p className="text-xl font-bold text-white">Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                 <p className="text-xl font-bold text-white">Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                 <p className="text-xl font-bold text-white">Visibility: {weatherData.visibility / 1000} km</p>
          <p className="text-xl font-bold text-white">Wind: {weatherData.wind.speed} m/s at {weatherData.wind.deg}°</p>
          <p className="text-xl font-bold text-white">Cloudiness: {weatherData.clouds.all}%</p>
                  </div>
                <div className="w-1/2">
                <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="weather icon" />
                <div>{weatherData.weather[0].description}</div>

                </div>
                </div>
               
                </>
              ):null}
             
              </div>
              <div className="flex bg-blue-500 m-10">
              {forecastData.map((forecast, index) => (
    <div key={index} className="flex-1 bg-gray-300 p-4 m-2">
      <p className="text-xl font-bold">{new Date(forecast.dt * 1000).toLocaleDateString()}</p>
      <img src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} alt="weather icon" className="mx-auto" />
      <p className="text-lg">{forecast.weather[0].description}</p>
      <p className="text-lg">Temperature: {forecast.main.temp} K</p>
      <p className="text-lg">Humidity: {forecast.main.humidity}%</p>
    </div>
  ))}
               {/* <div className="flex-1 bg-gray-300 p-4 m-2">2</div>
               <div  className="flex-1 bg-gray-300 p-4 m-2">3</div>
               <div  className="flex-1 bg-gray-300 p-4 m-2">4</div> */}

              </div>
            </div>
          </div>
        </div>
     )
}
export default TempApp;