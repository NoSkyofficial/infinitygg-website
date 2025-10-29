"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowUp, Home } from 'lucide-react';
import LegalLayout from '../components/LegalLayout';

interface LegalSection {
  id: string;
  title: string;
  content: string | React.ReactNode;
  subsections?: LegalSection[];
}

const RegulaminData: LegalSection[] = [
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

export default function RegulaminPage() {
  return (
    <LegalLayout
      title="Regulamin"
      lastUpdated="21 października 2024"
      sections={RegulaminData}
    />
  );
}