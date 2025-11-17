const readline = require('readline');
const fs = require('fs');
const path = require('path');
const EmpathyAI = require('./EmpathyAI');
const { AI_CONFIG, getConfig } = require('./config');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

const ai = new EmpathyAI(AI_CONFIG.defaultUserName, AI_CONFIG.defaultModel);

console.log(`${AI_CONFIG.botName} — interactive CLI`);
console.log("Type a message and press Enter. Type 'help' for commands.");
console.log(`\nHi, I am ${AI_CONFIG.botName}! How can I help you?\n`);
rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();
  if (!input) {
    rl.prompt();
    return;
  }

  // Built-in commands
  if (input === 'exit') {
    console.log('Goodbye.');
    rl.close();
    return;
  }

  // Termination phrases handled by the AI with a friendly goodbye
  // Recognize several common user-termination phrases
  const terminationPattern = /^(?:can\s+i\s+end\s+the\s+conversation|end\s+the\s+conversation|end\s+conversation|i\s+want\s+to\s+end\s+the\s+conversation|i\s+don'?t\s+want\s+to\s+talk\s+anymore|can\s+this\s+conversation\s+be\s+ended)\??$/i;
  if (terminationPattern.test(input)) {
    rl.question('Are you sure you want to end the conversation? (yes/no): ', (answer) => {
      const ans = answer.trim().toLowerCase();
      if (ans === 'yes' || ans === 'y') {
        const goodbye = "Goodbye — I hope you're doing okay. Take care of yourself.";
        // record assistant message then exit
        try {
          ai.history.addMessage('assistant', goodbye);
        } catch (err) {
          // ignore history errors
        }
        console.log('\n' + goodbye + '\n');
        
        // Auto-save session before exit
        try {
          const sessionFile = path.resolve(`session_${ai.history.sessionId}.json`);
          ai.history.saveToFile(sessionFile);
          console.log(`Session auto-saved to: ${sessionFile}`);
        } catch (err) {
          console.error('Could not auto-save session:', err.message);
        }
        
        rl.close();
      } else {
        console.log("Okay, let's continue. How can I help you?");
        rl.prompt();
      }
    });
    return;
  }

  if (input === 'help') {
    console.log('Commands: models, history, summary, report, resources, save <file>, load <file>, clear, help, exit');
    rl.prompt();
    return;
  }

  // Greeting starter for minimal greetings
  const greetingPattern = /^\s*(hi|hello|hey|hiya|hi there)\s*([!.]*)?$/i;
  if (greetingPattern.test(input)) {
    const starter = `Hi there — I'm ${AI_CONFIG.botName}. How can I help you today?`;
    try {
      ai.history.addMessage('assistant', starter);
    } catch (err) {
      // ignore
    }
    console.log('\n' + starter + '\n');
    rl.prompt();
    return;
  }

  if (input === 'models') {
    console.log(JSON.stringify(ai.getModelInfo(), null, 2));
    rl.prompt();
    return;
  }

  if (input === 'history') {
    const messages = ai.history.getAllMessages();
    if (messages.length === 0) console.log('(no history)');
    else messages.forEach(m => console.log(`${m.timestamp} [${m.role}] ${m.content}`));
    rl.prompt();
    return;
  }

  if (input === 'summary') {
    console.log(JSON.stringify(ai.getConversationSummary(), null, 2));
    rl.prompt();
    return;
  }

  if (input === 'report') {
    console.log(JSON.stringify(ai.getSafetyReport(), null, 2));
    rl.prompt();
    return;
  }

  if (input.startsWith('resources')) {
    const parts = input.split(/\s+/);
    const country = parts[1] || 'US';
    console.log(JSON.stringify(ai.safetyFilter.getCrisisResources(country), null, 2));
    rl.prompt();
    return;
  }

  if (input.startsWith('save ')) {
    const parts = input.split(/\s+/);
    const filepath = parts[1] || `session_${Date.now()}.json`;
    try {
      const outPath = path.resolve(filepath);
      ai.history.saveToFile(outPath);
      console.log(`Saved session to ${outPath}`);
    } catch (err) {
      console.error('Error saving file:', err.message);
    }
    rl.prompt();
    return;
  }

  if (input.startsWith('load ')) {
    const parts = input.split(/\s+/);
    const filepath = parts[1];
    if (!filepath) {
      console.log('Usage: load <filepath>');
      rl.prompt();
      return;
    }
    try {
      const inPath = path.resolve(filepath);
      ai.history.loadFromFile(inPath);
      console.log(`Loaded session from ${inPath}`);
    } catch (err) {
      console.error('Error loading file:', err.message);
    }
    rl.prompt();
    return;
  }

  if (input === 'clear') {
    ai.history.clearHistory();
    console.log('Conversation history cleared.');
    rl.prompt();
    return;
  }

  // Otherwise, treat as message to AI
  try {
    const result = ai.processMessage(input);
    if (result && result.response) {
      console.log('\n' + result.response + '\n');
    } else {
      console.log('\n(No response)\n');
    }
  } catch (err) {
    console.error('Error processing message:', err.message);
  }

  rl.prompt();
}).on('close', () => {
  console.log('Session ended.');
  process.exit(0);
});
