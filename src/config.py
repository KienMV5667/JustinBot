"""
Configuration and setup file for the Empathetic AI System
"""

# AI SYSTEM CONFIGURATION
AI_CONFIG = {
    "default_user_name": "User",
    "default_model": "empathetic",
    "max_conversation_history": 50,
    "safety_sensitivity": "medium",  # 'low', 'medium', 'high'
    "enable_history_logging": True,
    "history_save_dir": "../data",
}

# MODEL CONFIGURATION
MODEL_CONFIG = {
    "empathetic": {
        "enabled": True,
        "timeout": 30,
        "max_tokens": 500,
    },
    "practical": {
        "enabled": True,
        "timeout": 30,
        "max_tokens": 500,
    },
    "analytical": {
        "enabled": True,
        "timeout": 30,
        "max_tokens": 600,
    },
    "supportive": {
        "enabled": True,
        "timeout": 30,
        "max_tokens": 500,
    },
}

# SAFETY CONFIGURATION
SAFETY_CONFIG = {
    "detect_self_harm": True,
    "detect_abuse": True,
    "detect_illegal": True,
    "detect_crisis": True,
    "flag_severity_levels": ["critical", "warning"],
    "auto_respond_to_critical": True,
    "log_flagged_messages": True,
    "report_to_admin": False,  # Set to True in production
}

# CRISIS RESOURCES
CRISIS_RESOURCES_CONFIG = {
    "US": {
        "suicide_hotline": "988",
        "crisis_text": "Text HOME to 741741",
        "vet_crisis": "988 then press 1",
    },
    "UK": {
        "samaritans": "116 123",
        "crisis_text": "Text SHOUT to 85258",
    },
    "Canada": {
        "crisis_hotline": "1-833-456-4566",
        "text_support": "Text HOME to 741741",
    },
    "Australia": {
        "lifeline": "13 11 14",
        "text_support": "0487 131 114",
    },
}

# FEATURE FLAGS
FEATURES = {
    "enable_conversation_memory": True,
    "enable_safety_filter": True,
    "enable_model_selection": True,
    "enable_session_saving": True,
    "enable_analytics": False,
    "enable_user_feedback": True,
}

# DATABASE/STORAGE CONFIGURATION
STORAGE_CONFIG = {
    "storage_type": "local_json",  # 'local_json', 'database', 'cloud'
    "backup_enabled": True,
    "backup_interval": 3600,  # seconds
}

# LOGGING CONFIGURATION
LOGGING_CONFIG = {
    "log_level": "INFO",  # DEBUG, INFO, WARNING, ERROR
    "log_file": "../data/app.log",
    "log_conversations": True,
    "log_safety_incidents": True,
}


def get_config(key: str = None):
    """Get configuration value"""
    config = {
        "ai": AI_CONFIG,
        "models": MODEL_CONFIG,
        "safety": SAFETY_CONFIG,
        "crisis_resources": CRISIS_RESOURCES_CONFIG,
        "features": FEATURES,
        "storage": STORAGE_CONFIG,
        "logging": LOGGING_CONFIG,
    }
    
    if key:
        return config.get(key, {})
    return config


def validate_config() -> bool:
    """Validate configuration"""
    config = get_config()
    
    # Check required configurations
    required_keys = ["ai", "safety", "features"]
    for key in required_keys:
        if key not in config:
            print(f"Missing required config: {key}")
            return False
    
    return True


if __name__ == "__main__":
    if validate_config():
        print("✓ Configuration is valid")
    else:
        print("✗ Configuration is invalid")
