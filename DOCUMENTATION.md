# Empathetic AI System - Complete Documentation

## Overview

The **Empathetic AI System** is a sophisticated conversational AI designed with three core pillars:
1. **Empathy & Understanding** - Provides compassionate, validating responses
2. **Safety & Protection** - Detects harmful content and provides crisis resources
3. **Memory & Context** - Remembers conversations for better context-aware responses

---

## Features

### 1. **Adaptive Model Selection**
The system automatically selects the best AI model based on conversation context:

- **Empathetic Model**: For emotional support, personal struggles, crisis situations
- **Practical Model**: For problem-solving, advice, actionable guidance
- **Analytical Model**: For philosophical questions, complex analysis, ethical discussions
- **Supportive Model**: For motivation, goal-setting, encouragement

### 2. **Conversation Memory**
- Stores full conversation history with timestamps
- Remembers past topics for contextual continuity
- Identifies similar topics from previous conversations
- Saves sessions to persistent JSON storage
- Maintains up to 50 recent messages in active memory

### 3. **Safety Filter**
Detects and flags:
- **Self-harm language**: Keywords indicating suicidal ideation or self-injury
- **Abuse/Violence**: Threats or descriptions of harming others
- **Illegal Activity**: References to drugs, theft, hacking, etc.
- **Crisis Indicators**: Signs of mental health crisis (hopelessness, worthlessness, etc.)

Safety levels:
- **Critical**: Immediate response with crisis resources
- **Warning**: Flagged for review with supportive response
- **Safe**: Normal conversation

### 4. **Crisis Response Protocol**
When critical content is detected:
1. Immediately pauses normal response
2. Provides empathetic acknowledgment
3. Shares crisis hotline numbers and resources
4. Flags incident for tracking
5. Resumes supportive conversation

### 5. **Session Management**
- Automatic session tracking with unique IDs
- Ability to save/load conversations
- Session summaries with statistics
- Safety incident reporting

---

## Project Structure

```
CS1200-Project-/
├── src/
│   ├── conversation_history.py    # Conversation memory management
│   ├── safety_filter.py            # Safety detection & crisis response
│   ├── empathy_ai.py               # Main AI engine with model selection
│   ├── main.py                     # Interactive application
│   └── config.py                   # Configuration settings
├── tests/
│   └── test_suite.py               # Comprehensive test suite
├── data/                           # Saved conversations & logs
└── README.md                       # This file
```

---

## Core Modules

### ConversationHistory
Manages all conversation data with timestamps and metadata.

**Key Methods:**
- `add_message(role, content, safety_flag)` - Add message to history
- `get_recent_context(num_messages)` - Get recent messages for context
- `get_flagged_messages()` - Retrieve messages flagged for safety
- `save_to_file(filepath)` - Persist conversation to JSON
- `load_from_file(filepath)` - Load previous conversation

**Example:**
```python
history = ConversationHistory(max_history=50)
history.add_message("user", "How are you feeling?")
history.add_message("assistant", "I'm doing well, thanks for asking!")
history.save_to_file("my_conversation.json")
```

### SafetyFilter
Analyzes messages for harmful content and provides crisis support.

**Key Methods:**
- `analyze_message(message)` - Returns (severity, is_flagged, reason)
- `get_safe_response(severity, reason)` - Generate appropriate safe response
- `flag_message(message, severity, reason)` - Record flagged content
- `generate_incident_report()` - Create safety report
- `get_crisis_resources(country)` - Retrieve crisis hotlines

**Flagged Categories:**
- `self_harm_detected` - Suicidal ideation or self-injury
- `abuse_detected` - Violence or threats toward others
- `illegal_activity_detected` - Illegal behavior
- `crisis_indicator_detected` - Mental health crisis signs

**Example:**
```python
safety = SafetyFilter(sensitivity_level="medium")
severity, is_flagged, reason = safety.analyze_message("I want to hurt myself")
if is_flagged:
    response = safety.get_safe_response(severity, reason)
    print(response)  # Provides crisis hotline and resources
```

### EmpathyAI
Main AI engine that combines all components for intelligent, safe, empathetic responses.

