"use client";

import React from 'react';
import LegalLayout from '../components/LegalLayout';

interface LegalSection {
  id: string;
  title: string;
  content: string | React.ReactNode;
  subsections?: LegalSection[];
}

const PrivacyData: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: `InfinityGG ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our GTA V RolePlay server and related services.

Please read this Privacy Policy carefully. By using our services, you consent to the data practices described in this policy.`
  },
  {
    id: 'information-collection',
    title: 'Information We Collect',
    content: `We collect several types of information from and about users of our service.`,
    subsections: [
      {
        id: 'personal-info',
        title: 'Personal Information',
        content: `We may collect: Discord username and user ID, email address (if provided), in-game username and character information, IP address and general location data for security purposes.`
      },
      {
        id: 'gameplay-data',
        title: 'Gameplay Data',
        content: `Character progress and statistics, in-game actions and interactions, chat logs for moderation purposes, purchase history and transaction records.`
      }
    ]
  },
  {
    id: 'use-of-information',
    title: 'How We Use Your Information',
    content: `We use collected information to provide and maintain our gaming service, process transactions, provide customer support, detect and prevent cheating and abuse, and comply with legal obligations.`
  },
  {
    id: 'data-sharing',
    title: 'Information Sharing',
    content: `We do not sell your personal information. We may share information with trusted service providers (Tebex for payments, Discord for community) and when required by law.`
  },
  {
    id: 'security',
    title: 'Data Security',
    content: `We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the Internet is 100% secure.`
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: `You have the right to access, correct, or delete your personal data. Contact us through Discord or email to exercise these rights.`
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    content: `Our service is intended for users aged 16 and older. We do not knowingly collect information from children under 16.`
  },
  {
    id: 'contact-privacy',
    title: 'Contact Us',
    content: `If you have questions about this Privacy Policy, contact us through Discord: https://discord.gg/infinitygg or Email: privacy@infinitygg.pl`
  }
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="October 21, 2024"
      sections={PrivacyData}
    />
  );
}
