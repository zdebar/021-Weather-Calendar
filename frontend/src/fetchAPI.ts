const fetchWeather = async (location: string) => {
  const API_KEY = "YOUR_API_KEY"; // Replace with your actual WeatherAPI key
  const BASE_URL = "http://api.weatherapi.com/v1/forecast.json";

  const url = `${BASE_URL}?key=${API_KEY}&q=${location}&days=1&aqi=no&alerts=no`;

  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      const { sunrise, sunset } = data.forecast.forecastday[0].astro;
      const hourlyForecast = data.forecast.forecastday[0].hour.map((hour: any) => ({
          time: hour.time,
          temp_c: hour.temp_c,
          condition: hour.condition.text
      }));

      console.log("Sunrise:", sunrise);
      console.log("Sunset:", sunset);
      console.log("24-Hour Forecast:", hourlyForecast);
  } catch (error) {
      console.error("Error fetching weather data:", error);
  }
};

// Call function with desired location
fetchWeather("Prague");

