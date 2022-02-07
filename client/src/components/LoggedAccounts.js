import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScrollContainer from 'react-indiana-drag-scroll'
import { authenticate, isAuth } from '../helpers/auth';

export default function LoggedAccounts() {
  const [loggedUsers, setLoggedUsers] = useState();
  const [userToLogin, setUserToLogin] = useState();
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
    getLoggedUsers();
    if (userToLogin) {
      loginUser();
    }
  }, [userToLogin]);

  const loginUser = async () => {
    try {
      const login = await axios.get(`/auth/login-saved/${userToLogin}`)
      if (login) {
        authenticate(login);
        if (isAuth()) {
          window.location.href = '/collections';
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

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
            <div onClick={() => setUserToLogin(user.email)}>{user.email}</div>
          ))}
        </ScrollContainer>
      </>
      }
    </div>
  );
}
