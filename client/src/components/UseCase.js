import React from 'react';

export default function UseCase() {
    return (
        <div className='flex-around'>
            <div className='card'>
                <h2>Input your email and get activatin code</h2>
                <div className='card-img'>
                    <img src='/assets/email_sent.svg' alt='send email'/>
                </div>
            </div>
            <div className='card'>
                <h2>Create your keyPass</h2>
                <div className='card-img'>
                    <img src='/assets/create_keypass.svg' alt='create keypass'/>
                </div>
            </div>
            <div className='card'>
                <h2>Login via keyPass</h2>
                <div className='card-img'>
                    <img src='/assets/login.svg' alt='login'/>
                </div>
            </div>
            <div className='card'>
                <h2>Create collections and stor your passwords</h2>
                <div className='card-img'>
                    <img src='/assets/create.svg' alt='create'/>
                </div>
            </div>
        </div>
    )
}
