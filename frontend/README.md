# WashLab Frontend

This is the frontend application for WashLab, a dry cleaning service platform built with React and Vite.

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Firebase Authentication
- React Router
- Axios for API calls

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run Playwright tests
- `npm run lint` - Run ESLint

## Testing

This project includes:
- Playwright end-to-end tests in the `tests` directory
- Selenium tests in the root `selenium-tests` directory (see `SELENIUM_TESTING.md`)

## Project Structure

- `src/` - Main source code
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/services/` - API service files
- `tests/` - Playwright test files
- `public/` - Static assets
