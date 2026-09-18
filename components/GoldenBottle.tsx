'use client';
import { useEffect, useMemo, type RefObject } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/** Shared procedural interpretation of the SHANNA amber-glass Figma study. */
export default function GoldenBottle({ capRef, name = 'Night Bloom', liquid = '#b67c32' }: { capRef?: RefObject<THREE.Group | null>; name?: string; liquid?: string }) {
  const liquidMap = useMemo(() => {
    const c=document.createElement('canvas'); c.width=256;c.height=512;
    const g=c.getContext('2d')!; const grad=g.createLinearGradient(0,0,210,512);
    grad.addColorStop(0,'#f5d899');grad.addColorStop(.18,liquid);grad.addColorStop(.52,'#392311');grad.addColorStop(.82,liquid);grad.addColorStop(1,'#e5b877');
    g.fillStyle=grad;g.fillRect(0,0,256,512);const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;return map;
  },[liquid]);
  useEffect(()=>()=>liquidMap.dispose(),[liquidMap]);
  const label = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
    const g = c.getContext('2d')!; g.textAlign = 'center'; g.fillStyle = '#fff0cc';
    g.font = '116px Georgia'; g.fillText('SHANNA', 512, 216);
    g.font = '26px Arial'; g.fillText('E A U   D E   P A R F U M', 512, 300);
    g.font = '22px Arial'; g.fillText(name.toUpperCase().split('').join(' '), 512, 400);
    const map = new THREE.CanvasTexture(c); map.colorSpace = THREE.SRGBColorSpace; return map;
  }, [name]);
  useEffect(() => () => label.dispose(), [label]);
  return <>
    <RoundedBox args={[1.68, 2.05, .92]} radius={.22} smoothness={4}>
      <meshPhysicalMaterial color="#fff5e4" transparent opacity={.42} depthWrite={false} transmission={.7} thickness={.18} roughness={.065} ior={1.5} clearcoat={1} envMapIntensity={1.7}/>
    </RoundedBox>
    <RoundedBox args={[1.38, 1.53, .64]} position={[0, .025, 0]} radius={.18} smoothness={3}>
      <meshPhysicalMaterial map={liquidMap} metalness={.08} roughness={.12} clearcoat={1} clearcoatRoughness={.09}/>
    </RoundedBox>
    <RoundedBox args={[1.48, .18, .75]} position={[0, -.87, 0]} radius={.07} smoothness={3}>
      <meshPhysicalMaterial color="#f4dab0" transmission={.95} thickness={.35} roughness={.07} ior={1.5}/>
    </RoundedBox>
    <mesh position={[0, .96, 0]}><cylinderGeometry args={[.25,.30,.21,40]}/><meshPhysicalMaterial color="#f7d9a7" transmission={.8} roughness={.09} thickness={.15}/></mesh>
    <mesh position={[0,1.055,0]}><cylinderGeometry args={[.31,.31,.11,64]}/><meshStandardMaterial color="#cfac6c" metalness={1} roughness={.3}/></mesh>
    <mesh position={[0,1.18,0]}><cylinderGeometry args={[.15,.18,.19,32]}/><meshStandardMaterial color="#dfc388" metalness={1} roughness={.2}/></mesh>
    <mesh position={[0,1.20,.152]}><circleGeometry args={[.025,16]}/><meshBasicMaterial color="#171310"/></mesh>
    <mesh position={[.06,.12,.335]} rotation={[0,0,.025]}><cylinderGeometry args={[.009,.009,1.52,8]}/><meshStandardMaterial color="#d9ae65" transparent opacity={.5} roughness={.3}/></mesh>
    <group ref={capRef} position={[0,1.36,0]}>
      <mesh><cylinderGeometry args={[.43,.43,.55,64]}/><meshPhysicalMaterial color="#12100e" metalness={.65} roughness={.19} clearcoat={1} clearcoatRoughness={.07}/></mesh>
      <mesh position={[0,-.265,0]}><cylinderGeometry args={[.435,.435,.025,64]}/><meshStandardMaterial color="#cba15c" metalness={1} roughness={.2}/></mesh>
      <mesh position={[0,.273,0]}><cylinderGeometry args={[.404,.404,.01,64]}/><meshStandardMaterial color="#211c17" metalness={.8} roughness={.22}/></mesh>
    </group>
    <mesh position={[0,.07,.469]}><planeGeometry args={[1.25,.625]}/><meshBasicMaterial map={label} transparent depthWrite={false} toneMapped={false}/></mesh>
  </>;
}
