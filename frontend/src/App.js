import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard.jsx";
import Trips from "./pages/Trips.jsx";
import Trucks from "./pages/Trucks.jsx";
import Drivers from "./pages/Drivers.jsx";
import Export from "./pages/Export.jsx";
import Bilty from "./pages/Bilty.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
          <Route path="/trucks" element={<ProtectedRoute><Trucks/></ProtectedRoute>} />
          <Route path="/drivers" element={<ProtectedRoute><Drivers/></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/export" element={<ProtectedRoute><Export/></ProtectedRoute>} />
          <Route path="/bilties" element={<ProtectedRoute><Bilty/></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
