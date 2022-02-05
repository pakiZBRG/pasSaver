import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import OTPInput from '../helpers/OTPInput';
import jwt from 'jsonwebtoken';

export default function Activate() {
    const token = useParams().token;
    const [data, setData] = useState('');

    const now = new Date()
    const seconds = Math.round(now.getTime() / 1000)

    if (jwt.decode(token).exp < seconds) {
        window.location.href = '/?token=expired'
    }

    const handleKeyPass = e => {
        e.preventDefault();
        if (data.trim() === '') {
            toast.warning('Input your keyPass, please.')
        } else {
            axios.post(`/auth/activate/keypass/${token}`, { keyPass: data })
                .then(res => toast.success(res.data.message))
                .catch(err => toast.error(err?.response.data.error));
        }
    }

    useEffect(() => {
        OTPInput();
    }, [])

    const handleEditKey = e => {
        e.preventDefault();
        const data = [];
        for (let c of e.target.children) {
            data.push(c.value)
        }
        if (data.join('').length !== 6) {
            toast.warn('Please input all 6 fields')
        } else {
            axios.post(`/auth/activate/edit-mode/${token}`, { editKey: data.join('') })
                .then(res => {
                    toast.success(res.data.message)
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000);
                })
                .catch(err => toast.error(err?.response.data.error));
        }
    }

    return (
        <>
            <NavBar />
            <div className='flex-center' style={{ minHeight: '86vh' }}>
                <h1>Password Saver</h1>
                <p>Set your unique keyPass. With it you can access all your passwords. It has to have at least 10 characters and both numbers and letters.</p>
                {jwt.decode(token).mode ?
                    <form method='POST' id='editMode' onSubmit={handleEditKey}>
                        <input type='password' className='hide' placeholder='0' maxLength={1} />
                        <input type='password' className='hide' placeholder='0' maxLength={1} />
                        <input type='password' className='hide' placeholder='0' maxLength={1} />
                        <input type='password' className='hide' placeholder='0' maxLength={1} />
                        <input type='password' className='hide' placeholder='0' maxLength={1} />
                        <input type='password' className='hide' placeholder='0' maxLength={1} />

                        <button type='submit' className='submit-right'>
                            <i className='fa fa-arrow-right'></i>
                        </button>
                    </form>
                    :
                    <form method='POST' onSubmit={handleKeyPass}>
                        <input
                            type='password'
                            placeholder='Your keyPass'
                            className='keyPass'
                            onChange={e => setData(e.target.value)}
                        />
                        <button type='submit' className='submit'>
                            <i className='fa fa-arrow-right'></i>
                        </button>
                    </form>
                }
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
