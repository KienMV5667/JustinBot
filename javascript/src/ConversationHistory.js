/**
 * Conversation History Module
 * Stores and retrieves conversation history for context-aware AI responses
 */

class ConversationHistory {
  /**
   * Initialize conversation history
   * @param {number} maxHistory - Maximum number of messages to keep in memory
   */
  constructor(maxHistory = 50) {
    this.messages = [];
    this.maxHistory = maxHistory;
    this.sessionId = this._generateSessionId();
  }

  /**
   * Generate unique session ID
   * @returns {string}
   */
  _generateSessionId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  }

  /**
   * Add a message to history
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   * @param {string|null} safetyFlag - Optional flag if message was flagged
   */
  addMessage(role, content, safetyFlag = null) {
    const message = {
      timestamp: new Date().toISOString(),
      role,
      content,
      safetyFlag
    };
    this.messages.push(message);

    // Keep only recent messages if exceeding max_history
    if (this.messages.length > this.maxHistory) {
      this.messages.shift();
    }
  }

  /**
   * Get recent messages for context
   * @param {number} numMessages - Number of recent messages to retrieve
   * @returns {Array}
   */
  getRecentContext(numMessages = 10) {
    return this.messages.length > 0
      ? this.messages.slice(-numMessages)
      : [];
  }

  /**
   * Get all user messages from history
   * @returns {Array}
   */
  getUserMessages() {
    return this.messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content);
  }

  /**
   * Get all messages that were flagged for safety concerns
   * @returns {Array}
   */
  getFlaggedMessages() {
    return this.messages.filter(msg => msg.safetyFlag !== null);
  }

  /**
   * Get summary of current session
   * @returns {object}
   */
  getSessionSummary() {
    const userMessages = this.messages.filter(m => m.role === 'user').length;
    const assistantMessages = this.messages.filter(m => m.role === 'assistant').length;
    const flaggedCount = this.getFlaggedMessages().length;

    return {
      sessionId: this.sessionId,
      totalMessages: this.messages.length,
      userMessages,
      assistantMessages,
      flaggedCount,
      startTime: this.messages.length > 0 ? this.messages[0].timestamp : null,
      endTime: this.messages.length > 0 ? this.messages[this.messages.length - 1].timestamp : null
    };
  }

  /**
   * Save conversation history to JSON
   * @param {string} filepath - File path to save to
   */
  saveToFile(filepath) {
    const fs = require('fs');
    const data = {
      sessionId: this.sessionId,
      messages: this.messages,
      summary: this.getSessionSummary()
    };
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

  /**
   * Load conversation history from JSON file
   * @param {string} filepath - File path to load from
   */
  loadFromFile(filepath) {
    try {
      const fs = require('fs');
      const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      this.messages = data.messages || [];
      this.sessionId = data.sessionId || this._generateSessionId();
    } catch (error) {
      console.log(`History file not found: ${filepath}`);
    }
  }

  /**
   * Clear all messages from history
   */
  clearHistory() {
    this.messages = [];
  }

  /**
   * Get all messages from history
   * @returns {Array}
   */
  getAllMessages() {
    return [...this.messages];
  }
}

module.exports = ConversationHistory;
