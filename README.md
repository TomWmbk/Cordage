# Cordage

Application responsive de gestion d’activité pour cordeurs de raquettes.

## Fonctionnalités

- comptes privés pour cordeurs ;
- suivi des poses, paiements et retours ;
- mémorisation des préférences client ;
- catalogue de cordages en stock ;
- historique, filtres, statistiques et export JSON ;
- interface claire/sombre adaptée au mobile.

L’espace joueur est conservé hors ligne dans le code pour une version ultérieure. Il n’est ni proposé à l’inscription, ni accessible publiquement.

## Installation locale

Prérequis : Node.js 20 ou ultérieur.

```bash
cp .env.example .env
npm ci
npx prisma migrate deploy
npm run dev
```

Remplacez impérativement `AUTH_SECRET` dans `.env` par une valeur longue et aléatoire avant tout déploiement.

## Vérification

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm audit
```

## Stack

Next.js 16, React 19, TypeScript, Prisma, SQLite, NextAuth, Tailwind CSS et Recharts.
