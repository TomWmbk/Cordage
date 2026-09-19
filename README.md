# Cordage

Application responsive de gestion d’activité pour cordeurs de raquettes.

## Fonctionnalités

- comptes privés pour cordeurs ;
- suivi des poses, paiements et retours ;
- mémorisation des préférences client ;
- catalogue de cordages en stock ;
- historique, filtres, statistiques et export JSON ;
- interface claire/sombre adaptée au mobile.

L’espace joueur est désactivé pour cette version. Il n’est ni proposé à l’inscription, ni accessible publiquement.

## Installation locale

Prérequis : Node.js 20 ou ultérieur.

```bash
cp .env.example .env
npm ci
npx prisma migrate deploy
npm run dev
```

Remplacez impérativement `AUTH_SECRET` dans `.env` par une valeur longue et aléatoire avant tout déploiement.

## Mise en production

Cette version utilise SQLite : déployez-la dans un conteneur unique avec un volume persistant. Les plateformes à système de fichiers éphémère ou plusieurs instances en parallèle ne conviennent pas sans migrer la base vers PostgreSQL.

```bash
export AUTH_SECRET="$(openssl rand -base64 48)"
export NEXTAUTH_URL="https://votre-domaine.fr"
docker compose -f docker-compose.prod.yml up -d --build
```

Placez le conteneur derrière un reverse proxy HTTPS, sauvegardez régulièrement le volume `cordage-data` et contrôlez l’état de l’application via `/api/health`. Le limiteur des tentatives de connexion est volontairement local au processus ; utilisez un stockage partagé avant de passer à plusieurs instances.

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
