## Uber Clone – Full Stack Project

End-to-end ride-hailing app with a Node.js/Express backend, MongoDB, Socket.io realtime, and a React + Vite frontend.

### Monorepo Structure
- `Backend/` — API server, database models, services, sockets, and docs
  - `controllers/`, `routes/`, `models/`, `services/`, `middlewares/`, `db/`
  - `docs/` — Detailed API docs per domain (users, captains, maps, rides)
- `frontend/` — React app (Vite, TailwindCSS, React Router, Socket.io client)

---

## Prerequisites
- Node.js 18+ and npm
- MongoDB (Atlas or local)
- Google Maps API key (Geocoding + Distance Matrix + Places Autocomplete)

---

## Environment Variables
Create a `.env` file inside `Backend/`.

Required keys:
- `PORT` — API port (default: 3000)
- `DB_CONNECT` — Mongo connection string
- `JWT_SECRET` — Secret for signing JWTs
- `GOOGLE_MAPS_API` — Server-side Google Maps API key

Example (`Backend/.env`):
```
PORT=3000
DB_CONNECT=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=super_secret_value
GOOGLE_MAPS_API=your_google_maps_api_key
```

Note: The repo `.gitignore` already excludes `.env` and other environment files.

---

## Installation
From the repository root:

Backend
1) `cd Backend`
2) `npm install`

Frontend
1) `cd frontend`
2) `npm install`

---

## Running the Apps
Backend (Express + Socket.io)
1) `cd Backend`
2) Ensure `Backend/.env` is configured
3) Start: `node server.js`
   - Server listens on `http://localhost:3000` (or `PORT`)

Frontend (React + Vite)
1) `cd frontend`
2) Dev: `npm run dev`
   - App serves at the Vite dev URL printed in the console

---

## API Overview
Base URL: `http://localhost:3000`

Auth
- JWT via cookie (`token`) or `Authorization: Bearer <token>` header is accepted

Users (`/users`)
- `POST /register` — Create user (firstname, lastname?, email, password)
- `POST /login` — Login user → returns JWT
- `GET /profile` — Get current user (auth)
- `GET /logout` — Logout and blacklist token (auth)

Captains (`/captains`)
- `POST /register` — Create captain with vehicle details
- `POST /login` — Login captain → returns JWT
- `GET /profile` — Get current captain (auth)
- `GET /logout` — Logout and blacklist token (auth)

Maps (`/maps`) — all require user auth
- `GET /get-coordinates?address=...`
- `GET /get-distance-time?origin=...&destination=...`
- `GET /get-suggestions?input=...`

Rides (`/rides`)
- `POST /create` — Create ride (user auth)
- `GET /get-fare?pickup=...&destination=...` — Fare estimate (user auth)
- `POST /confirm` — Captain confirms ride (captain auth)
- `GET /start-ride?rideId=...&otp=......` — Start ride (captain auth)
- `POST /end-ride` — End ride (captain auth)

For detailed request/response schemas and examples, see the per-domain docs below.

---

## Socket.io (Realtime)
Server initializes Socket.io with CORS enabled for all origins.

Inbound events
- `join` — `{ userId, userType: 'user' | 'captain' }` → stores `socketId` on user/captain
- `update-location-captain` — `{ userId, location: { ltd, lng } }` → updates captain location

Outbound events
- Services emit targeted events using stored `socketId` when rides are created/updated (see `Backend/socket.js` and ride services).

---

## Data & Security
- Passwords are hashed (bcrypt)
- JWTs are signed with `JWT_SECRET` and can be provided via cookie or header
- Logout blacklists tokens (see `models/blacklistToken.model.js`)

---

## Frontend
- React 18, Vite, React Router, TailwindCSS, Socket.io client
- Dev: `npm run dev`
- Build: `npm run build` → output in `frontend/dist`

---

## Development Notes
- CORS is enabled for all origins by default in `Backend/app.js`
- Google Maps calls originate from the backend via `maps.service.js` using `GOOGLE_MAPS_API`
- Database connection is initialized in `db/db.js` using `DB_CONNECT`

---

## Troubleshooting
- Ensure `Backend/.env` is present and values are correct
- Verify MongoDB connectivity from your environment
- Confirm your Google Maps API key has required APIs enabled (Geocoding, Distance Matrix, Places)
- Check logs in the backend terminal for errors

---

## Additional Documentation
- `docs/users-README.md` — Users module
- `docs/captain-README.md` — Captains module
- `docs/maps-README.md` — Maps module (services)
- `docs/maps-routes-README.md` — Maps routes

---

## License
This project is provided as-is for educational purposes.


