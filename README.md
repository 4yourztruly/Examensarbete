
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

Det finns många olika webbaserade kortspel och pokerapplikationer som använder moderna frontend-ramverk som React. 

### 2.3 Teknisk/Teoretisk Jämförelse

Analys av olika alternativ eller approaches inom ditt område.

_Använd källhänvisningar_

---

## 3. Metod och Genomförande

_Anpassa detta kapitel efter din typ av arbete:_

### 3.1 Övergripande Arbetsgång

Beskriv din systematiska approach:

**För experimentella studier:**

- Experimentdesign
- Testmiljö och verktyg
- Mätmetoder

**För utvecklingsprojekt:**

- Utvecklingsprocess (agile, iterativ etc.)
- Design och arkitektur
- Implementation och testning

### 3.2 Verktyg och Tekniker

**För praktiska studier:**

- Programmeringsverktyg
- Testverktyg och mätinstrument
- Utvecklingsmiljöer

### 3.3 Datainsamling och Analys

**För experimentella arbeten:**

- Experimentuppställning
- Datainsamlingsmetoder
- Statistiska metoder

**För utvecklingsprojekt:**

- Requirements gathering
- Teststrategier
- Utvärderingsmetoder

### 3.4 Kvalitetssäkring

- Metodkvalitet och tillförlitlighet
- Validering av resultat
- Hantering av bias eller fel

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
