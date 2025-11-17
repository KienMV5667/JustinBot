# System Architecture & Design Overview

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     EMPATHETIC AI SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │   User Input     │→ │  Main.py (CLI)   │→ │  EmpathyAI   │  │
│  │                  │  │  • Commands      │  │  • Orchestr. │  │
│  │  • Text Messages │  │  • Display       │  │  • Pipelines │  │
│  │  • Commands      │  │  • Session Mgmt  │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│         ▲                       ▲                      │          │
│         │                       │                      ▼          │
│         │                       │          ┌──────────────────┐  │
│         │                       └──────────→│ Safety Filter    │  │
│         │                                   │ ─────────────── │  │
│         │                                   │ • Self-harm     │  │
│         │                                   │ • Abuse         │  │
│         └───────────────────────────────────│ • Illegal       │  │
│              Save/Load Sessions             │ • Crisis        │  │
│                                             │ • Resources     │  │
│                                             └──────────────────┘  │
│                                                    ▲               │
│         ┌─────────────────────────────────────────┘               │
│         ▼                                                         │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │        Conversation History Module                       │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │  • Store Messages with Timestamps                       │    │
│  │  • Track Safety Flags                                   │    │
│  │  • Retrieve Context (Recent Messages)                   │    │
│  │  • Find Similar Topics                                  │    │
│  │  • Generate Session Summaries                           │    │
│  │  • Save/Load to JSON (Persistent Storage)               │    │
│  └──────────────────────────────────────────────────────────┘    │
│                           ▲                                       │
│                           │                                       │
│                    ┌──────┴───────┐                              │
│                    ▼              ▼                              │
│            ┌────────────────┐  ┌────────────────────┐            │
│            │ Model Selection│  │ Response Generator │            │
│            │ ────────────── │  │ ─────────────────  │            │
│            │ • Keyword      │  │ • Empathy Starters │            │
│            │   Analysis     │  │ • Model-specific   │            │
│            │ • Context      │  │   Response         │            │
│            │   Matching     │  │ • Supportive Close │            │
│            │ • 4 Models     │  │ • Crisis Response  │            │
│            └────────────────┘  └────────────────────┘            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │             Available AI Models                         │    │
│  │  ──────────────────────────────────────────────────── │    │
│  │  1. EMPATHETIC: Emotional support, validation         │    │
│  │  2. PRACTICAL: Problem-solving, actionable advice     │    │
│  │  3. ANALYTICAL: Philosophy, complex thinking          │    │
│  │  4. SUPPORTIVE: Motivation, goal-setting              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │        Configuration (config.py)                        │    │
│  │  ──────────────────────────────────────────────────── │    │
│  │  • AI Settings (max history, sensitivity)              │    │
│  │  • Model Configurations                                │    │
│  │  • Safety Settings (detection flags)                   │    │
│  │  • Feature Toggles                                     │    │
│  │  • Crisis Resources by Region                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            Data Storage (JSON Format)                   │    │
│  │  ──────────────────────────────────────────────────── │    │
│  │  • Conversation History with Timestamps                │    │
│  │  • Session Metadata                                    │    │
│  │  • Safety Incidents                                    │    │
│  │  • Persistent Between Sessions                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
1. USER SENDS MESSAGE
                ↓
2. PARSE INPUT (check for commands)
                ↓
        [Is Command?]
       /            \
      /              \
   [YES]            [NO]
    ↓                ↓
 EXECUTE        PROCESS MESSAGE
 COMMAND             ↓
    ↓           SAFETY CHECK
 DISPLAY        ↓
 RESULT      [Harmful Content?]
    ↓         /             \
 CONTINUE    /               \
            [YES]           [NO]
             ↓               ↓
          CRITICAL     SELECT MODEL
          RESPONSE      ↓
             ↓      [Keyword Analysis]
          FLAG        ↓
       INCIDENT   [Emotional?] → EMPATHETIC
             ↓   [Problem?]   → PRACTICAL
          STORE  [Philosophy?]→ ANALYTICAL
          HISTORY [Goals?]    → SUPPORTIVE
             ↓               ↓
          OUTPUT        GENERATE RESPONSE
          CRISIS            ↓
          MESSAGE      [Check History]
             ↓               ↓
          CONTINUE    [Similar Topics Found?]
                        ↓
                    [YES] → ADD TO RESPONSE
                    ↓
                    [NO]
                    ↓
                STORE IN HISTORY
                    ↓
                OUTPUT RESPONSE
                    ↓
                CONTINUE LOOP
```

## Component Interactions

### Message Processing Pipeline

```
INPUT MESSAGE
     ↓
┌─────────────────────────────────┐
│  Safety Filter Analysis         │
│  ─────────────────────────────  │
│  Check 4 Keyword Categories:    │
│  • Self-harm (CRITICAL)         │
│  • Abuse (CRITICAL)             │
│  • Illegal (WARNING)            │
│  • Crisis Indicators (WARNING)  │
└─────────────────────────────────┘
     ↓
  [SEVERITY?]
  /  |  \  \
 /   |   \  \
