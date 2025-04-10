import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeTab, setActiveTab] = useState('facebook');

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Social Outreach Platform</title>
        <meta name="description" content="Unified platform for social media outreach" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Social Outreach Platform</h1>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('facebook')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'facebook' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Facebook
          </button>
          <button
            onClick={() => setActiveTab('twitter')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'twitter' ? 'bg-blue-400 text-white' : 'bg-gray-200'
            }`}
          >
            Twitter
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'instagram' ? 'bg-pink-600 text-white' : 'bg-gray-200'
            }`}
          >
            Instagram
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'facebook' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Facebook Outreach</h2>
              <p>Connect your Facebook account to start outreach campaigns.</p>
            </div>
          )}
          
          {activeTab === 'twitter' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Twitter Outreach</h2>
              <p>Connect your Twitter account to start outreach campaigns.</p>
            </div>
          )}
          
          {activeTab === 'instagram' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Instagram Outreach</h2>
              <p>Connect your Instagram account to start outreach campaigns.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
