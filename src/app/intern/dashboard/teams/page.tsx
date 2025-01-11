"use client";

import { useEffect, useState } from "react";
import teamsData from "../../../../../db/Teams.json"; // Adjust the path as necessary

const ChatComponent = () => {
  const [username, setUsername] = useState("");
  const [teammates, setTeammates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    // Check if window is defined to ensure code runs on the client side
    if (typeof window !== "undefined") {
      // Retrieve the username from localStorage
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);

        // Find the user's team based on the username
        const userTeam = teamsData.teams.find((team) =>
          team.members.includes(storedUsername)
        );

        // Set the teammates, excluding the current user
        if (userTeam) {
          const otherMembers = userTeam.members.filter(
            (member) => member !== storedUsername
          );
          setTeammates(otherMembers);
        }
      }
    }
  }, []);

  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      const newMessage = {
        sender: username,
        content: currentMessage.trim(),
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setCurrentMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Chat Interface</h1>
        <div className="mt-4 h-64 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${
                message.sender === username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col p-4 rounded-lg ${
                  message.sender === username
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <span className="text-sm font-medium">{message.sender}</span>
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-gray-500">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="mt-4 flex">
          <input
            type="text"
            value={currentMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Teammates</h2>
          <ul className="mt-2 list-disc list-inside">
            {teammates.map((teammate, index) => (
              <li key={index} className="text-gray-700">
                {teammate}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
