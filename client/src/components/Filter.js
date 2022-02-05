import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isAuth, deactivate } from '../helpers/auth';
import { toast } from 'react-toastify';
import OTPInput from '../helpers/OTPInput'

export default function Filter({ setSearch, modal, setModal, editable, setEditable }) {
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const doesEditModeExists = async () => {
        try {
            const doesExist = await axios.get(`/auth/find/edit-mode/${isAuth()}`);
            setLoading(false);
            setEditMode(doesExist.data.exists)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        doesEditModeExists();
        if(modal){
            OTPInput();
        }
    }, [modal])

    const handleEditKey = e => {
        e.preventDefault();
        const data = [];
        for (let c of e.target.children) {
            data.push(c.value)
        }
        if (data.join('').length !== 6) {
            toast.warn('Please input all 6 fields')
        } else {
            axios.post(`/auth/edit-mode/${isAuth()}`, { key: data.join('') })
                .then(res => {
                    toast.success(res.data.message)
                    setModal(false);
                    localStorage.setItem('editable', res.data.editable);
                    setEditable(res.data.editable)
                })
                .catch(err => console.log(err.response));
        }
    }

    const sendEditKey = async () => {
        axios.post(`/auth/edit-mode`, { id: isAuth() })
            .then(res => toast.info(res.data.message))
            .catch(err => toast.warn(err.message))
    }

    const sendRecoveryEmail = async () => {
        try {
            const sendEmail = await axios.post('/auth/recover/edit-mode', { id: isAuth() })
            toast.info(sendEmail.data.message)
        } catch(error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            {modal &&
                <div className='modal flex-center'>
                    <span onClick={() => setModal(false)}>
                        <i className='fa fa-close'></i>
                    </span>
                    <h2>Enter your EditKey</h2>
                    <p>With it you can edit, remove and add your passwords and collections.</p>
                    <form method='POST' id='editMode' onSubmit={handleEditKey}>
                        <input className='hide' type='password' placeholder='0' maxLength={1} />
                        <input className='hide' type='password' placeholder='0' maxLength={1} />
                        <input className='hide' type='password' placeholder='0' maxLength={1} />
                        <input className='hide' type='password' placeholder='0' maxLength={1} />
                        <input className='hide' type='password' placeholder='0' maxLength={1} />
                        <input className='hide' type='password' placeholder='0' maxLength={1} />

                        <button type='submit' className='submit-right'>
                            <i className='fa fa-arrow-right'></i>
                        </button>
                    </form>
                    <div className='recovery' onClick={sendRecoveryEmail}>Don't have it? Send email to set it up.</div>
                </div>
            }
            <div className='filter'>
                <div className='filter-input'>
                    <input type='text' onChange={e => setSearch(e.target.value)} placeholder='Search Passwords' />
                    <i className='fa fa-search'></i>
                </div>
                {!loading ?
                    !editMode ?
                        <div className='filter-button'>
                            <button onClick={sendEditKey}>Send EditKey</button>
                        </div>
                        :
                        editable ?
                            <button className='activated' onClick={() => deactivate(() => setEditable(false))}>
                                <h3>deactivate</h3>
                            </button>
                            :
                            <div className='filter-button'>
                                <button onClick={() => setModal(!modal)}>Activate EditKey</button>
                            </div>
                    :
                    <h3 className='no-password'>Loading ...</h3>
                }
            </div>
        </>
    )
}
