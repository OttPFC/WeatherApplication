interface IHourlyUnits {
    time: string;
    temperature_2m: string;
    precipitation_probability: string;
    rain: string;
    snowfall: string;
    weather_code: string;
}

interface IHourly {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    rain: number[];
    snowfall: number[];
    weather_code: number[];
    relative_humidity_2m:number[];
}

interface IDailyUnits {
    time: string;
    weather_code: string;
    sunrise: string;
    sunset: string;
}

interface IDaily {
    time: string[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
}

interface ICurrentUnits {
    time: string;
    interval: string;
    is_day: number;  
}

interface ICurrent {
    time: string;
    interval: number;
    relative_humidity_2m:number;
    temperature_2m:number;
    weather_code:number;
    wind_speed_10m:number;
}

export interface ITemperature {
    latitude: number;
    longitude: number;
    timezone: string;
    elevation: number;
    current_units: ICurrentUnits;  
    current: ICurrent; 
    hourly_units: IHourlyUnits;
    hourly: IHourly;
    daily_units: IDailyUnits;
    daily: IDaily;
}


