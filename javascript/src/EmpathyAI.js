/**
 * Empathetic AI Module
 * Implements AI with empathy, context awareness, and ethical responses
 * Supports multiple models for different scenarios
 */

const ConversationHistory = require('./ConversationHistory');
const SafetyFilter = require('./SafetyFilter');

class EmpathyAI {
  /**
   * Initialize EmpathyAI
   * @param {string} userName - Name of the user for personalization
   * @param {string} defaultModel - Default model to use
   */
  constructor(userName = 'User', defaultModel = 'empathetic') {
    this.userName = userName;
    this.currentModel = defaultModel;
    this.history = new ConversationHistory();
    this.safetyFilter = new SafetyFilter('medium');

    // Model profiles for different contexts
    this.MODELS = {
      empathetic: {
        name: 'Empathetic Model',
        specialization: 'emotional support and understanding',
        traits: ['compassionate', 'validating', 'patient', 'non-judgmental'],
        bestFor: 'crisis support, emotional topics, personal struggles'
      },
      practical: {
        name: 'Practical Model',
        specialization: 'actionable advice and solutions',
        traits: ['efficient', 'focused', 'solution-oriented', 'clear'],
        bestFor: 'problem-solving, advice, technical questions'
      },
      analytical: {
        name: 'Analytical Model',
        specialization: 'deep thinking and complex topics',
        traits: ['thoughtful', 'thorough', 'balanced', 'nuanced'],
        bestFor: 'philosophy, ethics, complex analysis'
      },
      supportive: {
        name: 'Supportive Model',
        specialization: 'encouragement and motivation',
        traits: ['positive', 'encouraging', 'motivating', 'uplifting'],
        bestFor: 'motivation, goal-setting, self-improvement'
      }
    };

    this.EMPATHY_STARTERS = [
      'I understand how you feel.',
      'That sounds really challenging.',
      'Your feelings make complete sense.',
      "I hear you, and what you're going through matters.",
      "That's a difficult situation, and I appreciate you sharing it.",
      'I can see why that would be frustrating.',
      'Thank you for sharing that with me.',
      'It takes courage to talk about this.',
      'I appreciate your honesty.',
      'You are not alone in feeling this way.',
      'Many people experience this, and it is okay to talk about it.',
      'I want to support you as best I can.'
    ];
    this._lastStarter = null;
    this._lastClosing = null;
  }

  /**
   * Select the best model based on message content
   * @param {string} message - User message to analyze
   * @returns {string} Selected model name
   */
  selectBestModel(message) {
    const messageLower = message.toLowerCase();

    // Detect crisis or emotional distress
    const emotionalKeywords = [
      'feel', 'sad', 'lonely', 'depressed', 'anxious',
      'scared', 'worried', 'hurt', 'pain', 'suffering'
    ];
    if (emotionalKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'empathetic';
    }

    // Detect problem-solving requests
    const problemKeywords = ['how to', 'help me', 'advice', 'solution', 'fix', 'problem'];
    if (problemKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'practical';
    }

    // Detect philosophical/complex topics
    const complexKeywords = ['why', 'meaning', 'ethics', 'philosophy', 'right or wrong', 'moral'];
    if (complexKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'analytical';
    }

    // Detect motivation/goal topics
    const motivationKeywords = ['goal', 'motivation', 'achieve', 'improve', 'better', 'progress'];
    if (motivationKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'supportive';
    }

    return this.currentModel;
  }

