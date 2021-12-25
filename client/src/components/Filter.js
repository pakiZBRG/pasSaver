import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isAuth } from '../helpers/auth';
import { ToastContainer, toast } from 'react-toastify';

export default function Filter({ setSearch, modal, setModal }) {
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isEditable, setEditable] = useState(localStorage.getItem('editable') || false);

    const doesEditModeExists = async () => {
        try {
            const doesExist = await axios.get(`http://localhost:5000/auth/find/edit-mode/${isAuth()}`);
            setLoading(false);
            setEditMode(doesExist.data.exists)
        } catch (err) {
            console.log(err.message)
        }
    }

    const OTPInput = () => {
        const inputs = document.querySelectorAll('#editMode > input');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('keydown', function (event) {
                if (event.key === "Backspace") {
                    inputs[i].value = '';
                    if (i !== 0)
                        inputs[i - 1].focus();
                } else {
                    if (i === inputs.length - 1 && inputs[i].value !== '') {
                        return true;
                    } else if (event.keyCode > 47 && event.keyCode < 58) {
                        inputs[i].value = event.key;
                        if (i !== inputs.length - 1)
                            inputs[i + 1].focus();
                        event.preventDefault();
                    } else if (event.keyCode > 64 && event.keyCode < 91) {
                        inputs[i].value = String.fromCharCode(event.keyCode);
                        if (i !== inputs.length - 1)
                            inputs[i + 1].focus();
                        event.preventDefault();
                    }
                }
            });
        }
    }

    useEffect(() => {
        doesEditModeExists();
    }, []);

    useEffect(() => {
        OTPInput();
    }, [])

    const handleEditKey = e => {
        e.preventDefault();
        const data = [];
        for (let c of e.target.children) {
            data.push(c.value)
        }
        if (data.join('').length !== 6) {
            toast.warn('Please input all 6 fields')
        } else {
            axios.post(`http://localhost:5000/auth/edit-mode/${isAuth()}`, { key: data.join('') })
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
        axios.post(`http://localhost:5000/auth/edit-mode`, { id: isAuth() })
            .then(res => toast.info(res.data.message))
            .catch(err => toast.warn(err.message))
    }

    return (
        <>
            <ToastContainer theme='colored' />
            {modal &&
                <div className='modal flex-center'>
                    <span onClick={() => setModal(false)}>
                        <i class='fa fa-close'></i>
                    </span>
                    <h2>Enter your EditKey</h2>
                    <p>With it you can edit, remove and copy your passwords and collections.</p>
                    <form method='POST' id='editMode' onSubmit={handleEditKey} style={{ marginTop: '3rem' }}>
                        <input type='text' placeholder='0' maxLength={1} />
                        <input type='text' placeholder='0' maxLength={1} />
                        <input type='text' placeholder='0' maxLength={1} />
                        <input type='text' placeholder='0' maxLength={1} />
                        <input type='text' placeholder='0' maxLength={1} />
                        <input type='text' placeholder='0' maxLength={1} />

                        <button type='submit' className='submit-right'>
                            <i className='fa fa-arrow-right'></i>
                        </button>
                    </form>
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
                        isEditable ?
                            <h3 class='activated'>Activated editkey</h3>
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
