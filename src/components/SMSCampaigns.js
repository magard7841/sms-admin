import React, { useState, useEffect } from "react";
import NewCampaigns from "./NewCampaigns";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faCopy,
  faEye,
  faTrash,
  faPaperPlane,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { FiArrowLeft } from "react-icons/fi";
import Tooltip from "@mui/material/Tooltip";

const SMSCampaigns = () => {
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [campaignToEdit, setCampaignToEdit] = useState(null);
  const [showSendPopup, setShowSendPopup] = useState(false);
  const [campaignToSend, setCampaignToSend] = useState(null);

  const handleSendClick = (id) => {
    setCampaignToSend(id);
    setShowSendPopup(true);
  };

  const handleCloseSendPopup = () => {
    setShowSendPopup(false);
    setCampaignToSend(null);
  };
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleShowModal = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/campaign/${campaignToSend}/details`
      );
      setModalData(response.data); // Set the data to display in the modal
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
    } finally {
      setShowSendPopup(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/campaign/");
        setCampaigns(response.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCreateCampaign = () => {
    setIsCreatingCampaign(true);
    setCampaignToEdit(null);
  };

  const handleEdit = (id) => {
    const selectedCampaign = campaigns.find((campaign) => campaign.id === id);
    setCampaignToEdit(selectedCampaign); // Set the campaign to edit
    setIsCreatingCampaign(true); // Switch to the NewCampaigns view
  };

  const handleDuplicate = (id) => {
    console.log(`Duplicate campaign with ID: ${id}`);
  };

  const handleView = (id) => {
    console.log(`View campaign with ID: ${id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:5000/api/campaign/${campaignToDelete}`
      );
      setCampaigns(
        campaigns.filter((campaign) => campaign.id !== campaignToDelete)
      );
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert("Failed to delete the campaign.");
    } finally {
      setShowDeletePopup(false);
    }
  };

  const handleOpenDeletePopup = (id) => {
    setCampaignToDelete(id);
    setShowDeletePopup(true);
  };

  const handleCloseDeletePopup = () => {
    setShowDeletePopup(false);
    setCampaignToDelete(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleClean = async (campaignId) => {
    try {
      const url = `http://127.0.0.1:5000/api/campaign/${campaignId}/recipients/clean`;
      await axios.patch(url);
      console.log("Recipients cleaned successfully!");
      // You can also update the state or perform other actions after the API call
    } catch (error) {
      console.error("Error cleaning recipients:", error);
    }
  };
  return (
    <div className="flex flex-col h-full">
      {!isCreatingCampaign ? (
        <>
          <h1 className="text-[#242424] text-2xl font-semibold font-['Raleway'] mb-4">
            SMS Campaigns
          </h1>
          {campaigns.length === 0 ? (
            <div className="flex-grow p-8 bg-white rounded-2xl flex flex-col justify-center items-center">
              <img
                className="w-14 h-12 mb-8"
                src="/images/Scanner.jpeg"
                alt="No Campaigns"
              />
              <p className="text-[#242424] text-lg mb-8">
                There's nothing to see. There are no campaigns yet!
              </p>
              <button
                onClick={handleCreateCampaign}
                className="h-16 px-12 bg-[#175eff] rounded-2xl flex justify-center items-center gap-3"
              >
                <div className="w-6 h-6 p-0.5 flex justify-center items-center">
                  <img className="w-5 h-5" src="/images/Plus.png" alt="Add" />
                </div>
                <div className="text-white text-lg font-medium font-['Raleway']">
                  Create your first SMS campaign
                </div>
              </button>
            </div>
          ) : (
            <div className="flex-grow p-8 bg-white rounded-2xl relative overflow-x-auto">
              <table className="min-w-full table-auto ">
                <thead
                  style={{ backgroundColor: "#F6F6F6" }}
                  className="rounded-2xl"
                >
                  <tr>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Campaign Name</th>
                    <th className="text-left p-3">Sender Name</th>
                    <th className="text-left p-3">Message</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Recipients</th>
                    <th className="text-left p-3">Delivered</th>
                    <th className="text-left p-3">Opened</th>
                    <th className="text-left p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                      }}
                    >
                      <td className="p-2">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2">{campaign.name}</td>
                      <td className="p-2">{campaign.senders_name}</td>
                      <td className="p-2">{campaign.message}</td>
                      <td className="p-2">{campaign.status}</td>
                      <td className="p-2">{campaign.recipients}</td>
                      <td className="p-2">{campaign.delivered || "-"}</td>
                      <td className="p-2">{campaign.opened || "-"}</td>
                      <td className="p-2 flex gap-2">
                        <Tooltip title="Edit" placement="top" arrow>
                          <FontAwesomeIcon
                            icon={faPen}
                            className="w-4 h-3 text-blue-400 cursor-pointer"
                            onClick={() => handleEdit(campaign.id)}
                          />
                        </Tooltip>
                        <Tooltip title="Duplicate" placement="top" arrow>
                          <FontAwesomeIcon
                            icon={faCopy}
                            className="w-4 h-3 text-green-500 cursor-pointer"
                            onClick={() => handleDuplicate(campaign.id)}
                          />
                        </Tooltip>
                        <Tooltip title="View" placement="top" arrow>
                          <FontAwesomeIcon
                            icon={faEye}
                            className="w-4 h-3 text-purple-500 cursor-pointer"
                            onClick={() => handleView(campaign.id)}
                          />
                        </Tooltip>
                        <Tooltip title="Delete" placement="top" arrow>
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="w-4 h-3 text-red-500 cursor-pointer"
                            onClick={() => handleOpenDeletePopup(campaign.id)}
                          />
                        </Tooltip>
                        <Tooltip title="Clean" placement="top" arrow>
                          <FontAwesomeIcon
                            icon={faEraser}
                            className="w-4 h-3 text-yellow-500 cursor-pointer"
                            onClick={() => handleClean(campaign.id)}
                          />
                        </Tooltip>
                        <Tooltip title="Send" placement="top" arrow>
                          <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="w-4 h-3 text-green-500 cursor-pointer"
                            onClick={() => handleSendClick(campaign.id)}
                          />
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="absolute right-8 bottom-8">
                <button
                  onClick={handleCreateCampaign}
                  className="h-10 px-6 bg-[#175eff] rounded-lg text-white"
                >
                  Create New Campaign
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <NewCampaigns campaignData={campaignToEdit} />
      )}

      {showSendPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 " style={{ width: "550px" }}>
            <h2 className="text-xl font-semibold mb-4">
              Send your SMS Campaign
            </h2>
            <p className="mb-6">
              Your about to send this SMS Campaigns Before we send your SMS
              Campaign, please confirm everything is good to go!
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleCloseSendPopup}
                className="bg-gray-300 px-4 py-2 rounded-lg flex items-center"
              >
                {" "}
                <FiArrowLeft className="w-6 h-6 mr-2 " />
                No, go back
              </button>
              <button
                onClick={handleShowModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Yes, Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Show Data */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>
            <p className="mb-6">Details of the campaign:</p>
            <pre>{JSON.stringify(modalData, null, 2)}</pre>
            <button
              onClick={handleCloseModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Delete SMS Campaign</h2>
            <p className="mb-6">
              You are about to delete the SMS Campaign, please confirm
              everything is good before go!
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleCloseDeletePopup}
                className="bg-gray-300 px-4 py-2 rounded-lg  flex items-center"
              >
                <FiArrowLeft className="w-6 h-6 mr-2" />
                No, go back
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMSCampaigns;
