import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginForm from './components/Auth/LoginForm';
import AppNavbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import InventoryTable from './components/Inventory/InventoryTable';
import CategoryManagement from './components/Management/CategoryManagement';
import BrandManagement from './components/Management/BrandManagement';
import UserManagement from './components/Management/UserManagement';
import ActivityLogs from './components/Logs/ActivityLogs';

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <DataProvider>
      <div className="app-shell min-h-screen relative z-0">
        <AppNavbar />

        <main className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryTable />} />
            <Route path="/logs" element={<ActivityLogs />} />

            {/* Admin-only routes that exist */}
            <Route
              path="/categories"
              element={user?.role === 'admin' ? <CategoryManagement /> : <Navigate to="/dashboard" replace />}
            />
            <Route
              path="/brands"
              element={user?.role === 'admin' ? <BrandManagement /> : <Navigate to="/dashboard" replace />}
            />
            <Route
              path="/users"
              element={user?.role === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" replace />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </DataProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
