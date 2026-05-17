# RAGE AI - Infrastructure Digitale Complète

**RAGE AI** est une plateforme d'infrastructure digitale complète pilotée par IA, construite avec **[NextJS](https://nextjs.org/) + [Tailwind CSS](https://tailwindcss.com/) + Cloudinary + Redis**.

## 🚀 Architecture de Gestion d'Images

Ce projet implémente une architecture complète pour la gestion d'images avec upload sur Cloudinary, cache Redis, et dashboard d'administration.

### 📁 Fonctionnalités Principales

#### ✅ Upload d'Images

- **Support multi-formats**: Images (JPG, PNG, GIF, WebP), Vidéos (MP4, AVI, MOV), PDF
- **Drag & Drop**: Interface moderne avec glisser-déposer
- **Optimisation automatique**: Redimensionnement et compression via Cloudinary
- **Validation**: Taille max 50MB, types de fichiers validés

#### ✅ Cache Redis

- **Mise en cache automatique** des métadonnées images
- **Durée de vie**: 1 heure configurable
- **Gestion des erreurs** de connexion Redis
- **Performance**: Réduction des appels API Cloudinary

#### ✅ Dashboard d'Administration

- **Gestion complète**: CRUD sur les images
- **Recherche et filtrage** par type, tags, nom
- **Modification inline** des tags et métadonnées
- **Visualisation plein écran** avec aperçus
- **Suppression avec confirmation**

#### ✅ Hero Section Éditable

- **Upload d'arrière-plan** directement depuis la page d'accueil
- **Mode admin** avec `?admin=true` dans l'URL
- **Optimisation automatique** de l'image uploadée
- **Persistance** via API REST

#### ✅ API REST Complètes

```
GET    /api/images           - Lister les images
POST   /api/images           - Uploader une image
GET    /api/images/[id]      - Détails d'une image
PUT    /api/images/[id]      - Modifier une image
DELETE /api/images/[id]      - Supprimer une image
POST   /api/images/optimize  - Optimiser une URL
GET/POST/DELETE /api/hero/background - Gestion background Hero
```

## 🛠️ Installation

```bash
# Installer les dépendances
bun install

# Démarrer Redis
sudo systemctl start redis-server

# Démarrer le développement
bun run dev
```

### Configuration

Variables d'environnement dans `.env.local`:

```env
# Cloudinary
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis
REDIS_URL=redis://localhost:6379
```

## 📖 Utilisation

### 1. Composant d'Upload

```tsx
import ImageUploader from '@/components/ImageUploader';

<ImageUploader
  onUploadSuccess={(imageData) => {
    console.log('URL:', imageData.secure_url);
    console.log('ID:', imageData.id);
  }}
  folder="mon-dossier"
  tags={['tag1', 'tag2']}
  metadata={{ section: 'hero', type: 'background' }}
/>;
```

### 2. Hero Section Éditable

```tsx
import HeroEditable from '@/components/HeroEditable';

<HeroEditable isAdmin={true} backgroundImage={backgroundUrl} onBackgroundChange={(url) => setBackgroundUrl(url)} />;
```

### 3. Service d'Images

```tsx
import { ImageService } from '@/lib/image-service';

const imageService = await ImageService.getInstance();

// Uploader
const imageData = await imageService.uploadImage(buffer, filename, {
  folder: 'uploads',
  tags: ['hero'],
  metadata: { section: 'hero' },
});

// Récupérer
const image = await imageService.getImage(imageId);

// Optimiser URL
const optimizedUrl = imageService.getOptimizedUrl(imageId, {
  width: 1920,
  height: 1080,
  quality: 80,
});
```

## 🎯 Accès

- **Site principal**: `http://localhost:3000`
- **Dashboard images**: `http://localhost:3000/dashboard/images`
- **Mode admin**: `http://localhost:3000?admin=true`
- **API documentation**: `/api/images`

## 🏗️ Architecture

```
├── lib/
│   ├── redis.ts           # Service Redis pour le cache
│   ├── image-service.ts   # Service de gestion d'images
│   └── cloudinary.ts      # Configuration Cloudinary
├── app/api/
│   ├── images/            # API CRUD images
│   └── hero/              # API Hero section
├── components/
│   ├── ImageUploader.tsx  # Composant d'upload
│   └── HeroEditable.tsx   # Hero section éditable
└── app/dashboard/
    └── images/            # Dashboard de gestion
```

## 🔄 Workflow

1. **Upload**: Utilisateur upload une image via `ImageUploader`
2. **Cloudinary**: Image envoyée vers Cloudinary avec optimisation
3. **Cache**: Métadonnées stockées dans Redis
4. **Retour**: URL optimisée retournée immédiatement
5. **Dashboard**: Gestion complète via interface admin
6. **Hero**: Intégration directe dans les sections du site

## 🚀 Performance

- **Cache Redis**: Réduction de 90% des appels API Cloudinary
- **Optimisation auto**: Images compressées et redimensionnées
- **Lazy loading**: Chargement progressif des aperçus
- **CDN Cloudinary**: Distribution mondiale des images

