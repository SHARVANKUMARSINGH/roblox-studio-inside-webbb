import React, { useState } from 'react';
import { createPart, createScript } from '../state/sceneTree';

const CLASS_ICONS = {
  DataModel: '🌐',
  Workspace: '🌍',
  Camera: '📷',
  Terrain: '🏔️',
  Part: '🧱',
  Players: '👥',
  Lighting: '💡',
  ReplicatedFirst: '📦',
  ReplicatedStorage: '📦',
  ServerScriptService: '📜',
  ServerStorage: '🗄️',
  StarterGui: '🖥️',
  StarterPack: '🎒',
  StarterPlayer: '🧑',
  StarterCharacterScripts: '📜',
  StarterPlayerScripts: '📜',
  SoundService: '🔊',
  Script: '📄',
};

const PART_CONTAINERS = ['Workspace'];
const SCRIPT_CONTAINERS = [
  'ServerScriptService', 'StarterPlayerScripts', 'StarterCharacterScripts',
  'ReplicatedStorage', 'ReplicatedFirst', 'StarterGui', 'StarterPack', 'ServerStorage',
];
const USER_CLASSES = ['Part', 'Script'];

function TreeNode({ node, depth, selectedId, onSelect, onAddChild, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const canExpand = hasChildren || PART_CONTAINERS.includes(node.className) || SCRIPT_CONTAINERS.includes(node.className);

  return (
    <div className="tree-node">
      <div
        className={`tree-label${selectedId === node.id ? ' selected' : ''}`}
        style={{ paddingLeft: depth * 14 + 6 }}
        onClick={() => onSelect(node.id)}
      >
        {canExpand && (
          <span className="icon" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
            {expanded ? '▼' : '▶'}
          </span>
        )}
        {!canExpand && <span className="icon" />}
        <span>{CLASS_ICONS[node.className] || '📁'}</span>
        <span>{node.name}</span>
        <div className="tree-actions">
          {PART_CONTAINERS.includes(node.className) && (
            <button onClick={(e) => { e.stopPropagation(); onAddChild(node.id, createPart('Part')); }} title="Add Part">+Part</button>
          )}
          {SCRIPT_CONTAINERS.includes(node.className) && (
            <button onClick={(e) => { e.stopPropagation(); onAddChild(node.id, createScript('Script')); }} title="Add Script">+Script</button>
          )}
          {USER_CLASSES.includes(node.className) && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(node.id); }} title="Delete">✕</button>
          )}
        </div>
      </div>
      {canExpand && expanded && node.children && (
        <div className="tree-children">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Explorer({ tree, selectedId, onSelect, onAddChild, onDelete }) {
  return (
    <div className="explorer">
      <div className="explorer-header">Explorer</div>
      <TreeNode
        node={tree}
        depth={0}
        selectedId={selectedId}
        onSelect={onSelect}
        onAddChild={onAddChild}
        onDelete={onDelete}
      />
    </div>
  );
}
