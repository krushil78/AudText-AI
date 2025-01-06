import { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await axios.post('https://audtextbackend.onrender.com/chat', { message: input });
        const botMessage = { sender: 'bot', text: response.data.botResponse };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error.message);
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Error connecting to the chatbot.' },
        ]);
      }

      setInput('');
    }
  };

  return (
    <div className="h-screen w-full text-white flex flex-col items-center justify-center ">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col h-3/4">
        {/* Chat Header */}
        <h3 className="text-xl font-bold my-4 text-center border-b p-2 border-gray-700">
          AI Chatbot
        </h3>

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-4 bg-gray-700 rounded-lg">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 p-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 self-end text-right'
                  : 'bg-green-700 self-start text-left'
              }`}
            >
              <span className="font-semibold">
                {msg.sender === 'user' ? 'You' : 'Bot'}:
              </span>{' '}
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 rounded-l-lg bg-gray-600 text-white focus:outline-none  focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-r-lg text-white transition focus:outline-none focus:ring focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
