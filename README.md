
[Test the game](https://4yourztruly.github.io/Examensarbete/)
# Utveckling av ett pokerspel i React med TypeScript. En jämförelse av spellogik mellan funktionell och objektorienterad struktur.

## Sammanfattning (Abstract)

_Skriv detta avsnitt sist, även om det kommer först i rapporten._

Detta är en kortfattad sammanfattning (max 250 ord) på **engelska** som ska innehålla:

- Bakgrund och problemområde
- Syfte med arbetet
- Metod/approach (teoretisk, praktisk eller kombinerad)
- Huvudresultat och slutsatser
- Praktisk betydelse

**Nyckelord:** _Lista 3-5 tekniska nyckelord på engelska_

---

## Förkortningar och Begrepp

_Alfabetisk lista över tekniska termer, förkortningar och begrepp som används i rapporten._

| Term/Förkortning | Förklaring                                                                             |
| ---------------- | -------------------------------------------------------------------------------------- |
| API              | Application Programming Interface - Gränssnitt för kommunikation mellan mjukvarusystem |
| REST             | Representational State Transfer - Arkitekturstil för webbaserade API:er                |

---

## 1. Inledning

### 1.1 Bakgrund


Moderna webbapplikationer byggs ofta med ramverk som React. Där fokusen ligger på komponentbaserad utveckling och hantering av tillstånd. Samtidigt används objektorienterad programmering, exempelvis i Java, för att strukturera komplex logik genom klasser och arv. Spelutveckling innebär hantering av komplex logik som regler, turordning ai beslut osv. Detta gör det ett bra område för att jämföra olika sätt att utveckla.

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
- Multiplayer funktionalitet
- Avancerad AI för bots
- Backend eller databas

Jämförelsen kommer inte inkludera följande:
- Fördjupning av objekt orienterad programmerings koncept




### 1.5 Metodöversikt

Arbetet kommer bestå av två delar, projektbygget av pokerspelet och jämförelsen mellan funktionell utveckling och OOP utveckling. Under utvecklingen kommer agil utveckling användas.

---

## 2. Teoretisk Grund och Relaterat Arbete

### 2.1 Tekniska Koncept

### React
React är ett JavaScript-bibliotek utvecklat av FaceBook för att bygga användargränssnitt genom komponentbaserad utveckling. React använder ett deklarativt arbetssätt där användargränssnittet uppdateras automatiskt baserat på förändringar i applikationens tillstånd.

### TypeScript
TypeScript är en vidareutveckling av JavaScript som introducerar statisk typning. Detta gör det möjligt att upptäcka fel tidigare under utvecklingen och förbättrar kodens läsbarhet och underhållbarhet, särskilt i större projekt.

### Funktionell programmering
Funktionell programmering bygger på användning av rena funktioner och immutabel data. I React används ofta funktionella komponenter och separata hjälpfunktioner för att hantera logik och tillstånd.

### Objektorienterad programmering
Objektorienterad programmering (OOP) är ett programmeringsparadigm där data och beteenden organiseras i objekt och klasser. Centrala koncept inom OOP inkluderar inkapsling, arv och polymorfism.

### Zustand
Zustand är ett bibliotek för state management i React-applikationer. Biblioteket används för att lagra och hantera global speldata såsom spelarstatus, marker, satsningar och aktuella rundor.

### Texas Hold'em Poker
Texas Hold’em är en variant av poker där varje spelare får två privata kort och delar fem gemensamma kort på bordet. Spelet innehåller flera satsningsrundor och kräver logik för handvärdering, potthantering och turordning.

### 2.2 Befintlig Forskning och Lösningar

Det finns många olika webbaserade kortspel och pokerapplikationer som använder moderna frontend-ramverk som React. Open source projekt på GitHub visar ofta implementationer av pokerlogik genom både funktionella och objektorienterade lösningar. 

Kommersiella pokerplattformar som Pokerstars och PartyPoker använder vanligtvis klient-server-arkitektur med realtidskommunikation och databashantering. I detta arbetet fokuseras endast frontend-logiken för att analysera hur spellogiken kan struktureras utan backend-komplexitet.

Tidigare forskning inom programmeringsparadigm visar att funktionell programmering ofta används inom frontend-utveckling på grund av dess tydliga dataflöde och enklare state management. Objektorienterad programmering används däremot ofta i större system där komplex logik behöver organiseras i tydliga objektstrukturer. 

### 2.3 Teknisk/Teoretisk Jämförelse

En funktionell struktur i React bygger vanligtvis på separata funktioner för spellogik, där data skickas mellan funktioner utan att modifieras direkt. Detta kan förbättra testbarhet och minska bieffekter.

I en objektorienterad struktur organiseras logiken istället i klasser, exempelvis Player, Deck, Game och HandEvaluator. Detta kan göra systemet mer inuitivt när många objekt med olika beteenden ska hanteras. 

Skillnaden mellan dessa metoder blir särskilt tydligt vid state management. React och Zustand arbetar reaktivt där användargränssnittet uppdateras automatistk vid förändringar i state. Ett klassbaserat Java-system arbetar ofta mer manuellt genom objektinstanser och funktion-anrop. 

---

## 3. Metod och Genomförande

### 3.1 Övergripande Arbetsgång

Under utvecklingen användes agil-utveckling via GitHub Projekts. I GitHub Projects lades issues till för alla steg som skulle göras inom projektet. Några exempel på issues är, skapa skiss för webbsida, skapa projekt skelett och skapa visuella komponenter.

Under utvecklingen så implementerades delar av projektet i ordning av issues. Först skapades en skiss av hur webbsidan skulle se ut, detta innehöll hur själva pokerspelet skulle se ut när man först klickar in på sidan det vill säga en start skärm och hur det ser ut när spelet har startats. Skissen för hur spelet ser ut när den har startat innehöll ett spelarbord, spelarplatser, kort, chips och knappar för användarens val, som satsa, knacka, lägga sig. 

Sedan skapades projektets skelett, det vill säga alla delar som behövs för att kunna utveckla inom projektet. Detta innebar att skapa projektet, se till att alla filer och verktyg som behövs för att utveckla vidare. Samt struktur på projektet som mappar för komponenter, types och store. Dessutom installerades alla nödvändiga paket och bibliotek som Zustand, TailWind och GitHub Pages. 

Sedan skapades TypeScript Types för alla relevanta delar. Som kort, spelare, spel (själva pokerspelet) och hand (kombinationen av kort som ger en hand som par, kåk osv). 

Sedan skapades visuella komponenter som pokerbordet, kort, spelare, knappar och chips. Detta gjordes för att främst kunna göra ett mock spel där man kunde få det se ut som ett poker spel där man senare kan lägga till logik, lite som att göra utsidan och insidan av en bil utan de kritiska delarna som motor och växellåda. 

Sedan skapades de grundläggande funktionerna för pokerspelet. Blanda funktionen, möjligheten att kunna blanda en kortlek. Dela ut funktionen, möjligheten att kunna dela ut två kort till respektiva spelar i spelet. Räkna ut resultat funktionen, möjligheten att lista ut vem som har vunnit spelet i slutet av en runda. Spelarens val funktionen som satsa, knacka och lägga sig.

Efter det skapades det större filerna för projektet, gameStore, gameFlow, GameScreen. GameScreen är det som visas när spelaren spelar spelet. gameFlow är där reglerna är satta, och där logiken med funktioner som dela ut, räkna ut resultat osv är. gameStore är där allt hanteras, den hanterar vilka funktioner som ska kallas från gameFlow och när den ska kallas. Den hanterar states, artificiell tid och hanterar vad som ska visas i GameScreen.

I lite lösa termer kan man kalla GameScreen det som visas på webbsidan, gameFlow är lite som en låtsas backend där gameStore kallar funktioner från gameFlow när det behövs beroende på val användaren gör i GameScreen. 

Medan dessa filer skapades skapades också StartScreen, en mycket mindre fil jämfört med de senaste. Den visar start skärmen där en highscore visas och starta spel visas. Med alla dessa filer kunde man nu lägga till en konstant i App.tsx som bestämmer med hjälp av gameStore vilken av skärmarna som ska visas. Med andra ord så börjar spelaren med StartScreen och när de klickar på starta spelet byts det från StartScreen till GameScreen där spelet nu spelas. 

Med allt detta var det möjligt att testa hela spelet inte bara separata funktioner som dela ut och räkna ut resultat. Men det fanns fortfarande inga bots.

Nu skapades bots till spelet, den skapades i gameFlow där bland annat, det skapades 5 bots, med varierande arketyper, från passiva, aggressiva och adaptiva. All logik för bots fanns också med här, från när de ska satsa, knacka, lägga sig. Vilken grad av händer som bots ska spela/inte spela. 

Nu handlade det mest om att testa spelet för att fixa buggar och för att finslipa ui men också ux. Under denna tiden finslipades många visuella element och flera buggar fixades. Under denna tiden var det mycket ändringar till bots eftersom det agerade väldigt konstigt. Aggressiva bots och passiva bots agerade likadant och var väldigt aggressiva eller väldigt passiva. Bots agerande finslipandes mycket tills de kändes som balancerade i sitt agerande.

Nu var issues i Projects klara det var bara tre kvar, låt en person testa spelet, slutför rapport, redogör presentation.

Det som var näst var låta en person testa spelet. Personen testade spelet utan hjälp från skapare, och gav feedback. Personen tyckte loggen (som ligger under spelaren och loggar spelardrag för bots och spelare) inte var tydlig nog med att förskilja spelare och bots, personen föreslog att ha olika färger på namnen i loggen för att skilja på spelarna. Personen tyckte också att bots var för snabba i sina beslut, föreslog att göra det till mer än en sekund. 

Vid frågor om design tyckte personen det såg bra ut visuellt men tyckte att namnen på spelare kunde ha olika färger för att skilja på dem. Vid frågor om spelbarhet tyckte personen det fungerade bra funktionellt. Vid frågor om bot agerande tyckte personen bots agerade på ett varierat sätt, ibland lägger de sig, ibland går det all in, ibland satsar det lågt. 

### 3.2 Verktyg och Tekniker

Följande verktyg och tekniker användes:

* React
* TypeScript
* Tailwind
* Zustand
* Vite
* Git och GitHub
* GitHub Pages
* Visual Studio Code
* Claude free
* Chat GPT free
* Codex
* StackEdit

React användes för användargränssnittet medan TypeScript användes för att skapa tydligare datastrukturer och säkrare kod. Zustand användes för global state management. Tailwind för enklare styling. Vite För enklare setup av projekt. Git och GitHub för versionshantering.

GitHub Pages för att hosta projektet på github för att spela utan att klona repot. Visual Studio Code för utvecklingen av projektet. Claude free användes för att fråga komplexa frågor och få inpiration på olika lösning på problem som tex, bots, räkna ut resultat av hand. Chat GPT användes mest för enkla frågor för att inte slösa på Claude tokens eller när Claude tokens var slut.

Codex agent användes i stutspurten av projektet vid finslipningsdelen av visuella element och bots agerande. Mest som test av verktyget men var användbar vid situationer där det är små ändringar men små ändringar som omfattar flera filer på flera ställen och kräver context över hela projektet för att förstå. Bots är ett bra exempel på ett sådant problem.

StackEdit användes vid skrivandet av rapporten och allting MarkDown relaterat för en enklare online redigerare.



### 3.3 Datainsamling och Analys

Information samlades in genom dokumentation, tekniska artiklar och analys av existerande projekt. Projektets resultat analyserades genom att jämföra hur samma typ av spellogik skulle kunna struktureras i både funktionell och objektorienterad programmering.

Fokus låg på:

-   Kodstruktur
-   Läsbarhet
-   Underhållbarhet
-   Separation of concerns
-   Hantering av state och dataflöde

### 3.4 Kvalitetssäkring

För att säkerställa kvalitet genomfördes kontinuerliga tester under utvecklingen. Funktioner testades individuellt innan de integrerades i spelet.

Versionshantering genom Git användes för att dokumentera förändringar och möjliggöra återställning vid problem. TypeScript hjälpte även till att upptäcka typfel under utvecklingsprocessen.

Claude free användes för att fråga om lösningar var bra och vad som kunde förbättras.

En person testade spelet för att få en objektiv syn på pokerspelet.

---

## 4. Resultat

_Anpassa detta kapitel efter din typ av arbete:_

### 4.1 Huvudresultat

**För experimentella studier:**

- Mätresultat och data
- Statistisk analys
- Observationer från experiment

**För utvecklingsprojekt:**

- Beskrivning av utvecklad lösning
- Funktionalitet och egenskaper
- Testresultat

### 4.2 Detaljerade Fynd

Fördjupade resultat relevanta för dina frågeställningar.

### 4.3 Oväntade Resultat

Resultat som inte förväntades eller avvikelser från hypoteser.

_Presentera alla resultat objektivt utan värderingar - spara analysen till diskussionsavsnittet_

---

## 5. Diskussion

### 5.1 Analys av Resultat

- Uppfylldes arbetets syfte?
- Svarar resultaten på frågeställningarna?
- Jämförelse med befintlig forskning/lösningar

### 5.2 Reflektion över Metod

**För alla typer av arbeten:**

- Styrkor och svagheter i vald metod
- Problem och lösningar under arbetsgången
- Vad som fungerade bra/mindre bra
- Lärdomar från processen

### 5.3 Begränsningar och Kritisk Granskning

- Metodologiska begränsningar
- Tekniska eller teoretiska begränsningar
- Vad som kunde gjorts annorlunda
- Påverkan på resultatens tillförlitlighet

### 5.4 Bredare Perspektiv

- Implikationer för området
- Praktisk tillämpbarhet
- Teoretiskt bidrag

---

## 6. Slutsatser

### 6.1 Huvudslutsatser

Konkreta slutsatser baserade på resultaten:

- Tydliga svar på frågeställningarna
- Måluppfyllelse
- Nya insikter eller kunskap

### 6.2 Bidrag och Betydelse

- Vad tillför arbetet till området?
- Praktisk eller teoretisk betydelse
- Värde för yrkeskåren

### 6.3 Framtida Arbete

Förslag på:

- Vidareutveckling av forskning/utveckling
- Oresolerade frågor
- Nya forsknings-/utvecklingsområden
- Praktiska tillämpningar

---

## 7. Referenser

Använd valfri referenstil. Rekommentation: IEEE

I texten
• Använd hakparenteser med nummer: [1], [2], [3]
• Flera referenser: [1], [2], [3] eller [1]-[3]
• Numrera i den ordning de förekommer i texten

I referenslistan 

Artikel: [1] A. Author, B. Author, and C. Author, “Title
of article,” Title of Journal, vol. x, no. x, pp. xxx-xxx, Month Year.

Bok: [2] A. Author, Title of Book. City, State: Publisher, Year.

Webbsida: [3] Title of Website. Publisher. [Online]. Available:
http://www.website.com. [Accessed: Day Month Year].

Exempel I texten:
“Prestandan för neurala nätverk i Python har visat sig vara 30% bättre än
traditionella metoder [1].”

I referenslistan:
[1] K. Johnson and M. Smith, “Performance Analysis of Neural Networks in
Python,” Journal of Computer Science, vol. 12, no. 3, pp. 234-245, Mar. 2023.

---

## Bilagor

_Anpassa efter typ av arbete:_

**För teoretiska studier:**

- Bilaga A: Litteratursökning och urvalskriterier
- Bilaga B: Sammanställning av källor
- Bilaga C: Analysscheman

**För experimentella studier:**

- Bilaga A: Experimentdata
- Bilaga B: Testprotokoll
- Bilaga C: Statistiska beräkningar

**För utvecklingsprojekt:**

- Bilaga A: Källkod (utdrag eller repo-referens)
- Bilaga B: Teknisk dokumentation
- Bilaga C: Testresultat

**För alla typer:**

- Bilaga X: Projektplanering och tidsrapporter
