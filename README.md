
[Test the game](https://4yourztruly.github.io/Examensarbete/)

# Utveckling av ett pokerspel i React med TypeScript. En jämförelse av spellogik mellan funktionell och objektorienterad struktur.

## Sammanfattning (Abstract)

_Skriv detta avsnitt sist, även om det kommer först i rapporten._

Detta är en kortfattad sammanfattning (max 250 ord) på **engelska** som ska innehålla:

-   Bakgrund och problemområde
-   Syfte med arbetet
-   Metod/approach (teoretisk, praktisk eller kombinerad)
-   Huvudresultat och slutsatser
-   Praktisk betydelse

**Nyckelord:** _Lista 3-5 tekniska nyckelord på engelska_

----------

## Förkortningar och Begrepp

_Alfabetisk lista över tekniska termer, förkortningar och begrepp som används i rapporten._


| Term/Förkortning | Förklaring                                                                             |
| ---------------- | -------------------------------------------------------------------------------------- |
| API              | Application Programming Interface - Gränssnitt för kommunikation mellan mjukvarusystem |
| REST             | Representational State Transfer - Arkitekturstil för webbaserade API:er                |

----------

## 1. Inledning

### 1.1 Bakgrund

Moderna webbapplikationer byggs ofta med ramverk som React, där fokus ligger på komponentbaserad utveckling och hantering av tillstånd [1]. Objektorienterad programmering, exempelvis i Java, används traditionellt för att strukturera komplex logik genom klasser och arv [2]. Spelutveckling innebär hantering av komplex logik som regler, turordning och AI-beslut, vilket gör det till ett lämpligt område för att jämföra olika programmeringsparadigm.

### 1.2 Syfte

Syftet är att undersöka hur spellogik kan implementeras i React samt jämföra detta med en objektorienterad struktur för att förstå styrkor och svagheter i respektive metod.

### 1.3 Frågeställningar

1.  Hur kan spellogik för Texas Hold'em Poker, såsom handvärdering, turordning och satsningsrundor, implementeras i en funktionell struktur med React och TypeScript?
2.  Hur kan ett reaktivt tillståndshanteringssystem med Zustand användas för att hantera spelstatus i realtid i ett webbaserat pokerspel?
3.  Vilka skillnader finns i hur spellogik struktureras mellan en funktionell approach i TypeScript och en objektorienterad approach i Java?
4.  Hur skiljer sig hanteringen av tillstånd och dataflöde åt mellan Zustand i React och ett klassbaserat system i Java när det gäller komplexitet och underhållbarhet?
5.  Vilka styrkor och svagheter uppvisar funktionell programmering kontra objektorienterad programmering när det gäller separation of concerns i ett spelprojekt?

### 1.4 Avgränsningar

Spelet kommer inte inkludera följande:

-   Multiplayer-funktionalitet
-   Avancerad AI för bots
-   Backend eller databas

Jämförelsen kommer inte inkludera följande:

-   Fördjupning av objektorienterade programmeringskoncept

### 1.5 Metodöversikt

Arbetet består av två delar: projektbygget av pokerspelet och jämförelsen mellan funktionell utveckling och objektorienterad utveckling. Under utvecklingen används agil utvecklingsmetodik.

----------

## 2. Teoretisk Grund och Relaterat Arbete

### 2.1 Tekniska Koncept

#### React

React är ett JavaScript-bibliotek utvecklat av Facebook för att bygga användargränssnitt genom komponentbaserad utveckling [1]. React använder ett deklarativt arbetssätt där användargränssnittet uppdateras automatiskt baserat på förändringar i applikationens tillstånd.

#### TypeScript

TypeScript är en vidareutveckling av JavaScript som introducerar statisk typning [3]. Detta gör det möjligt att upptäcka fel tidigare under utvecklingen och förbättrar kodens läsbarhet och underhållbarhet, särskilt i större projekt.

#### Funktionell programmering

Funktionell programmering bygger på användning av rena funktioner och immutabel data [4]. I React används ofta funktionella komponenter och separata hjälpfunktioner för att hantera logik och tillstånd.

#### Objektorienterad programmering

Objektorienterad programmering (OOP) är ett programmeringsparadigm där data och beteenden organiseras i objekt och klasser [2]. Centrala koncept inom OOP inkluderar inkapsling, arv och polymorfism.

#### Zustand

Zustand är ett lättviktigt bibliotek för state management i React-applikationer [5]. Biblioteket används för att lagra och hantera global speldata såsom spelarstatus, marker, satsningar och aktuella rundor.

#### Texas Hold'em Poker

Texas Hold'em är en variant av poker där varje spelare får två privata kort och delar fem gemensamma kort på bordet [6]. Spelet innehåller flera satsningsrundor och kräver logik för handvärdering, potthantering och turordning.

### 2.2 Befintlig Forskning och Lösningar

Det finns många olika webbaserade kortspel och pokerapplikationer som använder moderna frontend-ramverk som React. Open source-projekt på GitHub visar ofta implementationer av pokerlogik genom både funktionella och objektorienterade lösningar.

Kommersiella pokerplattformar som PokerStars och PartyPoker använder vanligtvis klient-server-arkitektur med realtidskommunikation och databashantering. I detta arbete fokuseras endast på frontend-logiken för att analysera hur spellogiken kan struktureras utan backend-komplexitet.

Tidigare forskning inom programmeringsparadigm visar att funktionell programmering ofta lämpar sig väl för frontend-utveckling tack vare sitt tydliga dataflöde och enklare state management [4] [7]. Objektorienterad programmering används däremot ofta i större system där komplex logik behöver organiseras i tydliga objektstrukturer [2].

### 2.3 Teknisk/Teoretisk Jämförelse

En funktionell struktur i React bygger vanligtvis på separata funktioner för spellogik, där data skickas mellan funktioner utan att modifieras direkt. Detta kan förbättra testbarhet och minska bieffekter [4].

I en objektorienterad struktur organiseras logiken istället i klasser, exempelvis `Player`, `Deck`, `Game` och `HandEvaluator`. Detta kan göra systemet mer intuitivt när många objekt med olika beteenden ska hanteras [2].

Skillnaden mellan dessa metoder blir särskilt tydlig vid state management. React och Zustand arbetar reaktivt där användargränssnittet uppdateras automatiskt vid förändringar i state [1] [5]. Ett klassbaserat Java-system arbetar ofta mer manuellt genom objektinstanser och funktionsanrop.

----------

## 3. Metod och Genomförande

### 3.1 Övergripande Arbetsgång

Under utvecklingen användes agil utvecklingsmetodik via GitHub Projects [8]. I GitHub Projects lades issues till för alla steg som skulle genomföras inom projektet. Exempel på issues är: skapa skiss för webbsida, skapa projektskelett och skapa visuella komponenter.

Under utvecklingen implementerades delar av projektet i ordning efter issues. Först skapades en skiss av hur webbsidan skulle se ut, inklusive en startskärm och hur spelet ser ut när det har startats. Skissen för spelläget innehöll ett spelarbord, spelarplatser, kort, chips och knappar för användarens val – satsa, knacka och lägga sig.

Sedan skapades projektets skelett, det vill säga alla delar som behövs för att kunna utveckla inom projektet. Detta innebar att skapa projektet, säkerställa att alla filer och verktyg finns på plats samt definiera en mappstruktur för komponenter, types och store. Dessutom installerades nödvändiga paket och bibliotek som Zustand, Tailwind och GitHub Pages.

Därefter skapades TypeScript-typer för alla relevanta delar: kort, spelare, spel och hand (kombinationen av kort som ger ett pokervärde, exempelvis par eller kåk).

Sedan skapades visuella komponenter: pokerbord, kort, spelare, knappar och chips. Detta gjordes för att möjliggöra ett visuellt fungerande mock-spel, ungefär som att bygga karosseri och interiör på en bil innan motor och växellåda monteras.

Därefter skapades de grundläggande funktionerna för pokerspelet: blanda-funktionen (blanda en kortlek), dela-ut-funktionen (dela ut två kort till varje spelare), räkna-ut-resultat-funktionen (avgöra vem som vunnit en runda) samt spelarens valfunktioner (satsa, knacka och lägga sig).

Sedan skapades de större filerna: `gameStore`, `gameFlow` och `GameScreen`. `GameScreen` är det som visas när spelaren spelar spelet. `gameFlow` innehåller reglerna och logiken, inklusive funktioner som dela ut och räkna ut resultat. `gameStore` hanterar vilka funktioner som ska anropas från `gameFlow` och när, hanterar states, artificiell fördröjning och styr vad som visas i `GameScreen`.

Kortfattat kan `GameScreen` beskrivas som presentationslagret, `gameFlow` som ett logiklager (jämförbart med en enkel backend), och `gameStore` som den komponent som kopplar samman de övriga två beroende på användarens val.

Med alla dessa filer på plats var det möjligt att testa hela spelet, inte bara separata funktioner. Det saknades dock fortfarande bots.

Bots skapades i `gameFlow` med fem arketyper av varierande spelstil: passiva, aggressiva och adaptiva. All logik för bots inkluderades här – när de ska satsa, knacka eller lägga sig, samt vilka händer de väljer att spela eller passa.

Därefter fokuserades arbetet på testning, buggfixar och finslipning av UI och UX. Under denna period justerades botarnas beteende upprepade gånger eftersom aggressiva och passiva bots initialt agerade alltför lika varandra. Beteendet itererades tills en tydlig och balanserad skillnad uppnåddes.

#### Användartestning

En person testade spelet utan handledning och gav feedback. Testpersonen ansåg att spelloggen (som visar bots och spelares drag) var svårläst och föreslog färgkodning av spelarnamnen för att lättare skilja dem åt. Testpersonen föreslog också att bots beslutstid skulle ökas till mer än en sekund. Designmässigt upplevdes spelet som visuellt tillfredsställande, och botarnas beteende bedömdes som varierat och trovärdigt. Notera att testet genomfördes med en enda testperson, vilket begränsar generaliserbarheten av resultaten (se avsnitt 5.3).

#### Jämförelse mellan funktionell och objektorienterad struktur

Parallellt med utvecklingen genomfördes en jämförelse mellan den funktionella struktur som användes i projektet och hur samma funktionalitet skulle kunna implementeras med objektorienterad programmering i Java.

Jämförelsen baserades på de centrala delarna av projektet: hantering av spelare, kortlek, handvärdering och spelstatus. För varje del analyserades hur den implementerade funktionella lösningen var uppbyggd samt hur motsvarande lösning skulle kunna struktureras med klasser och objekt [2].

I den funktionella implementationen placerades logik i separata funktioner och filer. Exempelvis hanterades kortutdelning, handvärdering och botbeslut genom fristående funktioner i `gameFlow` och relaterade logikfiler. Tillståndet för spelet lagrades centralt i `gameStore` via Zustand [5].

Vid en objektorienterad implementation skulle motsvarande funktionalitet kunna organiseras i klasser som `Player`, `Deck`, `Hand` och `Game`, där varje klass innehåller både data och beteende genom attribut och metoder.

Jämförelsen fokuserade på kodstruktur, separation of concerns, hantering av state, läsbarhet och underhållbarhet. Analysen genomfördes löpande under projektets utveckling genom reflektion över hur varje större funktion hade kunnat implementeras i ett objektorienterat system.

### 3.2 Verktyg och Tekniker

Följande verktyg och tekniker användes:

-   React [1]
-   TypeScript [3]
-   Tailwind CSS
-   Zustand [5]
-   Vite
-   Git och GitHub
-   GitHub Pages
-   Visual Studio Code
-   Claude (AI-assistent)
-   ChatGPT (AI-assistent)
-   Codex
-   StackEdit

React användes för användargränssnittet medan TypeScript användes för att skapa tydligare datastrukturer och säkrare kod. Zustand användes för global state management. Tailwind CSS användes för styling. Vite användes för projektkonfiguration. Git och GitHub användes för versionshantering, och GitHub Pages för att hosta projektet.

AI-assistenter (Claude och ChatGPT) användes för att få inspiration och lösningsförslag på komplexa problem, till exempel botlogik och handvärdering. Codex agent användes i slutfasen för finslipning av visuella element och botbeteende, framförallt vid ändringar som berörde flera filer och krävde kontext över hela projektet.

StackEdit användes vid skrivandet av rapporten som en webbaserad Markdown-redigerare.

### 3.3 Datainsamling och Analys

Information samlades in genom dokumentation, tekniska artiklar och analys av befintliga projekt. Projektets resultat analyserades genom att jämföra hur samma typ av spellogik skulle kunna struktureras i både funktionell och objektorienterad programmering.

Fokus låg på:

-   Kodstruktur
-   Läsbarhet
-   Underhållbarhet
-   Separation of concerns
-   Hantering av state och dataflöde

### 3.4 Kvalitetssäkring

För att säkerställa kvalitet genomfördes kontinuerliga tester under utvecklingen. Funktioner testades individuellt innan de integrerades i spelet.

Versionshantering genom Git användes för att dokumentera förändringar och möjliggöra återställning vid problem [8]. TypeScript hjälpte till att upptäcka typfel under utvecklingsprocessen [3].

En extern testperson testade spelet för att ge en objektiv syn på spelupplevelsen.

----------

## 4. Resultat

### 4.1 Huvudresultat

Resultatet av projektet är ett spelbart webbaserat Texas Hold'em Poker-spel byggt med React, TypeScript, Tailwind och Zustand. Projektet är strukturerat i fem mappar: komponenter, logik, skärmar, store och types.

Komponentmappen innehåller alla visuella komponenter som används i spelet: kort, bord, knappar, chips och spelarplatser. Logik-mappen innehåller alla funktionsfiler: satsning, chips, kortlek, `gameFlow` och hand. Satsningsfilen innehåller funktionerna satsa, knacka och lägga sig.

Chips-filen innehåller logik för hur satsningar bryts ned för att visa rätt typer av chips (exempelvis bryts en satsning på 51 ned till en 50-chip och en 1-chip). Kortlek-filen innehåller funktionerna för att dela ut och blanda kort.

`gameFlow` innehåller reglerna för hur spelet ska spelas, inklusive spelaruppsättning och funktioner som `getBotAction` (hämtar botens nästa drag). Hand-filen innehåller funktioner för handvärdering, exempelvis identifiering av flush och par.

Store-mappen innehåller `gameStore`, som hanterar spelstatus, spelarordning och satsningar, samt anropar funktioner från `gameFlow`. Skärmar-mappen innehåller `GameScreen` och `StartScreen`.

### 4.2 Detaljerade Fynd

Spellogiken implementerades framgångsrikt genom en funktionell struktur där regler och beräkningar placerades i separata funktioner [4]. Funktioner för kortutdelning, blandning av kortlek, handvärdering och satsningshantering kunde återanvändas från flera delar av projektet utan beroende av användargränssnittet.

Zustand visade sig vara ett effektivt verktyg för att hantera spelets tillstånd [5]. All speldata lagrades i `gameStore`, vilket innebar att användargränssnittet automatiskt uppdaterades när spelets state förändrades, och behovet av manuell synkronisering minskade.

Genom den löpande jämförelsen framkom att många delar av spelet hade kunnat representeras som objekt i ett klassbaserat system, exempelvis med klasser som `Player`, `Deck`, `Hand` och `Game` [2]. I den funktionella implementationen hölls data och logik mer separerade.

Ett viktigt fynd var att separationen mellan `gameFlow`, `gameStore` och `GameScreen` gjorde projektet enklare att underhålla. Logik, state management och presentation kunde utvecklas relativt oberoende av varandra, i linje med principen om separation of concerns [7].

### 4.3 Oväntade Resultat

Ett oväntat resultat var att state management visade sig vara en större utmaning än själva pokerlogiken. Funktioner som handvärdering och kortutdelning implementerades relativt snabbt, medan hanteringen av rundor, spelarordning och synkronisering mellan bots och användare krävde betydligt mer arbete.

Ett annat oväntat resultat var komplexiteten i botarnas beteende. De första implementationerna ledde till att olika bottyper agerade mycket likartat trots att de var avsedda att ha olika spelstilar. Detta krävde flera iterationer och tester innan skillnaderna mellan aggressiva, passiva och adaptiva bots blev tydliga.

Användartestet visade även att visuella detaljer hade större påverkan på spelupplevelsen än förväntat. Förslag som färgkodning av spelarnamn och tydligare loggmeddelanden förbättrade förståelsen av spelet trots att de inte påverkade spellogiken.

----------

## 5. Diskussion

### 5.1 Analys av Resultat

Arbetets syfte var att undersöka hur spellogik kan implementeras i React samt jämföra detta med en objektorienterad struktur. Resultaten visar att React tillsammans med TypeScript och Zustand fungerar väl för utveckling av ett webbaserat pokerspel.

Den första frågeställningen besvarades genom implementationen av funktioner för kortutdelning, handvärdering, satsningsrundor och spelarhandlingar. Den andra frågeställningen besvarades genom användningen av Zustand, där all speldata hanterades centralt och automatiskt uppdaterade användargränssnittet [5].

Den genomförda jämförelsen visade att den funktionella strukturen gav tydlig separation mellan data och logik, medan ett klassbaserat system sannolikt hade gett starkare inkapsling av spelobjekt [2]. Resultatet överensstämmer med tidigare forskning som beskriver funktionell programmering som särskilt lämplig för moderna frontend-applikationer [4] [7].

### 5.2 Reflektion över Metod

En styrka med den använda metoden var den iterativa utvecklingsprocessen. Genom GitHub Projects kunde arbetet delas upp i mindre uppgifter som genomfördes stegvis [8]. Detta gjorde projektet mer hanterbart och möjliggjorde kontinuerlig testning.

En annan styrka var att projektet utvecklades från grunden, vilket gav en djupare förståelse för React, Zustand och pokerlogik.

Användningen av AI-assistenter (Claude och ChatGPT) underlättade lösandet av komplexa problem men innebar också en risk att lösningar accepterades utan fullständig förståelse. Detta bör beaktas vid bedömning av kodens pedagogiska värde.

En svaghet i metoden är att jämförelsen genomfördes genom analys av arkitektur och kodstruktur snarare än genom att utveckla två fullständiga implementationer. Resultaten bygger därför delvis på teoretiska resonemang. En mer omfattande studie hade kunnat genomföras genom att implementera spelet i både funktionell och objektorienterad form och därefter jämföra dem praktiskt.

### 5.3 Begränsningar och Kritisk Granskning

Projektet innehåller flera begränsningar. Spelet saknar backend, databas och multiplayer-funktionalitet, vilket innebär att resultaten främst är relevanta för frontend-utveckling.

Användartestningen genomfördes med endast en testperson. Fler testpersoner hade gett mer tillförlitliga resultat kring användbarhet och spelupplevelse.

Jämförelsen mellan funktionell programmering och objektorienterad programmering är begränsad eftersom endast den funktionella implementationen utvecklades och testades i praktiken. Den objektorienterade delen bygger på analys och designjämförelser snarare än experimentella resultat [2].

### 5.4 Bredare Perspektiv

Projektet visar hur moderna webbtekniker kan användas för att implementera relativt komplex spellogik direkt i webbläsaren utan behov av backend-system [1].

Resultaten kan vara relevanta för utvecklare som arbetar med React-baserade applikationer där komplex affärslogik eller spellogik behöver implementeras. Projektet illustrerar vikten av tydlig separation mellan presentation, state management och affärslogik [7].

----------

## 6. Slutsatser

### 6.1 Huvudslutsatser

Arbetet visar att Texas Hold'em Poker kan implementeras framgångsrikt genom en funktionell struktur i React med TypeScript. Spellogiken kunde struktureras i separata, återanvändbara funktioner som täcker kortutdelning, handvärdering, satsningsrundor och botbeteende.

Zustand visade sig vara ett effektivt verktyg för att hantera globalt state och möjliggjorde tydlig separation mellan användargränssnitt och spellogik [5].

Jämförelsen med objektorienterad programmering visar att båda paradigmen har sina styrkor. Funktionell programmering passar väl med React och reaktiv state management, medan objektorienterad programmering erbjuder tydligare modellering av spelobjekt och relationer [2] [4]. Projektets syfte har därmed uppfyllts: spellogiken implementerades framgångsrikt och en strukturerad jämförelse mellan paradigmen genomfördes.

### 6.2 Bidrag och Betydelse

Arbetet bidrar med ett praktiskt exempel på hur ett webbaserat pokerspel kan utvecklas med moderna frontend-tekniker. Projektet visar hur funktionell programmering kan användas för att strukturera komplex spellogik, samt vilka skillnader som finns jämfört med en objektorienterad approach.

Resultatet kan vara användbart för studenter och utvecklare som vill förstå hur olika programmeringsparadigm påverkar arkitektur och kodstruktur [2] [4].

### 6.3 Framtida Arbete

Framtida arbete skulle kunna inkludera implementation av multiplayer-funktionalitet genom WebSockets och en backend-server.

Ytterligare utveckling skulle kunna inkludera mer avancerade AI-motståndare, statistiksystem och databaslagring.

För en djupare jämförelse mellan paradigmen skulle samma pokerspel kunna implementeras i både React/TypeScript och Java, för att möjliggöra en praktisk jämförelse av kodstruktur, underhållbarhet och komplexitet [2].

----------

## 7. Referenser

[1] Meta Open Source, _React – A JavaScript library for building user interfaces_. Meta Platforms. [Online]. Available: https://react.dev. [Accessed: 1 Jun. 2025].

[2] G. Booch, R. Maksimchuk, M. Engle, B. Young, J. Conallen, and K. Houston, _Object-Oriented Analysis and Design with Applications_, 3rd ed. Upper Saddle River, NJ: Addison-Wesley, 2007.

[3] Microsoft, _TypeScript – JavaScript with syntax for types_. Microsoft Corporation. [Online]. Available: https://www.typescriptlang.org. [Accessed: 1 Jun. 2025].

[4] M. Fogus and C. Houser, _Functional JavaScript: Introducing Functional Programming with Underscore.js_. Sebastopol, CA: O'Reilly Media, 2013.

[5] P. Kriszkovics, _Zustand – Bear necessities for state management in React_. GitHub. [Online]. Available: https://github.com/pmndrs/zustand. [Accessed: 1 Jun. 2025].

[6] D. Sklansky and M. Malmuth, _Hold'em Poker for Advanced Players_, 3rd ed. Henderson, NV: Two Plus Two Publishing, 1999.

[7] E. Normand, _Grokking Simplicity: Taming Complex Software with Functional Thinking_. Shelter Island, NY: Manning Publications, 2021.

[8] GitHub, _GitHub Projects – Plan and track work_. GitHub, Inc. [Online]. Available: https://docs.github.com/en/issues/planning-and-tracking-with-projects. [Accessed: 1 Jun. 2025].

----------

## Bilagor

**För utvecklingsprojekt:**

-   Bilaga A: Källkod (utdrag eller repo-referens)
-   Bilaga B: Teknisk dokumentation
-   Bilaga C: Testresultat

**För alla typer:**

-   Bilaga X: Projektplanering och tidsrapporter
