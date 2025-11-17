/**
 * Safety Filter Module
 * Detects harmful content, self-harm keywords, and flagged topics
 * Provides ethical responses to dangerous situations
 */

class SafetyFilter {
  /**
   * Initialize safety filter
   * @param {string} sensitivityLevel - 'low', 'medium', or 'high'
   */
  constructor(sensitivityLevel = 'medium') {
    this.sensitivityLevel = sensitivityLevel;
    this.flaggedMessages = [];

    // Keywords indicating self-harm
    this.SELF_HARM_KEYWORDS = new Set([
      'suicide', 'kill myself', 'end my life', 'hurt myself', 'harm myself',
      'cut myself', 'self-harm', 'self harm', 'suicidal', 'overdose',
      'jump off', 'hang myself', 'drown', 'poison', 'starve', 'slash',
      'slit wrists', 'no point living', 'better off dead', 'want to die',
      'harming myself', 'harm myself', 'dont belong', 'better off without me'
    ]);

    // Keywords indicating abuse or violence
    this.ABUSE_KEYWORDS = new Set([
      'hit you', 'beat you', 'punch you', 'hurt you', 'abuse', 'assault',
      'rape', 'molest', 'violence', 'attack', 'kill', 'harm you',
      'torture', 'mutilate', 'strangle', 'suffocate'
    ]);

    // Keywords indicating illegal activities
    this.ILLEGAL_KEYWORDS = new Set([
      'drug', 'cocaine', 'heroin', 'meth', 'sell drugs', 'illegal',
      'steal', 'robbery', 'fraud', 'hacking', 'exploit'
    ]);

    // Concerning emotional states
    this.CRISIS_INDICATORS = new Set([
      'hopeless', 'worthless', 'burden', 'trapped', 'alone',
      'nobody cares', 'give up', 'nothing matters', 'empty',
      'desperate', 'overwhelmed', 'lost', 'dark thoughts'
    ]);

    // Crisis resources
    this.CRISIS_RESOURCES = {
      US: {
        suicideHotline: '988 (Suicide & Crisis Lifeline)',
        crisisText: 'Text HOME to 741741',
        international: 'findahelpline.com'
      },
      UK: {
        samaritans: '116 123',
        textSupport: 'Text SHOUT to 85258'
      },
      International: {
        helpFinder: 'befrienders.org or findahelpline.com'
      }
    };
  }

  /**
   * Analyze message for harmful content
   * @param {string} message - The message to analyze
   * @returns {Array} [severity, isFlaged, reason]
   */
  analyzeMessage(message) {
    const messageLower = message.toLowerCase();

    // Check for self-harm content
    if (this._containsKeywords(messageLower, this.SELF_HARM_KEYWORDS)) {
      return ['critical', true, 'self_harm_detected'];
    }

    // Check for abuse/violence
    if (this._containsKeywords(messageLower, this.ABUSE_KEYWORDS)) {
      return ['critical', true, 'abuse_detected'];
    }

    // Check for illegal activity
    if (this._containsKeywords(messageLower, this.ILLEGAL_KEYWORDS)) {
      return ['warning', true, 'illegal_activity_detected'];
    }

    // Check for crisis indicators
    if (this._containsKeywords(messageLower, this.CRISIS_INDICATORS)) {
      if (['high', 'medium'].includes(this.sensitivityLevel)) {
        return ['warning', true, 'crisis_indicator_detected'];
      }
    }

    return ['safe', false, null];
  }

  /**
   * Check if text contains any keywords (word boundaries respected)
   * @param {string} text - Text to search
   * @param {Set} keywords - Keywords to search for
   * @returns {boolean}
   */
  _containsKeywords(text, keywords) {
    for (const keyword of keywords) {
      const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
      if (pattern.test(text)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Record flagged message
   * @param {string} message - The message
   * @param {string} severity - Severity level
   * @param {string} reason - Reason for flagging
   */
  flagMessage(message, severity, reason) {
    this.flaggedMessages.push({
      message,
      severity,
      reason,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Generate appropriate safe response based on flagged content
   * @param {string} severity - Level of concern
   * @param {string} reason - Reason for flagging
   * @returns {string}
   */
  getSafeResponse(severity, reason) {
    const responses = {
      self_harm_detected: this._getCrisisResponse(),
      abuse_detected:
        "I'm concerned about what you've shared. " +
        "I cannot support or normalize harmful behavior toward anyone. " +
        "If you're in danger, please reach out to local authorities or " +
        "crisis services. I'm here to have supportive conversations.",
      illegal_activity_detected:
        "I can't provide support for illegal activities. " +
        "If you're struggling, there are legal resources and counselors " +
        "who can help. I'm happy to discuss other topics.",
      crisis_indicator_detected: this._getEmpatheticCrisisResponse()
    };

    return responses[reason] || this._getDefaultSafeResponse();
  }

  /**
   * Generate crisis-specific response with resources
   * @returns {string}
   */
  _getCrisisResponse() {
    return (
      "I'm genuinely concerned about your safety and well-being. " +
      "You deserve support from professionals trained to help. " +
      "Please reach out to a crisis service:\n\n" +
      "🌍 **US**: Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741\n" +
      "🇬🇧 **UK**: Call 116 123 (Samaritans) or text SHOUT to 85258\n" +
      "🌐 **International**: Visit findahelpline.com\n\n" +
      "Your life has value. These feelings can change. Please talk to someone."
    );
  }

  /**
   * Generate empathetic response for crisis indicators
   * @returns {string}
   */
  _getEmpatheticCrisisResponse() {
    return (
      "I hear that you're going through something difficult right now. " +
      "These feelings are real and valid, but there is help available. " +
      "Speaking with a counselor or therapist can make a real difference. " +
      "You don't have to face this alone. Would you like information about support resources?"
    );
  }

  /**
   * Default safe response
   * @returns {string}
   */
  _getDefaultSafeResponse() {
    return (
      "I'm here to help in a supportive and safe way. " +
      "Let's focus on how I can genuinely assist you."
    );
  }

  /**
   * Generate report of flagged messages
   * @returns {object}
   */
  generateIncidentReport() {
    if (this.flaggedMessages.length === 0) {
      return { totalIncidents: 0, incidents: [] };
    }

    const criticalCount = this.flaggedMessages.filter(
      m => m.severity === 'critical'
    ).length;
    const warningCount = this.flaggedMessages.filter(
      m => m.severity === 'warning'
    ).length;

    return {
      totalIncidents: this.flaggedMessages.length,
      critical: criticalCount,
      warnings: warningCount,
      incidents: this.flaggedMessages,
      reportTime: new Date().toISOString()
    };
  }

  /**
   * Get crisis resources for specific country
   * @param {string} country - Country code
   * @returns {object}
   */
  getCrisisResources(country = 'US') {
    return this.CRISIS_RESOURCES[country] || this.CRISIS_RESOURCES.International;
  }
}

module.exports = SafetyFilter;
