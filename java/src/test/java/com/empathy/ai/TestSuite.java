package com.empathy.ai;

import org.junit.Test;
import org.junit.Before;
import static org.junit.Assert.*;

import java.io.File;
import java.util.*;

/**
 * Comprehensive test suite for Empathetic AI System
 */
public class TestSuite {
    
    private ConversationHistory history;
    private SafetyFilter safety;
    private EmpathyAI ai;
    
    @Before
    public void setUp() {
        history = new ConversationHistory(10);
        safety = new SafetyFilter("medium");
        ai = new EmpathyAI("TestUser");
    }
    
    // ========== CONVERSATION HISTORY TESTS ==========
    
    @Test
    public void testAddMessages() {
        history.addMessage("user", "Hello, how are you?");
        history.addMessage("assistant", "I'm doing well, thank you!");
        assertEquals(2, history.size());
        System.out.println("✓ Test 1: Add messages - PASSED");
    }
    
    @Test
    public void testGetRecentContext() {
        history.addMessage("user", "First message");
        history.addMessage("assistant", "Response");
        history.addMessage("user", "Second message");
        
        List<ConversationHistory.Message> recent = history.getRecentContext(2);
        assertEquals(2, recent.size());
        System.out.println("✓ Test 2: Get recent context - PASSED");
    }
    
    @Test
    public void testGetUserMessages() {
        history.addMessage("user", "Hello");
        history.addMessage("assistant", "Hi there");
        history.addMessage("user", "How are you?");
        
        List<String> userMsgs = history.getUserMessages();
        assertEquals(2, userMsgs.size());
        assertTrue(userMsgs.contains("Hello"));
        System.out.println("✓ Test 3: Get user messages - PASSED");
    }
    
    @Test
    public void testFlagMessages() {
        history.addMessage("user", "I'm feeling bad", "crisis_indicator");
        List<ConversationHistory.Message> flagged = history.getFlaggedMessages();
        assertEquals(1, flagged.size());
        System.out.println("✓ Test 4: Flag messages - PASSED");
    }
    
    @Test
    public void testSessionSummary() {
        history.addMessage("user", "Message 1");
        history.addMessage("assistant", "Response 1");
        history.addMessage("user", "Message 2", "flag");
        
        Map<String, Object> summary = history.getSessionSummary();
        assertEquals(3, summary.get("totalMessages"));
        assertEquals(1, summary.get("flaggedCount"));
        System.out.println("✓ Test 5: Get session summary - PASSED");
    }
    
    @Test
    public void testSaveAndLoadHistory() throws Exception {
        history.addMessage("user", "Test message");
        history.addMessage("assistant", "Test response");
        
        String testFile = "/tmp/test_history.json";
        history.saveToFile(testFile);
        
        ConversationHistory newHistory = new ConversationHistory();
        newHistory.loadFromFile(testFile);
        
        assertEquals(history.size(), newHistory.size());
        
        File file = new File(testFile);
        if (file.exists()) {
            file.delete();
        }
        System.out.println("✓ Test 6: Save and load history - PASSED");
    }
    
    // ========== SAFETY FILTER TESTS ==========
    
    @Test
    public void testDetectSelfHarm() {
        Map<String, Object> result = safety.analyzeMessage("I want to kill myself");
        assertTrue((boolean) result.get("flagged"));
        assertEquals("critical", result.get("severity"));
        assertEquals("self_harm_detected", result.get("reason"));
        System.out.println("✓ Test 7: Detect self-harm - PASSED");
    }
    
    @Test
    public void testDetectAbuse() {
        Map<String, Object> result = safety.analyzeMessage("I want to hurt you");
        assertTrue((boolean) result.get("flagged"));
        assertEquals("critical", result.get("severity"));
        assertEquals("abuse_detected", result.get("reason"));
        System.out.println("✓ Test 8: Detect abuse - PASSED");
    }
    
