import React, { act, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import KnowledgeBase from './KnowledgeBase';
import Campaigns from './Campaigns';
import ChatHistory from './ChatHistory';
import SMSCampaigns from './SMSCampaigns';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Knowledge Base');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden bg-gray-100 px-[64px] py-[32px]">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="flex-1 overflow-auto bg-gray-100">
          {activeItem === 'Knowledge Base' && <KnowledgeBase />}
          {activeItem === 'Campaigns' && <Campaigns />}
          {activeItem === 'Chatbot' && <ChatHistory />}
          {activeItem === 'SMS Campaigns' && <SMSCampaigns />}  
        </main>
      </div>
    </div>
  );
};

export default Dashboard;