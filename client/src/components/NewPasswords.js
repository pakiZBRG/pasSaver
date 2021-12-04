import React from 'react'

export default function NewPasswords({
    isOpen,
    setIsOpen,
    createPassword,
    handleChange,
    handleSelect,
    collections
}) {
    return (
        <div className='collection-flex__passwords' onClick={() => setIsOpen({ ...isOpen, password: !isOpen.password })}>
            <span className='collection-flex__passwords-navigate'>
                <h2>Create New Password</h2>
                <i className="fa fa-chevron-down" style={{ transform: `${isOpen.password ? 'rotate(180deg)' : ""}` }}></i>
            </span>
            { isOpen.password &&
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
            }
        </div>
    )
}
