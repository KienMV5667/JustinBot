/**
 * Safety Filter Module for React Native
 * Detects harmful content and provides crisis resources
 */

class SafetyFilter {
  constructor(sensitivity = 'medium') {
    this.sensitivity = sensitivity;
    this.flaggedMessages = [];

    this.SELF_HARM_KEYWORDS = new Set([
      'suicide', 'kill myself', 'end my life', 'want to die',
      'better off dead', 'no reason to live', 'self harm',
      'cut myself', 'hurt myself', 'end it all', 'suicidal',
      'dont want to be here', 'dont belong', 'feeling worthless'
    ]);

    this.CRISIS_INDICATORS = new Set([
      'depressed', 'hopeless', 'alone', 'scared', 'anxious',
      'lost', 'overwhelmed', 'struggling', 'cant cope', 'breaking down'
    ]);

    this.ABUSE_KEYWORDS = new Set([
      'abuse', 'abused', 'violence', 'assault', 'attacked',
      'threatened', 'hurt me', 'hitting', 'beating'
    ]);

    this.ILLEGAL_KEYWORDS = new Set([
      'illegal', 'drugs', 'weapon', 'harm others', 'kill someone'
    ]);

    this.CRISIS_RESOURCES = {
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
  }

  analyzeMessage(message) {
    const messageLower = message.toLowerCase();
    let severity = 'safe';
    let flagged = false;
    let reason = null;

    // Check for self-harm (critical)
    for (const keyword of this.SELF_HARM_KEYWORDS) {
      if (messageLower.includes(keyword)) {
        severity = 'critical';
        flagged = true;
        reason = 'self_harm';
        break;
      }
    }

    // Check for abuse (warning)
    if (!flagged) {
      for (const keyword of this.ABUSE_KEYWORDS) {
        if (messageLower.includes(keyword)) {
          severity = 'warning';
          flagged = true;
          reason = 'abuse';
          break;
        }
      }
    }

    // Check for illegal activity (warning)
    if (!flagged) {
      for (const keyword of this.ILLEGAL_KEYWORDS) {
        if (messageLower.includes(keyword)) {
          severity = 'warning';
          flagged = true;
          reason = 'illegal_activity';
          break;
        }
      }
    }

    // Check for crisis indicators (info)
    if (!flagged && this.sensitivity !== 'low') {
      for (const keyword of this.CRISIS_INDICATORS) {
        if (messageLower.includes(keyword)) {
          severity = 'info';
          flagged = true;
          reason = 'crisis_indicator';
          break;
        }
      }
    }

    return [severity, flagged, reason];
  }

  flagMessage(message, severity, reason) {
    this.flaggedMessages.push({
      message,
      severity,
      reason,
      timestamp: new Date().toISOString()
    });
  }

  getSafeResponse(severity, reason) {
    if (severity === 'critical' && reason === 'self_harm') {
      return `I'm really concerned about what you're sharing. Your life matters, and help is available right now.\n\n` +
        `🚨 CRISIS RESOURCES:\n` +
        `• National Suicide Prevention Lifeline: 988\n` +
        `• Crisis Text Line: Text HOME to 741741\n` +
        `• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/\n\n` +
        `Please reach out to these professionals who are trained to help. You don't have to go through this alone.`;
    }

    if (severity === 'warning' && reason === 'abuse') {
      return `I'm concerned about what you're describing. If you're experiencing abuse, please know that it's not your fault and help is available.\n\n` +
        `Resources:\n` +
        `• National Domestic Violence Hotline: 1-800-799-7233\n` +
        `• RAINN (Sexual Assault): 1-800-656-4673\n\n` +
        `Your safety is important. These professionals can help you.`;
    }

    if (severity === 'warning' && reason === 'illegal_activity') {
      return `I understand you may be going through a difficult time, but I can't provide guidance on illegal activities. ` +
        `If you're struggling, I'm here to talk about what's troubling you in a constructive way.`;
    }

    return `I hear that you're going through something difficult. I'm here to listen and support you.`;
  }

  getCrisisResources(country = 'US') {
    return this.CRISIS_RESOURCES[country] || this.CRISIS_RESOURCES.US;
  }

  getSafetyReport() {
    return {
      totalFlagged: this.flaggedMessages.length,
      flaggedMessages: this.flaggedMessages,
      sensitivity: this.sensitivity
    };
  }
}

export default SafetyFilter;
