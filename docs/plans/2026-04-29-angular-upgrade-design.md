# Angular 10 → Angular 17+ Upgrade Design

**Date:** 2026-04-29
**Project:** angular-consume-api (wiki-search)
**Goal:** Eliminate 162 vulnerabilities and modernize to Angular 17+ with standalone components

## Context

### Current State
- Angular 10 (from 2020)
- 162 npm vulnerabilities (11 low, 70 moderate, 68 high, 13 critical)
- 50+ open Dependabot alerts
- 4 open Dependabot PRs (not merged)
- Classic NgModule architecture
- Karma (deprecated) for unit tests
- Protractor (deprecated) for e2e tests
- TSLint (deprecated) for linting

### App Complexity
- 3 components: AppComponent, SearchBarComponent, PageListComponent
- 1 service: WikipediaService (HTTP call to Wikipedia API)
- Simple wiki search functionality
- Uses Bulma for styling

### Environment
- Node 22.14.0
- npm 11.11.0
- macOS (darwin)

## Decision: Fresh Migration

**Rationale:** Incremental upgrade through 7 versions (10→11→12→13→14→15→16→17) would be painful. Fresh migration with code porting is cleaner and faster.

## Architecture

### Before (Angular 10)
- AppModule with declarations
- Karma for unit tests
- Protractor for e2e tests
- TSLint for linting

### After (Angular 17+)
- Standalone components (no NgModule)
- Jest for unit tests (`@angular/build:jest`)
- Cypress for e2e tests (`@angular/cypress`)
- ESLint for linting (`@angular-eslint`)
- bootstrapApplication() in main.ts

## File Structure

```
angular_consume_api/
├── src/
│   ├── app/
│   │   ├── app.component.ts          # standalone, bootstrap
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── search-bar/
│   │   │   ├── search-bar.component.ts   # standalone
│   │   │   ├── search-bar.component.html
│   │   │   ├── search-bar.component.css
│   │   ├── page-list/
│   │   │   ├── page-list.component.ts    # standalone
│   │   │   ├── page-list.component.html
│   │   │   ├── page-list.component.css
│   │   ├── wikipedia.service.ts         # unchanged
│   ├── main.ts                          # bootstrapApplication()
│   ├── index.html
│   ├── styles.css                       # keep bulma imports
├── cypress/                             # new e2e tests
├── angular.json                         # Angular 17 config
├── package.json                         # Angular 17 deps + Jest + Cypress
├── tsconfig.json                        # TypeScript 5.x config
├── eslint.config.js                     # ESLint config
```

### Files Deleted
- `app.module.ts`
- `src/polyfills.ts`
- `karma.conf.js`
- `e2e/` directory (old Protractor tests)
- `tslint.json`

## Component Migration

| Component | Changes |
|-----------|---------|
| AppComponent | Add `standalone: true`, import CommonModule, update bootstrap |
| SearchBarComponent | Add `standalone: true`, import FormsModule for event binding |
| PageListComponent | Add `standalone: true`, import CommonModule for *ngFor |
| WikipediaService | No changes (already uses providedIn: 'root') |

## Testing

### Jest (Unit Tests)
- Builder: `@angular/build:jest`
- Pattern: `*.spec.ts`
- Coverage enabled

### Cypress (E2E Tests)
- Builder: `@angular/cypress`
- Pattern: `cypress/e2e/*.cy.ts`
- Basic smoke tests: app loads, search works, results display

### Test Migration
- Update existing spec files for standalone components
- Rewrite Protractor tests as Cypress tests

## Implementation Phases

1. **Preparation**: Backup, create reference project, smoke test current app
2. **Scaffold**: Generate Angular 17 project, add Jest/Cypress/ESLint/bulma
3. **Migrate**: Copy templates/styles, convert components to standalone, update main.ts
4. **Test**: Update unit tests, write Cypress tests, verify all pass
5. **Cleanup**: Remove old files, update README, verify npm audit clean

## Success Criteria

- [ ] Angular 17+ running with standalone components
- [ ] All unit tests pass with Jest
- [ ] E2E tests pass with Cypress
- [ ] 0 npm vulnerabilities (or near-zero)
- [ ] App functionality preserved (wiki search works)
- [ ] Build succeeds (`ng build`)