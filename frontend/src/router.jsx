import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import About from "./pages/About"
import Activities from "./pages/Activities"

import Reservations from "./pages/Reservations"
import Profile from "./pages/Profile"
import AdminDashboard from "./pages/AdminDashboard"
import ManageUsers from "./pages/ManageUsers"
import ActivityManagement from "./pages/ActivityManagement"
import ManageCoaches from "./pages/ManageCoaches"
import Stats from "./pages/Stats"
import ReservationHistory from "./pages/ReservationHistory";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import ReservationNew from "./pages/ReservationNew";

import Contact from "./pages/Contact";
import AdminContact from "./pages/AdminContact";
import UserMessages from "./pages/UserMessages";

import CoachActivities from "./pages/CoachActivities";
import CoachReviews from "./pages/CoachReviews";
import CoachReservations from "./pages/CoachReservations";
import CoachMessages from "./pages/CoachMessages";

const AppRouter = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/reservations"
            element={
              <PrivateRoute userOnly>
                <Reservations />
              </PrivateRoute>
            }
          />
          <Route
            path="/reservation/new"
            element={
              <PrivateRoute userOnly>
                <ReservationNew />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute userOnly>
                <UserMessages />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/reservation-history"
            element={
              <PrivateRoute userOnly>
                <ReservationHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={<Navigate to="/admin" replace />}
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute adminOnly>
                <ManageUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/activities"
            element={
              <PrivateRoute adminOnly>
                <ActivityManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/coaches"
            element={
              <PrivateRoute adminOnly>
                <ManageCoaches />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <PrivateRoute adminOnly>
                <Stats />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <PrivateRoute adminOnly>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/contact"
            element={
              <PrivateRoute adminOnly>
                <AdminContact />
              </PrivateRoute>
            }
          />
          <Route 
            path="/coach/activities" 
            element={
              <PrivateRoute coachOnly>
                <CoachActivities />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/coach/reviews" 
            element={
              <PrivateRoute coachOnly>
                <CoachReviews />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/coach/reservations" 
            element={
              <PrivateRoute coachOnly>
                <CoachReservations />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/coach/messages" 
            element={
              <PrivateRoute coachOnly>
                <CoachMessages />
              </PrivateRoute>
            } 
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default AppRouter


