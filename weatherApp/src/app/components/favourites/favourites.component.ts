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
  temperatureChart: Chart | null = null;

  @ViewChild('temperatureChartCanvas', { static: false }) temperatureChartCanvas!: ElementRef;

 

  constructor(public weatherSvc: ServiceWeatherService) {}

  ngOnInit(): void {
    this.favsSubscription = this.weatherSvc.favList.subscribe((favs: ICity[]) => {
      this.favs = favs;
      this.loadTemperaturesAndSort();
    });
  }

  ngOnDestroy(): void {
    this.favsSubscription?.unsubscribe();
  }

  removeFromFav(id: number) {
    this.weatherSvc.removeFav(id);
  }
  loadHourlyTemperature(city: ICity) {
    this.weatherSvc.getHourlyTemperature(city.latitude, city.longitude).subscribe((data) => {
      const hourlyTemps = data.hourly.temperature_2m.slice(0, 24);
      const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      this.updateTemperatureChart(labels, hourlyTemps, city.name);
    });
  }

  updateTemperatureChart(labels: string[], data: number[], cityName: string) {
    if (this.temperatureChart) {
      this.temperatureChart.destroy();
    }

    this.temperatureChart = new Chart(this.temperatureChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `Temperatura di ${cityName}`,
            data: data,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  loadTemperaturesAndSort() {
    const requests = this.favs.map(city => 
      this.weatherSvc.getWeather(city.latitude, city.longitude)
    );

    forkJoin(requests).subscribe((weatherDataArray) => {
      weatherDataArray.forEach((weather, index) => {
        const city = this.favs[index];
        city.weatherData = weather;
        city.weatherData!.current!.temperature_2m = weather?.current!.temperature_2m ?? 0;
      });
      this.sortCitiesByTemperature();
    });
  }

  sortCitiesByTemperature() {
    this.favs.sort((a, b) => {
      const tempA = a.weatherData?.current.temperature_2m ?? 0;
      const tempB = b.weatherData?.current.temperature_2m ?? 0;
      return tempA - tempB;
    });
  }
}
