# JustinBot React Native Mobile App

A mobile version of the empathetic AI chatbot built with React Native and Expo.

## Features

- 📱 Native iOS and Android support
- 💬 Clean, modern chat interface
- 🔒 Safety filtering and crisis detection
- 💾 Automatic session saving with AsyncStorage
- 📞 Crisis hotline integration (tap to call)
- ✨ Smooth animations and keyboard handling
- 🎨 Message bubbles with empathetic design

## Prerequisites

- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode and iOS Simulator (macOS only)
- For Android: Android Studio and Android Emulator
- For physical device: Expo Go app from App Store/Play Store

## Installation

```bash
cd react-native
npm install
```

## Running the App

### Start the development server:
```bash
npm start
# or
expo start
```

### Run on iOS Simulator (macOS only):
```bash
npm run ios
```

### Run on Android Emulator:
```bash
npm run android
```

### Run on Physical Device:
1. Install "Expo Go" app from App Store or Google Play
2. Run `npm start`
3. Scan the QR code with your camera (iOS) or Expo Go app (Android)

## Project Structure

```
react-native/
├── App.js                      # Main React Native app component
├── src/
│   ├── EmpathyAI.js           # AI logic (mobile version)
│   ├── ConversationHistory.js  # Session management
│   └── SafetyFilter.js        # Safety detection
├── package.json
├── app.json                    # Expo configuration
└── babel.config.js
```

## Key Features

### Chat Interface
- User messages appear on the right (blue bubbles)
- Bot messages appear on the left (white bubbles)
- Crisis-flagged messages have red border
- Auto-scroll to latest message
- Keyboard-aware layout

### Safety Features
- Detects self-harm, abuse, and crisis keywords
- Provides immediate crisis resources
- Tap-to-call crisis hotlines
- Visual indicators for crisis messages

### Session Management
- Auto-saves conversation to device storage
- Persists across app restarts
- Clear history option in header

### Exit Confirmation
- Recognizes termination phrases
- Prompts confirmation before ending
- Saves session on exit

## Customization

### Change Bot Name
Edit `App.js` line 32:
```javascript
text: "Hi, I am JustinBot! How can I help you?",
```

### Add Crisis Keywords
Edit `src/SafetyFilter.js` and add to the Sets:
```javascript
this.SELF_HARM_KEYWORDS = new Set([
  // Add your keywords here
]);
```

### Modify Empathy Responses
Edit `src/EmpathyAI.js` in the `EMPATHY_STARTERS` array or `_modelSpecificResponse` method.

### Change Theme Colors
Edit `App.js` in the `styles` object:
```javascript
userBubble: {
  backgroundColor: '#007AFF', // Change user message color
},
botBubble: {
  backgroundColor: '#fff',    // Change bot message color
},
```

## Building for Production

### iOS (requires macOS and Apple Developer account):
```bash
expo build:ios
```

### Android:
```bash
expo build:android
```

### Web version:
```bash
npm run web
```

## Differences from CLI Version

- **Visual Interface**: Chat bubbles instead of terminal
- **Touch Interactions**: Tap to send, swipe to scroll
- **Native Features**: Tap-to-call, device storage
- **Session Persistence**: Auto-saves using AsyncStorage
- **Alerts**: Native dialogs for confirmations
- **No Commands**: Removed CLI commands (help, models, etc.) for simpler mobile UX

## Troubleshooting

### App won't start:
```bash
# Clear cache
expo start -c

# Or reinstall dependencies
rm -rf node_modules
npm install
```

### AsyncStorage errors:
Make sure `@react-native-async-storage/async-storage` is installed:
```bash
npm install @react-native-async-storage/async-storage
```

### Keyboard issues:
Adjust `keyboardVerticalOffset` in App.js based on your device.

## Next Steps

- Add user authentication
- Implement push notifications for check-ins
- Add mood tracking visualization
- Support multiple languages
- Add voice input/output
- Implement end-to-end encryption

## Support

For issues specific to React Native/Expo, see:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

For AI logic and safety features, refer to the main project documentation.
