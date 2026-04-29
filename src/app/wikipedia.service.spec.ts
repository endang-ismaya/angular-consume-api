import { TestBed } from '@angular/core/testing';
import { WikipediaService } from './wikipedia.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

describe('WikipediaService', () => {
  let service: WikipediaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WikipediaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(WikipediaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call Wikipedia API with correct params', () => {
    service.search('test').subscribe();

    const req = httpMock.expectOne((request) => 
      request.url === 'https://en.wikipedia.org/w/api.php'
    );

    expect(req.request.params.get('action')).toBe('query');
    expect(req.request.params.get('srsearch')).toBe('test');
  });
});