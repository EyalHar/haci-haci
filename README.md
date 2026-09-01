# הכי הכי 🎵

אפליקציית גילוי מוזיקה: מחפשים אמנים לפי אות (עברית או אנגלית), רואים את השירים המובילים שלהם דרך Spotify, ומחפשים שירים ישירות לפי שם. משתמשים מתחברים עם חשבון Google, ויכולים לשמור שירים למועדפים אישיים שנשמרים בחשבון שלהם ב-MongoDB.

## טכנולוגיות

**Client:**
- React 19 (functional components + hooks)
- React Router v7
- `@react-oauth/google` — כניסה עם Google
- Create React App (`react-scripts`)

**Server:**
- Node.js + Express 5
- MongoDB + Mongoose
- Google Auth Library — אימות טוקן Google מהצד השרת
- JWT (`jsonwebtoken`) — הנפקת טוקן סשן למשתמש
- Axios — קריאות ל-Spotify Web API
- CORS, dotenv

## תכונות עיקריות

- 🔐 **כניסה עם Google** — לוגין/הרשמה אוטומטית דרך OAuth, עם טוקן JWT לניהול סשן
- 🔤 **עמוד בית / חיפוש אמנים** — עיון באמנים לפי אות פתיחה (עברית ואנגלית) או חיפוש חופשי לפי שם, מבוסס Spotify Search API
- 🎤 **עמוד אמן** — הצגת השירים המובילים של אמן נבחר, כולל נגן תצוגה מקדימה (preview) וקישור לפתיחה ב-Spotify
- 🔍 **חיפוש שירים** — חיפוש שירים לפי שם עם תוצאות חיות מ-Spotify
- ❤️ **מועדפים** — הוספה/הסרה של שירים למועדפים אישיים, נשמר בשרת לפי המשתמש המחובר (MongoDB)
- ℹ️ **עמוד אודות** — תיאור האתר והטכנולוגיות בו נעשה שימוש
- 📱 **Sidebar** — סרגל ניווט צדדי מתקפל (RTL), עם תמונת פרופיל ושם המשתמש המחובר

## מבנה הפרויקט

```
haci-haci/
├── client/           # React frontend
│   └── src/
│       ├── App.js         # ניתוב (routes) והגנה על עמודים מחוברים
│       ├── AuthContext.js # ניהול מצב התחברות (localStorage)
│       ├── Sidebar.js      # סרגל ניווט
│       ├── Home.js         # עמוד בית — חיפוש/עיון באמנים
│       ├── Artist.js       # עמוד אמן — שירים מובילים
│       ├── SongSearch.js   # חיפוש שירים
│       ├── Favorites.js    # עמוד מועדפים
│       ├── Login.js        # עמוד כניסה עם Google
│       └── About.js        # עמוד אודות
└── server/           # Node.js + Express backend
    ├── index.js         # הגדרת ה-API כולו (auth, favorites, spotify)
    └── models/
        ├── User.js          # סכימת משתמש
        └── Favorite.js      # סכימת שיר מועדף
```

> שימו לב: ה-API של השרת (`http://localhost:5000`) כרגע מוגדר כ-hardcoded בקוד הצד לקוח, ולא דרך משתני סביבה.

## התקנה

יש לשכפל את הריפו ולהתקין תלויות בנפרד ל-client ול-server:

```bash
git clone https://github.com/EyalHar/haci-haci.git
cd haci-haci

cd server
npm install

cd ../client
npm install
```

### משתני סביבה נדרשים

לא קיים בריפו קובץ `.env.example`, אך מתוך הקוד ב-`server/index.js` נדרש קובץ `server/.env` עם המשתנים הבאים:

| משתנה | תיאור |
|---|---|
| `MONGODB_URI` | כתובת חיבור ל-MongoDB (ברירת מחדל: `mongodb://localhost:27017/haci-haci`) |
| `GOOGLE_CLIENT_ID` | Client ID של Google OAuth, לאימות טוקן ההתחברות |
| `JWT_SECRET` | מפתח סודי לחתימת טוקן JWT (יש ברירת מחדל בקוד — מומלץ להגדיר בעצמכם) |
| `SPOTIFY_CLIENT_ID` | Client ID של Spotify Web API |
| `SPOTIFY_CLIENT_SECRET` | Client Secret של Spotify Web API |
| `PORT` | פורט להרצת השרת (ברירת מחדל: `5000`) |

בצד ה-client נדרש משתנה נוסף (למשל בקובץ `client/.env`):

| משתנה | תיאור |
|---|---|
| `REACT_APP_GOOGLE_CLIENT_ID` | אותו Client ID של Google, לשימוש ב-`GoogleOAuthProvider` |

## הרצה

**שרת (מתוך `server/`):**
```bash
node index.js
```
השרת רץ כברירת מחדל על `http://localhost:5000`.

**קליינט (מתוך `client/`):**
```bash
npm start      # הרצה בסביבת פיתוח, http://localhost:3000
npm run build  # בנייה לפרודקשן
npm test       # הרצת בדיקות
```

> לב: בתיקיית `server` אין כרגע סקריפט `start`/`dev` מוגדר ב-`package.json` — ההרצה היא ישירות עם `node index.js`, וגם אין תלות כמו `nodemon` להרצה אוטומטית מחדש בזמן פיתוח.
