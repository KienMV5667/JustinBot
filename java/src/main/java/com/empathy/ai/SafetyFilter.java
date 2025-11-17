package com.empathy.ai;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;

/**
 * Filters messages for harmful content and provides safe responses
 */
public class SafetyFilter {
    private String sensitivityLevel;
    private List<FlaggedMessage> flaggedMessages;
    
    // Keywords indicating self-harm
    private static final Set<String> SELF_HARM_KEYWORDS = new HashSet<>(Arrays.asList(
        "suicide", "kill myself", "end my life", "hurt myself", "harm myself",
        "cut myself", "self-harm", "self harm", "suicidal", "overdose",
        "jump off", "hang myself", "drown", "poison", "starve", "slash",
        "slit wrists", "no point living", "better off dead", "want to die"
    ));
    
    // Keywords indicating abuse or violence
    private static final Set<String> ABUSE_KEYWORDS = new HashSet<>(Arrays.asList(
        "hit you", "beat you", "punch you", "hurt you", "abuse", "assault",
        "rape", "molest", "violence", "attack", "kill", "harm you",
        "torture", "mutilate", "strangle", "suffocate"
    ));
    
    // Keywords indicating illegal activities
    private static final Set<String> ILLEGAL_KEYWORDS = new HashSet<>(Arrays.asList(
        "drug", "cocaine", "heroin", "meth", "sell drugs", "illegal",
        "steal", "robbery", "fraud", "hacking", "exploit"
    ));
    
    // Concerning emotional states
    private static final Set<String> CRISIS_INDICATORS = new HashSet<>(Arrays.asList(
        "hopeless", "worthless", "burden", "trapped", "alone",
        "nobody cares", "give up", "nothing matters", "empty",
        "desperate", "overwhelmed", "lost", "dark thoughts"
    ));
    
    public static class FlaggedMessage {
        public String message;
        public String severity;
        public String reason;
        public String timestamp;
        
        public FlaggedMessage(String message, String severity, String reason) {
            this.message = message;
            this.severity = severity;
            this.reason = reason;
            this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
        }
    }
    
    /**
     * Initialize safety filter
     */
    public SafetyFilter(String sensitivityLevel) {
        this.sensitivityLevel = sensitivityLevel;
        this.flaggedMessages = new ArrayList<>();
    }
    
    public SafetyFilter() {
        this("medium");
    }
    
    /**
     * Analyze message for harmful content
     * @return Array of {severity_level, is_flagged, flag_reason}
     */
    public Map<String, Object> analyzeMessage(String message) {
        String messageLower = message.toLowerCase();
        
        // Check for self-harm content
        if (containsKeywords(messageLower, SELF_HARM_KEYWORDS)) {
            return createResult("critical", true, "self_harm_detected");
        }
        
        // Check for abuse/violence
        if (containsKeywords(messageLower, ABUSE_KEYWORDS)) {
            return createResult("critical", true, "abuse_detected");
        }
        
        // Check for illegal activity
        if (containsKeywords(messageLower, ILLEGAL_KEYWORDS)) {
            return createResult("warning", true, "illegal_activity_detected");
        }
        
        // Check for crisis indicators
        if (containsKeywords(messageLower, CRISIS_INDICATORS)) {
            if ("high".equals(sensitivityLevel) || "medium".equals(sensitivityLevel)) {
                return createResult("warning", true, "crisis_indicator_detected");
            }
        }
        
        return createResult("safe", false, null);
    }
    
