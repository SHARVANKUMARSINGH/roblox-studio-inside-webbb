// generateRbxlx.js — Converts the scene tree into Roblox XML (.rbxlx)

let _refId = 0;
function newRef() {
  return 'RBX' + crypto.randomUUID().replace(/-/g, '').toUpperCase().slice(0, 32);
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function hexToRobloxColor3(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

function buildPartProperties(node) {
  const [px, py, pz] = node.position || [0, 0, 0];
  const [sx, sy, sz] = node.size || [4, 1, 2];
  const color = hexToRobloxColor3(node.color || '#6485b3');

  return `
      <Properties>
        <string name="Name">${escapeXml(node.name)}</string>
        <bool name="Anchored">${node.anchored !== false ? 'true' : 'false'}</bool>
        <Vector3 name="size">
          <X>${sx}</X><Y>${sy}</Y><Z>${sz}</Z>
        </Vector3>
        <CoordinateFrame name="CFrame">
          <X>${px}</X><Y>${py}</Y><Z>${pz}</Z>
          <R00>1</R00><R01>0</R01><R02>0</R02>
          <R10>0</R10><R11>1</R11><R12>0</R12>
          <R20>0</R20><R21>0</R21><R22>1</R22>
        </CoordinateFrame>
        <Color3 name="Color3uint8">
          <R>${color.r}</R><G>${color.g}</G><B>${color.b}</B>
        </Color3>
        <token name="shape">1</token>
        <string name="Material">SmoothPlastic</string>
      </Properties>`;
}

function buildScriptProperties(node) {
  return `
      <Properties>
        <string name="Name">${escapeXml(node.name)}</string>
        <ProtectedString name="Source"><![CDATA[${node.source || ''}]]></ProtectedString>
      </Properties>`;
}

function buildServiceProperties(node) {
  return `
      <Properties>
        <string name="Name">${escapeXml(node.name)}</string>
      </Properties>`;
}

function buildNode(node, indent = '  ') {
  const ref = newRef();
  const className = node.className || 'Folder';
  let props;

  switch (className) {
    case 'Part':
      props = buildPartProperties(node);
      break;
    case 'Script':
      props = buildScriptProperties(node);
      break;
    default:
      props = buildServiceProperties(node);
      break;
  }

  let xml = `${indent}<Item class="${className}" referent="${ref}">${props}\n`;

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      xml += buildNode(child, indent + '  ');
    }
  }

  xml += `${indent}</Item>\n`;
  return xml;
}

export function generateRbxlx(tree) {
  let xml = `<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">\n`;

  if (tree.children) {
    for (const service of tree.children) {
      xml += buildNode(service);
    }
  }

  xml += `</roblox>\n`;
  return xml;
}
