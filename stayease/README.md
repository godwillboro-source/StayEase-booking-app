# StayEase Frontend

The React and Vite frontend for the StayEase property booking application.

## Features

- Property search and browsing
- Property and unit details
- Customer booking management
- Property manager dashboards and listings
- Administrator dashboards and moderation tools
- Role-based application routes

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Vitest and Testing Library

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
npm install
```

### Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Set `VITE_API_BASE_URL` to the API base URL:
Example

```text
VITE_API_BASE_URL=http://localhost:5000/api
```

During local development, `/api` is used when this variable is not set.

### Run the App

```bash
npm run dev
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```text
src/
├── components/  # Reusable and role-specific components
├── context/     # Authentication and booking state
├── pages/       # Customer, manager, admin, and public pages
├── routes/      # Routing and route protection
├── services/    # API requests and data normalization
└── styles/      # Global styles
tests/           # Unit and integration tests
```