  /**
   * Process user message with full safety and empathy pipeline
   * @param {string} userMessage - The user's input message
   * @returns {object}
   */
  processMessage(userMessage) {
    // Check for "need to talk" messages
    const needToTalkPattern = /\b(i\s+need\s+to\s+talk|need\s+to\s+talk\s+to\s+you|i\s+need\s+someone\s+to\s+talk\s+to|can\s+i\s+talk\s+to\s+you)\b/i;
    if (needToTalkPattern.test(userMessage)) {
      this.history.addMessage('user', userMessage, null);
      const talkResponses = [
        "What can I help you with?",
        "I'm here to listen. What can I help you with?",
        "Of course. What can I help you with?",
        "I'm here for you. What can I help you with?"
      ];
      const response = talkResponses[Math.floor(Math.random() * talkResponses.length)];
      this.history.addMessage('assistant', response);
      
      return {
        response,
        isSafe: true,
        modelUsed: 'talk_request_response',
        fromHistory: false
      };
    }

    // Check for thank you messages
    const thankYouPattern = /\b(thank you|thanks|thank u|thx|appreciate it|grateful)\b/i;
    if (thankYouPattern.test(userMessage)) {
      this.history.addMessage('user', userMessage, null);
      const gratitudeResponses = [
        "Of course, I am grateful to be of help to you.",
        "You're very welcome! I'm grateful to be of help to you.",
        "I'm happy to help! It's my pleasure to be here for you.",
        "Of course! I'm grateful I can be of help to you."
      ];
      const response = gratitudeResponses[Math.floor(Math.random() * gratitudeResponses.length)];
      this.history.addMessage('assistant', response);
      
      return {
        response,
        isSafe: true,
        modelUsed: 'gratitude_response',
        fromHistory: false
      };
    }

    // Check for safety issues
    const [severity, isFlaged, reason] = this.safetyFilter.analyzeMessage(userMessage);

    // Store in history
    this.history.addMessage('user', userMessage, reason ? reason : null);

    // Handle flagged content
    if (isFlaged && ['critical', 'warning'].includes(severity)) {
      if (severity === 'critical') {
        this.safetyFilter.flagMessage(userMessage, severity, reason);
      }

      const safeResponse = this.safetyFilter.getSafeResponse(severity, reason);
      this.history.addMessage('assistant', safeResponse);

      return {
        response: safeResponse,
        isSafe: false,
        severity,
        reason,
        modelUsed: 'safety_protocol',
        fromHistory: false
      };
    }

    // Select appropriate model
    const selectedModel = this.selectBestModel(userMessage);

    // Check if similar topic was discussed before
    const similarHistory = this._findSimilarTopic(userMessage);

    // Generate empathetic response
    const response = this._generateEmpatheticResponse(
      userMessage,
      selectedModel,
      similarHistory
    );

    // Store response in history
    this.history.addMessage('assistant', response);

    return {
      response,
      isSafe: true,
      modelUsed: selectedModel,
      modelInfo: this.MODELS[selectedModel],
      fromHistory: similarHistory.length > 0,
      contextUsed: similarHistory
    };
  }

  /**
   * Find similar topics from conversation history
   * @param {string} message - Current message
   * @returns {Array}
   */
  _findSimilarTopic(message) {
    if (this.history.getUserMessages().length === 0) {
      return [];
    }

    const messageWords = new Set(message.toLowerCase().split(/\s+/));
    const similarMessages = [];

    const recentContext = this.history.getRecentContext(20);
    for (const histMessage of recentContext) {
      if (histMessage.role === 'user' && histMessage.content !== message) {
        const histWords = new Set(histMessage.content.toLowerCase().split(/\s+/));
        
        // Calculate Jaccard similarity
        const intersection = new Set([...messageWords].filter(x => histWords.has(x)));
        const union = new Set([...messageWords, ...histWords]);
        const similarity = intersection.size / union.size;
        
        if (similarity > 0.3) {
          similarMessages.push(histMessage);
        }
      }
    }

    return similarMessages.slice(0, 3);
  }

  /**
   * Generate empathetic response using selected model
   * @param {string} message - User message
   * @param {string} model - Selected model to use
   * @param {Array} similarHistory - Related messages from history
   * @returns {string}
   */
  _generateEmpatheticResponse(message, model, similarHistory) {
    let response = '';

    // Start with empathy, avoid repeating last starter
    let starterIndex;
    do {
      starterIndex = Math.floor(Math.random() * this.EMPATHY_STARTERS.length);
    } while (this.EMPATHY_STARTERS.length > 1 && this._lastStarter === starterIndex);
    response += this.EMPATHY_STARTERS[starterIndex] + ' ';
    this._lastStarter = starterIndex;

    // Add context from history if available
    if (similarHistory.length > 0) {
      response += 'I remember you mentioned something similar before. ';
    }

    // Add model-specific response
    const modelInfo = this.MODELS[model];
    response += this._modelSpecificResponse(message, modelInfo);

    // End with supportive closing, avoid repeating last closing
    const closing = this._getSupportiveClosing();
    response += ' ' + closing;
    this._lastClosing = closing;

    return response;
  }

