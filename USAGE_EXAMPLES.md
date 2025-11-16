# Usage Examples & Scenarios

## Complete Example Walkthrough

### Scenario 1: Starting Your First Session

```
$ cd /workspaces/CS1200-Project-/src
$ python main.py

🤖 Welcome to the Empathetic AI System

What's your name? (press Enter for 'User'): Sarah
==============================================================================
🤝 EMPATHETIC AI SYSTEM
==============================================================================
Hello, Sarah! I'm here to listen and support you.

I have these special features:
  ✓ Empathetic responses tailored to your needs
  ✓ Memory of our conversation for better context
  ✓ Safety monitoring to protect your well-being
  ✓ Multiple AI models that adapt to your situation

Commands:
  'models'    - See available AI models
  'history'   - View conversation history
  'summary'   - Get session summary
  'report'    - View safety report
  'save'      - Save this conversation
  'resources' - Get crisis resources
  'exit'      - End conversation
==============================================================================

Sarah: Hi! I've been feeling really overwhelmed with school lately

🤖 AI Assistant: I understand how you feel. That sounds really challenging.
   Your feelings make complete sense. What you're going through matters.
   School can be demanding, and it's important to acknowledge when it
   becomes overwhelming. I'm here to listen and support you through this.
   Tell me more about what's on your mind?

   [Using: Empathetic Model]
```

### Scenario 2: Using the Problem-Solving Model

```
Sarah: I need advice on how to manage my time better

🤖 AI Assistant: Let me help you find practical solutions. Based on what
   you've shared, here are some steps we could consider:
   1) First, let's understand the core issue clearly.
   2) Then we can explore options together.
   What aspect would you like to focus on first?

   [Using: Practical Model]
```

### Scenario 3: Accessing Help Commands

```
Sarah: models

📊 AVAILABLE AI MODELS
--------------------------------------------------

  EMPATHETIC
  Name: Empathetic Model
  Specialization: emotional support and understanding
  Best for: crisis support, emotional topics, personal struggles
  Traits: compassionate, validating, patient, non-judgmental

  PRACTICAL
  Name: Practical Model
  Specialization: actionable advice and solutions
  Best for: problem-solving, advice, technical questions
  Traits: efficient, focused, solution-oriented, clear

  ANALYTICAL
  Name: Analytical Model
  Specialization: deep thinking and complex topics
  Best for: philosophy, ethics, complex analysis
  Traits: thoughtful, thorough, balanced, nuanced

  SUPPORTIVE
  Name: Supportive Model
  Specialization: encouragement and motivation
  Best for: motivation, goal-setting, self-improvement
  Traits: positive, encouraging, motivating, uplifting
```

### Scenario 4: Viewing Conversation History

```
Sarah: history

--------------------------------------------------
📜 CONVERSATION HISTORY
--------------------------------------------------

1. [USER] 2025-11-16 14:50:23
   Hi! I've been feeling really overwhelmed with school lately

2. [ASSISTANT] 2025-11-16 14:50:25
   I understand how you feel. That sounds really challenging...

3. [USER] 2025-11-16 14:52:10
   I need advice on how to manage my time better

4. [ASSISTANT] 2025-11-16 14:52:12
   Let me help you find practical solutions...
```

### Scenario 5: Safety Detection (Critical)

```
Sarah: I've been having thoughts about hurting myself

🤖 AI Assistant: [CRITICAL ALERT - SAFETY PROTOCOL ACTIVATED]

I'm genuinely concerned about your safety and well-being. You deserve
support from professionals trained to help. Please reach out to a crisis
service:

🌍 **US**: Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741
🇬🇧 **UK**: Call 116 123 (Samaritans) or text SHOUT to 85258
🌐 **International**: Visit findahelpline.com

Your life has value. These feelings can change. Please talk to someone.

   [Using: safety_protocol]
   ⚠️ [Safety concern flagged]
```

### Scenario 6: Viewing Safety Report

```
Sarah: report

--------------------------------------------------
🛡️ SAFETY REPORT
--------------------------------------------------
Total Incidents: 1
Critical: 1
Warnings: 0

Incidents:
  - [CRITICAL] self_harm_detected
    Message: I've been having thoughts about hurting myself
    Time: 2025-11-16T14:55:30.123456
```

### Scenario 7: Getting Crisis Resources

