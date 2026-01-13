import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ClubDiscovery from "./pages/ClubDiscovery";
import ClubDetails from "./pages/ClubDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Scanner from "./pages/Scanner";
import ProtectedRoute from "./components/ProtectedRoute";
import ClubDashboard from "./pages/ClubDashboard";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminRoute from "./components/SuperAdminRoute";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-primary text-white">
      <Toaster position="top-center" />
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/clubs" element={<ClubDiscovery />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<ClubDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/scanner" element={<Scanner />} />
          </Route>
          <Route element={<SuperAdminRoute />}>
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
