import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventsHistory = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const storedBookings = await AsyncStorage.getItem('bookings');
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderBooking = ({ item }) => (
    <View className="p-4 mb-4 bg-gray-100 rounded-lg shadow">
      <Text className="text-lg font-bold text-gray-800">{item.itemName}</Text>
      <Text className="text-sm text-gray-600">
        {item.date} at {item.time}
      </Text>
      <Text
        className={`text-xs font-bold uppercase ${
          item.status === 'Confirmed' ? 'text-green-600' : 'text-orange-600'
        }`}
      >
        {item.status}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold text-center text-gray-800 mb-4">
        Booking History
      </Text>
      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
        />
      ) : (
        <Text className="text-center text-lg text-gray-600">
          No bookings found
        </Text>
      )}
    </View>
  );
};

export default EventsHistory;