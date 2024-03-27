import React from "react";
import { UserAuth } from "../context/AuthContext";
import SocialSignIn from "./SocialSignIn";

const ProtectedRoute = ({ children }) => {
  const { user } = UserAuth();

  if (!user) {
    return <SocialSignIn />;
  }
  return children;
};

export default ProtectedRoute;
