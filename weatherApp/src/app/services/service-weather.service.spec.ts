import { TestBed } from '@angular/core/testing';

import { ServiceWeatherService } from './service-weather.service';

describe('ServiceWeatherService', () => {
  let service: ServiceWeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceWeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
