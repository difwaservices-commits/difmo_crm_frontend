import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://difmo-crm-backend.onrender.com/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("Profile response:", res.data);

        setUser(res.data.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <div>Loading profile...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Profile</h2>

      <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
    </div>
  );
};

export default Profile;
