// ═══════════════════════════════════════════════════════════
// SihhaTek — Mock Patient Data (ES Module)
// ═══════════════════════════════════════════════════════════

export const MOCK_PATIENTS = [
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
        city: "Fes",
        phone: "+212 6 12 34 56 78",
        emergencyContact: "Fatima El Amrani (epouse) — +212 6 23 45 67 89",
        allergies: ["Penicilline", "Sulfamides"],
        conditions: [
            { name: "Diabete type 2", severity: "critical", since: "2016", details: "HbA1c : 7.8%" },
            { name: "Hypertension arterielle stade 2", severity: "critical", since: "2018", details: "TA : 155/95 mmHg" },
            { name: "Hypercholesterolemie", severity: "warning", since: "2019", details: "LDL : 1.8 g/L" },
            { name: "Gonarthrose genou gauche", severity: "warning", since: "2023", details: "Grade 2" }
        ],
        medications: [
            { name: "Metformine 1000mg", dosage: "2x/jour", purpose: "Diabete" },
            { name: "Gliclazide 60mg", dosage: "1x/jour matin", purpose: "Diabete" },
            { name: "Amlodipine 10mg", dosage: "1x/jour", purpose: "HTA" },
            { name: "Bisoprolol 5mg", dosage: "1x/jour matin", purpose: "HTA" },
            { name: "Atorvastatine 20mg", dosage: "1x/jour soir", purpose: "Cholesterol" },
            { name: "Ibuprofene 400mg", dosage: "PRN", purpose: "Douleur articulaire" }
        ],
        interactions: [
            {
                severity: "critical",
                drugs: ["Amlodipine", "Bisoprolol"],
                risk: "Risque de bradycardie severe. Surveillance de la frequence cardiaque requise.",
                source: "Base Vidal"
            },
            {
                severity: "critical",
                drugs: ["Gliclazide", "Jeune Ramadan"],
                risk: "Risque eleve d'hypoglycemie (x7.5). Adapter les horaires de prise.",
                source: "DrugBank"
            },
            {
                severity: "warning",
                drugs: ["Ibuprofene", "Amlodipine"],
                risk: "Reduction de l'effet antihypertenseur. Preferer le paracetamol.",
                source: "Base Vidal"
            }
        ],
        bodyRegions: {
            head: {
                label: "Tete / Neurologie",
                severity: "caution",
                conditions: ["Cephalees de tension chroniques (depuis 2021)"],
                operations: [],
                scans: [
                    { type: "Scanner cerebral", date: "2021-09-14", lab: "Centre d'Imagerie Atlas, Fes", doctor: "Dr. Bennani", result: "Normal", image: "/scan-brain.png" }
                ],
                medications: ["Paracetamol 1g PRN"],
                notes: "Scanner cerebral normal. Migraines gerees par paracetamol."
            },
            chest: {
                label: "Thorax / Cardiovasculaire",
                severity: "critical",
                conditions: [
                    "Hypertension arterielle stade 2 (diagnostiquee 2018)",
                    "Arythmie sinusale detectee a l'ECG (2024)",
                    "Cholesterol LDL eleve : 1.8 g/L"
                ],
                operations: [],
                scans: [
                    { type: "ECG", date: "2024-06-20", lab: "CHU Hassan II, Fes", doctor: "Dr. Alaoui", result: "Arythmie sinusale" },
                    { type: "Echocardiographie", date: "2024-07-05", lab: "CHU Hassan II, Fes", doctor: "Dr. Alaoui", result: "Fraction d'ejection 55%, sans anomalie structurelle" },
                    { type: "Radiographie thoracique", date: "2023-01-12", lab: "Clinique Ibn Sina, Fes", doctor: "Dr. Moussaoui", result: "Index cardiothoracique normal", image: "/scan-thorax.png" }
                ],
                medications: ["Amlodipine 10mg", "Bisoprolol 5mg", "Atorvastatine 20mg"],
                notes: "Suivi cardiologique trimestriel. Derniere consultation : janvier 2026."
            },
            abdomen: {
                label: "Abdomen / Metabolisme",
                severity: "critical",
                conditions: [
                    "Diabete type 2 (diagnostique 2016) — HbA1c : 7.8%",
                    "Steatose hepatique (foie gras) — Grade 1"
                ],
                operations: [],
                scans: [
                    { type: "Echographie abdominale", date: "2022-11-03", lab: "Centre Radio Fes Medina", doctor: "Dr. Tazi", result: "Steatose hepatique grade 1", image: "/scan-abdomen.png" },
                    { type: "Bilan sanguin complet", date: "2026-01-08", lab: "Laboratoire Central Fes", doctor: "Dr. Karimi", result: "HbA1c 7.8%, Creatinine 12 mg/L, ASAT/ALAT normaux" }
                ],
                medications: ["Metformine 1000mg", "Gliclazide 60mg"],
                notes: "Patient jeune pendant le Ramadan. 2 episodes hypoglycemiques en 2025."
            },
            leftArm: {
                label: "Bras gauche / Vasculaire",
                severity: "info",
                conditions: ["Site de mesure TA habituel"],
                operations: [],
                scans: [],
                medications: [],
                notes: "Voie veineuse peripherique posee lors du passage aux urgences (mars 2025)."
            },
            rightArm: {
                label: "Bras droit",
                severity: "stable",
                conditions: [],
                operations: [],
                scans: [],
                medications: [],
                notes: "Aucune condition signalee."
            },
            leftLeg: {
                label: "Jambe gauche / Orthopedie",
                severity: "warning",
                conditions: [
                    "Gonarthrose du genou gauche (Grade 2)",
                    "Neuropathie diabetique peripherique debutante"
                ],
                operations: [],
                scans: [
                    { type: "IRM genou gauche", date: "2023-04-18", lab: "IRM Atlas, Fes", doctor: "Dr. Cherkaoui", result: "Gonarthrose grade 2, pincement femoro-tibial medial" },
                    { type: "EMG membres inferieurs", date: "2025-02-10", lab: "CHU Hassan II, Fes", doctor: "Dr. Fassi Fihri", result: "Neuropathie sensitive debutante" }
                ],
                medications: ["Ibuprofene 400mg PRN"],
                notes: "Neuropathie en lien avec le diabete. Suivi neurologique annuel recommande."
            },
            rightLeg: {
                label: "Jambe droite",
                severity: "stable",
                conditions: ["Cicatrice tibia droit (fracture 2005)"],
                operations: [
                    { name: "Osteosynthese par plaque — fracture ouverte tibia", date: "2005-08-22", hospital: "CHR Meknes", surgeon: "Dr. El Hajjami" },
                    { name: "Ablation du materiel d'osteosynthese", date: "2007-03-14", hospital: "CHR Meknes", surgeon: "Dr. El Hajjami" }
                ],
                scans: [
                    { type: "Radiographie tibia", date: "2007-06-01", lab: "CHR Meknes", doctor: "Dr. El Hajjami", result: "Consolidation complete, pas de sequelle" }
                ],
                medications: [],
                notes: "Consolidation complete. Pas de sequelle fonctionnelle."
            }
        },
        history: [
            // ═══ URGENT / CRITICAL ═══
            { date: "2025-03-12", type: "urgence", title: "Passage aux urgences — Malaise hypoglycemique", doctor: "Dr. Lahlou", hospital: "CHU Hassan II, Fes", details: "Glycemie 0.45 g/L. Resucrage IV. Voie veineuse bras gauche. Observation 6h." },
            { date: "2005-08-22", type: "operation", title: "Osteosynthese tibia droit", doctor: "Dr. El Hajjami", hospital: "CHR Meknes", details: "Fracture ouverte tibia droit (accident de la route). Pose plaque et vis." },
            { date: "2007-03-14", type: "operation", title: "Ablation materiel d'osteosynthese", doctor: "Dr. El Hajjami", hospital: "CHR Meknes", details: "Ablation de la plaque tibiale. Suites simples." },
            // ═══ CONSULTATIONS SPECIALISEES ═══
            { date: "2026-01-15", type: "consultation", title: "Consultation cardiologie", doctor: "Dr. Alaoui", hospital: "CHU Hassan II, Fes", details: "Controle HTA. Ajustement Bisoprolol. TA 150/92." },
            { date: "2025-10-20", type: "consultation", title: "Consultation diabetologie", doctor: "Dr. Idrissi", hospital: "CHU Hassan II, Fes", details: "Ajustement Metformine. Discussion sur le jeune Ramadan." },
            { date: "2018-05-10", type: "consultation", title: "Diagnostic HTA", doctor: "Dr. Alaoui", hospital: "CHU Hassan II, Fes", details: "Premiere decouverte HTA stade 2. Mise sous Amlodipine." },
            { date: "2016-09-01", type: "consultation", title: "Diagnostic Diabete type 2", doctor: "Dr. Idrissi", hospital: "CHU Hassan II, Fes", details: "Glycemie a jeun 2.3 g/L. HbA1c 8.1%. Mise sous Metformine." },
            // ═══ ANALYSES & IMAGERIE ═══
            { date: "2026-01-08", type: "analyse", title: "Bilan sanguin complet", doctor: "Dr. Karimi", hospital: "Laboratoire Central Fes", details: "HbA1c 7.8%, Creatinine 12mg/L, Bilan hepatique normal." },
            { date: "2025-02-10", type: "imagerie", title: "EMG membres inferieurs", doctor: "Dr. Fassi Fihri", hospital: "CHU Hassan II, Fes", details: "Neuropathie sensitive debutante aux membres inferieurs." },
            { date: "2024-07-05", type: "imagerie", title: "Echocardiographie", doctor: "Dr. Alaoui", hospital: "CHU Hassan II, Fes", details: "Fraction d'ejection 55%. Sans anomalie structurelle." },
            { date: "2024-06-20", type: "imagerie", title: "ECG de controle", doctor: "Dr. Alaoui", hospital: "CHU Hassan II, Fes", details: "Arythmie sinusale. Pas de trouble conductif." },
            { date: "2023-04-18", type: "imagerie", title: "IRM genou gauche", doctor: "Dr. Cherkaoui", hospital: "IRM Atlas, Fes", details: "Gonarthrose grade 2, pincement femoro-tibial medial." },
            { date: "2023-01-12", type: "imagerie", title: "Radiographie thoracique", doctor: "Dr. Moussaoui", hospital: "Clinique Ibn Sina, Fes", details: "Index cardiothoracique normal. Pas d'anomalie parenchymateuse." },
            { date: "2022-11-03", type: "imagerie", title: "Echographie abdominale", doctor: "Dr. Tazi", hospital: "Centre Radio Fes Medina", details: "Steatose hepatique grade 1." },
            { date: "2021-09-14", type: "imagerie", title: "Scanner cerebral", doctor: "Dr. Bennani", hospital: "Centre d'Imagerie Atlas, Fes", details: "Scanner normal. Pas de lesion intracranienne." },
            // ═══ VACCINATIONS ═══
            { date: "2025-06-01", type: "vaccination", title: "Vaccin antigrippal saisonnier", doctor: "Dr. Benmoussa", hospital: "Centre de Sante Fes Medina", details: "Vaccination annuelle recommandee (patient diabetique)." },
            // ═══ NON-URGENTS (dentiste, ophtalmo, dermato) ═══
            // Ces entrees montrent l'importance du mode Urgence qui FILTRE pour ne garder que le critique
            { date: "2025-11-18", type: "consultation", title: "Consultation ophtalmologie — Fond d'oeil", doctor: "Dr. Berrada", hospital: "Centre Ophtalmo Atlas, Fes", details: "Fond d'oeil annuel (suivi diabetique). Retinopathie stade 0 — normal. Acuite visuelle 8/10 G, 9/10 D. Prochain controle dans 12 mois." },
            { date: "2025-09-05", type: "consultation", title: "Consultation dermatologie — Lesion pigmentee", doctor: "Dr. Senhaji", hospital: "Cabinet Dermatologique Fes", details: "Naevus benigni au dos. Dermoscopie rassurante. Surveillance annuelle. Creme hydratante prescrite (secheresse cutanee liee au diabete)." },
            { date: "2025-07-22", type: "consultation", title: "Consultation dentaire — Detartrage", doctor: "Dr. Ouazzani", hospital: "Cabinet Dentaire Ibn Sina, Fes", details: "Detartrage de routine. Gingivite legere liee au diabete. Brossage recommande 3x/jour. Prochain RDV dans 6 mois." },
            { date: "2025-04-10", type: "consultation", title: "Consultation ORL — Acouphenes", doctor: "Dr. Filali", hospital: "Clinique ORL Fes Ville Nouvelle", details: "Acouphenes intermittents bilateraux depuis 3 mois. Audiogramme normal. Pas de surdite. Lien possible avec HTA. Surveillance." },
            { date: "2024-12-03", type: "consultation", title: "Consultation rhumatologie", doctor: "Dr. Chraibi", hospital: "CHU Hassan II, Fes", details: "Controle gonarthrose. Grade 2 stable. Kinetitherapie recommandee 2x/semaine. Pas d'indication chirurgicale." },
            { date: "2024-09-15", type: "consultation", title: "Consultation pneumologie — Bilan", doctor: "Dr. El Alami", hospital: "CHU Hassan II, Fes", details: "EFR normales. Pas de BPCO. Patient non-fumeur. SpO2 98%. Pas de suivi necessaire." },
            { date: "2024-04-08", type: "consultation", title: "Consultation dermatologie — Eczema", doctor: "Dr. Senhaji", hospital: "Cabinet Dermatologique Fes", details: "Eczema mains (lien avec stress et diabete). Dermocorticoide classe 2 prescrit. Amelioration attendue sous 2 semaines." },
            { date: "2023-11-20", type: "consultation", title: "Consultation ophtalmologie — Correction optique", doctor: "Dr. Berrada", hospital: "Centre Ophtalmo Atlas, Fes", details: "Presbytie progressive. Nouvelles lunettes prescrites. Pas de glaucome. Fond d'oeil normal." }
        ]
    }
];

