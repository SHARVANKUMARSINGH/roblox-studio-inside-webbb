import React from 'react';

export default function Properties({ node, onUpdate }) {
  if (!node) {
    return (
      <div className="properties">
        <div className="properties-header">Properties</div>
        <div className="empty-props">Select an item to view properties</div>
      </div>
    );
  }

  const updateVec = (field, axis, value) => {
    const vec = [...(node[field] || [0, 0, 0])];
    vec[axis] = parseFloat(value) || 0;
    onUpdate({ [field]: vec });
  };

  return (
    <div className="properties">
      <div className="properties-header">Properties — {node.className}</div>
      <div className="properties-body">
        <div className="prop-group">
          <label>Name</label>
          <input value={node.name} onChange={(e) => onUpdate({ name: e.target.value })} />
        </div>

        {node.className === 'Part' && (
          <>
            <label style={{ fontSize: 11, color: '#999', marginBottom: 4, display: 'block' }}>Position</label>
            <div className="prop-row">
              <div className="prop-group">
                <label>X</label>
                <input type="number" value={node.position?.[0] ?? 0} onChange={(e) => updateVec('position', 0, e.target.value)} />
              </div>
              <div className="prop-group">
                <label>Y</label>
                <input type="number" value={node.position?.[1] ?? 0} onChange={(e) => updateVec('position', 1, e.target.value)} />
              </div>
              <div className="prop-group">
                <label>Z</label>
                <input type="number" value={node.position?.[2] ?? 0} onChange={(e) => updateVec('position', 2, e.target.value)} />
              </div>
            </div>

            <label style={{ fontSize: 11, color: '#999', marginBottom: 4, display: 'block' }}>Size</label>
            <div className="prop-row">
              <div className="prop-group">
                <label>X</label>
                <input type="number" value={node.size?.[0] ?? 4} onChange={(e) => updateVec('size', 0, e.target.value)} />
              </div>
              <div className="prop-group">
                <label>Y</label>
                <input type="number" value={node.size?.[1] ?? 1} onChange={(e) => updateVec('size', 1, e.target.value)} />
              </div>
              <div className="prop-group">
                <label>Z</label>
                <input type="number" value={node.size?.[2] ?? 2} onChange={(e) => updateVec('size', 2, e.target.value)} />
              </div>
            </div>

            <div className="prop-group">
              <label>Color</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="color"
                  value={node.color || '#6485b3'}
                  onChange={(e) => onUpdate({ color: e.target.value })}
                  style={{ width: 36, height: 28, padding: 0, border: 'none', cursor: 'pointer' }}
                />
                <input
                  value={node.color || '#6485b3'}
                  onChange={(e) => onUpdate({ color: e.target.value })}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </>
        )}

        {node.className === 'Script' && (
          <div className="prop-group">
            <label>Source</label>
            <textarea
              value={node.source || ''}
              onChange={(e) => onUpdate({ source: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
