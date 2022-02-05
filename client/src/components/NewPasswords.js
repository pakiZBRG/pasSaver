import React, { useState } from 'react'
import { CSSTransition } from "react-transition-group";

export default function NewPasswords({
    createPassword,
    handleChange,
    handleSelect,
    collections,
}) {
    const [openPassword, setOpenPassword] = useState(false);

    return (
        <CSSTransition in={openPassword} classNames='pass' timeout={100}>
            <div className='collection-flex__passwords'>
                <span className='collection-flex__passwords-navigate' onClick={() => setOpenPassword(!openPassword)}>
                    <h2>Create New Password</h2>
                    <i className="fa fa-chevron-down" style={{ transform: `${openPassword ? 'rotateX(180deg)' : ""}`, transition: '200ms ease-out' }}></i>
                </span>
                <CSSTransition in={openPassword} classNames='form' timeout={100}>
                    <form
                        method='POST'
                        encType='multipart/form-data'
                        onSubmit={createPassword}
                    >
                        <div className='form-input'>
                            <label htmlFor='email'>Email</label>
                            <input
                                type='email'
                                name='email'
                                onChange={handleChange('email')}
                            />
                        </div>
                        <div className='form-input'>
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                name='password'
                                onChange={handleChange('password')}
                            />
                        </div>
                        <div className='form-input'>
                            <label htmlFor='collector'>Collection</label>
                            <select onChange={handleSelect} >
                                <option selected hidden>Pick a collection</option>
                                {collections?.map(coll => (
                                    <option key={coll._id} value={coll._id}>{coll.name}</option>
                                ))}
                            </select>
                        </div>
                        <input type='submit' value='create' />
                    </form>
                </CSSTransition>
            </div>
        </CSSTransition>
    )
}