```
Sarah: resources

--------------------------------------------------
🆘 CRISIS RESOURCES & SUPPORT
--------------------------------------------------

US:
  • suicide_hotline: 988 (Suicide & Crisis Lifeline)
  • crisis_text: Text HOME to 741741
  • vet_crisis: 988 then press 1

UK:
  • samaritans: 116 123
  • crisis_text: Text SHOUT to 85258

Canada:
  • crisis_hotline: 1-833-456-4566
  • text_support: Text HOME to 741741

Australia:
  • lifeline: 13 11 14
  • text_support: 0487 131 114

International:
  • help_finder: befrienders.org or findahelpline.com

==============================================================================
If you're experiencing thoughts of self-harm:
  1. Please reach out to one of these services
  2. Tell someone you trust
  3. Go to your nearest emergency room if in immediate danger
==============================================================================
```

### Scenario 8: Saving a Conversation

```
Sarah: save

✓ Conversation saved to: ../data/session_20251116_145023.json
```

### Scenario 9: Ending Session

```
Sarah: exit

==============================================================================
Would you like to save this conversation? (yes/no): yes
✓ Conversation saved to: ../data/session_20251116_145023.json

Conversation Summary:
  Total messages: 12
  Duration: 2025-11-16T14:50:23 to 2025-11-16T14:58:45

🙏 Thank you for the conversation. Your well-being matters.
Remember: You are not alone, and support is always available.
==============================================================================
```

---

## Programmatic Usage Examples

### Example 1: Basic Message Processing

```python
from empathy_ai import EmpathyAI

# Create AI instance
ai = EmpathyAI(user_name="Alex")

# Process a message
result = ai.process_message("I'm feeling anxious about my job interview")

# Display response
print(f"Response: {result['response']}")
print(f"Model Used: {result['model_used']}")
print(f"Is Safe: {result['is_safe']}")

# Output:
# Response: I understand how you feel. That sounds really challenging...
# Model Used: empathetic
# Is Safe: True
```

### Example 2: Working with Conversation History

```python
from empathy_ai import EmpathyAI

ai = EmpathyAI(user_name="Jordan")

# Have a conversation
ai.process_message("I've been thinking about my career")
ai.process_message("How can I make better decisions?")
ai.process_message("I want to grow professionally")

# Get summary
summary = ai.get_conversation_summary()
print(f"Total messages: {summary['total_messages']}")
print(f"User messages: {summary['user_messages']}")
print(f"Session ID: {summary['session_id']}")

# Get all messages
all_messages = ai.history.get_all_messages()
for msg in all_messages:
    print(f"{msg['role']}: {msg['content'][:50]}...")
```

### Example 3: Safety Filtering

```python
from safety_filter import SafetyFilter

safety = SafetyFilter(sensitivity_level="high")

# Check for harmful content
messages = [
    "I love this beautiful day",
    "I want to hurt myself",
    "Can you help me with this?",
    "I feel hopeless and alone"
]

for message in messages:
    severity, is_flagged, reason = safety.analyze_message(message)
    print(f"Message: {message}")
    print(f"Severity: {severity}, Flagged: {is_flagged}, Reason: {reason}\n")

# Output:
# Message: I love this beautiful day
# Severity: safe, Flagged: False, Reason: None
#
# Message: I want to hurt myself
# Severity: critical, Flagged: True, Reason: self_harm_detected
#
# Message: Can you help me with this?
# Severity: safe, Flagged: False, Reason: None
#
# Message: I feel hopeless and alone
# Severity: warning, Flagged: True, Reason: crisis_indicator_detected
```

### Example 4: Session Persistence

```python
from empathy_ai import EmpathyAI

# Create AI and have conversation
ai = EmpathyAI(user_name="Casey")
ai.process_message("I'm working on my projects")
ai.process_message("I want to achieve my goals")
ai.process_message("I'm making good progress")

# Save session
ai.save_session("/path/to/session.json")

# In a different session, load previous conversation
ai2 = EmpathyAI(user_name="Casey")
ai2.load_session("/path/to/session.json")

# Can see previous context
history = ai2.history.get_all_messages()
print(f"Loaded {len(history)} messages from previous session")
```

### Example 5: Model Information