**Key Methods:**
- `select_best_model(message)` - Choose optimal model for message
- `process_message(user_message)` - Full pipeline: safety check → model selection → response generation
- `get_conversation_summary()` - Get session statistics
- `get_safety_report()` - Retrieve safety incidents
- `save_session(filepath)` - Persist conversation

**Model Selection Logic:**
- Analyzes message keywords
- Matches to most appropriate model
- Falls back to empathetic model for safety

**Example:**
```python
ai = EmpathyAI(user_name="Sarah")
result = ai.process_message("I'm feeling overwhelmed")
print(result['response'])  # Empathetic response with support
print(result['model_used'])  # 'empathetic'
print(result['is_safe'])  # True
```

### Main Application (Interactive Interface)
Provides user-friendly CLI interface with built-in commands.

**Commands:**
- `models` - View available AI models
- `history` - Display conversation history
- `summary` - Get session statistics
- `report` - View safety incidents
- `save` - Save conversation to file
- `resources` - Display crisis support resources
- `exit` - End session (with save option)

**Example Session:**
```
User: I've been feeling really sad lately
🤖 AI Assistant: I understand how you feel. That sounds really challenging...

User: resources
[Displays crisis hotlines and support services]

User: exit
Would you like to save? (yes/no): yes
✓ Conversation saved to: data/session_20251116_145023.json
```

---

## Usage Guide

### Installation
```bash
# No external dependencies required!
# Pure Python implementation using only standard library
cd /workspaces/CS1200-Project-/src
```

### Running the System

#### Interactive Mode
```bash
python main.py
```
Follow prompts to enter your name and start conversing.

#### Testing
```bash
cd ../tests
python test_suite.py
```
Runs comprehensive test suite covering all modules.

#### Programmatic Usage
```python
from empathy_ai import EmpathyAI

# Create AI instance
ai = EmpathyAI(user_name="John")

# Process messages
result = ai.process_message("I'm struggling with anxiety")
print(result['response'])

# Check conversation history
summary = ai.get_conversation_summary()
print(f"Total messages: {summary['total_messages']}")

# Save session
ai.save_session("my_session.json")
```

---

## Safety Features in Detail

### Self-Harm Detection
The system identifies keywords and phrases indicating:
- Suicidal thoughts: "suicide", "kill myself", "end my life", etc.
- Self-injury: "cut myself", "hurt myself", "harm myself", etc.
- Hopelessness: "worthless", "burden", "nothing matters", etc.

**Response Protocol:**
1. Immediately recognizes severity
2. Provides crisis hotline for user's region
3. Offers supportive resources
4. Records incident with timestamp
5. Maintains supportive conversation after crisis intervention

### Abuse & Violence Detection
Flags language indicating:
- Violence toward others
- Threats or assault language
- Harmful intentions

**Response:** Compassionate redirect explaining AI cannot support harmful acts + offer of legitimate support resources.

### Illegal Activity Detection
Flags references to:
- Drug use or distribution
- Theft or fraud
- Hacking or exploitation

**Response:** Non-judgmental acknowledgment with suggestion to seek legal resources.

### Crisis Indicators
Detects signs of mental health crisis:
- Hopelessness, feeling trapped
- Isolation, loneliness indicators
- Overwhelm or desperation
- Dark or suicidal ideation

**Response:** Empathetic validation + resources + offer of continued support.

---

## Configuration

Edit `config.py` to customize:

```python
AI_CONFIG = {
    "max_conversation_history": 50,  # Keep last 50 messages
    "safety_sensitivity": "medium",   # 'low', 'medium', 'high'
}

SAFETY_CONFIG = {
    "detect_self_harm": True,
    "detect_abuse": True,
    "detect_illegal": True,
    "auto_respond_to_critical": True,
}

FEATURES = {
    "enable_conversation_memory": True,
    "enable_safety_filter": True,
    "enable_session_saving": True,
}
```

---

## Data Storage

### Conversation History Format
Saved conversations use JSON format:

