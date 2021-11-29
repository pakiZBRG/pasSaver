import React from 'react';
import email_sent from '../assets/email_sent.svg';
import create_keypass from '../assets/create_keypass.svg';
import login from '../assets/login.svg';
import create from '../assets/create.svg';

export default function UseCase() {
    return (
        <div className='flex-around'>
            <div className='card'>
                <h2>Input your email and get activatin code</h2>
                <div className='card-img'>
                    <img src={email_sent} alt='send email'/>
                </div>
            </div>
            <div className='card'>
                <h2>Create your keyPass</h2>
                <div className='card-img'>
                    <img src={create_keypass} alt='send email'/>
                </div>
            </div>
            <div className='card'>
                <h2>Login via keyPass</h2>
                <div className='card-img'>
                    <img src={login} alt='send email'/>
                </div>
            </div>
            <div className='card'>
                <h2>Create collections and stor your passwords</h2>
                <div className='card-img'>
                    <img src={create} alt='send email'/>
                </div>
            </div>
        </div>
    )
}
