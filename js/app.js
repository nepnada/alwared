// ═══════════════════════════════════════════════════════════
// SihhaTek — App Logic
// Tab switching, history rendering, imagerie grid
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    renderHistory('all');
    renderImagerieGrid();
});

// ──────────── TAB SWITCHING ────────────
function initTabs() {
    const tabNav = document.getElementById('tabNav');
    if (!tabNav) return;
    tabNav.querySelectorAll('.tab-item').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const btn = document.querySelector(`.tab-item[data-tab="${tabId}"]`);
    const content = document.getElementById(`tab-${tabId}`);
    if (btn) btn.classList.add('active');
    if (content) content.classList.add('active');
}
window.switchTab = switchTab;

// ──────────── HISTORY TIMELINE ────────────
function renderHistory(filter) {
    const container = document.getElementById('historyTimeline');
    if (!container) return;
    const patient = window.MOCK_PATIENTS[0];
    const entries = filter === 'all'
        ? patient.history
        : patient.history.filter(h => h.type === filter);

    container.innerHTML = entries.map(entry => {
        const typeInfo = window.HISTORY_TYPES[entry.type] || { label: entry.type, color: 'info' };
        return `
        <div class="timeline-item" data-type="${entry.type}">
            <div class="timeline-dot ${typeInfo.color}">
                ${getTypeIcon(entry.type)}
            </div>
            <div class="timeline-content">
                <div class="timeline-date">${formatDate(entry.date)}</div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <div class="timeline-title">${entry.title}</div>
                    <span class="badge badge-${typeInfo.color}">${typeInfo.label}</span>
                </div>
                <div class="timeline-meta" style="margin-bottom:4px;">
                    ${svgIcon('user', 12)} ${entry.doctor} — ${entry.hospital}
                </div>
                <div style="font-size:13px;color:var(--text-secondary);line-height:1.5;">${entry.details}</div>
            </div>
        </div>`;
    }).join('');
}

function filterHistory(btn, type) {
    btn.closest('.pill-group').querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    renderHistory(type);
}
window.filterHistory = filterHistory;

// ──────────── IMAGERIE GRID ────────────
function renderImagerieGrid() {
    const grid = document.getElementById('imagerieGrid');
    if (!grid) return;
    const patient = window.MOCK_PATIENTS[0];
    const scans = [];

    // Collect scans from all body regions
    Object.values(patient.bodyRegions).forEach(region => {
        region.scans.forEach(scan => {
            scans.push({ ...scan, regionLabel: region.label });
        });
    });

    // Sort by date descending
    scans.sort((a, b) => b.date.localeCompare(a.date));

    grid.innerHTML = scans.map(scan => `
        <div class="image-card">
            <div class="image-card-preview">
                ${getScanIcon(scan.type)}
            </div>
            <div class="image-card-info">
                <div class="image-title">${scan.type}</div>
                <div class="image-meta">${formatDate(scan.date)}</div>
                <div class="image-meta">${scan.lab}</div>
                <div class="image-meta">${scan.doctor}</div>
                <div style="margin-top:4px;"><span class="tag" style="font-size:10px;">${scan.regionLabel}</span></div>
            </div>
        </div>
    `).join('');
}

// ──────────── 3D VIEW CONTROLS ────────────
function set3DView(view, btn) {
    if (btn) {
        btn.closest('.viewport-controls-bar').querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    // will be wired to Three.js later
}
window.set3DView = set3DView;

function toggle3DAutoRotate(btn) {
    btn.classList.toggle('active');
}
window.toggle3DAutoRotate = toggle3DAutoRotate;

// ──────────── HELPERS ────────────
function formatDate(dateStr) {
    const d = new Date(dateStr);
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function svgIcon(name, size = 16) {
    const icons = {
        user: `<svg style="width:${size}px;height:${size}px;vertical-align:middle;color:var(--text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    };
    return icons[name] || '';
}

function getTypeIcon(type) {
    const icons = {
        consultation: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>`,
        analyse: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`,
        vaccination: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>`,
        urgence: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/><path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"/></svg>`,
        imagerie: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
        operation: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`,
        medicament: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`
    };
    return icons[type] || icons.consultation;
}

function getScanIcon(type) {
    const lower = type.toLowerCase();
    if (lower.includes('radio') || lower.includes('scanner')) {
        return `<svg style="width:32px;height:32px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>`;
    }
    if (lower.includes('irm')) {
        return `<svg style="width:32px;height:32px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10"/><path d="M12 2a15 15 0 0 0-4 10 15 15 0 0 0 4 10"/><path d="M2 12h20"/></svg>`;
    }
    if (lower.includes('echo')) {
        return `<svg style="width:32px;height:32px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
    }
    if (lower.includes('ecg')) {
        return `<svg style="width:32px;height:32px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
    }
    return `<svg style="width:32px;height:32px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
}
