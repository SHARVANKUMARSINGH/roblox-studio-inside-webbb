import React, { useState, useCallback } from 'react';
import { createInitialState } from './state/sceneTree';
import TopBar from './components/TopBar';
import Explorer from './components/Explorer';
import Properties from './components/Properties';
import Viewport from './components/Viewport';
import { generateRbxlx } from './utils/generateRbxlx';
import './App.css';

export default function App() {
  const [tree, setTree] = useState(() => createInitialState());
  const [selectedId, setSelectedId] = useState(null);
  const [publishConfig, setPublishConfig] = useState({
    universeId: '',
    placeId: '',
    apiKey: '',
  });

  const findNode = useCallback((id, node = tree) => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(id, child);
        if (found) return found;
      }
    }
    return null;
  }, [tree]);

  const selectedNode = selectedId ? findNode(selectedId) : null;

  const updateNode = useCallback((id, updates) => {
    setTree(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const update = (node) => {
        if (node.id === id) {
          Object.assign(node, updates);
          return true;
        }
        if (node.children) {
          for (const child of node.children) {
            if (update(child)) return true;
          }
        }
        return false;
      };
      update(clone);
      return clone;
    });
  }, []);

  const addChild = useCallback((parentId, newChild) => {
    setTree(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const find = (node) => {
        if (node.id === parentId) {
          node.children = node.children || [];
          node.children.push(newChild);
          return true;
        }
        if (node.children) {
          for (const child of node.children) {
            if (find(child)) return true;
          }
        }
        return false;
      };
      find(clone);
      return clone;
    });
  }, []);

  const deleteNode = useCallback((id) => {
    setTree(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const remove = (node) => {
        if (node.children) {
          const idx = node.children.findIndex(c => c.id === id);
          if (idx !== -1) {
            node.children.splice(idx, 1);
            return true;
          }
          for (const child of node.children) {
            if (remove(child)) return true;
          }
        }
        return false;
      };
      remove(clone);
      return clone;
    });
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handlePublish = useCallback(async () => {
    const { universeId, placeId, apiKey } = publishConfig;
    if (!universeId || !placeId || !apiKey) {
      alert('Please fill in Universe ID, Place ID, and API Key.');
      return;
    }
    const xml = generateRbxlx(tree);
    const formData = new FormData();
    formData.append('rbxlx', xml);
    formData.append('roblox_key', apiKey);
    formData.append('universe_id', universeId);
    formData.append('place_id', placeId);

    try {
      const res = await fetch('/api/publish', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        alert(`Published successfully! Version: ${data.versionNumber}`);
      } else {
        alert(`Publish failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
  }, [tree, publishConfig]);

  return (
    <div className="app">
      <TopBar
        config={publishConfig}
        setConfig={setPublishConfig}
        onPublish={handlePublish}
      />
      <div className="main-layout">
        <Explorer
          tree={tree}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddChild={addChild}
          onDelete={deleteNode}
        />
        <Viewport
          tree={tree}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <Properties
          node={selectedNode}
          onUpdate={(updates) => selectedId && updateNode(selectedId, updates)}
        />
      </div>
    </div>
  );
}
