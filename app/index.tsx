import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function StartPage() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:"white",
        justifyContent:"center",
        alignItems:"center",
        padding: 20,
      }}
    >
      <Image
        source={require("../assets/images/JustinBot_logo.png")}
        style={{width: 120, height: 120, marginBottom: 20}}
      />

      <Text style={{fontSize: 28, fontWeight:"bold", marginBottom: 5}}>
        JUSTINBOT
      </Text>

      <Text style={{marginBottom: 40, textAlign:"center"}}>
        Your AI companion for mental well-being
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor:"black",
          padding: 15,
          width:"80%",
          borderRadius: 8,
          marginBottom: 15,
        }}
        onPress={()=>router.push("/create-account")}
      >
        <Text style={{ color:"white", textAlign:"center" }}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor:"black",
          padding: 15,
          width:"80%",
          borderRadius: 8,
        }}
        onPress={()=>router.push("/login")}
      >
        <Text style={{color:"white", textAlign:"center"}}>Log In</Text>
      </TouchableOpacity>

      <Text style={{marginTop: 25, fontSize: 12 }}>
        Your data is private and encrypted.
      </Text>
    </View>
  );
}