# InfinityGG - Instrukcja Instalacji i Konfiguracji

## 📋 Spis treści
1. [Wymagania](#wymagania)
2. [Instalacja](#instalacja)
3. [Konfiguracja](#konfiguracja)
4. [Baza danych](#baza-danych)
5. [Uruchomienie](#uruchomienie)
6. [Discord OAuth Setup](#discord-oauth-setup)
7. [Zmienne środowiskowe](#zmienne-środowiskowe)
8. [Role i uprawnienia](#role-i-uprawnienia)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Wymagania

### Wymagane
- **Node.js** 20.x lub wyższy
- **npm** lub **yarn** lub **pnpm**
- **PostgreSQL** 14+ (lub MySQL 8+)
- **Discord Application** (dla OAuth)

### Opcjonalne
- **Docker** (dla łatwiejszej konfiguracji bazy)
- **Git** (do klonowania repozytorium)

---

## 📦 Instalacja

### 1. Rozpakuj projekt
```bash
# Jeśli pobrano jako .zip
unzip infinitygg-update.zip
cd infinitygg-update

# Lub sklonuj z repo
git clone <repository-url>
cd infinitygg
```

### 2. Zainstaluj zależności
```bash
npm install
# lub
yarn install
# lub
pnpm install
```

---

## ⚙️ Konfiguracja

### 1. Utwórz plik `.env`
```bash
cp .env.example .env
```

### 2. Skonfiguruj zmienne środowiskowe

Otwórz plik `.env` i uzupełnij:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/infinitygg"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="wygeneruj-losowy-string-min-32-znaki"

# Discord OAuth
DISCORD_CLIENT_ID="twoje_discord_client_id"
DISCORD_CLIENT_SECRET="twoje_discord_client_secret"
DISCORD_BOT_TOKEN="twoje_discord_bot_token"

# Discord Webhooks
DISCORD_WEBHOOK_WHITELIST_APPROVED="https://discord.com/api/webhooks/..."
DISCORD_WEBHOOK_WHITELIST_REJECTED="https://discord.com/api/webhooks/..."

# Discord Guild & Role IDs
DISCORD_GUILD_ID="id_twojego_serwera_discord"
DISCORD_WHITELIST_ROLE_ID="id_roli_whitelist"

# Admin
ADMIN_PASS_HASH="240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"
# To jest hash dla hasła "admin" - ZMIEŃ TO!

# Server Status (opcjonalne)
CFTOOLS_SERVER_ID="twoje_cftools_id"
CFTOOLS_API_KEY="twoje_cftools_api_key"
```

### Generowanie NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### Generowanie ADMIN_PASS_HASH
```bash
# W przeglądarce wykonaj:
# echo -n "twoje_haslo" | sha256sum
# Lub użyj Node.js:
node -e "console.log(require('crypto').createHash('sha256').update('twoje_haslo').digest('hex'))"
```

---

## 🗄️ Baza danych

### Opcja 1: PostgreSQL lokalnie

#### Instalacja PostgreSQL (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Tworzenie bazy danych
```bash
sudo -u postgres psql
```

W PostgreSQL:
```sql
CREATE DATABASE infinitygg;
CREATE USER infinitygg_user WITH PASSWORD 'bezpieczne_haslo';
GRANT ALL PRIVILEGES ON DATABASE infinitygg TO infinitygg_user;
\q
```

### Opcja 2: Docker (zalecane)

Utwórz `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: infinitygg_db
    environment:
      POSTGRES_DB: infinitygg
      POSTGRES_USER: infinitygg_user
      POSTGRES_PASSWORD: bezpieczne_haslo
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Uruchom:
```bash
docker-compose up -d
```

### Migracja Prisma

Po skonfigurowaniu bazy:
```bash
# Wygeneruj Prisma Client
npx prisma generate

# Uruchom migracje
npx prisma migrate dev --name init

# (Opcjonalnie) Otwórz Prisma Studio do przeglądania danych
npx prisma studio
```

---

## 🚀 Uruchomienie

### Tryb deweloperski
```bash
npm run dev
# lub
yarn dev
# lub
pnpm dev
```

Aplikacja dostępna pod: `http://localhost:3000`

### Tryb produkcyjny
```bash
# Zbuduj aplikację
npm run build

# Uruchom
npm run start
```

---

## 🔐 Discord OAuth Setup

### 1. Utwórz Discord Application

1. Idź do [Discord Developer Portal](https://discord.com/developers/applications)
2. Kliknij **"New Application"**
3. Nazwij aplikację (np. "InfinityGG Auth")
4. Zapisz **Application ID** (to będzie `DISCORD_CLIENT_ID`)

### 2. Skonfiguruj OAuth2

1. W panelu aplikacji, wybierz **OAuth2** → **General**
2. Kliknij **"Reset Secret"** i zapisz **Client Secret** (`DISCORD_CLIENT_SECRET`)
3. Dodaj **Redirect URL**: `http://localhost:3000/api/auth/callback/discord`
4. W produkcji dodaj też: `https://twoja-domena.pl/api/auth/callback/discord`

### 3. Dodaj Discord Bota

1. Wybierz **Bot** w menu
2. Kliknij **"Reset Token"** i zapisz **Bot Token** (`DISCORD_BOT_TOKEN`)
3. Włącz następujące **Privileged Gateway Intents**:
   - Server Members Intent
   - Message Content Intent (jeśli planujesz komendy)
4. W **Bot Permissions** zaznacz:
   - Manage Roles
   - Send Messages
   - View Channels

### 4. Zaproś bota na serwer

URL zaproszenia:
```
https://discord.com/api/oauth2/authorize?client_id=TWOJE_CLIENT_ID&permissions=268435456&scope=bot
```

Zastąp `TWOJE_CLIENT_ID` swoim Application ID.

### 5. Pobierz ID serwera i roli

1. Włącz **Developer Mode** w Discord (Ustawienia → Zaawansowane → Tryb dewelopera)
2. Kliknij prawym na nazwę serwera → **Kopiuj ID serwera** (`DISCORD_GUILD_ID`)
3. Kliknij prawym na rolę Whitelist → **Kopiuj ID** (`DISCORD_WHITELIST_ROLE_ID`)

### 6. Utwórz Webhooki

1. Wybierz kanał dla powiadomień whitelist
2. Ustawienia kanału → Integracje → Webhooki → Nowy Webhook
3. Skopiuj URL webhooka i dodaj do `.env`
4. Utwórz osobne webhooki dla zaakceptowanych i odrzuconych podań

---

## 👥 Role i uprawnienia

System posiada następujące role:

### Role podstawowe
- **root** - Pełen dostęp do wszystkich funkcji
- **contentEditor** - Edycja treści (regulamin, FAQ, strony)
- **InfinityGG-Team** - Dostęp do panelu admina, podstawowe funkcje
- **Whitelist Checker** - Zarządzanie podaniami whitelist

### Uprawnienia szczegółowe
- `edit_regulations` - Edycja regulaminu
- `edit_content` - Edycja treści stron
- `manage_users` - Zarządzanie użytkownikami
- `manage_whitelist` - Zarządzanie whitelistą
- `view_audit_logs` - Dostęp do logów audytu
- `manage_system` - Zarządzanie ustawieniami systemu

### Pierwsze uruchomienie - dodanie root admina

Po zalogowaniu pierwszego użytkownika przez Discord, ręcznie nadaj mu rolę root w bazie:

```sql
-- Znajdź ID użytkownika
SELECT * FROM "AdminUser" WHERE "discordId" = 'TWOJE_DISCORD_ID';

-- Nadaj rolę root
UPDATE "AdminUser" 
SET role = 'root', 
    permissions = ARRAY['all']::text[]
WHERE "discordId" = 'TWOJE_DISCORD_ID';
```

Lub przez Prisma Studio:
```bash
npx prisma studio
```

---

## 🔄 Migracje i aktualizacje

### Aktualizacja schematu Prisma
```bash
# Po zmianach w schema.prisma
npx prisma migrate dev --name nazwa_migracji

# Reset bazy (usuwa wszystkie dane!)
npx prisma migrate reset
```

### Seed danych (opcjonalnie)
Utwórz plik `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Dodaj domyślne pytania whitelist
  await prisma.whitelistQuestion.createMany({
    data: [
      { question: 'Jak długo grasz w GTA V RP?', order: 1, active: true },
      { question: 'Opisz swoją postać i jej historię', order: 2, active: true },
      // ...więcej pytań
    ]
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

Uruchom:
```bash
npx prisma db seed
```

---

## 🐛 Troubleshooting

### Problem: "Error connecting to database"
- Sprawdź `DATABASE_URL` w `.env`
- Upewnij się, że PostgreSQL działa: `sudo systemctl status postgresql`
- Sprawdź czy możesz się połączyć: `psql -U infinitygg_user -d infinitygg`

### Problem: "Discord OAuth not working"
- Sprawdź czy `NEXTAUTH_URL` jest poprawny
- Upewnij się, że redirect URL w Discord Developer Portal jest dokładnie taki sam
- Sprawdź czy `DISCORD_CLIENT_ID` i `DISCORD_CLIENT_SECRET` są poprawne

### Problem: "Bot can't assign roles"
- Upewnij się, że rola bota jest wyżej niż rola którą próbuje nadać
- Sprawdź uprawnienia bota w ustawieniach serwera Discord
- Zweryfikuj `DISCORD_BOT_TOKEN`

### Problem: "Prisma migration failed"
```bash
# Reset bazy i migracji
npx prisma migrate reset

# Lub ręcznie usuń folder migrations i ponów
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

### Problem: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Czyszczenie cache Next.js
```bash
rm -rf .next
npm run dev
```

---

## 📚 Dodatkowe zasoby

### Dokumentacja
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Discord API Docs](https://discord.com/developers/docs)

### Struktura projektu
```
infinitygg-update/
├── prisma/
│   ├── schema.prisma      # Schemat bazy danych
│   └── migrations/        # Migracje
├── src/
│   ├── app/
│   │   ├── admin/         # Panel administratora
│   │   ├── whitelist/     # System whitelist
│   │   ├── api/           # API routes
│   │   └── ...
│   ├── components/        # Komponenty React
│   ├── lib/
│   │   ├── auth.ts        # Konfiguracja Auth.js
│   │   ├── prisma.ts      # Prisma Client
│   │   ├── permissions.ts # System RBAC
│   │   └── discord.ts     # Discord API utils
│   └── types/             # TypeScript types
├── public/                # Pliki statyczne
├── .env                   # Zmienne środowiskowe
├── package.json
└── INSTALLATION.md        # Ten plik
```

---

## 🎯 Następne kroki po instalacji

1. ✅ Zaloguj się przez Discord
2. ✅ Nadaj sobie rolę `root` w bazie danych
3. ✅ Przejdź do `/admin` i skonfiguruj system
4. ✅ Dodaj pytania whitelist w panelu
5. ✅ Skonfiguruj webhooki Discord
6. ✅ Przetestuj proces aplikacji whitelist
7. ✅ Dostosuj regulamin i FAQ
8. ✅ Zaproś pozostałych adminów

---

## 📞 Pomoc i wsparcie

W razie problemów:
- Discord: https://discord.gg/infinitygg
- Email: support@infinitygg.pl
- GitHub Issues: (jeśli projekt na GitHub)

---

## 📝 Changelog

### v2.0.0 - Aktualizacja administracyjna
- ✨ Dodano panel administratora z pełnym RBAC
- ✨ Dodano system whitelist z Discord integration
- ✨ Dodano edytor regulaminu z wersjonowaniem
- ✨ Dodano zarządzanie użytkownikami i rolami
- ✨ Dodano logi audytu
- ✨ Dodano tryb maintenance
- 🔧 Aktualizacja do Next.js 15
- 🔧 Dodanie Prisma ORM
- 🔧 Integracja Auth.js (Discord OAuth)

---

**Powodzenia z projektem InfinityGG! 🚀**
