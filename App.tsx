import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ZenGarden from './components/ZenGarden';
import Controls from './components/Controls';
import ZenCompanion from './components/ZenCompanion';
import { ToolType, RockData, BonsaiData, CherryBlossomData, BridgeData, PagodaData, PondData, SoundState, Selection, ItemCategory } from './types';
import { audioEngine } from './services/audioService';

const App: React.FC = () => {
  const [currentTool, setTool] = useState<ToolType>('RAKE');
  
  // Item States
  const [rocks, setRocks] = useState<RockData[]>([]);
  const [bonsai, setBonsai] = useState<BonsaiData[]>([]);
  const [cherryBlossoms, setCherryBlossoms] = useState<CherryBlossomData[]>([]);
  const [bridges, setBridges] = useState<BridgeData[]>([]);
  const [pagodas, setPagodas] = useState<PagodaData[]>([]);
  const [ponds, setPonds] = useState<PondData[]>([]);

  // Selection State
  const [selection, setSelection] = useState<Selection | null>(null);

  // Settings
  const [sandColor, setSandColor] = useState<string>('#e6dccd');
  const [rakeDepth, setRakeDepth] = useState<number>(1.5);
  const [placementScale, setPlacementScale] = useState<number>(1.0);
  
  // Audio State
  const [audioState, setAudioState] = useState<SoundState>({
    wind: 0,
    rain: 0,
    bowls: 0,
    whiteNoise: 0
  });
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  // Persistence: Load on Mount
  useEffect(() => {
    const saved = localStorage.getItem('zenGardenState');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.rocks) setRocks(data.rocks);
        if (data.bonsai) setBonsai(data.bonsai);
        if (data.cherryBlossoms) setCherryBlossoms(data.cherryBlossoms);
        if (data.bridges) setBridges(data.bridges);
        if (data.pagodas) setPagodas(data.pagodas);
        if (data.ponds) setPonds(data.ponds);
        if (data.sandColor) setSandColor(data.sandColor);
        if (data.rakeDepth) setRakeDepth(data.rakeDepth);
      } catch (e) {
        console.error("Failed to load garden state", e);
      }
    }
  }, []);

  // Persistence: Save on Change
  useEffect(() => {
    const state = {
      rocks, bonsai, cherryBlossoms, bridges, pagodas, ponds,
      sandColor, rakeDepth
    };
    localStorage.setItem('zenGardenState', JSON.stringify(state));
  }, [rocks, bonsai, cherryBlossoms, bridges, pagodas, ponds, sandColor, rakeDepth]);

  const initAudio = () => {
    if (!isAudioInitialized) {
        audioEngine.init();
        setIsAudioInitialized(true);
    }
  };

  const downloadGarden = useCallback(() => {
    const state = {
      rocks, bonsai, cherryBlossoms, bridges, pagodas, ponds,
      sandColor, rakeDepth, timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zen-garden-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [rocks, bonsai, cherryBlossoms, bridges, pagodas, ponds, sandColor, rakeDepth]);

  // Helper to get currently selected item data
  const selectedItemData = useMemo(() => {
    if (!selection) return null;
    switch (selection.type) {
        case 'rock': return rocks.find(i => i.id === selection.id);
        case 'bonsai': return bonsai.find(i => i.id === selection.id);
        case 'cherry': return cherryBlossoms.find(i => i.id === selection.id);
        case 'bridge': return bridges.find(i => i.id === selection.id);
        case 'pagoda': return pagodas.find(i => i.id === selection.id);
        case 'pond': return ponds.find(i => i.id === selection.id);
        default: return null;
    }
  }, [selection, rocks, bonsai, cherryBlossoms, bridges, pagodas, ponds]);

  // Helper to update selected item
  const updateSelected = (updates: { scale?: number, rotation?: number }) => {
      if (!selection) return;
      const { id, type } = selection;
      
      const updater = (list: any[]) => list.map(item => item.id === id ? { ...item, ...updates } : item);

      if (type === 'rock') setRocks(updater);
      else if (type === 'bonsai') setBonsai(updater);
      else if (type === 'cherry') setCherryBlossoms(updater);
      else if (type === 'bridge') setBridges(updater);
      else if (type === 'pagoda') setPagodas(updater);
      else if (type === 'pond') setPonds(updater);
  };

  const handleToolChange = (tool: ToolType) => {
      // If clicking select while already in select mode, clear selection
      if (tool === 'SELECT' && currentTool === 'SELECT') {
          setSelection(null);
      }
      
      setTool(tool);
      if (tool !== 'SELECT') {
          setSelection(null);
      }
  }

  return (
    // Use h-[100dvh] for mobile browsers to account for the address bar
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-neutral-900">
      
      {/* 3D Viewport */}
      <ZenGarden 
        tool={currentTool} 
        rocks={rocks} 
        setRocks={setRocks} 
        bonsai={bonsai}
        setBonsai={setBonsai}
        cherryBlossoms={cherryBlossoms}
        setCherryBlossoms={setCherryBlossoms}
        bridges={bridges}
        setBridges={setBridges}
        pagodas={pagodas}
        setPagodas={setPagodas}
        ponds={ponds}
        setPonds={setPonds}
        sandColor={sandColor}
        rakeDepth={rakeDepth}
        placementScale={placementScale}
        selection={selection}
        setSelection={setSelection}
      />

      {/* HUD Layer */}
      <Controls 
        currentTool={currentTool}
        setTool={handleToolChange}
        audioState={audioState}
        setAudioState={setAudioState}
        isAudioInitialized={isAudioInitialized}
        initAudio={initAudio}
        sandColor={sandColor}
        setSandColor={setSandColor}
        rakeDepth={rakeDepth}
        setRakeDepth={setRakeDepth}
        placementScale={placementScale}
        setPlacementScale={setPlacementScale}
        selectedItemData={selectedItemData || null}
        updateSelected={updateSelected}
        onDownload={downloadGarden}
      />

      {/* Chat Bot */}
      <ZenCompanion />
      
    </div>
  );
};

export default App;