import React, { useState, useEffect } from "react";

const EditCampaign = ({ selectedCampaignData }) => {
  const [formData, setFormData] = useState({
    campaignName: "",
    senderName: "",
    message: "",
    recipients: "",
  });

  // Prefill form if selectedCampaignData is available
  useEffect(() => {
    if (selectedCampaignData) {
      setFormData({
        campaignName: selectedCampaignData.name,
        senderName: selectedCampaignData.senders_name,
        message: selectedCampaignData.message,
        recipients: selectedCampaignData.recipients.join(", "), // Assuming recipients is an array
      });
    }
  }, [selectedCampaignData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post form data to the server
      // If editing, send a PUT request with the campaign ID, else POST to create new
      console.log("Form submitted with data: ", formData);
    } catch (error) {
      console.error("Error submitting campaign:", error);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{selectedCampaignData ? "Edit Campaign" : "Create Campaign"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Campaign Name</label>
          <input
            type="text"
            name="campaignName"
            value={formData.campaignName}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Sender Name</label>
          <input
            type="text"
            name="senderName"
            value={formData.senderName}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Recipients</label>
          <input
            type="text"
            name="recipients"
            value={formData.recipients}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          {selectedCampaignData ? "Update Campaign" : "Create Campaign"}
        </button>
      </form>
    </div>
  );
};

export default EditCampaign;
