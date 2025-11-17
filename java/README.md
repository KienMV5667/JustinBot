# Empathetic AI System - Java Implementation

A sophisticated empathetic artificial intelligence system built in Java that provides emotionally aware, safe, and context-aware responses. This implementation converts the Python reference system to Java using Maven, GSON, and JUnit.

## Overview

The Empathetic AI System features:
- **4 Adaptive AI Models** (Empathetic, Practical, Analytical, Supportive)
- **Conversation Memory** - Maintains context across interactions with automatic history management
- **Safety Filtering** - Detects harmful content with 4 severity levels
- **Crisis Detection** - Identifies crisis indicators and provides emergency resources
- **Interactive CLI** - User-friendly command-line interface

## Project Structure

```
java/
├── pom.xml                                      # Maven build configuration
├── src/
│   ├── main/java/com/empathy/ai/
│   │   ├── ConversationHistory.java            # Conversation memory management
│   │   ├── SafetyFilter.java                   # Content safety analysis
│   │   ├── EmpathyAI.java                      # Core AI engine
│   │   └── EmpathyAIApp.java                   # Interactive CLI application
│   ├── test/java/com/empathy/ai/
│   │   └── TestSuite.java                      # 21 comprehensive JUnit tests
│   └── resources/
│       └── conversations/                      # Conversation data storage
└── README.md
```

## System Architecture

### ConversationHistory.java
Manages conversation context and memory.

**Key Features:**
- Thread-safe message storage with timestamps
- Configurable maximum history size (auto-truncation)
- JSON persistence (save/load)
- Message flagging for safety events
- Session statistics tracking

**Main Methods:**
```java
addMessage(role, content)              // Add user/assistant message
addMessage(role, content, flag)         // Add message with safety flag
getRecentContext(limit)                 // Get last N messages
getUserMessages()                       // Get only user messages
getFlaggedMessages()                    // Get flagged messages
getSessionSummary()                     // Get session statistics
saveToFile(path)                        // Persist to JSON
loadFromFile(path)                      // Load from JSON
```

### SafetyFilter.java
Analyzes content for harmful material.

**Safety Levels:**
- `critical` - Self-harm, abuse detected
- `warning` - Illegal activity, crisis indicators
- `safe` - No issues detected

**Keyword Detection:**
- Self-harm indicators (30+ keywords)
- Abuse indicators (25+ keywords)
- Illegal activity keywords (20+ keywords)
- Crisis indicators (15+ phrases)

**Main Methods:**
```java
analyzeMessage(text)                    // Analyze message for safety issues
getSafeResponse(severity, reason)       // Get appropriate safety response
getCrisisResponse()                     // Get crisis resources (988, 116 123)
flagMessage(content, severity, reason)  // Record safety incident
generateIncidentReport()                // Get safety statistics
```

### EmpathyAI.java
Core AI engine with 4 adaptive models.

**AI Models:**
1. **Empathetic** - Focuses on emotional understanding
2. **Practical** - Solution-oriented, action-focused
3. **Analytical** - Philosophical, explanation-focused
4. **Supportive** - Validation and encouragement-focused

**Model Selection Algorithm:**
- Analyzes message keywords
- Emotional keywords → Empathetic model
- Problem/solution keywords → Practical model
- Why/what/meaning keywords → Analytical model
- Support/help keywords → Supportive model

**Main Methods:**
```java
processMessage(message)                 // Full processing pipeline
selectBestModel(message)                // Choose optimal model
getModelInfo()                          // Get model metadata
getConversationSummary()                // Get session stats
getSafetyReport()                       // Get safety incidents
```

### EmpathyAIApp.java
Interactive CLI application.

**Commands:**
- `models` - Display available AI models and their specializations
- `history` - Show recent conversation history
- `summary` - Display session statistics
- `report` - Show safety incidents report
- `save` - Save conversation to JSON file
- `resources` - Display crisis resources (988, 116 123)
- `exit` - End session and save conversation

**Usage Flow:**
```
Enter your name: [user enters name]
Hi [name]! Type your message or command (type 'help' for commands)
You: [user message]
AI: [AI response with model info]
You: [next message or command]
```

## Installation

### Prerequisites
- Java 11 or later
- Maven 3.6 or later

### Verify Installation
```bash
java -version
mvn -version
```

## Building

### Compile the project
```bash
mvn clean compile
```

### Build executable JAR
```bash
mvn clean package
```

This creates `target/empathetic-ai-system-1.0.0-jar-with-dependencies.jar`

## Running

### Run the interactive application
```bash
mvn exec:java -Dexec.mainClass="com.empathy.ai.EmpathyAIApp"
```

### Run using packaged JAR
```bash
mvn package
java -jar target/empathetic-ai-system-1.0.0-jar-with-dependencies.jar
```

### Run with direct java command
```bash
mvn clean compile
java -cp target/classes:~/.m2/repository/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar com.empathy.ai.EmpathyAIApp
```

## Testing

### Run all 21 tests using Maven
```bash
mvn test
```

### Run test suite directly
```bash
mvn compile
mvn exec:java -Dexec.mainClass="com.empathy.ai.TestSuite"
```

### Test Coverage

**Conversation History Tests (6):**
1. Add messages to history
2. Get recent context
3. Get user messages
4. Flag messages
5. Get session summary
6. Save and load history

