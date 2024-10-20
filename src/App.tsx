import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppBar from "./components/AppBar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedsPage from "./pages/FeedsPage";
import MyPostsPage from "./pages/MyPostsPage";
import SavedPostsPage from "./pages/SavedPostsPage";

const theme = createTheme();

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppBar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<FeedsPage />} />
            <Route
              path="/my-posts"
              element={<PrivateRoute element={<MyPostsPage />} />}
            />
            <Route
              path="/saved-posts"
              element={<PrivateRoute element={<SavedPostsPage />} />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
