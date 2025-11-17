package com.empathy.ai;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import com.google.gson.*;

/**
 * Manages conversation history with timestamps and metadata
 */
public class ConversationHistory {
    private List<Message> messages;
    private int maxHistory;
    private String sessionId;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    
    public static class Message {
        public String timestamp;
        public String role;
        public String content;
        public String safetyFlag;
        
        public Message(String role, String content, String safetyFlag) {
            this.timestamp = LocalDateTime.now().format(formatter);
            this.role = role;
            this.content = content;
            this.safetyFlag = safetyFlag;
        }
    }
    
    /**
     * Initialize conversation history
     * @param maxHistory Maximum number of messages to keep in memory
     */
    public ConversationHistory(int maxHistory) {
        this.messages = new ArrayList<>();
        this.maxHistory = maxHistory;
        this.sessionId = generateSessionId();
    }
    
    public ConversationHistory() {
        this(50);
    }
    
    /**
     * Generate unique session ID
     */
    private String generateSessionId() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
    }
    
    /**
     * Add a message to history
     */
    public void addMessage(String role, String content, String safetyFlag) {
        Message msg = new Message(role, content, safetyFlag);
        messages.add(msg);
        
        // Keep only recent messages if exceeding maxHistory
        if (messages.size() > maxHistory) {
            messages.remove(0);
        }
    }
    
    /**
     * Add a message without safety flag
     */
    public void addMessage(String role, String content) {
        addMessage(role, content, null);
    }
    
    /**
     * Get recent messages for context
     */
    public List<Message> getRecentContext(int numMessages) {
        int startIndex = Math.max(0, messages.size() - numMessages);
        return new ArrayList<>(messages.subList(startIndex, messages.size()));
    }
    
    /**
     * Get all user messages from history
     */
    public List<String> getUserMessages() {
        List<String> userMsgs = new ArrayList<>();
        for (Message msg : messages) {
            if ("user".equals(msg.role)) {
                userMsgs.add(msg.content);
            }
        }
        return userMsgs;
    }
    
    /**
     * Get all messages that were flagged for safety
     */
    public List<Message> getFlaggedMessages() {
        List<Message> flagged = new ArrayList<>();
        for (Message msg : messages) {
            if (msg.safetyFlag != null) {
                flagged.add(msg);
            }
        }
        return flagged;
    }
    
    /**
     * Get session summary
     */
    public Map<String, Object> getSessionSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("sessionId", sessionId);
        summary.put("totalMessages", messages.size());
        
        int userMsgs = (int) messages.stream()
            .filter(m -> "user".equals(m.role))
            .count();
        summary.put("userMessages", userMsgs);
        
        int assistantMsgs = messages.size() - userMsgs;
        summary.put("assistantMessages", assistantMsgs);
        
        summary.put("flaggedCount", getFlaggedMessages().size());
        
        if (!messages.isEmpty()) {
            summary.put("startTime", messages.get(0).timestamp);
            summary.put("endTime", messages.get(messages.size() - 1).timestamp);
        }
        
        return summary;
    }
    
    /**
     * Save conversation history to JSON file
     */
    public void saveToFile(String filepath) throws IOException {
        JsonObject json = new JsonObject();
        json.addProperty("sessionId", sessionId);
        
        JsonArray msgsArray = new JsonArray();
        for (Message msg : messages) {
            JsonObject msgObj = new JsonObject();
            msgObj.addProperty("timestamp", msg.timestamp);
            msgObj.addProperty("role", msg.role);
            msgObj.addProperty("content", msg.content);
            msgObj.addProperty("safetyFlag", msg.safetyFlag);
            msgsArray.add(msgObj);
        }
        json.add("messages", msgsArray);
        
        JsonElement summaryElement = JsonParser.parseString(
            new Gson().toJson(getSessionSummary())
        );
        json.add("summary", summaryElement);
        
        try (FileWriter writer = new FileWriter(filepath)) {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            writer.write(gson.toJson(json));
        }
    }
    
    /**
     * Load conversation history from JSON file
     */
    public void loadFromFile(String filepath) throws IOException {
        try (FileReader reader = new FileReader(filepath)) {
            JsonElement element = JsonParser.parseReader(reader);
            JsonObject json = element.getAsJsonObject();
            
            sessionId = json.get("sessionId").getAsString();
            JsonArray msgsArray = json.getAsJsonArray("messages");
            
            messages.clear();
            for (JsonElement msgElement : msgsArray) {
                JsonObject msgObj = msgElement.getAsJsonObject();
                Message msg = new Message(
                    msgObj.get("role").getAsString(),
                    msgObj.get("content").getAsString(),
                    msgObj.has("safetyFlag") && !msgObj.get("safetyFlag").isJsonNull() 
                        ? msgObj.get("safetyFlag").getAsString() 
                        : null
                );
                msg.timestamp = msgObj.get("timestamp").getAsString();
                messages.add(msg);
            }
        }
    }
    
    /**
     * Clear all messages from history
     */
    public void clearHistory() {
        messages.clear();
    }
    
    /**
     * Get all messages from history
     */
    public List<Message> getAllMessages() {
        return new ArrayList<>(messages);
    }
    
    public String getSessionId() {
        return sessionId;
    }
    
    public int size() {
        return messages.size();
    }
}
