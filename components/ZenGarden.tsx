import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ToolType, RockData, BonsaiData, CherryBlossomData, BridgeData, PagodaData, PondData, Selection, ItemCategory } from '../types';

// Constants
const PLANE_SIZE = 20;
const CANVAS_RES = 1024; // Resolution for the bump map

interface ZenGardenProps {
  tool: ToolType;
  rocks: RockData[];
  setRocks: React.Dispatch<React.SetStateAction<RockData[]>>;
  bonsai: BonsaiData[];
  setBonsai: React.Dispatch<React.SetStateAction<BonsaiData[]>>;
  cherryBlossoms: CherryBlossomData[];
  setCherryBlossoms: React.Dispatch<React.SetStateAction<CherryBlossomData[]>>;
  bridges: BridgeData[];
  setBridges: React.Dispatch<React.SetStateAction<BridgeData[]>>;
  pagodas: PagodaData[];
  setPagodas: React.Dispatch<React.SetStateAction<PagodaData[]>>;
  ponds: PondData[];
  setPonds: React.Dispatch<React.SetStateAction<PondData[]>>;
  sandColor: string;
  rakeDepth: number;
  placementScale: number;
  selection: Selection | null;
  setSelection: React.Dispatch<React.SetStateAction<Selection | null>>;
}

interface GenericItemProps<T> {
  data: T;
  onClick: (e: any) => void;
  onPointerDown?: (e: any) => void;
  isSelected?: boolean;
}

const SelectionRing: React.FC<{ scale: number }> = ({ scale }) => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[scale * 0.8, scale * 0.9, 32]} />
        <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} transparent opacity={0.8} toneMapped={false} />
    </mesh>
);

const Rock: React.FC<GenericItemProps<RockData>> = ({ data, onClick, onPointerDown, isSelected }) => {
    const geometry = useMemo(() => {
        let geo;
        if (data.type === 0) geo = new THREE.DodecahedronGeometry(data.scale, 0);
        else if (data.type === 1) geo = new THREE.IcosahedronGeometry(data.scale, 0);
        else geo = new THREE.TetrahedronGeometry(data.scale, 1);
        geo.translate(0, data.scale * 0.4, 0); 
        geo.computeVertexNormals();
        return geo;
    }, [data.type, data.scale]);

    return (
        <group position={data.position as any} rotation={[0, data.rotation, 0]}>
            <mesh 
                onClick={(e) => { e.stopPropagation(); onClick(e); }}
                onPointerDown={onPointerDown}
                geometry={geometry}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial color="#5a5a5a" roughness={0.9} metalness={0.1} />
            </mesh>
            {isSelected && <SelectionRing scale={data.scale} />}
        </group>
    );
};

const Bonsai: React.FC<GenericItemProps<BonsaiData>> = ({ data, onClick, onPointerDown, isSelected }) => {
    return (
        <group 
            position={data.position as any} 
            rotation={[0, data.rotation, 0]}
            scale={[data.scale, data.scale, data.scale]}
            onClick={(e) => { e.stopPropagation(); onClick(e); }}
            onPointerDown={onPointerDown}
        >
             <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                 <boxGeometry args={[0.8, 0.3, 0.6]} />
                 <meshStandardMaterial color="#3E2723" roughness={0.8} />
             </mesh>
             <mesh position={[0, 0.36, 0]} rotation={[-Math.PI/2, 0, 0]}>
                 <planeGeometry args={[0.7, 0.5]} />
                 <meshStandardMaterial color="#1a1a1a" roughness={1} side={THREE.DoubleSide}/>
             </mesh>
             {/* Trunk */}
             <mesh position={[0, 0.6, 0]} castShadow>
                 <cylinderGeometry args={[0.06, 0.1, 0.8, 6]} />
                 <meshStandardMaterial color="#5D4037" roughness={0.9} />
             </mesh>
             {/* Foliage */}
             <mesh position={[0.25, 1.3, 0]} castShadow>
                 <dodecahedronGeometry args={[0.3, 0]} />
                 <meshStandardMaterial color="#2E7D32" roughness={0.8} />
             </mesh>
             <mesh position={[-0.25, 1.1, 0.1]} castShadow>
                 <dodecahedronGeometry args={[0.25, 0]} />
                 <meshStandardMaterial color="#388E3C" roughness={0.8} />
             </mesh>
             {isSelected && <SelectionRing scale={1.2} />}
        </group>
    );
}

