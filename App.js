import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

import { theme } from "./colors";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => {
    setText(payload);
  };

  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };
  const addTodo = async () => {
    if (text === "") {
      return Alert.alert("Empty todo!", "You must write something!");
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { text, working },
    });
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedToDos = JSON.parse(s);
      console.log(parsedToDos);
      setToDos(parsedToDos);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    loadToDos();
  }, []);
  useEffect(() => {
    saveToDos(toDos);
  }, [toDos]);

  const deleteTodo = (key) => {
    Alert.alert("Delete todo?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = Object.assign({}, toDos);
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.buttonText,
              color: working ? "white" : theme.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.buttonText,
              color: working ? theme.grey : "white",
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          returnKeyType="done"
          onChangeText={onChangeText}
          value={text}
          onSubmitEditing={addTodo}
          placeholder={working ? "add a todo" : "where do you want to go?"}
          style={styles.input}
        ></TextInput>
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View key={key} style={styles.toDo}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Feather name="trash-2" size={24} color="grey" />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  buttonText: {
    fontSize: 34,
    fontWeight: "bold",
  },
  input: {
    marginVertical: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 18,
    backgroundColor: "white",
  },
  toDo: {
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 15,
    backgroundColor: theme.toDoBg,
  },
  toDoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
