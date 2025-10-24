import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const REGULAMIN_FILE = path.join(process.cwd(), 'data', 'regulamin.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

const defaultRegulamin = [
  {
    id: 'postanowienia-ogolne',
    title: 'Postanowienia ogólne',
    content: `Niniejszy regulamin określa zasady korzystania z serwera GTA V RolePlay prowadzonego przez InfinityGG. Poprzez dołączenie do serwera, użytkownik akceptuje wszystkie postanowienia regulaminu.

Serwer InfinityGG to prywatna platforma rozrywkowa oparta na modyfikacji FiveM dla gry Grand Theft Auto V. Administratorzy zastrzegają sobie prawo do wprowadzania zmian w regulaminie bez wcześniejszego powiadomienia.`,
    subsections: [
      {
        id: 'definicje',
        title: 'Definicje',
        content: `Serwer - platforma multiplayer GTA V RolePlay zarządzana przez InfinityGG.

Użytkownik/Gracz - osoba korzystająca z serwera InfinityGG.

RolePlay (RP) - sposób gry polegający na wcielaniu się w rolę postaci i odgrywaniu jej w świecie gry.

Discord - oficjalny serwer komunikacyjny społeczności InfinityGG.

Administracja - osoby zarządzające serwerem i egzekwujące regulamin.`
      },
      {
        id: 'wymagania',
        title: 'Wymagania',
        content: `Gracz musi posiadać oryginalną kopię gry Grand Theft Auto V oraz zainstalowany FiveM.

Wymagany jest sprawny mikrofon i używanie komunikacji głosowej.

Gracz musi mieć ukończone 16 lat lub posiadać zgodę opiekuna prawnego.

Obowiązuje znajomość języka polskiego w stopniu umożliwiającym prawidłową komunikację.`
      }
    ]
  },
  {
    id: 'zasady-roleplay',
    title: 'Zasady RolePlay',
    content: `Wszelkie działania na serwerze muszą być wykonywane zgodnie z zasadami RolePlay. Niedozwolone jest łamanie immersji oraz działanie poza charakterem postaci (Out of Character - OOC).`,
    subsections: [
      {
        id: 'podstawy-rp',
        title: 'Podstawy RolePlay',
        content: `Gracz zobowiązany jest do odgrywania swojej postaci w sposób realistyczny i zgodny z logiką świata przedstawionego.

Zabronione jest wykorzystywanie informacji zdobytych poza grą (metagaming).

Niedozwolone jest powracanie do miejsca własnej śmierci i kontynuowanie akcji (New Life Rule).

Gracz nie może zakłócać rozgrywki innych osób poprzez działania niezgodne z RP.`
      },
      {
        id: 'komunikacja',
        title: 'Komunikacja',
        content: `Komunikacja głosowa musi być używana w sposób realistyczny - głośność odpowiednia do sytuacji.

Zabronione jest używanie slangu internetowego, współczesnych memów czy odniesień do rzeczywistości w sposób łamiący immersję.

W sytuacjach konfliktowych należy zachować spokój i rozwiązywać sprawy w grze, nie poza nią.`
      },
      {
        id: 'interakcje',
        title: 'Interakcje z innymi graczami',
        content: `Należy dać drugiej stronie możliwość odegrania sytuacji - unikać forsowania akcji.

Przed rozpoczęciem akcji przestępczych należy upewnić się, że druga strona ma możliwość reakcji.

Akcje muszą być logicznie uzasadnione w ramach postaci.

Zabronione jest zabijanie bez odpowiedniego powodu (Random Deathmatch - RDM).

Zabronione jest używanie pojazdów jako broni (Vehicle Deathmatch - VDM).`
      }
    ]
  },
  {
    id: 'zakazy',
    title: 'Zakazy i ograniczenia',
    content: `Na serwerze obowiązują surowe zasady dotyczące niedozwolonych zachowań. Ich łamanie skutkuje konsekwencjami od ostrzeżenia po permanentny ban.`,
    subsections: [
      {
        id: 'cheating',
        title: 'Cheating i exploity',
        content: `Całkowicie zakazane jest używanie cheats, modów dających przewagę, exploitów oraz bugów gry.

Niedozwolone jest powielanie przedmiotów, pieniędzy czy wykorzystywanie błędów serwera.

Gracz zobowiązany jest do zgłaszania znalezionych błędów administracji.`
      },
      {
        id: 'toksycznosc',
        title: 'Toksyczne zachowanie',
        content: `Zabronione jest obrażanie, nękanie, dyskryminacja ze względu na płeć, rasę, religię, orientację seksualną.

Niedozwolone jest trollowanie, griefowanie oraz celowe zakłócanie rozgrywki innych graczy.

Należy zachować kulturę i szacunek wobec innych członków społeczności.`
      },
      {
        id: 'multikonta',
        title: 'Multikonta i współdzielenie kont',
        content: `Jeden gracz może posiadać tylko jedno aktywne konto na serwerze.

Zabronione jest użyczanie konta innym osobom.

Transfer środków między własnymi postaciami wymaga zgody administracji.`
      }
    ]
  },
  {
    id: 'system-karalnosci',
    title: 'System kar i odwołania',
    content: `Administracja stosuje gradację kar w zależności od wagi przewinienia.`,
    subsections: [
      {
        id: 'rodzaje-kar',
        title: 'Rodzaje kar',
        content: `Ostrzeżenie (warn) - pierwsze przewinienie lub mniejsze wykroczenie.

Kick - wyrzucenie z serwera jako poważniejsze ostrzeżenie.

Ban czasowy - od 1 dnia do 30 dni w zależności od przewinienia.

Ban permanentny - za poważne wykroczenia, cheating, recydywę.`
      },
      {
        id: 'odwolania',
        title: 'Odwołania',
        content: `Gracz ma prawo do odwołania się od kary poprzez ticket na Discordzie.

Odwołanie musi zawierać szczegółowy opis sytuacji i własne stanowisko.

Decyzja administracji po rozpatrzeniu odwołania jest ostateczna.

Spamowanie odwołaniami może skutkować przedłużeniem lub zaostrzeniem kary.`
      }
    ]
  },
  {
    id: 'postanowienia-koncowe',
    title: 'Postanowienia końcowe',
    content: `Administracja zastrzega sobie prawo do wprowadzania zmian w regulaminie bez wcześniejszego powiadomienia, nadawania kar nieobjętych regulaminem w wyjątkowych sytuacjach, zamknięcia dostępu do serwera bez podania przyczyny oraz usuwania postaci, przedmiotów czy pieniędzy w przypadku wykrycia nieprawidłowości.

Niewiedza nie zwalnia z odpowiedzialności. Każdy gracz zobowiązany jest do zapoznania się z regulaminem przed rozpoczęciem gry.

W sprawach nieujętych w regulaminie decyduje zdrowy rozsądek oraz decyzja administracji.`
  }
];

// GET - fetch current regulamin
export async function GET() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(REGULAMIN_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // Return default regulamin if file doesn't exist
    return NextResponse.json(defaultRegulamin);
  }
}

// POST - update regulamin (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Simple authentication check - in production use proper auth
    const authHeader = request.headers.get('authorization');
    const adminPassHash = process.env.NEXT_PUBLIC_ADMIN_PASS_HASH || '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
    
    if (!authHeader || authHeader !== `Bearer ${adminPassHash}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const regulamin = await request.json();
    await ensureDataDir();
    await fs.writeFile(REGULAMIN_FILE, JSON.stringify(regulamin, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving regulamin:', error);
    return NextResponse.json({ error: 'Failed to save regulamin' }, { status: 500 });
  }
}
