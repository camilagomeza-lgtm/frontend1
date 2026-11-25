import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Animes from "./pages/Animes";
import Favorites from "./pages/Favorites";
import History from "./pages/History";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Navigate to="/login"/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/animes" element={<Animes/>}/>
          <Route path="/favorites" element={<Favorites/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/*" element={<h1>Página no encontrada</h1>}/>
        </Routes>
      </AuthProvider>
    </Router>
  )
}
