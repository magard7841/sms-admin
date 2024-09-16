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