```python
from empathy_ai import EmpathyAI

ai = EmpathyAI()

# Get all models
models = ai.get_model_info()
for model_name, info in models.items():
    print(f"{model_name}: {info['specialization']}")

# Get specific model
empathetic = ai.get_model_info("empathetic")
print(f"Traits: {empathetic['traits']}")

# Output:
# empathetic: emotional support and understanding
# practical: actionable advice and solutions
# analytical: deep thinking and complex topics
# supportive: encouragement and motivation
#
# Traits: ['compassionate', 'validating', 'patient', 'non-judgmental']
```

### Example 6: Creating Custom Responses

```python
from empathy_ai import EmpathyAI
from conversation_history import ConversationHistory

# Create instances
ai = EmpathyAI(user_name="Morgan")
history = ai.history

# Build conversation manually
history.add_message("user", "I'm struggling with confidence")
history.add_message("assistant", "Your feelings are valid...")
history.add_message("user", "How can I build my confidence?")

# Process with full context
result = ai.process_message("What's the first step?")
print(result['response'])
print(f"\nUsing {result['model_used']} model")
print(f"Context from previous: {result['from_history']}")
```

---

## Testing Examples

### Running Full Test Suite

```bash
$ cd /workspaces/CS1200-Project-/tests
$ python test_suite.py

======================================================================
🧪 EMPATHETIC AI SYSTEM - TEST SUITE
======================================================================

📝 Testing Conversation History Module...
--------------------------------------------------
✓ Test 1: Add messages - PASSED
✓ Test 2: Get recent context - PASSED
✓ Test 3: Get user messages - PASSED
✓ Test 4: Flag messages - PASSED
✓ Test 5: Get session summary - PASSED
✓ Test 6: Save and load history - PASSED

��️ Testing Safety Filter Module...
--------------------------------------------------
✓ Test 1: Detect self-harm - PASSED
✓ Test 2: Detect abuse - PASSED
✓ Test 3: Detect illegal activity - PASSED
✓ Test 4: Detect crisis indicators - PASSED
✓ Test 5: Safe message detection - PASSED
✓ Test 6: Generate crisis response - PASSED
✓ Test 7: Flag message recording - PASSED

🤖 Testing Empathy AI Module...
--------------------------------------------------
✓ Test 1: Model selection (emotional) - PASSED
✓ Test 2: Model selection (practical) - PASSED
✓ Test 3: Model selection (analytical) - PASSED
✓ Test 4: Safe message processing - PASSED
✓ Test 5: History building - PASSED
✓ Test 6: Flagged content handling - PASSED
✓ Test 7: Get safety report - PASSED
✓ Test 8: Get model info - PASSED

======================================================================
📊 TEST SUMMARY
======================================================================
Total Tests: 21
Passed: 21 ✓
Failed: 0 ✗
Success Rate: 100.0%

🎉 All tests passed! System is working correctly.
======================================================================
```

---

## Tips & Best Practices

### For Users

1. **Be honest** - Share your real feelings for better responses
2. **Use commands** - Try `resources` if you need crisis help
3. **Save sessions** - Use `save` to preserve conversations
4. **Check history** - Use `history` to see your progress
5. **Ask for help** - Type `resources` anytime for support

### For Developers

1. **Understand the flow** - Read ARCHITECTURE.md first
2. **Study the tests** - Test suite shows all capabilities
3. **Extend safely** - Add features without breaking existing code
4. **Document changes** - Keep comments and docs updated
5. **Test thoroughly** - Add tests for new functionality

### For Production

1. **Configure resources** - Update crisis numbers for your region
2. **Monitor incidents** - Review safety reports regularly
3. **Adjust sensitivity** - Calibrate for your use case
4. **Backup data** - Regular backup of saved conversations
5. **Update keywords** - Add new harmful keywords as needed

---

## Common Questions

**Q: Will my data be saved?**
A: Yes, conversations are saved locally in JSON format. You control the data.

**Q: Is this a real AI?**
A: This version uses keyword-based responses. You can integrate real AI APIs.

**Q: Can it replace therapy?**
A: No. This is for daily support, not professional treatment.

**Q: What if it detects a crisis?**
A: It automatically provides crisis hotlines and resources.

**Q: Can I customize the responses?**
A: Yes. Edit the config.py and response generation functions.

**Q: How private is this?**
A: Completely private. Everything runs locally on your machine.

---

**Ready to get started? Run: `python main.py`** 🚀