// ═══ RECENT PATIENTS — Chacun avec un use case different ═══
export const RECENT_PATIENTS = [
    {
        id: "PAT-2024-00147", name: "Youssef El Amrani", initials: "YA",
        age: 58, sex: "H", lastVisit: "15/01/2026", alerts: 3, alertLevel: "critical",
        useCase: "Diabete + HTA + Cardio", specialty: "Cardiologie / Diabetologie"
    },
    {
        id: "PAT-2024-00312", name: "Khadija Benkirane", initials: "KB",
        age: 34, sex: "F", lastVisit: "12/01/2026", alerts: 0, alertLevel: "success",
        useCase: "Grossesse suivi prenatal", specialty: "Gynecologie / Obstetrique"
    },
    {
        id: "PAT-2024-00089", name: "Mohammed Tazi", initials: "MT",
        age: 72, sex: "H", lastVisit: "08/01/2026", alerts: 1, alertLevel: "warning",
        useCase: "Post-AVC + Revalidation", specialty: "Neurologie / Reeducation"
    },
    {
        id: "PAT-2023-00456", name: "Amina Fassi Fihri", initials: "AF",
        age: 45, sex: "F", lastVisit: "20/12/2025", alerts: 0, alertLevel: "success",
        useCase: "Suivi thyroide + Bilan annuel", specialty: "Endocrinologie"
    },
    {
        id: "PAT-2024-00201", name: "Hassan El Mansouri", initials: "HM",
        age: 63, sex: "H", lastVisit: "18/12/2025", alerts: 2, alertLevel: "warning",
        useCase: "Cancer colon — Chimio en cours", specialty: "Oncologie / Chirurgie digestive"
    }
];

export const HISTORY_TYPES = {
    consultation: { label: "Consultation", color: "info" },
    analyse: { label: "Analyse", color: "info" },
    vaccination: { label: "Vaccination", color: "success" },
    urgence: { label: "Urgence", color: "critical" },
    imagerie: { label: "Imagerie", color: "info" },
    operation: { label: "Operation", color: "warning" },
    medicament: { label: "Medicament", color: "info" }
};

export function formatDate(dateStr) {
    const d = new Date(dateStr);
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