const CherryBlossom: React.FC<GenericItemProps<CherryBlossomData>> = ({ data, onClick, onPointerDown, isSelected }) => {
    return (
        <group 
            position={data.position as any} 
            rotation={[0, data.rotation, 0]}
            scale={[data.scale, data.scale, data.scale]}
            onClick={(e) => { e.stopPropagation(); onClick(e); }}
            onPointerDown={onPointerDown}
        >
             {/* Trunk */}
             <mesh position={[0, 1.0, 0]} castShadow>
                 <cylinderGeometry args={[0.15, 0.25, 2, 8]} />
                 <meshStandardMaterial color="#4A3728" roughness={0.9} />
             </mesh>
             {/* Branches */}
             <mesh position={[0.3, 1.8, 0]} rotation={[0, 0, -0.6]} castShadow>
                 <cylinderGeometry args={[0.08, 0.12, 1.2, 6]} />
                 <meshStandardMaterial color="#4A3728" roughness={0.9} />
             </mesh>
             <mesh position={[-0.3, 1.6, 0]} rotation={[0, 0, 0.6]} castShadow>
                 <cylinderGeometry args={[0.08, 0.12, 1, 6]} />
                 <meshStandardMaterial color="#4A3728" roughness={0.9} />
             </mesh>
             
             {/* Blossoms */}
             <mesh position={[0, 2.5, 0]} castShadow>
                 <sphereGeometry args={[1.0, 7, 7]} />
                 <meshStandardMaterial color="#FFB7C5" roughness={0.8} />
             </mesh>
             <mesh position={[0.8, 2.0, 0]} castShadow>
                 <sphereGeometry args={[0.7, 7, 7]} />
                 <meshStandardMaterial color="#FFC0CB" roughness={0.8} />
             </mesh>
             <mesh position={[-0.8, 1.9, 0.3]} castShadow>
                 <sphereGeometry args={[0.7, 7, 7]} />
                 <meshStandardMaterial color="#FFB7C5" roughness={0.8} />
             </mesh>
             {/* Falling petals (static for now) */}
             <mesh position={[0.5, 0.1, 0.5]} rotation={[-Math.PI/2, 0, 0]}>
                 <circleGeometry args={[0.6, 5]} />
                 <meshStandardMaterial color="#FFB7C5" transparent opacity={0.6} side={THREE.DoubleSide} />
             </mesh>
             {isSelected && <SelectionRing scale={2.5} />}
        </group>
    );
}

