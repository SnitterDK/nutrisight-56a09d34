# Keto, glukose og kræft — et evidensbaseret afsnit på forsiden

## Mål
Et tydeligt, tidligt placeret afsnit på forsiden der forklarer hvorfor det er værd at holde øje med kulhydrat-/glukosebelastning — også i forbindelse med kræft — formuleret som uddannelse med rigtige videnskabelige kilder, ikke som behandlingsløfte.

## Placering
Nyt afsnit indsættes på forsiden lige efter hero/MTP og før den eksisterende "Why visual nutrition matters" — altså tidligt, men ikke som det allerførste man ser. Det eksisterende keto-afsnit længere nede beholdes som den dybere forklaring.

## Indhold i afsnittet
1. **Overskrift + kort intro**: "Hvorfor glukose er værd at holde øje med" — kræftceller har typisk et stærkt forhøjet glukoseoptag (Warburg-effekten), og det er derfor PET-scanninger bruger radioaktiv sukker til at finde tumorer. Det er etableret biologi og et godt konkret billede på hvorfor kulhydratbelastning er værd at forstå.
2. **Tre korte kort — "Hvad forskningen viser":**
   - Etableret: ketogen kost er standardbehandling ved medicinresistent epilepsi; forbedrer blodsukkerkontrol ved type 2-diabetes.
   - Under udforskning: små kliniske studier af ketogen kost og faste som *supplement* til standard kræftbehandling (fx ERGO-studiet ved glioblastom; fasting-mimicking-studier under kemoterapi). Resultater er lovende men foreløbige.
   - Ikke bevist: ingen kost kan behandle eller kurere kræft. Utilsigtet vægttab under sygdom kan være skadeligt.
3. **Kildeliste med links** (åbnes i nyt vindue, `rel="noopener noreferrer"`):
   - National Cancer Institute PDQ — ernæring i kræftbehandling
   - Weber et al., *Molecular Metabolism* 2020 — "Ketogenic diet in the treatment of cancer"
   - Rieger et al., *Int J Oncol* 2014 — ERGO-studiet (ketogen kost ved glioblastom)
   - de Groot et al., *Nature Communications* 2020 — fasting-mimicking diæt under kemoterapi
   - Public Health Collaboration / Dr. David Unwin (allerede linket på siden)
   Hvert link verificeres som levende før det udgives; kilder der ikke kan verificeres, udelades.
4. **Sikkerhedsboks** (fremhævet, ikke skjult i bunden): NutriSight er uddannelse, ikke medicinsk rådgivning. Tal altid med din læge/onkolog før kostændringer under kræftbehandling, graviditet, type 1-diabetes eller ved spiseforstyrrelse i anamnesen.

## Sprog og tone
Ingen påstande om at kost "sulter kræft væk" eller helbreder. Formuleringer som "forskere undersøger", "foreløbige resultater", "supplement til — ikke erstatning for — standardbehandling".

## Teknisk
- Ny komponent `src/components/GlucoseCancerFocus.tsx` bygget på den eksisterende `Section`-komponent og designtokens (ingen hardcodede farver).
- Indsættes i `src/routes/index.tsx` mellem hero-blokken og `<NutritionEducation />`.
- Forsidens `head()` udvides med 2–3 FAQ-poster i den eksisterende JSON-LD `FAQPage` (fx "Kan en ketogen kost behandle kræft?") så svaret også kan hentes af AI-søgning — med samme forsigtige formulering.
- Ingen ændringer i database, scanner-logik eller AI-prompts.

## Verifikation
Efter implementering: tjek afsnittet på mobil (402px) og desktop i preview, bekræft at alle kildelinks svarer, og at typecheck er grøn.
