import api from '../api';
import { ACCESS_TOKEN } from '../constants';

export const adminLogin = async (username, password) => {
    try {
        const response = await api.post('/api/admin/login/', {
            username,
            password,
        });

        localStorage.setItem(ACCESS_TOKEN, response.data.access);


        return {
            isSuperuser: response.data.isSuperuser,
            isActive: response.data.isActive,
        };
    } catch (error) {
        console.error('Admin login failed:', error);
        throw error; 
    }
};