## 🛡️ Sécurité

- **Validation serveur**: Types et tailles validés
- **Variables d'env**: Clés API protégées
- **Mode admin**: Contrôle d'accès via URL
- **Sanitization**: Nettoyage des entrées utilisateur

---

## Features

- ✅ Integration with **Tailwind CSS** supporting **Dark mode**.
- ✅ **Production-ready** scores in [Lighthouse](https://web.dev/measure/) and [PageSpeed Insights](https://pagespeed.web.dev/) reports.
- ✅ **Image optimization** and **Font optimization**.
- ✅ Fast and **SEO friendly blog**.
- ✅ Generation of **project sitemap** and **robots.txt** based on your routes.
- ✅ **Cloudinary + Redis** image management system
- ✅ **Real-time image upload** with drag & drop
- ✅ **Admin dashboard** for image management
- ✅ **Editable Hero section** with background upload

<br>

<img src="./screenshot.jpg" alt="Tailnext Theme Screenshot">

[![onWidget](https://custom-icon-badges.demolab.com/badge/made%20by%20-onWidget-556bf2?style=flat-square&logo=onwidget&logoColor=white&labelColor=101827)](https://onwidget.com)
[![License](https://img.shields.io/github/license/onwidget/tailnext?style=flat-square&color=dddddd&labelColor=000000)](https://github.com/onwidget/tailnext/blob/main/LICENSE.md)
[![Maintained](https://img.shields.io/badge/maintained%3F-yes-brightgreen.svg?style=flat-square)](https://github.com/onwidget)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/onwidget/tailnext#contributing)
[![Known Vulnerabilities](https://snyk.io/test/github/onwidget/tailnext/badge.svg?style=flat-square)](https://snyk.io/test/github/onwidget/tailnext)

<br>

<details open>
<summary>Table of Contents</summary>

- [Demo](#demo)
- [Getting started](#getting-started)
  - [Project structure](#project-structure)
  - [Commands](#commands)
  - [Configuration](#configuration)
  - [Deploy](#deploy)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

</details>

<br>

## Demo

📌 [https://tailnext.vercel.app/](https://tailnext.vercel.app/)

<br>

## Getting started

- Clone: `git clone https://github.com/onwidget/tailnext.git`
- Enter in the directory: `cd tailnext`
- Install dependencies: `npm install`
- Start the development server: `npm run dev`
- View project in local environment: `localhost:3000`

### Project structure

Inside **Tailnext** template, you'll see the following folders and files:

```
/
├── .storybook/
├── app/
│   ├── (blog)
│   │   ├── [slug]
|   |   |   └── page.js
|   |   └── blog
|   |       └── page.js
│   ├── head.js
│   ├── layout.js
│   └── page.js
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── images/
|   |   └── styles/
|   |       └── base.css
│   ├── components/
│   │   ├── atoms/
|   |   └── widgets/
|   |       ├── Header.astro
|   |       ├── Footer.astro
|   |       └── ...
│   │── content/
│   |   └── blog/
│   |       ├── demo-post-1.md
│   |       └── ...
│   ├── stories/
│   ├── utils/
│   └── config.mjs
├── package.json
└── ...
```

[![Edit Tailnext on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://githubbox.com/onwidget/tailnext/tree/main)

> **Seasoned next.js expert?** Delete this file. Update `config.mjs` and contents. Have fun!

<br>

### Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                       |
| :-------------------- | :------------------------------------------- |
| `npm install`         | Install dependencies                         |
| `npm run dev`         | Starts local dev server at `localhost:3000`  |
| `npm run build`       | Build your production site to `./dist/`      |
| `npm run preview`     | Preview your build locally, before deploying |
| `npm run storybook`   | Open storybook to view stories by widgets    |
| `npm run format`      | Format codes with Prettier                   |
| `npm run lint:eslint` | Run Eslint                                   |

<br>

### Configuration

Coming soon ..

<br>

### Deploy

#### Deploy to production (manual)

You can create an optimized production build with:

```shell
npm run build
```

Now, your website is ready to be deployed. All generated files are located at
`dist` folder, which you can deploy the folder to any hosting service you
prefer.

#### Deploy to Netlify

Clone this repository on own GitHub account and deploy to Netlify:

[![Netlify Deploy button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/onwidget/tailnext.git)

#### Deploy to Vercel

Clone this repository on own GitHub account and deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fonwidget%2Ftailnext)

<br>

## Roadmap

Coming soon ..

<br>

## Contributing

If you have any idea, suggestions or find any bugs, feel free to open a discussion, an issue or create a pull request.
That would be very useful for all of us and we would be happy to listen and take action.

## Acknowledgements

Initially created by [onWidget](https://onwidget.com) and maintained by a community of [contributors](https://github.com/onwidget/tailnext/graphs/contributors).

## License

**Tailnext** is licensed under the MIT license — see the [LICENSE](https://github.com/onwidget/tailnext/blob/main/LICENSE.md) file for details.
