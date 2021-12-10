import React from 'react';
import { Link } from 'react-router-dom';
import { isAuth, signout } from '../helpers/auth';

export default function NavBar() {
    return (
        <div className='nav-center'>
            {!isAuth() ?
                <Link to='/'>home</Link>
                    :
                <button onClick={() => signout(() => window.location.href = '/')}>signout</button>
            }
        </div>
    )
}
