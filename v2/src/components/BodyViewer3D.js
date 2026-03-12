'use client';
import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const SEVERITY_COLORS = {
    critical: '#dc2626', warning: '#d97706', caution: '#f59e0b',
    stable: '#16a34a', info: '#2563eb'
};

function Organ({ position, args, regionKey, severity, onClick }) {
    const meshRef = useRef();
    const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.stable;
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.emissiveIntensity = hovered ? 0.8 : 0.5;
            const s = hovered ? 1.1 : 1.0;
            meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={(e) => { e.stopPropagation(); onClick(regionKey); }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
            <capsuleGeometry args={args || [0.12, 0.15, 16, 16]} />
            <meshPhysicalMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                roughness={0.2}
                metalness={0.1}
                transmission={0.2}
                transparent
                opacity={0.95}
            />
        </mesh>
    );
}

function PulseRing({ position, color, camera }) {
    const ringRef = useRef();
    const phase = useRef(Math.random() * Math.PI * 2);

    useFrame((state) => {
        if (ringRef.current) {
            const t = state.clock.elapsedTime;
            const s = 1 + 0.25 * Math.sin(t * 2 + phase.current);
            ringRef.current.scale.set(s, s, s);
            ringRef.current.material.opacity = 0.4 * (0.5 + 0.5 * Math.cos(t * 2 + phase.current));
            ringRef.current.lookAt(state.camera.position);
        }
    });

    return (
        <mesh ref={ringRef} position={position}>
            <ringGeometry args={[0.2, 0.22, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
    );
}

function HumanModel({ onClick }) {
    const { scene } = useGLTF('/models/Xbot.glb');
    const modelRef = useRef();

    useEffect(() => {
        if (scene) {
            const box = new THREE.Box3().setFromObject(scene);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3.5 / maxDim;

            scene.scale.set(scale, scale, scale);
            scene.position.set(-center.x * scale, -center.y * scale + 1.25, -center.z * scale);

            const glassMat = new THREE.MeshPhysicalMaterial({
                color: 0x0ea5e9,
                emissive: 0x0284c7,
                emissiveIntensity: 0.1,
                roughness: 0.2,
                metalness: 0.1,
                transmission: 0.9,
                thickness: 0.5,
                ior: 1.4,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 0.4,
                depthWrite: false
            });

            scene.traverse((child) => {
                if (child.isMesh || child.isSkinnedMesh) {
                    child.material = glassMat;
                    child.castShadow = true;
                }
            });
        }
    }, [scene]);

    useFrame((state) => {
        if (modelRef.current) {
            modelRef.current.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.006;
        }
    });

    return (
        <group ref={modelRef} onClick={(e) => { e.stopPropagation(); onClick('chest'); }}>
            <primitive object={scene} />
        </group>
    );
}

function Scene({ onRegionSelect, regions }) {
    const sev = (k) => regions?.[k]?.severity || 'stable';

    return (
        <>
            {/* Lights */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
            <pointLight position={[-5, 5, -5]} intensity={4} distance={20} color="#06b6d4" />
            <pointLight position={[5, 5, -5]} intensity={4} distance={20} color="#3b82f6" />
            <directionalLight position={[0, 2, 8]} intensity={0.5} color="#f8fafc" />

            {/* Three.js GLB Model */}
            <Suspense fallback={null}>
                <HumanModel onClick={onRegionSelect} />
            </Suspense>

            {/* Internal Organs */}
            <Organ position={[0, 2.7, 0.05]} args={[0.12, 0.01, 32, 32]} regionKey="head" severity={sev('head')} onClick={onRegionSelect} />
            <Organ position={[-0.1, 2.1, 0.08]} args={[0.12, 0.15, 16, 16]} regionKey="chest" severity={sev('chest')} onClick={onRegionSelect} />
            <Organ position={[0, 1.6, 0.1]} args={[0.15, 0.2, 16, 16]} regionKey="abdomen" severity={sev('abdomen')} onClick={onRegionSelect} />

            {/* Pulse rings for critical regions */}
            {sev('chest') === 'critical' && <PulseRing position={[-0.1, 2.1, 0.08]} color="#dc2626" />}
            {sev('abdomen') === 'critical' && <PulseRing position={[0, 1.6, 0.1]} color="#dc2626" />}
            {sev('head') === 'critical' && <PulseRing position={[0, 2.7, 0.05]} color="#dc2626" />}

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
                <circleGeometry args={[2.5, 64]} />
                <meshStandardMaterial color="#e2e8f0" roughness={1} />
            </mesh>

            {/* Controls */}
            <OrbitControls
                target={[0, 1.2, 0]}
                enableDamping
                dampingFactor={0.08}
                minDistance={2.5}
                maxDistance={10}
            />
        </>
    );
}

function MiniScene({ onRegionSelect, regions }) {
    const sev = (k) => regions?.[k]?.severity || 'stable';

    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 7]} intensity={1.2} />
            <pointLight position={[-5, 5, -5]} intensity={4} distance={20} color="#06b6d4" />
            <pointLight position={[5, 5, -5]} intensity={4} distance={20} color="#3b82f6" />

            <Suspense fallback={null}>
                <HumanModel onClick={onRegionSelect} />
            </Suspense>

            <Organ position={[0, 2.7, 0.05]} args={[0.12, 0.01, 32, 32]} regionKey="head" severity={sev('head')} onClick={onRegionSelect} />
            <Organ position={[-0.1, 2.1, 0.08]} args={[0.12, 0.15, 16, 16]} regionKey="chest" severity={sev('chest')} onClick={onRegionSelect} />
            <Organ position={[0, 1.6, 0.1]} args={[0.15, 0.2, 16, 16]} regionKey="abdomen" severity={sev('abdomen')} onClick={onRegionSelect} />

            {sev('chest') === 'critical' && <PulseRing position={[-0.1, 2.1, 0.08]} color="#dc2626" />}
            {sev('abdomen') === 'critical' && <PulseRing position={[0, 1.6, 0.1]} color="#dc2626" />}

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <circleGeometry args={[2.5, 64]} />
                <meshStandardMaterial color="#e2e8f0" roughness={1} />
            </mesh>

            <OrbitControls
                target={[0, 1.2, 0]}
                enableDamping
                autoRotate
                autoRotateSpeed={1}
                minDistance={2.5}
                maxDistance={10}
            />
        </>
    );
}

export function BodyViewer3D({ onRegionSelect, regions, style }) {
    return (
        <Canvas
            camera={{ position: [0, 1.5, 5.5], fov: 40 }}
            shadows
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            style={{ width: '100%', height: '100%', ...style }}
        >
            <Scene onRegionSelect={onRegionSelect} regions={regions} />
        </Canvas>
    );
}

export function BodyViewerMini({ onRegionSelect, regions, style }) {
    return (
        <Canvas
            camera={{ position: [0, 1.5, 7], fov: 40 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)', ...style }}
        >
            <MiniScene onRegionSelect={onRegionSelect} regions={regions} />
        </Canvas>
    );
}
