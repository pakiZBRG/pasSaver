import React from 'react'

export default function Filter({ setSearch }) {
    return (
        <div className='filter'>
            <div className='filter-input'>
                <input type='text' onChange={e => setSearch(e.target.value)} placeholder='Search Passwords'/>
                <i className='fa fa-search'></i>
            </div>
        </div>
    )
}
