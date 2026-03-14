'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

const SEVERITY_COLORS = {
    critical: '#ef4444', // Red
    warning: '#f59e0b',  // Orange
    caution: '#fbbf24',  // Yellow
    stable: '#2563eb',   // Emerald
    info: '#3b82f6'      // Blue
};

/* ── Invisible/Glowing Hitbox for Image Regions ── */
function RegionHitbox({ position, args, type = 'box', rotation=[0,0,0], regionKey, severity, onClick, selectedRegion }) {
    const meshRef = useRef();
    const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.stable;
    const [hovered, setHovered] = useState(false);
    
    const isSelected = selectedRegion === regionKey;
    const hasAlert = severity === 'critical' || severity === 'warning';

    useFrame((state) => {
        if (meshRef.current) {
            // Pulse opacity if alert
            const t = state.clock.elapsedTime;
            let pulse = 1;
            if (severity === 'critical') pulse = 0.5 + Math.sin(t * 4) * 0.5;
            if (severity === 'warning') pulse = 0.5 + Math.sin(t * 2) * 0.5;
            
            // Only show hitbox if hovered, selected, or has an alert
            const isActive = hovered || isSelected || hasAlert;
            
            // Smoothly animate opacity
            const targetOpacity = isActive ? (hasAlert ? 0.4 * pulse : 0.3) : 0.0;
            meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, targetOpacity, 0.1);
            
            // Scale up slightly on hover/select
            const targetScale = (hovered || isSelected) ? 1.05 : 1.0;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={rotation}
            onClick={(e) => { e.stopPropagation(); onClick(regionKey); }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
            {type === 'box' && <planeGeometry args={args} />}
            {type === 'circle' && <circleGeometry args={args} />}
            
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0}
                depthTest={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

/* ── 2.5D Anatomy Board ── */
function AnatomyBoard({ regions, selectedRegion, onRegionSelect }) {
    // Load the user's high-fidelity reference image
    const texture = useLoader(THREE.TextureLoader, '/anatomy-reference.png');
    // Aspect ratio of the image (assuming roughly 1:2 tall)
    const boardWidth = 2.5;
    const boardHeight = 4.8;
    
    const sev = (k) => regions?.[k]?.severity || 'stable';

    return (
        <group position={[0, -0.2, 0]}>
            {/* The Main High-Fidelity Image Plane */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[boardWidth, boardHeight]} />
                <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
            </mesh>

            {/* Background Glow/Shadow Panel (to give it depth) */}
            <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[boardWidth * 1.1, boardHeight * 1.05]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.3} />
            </mesh>
            
            {/* ── INTERACTIVE MAPPED HOTSPOTS ── */}
            {/* Note: Coordinates are relative to the center of the image plane [0,0] */}
            
            {/* Head */}
            <RegionHitbox 
                position={[0, 1.8, 0.01]} args={[0.35, 32]} type="circle" 
                regionKey="head" severity={sev('head')} onClick={onRegionSelect} selectedRegion={selectedRegion} 
            />
            
            {/* Chest (Heart/Lungs) */}
            <RegionHitbox 
                position={[0, 0.9, 0.01]} args={[0.9, 0.8]} type="box" 
                regionKey="chest" severity={sev('chest')} onClick={onRegionSelect} selectedRegion={selectedRegion} 
            />
            
            {/* Abdomen (Stomach/Liver/Intestines) */}
            <RegionHitbox 
                position={[0, 0.1, 0.01]} args={[0.8, 0.8]} type="box" 
                regionKey="abdomen" severity={sev('abdomen')} onClick={onRegionSelect} selectedRegion={selectedRegion} 
            />
            
            {/* Right Arm (Visual Left) */}
            <RegionHitbox 
                position={[-0.7, 0.5, 0.01]} rotation={[0, 0, -0.2]} args={[0.3, 1.5]} type="box" 
                regionKey="rightArm" severity={sev('rightArm')} onClick={onRegionSelect} selectedRegion={selectedRegion} 
            />
            
            {/* Left Arm (Visual Right) */}
            <RegionHitbox 
                position={[0.7, 0.5, 0.01]} rotation={[0, 0, 0.2]} args={[0.3, 1.5]} type="box" 
                regionKey="leftArm" severity={sev('leftArm')} onClick={onRegionSelect} selectedRegion={selectedRegion} 
            />
            
            {/* Right Leg (Visual Left) */}
            <RegionHitbox 
                position={[-0.35, -1.2, 0.01]} args={[0.4, 1.8]} type="box" 
                regionKey="rightLeg" severity={sev('rightLeg')} onClick={onRegionSelect} selectedRegion={selectedRegion} 
            />
            
            {/* Left Leg (Visual Right) */}
            <RegionHitbox 
                position={[0.35, -1.2, 0.01]} args={[0.4, 1.8]} type="box" 
                regionKey="leftLeg" severity={sev('leftLeg')} onClick={onRegionSelect} selectedRegion={selectedRegion} 
            />
        </group>
    );
}

/* ── Scene Setup ── */
export function BodyViewer3D({ onRegionSelect, regions, style, selectedRegion }) {
    return (
        <div style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)', background: '#f8fafc', overflow: 'hidden', border: '1px solid var(--border-default)', ...style }}>
            <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
                <ambientLight intensity={1} />
                <Center>
                    <AnatomyBoard onRegionSelect={onRegionSelect} regions={regions} selectedRegion={selectedRegion} />
                </Center>
                {/* 2.5D Orbit - Allow side to side viewing but prevent full rotation to back */}
                <OrbitControls 
                    enablePan={false} 
                    minAzimuthAngle={-Math.PI / 4} // Max 45 deg left
                    maxAzimuthAngle={Math.PI / 4}  // Max 45 deg right
                    minPolarAngle={Math.PI / 3}    
                    maxPolarAngle={Math.PI / 1.5}
                    enableZoom={true}
                    minDistance={3}
                    maxDistance={8}
                />
            </Canvas>
        </div>
    );
}

export function BodyViewerMini({ onRegionSelect, regions, style }) {
    return (
        <div style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)', background: '#f8fafc', overflow: 'hidden', ...style }}>
            <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
                <ambientLight intensity={1} />
                <Center>
                    <AnatomyBoard onRegionSelect={onRegionSelect} regions={regions} selectedRegion={null} />
                </Center>
                <OrbitControls 
                    enablePan={false} 
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    minAzimuthAngle={-Math.PI / 6}
                    maxAzimuthAngle={Math.PI / 6}
                />
            </Canvas>
        </div>
    );
}
