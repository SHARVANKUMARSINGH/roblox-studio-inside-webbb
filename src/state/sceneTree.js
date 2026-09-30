let _id = 100;

function getId() {
  return `node-${_id++}`;
}

export function createPart(name) {
  return {
    id: getId(),
    name: name || 'Part',
    className: 'Part',
    children: [],
    position: [0, 2, 0],
    size: [4, 1, 2],
    color: '#6485b3',
    anchored: true,
  };
}

export function createScript(name) {
  return {
    id: getId(),
    name: name || 'Script',
    className: 'Script',
    children: [],
    source: 'print("Hello World")',
  };
}

export function createInitialState() {
  return {
    id: 'node-root',
    name: 'Game',
    className: 'DataModel',
    children: [
      {
        id: getId(),
        name: 'Workspace',
        className: 'Workspace',
        children: [
          {
            id: getId(),
            name: 'Camera',
            className: 'Camera',
            children: []
          },
          {
            id: getId(),
            name: 'Terrain',
            className: 'Terrain',
            children: []
          },
          {
            id: getId(),
            name: 'Baseplate',
            className: 'Part',
            children: [],
            position: [0, -10, 0],
            size: [512, 20, 512],
            color: '#5a5a5a',
            anchored: true
          }
        ]
      },
      {
        id: getId(),
        name: 'Players',
        className: 'Players',
        children: []
      },
      {
        id: getId(),
        name: 'Lighting',
        className: 'Lighting',
        children: []
      },
      {
        id: getId(),
        name: 'ReplicatedFirst',
        className: 'ReplicatedFirst',
        children: []
      },
      {
        id: getId(),
        name: 'ReplicatedStorage',
        className: 'ReplicatedStorage',
        children: []
      },
      {
        id: getId(),
        name: 'ServerScriptService',
        className: 'ServerScriptService',
        children: []
      },
      {
        id: getId(),
        name: 'ServerStorage',
        className: 'ServerStorage',
        children: []
      },
      {
        id: getId(),
        name: 'StarterGui',
        className: 'StarterGui',
        children: []
      },
      {
        id: getId(),
        name: 'StarterPack',
        className: 'StarterPack',
        children: []
      },
      {
        id: getId(),
        name: 'StarterPlayer',
        className: 'StarterPlayer',
        children: [
          {
            id: getId(),
            name: 'StarterCharacterScripts',
            className: 'StarterCharacterScripts',
            children: []
          },
          {
            id: getId(),
            name: 'StarterPlayerScripts',
            className: 'StarterPlayerScripts',
            children: []
          }
        ]
      },
      {
        id: getId(),
        name: 'SoundService',
        className: 'SoundService',
        children: []
      }
    ]
  };
}
