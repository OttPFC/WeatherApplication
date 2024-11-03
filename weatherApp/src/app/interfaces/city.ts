import { ITemperature } from "./temperature";

export interface ICity {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    timezone: string,
    population: number,
    country: string,
    admin1:string
    weatherData?: ITemperature
}

export interface IApiResponse {
    results: ICity[];           
    generationtime_ms: number;  
}