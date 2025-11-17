import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function CreateAccountPage() {
  const [email, setEmail]=useState("");
  const router=useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "393663137988-bju3ea42fdc6123lpllfpbcvtdfks004.apps.googleusercontent.com",
    redirectUri:"https://auth.expo.io/@kienmv5667/JustinBot",
  });

  console.log("Redirect URI:", request?.redirectUri);

  if(response?.type==="success") {
    router.replace("/chat");
    console.log(response.authentication);
  }

  function handleContinue() {
    if(!email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    router.push({
      pathname:"/create-password",
      params:{email},
    });
  }

  return(
    <View style={{flex: 1, backgroundColor: "white", padding: 20, paddingTop: 80}}>
      <Text style={{fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 10}}>
        Create an Account
      </Text>

    <Text style={{textAlign: "center", marginBottom: 20}}>
        Sign up with your email to get started.
      </Text>

      <TextInput
        placeholder="email@domain.com"
        style={{
          borderWidth: 1,
          borderColor:"#ddd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        }}
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={{
          backgroundColor:"black",
          padding: 15,
          borderRadius: 8,
          marginBottom: 15,
        }}
        onPress={handleContinue}
      >
        <Text style={{color:"white", textAlign:"center"}}>Continue</Text>
      </TouchableOpacity>

      <Text style={{textAlign:"center", marginVertical: 10}}>or</Text>

      <TouchableOpacity
        style={{
          backgroundColor:"white",
          padding: 15,
          borderRadius: 8,
          flexDirection:"row",
          alignItems:"center",
          justifyContent:"center",
          borderWidth: 2,
          borderColor:"#0000001f",
        }}
        onPress={()=>promptAsync()}
      >
        <Image
          source={require("../assets/images/google_logo.png")}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        <Text>Continue with Google</Text>
       </TouchableOpacity>

      <Text style={{ textAlign:"center", fontSize: 12, marginTop: 20 }}>
        By clicking continue, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}