import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ICity } from '../../interfaces/city';
import { ServiceWeatherService } from '../../services/service-weather.service';
import { Subscription, forkJoin } from 'rxjs';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit, OnDestroy {

  favs: ICity[] = [];
  favsSubscription: Subscription | null = null;

  constructor(public weatherSvc: ServiceWeatherService) {}

  ngOnInit(): void {
    this.favsSubscription = this.weatherSvc.favList.subscribe((favs: ICity[]) => {
      this.favs = favs;
    });
  }

  ngOnDestroy(): void {
    this.favsSubscription?.unsubscribe();
  }

  removeFromFav(id: number) {
    this.weatherSvc.removeFav(id);
  }
  sortCitiesByTemperature() {
    this.favs.sort((a, b) => {
      const tempA = a.weatherData?.current.temperature_2m ?? 0;
      const tempB = b.weatherData?.current.temperature_2m ?? 0;
      return tempA - tempB;
    });
  }
}
