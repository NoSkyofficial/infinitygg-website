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

Please read this Privacy Policy carefully. By using our services, you consent to the data practices described in this policy. If you do not agree with this policy, please discontinue use of our services.`
  },
  {
    id: 'information-collection',
    title: 'Information We Collect',
    content: `We collect several types of information from and about users of our service to provide and improve our gaming experience.`,
    subsections: [
      {
        id: 'personal-info',
        title: 'Personal Information',
        content: `We may collect the following personal information:

Discord username and user ID when you join our community server

Email address if voluntarily provided for account recovery or notifications

In-game username and character information you create

Payment information processed through Tebex (we do not store credit card details)

IP address and general location data for security and server connection purposes

Device information including hardware specifications and operating system`
      },
      {
        id: 'gameplay-data',
        title: 'Gameplay Data',
        content: `To provide our gaming services, we collect:

Character progress, statistics, and achievements

In-game actions, interactions, and gameplay history

Chat logs and voice communications for moderation and security purposes

Purchase history and transaction records

Server connection logs and session durations

Reported incidents and support tickets`
      },
      {
        id: 'technical-data',
        title: 'Technical and Usage Data',
        content: `We automatically collect certain technical information:

FiveM client identifiers and license keys

Connection logs, timestamps, and server performance metrics

Error reports, crash data, and debug information

Browser type and version when accessing our website

Pages visited, time spent, and navigation patterns

Referral sources and exit pages`
      }
    ]
  },
  {
    id: 'use-of-information',
    title: 'How We Use Your Information',
    content: `We use the collected information for various legitimate purposes to operate and improve our services.`,
    subsections: [
      {
        id: 'service-provision',
        title: 'Service Provision and Management',
        content: `We use your information to:

Provide and maintain our gaming service and features

Manage user accounts, authentication, and access control

Process transactions and deliver purchased items or benefits

Save game progress, character data, and user preferences

Facilitate communication between players and staff

Provide customer support and respond to inquiries`
      },
      {
        id: 'improvement',
        title: 'Service Improvement and Development',
        content: `Your information helps us:

Analyze usage patterns and player behavior to enhance gameplay

Identify and fix bugs, glitches, and technical issues

Develop new features, content, and game mechanics

Optimize server performance and reduce lag

Conduct internal research and analytics

Test new features with selected user groups`
      },
      {
        id: 'safety',
        title: 'Safety, Security, and Compliance',
        content: `We process data to:

Detect and prevent cheating, hacking, and abuse

Enforce our Terms of Service, rules, and community guidelines

Investigate reports of misconduct or policy violations

Protect against fraud, unauthorized access, and security threats

Maintain logs for accountability and dispute resolution

Comply with legal obligations and law enforcement requests`
      }
    ]
  },
  {
    id: 'data-sharing',
    title: 'Information Sharing and Disclosure',
    content: `We respect your privacy and do not sell your personal information to third parties. We may share your information only in the limited circumstances described below.`,
    subsections: [
      {
        id: 'service-providers',
        title: 'Third-Party Service Providers',
        content: `We share information with trusted service providers who assist us:

Tebex for secure payment processing and transaction management

Discord for community management and communication

Server hosting providers for infrastructure and data storage

Analytics services for usage statistics and performance monitoring

Content delivery networks (CDNs) for website optimization

These providers are contractually obligated to protect your information and use it only for specified purposes.`
      },
      {
        id: 'legal-requirements',
        title: 'Legal and Safety Requirements',
        content: `We may disclose your information when required or permitted by law:

To comply with legal obligations, court orders, or subpoenas

To respond to lawful requests from law enforcement or government authorities

To protect our rights, property, safety, or that of our users

To investigate fraud, security breaches, or violations of our terms

To prevent harm, illegal activity, or imminent threats

In connection with legal proceedings or investigations`
      }
    ]
  },
  {
    id: 'data-retention',
    title: 'Data Retention and Deletion',
    content: `We retain your personal information only for as long as necessary to fulfill the purposes described in this policy and comply with legal obligations.`,
    subsections: [
      {
        id: 'active-accounts',
        title: 'Active Account Data',
        content: `While your account is active, we retain:

