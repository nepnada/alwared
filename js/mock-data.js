// ═══════════════════════════════════════════════════════════
// SihhaTek — Mock Patient Data
// ═══════════════════════════════════════════════════════════

const MOCK_PATIENTS = [
    {
        id: "PAT-2024-00147",
        firstName: "Youssef",
        lastName: "El Amrani",
        initials: "YA",
        age: 58,
        dateOfBirth: "1968-03-15",
        sex: "Homme",
        bloodType: "A+",
        height: "174 cm",
        weight: "89 kg",
        city: "Fès",
        phone: "+212 6 12 34 56 78",
        emergencyContact: "Fatima El Amrani (épouse) — +212 6 23 45 67 89",
        allergies: ["Pénicilline", "Sulfamides"],
        conditions: [
            { name: "Diabète type 2", severity: "critical", since: "2016", details: "HbA1c : 7.8%" },
            { name: "Hypertension artérielle stade 2", severity: "critical", since: "2018", details: "TA : 155/95 mmHg" },
            { name: "Hypercholestérolémie", severity: "warning", since: "2019", details: "LDL : 1.8 g/L" },
            { name: "Gonarthrose genou gauche", severity: "warning", since: "2023", details: "Grade 2" }
        ],
        medications: [
            { name: "Metformine 1000mg", dosage: "2x/jour", purpose: "Diabète" },
            { name: "Gliclazide 60mg", dosage: "1x/jour matin", purpose: "Diabète" },
            { name: "Amlodipine 10mg", dosage: "1x/jour", purpose: "HTA" },
            { name: "Bisoprolol 5mg", dosage: "1x/jour matin", purpose: "HTA" },
            { name: "Atorvastatine 20mg", dosage: "1x/jour soir", purpose: "Cholestérol" },
            { name: "Ibuprofène 400mg", dosage: "PRN", purpose: "Douleur articulaire" }
        ],
        interactions: [
            {
                severity: "critical",
                drugs: ["Amlodipine", "Bisoprolol"],
                risk: "Risque de bradycardie sévère. Surveillance de la fréquence cardiaque requise.",
                source: "Base Vidal"
            },
            {
                severity: "critical",
                drugs: ["Gliclazide", "Jeûne Ramadan"],
                risk: "Risque élevé d'hypoglycémie (x7.5). Adapter les horaires de prise.",
                source: "DrugBank"
            },
            {
                severity: "warning",
                drugs: ["Ibuprofène", "Amlodipine"],
                risk: "Réduction de l'effet antihypertenseur. Préférer le paracétamol.",
                source: "Base Vidal"
            }
        ],
        bodyRegions: {
            head: {
                label: "Tete / Neurologie",
                severity: "caution",
                conditions: ["Céphalées de tension chroniques (depuis 2021)"],
                operations: [],
                scans: [
                    { type: "Scanner cérébral", date: "2021-09-14", lab: "Centre d'Imagerie Atlas, Fès", doctor: "Dr. Bennani", result: "Normal" }
                ],
                medications: ["Paracétamol 1g PRN"],
                notes: "Scanner cérébral normal. Migraines gérées par paracétamol."
            },
            chest: {
                label: "Thorax / Cardiovasculaire",
                severity: "critical",
                conditions: [
                    "Hypertension artérielle stade 2 (diagnostiquée 2018)",
                    "Arythmie sinusale détectée a l'ECG (2024)",
                    "Cholestérol LDL élevé : 1.8 g/L"
                ],
                operations: [],
                scans: [
                    { type: "ECG", date: "2024-06-20", lab: "CHU Hassan II, Fès", doctor: "Dr. Alaoui", result: "Arythmie sinusale" },
                    { type: "Echocardiographie", date: "2024-07-05", lab: "CHU Hassan II, Fès", doctor: "Dr. Alaoui", result: "Fraction d'éjection 55%, sans anomalie structurelle" },
                    { type: "Radiographie thoracique", date: "2023-01-12", lab: "Clinique Ibn Sina, Fès", doctor: "Dr. Moussaoui", result: "Index cardiothoracique normal" }
                ],
                medications: ["Amlodipine 10mg", "Bisoprolol 5mg", "Atorvastatine 20mg"],
                notes: "Suivi cardiologique trimestriel. Dernière consultation : janvier 2026."
            },
            abdomen: {
                label: "Abdomen / Metabolisme",
                severity: "critical",
                conditions: [
                    "Diabète type 2 (diagnostiqué 2016) — HbA1c : 7.8%",
                    "Stéatose hépatique (foie gras) — Grade 1"
                ],
                operations: [],
                scans: [
                    { type: "Echographie abdominale", date: "2022-11-03", lab: "Centre Radio Fès Médina", doctor: "Dr. Tazi", result: "Stéatose hépatique grade 1" },
                    { type: "Bilan sanguin complet", date: "2026-01-08", lab: "Laboratoire Central Fès", doctor: "Dr. Karimi", result: "HbA1c 7.8%, Créatinine 12 mg/L, ASAT/ALAT normaux" }
                ],
                medications: ["Metformine 1000mg", "Gliclazide 60mg"],
                notes: "Patient jeûne pendant le Ramadan. 2 épisodes hypoglycémiques en 2025."
            },
            leftArm: {
                label: "Bras gauche / Vasculaire",
                severity: "info",
                conditions: ["Site de mesure TA habituel"],
                operations: [],
                scans: [],
                medications: [],
                notes: "Voie veineuse périphérique posée lors du passage aux urgences (mars 2025)."
            },
            rightArm: {
                label: "Bras droit",
                severity: "stable",
                conditions: [],
                operations: [],
                scans: [],
                medications: [],
                notes: "Aucune condition signalée."
            },
            leftLeg: {
                label: "Jambe gauche / Orthopedie",
                severity: "warning",
                conditions: [
                    "Gonarthrose du genou gauche (Grade 2)",
                    "Neuropathie diabétique périphérique débutante"
                ],
                operations: [],
                scans: [
                    { type: "IRM genou gauche", date: "2023-04-18", lab: "IRM Atlas, Fès", doctor: "Dr. Cherkaoui", result: "Gonarthrose grade 2, pincement fémoro-tibial médial" },
                    { type: "EMG membres inférieurs", date: "2025-02-10", lab: "CHU Hassan II, Fès", doctor: "Dr. Fassi Fihri", result: "Neuropathie sensitive débutante" }
                ],
                medications: ["Ibuprofène 400mg PRN"],
                notes: "Neuropathie en lien avec le diabète. Suivi neurologique annuel recommandé."
            },
            rightLeg: {
                label: "Jambe droite",
                severity: "stable",
                conditions: ["Cicatrice tibia droit (fracture 2005)"],
                operations: [
                    { name: "Ostéosynthèse par plaque — fracture ouverte tibia", date: "2005-08-22", hospital: "CHR Meknès", surgeon: "Dr. El Hajjami" },
                    { name: "Ablation du materiel d'ostéosynthèse", date: "2007-03-14", hospital: "CHR Meknès", surgeon: "Dr. El Hajjami" }
                ],
                scans: [
                    { type: "Radiographie tibia", date: "2007-06-01", lab: "CHR Meknès", doctor: "Dr. El Hajjami", result: "Consolidation complète, pas de séquelle" }
                ],
                medications: [],
                notes: "Consolidation complète. Pas de séquelle fonctionnelle."
            }
        },
        history: [
            { date: "2026-01-15", type: "consultation", title: "Consultation cardiologie", doctor: "Dr. Alaoui", hospital: "CHU Hassan II, Fès", details: "Contrôle HTA. Ajustement Bisoprolol. TA 150/92." },
            { date: "2026-01-08", type: "analyse", title: "Bilan sanguin complet", doctor: "Dr. Karimi", hospital: "Laboratoire Central Fès", details: "HbA1c 7.8%, Créatinine 12mg/L, Bilan hépatique normal." },
            { date: "2025-10-20", type: "consultation", title: "Consultation diabétologie", doctor: "Dr. Idrissi", hospital: "CHU Hassan II, Fès", details: "Ajustement Metformine. Discussion sur le jeûne Ramadan." },
            { date: "2025-06-01", type: "vaccination", title: "Vaccin antigrippal saisonnier", doctor: "Dr. Benmoussa", hospital: "Centre de Santé Fès Médina", details: "Vaccination annuelle recommandée (patient diabétique)." },
            { date: "2025-03-12", type: "urgence", title: "Passage aux urgences — Malaise hypoglycémique", doctor: "Dr. Lahlou", hospital: "CHU Hassan II, Fès", details: "Glycémie 0.45 g/L. Resucrage IV. Voie veineuse bras gauche. Observation 6h." },
            { date: "2025-02-10", type: "imagerie", title: "EMG membres inférieurs", doctor: "Dr. Fassi Fihri", hospital: "CHU Hassan II, Fès", details: "Neuropathie sensitive débutante aux membres inférieurs." },
            { date: "2024-07-05", type: "imagerie", title: "Echocardiographie", doctor: "Dr. Alaoui", hospital: "CHU Hassan II, Fès", details: "Fraction d'éjection 55%. Sans anomalie structurelle." },
            { date: "2024-06-20", type: "imagerie", title: "ECG de controle", doctor: "Dr. Alaoui", hospital: "CHU Hassan II, Fès", details: "Arythmie sinusale. Pas de trouble conductif." },
            { date: "2023-04-18", type: "imagerie", title: "IRM genou gauche", doctor: "Dr. Cherkaoui", hospital: "IRM Atlas, Fès", details: "Gonarthrose grade 2, pincement fémoro-tibial médial." },
            { date: "2023-01-12", type: "imagerie", title: "Radiographie thoracique", doctor: "Dr. Moussaoui", hospital: "Clinique Ibn Sina, Fès", details: "Index cardiothoracique normal. Pas d'anomalie parenchymateuse." },
            { date: "2022-11-03", type: "imagerie", title: "Echographie abdominale", doctor: "Dr. Tazi", hospital: "Centre Radio Fès Médina", details: "Stéatose hépatique grade 1." },
            { date: "2021-09-14", type: "imagerie", title: "Scanner cérébral", doctor: "Dr. Bennani", hospital: "Centre d'Imagerie Atlas, Fès", details: "Scanner normal. Pas de lésion intracrânienne." },
            { date: "2018-05-10", type: "consultation", title: "Diagnostic HTA", doctor: "Dr. Alaoui", hospital: "CHU Hassan II, Fès", details: "Première découverte HTA stade 2. Mise sous Amlodipine." },
            { date: "2016-09-01", type: "consultation", title: "Diagnostic Diabète type 2", doctor: "Dr. Idrissi", hospital: "CHU Hassan II, Fès", details: "Glycémie à jeun 2.3 g/L. HbA1c 8.1%. Mise sous Metformine." },
            { date: "2007-03-14", type: "operation", title: "Ablation materiel d'ostéosynthèse", doctor: "Dr. El Hajjami", hospital: "CHR Meknès", details: "Ablation de la plaque tibiale. Suites simples." },
            { date: "2005-08-22", type: "operation", title: "Ostéosynthèse tibia droit", doctor: "Dr. El Hajjami", hospital: "CHR Meknès", details: "Fracture ouverte tibia droit (accident de la route). Pose plaque et vis." }
        ]
    }
];

