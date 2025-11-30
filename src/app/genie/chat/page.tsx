"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Phone, Video, MoreVertical, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DiscoverChatPage() {
  return (
    <div className="flex w-full justify-center px-4 md:px-0">
      <Suspense fallback={null}>
        <DiscoverChatSection />
      </Suspense>
    </div>
  );
}

function DiscoverChatSection() {
  const searchParams = useSearchParams();
  const studentFromQuery = searchParams.get("student");

  const baseChats = ["Investor A", "Investor B"];
  const initialChats = studentFromQuery && !baseChats.includes(studentFromQuery)
    ? [studentFromQuery, ...baseChats]
    : [...baseChats];

  const [activeChat, setActiveChat] = useState<string>(
    studentFromQuery || "Investor A",
  );
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<
    Record<string, { id: number; text: string; sender: "me" | "other"; time: string }[]>
  >({
    "Investor A": [
      {
        id: 1,
        text: "Hello, I'm a Computer Science student in Bologna looking for support with tuition and living costs.",
        sender: "me",
        time: "10:30 AM",
      },
      {
        id: 2,
        text: "Hi! Thanks for reaching out, I would love to learn more about your goals.",
        sender: "other",
        time: "10:32 AM",
      },
    ],
    "Investor B": [
      {
        id: 1,
        text: "Good evening, I'm interested in scholarships for my first year in Economics.",
        sender: "me",
        time: "Yesterday",
      },
    ],
  });

  const handleSend = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: "me" as const,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }));

    setMessageInput("");
  };
  const chatList = initialChats;

  return (
    <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[rgba(69,91,80,0.16)] bg-white/95 shadow-[0_18px_40px_rgba(37,64,49,0.08)] md:h-[600px] md:flex-row">
      {/* Sidebar */}
      <div className="w-full border-b border-[rgba(69,91,80,0.12)] bg-[#F3F6F4] md:w-64 md:border-b-0 md:border-r">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#A0B5A8]" />
            <input
              placeholder="Search investors"
              className="w-full rounded-full border border-[rgba(69,91,80,0.16)] bg-white/90 py-2 pl-8 pr-3 text-xs placeholder:text-[#A0B5A8] focus:border-[#254031] focus:outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col">
          {chatList.map((name) => (
            <button
              key={name}
              onClick={() => setActiveChat(name)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-left transition-colors",
                activeChat === name
                  ? "bg-[#E4ECE7] border-l-2 border-[#254031]"
                  : "hover:bg-[#E4ECE7]",
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F6F4] text-xs font-bold text-[#254031]">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      activeChat === name ? "text-[#254031]" : "text-[#455B50]",
                    )}
                  >
                    {name}
                  </span>
                  <span className="text-[10px] text-[#A0B5A8]">10:32</span>
                </div>
                <p className="truncate text-xs text-[#455B50]">
                  {messages[name]?.[messages[name].length - 1]?.text || "No messages yet"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(69,91,80,0.12)] px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F6F4] text-xs font-bold text-[#254031]">
              {activeChat
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#254031]">{activeChat}</h3>
              <p className="text-[10px] text-[#455B50]">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#A0B5A8]">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#455B50] hover:text-[#254031]">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#455B50] hover:text-[#254031]">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#455B50] hover:text-[#254031]">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-4">
            {messages[activeChat]?.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  msg.sender === "me" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                    msg.sender === "me"
                      ? "bg-[#254031] text-white rounded-br-none"
                      : "bg-[#F3F6F4] text-[#254031] rounded-bl-none",
                  )}
                >
                  <p>{msg.text}</p>
                  <p
                    className={cn(
                      "mt-1 text-[10px]",
                      msg.sender === "me" ? "text-[#D2E0D8]" : "text-[#A0B5A8]",
                    )}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-[rgba(69,91,80,0.12)] p-4">
          <form
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Write a message to your investor..."
              className="flex-1 rounded-full border border-[rgba(69,91,80,0.16)] bg-[#F3F6F4] px-4 py-2 text-sm placeholder:text-[#A0B5A8] focus:border-[#254031] focus:bg-white focus:outline-none"
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 rounded-full bg-[#254031] text-white hover:bg-[#1c3125]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
