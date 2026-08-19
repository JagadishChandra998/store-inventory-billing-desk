import { useEffect, useState } from "react";
import API from "../aip/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await API.get("/auth/profile");

        console.log("PROFILE RESPONSE:", response.data);

        // Get user from backend response
        setUser(response.data.user);

      } catch (error) {
        console.error("PROFILE ERROR:", error);

        setError(
          error.response?.data?.message ||
          "Unable to load profile"
        );
      }
    };

    getProfile();
  }, []);

  if (error) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Profile</h1>

      <hr />

      <h3>Name: {user.fullname}</h3>

      <h3>Email: {user.email}</h3>

      <h3>Role: {user.role}</h3>
    </div>
  );
}