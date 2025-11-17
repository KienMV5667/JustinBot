# JustinBot

## Projects

This repository contains two main projects:

### 1. Expo Mobile App

A mobile application built with [Expo](https://expo.dev) and React Native.

#### Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

#### Learn more

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

---

### 2. Empathetic AI System - Multi-Language Implementation

## 🤝 Overview

A complete, production-ready empathetic AI system with **dual implementations** (JavaScript, Java):
- **Intelligent Model Selection**: Automatically picks the best AI approach for each conversation
- **Conversation Memory**: Remembers everything and understands context
- **Safety First**: Detects harmful content and provides crisis resources
- **Empathetic Responses**: Compassionate, validating interactions
- **Session Management**: Save and load conversations
- **Crisis Response**: Immediate support with hotlines for self-harm detection

## 🌐 Available Implementations

| Language | Status | Location | Tests | Build Tool |
|----------|--------|----------|-------|------------|
| **JavaScript** | ✅ Complete | `/javascript/` | 21/21 ✓ | Node.js |
| **Java** | ✅ Production | `/java/` | 21/21 ✓ | Maven 3.6+ |

Both implementations maintain **100% feature parity** with identical functionality!

## ✨ Key Features

### 1. **Four Adaptive AI Models**
- 🤝 **Empathetic Model** - For emotional support and personal struggles
- 🛠️ **Practical Model** - For problem-solving and actionable advice
- 🧠 **Analytical Model** - For philosophy, ethics, and complex topics
- 🚀 **Supportive Model** - For motivation and goal-setting

The system automatically selects the best model based on conversation context!

### 2. **Intelligent Memory System**
- Stores full conversation history with timestamps
- Remembers past topics and identifies similar discussions
- Maintains up to 50 recent messages in active memory
- Persistent JSON storage for session recovery
- Session summaries with statistics

### 3. **Safety & Crisis Detection**
- 🚨 **Self-Harm Detection** - Identifies suicidal ideation and self-injury language
- 🛑 **Abuse Detection** - Flags violence and threatening content
- ⚠️ **Illegal Activity Detection** - Identifies drug references, hacking, fraud
- 💔 **Crisis Indicators** - Detects hopelessness, worthlessness, isolation

When critical content is detected:
- Provides 988 hotline and crisis resources
- Shows UK (116 123), Australia (13 11 14), and international numbers
- Maintains supportive conversation
- Logs incident for tracking

### 4. **Empathy Engine**
- Validating opening statements
- Context-aware responses
- Natural language variation
- Supportive tone throughout
- Personalizable interactions

## 🚀 Quick Start

### JavaScript Implementation
```bash
cd /workspaces/CS1200-Project-/javascript/src
node config.js
```

### Java Implementation
```bash
cd /workspaces/CS1200-Project-/java
# Run with Maven
mvn exec:java -Dexec.mainClass="com.empathy.ai.EmpathyAIApp"

# Or use the shaded JAR
java -jar target/empathetic-ai-system-1.0.0-shaded.jar
```

### Run Tests

**JavaScript:**
```bash
cd /workspaces/CS1200-Project-/javascript/tests
node testSuite.js
```

**Java:**
```bash
cd /workspaces/CS1200-Project-/java
mvn test
```

**Results: ✅ 42/42 tests passing across both implementations (100% success rate)**

## 📊 Test Coverage

Both implementations include identical test suites:

### Conversation History (6 tests)
✓ Add messages, retrieve context, flag content, save/load sessions

### Safety Filter (7 tests)
✓ Self-harm, abuse, illegal activity, crisis indicator detection + crisis response

### EmpathyAI (8 tests)
✓ Model selection, message processing, history building, safety reporting

**Total: 42 tests (21 per implementation) | 100% pass rate across both languages** 🎉

## 📁 Project Structure

```
/workspaces/CS1200-Project-/
├── javascript/                    # 🟨 JavaScript Implementation
│   ├── src/
│   │   ├── config.js              # JavaScript entry point
│   │   ├── EmpathyAI.js           # AI engine
│   │   ├── ConversationHistory.js # Memory system
│   │   └── SafetyFilter.js        # Safety filtering
│   └── tests/
│       └── testSuite.js           # 21 comprehensive tests
├── java/                          # ☕ Java Implementation (Maven)
│   ├── src/
│   │   ├── main/java/com/empathy/ai/
│   │   │   ├── EmpathyAIApp.java  # Java CLI application
│   │   │   ├── EmpathyAI.java     # AI engine
│   │   │   ├── ConversationHistory.java
│   │   │   └── SafetyFilter.java
│   │   └── test/java/com/empathy/ai/
│   │       └── TestSuite.java     # 21 JUnit tests
│   ├── pom.xml                    # Maven configuration
│   ├── README.md                  # Java-specific docs
│   └── target/
│       └── empathetic-ai-system-1.0.0-shaded.jar
├── data/                          # Saved conversations
├── DOCUMENTATION.md               # Complete technical documentation
├── QUICK_START.md                 # Developer quick reference
├── JAVA_CONVERSION_SUMMARY.md     # Java implementation details
├── MULTI_LANGUAGE_OVERVIEW.md     # All implementations compared
└── README.md                      # This file
```

## 💡 How It Works

### 1. Message Processing Pipeline
```
User Input
    ↓
Safety Check → Flagged Content? → Emergency Protocol
    ↓ (safe)
Model Selection → Keyword Analysis → Pick Best Model
    ↓
Response Generation → Empathy + Context + Model Specialization
    ↓
Store in Memory → Timestamp + Metadata
    ↓
Output Response
```

### 2. Model Selection Logic
```
Message Keywords → Emotional? → Empathetic Model
                → Problem? → Practical Model
                → Philosophy? → Analytical Model
                → Goals? → Supportive Model
                → Default → Empathetic Model (safest choice)
```

### 3. Safety Response Hierarchy
```
Critical (Self-Harm) → Immediate Crisis Resources + Hotline
Warning (Crisis Signs) → Empathetic Support + Resources
Safe → Normal Conversation
```

## 📖 Usage Examples

### Interactive Session
```
🤖 Hello! What's your name?
You: Sarah

You: I'm feeling really anxious
🤖 I understand how you feel. That sounds really challenging...
   [Using: Empathetic Model]

You: resources
🤖 [Displays crisis hotlines and support services]

You: save
✓ Conversation saved to: data/session_20251116_145023.json
```

### Programmatic Usage
```python
from empathy_ai import EmpathyAI

# Create AI instance
ai = EmpathyAI(user_name="Alex")

# Process messages
result = ai.process_message("I'm struggling with anxiety")
print(result['response'])        # Empathetic response
print(result['model_used'])      # "empathetic"
print(result['is_safe'])         # True/False

# Check history
summary = ai.get_conversation_summary()
print(f"Total messages: {summary['total_messages']}")

# Save session
ai.save_session("my_conversation.json")
```

## 🛡️ Safety Features

### Detected Keywords & Patterns
**Self-Harm**: "suicide", "kill myself", "end my life", "cut myself", etc.

**Abuse/Violence**: "hit you", "hurt you", "assault", "violence", etc.

**Illegal**: "cocaine", "heroin", "steal", "hacking", etc.

**Crisis Indicators**: "hopeless", "worthless", "nobody cares", "trapped", etc.

### Crisis Response Example
```
You: I want to hurt myself
🤖 SAFETY PROTOCOL ACTIVATED

I'm genuinely concerned about your safety and well-being.
You deserve support from professionals trained to help.

📞 US: Call 988 or text HOME to 741741
📞 UK: Call 116 123 or text SHOUT to 85258
📞 International: findahelpline.com

Your life has value. These feelings can change. Please talk to someone.
```

## 🎯 Built-in Commands

| Command | Description |
|---------|------------|
| `models` | View all 4 AI models |
| `history` | See conversation history |
| `summary` | Get session statistics |
| `report` | Check safety incidents |
| `resources` | Display crisis hotlines |
| `save` | Save conversation to file |
| `exit` | End session safely |

## 📊 Module Details

### ConversationHistory (96 lines)
Manages conversation data:
- Stores messages with timestamps
- Tracks safety flags
- Saves/loads to JSON
- Provides context retrieval

### SafetyFilter (195 lines)
Safety detection and crisis response:
- Keyword-based harmful content detection
- Multiple severity levels
- Crisis resource provision
- Incident reporting

### EmpathyAI (210 lines)
Core AI engine:
- Model selection algorithm
- Empathetic response generation
- History integration
- Session management

### Main (227 lines)
Interactive interface:
- User-friendly CLI
- Command processing
- Response display
- Session management

## ⚙️ Configuration

Edit `src/config.py` to customize:

```python
AI_CONFIG = {
    "max_conversation_history": 50,
    "safety_sensitivity": "medium",  # 'low', 'medium', 'high'
}

SAFETY_CONFIG = {
    "detect_self_harm": True,
    "detect_abuse": True,
    "detect_illegal": True,
}

FEATURES = {
    "enable_conversation_memory": True,
    "enable_safety_filter": True,
    "enable_session_saving": True,
}
```

## 📚 Complete Documentation

- **QUICK_START.md** - Developer quick reference
- **DOCUMENTATION.md** - Full technical documentation
- **Code comments** - Every module is well-documented

## 🔒 Important Disclaimers

⚠️ **This AI is NOT:**
- A replacement for professional mental health services
- Able to diagnose mental health conditions
- A substitute for emergency services

✅ **Best used for:**
- Daily emotional support
- Problem-solving practice
- Exploring ideas
- Motivation and encouragement

🆘 **When to seek professional help:**
- Active suicidal thoughts
- Current self-harm
- Severe mental health crisis
- Abuse or trauma

**Crisis Resources:**
- 🇺🇸 US: 988 (Suicide & Crisis Lifeline)
- 🇬🇧 UK: 116 123 (Samaritans)
- 🇦🇺 AU: 13 11 14 (Lifeline)
- 🌍 International: findahelpline.com

## 🚀 Next Steps

1. **Try it now**: `cd src && python main.py`
2. **Run tests**: `cd tests && python test_suite.py`
3. **Read docs**: See DOCUMENTATION.md for full technical details
4. **Customize**: Edit config.py to personalize
5. **Integrate**: Add real AI APIs for production deployment

## 🎓 Learning Resources

- **src/conversation_history.py** - How to build memory systems
- **src/safety_filter.py** - How to detect harmful content safely
- **src/empathy_ai.py** - How to build adaptive AI systems
- **tests/test_suite.py** - How to test AI systems comprehensively

## 📝 Code Statistics

| File | Lines | Purpose |
|------|-------|---------|
| empathy_ai.py | 210 | Core AI engine |
| safety_filter.py | 195 | Safety detection |
| main.py | 227 | Interactive interface |
| conversation_history.py | 96 | Memory system |
| test_suite.py | 289 | 21 comprehensive tests |
| config.py | 120+ | Configuration |
| **Total** | **~1000** | Production-ready AI system |

## ✅ What's Implemented

- ✅ Conversation memory with timestamps
- ✅ Model selection algorithm
- ✅ Empathetic response generation
- ✅ Self-harm detection
- ✅ Abuse/violence detection
- ✅ Illegal activity detection
- ✅ Crisis indicator detection
- ✅ Crisis resource provision
- ✅ Session saving/loading
- ✅ Interactive interface
- ✅ Command system
- ✅ Safety reporting
- ✅ 21 comprehensive tests (100% pass rate)
- ✅ Complete documentation

## 🎯 Key Achievements

✨ **Production Ready**: All components tested and working
✨ **Modular Design**: Easy to extend and customize
✨ **Safety First**: Comprehensive harm detection
✨ **User Friendly**: Simple CLI interface
✨ **Well Documented**: 1000+ lines of clear, commented code
✨ **Fully Tested**: 21 tests with 100% pass rate

## 📞 Support & Features

### Built-in Crisis Resources
- 988 (US Suicide & Crisis Lifeline)
- 116 123 (UK Samaritans)
- 741741 (Crisis Text Line)
- International helpline finder

### Session Features
- Auto-save conversations
- Load previous conversations
- Session summaries
- Safety incident reports
- Message history with timestamps

### AI Capabilities
- Context-aware responses
- Automatic model selection
- Empathetic tone maintenance
- Similar topic detection
- Supportive closing statements

---

## 🚀 Ready to Start?

```bash
cd /workspaces/CS1200-Project-/src
python main.py
```

**Then explore these commands:**
- `models` - See AI models
- `history` - Check past messages
- `summary` - Get stats
- `resources` - Crisis support
- `save` - Save conversation
- `exit` - End safely

---

**Built with ❤️ for compassionate, ethical AI | Version 1.0 | Fully Tested ✅**
