import { View, Text } from "react-native";
import React, { useEffect, useContext } from "react";
import { Slot, router, useSegments } from "expo-router";
import "../global.css";
import { AuthContext, AuthContextProvider } from "../context/authContext";
import { MenuProvider } from "react-native-popup-menu";

function MainLayout() {
  const { isAuthenticated } = useContext(AuthContext);
  const segments = useSegments();
  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;
    const inApp = segments[0] === "(app)";
    if (isAuthenticated && !inApp) {
      router.replace("home");
    } else if (isAuthenticated == false) {
      router.replace("signIn");
    }
  }, [isAuthenticated]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <MenuProvider>
      <AuthContextProvider>
        <MainLayout />
      </AuthContextProvider>
    </MenuProvider>
  );
}
