import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import hashPassword from '../helpers/Hashing'


export default function GetCollectionsAndPasswords({
    collections,
    removePassword,
    handleChange,
    handlePasswordUpdate,
    setData,
    setUpdatePass,
    updatePass,
    deleteCollection,
    loading
}) {
    const [openedColl, setOpenedColl] = useState([]);
    const [edit, setEdit] = useState(false);
    const editable = localStorage.getItem('editable')
    let isBlack = false;

    useEffect(() => {}, [editable])

    const hex2rgb = color => {
        let r, g, b;
        r = color.charAt(0) + '' + color.charAt(1);
        g = color.charAt(2) + '' + color.charAt(3);
        b = color.charAt(4) + '' + color.charAt(5);
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        console.log(r, g, b)
        if (r > 190 && g > 190 && b > 190) {
            isBlack = true;
        }
        if(r < 45 && g < 45 && b < 45) {
            isBlack = false;
        }
        return `rgba(${r}, ${g}, ${b}, .4)`;
    }

    const openCollection = e => {
        if (e.target.attributes[0]?.nodeValue === 'list-collections__single-collection') {
            const toOpen = e.target.nextElementSibling.attributes.id.value;
            const openDiv = e.target.parentElement.attributes.id.value;
            const isOpened = openedColl.find(coll => coll === toOpen);
            if (toOpen === openDiv && isOpened === undefined) {
                setOpenedColl([...openedColl, toOpen]);
            } else {
                setOpenedColl(openedColl.filter(coll => coll !== toOpen))
            }
        }
    }

    const shouldOpen = id => openedColl.find(col => col === id);

    const switchUpdate = e => {
        const toUpdate = e.target.attributes[0].value;
        const updateDiv = e.target.closest('article').attributes[0].value;
        if (toUpdate === updateDiv) {
            setUpdatePass(toUpdate)
            setEdit(!edit)
            setData({
                email: e.target.offsetParent.children[0].value,
                password: hashPassword(e.target.offsetParent.children[1].value)
            })
        }
    }

    return (
        <div className='list-collections'>
            <ToastContainer theme='colored' />
            {/* <i className='fa fa-minus list-collections__minimize' onClick={() => setOpenedColl([])}></i> */}
            {!loading ?
                collections.length ? collections?.map(coll => (
                    <div className='list-collections__single' id={coll._id} key={coll._id} onClick={openCollection}>
                        <div className='list-collections__single-collection'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={coll.imageUrl} alt={coll.name} />
                                <a
                                    target='_blanc'
                                    href={coll.website}
                                    style={{
                                        boxShadow: `0 0 8px 4px ${hex2rgb(coll.color.slice(1))}`,
                                        background: `${coll.color}`,
                                        color: `${isBlack ? 'black' : 'whitesmoke'}`
                                    }}
                                >
                                    {coll.name}
                                </a>
                                {editable &&
                                    <button
                                        style={{ color: `${isBlack ? 'whitemsoke' : coll.color}` }}
                                        className='remove-collection'
                                        onClick={() => deleteCollection(coll._id)}
                                    >
                                        {console.log(coll.name, isBlack)}
                                        delete
                                    </button>
                                }
                            </div>
                            {coll.passwords.length > 0 &&
                                <div>
                                    <span style={{ color: `${coll.color}` }}>
                                        {coll.passwords.length}
                                    </span>
                                    <small> passwords</small>
                                    <input type='hidden' value={coll._id} />
                                </div>
                            }
                        </div>
                        <div id={coll._id} style={{ display: `${shouldOpen(coll._id) ? 'block' : 'none'}` }}>
                            {coll.passwords.map(pass => {
                                if (pass._id !== updatePass) {
                                    return (
                                        <article id={pass._id} key={pass._id} className='list-collections__single-passwords'>
                                            <input type='email' className='readOnly' defaultValue={pass.email} />
                                            <input type='password' className='readOnly' defaultValue={'BITCH_YOU_GUESSED_IT'} />
                                            <div className='actions'>
                                                <CopyToClipboard onCopy={() => toast.info("Copied to clipboard")} text={hashPassword(pass.password)}>
                                                    <span className='actions-copy'>copy</span>
                                                </CopyToClipboard>
                                                {editable &&
                                                    <>
                                                        <span id={pass._id} className='actions-edit' onClick={switchUpdate}>
                                                            edit
                                                        </span>
                                                        <span className='actions-remove' onClick={() => removePassword(pass._id)}>
                                                            remove
                                                        </span>
                                                    </>
                                                }
                                            </div>
                                        </article>
                                    )
                                } else {
                                    return (
                                        <form id={pass._id} method="PUT" key={pass._id} className='list-collections__single-passwords'>
                                            <input type='email' className='writeMode' onChange={handleChange('email')} defaultValue={pass.email} />
                                            <input type='password' className='writeMode' onChange={handleChange('password')} defaultValue={hashPassword(pass.password)} />
                                            <div className='actions' style={{ marginLeft: '65px' }}>
                                                <span className='actions-edit' onClick={handlePasswordUpdate}>
                                                    accept
                                                </span>
                                                <span className='actions-remove' onClick={() => setUpdatePass()}>
                                                    decline
                                                </span>
                                            </div>
                                        </form>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )) : <h2 className='no-password'>No password found</h2>
                : <h2 className='no-password'>Loading ...</h2>}
        </div>
    )
}
