# הכי הכי 🎵

A music discovery app: search for artists by starting letter (Hebrew or English), browse their top tracks via Spotify, or search for songs directly by name. Users log in with a Google account and can save songs to a personal favorites list stored in MongoDB.

## Tech stack

**Client:**
- React 19 (functional components + hooks)
- React Router v7
- `@react-oauth/google` for Google sign-in
- Create React App (`react-scripts`)

**Server:**
- Node.js + Express 5
- MongoDB + Mongoose
- Google Auth Library for verifying Google tokens server-side
- JWT (`jsonwebtoken`) for issuing session tokens
- Axios for calls to the Spotify Web API
- CORS, dotenv

## Features

- 🔐 **Google login** — sign in / sign up automatically via OAuth, session managed with a JWT
- 🔤 **Home / artist search** — browse artists by starting letter (Hebrew and English) or search freely by name, backed by the Spotify Search API
- 🎤 **Artist page** — shows an artist's top tracks, with a preview player and a link to open the track on Spotify
- 🔍 **Song search** — search for songs by name with live results from Spotify
- ❤️ **Favorites** — add or remove songs from your personal favorites, saved server-side per logged-in user (MongoDB)
- ℹ️ **About page** — describes the site and the technologies it's built with
- 📱 **Sidebar** — a collapsible RTL side nav with the logged-in user's profile picture and name

## Project structure

```
haci-haci/
├── client/           # React frontend
│   └── src/
│       ├── App.js         # routes and protects logged-in pages
│       ├── AuthContext.js # auth state management (localStorage)
│       ├── Sidebar.js      # side navigation
│       ├── Home.js         # home page — search/browse artists
│       ├── Artist.js       # artist page — top tracks
│       ├── SongSearch.js   # song search
│       ├── Favorites.js    # favorites page
│       ├── Login.js        # Google sign-in page
│       └── About.js        # about page
└── server/           # Node.js + Express backend
    ├── index.js         # the whole API lives here (auth, favorites, spotify)
    └── models/
        ├── User.js          # user schema
        └── Favorite.js      # favorite song schema
```

> Heads up: the server API URL (`http://localhost:5000`) is currently hardcoded on the client side, not pulled from an env variable.

## Setup

Clone the repo and install dependencies separately for the client and the server:

```bash
git clone https://github.com/EyalHar/haci-haci.git
cd haci-haci

cd server
npm install

cd ../client
npm install
```

### Environment variables

There's no `.env.example` in the repo, but based on `server/index.js`, the server needs a `server/.env` file with:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (defaults to `mongodb://localhost:27017/haci-haci`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID, used to verify the login token |
| `JWT_SECRET` | secret used to sign JWTs (there's a fallback default in the code, but set your own) |
| `SPOTIFY_CLIENT_ID` | Spotify Web API client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify Web API client secret |
| `PORT` | port the server runs on (defaults to `5000`) |

The client needs one more variable (e.g. in `client/.env`):

| Variable | Description |
|---|---|
| `REACT_APP_GOOGLE_CLIENT_ID` | the same Google client ID, used by `GoogleOAuthProvider` |

## Running it

**Server (from `server/`):**
```bash
node index.js
```
Runs on `http://localhost:5000` by default.

**Client (from `client/`):**
```bash
npm start      # dev server, http://localhost:3000
npm run build  # production build
npm test       # run tests
```

> Note: the `server` folder doesn't have a `start`/`dev` script in `package.json` yet — you run it directly with `node index.js`, and there's no `nodemon` or similar for auto-restart during development.
