# Cathy Ayurveda — site vitrine

Site React + Vite, pré-rendu en HTML statique. Le contenu éditorial vit dans
`data/content/*.json`.

## Démarrer

```bash
npm install
npm run dev        # serveur de développement
npm run build      # site de production dans dist/
npm run preview    # prévisualisation du build
npm run typecheck  # vérification TypeScript
npm run lint       # ESLint
```

`./run.sh` enchaîne installation, génération des médias et lancement.

## Formulaire de contact (Resend)

Le formulaire envoie un `POST` à `/api/contact`. Cette route est une fonction
Vercel définie dans `api/contact.ts` : elle valide les champs puis transmet le
message par [Resend](https://resend.com) à `cathyayurveda@gmail.com`.

La clé API n'est **jamais** exposée au navigateur : elle est lue uniquement
côté serveur, dans `process.env`.

### Déploiement sur Vercel

1. Créer une clé API sur <https://resend.com/api-keys>.
2. Choisir l'expéditeur. Resend n'autorise pas l'envoi depuis `@gmail.com` :
   il faut soit un domaine vérifié dans Resend (onglet **Domains**), soit
   l'adresse de test `onboarding@resend.dev`.
3. Dans le projet Vercel → **Settings → Environment Variables**, ajouter :
   - `Resend_key` : la clé `re_…` (obligatoire).
   - `CONTACT_FROM_EMAIL` : facultatif, expéditeur sur le domaine vérifié.
     Par défaut `Cathy Ayurveda <onboarding@resend.dev>`.
   - `email_contact` : facultatif, destinataire.
     Par défaut `cathyayurveda@gmail.com` (alias : `CONTACT_TO_EMAIL`).
4. Redéployer le site.

Avec l'expéditeur par défaut `onboarding@resend.dev`, Resend n'envoie qu'à
l'adresse e-mail du compte Resend. Si le compte est bien ouvert avec
`cathyayurveda@gmail.com`, le formulaire fonctionne immédiatement ; sinon,
vérifier `cathyayurveda.com` et définir `CONTACT_FROM_EMAIL` avec une adresse
de ce domaine (par exemple `Cathy Ayurveda <contact@cathyayurveda.com>`).

### Tester en local

`npm run dev` ne sert que le front : la route `/api/contact` n'existe pas.
Pour tester le formulaire de bout en bout, utiliser Vercel CLI, qui sert à la
fois Vite et la fonction :

```bash
cp .env.example .env   # renseigner Resend_key
npx vercel dev
```

Vercel CLI charge `.env` pour les fonctions. Le fichier `.env` est ignoré par
Git ; seul `.env.example` est versionné.