const Bridge: React.FC<GenericItemProps<BridgeData>> = ({ data, onClick, onPointerDown, isSelected }) => {
    const { deckGeometry, railingGeometry } = useMemo(() => {
        const span = 3;
        const height = 1.0; // High arch
        const width = 1;
        const thickness = 0.15;
        
        // Deck Shape (Side profile)
        const deckShape = new THREE.Shape();
        deckShape.moveTo(-span/2, 0);
        deckShape.quadraticCurveTo(0, height, span/2, 0);
        deckShape.lineTo(span/2, -thickness);
        deckShape.quadraticCurveTo(0, height - thickness, -span/2, -thickness);
        deckShape.closePath();
        
        // Extrude along Z (width)
        const deckGeo = new THREE.ExtrudeGeometry(deckShape, { 
            depth: width, 
            bevelEnabled: false, 
            curveSegments: 32 
        });
        deckGeo.translate(0, 0, -width/2); // Center on Z axis

        // Railing Shape (Top Handrail)
        const railHeightOffset = 0.4;
        const railThickness = 0.08;
        const railShape = new THREE.Shape();
        railShape.moveTo(-span/2, railHeightOffset);
        railShape.quadraticCurveTo(0, height + railHeightOffset, span/2, railHeightOffset);
        railShape.lineTo(span/2, railHeightOffset - railThickness);
        railShape.quadraticCurveTo(0, height + railHeightOffset - railThickness, -span/2, railHeightOffset - railThickness);
        railShape.closePath();

        const railGeo = new THREE.ExtrudeGeometry(railShape, { 
            depth: 0.1, 
            bevelEnabled: false, 
            curveSegments: 32 
        });
        railGeo.translate(0, 0, -0.05); // Center on Z axis relative to position

        return { deckGeometry: deckGeo, railingGeometry: railGeo };
    }, []);

    return (
        <group 
            position={data.position as any} 
            rotation={[0, data.rotation, 0]}
            scale={[data.scale, data.scale, data.scale]}
            onClick={(e) => { e.stopPropagation(); onClick(e); }}
            onPointerDown={onPointerDown}
        >
             {/* Deck */}
             <mesh geometry={deckGeometry} castShadow receiveShadow>
                 <meshStandardMaterial color="#8B0000" roughness={0.7} />
             </mesh>
             
             {/* Railings */}
             <mesh geometry={railingGeometry} position={[0, 0, -0.45]} castShadow>
                <meshStandardMaterial color="#A52A2A" roughness={0.7} />
             </mesh>
             <mesh geometry={railingGeometry} position={[0, 0, 0.45]} castShadow>
                <meshStandardMaterial color="#A52A2A" roughness={0.7} />
             </mesh>

             {/* Posts following curve */}
             {[-1.2, -0.7, 0, 0.7, 1.2].map((x, i) => {
                 // Calculate height on parabola y = -ax^2 + h
                 // Vertex (0, 1.0), Root (1.5, 0) => a = 1.0 / (1.5^2) = 0.444
                 const yOnArch = -0.444 * x * x + 1.0;
                 return (
                     <group key={i} position={[x, yOnArch, 0]}> 
                        <mesh position={[0, 0.2, 0.45]} castShadow>
                            <boxGeometry args={[0.08, 0.4, 0.08]} />
                            <meshStandardMaterial color="#8B0000" />
                        </mesh>
                        <mesh position={[0, 0.2, -0.45]} castShadow>
                            <boxGeometry args={[0.08, 0.4, 0.08]} />
                            <meshStandardMaterial color="#8B0000" />
                        </mesh>
                     </group>
                 )
             })}
             
             {isSelected && <SelectionRing scale={2.5} />}
        </group>
    );
}

const Pagoda: React.FC<GenericItemProps<PagodaData>> = ({ data, onClick, onPointerDown, isSelected }) => {
    return (
        <group 
            position={data.position as any} 
            rotation={[0, data.rotation, 0]}
            scale={[data.scale, data.scale, data.scale]}
            onClick={(e) => { e.stopPropagation(); onClick(e); }}
            onPointerDown={onPointerDown}
        >
             {/* Base */}
             <mesh position={[0, 0.2, 0]} castShadow>
                 <boxGeometry args={[0.8, 0.4, 0.8]} />
                 <meshStandardMaterial color="#5D4037" roughness={0.9} />
             </mesh>
             {/* Tier 1 Roof */}
             <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI/4, 0]} castShadow>
                 <coneGeometry args={[1.0, 0.4, 4]} />
                 <meshStandardMaterial color="#3E2723" roughness={0.8} />
             </mesh>
             {/* Tier 2 Base */}
             <mesh position={[0, 0.8, 0]} castShadow>
                 <boxGeometry args={[0.6, 0.4, 0.6]} />
                 <meshStandardMaterial color="#8D6E63" roughness={0.9} />
             </mesh>
             {/* Tier 2 Roof */}
             <mesh position={[0, 1.1, 0]} rotation={[0, Math.PI/4, 0]} castShadow>
                 <coneGeometry args={[0.8, 0.4, 4]} />
                 <meshStandardMaterial color="#3E2723" roughness={0.8} />
             </mesh>
              {/* Spire */}
             <mesh position={[0, 1.4, 0]} castShadow>
                 <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
                 <meshStandardMaterial color="#D7CCC8" roughness={0.5} />
             </mesh>
             {isSelected && <SelectionRing scale={1.5} />}
        </group>
    );
}

