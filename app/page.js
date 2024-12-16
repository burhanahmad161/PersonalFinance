"use client";
import React from "react";
import { AuthProvider } from "../AuthContext";
import SignIn from "./SignIn/page";
export default function HomePage() {
  return (
    <AuthProvider>
      <SignIn />
    </AuthProvider>
  );
}