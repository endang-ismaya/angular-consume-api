import { TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SearchBarComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should emit search term on submit', () => {
    const fixture = TestBed.createComponent(SearchBarComponent);
    const component = fixture.componentInstance;
    component.term = 'angular';
    
    let emittedTerm = '';
    component.submitted.subscribe((term) => emittedTerm = term);
    
    component.onFormSubmit(new Event('submit'));
    expect(emittedTerm).toBe('angular');
  });
});