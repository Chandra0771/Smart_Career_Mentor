// Main application shell: sets up routes and wraps pages with the navbar and footer.

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ui/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;

