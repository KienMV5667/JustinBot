/**
 * Empathetic AI Module for React Native
 * Implements AI with empathy, context awareness, and ethical responses
 */

import ConversationHistory from './ConversationHistory';
import SafetyFilter from './SafetyFilter';

class EmpathyAI {
  constructor(userName = 'User', defaultModel = 'empathetic') {
    this.userName = userName;
    this.currentModel = defaultModel;
    this.history = new ConversationHistory();
    this.safetyFilter = new SafetyFilter('medium');

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

  selectBestModel(message) {
    const messageLower = message.toLowerCase();

    const emotionalKeywords = [
      'feel', 'sad', 'lonely', 'depressed', 'anxious',
      'scared', 'worried', 'hurt', 'pain', 'suffering'
    ];
    if (emotionalKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'empathetic';
    }

    const problemKeywords = ['how to', 'help me', 'advice', 'solution', 'fix', 'problem'];
    if (problemKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'practical';
    }

    const complexKeywords = ['why', 'meaning', 'ethics', 'philosophy', 'right or wrong', 'moral'];
    if (complexKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'analytical';
    }

    const motivationKeywords = ['goal', 'motivation', 'achieve', 'improve', 'better', 'progress'];
    if (motivationKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'supportive';
    }

    return this.currentModel;
  }

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

    const [severity, isFlaged, reason] = this.safetyFilter.analyzeMessage(userMessage);
    this.history.addMessage('user', userMessage, reason ? reason : null);

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

    const selectedModel = this.selectBestModel(userMessage);
    const similarHistory = this._findSimilarTopic(userMessage);
    const response = this._generateEmpatheticResponse(
      userMessage,
      selectedModel,
      similarHistory
    );

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

  _generateEmpatheticResponse(message, model, similarHistory) {
    let response = '';

    let starterIndex;
    do {
      starterIndex = Math.floor(Math.random() * this.EMPATHY_STARTERS.length);
    } while (this.EMPATHY_STARTERS.length > 1 && this._lastStarter === starterIndex);
    response += this.EMPATHY_STARTERS[starterIndex] + ' ';
    this._lastStarter = starterIndex;

    if (similarHistory.length > 0) {
      response += 'I remember you mentioned something similar before. ';
    }

    const modelInfo = this.MODELS[model];
    response += this._modelSpecificResponse(message, modelInfo);

    const closing = this._getSupportiveClosing();
    response += ' ' + closing;
    this._lastClosing = closing;

    return response;
  }

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
        'These kinds of philosophical questions don\'t have easy answers. What draws you to this topic?'
      ];
      return options[Math.floor(Math.random() * options.length)];
    }
    if (specialization === 'encouragement and motivation') {
      const options = [
        'That\'s a wonderful goal! Progress isn\'t always linear, and every step counts, even small ones. You\'ve already shown commitment by thinking about this. What would success look like to you?',
        'You can do this! What\'s the first small step you could take today?',
        'I believe in your ability to grow and improve. What has worked for you in the past?',
        'You\'re already on the right path by thinking about how to improve. What motivates you most?'
      ];
      return options[Math.floor(Math.random() * options.length)];
    }

    return "I'm here to help you with whatever you need.";
  }

  _getSupportiveClosing() {
    const closings = [
      "You're not alone in this.",
      "I'm here if you need to talk more.",
      "Take care of yourself.",
      "You're doing your best, and that matters.",
      "I'm here to support you.",
      "Remember to be kind to yourself.",
      "You deserve care and understanding.",
      "I'm glad you're sharing with me."
    ];
    
    let closing;
    do {
      closing = closings[Math.floor(Math.random() * closings.length)];
    } while (closings.length > 1 && this._lastClosing === closing);
    
    return closing;
  }

  getModelInfo() {
    return {
      currentModel: this.currentModel,
      availableModels: this.MODELS
    };
  }

  getConversationSummary() {
    return this.history.getSummary();
  }

  getSafetyReport() {
    return this.safetyFilter.getSafetyReport();
  }
}

export default EmpathyAI;
