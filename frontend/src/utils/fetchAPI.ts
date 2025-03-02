import { WeatherResponse, ErrorResponse } from "../types/fetchTypes";
import saveToIndexedDB from "./saveToIndexedDB";

/**
 * Converts a time in the format "hh:mm AM/PM" to a degree position on a 24-hour circle.
 * Each minute corresponds to 1/4 degree.
 * 
 * @param {string} time - The time in "hh:mm AM/PM" format.
 * @returns {number} - The position in degrees on the circle (0 to 360 degrees).
 */
function convertToDegrees(time: string): number {
    const [hour, minute, period] = time.match(/(\d+):(\d+) (\w+)/)!.slice(1);
    let hour24 = parseInt(hour, 10);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
    return (hour24 * 60 + parseInt(minute, 10)) / 4;
}

/**
 * Calculates the position of astronomical noon.
 * @param {number} sunrise - in degrees
 * @param {number} sunset - in degrees
 * @returns {number} - in degrees
 */
function getNoonInDegrees(sunrise: number, sunset: number): number {
    return (sunrise + sunset) / 2;
}

/**
 * Fetches weather forecast from WeatherAPI.
 * 
 * @param {string} location - The location for which to fetch the weather data.
 * @returns {Promise<WeatherResponse | ErrorResponse>} - The weather data or error response.
 */
export async function fetchWeather(location: string): Promise<WeatherResponse | ErrorResponse> {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    if (!API_KEY) {
        throw new Error("API key is not defined in the environment variables.");
    }

    const BASE_URL = "http://api.weatherapi.com/v1/forecast.json";
    const url = `${BASE_URL}?key=${API_KEY}&q=${location}&days=2&aqi=no&alerts=no`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        // Get Current Time
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
     
        // Get forecast for sliding 24 hours
        const todayHours = data.forecast.forecastday[0].hour.slice(currentHour);
        let next24Hours = todayHours;
        if (next24Hours.length < 24) {
            const tomorrowHours = data.forecast.forecastday[1].hour.slice(0, 24 - next24Hours.length);
            next24Hours = next24Hours.concat(tomorrowHours);
        }

        // Extract requested data
        const sunrise = convertToDegrees(data.forecast.forecastday[0].astro.sunrise);
        const sunset = convertToDegrees(data.forecast.forecastday[0].astro.sunset);
        const noonShift = getNoonInDegrees(sunrise, sunset);
        const hourlyForecast = data.forecast.forecastday[0].hour.map((hour: { temp_c: number; condition: { code: number; }; precip_mm: number; cloud: number; }) => ({
            temperature: hour.temp_c,
            condition: hour.condition.code,
            rain_mm: hour.precip_mm,
            cloudiness: hour.cloud
        }));

        return {
            sunrise: sunrise,
            sunset: sunset,
            noonShift: noonShift,
            hourlyForecast: hourlyForecast
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}

/**
 * Fetches weather forecast data and saves them to IndexedDB.
 * 
 * @returns {Promise<void>} - A promise that resolves when data is saved.
 */
export async function getWeather(): Promise<void> {
    try {
        const forecast = await fetchWeather("Prague");

        // Check if forecast has error
        if ("error" in forecast) {
            console.error("Failed to fetch weather data:", forecast.error);
            return;
        }

        // Save data to IndexedDB
        saveToIndexedDB("Weather", "Forecast", forecast);
        console.log("Data saved successfully.");
    } catch (error) {
        console.error("Error saving data:", error);
    }
}