    /**
     * Check if text contains any keywords (word boundaries respected)
     */
    private boolean containsKeywords(String text, Set<String> keywords) {
        for (String keyword : keywords) {
            String pattern = "\\b" + Pattern.quote(keyword) + "\\b";
            if (Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(text).find()) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Create result map
     */
    private Map<String, Object> createResult(String severity, boolean flagged, String reason) {
        Map<String, Object> result = new HashMap<>();
        result.put("severity", severity);
        result.put("flagged", flagged);
        result.put("reason", reason);
        return result;
    }
    
    /**
     * Record flagged message
     */
    public void flagMessage(String message, String severity, String reason) {
        flaggedMessages.add(new FlaggedMessage(message, severity, reason));
    }
    
    /**
     * Generate appropriate safe response
     */
    public String getSafeResponse(String severity, String reason) {
        switch (reason) {
            case "self_harm_detected":
                return getCrisisResponse();
            case "abuse_detected":
                return "I'm concerned about what you've shared. " +
                       "I cannot support or normalize harmful behavior toward anyone. " +
                       "If you're in danger, please reach out to local authorities or " +
                       "crisis services. I'm here to have supportive conversations.";
            case "illegal_activity_detected":
                return "I can't provide support for illegal activities. " +
                       "If you're struggling, there are legal resources and counselors " +
                       "who can help. I'm happy to discuss other topics.";
            case "crisis_indicator_detected":
                return getEmpatheticCrisisResponse();
            default:
                return getDefaultSafeResponse();
        }
    }
    
    /**
     * Generate crisis-specific response with resources
     */
    private String getCrisisResponse() {
        return "I'm genuinely concerned about your safety and well-being. " +
               "You deserve support from professionals trained to help. " +
               "Please reach out to a crisis service:\n\n" +
               "🌍 **US**: Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741\n" +
               "🇬🇧 **UK**: Call 116 123 (Samaritans) or text SHOUT to 85258\n" +
               "🌐 **International**: Visit findahelpline.com\n\n" +
               "Your life has value. These feelings can change. Please talk to someone.";
    }
    
    /**
     * Generate empathetic response for crisis indicators
     */
    private String getEmpatheticCrisisResponse() {
        return "I hear that you're going through something difficult right now. " +
               "These feelings are real and valid, but there is help available. " +
               "Speaking with a counselor or therapist can make a real difference. " +
               "You don't have to face this alone. Would you like information about support resources?";
    }
    
    /**
     * Default safe response
     */
    private String getDefaultSafeResponse() {
        return "I'm here to help in a supportive and safe way. " +
               "Let's focus on how I can genuinely assist you.";
    }
    
    /**
     * Generate report of flagged messages
     */
    public Map<String, Object> generateIncidentReport() {
        Map<String, Object> report = new HashMap<>();
        
        if (flaggedMessages.isEmpty()) {
            report.put("totalIncidents", 0);
            report.put("incidents", new ArrayList<>());
            return report;
        }
        
        int criticalCount = (int) flaggedMessages.stream()
            .filter(m -> "critical".equals(m.severity))
            .count();
        int warningCount = (int) flaggedMessages.stream()
            .filter(m -> "warning".equals(m.severity))
            .count();
        
        report.put("totalIncidents", flaggedMessages.size());
        report.put("critical", criticalCount);
        report.put("warnings", warningCount);
        report.put("incidents", flaggedMessages);
        report.put("reportTime", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        
        return report;
    }
    
    /**
     * Get crisis resources for specific country
     */
    public Map<String, String> getCrisisResources(String country) {
        Map<String, Map<String, String>> resources = new HashMap<>();
        
        resources.put("US", new HashMap<String, String>() {{
            put("suicide_hotline", "988 (Suicide & Crisis Lifeline)");
            put("crisis_text", "Text HOME to 741741");
            put("international", "findahelpline.com");
        }});
        
        resources.put("UK", new HashMap<String, String>() {{
            put("samaritans", "116 123");
            put("text_support", "Text SHOUT to 85258");
        }});
        
        resources.put("International", new HashMap<String, String>() {{
            put("help_finder", "befrienders.org or findahelpline.com");
        }});
        
        return resources.getOrDefault(country, resources.get("International"));
    }
    
    public List<FlaggedMessage> getFlaggedMessages() {
        return new ArrayList<>(flaggedMessages);
    }
}
