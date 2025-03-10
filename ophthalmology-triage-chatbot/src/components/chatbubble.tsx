"use client";

import { useState } from "react";
import Chatbot from "./chatbotNew";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return <Chatbot isOpen={isOpen} toggleChat={() => setIsOpen(!isOpen)} />;
}
