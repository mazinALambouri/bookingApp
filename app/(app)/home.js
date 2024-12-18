import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function Home() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const handleLogout = async () => {
    await logout();
  };

  const openFeatureEvent = (item) => {
    router.push({ pathname: "BookingForm", params: { item } });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Apply the search filter to the fetched data
      const filteredData = data.filter(
        (item) =>
          (item.name?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          ) ||
          (item.description?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          )
      );

      setFilteredItems(filteredData); // Update filteredItems with the filtered data
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <View className="p-4 border-b border-gray-200 ">
      <View className="flex-row">
        <Image
          source={require("../../assets/images/venuw.png")}
          style={{ width: 60, height: 60, marginRight: 10 }}
        />
        <View>
          <Text
            className="text-lg font-bold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <Text>{item.description}</Text>
          <Text>{item.available ? "Available" : "Not Available"}</Text>
        </View>
      </View>
      <View className="flex-1 ">
        <Pressable
          className="mt-2 p-2 bg-customRed rounded"
          onPress={() => openFeatureEvent(item)}
          disabled={!item.available}
        >
          <Text className="text-black font-bold text-center">
            {item.available ? "Book Now" : "Unavailable"}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white ">
      <View className="flex-row justify-between items-center bg-customRed bg-opacity-75 text-black shadow-lg p-2">
        <Text className=" text-2xl font-bold text-center">
          Aressh
        </Text>
        <Pressable onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="black" />
        </Pressable>
      </View>
      
      <View className="flex-1">
        <ImageBackground
          source={require("../../assets/images/meeting.jpg")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        ></ImageBackground>
      </View>

      {/* Search bar */}
      <View className="p-4">
        <View className="flex-row items-center border border-gray-300 rounded mb-4">
          <TextInput
            className="flex-1 p-2 text-gray-700"
            placeholder="Search..."
            placeholderTextColor="gray-700"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons
            name="search"
            size={20}
            className="bg-customRed rounded p-2 text-white"
          />
        </View>
      </View>
      <View className="flex-1 p-4">
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
