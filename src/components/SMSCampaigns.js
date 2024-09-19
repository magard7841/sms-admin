import React, { useState, useEffect } from "react";
import NewCampaigns from "./NewCampaigns";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  faPen,
  faCopy,
  faTrash,
  faPaperPlane,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { FiArrowLeft } from "react-icons/fi";
import Tooltip from "@mui/material/Tooltip";
import {
  copyCampaign,
  fetchCampaignById,
  fetchSMSCampaigns,
  updateCampaignStatusDuplicate,
} from "../api";
import { API_URL } from "../config";

const SMSCampaigns = () => {
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [campaignToEdit, setCampaignToEdit] = useState(null);
  const [campaignStatus, setCampaignStatus] = useState(null);
  const [showSendPopup, setShowSendPopup] = useState(false);
  const [campaignToSend, setCampaignToSend] = useState(null);
  const [showCleanPopup, setShowCleanPopup] = useState(false);
  const [campaignToClean, setCampaignToClean] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetchSMSCampaigns();
        setCampaigns(response.data);
      } catch (error) {
        toast.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [refresh]);

  const handleCleanClick = (id) => {
    setCampaignToClean(id);
    setShowCleanPopup(true);
  };
  const handleCloseCleanPopup = () => {
    setShowCleanPopup(false);
    setCampaignToClean(null);
  };

  const handleSendClick = (id) => {
    setCampaignToSend(id);
    setShowSendPopup(true);
  };

  const handleCloseSendPopup = () => {
    setShowSendPopup(false);
    setCampaignToSend(null);
  };

  const handleOpenDeletePopup = (id) => {
    setCampaignToDelete(id);
    setShowDeletePopup(true);
  };

  const handleCloseDeletePopup = () => {
    setShowDeletePopup(false);
    setCampaignToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const handleCreateCampaign = () => {
    setIsCreatingCampaign(true);
    setCampaignToEdit(null);
  };

  const handleEdit = (id) => {
    const selectedCampaign = campaigns.find((campaign) => campaign.id === id);

    setCampaignToEdit({
      ...selectedCampaign,
      status: selectedCampaign.status,
    });
    setCampaignStatus({
      ...selectedCampaign.status,
    });

    setIsCreatingCampaign(true);
  };

  const handleDuplicate = async (id) => {
    try {
      const selectedCampaign = campaigns.find((campaign) => campaign.id === id);

      if (selectedCampaign) {
        const response = await copyCampaign(id);

        if (response.status === 201) {
          const newCampaignId = response.data.campaign_id;

          await updateCampaignStatusDuplicate(newCampaignId, "DRAFT");

          setRefresh((prev) => !prev);
          toast.success("Duplicate Campaign Created");
        }
      } else {
        toast.error("Campaign not found");
      }
    } catch (error) {
      toast.error("Error duplicating campaign:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/campaign/${campaignToDelete}`);
      setCampaigns(
        campaigns.filter((campaign) => campaign.id !== campaignToDelete)
      );
      toast.success("Capaigns Deleted")
    } catch (error) {
      toast.error("Error deleting campaign:", error);
    
    } finally {
      setShowDeletePopup(false);
    }
  };

  const handleConfirmClean = async () => {
    try {
      const url = `${API_URL}/api/campaign/${campaignToClean}/recipients/clean`;
      await axios.patch(url);
      
      toast.success("Recipients cleaned successfully!");
    } catch (error) {
      toast.error("Error cleaning recipients:", error);
    } finally {
      setShowCleanPopup(false);
      setCampaignToClean(null);
    }
  };

  const handleShowModal = async () => {
    if (campaignToSend) {
      try {
        const campaignResponse = await fetchCampaignById(campaignToSend);
        const { name, senders_name } = campaignResponse.data;
        const url = `${API_URL}/api/campaign/${campaignToSend}`;

        await axios.patch(url, {
          status: "SENT",
          name,
          senders_name,
        });
        toast.success("Campaign sent successfully!")
        setRefresh((prev) => !prev);
      } catch (error) {
        toast.error("Error sending campaign:");
      } finally {
        setShowSendPopup(false);
        setCampaignToSend(null);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
            <div className="flex-grow bg-white rounded-2xl relative">
              <div className="overflow-x-auto" style={{ maxHeight: "570px" }}>
                <table className="min-w-full table-auto ">
                  <thead
                    style={{ backgroundColor: "#CCCCCC" }}
                    className="rounded-2xl"
                  >
                    <tr>
                      <th className="text-center p-3">Date</th>
                      <th className="text-center p-3">Campaign Name</th>
                      <th className="text-center p-3">Sender Name</th>
                      <th className="text-center p-3">Message</th>
                      <th className="text-center p-3">Status</th>
                      <th className="text-center p-3">Recipients</th>
                      <th className="text-center p-3">Delivered</th>
                      <th className="text-center p-3">Queued</th>
                      <th className="text-center p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign, index) => (
                      <tr
                        key={campaign.id}
                        style={{
                          backgroundColor: index % 2 === 0 ? "" : "#E0E0E0",
                        }}
                      >
                        <td className="text-center p-2">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </td>
                        <td className="text-center p-2">
                          <TruncatedText text={campaign.name} maxLength={15} />
                        </td>
                        <td className="text-center p-2">
                          {campaign.senders_name}
                        </td>
                        <td className="text-center p-2">
                          <TruncatedText
                            text={campaign.message}
                            maxLength={15}
                          />
                        </td>
                        <td className="text-center p-2">{campaign.status}</td>
                        <td className="text-center p-2">
                          {campaign.recipients || "0"}
                        </td>
                        <td className="text-center p-2">
                          {campaign.delivered || "0"}
                        </td>
                        <td className="text-center p-2">
                          {campaign.opened || "0"}
                        </td>
                        <td className="text-center p-2 flex gap-2">
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
                              onClick={() => handleCleanClick(campaign.id)}
                            />
                          </Tooltip>

                          <Tooltip title="Send" placement="top" arrow>
                            <FontAwesomeIcon
                              icon={faPaperPlane}
                              className={`w-4 h-3 ${
                                campaign.status === "SENT"
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-green-500 cursor-pointer"
                              }`}
                              onClick={() => {
                                if (campaign.status !== "SENT") {
                                  handleSendClick(campaign.id);
                                }
                              }}
                              disabled={campaign.status === "SENT"}
                            />
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="fixed bottom-12 right-20">
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
        <NewCampaigns
          campaignData={campaignToEdit}
          campaignData1={campaignStatus}
        />
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
      {showCleanPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Clean Recipients</h2>
            <p className="mb-6">
              Are you sure you want to clean the recipients for this campaign?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleCloseCleanPopup}
                className="bg-gray-300 px-4 py-2 rounded-lg flex items-center"
              >
                <FiArrowLeft className="w-6 h-6 mr-2" />
                No, go back
              </button>

              <button
                onClick={handleConfirmClean}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yes, Clean
              </button>
            </div>
          </div>
        </div>
      )}
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

const TruncatedText = ({ text, maxLength = 100 }) => {
  const truncatedText =
    text.length > maxLength ? text.substr(0, maxLength) + "..." : text;

  return (
    <div className="group relative">
      <div className="max-w-xs overflow-hidden">{truncatedText}</div>
      {text.length > maxLength && (
        <div className="absolute z-10 invisible group-hover:visible bg-gray-600 text-white p-2 rounded shadow-lg mt-2 text-sm w-72">
          {text}
        </div>
      )}
    </div>
  );
};
