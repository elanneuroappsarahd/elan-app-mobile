# Design Élan : maquettes et visuels pour Élan Minds

Ce dossier contient le design validé de l'application Élan, fait sur le canvas Claude.
Il sert de référence pour construire les écrans dans Élan Minds.

- `design/ecrans/` : une capture JPG par écran (mobile 390 × 844, ordinateur 1440 de large).
- `design/html/` : le code HTML et CSS de chaque écran, à reproduire en composants React + Tailwind.
- `public/elan/images/` : les visuels, servis à l'adresse `/elan/images/<nom>.jpg`. **Utiliser ces fichiers tels quels, ne pas les régénérer ni les remplacer par des images génériques.**
- `public/elan/fonts/` : polices de la charte (`/elan/fonts/...`).

## Charte Élan

- Couleurs : orange `#F09C1F`, corail `#E36E63`, bleu `#4C6BB2`, vert `#4C9E63`, crème `#F2EDEB`, encre `#131212`.
- Une couleur par espace : enfant = orange, parent = corail, adulte = vert, enseignant = bleu, praticienne = noir.
- Polices : titres en **Chillax** (500, 600, 700) ; textes en **Hanken Grotesk** (400, 500, 600). Dans les exercices et consignes pour enfants dys, garder une police très lisible (Lexend ou Atkinson Hyperlegible).
- Écrans adultes et enseignants : angles droits, pas d'ombre, survol noir (texte bleu sur noir), pastille bleue « é » en signature (`pastille-e-bleue.png`), liseré 4 couleurs.

## Les trois univers de l'espace jeune (même jeux, mêmes mesures)

Choisi automatiquement selon l'âge, modifiable dans « Mon univers ».

### Aventure (6-10 ans) : fond nuit `#110D16`, cartes `#1D1726`, coins arrondis, gros boutons orange
- Mascotte **Élio** : drone orange réaliste (`elio-avatar.jpg` en rond, `elio-salut.jpg` accueil, `elio-fete.jpg` victoire).
- Mondes (une photo par famille d'exercices) : `elio-r-ile` attention, `elio-r-grotte` mémoire, `elio-r-ville` mots, `elio-r-chateau` stratégie, `elio-r-circuit` vitesse, `elio-r-atelier` défis dys, `elio-r-victoire` finale.
- Mon île : `ile-vue-ciel.jpg` (objets posés avec les étoiles gagnées).
- Album : `autocollants.jpg` (en-tête) et 9 autocollants `st-*.jpg`.
- Bouton « écouter » en cyan `#7FE3F0` (couleur des yeux d'Élio).

### Odyssée (11 ans et +) : fond `#0D111D`, panneaux `#161C2D` / `#1E2640`, coins coupés en biseau, majuscules espacées
- Héros au choix, 3 rangs chacun : `nova`, `nova-explorateur`, `nova-eclaireur` ; `kai`, `kai-explorateur`, `kai-eclaireur` ; `sol`, `sol-explorateur`, `sol-eclaireur` (Sol est une fille).
- Élio drone : `elio.jpg`.
- Archipel et secteurs : `archipel` (carte), `observatoire` (vigilance), `crypte` (mémoire), `cite` (mots), `forteresse` (stratégie), `circuit` (vitesse), `atelier` (défis), `coeur` (finale).
- Rangs : Recrue, Explorateur (niv. 10), Éclaireur (20), Pionnier (35), Légende (50). Monnaie : éclats (gagnés en jouant uniquement, pas d'argent réel, pas de tirage au hasard). Raretés : commun, rare, épique, légendaire.
- Navigation : QG · Monde · Skills · Casier. Les compétences agissent dans le monde, jamais sur le score des exercices.

### Calme : même contenu, sans décor ni animation.

## L'aventure (storyboard)

Chaque étape est une porte scellée par une **énigme** = un exercice d'entraînement choisi par Élan selon le profil et le programme de la praticienne. Réussie : porte ouverte et récompense. Pas encore : indice d'Élio et nouvel essai, rien n'est perdu. **Une étape par jour au maximum.** Voir `ecrans/Ado-Storyboard.jpg` et `ecrans/Enfant-Aventure-Elio.jpg`.

## Espace enseignant

Ma classe, Mémo PAP, Adapter un cours (avec « Photographier le polycopié »), Fiches par profil, Studio (carte mentale ; vidéo et chanson du cours incluses dans Enseignant+). Offre : gratuit (3 adaptations/mois) ou Enseignant+ 59,99 € TTC/an (40 adaptations/mois).

## Liste des écrans

| Écran | Capture | Code |
|---|---|---|
| Fondations de la charte | ecrans/Main.jpg | html/Main.html |
| Enfant : Élio et récompenses | ecrans/Enfant-Elio.jpg | html/Enfant-Elio.html |
| Enfant : accueil, mondes, jeu, bravo, île, album, aventure | ecrans/Enfant-*.jpg | html/Enfant-*.html |
| Enfant : scène jouable (paires de cristaux) | (voir html) | html/Enfant-Scene-Live.html |
| Ado : univers, avatar, QG, carte, jeu, bravo, casier, monde, énigme, étape, compétences, boutique | ecrans/Ado-*.jpg | html/Ado-*.html |
| Ado : storyboard et évolution des héros | ecrans/Ado-Storyboard.jpg, Ado-Evolutions.jpg | html/… |
| Ado : épreuve jouable (séquence des cristaux) | (voir html) | html/Ado-Epreuve-Live.html |
| Enseignant (ordinateur et mobile) | ecrans/Ens-*.jpg | html/Ens-*.html |
