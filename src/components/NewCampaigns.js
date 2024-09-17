import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowLeft, FiTrash } from "react-icons/fi";
import SMSCampaigns from "./SMSCampaigns";
import { AiOutlineUpload } from "react-icons/ai";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

const NewCampaigns = ({ campaignData }) => {
  const [name, setName] = useState(campaignData ? campaignData.name : "");
  const [senders_Name, setSenders_Name] = useState(
    campaignData ? campaignData.senders_name : ""
  );
  const [message, setMessage] = useState(
    campaignData ? campaignData.message : ""
  );
  const [csvFile, setCsvFile] = useState(null);
  const fileInputRef = React.useRef(null);
  const [recipients, setRecipients] = useState([]);
  const [showHome2, setShowHome2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSendResult, setShowSendResult] = useState(false);
  const [totalRecipients, setTotalRecipients] = useState(0);

const [campaignMetrics, setCampaignMetrics] = useState({
  totalRecipients: 0,
  delivered: 0,
  unreachable: 0,
  opened: 0,
});


  useEffect(() => {
    fetchRecipients(pageNumber, pageSize);
  }, [pageNumber]);
  const pageSize = 10;
  const fetchRecipients = async (pageNumber) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/campaign/${campaignData.id}/recipients`,
        {
          params: { page_number: pageNumber, page_size: pageSize },
        }
      );

      const { data, page_number, total_pages, total_recipients } =
        response.data;
      setRecipients(data);
      setPageNumber(page_number);
      setTotalPages(total_pages);
      setTotalRecipients(total_recipients);
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

  const handleUploadCSV = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(
        `http://localhost:5000/api/campaign/${campaignData.id}/upload-recipients`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(() => fetchRecipients())
      .catch((error) => console.error("Error uploading CSV", error));
  };

  const handleSave = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/api/campaign/", {
        name,
        message,
        senders_name: senders_Name,
        status: "draft",
      });
      setShowHome2(true);
    } catch (error) {
      console.error("Error saving campaign", error);
    }
  };

  const handleCleanRecipients = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:5000/api/campaign/${campaignData.id}/recipients/clean`
      );
      fetchRecipients();
      setShowModal(false);
    } catch (error) {
      console.error("Error cleaning recipients:", error);
    }
  };

  if (showHome2) {
    return <SMSCampaigns />;
  }

  const handleSend = async () => {
    try {
      // Perform sending action
      await axios.patch(
        `http://127.0.0.1:5000/api/campaign/${campaignData.id}`,
        {
          name,
          message,
          senders_name: senders_Name,
          status: "sent",
        }
      );
      // Show thank you modal
      // setShowThankYouModal(true);
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
        {campaignData ? "Edit Campaign" : "New Campaign"}
      </h1>

      {showSendResult && (
        <div className=" mb-3 ">
          <h1 style={{ height: "20px" }}> Result</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div
              style={{
                flex: "1",
                backgroundColor: "white",
                padding: "20px",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <h3>961</h3>
              <p>Total Recipients</p>
            </div>
            <div
              style={{
                flex: "1",
                backgroundColor: "white",
                padding: "20px",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <p>Delivered</p>
            </div>
            <div
              style={{
                flex: "1",
                backgroundColor: "white",
                padding: "20px",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <p>Unreachable</p>
            </div>
            <div
              style={{
                flex: "1",
                backgroundColor: "white",
                padding: "20px",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <p>Opened</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 h-full">
        <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg shadow-lg">
          {/* Form to edit campaign details */}
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

          {/* Text Message */}
          <div className="flex flex-col mb-4">
            <label className="text-md font-medium mb-2">Text Message</label>
            <textarea
              className="rounded-lg p-2 bg-[#F6F6F6] border-none h-24"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter the campaign message"
            />
          </div>

          <div className="text-sm text-gray-500 mt-2 ">
            Characters: {message.length}
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              // onClick={handleSave}
              onClick={() => {
                if (campaignData) {
                  // If `campaignData` exists, call a different function
                  handleSend(); // Define this function separately for the "Send" action
                  // alert('There is HandleSave')
                } else {
                  // Otherwise, call the `handleSave` function
                  handleSave();
                }
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              {campaignData ? "Send" : "Save"}
            </button>
          </div>
        </div>

        {/* Recipients list */}
        <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg shadow-lg relative">
          <h3 className="text-lg font-semibold mb-4">Recipients</h3>

          {/* File input for CSV upload */}
          <input
            type="file"
            accept=".csv"
            onChange={handleUploadCSV}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          {/* Upload CSV Button */}
          <button
            onClick={() => fileInputRef.current.click()}
            className={`absolute top-4 right-4 text-blue-500 px-4 py-2 rounded-lg flex items-center ${
              campaignData ? "" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!campaignData}
          >
            <AiOutlineUpload className="mr-2" />
            Upload CSV
          </button>

          {/* Table for displaying recipients */}
          <div className="overflow-x-auto" style={{ height: "470px" }}>
            {/* Display the total number of recipients */}
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
                  <th className="py-2 text-center">Phone</th>
                  <th className="py-2 text-center">Name</th>
                </tr>
              </thead>
              <tbody>
                {recipients.length > 0 ? (
                  recipients.map((recipient, index) => (
                    <tr key={index}>
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
            {/* Pagination Controls */}
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

              {/* Page Number Display */}
              <div className="text-gray-700">
                Page {pageNumber} of {totalPages}
              </div>

              {/* Next Page Button with Arrow */}
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
            {/* Clean Table Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center text-red-700 mr-9 hover:text-black"
            >
              <FiTrash className="mr-2" size={20} />
              Clean table
            </button>
          </div>

          {/* Modal for confirmation */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Clean Table</h2>
                <p className="my-4">
                  Are you about to clean the table, please confirm everything is
                  good to go !
                </p>
                <div className="flex justify-between items-center mb-4">
                  {/* Button aligned to the start */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded-lg flex items-center"
                  >
                    <FiArrowLeft className="w-6 h-6 mr-2" />
                    No, go back
                  </button>
                  {/* Button aligned to the end */}
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
