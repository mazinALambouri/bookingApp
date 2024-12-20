import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import React, { useLayoutEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import ReserveRoom from "../../components/ReserveRoom";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = () => {
  const route = useRoute();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Make A Reservation",
      headerTitleAlign: "center",
      headerTitleStyle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "white",
      },
      headerStyle: {
      backgroundColor: "#E69E00",
      height: 110,
      borderBottomColor: "transparent",
      shadowColor: "transparent",
      },
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ReserveRoom />
    </SafeAreaView>
  );
};

export default BookingForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
