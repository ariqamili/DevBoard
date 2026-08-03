import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Job from "./pages/Job";
import JobDetail from "./pages/JobDetail";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Companies from "./pages/Companies";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import MyApplications from "./pages/MyApplications";
import CompanyApplications from "./pages/CompanyApplications";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/jobs" element={<Job />} />
      <Route path="/jobs/:id" element={<JobDetail />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs/new" element={<CreateJob />} />
        <Route path="/jobs/:id/edit" element={<EditJob />} />
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/company/applications" element={<CompanyApplications />} />
      </Route>

      <Route path="/companies" element={<Companies />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
