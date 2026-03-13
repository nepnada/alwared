'use client';
import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const SEVERITY_COLORS = {
    critical: '#dc2626', warning: '#d97706', caution: '#f59e0b',
    stable: '#16a34a', info: '#2563eb'
};

/* ── Clickable body region (smooth capsule/sphere) ── */
function BodyRegion({ position, size, regionKey, severity, onClick, label }) {
    const meshRef = useRef();
    const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.stable;
    const [hovered, setHovered] = useState(false);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.material.emissiveIntensity = hovered ? 1.0 : 0.4;
            const s = hovered ? 1.15 : 1.0;
            meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onClick={(e) => { e.stopPropagation(); onClick(regionKey); }}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
            >
                <capsuleGeometry args={size || [0.08, 0.12, 16, 16]} />
                <meshPhysicalMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.4}
                    roughness={0.3}
                    metalness={0.1}
                    transparent
                    opacity={0.85}
                />
            </mesh>
        </group>
    );
}

/* ── Pulse ring for critical regions ── */
function PulseRing({ position, color }) {
    const ringRef = useRef();
    const phase = useRef(Math.random() * Math.PI * 2);

    useFrame((state) => {
        if (ringRef.current) {
            const t = state.clock.elapsedTime;
            const s = 1 + 0.3 * Math.sin(t * 2 + phase.current);
            ringRef.current.scale.set(s, s, s);
            ringRef.current.material.opacity = 0.5 * (0.5 + 0.5 * Math.cos(t * 2 + phase.current));
            ringRef.current.lookAt(state.camera.position);
        }
    });

    return (
        <mesh ref={ringRef} position={position}>
            <ringGeometry args={[0.15, 0.17, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
    );
}

/* ── Human silhouette built from geometric shapes ── */
function HumanBody({ onClick, regions }) {
    const groupRef = useRef();
    const sev = (k) => regions?.[k]?.severity || 'stable';
    const bodyColor = '#94a3b8';

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.01;
        }
    });

    const bodyMat = (
        <meshPhysicalMaterial
            color={bodyColor}
            emissive="#475569"
            emissiveIntensity={0.05}
            roughness={0.4}
            metalness={0.05}
            transparent
            opacity={0.25}
            depthWrite={false}
        />
    );

    return (
        <group ref={groupRef}>
            {/* ── BODY SILHOUETTE (translucent) ── */}
            {/* Head */}
            <mesh position={[0, 2.35, 0]}>
                <sphereGeometry args={[0.22, 32, 32]} />
                {bodyMat}
            </mesh>
            {/* Neck */}
            <mesh position={[0, 2.05, 0]}>
                <cylinderGeometry args={[0.06, 0.08, 0.15, 16]} />
                {bodyMat}
            </mesh>
            {/* Torso upper (chest) */}
            <mesh position={[0, 1.7, 0]}>
                <capsuleGeometry args={[0.25, 0.35, 16, 16]} />
                {bodyMat}
            </mesh>
            {/* Torso lower (abdomen) */}
            <mesh position={[0, 1.15, 0]}>
                <capsuleGeometry args={[0.22, 0.25, 16, 16]} />
                {bodyMat}
            </mesh>
            {/* Left arm */}
            <mesh position={[-0.42, 1.65, 0]} rotation={[0, 0, 0.25]}>
                <capsuleGeometry args={[0.06, 0.55, 8, 8]} />
                {bodyMat}
            </mesh>
            {/* Right arm */}
            <mesh position={[0.42, 1.65, 0]} rotation={[0, 0, -0.25]}>
                <capsuleGeometry args={[0.06, 0.55, 8, 8]} />
                {bodyMat}
            </mesh>
            {/* Left leg */}
            <mesh position={[-0.14, 0.5, 0]}>
                <capsuleGeometry args={[0.08, 0.7, 8, 8]} />
                {bodyMat}
            </mesh>
            {/* Right leg */}
            <mesh position={[0.14, 0.5, 0]}>
                <capsuleGeometry args={[0.08, 0.7, 8, 8]} />
                {bodyMat}
            </mesh>

            {/* ── CLICKABLE ORGAN REGIONS (colored by severity) ── */}
            <BodyRegion position={[0, 2.35, 0.05]} size={[0.12, 0.01, 32, 32]} regionKey="head" severity={sev('head')} onClick={onClick} label="Tete" />
            <BodyRegion position={[0, 1.72, 0.08]} size={[0.14, 0.18, 16, 16]} regionKey="chest" severity={sev('chest')} onClick={onClick} label="Thorax" />
            <BodyRegion position={[0, 1.15, 0.08]} size={[0.13, 0.15, 16, 16]} regionKey="abdomen" severity={sev('abdomen')} onClick={onClick} label="Abdomen" />
            <BodyRegion position={[-0.42, 1.55, 0.05]} size={[0.05, 0.25, 8, 8]} regionKey="leftArm" severity={sev('leftArm')} onClick={onClick} label="Bras G" />
            <BodyRegion position={[0.42, 1.55, 0.05]} size={[0.05, 0.25, 8, 8]} regionKey="rightArm" severity={sev('rightArm')} onClick={onClick} label="Bras D" />
            <BodyRegion position={[-0.14, 0.5, 0.05]} size={[0.06, 0.35, 8, 8]} regionKey="leftLeg" severity={sev('leftLeg')} onClick={onClick} label="Jambe G" />
            <BodyRegion position={[0.14, 0.5, 0.05]} size={[0.06, 0.35, 8, 8]} regionKey="rightLeg" severity={sev('rightLeg')} onClick={onClick} label="Jambe D" />

            {/* ── Pulse rings for critical ── */}
            {sev('chest') === 'critical' && <PulseRing position={[0, 1.72, 0.12]} color="#dc2626" />}
            {sev('abdomen') === 'critical' && <PulseRing position={[0, 1.15, 0.12]} color="#dc2626" />}
            {sev('head') === 'critical' && <PulseRing position={[0, 2.35, 0.1]} color="#dc2626" />}
            {sev('leftLeg') === 'warning' && <PulseRing position={[-0.14, 0.5, 0.1]} color="#d97706" />}
        </group>
    );
}