// Recent patients for the search page
const RECENT_PATIENTS = [
    { id: "PAT-2024-00147", name: "Youssef El Amrani", initials: "YA", age: 58, sex: "H", lastVisit: "15/01/2026" },
    { id: "PAT-2024-00312", name: "Khadija Benkirane", initials: "KB", age: 34, sex: "F", lastVisit: "12/01/2026" },
    { id: "PAT-2024-00089", name: "Mohammed Tazi", initials: "MT", age: 72, sex: "H", lastVisit: "08/01/2026" },
    { id: "PAT-2023-00456", name: "Amina Fassi Fihri", initials: "AF", age: 45, sex: "F", lastVisit: "20/12/2025" },
    { id: "PAT-2024-00201", name: "Hassan El Mansouri", initials: "HM", age: 63, sex: "H", lastVisit: "18/12/2025" }
];

// History type icons & labels
const HISTORY_TYPES = {
    consultation: { label: "Consultation", color: "info" },
    analyse: { label: "Analyse", color: "info" },
    vaccination: { label: "Vaccination", color: "success" },
    urgence: { label: "Urgence", color: "critical" },
    imagerie: { label: "Imagerie", color: "info" },
    operation: { label: "Operation", color: "warning" },
    medicament: { label: "Medicament", color: "info" }
};

// Make available globally
window.MOCK_PATIENTS = MOCK_PATIENTS;
window.RECENT_PATIENTS = RECENT_PATIENTS;
window.HISTORY_TYPES = HISTORY_TYPES;
