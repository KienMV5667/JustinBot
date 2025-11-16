"""
Test Suite for Empathetic AI System
Tests all components: conversation history, safety filter, and empathy AI
"""
import sys
import os
sys.path.insert(0, '../src')

from conversation_history import ConversationHistory
from safety_filter import SafetyFilter
from empathy_ai import EmpathyAI
import json


class TestRunner:
    """Run tests for the AI system"""
    
    def __init__(self):
        self.tests_passed = 0
        self.tests_failed = 0
    
    def run_all_tests(self):
        """Run all test suites"""
        print("\n" + "="*70)
        print("🧪 EMPATHETIC AI SYSTEM - TEST SUITE")
        print("="*70)
        
        self.test_conversation_history()
        self.test_safety_filter()
        self.test_empathy_ai()
        
        self.print_summary()
    
    def test_conversation_history(self):
        """Test conversation history functionality"""
        print("\n📝 Testing Conversation History Module...")
        print("-" * 50)
        
        history = ConversationHistory(max_history=10)
        
        # Test 1: Add messages
        try:
            history.add_message("user", "Hello, how are you?")
            history.add_message("assistant", "I'm doing well, thank you for asking!")
            assert len(history.get_all_messages()) == 2
            print("✓ Test 1: Add messages - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 1: Add messages - FAILED")
            self.tests_failed += 1
        
        # Test 2: Get recent context
        try:
            history.add_message("user", "Tell me about yourself")
            recent = history.get_recent_context(num_messages=2)
            assert len(recent) == 2
            print("✓ Test 2: Get recent context - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 2: Get recent context - FAILED")
            self.tests_failed += 1
        
        # Test 3: Get user messages
        try:
            user_messages = history.get_user_messages()
            assert len(user_messages) == 2
            assert "Hello, how are you?" in user_messages
            print("✓ Test 3: Get user messages - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 3: Get user messages - FAILED")
            self.tests_failed += 1
        
        # Test 4: Flag messages
        try:
            history.add_message("user", "I'm feeling bad", safety_flag="crisis_indicator")
            flagged = history.get_flagged_messages()
            assert len(flagged) == 1
            print("✓ Test 4: Flag messages - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 4: Flag messages - FAILED")
            self.tests_failed += 1
        
        # Test 5: Session summary
        try:
            summary = history.get_session_summary()
            assert summary['total_messages'] == 4
            assert summary['flagged_count'] == 1
            print("✓ Test 5: Get session summary - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 5: Get session summary - FAILED")
            self.tests_failed += 1
        
        # Test 6: Save and load
        try:
            test_file = "/tmp/test_history.json"
            history.save_to_file(test_file)
            new_history = ConversationHistory()
            new_history.load_from_file(test_file)
            assert len(new_history.get_all_messages()) == len(history.get_all_messages())
            os.remove(test_file)
            print("✓ Test 6: Save and load history - PASSED")
            self.tests_passed += 1
        except Exception as e:
            print(f"✗ Test 6: Save and load history - FAILED ({e})")
            self.tests_failed += 1
    
    def test_safety_filter(self):
        """Test safety filter functionality"""
        print("\n🛡️ Testing Safety Filter Module...")
        print("-" * 50)
        
        safety = SafetyFilter(sensitivity_level="medium")
        
        # Test 1: Detect self-harm
        try:
            severity, is_flagged, reason = safety.analyze_message("I want to kill myself")
            assert is_flagged and severity == "critical" and reason == "self_harm_detected"
            print("✓ Test 1: Detect self-harm - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 1: Detect self-harm - FAILED")
            self.tests_failed += 1
        
        # Test 2: Detect abuse
        try:
            severity, is_flagged, reason = safety.analyze_message("I want to hurt you")
            assert is_flagged and severity == "critical" and reason == "abuse_detected"
            print("✓ Test 2: Detect abuse - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 2: Detect abuse - FAILED")
            self.tests_failed += 1
        
        # Test 3: Detect illegal activity
        try:
            severity, is_flagged, reason = safety.analyze_message("Where can I buy cocaine?")
            assert is_flagged and reason == "illegal_activity_detected"
            print("✓ Test 3: Detect illegal activity - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 3: Detect illegal activity - FAILED")
            self.tests_failed += 1
        
        # Test 4: Detect crisis indicators
        try:
            severity, is_flagged, reason = safety.analyze_message("I feel hopeless and worthless")
            assert is_flagged and reason == "crisis_indicator_detected"
            print("✓ Test 4: Detect crisis indicators - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 4: Detect crisis indicators - FAILED")
            self.tests_failed += 1
        
        # Test 5: Safe message passes
        try:
            severity, is_flagged, reason = safety.analyze_message("The weather is nice today")
            assert not is_flagged and severity == "safe"
            print("✓ Test 5: Safe message detection - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 5: Safe message detection - FAILED")
            self.tests_failed += 1
        
        # Test 6: Generate crisis response
        try:
            response = safety.get_safe_response("critical", "self_harm_detected")
            assert "988" in response or "crisis" in response.lower()
            print("✓ Test 6: Generate crisis response - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 6: Generate crisis response - FAILED")
            self.tests_failed += 1
        
        # Test 7: Flag message recording
        try:
            safety.flag_message("test message", "critical", "test_reason")
            report = safety.generate_incident_report()
            assert report['total_incidents'] >= 1
            print("✓ Test 7: Flag message recording - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 7: Flag message recording - FAILED")
            self.tests_failed += 1
    
    def test_empathy_ai(self):
        """Test empathy AI functionality"""
        print("\n🤖 Testing Empathy AI Module...")
        print("-" * 50)
        
        ai = EmpathyAI(user_name="TestUser")
        
        # Test 1: Model selection for emotional content
        try:
            selected = ai.select_best_model("I'm feeling really sad")
            assert selected == "empathetic"
            print("✓ Test 1: Model selection (emotional) - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 1: Model selection (emotional) - FAILED")
            self.tests_failed += 1
        
        # Test 2: Model selection for problem-solving
        try:
            selected = ai.select_best_model("How do I fix this problem?")
            assert selected == "practical"
            print("✓ Test 2: Model selection (practical) - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 2: Model selection (practical) - FAILED")
            self.tests_failed += 1
        
        # Test 3: Model selection for complex topics
        try:
            selected = ai.select_best_model("What's the meaning of life?")
            assert selected == "analytical"
            print("✓ Test 3: Model selection (analytical) - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 3: Model selection (analytical) - FAILED")
            self.tests_failed += 1
        
        # Test 4: Safe message processing
        try:
            result = ai.process_message("Tell me about your features")
            assert result['is_safe']
            assert 'response' in result
            assert result['model_used'] in ai.MODELS.keys()
            print("✓ Test 4: Safe message processing - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 4: Safe message processing - FAILED")
            self.tests_failed += 1
        
        # Test 5: History building
        try:
            ai.process_message("First message")
            ai.process_message("Second message")
            summary = ai.get_conversation_summary()
            assert summary['total_messages'] >= 4  # 2 user + 2 assistant
            print("✓ Test 5: History building - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 5: History building - FAILED")
            self.tests_failed += 1
        
        # Test 6: Flagged content handling
        try:
            result = ai.process_message("I want to hurt myself")
            assert not result['is_safe']
            assert result['severity'] in ["critical", "warning"]
            print("✓ Test 6: Flagged content handling - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 6: Flagged content handling - FAILED")
            self.tests_failed += 1
        
        # Test 7: Get safety report
        try:
            report = ai.get_safety_report()
            assert 'total_incidents' in report
            print("✓ Test 7: Get safety report - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 7: Get safety report - FAILED")
            self.tests_failed += 1
        
        # Test 8: Get model info
        try:
            models = ai.get_model_info()
            assert len(models) == 4
            assert 'empathetic' in models
            print("✓ Test 8: Get model info - PASSED")
            self.tests_passed += 1
        except AssertionError:
            print("✗ Test 8: Get model info - FAILED")
            self.tests_failed += 1
    
    def print_summary(self):
        """Print test summary"""
        total = self.tests_passed + self.tests_failed
        percentage = (self.tests_passed / total * 100) if total > 0 else 0
        
        print("\n" + "="*70)
        print("📊 TEST SUMMARY")
        print("="*70)
        print(f"Total Tests: {total}")
        print(f"Passed: {self.tests_passed} ✓")
        print(f"Failed: {self.tests_failed} ✗")
        print(f"Success Rate: {percentage:.1f}%")
        
        if self.tests_failed == 0:
            print("\n🎉 All tests passed! System is working correctly.")
        else:
            print(f"\n⚠️ {self.tests_failed} test(s) failed. Please review.")
        print("="*70 + "\n")


if __name__ == "__main__":
    runner = TestRunner()
    runner.run_all_tests()
