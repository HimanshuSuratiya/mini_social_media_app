import React from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const AppBar: React.FC = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mini Social Media
        </Typography>
        {currentUser ? (
          <>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              {currentUser.displayName}
            </Typography>
            <Button color="inherit" component={Link} to="/my-posts">
              My Posts
            </Button>
            <Button color="inherit" component={Link} to="/saved-posts">
              Saved Posts
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
