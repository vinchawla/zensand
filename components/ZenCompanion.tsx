import React, { useState, useEffect, useRef } from 'react';
import { generateZenResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Sparkles, X, MessageCircle } from 'lucide-react';

const ZenCompanion: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'init', sender: 'ai', text: 'Welcome to your sanctuary. How can I help you find peace today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Extract history for context
        const historyText = messages.map(m => m.text);
        
        const responseText = await generateZenResponse(userMsg.text, historyText);
        
        const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: responseText };
        setMessages(prev => [...prev, aiMsg]);
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="absolute bottom-6 right-6 p-4 bg-stone-800 text-stone-200 rounded-full shadow-xl hover:bg-amber-700 transition-colors z-20 flex items-center gap-2 border border-stone-600"
            >
                <Sparkles size={20} />
                <span className="hidden md:inline font-medium">Zen Master</span>
            </button>
        );
    }

    return (
        <div className="absolute bottom-6 right-6 w-80 md:w-96 h-[500px] bg-stone-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-700 flex flex-col z-20 overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="p-4 bg-stone-800 border-b border-stone-700 flex justify-between items-center">
                <div className="flex items-center gap-2 text-stone-200">
                    <Sparkles className="text-amber-500" size={18} />
                    <h3 className="font-serif font-bold">Zen Companion</h3>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="text-stone-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                msg.sender === 'user' 
                                    ? 'bg-amber-900/50 text-amber-50 rounded-br-none border border-amber-800/50' 
                                    : 'bg-stone-800 text-stone-200 rounded-bl-none border border-stone-700'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-stone-800 p-3 rounded-2xl rounded-bl-none border border-stone-700">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-stone-800 border-t border-stone-700 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Seek wisdom..."
                    className="flex-1 bg-stone-900 text-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 border border-stone-700"
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2 bg-amber-700 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default ZenCompanion;
