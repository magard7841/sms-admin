import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowLeft, FiTrash } from "react-icons/fi";
import SMSCampaigns from "./SMSCampaigns";
import { AiOutlineUpload } from "react-icons/ai";


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
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showHome2, setShowHome2] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRecipients(pageNumber, pageSize);
  }, [pageNumber]);

  const pageSize = 10;
  const fetchRecipients = async (pageNumber, pageSize) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/campaign/${campaignData.id}/recipients`,
        {
            params: { page_number: pageNumber, page_size: 10 },
        }
      );

      const { data, page_number, page_size, total_count } = response.data;
      setRecipients(data);
      setPageNumber(page_number);
      setTotalPages(Math.ceil(total_count / page_size));
      setTotalCount(total_count);
    } catch (error) {
      console.error("Error fetching recipients:", error);
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

  return (
    <div className="flex flex-col h-full p-5 bg-gray-100">
    <h1 className="text-[#242424] text-2xl font-semibold mb-4 flex items-center cursor-pointer">
      <FiArrowLeft
        className="w-6 h-6 mr-2"
        onClick={() => setShowHome2(true)}
      />
      {campaignData ? "Edit Campaign" : "New Campaign"}
    </h1>

    <div className="flex space-x-4 h-full">
      <div className="w-1/2 bg-white p-5 rounded-lg shadow-lg">
        {/* Form to edit campaign details */}
        <div className="flex justify-between mb-4">
          <div className="flex flex-col w-[48%]">
            <label className="text-md font-medium mb-2">Campaign Name</label>
            <input
              type="text"
              className="rounded-lg p-2 bg-[#F6F6F6] border-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Campaign Name"
            />
          </div>
          <div className="flex flex-col w-[48%]">
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
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
          >
            {campaignData ? "Send" : "Save"}
          </button>
        </div>
      </div>

      {/* Recipients list */}
      <div className="w-1/2 bg-white p-5 rounded-lg shadow-lg relative">
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
        <div style={{ height: "470px" }}>
          <table className="w-full divide-y divide-gray-200 mt-6">
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

        {/* Clean button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FiTrash className="mr-2" size={20} />
            Clean table
          </button>
        </div>

        {/* Modal for confirmation */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Clean Table</h2>
              <p className="my-4">
                Are you sure you want to clean the table? Please confirm!
              </p>
              <div className="flex justify-end space-x-4">
                <button
                //   onClick={() => setShowModal(false)}
                  className="bg-gray-100 px-4 py-2 rounded-lg flex items-center"
                >
                  <FiArrowLeft className="w-6 h-6 mr-2" />
                  No, go back
                </button>
                <button
                  onClick={handleCleanRecipients}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Yes, clean it
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
