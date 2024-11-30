import axios from 'axios';
import { ACCESS_TOKEN  } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token){
            config.headers.Authorization = `Bearer ${token }`
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
        
    }
) 

export const fetchUserData = async () => {
    const response = await api.get('/api/user/'); 
    return response.data;
};


export const fetchData = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    
    const response = await api.get(`/api/user/${userId}/`); 
    return response.data;
};

export default api