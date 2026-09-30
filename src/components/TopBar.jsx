import React from 'react';

export default function TopBar({ config, setConfig, onPublish }) {
  const update = (key) => (e) => setConfig(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="top-bar">
      <span style={{ fontWeight: 700, fontSize: 13, marginRight: 8 }}>🔧 Roblox Studio Web</span>
      <input placeholder="Universe ID" value={config.universeId} onChange={update('universeId')} />
      <input placeholder="Place ID" value={config.placeId} onChange={update('placeId')} />
      <input placeholder="API Key" type="password" value={config.apiKey} onChange={update('apiKey')} />
      <button onClick={onPublish}>Publish</button>
    </div>
  );
}
