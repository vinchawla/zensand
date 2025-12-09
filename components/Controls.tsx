import React, { useState } from 'react';
import { ToolType, SoundState, GenericItemData } from '../types';
import { Eraser, Circle, Trash2, Wind, CloudRain, Music, Radio, Palette, Settings, TreePine, Flower2, Waves, Landmark, AlignCenterVertical, MousePointer2, RotateCw, Download, ChevronUp, ChevronDown, Hammer, Sliders } from 'lucide-react';
import { audioEngine } from '../services/audioService';

interface ControlsProps {
  currentTool: ToolType;
  setTool: (t: ToolType) => void;
  audioState: SoundState;
  setAudioState: React.Dispatch<React.SetStateAction<SoundState>>;
  isAudioInitialized: boolean;
  initAudio: () => void;
  sandColor: string;
  setSandColor: (c: string) => void;
  rakeDepth: number;
  setRakeDepth: (d: number) => void;
  placementScale: number;
  setPlacementScale: (s: number) => void;
  selectedItemData: GenericItemData | null;
  updateSelected: (updates: { scale?: number, rotation?: number }) => void;
  onDownload: () => void;
}

const RakeIcon = ({ size = 20 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8" /><path d="M3 10h18" /><path d="M3 10v11" /><path d="M7.5 10v11" /><path d="M12 10v11" /><path d="M16.5 10v11" /><path d="M21 10v11" /></svg>
);

const PagodaIcon = ({ size = 20 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l-8 4h16l-8-4z" />
        <rect x="6" y="6" width="12" height="4" />
        <path d="M12 2v20" />
        <path d="M4 14l8-4 8 4" />
        <rect x="8" y="14" width="8" height="8" />
    </svg>
);

const BridgeIcon = ({ size = 20 }: { size?: number }) => (
     <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M2 18s2-8 10-8 10 8 10 8" />
         <path d="M2 20h20" />
         <path d="M5 16v4" />
         <path d="M9 13v7" />
         <path d="M15 13v7" />
         <path d="M19 16v4" />
     </svg>
);

const CollapsiblePanel = ({ 
    title, 
    icon, 
    isOpen, 
    setIsOpen, 
    children 
}: { 
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    children?: React.ReactNode;
}) => (
    <div className="bg-stone-900/80 backdrop-blur-md rounded-xl border border-stone-700 shadow-xl w-56 shrink-0 transition-all duration-300 overflow-hidden pointer-events-auto">
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full p-3 flex items-center justify-between text-stone-300 hover:bg-stone-800/50 transition-colors ${isOpen ? 'border-b border-stone-700/50' : ''}`}
        >
            <div className="flex items-center gap-2">
                {icon}
                <span className="font-semibold uppercase tracking-widest text-[10px]">{title}</span>
            </div>
            {isOpen ? <ChevronUp size={14} className="text-stone-500" /> : <ChevronDown size={14} className="text-stone-500" />}
        </button>
        <div 
            className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <div className="p-2 pt-2">
                {children}
            </div>
        </div>
    </div>
);

const Controls: React.FC<ControlsProps> = ({ 
    currentTool, 
    setTool, 
    audioState, 
    setAudioState,
    isAudioInitialized,
    initAudio,
    sandColor,
    setSandColor,
    rakeDepth,
    setRakeDepth,
    placementScale,
    setPlacementScale,
    selectedItemData,
    updateSelected,
    onDownload
}) => {
  const [toolsOpen, setToolsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [audioOpen, setAudioOpen] = useState(true);

  const handleVolumeChange = (channel: keyof SoundState, val: number) => {
    if (!isAudioInitialized) initAudio();
    audioEngine.resume();
    setAudioState(prev => ({ ...prev, [channel]: val }));
    audioEngine.setVolume(channel, val);
  };

  const tools = [
      { id: 'SELECT', icon: <MousePointer2 size={18} />, label: 'Select' },
      { id: 'RAKE', icon: <RakeIcon size={18} />, label: 'Rake' },
      { id: 'SMOOTH', icon: <Eraser size={18} />, label: 'Smooth' },
      { id: 'ROCK', icon: <Circle size={18} />, label: 'Rock' },
      { id: 'BONSAI', icon: <TreePine size={18} />, label: 'Bonsai' },
      { id: 'CHERRY_BLOSSOM', icon: <Flower2 size={18} />, label: 'Cherry' },
      { id: 'POND', icon: <Waves size={18} />, label: 'Pond' },
      { id: 'BRIDGE', icon: <BridgeIcon size={18} />, label: 'Bridge' },
      { id: 'PAGODA', icon: <PagodaIcon size={18} />, label: 'Pagoda' },
      { id: 'DELETE', icon: <Trash2 size={18} />, label: 'Remove' },
  ];

  return (
    <div className="absolute top-0 left-0 h-full p-4 pointer-events-none flex flex-col justify-between z-10 max-h-screen overflow-hidden">
      
      {/* Title */}
      <div className="pointer-events-auto bg-stone-900/60 backdrop-blur-md p-3 rounded-xl border border-stone-800 inline-block mb-2 shrink-0 flex justify-between items-center gap-4">
        <h1 className="text-2xl text-stone-200 font-serif drop-shadow-md tracking-wider mb-0" style={{ fontFamily: 'Cinzel Decorative' }}>ZenSand</h1>
        <button 
          onClick={onDownload} 
          title="Save Garden (Download)"
          className="text-stone-400 hover:text-amber-400 transition-colors"
        >
          <Download size={20} />
        </button>
      </div>

      {/* Main Controls Stack */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-hide min-h-0 pb-4">
        
        {/* Tools Panel */}
        <CollapsiblePanel 
            title="Tools" 
            icon={<Hammer size={14} />} 
            isOpen={toolsOpen} 
            setIsOpen={setToolsOpen}
        >
            <div className="grid grid-cols-2 gap-1">
                {tools.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTool(t.id as ToolType)}
                        className={`p-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center gap-1 group relative
                            ${currentTool === t.id 
                                ? 'bg-amber-700 text-white shadow-md' 
                                : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'}`}
                        title={t.label}
                    >
                        {t.icon}
                        <span className="text-[9px] font-medium leading-none">{t.label}</span>
                    </button>
                ))}
            </div>
        </CollapsiblePanel>

        {/* Settings Panel */}
        <CollapsiblePanel 
            title="Properties" 
            icon={<Sliders size={14} />} 
            isOpen={settingsOpen} 
            setIsOpen={setSettingsOpen}
        >
             {/* Color Row */}
             <div className="flex items-center justify-between mb-2 p-1">
                <div className="text-stone-400 text-xs flex items-center gap-1">
                    <Palette size={14} /> Color
                </div>
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-stone-600 hover:border-amber-500 transition-colors">
                    <input 
                        type="color" 
                        value={sandColor}
                        onChange={(e) => setSandColor(e.target.value)}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 m-0 border-none cursor-pointer"
                    />
                </div>
             </div>

             <div className="h-[1px] bg-stone-700 mb-2"></div>

             {/* Dynamic Slider: Size */}
             <div className="flex items-center gap-2 mb-2 p-1">
                <div 
                    className={`text-stone-400 transition-colors cursor-help ${selectedItemData ? 'text-amber-500' : ''}`} 
                    title={selectedItemData ? "Selected Item Size" : "New Item Size"}
                >
                    <AlignCenterVertical size={16} />
                </div>
                <input 
                    type="range" min="0.2" max="4.0" step="0.1"
                    value={selectedItemData ? selectedItemData.scale : placementScale}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (selectedItemData) {
                            updateSelected({ scale: val });
                        } else {
                            setPlacementScale(val);
                        }
                    }}
                    className={`flex-1 min-w-0 h-1 rounded-lg appearance-none cursor-pointer ${selectedItemData ? 'bg-amber-900/50 accent-amber-500' : 'bg-stone-700 accent-stone-500'}`}
                />
             </div>

             {/* Rotation (Contextual) */}
             {selectedItemData && (
                 <div className="flex items-center gap-2 mb-2 p-1">
                    <div className="text-amber-500 cursor-help" title="Rotation">
                        <RotateCw size={16} />
                    </div>
                    <input 
                        type="range" min="0" max={Math.PI * 2} step="0.1"
                        value={selectedItemData.rotation}
                        onChange={(e) => updateSelected({ rotation: parseFloat(e.target.value) })}
                        className="flex-1 min-w-0 h-1 bg-amber-900/50 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                 </div>
             )}

             {/* Rake Depth (Contextual) */}
             {!selectedItemData && (currentTool === 'RAKE' || currentTool === 'SMOOTH') && (
                 <div className="flex items-center gap-2 mb-2 p-1">
                    <div className="text-stone-400 cursor-help" title="Rake Depth">
                        <Settings size={16} />
                    </div>
                    <input 
                        type="range" min="0.1" max="3.0" step="0.1"
                        value={rakeDepth}
                        onChange={(e) => setRakeDepth(parseFloat(e.target.value))}
                        className="flex-1 min-w-0 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-500"
                    />
                 </div>
             )}
        </CollapsiblePanel>

        {/* Audio Mixer */}
        <CollapsiblePanel 
            title="Sounds" 
            icon={<Music size={14} />} 
            isOpen={audioOpen} 
            setIsOpen={setAudioOpen}
        >
            {!isAudioInitialized ? (
                 <button 
                    onClick={initAudio}
                    className="w-full py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded text-xs transition-colors font-medium"
                 >
                    Initialize Audio Engine
                 </button>
            ) : (
                <div className="space-y-3 pt-1">
                    {[
                        { key: 'wind', icon: <Wind size={12}/>, label: 'Wind' },
                        { key: 'rain', icon: <CloudRain size={12}/>, label: 'Rain' },
                        { key: 'bowls', icon: <Radio size={12}/>, label: 'Bowls' },
                    ].map((item) => (
                        <div key={item.key} className="space-y-1">
                            <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                                <span className="flex items-center gap-1">{item.icon} {item.label}</span>
                            </div>
                            <input 
                                type="range" min="0" max="1" step="0.01"
                                value={(audioState as any)[item.key]}
                                onChange={(e) => handleVolumeChange(item.key as keyof SoundState, parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600 block"
                            />
                        </div>
                    ))}
                </div>
            )}
        </CollapsiblePanel>

      </div>
    </div>
  );
};

export default Controls;