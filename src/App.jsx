import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Offer from './pages/Offer';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kalkulator" element={<Calculator />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/oferta" element={<Offer />} />
          <Route  path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile"  element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;