import React, { useState } from 'react';
import './LeadMagnetGenerator.css';

const LeadMagnetGenerator = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [generatedLeadMagnet, setGeneratedLeadMagnet] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Implement API call to search problems
        setIsLoading(false);
    };

    const handleGenerate = async () => {
        if (!selectedProblem) return;
        
        setIsLoading(true);
        // TODO: Implement API call to generate lead magnet
        setIsLoading(false);
    };

    return (
        <div className="lead-magnet-generator">
            <div className="search-section">
                <h2>Find Your Perfect Lead Magnet</h2>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a problem or topic..."
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            <div className="results-section">
                {isLoading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="problem-list">
                        {/* TODO: Map through problems */}
                    </div>
                )}
            </div>

            {selectedProblem && (
                <div className="generation-section">
                    <h3>Selected Problem: {selectedProblem.title}</h3>
                    <button onClick={handleGenerate} disabled={isLoading}>
                        Generate Lead Magnet
                    </button>
                </div>
            )}

            {generatedLeadMagnet && (
                <div className="preview-section">
                    <h3>Your Lead Magnet</h3>
                    <div className="lead-magnet-preview">
                        {/* TODO: Display generated lead magnet */}
                    </div>
                    <button>Download</button>
                    <button>Share</button>
                </div>
            )}
        </div>
    );
};

export default LeadMagnetGenerator; 