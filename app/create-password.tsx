import { useLocalSearchParams, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../config/firebase";

export default function CreatePasswordPage() {
  const {email}=useLocalSearchParams();
  const router=useRouter();
  const [password, setPassword]=useState("");

  async function handleCreate() {
    try {
      await createUserWithEmailAndPassword(auth, String(email), password);
      alert("Account created!");
      router.push("/dashboard");
    } catch (err:any) {
      alert(err.message);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:"white",
        padding: 30,
        paddingTop: 80,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight:"bold",
          textAlign:"center",
          marginBottom: 30,
        }}
      >
        Create a Password
      </Text>

      <Text style={{fontWeight:"600", marginBottom: 5}}>Email</Text>
      <TextInput
        value={String(email)}
        editable={false}
        style={{
          borderWidth: 1,
          borderColor:"#ddd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
          backgroundColor:"#f5f5f5",
        }}
      />

      <Text style={{fontWeight:"600", marginBottom: 5}}>Password</Text>
      <TextInput
        secureTextEntry
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor:"#ddd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 30,
        }}
      />

      <TouchableOpacity
        onPress={handleCreate}
        style={{
          backgroundColor:"black",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <Text style={{color:"white", textAlign:"center", fontSize: 16}}>
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}