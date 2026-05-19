export default function About() {
  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>🎵 הכי הכי</h1>
        <p style={tagline}>גלה את המוזיקה שאתה אוהב — מהאמנים הכי שווים בעולם</p>

        <hr style={divider} />

        <section style={section}>
          <h2 style={sectionTitle}>מה האתר עושה?</h2>
          <ul style={list}>
            <li>🔤 חיפוש אמנים לפי אות — עברית ואנגלית כאחד</li>
            <li>❤️ שמירת שירים מועדפים לחשבון האישי שלך</li>
            <li>🔗 פתיחת שירים ב-Spotify בלחיצה אחת</li>
            <li>🔐 כניסה מאובטחת דרך חשבון Google</li>
          </ul>
        </section>

        <hr style={divider} />

        <section style={section}>
          <h2 style={sectionTitle}>⚙️ טכנולוגיות</h2>
          <div style={techGrid}>
            {["React", "Node.js + Express", "MongoDB Atlas", "Spotify API", "Google OAuth", "JWT"].map((t) => (
              <div key={t} style={techCard}>{t}</div>
            ))}
          </div>
        </section>

        <hr style={divider} />

        <p style={devText}>
          👨‍💻 פותח על ידי <strong>אייל הרוש</strong> בשיתוף <strong>Claude Code</strong> — בינה מלאכותית של Anthropic
        </p>
        <p style={copy}>© {new Date().getFullYear()} הכי הכי · כל הזכויות שמורות</p>
      </div>
    </div>
  );
}

const container = {
  height: "100vh",
  overflow: "hidden",
  padding: 20,
  fontFamily: "Arial",
  background: "#f5f5f5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
};

const card = {
  background: "#fff",
  borderRadius: 16,
  padding: "20px 28px",
  maxWidth: 520,
  width: "100%",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
};

const title = {
  fontSize: 26,
  fontWeight: "900",
  textAlign: "center",
  margin: "0 0 4px",
  background: "linear-gradient(90deg, #1DB954, #191414)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const tagline = {
  textAlign: "center",
  color: "#666",
  fontSize: 12,
  margin: "0 0 0",
};

const divider = {
  border: "none",
  borderTop: "1px solid #eee",
  margin: "10px 0",
};

const section = { marginBottom: 0 };

const sectionTitle = {
  fontSize: 13,
  fontWeight: "bold",
  marginBottom: 6,
  color: "#191414",
};

const list = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontSize: 12,
  color: "#333",
};

const techGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 6,
};

const techCard = {
  background: "#f9f9f9",
  border: "1px solid #eee",
  borderRadius: 8,
  padding: "5px 8px",
  fontSize: 11,
  fontWeight: "bold",
  textAlign: "center",
  color: "#333",
};

const devText = {
  fontSize: 12,
  color: "#333",
  margin: "0 0 4px",
  textAlign: "center",
};

const copy = {
  fontSize: 11,
  color: "#aaa",
  textAlign: "center",
  margin: 0,
};
