export type HourlyForecast = {
  temperature: number;
  condition: number;
  rain_mm: number;
  cloudiness: number;
};

export type WeatherResponse = {
  sunrise: number;
  sunset: number;
  noonShift: number;
  hourlyForecast: HourlyForecast[];
};

export type ErrorResponse = {
  error: string;
};