    @Test
    public void testDetectIllegalActivity() {
        Map<String, Object> result = safety.analyzeMessage("Where can I buy cocaine?");
        assertTrue((boolean) result.get("flagged"));
        assertEquals("illegal_activity_detected", result.get("reason"));
        System.out.println("✓ Test 9: Detect illegal activity - PASSED");
    }
    
    @Test
    public void testDetectCrisisIndicators() {
        Map<String, Object> result = safety.analyzeMessage("I feel hopeless and worthless");
        assertTrue((boolean) result.get("flagged"));
        assertEquals("crisis_indicator_detected", result.get("reason"));
        System.out.println("✓ Test 10: Detect crisis indicators - PASSED");
    }
    
    @Test
    public void testSafeMessageDetection() {
        Map<String, Object> result = safety.analyzeMessage("The weather is nice today");
        assertFalse((boolean) result.get("flagged"));
        assertEquals("safe", result.get("severity"));
        System.out.println("✓ Test 11: Safe message detection - PASSED");
    }
    
    @Test
    public void testGenerateCrisisResponse() {
        String response = safety.getSafeResponse("critical", "self_harm_detected");
        assertTrue(response.contains("988") || response.toLowerCase().contains("crisis"));
        System.out.println("✓ Test 12: Generate crisis response - PASSED");
    }
    
    @Test
    public void testFlagMessageRecording() {
        safety.flagMessage("test message", "critical", "test_reason");
        Map<String, Object> report = safety.generateIncidentReport();
        assertTrue((int) report.get("totalIncidents") >= 1);
        System.out.println("✓ Test 13: Flag message recording - PASSED");
    }
    
    // ========== EMPATHY AI TESTS ==========
    
    @Test
    public void testModelSelectionEmotional() {
        String model = ai.selectBestModel("I'm feeling really sad");
        assertEquals("empathetic", model);
        System.out.println("✓ Test 14: Model selection (emotional) - PASSED");
    }
    
    @Test
    public void testModelSelectionPractical() {
        String model = ai.selectBestModel("How do I fix this problem?");
        assertEquals("practical", model);
        System.out.println("✓ Test 15: Model selection (practical) - PASSED");
    }
    
    @Test
    public void testModelSelectionAnalytical() {
        String model = ai.selectBestModel("What's the meaning of life?");
        assertEquals("analytical", model);
        System.out.println("✓ Test 16: Model selection (analytical) - PASSED");
    }
    
    @Test
    public void testSafeMessageProcessing() {
        Map<String, Object> result = ai.processMessage("Tell me about your features");
        assertTrue((boolean) result.get("isSafe"));
        assertTrue(result.containsKey("response"));
        assertTrue(ai.getModelInfo().containsKey((String) result.get("modelUsed")));
        System.out.println("✓ Test 17: Safe message processing - PASSED");
    }
    
    @Test
    public void testHistoryBuilding() {
        ai.processMessage("First message");
        ai.processMessage("Second message");
        
        Map<String, Object> summary = ai.getConversationSummary();
        assertTrue((int) summary.get("totalMessages") >= 4); // 2 user + 2 assistant
        System.out.println("✓ Test 18: History building - PASSED");
    }
    
    @Test
    public void testFlaggedContentHandling() {
        Map<String, Object> result = ai.processMessage("I want to hurt myself");
        assertFalse((boolean) result.get("isSafe"));
        assertTrue(result.containsKey("severity"));
        System.out.println("✓ Test 19: Flagged content handling - PASSED");
    }
    
    @Test
    public void testGetSafetyReport() {
        ai.processMessage("I want to hurt myself"); // This will trigger safety
        Map<String, Object> report = ai.getSafetyReport();
        assertTrue(report.containsKey("totalIncidents"));
        System.out.println("✓ Test 20: Get safety report - PASSED");
    }
    
