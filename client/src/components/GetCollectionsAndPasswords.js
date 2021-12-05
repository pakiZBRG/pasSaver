import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';


export default function GetCollectionsAndPasswords({
    collections,
    removePassword
}) {
    const [openedColl, setOpenedColl] = useState([]);
    let isBlack = false;

    const hex2rgb = color => {
        let r, g, b;
        if (color.length === 3) {
            color = color.substr(0,1) + color.substr(0,1) + color.substr(1,2) + color.substr(1,2) + color.substr(2,3) + color.substr(2,3);
        }
        r = color.charAt(0) + '' + color.charAt(1);
        g = color.charAt(2) + '' + color.charAt(3);
        b = color.charAt(4) + '' + color.charAt(5);
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        if(r > 190 && g > 190 && b > 190) {
            isBlack = true;
        }
        return `rgba(${r}, ${g}, ${b}, .4)`;
    }

    const hashPassword = pass => {
        const prefix = process.env.REACT_APP_PREFIX;
        const sufix = process.env.REACT_APP_SUFIX;
        const M = process.env.REACT_APP_MOVE_M;
        const N = process.env.REACT_APP_MOVE_N;
        const hash = pass.substring(prefix, pass.length - sufix);

        const password = hash.split('');
        let i = password.length - 1;
        let asciiPass = [];
        if(i % 2 === 0){
            while(i > -1){
                const asciiChar = password[i].charCodeAt(0);
                i % 2 === 0 ? asciiPass.push(asciiChar - M) : asciiPass.push(asciiChar - N);
                i--;
            }
        } else {
            while(i > -1){
                const asciiChar = password[i].charCodeAt(0);
                i % 2 === 0 ? asciiPass.push(asciiChar - N) : asciiPass.push(asciiChar - M);
                i--;
            }
        }
        
        let stringPass = [];
        asciiPass.forEach(p => stringPass.push(String.fromCharCode(p)));
        return stringPass.join('');
    }

    const openCollection = e => {
        if(e.target.attributes[0]?.nodeValue === 'list-collections__single-collection') {
            const toOpen = e.target.nextElementSibling.attributes.id.value;
            const openDiv = e.target.parentElement.attributes.id.value;
            const isOpened = openedColl.find(coll => coll === toOpen);
            if(toOpen === openDiv && isOpened === undefined) {
                setOpenedColl([...openedColl, toOpen]);
            } else {
                setOpenedColl(openedColl.filter(coll => coll !== toOpen))
            }
        }
    }

    const shouldOpen = id => openedColl.find(col => col === id);

    const editPassword = pass => {
        console.log('edited', pass)
    }
    
    return (
        <div className='list-collections'>
            <ToastContainer theme='colored'/>
            {/* <i className='fa fa-minus list-collections__minimize' onClick={() => setOpenedColl([])}></i> */}
            {collections?.map(coll => (
                <div className='list-collections__single' id={coll._id} key={coll._id} onClick={openCollection}>
                    <div className='list-collections__single-collection'>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <img src={coll.imageUrl} alt={coll.name}/>
                            <a 
                                target='_blanc'
                                href={coll.website}
                                style={{ 
                                    boxShadow: `0 0 10px 3px ${hex2rgb(coll.color)}`, 
                                    background: `#${coll.color}`, 
                                    color: `${isBlack ? 'black' : 'whitesmoke'}`
                                }}
                            >
                                {coll.name}
                            </a>
                        </div>
                        {coll.passwords.length > 0 &&
                            <div>
                                <span style={{color: `#${coll.color}`}}>
                                    {coll.passwords.length}
                                </span>
                                <small> passwords</small>
                                <input type='hidden' value={coll._id}/>
                            </div>
                        }
                    </div>
                    <div id={coll._id} style={{display: `${shouldOpen(coll._id) ? 'block' : 'none'}`}}>
                        {coll.passwords.map(pass => (
                            <div key={pass._id} className='list-collections__single-passwords'>
                                <input type='email' defaultValue={pass.email}/>
                                <input type='password' defaultValue={pass.password}/>
                                <div className='actions'>
                                    <CopyToClipboard onCopy={() => toast.success("Copied to clipboard")} text={hashPassword(pass.password)}>
                                        <span className='actions-copy'>copy</span>
                                    </CopyToClipboard>
                                    <span className='actions-edit' onClick={() => editPassword(pass._id)}>
                                        edit
                                    </span>
                                    <span className='actions-remove' onClick={() => removePassword(pass._id)}>
                                        remove
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
