import React, { useState, useEffect } from 'react';
import { isAuth } from '../helpers/auth';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import NewPasswords from './NewPasswords';
import NewCollection from './NewCollection';
import GetCollectionsAndPasswords from './GetCollectionsAndPasswords';

export default function Collections() {
    const [data, setData] = useState({});
    const [collections, setCollection] = useState([]);
    const [passwords, setPasswords] = useState([]);
    const [isOpen, setIsOpen] = useState({
        collection: false,
        password: false
    });

    if(!isAuth()) {
        window.location.href = '/';
    }

    const getCollections = async () => {
        try {
            const collectionData = await axios.get('http://localhost:5000/collection');
            setCollection(collectionData.data.collections);
        } catch(err) {
            toast.error(err.message)
        }
    }

    const getPasswords = async () => {
        try {
            const passwordData = await axios.get('http://localhost:5000/password');
            setPasswords(passwordData.data.passwords);
        } catch (err) {
            toast.error(err.message)
        }
    }

    useEffect(() => {
        getCollections()
        getPasswords()
    }, [])

    const handleChange = text => e => setData({ ...data, [text]: e.target.value });
    const handleSelect = e => setData({...data, collector: e.target.value});

    /* FILE SELECTION */
    const onImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setData({ ...data, imageUrl: e.target.files[0] })
            toast.success('Image has been selected!')
        }
    }

    const { name, website, color, imageUrl } = data;
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
                    setCollection([...collections, res.data.collection])
                    setData({})
                    handleChange({})
                    toast.success(res.data.message);
                })
                .catch(err => toast.error(err.response.data.error));
        } else {
            toast.error('Collection: please fill all fields');
        }
    }

    const { email, password, collector } = data;
    const handlePasswordCreation = e => {
        e.preventDefault();
        try {
            if(email && password && collector){
                axios.post('http://localhost:5000/password/new', { email, password, collector })
                    .then(res => {
                        setCollection(res.data.collections)
                        setData({})
                        handleChange({})
                        toast.success(res.data.message);
                    })
                    .catch(err => toast.error(err.response.data.error));
            } else {
                toast.warning('Password: please, fill all fields');
            }
        } catch(err) {
            toast.error(err.message);
        }
    }

    const removePassword = async pass => {
        try {
            const remove = await axios.delete(`http://localhost:5000/password/${pass}`);
            if(remove) {
                setCollection(remove.data.collections)
                toast.success("Password removed")
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <div className='collection'>
                <ToastContainer theme='colored'/>
                <h1>Collections</h1>
                <div className='collection-flex'>
                    <NewCollection
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        createCollection={handleCollectionCreation}
                        handleChange={handleChange}
                        onImageChange={onImageChange}
                    />
                    <NewPasswords 
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        createPassword={handlePasswordCreation}
                        handleChange={handleChange}
                        handleSelect={handleSelect}
                        collections={collections}
                    />
                </div>
                
            </div>
            <GetCollectionsAndPasswords
                collections={collections}
                removePassword={removePassword}
            />
        </>
    )
}
