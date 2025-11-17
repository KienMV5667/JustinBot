import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Import the EmpathyAI system
import EmpathyAI from "../components/EmpathyAI";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [ai] = useState(() => new EmpathyAI("User", "empathetic"));
  const flatListRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage = {
      id: Date.now().toString(),
      text: "Hi, I am JustinBot! How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);

    // Load previous session if available
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const sessionData = await AsyncStorage.getItem("justinbot_session");
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.messages && parsed.messages.length > 0) {
          // Load into AI history
          parsed.messages.forEach((msg) => {
            ai.history.addMessage(msg.role, msg.content, msg.flags || null);
          });
          
          // Convert to UI messages for display
          const uiMessages = parsed.messages.map((msg, index) => ({
            id: `${Date.now()}_${index}`,
            text: msg.content,
            sender: msg.role === 'user' ? 'user' : 'bot',
            timestamp: msg.timestamp,
            flags: msg.flags,
          }));
          
          // Add welcome message first, then history
          setMessages((prev) => [...prev, ...uiMessages]);
        }
      }
    } catch (error) {
      console.log("Could not load session:", error);
    }
  };

  const saveSession = async () => {
    try {
      const sessionData = {
        sessionId: ai.history.sessionId,
        messages: ai.history.getAllMessages(),
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        "justinbot_session",
        JSON.stringify(sessionData)
      );
    } catch (error) {
      console.log("Could not save session:", error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText("");

    // Check for termination phrases
    const terminationPattern =
      /^(?:can\s+i\s+end\s+the\s+conversation|end\s+the\s+conversation|end\s+conversation|i\s+want\s+to\s+end\s+the\s+conversation|i\s+don'?t\s+want\s+to\s+talk\s+anymore|can\s+this\s+conversation\s+be\s+ended)\??$/i;

    if (terminationPattern.test(messageText)) {
      Alert.alert(
        "End Conversation",
        "Are you sure you want to end the conversation?",
        [
          {
            text: "No",
            onPress: () => {
              const continueMessage = {
                id: (Date.now() + 1).toString(),
                text: "Okay, let's continue. How can I help you?",
                sender: "bot",
                timestamp: new Date().toISOString(),
              };
              setMessages((prev) => [...prev, continueMessage]);
            },
          },
          {
            text: "Yes",
            onPress: () => {
              const farewellMessage = {
                id: (Date.now() + 1).toString(),
                text: "Thank you for talking with me. Take care! 💙",
                sender: "bot",
                timestamp: new Date().toISOString(),
              };
              setMessages((prev) => [...prev, farewellMessage]);
              saveSession();
              setTimeout(() => router.push("/dashboard"), 2000);
            },
          },
        ]
      );
      return;
    }

    try {
      const result = await ai.processMessage(messageText);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: "bot",
        timestamp: new Date().toISOString(),
        flags: result.reason ? [result.reason] : null,
      };

      setMessages((prev) => [...prev, botMessage]);
      saveSession();

      // Handle flagged content
      if (!result.isSafe && result.reason) {
        setTimeout(() => {
          Alert.alert(
            "Content Notice",
            "I noticed some concerning content. Please remember I'm here to support you. If you're in crisis, please contact a mental health professional.",
            [{ text: "OK" }]
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all conversation history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            ai.history.clearHistory();
            await AsyncStorage.removeItem("justinbot_session");
            setMessages([
              {
                id: Date.now().toString(),
                text: "Hi, I am JustinBot! How can I help you today?",
                sender: "bot",
                timestamp: new Date().toISOString(),
              },
            ]);
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={[
        styles.messageText,
        item.sender === "user" ? styles.userMessageText : styles.botMessageText
      ]}>{item.text}</Text>
      {item.flags && (
        <Text style={styles.flaggedText}>
          ⚠️ Flagged: {Array.isArray(item.flags) ? item.flags.join(", ") : item.flags}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat with JustinBot</Text>
        <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    padding: 5,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  clearButton: {
    padding: 5,
  },
  clearText: {
    color: "#fff",
    fontSize: 14,
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#000",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  userMessageText: {
    color: "#fff",
  },
  botMessageText: {
    color: "#000",
  },
  flaggedText: {
    fontSize: 12,
    color: "#ff3b30",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
