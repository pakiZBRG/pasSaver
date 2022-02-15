import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import NavBar from '../components/NavBar';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handleEmailSubmit = e => {
        e.preventDefault();
        if (email === '') {
            toast.warning('Input your email, please.')
        } else {
            axios.post('/auth/forgot-password', { email })
                .then(res => toast.info(res.data.message))
                .catch(err => toast.error(err.response.data.error))
        }
    }

    return (
        <>
            <NavBar />
            <div style={{ minHeight: '93vh' }}>
                <div className='flex-center'>
                    <h1>Password Saver</h1>
                    <p>Input your email to recover your password</p>
                    <form method='POST' onSubmit={handleEmailSubmit}>
                        <input className='email' type='email' placeholder='Your email' onChange={e => setEmail(e.target.value)} />
                        <button type='submit' className='submit'>
                            <span className='tooltip' style={{ width: '10rem' }}>Send recover email</span>
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
