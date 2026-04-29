import { TestBed } from '@angular/core/testing';
import { PageListComponent } from './page-list.component';

describe('PageListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageListComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PageListComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display pages when provided', () => {
    const fixture = TestBed.createComponent(PageListComponent);
    const component = fixture.componentInstance;
    component.pages = [
      { title: 'Test Page', snippet: 'Test snippet' }
    ];
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('.title').textContent).toContain('Test Page');
  });
});