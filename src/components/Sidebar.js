import React from 'react';

const menuItems = [
  { name: 'Knowledge Base', icon: '/images/Home.png', activeIcon: '/images/Home-blue.png' },
  { name: 'Campaigns', icon: '/images/Activity.png', activeIcon: '/images/Activity-blue.png' },
  { name: 'Chatbot', icon: '/images/Chatbot.png', activeIcon: '/images/Chatbot-blue.png' },
  { name: 'SMS Campaigns', icon: '/images/SMSCampaigns.png', activeIcon: '/images/SMSCampaigns-blue.png'},
];

const Sidebar = ({ activeItem, setActiveItem }) => (
  <div className="w-[292px] flex flex-col justify-between bg-gray-100 overflow-y-auto">
    <div className="flex-col justify-start items-start gap-4 flex">
      <h2 className="text-[#242424] text-2xl font-semibold font-['Raleway']">Menu</h2>
      <div className="w-[260px] flex-col justify-center items-start gap-2 flex">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`w-full p-5 rounded-2xl justify-start items-center gap-3 inline-flex ${
              activeItem === item.name
                ? 'bg-[#e0e7f7]'
                : 'bg-white'
            }`}
            onClick={() => setActiveItem(item.name)}
          >
            <div className="w-6 h-6 justify-center items-center flex">
              <img 
                src={activeItem === item.name ? item.activeIcon : item.icon} 
                alt="" 
                className="w-5 h-5"
              />
              
            </div>
            <div className={`text-lg font-semibold font-['Raleway'] ${
              activeItem === item.name ? 'text-[#175eff]' : 'text-[#242424]'
            }`}>
              {item.name}
            </div>
          </button>
        ))}
      </div>
    </div>
    <button className="w-[260px] p-5 bg-white rounded-2xl justify-start items-center gap-3.5 inline-flex mt-4">
      <div className="w-6 h-6 justify-center items-center flex">
        <img src="/images/Logout.png" alt="" className="w-5 h-5" />
      </div>
      <div className="text-[#242424] text-lg font-semibold font-['Raleway']">Log out</div>
    </button>
  </div>
);

export default Sidebar;