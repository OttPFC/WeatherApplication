import { Component, OnInit } from '@angular/core';
import { ServiceWeatherService } from '../../services/service-weather.service';
import { IApiResponse, ICity } from '../../interfaces/city';
import { ITemperature } from '../../interfaces/temperature';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']  
})
export class HomeComponent implements OnInit {

  city: ICity[] = [];  
  cityName: string = '';
  cityFav: ICity[] = [];

  constructor(private weatherSvc: ServiceWeatherService) { }

  ngOnInit(): void {
    this.getCity('Venice');
    this.loadFavorites();  
  }

  
  loadFavorites() {
    this.weatherSvc.favList.subscribe(favorites => {
      this.cityFav = favorites;
    });
  }

  getCity(name: string) {
    this.weatherSvc.getCity(name).subscribe(data => {
      this.city = data.results; 
      this.city.forEach((city: ICity) => {
        this.getWeather(city);
      });
    });
  }

  getWeather(city: ICity) {
    this.weatherSvc.getWeather(city.latitude, city.longitude).subscribe(weather => {
      city.weatherData = weather;
    });
  }

  addToFavs(city: ICity) {
    this.weatherSvc.addFav(city);
    this.loadFavorites();
  }

  removeFromFavs(id: number) {
    this.weatherSvc.removeFav(id);
    this.loadFavorites();
  }

  isFav(id: number): boolean {
    return this.weatherSvc.isFav(id);
  }
}