const Pond: React.FC<GenericItemProps<PondData>> = ({ data, onClick, onPointerDown, isSelected }) => {
    // Generate an organic, irregular shape based on the ID for consistency
    const geometry = useMemo(() => {
        const segments = 64;
        const geo = new THREE.CircleGeometry(1.5, segments);
        const posAttribute = geo.attributes.position;
        const vertex = new THREE.Vector3();

        // Seed RNG based on ID
        let seed = 0;
        for (let i = 0; i < data.id.length; i++) seed += data.id.charCodeAt(i);
        const rng = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); };
        
        // Generate random phases for distortion
        const phase1 = rng() * Math.PI * 2;
        const phase2 = rng() * Math.PI * 2;
        const phase3 = rng() * Math.PI * 2;

        // Perturb vertices (skipping center at index 0)
        for (let i = 1; i < posAttribute.count; i++) {
            vertex.fromBufferAttribute(posAttribute, i);
            const angle = Math.atan2(vertex.y, vertex.x);
            
            // Organic distortion formula
            const r = 1.0 + 
                      0.2 * Math.sin(angle * 3 + phase1) + 
                      0.1 * Math.sin(angle * 5 + phase2) +
                      0.05 * Math.sin(angle * 7 + phase3);

            vertex.x *= r;
            vertex.y *= r;
            
            posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        geo.computeBoundingSphere();
        return geo;
    }, [data.id]);

    return (
        <group 
            position={data.position as any} 
            rotation={[0, data.rotation, 0]}
            scale={[data.scale, data.scale, data.scale]}
            onClick={(e) => { e.stopPropagation(); onClick(e); }}
            onPointerDown={onPointerDown}
        >
             {/* Realistic Water Surface */}
             <mesh geometry={geometry} rotation={[-Math.PI/2, 0, 0]} receiveShadow position={[0, 0.05, 0]}>
                 <meshPhysicalMaterial 
                    color="#89CFF0"
                    roughness={0.05}
                    metalness={0.1}
                    transmission={0.8}
                    thickness={0.5}
                    ior={1.33}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                    transparent
                    opacity={0.85}
                    side={THREE.DoubleSide}
                 />
             </mesh>
             {isSelected && <SelectionRing scale={3.0} />}
        </group>
    );
}

interface SandPlaneProps { 
    tool: ToolType;
    onAddItem: (type: ToolType, pos: THREE.Vector3) => void;
    sandColor: string;
    setControlsEnabled: (enabled: boolean) => void;
    rakeDepth: number;
    onStartDrag: (e: any) => void;
}

