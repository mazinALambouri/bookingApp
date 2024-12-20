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
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function EventsHistory() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const navigation = useNavigation();
  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "BookingRoom"),
      (snapshot) => {
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
      }
    );

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [searchQuery]);

  const renderItem = ({ item }) => {
    const currentDate = new Date();
    const itemDate = new Date(item.date);
    const status = currentDate > itemDate ? "Confirmed" : "Pending";

    return (
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
            <Text>{itemDate.toLocaleDateString()}</Text>
            <Text>{itemDate.toLocaleTimeString()}</Text>
          </View>
        </View>
        <View className="flex-1 ">
          <Text className={`mt-2 p-2 rounded text-center ${status === "Confirmed" ? "bg-green-500 font-bold" : "bg-red-500 text-white font-bold"}`}>
            {status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white ">
      <View
        style={{
          height: hp("10%"),
        }}
        className="flex-row justify-between items-center bg-customRed text-black rounded shadow-lg p-4"
      >
        <Text className=" text-2xl font-bold text-white text-center">
          Reserved Room
        </Text>
      </View>

      <View className="flex-1 p-4">
        {filteredItems.length > 0 ? (
          <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          />
        ) : (
          <Text className="text-center text-lg text-gray-600">
            No Reserved Room Found
          </Text>
        )}
      </View>
    </View>
  );
}
