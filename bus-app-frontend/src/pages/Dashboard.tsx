import { API_URL } from "@/utils/constants";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function () {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let res = await fetch(API_URL + "/user/me", {
        credentials: "include",
      });
      let data = await res.json();
      console.log("Data: ", data);

      if (!res.ok) {
        console.log("User not logged in");
        return;
      }
      console.log(data);
    })();
  }, []);
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
