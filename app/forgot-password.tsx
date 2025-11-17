import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../config/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail]=useState("");

  async function handleReset() {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset email sent.");
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
        paddingTop: 100,
        justifyContent:"flex-start",
      }}
    >
      <Text style={{fontSize: 28, fontWeight:"bold", marginBottom: 20}}>
        Reset Password
      </Text>

      <Text style={{fontWeight:"600", marginBottom: 5}}>Email</Text>

      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor:"#ddd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 30,
        }}
      />

      <TouchableOpacity
        onPress={handleReset}
        style={{
          backgroundColor:"black",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <Text style={{color:"white", textAlign:"center", fontSize: 16}}>
          Send Reset Email
        </Text>
      </TouchableOpacity>
    </View>
  );
}