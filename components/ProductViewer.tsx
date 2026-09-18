'use client';

import { Suspense, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { ContextGuard, Perfume, SceneBoundary } from './CollectionBottle';

export default function ProductViewer({ color, name, reduced, fallback }: { color: string; name: string; reduced: boolean; fallback: ReactNode }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const motion = useRef({ progress: .5, x: 0, y: 0, active: 0 });
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const fail = () => setFailed(true);
  function rotate(direction: number) {
    const orbit = controls.current;
    if (!orbit) return;
    orbit.setAzimuthalAngle(orbit.getAzimuthalAngle() + direction * Math.PI / 6);
    orbit.update();
  }
  const unavailable = <div className="viewer-fallback">{fallback}<span>FRAGRANCE PREVIEW</span></div>;
  return <div className="product-viewer">
    <span className="viewer-edition">SHANNA / OBJECT 01</span>
    <div className="viewer-halo" aria-hidden="true"/>
    <div className="viewer-canvas" role="img" aria-label={`${name} interactive 3D bottle. Drag to rotate, or use the rotation buttons below.`}>
      {failed ? unavailable : <SceneBoundary fallback={unavailable} onFailure={fail}><Canvas dpr={[1, 1.5]} frameloop="demand" camera={{ position: [0, .3, 6.2], fov: 35 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={<div className="viewer-fallback">{fallback}<span>FRAGRANCE PREVIEW</span></div>} onCreated={() => setReady(true)}>
        <ContextGuard fail={fail}/>
        <ambientLight intensity={.6}/><directionalLight position={[3, 4, 5]} intensity={1.8}/>
        <Suspense fallback={null}>
          <Perfume color={color} name={name} reduced={true} motion={motion}/>
          <Environment resolution={64}><Lightformer position={[-3, 1, 3]} scale={[2, 6, 1]} intensity={3}/><Lightformer position={[3, 2, 2]} scale={[2, 5, 1]} intensity={3}/><Lightformer position={[0, 4, -2]} rotation={[Math.PI / 2, 0, 0]} scale={[5, 4, 1]} intensity={2}/></Environment>
        </Suspense>
        <OrbitControls ref={controls} makeDefault enablePan={false} enableZoom={false} enableDamping={!reduced} dampingFactor={.09} rotateSpeed={.7} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI * 2 / 3}/>
      </Canvas></SceneBoundary>}
    </div>
    {!failed && <div className="viewer-controls"><span aria-live="polite">{ready ? 'DRAG TO ROTATE · 360°' : 'PREPARING YOUR FRAGRANCE…'}</span><div><button type="button" aria-label="Rotate bottle left" disabled={!ready} onClick={() => rotate(-1)}><ArrowLeft size={16}/></button><button type="button" aria-label="Reset bottle view" disabled={!ready} onClick={() => controls.current?.reset()}><RotateCcw size={15}/></button><button type="button" aria-label="Rotate bottle right" disabled={!ready} onClick={() => rotate(1)}><ArrowRight size={16}/></button></div></div>}
  </div>;
}