Account information, character data, and gameplay history

Purchase records and transaction history

Support tickets and communication records

Security logs and access history

This data is retained to provide continuous service and maintain your gaming experience.`
      },
      {
        id: 'deleted-accounts',
        title: 'Account Deletion',
        content: `Upon your request to delete your account:

Most personal data is removed within 30 days

Some information may be retained for legal, security, or operational reasons

Chat logs and moderation records may be retained for up to 2 years

Anonymized data may be retained for analytics purposes

Purchase records are kept for legal and tax compliance (typically 7 years)`
      }
    ]
  },
  {
    id: 'security',
    title: 'Data Security Measures',
    content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.`,
    subsections: [
      {
        id: 'security-measures',
        title: 'Security Practices',
        content: `Our security measures include:

Encrypted connections using SSL/TLS protocols

Secure server infrastructure with firewalls and intrusion detection

Access controls limiting staff access to user data on a need-to-know basis

Regular security audits and vulnerability assessments

Secure backup systems for data recovery

Password hashing and encryption for stored credentials

Monitoring for suspicious activity and unauthorized access attempts`
      },
      {
        id: 'limitations',
        title: 'Security Limitations',
        content: `While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure.

We cannot guarantee absolute security of your data. You acknowledge and accept the inherent risks of online communication and data storage.

You are responsible for maintaining the confidentiality of your account credentials and for any activities occurring under your account.

Notify us immediately if you suspect unauthorized access to your account.`
      }
    ]
  },
  {
    id: 'your-rights',
    title: 'Your Privacy Rights and Choices',
    content: `You have certain rights regarding your personal information, subject to local data protection laws.`,
    subsections: [
      {
        id: 'access',
        title: 'Access and Correction',
        content: `You have the right to:

Request access to the personal data we hold about you

Receive a copy of your data in a structured, machine-readable format

Request corrections to inaccurate or incomplete information

Update your account information through our service or support team

We will respond to access requests within 30 days and may require identity verification.`
      },
      {
        id: 'deletion',
        title: 'Deletion and Erasure',
        content: `You may request deletion of your personal data by:

Contacting our support team through Discord or email

Submitting a deletion request through your account settings

We will comply with valid deletion requests within 30 days, subject to legal retention requirements.

Some information may be retained as described in our Data Retention policy.`
      }
    ]
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    content: `Our service is intended for users aged 16 and older. We do not knowingly collect personal information from children under 16 without parental consent.

If we discover that we have inadvertently collected information from a child under 16, we will delete that information promptly upon verification.

Parents or legal guardians who believe their child has provided us with personal information should contact us immediately. We will take steps to verify the claim and delete the information if appropriate.

We encourage parents to monitor their children's online activities and help enforce this policy by instructing children never to provide personal information without permission.`
  },
  {
    id: 'international',
    title: 'International Data Transfers',
    content: `Your information may be transferred to and processed in countries other than your country of residence, including countries that may not have the same data protection laws.

By using our services, you consent to the transfer of your information to Poland and other countries where we operate our servers and service providers.

We ensure appropriate safeguards are in place for international transfers, including using service providers that comply with international data protection standards and implementing standard contractual clauses for data transfers.`
  },
  {
    id: 'changes-policy',
    title: 'Changes to This Privacy Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.

When we make material changes, we will notify you by posting the updated Privacy Policy on our website with a new "Last Updated" date and sending a notification through Discord for significant changes.

We encourage you to review this Privacy Policy periodically. Your continued use of our services after changes constitutes acceptance of the updated Privacy Policy.

If you do not agree with changes, you should stop using our services and may request account deletion.`
  },
  {
    id: 'contact-privacy',
    title: 'Contact Us About Privacy',
    content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Email: privacy@infinitygg.pl

Discord: https://discord.gg/infinitygg (open a support ticket)

Response Time: We aim to respond to all privacy inquiries within 30 days

When contacting us about privacy matters, please include your account username or identifier, a clear description of your request or concern, and any relevant details or documentation.

We take privacy concerns seriously and will work with you to address any issues or questions you may have.`
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