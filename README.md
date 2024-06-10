# PasMAs

The **Pas**senger **M**anagement **As**sistant (PasMAs) is an open-source web application designed to simplify the management of sightseeing flights on open days for smaller flying clubs. This assistant enables you to organize various flight slots for each plane efficiently. It supports you by handling flight logic calculations such as determining the maximum take-off mass to prevent overloaded flights. 

The application consists of both a backend and a frontend. This repository contains the code for the PasMAS frontend application. The code for the backend can be found at [https://github.com/FGK-PASMAS/FGK_PASMAS_backend](https://github.com/FGK-PASMAS/FGK_PASMAS_backend).

## Features

- Reserve and book flights with a ease!
- Get an overview of all your flights and passengers
- Get changes to all flights in real time
- Create blockers to prevent flights from being scheduled during specific time slots
- ...and more!

## Getting started 

The PasMAs frontend can be deployed either locally via Vite or on a production server via Docker. Please ensure that the backend is running when using the PasMAs frontend!

### Configuration

Before running the frontend application, you need to configure it via environment variables. Simply copy the `.env.example` file to a `.env` file, and set the correct configuration values accordingly.

### Deployment via Vite

Make sure you have an up-to-date version of [Node.js](https://nodejs.org/en) installed. Navigate to the project directory and run the following commands to install dependencies and start the development server:

```
npm install
npm run dev
```

The frontend will be accessible at http://localhost:5173 by default.

### Deployment via Docker

PasMAs comes with a docker-compose file included. Make sure you have an up-to-date version of [Docker](https://www.docker.com/) installed on your server. Navigate to the project directory and run the following commands to run the frontend application as a container:

```
docker compose up -d
```

The frontend will be accessible on port 80 of your server by default.

## Additional Notes

Please note that PasMAs is still under development but is currently not actively maintained by the original authors.
