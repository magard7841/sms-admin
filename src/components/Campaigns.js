import React, { useState, useEffect } from 'react';
import { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../api';
import { Pencil, Trash2 } from 'lucide-react';

const CampaignCard = ({ campaign, onEdit, onDelete }) => (
  <div className="w-[calc(50%-12px)] p-6 bg-[#f6f6f6] rounded-2xl flex-col justify-start items-start gap-[17px] inline-flex">
    <div className="self-stretch justify-between items-center inline-flex">
      <div className="px-6 py-3 bg-[#e0e7f7] rounded-[44px] justify-center items-center gap-2.5 flex">
        <div className="text-[#175eff] text-2xl font-semibold font-['Raleway']">{campaign.name}</div>
      </div>
      <div className="px-4 py-2 bg-white rounded-[58px] justify-start items-start gap-6 flex">
        <button onClick={() => onEdit(campaign)} className="w-6 h-6 justify-center items-center flex">
          <Pencil size={18} />
        </button>
        <button onClick={() => onDelete(campaign.id)} className="w-6 h-6 justify-center items-center flex">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
    <div className="w-full text-[#242424] text-lg font-semibold font-['Raleway'] leading-[25.20px]">
      {campaign.description}
    </div>
  </div>
);

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({ name: '', description: '', opening_line: '' });
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCampaignData();
  }, []);

  const fetchCampaignData = async () => {
    try {
      const response = await fetchCampaigns();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, newCampaign);
      } else {
        await createCampaign(newCampaign);
      }
      setNewCampaign({ name: '', description: '', opening_line: '' });
      setEditingCampaign(null);
      setShowModal(false);
      fetchCampaignData();
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setNewCampaign({ 
      name: campaign.name, 
      description: campaign.description, 
      opening_line: campaign.opening_line 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(id);
        fetchCampaignData();
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-[#242424] text-2xl font-semibold font-['Raleway'] mb-4">Campaigns</h1>
      <div className="flex-grow p-8 bg-white rounded-2xl flex flex-col justify-between">
        <div className="flex-col justify-start items-start gap-6 flex">
          <div className="w-full flex flex-wrap gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            setEditingCampaign(null);
            setNewCampaign({ name: '', description: '', opening_line: '' });
            setShowModal(true);
          }}
          className="h-16 px-12 bg-[#175eff] rounded-2xl justify-center items-center gap-3 inline-flex mt-6 self-end"
        >
          <div className="w-6 h-6 p-0.5 justify-center items-center flex">
            <img className="w-5 h-5" src="/images/Plus.png" alt="Add" />
          </div>
          <div className="text-white text-lg font-medium font-['Raleway']">Create new campaign</div>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-[714px]">
            <h3 className="text-[#242424] text-[32px] font-semibold font-['Raleway'] mb-6">
              {editingCampaign ? 'Edit campaign' : 'Create new campaign'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#242424] text-lg font-semibold font-['Raleway']">Campaign Name:</label>
                <input
                  type="text"
                  placeholder="Enter campaign name"
                  className="w-full h-14 p-4 bg-[#f6f6f6] rounded-[14px] text-[#242424] text-base font-normal font-['Raleway']"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[#242424] text-lg font-semibold font-['Raleway']">Description:</label>
                <textarea
                  placeholder="Enter campaign description"
                  className="w-full h-[120px] p-4 bg-[#f6f6f6] rounded-[14px] text-[#242424] text-base font-normal font-['Raleway'] resize-none"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                ></textarea>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[#242424] text-lg font-semibold font-['Raleway']">Opening Line:</label>
                <textarea
                  placeholder="Enter opening line"
                  className="w-full h-[120px] p-4 bg-[#f6f6f6] rounded-[14px] text-[#242424] text-base font-normal font-['Raleway'] resize-none"
                  value={newCampaign.opening_line}
                  onChange={(e) => setNewCampaign({ ...newCampaign, opening_line: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  className="px-6 py-3 bg-[#f6f6f6] rounded-2xl text-[#242424] text-lg font-semibold font-['Raleway']"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#175eff] rounded-2xl text-white text-lg font-semibold font-['Raleway']"
                >
                  {editingCampaign ? 'Update campaign' : 'Create campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;