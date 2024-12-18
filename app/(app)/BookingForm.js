import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingForm = ({ navigation }) => {
  const [itemName, setItemName] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
    if (!itemName) {
      Alert.alert('Error', 'Please enter the room name.');
      return;
    }

    const booking = {
      id: Date.now().toString(),
      itemName,
      date: date.toLocaleDateString(),
      time: time.toLocaleTimeString(),
      status: 'Pending',
    };

    try {
      // Save to AsyncStorage
      const storedBookings = await AsyncStorage.getItem('bookings');
      const bookings = storedBookings ? JSON.parse(storedBookings) : [];
      bookings.push(booking);
      await AsyncStorage.setItem('bookings', JSON.stringify(bookings));

      Alert.alert('Success', 'Booking saved successfully');

      // Navigate to EventsHistory screen with the booking data
      navigation.navigate('EventsHistory', { newBooking: booking });
    } catch (error) {
      console.error('Error saving booking:', error);
      Alert.alert('Error', 'Failed to save booking');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
        Booking Form
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 8 }}>item.name</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 8,
          padding: 8,
          marginBottom: 16,
        }}
        placeholder="Enter room name"
        value={itemName}
        onChangeText={setItemName}
      />

      <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text style={{ fontSize: 16, marginVertical: 8 }}>Selected Date: {date.toLocaleDateString()}</Text>

      <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <Text style={{ fontSize: 16, marginVertical: 8 }}>Selected Time: {time.toLocaleTimeString()}</Text>

      <Button title="Submit Booking" onPress={saveBooking} />
    </View>
  );
};

export default BookingForm;
