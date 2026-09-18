'use client';

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import GoldenBottle from './GoldenBottle';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Props = { color: string; name: string; reduced: boolean; fallback: ReactNode };
type Motion = { progress: number; x: number; y: number; active: number };

export class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onFailure?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure?.(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function Perfume({ color, name, motion, reduced }: Omit<Props, 'fallback'> & { motion: React.RefObject<Motion> }) {
  const bottle = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!bottle.current) return;
    const m = motion.current;
    const t = clock.elapsedTime;
    const ease = 1 - Math.exp(-Math.min(delta, .1) * 5);
    const ry = reduced ? -.12 : -.22 + (m.progress - .5) * .6 + m.x * .3 + Math.sin(t * .45) * .055;
    const rx = reduced ? .04 : .045 - m.y * .1;
    bottle.current.rotation.y = THREE.MathUtils.lerp(bottle.current.rotation.y, ry, ease);
    bottle.current.rotation.x = THREE.MathUtils.lerp(bottle.current.rotation.x, rx, ease);
    bottle.current.rotation.z = reduced ? 0 : Math.sin(t * .4) * .018;
    bottle.current.position.y = reduced ? -.2 : -.2 + Math.sin(t * .8) * .035 + m.active * .075;
    const scale = reduced ? 1 : 1 + m.active * .045;
    bottle.current.scale.setScalar(THREE.MathUtils.lerp(bottle.current.scale.x, scale, ease));
  });
  return <group ref={bottle} position={[0, -.2, 0]}>
    <GoldenBottle name={name} liquid={color}/>
  </group>;
}

export function ContextGuard({ fail }: { fail: () => void }) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', fail);
    return () => canvas.removeEventListener('webglcontextlost', fail);
  }, [gl, fail]);
  return null;
}

export default function CollectionBottle({ color, name, reduced, fallback }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const motion = useRef<Motion>({ progress: .5, x: 0, y: 0, active: 0 });
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = host.current!;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: '200px' });
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element); visibility.observe(element);
    return () => { observer.disconnect(); visibility.disconnect(); };
  }, []);
  useEffect(() => {
    const element = host.current!;
    const card = element.closest('button')!;
    if (reduced) { motion.current.active = 0; motion.current.x = 0; motion.current.y = 0; return; }
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(card, { y: 38, opacity: .35 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 96%', end: 'top 67%', scrub: .8 } });
      gsap.to(motion.current, { progress: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    const move = (e: PointerEvent) => { if (e.pointerType === 'touch') return; const rect = card.getBoundingClientRect(); motion.current.x = (e.clientX - rect.left) / rect.width * 2 - 1; motion.current.y = (e.clientY - rect.top) / rect.height * 2 - 1; };
    const enter = () => { gsap.to(motion.current, { active: 1, duration: .65, overwrite: 'auto' }); };
    const leave = () => { gsap.to(motion.current, { active: 0, x: 0, y: 0, duration: .7, overwrite: 'auto' }); };
    card.addEventListener('pointermove', move); card.addEventListener('pointerenter', enter); card.addEventListener('pointerleave', leave); card.addEventListener('focus', enter); card.addEventListener('blur', leave);
    return () => { context.revert(); gsap.killTweensOf(motion.current); card.removeEventListener('pointermove', move); card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave); card.removeEventListener('focus', enter); card.removeEventListener('blur', leave); };
  }, [reduced]);
  return <div ref={host} className="collection-bottle-stage" aria-hidden="true">
    <div className="collection-bottle-shadow" />
    {near && !failed ? <SceneBoundary fallback={fallback}><Canvas dpr={[1, 1.25]} frameloop={visible && !reduced ? 'always' : 'demand'} camera={{ position: [0, .15, 6.8], fov: 35 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={fallback}>
      <ContextGuard fail={() => setFailed(true)} />
      <ambientLight intensity={.6} /><directionalLight position={[3, 4, 5]} intensity={1.8} />
      <Suspense fallback={null}>
        <Perfume color={color} name={name} reduced={reduced} motion={motion} />
        <Environment resolution={64}><Lightformer position={[-3, 1, 3]} scale={[2, 6, 1]} intensity={3} /><Lightformer position={[3, 2, 2]} scale={[2, 5, 1]} intensity={3} /><Lightformer position={[0, 4, -2]} rotation={[Math.PI / 2, 0, 0]} scale={[5, 4, 1]} intensity={2} /><Lightformer position={[0, 0, 5]} scale={[4, 3, 1]} intensity={.7} /></Environment>
      </Suspense>
    </Canvas></SceneBoundary> : fallback}
  </div>;
}
