"""
Empathetic AI Module
Implements AI with empathy, context awareness, and ethical responses
Supports multiple models for different scenarios
"""
from typing import Dict, List, Optional, Tuple
from conversation_history import ConversationHistory
from safety_filter import SafetyFilter
import json
import random


class EmpathyAI:
    """Main AI class with empathy, memory, and safety features"""
    
    # Model profiles for different contexts
    MODELS = {
        "empathetic": {
            "name": "Empathetic Model",
            "specialization": "emotional support and understanding",
            "traits": ["compassionate", "validating", "patient", "non-judgmental"],
            "best_for": "crisis support, emotional topics, personal struggles"
        },
        "practical": {
            "name": "Practical Model",
            "specialization": "actionable advice and solutions",
            "traits": ["efficient", "focused", "solution-oriented", "clear"],
            "best_for": "problem-solving, advice, technical questions"
        },
        "analytical": {
            "name": "Analytical Model",
            "specialization": "deep thinking and complex topics",
            "traits": ["thoughtful", "thorough", "balanced", "nuanced"],
            "best_for": "philosophy, ethics, complex analysis"
        },
        "supportive": {
            "name": "Supportive Model",
            "specialization": "encouragement and motivation",
            "traits": ["positive", "encouraging", "motivating", "uplifting"],
            "best_for": "motivation, goal-setting, self-improvement"
        }
    }
    
    # Empathy patterns for responses
    EMPATHY_STARTERS = [
        "I understand how you feel.",
        "That sounds really challenging.",
        "Your feelings make complete sense.",
        "I hear you, and what you're going through matters.",
        "That's a difficult situation, and I appreciate you sharing it.",
        "I can see why that would be frustrating/painful/concerning.",
    ]
    
    def __init__(self, user_name: str = "User", default_model: str = "empathetic"):
        """
        Initialize EmpathyAI
        
        Args:
            user_name: Name of the user for personalization
            default_model: Default model to use
        """
        self.user_name = user_name
        self.current_model = default_model
        self.history = ConversationHistory()
        self.safety_filter = SafetyFilter(sensitivity_level="medium")
        self.emotional_context = {}
        
    def select_best_model(self, message: str) -> str:
        """
        Select the best model based on message content
        
        Args:
            message: User message to analyze
            
        Returns:
            Selected model name
        """
        message_lower = message.lower()
        
        # Detect crisis or emotional distress
        emotional_keywords = ["feel", "sad", "lonely", "depressed", "anxious", 
                            "scared", "worried", "hurt", "pain", "suffering"]
        if any(keyword in message_lower for keyword in emotional_keywords):
            return "empathetic"
        
        # Detect problem-solving requests
        problem_keywords = ["how to", "help me", "advice", "solution", "fix", "problem"]
        if any(keyword in message_lower for keyword in problem_keywords):
            return "practical"
        
        # Detect philosophical/complex topics
        complex_keywords = ["why", "meaning", "ethics", "philosophy", "right or wrong", "moral"]
        if any(keyword in message_lower for keyword in complex_keywords):
            return "analytical"
        
        # Detect motivation/goal topics
        motivation_keywords = ["goal", "motivation", "achieve", "improve", "better", "progress"]
        if any(keyword in message_lower for keyword in motivation_keywords):
            return "supportive"
        
        return self.current_model
    
    def process_message(self, user_message: str) -> Dict:
        """
        Process user message with full safety and empathy pipeline
        
        Args:
            user_message: The user's input message
            
        Returns:
            Dict with response, safety status, and metadata
        """
        # Check for safety issues
        severity, is_flagged, reason = self.safety_filter.analyze_message(user_message)
        
        # Store in history
        self.history.add_message("user", user_message, safety_flag=reason if is_flagged else None)
        
        # Handle flagged content
        if is_flagged and severity in ["critical", "warning"]:
            if severity == "critical":
                self.safety_filter.flag_message(user_message, severity, reason)
            
            safe_response = self.safety_filter.get_safe_response(severity, reason)
            self.history.add_message("assistant", safe_response)
            
            return {
                "response": safe_response,
                "is_safe": False,
                "severity": severity,
                "reason": reason,
                "model_used": "safety_protocol",
                "from_history": False
            }
        
        # Select appropriate model
        selected_model = self.select_best_model(user_message)
        
        # Check if similar topic was discussed before
        similar_history = self._find_similar_topic(user_message)
        
        # Generate empathetic response
        response = self._generate_empathetic_response(
            user_message, 
            selected_model, 
            similar_history
        )
        
        # Store response in history
        self.history.add_message("assistant", response)
        
        return {
            "response": response,
            "is_safe": True,
            "model_used": selected_model,
            "model_info": self.MODELS[selected_model],
            "from_history": len(similar_history) > 0,
            "context_used": similar_history
        }
    
    def _find_similar_topic(self, message: str) -> List[Dict]:
        """Find similar topics from conversation history"""
        if not self.history.get_user_messages():
            return []
        
        # Simple similarity check - look for shared keywords
        message_words = set(message.lower().split())
        similar_messages = []
        
        for hist_message in self.history.get_recent_context(num_messages=20):
            if hist_message["role"] == "user" and hist_message["content"] != message:
                hist_words = set(hist_message["content"].lower().split())
                similarity = len(message_words & hist_words) / len(message_words | hist_words)
                if similarity > 0.3:  # If more than 30% similar
                    similar_messages.append(hist_message)
        
        return similar_messages[:3]  # Return top 3 similar messages
    
    def _generate_empathetic_response(self, message: str, model: str, 
                                     similar_history: List[Dict]) -> str:
        """
        Generate empathetic response using selected model
        
        Args:
            message: User message
            model: Selected model to use
            similar_history: Related messages from history
            
        Returns:
            Empathetic response
        """
        response = ""
        
        # Start with empathy
        response += random.choice(self.EMPATHY_STARTERS) + " "
        
        # Add context from history if available
        if similar_history:
            response += f"I remember you mentioned something similar before. "
        
        # Add model-specific response
        model_info = self.MODELS[model]
        response += self._model_specific_response(message, model_info)
        
        # End with supportive closing
        response += " " + self._get_supportive_closing()
        
        return response
    
    def _model_specific_response(self, message: str, model_info: Dict) -> str:
        """Generate model-specific response content"""
        message_lower = message.lower()
        
        if model_info["specialization"] == "emotional support and understanding":
            return (
                f"What you're feeling is valid and important. "
                f"These moments are part of being human. "
                f"I'm here to listen and support you through this. "
                f"Tell me more about what's on your mind?"
            )
        
        elif model_info["specialization"] == "actionable advice and solutions":
            return (
                f"Let me help you find practical solutions. "
                f"Based on what you've shared, here are some steps we could consider: "
                f"1) First, let's understand the core issue clearly. "
                f"2) Then we can explore options together. "
                f"What aspect would you like to focus on first?"
            )
        
        elif model_info["specialization"] == "deep thinking and complex topics":
            return (
                f"This is a nuanced and important topic worth thinking deeply about. "
                f"There are multiple perspectives here, and your viewpoint matters. "
                f"Let's explore this together thoughtfully. "
                f"What's your initial thoughts on this?"
            )
        
        elif model_info["specialization"] == "encouragement and motivation":
            return (
                f"You're taking positive steps by engaging with this. "
                f"Progress happens one moment at a time, and you're moving forward. "
                f"Let's focus on what you can control and build from there. "
                f"What's your vision for how things could improve?"
            )
        
        return "I'm here to help. Tell me more about what you need."
    
    def _get_supportive_closing(self) -> str:
        """Get supportive closing line"""
        closings = [
            "I'm here for you.",
            "Remember, you're not alone in this.",
            "Your well-being matters.",
            "Let's take this one step at a time.",
            "I believe in you.",
            "You've got this."
        ]
        return random.choice(closings)
    
    def get_conversation_summary(self) -> Dict:
        """Get summary of current conversation"""
        return self.history.get_session_summary()
    
    def get_safety_report(self) -> Dict:
        """Get safety incident report"""
        return self.safety_filter.generate_incident_report()
    
    def save_session(self, filepath: str) -> None:
        """Save current session to file"""
        self.history.save_to_file(filepath)
        print(f"Session saved to {filepath}")
    
    def load_session(self, filepath: str) -> None:
        """Load previous session from file"""
        self.history.load_from_file(filepath)
        print(f"Session loaded from {filepath}")
    
    def get_model_info(self, model_name: Optional[str] = None) -> Dict:
        """Get information about available models"""
        if model_name:
            return self.MODELS.get(model_name, {})
        return self.MODELS
