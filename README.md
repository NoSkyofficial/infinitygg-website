# InfinityGG - strona, system whitelist i panel administratora

Aplikacja webowa dla serwera FiveM RP **InfinityGG**. Zawiera stronę publiczną z regulaminem i dokumentami, system podań na whitelistę z logowaniem przez Discord oraz panel administratora z uprawnieniami opartymi o role.

## Stack

- Next.js 15.5 (App Router), React 19, TypeScript
- Prisma 5 z bazą PostgreSQL
- Auth.js (next-auth 5 beta) z providerem Discord
- Tailwind CSS 4, TipTap (edytor regulaminu), Zod (walidacja), axios (Discord API)

## Funkcje

### Strona publiczna
- `/` - strona główna (sekcje: hero, wartości, FAQ, stopka)
- `/regulamin` - regulamin pobierany z API (`/api/regulations/public`)
- `/tos` i `/privacy` - warunki korzystania i polityka prywatności
- `/wip` - strona zastępcza („W trakcie tworzenia”)

### System whitelist (`/whitelist`)
- Logowanie przez Discord (zakresy: `identify`, `email`, `guilds`, `guilds.members.read`)
- Formularz podania z pytaniami z bazy (model `WhitelistQuestion`; typy pytań: TEXT, TEXTAREA, NUMBER, SELECT)
- Historia własnych podań
- Jedno aktywne podanie naraz (statusy `SENT` i `IN_REVIEW`)

### Panel administratora (`/admin`)
- Dashboard ze statystykami (`/api/admin/stats`)
- Użytkownicy: zmiana roli, dodatkowych uprawnień i statusu aktywności, usuwanie
- Podania: lista z filtrowaniem po statusie, zmiana statusu (`IN_REVIEW`, `APPROVED`, `REJECTED` z powodem)
- Pytania do whitelisty: dodawanie, edycja, usuwanie, zmiana kolejności
- Regulamin: edycja, historia wersji, porównanie wersji i przywracanie wersji
- Logi audytu zapisywane przy operacjach administracyjnych (tabela `audit_logs`)
- Ustawienia: formularz zapisujący wartości w tabeli `system_settings`

### Role i uprawnienia (`src/lib/permissions.ts`)

| Rola | Uprawnienia |
|---|---|
| `root` | wszystkie (`all`) |
| `contentEditor` | `edit_regulations`, `edit_content`, `view_audit_logs` |
| `InfinityGG_Team` | `view_audit_logs`, `view_applications` |
| `Whitelist_Checker` | `view_applications`, `review_applications`, `manage_whitelist` |

Nowe konto (po pierwszym logowaniu przez Discord) otrzymuje rolę `InfinityGG_Team`. Dodatkowe uprawnienia zapisane w polu `permissions` działają obok roli.

### Integracja z Discordem (`src/lib/discord.ts`)
- Akceptacja podania: nadanie roli whitelisty na serwerze i powiadomienie przez webhook
- Odrzucenie podania: powiadomienie przez webhook (rola nie jest odbierana)

## Struktura katalogów

```
src/
  app/            strony i API (App Router)
    admin/        panel administratora
    api/          route handlers: auth, admin, regulations, whitelist
    whitelist/    formularz podania
    auth/         strony logowania i błędu
  components/     komponenty UI (edytor, porównanie wersji, ...)
  lib/            auth.ts, prisma.ts, permissions.ts, discord.ts
  middleware.ts   ochrona ścieżek /admin i /whitelist
prisma/
  schema.prisma   schemat bazy danych
  seed.ts         dane startowe (pytania whitelisty)
docker-compose.yml  PostgreSQL 16 do uruchomienia lokalnie
```

## Wymagania

- Node.js 20 lub nowszy
- PostgreSQL 14+ (lub Docker, z `docker-compose.yml`)
- Aplikacja Discord z OAuth2 oraz bot na serwerze (szczegóły w `INSTALLATION.md`)

## Uruchomienie lokalne

```bash
git clone https://github.com/NoSkyofficial/infinitygg-website.git
cd infinitygg-website
npm install
cp .env.example .env
# uzupełnij wartości w .env
docker compose up -d        # opcjonalnie: PostgreSQL z docker-compose.yml
npx prisma migrate dev --name init
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

## Zmienne środowiskowe

Lista zgodna z `.env.example`:

| Zmienna | Używana w | Opis |
|---|---|---|
| `DATABASE_URL` | `prisma/schema.prisma` | Adres połączenia z PostgreSQL |
| `NEXTAUTH_SECRET` | Auth.js | Sekret do podpisywania sesji |
| `NEXTAUTH_URL` | Auth.js | Publiczny adres aplikacji |
| `DISCORD_CLIENT_ID` | `src/lib/auth.ts` | ID aplikacji Discord (OAuth2) |
| `DISCORD_CLIENT_SECRET` | `src/lib/auth.ts` | Sekret aplikacji Discord (OAuth2) |
| `DISCORD_BOT_TOKEN` | `src/lib/discord.ts` | Token bota do nadawania ról |
| `DISCORD_GUILD_ID` | `src/lib/discord.ts` | ID serwera Discord |
| `DISCORD_WHITELIST_ROLE_ID` | `src/lib/discord.ts` | ID roli whitelisty |
| `DISCORD_WEBHOOK_WHITELIST_APPROVED` | `src/lib/discord.ts` | Webhook dla zaakceptowanych podań |
| `DISCORD_WEBHOOK_WHITELIST_REJECTED` | `src/lib/discord.ts` | Webhook dla odrzuconych podań |

## Pierwsze uruchomienie

1. Uruchom aplikację i zaloguj się przez Discord (`http://localhost:3000/auth/signin`). Przy pierwszym logowaniu tworzony jest rekord w tabeli `admin_users` z rolą `InfinityGG_Team`.
2. Nadaj sobie rolę `root` w bazie danych:

```sql
UPDATE admin_users
SET role = 'root',
    permissions = ARRAY['all']::text[]
WHERE "discordId" = 'TWOJE_DISCORD_ID';
```

3. Wejdź na `http://localhost:3000/admin`.

## Skrypty npm

| Skrypt | Działanie |
|---|---|
| `npm run dev` | serwer deweloperski (Turbopack) |
| `npm run build` | build produkcyjny |
| `npm run start` | uruchomienie zbudowanej aplikacji |
| `npm run lint` | lint (`next lint`) |
| `npm run db:push` | synchronizacja schematu z bazą |
| `npm run db:migrate` | migracje Prisma (`migrate dev`) |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | dane startowe (`prisma/seed.ts`, uruchamiane przez `tsx`) |

## Dokumentacja

- `INSTALLATION.md` - szczegółowa instalacja, konfiguracja Discord OAuth i rozwiązywanie problemów

## Licencja

Copyright © 2025 InfinityGG. Wszelkie prawa zastrzeżone.