**Safety Filter Tests (7):**
7. Detect self-harm content
8. Detect abusive content
9. Detect illegal activity
10. Detect crisis indicators
11. Identify safe messages
12. Generate crisis responses
13. Record flagged messages

**Empathy AI Tests (8):**
14. Model selection (emotional content)
15. Model selection (practical content)
16. Model selection (analytical content)
17. Safe message processing
18. History building
19. Flagged content handling
20. Get safety report
21. Get model information

**Expected Output:**
```
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

🛡️ Testing Safety Filter Module...
--------------------------------------------------
✓ Test 7: Detect self-harm - PASSED
✓ Test 8: Detect abuse - PASSED
✓ Test 9: Detect illegal activity - PASSED
✓ Test 10: Detect crisis indicators - PASSED
✓ Test 11: Safe message detection - PASSED
✓ Test 12: Generate crisis response - PASSED
✓ Test 13: Flag message recording - PASSED

🤖 Testing Empathy AI Module...
--------------------------------------------------
✓ Test 14: Model selection (emotional) - PASSED
✓ Test 15: Model selection (practical) - PASSED
✓ Test 16: Model selection (analytical) - PASSED
✓ Test 17: Safe message processing - PASSED
✓ Test 18: History building - PASSED
✓ Test 19: Flagged content handling - PASSED
✓ Test 20: Get safety report - PASSED
✓ Test 21: Get model info - PASSED

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

## Usage Examples

### Example 1: Emotional Support
```
You: I've been feeling really sad lately
AI: [Using Empathetic Model]
I understand how difficult that must feel. Many people experience periods of sadness,
and it's completely valid to feel this way. Would you like to talk about what's been
troubling you?
```

### Example 2: Practical Problem Solving
```
You: How do I organize my time better?
AI: [Using Practical Model]
Here are some concrete steps to improve your time management:
1. Identify your highest-priority tasks
2. Break them into smaller, manageable chunks
3. Schedule specific time blocks for each task
...
```

### Example 3: Crisis Detection
```
You: I want to hurt myself
AI: [Safety Flag: CRITICAL]
I'm concerned about your safety. Please reach out for help immediately:
National Suicide Prevention Lifeline: 988
Crisis Text Line: Text "HELLO" to 741741
UK Crisis Line: Call 116 123
```

## Dependencies

### Maven Dependencies
```xml
<!-- GSON: JSON serialization/deserialization -->
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
</dependency>

<!-- JUnit: Unit testing framework -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>
```

## Configuration

### Conversation Settings
- **Max History**: 10 messages (configurable)
- **Safety Level**: medium (low, medium, high)
- **Storage**: JSON files in `data/conversations/`

### Safety Filter Levels
- **low** - Only detects critical issues
- **medium** - Detects most harmful content
- **high** - Most restrictive (detects borderline cases)

## Data Storage

Conversations are saved as JSON files:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-15T10:30:00",
      "flag": null
    },
    {
      "role": "assistant",
      "content": "Hi there!",
      "timestamp": "2024-01-15T10:30:05",
      "flag": null
    }
  ]
}
```

## Performance Characteristics

- **Message Processing**: < 100ms average
- **History Lookup**: O(n) where n is conversation length
- **Safety Analysis**: Keyword matching (O(m) where m is keyword set size)
- **Memory Usage**: ~1-2MB for typical 100-message conversation

## Java Version Compatibility

- **Minimum**: Java 11
- **Tested**: Java 11, 17, 21
- **Recommended**: Java 17 or later

## Troubleshooting

### Cannot find Maven
```bash
export PATH=$PATH:/path/to/maven/bin
```

### Compilation errors
```bash
mvn clean compile -X  # Verbose output
```

### JAR not created
```bash
mvn clean package -DskipTests
```

### Tests fail to run
```bash
mvn test -DskipITs
mvn exec:java -Dexec.mainClass="com.empathy.ai.TestSuite"  # Run directly
```

## Key Differences from Python Version

| Feature | Python | Java |
|---------|--------|------|
| JSON | `json` module | GSON library |
| Collections | `list`, `dict` | `List<T>`, `Map<K,V>` |
| Build | pip + modules | Maven + pom.xml |
| Testing | unittest | JUnit 4 |
| Type System | Dynamic | Static (with generics) |
| Package | Python module | Maven package |

## Future Enhancements

- [ ] Database integration (PostgreSQL)
- [ ] Multi-user support
- [ ] REST API (Spring Boot)
- [ ] Web UI (React/Vue)
- [ ] Additional AI models
- [ ] Multi-language support
- [ ] Advanced NLP integration

## System Requirements

**Minimum:**
- CPU: 1 core
- RAM: 256 MB
- Disk: 50 MB (with dependencies)

**Recommended:**
- CPU: 2+ cores
- RAM: 1 GB
- Disk: 200 MB

## License

This Java implementation maintains compatibility with the original Python system.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Run the test suite to verify installation
3. Review the architecture documentation

## Development

To extend the system:
1. Add new models to `EmpathyAI.java`
2. Add safety keywords to `SafetyFilter.java`
3. Add commands to `EmpathyAIApp.java`
4. Add tests to `TestSuite.java`

All changes should maintain the existing API and pass the test suite.
