import React from 'react'

export default function CollectionsPicker({ selected, setSelected }) {
    const images = [
        { name: 'amazon', color: '#FD9B44', website: 'https://amazon.com/' },
        { name: 'apple', color: '#B3B3B3', website: 'https://apple.com/' },
        { name: 'binance', color: '#F3BB41', website: 'https://binance.com/' },
        { name: 'coinbase', color: '#287AF8', website: 'https://coinbase.com/' },
        { name: 'coingecko', color: '#8CC63F', website: 'https://coingecko.com/' },
        { name: 'coinmarketcap', color: '#155CBE', website: 'https://coinmarketcap.com/' },
        { name: 'discord', color: '#5C78F2', website: 'https://discord.com/' },
        { name: 'dropbox', color: '#037EE5', website: 'https://dropbox.com/' },
        { name: 'exodus', color: '#4e7bf9', website: 'https://exodus.com/' },
        { name: 'facebook', color: '#3a5897', website: 'https://facebook.com/' },
        { name: 'ftx', color: '#3A5897', website: 'https://ftx.com/' },
        { name: 'github', color: '#000000', website: 'https://github.com/' },
        { name: 'gmail', color: '#ea453e', website: 'https://mail.google.com/' },
        { name: 'instagram', color: '#ba4a80', website: 'https://instagram.com' },
        { name: 'kraken', color: '#646ede', website: 'https://kraken.com' },
        { name: 'linkedin', color: '#1b75bb', website: 'https://linkedin.com' },
        { name: 'metamask', color: '#f89d42', website: 'https://metamask.io' },
        { name: 'microsoft', color: '#00a5f2', website: 'https://microsoft.com' },
        { name: 'netflix', color: '#e53d3d', website: 'https://netflix.com' },
        { name: 'paypal', color: '#1f264f', website: 'https://paypal.com' },
        { name: 'phantom', color: '#5e76ed', website: 'https://phantom.app' },
        { name: 'reddit', color: '#fb4b43', website: 'https://reddit.com' },
        { name: 'skype', color: '#00aff0', website: 'https://skype.com' },
        { name: 'sorare', color: '#232e51', website: 'https://sorare.com' },
        { name: 'soundcloud', color: '#fc6844', website: 'https://soundcloud.com' },
        { name: 'spotify', color: '#51d862', website: 'https://spotify.com' },
        { name: 'steam', color: '#0e2554', website: 'https://steamcommunity.com/' },
        { name: 'twitch', color: '#6d4b97', website: 'https://twitch.com' },
        { name: 'twitter', color: '#1da1f2', website: 'https://twitter.com' },
        { name: 'vk', color: '#4986cc', website: 'https://vk.com' },
        { name: 'yahoo', color: '#6f4a94', website: 'https://yahoo.com' },
    ]

    const addSelected = name => {
        const data = selected.concat();
        const inArrayIndex = data.findIndex(item => item.name === name);
        if (inArrayIndex === -1) {
            setSelected([...selected, images.find(image => image.name === name)])
        } else {
            setSelected(selected.filter((_, i) => i !== inArrayIndex))
        }
    }

    return (
        <div className='picker'>
            {images.map(image => (
                <div key={image.name} className='picker-collection' onClick={() => addSelected(image.name)} style={{ borderColor: selected.find(item => item.name === image.name) ? image.color : '', transition: '200ms ease' }}>
                    {selected.find(item => item.name === image.name) && <i className="fa fa-check" style={{ color: image.color }}></i>}
                    <img src={`/assets/logos/${image.name}.png`} alt={image.name} />
                    <p>{image.name}</p>
                </div>
            ))}
        </div>
    )
}
