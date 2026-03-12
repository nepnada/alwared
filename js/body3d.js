// ═══════════════════════════════════════════════════════════
// SihhaTek — 3D Human Body Visualization (ES Module)
// Uses Three.js with CapsuleGeometry for smooth anatomical body
// Deferred initialization: only renders when canvas is visible
// ═══════════════════════════════════════════════════════════
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';

const SEVERITY_COLORS = {
    critical: 0xdc2626,
    warning: 0xd97706,
    caution: 0xf59e0b,
    stable: 0x16a34a,
    info: 0x2563eb
};

const SKIN_COLOR = 0xc9a882;

class BodyViewer {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.options = { mini: false, ...options };
        this.clickables = [];
        this.bodyPartMap = {};
        this.pulseRings = [];
        this.onRegionSelect = options.onRegionSelect || null;
        this.initialized = false;
        this.animating = false;
    }

    tryInit() {
        if (this.initialized) return true;
        // Only init when canvas is visible and has real dimensions
        const rect = this.canvas.parentElement.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) return false;

        this.initialized = true;
        this._setup(rect.width, rect.height);
        return true;
    }

    _setup(w, h) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf1f5f9);

        this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
        this.camera.position.set(0, 1.5, this.options.mini ? 7 : 5.5);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(w, h);
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.target.set(0, 1.2, 0);
        this.controls.minDistance = 2.5;
        this.controls.maxDistance = 10;
        if (this.options.mini) {
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 1;
        }

        this._setupLights();
        this._buildBody();
        this._addGround();
        this._setupInteraction();

        window.addEventListener('resize', () => this.onResize());
        this.startAnimate();
    }

    _setupLights() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        // Main key light
        const dir = new THREE.DirectionalLight(0xffffff, 1.2);
        dir.position.set(5, 10, 7);
        dir.castShadow = true;
        dir.shadow.mapSize.width = 1024;
        dir.shadow.mapSize.height = 1024;
        this.scene.add(dir);

        // Rim light 1 (medical cyan) - creates gorgeous glass reflections
        const rim1 = new THREE.PointLight(0x06b6d4, 4.0, 20);
        rim1.position.set(-5, 5, -5);
        this.scene.add(rim1);

        // Rim light 2 (medical blue)
        const rim2 = new THREE.PointLight(0x3b82f6, 4.0, 20);
        rim2.position.set(5, 5, -5);
        this.scene.add(rim2);

        // Front fill light
        const fill = new THREE.DirectionalLight(0xf8fafc, 0.5);
        fill.position.set(0, 2, 8);
        this.scene.add(fill);
    }

    _makeMat(regionKey, severity) {
        const isBase = !regionKey;
        const color = isBase ? 0xe2e8f0 : (SEVERITY_COLORS[severity] || SEVERITY_COLORS.stable);

        if (isBase) {
            // Ultra-premium frosted glass / holographic material
            return new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                emissive: 0x0f172a,
                emissiveIntensity: 0.1,
                roughness: 0.15,
                metalness: 0.1,
                transmission: 0.95, // Glass-like transparency
                thickness: 1.5,
                ior: 1.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 1.0
            });
        } else {
            // Clickable glowing inner core material
            return new THREE.MeshPhysicalMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.4,
                roughness: 0.3,
                metalness: 0.2,
                transmission: 0.4,
                thickness: 0.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.2,
                transparent: true,
                opacity: 0.9
            });
        }
    }

    _makePart(geo, regionKey, severity) {
        const mat = this._makeMat(regionKey, severity);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (regionKey) {
            mesh.userData.regionKey = regionKey;
            this.clickables.push(mesh);
            this.bodyPartMap[regionKey] = mesh;
        }
        return mesh;
    }

    _buildBody() {
        this.bodyGroup = new THREE.Group();
        this.scene.add(this.bodyGroup);

        const patient = window.MOCK_PATIENTS ? window.MOCK_PATIENTS[0] : null;
        const regions = patient ? patient.bodyRegions : {};
        const sev = (k) => regions[k]?.severity || 'stable';

        // 1. Create Internal Organs (Simple clear shapes glowing inside the body)
        const createOrgan = (key, geom, x, y, z, rotX = 0, rotY = 0, rotZ = 0) => {
            const s = sev(key);
            const c = SEVERITY_COLORS[s] || SEVERITY_COLORS.info;
            const mat = new THREE.MeshPhysicalMaterial({
                color: c, emissive: c, emissiveIntensity: 0.6,
                roughness: 0.2, metalness: 0.1, transmission: 0.2,
                transparent: true, opacity: 0.95
            });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.set(x, y, z);
            mesh.rotation.set(rotX, rotY, rotZ);
            mesh.userData.regionKey = key;
            this.clickables.push(mesh);
            this.bodyPartMap[key] = mesh;
            this.bodyGroup.add(mesh);

            // Pulse ring for critical/warning
            if (s === 'critical' || s === 'warning') {
                const ring = new THREE.Mesh(
                    new THREE.RingGeometry(0.2, 0.22, 64),
                    new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
                );
                ring.position.set(x, y, z);
                ring.userData.phase = Math.random() * Math.PI * 2;
                this.scene.add(ring);
                this.pulseRings.push({ ring, mesh });
            }
        };

        // Approximate organ positions (scaled and positioned to fit inside the 3.5 unit tall GLB model)
        // Center of the model torso is roughly at y=1.5 to 2.5
        createOrgan('head', new THREE.SphereGeometry(0.12, 32, 32), 0, 2.7, 0.05); // Brain
        createOrgan('chest', new THREE.CapsuleGeometry(0.12, 0.15, 16, 16), -0.1, 2.1, 0.08, 0, 0, 0.15); // Lungs/Heart left
        createOrgan('abdomen', new THREE.CapsuleGeometry(0.15, 0.2, 16, 16), 0, 1.6, 0.1, Math.PI / 2, 0, 0); // Stomach/Intestines

        // 2. Load the Realistic Human Shell (GLB)
        const loader = new GLTFLoader();

        loader.load('models/Xbot.glb', (gltf) => {
            const model = gltf.scene;

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3.5 / maxDim;

            model.scale.set(scale, scale, scale);
            // Xbot origin is at feet usually, so we adjust Y slightly
            model.position.set(-center.x * scale, -center.y * scale + 1.25, -center.z * scale);

            // Premium Cyan/Teal Glass Material for the human shell
            const glassMat = new THREE.MeshPhysicalMaterial({
                color: 0x0ea5e9,       // Medical Cyan/Blue
                emissive: 0x0284c7,
                emissiveIntensity: 0.1,
                roughness: 0.2,
                metalness: 0.1,
                transmission: 0.9,     // Highly transparent glass
                thickness: 0.5,
                ior: 1.4,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 0.4,          // Soft fade
                depthWrite: false      // See organs through it clearly
            });

            // Turn the entire Xbot mesh into a beautiful glass shell
            model.traverse((child) => {
                if (child.isMesh || child.isSkinnedMesh) {
                    child.material = glassMat;
                    child.castShadow = true;
                    // Make the shell clickable as fallback
                    child.userData.regionKey = 'chest';
                    this.clickables.push(child);
                }
            });

            this.bodyGroup.add(model);
            console.log("3D Glass Anatomy Shell Loaded Successfully", model);
        }, undefined, (error) => {
            console.error("Error loading anatomy GLB model:", error);
        });
    }

    _addGround() {
        const ground = new THREE.Mesh(
            new THREE.CircleGeometry(2.5, 64),
            new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 1 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0.01;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    _setupInteraction() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hovered = null;

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const hits = raycaster.intersectObjects(this.clickables);
            if (hits.length > 0) {
                this.canvas.style.cursor = 'pointer';
                const obj = hits[0].object;
                if (hovered !== obj) {
                    if (hovered) this._unhighlight(hovered);
                    this._highlight(obj);
                    hovered = obj;
                }
            } else {
                this.canvas.style.cursor = 'grab';
                if (hovered) { this._unhighlight(hovered); hovered = null; }
            }
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const hits = raycaster.intersectObjects(this.clickables);
            if (hits.length > 0) {
                const key = hits[0].object.userData.regionKey;
                if (this.onRegionSelect) this.onRegionSelect(key);
            }
        });
    }

    _highlight(obj) {
        obj.material.emissiveIntensity = 0.5;
        obj.material.opacity = 1;
        obj.scale.multiplyScalar(1.06);
    }

    _unhighlight(obj) {
        obj.material.emissiveIntensity = 0.15;
        obj.material.opacity = 0.85;
        obj.scale.multiplyScalar(1 / 1.06);
    }

    setView(view) {
        const targets = { front: [0, 1.5, 5.5], back: [0, 1.5, -5.5], side: [5.5, 1.5, 0], reset: [0, 1.5, 5.5] };
        const pos = targets[view] || targets.reset;
        const start = this.camera.position.clone();
        const end = new THREE.Vector3(...pos);
        const t0 = Date.now();
        const dur = 600;
        const step = () => {
            const p = Math.min((Date.now() - t0) / dur, 1);
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            this.camera.position.lerpVectors(start, end, ease);
            if (p < 1) requestAnimationFrame(step);
        };
        step();
    }

    toggleAutoRotate() {
        this.controls.autoRotate = !this.controls.autoRotate;
        return this.controls.autoRotate;
    }

    onResize() {
        if (!this.initialized) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) return;
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(rect.width, rect.height);
    }

    startAnimate() {
        if (this.animating) return;
        this.animating = true;
        const loop = () => {
            requestAnimationFrame(loop);
            const t = performance.now() * 0.001;
            this.pulseRings.forEach(({ ring, mesh }) => {
                const phase = ring.userData.phase;
                const s = 1 + 0.25 * Math.sin(t * 2 + phase);
                ring.scale.set(s, s, s);
                ring.material.opacity = 0.4 * (0.5 + 0.5 * Math.cos(t * 2 + phase));
                ring.lookAt(this.camera.position);
            });
            if (this.bodyGroup) {
                this.bodyGroup.position.y = 0.3 + Math.sin(t * 1.5) * 0.006;
            }
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        loop();
    }
}