C  W  S  (safe)
R  A  A      ↓
I  R  F   Add to History
T  N  E      ↓
I  I  Select Best Model
C  N  ↓
A  G [Emotional Keywords?]
L     │     ↓
│     ├─→ Empathetic
│     │
│     ├─→ Practical (Problem-solving)
│     │
│     ├─→ Analytical (Complex topics)
│     │
│     └─→ Supportive (Motivation)
│
├─→ WARNING
│   Generate Safe Response
│   + Supportive Message
│
└─→ CRITICAL
    Activate Crisis Protocol
    • Provide 988 Hotline
    • Show Crisis Resources
    • Flag Incident
    • Maintain Support
```

### Safety Detection Hierarchy

```
INCOMING MESSAGE
     ↓
CHECK SELF-HARM KEYWORDS
"suicide", "kill myself", "hurt myself", "end my life"
     ├─→ [FOUND] → CRITICAL ✗
     │              │
     │              └→ Crisis Response
     │                 Resources: 988, 741741, etc.
     │
     └─→ [NOT FOUND]
         ↓
    CHECK ABUSE KEYWORDS
    "hurt you", "beat you", "assault", "violence"
         ├─→ [FOUND] → CRITICAL ✗
         │
         └─→ [NOT FOUND]
             ↓
         CHECK ILLEGAL KEYWORDS
         "cocaine", "steal", "hacking"
             ├─→ [FOUND] → WARNING ⚠️
             │
             └─→ [NOT FOUND]
                 ↓
             CHECK CRISIS INDICATORS
             "hopeless", "worthless", "trapped", "alone"
                 ├─→ [FOUND] → WARNING ⚠️
                 │             (if sensitivity: medium/high)
                 │
                 └─→ [NOT FOUND] → SAFE ✓
```

## Model Selection Algorithm

```
MESSAGE RECEIVED
     ↓
EXTRACT KEYWORDS
     ↓
CATEGORIZE EMOTIONAL CONTENT
     │
     ├─ Emotional Keywords
     │  ("sad", "anxious", "lonely", "hurt", "scared", "depressed")
     │  ↓
     │  EMPATHETIC MODEL SELECTED
     │  [Compassionate, validating, patient]
     │
     ├─ Problem-Solving Keywords
     │  ("how to", "help", "advice", "solution", "fix")
     │  ↓
     │  PRACTICAL MODEL SELECTED
     │  [Efficient, focused, solution-oriented]
     │
     ├─ Complex/Philosophical Keywords
     │  ("why", "meaning", "ethics", "right or wrong", "philosophy")
     │  ↓
     │  ANALYTICAL MODEL SELECTED
     │  [Thoughtful, nuanced, balanced]
     │
     ├─ Motivation/Goal Keywords
     │  ("goal", "achieve", "improve", "progress", "better")
     │  ↓
     │  SUPPORTIVE MODEL SELECTED
     │  [Encouraging, motivating, positive]
     │
     └─ DEFAULT (No Match)
        ↓
        EMPATHETIC MODEL SELECTED
        [Safest default choice]
```

## Conversation Memory System

```
INCOMING MESSAGE
     ↓
STORE WITH METADATA
┌──────────────────────────┐
│ {                        │
│   "timestamp": "ISO",    │
│   "role": "user/asst",   │
│   "content": "message",  │
│   "safety_flag": null    │
│ }                        │
└──────────────────────────┘
     ↓
MAINTAIN RECENT HISTORY
Max 50 messages in memory
     ↓
CONTEXT RETRIEVAL
When generating response:
1. Get last 10 messages
2. Identify similar topics
3. Add context to response
     ↓
SIMILARITY DETECTION
Compare keyword overlap:
- 30%+ similarity = RELATED
- Add to current context
     ↓
SESSION MANAGEMENT
└─→ Save to JSON (persistent)
└─→ Generate summary stats
└─→ Track safety incidents
```

## Configuration System

```
config.py
├── AI_CONFIG
│   ├── default_user_name
│   ├── default_model
│   ├── max_conversation_history (50)
│   └── safety_sensitivity (medium)
│
├── MODEL_CONFIG
│   ├── empathetic: {enabled, timeout, max_tokens}
│   ├── practical: {enabled, timeout, max_tokens}
│   ├── analytical: {enabled, timeout, max_tokens}
│   └── supportive: {enabled, timeout, max_tokens}
│
├── SAFETY_CONFIG
│   ├── detect_self_harm (True)
│   ├── detect_abuse (True)
│   ├── detect_illegal (True)
│   ├── detect_crisis (True)
│   ├── auto_respond_to_critical (True)
│   └── log_flagged_messages (True)
│
├── CRISIS_RESOURCES_CONFIG
│   ├── US: 988, Crisis Text, Vet Crisis
│   ├── UK: Samaritans, Text Support
│   ├── Canada: Crisis Hotline
│   └── Australia: Lifeline
│
├── FEATURES
│   ├── enable_conversation_memory (True)
│   ├── enable_safety_filter (True)
│   ├── enable_model_selection (True)
│   ├── enable_session_saving (True)
│   └── enable_analytics (False)
│
└── LOGGING_CONFIG
    ├── log_level
    ├── log_file
    ├── log_conversations (True)
    └── log_safety_incidents (True)
