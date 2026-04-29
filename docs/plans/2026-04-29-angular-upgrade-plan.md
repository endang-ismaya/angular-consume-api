# Angular 10 → Angular 17+ Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade Angular wiki-search app from v10 to v17+ with standalone components, eliminating all npm vulnerabilities.

**Architecture:** Fresh migration approach - scaffold new Angular 17 project, copy source code, convert to standalone components, replace deprecated Karma/Protractor with Jest/Cypress.

**Tech Stack:** Angular 17+, TypeScript 5.x, Jest, Cypress, ESLint, Bulma CSS

---

## Prerequisites

- Node 22.x installed (verified: v22.14.0)
- npm 11.x installed (verified: 11.11.0)
- Current project state backed up

---

### Task 1: Backup Current State

**Files:**
- None (git operation)

**Step 1: Create backup branch**

```bash
git checkout -b backup-angular10
git push origin backup-angular10
```

**Step 2: Return to master and verify status**

```bash
git checkout master
git status
```

Expected: `On branch master, nothing to commit`

**Step 3: Commit backup**

```bash
git add docs/plans/
git commit -m "docs: add Angular upgrade design and plan"
```

---

### Task 2: Generate Angular 17 Project (Temporary)

**Files:**
- None (temporary reference project)

**Step 1: Create temp directory**

```bash
mkdir -p /tmp/ng17-reference
```

**Step 2: Generate Angular 17 project**

```bash
cd /tmp/ng17-reference
npx @angular/cli@17 new wiki-search --standalone --routing=false --style=css --skip-tests --skip-git --skip-install
```

Expected: Project created successfully

**Step 3: Install dependencies in reference project**

```bash
cd /tmp/ng17-reference/wiki-search
npm install
```

---

### Task 3: Copy Angular 17 Config Files

**Files:**
- Copy: `angular.json` → `/Volumes/eimdata/devs/ws_angular/angular_consume_api/angular.json`
- Copy: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json` → project root
- Copy: `package.json` → project root (will modify)

**Step 1: Backup old config files**

```bash
cd /Volumes/eimdata/devs/ws_angular/angular_consume_api
mkdir -p .backup-angular10
cp angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json package.json package-lock.json .backup-angular10/
```

**Step 2: Copy new config files**

```bash
cp /tmp/ng17-reference/wiki-search/angular.json /Volumes/eimdata/devs/ws_angular/angular_consume_api/angular.json
cp /tmp/ng17-reference/wiki-search/tsconfig.json /Volumes/eimdata/devs/ws_angular/angular_consume_api/tsconfig.json
cp /tmp/ng17-reference/wiki-search/tsconfig.app.json /Volumes/eimdata/devs/ws_angular/angular_consume_api/tsconfig.app.json
cp /tmp/ng17-reference/wiki-search/tsconfig.spec.json /Volumes/eimdata/devs/ws_angular/angular_consume_api/tsconfig.spec.json
```

**Step 3: Copy package.json (modify to add dependencies)**

```bash
cp /tmp/ng17-reference/wiki-search/package.json /Volumes/eimdata/devs/ws_angular/angular_consume_api/package.json
```

---

### Task 4: Update Package.json with Required Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Add Bulma and test dependencies**

Edit `package.json` to add:

```json
{
  "dependencies": {
    "bulma": "^0.9.4"
  },
  "devDependencies": {
    "@angular-eslint/builder": "^17.0.0",
    "@angular-eslint/eslint-plugin": "^17.0.0",
    "@angular-eslint/eslint-plugin-template": "^17.0.0",
    "@angular-eslint/template-parser": "^17.0.0",
    "eslint": "^8.57.0"
  }
}
```

Note: Jest and Cypress will be configured via angular.json builders, not as npm dependencies in Angular 17.

**Step 2: Install dependencies**

```bash
cd /Volumes/eimdata/devs/ws_angular/angular_consume_api
rm -rf node_modules package-lock.json
npm install
```

Expected: Clean install with 0 vulnerabilities

---

### Task 5: Convert AppComponent to Standalone

**Files:**
- Modify: `src/app/app.component.ts`
- Modify: `src/app/app.component.html`
- Modify: `src/app/app.component.css`

**Step 1: Update app.component.ts**

```typescript
import { Component } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PageListComponent } from './page-list/page-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchBarComponent, PageListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pages: any[] = [];

  onSearch(term: string) {
    // Will be connected to WikipediaService in later task
    this.pages = [];
  }
}
```

**Step 2: Update app.component.html (keep existing)**

Read existing template - should remain unchanged:

```html
<app-search-bar (submitted)="onSearch($event)"></app-search-bar>
<app-page-list [pages]="pages"></app-page-list>
```

**Step 3: Keep app.component.css (empty, unchanged)**

---

### Task 6: Convert SearchBarComponent to Standalone

**Files:**
- Modify: `src/app/search-bar/search-bar.component.ts`
- Modify: `src/app/search-bar/search-bar.component.html`
- Modify: `src/app/search-bar/search-bar.component.css`

**Step 1: Update search-bar.component.ts**

```typescript
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() submitted = new EventEmitter<string>();
  term = '';

  onFormSubmit(event: Event) {
    event.preventDefault();
    this.submitted.emit(this.term);
  }
}
```

**Step 2: Update search-bar.component.html**

```html
<form (ngSubmit)="onFormSubmit($event)">
  <input 
    type="text" 
    [(ngModel)]="term" 
    name="term" 
    placeholder="Search Wikipedia..."
    class="input"
  >
  <button type="submit" class="button is-primary">Search</button>
