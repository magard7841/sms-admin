import React, { useState, useEffect } from 'react';
import { fetchKnowledgeBase, createKnowledgeEntry, updateKnowledgeEntry, deleteKnowledgeEntry } from '../api';
import { Copy, Pencil, Trash2, X } from 'lucide-react';

const KnowledgeBase = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetchKnowledgeBase();
      setEntries(response.data);
      if (response.data.length > 0) {
        setSelectedEntry(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching knowledge base entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEntry) {
        await updateKnowledgeEntry(selectedEntry.id, newEntry);
      } else {
        await createKnowledgeEntry(newEntry);
      }
      setNewEntry({ title: '', content: '' });
      setShowModal(false);
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteKnowledgeEntry(id);
        fetchEntries();
        if (selectedEntry && selectedEntry.id === id) {
          setSelectedEntry(null);
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  return (
    <div className="h-[887px] flex-col justify-start items-start gap-4 inline-flex">
      <h1 className="text-[#242424] text-2xl font-semibold font-['Raleway']">Knowledge Base</h1>
      <div className="flex w-full gap-4">
        {/* Left sidebar */}
        <div className="w-[330px] bg-white rounded-2xl overflow-y-auto border-r border-gray-200 flex flex-col">
          <div className="flex-grow">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-5 cursor-pointer ${
                  selectedEntry && selectedEntry.id === entry.id
                    ? 'bg-[#e0e7f7] border-r-4 border-[#175EFF]'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="text-[#242424] text-lg font-semibold font-['Raleway']">{entry.title}</div>
              </div>
            ))}
          </div>
          <div className="p-6">
            <button
              className="w-full h-16 bg-[#175eff] rounded-2xl flex justify-center items-center gap-3"
              onClick={() => {
                setSelectedEntry(null);
                setNewEntry({ title: '', content: '' });
                setShowModal(true);
              }}
            >
              <div className="w-6 h-6 p-0.5 flex justify-center items-center">
                <img className="w-5 h-5" src="/images/Plus.png" alt="Add" />
              </div>
              <div className="text-white text-lg font-semibold font-['Raleway']">Add a new entry</div>
            </button>
          </div>
        </div>

        {/* Main content */}
        {selectedEntry && (
          <div className="flex-1 flex-col justify-start items-start gap-4 inline-flex">
            <div className="w-full p-8 bg-white rounded-2xl justify-between items-center inline-flex">
              <div className="text-[#242424] text-2xl font-semibold font-['Raleway'] leading-[14.88px]">
                {selectedEntry.title}
              </div>
              <div className="px-[17px] py-3 bg-[#f6f6f6] rounded-[15px] justify-start items-start gap-7 flex">
                <button
                  className="w-6 h-6 justify-center items-center flex"
                  onClick={() => {
                    setNewEntry({ title: selectedEntry.title, content: selectedEntry.content });
                    setShowModal(true);
                  }}
                >
                  <Pencil size={18} />
                </button>
                <button
                  className="w-6 h-6 justify-center items-center flex"
                  onClick={() => handleDelete(selectedEntry.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="self-stretch grow p-8 bg-white rounded-2xl flex-col justify-start items-start gap-6 flex overflow-y-auto">
              <div className="w-full text-[#242424] text-xl font-medium font-['Raleway'] leading-7 whitespace-pre-wrap">
                {selectedEntry.content}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for adding/editing entries */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative h-[639px] p-8 bg-white rounded-2xl flex-col justify-start items-start inline-flex">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-[-60px] right-[-60px] w-16 h-16 bg-[#175eff] rounded-full flex items-center justify-center"
            >
              <X size={24} color="white" />
            </button>

            <h3 className="text-[#242424] text-[32px] font-semibold font-['Raleway']">
              {selectedEntry ? 'Edit entry' : 'Add a new entry'}
            </h3>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex-col justify-start items-start gap-1.5 flex mb-[27px]">
                <label htmlFor="title" className="text-[#242424] text-lg font-semibold font-['Raleway']">
                  Title field:
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter title"
                  className="w-[714px] h-14 p-4 bg-[#f6f6f6] rounded-[14px] text-[#242424] text-base font-normal font-['Raleway'] leading-snug"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                />
              </div>
              <div className="flex-col justify-start items-start gap-1.5 flex mb-[27px]">
                <label htmlFor="content" className="text-[#242424] text-lg font-semibold font-['Raleway']">
                  Text field:
                </label>
                <textarea
                  id="content"
                  placeholder="Enter content"
                  className="w-[714px] h-[282px] p-4 bg-[#f6f6f6] rounded-[14px] text-[#242424] text-base font-normal font-['Raleway'] leading-snug resize-none"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                className="self-stretch h-16 px-5 py-[17px] bg-[#175eff] rounded-2xl justify-center items-center gap-3 inline-flex w-full"
              >
                <div className="w-6 h-6 p-0.5 justify-center items-center flex">
                  <img className="w-5 h-5 opacity-40" src="/images/add-icon.png" alt="Add" />
                </div>
                <div className="text-white text-lg font-semibold font-['Raleway']">
                  {selectedEntry ? 'Update entry' : 'Add new entry'}
                </div>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;