// ──────────── REGION DETAIL SIDEBAR ────────────────
function showRegionDetail(regionKey) {
    const container = document.getElementById('regionDetails');
    const sidebar = document.getElementById('body3dSidebar');
    if (!container) return;

    const patient = window.MOCK_PATIENTS[0];
    const region = patient.bodyRegions[regionKey];
    if (!region) return;

    const sevLabels = { critical: 'Critique', warning: 'Attention', caution: 'Surveillance', stable: 'Stable', info: 'Information' };
    const sevBadge = { critical: 'badge-critical', warning: 'badge-warning', caution: 'badge-neutral', stable: 'badge-success', info: 'badge-info' };

    let html = `<div class="region-card">
        <div class="region-card-title">
            <span class="severity-dot ${region.severity === 'caution' ? 'warning' : region.severity}"></span>
            ${region.label}
            <span class="badge ${sevBadge[region.severity] || 'badge-neutral'}">${sevLabels[region.severity]}</span>
        </div>`;

    if (region.conditions.length) {
        html += `<div class="region-card-body"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted);margin-bottom:4px;">Conditions</div><ul>`;
        region.conditions.forEach(c => html += `<li>${c}</li>`);
        html += `</ul></div>`;
    }
    if (region.operations?.length) {
        html += `<div style="margin-top:12px;"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted);margin-bottom:4px;">Operations</div>`;
        region.operations.forEach(op => {
            html += `<div style="font-size:12px;color:var(--text-secondary);padding:4px 0;border-bottom:1px solid var(--border-subtle);">${op.name}<br><span style="font-size:10px;color:var(--text-muted);">${op.date} — ${op.hospital} — ${op.surgeon}</span></div>`;
        });
        html += `</div>`;
    }
    if (region.scans?.length) {
        html += `<div style="margin-top:12px;"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted);margin-bottom:6px;">Imagerie</div>`;
        region.scans.forEach(s => {
            html += `<div class="scan-thumb"><div class="scan-thumb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div><div class="scan-thumb-info"><div class="scan-title">${s.type}</div><div class="scan-meta">${s.date} — ${s.lab}</div><div class="scan-meta">${s.doctor} — ${s.result}</div></div></div>`;
        });
        html += `</div>`;
    }
    if (region.medications?.length) {
        html += `<div style="margin-top:12px;"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted);margin-bottom:4px;">Medicaments</div><div style="display:flex;gap:4px;flex-wrap:wrap;">`;
        region.medications.forEach(m => html += `<span class="tag">${m}</span>`);
        html += `</div></div>`;
    }
    if (region.notes) {
        html += `<div style="margin-top:12px;font-size:12px;color:var(--text-secondary);"><em>${region.notes}</em></div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
    const h3 = sidebar?.querySelector('h3');
    if (h3) h3.textContent = region.label;
}

// ──────────── DEFERRED INITIALIZATION ────────────────
let miniViewer = null;
let fullViewer = null;

function initMini() {
    if (miniViewer?.initialized) return;
    if (!miniViewer) {
        miniViewer = new BodyViewer('miniBody3d', {
            mini: true,
            onRegionSelect: (key) => {
                window.switchTab('body3d');
                setTimeout(() => {
                    initFull();
                    showRegionDetail(key);
                }, 150);
            }
        });
    }
    miniViewer.tryInit();
}

function initFull() {
    if (fullViewer?.initialized) return;
    if (!fullViewer) {
        fullViewer = new BodyViewer('fullBody3d', {
            mini: false,
            onRegionSelect: showRegionDetail
        });
    }
    if (fullViewer.tryInit()) {
        // Wire up controls
        window.set3DView = (view, btn) => {
            if (btn) {
                btn.closest('.viewport-controls-bar').querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
            fullViewer.setView(view);
        };
        window.toggle3DAutoRotate = (btn) => {
            const on = fullViewer.toggleAutoRotate();
            btn.classList.toggle('active', on);
        };
    }
}

// Hook into tab switching: initialize 3D when the tab becomes visible
const origSwitchTab = window.switchTab;
window.switchTab = function (tabId) {
    if (origSwitchTab) origSwitchTab(tabId);
    // After tab becomes visible, try to init 3D
    if (tabId === 'body3d') {
        requestAnimationFrame(() => {
            initFull();
            if (fullViewer?.initialized) fullViewer.onResize();
        });
    }
    if (tabId === 'overview') {
        requestAnimationFrame(() => initMini());
    }
};

// On DOMContentLoaded, try to init the mini viewer (overview is visible by default)
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => initMini());
});

// Also use MutationObserver on tab contents to catch visibility changes
const observer = new MutationObserver(() => {
    const body3dTab = document.getElementById('tab-body3d');
    if (body3dTab && body3dTab.classList.contains('active')) {
        requestAnimationFrame(() => {
            initFull();
            if (fullViewer?.initialized) fullViewer.onResize();
        });
    }
    const overviewTab = document.getElementById('tab-overview');
    if (overviewTab && overviewTab.classList.contains('active')) {
        requestAnimationFrame(() => {
            initMini();
            if (miniViewer?.initialized) miniViewer.onResize();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(el => observer.observe(el, { attributes: true, attributeFilter: ['class'] }));
});
