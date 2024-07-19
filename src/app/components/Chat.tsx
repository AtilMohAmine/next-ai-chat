'use client'

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useChat } from 'ai/react';

export default function Chat() {
  const [personality, setPersonality] = useState('Standard, neutral responses.');
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      personality
    }
  });
  
  const chatParent = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const node = chatParent.current;
    if(node)
        node.scrollTop = node.scrollHeight
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-foreground">Chat AI</h1>
        <Select 
          defaultValue={personality}
          onValueChange={(value) => setPersonality(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Personality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Standard, neutral responses.">Default</SelectItem>
            <SelectItem value="You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.">Pirate</SelectItem>
            <SelectItem value="You are a stand-up comedian. Responses should be humorous and witty.">Comedian</SelectItem>
            <SelectItem value="You are a friendly robot. Responses should be precise and mechanical.">Robot</SelectItem>
          </SelectContent>
        </Select>
      </header>
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4 h-full overflow-scroll no-scrollbar" ref={chatParent}>
            
        {messages.map(m => (
            m.role === 'user' 
            ? (
                <div key={m.id} className='flex items-start gap-4'>
                    <Avatar className="w-8 h-8 border">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="bg-card p-3 rounded-lg max-w-[80%]">
                        <p className="text-sm text-card-foreground">{m.content}</p>
                    </div>
                </div>
            ) 
            : (
                <div key={m.id} className="flex items-start gap-4 justify-end">
                    <div className="bg-primary p-3 rounded-lg max-w-[80%] text-primary-foreground">
                        <p className="text-sm">{m.content}</p>
                    </div>
                    <Avatar className="w-8 h-8 border">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                </div>
            )
        ))}

        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bg-background border-t px-6 py-4 flex items-center">
            <Textarea placeholder="Type your message..." value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} className="flex-1 resize-none pr-16" />
            <Button type="submit" size="icon" className="ml-4">
                <SendIcon className="w-5 h-5" />
                <span className="sr-only">Send</span>
            </Button> 
        </div>
      </form>
    </div>
  )
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )

}