</form>
```

**Step 3: Keep search-bar.component.css (empty, unchanged)**

---

### Task 7: Convert PageListComponent to Standalone

**Files:**
- Modify: `src/app/page-list/page-list.component.ts`
- Modify: `src/app/page-list/page-list.component.html`
- Modify: `src/app/page-list/page-list.component.css`

**Step 1: Update page-list.component.ts**

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent {
  @Input() pages: any[] = [];
}
```

**Step 2: Update page-list.component.html**

```html
<div class="columns is-multiline">
  <div *ngFor="let page of pages" class="column is-one-third">
    <div class="card">
      <div class="card-content">
        <p class="title">{{ page.title }}</p>
        <p class="snippet">{{ page.snippet }}</p>
      </div>
    </div>
  </div>
</div>
```

**Step 3: Add minimal styling to page-list.component.css**

```css
.snippet {
  font-size: 0.9em;
  color: #666;
}
```

---

### Task 8: Update WikipediaService

**Files:**
- Modify: `src/app/wikipedia.service.ts`

**Step 1: Update WikipediaService (minimal changes)**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {
  constructor(private http: HttpClient) {}

  search(term: string): Observable<any> {
    return this.http.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        list: 'search',
        utf8: '1',
        srsearch: term,
        origin: '*'
      }
    });
  }
}
```

---

### Task 9: Update AppComponent to Use WikipediaService

**Files:**
- Modify: `src/app/app.component.ts`

**Step 1: Connect WikipediaService**

```typescript
import { Component } from '@angular/core';
import { WikipediaService } from './wikipedia.service';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PageListComponent } from './page-list/page-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchBarComponent, PageListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pages: any[] = [];

  constructor(private wikipediaService: WikipediaService) {}

  onSearch(term: string) {
    this.wikipediaService.search(term).subscribe((response: any) => {
      this.pages = response.query?.search || [];
    });
  }
}
```

---

### Task 10: Update main.ts for Standalone Bootstrap

**Files:**
- Modify: `src/main.ts`

**Step 1: Update main.ts with bootstrapApplication**

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient()
  ]
}).catch((err) => console.error(err));
```

---

### Task 11: Update index.html

**Files:**
- Modify: `src/index.html`

**Step 1: Update index.html for standalone**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>WikiSearch</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

---

### Task 12: Add Bulma to styles.css

**Files:**
- Modify: `src/styles.css`

**Step 1: Import Bulma**

```css
@import 'bulma/css/bulma.min.css';

/* Add minimal app styles */
body {
  padding: 20px;
}
```

---

### Task 13: Update angular.json for Jest and Cypress

**Files:**
- Modify: `angular.json`

**Step 1: Update test builder to use Jest**

In `angular.json`, find the `test` architect and update:

```json
"test": {
  "builder": "@angular/build:jest",
  "options": {
    "polyfills": ["zone.js", "zone.js/testing"],
    "tsConfig": "tsconfig.spec.json",
    "include": ["**/*.spec.ts"]
  }
}
```

**Step 2: Add e2e configuration for Cypress**

Add after the test section:

```json
"e2e": {
  "builder": "@angular/cypress:cypress",
  "options": {
    "devServerTarget": "wiki-search:serve",
    "cypressConfig": "cypress.config.ts",
    "testingType": "e2e"
  },
  "configurations": {
    "production": {
      "devServerTarget": "wiki-search:serve:production"
    }
  }
}
```

---

### Task 14: Remove Deprecated Files

**Files:**
- Delete: `src/app/app.module.ts`
- Delete: `src/polyfills.ts`
- Delete: `karma.conf.js`
- Delete: `tslint.json`
- Delete: `e2e/` directory (old Protractor tests)
- Delete: `src/test.ts` (will be replaced)

