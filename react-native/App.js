import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmpathyAI from './src/EmpathyAI';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [ai] = useState(() => new EmpathyAI('User', 'empathetic'));
  const flatListRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage = {
      id: Date.now().toString(),
      text: "Hi, I am JustinBot! How can I help you?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
    
    // Load previous session if available
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('justinbot_session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.messages && parsed.messages.length > 0) {
          // Load into AI history
          parsed.messages.forEach(msg => {
            ai.history.addMessage(msg.role, msg.content, msg.flags || null);
          });
        }
      }
    } catch (error) {
      console.log('Could not load session:', error);
    }
  };

  const saveSession = async () => {
    try {
      const sessionData = {
        sessionId: ai.history.sessionId,
        messages: ai.history.getAllMessages(),
        timestamp: new Date().toISOString()
      };
      await AsyncStorage.setItem('justinbot_session', JSON.stringify(sessionData));
    } catch (error) {
      console.log('Could not save session:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');

    // Check for termination phrases
    const terminationPattern = /^(?:can\s+i\s+end\s+the\s+conversation|end\s+the\s+conversation|end\s+conversation|i\s+want\s+to\s+end\s+the\s+conversation|i\s+don'?t\s+want\s+to\s+talk\s+anymore|can\s+this\s+conversation\s+be\s+ended)\??$/i;
    
    if (terminationPattern.test(messageText)) {
      Alert.alert(
        'End Conversation',
        'Are you sure you want to end the conversation?',
        [
          {
            text: 'No',
            onPress: () => {
              const continueMessage = {
                id: (Date.now() + 1).toString(),
                text: "Okay, let's continue. How can I help you?",
                sender: 'bot',
                timestamp: new Date().toISOString()
              };
              setMessages(prev => [...prev, continueMessage]);
            },
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: async () => {
              const goodbye = "Goodbye — I hope you're doing okay. Take care of yourself.";
              ai.history.addMessage('assistant', goodbye);
              
              const goodbyeMessage = {
                id: (Date.now() + 1).toString(),
                text: goodbye,
                sender: 'bot',
                timestamp: new Date().toISOString()
              };
              setMessages(prev => [...prev, goodbyeMessage]);
              await saveSession();
            }
          }
        ]
      );
      return;
    }

    // Process message through AI
    try {
      const result = ai.processMessage(messageText);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isCrisis: result.severity === 'critical'
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Auto-save session
      await saveSession();

      // If crisis detected, offer to open crisis resources
      if (result.severity === 'critical') {
        setTimeout(() => {
          Alert.alert(
            'Crisis Resources Available',
            'Would you like to see crisis hotline numbers?',
            [
              { text: 'No, thanks', style: 'cancel' },
              {
                text: 'Yes',
                onPress: () => showCrisisResources()
              }
            ]
          );
        }, 1000);
      }
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your message.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const showCrisisResources = () => {
    const resources = ai.safetyFilter.getCrisisResources('US');
    Alert.alert(
      'Crisis Resources',
      `Suicide & Crisis Lifeline: ${resources.suicideHotline}\n\n` +
      `Crisis Text Line: ${resources.crisisText}\n\n` +
      'Tap OK to call the lifeline.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${resources.suicideHotline}`)
        }
      ]
    );
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all conversation history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            ai.history.clearHistory();
            setMessages([{
              id: Date.now().toString(),
              text: "Hi, I am JustinBot! How can I help you?",
              sender: 'bot',
              timestamp: new Date().toISOString()
            }]);
            await AsyncStorage.removeItem('justinbot_session');
          }
        }
      ]
    );
  };

  const renderMessage = ({ item }) => {
    const isBot = item.sender === 'bot';
    return (
      <View style={[
        styles.messageContainer,
        isBot ? styles.botMessageContainer : styles.userMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isBot ? styles.botBubble : styles.userBubble,
          item.isCrisis && styles.crisisBubble
        ]}>
          <Text style={[
            styles.messageText,
            isBot ? styles.botText : styles.userText
          ]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>JustinBot</Text>
        <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
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
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#333333',
    borderBottomRightRadius: 4,
  },
  crisisBubble: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: '#666666',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#000000',
  },
  userText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 24,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
    color: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333333',
  },
  sendButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
