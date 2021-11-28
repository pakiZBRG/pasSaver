import React from 'react';

export default function Home() {
    const handleForm = (e) => {
        e.preventDefault();
        console.log('Poslato')
    }

    return (
        <>
            <div className='flex-center'>
                <h1>Password Saver</h1>
                <p>Store all your passwords in one place, and access them using one phrase: keyPass. Get your own keyPass now</p>
                <form method='POST' onSubmit={handleForm}>
                    <input type='email' placeholder='Your email here'/>
                    <button type='submit'>
                        <i className='fa fa-arrow-right'></i>
                    </button>
                </form>
            </div>
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
