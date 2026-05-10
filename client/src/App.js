import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./AuthContext";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Artist from "./Artist";
import Login from "./Login";
import Favorites from "./Favorites";

function Layout({ children }) {
  const sidebarWidth = 200;
  return (
    <div style={{ display: "flex", direction: "rtl" }}>
      <Sidebar />
      <main style={{ marginRight: sidebarWidth, flex: 1, minHeight: "100vh", background: "#f5f5f5" }}>
        {children}
      </main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/artist/:id" element={<ProtectedRoute><Artist /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
