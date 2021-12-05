import React from 'react'
import { CSSTransition } from "react-transition-group";

export default function NewPasswords({
    isOpen,
    setIsOpen,
    createPassword,
    handleChange,
    handleSelect,
    collections
}) {
    return (
        <CSSTransition in={isOpen.password} classNames='add' timeout={100}>
            <div className='collection-flex__passwords'>
                <span className='collection-flex__passwords-navigate' onClick={() => setIsOpen({ ...isOpen, password: !isOpen.password })}>
                    <h2>Create New Password</h2>
                    <i className="fa fa-chevron-down" style={{ transform: `${isOpen.password ? 'rotateX(180deg)' : ""}`, transition: '200ms ease-out' }}></i>
                </span>
                <CSSTransition in={isOpen.password} classNames='form' timeout={100}>
                    <form
                        method='POST'
                        encType='multipart/form-data'
                        onSubmit={createPassword}
                    >
                            <div className='form-input'>
                            <label htmlFor='email'>Email</label>
                            <input
                                autoComplete={'off'}
                                type='email'
                                name='email'
                                placeholder='someone@gmail.com'
                                onChange={handleChange('email')}
                            />
                        </div>
                        <div className='form-input'>
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                name='password'
                                placeholder='********'
                                onChange={handleChange('password')}
                            />
                        </div>
                        <div className='form-input'>
                            <label htmlFor='collector'>Collections</label>
                            <select onChange={handleSelect}>
                                <option value="">Choose your collection</option>
                                {collections?.map(coll => (
                                    <option key={coll._id} value={coll._id}>{coll.name}</option>
                                ))}
                            </select>
                        </div>
                        <input type='submit' value='create'/>
                    </form>
                </CSSTransition>
            </div>
        </CSSTransition>
    )
}
