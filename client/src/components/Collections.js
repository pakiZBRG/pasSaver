import React from 'react';
import { isAuth } from '../helpers/auth';

export default function Collections() {
    if(!isAuth()) {
        window.location.href = '/';
    }

    return (
        <div className='collection'>
            <h1>Collections</h1>
            <div className='collection-flex'>
                <div className='collection-flex__collections'>Collections</div>
                <div className='collection-flex__passwords'>Passwords</div>
            </div>
        </div>
    )
}