function Scene({ onRegionSelect, regions }) {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 7]} intensity={1.0} />
            <pointLight position={[-3, 5, -3]} intensity={3} distance={15} color="#06b6d4" />
            <pointLight position={[3, 5, -3]} intensity={3} distance={15} color="#3b82f6" />
            <directionalLight position={[0, 2, 6]} intensity={0.4} color="#f8fafc" />

            <HumanBody onClick={onRegionSelect} regions={regions} />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
                <circleGeometry args={[1.5, 64]} />
                <meshStandardMaterial color="#e2e8f0" roughness={1} transparent opacity={0.5} />
            </mesh>

            <OrbitControls
                target={[0, 1.2, 0]}
                enableDamping
                dampingFactor={0.08}
                minDistance={2}
                maxDistance={8}
                enablePan={false}
            />
        </>
    );
}

function MiniScene({ onRegionSelect, regions }) {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 7]} intensity={1.0} />
            <pointLight position={[-3, 5, -3]} intensity={3} distance={15} color="#06b6d4" />
            <pointLight position={[3, 5, -3]} intensity={3} distance={15} color="#3b82f6" />

            <HumanBody onClick={onRegionSelect} regions={regions} />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
                <circleGeometry args={[1.5, 64]} />
                <meshStandardMaterial color="#e2e8f0" roughness={1} transparent opacity={0.5} />
            </mesh>

            <OrbitControls
                target={[0, 1.2, 0]}
                enableDamping
                autoRotate
                autoRotateSpeed={0.8}
                minDistance={2}
                maxDistance={8}
                enablePan={false}
            />
        </>
    );
}

export function BodyViewer3D({ onRegionSelect, regions, style }) {
    return (
        <Canvas
            camera={{ position: [0, 1.3, 4], fov: 40 }}
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
            camera={{ position: [0, 1.3, 5], fov: 40 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)', ...style }}
        >
            <MiniScene onRegionSelect={onRegionSelect} regions={regions} />
        </Canvas>
    );
}
