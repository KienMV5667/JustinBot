package com.empathy.ai;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Core AI engine with simple model selection and response generation
 */
public class EmpathyAI {
    private ConversationHistory history;
    private SafetyFilter safety;
    private String userName;
    private Map<String, ModelInfo> models;

    public static class ModelInfo {
        public String name;
        public String description;

        public ModelInfo(String name, String description) {
            this.name = name;
            this.description = description;
        }
    }

    public EmpathyAI(String userName) {
        this.userName = userName == null ? "User" : userName;
        this.history = new ConversationHistory(50);
        this.safety = new SafetyFilter("medium");
        this.models = new HashMap<>();

        models.put("empathetic", new ModelInfo("empathetic", "Emotional understanding and validation"));
        models.put("practical", new ModelInfo("practical", "Solution-oriented, action-focused"));
        models.put("analytical", new ModelInfo("analytical", "Philosophical, explanation-focused"));
        models.put("supportive", new ModelInfo("supportive", "Encouragement and validation-focused"));
    }

    public EmpathyAI() {
        this("User");
    }

    /**
     * Very small keyword-based model selector used for tests
     */
    public String selectBestModel(String message) {
        if (message == null) return "empathetic";
        String lower = message.toLowerCase();
        if (lower.contains("sad") || lower.contains("depressed") || lower.contains("hopeless") || lower.contains("worthless")) {
            return "empathetic";
        }
        if (lower.contains("how") || lower.contains("fix") || lower.contains("solve") || lower.contains("problem")) {
            return "practical";
        }
        if (lower.contains("meaning") || lower.contains("what is") || lower.contains("why")) {
            return "analytical";
        }
        if (lower.contains("help") || lower.contains("support") || lower.contains("encourage")) {
            return "supportive";
        }
        // default
        return "empathetic";
    }

    /**
     * Full processing pipeline: safety check -> model select -> generate response
     */
    public Map<String, Object> processMessage(String message) {
        Map<String, Object> result = new HashMap<>();

        Map<String, Object> safetyResult = safety.analyzeMessage(message);
        boolean isFlagged = (boolean) safetyResult.getOrDefault("flagged", false);

        String modelUsed = selectBestModel(message);
        String response;
        if (isFlagged) {
            // Record flagged message
            String reason = (String) safetyResult.get("reason");
            String severity = (String) safetyResult.get("severity");
            safety.flagMessage(message, severity, reason);
            response = safety.getSafeResponse(severity, reason);
            result.put("isSafe", false);
            result.put("severity", severity);
        } else {
            // Generate a simple empathetic/practical/analytical/supportive response
            response = generateEmpatheticResponse(modelUsed);
            result.put("isSafe", true);
        }

        // Save to history: user message and assistant reply
        history.addMessage("user", message, isFlagged ? (String) safetyResult.get("reason") : null);
        history.addMessage("assistant", response);

        result.put("response", response);
        result.put("modelUsed", modelUsed);
        result.put("safety", safetyResult);

        return result;
    }

    private String generateEmpatheticResponse(String model) {
        switch (model) {
            case "practical":
                return userName + ", here are some practical steps you can try: 1) break the problem down; 2) plan small steps; 3) iterate and review.";
            case "analytical":
                return "That's an interesting question, " + userName + ". Let's examine the assumptions and explore the possible frameworks for this idea.";
            case "supportive":
                return "I hear you, " + userName + " — that sounds really challenging. I'm here to support you and help you through it.";
            default:
                return "I understand, " + userName + " — that sounds difficult. Can you tell me more about how that feels?";
        }
    }

    public Map<String, ModelInfo> getModelInfo() {
        return Collections.unmodifiableMap(models);
    }

    public Map<String, Object> getConversationSummary() {
        return history.getSessionSummary();
    }

    public Map<String, Object> getSafetyReport() {
        return safety.generateIncidentReport();
    }
}
