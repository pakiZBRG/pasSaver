import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import NavBar from '../components/NavBar';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handleEmailSubmit = e => {
        e.preventDefault();
        if (email.trim() === '') {
            toast.warning('Input your email, please.')
        } else {
            axios.post('http://localhost:5000/auth/forgot-password', { email })
                .then(res => toast.info(res.data.message))
                .catch(err => toast.error(err.response.data.error))
        }
    }

    return (
        <>
            <ToastContainer theme='colored' />
            <NavBar />
            <div style={{ minHeight: '93vh' }}>
                <div className='flex-center'>
                    <h1>Password Saver</h1>
                    <p>Recover your password</p>
                    <form method='POST' onSubmit={handleEmailSubmit}>
                        <input type='email' placeholder='Your email' onChange={e => setEmail(e.target.value)} />
                        <button type='submit' className='submit'>
                            <i className="fa fa-envelope"></i>
                        </button>
                    </form>
                </div>
            </div>
            <div className='flex-links'>
                <div>
                    <a target='_blanc' href='https://github.com/pakiZBRG'>
                        <i className='fa fa-github'></i>
                    </a>
                    <a target='_blanc' href='https://github.com/pakiZBRG/pasSaver'>
                        <i className='fa fa-code'></i>
                    </a>
                </div>
                <p className='maker'>pakiZBRG</p>
            </div>
        </>
    )
}
