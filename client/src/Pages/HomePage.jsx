import React from "react";
import { useStoreAuth } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { authUser } = useStoreAuth();
  const navigate = useNavigate();
  if (!authUser) {
    navigate("/login");
  }
  console.log("authuser" , authUser)
  return (
    authUser && (
      <div className="min-h-screen" style={{ backgroundColor: "#E9F1FA" }}>
        <h1
          className="text-3xl text-white p-4 mt-20"
          style={{ backgroundColor: "#00ABE4" }}
        >
          Home Page
        </h1>
      </div>
    )
  );
};

export default HomePage;
