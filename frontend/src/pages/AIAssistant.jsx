import { useState, useEffect } from "react";

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(() => {
  const savedMessages = localStorage.getItem(
    "secureshield_ai_chat"
  );

  return savedMessages
    ? JSON.parse(savedMessages)
    : [];
});

useEffect(() => {
  localStorage.setItem(
    "secureshield_ai_chat",
    JSON.stringify(messages)
  );
}, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = {
      type: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
          }),
        }
      );

      const data = await response.json();

      const aiMessage = {
        type: "ai",
        text: data.response,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      setQuestion("");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <h1 className="text-5xl font-bold text-green-400 mb-2">
        AI SOC Assistant
      </h1>

      <p className="text-gray-400 mb-8">
        AI-powered cybersecurity analysis and threat intelligence
      </p>

      <div className="bg-[#111827] border border-green-500 rounded-xl p-6">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask SecureShield AI about threats, attacks, incidents, or remediation..."
          className="w-full h-40 bg-[#020617] border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-green-500"
        />

        <button
          onClick={handleAsk}
          className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold"
        >
          Analyze Threat
        </button>

        <button
          onClick={() => {
            setMessages([]);
            localStorage.removeItem(
              "secureshield_ai_chat"
            );
          }}
          className="mt-4 ml-4 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold"
        >
          Clear Chat
        </button>

        <div className="mt-8 space-y-6">
          {[...messages]
            .reverse()
            .map((message, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl border ${
                message.type === "user"
                  ? "bg-green-900/20 border-green-500"
                  : "bg-cyan-900/20 border-cyan-500"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-3 ${
                  message.type === "user"
                    ? "text-green-400"
                    : "text-cyan-400"
                }`}
              >
                {message.type === "user"
                  ? "SOC Analyst"
                  : "SecureShield AI"}
              </h2>

              <p className="text-gray-300 leading-7">
                {message.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}