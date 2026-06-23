const OpenAI = require('openai');
const apiKey = process.env.OPENAI_API_KEY;
const { systemPrompt } = require('./prompt');

// Setup the OpenAI API key configuration
const openai = new OpenAI({
  apiKey: apiKey,
});

// Initialize an empty array to store message history
let messageHistory = [];

exports.handleMessage = async (req, res) => {
  const userMessage = req.body.text;

  // Add user message to history
  messageHistory.push({ role: "user", content: userMessage });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messageHistory
      ],
    });

    const botReply = completion.choices[0].message.content;

    // Add bot reply to history
    messageHistory.push({ role: "assistant", content: botReply });

    // Limit history to last 10 messages to prevent token limit issues
    if (messageHistory.length > 10) {
      messageHistory = messageHistory.slice(-10);
    }

    res.json({ reply: botReply });
  } catch (error) {
    console.error('Error from OpenAI:', error);
    res.status(500).json({ error: 'Unable to process your request.' });
  }
};
