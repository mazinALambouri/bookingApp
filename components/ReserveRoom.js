import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { StatusBar } from "expo-status-bar";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ReserveRoom = () => {
  const route = useRoute();

  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleSaveBooking = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await addDoc(collection(db, "BookingRoom"), {
          name: route.params.name,
          date: date.toISOString(),
          userId: user.uid,
        });
        alert("Booking saved successfully!");
      } catch (e) {
        console.error("Error adding document: ", e);
        alert("Failed to save booking.");
      }
    } else {
      alert("You must be logged in to save a booking.");
    }
  };

  return (
    <SafeAreaView className="p-4">
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={{ height: 20 }} />
          <View
            style={styles.row}
            className="flex-row  bg-gray  text-black font-bold"
          >
            <Text style={styles.label} className="font-bold p-2">
              Selected Room : {route.params.name}
            </Text>
          </View>
          <View style={{ height: 20 }} />
          <View
            style={styles.row}
            className="flex-row justify-between items-center bg-customRed text-black rounded shadow-lg p-3"
          >
            <Text style={styles.label} className="font-bold p-2   ">
              Select Date:
            </Text>
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              className="react-datepicker-input pb-2 bg-customRed font-bold rounded text-white"
              style={styles.datePicker}
            />
          </View>
          <View style={{ height: 20 }} /> {/* Add space between the pickers */}
          <View
            style={styles.row}
            className="flex-row  items-center bg-customRed text-black rounded shadow-lg p-3"
          >
            <Text style={styles.label} className="font-bold p-2   ">
              Select Time:
            </Text>
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="react-datepicker-input pb-2 bg-customRed font-bold rounded text-white"
              style={styles.datePicker}
            />
            <View style={{ height: 20 }} />{" "}
            {/* Add space between the picker and button */}
          </View>
          <View className="flex row rounded p-4">
            <Pressable
              onPress={handleSaveBooking}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#FFB300" : "#E69E00",
                  padding: 10,
                  borderRadius: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.9,
                  shadowRadius: 6,
                  elevation: 5,
                  alignItems: "center",
                },
                styles.button,
              ]}
            >
              <Text style={styles.buttonText} className="text-white">
                Save Booking
              </Text>
            </Pressable>
          </View>
          <StatusBar style="auto" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReserveRoom;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});
