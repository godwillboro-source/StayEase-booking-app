# StayEase

StayEase is a property booking application for apartments and rooms in Kenya. It provides separate experiences for customers, property managers, and administrators.

## Features

### Customers

- Search and browse properties
- Filter properties by location and other details
- View property units and booking availability
- Create and manage bookings
- View booking status and cancellation history

### Property Managers

- Create and edit properties
- Manage individual rooms or units
- Add property details, amenities, and prices
- Review and update customer bookings

### Administrators

- Review property managers
- Manage properties and cities
- View bookings across the platform
- Moderate platform users

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
cd stayease
npm install
```

### Environment Configuration

Create a local environment file:

```bash
cp .env.example .env
```

Set `VITE_API_BASE_URL` to the base URL of your API:

```text
VITE_API_BASE_URL=http://localhost:5000/api
```

Without `VITE_API_BASE_URL`, local development uses `/api` and production builds use the configured hosted API.

### Run the Development Server

```bash
npm run dev
```

Open the URL shown by Vite, usually `http://localhost:5173`.

## Available Scripts

Run these commands from the `stayease` directory:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```text
stayease/
├── src/
│   ├── components/   # Shared and role-specific UI components
│   ├── context/      # Authentication and booking state
│   ├── pages/        # Public, customer, manager, and admin pages
│   ├── routes/       # Application routes and route protection
│   ├── services/     # API and data service modules
│   └── styles/       # Global styles
├── tests/            # Unit and integration tests
└── public/           # Static public assets
```

## Team

- Godwill Boro
- Margaret Miranda
- John Brian Waweru
- Douglas Wachira
- Michael Mwangi
- Ken Njoroge