const SandPlane = ({ tool, onAddItem, sandColor, setControlsEnabled, rakeDepth, onStartDrag }: SandPlaneProps) => {
  const { gl } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const isDrawing = useRef(false);
  const lastUV = useRef<THREE.Vector2 | null>(null);
  
  // Create bump map canvas (for raking)
  const { canvas, ctx } = useMemo(() => {
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_RES;
      canvas.height = CANVAS_RES;
      const ctx = canvas.getContext('2d');
      if (ctx) {
          ctx.fillStyle = '#808080';
          ctx.fillRect(0, 0, CANVAS_RES, CANVAS_RES);
      }
      return { canvas, ctx };
  }, []);

  const bumpTexture = useMemo(() => {
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.NoColorSpace; 
      // Max anisotropy to prevent shimmering at oblique angles
      texture.anisotropy = gl.capabilities.getMaxAnisotropy();
      return texture;
  }, [canvas, gl]);

  const drawBrush = (x: number, y: number, isSmooth: boolean) => {
      if (!ctx) return;
      ctx.save();
      ctx.beginPath();

      if (isSmooth) {
          const radiusBase = 60;
          ctx.fillStyle = 'rgba(128, 128, 128, 1.0)';
          
          // Draw circle for erasing
          ctx.beginPath();
          ctx.arc(x, y, radiusBase, 0, Math.PI * 2);
          ctx.fill();

      } else {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; 
          ctx.shadowBlur = 2;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          
          const tineCount = 4;
          const spacing = 12;
          const radiusBase = 3;
          
          for(let i = 0; i < tineCount; i++) {
              const offset = (i - (tineCount-1)/2) * spacing;
              const tX = x + offset; 
              const tY = y + offset; 
              
              ctx.beginPath();
              ctx.arc(tX, tY, radiusBase, 0, Math.PI * 2);
              ctx.fill();
              
              // Highlight
              ctx.beginPath();
              ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
              ctx.shadowBlur = 2;
              ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
              ctx.arc(tX + 4, tY + 4, radiusBase, 0, Math.PI * 2);
              ctx.fill();
              
              ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
              ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
              ctx.shadowBlur = 2;
          }
      }
      ctx.restore();
      bumpTexture.needsUpdate = true;
  };

  const interpolateAndDraw = (uv: THREE.Vector2, isSmooth: boolean) => {
      const x = uv.x * CANVAS_RES;
      const y = (1 - uv.y) * CANVAS_RES;

      if (lastUV.current) {
          const lastX = lastUV.current.x * CANVAS_RES;
          const lastY = (1 - lastUV.current.y) * CANVAS_RES;
          const dist = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
          const steps = Math.ceil(dist / 4);
          
          for (let i = 1; i <= steps; i++) {
              const t = i / steps;
              const lerpX = lastX + (x - lastX) * t;
              const lerpY = lastY + (y - lastY) * t;
              drawBrush(lerpX, lerpY, isSmooth);
          }
      } else {
          drawBrush(x, y, isSmooth);
      }
      lastUV.current = uv.clone();
  };

  const handlePointerDown = (e: any) => {
      if (['ROCK', 'BONSAI', 'CHERRY_BLOSSOM', 'BRIDGE', 'PAGODA', 'POND'].includes(tool)) {
          e.stopPropagation();
          onAddItem(tool, e.point);
      } else if ((tool === 'RAKE' || tool === 'SMOOTH') && e.uv) {
           e.stopPropagation();
           setControlsEnabled(false);
           isDrawing.current = true;
           lastUV.current = null;
           (gl.domElement as HTMLElement).setPointerCapture(e.pointerId);
           interpolateAndDraw(e.uv, tool === 'SMOOTH');
      } else if (tool === 'SELECT') {
           e.stopPropagation();
           onStartDrag(e);
      }
  };

  const handlePointerUp = (e: any) => {
      if (isDrawing.current) {
          isDrawing.current = false;
          lastUV.current = null;
          setControlsEnabled(true);
          (gl.domElement as HTMLElement).releasePointerCapture(e.pointerId);
      }
  };

  const handlePointerMove = (e: any) => {
    if (isDrawing.current) {
        if (e.uv) {
            interpolateAndDraw(e.uv, tool === 'SMOOTH');
        } else {
            lastUV.current = null;
        }
    }
  };

  return (
    <group>
        {/* The Sand Surface */}
        <mesh 
            ref={meshRef} 
            rotation={[-Math.PI / 2, 0, 0]} 
            receiveShadow
            castShadow={false}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <planeGeometry args={[PLANE_SIZE, PLANE_SIZE, 1, 1]} />
            <meshStandardMaterial 
                color={sandColor} 
                roughness={0.7}
                bumpMap={bumpTexture}
                bumpScale={rakeDepth}
                side={THREE.FrontSide}
            />
        </mesh>

        {/* The Garden Bed (Border) - Rectangular Box */}
        {/* Top */}
        <mesh position={[0, 0.1, -PLANE_SIZE/2 - 0.25]} receiveShadow>
            <boxGeometry args={[PLANE_SIZE + 1, 0.6, 0.5]} />
            <meshStandardMaterial color="#4a4036" roughness={0.9} />
        </mesh>
        {/* Bottom */}
        <mesh position={[0, 0.1, PLANE_SIZE/2 + 0.25]} receiveShadow>
            <boxGeometry args={[PLANE_SIZE + 1, 0.6, 0.5]} />
            <meshStandardMaterial color="#4a4036" roughness={0.9} />
        </mesh>
        {/* Left */}
        <mesh position={[-PLANE_SIZE/2 - 0.25, 0.1, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
            <boxGeometry args={[PLANE_SIZE, 0.6, 0.5]} />
            <meshStandardMaterial color="#4a4036" roughness={0.9} />
        </mesh>
        {/* Right */}
        <mesh position={[PLANE_SIZE/2 + 0.25, 0.1, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
            <boxGeometry args={[PLANE_SIZE, 0.6, 0.5]} />
            <meshStandardMaterial color="#4a4036" roughness={0.9} />
        </mesh>
    </group>
  );
};

const Water = () => {
    // Large Water Plane
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow castShadow={false}>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial 
                color="#006994" 
                roughness={0.1} 
                metalness={0.6} 
                transparent 
                opacity={0.8}
            />
        </mesh>
    );
};

const SceneContent: React.FC<ZenGardenProps> = ({ 
    tool, 
    rocks, setRocks, 
    bonsai, setBonsai,
    cherryBlossoms, setCherryBlossoms,
    bridges, setBridges,
    pagodas, setPagodas,
    ponds, setPonds,
    sandColor, 
    rakeDepth,
    placementScale,
    selection,
    setSelection
}) => {
    const [controlsEnabled, setControlsEnabled] = useState(true);
    const { camera, gl } = useThree();

    // Use a ref for selection to access current state in event listeners
    const selectionRef = useRef(selection);
    useEffect(() => {
        selectionRef.current = selection;
    }, [selection]);

    const handleAddItem = (type: ToolType, pos: THREE.Vector3) => {
        const id = Math.random().toString(36).substr(2, 9);
        const position: [number, number, number] = [pos.x, 0, pos.z];
        const rotation = Math.random() * Math.PI * 2;
        const scale = placementScale;

        if (type === 'ROCK') {
             setRocks(prev => [...prev, { id, position, rotation, scale: scale * (0.5 + Math.random() * 0.5), type: Math.floor(Math.random() * 3) }]);
        } else if (type === 'BONSAI') {
             setBonsai(prev => [...prev, { id, position, rotation, scale: scale * (0.8 + Math.random() * 0.4), type: 0 }]);
        } else if (type === 'CHERRY_BLOSSOM') {
             setCherryBlossoms(prev => [...prev, { id, position, rotation, scale: scale * (1.0 + Math.random() * 0.3) }]);
        } else if (type === 'BRIDGE') {
             setBridges(prev => [...prev, { id, position, rotation, scale: scale * 1.5 }]);
        } else if (type === 'PAGODA') {
             setPagodas(prev => [...prev, { id, position, rotation, scale: scale * 1.2 }]);
        } else if (type === 'POND') {
             setPonds(prev => [...prev, { id, position, rotation, scale: scale * 1.5 }]);
        }
    };

    const handleItemClick = (id: string, type: ItemCategory) => {
        if (tool === 'DELETE') {
            if (type === 'rock') setRocks(prev => prev.filter(r => r.id !== id));
            else if (type === 'bonsai') setBonsai(prev => prev.filter(t => t.id !== id));
            else if (type === 'cherry') setCherryBlossoms(prev => prev.filter(t => t.id !== id));
            else if (type === 'bridge') setBridges(prev => prev.filter(t => t.id !== id));
            else if (type === 'pagoda') setPagodas(prev => prev.filter(t => t.id !== id));
            else if (type === 'pond') setPonds(prev => prev.filter(t => t.id !== id));
            
            if (selection?.id === id) setSelection(null);
        } else if (tool === 'SELECT') {
            setSelection({ id, type });
        }
    };

    const moveSelected = (pos: THREE.Vector3) => {
        const sel = selectionRef.current;
        if (!sel) return;
        const { id, type } = sel;
        const newPos: [number, number, number] = [pos.x, 0, pos.z];

        const updateItem = (item: any) => item.id === id ? { ...item, position: newPos } : item;

        if (type === 'rock') setRocks(prev => prev.map(updateItem));
        else if (type === 'bonsai') setBonsai(prev => prev.map(updateItem));
        else if (type === 'cherry') setCherryBlossoms(prev => prev.map(updateItem));
        else if (type === 'bridge') setBridges(prev => prev.map(updateItem));
        else if (type === 'pagoda') setPagodas(prev => prev.map(updateItem));
        else if (type === 'pond') setPonds(prev => prev.map(updateItem));
    };
    
    const handleStartDrag = (e: any) => {
        if (tool === 'SELECT' && selectionRef.current) {
            e.stopPropagation();
            setControlsEnabled(false);
            
            // Global move handler to avoid occlusion issues and provide smooth dragging
            const handleGlobalMove = (event: PointerEvent) => {
                const rect = gl.domElement.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
                
                // Intersect with ground plane at y=0
                const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
                const target = new THREE.Vector3();
                const intersection = raycaster.ray.intersectPlane(plane, target);
                
                if (intersection) {
                    moveSelected(intersection);
                }
            };

            const handleGlobalUp = () => {
                setControlsEnabled(true);
                window.removeEventListener('pointermove', handleGlobalMove);
                window.removeEventListener('pointerup', handleGlobalUp);
            };

            window.addEventListener('pointermove', handleGlobalMove);
            window.addEventListener('pointerup', handleGlobalUp);
            
            // Safety cleanup in case component unmounts
            return () => {
                window.removeEventListener('pointermove', handleGlobalMove);
                window.removeEventListener('pointerup', handleGlobalUp);
            };
        }
    }

    const handleItemPointerDown = (id: string, type: ItemCategory, e: any) => {
        if (tool === 'SELECT') {
            setSelection({ id, type });
            // Defer drag start slightly to ensure selection state is updated or use ref
            selectionRef.current = { id, type };
            handleStartDrag(e);
        }
    };
    
    const handleSandClick = (type: ToolType, pos: THREE.Vector3) => {
        if (tool === 'SELECT') {
            setSelection(null);
        } else {
            handleAddItem(type, pos);
        }
    };

    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight 
                position={[10, 25, 10]} 
                intensity={1.5} 
                castShadow 
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0001}
                shadow-normalBias={0.05}
            />
            
            {/* Stopped stars to prevent spinning sensation */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0} />
            <Sky sunPosition={[10, 25, 10]} turbidity={8} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} />

            <Water />
            <SandPlane 
                tool={tool} 
                onAddItem={handleSandClick}
                sandColor={sandColor} 
                setControlsEnabled={setControlsEnabled}
                rakeDepth={rakeDepth}
                onStartDrag={handleStartDrag}
            />
            
            {rocks.map(item => <Rock key={item.id} data={item} isSelected={selection?.id === item.id} onClick={() => handleItemClick(item.id, 'rock')} onPointerDown={(e) => handleItemPointerDown(item.id, 'rock', e)} />)}
            {bonsai.map(item => <Bonsai key={item.id} data={item} isSelected={selection?.id === item.id} onClick={() => handleItemClick(item.id, 'bonsai')} onPointerDown={(e) => handleItemPointerDown(item.id, 'bonsai', e)} />)}
            {cherryBlossoms.map(item => <CherryBlossom key={item.id} data={item} isSelected={selection?.id === item.id} onClick={() => handleItemClick(item.id, 'cherry')} onPointerDown={(e) => handleItemPointerDown(item.id, 'cherry', e)} />)}
            {bridges.map(item => <Bridge key={item.id} data={item} isSelected={selection?.id === item.id} onClick={() => handleItemClick(item.id, 'bridge')} onPointerDown={(e) => handleItemPointerDown(item.id, 'bridge', e)} />)}
            {pagodas.map(item => <Pagoda key={item.id} data={item} isSelected={selection?.id === item.id} onClick={() => handleItemClick(item.id, 'pagoda')} onPointerDown={(e) => handleItemPointerDown(item.id, 'pagoda', e)} />)}
            {ponds.map(item => <Pond key={item.id} data={item} isSelected={selection?.id === item.id} onClick={() => handleItemClick(item.id, 'pond')} onPointerDown={(e) => handleItemPointerDown(item.id, 'pond', e)} />)}

            <OrbitControls 
                makeDefault
                enabled={controlsEnabled}
                maxPolarAngle={Math.PI / 2 - 0.1}
                enablePan={false}
                minDistance={5}
                maxDistance={40}
                enableDamping
                dampingFactor={0.05}
            />
        </>
    );
};

const ZenGarden: React.FC<ZenGardenProps> = (props) => {
    return (
        <div className="w-full h-full">
            <Canvas shadows camera={{ position: [0, 20, 15], fov: 45 }}>
                <color attach="background" args={['#87CEEB']} />
                <SceneContent {...props} />
            </Canvas>
        </div>
    );
};

export default ZenGarden;