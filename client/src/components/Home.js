import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import NavBar from './NavBar';
import UseCase from './UseCase';
import { authenticate, isAuth } from '../helpers/auth';
import { Link } from 'react-router-dom';

export default function Home() {
    const [email, setEmail] = useState('');
    const [keyPass, setKeyPass] = useState('');

    const handleEmailSubmit = e => {
        e.preventDefault();
        if(email.trim() === '' ) {
            toast.warning('Input your email, please.')
        } else {
            axios.post('http://localhost:5000/auth/keypass', { email })
                .then(res => toast.info(res.data.message))
                .catch(err => toast.error(err.response.data.error))
        }
    }

    console.log(isAuth())

    const handleLoginSubmit = e => {
        e.preventDefault();
        if(keyPass.trim() === '' ) {
            toast.warning('Input your keyPass, please.')
        } else {
            axios.post('http://localhost:5000/auth/login', { keyPass })
                .then(res => {
                    authenticate(res);
                    if(isAuth()){
                        window.location.href = '/collections';
                    }
                })
                .catch(err => toast.error(err.response.data.error))
        }
    }

    return (
        <>
            <ToastContainer/>
            <NavBar />
            <div className='flex-center'>
                <h1>Password Saver</h1>
                <p>Store all your passwords in one place, and access them using one phrase: keyPass. Get your own keyPass now</p>
                {!isAuth() 
                        ?
                    <>
                        <form method='POST' onSubmit={handleEmailSubmit}>
                            <input type='email' placeholder='Your email' onChange={e => setEmail(e.target.value)}/>
                            <button type='submit'>
                                <i className="fa fa-envelope"></i>
                            </button>
                        </form>

                        <span className='divider'>or login with keypass</span>

                        <form method='POST' onSubmit={handleLoginSubmit} style={{margin: 0}}>
                            <input type='password' placeholder='Your keyPass' onChange={e => setKeyPass(e.target.value)}/>
                            <button type='submit'>
                                <i className='fa fa-sign-in'></i>
                            </button>
                        </form>
                    </>
                        :
                    <Link className='logged-user' to='/collections'>
                        My Collections
                        <i className='fa fa-arrow-right'></i>
                    </Link>
                }
            </div>
            <UseCase />
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
