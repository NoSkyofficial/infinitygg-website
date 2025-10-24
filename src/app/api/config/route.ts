import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// GET - fetch current config
export async function GET() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // Return default config if file doesn't exist
    return NextResponse.json({
      showProgressBar: true,
      progressValue: 65,
      progressLabel: 'Etap beta',
      showStatus: true,
      showFAQ: true,
      showShopRedirect: true,
      showBetaBadge: true,
      heroTitle: 'Witaj na InfinityGG',
      heroLead: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in gravida diam, eu eleifend magna. Ut tempus ultrices mi quis porta. Sed sollicitudin sem commodo, aliquam augue vitae, rutrum tortor.',
      faqs: [
        {
          id: '1',
          question: 'Jak dołączyć do serwera?',
          answer: 'Dołącz na nasz serwer Discord, zapoznaj się z regulaminem i wypełnij aplikację. Po zaakceptowaniu otrzymasz dostęp do serwera.'
        },
        {
          id: '2',
          question: 'Czy serwer jest darmowy?',
          answer: 'Tak, gra na serwerze jest całkowicie darmowa. W sklepie znajdziesz opcjonalne dodatki kosmetyczne, które wspierają rozwój projektu.'
        },
        {
          id: '3',
          question: 'Jakie są wymagania techniczne?',
          answer: 'Potrzebujesz oryginalnej kopii GTA V oraz FiveM. Zalecamy minimum 8GB RAM i stabilne połączenie internetowe.'
        },
        {
          id: '4',
          question: 'Czy mogę grać z konsoli?',
          answer: 'Nie, serwer wymaga PC z systemem Windows oraz FiveM. Konsole nie są wspierane.'
        }
      ],
      socialLinks: {
        discord: true,
        twitter: true,
        youtube: true
      }
    });
  }
}

// POST - update config (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Simple authentication check - in production use proper auth
    const authHeader = request.headers.get('authorization');
    const adminPassHash = process.env.NEXT_PUBLIC_ADMIN_PASS_HASH || '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
    
    if (!authHeader || authHeader !== `Bearer ${adminPassHash}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await request.json();
    await ensureDataDir();
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}
