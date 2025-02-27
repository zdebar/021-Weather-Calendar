type HourlyForecast = {
    temperature: number;
    condition: number;
    rain_mm: number;
    cloudiness: number;
};

type WeatherResponse = {
    sunrise: number;
    sunset: number;
    noonShift: number;
    hourlyForecast: HourlyForecast[];
};

type ErrorResponse = {
    error: string;
};

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
 * Calculates the position of astronomical noon
 * @param {number} sunrise - in degrees
 * @param {number} sunset - in degrees
 * @returns {number} - in degrees
 */
function getNoonShift(sunrise: number, sunset: number): number {
    return (sunrise + sunset) / 2;
}

export default async function fetchWeather(location: string): Promise<WeatherResponse | ErrorResponse> {
    const API_KEY = process.env.WEATHER_API_KEY;
    if (!API_KEY) {
        throw new Error("API key is not defined in the environment variables.");
    }

    const BASE_URL = "http://api.weatherapi.com/v1/forecast.json";
    const url = `${BASE_URL}?key=${API_KEY}&q=${location}&days=1&aqi=no&alerts=no`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        const sunrise = convertToDegrees(data.forecast.forecastday[0].astro.sunrise);
        const sunset = convertToDegrees(data.forecast.forecastday[0].astro.sunset);
        const hourlyForecast = data.forecast.forecastday[0].hour.map((hour: { temp_c: number; condition: { code: number; }; precip_mm: number; cloud: number; }) => ({
            temperature: hour.temp_c,
            condition: hour.condition.code,
            rain_mm: hour.precip_mm,
            cloudiness: hour.cloud // as percentage cover
        }));

        return {
            sunrise: sunrise,
            sunset: sunset,
            noonShift: getNoonShift(sunrise, sunset),
            hourlyForecast: hourlyForecast
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}

console.log(await fetchWeather("Prague"))