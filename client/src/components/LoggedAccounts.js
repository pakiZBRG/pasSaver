import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScrollContainer from 'react-indiana-drag-scroll'

export default function LoggedAccounts({ setLogin }) {
  const [loggedUsers, setLoggedUsers] = useState();
  const savedUsers = localStorage.getItem('savedUsers');

  const getLoggedUsers = async () => {
    try {
      const users = await axios.post('/auth/logged-users', { users: JSON.parse(savedUsers) });
      setLoggedUsers(users.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    if(JSON.parse(savedUsers)) getLoggedUsers();
  }, []);

  const clearLoggedUsers = () => {
    localStorage.removeItem('savedUsers')
    window.location.reload();
  }

  return (
    <div className='loggedUsers'>
      {loggedUsers?.length && 
      <>
        <span>all logged sessions</span>
        <p onClick={() => clearLoggedUsers()}>clear</p>
        <ScrollContainer hideScrollbars={false} className='loggedUsers-flex'>
          {loggedUsers?.map(user => (
            <div key={user._id} onClick={() => setLogin({email: user.email})}>{user.email}</div>
          ))}
        </ScrollContainer>
      </>
      }
    </div>
  );
}
