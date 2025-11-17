import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../config/firebase";

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");

  const router = useRouter();

  const [request, response, promptAsync]=Google.useAuthRequest({
    clientId:
      "393663137988-bju3ea42fdc6123lpllfpbcvtdfks004.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@kienmv5667/JustinBot",
  });

  console.log("Redirect URI:", request?.redirectUri);

  if(response?.type==="success") {
    alert("Google Sign-In Successful");
    console.log(response.authentication);
  }

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in");
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:"white",
        padding: 20,
        paddingTop: 80,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight:"bold",
          marginBottom: 20,
          textAlign:"center",
        }}
      >
        Log In
      </Text>

      <Text>Email</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor:"#ddd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 15,
        }}
        value={email}
        onChangeText={setEmail}
      />

      <Text>Password</Text>
      <TextInput
        secureTextEntry={true}
        style={{
          borderWidth: 1,
          borderColor:"#ddd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 8,
        }}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={()=>router.push("/forgot-password")}
        style={{
          alignSelf:"flex-end",
          marginBottom: 20,
        }}
      >
        <Text style={{color:"gray"}}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor:"black",
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
        }}
        onPress={handleLogin}
      >
        <Text style={{color:"white", textAlign:"center"}}>Log in</Text>
      </TouchableOpacity>

      <View style={{width:"100%", alignItems:"center", marginVertical: 10}}>
        <Text style={{textAlign:"center"}}>or</Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "white",
          padding: 15,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: "#0000001f",
        }}
        onPress={() => promptAsync()}
      >
        <Image
          source={require("../assets/images/google_logo.png")}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        <Text>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}