import React, { useState, useEffect } from 'react';
import { isAuth } from '../helpers/auth';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import NewPasswords from './NewPasswords';
import NewCollection from './NewCollection';
import NavBar from './NavBar';
import GetCollectionsAndPasswords from './GetCollectionsAndPasswords';
import Filter from './Filter';


export default function Collections() {
    const [data, setData] = useState({});
    const [updatePass, setUpdatePass] = useState();
    const [collections, setCollection] = useState([]);
    const [search, setSearch] = useState('');

    if (!isAuth()) {
        window.location.href = '/';
    }

    const getCollections = async () => {
        try {
            if(search.trim() === '') {
                const collectionData = await axios.get('http://localhost:5000/collection');
                setCollection(collectionData.data.collections);
            } else {
                const searchCollection = await axios.get(`http://localhost:5000/password/${search}`);
                setCollection(searchCollection.data.collections);
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    useEffect(() => {
        getCollections()
    }, [search])

    const handleChange = text => e => setData({ ...data, [text]: e.target.value });
    const handleSelect = e => setData({ ...data, collector: e.target.value });

    /* FILE SELECTION */
    const onImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setData({ ...data, imageUrl: e.target.files[0] })
            toast.info('Image has been selected!')
        }
    }

    const { name, website, color, imageUrl } = data;
    const handleCollectionCreation = e => {
        e.preventDefault();
        if (name && website && color && imageUrl.name) {
            const form = new FormData();
            form.append("name", name);
            form.append("website", website);
            form.append("color", color);
            form.append("myImage", imageUrl);
            axios.post('http://localhost:5000/collection/new', form)
                .then(res => {
                    setCollection([...collections, res.data.collection])
                    e.target.reset();
                    toast.success(res.data.message);
                })
                .catch(err => toast.error(err.response.data.error));
        } else {
            toast.warn('Collection: please fill all fields');
        }
    }

    const deleteCollection = async id => {
        try {
            const collection = await axios.delete(`http://localhost:5000/collection/${id}`)
            if (collection) {
                setCollection(collection.data.collection)
                toast.success(collection.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const { email, password, collector } = data;
    const handlePasswordCreation = e => {
        e.preventDefault();
        try {
            if (email && password && collector) {
                axios.post('http://localhost:5000/password/new', { email, password, collector })
                    .then(res => {
                        setCollection(res.data.collections)
                        e.target.reset();
                        toast.success(res.data.message);
                    })
                    .catch(err => toast.error(err?.response.data.error));
            } else {
                toast.warning('Password: please, fill all fields');
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const removePassword = async pass => {
        try {
            const remove = await axios.delete(`http://localhost:5000/password/${pass}`);
            if (remove) {
                setCollection(remove.data.collections)
                toast.success("Password removed")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handlePasswordUpdate = async e => {
        e.preventDefault();
        const id = e.target.offsetParent.attributes[0].value;
        try {
            if (password || email) {
                const update = await axios.put(`http://localhost:5000/password/${id}`, { email, password, collector });
                setUpdatePass([])
                setCollection(update.data.collection);
                toast.success(update.data.message);
            } else {
                toast.warn('Please insert both email and password')
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <>
            <NavBar />
            <div className='collection'>
                <ToastContainer theme='colored' />
                <h1>Collections</h1>
                <div className='collection-flex'>
                    <NewCollection
                        createCollection={handleCollectionCreation}
                        handleChange={handleChange}
                        onImageChange={onImageChange}
                    />
                    <NewPasswords
                        createPassword={handlePasswordCreation}
                        handleChange={handleChange}
                        handleSelect={handleSelect}
                        collections={collections}
                    />
                </div>
            </div>
            <Filter setSearch={setSearch} />
            <GetCollectionsAndPasswords
                collections={collections}
                removePassword={removePassword}
                handleChange={handleChange}
                handlePasswordUpdate={handlePasswordUpdate}
                setData={setData}
                setUpdatePass={setUpdatePass}
                updatePass={updatePass}
                deleteCollection={deleteCollection}
            />
        </>
    )
}
