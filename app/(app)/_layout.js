import React from "react";
import { Stack, Tabs } from "expo-router";
import { AuthContextProvider } from "../../context/authContext";
import HomeHeader from "../../components/HomeHeader";
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
    return (
      <AuthContextProvider>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        screenOptions={{
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          backgroundColor: '#fff',
          // Add shadow on all sides
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          borderRadius: 30,
          margin: 10,
          padding: 5,
          height: 50,
          width: '80%',
          position: 'absolute',
          left: 30,
          right: 35,
          bottom: 10,
        },
        }}
      >
        <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name="home" color={focused ? "orange" : color} size={size} />
          ),
          tabBarLabel: () => null,
        }}
        />
        <Tabs.Screen
        name="EventsHistory"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name="calendar" color={focused ? "orange" : color} size={size} />
          ),
          tabBarLabel: () => null,
        }}
        />
        <Tabs.Screen
        name="BookingForm"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name="document-text" color={focused ? "orange" : color} size={size} />
          ),
          tabBarLabel: () => null,
        }}
        />
      </Tabs>
      </AuthContextProvider>
    );
}
