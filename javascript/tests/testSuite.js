/**
 * Test Suite for Empathetic AI System (JavaScript)
 * Tests all components: conversation history, safety filter, and empathy AI
 */

const ConversationHistory = require('../src/ConversationHistory');
const SafetyFilter = require('../src/SafetyFilter');
const EmpathyAI = require('../src/EmpathyAI');

class TestRunner {
  constructor() {
    this.testsPassed = 0;
    this.testsFailed = 0;
  }

  /**
   * Run all test suites
   */
  runAllTests() {
    console.log('\n' + '='.repeat(70));
    console.log('🧪 EMPATHETIC AI SYSTEM - TEST SUITE (JavaScript)');
    console.log('='.repeat(70));

    this.testConversationHistory();
    this.testSafetyFilter();
    this.testEmpathyAI();

    this.printSummary();
  }

  /**
   * Test conversation history functionality
   */
  testConversationHistory() {
    console.log('\n📝 Testing Conversation History Module...');
    console.log('-'.repeat(50));

    const history = new ConversationHistory(10);

    // Test 1: Add messages
    try {
      history.addMessage('user', 'Hello, how are you?');
      history.addMessage('assistant', "I'm doing well, thank you for asking!");
      if (history.getAllMessages().length === 2) {
        console.log('✓ Test 1: Add messages - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Message count mismatch');
      }
    } catch (e) {
      console.log('✗ Test 1: Add messages - FAILED');
      this.testsFailed++;
    }

    // Test 2: Get recent context
    try {
      history.addMessage('user', 'Tell me about yourself');
      const recent = history.getRecentContext(2);
      if (recent.length === 2) {
        console.log('✓ Test 2: Get recent context - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Context retrieval failed');
      }
    } catch (e) {
      console.log('✗ Test 2: Get recent context - FAILED');
      this.testsFailed++;
    }

    // Test 3: Get user messages
    try {
      const userMessages = history.getUserMessages();
      if (userMessages.length === 2 && userMessages.includes('Hello, how are you?')) {
        console.log('✓ Test 3: Get user messages - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('User message retrieval failed');
      }
    } catch (e) {
      console.log('✗ Test 3: Get user messages - FAILED');
      this.testsFailed++;
    }

    // Test 4: Flag messages
    try {
      history.addMessage('user', "I'm feeling bad", 'crisis_indicator');
      const flagged = history.getFlaggedMessages();
      if (flagged.length === 1) {
        console.log('✓ Test 4: Flag messages - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Message flagging failed');
      }
    } catch (e) {
      console.log('✗ Test 4: Flag messages - FAILED');
      this.testsFailed++;
    }

    // Test 5: Session summary
    try {
      const summary = history.getSessionSummary();
      if (summary.totalMessages === 4 && summary.flaggedCount === 1) {
        console.log('✓ Test 5: Get session summary - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Session summary mismatch');
      }
    } catch (e) {
      console.log('✗ Test 5: Get session summary - FAILED');
      this.testsFailed++;
    }

    // Test 6: Clear history
    try {
      history.clearHistory();
      if (history.getAllMessages().length === 0) {
        console.log('✓ Test 6: Clear history - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('History clear failed');
      }
    } catch (e) {
      console.log('✗ Test 6: Clear history - FAILED');
      this.testsFailed++;
    }
  }

  /**
   * Test safety filter functionality
   */
  testSafetyFilter() {
    console.log('\n🛡️ Testing Safety Filter Module...');
    console.log('-'.repeat(50));

    const safety = new SafetyFilter('medium');

    // Test 1: Detect self-harm
    try {
      const [severity, isFlaged, reason] = safety.analyzeMessage('I want to kill myself');
      if (isFlaged && severity === 'critical' && reason === 'self_harm_detected') {
        console.log('✓ Test 1: Detect self-harm - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Self-harm detection failed');
      }
    } catch (e) {
      console.log('✗ Test 1: Detect self-harm - FAILED');
      this.testsFailed++;
    }

    // Test 2: Detect abuse
    try {
      const [severity, isFlaged, reason] = safety.analyzeMessage('I want to hurt you');
      if (isFlaged && severity === 'critical' && reason === 'abuse_detected') {
        console.log('✓ Test 2: Detect abuse - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Abuse detection failed');
      }
    } catch (e) {
      console.log('✗ Test 2: Detect abuse - FAILED');
      this.testsFailed++;
    }

    // Test 3: Detect illegal activity
    try {
      const [severity, isFlaged, reason] = safety.analyzeMessage('Where can I buy cocaine?');
      if (isFlaged && reason === 'illegal_activity_detected') {
        console.log('✓ Test 3: Detect illegal activity - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Illegal activity detection failed');
      }
    } catch (e) {
      console.log('✗ Test 3: Detect illegal activity - FAILED');
      this.testsFailed++;
    }

    // Test 4: Detect crisis indicators
    try {
      const [severity, isFlaged, reason] = safety.analyzeMessage('I feel hopeless and worthless');
      if (isFlaged && reason === 'crisis_indicator_detected') {
        console.log('✓ Test 4: Detect crisis indicators - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Crisis indicator detection failed');
      }
    } catch (e) {
      console.log('✗ Test 4: Detect crisis indicators - FAILED');
      this.testsFailed++;
    }

    // Test 5: Safe message passes
    try {
      const [severity, isFlaged, reason] = safety.analyzeMessage('The weather is nice today');
      if (!isFlaged && severity === 'safe') {
        console.log('✓ Test 5: Safe message detection - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Safe message filtering failed');
      }
    } catch (e) {
      console.log('✗ Test 5: Safe message detection - FAILED');
      this.testsFailed++;
    }

    // Test 6: Generate crisis response
    try {
      const response = safety.getSafeResponse('critical', 'self_harm_detected');
      if (response.includes('988') || response.toLowerCase().includes('crisis')) {
        console.log('✓ Test 6: Generate crisis response - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Crisis response generation failed');
      }
    } catch (e) {
      console.log('✗ Test 6: Generate crisis response - FAILED');
      this.testsFailed++;
    }

    // Test 7: Flag message recording
    try {
      safety.flagMessage('test message', 'critical', 'test_reason');
      const report = safety.generateIncidentReport();
      if (report.totalIncidents >= 1) {
        console.log('✓ Test 7: Flag message recording - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Message flagging failed');
      }
    } catch (e) {
      console.log('✗ Test 7: Flag message recording - FAILED');
      this.testsFailed++;
    }
  }

  /**
   * Test empathy AI functionality
   */
  testEmpathyAI() {
    console.log('\n🤖 Testing Empathy AI Module...');
    console.log('-'.repeat(50));

    const ai = new EmpathyAI('TestUser');

    // Test 1: Model selection for emotional content
    try {
      const selected = ai.selectBestModel("I'm feeling really sad");
      if (selected === 'empathetic') {
        console.log('✓ Test 1: Model selection (emotional) - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Emotional model selection failed');
      }
    } catch (e) {
      console.log('✗ Test 1: Model selection (emotional) - FAILED');
      this.testsFailed++;
    }

    // Test 2: Model selection for problem-solving
    try {
      const selected = ai.selectBestModel('How do I fix this problem?');
      if (selected === 'practical') {
        console.log('✓ Test 2: Model selection (practical) - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Practical model selection failed');
      }
    } catch (e) {
      console.log('✗ Test 2: Model selection (practical) - FAILED');
      this.testsFailed++;
    }

    // Test 3: Model selection for complex topics
    try {
      const selected = ai.selectBestModel("What's the meaning of life?");
      if (selected === 'analytical') {
        console.log('✓ Test 3: Model selection (analytical) - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Analytical model selection failed');
      }
    } catch (e) {
      console.log('✗ Test 3: Model selection (analytical) - FAILED');
      this.testsFailed++;
    }

    // Test 4: Safe message processing
    try {
      const result = ai.processMessage('Tell me about your features');
      if (
        result.isSafe &&
        result.response &&
        Object.keys(ai.MODELS).includes(result.modelUsed)
      ) {
        console.log('✓ Test 4: Safe message processing - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Safe message processing failed');
      }
    } catch (e) {
      console.log('✗ Test 4: Safe message processing - FAILED');
      this.testsFailed++;
    }

    // Test 5: History building
    try {
      ai.processMessage('First message');
      ai.processMessage('Second message');
      const summary = ai.getConversationSummary();
      if (summary.totalMessages >= 4) {
        console.log('✓ Test 5: History building - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('History building failed');
      }
    } catch (e) {
      console.log('✗ Test 5: History building - FAILED');
      this.testsFailed++;
    }

    // Test 6: Flagged content handling
    try {
      const result = ai.processMessage('I want to hurt myself');
      if (!result.isSafe && ['critical', 'warning'].includes(result.severity)) {
        console.log('✓ Test 6: Flagged content handling - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Flagged content handling failed');
      }
    } catch (e) {
      console.log('✗ Test 6: Flagged content handling - FAILED');
      this.testsFailed++;
    }

    // Test 7: Get safety report
    try {
      const report = ai.getSafetyReport();
      if ('totalIncidents' in report) {
        console.log('✓ Test 7: Get safety report - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Safety report generation failed');
      }
    } catch (e) {
      console.log('✗ Test 7: Get safety report - FAILED');
      this.testsFailed++;
    }

    // Test 8: Get model info
    try {
      const models = ai.getModelInfo();
      if (Object.keys(models).length === 4 && models.empathetic) {
        console.log('✓ Test 8: Get model info - PASSED');
        this.testsPassed++;
      } else {
        throw new Error('Model info retrieval failed');
      }
    } catch (e) {
      console.log('✗ Test 8: Get model info - FAILED');
      this.testsFailed++;
    }
  }

  /**
   * Print test summary
   */
  printSummary() {
    const total = this.testsPassed + this.testsFailed;
    const percentage = total > 0 ? ((this.testsPassed / total) * 100).toFixed(1) : 0;

    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${this.testsPassed} ✓`);
    console.log(`Failed: ${this.testsFailed} ✗`);
    console.log(`Success Rate: ${percentage}%`);

    if (this.testsFailed === 0) {
      console.log('\n🎉 All tests passed! System is working correctly.');
    } else {
      console.log(`\n⚠️ ${this.testsFailed} test(s) failed. Please review.`);
    }
    console.log('='.repeat(70) + '\n');
  }
}

// Run tests
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests();
}

module.exports = TestRunner;