  /**
   * Generate model-specific response content
   * @param {string} message - User message
   * @param {object} modelInfo - Model information
   * @returns {string}
   */
  _modelSpecificResponse(message, modelInfo) {
    const specialization = modelInfo.specialization;

    if (specialization === 'emotional support and understanding') {
      const options = [
        "What you're feeling is valid and important. These moments are part of being human. I'm here to listen and support you through this. Tell me more about what's on your mind?",
        "It's okay to feel this way. I'm here to talk and listen whenever you need.",
        "Your emotions matter, and it's good that you're expressing them. Would you like to share more?",
        "You deserve compassion and understanding. I'm here to talk if you need me."
      ];
      return options[Math.floor(Math.random() * options.length)];
    }
    if (specialization === 'actionable advice and solutions') {
      const options = [
        'Let me help you find practical solutions. Based on what you\'ve shared, here are some steps we could consider: 1) First, let\'s understand the core issue clearly. 2) Then we can explore options together. What aspect would you like to focus on first?',
        'We can break this down into manageable steps. What is the first thing you want to tackle?',
        'I can offer some advice or resources if you want. What would be most helpful for you right now?',
        'Let\'s work together to find a way forward. What outcome would you like to see?'
      ];
      return options[Math.floor(Math.random() * options.length)];
    }
    if (specialization === 'deep thinking and complex topics') {
      const options = [
        'This is a nuanced and important topic worth thinking deeply about. There are multiple perspectives here, and your viewpoint matters. Let\'s explore this together thoughtfully. What\'s your initial thoughts on this?',
        'That\'s a profound question. There are many ways to look at it. What are your thoughts so far?',
        'It\'s great to reflect on these kinds of questions. Would you like to share your perspective?',
        'There is no single answer, but exploring it can be meaningful. What draws you to this topic?'
      ];
      return options[Math.floor(Math.random() * options.length)];
    }
    if (specialization === 'encouragement and motivation') {
      const options = [
        "You're taking positive steps by engaging with this. Progress happens one moment at a time, and you\'re moving forward. Let\'s focus on what you can control and build from there. What\'s your vision for how things could improve?",
        "Every step you take matters. What is one thing you feel good about today?",
        "You have strengths that can help you move forward. What motivates you right now?",
        "Small progress is still progress. What\'s one goal you want to work toward?"
      ];
      return options[Math.floor(Math.random() * options.length)];
    }
    return 'I\'m here to help. Tell me more about what you need.';
  }

  /**
   * Get supportive closing line
   * @returns {string}
   */
  _getSupportiveClosing() {
    const closings = [
      "I'm here for you.",
      "Remember, you're not alone in this.",
      "Your well-being matters.",
      "Let's take this one step at a time.",
      'I believe in you.',
      "You've got this.",
      "If you need to talk more, I'm here.",
      "Take care of yourself, you matter.",
      "You are stronger than you think.",
      "I'm always here to listen."
    ];
    // Avoid repeating the last closing
    let closing;
    do {
      closing = closings[Math.floor(Math.random() * closings.length)];
    } while (closings.length > 1 && closing === this._lastClosing);
    return closing;
  }

  /**
   * Get summary of current conversation
   * @returns {object}
   */
  getConversationSummary() {
    return this.history.getSessionSummary();
  }

  /**
   * Get safety incident report
   * @returns {object}
   */
  getSafetyReport() {
    return this.safetyFilter.generateIncidentReport();
  }

  /**
   * Save current session to file
   * @param {string} filepath - Path to save to
   */
  saveSession(filepath) {
    this.history.saveToFile(filepath);
    console.log(`Session saved to ${filepath}`);
  }

  /**
   * Load previous session from file
   * @param {string} filepath - Path to load from
   */
  loadSession(filepath) {
    this.history.loadFromFile(filepath);
    console.log(`Session loaded from ${filepath}`);
  }

  /**
   * Get information about available models
   * @param {string|null} modelName - Specific model name or null for all
   * @returns {object}
   */
  getModelInfo(modelName = null) {
    if (modelName) {
      return this.MODELS[modelName] || {};
    }
    return this.MODELS;
  }
}

module.exports = EmpathyAI;