```json
{
  "session_id": "20251116_145023",
  "messages": [
    {
      "timestamp": "2025-11-16T14:50:23.123456",
      "role": "user",
      "content": "I'm feeling anxious",
      "safety_flag": null
    },
    {
      "timestamp": "2025-11-16T14:50:25.456789",
      "role": "assistant",
      "content": "I understand how you feel...",
      "safety_flag": null
    },
    {
      "timestamp": "2025-11-16T14:50:30.789012",
      "role": "user",
      "content": "I want to hurt myself",
      "safety_flag": "self_harm_detected"
    }
  ],
  "summary": {
    "session_id": "20251116_145023",
    "total_messages": 3,
    "user_messages": 2,
    "assistant_messages": 1,
    "flagged_count": 1
  }
}
```

### Directory Structure
```
data/
├── session_20251116_145023.json    # Saved conversation
├── session_20251116_150145.json    # Another session
└── app.log                         # Application logs
```

---

## Test Coverage

The test suite validates all system components:

### Conversation History Tests (6 tests)
- Add and retrieve messages
- Recent context retrieval
- Message filtering and flagging
- Session summaries
- File persistence

### Safety Filter Tests (7 tests)
- Self-harm keyword detection
- Abuse language detection
- Illegal activity detection
- Crisis indicator detection
- Safe message filtering
- Crisis response generation
- Incident reporting

### EmpathyAI Tests (8 tests)
- Model selection for different contexts
- Safe message processing
- History building
- Flagged content handling
- Safety reporting
- Model information retrieval

**Run Tests:**
```bash
cd tests
python test_suite.py
```

Expected output shows detailed pass/fail for 21+ tests.

---

## Crisis Resources (Integrated)

The system provides location-specific crisis resources:

### United States
- **Suicide & Crisis Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **Veteran Crisis**: 988 (press 1)

### United Kingdom
- **Samaritans**: 116 123
- **Shout**: Text SHOUT to 85258

### International
- **Befrienders**: befrienders.org
- **Find a Helpline**: findahelpline.com

Resources are automatically provided when crisis content is detected.

---

## Ethical Design Principles

This system is built on:

1. **Harm Prevention**: Detects and prevents discussions of self-harm, abuse, violence
2. **Empathy First**: Validates feelings and provides compassionate responses
3. **Safety Over Engagement**: Will end conversation if necessary to protect user
4. **Transparency**: Clear about limitations and when to seek professional help
5. **Privacy**: Conversations stored locally, can be deleted anytime
6. **Accessibility**: Simple interface, clear language, no jargon
7. **Accountability**: All flagged incidents logged and reportable

---

## Limitations & Disclaimers

⚠️ **Important**: This AI system:
- Is NOT a replacement for professional mental health services
- Cannot diagnose mental health conditions
- Should not be relied upon as primary mental health treatment
- Works best in combination with professional help
- Always recommends professional resources for serious concerns

**When to Seek Emergency Help:**
- Active suicidal thoughts
- Current self-harm behavior
- Safety concerns
- Severe mental health crisis

**Resources:**
- Call emergency services (911 in US)
- Go to nearest emergency room
- Call National Suicide Prevention Lifeline: 988
- Text crisis services: 741741

---

## Future Enhancements

Planned improvements:
- [ ] Integration with real AI APIs (OpenAI, Claude, etc.)
- [ ] Multi-language support
- [ ] Advanced NLP for better understanding
- [ ] Machine learning for model selection
- [ ] Database backend for large-scale storage
- [ ] User authentication and privacy features
- [ ] Analytics dashboard
- [ ] Integration with professional resources
- [ ] Mobile app interface
- [ ] Voice conversation support

---

## Development & Contribution

### Code Structure
- **Modular design**: Each component is independent and testable
- **Clear separation**: Logic, data, and interface are separated
- **Extensive documentation**: Code is well-commented
- **Test coverage**: 21+ tests for all functionality

### Adding New Features
1. Add logic to appropriate module
2. Update tests in test_suite.py
3. Add configuration options to config.py
4. Update this documentation

---

## Support & Feedback

For issues, questions, or improvements:
1. Check existing documentation
2. Review test suite for usage examples
3. Check code comments for implementation details

---

## License & Attribution

This system prioritizes user safety and ethical AI practices.
Built with ❤️ for compassionate AI development.

---

**Last Updated**: November 16, 2025
**Version**: 1.0
**Status**: Production Ready ✓
