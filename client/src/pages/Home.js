import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import NavBar from '../components/NavBar';
import UseCase from '../components/UseCase';
import { authenticate, isAuth } from '../helpers/auth';
import { Link, useLocation } from 'react-router-dom';
import LoggedAccounts from '../components/LoggedAccounts';

export default function Home() {
    const params = useLocation().search;
    const [login, setLogin] = useState('');

    if(params === '?token=expired') {
        toast.info('Yout token has expired. Please send another one')
    }

    const handleChange = text => e => setLogin({ ...login, [text]: e.target.value });

    const handleEmailSubmit = e => {
        e.preventDefault();
        if (login.email.trim() === '') {
            toast.warning('Input your email, please.')
        } else {
            axios.post('/auth/keypass', { email: login.email })
                .then(res => toast.info(res.data.message))
                .catch(err => toast.error(err.response.data.error))
        }
    }

    const handleLoginSubmit = e => {
        e.preventDefault();
        if (!login.email && !login.keyPass) {
            toast.warning('Input your email and keyPass, please.')
        } else {
            axios.post('/auth/login', { login })
                .then(res => {
                    authenticate(res);
                    if (isAuth()) {
                        window.location.href = '/collections';
                    }
                })
                .catch(err => toast.error(err.response.data.error))
        }
    }

    return (
        <>
            <NavBar />
            <div style={{ minHeight: '93vh' }}>
                <div className='flex-center'>
                    <h1>Password Saver</h1>
                    <p>Store all your passwords in one place, and access them using one phrase: keyPass. Get your own keyPass now</p>
                    {!isAuth()
                        ?
                        <>
                            <form method='POST' onSubmit={handleEmailSubmit}>
                                <input className='email' type='email' placeholder='Your email' onChange={handleChange('email')} />
                                <button type='submit' className='submit'>
                                    <i className="fa fa-envelope"></i>
                                </button>
                            </form>

                            <span className='divider'>or login with keypass</span>

                            <form method='POST' onSubmit={handleLoginSubmit} style={{ margin: 0 }}>
                                <input className='keyPass' type='password' placeholder='Your keyPass' onChange={handleChange('keyPass')} />
                                <button type='submit' className='submit'>
                                    <i className='fa fa-sign-in'></i>
                                </button>
                            </form>

                            <Link to='/recovery' className='recovery'>
                                Forgot password?
                            </Link>
                        </>
                        :
                        <Link className='logged-user' to='/collections'>
                            My Collections
                            <i className='fa fa-arrow-right'></i>
                        </Link>
                    }
                </div>
                {!isAuth() && <LoggedAccounts />}
                <UseCase />
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
