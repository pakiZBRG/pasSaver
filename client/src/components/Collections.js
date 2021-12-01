import React, { useState } from 'react';
import { isAuth } from '../helpers/auth';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function Collections() {
    const [collection, setCollection] = useState({})

    if(!isAuth()) {
        window.location.href = '/';
    }

    const handleChange = text => e => setCollection({ ...collection, [text]: e.target.value });

    /* FILE SELECTION */
    const onImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setCollection({ ...collection, imageUrl: e.target.files[0] })
            toast.success('Image has been selected!')
        }
    }


    const { name, website, color, imageUrl } = collection;
    const handleCollectionCreation = e => {
        e.preventDefault();
        if(name && website && color && imageUrl.name){
            const form = new FormData();
            form.append("name", name);
            form.append("website", website);
            form.append("color", color);
            form.append("myImage", imageUrl);
            axios.post('http://localhost:5000/collection/new', form)
                .then(res => {
                    setCollection({})
                    toast.success(res.data.message);
                })
                .catch(err => toast.error(err.response.data.error));
        } else {
            toast.error('Please fill all fields');
        }
        console.log(collection)
    }

    return (
        <>
            <div className='collection'>
                <ToastContainer/>
                <h1>Collections</h1>
                <div className='collection-flex'>
                    <div className='collection-flex__collections'>
                        <h2>Create New Collection</h2>
                        <form
                            method='POST'
                            encType='multipart/form-data'
                            onSubmit={handleCollectionCreation}
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
                                <label htmlFor='website'>Color</label>
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
                    </div>
                    <div className='collection-flex__passwords'>Passwords</div>
                </div>
            </div>
        </>
    )
}
