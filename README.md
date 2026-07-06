# Norge - England tippekonkurranse

Nettside for kampkveld med innsending før kampstart, live poengtavle og adminstyrt fasit.

## Supabase

Kjor SQL-en i `supabase-schema.sql` i Supabase SQL Editor.

Appen bruker disse miljo variablene:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_CODE` valgfri, standard er `norge22`

Ikke legg `SUPABASE_SERVICE_ROLE_KEY` i klientkode eller del den offentlig.

## Vercel

1. Push prosjektet til GitHub.
2. Importer GitHub-repoet i Vercel.
3. Legg inn miljo variablene over under Project Settings -> Environment Variables.
4. Deploy.

## Lokalt

```bash
npm install
npm run dev
npm run build
```
