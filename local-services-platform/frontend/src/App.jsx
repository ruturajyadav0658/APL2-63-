import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import ServiceDetails from './pages/ServiceDetails.jsx'
import Bookings from './pages/Bookings.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Navbar from './components/Navbar.jsx'
import { useAuth } from './context/AuthContext.jsx'
import ProviderServices from './pages/ProviderServices.jsx'
import ProviderBookings from './pages/ProviderBookings.jsx'
import UserWelcome from './pages/UserWelcome.jsx'
import ProviderWelcome from './pages/ProviderWelcome.jsx'

function App() {
  const { user } = useAuth()
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome/user" element={<UserWelcome />} />
        <Route path="/welcome/provider" element={<ProviderWelcome />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/provider/services" element={<ProviderServices />} />
        <Route path="/provider/bookings" element={<ProviderBookings />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'provider' ? '/welcome/provider' : '/welcome/user'} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={user.role === 'provider' ? '/welcome/provider' : '/welcome/user'} replace /> : <Register />} />
      </Routes>
    </div>
  )
}

export default App
