"use client"; // Required for interactive components in Next.js

import { useState, useEffect } from "react";
import { getDiagnosis } from "utils/api"; // ✅ Import API function

type Message = {
  text: string;
  user: "doctor" | "bot";
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm here to assist with ophthalmology cases. How can I help you today?", user: "bot" as const }
  ]); // ✅ Initial bot message when page loads

  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  const [edHistory, setEdHistory] = useState<string | null>(null);
  const [ophSocHistory, setOphSocHistory] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, user: "doctor" as const}];
    setMessages(newMessages);
    setInput(""); // Clear input field

    // ✅ Step 1: Check if ED history is missing
    if (!edHistory) {
      setEdHistory(input);
      setMessages([
        ...newMessages,
        { text: "Got it. Now, please provide the Ophthalmology SOC history.", user: "bot" as const }
      ]);
      return;
    }

    // ✅ Step 2: Check if Ophthalmology SOC history is missing
    if (!ophSocHistory) {
      setOphSocHistory(input);
      setMessages([
        ...newMessages,
        { text: "Thanks! Now analyzing the data. Please wait...", user: "bot" }
      ]);
      setLoading(true);

      // ✅ Step 3: Send request to FastAPI when both details are provided
      const response = await getDiagnosis(edHistory, input);
      setLoading(false);

      if (response) {
        const botResponse = `Top Diagnoses:\n${response.top_3_diagnoses
          .map((d: any) => `- ${d.diagnosis}: ${d.reasoning}`)
          .join("\n")}\n\nLocation: ${response.location_of_disease}\nSeverity: ${response.severity}`;

        setMessages([...newMessages, { text: botResponse, user: "bot" }]);
      } else {
        setMessages([...newMessages, { text: "Error: Unable to fetch diagnosis. Please try again later.", user: "bot" }]);
      }

      // ✅ Reset after diagnosis
      setEdHistory(null);
      setOphSocHistory(null);
      return;
    }

    // ✅ Step 4: Default chatbot response for other general messages
    setMessages([
      ...newMessages,
      { text: "I'm here to assist with ophthalmology cases. Please provide the ED history.", user: "bot" }
    ]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ophthalmology Chatbot</h1>

      <div className="h-96 border p-2 overflow-y-scroll flex flex-col space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              msg.user === "doctor" ? "bg-blue-200 self-end text-right" : "bg-gray-200 self-start text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Enter message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border p-2"
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Processing..." : "Send"}
        </button>
      </div>
    </div>
  );
}
