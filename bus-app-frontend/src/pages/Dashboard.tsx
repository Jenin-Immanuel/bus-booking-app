import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

export default function () {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  async function handleLogout() {
    logout();
    alert("User logged out successfully");
    navigate("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={handleLogout}>Log out</Button>
    </div>
  );
}
