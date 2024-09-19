import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft, FiTrash } from "react-icons/fi";
import SMSCampaigns from "./SMSCampaigns";
import { AiOutlineUpload } from "react-icons/ai";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  cleanRecipients,
  createSMSCampaigns,
  fetchCampaignRecipients,
  sendCampaign,
  uploadCSV,
} from "../api";
import { fetchRecipients as fetchRecipientsAPI } from "../api";

const NewCampaigns = ({ campaignData }) => {
  const [name, setName] = useState(campaignData ? campaignData.name : "");
  const [senders_Name, setSenders_Name] = useState(
    campaignData ? campaignData.senders_name : ""
  );
  const [message, setMessage] = useState(
    campaignData ? campaignData.message : ""
  );
  const [csvFile, setCsvFile] = useState(null);
  const [isCampaignSaved, setIsCampaignSaved] = useState(!!campaignData);
  const [isCsvUploaded, setIsCsvUploaded] = useState(false);
  const fileInputRef = React.useRef(null);
  const [recipients, setRecipients] = useState([]);
  const [showHome2, setShowHome2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSendResult, setShowSendResult] = useState(false);
  const [totalRecipients, setTotalRecipients] = useState(0);
  const [totalDelivered, setTotalDelivered] = useState(0);
  const [totalUndelivered, setTotalUndelivered] = useState(0);
  const [totalQueued, setTotalQueued] = useState(0);
  const [newCampaignId, setNewCampaignId] = useState(null);
  const [campaignStats, setCampaignStats] = useState({
    total_recipients: 0,
    undelivered: 0,
    delivered: 0,
    queued: 0,
  });

  const handleSave = async () => {
    try {
      const response = await createSMSCampaigns({
        name,
        message,
        senders_name: senders_Name,
        status: "draft",
      });
      setNewCampaignId(response.data.campaign_id);
      setIsCampaignSaved(true);
      toast.success("Campaign Saved Successfully");
    } catch (error) {
      toast.error("Failed to save the campaign");
    }
  };

  const handleUploadCSV = (event) => {
    const campaignId = newCampaignId || (campaignData && campaignData.id);
    const file = event.target.files[0];
    setCsvFile(file);
    if (!file || !campaignId) return;
    const formData = new FormData();
    formData.append("file", file);

    uploadCSV(campaignId, formData)
      .then((response) => {
        if (response.status === 201) {
          fetchRecipients();
          setIsCsvUploaded(true);
          toast.success("CSV upload successfully.");
        }
      })
      .catch((error) => console.error("Error uploading CSV", error));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCampaignRecipients(campaignData.id, 1, 10);
        const { total_recipients, undelivered, delivered, queued } =
          response.data;

        setCampaignStats({
          total_recipients,
          undelivered,
          delivered,
          queued,
        });
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };
    fetchData();
    if (
      campaignData &&
      (campaignData.status === "SENT" || campaignData.status === null)
    ) {
      setShowSendResult(true);
    }
  }, [campaignData]);

  useEffect(() => {
    if (isCampaignSaved) {
      fetchRecipients(pageNumber, pageSize);
    }
  }, [pageNumber, isCampaignSaved]);

  const pageSize = 10;

  const fetchRecipients = async (pageNumber) => {
    try {
      const campaignId = newCampaignId || (campaignData && campaignData.id);

      if (!campaignId) {
        console.error("No campaign ID available");
        return;
      }

      const response = await fetchRecipientsAPI(
        campaignId,
        pageNumber,
        pageSize
      );

      const {
        data,
        page_number,
        total_pages,
        total_recipients,
        delivered,
        undelivered,
        queued,
      } = response.data;
      setRecipients(data);
      setPageNumber(page_number);
      setTotalPages(total_pages);
      setTotalRecipients(total_recipients);
      setTotalDelivered(delivered);
      setTotalUndelivered(undelivered);
      setTotalQueued(queued);
    } catch (error) {
      console.error("Error fetching recipients:", error);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      fetchRecipients(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      fetchRecipients(pageNumber - 1);
    }
  };

  const handleCleanRecipients = async () => {
    const campaignId = newCampaignId || (campaignData && campaignData.id);
    try {
      await cleanRecipients(campaignId);
      fetchRecipients();
      setShowModal(false);
      toast.success("Recipients cleaned successfully.");
    } catch (error) {
      console.error("Error cleaning recipients:", error);
    }
  };

  if (showHome2) {
    return <SMSCampaigns />;
  }

  const handleSend = async () => {
    const campaignId = newCampaignId || (campaignData && campaignData.id);
    try {
      await sendCampaign(campaignId, {
        name,
        message,
        senders_name: senders_Name,
        status: "SENT",
      });
      toast.success("Campaign SMS Send Successfully");
      setIsCampaignSaved(true);
      setShowSendResult(true);
    } catch (error) {
      console.error("Error sending campaign", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-5 bg-gray-100">
      <h1 className="text-[#242424] text-2xl font-semibold mb-4 flex items-center cursor-pointer">
        <FiArrowLeft
          className="w-6 h-6 mr-2"
          onClick={() => setShowHome2(true)}
        />
        {showSendResult
          ? "Result"
          : campaignData
          ? "Edit Campaign"
          : "New Campaign"}
      </h1>

      {showSendResult && (
        <div className="mb-3">
          <div className="flex justify-between gap-2">
            <div className="flex-1 bg-white p-5 text-center rounded-lg">
              <p className="text-4xl">{totalRecipients}</p>
              <p>Total Recipients</p>
            </div>
            <div className="flex-1 bg-white p-5 text-center rounded-lg">
              <p className="text-4xl">{totalDelivered}</p>
              <p>Delivered</p>
            </div>
            <div className="flex-1 bg-white p-5 text-center rounded-lg">
              <p className="text-4xl">{totalUndelivered}</p>
              <p>Undelivered</p>
            </div>
            <div className="flex-1 bg-white p-5 text-center rounded-lg">
              <p className="text-4xl">{totalQueued}</p>
              <p>Queued</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 h-full">
        <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg shadow-lg">
          <div className="flex flex-col lg:flex-row justify-between mb-4">
            <div className="flex flex-col w-full lg:w-[48%] mb-4 lg:mb-0">
              <label className="text-md font-medium mb-2">Campaign Name</label>
              <input
                type="text"
                className="rounded-lg p-2 bg-[#F6F6F6] border-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Campaign Name"
              />
            </div>
            <div className="flex flex-col w-full lg:w-[48%]">
              <label className="text-md font-medium mb-2">Sender's Name</label>
              <input
                type="text"
                className="rounded-lg p-2 bg-[#F6F6F6] border-none"
                value={senders_Name}
                onChange={(e) => setSenders_Name(e.target.value)}
                placeholder="Enter Sender's Name"
              />
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-md font-medium mb-2">Text Message</label>
            <textarea
              className="rounded-lg p-2 bg-[#F6F6F6] border-none h-24"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter the campaign message"
            />
            <div className="text-sm text-gray-500 mt-2 text-right">
              Characters: {message.length}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                if (campaignData || newCampaignId) {
                  handleSend();
                } else {
                  handleSave();
                }
              }}
              className={`px-6 py-2 text-white rounded-lg ${
                (campaignData && campaignData.status === "SENT") ||
                showSendResult
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
              }`}
              disabled={
                (campaignData && campaignData.status === "SENT") ||
                showSendResult
              }
            >
              {isCsvUploaded ? "Send" : "Save"}
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-white p-2 rounded-lg shadow-lg relative">
          {/* <p>Recipients can only be uploaded after saving the campaign.</p> */}

          <h3 className="text-lg font-semibold mt-1 mb-2">Recipients</h3>

          <input
            type="file"
            accept=".csv"
            onChange={handleUploadCSV}
            ref={fileInputRef}
            style={{ display: "none" }}
            disabled={!isCampaignSaved}
          />

          <button
            onClick={() => fileInputRef.current.click()}
            className={`absolute top-2 right-4 text-blue-500 px-4 py-2 rounded-lg flex items-center ${
              !isCampaignSaved || showSendResult
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!isCampaignSaved || showSendResult}
          >
            <AiOutlineUpload className="mr-2" />
            Upload CSV
          </button>

          <div className="overflow-x-auto" style={{ height: "470px" }}>
            <div className="flex justify-between items-center ">
              {totalRecipients > 0 && (
                <p className="text-lg text-red-600">
                  You have already uploaded {totalRecipients} recipients.
                </p>
              )}
            </div>

            <table className="w-full divide-y divide-gray-200 mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    style={{ backgroundColor: "#CCCCCC" }}
                    className="py-2 text-center"
                  >
                    Phone
                  </th>
                  <th
                    style={{ backgroundColor: "#CCCCCC" }}
                    className="py-2 text-center"
                  >
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {recipients.length > 0 ? (
                  recipients.map((recipient, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? "" : "#E0E0E0",
                      }}
                    >
                      <td className="py-2 text-center">
                        {recipient.mobile_number}
                      </td>
                      <td className="py-2 text-center">{recipient.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="py-2 text-center">
                      No recipients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{ height: "40px" }}
            className="flex justify-between items-center mb-4  mt-2 bg-gray-100"
          >
            <div className="flex items-center space-x-4 ml-7">
              {/* Previous Page Button with Arrow */}
              <button
                onClick={handlePreviousPage}
                className={`bg-gray-200 text-gray-700 rounded-lg ${
                  pageNumber === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={pageNumber === 1}
              >
                <AiOutlineLeft size={20} />
              </button>

              <div className="text-gray-700">
                Page {pageNumber} of {totalPages}
              </div>

              <button
                onClick={handleNextPage}
                className={`bg-gray-200 text-gray-700 rounded-lg ${
                  pageNumber === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={pageNumber === totalPages}
              >
                <AiOutlineRight size={20} />
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center text-red-700 mr-9 hover:text-black"
            >
              <FiTrash className="mr-2" size={20} />
              Clean all recipients
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Clean Table</h2>
                <p className="my-4">
                  Are you about to clean the table, please confirm everything is
                  good to go !
                </p>
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded-lg flex items-center"
                  >
                    <FiArrowLeft className="w-6 h-6 mr-2" />
                    No, go back
                  </button>
                  <button
                    onClick={handleCleanRecipients}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Yes, Clean
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCampaigns;