```

## Testing Architecture

```
test_suite.py
├── CONVERSATION HISTORY TESTS (6)
│   ├── Add messages
│   ├── Get recent context
│   ├── Get user messages
│   ├── Flag messages
│   ├── Session summary
│   └── Save/Load to file
│
├── SAFETY FILTER TESTS (7)
│   ├── Detect self-harm
│   ├── Detect abuse
│   ├── Detect illegal activity
│   ├── Detect crisis indicators
│   ├── Safe message detection
│   ├── Generate crisis response
│   └── Flag message recording
│
└── EMPATHY AI TESTS (8)
    ├── Model selection (emotional)
    ├── Model selection (practical)
    ├── Model selection (analytical)
    ├── Safe message processing
    ├── History building
    ├── Flagged content handling
    ├── Safety report generation
    └── Model info retrieval

RESULTS: 21/21 TESTS PASSING (100%) ✅
```

## File Dependencies

```
main.py
├── imports: empathy_ai
│   └── imports: conversation_history, safety_filter, config
│       ├── conversation_history: json, datetime
│       ├── safety_filter: re, datetime
│       └── config: (self-contained)
│
├── imports: conversation_history
└── imports: safety_filter

test_suite.py
├── imports: conversation_history
├── imports: safety_filter
├── imports: empathy_ai
└── Uses: os, json (for testing file I/O)
```

## Class Hierarchy

```
ConversationHistory
├── __init__(max_history=50)
├── add_message(role, content, safety_flag)
├── get_recent_context(num_messages)
├── get_user_messages()
├── get_flagged_messages()
├── get_session_summary()
├── save_to_file(filepath)
├── load_from_file(filepath)
├── clear_history()
└── get_all_messages()

SafetyFilter
├── __init__(sensitivity_level)
├── analyze_message(message)
├── get_safe_response(severity, reason)
├── flag_message(message, severity, reason)
├── generate_incident_report()
├── get_crisis_resources(country)
├── _contains_keywords(text, keywords)
└── [CONSTANTS]
    ├── SELF_HARM_KEYWORDS
    ├── ABUSE_KEYWORDS
    ├── ILLEGAL_KEYWORDS
    ├── CRISIS_INDICATORS
    └── CRISIS_RESOURCES

EmpathyAI
├── __init__(user_name, default_model)
├── select_best_model(message)
├── process_message(user_message)
├── get_conversation_summary()
├── get_safety_report()
├── save_session(filepath)
├── load_session(filepath)
├── get_model_info(model_name)
├── _find_similar_topic(message)
├── _generate_empathetic_response()
├── _model_specific_response()
├── _get_supportive_closing()
└── [CONSTANTS]
    ├── MODELS (4 models)
    └── EMPATHY_STARTERS (6 patterns)

EmpathyAIApp
├── __init__(user_name)
├── run()
├── process_and_respond(user_message)
├── display_welcome()
├── display_models()
├── display_history()
├── display_summary()
├── display_report()
├── display_crisis_resources()
├── save_conversation()
└── handle_exit()
```

## Performance Characteristics

```
Operation               Time Complexity    Space Complexity
─────────────────────────────────────────────────────────
Add Message             O(1)               O(1)
Get Recent Context      O(n)               O(n)
Find Similar Topic      O(m*k)             O(k)
Safety Check            O(n)               O(1)
Model Selection         O(1)               O(1)
Generate Response       O(1)               O(1)
Save to File            O(m)               O(m)
Load from File          O(m)               O(m)

Where:
n = number of messages in history (max 50)
m = number of recent messages checked (typically 20)
k = number of similar matches
```

## Error Handling Strategy

```
User Input
    ↓
[Exception?]
  /       \
YES      NO
 ↓        ↓
LOG      PROCESS
↓
SHOW
ERROR
MESSAGE
↓
CONTINUE
(Don't crash)
```

## Security & Privacy

```
Data Storage
├── Stored Locally (No Cloud)
├── JSON Format (Readable)
├── No Encryption (Add if needed)
├── Deletable (User can remove data)
└── Private by Default

Message Processing
├── No External APIs Called
├── No Data Transmission
├── All Processing Local
└── No User Tracking
```

---

## Summary

This architecture provides:
- ✅ **Modular Design** - Each component independent
- ✅ **Clear Data Flow** - Easy to trace execution
- ✅ **Safety First** - Harmful content detected early
- ✅ **Extensible** - Easy to add new features
- ✅ **Testable** - All components tested
- ✅ **Performant** - Efficient algorithms
- ✅ **Privacy Focused** - Local storage only
- ✅ **User Friendly** - Simple, clear interface
