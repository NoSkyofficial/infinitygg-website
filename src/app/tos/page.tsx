"use client";

import React from 'react';
import LegalLayout from '../components/LegalLayout';

interface LegalSection {
  id: string;
  title: string;
  content: string | React.ReactNode;
  subsections?: LegalSection[];
}

const TOSData: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: `By accessing and using the InfinityGG GTA V RolePlay server, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.

These Terms of Service constitute a legally binding agreement between you and InfinityGG. Your continued use of our services constitutes acceptance of any changes to these terms.`
  },
  {
    id: 'service-description',
    title: 'Service Description',
    content: `InfinityGG provides a private multiplayer gaming platform based on the FiveM modification for Grand Theft Auto V. The service includes access to game servers, Discord community, and related features.`,
    subsections: [
      {
        id: 'availability',
        title: 'Service Availability',
        content: `We strive to maintain 24/7 service availability but cannot guarantee uninterrupted access. Server maintenance, updates, or technical issues may temporarily affect availability.

We are not liable for any losses resulting from service downtime, including but not limited to lost gameplay progress, virtual items, or currency.`
      },
      {
        id: 'modifications',
        title: 'Service Modifications',
        content: `We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice. This includes game mechanics, rules, features, and server configuration.

We may add, remove, or alter features, content, or functionality. Such changes may affect your gameplay experience or previously purchased items.`
      }
    ]
  },
  {
    id: 'user-accounts',
    title: 'User Accounts and Responsibilities',
    content: `Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.`,
    subsections: [
      {
        id: 'account-security',
        title: 'Account Security',
        content: `You are responsible for safeguarding your account password and for any actions taken through your account.

You must notify us immediately of any unauthorized use of your account or any other security breach.

We are not liable for any loss or damage arising from your failure to maintain account security or from unauthorized access to your account.`
      },
      {
        id: 'prohibited-conduct',
        title: 'Prohibited Conduct',
        content: `Users must not engage in cheating, hacking, or use of unauthorized third-party software that provides unfair advantages.

Harassment, hate speech, discrimination, and toxic behavior towards other users are strictly prohibited.

Account sharing, trading, or selling is not allowed and may result in permanent suspension.

Exploiting bugs or glitches for personal gain is forbidden and must be reported to administration immediately.

Creating multiple accounts to circumvent bans or restrictions is prohibited.`
      }
    ]
  },
  {
    id: 'purchases',
    title: 'Purchases and Payments',
    content: `Some features or items may be available for purchase through our Tebex store. All purchases are subject to the following terms.`,
    subsections: [
      {
        id: 'payment-terms',
        title: 'Payment Terms',
        content: `All payments are processed securely through Tebex, a third-party payment processor.

Prices are displayed in the currency specified at checkout and may be subject to change.

Payment methods accepted are determined by Tebex payment processors and may vary by region.

You agree to provide accurate and complete payment information.`
      },
      {
        id: 'refunds',
        title: 'Refund Policy',
        content: `Digital items are generally non-refundable once delivered to your account.

Refunds may be granted at our sole discretion in cases of technical errors, duplicate purchases, or prolonged service unavailability.

To request a refund, contact our support team within 7 days of purchase with a valid reason and transaction details.

Chargebacks or payment disputes made without contacting us first may result in immediate account suspension.`
      }
    ]
  },
  {
    id: 'termination',
    title: 'Termination',
    content: `We reserve the right to terminate or suspend your access to the service at any time, with or without cause, and with or without notice.

Reasons for termination may include, but are not limited to, violation of these Terms, disruptive behavior, fraudulent activity, or at our sole discretion.

Upon termination, your right to use the service will immediately cease, and we may delete your account and associated data.

You may terminate your account at any time by contacting our support team, though no refunds will be provided for unused services or virtual items.`
  },
  {
    id: 'rockstar-disclaimer',
    title: 'Third-Party Disclaimer',
    content: `INFINITYGG IS NOT APPROVED, SPONSORED OR ENDORSED BY ROCKSTAR GAMES.

This is a fan-run server and is not affiliated with, endorsed by, or connected to Rockstar Games, Take-Two Interactive, or any of their subsidiaries or affiliates.

Grand Theft Auto V and all related marks and logos are trademarks or registered trademarks of Take-Two Interactive Software Inc. and Rockstar Games, Inc.

All trademarks, service marks, trade names, product names, logos, and trade dress of Rockstar Games and Take-Two Interactive appearing on the service are the property of their respective owners.

We do not claim any ownership over Rockstar Games' intellectual property and respect their rights.`
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Dispute Resolution',
    content: `These Terms shall be governed by and construed in accordance with the laws of Poland, without regard to its conflict of law provisions.

Any disputes arising from these Terms or your use of the service shall be resolved in the courts of Poland.

You agree to submit to the personal jurisdiction of such courts and waive any jurisdictional, venue, or inconvenient forum objections.`
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    content: `We reserve the right to modify these Terms at any time, at our sole discretion.

We will notify users of any material changes by posting the new Terms on our website and updating the "Last Updated" date.

Your continued use of the service after changes to these Terms constitutes acceptance of the modified Terms.

If you do not agree to the modified Terms, you must stop using the service immediately.`
  },
  {
    id: 'contact',
    title: 'Contact Information',
    content: `For questions about these Terms of Service, please contact us through:

Discord: https://discord.gg/infinitygg

Email: support@infinitygg.pl

We aim to respond to all inquiries within 48 hours during business days.`
  }
];

export default function TOSPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="October 21, 2024"
      sections={TOSData}
    />
  );
}
