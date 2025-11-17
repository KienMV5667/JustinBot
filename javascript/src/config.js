/**
 * Configuration and setup file for the Empathetic AI System (JavaScript)
 */

const AI_CONFIG = {
  defaultUserName: 'User',
  defaultModel: 'empathetic',
  botName: 'JustinBot',
  maxConversationHistory: 50,
  safetySensitivity: 'medium' // 'low', 'medium', 'high'
};

const MODEL_CONFIG = {
  empathetic: {
    enabled: true,
    timeout: 30,
    maxTokens: 500
  },
  practical: {
    enabled: true,
    timeout: 30,
    maxTokens: 500
  },
  analytical: {
    enabled: true,
    timeout: 30,
    maxTokens: 600
  },
  supportive: {
    enabled: true,
    timeout: 30,
    maxTokens: 500
  }
};

const SAFETY_CONFIG = {
  detectSelfHarm: true,
  detectAbuse: true,
  detectIllegal: true,
  detectCrisis: true,
  flagSeverityLevels: ['critical', 'warning'],
  autoRespondToCritical: true,
  logFlaggedMessages: true,
  reportToAdmin: false
};

const CRISIS_RESOURCES_CONFIG = {
  US: {
    suicideHotline: '988',
    crisisText: 'Text HOME to 741741',
    vetCrisis: '988 then press 1'
  },
  UK: {
    samaritans: '116 123',
    crisisText: 'Text SHOUT to 85258'
  },
  Canada: {
    crisisHotline: '1-833-456-4566',
    textSupport: 'Text HOME to 741741'
  },
  Australia: {
    lifeline: '13 11 14',
    textSupport: '0487 131 114'
  }
};

const FEATURES = {
  enableConversationMemory: true,
  enableSafetyFilter: true,
  enableModelSelection: true,
  enableSessionSaving: true,
  enableAnalytics: false,
  enableUserFeedback: true
};

const LOGGING_CONFIG = {
  logLevel: 'INFO',
  logFile: '../data/app.log',
  logConversations: true,
  logSafetyIncidents: true
};

/**
 * Get configuration value
 * @param {string|null} key - Configuration key
 * @returns {object}
 */
function getConfig(key = null) {
  const config = {
    ai: AI_CONFIG,
    models: MODEL_CONFIG,
    safety: SAFETY_CONFIG,
    crisisResources: CRISIS_RESOURCES_CONFIG,
    features: FEATURES,
    logging: LOGGING_CONFIG
  };

  if (key) {
    return config[key] || {};
  }
  return config;
}

/**
 * Validate configuration
 * @returns {boolean}
 */
function validateConfig() {
  const config = getConfig();
  const requiredKeys = ['ai', 'safety', 'features'];

  for (const key of requiredKeys) {
    if (!config[key]) {
      console.log(`Missing required config: ${key}`);
      return false;
    }
  }

  return true;
}

module.exports = {
  getConfig,
  validateConfig,
  AI_CONFIG,
  MODEL_CONFIG,
  SAFETY_CONFIG,
  CRISIS_RESOURCES_CONFIG,
  FEATURES,
  LOGGING_CONFIG
};
