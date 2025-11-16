"""
Conversation History Module
Stores and retrieves conversation history for context-aware AI responses
"""
import json
from datetime import datetime
from typing import List, Dict, Optional


class ConversationHistory:
    """Manages conversation history with timestamps and metadata"""
    
    def __init__(self, max_history: int = 50):
        """
        Initialize conversation history
        
        Args:
            max_history: Maximum number of messages to keep in memory
        """
        self.messages: List[Dict] = []
        self.max_history = max_history
        self.session_id = self._generate_session_id()
        
    def _generate_session_id(self) -> str:
        """Generate unique session ID"""
        return datetime.now().strftime("%Y%m%d_%H%M%S")
    
    def add_message(self, role: str, content: str, safety_flag: Optional[str] = None) -> None:
        """
        Add a message to history
        
        Args:
            role: 'user' or 'assistant'
            content: Message content
            safety_flag: Optional flag if message was flagged for safety concerns
        """
        message = {
            "timestamp": datetime.now().isoformat(),
            "role": role,
            "content": content,
            "safety_flag": safety_flag
        }
        self.messages.append(message)
        
        # Keep only recent messages if exceeding max_history
        if len(self.messages) > self.max_history:
            self.messages.pop(0)
    
    def get_recent_context(self, num_messages: int = 10) -> List[Dict]:
        """
        Get recent messages for context
        
        Args:
            num_messages: Number of recent messages to retrieve
            
        Returns:
            List of recent messages
        """
        return self.messages[-num_messages:] if self.messages else []
    
    def get_user_messages(self) -> List[str]:
        """Get all user messages from history"""
        return [msg["content"] for msg in self.messages if msg["role"] == "user"]
    
    def get_flagged_messages(self) -> List[Dict]:
        """Get all messages that were flagged for safety concerns"""
        return [msg for msg in self.messages if msg["safety_flag"] is not None]
    
    def get_session_summary(self) -> Dict:
        """Get summary of current session"""
        return {
            "session_id": self.session_id,
            "total_messages": len(self.messages),
            "user_messages": len([m for m in self.messages if m["role"] == "user"]),
            "assistant_messages": len([m for m in self.messages if m["role"] == "assistant"]),
            "flagged_count": len(self.get_flagged_messages()),
            "start_time": self.messages[0]["timestamp"] if self.messages else None,
            "end_time": self.messages[-1]["timestamp"] if self.messages else None
        }
    
    def save_to_file(self, filepath: str) -> None:
        """Save conversation history to JSON file"""
        with open(filepath, 'w') as f:
            json.dump({
                "session_id": self.session_id,
                "messages": self.messages,
                "summary": self.get_session_summary()
            }, f, indent=2)
    
    def load_from_file(self, filepath: str) -> None:
        """Load conversation history from JSON file"""
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                self.messages = data.get("messages", [])
                self.session_id = data.get("session_id", self._generate_session_id())
        except FileNotFoundError:
            print(f"History file not found: {filepath}")
    
    def clear_history(self) -> None:
        """Clear all messages from history"""
        self.messages = []
    
    def get_all_messages(self) -> List[Dict]:
        """Get all messages from history"""
        return self.messages.copy()
