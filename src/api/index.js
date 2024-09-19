import axios from 'axios';
import { API_URL } from '../config';

export const fetchKnowledgeBase = () => axios.get(`${API_URL}/knowledge`);
export const createKnowledgeEntry = (entry) => axios.post(`${API_URL}/knowledge`, entry);
export const updateKnowledgeEntry = (id, entry) => axios.put(`${API_URL}/knowledge/${id}`, entry);
export const deleteKnowledgeEntry = (id) => axios.delete(`${API_URL}/knowledge/${id}`);

export const fetchCampaigns = () => axios.get(`${API_URL}/campaigns`);
export const createCampaign = (campaign) => axios.post(`${API_URL}/campaigns`, campaign);
export const updateCampaign = (id, campaign) => axios.put(`${API_URL}/campaigns/${id}`, campaign);
export const deleteCampaign = (id) => axios.delete(`${API_URL}/campaigns/${id}`);

export const fetchConversations = () => axios.get(`${API_URL}/conversations`);

export const fetchSMSCampaigns = () => axios.get(`${API_URL}/api/campaign/`);
export const createSMSCampaigns =(campaign)=> axios.post(`${API_URL}/api/campaign/`, campaign);
export const uploadCSV = (campaignId, formData) => axios.post(`${API_URL}/api/campaign/${campaignId}/upload-recipients`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
export const cleanRecipients =(campaignId)=> axios.patch(`http://127.0.0.1:5000/api/campaign/${campaignId}/recipients/clean`);
export const sendCampaign = (campaignId, campaignData) => axios.patch(`${API_URL}/api/campaign/${campaignId}`, campaignData);
export const fetchRecipients = (campaignId, pageNumber, pageSize) => axios.get(`${API_URL}/api/campaign/${campaignId}/recipients`, {
      params: { page_number: pageNumber, page_size: pageSize },
    });
export const fetchCampaignRecipients = (campaignId, pageNumber, pageSize) => axios.get(`${API_URL}/api/campaign/${campaignId}/recipients`, {
          params: { page_number: pageNumber, page_size: pageSize },
        });

export const fetchCampaignById = (campaignId) => axios.get(`${API_URL}/api/campaign/${campaignId}`);
export const updateCampaignStatus = (campaignId, updateData) => axios.patch(`${API_URL}/api/campaign/${campaignId}`, updateData);
export const copyCampaign = (campaignId) => axios.post(`${API_URL}/api/campaign/${campaignId}/copy`);
export const updateCampaignStatusDuplicate = (campaignId, status) => axios.patch(`${API_URL}/api/campaign/${campaignId}`, { status });