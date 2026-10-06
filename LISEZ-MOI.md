# Application Élan : projet mobile (iPhone, puis Android)

Ce dossier contient tout ce qu'il faut pour compiler l'application Élan dans le cloud (Codemagic) et l'envoyer sur TestFlight.

- `www/` : l'application elle-même (version 0.9, polices et images intégrées, fonctionne sans internet).
  - `elan-v09.css` et `elan-v09.js` : la nouvelle interface (univers enfant Aventure, univers ado Odyssée, charte enseignant, Studio, photo du polycopié).
  - `img/` : les visuels réalistes (Élio, héros, mondes, autocollants).
- `ios/` : le projet iPhone/iPad (Capacitor 8). Il contient l'icône, l'écran de démarrage, le nom « Élan » et l'identifiant `fr.elanneurotherapie.app`.
- `capacitor.config.json` et `package.json` : la configuration.
- `codemagic.yaml` : la recette de compilation. Codemagic crée lui-même le certificat et le profil Apple, compile l'app et l'envoie sur TestFlight.

## Variables à créer dans Codemagic (groupe « apple »)

Les quatre variables sont à cocher « Secret ». Aucune clé ne doit être déposée sur GitHub.

| Nom | Contenu |
|---|---|
| `APP_STORE_CONNECT_ISSUER_ID` | l'Issuer ID affiché dans App Store Connect › Utilisateurs et accès › Intégrations |
| `APP_STORE_CONNECT_KEY_IDENTIFIER` | l'ID de la clé (10 caractères) |
| `APP_STORE_CONNECT_PRIVATE_KEY` | tout le contenu du fichier `AuthKey_XXXXXXXXXX.p8`, ouvert avec le Bloc-notes |
| `CERTIFICATE_PRIVATE_KEY` | tout le contenu du fichier `cle-certificat-apple.txt` (préparé à côté de ce dossier, jamais sur GitHub) |

## Mettre à jour l'application

Quand une nouvelle version est prête, seul le dossier `www/` change. Il suffit de le remplacer sur GitHub, puis de relancer la compilation dans Codemagic. TestFlight propose alors la mise à jour sur l'iPhone.

## Version 0.9 (05/10/2026)

- Espace enfant 6-10 ans : Élio en drone réaliste, Mon île, album d'autocollants, l'aventure d'Élio (une porte = une énigme choisie par Élan, une étape par jour au maximum).
- Espace ado 11 ans et + : univers Odyssée (Nova, Kai, Sol ; QG, carte de l'archipel, compétences, casier, boutique en éclats, sans argent réel ni tirage au hasard). Choix de l'univers dans « Mon univers » (parent ou enfant). Profil de test : Yanis, 13 ans (9e espace de la démo).
- Espace enseignant : charte Élan, photo du polycopié, Studio (carte mentale, vidéo, chanson ; vidéo et chanson incluses dans Enseignant+).
- iPhone : autorisations appareil photo et photos ajoutées (Info.plist), version 0.9.0.
- Sauvegarde de la version 0.8 : dossier `sauvegardes/` à côté de ce dossier (à ne pas mettre sur GitHub).

## Déposer sur GitHub (première fois)

1. Sur github.com : « New repository », nom `elan-app-mobile`, **Private**, sans README.
2. Envoyer le contenu de ce dossier (pas le dossier `sauvegardes`, ni `cle-certificat-apple.txt`, ni aucun fichier .p8 / .p12).
3. Dans Codemagic : « Add application » › GitHub › `elan-app-mobile` › le fichier `codemagic.yaml` est détecté.
4. Créer le groupe de variables « apple » (tableau ci-dessus), puis lancer le workflow « iPhone → TestFlight ».
