import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import jwt from 'jsonwebtoken';

export default function RecoverEditKey() {
    const token = useParams().token;

    const now = new Date()
    const seconds = Math.round(now.getTime() / 1000)

    if (jwt.decode(token).exp < seconds) {
        window.location.href = '/?token=expired'
    }

    const OTPInput = () => {
        const inputs = document.querySelectorAll('#editMode > input');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('keydown', function (event) {
                if (event.key === "Backspace") {
                    inputs[i].value = '';
                    if (i !== 0)
                        inputs[i - 1].focus();
                } else {
                    if (i === inputs.length - 1 && inputs[i].value !== '') {
                        return true;
                    } else if (event.keyCode > 47 && event.keyCode < 58) {
                        inputs[i].value = event.key;
                        if (i !== inputs.length - 1)
                            inputs[i + 1].focus();
                        event.preventDefault();
                    } else if (event.keyCode > 64 && event.keyCode < 91) {
                        inputs[i].value = String.fromCharCode(event.keyCode);
                        if (i !== inputs.length - 1)
                            inputs[i + 1].focus();
                        event.preventDefault();
                    }
                }
            });
        }
    }

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
            axios.post(`http://localhost:5000/auth/reset/edit-mode`, { editKey: data.join(''), email: jwt.decode(token).email })
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
            <ToastContainer theme='colored' />
            <NavBar />
            <div className='flex-center' style={{minHeight: '87vh'}}>
                <h1>Password Saver</h1>
                <p>Reset your unique editKey. With it you can access all your passwords. It has to have at least 10 characters and both numbers and letters.</p>
                <form method='POST' id='editMode' onSubmit={resetEditKey}>
                    <input type='password' placeholder='0' maxLength={1} />
                    <input type='password' placeholder='0' maxLength={1} />
                    <input type='password' placeholder='0' maxLength={1} />
                    <input type='password' placeholder='0' maxLength={1} />
                    <input type='password' placeholder='0' maxLength={1} />
                    <input type='password' placeholder='0' maxLength={1} />

                    <button type='submit' className='submit-right'>
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