    @Test
    public void testGetModelInfo() {
        Map<String, EmpathyAI.ModelInfo> models = ai.getModelInfo();
        assertEquals(4, models.size());
        assertTrue(models.containsKey("empathetic"));
        System.out.println("✓ Test 21: Get model info - PASSED");
    }
    
    // ========== TEST RUNNER ==========
    
    public static void main(String[] args) {
        System.out.println("\n" + "=".repeat(70));
        System.out.println("🧪 EMPATHETIC AI SYSTEM - TEST SUITE");
        System.out.println("=".repeat(70));
        
        TestSuite suite = new TestSuite();
        int passed = 0;
        int failed = 0;
        
        System.out.println("\n📝 Testing Conversation History Module...");
        System.out.println("-".repeat(50));
        
        try {
            suite.setUp();
            suite.testAddMessages();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 1 FAILED"); }
        
        try {
            suite.setUp();
            suite.testGetRecentContext();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 2 FAILED"); }
        
        try {
            suite.setUp();
            suite.testGetUserMessages();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 3 FAILED"); }
        
        try {
            suite.setUp();
            suite.testFlagMessages();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 4 FAILED"); }
        
        try {
            suite.setUp();
            suite.testSessionSummary();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 5 FAILED"); }
        
        try {
            suite.setUp();
            suite.testSaveAndLoadHistory();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 6 FAILED"); }
        
        System.out.println("\n🛡️ Testing Safety Filter Module...");
        System.out.println("-".repeat(50));
        
        try {
            suite.setUp();
            suite.testDetectSelfHarm();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 7 FAILED"); }
        
        try {
            suite.setUp();
            suite.testDetectAbuse();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 8 FAILED"); }
        
        try {
            suite.setUp();
            suite.testDetectIllegalActivity();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 9 FAILED"); }
        
        try {
            suite.setUp();
            suite.testDetectCrisisIndicators();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 10 FAILED"); }
        
        try {
            suite.setUp();
            suite.testSafeMessageDetection();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 11 FAILED"); }
        
        try {
            suite.setUp();
            suite.testGenerateCrisisResponse();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 12 FAILED"); }
        
        try {
            suite.setUp();
            suite.testFlagMessageRecording();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 13 FAILED"); }
        
        System.out.println("\n🤖 Testing Empathy AI Module...");
        System.out.println("-".repeat(50));
        
        try {
            suite.setUp();
            suite.testModelSelectionEmotional();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 14 FAILED"); }
        
        try {
            suite.setUp();
            suite.testModelSelectionPractical();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 15 FAILED"); }
        
        try {
            suite.setUp();
            suite.testModelSelectionAnalytical();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 16 FAILED"); }
        
        try {
            suite.setUp();
            suite.testSafeMessageProcessing();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 17 FAILED"); }
        
        try {
            suite.setUp();
            suite.testHistoryBuilding();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 18 FAILED"); }
        
        try {
            suite.setUp();
            suite.testFlaggedContentHandling();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 19 FAILED"); }
        
        try {
            suite.setUp();
            suite.testGetSafetyReport();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 20 FAILED"); }
        
        try {
            suite.setUp();
            suite.testGetModelInfo();
            passed++;
        } catch (Exception e) { failed++; System.out.println("✗ Test 21 FAILED"); }
        
        // Print summary
        int total = passed + failed;
        double percentage = total > 0 ? (double) passed / total * 100 : 0;
        
        System.out.println("\n" + "=".repeat(70));
        System.out.println("📊 TEST SUMMARY");
        System.out.println("=".repeat(70));
        System.out.println("Total Tests: " + total);
        System.out.println("Passed: " + passed + " ✓");
        System.out.println("Failed: " + failed + " ✗");
        System.out.printf("Success Rate: %.1f%%\n", percentage);
        
        if (failed == 0) {
            System.out.println("\n🎉 All tests passed! System is working correctly.");
        } else {
            System.out.println("\n⚠️ " + failed + " test(s) failed. Please review.");
        }
        System.out.println("=".repeat(70) + "\n");
    }
}
