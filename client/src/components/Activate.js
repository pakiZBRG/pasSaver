import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';
import jwt from 'jsonwebtoken';

export default function Activate() {
    const token = useParams().token;
    const [keyPass, setKeyPass] = useState('');

    const now = new Date()  
    const seconds = Math.round(now.getTime() / 1000)

    if(jwt.decode(token).exp < seconds) {
        window.location.href = '/?token=expired'
    }

    const handleForm = e => {
        e.preventDefault();
        if(keyPass.trim() === '') {
            toast.warning('Input your keyPass, please.')
        } else {
            axios.post(`http://localhost:5000/auth/activate/${token}`, { keyPass: keyPass })
                .then(res => toast.success(res.data.message))
                .catch(err => toast.error(err?.response.data.error));
        }
    }

    return (
        <>
            <ToastContainer/>
            <NavBar/>
            <div className='flex-center'>
                <h1>Password Saver</h1>
                <p>Set your unique keyPass. With it you can access all your passwords. It has to have at least 10 characters and both numbers and letters.</p>
                <form method='POST' onSubmit={handleForm}>
                    <input type='text' placeholder='Your keyPass' onChange={e => setKeyPass(e.target.value)}/>
                    <button type='submit'>
                        <i className='fa fa-arrow-right'></i>
                    </button>
                </form>
            </div>
            <div className='flex-links'>
                <a target='_blanc' href='https://github.com/pakiZBRG'>
                    <i className='fa fa-github'></i>
                </a>
                <a target='_blanc' href='https://github.com/pakiZBRG/pasSaver'>
                    <i className='fa fa-code'></i>
                </a>
            </div>
            <p className='maker'>pakiZBRG</p>
        </>
    )
}
