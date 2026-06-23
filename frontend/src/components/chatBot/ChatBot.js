import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css'; // Assuming styles are already in place

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  const messagesEndRef = useRef(null);

  const toggleChatBot = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeChatBot = (e) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (input.trim()) {
      setShowGreeting(false); // Hide greeting after first message
      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      try {
        // Send user input to backend and get bot's response
        const response = await fetch('http://localhost:5000/api/chatbot/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: input }),
        });
        const data = await response.json();

        // Add bot's response to the chat
        setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: 'bot' }]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching bot response:', error);
        setMessages((prevMessages) => [...prevMessages, { text: 'Error with the bot.', sender: 'bot' }]);
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className={`chatbot ${isMinimized ? 'minimized' : ''}`} onClick={toggleChatBot}>
          <div className="chatbot-header">
            <span>{isMinimized ? 'StudentFacilityAI' : 'StudentFacilityAI'}</span>
            {!isMinimized && (
              <div className="header-controls">
                <button onClick={minimizeChatBot} className="minimize-button">
                  &#8722;
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="close-button">
                  &#10005;
                </button>
              </div>
            )}
          </div>
          {!isMinimized && (
            <>
              {showGreeting && (
                <div className="chatbot-greeting">
                  <h2>Welcome to Student Facility System</h2>
                  <p>I can help you with homemade food and hostel facilities.</p>
                </div>
              )}
              <div className="chatbot-messages" onClick={(e) => e.stopPropagation()}>
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.sender}`}>
                    {message.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="chatbot-input" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={handleInput}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSubmit} className="send-button">
                  &#10148;
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="chatbot-icon" onClick={toggleChatBot}>
          <div className="icon-wrapper">
            <img src="/chat_icon.png" alt="Chat Icon" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
