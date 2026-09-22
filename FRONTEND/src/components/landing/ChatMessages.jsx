import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

const DEFAULT_MESSAGES = [
  { id: "1", sender: "assistant", content: "Hello! I'm Moodify AI. How are you feeling today?" },
  { id: "2", sender: "user", content: "I had a really rough day at work today." },
  { id: "3", sender: "assistant", content: "I see you're feeling a bit down. I've queued up some acoustic indie tracks to help you decompress. Just breathe, I've got the aux." },
];

function TypingIndicator({ className }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 10, filter: "blur(5px)" }} 
      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }} 
      exit={{ opacity: 0, scale: 0.8, y: -10, filter: "blur(5px)" }} 
      transition={{ type: "spring", stiffness: 400, damping: 25 }} 
      className={cn("inline-flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md shadow-lg", className)}
    >
      {[0, 1, 2].map((i) => (
        <motion.span 
          key={i} 
          className="h-2 w-2 rounded-full bg-white/70" 
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8], y: [0, -3, 0] }} 
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }} 
        />
      ))}
    </motion.div>
  );
}

function AnimatedText({ text, isLast, isUser }) {
  if (isUser || !isLast) return <>{text}</>;
  
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

function MessageBubble({ message, isLast }) {
  const isUser = message.sender === "user";
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9, x: isUser ? 20 : -20, filter: "blur(5px)" }} 
      animate={{ opacity: 1, y: 0, scale: 1, x: 0, filter: "blur(0px)" }} 
      transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.8 }} 
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn("flex items-end gap-2 max-w-[85%]", isUser && "flex-row-reverse")}>
        {!isUser && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1, stiffness: 400, damping: 20 }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Sparkles className="size-4 text-white"/>
          </motion.div>
        )}
        <motion.div 
          layout 
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm leading-relaxed overflow-hidden shadow-lg", 
            isUser 
              ? "rounded-tr-md bg-white text-black" 
              : "rounded-tl-md border border-white/20 bg-black/60 text-white backdrop-blur-md"
          )} 
          whileHover={{ scale: 1.02, y: -2 }} 
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {!isUser && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          )}
          <span className="relative z-10 font-medium">
            <AnimatedText text={message.content} isLast={isLast} isUser={isUser} />
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ChatMessages({ messages = DEFAULT_MESSAGES, autoPlay = true, autoPlayDelay = 1800, typingDuration = 1400, showReplay = true, interactive = false, className }) {
  const [visibleCount, setVisibleCount] = useState(autoPlay ? 0 : messages.length);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState(messages);
  const scrollRef = useRef(null);
  const isAutoPlaying = useRef(false);
  const hasInteractedRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) { scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }
  }, []);

  const revealNext = useCallback(async (index) => {
    if (index >= chatMessages.length) { 
      isAutoPlaying.current = false; 
      if (autoPlay && !hasInteractedRef.current) {
        setTimeout(() => {
          if (!hasInteractedRef.current) {
            setVisibleCount(0);
            setChatMessages(messages);
            isAutoPlaying.current = true;
            setTimeout(() => revealNext(0), 100);
          }
        }, 4000);
      }
      return; 
    }
    const message = chatMessages[index];
    if (message.sender === "assistant") {
      setIsTyping(true); await new Promise((r) => setTimeout(r, typingDuration)); setIsTyping(false);
    }
    setVisibleCount(index + 1);
    await new Promise((r) => setTimeout(r, 100));
    scrollToBottom();
    await new Promise((r) => setTimeout(r, autoPlayDelay - (message.sender === "assistant" ? typingDuration : 0) - 100));
    if (isAutoPlaying.current) { revealNext(index + 1); }
  }, [chatMessages, autoPlayDelay, typingDuration, scrollToBottom, autoPlay, messages]);

  const startAutoPlay = useCallback(() => {
    if (autoPlay && visibleCount === 0) { isAutoPlaying.current = true; revealNext(0); }
  }, [autoPlay, visibleCount, revealNext]);

  const replay = useCallback(() => {
    setVisibleCount(0); setChatMessages(messages); isAutoPlaying.current = true; setTimeout(() => revealNext(0), 100);
  }, [messages, revealNext]);

  useEffect(() => {
    setChatMessages(messages);
    if (autoPlay) {
      setVisibleCount(0); isAutoPlaying.current = true; const timer = setTimeout(() => revealNext(0), 500);
      return () => { clearTimeout(timer); isAutoPlaying.current = false; };
    } else { setVisibleCount(messages.length); }
  }, [messages, autoPlay, revealNext]);

  useEffect(() => { scrollToBottom(); }, [visibleCount, isTyping, scrollToBottom]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || !interactive) return;
    hasInteractedRef.current = true;
    const newMessage = { id: `user-${Date.now()}`, sender: "user", content: inputValue.trim() };
    setChatMessages((prev) => [...prev, newMessage]);
    setInputValue(""); 
    setVisibleCount((prev) => prev + 1);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const assistantReply = { id: `assistant-${Date.now()}`, sender: "assistant", content: "I completely understand. I'm adapting the interface and music right now to match your energy. Let's take it easy." };
      setChatMessages((prev) => [...prev, assistantReply]); 
      setVisibleCount((prev) => prev + 1);
    }, typingDuration + 500);
  }, [inputValue, interactive, typingDuration]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className={cn("relative flex flex-col h-[400px] sm:h-[500px] w-full max-w-xl mx-auto overflow-hidden rounded-3xl border border-white/20 bg-black/90 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05),0_0_60px_-15px_rgba(255,255,255,0.1)]", className)}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Sparkles className="size-4 text-white"/>
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Moodify AI</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
              <p className="text-[11px] uppercase tracking-wider text-white/70 font-medium">Online & Listening</p>
            </div>
          </div>
        </div>
        {showReplay && (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={replay} aria-label="Replay conversation" className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-all hover:bg-white/10 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-white/5">
            <RotateCcw className="size-3.5"/> Replay
          </motion.button>
        )}
      </div>
      
      <div ref={scrollRef} role="log" aria-label="Chat messages" aria-live="polite" className="flex-1 space-y-5 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {chatMessages.slice(0, visibleCount).map((message, i) => (
            <MessageBubble isLast={i === visibleCount - 1} key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator key="typing-indicator" />}
        </AnimatePresence>
      </div>
      
      <div className="border-t border-white/10 p-4 bg-black/40">
        <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-black/50 px-4 py-2.5 backdrop-blur-md focus-within:border-white/50 focus-within:bg-black/70 transition-all duration-300 shadow-inner">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} disabled={!interactive} placeholder={interactive ? "Share how you're feeling..." : "Demo mode - replay to watch again"} className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40 disabled:cursor-not-allowed font-medium" />
          <motion.button 
            whileHover={{ scale: 1.08 }} 
            whileTap={{ scale: 0.92 }} 
            onClick={handleSend} 
            disabled={!interactive || !inputValue.trim()} 
            aria-label="Send message" 
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 shadow-lg", 
              interactive && inputValue.trim() 
                ? "bg-white text-black shadow-white/20" 
                : "bg-white/5 text-white/30 shadow-transparent"
            )}
          >
            <Send className="size-4 ml-0.5"/>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
