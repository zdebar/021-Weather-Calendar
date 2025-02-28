import { WeatherResponse, ErrorResponse } from "../types/fetchTypes";
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import saveJsonToFile from "./saveJsonToFile";
import saveToIndexedDB from "./saveToIndexedDB";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
console.log(process.env.WEATHER_API_KEY);


/**
 * Converts a time in the format "hh:mm AM/PM" to a degree position on a 24-hour circle.
 * Each minute corresponds to 1/4 degree.
 * 
 * @param {string} time - The time in "hh:mm AM/PM" format.
 * @returns {number} - The position in degrees on the circle (0 to 360 degrees).
 */
export function convertToDegrees(time: string): number {
    const [hour, minute, period] = time.match(/(\d+):(\d+) (\w+)/)!.slice(1);
    let hour24 = parseInt(hour, 10);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
    return (hour24 * 60 + parseInt(minute, 10)) / 4;
}

/**
 * Calculates the position of astronomical noon
 * @param {number} sunrise - in degrees
 * @param {number} sunset - in degrees
 * @returns {number} - in degrees
 */
export function getNoonInDegrees(sunrise: number, sunset: number): number {
    return (sunrise + sunset) / 2;
}

export default async function fetchWeather(location: string): Promise<WeatherResponse | ErrorResponse> {
    const API_KEY = process.env.WEATHER_API_KEY;
    if (!API_KEY) {
        throw new Error("API key is not defined in the environment variables.");
    }

    const BASE_URL = "http://api.weatherapi.com/v1/forecast.json";
    const url = `${BASE_URL}?key=${API_KEY}&q=${location}&days=2&aqi=no&alerts=no`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        // Získání současného času
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
     
        const todayHours = data.forecast.forecastday[0].hour.slice(currentHour);
        let next24Hours = todayHours;

        if (next24Hours.length < 24) {
            const tomorrowHours = data.forecast.forecastday[1].hour.slice(0, 24 - next24Hours.length);
            next24Hours = next24Hours.concat(tomorrowHours);
        }

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

const forecast = await fetchWeather("Prague");
console.log(forecast);

// async function saveData() {
//     try {
//         const savePath = "../assets/test/forecast.json";
//         saveJsonToFile(savePath, forecast);
//         saveToIndexedDB("Weather", "Forecast", forecast);
//         console.log("Data saved successfully.");
//     } catch (error) {
//         console.error("Error saving data:", error);
//     }
// };

// saveData();