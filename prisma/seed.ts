import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default whitelist questions
  const questions = [
    {
      question: 'Jak długo grasz w GTA V RP?',
      order: 1,
      active: true,
      required: true,
    },
    {
      question: 'Opisz swoją postać - imię, wiek, pochodzenie, historia',
      order: 2,
      active: true,
      required: true,
    },
    {
      question: 'Jakie masz doświadczenie z RolePlay? Opisz przykładową sytuację RP.',
      order: 3,
      active: true,
      required: true,
    },
    {
      question: 'Dlaczego chcesz dołączyć do InfinityGG?',
      order: 4,
      active: true,
      required: true,
    },
    {
      question: 'Czy przeczytałeś i akceptujesz regulamin serwera?',
      order: 5,
      active: true,
      required: true,
    },
  ];

  for (const q of questions) {
    await prisma.whitelistQuestion.upsert({
      where: { order: q.order },
      update: q,
      create: q,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
