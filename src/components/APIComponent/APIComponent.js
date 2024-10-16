import React, { useState } from 'react';
import { GetAPIRes } from '../../services/APIServices';
import "./APIComponent.css";

function APIComponent() {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAPIRes = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetAPIRes();
            setResponse(res);
        } catch (error) {
            setError("Failed to fetch API response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='APIDiv'>
            {loading && <p>Loading...</p>}

            {error && <p className="error">{error}</p>}

            {response ? (
                <>
                    <p>ID: {response.id}</p>
                    <p>Title: {response.title}</p>
                    <p>Completed: {response.completed ? "Yes" : "No"}</p>
                </>
            ) : (
                <button onClick={handleAPIRes} disabled={loading}>
                    Get API Response
                </button>
            )}
        </div>
    );
}

export default APIComponent;
