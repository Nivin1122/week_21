import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
const HomePage = () => {

  const [userId, setUserId] = useState(null);

  useEffect(() => {
      const id = localStorage.getItem('user_id');
      if (id) {
          setUserId(id);
          
      }
  }, []);

    return (
        <div>
            <UserProfile userId={userId} />
        </div>
  );
};


export default HomePage;