import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import jwt from 'jsonwebtoken';

export default function ResetPassword() {
    const token = useParams().token;
    const [data, setData] = useState('');

    const handleChange = text => e => setData({ ...data, [text]: e.target.value });

    const now = new Date()
    const seconds = Math.round(now.getTime() / 1000);

    if (jwt.decode(token).exp < seconds) {
        window.location.href = '/?token=expired'
    }

    const handleResetPassword = e => {
        e.preventDefault();
        if (!data.password && !data.confirmPassword) {
            toast.warning('Please fill the fields')
        } else if (data.password !== data.confirmPassword) {
            toast.warning('Password need to match')
        } else {
            axios.post('http://localhost:5000/auth/reset-password', { password: data.password, email: jwt.decode(token).email })
                .then(res => toast.success(res.data.message))
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
                    <p>Setup new password and confirm it</p>
                    <form method='POST' onSubmit={handleResetPassword} className='reset-form'>
                        <div className='form-input'>
                            <label>Password</label>
                            <input type='password' placeholder='Your password' onChange={handleChange('password')} />
                        </div>
                        <div className='form-input'>
                            <label>Confirm Password</label>
                            <input type='password' placeholder='Confirm your password' onChange={handleChange('confirmPassword')} />
                        </div>
                        <button type='submit'>Reset password</button>
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
