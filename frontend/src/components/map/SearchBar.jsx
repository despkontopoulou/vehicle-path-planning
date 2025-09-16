import { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const submit = async () => {
        if (!query.trim()) return;
        await onSearch(query.trim());
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                value={query}
                placeholder="Search for a location..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <button onClick={submit}>Search</button>
        </div>
    );
}