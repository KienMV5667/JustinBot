/**
 * Conversation History Module for React Native
 * Stores and retrieves conversation history for context-aware AI responses
 */

interface Message {
  timestamp: string;
  role: 'user' | 'assistant';
  content: string;
  safetyFlag: string | null;
}

interface SessionSummary {
  sessionId: string;
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
  flaggedCount: number;
  startTime: string | null;
  endTime: string | null;
}

export class ConversationHistory {
  private messages: Message[] = [];
  private maxHistory: number;
  private sessionId: string;

  constructor(maxHistory: number = 50) {
    this.maxHistory = maxHistory;
    this.sessionId = this._generateSessionId();
  }

  /**
   * Generate unique session ID
   */
  private _generateSessionId(): string {
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
   */
  addMessage(role: 'user' | 'assistant', content: string, safetyFlag: string | null = null): void {
    const message: Message = {
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
   */
  getRecentContext(numMessages: number = 10): Message[] {
    return this.messages.length > 0
      ? this.messages.slice(-numMessages)
      : [];
  }

  /**
   * Get all user messages from history
   */
  getUserMessages(): string[] {
    return this.messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content);
  }

  /**
   * Get all messages that were flagged for safety concerns
   */
  getFlaggedMessages(): Message[] {
    return this.messages.filter(msg => msg.safetyFlag !== null);
  }

  /**
   * Get summary of current session
   */
  getSessionSummary(): SessionSummary {
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
   * Clear all messages from history
   */
  clearHistory(): void {
    this.messages = [];
  }

  /**
   * Get all messages from history
   */
  getAllMessages(): Message[] {
    return [...this.messages];
  }
}
