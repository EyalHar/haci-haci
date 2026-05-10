import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleGoogleSuccess(credentialResponse) {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (!res.ok) throw new Error("Auth failed");

      const { token, user, isNew } = await res.json();
      login(user, token);

      if (isNew) {
        alert(`ברוך הבא ${user.name}! החשבון שלך נוצר בהצלחה 🎉`);
      } else {
        alert(`שמחים לראותך שוב, ${user.name}! 👋`);
      }

      navigate("/");
    } catch (err) {
      alert("שגיאה בהתחברות, נסה שוב");
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>הכי הכי 🎵</h1>
        <p style={subtitle}>התחבר כדי לגלות את המוזיקה הכי טובה</p>

        <div style={btnWrapper}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("שגיאה בהתחברות עם Google")}
            text="continue_with"
            shape="rectangular"
            size="large"
            locale="he"
          />
        </div>

        <p style={note}>
          משתמש חדש? ההרשמה מתבצעת אוטומטית בלחיצה על הכפתור
        </p>
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #191414 0%, #1DB954 100%)",
  fontFamily: "Arial",
};

const card = {
  background: "#fff",
  borderRadius: 20,
  padding: "48px 40px",
  textAlign: "center",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  maxWidth: 400,
  width: "90%",
};

const title = {
  fontSize: 42,
  fontWeight: "900",
  marginBottom: 8,
  background: "linear-gradient(90deg, #1DB954, #191414)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const subtitle = {
  color: "#555",
  marginBottom: 32,
  fontSize: 16,
};

const btnWrapper = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 20,
};

const note = {
  fontSize: 12,
  color: "#999",
  marginTop: 16,
};
