import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const BookingForm = ({ navigation }) => {
  const [itemName, setItemName] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [mode, setMode] = useState('date');
  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(true);
      setMode(currentMode);
    }
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  // Handle Date Picker change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Handle Time Picker change
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const saveBooking = async () => {
    const booking = {
      id: Date.now().toString(),
      itemName,
      date: date.toLocaleDateString(),
      time: time.toLocaleTimeString(),
      status: "Confirmed",
    };

    try {
      // Save to Firebase
      await firestore().collection("bookings").add(booking);

      // Save to AsyncStorage
      const storedBookings = await AsyncStorage.getItem("bookings");
      const bookings = storedBookings ? JSON.parse(storedBookings) : [];
      bookings.push(booking);
      await AsyncStorage.setItem("bookings", JSON.stringify(bookings));

      Alert.alert("Success", "Booking saved successfully");

      // Navigate to EventsHistory screen
      navigation.navigate("EventsHistory");
    } catch (error) {
      console.error("Error saving booking:", error);
      Alert.alert("Error", "Failed to save booking");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View
        style={{
          height: hp("10%"),
        }}
        className="flex-row justify-between items-center bg-customRed text-black rounded shadow-lg p-4"
      >
        <Text className="text-2xl font-bold text-white text-center">
          YOUR RESERVATION DETAILS
        </Text>
      </View>
      <View className="flex-1 p-8 bg-gray-200">
        <TextInput
          placeholder="Enter item name"
          value={itemName}
          onChangeText={setItemName}
        />
        <Button title="Select Date" onPress={showDatepicker} />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Button title="Select Time" onPress={showTimepicker} />
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
        <Text style={{ fontSize: 16, marginVertical: 8 }}>
          Selected Date: {date.toLocaleDateString()}
        </Text>
        <Text style={{ fontSize: 16, marginVertical: 8 }}>
          Selected Time: {time.toLocaleTimeString()}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "blue",
            textAlign: "center",
            marginTop: 16,
          }}
          onPress={saveBooking}
        >
          Submit Booking
        </Text>
      </View>
    </View>
  );
};

export default BookingForm;
