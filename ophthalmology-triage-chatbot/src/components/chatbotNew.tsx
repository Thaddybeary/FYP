"use client";

import { useState } from "react";
import { X, Maximize2, Minimize2, MessageCircle } from "lucide-react"; // Icons
import { getDiagnosis } from "utils/api";

type Message = {
  text: string;
  user: "doctor" | "bot";
};

interface ChatbotProps {
  isOpen: boolean;
  toggleChat: () => void;
}

export default function Chatbot({ isOpen, toggleChat }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm here to assist with ophthalmology cases. How can I help you today?",
      user: "bot",
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false); // ✅ Track Fullscreen Mode

  const [edHistory, setEdHistory] = useState<string | null>(null);
  const [ophSocHistory, setOphSocHistory] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, user: "doctor" as const }];
    setMessages(newMessages);
    setInput("");

    if (!edHistory) {
      setEdHistory(input);
      setMessages([
        ...newMessages,
        {
          text: "Got it. Now, please provide the Ophthalmology SOC history.",
          user: "bot",
        },
      ]);
      return;
    }

    if (!ophSocHistory) {
      setOphSocHistory(input);
      setMessages([
        ...newMessages,
        { text: "Thanks! Now analyzing the data. Please wait...", user: "bot" },
      ]);
      setLoading(true);

      const response = await getDiagnosis(edHistory, input);
      setLoading(false);

      if (response) {
        const botResponse = `Top Diagnoses:\n${response.top_3_diagnoses
          .map((d: any) => `- ${d.diagnosis}: ${d.reasoning}`)
          .join("\n")}\n\nLocation: ${
          response.location_of_disease
        }\nSeverity: ${response.severity}`;

        setMessages([...newMessages, { text: botResponse, user: "bot" }]);
      } else {
        setMessages([
          ...newMessages,
          {
            text: "Error: Unable to fetch diagnosis. Please try again later.",
            user: "bot",
          },
        ]);
      }

      setEdHistory(null);
      setOphSocHistory(null);
      return;
    }

    setMessages([
      ...newMessages,
      {
        text: "I'm here to assist with ophthalmology cases. Please provide the ED history.",
        user: "bot",
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isFullScreen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      <div
        className={`fixed ${
          isFullScreen
            ? "inset-0 w-full h-full scale-100 translate-x-0 translate-y-0"
            : "bottom-20 right-5 w-80 scale-95 translate-x-4 translate-y-4"
        } origin-bottom-right transition-transform duration-600 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col border`}
      >
        {/* Chat Header */}
        <div className="bg-blue-500 text-white p-3 flex justify-between">
          <span>Ophthalmology Chatbot</span>
          <div className="flex gap-2">
            {/* Expand/Minimize Button */}
            <button onClick={() => setIsFullScreen(!isFullScreen)}>
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            {/* Close Button */}
            <button onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-3 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.user === "doctor" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`p-2 rounded-lg ${
                  msg.user === "doctor" ? "bg-blue-200" : "bg-gray-200"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input Field */}
        <div className="p-2 border-t flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 border rounded-l"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            disabled={loading}
          >
            {loading ? "Processing..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}
