import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import NavBar from '../components/NavBar';
import UseCase from '../components/UseCase';
import { authenticate, isAuth } from '../helpers/auth';
import { Link } from 'react-router-dom';
import LoggedAccounts from '../components/LoggedAccounts';

export default function Home() {
    const [login, setLogin] = useState('');
    const [visible, setVisible] = useState(false);

    if (localStorage.getItem('id')) window.location.href = '/collections';

    const handleChange = text => e => setLogin({ ...login, [text]: e.target.value });

    const handleEmailSubmit = e => {
        e.preventDefault();
        if (login.email === '') {
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
                                <input className='email' type='email' placeholder='Your email' defaultValue={login.email} onChange={handleChange('email')} />
                                <button type='submit' className='submit'>
                                    <span className='tooltip' style={{width: '11rem'}}>Send activation email</span>
                                    <i className="fa fa-envelope"></i>
                                </button>
                            </form>

                            <span className='divider'>or login with keypass</span>

                            <form method='POST' onSubmit={handleLoginSubmit} style={{ margin: 0 }}>
                                <input className='keyPass' type={visible ? 'text' : 'password'} placeholder='Your keyPass' onChange={handleChange('keyPass')} />
                                {!visible ?
                                    <img src="/images/non-visible.png" alt='non-visible' className='non-visible' onClick={() => setVisible(true)} />
                                    :
                                    <img src="/images/visible.png" alt='visible' className='non-visible' onClick={() => setVisible(false)} />
                                }
                                <button type='submit' className='submit'>
                                    <span className='tooltip' style={{width: '4rem'}}>login</span>
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
                {!isAuth() && <LoggedAccounts setLogin={setLogin} />}
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
