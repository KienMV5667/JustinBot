"""
Main Application for Empathetic AI System
Provides interactive interface for the complete AI system
"""
from empathy_ai import EmpathyAI
from conversation_history import ConversationHistory
from safety_filter import SafetyFilter
import json
import os
from datetime import datetime


class EmpathyAIApp:
    """Main application interface"""
    
    def __init__(self, user_name: str = "User"):
        """Initialize the application"""
        self.ai = EmpathyAI(user_name=user_name)
        self.running = True
        self.data_dir = "../data"
        self._ensure_data_dir()
        
    def _ensure_data_dir(self):
        """Ensure data directory exists"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
    
    def display_welcome(self):
        """Display welcome message"""
        print("\n" + "="*70)
        print("🤝 EMPATHETIC AI SYSTEM")
        print("="*70)
        print(f"Hello, {self.ai.user_name}! I'm here to listen and support you.")
        print("\nI have these special features:")
        print("  ✓ Empathetic responses tailored to your needs")
        print("  ✓ Memory of our conversation for better context")
        print("  ✓ Safety monitoring to protect your well-being")
        print("  ✓ Multiple AI models that adapt to your situation")
        print("\nCommands:")
        print("  'models'    - See available AI models")
        print("  'history'   - View conversation history")
        print("  'summary'   - Get session summary")
        print("  'report'    - View safety report")
        print("  'save'      - Save this conversation")
        print("  'resources' - Get crisis resources")
        print("  'exit'      - End conversation")
        print("="*70 + "\n")
    
    def run(self):
        """Main application loop"""
        self.display_welcome()
        
        while self.running:
            try:
                user_input = input(f"\n{self.ai.user_name}: ").strip()
                
                if not user_input:
                    continue
                
                # Handle commands
                if user_input.lower() == 'exit':
                    self.handle_exit()
                elif user_input.lower() == 'models':
                    self.display_models()
                elif user_input.lower() == 'history':
                    self.display_history()
                elif user_input.lower() == 'summary':
                    self.display_summary()
                elif user_input.lower() == 'report':
                    self.display_report()
                elif user_input.lower() == 'save':
                    self.save_conversation()
                elif user_input.lower() == 'resources':
                    self.display_crisis_resources()
                else:
                    # Process message
                    self.process_and_respond(user_input)
                    
            except KeyboardInterrupt:
                print("\n\nSession interrupted.")
                self.handle_exit()
            except Exception as e:
                print(f"Error: {e}")
                continue
    
    def process_and_respond(self, user_message: str):
        """Process message and display response"""
        result = self.ai.process_message(user_message)
        
        # Display response
        print(f"\n🤖 AI Assistant: {result['response']}")
        
        # Display metadata
        if result['model_used'] != 'safety_protocol':
            print(f"\n   [Using: {result['model_info']['name']}]", end="")
            if result['from_history']:
                print(f" [Drawing from past conversations]", end="")
            if not result['is_safe']:
                print(f" ⚠️ [Safety concern flagged]", end="")
            print()
    
    def display_models(self):
        """Display available models"""
        print("\n" + "-"*70)
        print("📊 AVAILABLE AI MODELS")
        print("-"*70)
        
        models = self.ai.get_model_info()
        for model_name, model_info in models.items():
            print(f"\n  {model_name.upper()}")
            print(f"  Name: {model_info['name']}")
            print(f"  Specialization: {model_info['specialization']}")
            print(f"  Best for: {model_info['best_for']}")
            print(f"  Traits: {', '.join(model_info['traits'])}")
    
    def display_history(self):
        """Display conversation history"""
        history = self.ai.history.get_all_messages()
        
        if not history:
            print("\nNo conversation history yet.")
            return
        
        print("\n" + "-"*70)
        print("📜 CONVERSATION HISTORY")
        print("-"*70)
        
        for i, msg in enumerate(history, 1):
            role = msg['role'].upper()
            timestamp = msg['timestamp']
            content = msg['content'][:100] + "..." if len(msg['content']) > 100 else msg['content']
            
            safety_indicator = ""
            if msg['safety_flag']:
                safety_indicator = f" ⚠️ [{msg['safety_flag']}]"
            
            print(f"\n{i}. [{role}] {timestamp}")
            print(f"   {content}{safety_indicator}")
    
    def display_summary(self):
        """Display conversation summary"""
        summary = self.ai.get_conversation_summary()
        
        print("\n" + "-"*70)
        print("📈 SESSION SUMMARY")
        print("-"*70)
        print(f"Session ID: {summary['session_id']}")
        print(f"Total Messages: {summary['total_messages']}")
        print(f"User Messages: {summary['user_messages']}")
        print(f"Assistant Messages: {summary['assistant_messages']}")
        print(f"Flagged Messages: {summary['flagged_count']}")
        if summary['start_time']:
            print(f"Started: {summary['start_time']}")
        if summary['end_time']:
            print(f"Last Message: {summary['end_time']}")
    
    def display_report(self):
        """Display safety report"""
        report = self.ai.get_safety_report()
        
        print("\n" + "-"*70)
        print("🛡️ SAFETY REPORT")
        print("-"*70)
        print(f"Total Incidents: {report['total_incidents']}")
        print(f"Critical: {report['critical']}")
        print(f"Warnings: {report['warnings']}")
        
        if report['incidents']:
            print("\nIncidents:")
            for incident in report['incidents']:
                print(f"  - [{incident['severity'].upper()}] {incident['reason']}")
                print(f"    Message: {incident['message'][:80]}...")
                print(f"    Time: {incident['timestamp']}")
    
    def save_conversation(self):
        """Save current conversation"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(self.data_dir, f"session_{timestamp}.json")
        self.ai.save_session(filename)
        print(f"✓ Conversation saved to: {filename}")
    
    def display_crisis_resources(self):
        """Display crisis resources"""
        print("\n" + "-"*70)
        print("🆘 CRISIS RESOURCES & SUPPORT")
        print("-"*70)
        
        resources = self.ai.safety_filter.get_crisis_resources()
        
        for region, info in resources.items():
            print(f"\n{region}:")
            for service_name, service_info in info.items():
                print(f"  • {service_name.replace('_', ' ').title()}: {service_info}")
        
        print("\n" + "="*70)
        print("If you're experiencing thoughts of self-harm:")
        print("  1. Please reach out to one of these services")
        print("  2. Tell someone you trust")
        print("  3. Go to your nearest emergency room if in immediate danger")
        print("="*70)
    
    def handle_exit(self):
        """Handle application exit"""
        print("\n" + "="*70)
        
        # Ask if user wants to save
        save = input("Would you like to save this conversation? (yes/no): ").lower().strip()
        if save in ['yes', 'y']:
            self.save_conversation()
        
        # Display final summary
        summary = self.ai.get_conversation_summary()
        print("\nConversation Summary:")
        print(f"  Total messages: {summary['total_messages']}")
        print(f"  Duration: {summary['start_time']} to {summary['end_time']}")
        
        print("\n🙏 Thank you for the conversation. Your well-being matters.")
        print("Remember: You are not alone, and support is always available.")
        print("="*70 + "\n")
        
        self.running = False


def main():
    """Main entry point"""
    print("\n🤖 Welcome to the Empathetic AI System\n")
    
    # Get user name
    user_name = input("What's your name? (press Enter for 'User'): ").strip()
    if not user_name:
        user_name = "User"
    
    # Start application
    app = EmpathyAIApp(user_name=user_name)
    app.run()


if __name__ == "__main__":
    main()
