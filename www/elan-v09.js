/* ============ Élan v0.9 — intégration du canvas de design (05/10/2026) ============
   Demande de Sarah : transférer dans l'application tous les écrans du canvas.
   - Espace enfant 6-10 ans : univers « Aventure » réaliste, Élio en drone, Mon île, album d'autocollants,
     l'aventure d'Élio (une porte = une énigme = un exercice choisi par Élan, une étape par jour au maximum).
   - Espace ado 11 ans et + : univers « Odyssée » (héros Nova, Kai, Sol ; QG, carte de l'archipel, compétences,
     casier, boutique en éclats ; jamais d'argent réel ni de tirage au hasard). Réglable dans « Mon univers ».
   - Espace enseignant : charte Élan (bleu, angles droits), photo du polycopié, Studio (carte mentale, vidéo, chanson).
   Cette couche s'ajoute au code existant sans le modifier : elle remplace quelques fonctions d'affichage
   et ajoute des vues. Les mesures des exercices ne changent pas. */
'use strict';

const V9 = {
  img: n => `img/${n}.jpg`,
  jour: () => dk(Date.now()),
  svg: (inner, w = 24) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`,
};
const V9_I = {
  maison: V9.svg('<path d="M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z"/>'),
  carte: V9.svg('<path d="M9 4L3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5"/><path d="M15 6.5V20"/>'),
  ile: V9.svg('<path d="M12 21v-8"/><path d="M12 13c-3-4-7-4-9-2"/><path d="M12 13c3-4 7-4 9-2"/><path d="M12 13c-1-4-4-7-7-7"/><path d="M12 13c1-4 4-7 7-7"/><path d="M4 21h16"/>'),
  album: V9.svg('<path d="M5 4h14v16H5z"/><circle cx="12" cy="11" r="3.5"/><path d="M8 17h8"/>'),
  qg: V9.svg('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>'),
  skills: V9.svg('<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>'),
  casier: V9.svg('<rect x="5" y="3" width="14" height="18"/><path d="M12 3v18M9 10v2M15 10v2"/>'),
  boutique: V9.svg('<path d="M4 9h16l-1.5 11h-13z"/><path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2"/>'),
  audio: V9.svg('<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
  retour: V9.svg('<path d="M15 6l-6 6 6 6"/>', 20),
  cadenas: V9.svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  ouvert: V9.svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>'),
  ok: V9.svg('<path d="M5 12.5l4.5 4.5L19 7"/>'),
  plus: V9.svg('<path d="M12 5v14M5 12h14"/>', 22),
  lune: V9.svg('<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>'),
  play: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>',
  photo: V9.svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  studio: V9.svg('<rect x="3" y="5" width="18" height="12"/><path d="M10 9l5 2.5-5 2.5z"/><path d="M8 21h8"/>'),
  eclat: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2l7 10-7 10-7-10z" fill="#E36E63"/><path d="M12 2l3.5 10L12 22z" fill="#F09C1F"/></svg>',
};
const v9Etoile = (t = 18, f = '#F09C1F') => `<svg viewBox="0 0 24 24" width="${t}" height="${t}" aria-hidden="true"><path d="M12 2.8l2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2-4.6-4.4 6.3-.9z" fill="${f}"/></svg>`;
const v9Audio = (texte, label = 'Écouter') => `<button type="button" class="v9-audio" data-act="v9-dire" data-t="${esc(texte)}" aria-label="${esc(label)}">${V9_I.audio}</button>`;

/* ---------- univers du profil ---------- */
function v9Univers(p) {
  if (!p || p.groupe !== 'enfant') return '';
  const u = p.reglages?.univers;
  if (u === 'calme') return 'calme';
  if (u === 'aventure' || u === 'odyssee') return u;
  const a = ageDe(p.naissance);
  return a != null && a >= 11 ? 'odyssee' : 'aventure';
}
function v9Etat(p) {
  p.v9 ??= {};
  p.v9.aventure ??= { faits: {} }; p.v9.aventure.faits ??= {};
  p.v9.odyssee ??= { faits: {}, heros: null, achats: [], equipe: {}, depenses: 0 };
  const O = p.v9.odyssee; O.faits ??= {}; O.achats ??= []; O.equipe ??= {}; O.depenses ??= 0;
  p.v9.ile ??= { slots: {}, sel: 'arbre' };
  return p.v9;
}
const v9FamImg = { attention: 'elio-r-ile', memoire: 'elio-r-grotte', langage: 'elio-r-ville', executif: 'elio-r-chateau', vitesse: 'elio-r-circuit', dys: 'elio-r-atelier' };
const v9FamImgAdo = { attention: 'observatoire', memoire: 'crypte', langage: 'cite', executif: 'forteresse', vitesse: 'circuit', dys: 'atelier' };
const v9FamSticker = { attention: 'phare', memoire: 'cristal', langage: 'etoile', executif: 'chateau', vitesse: 'circuit', dys: 'engrenage' };
const v9FamCouleur = { attention: '#8EA6E6', memoire: '#F6A39B', langage: '#B9A3E3', executif: '#7FD49A', vitesse: '#FFC56B', dys: '#E78DB8' };
const v9FamComp = { attention: 'Attention', memoire: 'Mémoire', langage: 'Mots et nombres', executif: 'Stratégie', vitesse: 'Vitesse', dys: 'Défis' };

/* ---------- l'aventure : chapitres enfant et étapes ado ---------- */
const V9_CHAPITRES = [
  { id: 'ile', fam: 'attention', lieu: 'L’île du phare', titre: 'Élio se réveille', img: 'elio-r-ile', st: 'phare', exos: ['barrage', 'veilleur', 'flanker'], seuil: 0.6, texte: 'Le phare clignote : repère vite le bon signal parmi les vagues.', recompense: 'Le phare se rallume et un autocollant phare' },
  { id: 'grotte', fam: 'memoire', lieu: 'La grotte des cristaux', titre: 'La porte fermée', img: 'elio-r-grotte', st: 'cristal', exos: ['memory', 'corsi', 'ordre'], seuil: 0.6, texte: 'La porte est fermée ! Pour l’ouvrir, aide Élio à retrouver les paires de cristaux.', recompense: 'Une cape pour Élio et un autocollant cristal' },
  { id: 'ville', fam: 'langage', lieu: 'La ruelle des lettres', titre: 'Les lettres envolées', img: 'elio-r-ville', st: 'etoile', exos: ['rimes', 'lexique', 'semantique'], seuil: 0.6, texte: 'Les lettres se sont envolées des enseignes. Retrouve les bons mots.', recompense: 'Les enseignes se rallument et un autocollant étoile' },
  { id: 'chateau', fam: 'executif', lieu: 'Le château', titre: 'Le pont-levis', img: 'elio-r-chateau', st: 'chateau', exos: ['tour', 'suites', 'alternance'], seuil: 0.6, texte: 'Le pont-levis ne descend que si tu remets les pièces dans le bon ordre.', recompense: 'Le pont s’abaisse et un autocollant château' },
  { id: 'circuit', fam: 'vitesse', lieu: 'Le circuit', titre: 'Le départ lancé', img: 'elio-r-circuit', st: 'circuit', exos: ['reaction', 'codes', 'pareil'], seuil: 0.6, texte: 'Démarre au bon signal, pas avant : Élio compte sur tes réflexes.', recompense: 'Une traînée de lumière et un autocollant circuit' },
  { id: 'atelier', fam: 'dys', lieu: 'L’atelier', titre: 'La machine à réparer', img: 'elio-r-atelier', st: 'engrenage', exos: ['cubes', 'ligne-numerique', 'subitizing'], seuil: 0.6, texte: 'Une pièce manque à la machine d’Élio. Trouve-la pour la réparer.', recompense: 'La machine repart et un autocollant engrenage' },
  { id: 'finale', fam: null, lieu: 'La porte de lumière', titre: 'La cape d’Élio', img: 'elio-r-victoire', st: 'portail', exos: [], seuil: 0.6, texte: 'Toutes les portes brillent. Une dernière épreuve et Élio gagne sa cape de lumière.', recompense: 'La cape de lumière et l’autocollant portail' },
];
const V9_ETAPES = [
  { id: 'prologue', fam: null, sect: 'Prologue', lieu: 'Le QG', titre: 'Le réveil d’Élio', img: 'archipel', enigme: 'Calibrage', exos: ['reaction'], seuil: 0, texte: 'Au QG, le signal s’est éteint. Élio se rallume et te choisit comme pilote.', passe: 'jouer, sans score minimum.', recompense: { eclats: 100, txt: 'ton héros, Élio, 100 éclats' } },
  { id: 'vigilance', fam: 'attention', sect: 'Vigilance', lieu: 'L’observatoire', titre: 'Le guetteur', img: 'observatoire', enigme: 'Interception', exos: ['gonogo', 'veilleur', 'flanker'], seuil: 0.8, skill: 'focus', texte: 'Le phare de l’observatoire capte des signaux parasites. Trie-les pour le rallumer.', passe: '80 % de réponses justes, au niveau fixé par Élan.', recompense: { eclats: 120, txt: 'compétence Focus, visière Prisme', objet: 'prisme' } },
  { id: 'memoire', fam: 'memoire', sect: 'Mémoire', lieu: 'La crypte', titre: 'La séquence des cristaux', img: 'crypte', enigme: 'Séquence des cristaux', exos: ['corsi', 'ordre', 'empan-envers'], seuil: 0.6, skill: 'memoire', texte: 'La porte de la crypte s’ouvre si les cristaux s’allument dans le bon ordre.', passe: '60 % de séquences justes, à la longueur du jour.', recompense: { eclats: 150, txt: 'compétence Mémoire cristalline, 150 éclats' } },
  { id: 'mots', fam: 'langage', sect: 'Mots', lieu: 'La cité des Mots', titre: 'Les enseignes brouillées', img: 'cite', enigme: 'Décision lexicale', exos: ['lexique', 'graphemes', 'rimes'], seuil: 0.75, texte: 'Les enseignes de la cité ont mélangé leurs lettres. Retrouve les vrais mots.', passe: '75 % de mots justes.', recompense: { eclats: 120, txt: 'objet Traducteur', objet: 'traducteur' } },
  { id: 'strategie', fam: 'executif', sect: 'Stratégie', lieu: 'La forteresse', titre: 'Le pont-levis', img: 'forteresse', enigme: 'Tour de Londres', exos: ['tour', 'alternance', 'suites'], seuil: 0.6, skill: 'stratege', texte: 'Le pont de la forteresse ne s’abaisse qu’avec un plan en peu de coups.', passe: '60 % de problèmes résolus.', recompense: { eclats: 150, txt: 'compétence Plan d’action, veste Stratège (rare)', objet: 'stratege' } },
  { id: 'vitesse', fam: 'vitesse', sect: 'Vitesse', lieu: 'Le circuit Éclair', titre: 'Le départ lancé', img: 'circuit', enigme: 'Codes secrets', exos: ['codes', 'reaction'], seuil: 'record', skill: 'vitesse', texte: 'La course ne démarre que si tu décodes le tableau de bord à temps.', passe: 'battre ton propre record, jamais celui des autres.', recompense: { eclats: 150, txt: 'veste Éclair (épique)', objet: 'eclair' } },
  { id: 'dys', fam: 'dys', sect: 'Défis', lieu: 'L’atelier', titre: 'La machine à réparer', img: 'atelier', enigme: 'Parcours du profil', exos: [], seuil: 0.6, texte: 'Les plans de la machine sont effacés. Retrace-les pièce par pièce.', passe: 'l’objectif réglé par ta praticienne.', recompense: { eclats: 150, txt: 'Élio gagne un laser qui surligne les consignes', objet: 'laser' } },
  { id: 'finale', fam: null, sect: 'Finale', lieu: 'Le cœur de l’archipel', titre: 'Le signal retrouvé', img: 'coeur', enigme: 'Épreuve mixte', exos: [], seuil: 0.7, texte: 'Les six balises brillent. Le cœur de l’archipel attend une dernière épreuve.', passe: '70 % de réussite.', recompense: { eclats: 300, txt: 'rang Éclaireur, tenue légendaire Solstice', objet: 'solstice' } },
];
/* ordre des secteurs selon le profil (storyboard : « Comment Élan choisit l'énigme ») */
function v9Ordre(p, liste) {
  const ts = troublesDuProfil(p), mot = (p.motif || '').toLowerCase();
  const prio = [];
  if (ts.includes('tdah') || /tdah/.test(mot)) prio.push('attention', 'executif');
  if (ts.some(t => /dyslex|dysortho|dysgraph/.test(t)) || /dyslex/.test(mot)) prio.push('langage', 'dys');
  if (ts.includes('tsa') || /tsa|autis/.test(mot)) prio.push('executif');
  if (ts.includes('sgt') || /tourette|sgt|tic/.test(mot)) prio.push('attention');
  const debut = liste.filter(s => s.id === 'prologue'), fin = liste.filter(s => s.id === 'finale');
  const milieu = liste.filter(s => s.id !== 'prologue' && s.id !== 'finale');
  const rang = s => { const i = prio.indexOf(s.fam); return i < 0 ? 99 : i; };
  return [...debut, ...milieu.map((s, i) => [s, i]).sort((a, b) => rang(a[0]) - rang(b[0]) || a[1] - b[1]).map(x => x[0]), ...fin];
}
/* l'exercice de l'énigme : d'abord celui que la praticienne a mis au programme dans cette fonction */
function v9ChoisirExo(p, step) {
  const age = ageDe(p.naissance), okAge = id => EXOS[id] && !EXOS[id].cache && !(EXOS[id].ageMin && age != null && age < EXOS[id].ageMin);
  const prog = (p.programme?.actif ? p.programme.exos : []).filter(okAge);
  let fam = step.fam;
  if (!fam) { // finale : la fonction la plus travaillée du protocole
    const n = {}; prog.forEach(id => { const f = EXOS[id].famille; n[f] = (n[f] || 0) + 1; });
    fam = Object.keys(n).sort((a, b) => n[b] - n[a])[0] || 'memoire';
  }
  const duProg = prog.find(id => EXOS[id].famille === fam);
  if (duProg && step.id !== 'prologue') return duProg;
  const cand = (step.exos || []).find(okAge);
  if (cand) return cand;
  return exosDeFamille(fam).find(okAge) || 'reaction';
}
function v9Parcours(p, ado) {
  const E = v9Etat(p), faits = ado ? E.odyssee.faits : E.aventure.faits;
  const liste = v9Ordre(p, ado ? V9_ETAPES : V9_CHAPITRES);
  const auj = Object.values(faits).some(d => dk(d) === V9.jour());
  const idx = liste.findIndex(s => !faits[s.id]);
  return { liste, faits, auj, idx, cour: idx >= 0 ? liste[idx] : null, nbFaits: liste.filter(s => faits[s.id]).length };
}
function v9Reussite(step, ex, r) {
  if (step.seuil === 'record') {
    const avant = Store.resultats(r.profilId, ex.id).filter(x => x.id !== r.id).map(x => x.perf ?? 0);
    return !avant.length ? (r.perf ?? 0) >= 0.6 : (r.perf ?? 0) >= Math.max(...avant) || (r.perf ?? 0) >= 0.85;
  }
  return (r.perf ?? 0) >= step.seuil;
}
function v9LancerEnigme(p, ado) {
  const P = v9Parcours(p, ado); if (!P.cour) return;
  if (P.auj) { toast('Une étape par jour : la suite s’ouvre demain.'); return; }
  const exId = v9ChoisirExo(p, P.cour);
  UI.v9enigme = { pid: p.id, step: P.cour.id, ado, exId };
  lancerExercice(exId, { mode: 'libre' });
}

/* ---------- Odyssée : rangs, éclats, compétences, objets ---------- */
const V9_RANGS = [['Recrue', 1], ['Explorateur', 10], ['Éclaireur', 20], ['Pionnier', 35], ['Légende', 50]];
const V9_HEROS = { nova: { nom: 'Nova', role: 'Exploratrice' }, kai: { nom: 'Kai', role: 'Stratège' }, sol: { nom: 'Sol', role: 'Éclaireuse' } };
const V9_SKILLS = [
  { id: 'focus', fam: 'attention', nom: 'Focus', c: '#8EA6E6', d: ['Élio repère les signaux importants sur la carte.', 'Un signal parasite en moins par énigme de vigilance.', 'Élio éclaire tout le secteur au départ.'] },
  { id: 'memoire', fam: 'memoire', nom: 'Mémoire cristalline', c: '#C9B5F0', d: ['Élio marque les chemins déjà explorés et les coffres repérés.', 'Élio peut rejouer une séquence une fois par énigme.', 'Les cristaux gardent leur couleur une seconde de plus dans le monde.'] },
  { id: 'stratege', fam: 'executif', nom: 'Plan d’action', c: '#7FD49A', d: ['Élio affiche ton objectif de coups.', 'Un retour en arrière gratuit dans le monde.', 'Les raccourcis de la forteresse s’ouvrent.'] },
  { id: 'vitesse', fam: 'vitesse', nom: 'Vitesse', c: '#FFC56B', d: ['Traînée orange pour ton héros.', 'Élio fonce entre deux secteurs.', 'Turbo de départ dans le circuit.'] },
];
const V9_BOUTIQUE = [
  { id: 'aurore', type: 'tenue', nom: 'Veste Aurore', rar: 'epique', prix: 600, tint: '#A98CDB' },
  { id: 'marine', type: 'tenue', nom: 'Veste Marine', rar: 'rare', prix: 300, tint: '#4C6BB2' },
  { id: 'graphite', type: 'tenue', nom: 'Veste Graphite', rar: 'commun', prix: 100, tint: '#5B6170' },
  { id: 'stratege', type: 'tenue', nom: 'Veste Stratège', rar: 'rare', gagne: 'strategie', tint: '#4C9E63' },
  { id: 'eclair', type: 'tenue', nom: 'Veste Éclair', rar: 'epique', gagne: 'vitesse', tint: '#F09C1F' },
  { id: 'solstice', type: 'tenue', nom: 'Tenue Solstice', rar: 'legendaire', gagne: 'finale', tint: '#F2C77A' },
  { id: 'prisme', type: 'visiere', nom: 'Visière Prisme', rar: 'rare', gagne: 'vigilance' },
  { id: 'braise', type: 'visiere', nom: 'Aura Braise', rar: 'commun', prix: 150 },
  { id: 'elio-solaire', type: 'drone', nom: 'Élio Solaire', rar: 'legendaire', prix: 1200, desc: 'Peinture dorée et traînée de lumière.' },
  { id: 'boussole', type: 'objet', nom: 'Boussole', rar: 'commun', prix: 200, desc: 'Montre le coffre caché d’un secteur.' },
  { id: 'indices', type: 'objet', nom: 'Indice d’Élio ×3', rar: 'commun', prix: 120, desc: 'Rejoue la consigne d’une énigme.' },
  { id: 'cle', type: 'objet', nom: 'Clé du coffre épique', rar: 'epique', prix: 450, desc: 'Contenu affiché avant d’ouvrir.' },
  { id: 'traducteur', type: 'objet', nom: 'Traducteur', rar: 'rare', gagne: 'mots', desc: '1 indice offert par énigme de mots.' },
  { id: 'laser', type: 'objet', nom: 'Laser d’Élio', rar: 'epique', gagne: 'dys', desc: 'Surligne les consignes.' },
];
const V9_RAR = { commun: 'Commun', rare: 'Rare', epique: 'Épique', legendaire: 'Légendaire' };
function v9Ado(p) {
  const E = v9Etat(p), O = E.odyssee, M = etatMonde(p), st = M.st;
  const P = v9Parcours(p, true);
  const gainsEtapes = sum(V9_ETAPES.filter(s => O.faits[s.id]).map(s => s.recompense.eclats));
  const eclats = Math.max(0, 50 + st.etoiles * 10 + gainsEtapes - O.depenses);
  const niveau = M.niveau;
  let r = 0; V9_RANGS.forEach(([, n], i) => { if (niveau >= n) r = i; });
  const tier = O.faits.finale || r >= 2 ? 2 : (P.nbFaits >= 3 || r >= 1 ? 1 : 0);
  const heros = O.heros || 'nova';
  const imgHeros = `${heros}${tier === 2 ? '-eclaireur' : tier === 1 ? '-explorateur' : ''}`;
  const possede = id => { const it = V9_BOUTIQUE.find(x => x.id === id); return !!it && (O.achats.includes(id) || (it.gagne && O.faits[it.gagne])); };
  const famEt = f => sum(st.rs.filter(x => EXOS[x.exId]?.famille === f).map(x => etoiles(x.perf ?? 0)));
  const skills = V9_SKILLS.map(s => { const etape = V9_ETAPES.find(e => e.skill === s.id); const i = etape && O.faits[etape.id] ? 1 : 0; const n = famEt(s.fam); return { ...s, niv: i ? (n >= 60 ? 3 : n >= 24 ? 2 : 1) : 0, etoiles: n }; });
  return { E, O, M, st, P, eclats, niveau, rang: V9_RANGS[r][0], rangIdx: r, tier, heros, imgHeros, possede, skills, xp: M.xp };
}

/* ---------- Élio : le drone remplace la mascotte en pixels ---------- */
elioSVG = function (taille = 64, { cls = '' } = {}) {
  return `<img class="elio-img ${cls}" src="${V9.img('elio-avatar')}" width="${taille}" height="${taille}" alt="" aria-hidden="true">`;
};

/* anneau d'élan (niveau) */
function v9Anneau(niv, part, t = 54, e = 7) {
  const r = t / 2 - e / 2 - 1, c = 2 * Math.PI * r;
  return `<span class="v9-ring" style="width:${t}px;height:${t}px"><svg viewBox="0 0 ${t} ${t}" width="${t}" height="${t}" aria-hidden="true"><circle cx="${t / 2}" cy="${t / 2}" r="${r.toFixed(1)}" fill="rgba(17,13,22,.7)" stroke="rgba(255,255,255,.14)" stroke-width="${e}"/><circle cx="${t / 2}" cy="${t / 2}" r="${r.toFixed(1)}" fill="none" stroke="#F09C1F" stroke-width="${e}" stroke-linecap="round" stroke-dasharray="${(c * Math.max(0.02, part)).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${t / 2} ${t / 2})"/></svg><b>${niv}</b></span>`;
}

/* ======================= ENFANT : accueil ======================= */
heroEnfant = function (p) {
  const u = v9Univers(p);
  if (u !== 'aventure') return u === 'odyssee' ? '' : '';
  const E = etatMonde(p), s = seanceDuJour(p), reste = s ? s.exos.length - s.faits.length : 0;
  const msg = !s ? 'Choisis un monde et gagne des étoiles pour ton île !'
    : reste <= 0 ? 'Mission accomplie ! Tes étoiles t’attendent dans Mon île.'
      : `Ta mission t’attend : ${reste} jeu${reste > 1 ? 'x' : ''}, et une surprise à la fin.`;
  return `<section class="v9-hero"><img class="fond" src="${V9.img('elio-salut')}" alt="Élio, le drone orange, te dit bonjour devant le phare">
    <div class="v9-hero-bar">
      <button type="button" class="v9-hero-niv" data-act="nav" data-vue="progres" aria-label="Niveau ${E.niveau} : encore ${E.avant} étoiles pour le niveau suivant">${v9Anneau(E.niveau, E.xp)}<span><b>Niveau ${E.niveau}</b><small>encore ${E.avant} étoile${E.avant > 1 ? 's' : ''}</small></span></button>
      <span class="v9-chip" aria-label="${E.st.etoiles} étoiles gagnées">${v9Etoile(22)}${E.st.etoiles}</span>
    </div>
  </section>
  <div class="v9-bulle"><b>Salut ${esc(p.prenom)} !</b><span>${msg}</span>${v9Audio(`Salut ${p.prenom} ! ${msg}`, 'Écouter Élio')}</div>`;
};
function v9CarteAventure(p) {
  const P = v9Parcours(p, false), c = P.cour;
  if (!c) return `<button type="button" class="v9-aventure-carte" data-act="nav" data-vue="e-aventure"><img src="${V9.img('elio-r-victoire')}" alt=""><span><small>L’aventure d’Élio</small><b>Toutes les portes sont ouvertes !</b><em>Revois ton aventure et tes autocollants.</em></span></button>`;
  const n = P.liste.indexOf(c) + 1;
  return `<button type="button" class="v9-aventure-carte" data-act="nav" data-vue="e-aventure"><img src="${V9.img(c.img)}" alt=""><span><small>L’aventure d’Élio · ${c.id === 'finale' ? 'Finale' : `Chapitre ${n} sur ${P.liste.length - 1}`}</small><b>${esc(c.lieu)} : ${esc(c.titre)}</b><em>${P.auj ? 'Bravo pour aujourd’hui : la porte suivante s’ouvre demain.' : 'Une porte fermée t’attend. Touche pour l’ouvrir.'}</em></span></button>`;
}
function v9Jours(p) {
  const st = statsProfil(p), d0 = new Date(), lundi = new Date(d0); lundi.setDate(d0.getDate() - ((d0.getDay() + 6) % 7));
  const L = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  let n = 0;
  const cases = L.map((l, i) => { const d = new Date(lundi); d.setDate(lundi.getDate() + i); const k = dk(d), on = st.jours.has(k), auj = k === dk(d0); if (on) n++; return `<div><i class="${on ? 'on' : auj ? 'auj' : ''}">${on ? v9Etoile(16, '#FFFFFF') : ''}</i><span${auj ? ' style="font-weight:700;color:var(--ink)"' : ''}>${l}</span></div>`; }).join('');
  return `<div class="v9-card" style="gap:10px"><div class="v9-between"><h2 style="font-size:1.05rem">Mes jours d’élan</h2><span class="v9-muted" style="font-size:.9rem">${n} cette semaine</span></div><div class="v9-jours">${cases}</div></div>`;
}

/* ======================= ENFANT : mondes ======================= */
const v9VueMondesOrig = vueMondes;
vueMondes = function (p) {
  const u = v9Univers(p);
  if (u !== 'aventure' && u !== 'odyssee') return v9VueMondesOrig(p);
  const ado = u === 'odyssee', ts = troublesDuProfil(p);
  const ordre = FAMILLES.map(f => f.id).sort((a, b) => (b === 'dys' && ts.length) - (a === 'dys' && ts.length));
  const P = v9Parcours(p, ado), ici = P.cour?.fam;
  const cartes = ordre.map(fid => {
    const M = MONDES[fid] || { nom: FAM[fid].nom }, ids = exosDeFamille(fid).filter(id => !EXOS[id].cache);
    const et = sum(ids.map(id => meilleuresEtoiles(p, id)));
    const badge = fid === ici ? '<span class="v9-badge">Tu es ici</span>' : (fid === 'dys' && ts.length ? '<span class="v9-badge" style="background:#131212;color:#fff">Ton parcours</span>' : '');
    return `<button type="button" class="v9-monde-carte ${ado ? 'o-chf' : ''}" style="--c:${FAM[fid].hex};--cl:${v9FamCouleur[fid]}" data-act="v9-monde" data-f="${fid}" aria-pressed="${fid === ici}"><img src="${V9.img(ado ? v9FamImgAdo[fid] : v9FamImg[fid])}" alt="">${badge}<span class="txt"><small>${v9FamComp[fid]}</small><b>${esc(ado ? (V9_ETAPES.find(s => s.fam === fid)?.lieu || M.nom) : M.nom)}</b><em>${v9Etoile(13)}${et} sur ${ids.length * 3}</em></span></button>`;
  }).join('');
  const html = v9VueMondesOrig(p);
  const debutListe = html.indexOf('<section class="monde"');
  const tete = ado
    ? `<section class="hello" style="padding-top:18px"><p class="eyebrow">Entraînement libre</p><h1>Choisis ton secteur</h1><p class="muted">Chaque partie rapporte des éclats. Les énigmes de l’aventure se jouent depuis la carte.</p></section>`
    : `<section class="hello" style="padding-top:18px"><div class="v9-between"><div><h1>Les mondes</h1><p class="muted" style="margin:0">Touche un monde pour jouer.</p></div>${v9Audio('Les mondes. Touche un monde pour jouer.')}</div></section>`;
  return `<div class="v9">${tete}<div class="v9-mondes">${cartes}</div></div>${debutListe >= 0 ? html.slice(debutListe) : ''}`;
};

/* ======================= ENFANT : Mon île ======================= */
const V9_OBJETS = [
  { id: 'arbre', nom: 'Arbre', prix: 3, niv: 1, svg: '<svg class="ob" viewBox="0 0 48 48" aria-hidden="true"><rect x="22" y="26" width="5" height="16" rx="2.5" fill="#9C6B3E"/><circle cx="24" cy="20" r="13" fill="#4C9E63"/><circle cx="28" cy="16" r="3.5" fill="#E36E63"/></svg>' },
  { id: 'fleurs', nom: 'Fleurs', prix: 2, niv: 1, svg: '<svg class="ob" viewBox="0 0 48 48" aria-hidden="true"><path d="M14 40v-10M24 40V26M34 40v-9" stroke="#4C9E63" stroke-width="3"/><circle cx="14" cy="27" r="5" fill="#E36E63"/><circle cx="24" cy="22" r="6" fill="#F09C1F"/><circle cx="34" cy="28" r="5" fill="#C4558A"/></svg>' },
  { id: 'lanterne', nom: 'Lanterne', prix: 5, niv: 2, svg: '<svg class="ob" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="16" r="10" fill="#F09C1F"/><circle cx="24" cy="16" r="5" fill="#FDEBD0"/><rect x="22" y="24" width="4" height="18" rx="2" fill="#F7F1EE"/><rect x="16" y="40" width="16" height="4" rx="2" fill="#F7F1EE"/></svg>' },
  { id: 'bateau', nom: 'Bateau', prix: 6, niv: 3, svg: '<svg class="ob" viewBox="0 0 48 48" aria-hidden="true"><path d="M6 30h36l-6 10H12z" fill="#4C6BB2"/><path d="M24 30V8l14 20z" fill="#E36E63"/><path d="M22 30V14l-10 16z" fill="#F3DDB5"/></svg>' },
  { id: 'cabane', nom: 'Cabane', prix: 8, niv: 4, svg: '<svg class="ob" viewBox="0 0 48 48" aria-hidden="true"><path d="M8 24L24 10l16 14z" fill="#E36E63"/><rect x="12" y="24" width="24" height="16" fill="#F7F1EE"/><rect x="21" y="29" width="7" height="11" rx="3" fill="#4C6BB2"/></svg>' },
  { id: 'montgolfiere', nom: 'Montgolfière', prix: 12, niv: 6, svg: '<svg class="ob" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4a14 14 0 0 1 14 14c0 8-9 14-11 18h-6c-2-4-11-10-11-18A14 14 0 0 1 24 4z" fill="#F09C1F"/><path d="M24 4c-4 4-5 22-3 32M24 4c4 4 5 22 3 32" stroke="#E36E63" stroke-width="2.5" fill="none"/><rect x="19" y="38" width="10" height="7" rx="2" fill="#9C6B3E"/></svg>' },
];
const V9_SLOTS = [[34, 34], [62, 31], [44, 47], [70, 50], [22, 55], [80, 41], [40, 66], [64, 66]];
function v9Ile(p) {
  const I = v9Etat(p).ile, E = etatMonde(p);
  const depense = sum(Object.values(I.slots).map(id => V9_OBJETS.find(o => o.id === id)?.prix || 0));
  return { I, E, dispo: Math.max(0, 10 + E.st.etoiles - depense), niveau: E.niveau };
}
const v9VueMondeOrig = vueMonde;
vueMonde = function (p) {
  const u = v9Univers(p);
  if (u === 'odyssee') return v9VueSkills(p);
  if (u !== 'aventure') return v9VueMondeOrig(p);
  const L = v9Ile(p), sel = V9_OBJETS.find(o => o.id === L.I.sel) || V9_OBJETS[0];
  const slots = V9_SLOTS.map(([x, y], i) => { const o = V9_OBJETS.find(z => z.id === L.I.slots[i]); return `<button type="button" class="v9-slot ${o ? 'plein' : ''}" style="left:${x}%;top:${y}%" data-act="v9-slot" data-i="${i}" aria-label="${o ? `${o.nom} posé ici : toucher pour le reprendre` : 'Poser un objet ici'}">${o ? o.svg : V9_I.plus}</button>`; }).join('');
  return `<div class="v9">
  <section class="v9-ile"><img class="fond" src="${V9.img('ile-vue-ciel')}" alt="L’île de ${esc(p.prenom)} vue du ciel : le phare, la grotte, la ville, le château, le circuit et l’atelier">
    <div class="v9-ile-tete"><div style="flex:1"><h1>Mon île</h1><span style="font-weight:500">Pose tes trouvailles où tu veux.</span></div><span class="v9-chip" aria-label="${L.dispo} étoiles à dépenser">${v9Etoile(22)}${L.dispo}</span></div>
    <img class="v9-elio-pos elio-img" src="${V9.img('elio-avatar')}" alt="Élio" style="left:56%;top:40%">
    ${slots}
  </section>
  <section style="display:flex;flex-direction:column;gap:12px;margin-top:6px">
    <div class="v9-between"><h2 style="margin:0;font-size:1.2rem">À poser</h2><span class="v9-muted" style="font-size:.88rem">Touche un objet, puis une place</span></div>
    <div class="v9-objets">${V9_OBJETS.map(o => { const ok = L.niveau >= o.niv; return `<button type="button" class="v9-objet" data-act="v9-objet" data-o="${o.id}" aria-pressed="${o.id === sel.id}" ${ok ? '' : `disabled aria-label="${o.nom}, débloqué au niveau ${o.niv}"`}>${ok ? o.svg : '<span style="width:40px;height:40px;display:grid;place-items:center;font:700 1.5rem var(--font-titre)">?</span>'}<b>${ok ? o.nom : 'Mystère'}</b><small>${ok ? `${v9Etoile(13)}${o.prix}` : `${V9_I.cadenas.replace('width="24" height="24"', 'width="12" height="12"')} Niv. ${o.niv}`}</small></button>`; }).join('')}</div>
    <div class="v9-card" style="flex-direction:row;align-items:center;gap:10px;padding:12px 14px">${V9.svg('<path d="M12 3v3"/><path d="M5.6 5.6l2.1 2.1"/><path d="M3 12h3"/><circle cx="12" cy="12" r="4"/>')}<span style="font-size:.95rem">Ton île grandit quand tu joues. Rien ne disparaît, jamais.</span></div>
  </section></div>`;
};

/* ======================= ENFANT : album d'autocollants ======================= */
function v9VueAlbum(p) {
  const P = v9Parcours(p, false);
  const fams = FAMILLES.map(f => f.id);
  let total = 0, eus = 0;
  const portes = P.liste.map(c => { const ok = !!P.faits[c.id]; total++; if (ok) eus++; return v9Sticker(ok, `st-${c.st}`, c.lieu, '#F09C1F'); }).join('');
  const sections = fams.map(fid => {
    const ids = exosDeFamille(fid).filter(id => !EXOS[id].cache);
    const n = ids.filter(id => meilleuresEtoiles(p, id) >= 3).length; total += ids.length; eus += n;
    const complet = n === ids.length;
    return `<section class="v9-card" style="gap:12px"><div class="v9-between"><h2 style="font-size:1.05rem">${esc(MONDES[fid]?.nom || FAM[fid].nom)}</h2>${complet ? `<span class="pill ok">${ICONS.check} Complet</span>` : `<span class="v9-muted" style="font:600 .9rem var(--font-titre)">${n} sur ${ids.length}</span>`}</div>
    <div class="v9-stickers">${ids.map(id => { const ok = meilleuresEtoiles(p, id) >= 3; return v9Sticker(ok, `st-${v9FamSticker[fid]}`, nomEx(EXOS[id], p), FAM[fid].hex, ok ? '' : `${meilleuresEtoiles(p, id)} étoile${meilleuresEtoiles(p, id) > 1 ? 's' : ''} sur 3`); }).join('')}</div></section>`;
  }).join('');
  return `<div class="v9"><section class="v9-album-tete"><img src="${V9.img('autocollants')}" alt="Planche d’autocollants d’Élio"><div><h1>Mon album</h1><div class="v9-row"><span class="v9-barre"><i style="width:${Math.round(100 * eus / Math.max(1, total))}%"></i></span><b style="font-family:var(--font-titre)">${eus} sur ${total}</b></div></div></section>
  <p class="v9-muted" style="margin:12px 0">Chaque jeu réussi avec 3 étoiles te donne un autocollant. Chaque porte ouverte dans l’aventure aussi.</p>
  <div style="display:flex;flex-direction:column;gap:12px"><section class="v9-card"><div class="v9-between"><h2 style="font-size:1.05rem">Les portes de l’aventure</h2><span class="v9-muted" style="font:600 .9rem var(--font-titre)">${P.nbFaits} sur ${P.liste.length}</span></div><div class="v9-stickers">${portes}</div></section>${sections}</div></div>`;
}
function v9Sticker(ok, img, label, c, sous = '') {
  return ok ? `<div class="v9-sticker" style="--c:${c}"><span><img src="${V9.img(img)}" alt=""></span>${esc(label)}</div>`
    : `<div class="v9-sticker vide"><span>?</span>${esc(label)}${sous ? `<small style="font-size:.72rem">${esc(sous)}</small>` : ''}</div>`;
}

/* ======================= ENFANT : l'aventure d'Élio ======================= */
function v9VueAventure(p) {
  const P = v9Parcours(p, false), sel = UI.v9chap && P.liste.find(c => c.id === UI.v9chap);
  if (sel) {
    const fait = !!P.faits[sel.id], cour = P.cour?.id === sel.id, n = P.liste.indexOf(sel) + 1, exId = v9ChoisirExo(p, sel), ex = EXOS[exId];
    return `<div class="v9"><section class="v9-porte"><img class="fond" src="${V9.img(sel.img)}" alt="Élio : ${esc(sel.lieu)}">
      <div class="v9-porte-tete"><button type="button" class="v9-rond" data-act="v9-chap" data-c="" aria-label="Retour à l’aventure">${V9_I.retour}</button><div><small>${sel.id === 'finale' ? 'Finale' : `Chapitre ${n} sur ${P.liste.length - 1}`}</small><h1>${esc(sel.lieu)}</h1></div></div></section>
      <section class="v9-card" style="margin-top:-60px;position:relative;z-index:1">
        <div style="position:relative;padding-right:56px"><b style="font:600 1.3rem var(--font-titre)">${fait ? 'La porte est ouverte !' : esc(sel.titre)}</b><p style="margin:4px 0 0;font-size:1.02rem;font-weight:500">${esc(sel.texte)}</p>${v9Audio(sel.texte)}</div>
        <div class="v9-recomp">${V9.svg('<path d="M3 10h18v10H3z"/><path d="M3 10l2-5h14l2 5z"/>', 24)}<span>Derrière la porte : ${esc(sel.recompense)}</span></div>
        <p class="v9-muted" style="margin:0;font-size:.9rem">Le jeu de la porte : <b style="color:var(--ink)">${esc(nomEx(ex, p))}</b>, choisi pour toi par Élan.</p>
        ${fait ? `<button type="button" class="v9-btn sec" data-act="ex" data-ex="${exId}">${V9_I.play} Rejouer ce jeu</button>`
        : cour && P.auj ? `<div class="v9-demain">${V9_I.lune}<span>Bravo pour aujourd’hui ! Ton cerveau range ce qu’il a appris : cette porte s’ouvre demain.</span></div>`
          : cour ? `<button type="button" class="v9-btn" data-act="v9-enigme">${V9_I.ouvert} Ouvrir la porte</button>`
            : `<div class="v9-demain">${V9_I.cadenas}<span>Ouvre d’abord les portes d’avant.</span></div>`}
      </section></div>`;
  }
  const c = P.cour;
  return `<div class="v9"><section class="hello" style="padding-top:18px"><p class="eyebrow">L’aventure d’Élio</p><h1>${c ? `Chapitre ${Math.min(P.nbFaits + 1, P.liste.length - 1)} sur ${P.liste.length - 1}` : 'Aventure terminée !'}</h1><p class="muted">Chaque porte s’ouvre avec un petit jeu choisi par Élan pour toi. Une porte par jour.</p></section>
  <div class="v9-chapitres">${P.liste.map((ch, i) => {
    const fait = !!P.faits[ch.id], cour = c?.id === ch.id;
    const etat = fait ? `<span class="pill ok">${ICONS.check} Ouverte</span>` : cour ? (P.auj ? '<span class="v9-pill">Demain</span>' : '<span class="v9-pill" style="background:#F09C1F;color:#000">À toi !</span>') : `<span class="pill">${V9_I.cadenas.replace('width="24" height="24"', 'width="13" height="13"')}</span>`;
    return `<button type="button" class="v9-chap ${fait ? 'fait' : cour ? 'cour' : 'v9-lock'}" style="--c:${ch.fam ? v9FamCouleur[ch.fam] : '#FFC56B'}" data-act="v9-chap" data-c="${ch.id}"><span class="vis"><img src="${V9.img(ch.img)}" alt=""></span><span class="txt"><small>${ch.id === 'finale' ? 'Finale' : `Chapitre ${i + 1} · ${v9FamComp[ch.fam]}`}</small><b>${esc(ch.lieu)}</b><em>${esc(ch.titre)}</em><span class="etat">${etat}</span></span></button>`;
  }).join('')}</div></div>`;
}

/* ======================= ADO : univers Odyssée ======================= */
function v9VueHeros(p) {
  const A = v9Ado(p), choix = UI.v9heros || A.O.heros || 'nova';
  return `<div class="v9"><section class="o-scene" style="height:380px"><img class="fond" src="${V9.img(choix)}" alt="${esc(V9_HEROS[choix].nom)}, ${esc(V9_HEROS[choix].role)}" style="object-position:center 15%">
    <div class="o-scene-tete"><div><small>Univers Odyssée</small><h1>Choisis ton héros</h1></div></div></section>
    <section class="o-panel o-chf" style="margin-top:-40px;position:relative;z-index:1"><b style="font:600 1.3rem var(--font-titre)">${esc(V9_HEROS[choix].nom)} · ${esc(V9_HEROS[choix].role)}</b><span class="o-label" style="letter-spacing:.08em;text-transform:none">Ton héros évolue avec l’entraînement : visière, épaulette, puis tenue légendaire.</span>
      <div class="o-heros-grille">${Object.keys(V9_HEROS).map(h => `<button type="button" class="o-heros-choix" data-act="v9-heros" data-h="${h}" aria-pressed="${h === choix}"><img src="${V9.img(h)}" alt=""><span>${V9_HEROS[h].nom}</span></button>`).join('')}</div>
      <button type="button" class="o-btn" data-act="v9-heros-ok">Valider mon héros</button></section></div>`;
}
function v9VueQG(p) {
  const A = v9Ado(p);
  if (!A.O.heros) return v9VueHeros(p);
  const s = seanceDuJour(p), c = A.P.cour;
  const seg = Array.from({ length: 10 }, (_, i) => `<i class="${i < Math.floor(A.xp * 10) ? 'on' : ''}"></i>`).join('');
  const defis = s ? s.exos.map(id => { const ex = EXOS[id], fait = s.faits.includes(id); return `<button type="button" class="o-defi ${fait ? 'fait' : ''}" style="--fam:${FAM[ex.famille].hex}" data-act="${fait ? 'ex' : 'v9-defi'}" data-ex="${id}"><span class="ico">${fait ? V9_I.ok : ex.icone}</span><span style="flex:1;min-width:0"><b>${esc(nomEx(ex, p))}</b><small>${esc(v9FamComp[ex.famille])} · ${fait ? 'terminé' : 'à jouer'}</small></span>${fait ? '' : V9_I.play}</button>`; }).join('') : '';
  const reste = s ? s.exos.length - s.faits.length : 0;
  const elio = !s ? 'Pas de mission aujourd’hui : explore l’archipel ou entraîne-toi librement.' : reste ? `${reste} défi${reste > 1 ? 's' : ''} aujourd’hui. Chaque étoile rapporte 10 éclats.` : 'Mission du jour terminée. Belle régularité, pilote.';
  const html = vueEnfantAccueilOrigV9(p);
  const debut = html.indexOf('<div class="day-grid">');
  return `<div class="v9"><section class="o-hero"><img class="fond" src="${V9.img(A.imgHeros)}" alt="${esc(V9_HEROS[A.heros].nom)}, rang ${esc(A.rang)}">
    <div class="o-hud"><span class="o-rang"><svg viewBox="0 0 44 50" width="44" height="50" aria-hidden="true"><path d="M22 1 L43 13 L43 37 L22 49 L1 37 L1 13 Z" fill="#1E2640" stroke="#F09C1F" stroke-width="2"/></svg><b>${A.rangIdx + 1}</b></span><span class="o-id"><b>${esc(p.prenom)}</b><small>Rang ${esc(A.rang)}</small></span><span class="o-eclats">${V9_I.eclat}${A.eclats.toLocaleString('fr-FR')}</span></div></section>
  <div class="o-xp"><div class="v9-between"><b style="font:600 1rem var(--font-titre)">Niveau ${A.niveau}</b><span class="o-label">encore ${A.M.avant} étoile${A.M.avant > 1 ? 's' : ''}</span></div><div class="o-barres" aria-hidden="true">${seg}</div></div>
  <div style="display:flex;flex-direction:column;gap:12px;margin-top:16px;position:relative;z-index:1">
    <div class="o-elio"><img src="${V9.img('elio-avatar')}" alt=""><span><b style="font-family:var(--font-titre)">Élio :</b> ${esc(elio)}</span></div>
    ${s ? `<section class="o-panel o-chf"><div class="v9-between"><span class="o-label">Défis du jour · ${s.faits.length} sur ${s.exos.length}</span></div>${defis}</section>` : ''}
    ${c ? `<button type="button" class="o-btn" data-act="v9-etape" data-s="${c.id}">${A.P.auj ? 'Étape suivante demain' : `Poursuivre l’aventure · ${esc(c.sect)}`}</button>` : `<div class="o-panel o-chf"><b style="font-family:var(--font-titre)">Saison 1 terminée</b><span class="v9-muted">Le signal est retrouvé. La saison 2 arrive bientôt.</span></div>`}
    <button type="button" class="o-btn sec" data-act="nav" data-vue="accueil">Entraînement libre</button>
  </div>
  ${debut >= 0 ? html.slice(debut) : ''}</div>`;
}
function v9VueCarte(p) {
  const A = v9Ado(p), P = A.P;
  return `<div class="v9"><section class="o-scene" style="height:300px"><img class="fond" src="${V9.img('archipel')}" alt="L’archipel Élan : six îles reliées par des ponts de lumière" style="object-position:center 30%">
    <div class="o-scene-tete"><div><small>Saison 1 · le signal perdu</small><h1>Archipel Élan</h1></div></div></section>
  <p class="v9-muted" style="margin:-40px 0 14px;position:relative;z-index:1">Avec Élio, rallume une balise par secteur. Chaque porte est scellée par une énigme choisie par Élan selon ton profil. Une étape par jour.</p>
  <div class="o-secteurs">${P.liste.map((s, i) => {
    const fait = !!P.faits[s.id], cour = P.cour?.id === s.id;
    const etat = fait ? '<span class="o-etat ok">Terminé</span>' : cour ? `<span class="o-etat cour">${P.auj ? 'Demain' : 'Tu es ici'}</span>` : '<span class="o-etat">Scellé</span>';
    return `<button type="button" class="o-secteur o-chf ${fait ? 'fait' : cour ? 'cour' : 'v9-lock'}" style="--c:${s.fam ? v9FamCouleur[s.fam] : '#F09C1F'}" data-act="v9-etape" data-s="${s.id}"><span class="vis"><img src="${V9.img(s.img)}" alt=""></span><span class="txt"><small>${i === 0 ? 'Prologue' : s.id === 'finale' ? 'Finale' : `Étape ${i} · ${esc(s.sect)}`}</small><b>${esc(s.titre)}</b><em>${esc(s.lieu)} · énigme ${esc(s.enigme)}</em>${etat}</span></button>`;
  }).join('')}</div></div>`;
}
function v9VueEtape(p) {
  const A = v9Ado(p), P = A.P, s = P.liste.find(x => x.id === UI.v9etape) || P.cour || P.liste[0];
  const i = P.liste.indexOf(s), fait = !!P.faits[s.id], cour = P.cour?.id === s.id, exId = v9ChoisirExo(p, s), ex = EXOS[exId];
  return `<div class="v9"><section class="o-scene"><img class="fond" src="${V9.img(s.img)}" alt="${esc(s.lieu)}">
    <div class="o-scene-tete"><button type="button" class="o-carre" data-act="nav" data-vue="o-carte" aria-label="Retour à la carte">${V9_I.retour}</button><div><small>${i === 0 ? 'Prologue' : s.id === 'finale' ? 'Finale' : `Saison 1 · étape ${i} sur ${P.liste.length - 2}`}</small><h1>${esc(s.titre)}</h1></div></div></section>
  <section class="o-panel o-chf" style="margin-top:-70px;position:relative;z-index:1">
    <div class="o-elio" style="background:#161C2D;padding:0;border:0"><img src="${V9.img('elio-avatar')}" alt=""><span><b style="font-family:var(--font-titre)">Élio :</b> ${esc(s.texte)}</span></div>
    <div class="o-enigme"><small>Énigme · ${esc(s.enigme)}</small><b>${esc(nomEx(ex, p))}</b><span class="v9-muted" style="font-size:.88rem">Choisie par Élan pour toi : ${esc(FAM[ex.famille].nom.toLowerCase())}${ex.niveaux > 1 ? ` · niveau ${Store.niveau(p, exId)}` : ''}</span></div>
    <div class="o-grille2"><div class="o-item" style="cursor:default"><span class="o-label">Pour passer</span><small style="color:var(--ink)">${esc(s.passe)}</small></div><div class="o-item" style="cursor:default"><span class="o-label">Récompense</span><small style="color:var(--ink)">${esc(s.recompense.txt)}</small></div></div>
    ${fait ? `<div class="o-etat ok" style="align-self:stretch;text-align:center;padding:8px">Porte ouverte</div><button type="button" class="o-btn sec" data-act="ex" data-ex="${exId}">Rejouer l’énigme</button>`
      : cour && P.auj ? `<div class="o-elio" style="border-left-color:#A98CDB">${V9_I.lune}<span>S’ouvre demain : ton cerveau consolide cette nuit ce qu’il a appris.</span></div>`
        : cour ? `<button type="button" class="o-btn" data-act="v9-enigme" data-ado="1">Résoudre l’énigme</button>`
          : '<div class="o-elio" style="border-left-color:#3A4670">Termine d’abord l’étape précédente.</div>'}
    <p class="v9-muted" style="margin:0;font-size:.82rem">Pas encore ? Indice d’Élio et nouvel essai : le niveau s’ajuste après 2 essais. Rien n’est perdu.</p>
  </section></div>`;
}
function v9VueSkills(p) {
  const A = v9Ado(p);
  return `<div class="v9"><section class="hello" style="padding-top:18px"><p class="eyebrow">Compétences</p><h1>Gagnées en résolvant les énigmes</h1></section>
  <div style="display:flex;flex-direction:column;gap:8px">${A.skills.map(s => `<div class="o-skill o-chf" style="--c:${s.c}"><span class="ico">${V9_I.skills}</span><span style="flex:1;min-width:0"><b style="font-family:var(--font-titre)">${esc(s.nom)}${s.niv ? ` · ${['I', 'II', 'III'][s.niv - 1]}` : ''}</b><br><small class="v9-muted">${s.niv ? esc(s.d[s.niv - 1]) : 'À débloquer dans l’aventure.'}</small><span class="niv">${[1, 2, 3].map(n => `<i class="${s.niv >= n ? 'on' : ''}">${['I', 'II', 'III'][n - 1]}</i>`).join('')}</span></span></div>`).join('')}</div>
  <div class="o-elio" style="margin-top:14px;border-left-color:#4C9E63"><span>Les compétences agissent dans le monde (exploration, indices), jamais sur le score des exercices : ta praticienne garde des mesures fiables.</span></div>
  <p class="v9-muted" style="font-size:.85rem">Niveau II : 24 étoiles dans la fonction. Niveau III : 60 étoiles.</p></div>`;
}
function v9VueCasier(p) {
  const A = v9Ado(p), O = A.O, onglet = UI.v9casier || 'tenue';
  const tenue = V9_BOUTIQUE.find(x => x.id === O.equipe.tenue);
  const items = V9_BOUTIQUE.filter(x => x.type === onglet);
  return `<div class="v9"><section class="o-scene" style="height:400px"><img class="fond" src="${V9.img(A.imgHeros)}" alt="${esc(V9_HEROS[A.heros].nom)}" style="object-position:center 15%">${tenue?.tint ? `<span class="o-avatar-tint" style="background:${tenue.tint}"></span>` : ''}
    <div class="o-scene-tete"><div style="flex:1"><small>Casier</small><h1>${esc(V9_HEROS[A.heros].nom)} · ${esc(A.rang)}</h1></div><span class="o-eclats">${V9_I.eclat}${A.eclats.toLocaleString('fr-FR')}</span></div></section>
  <div style="display:flex;flex-direction:column;gap:10px;margin-top:-30px;position:relative;z-index:1">
    <div class="v9-onglets" role="group" aria-label="Catégories" style="border-color:#2B3555">${[['tenue', 'Tenues'], ['visiere', 'Visières'], ['drone', 'Drone'], ['objet', 'Objets']].map(([k, l]) => `<button type="button" data-act="v9-casier" data-k="${k}" aria-pressed="${onglet === k}" style="background:${onglet === k ? '#F09C1F' : '#161C2D'};color:${onglet === k ? '#000' : '#F2EDEB'};border-color:#2B3555">${l}</button>`).join('')}</div>
    <div class="o-grille2">${items.map(it => { const a = A.possede(it.id), eq = O.equipe[it.type] === it.id; return `<button type="button" class="o-item ${it.rar}" data-act="${a && it.type !== 'objet' ? 'v9-equiper' : 'nav'}" data-id="${it.id}" data-vue="o-boutique" aria-pressed="${eq}"><span class="o-rar ${it.rar}">${V9_RAR[it.rar]}</span><b>${esc(it.nom)}</b><small>${eq ? 'Équipé' : a ? (it.type === 'objet' ? esc(it.desc || 'Dans ton sac') : 'Toucher pour équiper') : it.gagne ? `À gagner : ${esc(V9_ETAPES.find(e => e.id === it.gagne)?.titre || '')}` : `${it.prix} éclats en boutique`}</small></button>`; }).join('')}</div>
    <div class="o-grille2"><button type="button" class="o-btn sec" data-act="nav" data-vue="o-boutique">${V9_I.boutique} Boutique</button><button type="button" class="o-btn sec" data-act="v9-heros-changer">Changer de héros</button></div>
  </div></div>`;
}
function v9VueBoutique(p) {
  const A = v9Ado(p), O = A.O;
  const vente = V9_BOUTIQUE.filter(x => x.prix);
  const vedette = V9_BOUTIQUE.find(x => x.id === 'elio-solaire');
  const carte = it => { const a = A.possede(it.id), assez = A.eclats >= it.prix; return `<button type="button" class="o-item ${it.rar}" ${a ? 'disabled' : ''} data-act="v9-acheter" data-id="${it.id}" ${!a && assez ? `data-confirm="Acheter : ${it.prix} éclats ?"` : ''}><span class="o-rar ${it.rar}">${V9_RAR[it.rar]}</span><b>${esc(it.nom)}</b>${it.desc ? `<small>${esc(it.desc)}</small>` : ''}<span class="prix">${a ? 'Acheté' : `${V9_I.eclat}${it.prix}`}</span></button>`; };
  return `<div class="v9"><section class="hello" style="padding-top:18px"><div class="v9-between"><div><p class="eyebrow">Boutique</p><h1>Tes éclats</h1></div><span class="o-eclats">${V9_I.eclat}${A.eclats.toLocaleString('fr-FR')}</span></div></section>
  <div style="display:flex;flex-direction:column;gap:10px">
    <section class="o-panel o-chf" style="flex-direction:row;align-items:center;gap:12px;box-shadow:inset 0 0 0 1px rgba(242,199,122,.6)"><img src="${V9.img('elio')}" alt="" style="width:86px;height:86px;object-fit:cover;filter:sepia(.5) saturate(1.6) hue-rotate(-10deg) brightness(1.1)"><span style="flex:1"><span class="o-rar legendaire">Légendaire · cette semaine</span><br><b style="font:600 1.15rem var(--font-titre)">${esc(vedette.nom)}</b><br><small class="v9-muted">${esc(vedette.desc)}</small></span></section>
    <span class="o-label">Objets et skins</span>
    <div class="o-grille2">${vente.map(carte).join('')}</div>
    <div class="o-elio" style="border-left-color:#4C9E63"><span>Les éclats se gagnent seulement en jouant. Pas d’argent réel, pas de tirage au hasard : tu vois toujours ce que tu obtiens.</span></div>
    <button type="button" class="o-btn sec" data-act="nav" data-vue="o-casier">Retour au casier</button>
  </div></div>`;
}

/* ======================= branchements des vues ======================= */
const vueEnfantAccueilOrigV9 = VUES['e-accueil'];
VUES['e-accueil'] = p => {
  const u = v9Univers(p);
  if (u === 'odyssee') return v9VueQG(p);
  const html = vueEnfantAccueilOrigV9(p);
  if (u !== 'aventure') return html;
  const i = html.indexOf('<div class="day-grid">');
  const bloc = `<div class="v9">${v9CarteAventure(p)}</div>`;
  const out = i >= 0 ? html.slice(0, i) + bloc + html.slice(i) : html + bloc;
  return out.replace('<div class="stack" style="gap:16px">', `<div class="stack" style="gap:16px">${v9Jours(p)}`);
};
Object.assign(VUES, {
  'e-album': p => v9VueAlbum(p),
  'e-aventure': p => (v9Univers(p) === 'odyssee' ? v9VueCarte(p) : v9VueAventure(p)),
  'o-carte': p => v9VueCarte(p),
  'o-etape': p => v9VueEtape(p),
  'o-skills': p => v9VueSkills(p),
  'o-casier': p => v9VueCasier(p),
  'o-boutique': p => v9VueBoutique(p),
  'o-heros': p => v9VueHeros(p),
});
VUES_ROLE.enfant.push('e-album', 'e-aventure', 'o-carte', 'o-etape', 'o-skills', 'o-casier', 'o-boutique', 'o-heros');

const v9NavsOrig = navsDe;
navsDe = function (role, p) {
  const n = v9NavsOrig(role, p);
  if (role === 'enfant' && p) {
    const u = v9Univers(p), jet = n.find(x => x[0] === 'e-jetons');
    if (u === 'aventure') return [['e-accueil', 'Accueil', V9_I.maison], ['accueil', 'Mondes', V9_I.carte], ['progres', 'Mon île', V9_I.ile], ['e-album', 'Album', V9_I.album], ...(jet ? [jet] : [])];
    if (u === 'odyssee') return [['e-accueil', 'QG', V9_I.qg], ['o-carte', 'Monde', V9_I.carte], ['o-skills', 'Skills', V9_I.skills], ['o-casier', 'Casier', V9_I.casier]];
  }
  if (role === 'enseignant' && !n.some(x => x[0] === 'e-studio')) { const i = n.findIndex(x => x[0] === 'e-adapter'); n.splice(i + 1, 0, ['e-studio', 'Studio', V9_I.studio]); }
  return n;
};
const v9RenderOrig = render;
render = function () {
  v9RenderOrig();
  const app = $('#app'), S = session();
  let u = app.dataset.univers;
  if (u === 'jeu') u = v9Univers(profilSession());
  if (S.role === 'enfant' && v9Univers(profilSession()) === 'odyssee' && app.dataset.univers === 'jeu') u = 'odyssee';
  app.dataset.univers = u || '';
  document.body.dataset.univers = u || '';
  // onglet actif du menu pour les vues secondaires
  const actif = { 'o-etape': 'o-carte', 'o-boutique': 'o-casier', 'o-heros': 'e-accueil', 'e-aventure': 'e-accueil' }[UI.vue];
  if (actif) $$('#bottomnav [data-vue], #topnav [data-vue]').forEach(b => { if (b.dataset.vue === actif) b.setAttribute('aria-current', 'page'); });
};
const v9OuvrirRunOrig = ouvrirRun;
ouvrirRun = function (ex, p) {
  v9OuvrirRunOrig(ex, p);
  const u = universJeu(p) ? v9Univers(p) : '';
  const run = $('#run');
  run.dataset.univers = u === 'aventure' || u === 'odyssee' ? u : '';
  run.style.setProperty('--v9-fond', u ? `url(${V9.img(u === 'odyssee' ? v9FamImgAdo[ex.famille] : v9FamImg[ex.famille])})` : 'none');
};

/* bilan de fin de jeu : Élio fait la fête, et résultat de l'énigme */
const v9BilanOrig = ecranBilan;
ecranBilan = function (ex, p, r, o) {
  const promesse = v9BilanOrig(ex, p, r, o);
  try { v9DecorerBilan(ex, p, r); } catch (e) { console.error(e); }
  return promesse;
};
function v9DecorerBilan(ex, p, r) {
  const u = universJeu(p) ? v9Univers(p) : '', b = $('#run-stage .bilan'); if (!b || !u || u === 'calme') return;
  const nb = etoiles(r.perf ?? 0);
  let res = '';
  const G = UI.v9enigme;
  if (G && G.pid === p.id && G.exId === ex.id) {
    UI.v9enigme = null;
    const liste = G.ado ? V9_ETAPES : V9_CHAPITRES, step = liste.find(s => s.id === G.step), E = v9Etat(p), faits = G.ado ? E.odyssee.faits : E.aventure.faits;
    if (step && !faits[step.id]) {
      const ok = v9Reussite(step, ex, r);
      if (ok) { faits[step.id] = Date.now(); Store.save(); }
      res = G.ado
        ? (ok ? `<div class="v9-enigme-res ok"><img src="${V9.img(v9Ado(p).imgHeros)}" alt=""><span><b>Porte ouverte · ${esc(step.titre)}</b>Récompense : ${esc(step.recompense.txt)} (+${step.recompense.eclats} éclats). L’étape suivante s’ouvre demain.</span></div>`
          : `<div class="v9-enigme-res ko"><img src="${V9.img('elio-avatar')}" alt=""><span><b>Pas encore</b>Élio garde la porte ouverte pour un nouvel essai. Objectif : ${esc(step.passe)}</span></div>`)
        : (ok ? `<div class="v9-enigme-res ok"><img src="${V9.img(`st-${step.st}`)}" alt=""><span><b>La porte s’ouvre !</b>${esc(step.recompense)}. La suite de l’aventure t’attend demain.</span></div>`
          : `<div class="v9-enigme-res ko"><img src="${V9.img('elio-avatar')}" alt=""><span><b>Presque !</b>Élio t’attend devant la porte. Tu peux réessayer : rien n’est perdu.</span></div>`);
    }
  }
  if (u === 'aventure') {
    b.insertAdjacentHTML('afterbegin', `<img class="v9-bilan-img" src="${V9.img(nb >= 2 ? 'elio-fete' : 'elio-salut')}" alt="${nb >= 2 ? 'Élio fait la fête' : 'Élio t’encourage'}">${res}`);
    const g = b.querySelector('.gain-blocs'); if (g) g.innerHTML = `${v9Etoile(22)} <b>+${nb} étoile${nb > 1 ? 's' : ''}</b> pour ton île${nb >= 3 && !Store.resultats(p.id, ex.id).some(x => x.id !== r.id && etoiles(x.perf ?? 0) >= 3) ? ' · nouvel autocollant !' : ''}`;
  } else {
    const A = v9Ado(p);
    const g = b.querySelector('.gain-blocs'); if (g) g.remove();
    b.insertAdjacentHTML('afterbegin', `${res}<div class="o-gains"><div><b>+${nb * 10}</b><small>éclats</small></div><div><b>+${nb}</b><small>étoile${nb > 1 ? 's' : ''}</small></div><div><b>${A.niveau}</b><small>niveau · ${esc(A.rang)}</small></div></div>`);
  }
}

/* démarrer un défi du jour en mode programme */
function v9Defi(id) { const p = Store.actif, s = p && seanceDuJour(p); lancerExercice(id, { mode: s && s.exos.includes(id) && !s.faits.includes(id) ? 'programme' : 'libre' }); }

/* réglage de l'univers : trois choix */
blocUnivers = function (p, qui) {
  const u = v9Univers(p), auto = !p.reglages?.univers || p.reglages.univers === 'jeu', age = ageDe(p.naissance);
  const opt = (v, t, d) => `<button type="button" class="btn sm ${u === v ? 'primary' : ''}" data-act="v9-univers" data-id="${p.id}" data-u="${v}" aria-pressed="${u === v}" style="flex:1 1 140px;flex-direction:column;align-items:flex-start;text-align:left;white-space:normal;padding:10px 12px;height:auto"><b>${t}</b><small style="font-weight:400">${d}</small></button>`;
  return `<div class="panel stack univers-reglage"><div><b>${qui === 'enfant' ? 'Mon univers' : `L’univers de ${esc(p.prenom)}`}</b><br><span class="muted" style="font-size:.86rem">${auto ? `Choisi selon l’âge${age != null ? ` (${age} ans)` : ''}. ` : ''}Les jeux et les mesures sont les mêmes dans les trois univers.</span></div>
    <div class="row" style="gap:8px;flex-wrap:wrap">${opt('aventure', 'Aventure', '6-10 ans : Élio le drone, Mon île, autocollants')}${opt('odyssee', 'Odyssée', '11 ans et + : héros, rangs, éclats')}${opt('calme', 'Calme', 'Sobre, sans décor ni animation')}</div>
    ${qui === 'parent' ? '<p class="muted" style="font-size:.82rem">Pour un enfant vite débordé par les stimulations (TSA, anxiété), l’univers calme garde les mêmes jeux sans le décor.</p>' : ''}</div>`;
};

/* ======================= ENSEIGNANT : photo du polycopié ======================= */
UI.v9photos = UI.v9photos || [];
const v9AdapterOrig = vueEnsAdapter;
vueEnsAdapter = function (E) {
  const html = v9AdapterOrig(E);
  const bloc = `<div class="v9-photo"><div class="row" style="gap:10px;align-items:center">${V9_I.photo}<b>Photographier le polycopié</b></div>
    <p class="muted" style="margin:0;font-size:.88rem">Prenez chaque page en photo, bien à plat et à la lumière. Elles sont jointes à votre support.</p>
    <label class="btn" for="v9-photo-in">${V9_I.photo} Prendre une photo</label><input id="v9-photo-in" type="file" accept="image/*" capture="environment" multiple class="v9-sr">
    <div class="v9-photos" id="v9-photos">${v9PhotosHtml()}</div>
    <p class="muted" style="margin:0;font-size:.82rem">La lecture automatique du texte sera faite par le serveur Élan, comme l’adaptation. En attendant, sur iPhone : ouvrez la photo, appuyez longuement sur le texte, « Copier », puis collez-le ci-dessus.</p></div>`;
  const i = html.indexOf('<div class="grid2">');
  return i >= 0 ? html.slice(0, i) + bloc + html.slice(i) : html;
};
function v9PhotosHtml() { return UI.v9photos.map((u, i) => `<figure><img src="${u}" alt="Page ${i + 1} photographiée"><figcaption>Page ${i + 1}</figcaption></figure>`).join(''); }
document.addEventListener('change', e => {
  if (e.target.id !== 'v9-photo-in') return;
  [...(e.target.files || [])].forEach(f => UI.v9photos.push(URL.createObjectURL(f)));
  const z = $('#v9-photos'); if (z) z.innerHTML = v9PhotosHtml();
  if (e.target.files?.length) toast(`${e.target.files.length} page${e.target.files.length > 1 ? 's' : ''} ajoutée${e.target.files.length > 1 ? 's' : ''}`);
});

/* ======================= ENSEIGNANT : Studio ======================= */
const V9_DEMO_COURS = `# Le cycle de l'eau
Je vais apprendre : comment l'eau voyage entre la mer, le ciel et la terre.
1. L'évaporation : le soleil chauffe l'eau de la mer. L'eau devient de la **vapeur**.
2. La condensation : en montant, la vapeur refroidit. Elle forme les **nuages**.
3. Les précipitations : les gouttes deviennent lourdes. Il **pleut**.
4. Le ruissellement : l'eau de pluie coule vers les **rivières**, puis retourne à la mer.
À retenir : l'eau tourne en rond : mer, nuage, pluie, rivière, mer.`;
const V9_MOTS_VIDES = new Set('alors aussi avec avant après autre cette celle celui comme dans depuis donc elle elles entre est être leur leurs mais même nous pour plus puis quand quel quelle sans sont sous très tout tous toute toutes vers votre vous ensuite parce'.split(' '));
function v9Analyse(texte) {
  const lignes = String(texte || '').split(/\n+/).map(l => l.trim()).filter(Boolean);
  let titre = '', retenir = '', intro = '';
  const etapes = [];
  lignes.forEach(l => {
    const brut = l.replace(/^#{1,6}\s*/, '').replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim();
    if (!titre && /^#/.test(l)) { titre = brut.replace(/\*\*/g, ''); return; }
    if (/^\**\s*à retenir/i.test(brut)) { retenir = brut.replace(/^\**\s*à retenir\s*:?\s*\**\s*:?\s*/i, ''); return; }
    if (/^je vais apprendre/i.test(brut)) { intro = brut; return; }
    if (/^(aménagements appliqués|pour l.enseignant)/i.test(brut.replace(/\*\*/g, ''))) return;
    etapes.push(brut);
  });
  if (!titre && etapes.length && etapes[0].length < 60) titre = etapes.shift().replace(/\*\*/g, '');
  let et = etapes;
  if (et.length < 3) et = (et.join(' ').match(/[^.!?]+[.!?]*/g) || []).map(x => x.trim()).filter(x => x.length > 3);
  et = et.slice(0, 8).map(t => {
    const m = t.match(/^([^:]{3,40}):\s*(.+)$/);
    const nom = m ? m[1].replace(/\*\*/g, '') : '', corps = m ? m[2] : t;
    const gras = corps.match(/\*\*(.+?)\*\*/);
    let cle = gras ? gras[1] : '';
    if (!cle) { const mots = corps.replace(/[^\p{L}' -]/gu, ' ').split(/\s+/).filter(w => w.length >= 5 && !V9_MOTS_VIDES.has(w.toLowerCase())); cle = mots.sort((a, b) => b.length - a.length)[0] || ''; }
    return { nom, texte: corps.replace(/\*\*/g, ''), cle };
  });
  return { titre: titre || 'Mon cours', intro, retenir, etapes: et };
}
const v9Surligne = (t, cle, tag = 'mark') => { const s = esc(t); if (!cle) return s; const k = esc(cle); const i = s.toLowerCase().indexOf(k.toLowerCase()); return i < 0 ? s : `${s.slice(0, i)}<${tag}>${s.slice(i, i + k.length)}</${tag}>${s.slice(i + k.length)}`; };
const V9_COUL = ['#F09C1F', '#E36E63', '#4C6BB2', '#4C9E63'];
function v9Studio() {
  const S = UI.v9studio ||= { texte: '', onglet: 'carte', style: 'pop', tempo: 'modere', lent: true, grand: true, question: true, karaoke: false, scene: 0 };
  if (!S.texte) { const A = UI.ens?.adapt; S.texte = (A?.resultat || A?.texte || ''); }
  return S;
}
function v9VueStudio(E) {
  const S = v9Studio(), plus = planEns(E) === 'plus', C = v9Analyse(S.texte);
  const onglets = [['carte', 'Carte mentale', false], ['video', 'Vidéo', true], ['chanson', 'Chanson', true]];
  let corps = '';
  if (!S.texte.trim()) corps = '<div class="empty">Collez un cours ci-dessus, reprenez votre dernière adaptation, ou essayez l’exemple.</div>';
  else if (S.onglet !== 'carte' && !plus) corps = `<div class="panel stack" style="align-items:flex-start"><b>${S.onglet === 'video' ? 'La vidéo du cours' : 'La chanson du cours'} fait partie d’Enseignant+</b><p class="muted" style="margin:0">Enseignant+ comprend ${OFFRE_ENSEIGNANT.quota.plus} adaptations par mois, une version par profil et le Studio (chanson et vidéo du cours).</p><button type="button" class="btn primary" data-act="paywall" data-t="enseignant">Passer à Enseignant+</button></div>`;
  else if (S.onglet === 'carte') corps = `<div class="v9-imprimable"><div class="v9-carte-m"><div class="c-titre">${esc(C.titre)}</div>${C.etapes.map((e, i) => `<div class="c-et" style="--c:${V9_COUL[i % 4]}"><b>${i + 1}. ${esc(e.nom || `Étape ${i + 1}`)}</b><span>${v9Surligne(e.texte, e.cle)}</span></div>`).join('')}${C.retenir ? `<div class="c-ret"><b>À retenir :</b> ${esc(C.retenir)}</div>` : ''}</div></div>
    <div class="row" style="gap:8px;margin-top:10px"><button type="button" class="btn" data-act="v9-imprimer">Imprimer</button><span class="muted" style="font-size:.85rem">Police lisible, une idée par case, mots clés surlignés.</span></div>`;
  else if (S.onglet === 'video') {
    const scenes = v9Scenes(C), n = clamp(S.scene, 0, scenes.length - 1), sc = scenes[n];
    corps = `<div class="grid2" style="align-items:start">
      <div class="stack" style="gap:8px"><div class="v9-video" id="v9-video"><span class="scene-n">Scène ${n + 1} sur ${scenes.length} · ${esc(sc.titre)}</span><div class="scene-t" style="font-size:${S.grand ? '' : '1rem'}">${v9Surligne(sc.texte, sc.cle)}</div>${S.question && sc.q ? `<div class="scene-q" id="v9-q">Question : ${esc(sc.q)}</div>` : '<span></span>'}<div class="barre"><i style="width:${Math.round(100 * (n + 1) / scenes.length)}%"></i></div></div>
        <div class="row" style="gap:8px"><button type="button" class="btn primary" data-act="v9-video-play">${V9_I.play} ${UI.v9lecture ? 'Pause' : 'Lire la vidéo'}</button><button type="button" class="btn" data-act="v9-scene" data-d="-1">Précédente</button><button type="button" class="btn" data-act="v9-scene" data-d="1">Suivante</button></div></div>
      <div class="stack" style="gap:10px"><div class="v9-scenes">${scenes.map((s, i) => `<button type="button" data-act="v9-scene" data-n="${i}" aria-current="${i === n}"><span>${i + 1}</span>${esc(s.titre)}</button>`).join('')}</div>
        ${v9Coche('lent', 'Voix posée, débit lent', S.lent)}${v9Coche('grand', 'Sous-titres en grand, mot clé surligné', S.grand)}${v9Coche('question', 'Une question après chaque scène', S.question)}
        <p class="muted" style="font-size:.82rem;margin:0">Cette version lit la vidéo dans l’app avec la voix de l’appareil. L’export MP4 avec avatar se fait dans le Studio complet.</p></div></div>`;
  } else {
    const L = v9Paroles(C);
    corps = `<div class="grid2" style="align-items:start">
      <div class="stack" style="gap:10px"><div class="field"><span class="lab">Style musical</span><div class="v9-onglets">${[['pop', 'Pop douce'], ['rap', 'Rap'], ['comptine', 'Comptine'], ['rock', 'Rock']].map(([k, l]) => `<button type="button" data-act="v9-st" data-k="style" data-v="${k}" aria-pressed="${S.style === k}">${l}</button>`).join('')}</div></div>
        <div class="field"><span class="lab">Tempo</span><div class="v9-onglets">${[['lent', 'Lent'], ['modere', 'Modéré'], ['rapide', 'Rapide']].map(([k, l]) => `<button type="button" data-act="v9-st" data-k="tempo" data-v="${k}" aria-pressed="${S.tempo === k}">${l}</button>`).join('')}</div></div>
        ${v9Coche('karaoke', 'Version karaoké (rythme sans voix)', S.karaoke)}
        <button type="button" class="btn primary" data-act="v9-chanson-play">${V9_I.play} ${UI.v9lecture ? 'Arrêter' : 'Écouter la chanson'}</button>
        <p class="muted" style="font-size:.82rem;margin:0">Les mots clés du cours deviennent les paroles, le refrain reprend « À retenir ». Ici, lecture rythmée avec la voix de l’appareil ; la version chantée en MP3 se crée dans le Studio complet.</p></div>
      <div class="panel v9-paroles v9-imprimable" id="v9-paroles"><b style="font:600 1.2rem var(--font-titre)">${esc(L.titre)}</b>${L.blocs.map(bl => `<div class="bloc ${bl.refrain ? 'refrain' : ''}"><b>${esc(bl.nom)}</b>${bl.vers.map(v => `<p data-v="${v.i}">${v9Surligne(v.t, v.cle)}</p>`).join('')}</div>`).join('')}</div></div>`;
  }
  return `<section class="hello"><p class="eyebrow">Studio</p><h1>Apprendre autrement</h1><p class="muted">À partir d’un cours adapté, créez une carte mentale, une vidéo ou une chanson du cours.</p></section>
  <div class="panel stack"><div class="field"><label for="v9-studio-txt">Le cours</label><textarea class="input" id="v9-studio-txt" rows="6" maxlength="14000" placeholder="Collez ici le cours adapté…">${esc(S.texte)}</textarea></div>
    <div class="row" style="gap:8px;flex-wrap:wrap">${UI.ens?.adapt?.resultat ? '<button type="button" class="btn sm" data-act="v9-studio-src" data-s="adapt">Reprendre ma dernière adaptation</button>' : ''}<button type="button" class="btn sm" data-act="v9-studio-src" data-s="demo">Exemple : le cycle de l’eau</button><a class="btn sm ghost" href="https://elanneuroapp.synology.me/enseignant/" target="_blank" rel="noopener">Studio complet</a></div></div>
  <div class="v9-onglets" role="group" aria-label="Que créer ?" style="margin:14px 0">${onglets.map(([k, l, pl]) => `<button type="button" data-act="v9-onglet" data-k="${k}" aria-pressed="${S.onglet === k}">${l}${pl ? '<span class="v9-plus">PLUS</span>' : ''}</button>`).join('')}</div>
  ${corps}`;
}
const v9Coche = (k, l, v) => `<label class="radio-l" style="align-items:center"><input type="checkbox" data-v9c="${k}" ${v ? 'checked' : ''}> <span>${esc(l)}</span></label>`;
function v9Scenes(C) {
  const s = [{ titre: 'Je vais apprendre', texte: C.intro || `Aujourd’hui : ${C.titre}.`, cle: '' }];
  C.etapes.forEach((e, i) => s.push({ titre: e.nom || `Étape ${i + 1}`, texte: e.texte, cle: e.cle, q: e.cle ? `Complète : ${e.texte.replace(new RegExp(e.cle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '…')}` : '', rep: e.cle }));
  s.push({ titre: 'Quiz final', texte: C.retenir ? `À retenir : ${C.retenir}` : 'Qu’as-tu retenu ? Redis les étapes dans l’ordre.', cle: '' });
  return s;
}
function v9Paroles(C) {
  let i = 0;
  const vers = C.etapes.map(e => { let t = e.texte.replace(/\s+/g, ' ').split(/[.!?]\s/)[0].replace(/[.;:,]$/, ''); if (t.length > 80) t = t.split(/,\s/).slice(0, 2).join(', '); return { t, cle: e.cle }; });
  const refrain = C.retenir ? C.retenir.replace(/\.$/, '') : `${C.titre}, je m’en souviens`;
  const blocs = [];
  for (let k = 0; k < vers.length; k += 2) {
    blocs.push({ nom: `Couplet ${blocs.filter(b => !b.refrain).length + 1}`, vers: vers.slice(k, k + 2).map(v => ({ ...v, i: i++ })) });
    blocs.push({ nom: 'Refrain · à retenir', refrain: true, vers: [{ t: refrain, cle: '', i: i++ }, { t: refrain, cle: '', i: i++ }] });
  }
  return { titre: C.titre, blocs };
}
/* lecture de la vidéo (voix de l'appareil) */
async function v9LireVideo() {
  const S = v9Studio(), C = v9Analyse(S.texte), sc = v9Scenes(C), jeton = UI.v9lecture = uid();
  render();
  for (let n = S.scene; n < sc.length; n++) {
    if (UI.v9lecture !== jeton) return;
    S.scene = n; if (UI.vue === 'e-studio') render(); else { UI.v9lecture = null; return; }
    await Voice.say(sc[n].texte, { rate: S.lent ? 0.8 : 0.95 });
    if (UI.v9lecture !== jeton) return;
    if (S.question && sc[n].q) { await Voice.say(sc[n].q.replace('…', 'blanc'), { rate: 0.85 }); await new Promise(r => setTimeout(r, 2200)); const q = $('#v9-q'); if (q && UI.v9lecture === jeton) { q.textContent = `Réponse : ${sc[n].rep}`; await Voice.say(`Réponse : ${sc[n].rep}`, { rate: 0.85 }); } }
    await new Promise(r => setTimeout(r, 500));
  }
  UI.v9lecture = null; render();
}
/* lecture rythmée de la chanson : un battement et la voix, vers par vers */
let v9Audio_ = null;
function v9Battement(bpm, style) {
  try {
    v9Audio_ ||= new (window.AudioContext || window.webkitAudioContext)();
    const ac = v9Audio_, t0 = ac.currentTime + 0.05, beat = 60 / bpm;
    const coup = (t, f, d, type = 'sine', v = 0.2) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (type === 'sine') o.frequency.exponentialRampToValueAtTime(40, t + d); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + 0.02); };
    const notes = { pop: [262, 330, 392, 330], comptine: [392, 392, 440, 392], rap: [196, 196, 233, 196], rock: [165, 196, 220, 196] }[style] || [262, 330, 392, 330];
    for (let k = 0; k < 64; k++) { const t = t0 + k * beat; coup(t, k % 2 ? 90 : 120, 0.18, 'sine', style === 'rock' ? 0.35 : 0.25); if (style !== 'comptine') coup(t + beat / 2, 6000, 0.04, 'square', 0.02); if (k % 2 === 0) coup(t, notes[(k / 2) % 4], beat * 0.9, 'triangle', 0.05); }
    return () => { try { ac.suspend().then(() => { v9Audio_ = null; ac.close(); }); } catch (e) { } };
  } catch (e) { return () => { }; }
}
async function v9LireChanson() {
  const S = v9Studio(), L = v9Paroles(v9Analyse(S.texte)), jeton = UI.v9lecture = uid();
  const bpm = { lent: 80, modere: 100, rapide: 120 }[S.tempo] || 100, stop = v9Battement(bpm, S.style);
  render();
  const tous = L.blocs.flatMap(b => b.vers);
  for (const v of tous) {
    if (UI.v9lecture !== jeton || UI.vue !== 'e-studio') break;
    $$('#v9-paroles p').forEach(el => el.classList.toggle('joue', +el.dataset.v === v.i));
    if (S.karaoke) await new Promise(r => setTimeout(r, Math.max(1800, v.t.length * 70)));
    else await Voice.say(v.t, { rate: { lent: 0.85, modere: 1, rapide: 1.12 }[S.tempo] || 1 });
    await new Promise(r => setTimeout(r, (60 / bpm) * 1000));
  }
  stop(); if (UI.v9lecture === jeton) UI.v9lecture = null; if (UI.vue === 'e-studio') render();
}
VUES['e-studio'] = () => v9VueStudio(enseignant(session().enseignantId));
VUES_ROLE.enseignant.push('e-studio');
document.addEventListener('input', e => { if (e.target.id === 'v9-studio-txt') v9Studio().texte = e.target.value; });
document.addEventListener('change', e => { const k = e.target.dataset?.v9c; if (k) { v9Studio()[k] = e.target.checked; render(); } });

/* ======================= actions ======================= */
Object.assign(ACTIONS_ELAN, {
  'v9-dire': el => { Voice.unlock(); Voice.say(el.dataset.t || ''); },
  'v9-monde': el => { const s = $(`.monde[style*="${MONDES[el.dataset.f]?.c || '#'}"]`) || $$('.monde')[FAMILLES.findIndex(f => f.id === el.dataset.f)]; if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
  'v9-objet': el => { const p = profilSession(); if (!p) return; v9Etat(p).ile.sel = el.dataset.o; Store.save(); render(); },
  'v9-slot': el => {
    const p = profilSession(); if (!p) return; const L = v9Ile(p), i = el.dataset.i;
    if (L.I.slots[i]) { delete L.I.slots[i]; Store.save(); render(); if (p.reglages.son) Sound.tone?.(330, 0.06, 'sine', 0.04); return; }
    const o = V9_OBJETS.find(x => x.id === L.I.sel); if (!o) return;
    if (L.niveau < o.niv) { toast(`Débloqué au niveau ${o.niv}`); return; }
    if (L.dispo < o.prix) { toast('Pas assez d’étoiles : joue pour en gagner !'); return; }
    L.I.slots[i] = o.id; Store.save(); render(); if (p.reglages.son) Sound.tone?.(660, 0.05, 'sine', 0.05);
  },
  'v9-chap': el => { UI.v9chap = el.dataset.c || null; const p = profilSession(); const P = p && v9Parcours(p, false); if (UI.v9chap && P && !P.faits[UI.v9chap] && P.cour?.id !== UI.v9chap) { UI.v9chap = null; toast('Ouvre d’abord les portes d’avant.'); return; } render(); window.scrollTo(0, 0); },
  'v9-enigme': el => { const p = profilSession(); if (!p) return; UI.vue = el.dataset.ado ? 'o-etape' : 'e-aventure'; v9LancerEnigme(p, !!el.dataset.ado); },
  'v9-etape': el => { const p = profilSession(); if (!p) return; const P = v9Parcours(p, true), s = P.liste.find(x => x.id === el.dataset.s); if (s && !P.faits[s.id] && P.cour?.id !== s.id) { toast('Termine d’abord l’étape précédente.'); return; } UI.v9etape = el.dataset.s; allerA('o-etape'); },
  'v9-defi': el => v9Defi(el.dataset.ex),
  'v9-heros': el => { UI.v9heros = el.dataset.h; render(); },
  'v9-heros-ok': () => { const p = profilSession(); if (!p) return; v9Etat(p).odyssee.heros = UI.v9heros || 'nova'; UI.v9heros = null; Store.save(); allerA('e-accueil'); toast('Héros choisi : bienvenue au QG'); },
  'v9-heros-changer': () => { const p = profilSession(); if (!p) return; UI.v9heros = v9Etat(p).odyssee.heros; allerA('o-heros'); },
  'v9-casier': el => { UI.v9casier = el.dataset.k; render(); },
  'v9-equiper': el => { const p = profilSession(); if (!p) return; const it = V9_BOUTIQUE.find(x => x.id === el.dataset.id); if (!it) return; const O = v9Etat(p).odyssee; O.equipe[it.type] = O.equipe[it.type] === it.id ? null : it.id; Store.save(); render(); },
  'v9-acheter': el => {
    const p = profilSession(); if (!p) return; const it = V9_BOUTIQUE.find(x => x.id === el.dataset.id), A = v9Ado(p); if (!it || A.possede(it.id)) return;
    if (A.eclats < it.prix) { toast(`Il te manque ${it.prix - A.eclats} éclats : joue pour en gagner.`); return; }
    A.O.achats.push(it.id); A.O.depenses += it.prix; Store.save(); render(); toast(`${it.nom} : dans ton casier`);
  },
  'v9-univers': el => { const p = Store.profil(el.dataset.id) || profilSession(); if (!p) return; p.reglages.univers = el.dataset.u; Store.save(); render(); toast({ aventure: 'Univers Aventure activé', odyssee: 'Univers Odyssée activé', calme: 'Univers calme activé' }[el.dataset.u]); },
  'v9-onglet': el => { v9Studio().onglet = el.dataset.k; UI.v9lecture = null; Voice.cancel(); render(); },
  'v9-studio-src': el => { const S = v9Studio(); S.texte = el.dataset.s === 'demo' ? V9_DEMO_COURS : (UI.ens?.adapt?.resultat || S.texte); S.scene = 0; render(); },
  'v9-imprimer': () => window.print(),
  'v9-scene': el => { const S = v9Studio(), n = v9Scenes(v9Analyse(S.texte)).length; UI.v9lecture = null; Voice.cancel(); S.scene = el.dataset.n != null ? +el.dataset.n : clamp(S.scene + +el.dataset.d, 0, n - 1); render(); },
  'v9-st': el => { v9Studio()[el.dataset.k] = el.dataset.v; render(); },
  'v9-video-play': () => { if (UI.v9lecture) { UI.v9lecture = null; Voice.cancel(); render(); return; } Voice.unlock(); v9LireVideo(); },
  'v9-chanson-play': () => { if (UI.v9lecture) { UI.v9lecture = null; Voice.cancel(); render(); return; } Voice.unlock(); v9LireChanson(); },
});

/* ======================= démo : un profil ado (Yanis, 13 ans) ======================= */
function v9DemoAdo(d) {
  if (d.profils.some(p => p.demo && p.prenom === 'Yanis')) return;
  const leo = d.profils.find(p => p.demo && p.prenom === 'Léo'); if (!leo) return;
  const y = JSON.parse(JSON.stringify(leo));
  const an = new Date().getFullYear() - 13;
  Object.assign(y, { id: uid(), prenom: 'Yanis', naissance: `${an}-03-12`, motif: 'TDAH, dyslexie (profil fictif)', troubles: ['tdah', 'dyslexie'], creeLe: Date.now(), seances: [], monde: undefined, v9: undefined });
  y.reglages = { ...y.reglages }; delete y.reglages.univers;
  let c; do { c = codeAleatoire(); } while (d.profils.some(x => x.acces?.code === c));
  y.acces = { ...y.acces, code: c };
  y.famille = { ...y.famille, parentPin: y.famille?.parentPin || '2468', demandes: [], historique: [], appareils: [], liens: [], invitations: [], enseignants: [] };
  y.guidance = { ...(y.guidance || {}), actif: false };
  d.profils.push(y);
  d.resultats.filter(r => r.profilId === leo.id).slice(-40).forEach(r => d.resultats.push({ ...JSON.parse(JSON.stringify(r)), id: uid(), profilId: y.id }));
}
const v9MigrerOrig = migrerElan;
migrerElan = function (d) { v9MigrerOrig(d); if ((d.versionDemo || 1) < 9) { v9DemoAdo(d); d.versionDemo = 9; Store.save(); } };
const v9CreerDemoOrig = creerDemo;
creerDemo = function () { const d = v9CreerDemoOrig(); v9DemoAdo(d); d.versionDemo = 9; return d; };
ESPACES['ado-centre'] = { role: 'enfant', centre: true, nom: 'Espace ado', pour: 'Ado suivi au centre (univers Odyssée)' };
const v9OuvrirDemoOrig = ouvrirDemo;
ouvrirDemo = function (esp) {
  if (esp === 'ado-centre') { const p = Store.data.profils.find(x => x.demo && x.prenom === 'Yanis'); if (!p) return false; ouvrirSession('enfant', { profilId: p.id, appareil: 'enfant' }); return true; }
  return v9OuvrirDemoOrig(esp);
};
const v9GrilleDemoOrig = grilleDemo;
grilleDemo = function () {
  const html = v9GrilleDemoOrig(), fin = html.lastIndexOf('</div></section>');
  const btn = `<button type="button" class="demo-esp" data-role="enfant" data-act="demo-espace" data-e="ado-centre"><span class="demo-n num">9</span><span class="demo-t"><b>Espace ado</b><small>Ado suivi au centre (univers Odyssée)</small><span class="demo-qui">Yanis, 13 ans · son téléphone</span></span></button>`;
  return fin >= 0 ? html.slice(0, fin) + btn + html.slice(fin) : html;
};
