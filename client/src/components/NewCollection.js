import React from 'react';
import { CSSTransition } from "react-transition-group";

export default function NewCollection({
    isOpen,
    setIsOpen,
    createCollection,
    handleChange,
    onImageChange
}) {
    return (
        <CSSTransition in={isOpen.collection} classNames='add' timeout={100}>
            <div className='collection-flex__collections'>
                <span className='collection-flex__collections-navigate' onClick={() => setIsOpen({...isOpen, collection: !isOpen.collection})}>
                    <h2>Create New Collection</h2>
                    <i className="fa fa-chevron-down" style={{ transform: `${isOpen.collection ? 'rotateX(180deg)' : ""}`, transition: '200ms ease-out' }}></i>
                </span>
                <CSSTransition in={isOpen.collection} classNames='form' timeout={100}>
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
                                placeholder='Facebook'
                                onChange={handleChange('name')}
                            />
                        </div>
                        <div className='form-input'>
                            <label htmlFor='website'>Website</label>
                            <input
                                type='text'
                                name='website'
                                placeholder='https://facebook.com'
                                onChange={handleChange('website')}
                            />
                        </div>
                        <div className='form-input'>
                            <label htmlFor='color'>Color</label>
                            <input
                                type='text'
                                name='color'
                                placeholder='#ffea20'
                                onChange={handleChange('color')}
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
                            <input type='submit' value='create'/>
                        </div>
                    </form>
                </CSSTransition>
            </div>
        </CSSTransition>
    )
}