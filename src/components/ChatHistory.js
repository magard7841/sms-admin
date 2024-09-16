import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { API_URL } from '../config';
import { Phone, Mail, Calendar } from 'lucide-react';

const ChatHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat_history`);
      setConversations(response.data);
      
      // Automatically select the first conversation if available
      if (response.data.length > 0) {
        setSelectedConversation(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const renderMessage = (content) => {
    return (
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="mb-2" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-3" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props} />,
          code: ({ node, inline, ...props }) => (
            inline ? <code className="bg-gray-100 px-1 rounded" {...props} /> : <pre className="bg-gray-100 p-2 rounded overflow-x-auto" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  const renderConversation = (content) => {
    let messages;
    try {
      messages = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing conversation content:', error);
      return <div>Error displaying conversation</div>;
    }

    return messages.map((message, index) => (
      
      <div key={index} className={`mb-4 ${message.role === 'user' ? 'pl-6 pr-4' : 'pr-6 pl-4'}`}>
        <div className={`p-4 rounded-3xl ${message.role === 'user' ? 'bg-[#e0e7f7] rounded-tl-none' : 'bg-[#f6f6f6] rounded-tr-none'}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="text-[#242424] text-[22px] font-semibold font-['Raleway']">
              {message.role === 'user' ? selectedConversation.userName : 'Credence Bot'}
            </div>
            <div className="opacity-60 text-[#242424] text-lg font-normal font-['Raleway']">
              Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="text-[#242424] text-lg font-medium font-['Raleway'] leading-[25.20px]">
            {renderMessage(message.content)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    
    <div className="flex flex-col h-full bg-gray-100">
      <h1 className="text-[#242424] text-2xl font-semibold font-['Raleway'] mb-4 pl-4">Chatbot History</h1>
      <div className="flex flex-1">
        <div className="w-[330px] bg-white rounded-2xl overflow-y-auto mr-4">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`cursor-pointer p-5 ${
                selectedConversation && selectedConversation.id === conv.id
                  ? 'bg-[#e0e7f7] border-r-4 border-[#175EFF]'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="text-[#242424] text-lg font-semibold font-['Raleway']">{conv.userName}</div>
            </div>
          ))}
        </div>
        {selectedConversation && (
          <>
            <div className="flex-1 bg-white rounded-2xl p-6 overflow-y-auto mr-4">
              {renderConversation(selectedConversation.content)}
            </div>
            <div className="w-[330px] p-8 bg-white rounded-2xl flex-col justify-start items-start gap-6 inline-flex">
              <div className="w-full flex justify-between items-center">
                <div className="text-[#242424] text-2xl font-semibold font-['Raleway']">{selectedConversation.userName}</div>
              </div>
              <div className="flex-col justify-start items-start gap-1.5 flex w-full">
                <div className="text-[#242424] text-sm font-medium font-['Raleway'] leading-tight">Phone number:</div>
                <div className="w-full p-3 bg-[#f6f6f6] rounded-[14px] flex items-center gap-3.5">
                  <Phone size={24} className="text-gray-500" />
                  <div className="text-[#242424] text-lg font-medium font-['Raleway'] leading-[25.20px]">{selectedConversation.userPhone || 'Not provided'}</div>
                </div>
              </div>
              <div className="flex-col justify-start items-start gap-1.5 flex w-full">
                <div className="text-[#242424] text-sm font-medium font-['Raleway'] leading-tight">Email address</div>
                <div className="w-full p-3 bg-[#f6f6f6] rounded-[14px] flex items-center gap-3.5">
                  <Mail size={24} className="text-gray-500" />
                  <div className="text-[#242424] text-lg font-medium font-['Raleway'] leading-[25.20px]">{selectedConversation.userEmail}</div>
                </div>
              </div>
              <div className="flex-col justify-start items-start gap-1.5 flex w-full">
                <div className="text-[#242424] text-sm font-medium font-['Raleway'] leading-tight">Conversation date</div>
                <div className="w-full p-3 bg-[#f6f6f6] rounded-[14px] flex items-center gap-3.5">
                  <Calendar size={24} className="text-gray-500" />
                  <div className="text-[#242424] text-lg font-medium font-['Raleway'] leading-[25.20px]">{selectedConversation.date}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;