**Step 1: Delete deprecated files**

```bash
cd /Volumes/eimdata/devs/ws_angular/angular_consume_api
rm -f src/app/app.module.ts
rm -f src/polyfills.ts
rm -f karma.conf.js
rm -f tslint.json
rm -rf e2e/
rm -f src/test.ts
```

**Step 2: Verify deletion**

```bash
ls -la src/app/
```

Expected: No `app.module.ts`

---

### Task 15: Create Cypress Configuration

**Files:**
- Create: `cypress.config.ts`
- Create: `cypress/support/e2e.ts`
- Create: `cypress/e2e/app.cy.ts`

**Step 1: Create cypress.config.ts**

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts'
  }
});
```

**Step 2: Create cypress/support/e2e.ts**

```typescript
// Cypress support file
```

**Step 3: Create cypress/e2e/app.cy.ts**

```typescript
describe('WikiSearch App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the app title', () => {
    cy.get('app-search-bar').should('exist');
    cy.get('app-page-list').should('exist');
  });

  it('should have a search input', () => {
    cy.get('input').should('have.attr', 'placeholder', 'Search Wikipedia...');
  });

  it('should search and display results', () => {
    cy.get('input').type('angular');
    cy.get('button').click();
    // Wait for API response
    cy.wait(2000);
    cy.get('app-page-list .card').should('have.length.greaterThan', 0);
  });
});
```

---

### Task 16: Update Unit Tests for Standalone Components

**Files:**
- Modify: `src/app/app.component.spec.ts`
- Modify: `src/app/wikipedia.service.spec.ts`
- Modify: `src/app/search-bar/search-bar.component.spec.ts`
- Modify: `src/app/page-list/page-list.component.spec.ts`

**Step 1: Update app.component.spec.ts**

```typescript
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have empty pages initially', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.pages.length).toBe(0);
  });
});
```

**Step 2: Update wikipedia.service.spec.ts**

```typescript
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
```

**Step 3: Update search-bar.component.spec.ts**

```typescript
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
```

**Step 4: Update page-list.component.spec.ts**

```typescript
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
```

---

### Task 17: Install and Run Tests

**Files:**
- None (command execution)

**Step 1: Run unit tests**

```bash
cd /Volumes/eimdata/devs/ws_angular/angular_consume_api
npm test
```

Expected: All tests pass

**Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds

**Step 3: Run dev server to test manually**

```bash
npm start
```

Expected: App runs on http://localhost:4200, wiki search works

---

### Task 18: Run Cypress E2E Tests

**Files:**
- None (command execution)

**Step 1: Install Cypress dependencies**

```bash
cd /Volumes/eimdata/devs/ws_angular/angular_consume_api
npx cypress install
```

**Step 2: Run e2e tests**

```bash
npm run e2e
```

Expected: Cypress tests pass

---

### Task 19: Verify Vulnerabilities Fixed

**Files:**
- None (command execution)

**Step 1: Run npm audit**

```bash
npm audit --registry https://registry.npmjs.org
```

Expected: 0 vulnerabilities

**Step 2: Run npm audit fix if needed**

```bash
npm audit fix --registry https://registry.npmjs.org
```

---

### Task 20: Final Commit and Cleanup

**Files:**
- None (git operation)

**Step 1: Remove backup folder**

```bash
rm -rf .backup-angular10
```

**Step 2: Remove temp reference project**

```bash
rm -rf /tmp/ng17-reference
```

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: upgrade Angular 10 to Angular 17+ with standalone components

- Converted all components to standalone architecture
- Removed AppModule, Karma, Protractor, TSLint
- Added Jest for unit tests
- Added Cypress for e2e tests
- Updated all dependencies to Angular 17+
- Eliminated 162 npm vulnerabilities"
```

**Step 4: Push to remote**

```bash
git push origin master
```

---

## Success Criteria Checklist

Run these commands to verify completion:

```bash
# 1. Build succeeds
npm run build

# 2. Unit tests pass
npm test

# 3. E2E tests pass (manual verification)
npm run e2e

# 4. No vulnerabilities
npm audit --registry https://registry.npmjs.org

# 5. Dev server works
npm start
# Manual: Search for "angular" and verify results appear
```

---

## Notes

- If npm audit shows remaining vulnerabilities, check if they're in dev dependencies only
- Jest configuration in Angular 17 uses `@angular/build:jest` builder, not standalone Jest
- Cypress tests require the dev server to be running (handled by `@angular/cypress` builder)
- Bulma styling should render search bar and results cards correctly