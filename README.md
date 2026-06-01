[Test the game](https://4yourztruly.github.io/Examensarbete/)
# Utveckling av ett pokerspel i React med TypeScript. En jämförelse av spellogik mellan funktionell och objektorienterad struktur.

## Sammanfattning (Abstract)

Modern web development relies increasingly on component-based frameworks such as React, while traditional backend and enterprise systems continue to favour object-oriented programming (OOP) paradigms. Understanding how these paradigms differ in practice is relevant for developers who must choose or combine architectural approaches. This project investigates how game logic for Texas Hold'em Poker can be implemented using a functional programming (FP) approach with React and TypeScript, and compares this against a theoretical object-oriented equivalent in Java.

The work followed an agile development methodology and consisted of two parallel tracks: building a fully playable browser-based poker game, and conducting an ongoing architectural analysis comparing the functional implementation to a hypothetical OOP design. State management was handled using Zustand, a lightweight React state library.

The resulting application is a complete single-player Texas Hold'em game featuring hand evaluation, betting rounds, and bot opponents with distinct play styles. The functional structure proved effective for isolating game logic in pure, reusable functions. Zustand enabled reactive UI updates with minimal configuration. A structured comparison across seven dimensions — including code structure, state management, testability, and maintainability — revealed that the two paradigms represent fundamentally different answers to where state and responsibility should reside, rather than being equivalent alternatives.

The most significant finding was that state management constitutes the primary architectural challenge regardless of paradigm. The paradigm choice determines how that complexity is distributed, but does not eliminate it. These insights are broadly applicable to developers designing React-based applications with complex business or game logic.

**Keywords:** React, TypeScript, functional programming, object-oriented programming, state management

---

## Förkortningar och Begrepp

_Alfabetisk lista över tekniska termer, förkortningar och begrepp som används i rapporten._

| Term/Förkortning | Förklaring |
| ---------------- | ---------- |
| API | Application Programming Interface – Gränssnitt för kommunikation mellan mjukvarusystem |
| FP | Functional Programming – Funktionell programmering |
| OOP | Object-Oriented Programming – Objektorienterad programmering |
| REST | Representational State Transfer – Arkitekturstil för webbaserade API:er |
| SoC | Separation of Concerns – Principen att separera olika ansvarsområden i kod |
| UI | User Interface – Användargränssnitt |

---

## 1. Inledning

### 1.1 Bakgrund

Moderna webbapplikationer byggs ofta med ramverk som React, där fokus ligger på komponentbaserad utveckling och hantering av tillstånd [1]. Objektorienterad programmering, exempelvis i Java, används traditionellt för att strukturera komplex logik genom klasser och arv [2]. Spelutveckling innebär hantering av komplex logik som regler, turordning och AI-beslut, vilket gör det till ett lämpligt område för att jämföra olika programmeringsparadigm.

Valet av programmeringsparadigm påverkar inte bara hur kod skrivs utan också hur ett system underhålls, skalas och felsöks över tid. Att förstå dessa konsekvenser är centralt för modern mjukvaruutveckling, särskilt i en bransch där frontend och backend alltmer delas upp i separata teknikstackar med olika paradigmatiska rötter.

### 1.2 Syfte

Syftet är att undersöka hur spellogik kan implementeras i React samt jämföra detta med en objektorienterad struktur för att förstå styrkor och svagheter i respektive metod.

### 1.3 Frågeställningar

1. Hur kan spellogik för Texas Hold'em Poker, såsom handvärdering, turordning och satsningsrundor, implementeras i en funktionell struktur med React och TypeScript?
2. Hur kan ett reaktivt tillståndshanteringssystem med Zustand användas för att hantera spelstatus i realtid i ett webbaserat pokerspel?
3. Vilka skillnader finns i hur spellogik struktureras mellan en funktionell approach i TypeScript och en objektorienterad approach i Java?
4. Hur skiljer sig hanteringen av tillstånd och dataflöde åt mellan Zustand i React och ett klassbaserat system i Java när det gäller komplexitet och underhållbarhet?
5. Vilka styrkor och svagheter uppvisar funktionell programmering kontra objektorienterad programmering när det gäller separation of concerns i ett spelprojekt?

### 1.4 Avgränsningar

Spelet kommer inte inkludera följande:
- Multiplayer-funktionalitet
- Avancerad AI för bots
- Backend eller databas

Jämförelsen kommer inte inkludera följande:
- Fördjupning av objektorienterade programmeringskoncept

### 1.5 Metodöversikt

Arbetet består av två delar: projektbygget av pokerspelet och jämförelsen mellan funktionell utveckling och objektorienterad utveckling. Under utvecklingen används agil utvecklingsmetodik. Jämförelsen genomförs genom löpande arkitektonisk analys snarare än som en separat studie, vilket möjliggör konkreta observationer grundade i faktisk implementationserfarenhet.

---

## 2. Teoretisk Grund och Relaterat Arbete

### 2.1 Tekniska Koncept

#### React
React är ett JavaScript-bibliotek utvecklat av Facebook för att bygga användargränssnitt genom komponentbaserad utveckling [1]. React använder ett deklarativt arbetssätt där användargränssnittet uppdateras automatiskt baserat på förändringar i applikationens tillstånd. Det är värt att notera att React i grunden inte påtvingar ett visst paradigm — det är möjligt att skriva React-komponenter på ett mer imperativt eller till och med klassorienterat sätt — men konventionen och ekosystemet lutar starkt mot funktionell stil med hooks.

#### TypeScript
TypeScript är en vidareutveckling av JavaScript som introducerar statisk typning [3]. Detta gör det möjligt att upptäcka fel tidigare under utvecklingen och förbättrar kodens läsbarhet och underhållbarhet, särskilt i större projekt. TypeScript möjliggör också mer uttrycksfull modellering av domänlogik, exempelvis genom union types för kortfärger eller diskriminerade unioner för speltillstånd.

#### Funktionell programmering
Funktionell programmering (FP) bygger på användning av rena funktioner och immutabel data [4]. En ren funktion returnerar alltid samma resultat för samma indata och producerar inga sidoeffekter, vilket förenklar testning och felsökning. I React används ofta funktionella komponenter och separata hjälpfunktioner för att hantera logik och tillstånd. Det är viktigt att notera att TypeScript/React inte är ett rent funktionellt språk — bieffekter förekommer, men de hanteras kontrollerat via mekanismer som Zustand.

#### Objektorienterad programmering
Objektorienterad programmering (OOP) är ett programmeringsparadigm där data och beteenden organiseras i objekt och klasser [2]. Centrala koncept inom OOP inkluderar inkapsling (att dölja intern implementation), arv (att återanvända och specialisera beteende) och polymorfism (att behandla olika objekttyper enhetligt). Java är ett typexempel på ett språk byggt kring detta paradigm.

#### Zustand
Zustand är ett lättviktigt bibliotek för state management i React-applikationer [5]. Till skillnad från tyngre alternativ som Redux kräver Zustand minimal konfiguration och följer ett enkelt mönster där ett globalt store definieras med tillstånd och mutationsfunktioner. Biblioteket används i detta projekt för att lagra och hantera global speldata såsom spelarstatus, marker, satsningar och aktuella rundor.

#### Texas Hold'em Poker
Texas Hold'em är en variant av poker där varje spelare får två privata kort och delar fem gemensamma kort på bordet [6]. Spelet innehåller flera satsningsrundor (pre-flop, flop, turn och river) och kräver logik för handvärdering, potthantering och turordning. Regelkomplexiteten — inklusive blind-systemet, all-in-scenarion och sidopottar — gör Texas Hold'em till ett lämpligt testfall för att utvärdera hur väl en given kodstruktur hanterar interagerande regler och tillstånd.

### 2.2 Befintlig Forskning och Lösningar

Det finns många webbaserade kortspel och pokerapplikationer som använder moderna frontend-ramverk som React. Open source-projekt på GitHub visar ofta implementationer av pokerlogik genom både funktionella och objektorienterade lösningar, vilket gör det möjligt att observera praktiska arkitektoniska skillnader.

Kommersiella pokerplattformar som PokerStars och PartyPoker använder vanligtvis klient-server-arkitektur med realtidskommunikation och databashantering. I detta arbete fokuseras enbart på frontend-logiken för att analysera hur spellogiken kan struktureras utan backend-komplexitet. Detta val innebär att resultaten är specifika för frontend-domänen och inte nödvändigtvis generaliserbara till fullstackutveckling.

Tidigare forskning inom programmeringsparadigm visar att funktionell programmering ofta lämpar sig väl för frontend-utveckling tack vare sitt tydliga dataflöde och enklare state management [4] [7]. Objektorienterad programmering används däremot ofta i större system där komplex domänlogik behöver organiseras i tydliga objektstrukturer [2]. Det bör noteras att de flesta moderna system använder en kombination av paradigm snarare än ett renodlat tillvägagångssätt.

### 2.3 Teknisk/Teoretisk Jämförelse

En funktionell struktur i React bygger vanligtvis på separata funktioner för spellogik, där data skickas mellan funktioner utan att modifieras direkt [4]. Fördelen med detta är att varje funktion kan testas isolerat och att dataflödet är lätt att följa. Nackdelen uppstår när logiken blir komplex nog att kräva delning av tillstånd mellan många funktioner — vilket är precis vad state management-verktyg som Zustand är designade att lösa.

I en objektorienterad struktur organiseras logiken i klasser, exempelvis `Player`, `Deck`, `Game` och `HandEvaluator` [2]. Inkapsling gör att varje objekt äger sin data och sina operationer, vilket kan minska oönskad koppling mellan delar av systemet. Nackdelen är att arvskedjor och tätt kopplade objekt kan göra systemet svårare att förändra utan att oavsiktligt påverka andra delar — ett fenomen känt som "fragile base class problem".

Skillnaden i state management är särskilt central för detta projekt. React och Zustand arbetar reaktivt — UI:t uppdateras automatiskt när state ändras [1] [5] — och state är per definition externt från logiken. I ett Java-system skulle state normalt ägas av objekten själva, exempelvis att ett `Game`-objekt håller aktuell runda och pott internt. Detta skapar en mer självförsörjande modell men gör det svårare att separera presentation från logik utan ett explicit arkitekturmönster som MVC eller Observer.

Sammanfattningsvis erbjuder de två paradigmen fundamentalt olika svar på samma fråga: var ska tillstånd bo och vem ansvarar för att uppdatera det? Det är detta grundläggande val som påverkar projektets arkitektur mer än enskilda implementationsdetaljer.

---

## 3. Metod och Genomförande

### 3.1 Övergripande Arbetsgång

Under utvecklingen användes agil utvecklingsmetodik via GitHub Projects [8]. I GitHub Projects lades issues till för alla steg som skulle genomföras inom projektet. Exempel på issues är: skapa skiss för webbsida, skapa projektskelett och skapa visuella komponenter.

<img width="1088" height="1103" alt="github projects table" src="https://github.com/user-attachments/assets/53058454-1896-4a9b-b90a-18c3ecf17ece" />

*Figur 7: GitHub Projects-tavlan med samtliga issues för projektet.*

Under utvecklingen implementerades delar av projektet i ordning efter issues. Först skapades en skiss av hur webbsidan skulle se ut, inklusive en startskärm och hur spelet ser ut när det har startats. Skissen för spelläget innehöll ett spelarbord, spelarplatser, kort, chips och knappar för användarens val – satsa, knacka och lägga sig.

Sedan skapades projektets skelett, det vill säga alla delar som behövs för att kunna utveckla inom projektet. Detta innebar att skapa projektet, säkerställa att alla filer och verktyg finns på plats samt definiera en mappstruktur för komponenter, types och store. Dessutom installerades nödvändiga paket och bibliotek som Zustand, Tailwind och GitHub Pages.

Därefter skapades TypeScript-typer för alla relevanta delar: kort, spelare, spel och hand (kombinationen av kort som ger ett pokervärde, exempelvis par eller kåk).

Sedan skapades visuella komponenter: pokerbord, kort, spelare, knappar och chips. Detta gjordes för att möjliggöra ett visuellt fungerande mock-spel — ett tillvägagångssätt som liknar component-first-utveckling, där presentationslagret byggs separat från logiklagret för att hålla dem löst kopplade.

Därefter skapades de grundläggande funktionerna för pokerspelet: blanda-funktionen (blanda en kortlek), dela-ut-funktionen (dela ut två kort till varje spelare), räkna-ut-resultat-funktionen (avgöra vem som vunnit en runda) samt spelarens valfunktioner (satsa, knacka och lägga sig).

Sedan skapades de större filerna: `gameStore`, `gameFlow` och `GameScreen`. `GameScreen` är presentationslagret. `gameFlow` innehåller reglerna och logiken. `gameStore` hanterar vilka funktioner som ska anropas från `gameFlow` och när, hanterar states, artificiell fördröjning och styr vad som visas i `GameScreen`. Denna tredelade separation motsvarar en enkel variant av ett lagerarkitekturmönster, vilket är ett vanligt designval för att uppnå separation of concerns [7].

Bots skapades i `gameFlow` med fem arketyper av varierande spelstil: passiva, aggressiva och adaptiva. All logik för bots inkluderades här – när de ska satsa, knacka eller lägga sig, samt vilka händer de väljer att spela eller passa.

Därefter fokuserades arbetet på testning, buggfixar och finslipning av UI och UX. Under denna period justerades botarnas beteende upprepade gånger eftersom aggressiva och passiva bots initialt agerade alltför lika varandra. Beteendet itererades tills en tydlig och balanserad skillnad uppnåddes.

#### Användartestning

En person testade spelet utan handledning och gav feedback. Testpersonen ansåg att spelloggen (som visar bots och spelares drag) var svårläst och föreslog färgkodning av spelarnamnen. Testpersonen föreslog också att bots beslutstid skulle ökas till mer än en sekund. Designmässigt upplevdes spelet som visuellt tillfredsställande, och botarnas beteende bedömdes som varierat och trovärdigt. Notera att testet genomfördes med en enda testperson, vilket begränsar generaliserbarheten av resultaten (se avsnitt 5.3).

#### Jämförelse mellan funktionell och objektorienterad struktur

Parallellt med utvecklingen genomfördes en löpande arkitektonisk jämförelse mellan den funktionella struktur som användes i projektet och hur samma funktionalitet skulle kunna implementeras med objektorienterad programmering i Java.

Jämförelsen baserades på de centrala delarna av projektet: hantering av spelare, kortlek, handvärdering och spelstatus. För varje del analyserades hur den implementerade funktionella lösningen var uppbyggd samt hur motsvarande lösning skulle kunna struktureras med klasser och objekt [2].

Analysen genomfördes löpande under projektets utveckling. Varje gång en större funktion implementerades ställdes frågan: hur hade detta sett ut i ett klassorienterat system, och vilka konsekvenser hade det fått för arkitekturen?

### 3.2 Verktyg och Tekniker

Följande verktyg och tekniker användes:

* React [1]
* TypeScript [3]
* Tailwind CSS
* Zustand [5]
* Vite
* Git och GitHub
* GitHub Pages
* Visual Studio Code
* Claude (AI-assistent)
* ChatGPT (AI-assistent)
* Codex
* StackEdit

React användes för användargränssnittet medan TypeScript användes för att skapa tydligare datastrukturer och säkrare kod. Zustand användes för global state management. Tailwind CSS användes för styling. Vite användes för projektkonfiguration. Git och GitHub användes för versionshantering, och GitHub Pages för att hosta projektet.

AI-assistenter (Claude och ChatGPT) användes för att få inspiration och lösningsförslag på komplexa problem, till exempel botlogik och handvärdering. Codex agent användes i slutfasen för finslipning av visuella element och botbeteende, framförallt vid ändringar som berörde flera filer och krävde kontext över hela projektet.

StackEdit användes vid skrivandet av rapporten som en webbaserad Markdown-redigerare.

### 3.3 Datainsamling och Analys

Information samlades in genom officiell dokumentation, teknisk litteratur och analys av befintliga projekt [1] [2] [3] [4] [5]. Projektets resultat analyserades genom att jämföra hur samma typ av spellogik strukturerades i den funktionella implementationen och hur motsvarande lösning hade kunnat organiseras objektorienterat.

Analysen fokuserade på följande dimensioner, valda för deras relevans för underhållbarhet och arkitekturkvalitet:

- Kodstruktur – hur logik och data organiseras
- Läsbarhet – hur enkelt koden är att följa för en utomstående
- Underhållbarhet – hur enkelt det är att förändra eller utöka koden
- Separation of concerns – i vilken grad olika ansvarsområden hålls åtskilda
- Hantering av state och dataflöde – var tillstånd bor och hur det uppdateras

### 3.4 Kvalitetssäkring

För att säkerställa kvalitet genomfördes kontinuerliga tester under utvecklingen. Funktioner testades individuellt innan de integrerades i spelet.

Versionshantering genom Git användes för att dokumentera förändringar och möjliggöra återställning vid problem [8]. TypeScript hjälpte till att upptäcka typfel under utvecklingsprocessen [3].

En extern testperson testade spelet för att ge en objektiv syn på spelupplevelsen.

---

## 4. Resultat

### 4.1 Huvudresultat

Resultatet av projektet är ett spelbart webbaserat Texas Hold'em Poker-spel byggt med React, TypeScript, Tailwind och Zustand. Projektet är strukturerat i fem mappar: komponenter, logik, skärmar, store och types.

Komponentmappen innehåller alla visuella komponenter som används i spelet: kort, bord, knappar, chips och spelarplatser. Logik-mappen innehåller alla funktionsfiler: satsning, chips, kortlek, `gameFlow` och hand. Satsningsfilen innehåller funktionerna satsa, knacka och lägga sig.

Chips-filen innehåller logik för hur satsningar bryts ned för att visa rätt typer av chips. Kortlek-filen innehåller funktionerna för att dela ut och blanda kort.

`gameFlow` innehåller reglerna för hur spelet ska spelas, inklusive spelaruppsättning och botlogik via `getBotAction`. Hand-filen innehåller funktioner för handvärdering, exempelvis identifiering av flush och par.

Store-mappen innehåller `gameStore`, som hanterar spelstatus, spelarordning och satsningar. Skärmar-mappen innehåller `GameScreen` och `StartScreen`.

<img width="1550" height="968" alt="poker game start image" src="https://github.com/user-attachments/assets/be5bc504-2c32-4e1e-b9db-2319eaa25d61" />

*Figur 1: Startskärmen (StartScreen) med highscore-visning och startknapp.*

<img width="1331" height="1125" alt="poker game playing pre flop" src="https://github.com/user-attachments/assets/d0431f3c-2670-4c37-9c1b-ef1f0516ea86" />


*Figur 2: Pre-flop-stadiet. De gemensamma korten är ännu dolda, blinds har placerats och bots har redan agerat i loggen. Spelaren väntar på att agera.*

### 4.2 Detaljerade Fynd

Spellogiken implementerades framgångsrikt i en funktionell struktur [4]. Nedan redovisas resultaten kopplade till varje frågeställning.

**Frågeställning 1 – Funktionell implementation av pokerlogik:** Samtliga centrala spelregler implementerades som separata, statslösa funktioner. Handvärdering hanterades i hand-filen genom en serie filtreringsfunktioner som identifierar hand-kombinationer i rangordning (royal flush ner till högt kort). Funktionerna tog kortarrayer som indata och returnerade ett resultatobjekt utan att mutera någon extern state. Detta visade sig vara en tydlig styrka med FP — logiken var isolerad, lätt att följa och enkel att testa separat.

<img width="1344" height="1028" alt="poker game post flop" src="https://github.com/user-attachments/assets/880a19e9-2087-4022-ac21-f27ebd7474bf" />
*Figur 3: GameScreen under flop-rundan, med satsningskontroller, chipvisualisering och spelloggen nedtill.*

**Frågeställning 2 – State management med Zustand:** All speldata lagrades i `gameStore`, vilket innebar att användargränssnittet automatiskt uppdaterades när spelets state förändrades [5]. Zustand hanterade det globala tillståndet med minimalt konfigurationsbehov. En viktig observation var att gränsen mellan "ren logik" (i `gameFlow`) och "tillståndshantering" (i `gameStore`) inte alltid var självklar — vissa beslut om var logik hörde hemma krävde medvetna arkitekturval.

<img width="1177" height="1018" alt="poker game pre showdown" src="https://github.com/user-attachments/assets/ae4ee439-f326-42e8-91f2-ca8604ce02f1" />

*Figur 4: GameScreen vid river. Realtidsuppdateringen av handvärdet (Two Pair) illustrerar Zustand-storens reaktiva state management.*

**Frågeställning 3 och 4 – Jämförelse FP vs OOP (se även avsnitt 4.3):** I den funktionella implementationen hölls data och logik medvetet separerade. I en OOP-implementation hade samma funktionalitet naturligt samlats i objekt: en `Deck`-klass med `shuffle()` och `deal()`, en `Player`-klass med `chips`, `hand` och `bet()`, och ett `Game`-objekt som orkesterar flödet. I den funktionella varianten lever dessa operationer i separata filer och tar den nödvändiga datan som argument, medan state bor externt i Zustand. Ingen av de två strukturerna är objektiv överlägsen — de representerar fundamentalt olika svar på frågan om var ansvar ska placeras.

<img width="1110" height="916" alt="poker game all in image" src="https://github.com/user-attachments/assets/1d506cf4-d7cd-4137-8c4c-469f63aa8843" />

*Figur 5: All-in-scenario med tre spelare. Detta tillstånd kräver att gameStore håller koll på varje spelares insats, all-in-belopp och aktiv status parallellt — ett av de mer komplexa state management-fallen i projektet.*

**Frågeställning 5 – Separation of concerns:** Separationen mellan `gameFlow`, `gameStore` och `GameScreen` möjliggjorde att logik, state management och presentation kunde utvecklas relativt oberoende av varandra [7]. Denna separation uppnåddes medvetet och krävde disciplin — det var lätt att låta `gameStore` ta på sig för mycket ansvar.

### 4.3 Strukturerad Jämförelse: Funktionell vs Objektorienterad Struktur

Nedanstående tabell sammanfattar de centrala skillnaderna som identifierades under projektet, baserat på faktisk implementationserfarenhet av den funktionella varianten och arkitektonisk analys av en hypotetisk OOP-variant.

| Dimension | Funktionell (React/TypeScript/Zustand) | Objektorienterad (Java) |
|-----------|----------------------------------------|-------------------------|
| **Kodstruktur** | Logik i separata filer och funktioner; data som argument | Logik och data samlat i klasser; objekt ansvarar för sig själva |
| **State management** | Externt i Zustand; reaktivt UI | Internt i objekt; manuell synkronisering mot UI |
| **Separation of concerns** | Tydlig filbaserad separation (gameFlow / gameStore / GameScreen) | Naturlig inkapsling per klass, men risk för tätt kopplade objekt |
| **Testbarhet** | Rena funktioner enkla att enhetstesta | Kräver mock-objekt och setup för klassberoenden |
| **Läsbarhet** | Dataflödet tydligt; men spridning av logik över filer kan försvåra överblick | Samlad logik per domänobjekt; men arvskedjor kan öka komplexitet |
| **Underhållbarhet** | Enkelt att lägga till nya funktioner utan att bryta befintlig state | Enkelt att utöka klasser, men risk vid refaktorering av basklasser |
| **Skalbarhet** | Kräver disciplin för att undvika att gameStore växer okontrollerat | Klassstrukturen skalas naturligt med fler domänobjekt |

### 4.4 Oväntade Resultat

Ett oväntat resultat var att state management visade sig vara en större utmaning än själva pokerlogiken. Funktioner som handvärdering och kortutdelning implementerades relativt snabbt, medan hanteringen av rundor, spelarordning och synkronisering mellan bots och användare krävde betydligt mer arbete. Detta pekar på att state management — oavsett paradigm — är den verkliga arkitektoniska kärnfrågan i ett spelprojekt av denna typ.

Ett annat oväntat resultat var komplexiteten i botarnas beteende. De första implementationerna ledde till att olika bottyper agerade mycket likartat trots att de var avsedda att ha olika spelstilar. Detta krävde flera iterationer innan skillnaderna mellan aggressiva, passiva och adaptiva bots blev tydliga. Utmaningen belyste att beteendelogik för icke-deterministiska agenter är svår att testa utan ett formellt testramverk.

Användartestet visade att visuella detaljer hade större påverkan på spelupplevelsen än förväntat. Förslag som färgkodning av spelarnamn och tydligare loggmeddelanden förbättrade förståelsen av spelet trots att de inte påverkade spellogiken.

<img width="1316" height="1108" alt="poker game game over" src="https://github.com/user-attachments/assets/0d9a68c3-2a09-4025-b0e9-6c42dc6bfc27" />

*Figur 6: Game Over-läget med showdown-resultat och knapp för att återvända till startmenyn. Loggen nedtill visar hela händelseförloppet för den sista handen.*

---

## 5. Diskussion

### 5.1 Analys av Resultat

Resultaten visar att React tillsammans med TypeScript och Zustand fungerar väl för utveckling av ett webbaserat pokerspel, och att en funktionell struktur är genomförbar även för relativt komplex spellogik. Det är dock viktigt att inte övertolka detta som ett generellt argument för att FP alltid är bättre — kontexten spelar en avgörande roll.

Den jämförande analysen (avsnitt 4.3) pekar på att valet av paradigm i hög grad är ett val om var komplexiteten ska placeras: i ett OOP-system äger objekten sin data och sina regler, vilket ger tydlig inkapsling men risk för tätt kopplade strukturer; i ett FP-system hanteras state externt och logiken är mer löst kopplad, men det kräver en tydlig arkitekturstrategi för att undvika att state-lagret (här `gameStore`) växer okontrollerat. Båda riskerna är verkliga och identifierades i detta projekt [2] [4].

En viktig observation är att den upplevda enkelheten med Zustand delvis är en illusion om man ser till det totala systemet — den komplexitet som OOP hanterar via inkapsling hamnar istället i `gameStore` och krävde lika mycket eftertanke. Detta resonerar med litteraturen, som framhåller att komplexitet inte elimineras av ett paradigmval utan omfördelas [7].

Frågeställningarna 3–5, som behandlar jämförelsen mellan paradigmen, kunde inte besvaras lika definitivt som frågeställningarna 1–2 eftersom den objektorienterade varianten aldrig implementerades i praktiken. Konklusionerna är analytiska snarare än empiriska, vilket är en viktig begränsning att hålla i minnet.

### 5.2 Reflektion över Metod

En styrka med den använda metoden var den iterativa utvecklingsprocessen. Genom GitHub Projects kunde arbetet delas upp i mindre uppgifter som genomfördes stegvis [8], vilket möjliggjorde kontinuerlig testning och tidig identifiering av arkitektoniska problem.

En annan styrka var att projektet utvecklades från grunden utan att förlita sig på befintliga spelramverk. Detta gav en djupare förståelse för hur React, Zustand och pokerlogik samverkar, och ledde till mer genuina observationer för jämförelseanalysen.

Användningen av AI-assistenter (Claude och ChatGPT) underlättade lösandet av komplexa problem men innebar en metodologisk risk: lösningar kan accepteras utan fullständig förståelse, vilket försvårar reflektion och analys. Denna risk bedöms som begränsad i de delar av projektet som analyseras i rapporten, men kan ha påverkat djupet i botimplementationen.

Den tydligaste metodsvagheten är att jämförelsen genomfördes utan en parallell OOP-implementation. En dual-implementation hade möjliggjort empirisk jämförelse av mätvärden som kodrader, antal klasser/funktioner, testbarhet och ändringsfrekvens. Utan detta är jämförelseanalysens slutsatser analytiska resonemang snarare än experimentellt verifierade fakta — en begränsning som är transparent men ändå påverkar reliabiliteten.

### 5.3 Begränsningar och Kritisk Granskning

Projektet innehåller flera begränsningar. Spelet saknar backend, databas och multiplayer-funktionalitet, vilket innebär att resultaten är begränsade till frontend-domänen. Frågor om paradigmval i distribuerade system eller asynkrona flöden kan inte besvaras utifrån detta projekt.

Användartestningen genomfördes med en enda testperson, vilket ger otillräckligt underlag för generaliserbara slutsatser om användbarhet eller spelupplevelse. Resultaten är indicier snarare än evidens.

Jämförelsen mellan FP och OOP är begränsad eftersom den bygger på analys snarare än mätning. Det finns en risk att resonemangen är färgade av erfarenheten av att ha implementerat den funktionella varianten, vilket kan ha gjort den mer intuitiv att bedöma positivt.

Valet av Java som referenspunkt för OOP är rimligt men inte det enda möjliga — Python, C# eller Kotlin hade gett delvis andra slutsatser. Resultaten ska läsas med denna kontextualitet i åtanke.

### 5.4 Bredare Perspektiv

Projektet illustrerar en bredare trend inom mjukvaruutveckling: att gränserna mellan paradigm suddas ut. React kombinerar funktionella idéer (rena komponenter, immutabel state) med imperativ rendering-logik och kan till och med användas med klasskomponenter. Modern Java stödjer lambda-uttryck och streams, hämtade från funktionell programmering. Det "rena" FP eller OOP-system är en pedagogisk konstruktion mer än en praktisk verklighet [4] [2].

Det praktiska värdet av att förstå skillnaderna ligger inte i att välja ett paradigm och hålla sig till det, utan i att veta när ett paradigm löser ett problem bättre. Frontend med reaktivt UI är ett område där FP:s tydliga dataflöde är en naturlig match. Domänmodellering av komplexa affärssystem är ett område där OOP:s inkapsling historiskt visat sig stark. Insikten från detta projekt — att state management är den verkliga komplexiteten oavsett paradigm — är en generellt tillämpbar lärdom för systemdesign.

---

## 6. Slutsatser

### 6.1 Huvudslutsatser

Arbetet visar att Texas Hold'em Poker kan implementeras framgångsrikt i en funktionell struktur med React och TypeScript. Spellogiken strukturerades i separata, återanvändbara funktioner för kortutdelning, handvärdering, satsningsrundor och botbeteende, och state hanterades effektivt via Zustand.

Den jämförande analysen visar att FP och OOP inte är ekvivalenta alternativ som löser samma problem på likvärdigt sätt, utan att de representerar fundamentalt olika arkitektoniska filosofier. FP håller data och logik separerade och lägger ansvaret för tillståndshantering externt; OOP samlar ansvar i objekt och uppnår separation genom inkapsling. I en React-miljö med reaktivt state är den funktionella filosofin en mer naturlig match — men detta är ett kontextuellt påstående, inte ett universellt.

Den viktigaste generella lärdomen från projektet är att state management är den centrala arkitekturella utmaningen i ett spelsystem av denna typ, oavsett vilket paradigm som används. Valet av paradigm bestämmer var och hur state hanteras, men eliminerar inte komplexiteten.

Projektets syfte har uppfyllts: spellogiken implementerades framgångsrikt i en funktionell struktur och en strukturerad jämförelse mellan paradigmen genomfördes utifrån faktisk implementationserfarenhet.

### 6.2 Bidrag och Betydelse

Arbetet bidrar med ett praktiskt exempel på hur ett webbaserat pokerspel kan struktureras med moderna frontend-tekniker, och med en analytisk jämförelse av FP och OOP grundad i konkret utvecklingserfarenhet snarare än enbart teori. Den strukturerade jämförelsetabellen (avsnitt 4.3) kan tjäna som ett lättillgängligt referensmaterial för studenter och utvecklare som väljer arkitektur för liknande projekt.

Projektet belyser också värdet av tydlig lagerarkitektur — separationen mellan `gameFlow`, `gameStore` och `GameScreen` är ett reproducerbart mönster för React-applikationer med komplex affärslogik.

### 6.3 Framtida Arbete

Framtida arbete skulle kunna inkludera en parallell implementation av samma pokerspel i Java med OOP, för att möjliggöra empirisk snarare än analytisk jämförelse. En sådan studie kunde mäta konkreta storheter som kodrader per funktion, antal ändringar vid ny regel, testbarhet och körtidsprestanda.

Ytterligare utveckling av spelet skulle kunna inkludera multiplayer via WebSockets, mer avancerade AI-motståndare, statistiksystem och databaslagring.

En intressant fortsättning vore också att undersöka hybridansatser — exempelvis att använda OOP för domänmodellering (klasser för Deck, Hand, Player) kombinerat med Zustand för reaktivt UI. Många moderna frontend-system tillämpar just denna kombination, och att utvärdera den mot renodlade lösningar vore ett värdefullt bidrag.

---

## 7. Referenser

[1] Meta Open Source, *React – A JavaScript library for building user interfaces*. Meta Platforms. [Online]. Available: https://react.dev. [Accessed: 1 Jun. 2025].

[2] G. Booch, R. Maksimchuk, M. Engle, B. Young, J. Conallen, and K. Houston, *Object-Oriented Analysis and Design with Applications*, 3rd ed. Upper Saddle River, NJ: Addison-Wesley, 2007.

[3] Microsoft, *TypeScript – JavaScript with syntax for types*. Microsoft Corporation. [Online]. Available: https://www.typescriptlang.org. [Accessed: 1 Jun. 2025].

[4] M. Fogus and C. Houser, *Functional JavaScript: Introducing Functional Programming with Underscore.js*. Sebastopol, CA: O'Reilly Media, 2013.

[5] P. Kriszkovics, *Zustand – Bear necessities for state management in React*. GitHub. [Online]. Available: https://github.com/pmndrs/zustand. [Accessed: 1 Jun. 2025].

[6] D. Sklansky and M. Malmuth, *Hold'em Poker for Advanced Players*, 3rd ed. Henderson, NV: Two Plus Two Publishing, 1999.

[7] E. Normand, *Grokking Simplicity: Taming Complex Thinking with Functional Thinking*. Shelter Island, NY: Manning Publications, 2021.

[8] GitHub, *GitHub Projects – Plan and track work*. GitHub, Inc. [Online]. Available: https://docs.github.com/en/issues/planning-and-tracking-with-projects. [Accessed: 1 Jun. 2025].

---

## Bilagor

**Figurförteckning:**

- Figur 1: Startskärmen (StartScreen) med highscore-visning och startknapp
- Figur 2: Pre-flop-stadiet direkt efter spelstart med blinds och satsningsalternativ
- Figur 3: GameScreen under flop-rundan med satsningskontroller och spelloggen
- Figur 4: GameScreen vid river med realtidsuppdaterad handvärdering (Two Pair)
- Figur 5: All-in-scenario under turn med flera simultant all-in-spelare
- Figur 6: Game Over-läget med showdown-resultat och returknapp till startmenyn
- Figur 7: GitHub Projects-tavlan med samtliga issues för projektet
