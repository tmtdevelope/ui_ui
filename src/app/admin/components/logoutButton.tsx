import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useAuth } from "@/app/contexts/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    //  router.push("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant="contained"
      color="primary"
    >
      {loading ? <CircularProgress size={24} /> : "Logout"}
    </Button>
  );
};

export default LogoutButton;
