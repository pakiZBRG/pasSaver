import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import OTPInput from '../helpers/OTPInput';
import NavBar from '../components/NavBar';
import jwt from 'jsonwebtoken';

export default function RecoverEditKey() {
    const token = useParams().token;

    useEffect(() => {
        OTPInput();
    }, [])

    const resetEditKey = e => {
        e.preventDefault();
        const data = [];
        for (let c of e.target.children) {
            data.push(c.value)
        }
        if (data.join('').length !== 6) {
            toast.warn('Please input all 6 fields')
        } else {
            axios.post(`/auth/reset/edit-mode`, { editKey: data.join(''), email: jwt.decode(token).email })
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
            <div className='flex-center' style={{minHeight: '87vh'}}>
                <h1>Password Saver</h1>
                <p>Reset your unique editKey. With it you can access all your passwords. It can contain either numbers and letters.</p>
                <form method='POST' id='editMode' onSubmit={resetEditKey}>
                    <input className='hide' autoFocus type='password' placeholder='0' maxLength={1} />
                    <input className='hide' type='password' placeholder='0' maxLength={1} />
                    <input className='hide' type='password' placeholder='0' maxLength={1} />
                    <input className='hide' type='password' placeholder='0' maxLength={1} />
                    <input className='hide' type='password' placeholder='0' maxLength={1} />
                    <input className='hide' type='password' placeholder='0' maxLength={1} />

                    <button type='submit' className='submit-right'>
                        <span className='tooltip' style={{ width: '5rem' }}>setup</span>
                        <i className='fa fa-arrow-right'></i>
                    </button>
                </form>
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
