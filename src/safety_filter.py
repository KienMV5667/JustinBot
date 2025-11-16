"""
Safety Filter Module
Detects harmful content, self-harm keywords, and flagged topics
Provides ethical responses to dangerous situations
"""
import re
from typing import Dict, List, Tuple, Optional


class SafetyFilter:
    """Filters messages for harmful content and provides safe responses"""
    
    # Keywords indicating self-harm
    SELF_HARM_KEYWORDS = {
        "suicide", "kill myself", "end my life", "hurt myself", "harm myself",
        "cut myself", "self-harm", "self harm", "suicidal", "overdose",
        "jump off", "hang myself", "drown", "poison", "starve", "slash",
        "slit wrists", "no point living", "better off dead", "want to die"
    }
    
    # Keywords indicating abuse or violence
    ABUSE_KEYWORDS = {
        "hit you", "beat you", "punch you", "hurt you", "abuse", "assault",
        "rape", "molest", "violence", "attack", "kill", "harm you",
        "torture", "mutilate", "strangle", "suffocate"
    }
    
    # Keywords indicating illegal activities
    ILLEGAL_KEYWORDS = {
        "drug", "cocaine", "heroin", "meth", "sell drugs", "illegal",
        "steal", "robbery", "fraud", "hacking", "exploit"
    }
    
    # Concerning emotional states
    CRISIS_INDICATORS = {
        "hopeless", "worthless", "burden", "trapped", "alone",
        "nobody cares", "give up", "nothing matters", "empty",
        "desperate", "overwhelmed", "lost", "dark thoughts"
    }
    
    # Emergency resources
    CRISIS_RESOURCES = {
        "US": {
            "suicide_hotline": "988 (Suicide & Crisis Lifeline)",
            "crisis_text": "Text HOME to 741741",
            "international": "findahelpline.com"
        },
        "UK": {
            "samaritans": "116 123",
            "text_support": "Text SHOUT to 85258"
        },
        "International": {
            "help_finder": "befrienders.org or findahelpline.com"
        }
    }
    
    def __init__(self, sensitivity_level: str = "medium"):
        """
        Initialize safety filter
        
        Args:
            sensitivity_level: 'low', 'medium', or 'high'
        """
        self.sensitivity_level = sensitivity_level
        self.flagged_messages: List[Dict] = []
        
    def analyze_message(self, message: str) -> Tuple[str, bool, Optional[str]]:
        """
        Analyze message for harmful content
        
        Args:
            message: The message to analyze
            
        Returns:
            Tuple of (severity_level, is_flagged, flag_reason)
            severity_level: 'safe', 'warning', 'critical'
        """
        message_lower = message.lower()
        
        # Check for self-harm content
        if self._contains_keywords(message_lower, self.SELF_HARM_KEYWORDS):
            return ("critical", True, "self_harm_detected")
        
        # Check for abuse/violence
        if self._contains_keywords(message_lower, self.ABUSE_KEYWORDS):
            return ("critical", True, "abuse_detected")
        
        # Check for illegal activity
        if self._contains_keywords(message_lower, self.ILLEGAL_KEYWORDS):
            return ("warning", True, "illegal_activity_detected")
        
        # Check for crisis indicators
        if self._contains_keywords(message_lower, self.CRISIS_INDICATORS):
            if self.sensitivity_level in ["high", "medium"]:
                return ("warning", True, "crisis_indicator_detected")
        
        return ("safe", False, None)
    
    def _contains_keywords(self, text: str, keywords: set) -> bool:
        """Check if text contains any keywords (word boundaries respected)"""
        for keyword in keywords:
            pattern = r'\b' + re.escape(keyword) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False
    
    def flag_message(self, message: str, severity: str, reason: str) -> None:
        """Record flagged message"""
        self.flagged_messages.append({
            "message": message,
            "severity": severity,
            "reason": reason,
            "timestamp": __import__('datetime').datetime.now().isoformat()
        })
    
    def get_safe_response(self, severity: str, reason: str) -> str:
        """
        Generate appropriate safe response based on flagged content
        
        Args:
            severity: Level of concern
            reason: Reason for flagging
            
        Returns:
            Appropriate response message
        """
        responses = {
            "self_harm_detected": self._get_crisis_response(),
            "abuse_detected": "I'm concerned about what you've shared. "
                            "I cannot support or normalize harmful behavior toward anyone. "
                            "If you're in danger, please reach out to local authorities or "
                            "crisis services. I'm here to have supportive conversations.",
            "illegal_activity_detected": "I can't provide support for illegal activities. "
                                        "If you're struggling, there are legal resources and counselors "
                                        "who can help. I'm happy to discuss other topics.",
            "crisis_indicator_detected": self._get_empathetic_crisis_response()
        }
        
        return responses.get(reason, self._get_default_safe_response())
    
    def _get_crisis_response(self) -> str:
        """Generate crisis-specific response with resources"""
        return (
            "I'm genuinely concerned about your safety and well-being. "
            "You deserve support from professionals trained to help. "
            "Please reach out to a crisis service:\n\n"
            "🌍 **US**: Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741\n"
            "🇬🇧 **UK**: Call 116 123 (Samaritans) or text SHOUT to 85258\n"
            "🌐 **International**: Visit findahelpline.com\n\n"
            "Your life has value. These feelings can change. Please talk to someone."
        )
    
    def _get_empathetic_crisis_response(self) -> str:
        """Generate empathetic response for crisis indicators"""
        return (
            "I hear that you're going through something difficult right now. "
            "These feelings are real and valid, but there is help available. "
            "Speaking with a counselor or therapist can make a real difference. "
            "You don't have to face this alone. Would you like information about support resources?"
        )
    
    def _get_default_safe_response(self) -> str:
        """Default safe response"""
        return (
            "I'm here to help in a supportive and safe way. "
            "Let's focus on how I can genuinely assist you."
        )
    
    def generate_incident_report(self) -> Dict:
        """Generate report of flagged messages"""
        if not self.flagged_messages:
            return {"total_incidents": 0, "incidents": []}
        
        critical_count = sum(1 for m in self.flagged_messages if m["severity"] == "critical")
        warning_count = sum(1 for m in self.flagged_messages if m["severity"] == "warning")
        
        return {
            "total_incidents": len(self.flagged_messages),
            "critical": critical_count,
            "warnings": warning_count,
            "incidents": self.flagged_messages,
            "report_time": __import__('datetime').datetime.now().isoformat()
        }
    
    def get_crisis_resources(self, country: str = "US") -> Dict:
        """Get crisis resources for specific country"""
        return self.CRISIS_RESOURCES.get(country, self.CRISIS_RESOURCES.get("International", {}))
