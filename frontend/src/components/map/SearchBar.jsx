import { useMap } from 'react-leaflet';
import { useState } from 'react';

export default function SearchBar() {
    const map = useMap();
    const [query, setQuery] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) return;

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

        try {
            const response = await fetch(url);
            const results = await response.json();
            console.log("Search results:", results);

            if (results.length > 0) {
                const { lat, lon } = results[0];
                map.setView([parseFloat(lat), parseFloat(lon)], 15);
            } else {
                alert('Location not found.');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('Search failed. Please check your internet or try again.');
        }
    };


    return (
        <div
            className="search-bar"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <input
                type="text"
                value={query}
                placeholder="Search for a location..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}
