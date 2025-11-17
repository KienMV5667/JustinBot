/**
 * Conversation History Module for React Native
 * Manages conversation memory and context
 */

class ConversationHistory {
  constructor(maxMessages = 100) {
    this.maxMessages = maxMessages;
    this.messages = [];
    this.sessionId = this._generateSessionId();
    this.startTime = new Date().toISOString();
  }

  _generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  addMessage(role, content, flags = null) {
    const message = {
      role,
      content,
      timestamp: new Date().toISOString(),
      flags: flags || null
    };

    this.messages.push(message);

    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
  }

  getAllMessages() {
    return this.messages;
  }

  getUserMessages() {
    return this.messages.filter(m => m.role === 'user');
  }

  getAssistantMessages() {
    return this.messages.filter(m => m.role === 'assistant');
  }

  getRecentContext(n = 10) {
    return this.messages.slice(-n);
  }

  clearHistory() {
    this.messages = [];
    this.sessionId = this._generateSessionId();
    this.startTime = new Date().toISOString();
  }

  getSummary() {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      messageCount: this.messages.length,
      userMessageCount: this.getUserMessages().length,
      assistantMessageCount: this.getAssistantMessages().length
    };
  }
}

export default ConversationHistory;
