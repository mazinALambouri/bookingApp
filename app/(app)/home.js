import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ImageBackground,
  Modal,
  Button,
} from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { collection, getDocs, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function Home() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", description: "", available: false });
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  const handleAddRoom = async () => {
    await addDoc(collection(db, "events"), newRoom);
    setModalVisible(false);
    setNewRoom({ name: "", description: "", available: false });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Apply the search filter to the fetched data
      let filteredData = data.filter(
        (item) =>
          (item.name?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          ) ||
          (item.description?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          )
      );

      // Apply the availability filter
      if (filterAvailable) {
        filteredData = filteredData.filter(item => item.available);
      }

      setFilteredItems(filteredData); // Update filteredItems with the filtered data
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [searchQuery, filterAvailable]);

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
          onPress={() => navigation.navigate("BookingForm", {
            name: item.name,
            description: item.description,
            available: item.available,
            id: user.uid,
          })}
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
      <View
        style={{
          height: hp("10%"),
        }}
        className="flex-row justify-between items-center bg-customRed text-black rounded shadow-lg p-4">
        <Text className=" text-2xl font-bold text-white text-center">
          MeetMeHere
        </Text>
        <Pressable onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="black" />
        </Pressable>
      </View>

      <View className="flex-1">
        <ImageBackground
          source={require("../../assets/images/to.jpg")}
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
          <Pressable onPress={() => setFilterAvailable(!filterAvailable)}>
            <Ionicons
              name={filterAvailable ? "filter" : "filter-outline"}
              size={20}
              className="bg-customRed rounded p-2 text-white"
            />
          </Pressable>
        </View>
      </View>
      <View className="flex-1 p-4">
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
      <Pressable
        className="p-4 bg-gray-400 rounded-full absolute  bottom-20 shadow-lg right-10"
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-4 rounded">
            <Text className="text-lg font-bold mb-4">Add New Room</Text>
            <TextInput
              className="border border-gray-300 p-2 mb-4"
              placeholder="Name"
              value={newRoom.name}
              onChangeText={(text) => setNewRoom({ ...newRoom, name: text })}
            />
            <TextInput
              className="border border-gray-300 p-2 mb-4"
              placeholder="Description"
              value={newRoom.description}
              onChangeText={(text) => setNewRoom({ ...newRoom, description: text })}
            />
            <View className="flex-row items-center mb-4">
              <Text className="mr-2">Available:</Text>
              <Pressable
                className={`p-2 rounded ${newRoom.available ? "bg-green-500" : "bg-red-500"}`}
                onPress={() => setNewRoom({ ...newRoom, available: !newRoom.available })}
              >
                <Text className="text-white">{newRoom.available ? "Yes" : "No"}</Text>
              </Pressable>
            </View>
            <Button title="Add Room" onPress={handleAddRoom} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}