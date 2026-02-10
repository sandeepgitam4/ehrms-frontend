# HRMS Lite - Frontend

Employee Management System Frontend built with Angular.

## Features
- Dashboard with statistics
- Employee Management
- Attendance Tracking
- Responsive Design
- Toast Notifications

## Tech Stack
- Angular 21
- TypeScript
- RxJS
- Standalone Components

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `src/app/services/api.service.ts`

3. Run development server:
```bash
ng serve
```

4. Build for production:
```bash
ng build
```

## Environment Configuration

Update the `apiUrl` in `src/app/services/api.service.ts` to point to your backend API.

## Deployment

The app can be deployed to any static hosting service (Vercel, Netlify, Railway, etc.)

Build output is in `dist/ehrmsui/browser/` directory.
