import React, { useState } from 'react';
import { CSSTransition } from "react-transition-group";

export default function NewCollection({
    createCollection,
    handleChange,
    onImageChange
}) {
    const [open, setOpen] = useState(false)

    return (
        <CSSTransition in={open} classNames='add' timeout={100}>
            <div className='collection-flex__collections'>
                <span className='collection-flex__collections-navigate' onClick={() => setOpen(!open)}>
                    <h2>Create New Collection</h2>
                    <i className="fa fa-chevron-down" style={{ transform: `${open ? 'rotateX(180deg)' : ""}`, transition: '200ms ease-out' }}></i>
                </span>
                <CSSTransition in={open} classNames='form' timeout={100}>
                    <form
                        method='POST'
                        encType='multipart/form-data'
                        onSubmit={createCollection}
                    >
                        <div className='form-input'>
                            <label htmlFor='name'>Name</label>
                            <input
                                type='text'
                                name='name'
                                onChange={handleChange('name')}
                                autoComplete='off'
                            />
                        </div>
                        <div className='form-input'>
                            <label htmlFor='website'>Website</label>
                            <input
                                type='text'
                                name='website'
                                onChange={handleChange('website')}
                            />
                        </div>
                        <div className='form-input'>
                            <label htmlFor='color'>Color</label>
                            <input
                                type='text'
                                name='color'
                                onChange={handleChange('color')}
                                autoComplete='off'
                            />
                        </div>
                        <div className='buttons'>
                            <label className='file-input'>
                                <input
                                    type='file'
                                    name='myImage'
                                    onChange={onImageChange}
                                />
                            </label>
                            <input type='submit' value='create' />
                        </div>
                    </form>
                </CSSTransition>
            </div>
        </CSSTransition>
    )
}
