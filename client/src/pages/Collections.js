import React, { useState, useEffect } from 'react';
import { isAuth } from '../helpers/auth';
import axios from 'axios';
import { toast } from 'react-toastify';
import NewPasswords from '../components/NewPasswords';
import NewCollection from '../components/NewCollection';
import NavBar from '../components/NavBar';
import GetCollectionsAndPasswords from '../components/GetCollectionsAndPasswords';
import Filter from '../components/Filter';


export default function Collections() {
    const [data, setData] = useState({});
    const [updatePass, setUpdatePass] = useState();
    const [collections, setCollection] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editable, setEditable] = useState(localStorage.getItem('editable') || false)
    const loggedUser = JSON.parse(localStorage.getItem('id'));

    if (!isAuth()) {
        window.location.href = '/';
    }

    const getCollections = async () => {
        try {
            if (search.trim() === '') {
                const collectionData = await axios.get(`/collection/${loggedUser}`);
                setCollection(collectionData.data.collections);
                setLoading(false)
            } else {
                const searchCollection = await axios.get(`/password/${search}`);
                setCollection(searchCollection.data.collections);
                setLoading(false)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    useEffect(() => {
        getCollections()
    }, [search, editable])

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
            form.append('user', loggedUser)
            form.append("myImage", imageUrl);
            axios.post('/collection/new', form)
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
            const collection = await axios.delete(`/collection/${id}?user=${loggedUser}`)
            if (collection) {
                console.log(collection)
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
                axios.post('/password/new', { email, password, collector, loggedUser })
                    .then(res => {
                        setCollection(res.data.collections)
                        e.target.reset();
                        toast.success(res.data.message);
                    })
                    .catch(err => toast.error(err?.response.data.error));
            } else {
                toast.warning('Password: please fill all fields');
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const removePassword = async pass => {
        try {
            const remove = await axios.delete(`/password/${pass}?user=${loggedUser}`);
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
            if (password && email) {
                await axios.put(`/password/${id}`, { email, password, collector, loggedUser });
                setTimeout(() => window.location.reload(), 200)
            } else {
                toast.warn('Please insert both email and password')
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <>
            {modal && <div className='overlay'></div>}
            <NavBar />
            <div className='collection'>
                <h1>Collections</h1>
                <div className='collection-flex'>
                    {editable &&
                        <>
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
                        </>
                    }
                </div>
            </div>
            <Filter
                setSearch={setSearch}
                modal={modal}
                setModal={setModal}
                editable={editable}
                setEditable={setEditable}
            />
            <GetCollectionsAndPasswords
                collections={collections}
                removePassword={removePassword}
                handleChange={handleChange}
                handlePasswordUpdate={handlePasswordUpdate}
                setData={setData}
                setUpdatePass={setUpdatePass}
                updatePass={updatePass}
                deleteCollection={deleteCollection}
                loading={loading}
            />
        </>
    )
}
