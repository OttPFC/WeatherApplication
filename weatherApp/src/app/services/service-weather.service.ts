import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { ITemperature } from '../interfaces/temperature';
import { IApiResponse, ICity } from '../interfaces/city';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ServiceWeatherService {
  
  private city = new BehaviorSubject<ICity[]>([]);
  private weather = new BehaviorSubject<ITemperature[]>([]);
  private fav: ICity[] = [];
  
  cities$ = this.city.asObservable();
  weathers$ = this.weather.asObservable();

  constructor(private http: HttpClient) {
    this.loadFavoritesFromLocalStorage();
  }

  
  getCity(name: string): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${environment.baseGeocodingURL}?name=${name}&count=10&language=en&format=json`);
  }

  getWeather(latitude: number, longitude: number): Observable<ITemperature> {
    return this.http.get<ITemperature>(`${environment.temperatureURL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
  }
  getHourlyTemperature(latitude: number, longitude: number): Observable<any> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
    return this.http.get(url);
  }
  
  addFav(cityFav: ICity) {
    const city = this.fav.find(f => f.id === cityFav.id);
    if (!city) {
      this.fav.push(cityFav);
      this.updateLocalStorage();
    }
  }

  removeFav(id: number) {
    const index = this.fav.findIndex(f => f.id === id);
    if (index > -1) {
      this.fav.splice(index, 1);
      this.updateLocalStorage();
    }
  }

  isFav(id: number) {
    return !!this.fav.find(f => f.id === id);
  }

  get favList(): Observable<ICity[]> {
    return new Observable((obs: Observer<ICity[]>) => {
      obs.next(this.fav);
    });
  }

  private updateLocalStorage() {
    localStorage.setItem('favoriteCities', JSON.stringify(this.fav));
  }

  private loadFavoritesFromLocalStorage() {
    const storedFavorites = localStorage.getItem('favoriteCities');
    if (storedFavorites) {
      this.fav = JSON.parse(storedFavorites);
    }
  }
}
