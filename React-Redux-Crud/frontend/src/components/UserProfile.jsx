import React, { useState, useEffect } from 'react';
import api, { fetchData } from '../api'; // Ensure correct import path for api
import { setUserData } from '../slices/userprofileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "../styles/userprofile.css";

const UserProfile = ({ userId }) => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.userprofile);
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [error, setError] = useState('');
    const Navigate = useNavigate()
    useEffect(() => {
        if (userId) {
            fetchData(userId)
                .then(responseData => {
                    dispatch(setUserData({
                        username: responseData.username,
                        profileImage: responseData.profile_image,
                    }));
                })
                .catch(err => {
                    console.error('Error fetching user data:', err);
                    setError('User not found or an error occurred');
                });
        }
    }, [userId, dispatch]);

    const logout = () => {

        Navigate('/logout'); 
    };

    const handleImageChange = (e) => {
        setNewProfileImage(e.target.files[0]);
    };

    const handleImageUpload = (e) => {
        e.preventDefault();
        setError('');
        if (!newProfileImage) {
            setError('Please select an image to upload');
            return;
        }

        const formData = new FormData();
        formData.append('profile_image', newProfileImage);

        api.put(`/api/user/${userId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            dispatch(setUserData({
                ...userData,
                profileImage: response.data.profile_image
            }));
            setNewProfileImage(null);
            alert('Profile image updated successfully');
        })
        .catch(err => {
            console.error('Error updating profile image:', err);
            setError('Failed to update profile image. Please try again.');
        });
    };

    return (
        <div className="user-profile-card">
            <div className="user-profile-header">
                <h2>{userData.username ? `${userData.username}'s Profile` : 'User Profile'}</h2>
            </div>
            {error && <p className="error-text">{error}</p>}
            <div className="user-profile-content">
                {userData.profileImage ? (
                    <img
                        src={`http://127.0.0.1:8000/${userData.profileImage}`}
                        alt={`${userData.username}'s profile`}
                        className="profile-image"
                    />
                ) : (
                    <p>No profile image available</p>
                )}
                <form onSubmit={handleImageUpload} className="upload-form">
                    <input type="file" onChange={handleImageChange} />
                    <button type="submit" className="upload-button">Update Image</button>
                </form>
                <button onClick={logout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default UserProfile;