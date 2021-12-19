import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isAuth } from '../helpers/auth';
import { ToastContainer, toast } from 'react-toastify';

export default function Filter({ setSearch }) {
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const doesEditModeExists = async () => {
        try {
            const doesExist = await axios.get(`http://localhost:5000/auth/find/edit-mode/${isAuth()}`);
            setLoading(false);
            setEditMode(doesExist.data.exists)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        doesEditModeExists();
    }, [])

    const sendEditKey = async () => {
        axios.post(`http://localhost:5000/auth/edit-mode`, { id: isAuth() })
            .then(res => toast.info(res.data.message))
            .catch(err => toast.warn(err.message))
    }

    return (
        <>
            <ToastContainer theme='colored' />
            <div className='filter'>
                <div className='filter-input'>
                    <input type='text' onChange={e => setSearch(e.target.value)} placeholder='Search Passwords' />
                    <i className='fa fa-search'></i>
                </div>
                {!loading ?
                    editMode ?
                        <div className='filter-button'>
                            <button onClick={sendEditKey}>Send EditKey</button>
                        </div>
                        :
                        <p>da</p>
                    :
                    <h3 className='no-password'>Loading ...</h3>
                }
            </div>
        </>
    )
}
