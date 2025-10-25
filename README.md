# InfinityGG - Full-Stack Admin System Update

## 🚀 Szybki Start

1. **Rozpakuj archiwum**
```bash
unzip infinitygg-update.zip
cd infinitygg-update
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Skonfiguruj zmienne środowiskowe**
```bash
cp .env.example .env
# Edytuj .env i uzupełnij wszystkie zmienne
```

4. **Skonfiguruj bazę danych**
```bash
# Uruchom PostgreSQL
npx prisma generate
npx prisma migrate dev --name init
```

5. **Uruchom projekt**
```bash
npm run dev
```

Aplikacja dostępna pod: http://localhost:3000

## 📁 Struktura Projektu

```
infinitygg-update/
├── prisma/
│   └── schema.prisma           # Schemat bazy danych
├── src/
│   ├── app/
│   │   ├── admin/              # Panel administratora
│   │   ├── whitelist/          # System whitelist
│   │   ├── auth/               # Autoryzacja
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # NextAuth endpoints
│   │   │   ├── admin/          # Admin API
│   │   │   └── whitelist/      # Whitelist API
│   │   └── ...                 # Pozostałe strony
│   ├── components/             # Komponenty React
│   └── lib/
│       ├── auth.ts             # Konfiguracja Auth.js
│       ├── prisma.ts           # Prisma Client
│       ├── permissions.ts      # System RBAC
│       └── discord.ts          # Discord API
├── .env.example                # Przykładowe zmienne środowiskowe
├── INSTALLATION.md             # Szczegółowa instrukcja instalacji
├── package.json
└── README.md                   # Ten plik
```

## ✨ Nowe Funkcje

### 1. Panel Administratora (`/admin`)
- Dashboard z statystykami
- Zarządzanie użytkownikami i rolami
- Whitelist Management
- Edycja pytań whitelist
- Edycja treści stron
- Ustawienia systemu
- Logi audytu

### 2. System Whitelist (`/whitelist`)
- Autologowanie przez Discord OAuth
- Formularz podania z dynamicznymi pytaniami
- Historia własnych podań
- Automatyczne powiadomienia Discord
- Nadawanie ról Discord po zaakceptowaniu

### 3. Edycja Regulaminu
- Tryb edytora WYSIWYG
- Wersjonowanie zmian
- Historia edycji

### 4. System Ról i Uprawnień (RBAC)
- **root** - Pełen dostęp
- **contentEditor** - Edycja treści
- **InfinityGG-Team** - Podstawowe funkcje admina
- **Whitelist Checker** - Zarządzanie whitelistą

### 5. Discord Integration
- OAuth2 login
- Webhooks dla powiadomień
- Automatyczne nadawanie/odbieranie ról
- Bot commands (opcjonalnie)

## 🔐 Zmienne Środowiskowe

Wszystkie wymagane zmienne znajdują się w `.env.example`. 
Najważniejsze:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Discord OAuth
DISCORD_CLIENT_ID="..."
DISCORD_CLIENT_SECRET="..."
DISCORD_BOT_TOKEN="..."

# Discord Webhooks & IDs
DISCORD_WEBHOOK_WHITELIST_APPROVED="..."
DISCORD_WEBHOOK_WHITELIST_REJECTED="..."
DISCORD_GUILD_ID="..."
DISCORD_WHITELIST_ROLE_ID="..."
```

## 📝 API Endpoints

### Publiczne
- `GET /api/config` - Pobierz konfigurację strony
- `GET /api/regulamin` - Pobierz regulamin
- `GET /api/admin/questions` - Pobierz pytania whitelist

### Autoryzowane (wymaga logowania)
- `GET /api/whitelist` - Pobierz swoje podania
- `POST /api/whitelist` - Wyślij nowe podanie

### Admin Only
- `GET /api/admin/whitelist` - Pobierz wszystkie podania
- `PATCH /api/whitelist/[id]/status` - Zmień status podania
- `POST /api/admin/questions` - Dodaj pytanie
- `GET /api/admin/stats` - Statystyki systemu

## 🛠️ Komendy

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Database
npx prisma generate        # Generuj Prisma Client
npx prisma migrate dev     # Uruchom migracje
npx prisma studio          # Otwórz Prisma Studio
npx prisma db seed         # Seed danych

# Linting
npm run lint
```

## 🚨 Pierwsze uruchomienie

1. Zaloguj się przez Discord
2. W bazie danych nadaj sobie rolę `root`:

```sql
UPDATE "AdminUser" 
SET role = 'root', 
    permissions = ARRAY['all']::text[]
WHERE "discordId" = 'TWOJE_DISCORD_ID';
```

3. Przejdź do `/admin` i skonfiguruj system

## 📚 Dokumentacja

Szczegółowa dokumentacja dostępna w:
- `INSTALLATION.md` - Pełna instrukcja instalacji i konfiguracji
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)

## 🐛 Troubleshooting

Zobacz sekcję Troubleshooting w `INSTALLATION.md`

## 📄 Licencja

Copyright © 2024 InfinityGG. Wszelkie prawa zastrzeżone.

---

**Zbudowane z ❤️ dla społeczności InfinityGG**
