// Maps PDF TOC labels to word_data file keys.
// Used by pdf-extract when the normalized label doesn't directly match a wordKey.
export const pdfWordOverrides: Record<string, readonly string[]> = {
  // Häufige Wörter
  sum: ['summi'],
  'in / zu': ['lokaladverbInZ'],
  'nach / auf': ['lokalpräpositionNachUf'],
  'herauf und hinauf': ['heraufHinauf', 'herauf', 'hinauf'],
  // Haus und Garten
  begiessen: ['giessen'],
  Kochschürze: ['schürze'],
  // Essen und Trinken
  'Überrest eines Apfels': ['apfelüberrest'],
  Käsekruste: ['käsekrusteFondue'],
  Brotanschnitt: ['brotanfang'],
  Butter: ['butter', 'butterGenus', 'butterLexGenus'],
  Schokolade: ['schoggiGenus', 'schoggiLexem', 'schoggi_genus'],
  Schokoladenstängel: ['schoggistängeli'],
  // Mensch
  Quetschfleck: ['quetschfleck', 'quetschfleckPhonetisch'],
  // Gesellschaft
  Glasmurmeln: ['murmel'],
  Kosewort: ['kosename'],
  'Schlittschuh laufen': ['schlittschuhlaufen'],
  Spitznamen: [
    'spitznamenAnnaGenus',
    'spitznamenAnnaName',
    'spitznamenLukasGenus',
    'spitznamenLukasName',
  ],
  // Lautung – Vokale
  Wespe: ['wespeUmlaut'],
  Bett: ['bettPhon'],
  Käse: ['käse', 'kaese'],
  'Eis (Vokal)': ['vokalEis'],
  Brille: ['brille', 'brilleKonsonant'],
  'Rücken, Brücke, Mücke, drücken': [
    'umlautRücken',
    'umlautBrücke',
    'umlautMücke',
    'umlautDrücken',
  ],
  // Lautung – Konsonanten
  'Tag, Tanne (Anlaut)': ['tag', 'tanne'],
  'Tanne (Geminate)': ['tanne'],
  'Himmel (Geminate)': ['geminateHimmel'],
  Salz: ['lVokalisierungSalz'],
  folgen: ['lVokalisierungFolgen'],
  'Himmel (l-Vokalisierung)': ['lVokalisierungHimmel'],
  Strääl: ['lVokalisierungSträäl'],
  Sohle: ['lVokalisierungSohle'],
  finden: ['ndVelarisierungFinden'],
  'Eis (Konsonant)': ['konsonantEis'],
  Patrick: ['derPatrick'],
  // Grammatik – Verb
  'ich komme': ['kommen1SG'],
  'du kommst': ['kommen2SG'],
  'kommen (Plural)': ['kommenPlural'],
  'haben (Plural)': ['habenPlural'],
  'sein (Plural)': ['seinPlural'],
  'tragen, getragen': ['tragenInfinitivPartizip'],
  'kommen / werden': ['kommenWerden'],
  // Grammatik – Substantiv
  'Tanne Plural': ['tannePlural'],
  'Mann Plural': ['zweiMänner'],
  'Postauto Plural': ['postautoPl'],
  'Fliege, Sonne, Kerze, Brücke': ['bildung'],
  Hündchen: ['hundDiminuitiv'],
  // Grammatik – Adjektiv
  'alte Männer': ['altFlexion'],
  'die ganze Nacht': ['ganzFlexion'],
  spät: ['spätAdjektivAdverbKombi'],
  // Grammatik – Pronomen
  'dich / dir': ['dichDir'],
  'meine Cousine': ['meineCousine', 'michMir'],
  // Grammatik – Genus
  'zwei Männer, Frauen, Kinder': ['zahlwortZwei', 'zweiMänner'],
  'drei Männer, Frauen, Kinder': [
    'dreiMänner',
    'dreiFrauen',
    'dreiKinder',
    'dreiMFNKombi',
    'drei',
  ],
  // Grammatik – Satzbau
  'Mirjams Hut': ['mirjamsHut'],
  '(der) Patrick': ['derPatrick'],
  'gehen lassen': ['gehenLassenVergangenheit'],
  'gewesen bin': ['gewesenBin'],
  'Lass ihn gehen': ['lassIhnGehen', 'gehen1Sg'],
  'Es kommt regnen': ['kommtRegnen'],
  // Sprache im Alltag – Grussformeln
  'Grussformeln (morgens)': ['gruss01morgen'],
  'Grussformeln (mittags)': ['gruss02mittag'],
  'Grussformeln (nachmittags)': ['gruss03nami'],
  'Grussformeln (abends)': ['gruss04abend'],
  'Grussformeln (beim Wandern)': ['gruss05wandern'],
  'Grussformeln (am Telefon)': ['walter_benjamin'],
  'Verabschiedung (auf der Bank)': ['verabschiedenBank'],
  // Sprache im Alltag – Höflichkeit
  'Bedanken (im Bus)': ['busBedanken'],
  Dankeserwiderung: ['dankeserwiderung'],
  'Entschuldigen (beim Niesen)': ['entschuldigenNiesen'],
  'Duzen / Siezen (Vorgesetzte)': ['duzenSiezen'],
  // Native PDF outline uses simplified titles (without parenthetical qualifiers):
  Verabschiedung: ['verabschiedenBank'],
  Entschuldigen: ['entschuldigenNiesen'],
};

// Physical-page-based overrides for entries whose PDF outline title is too
// abbreviated or duplicated to resolve by title alone.
// Keys are physical page numbers (destpageposfrom1 from qpdf --json).
// Note: some l-Vokalisierung sub-entries (folgen, Himmel l-Vok, Strääl, Sohle)
// have no individual bookmarks in the PDF and therefore cannot be indexed.
export const pdfPageOverrides: Record<number, readonly string[]> = {
  // Wortschatz – "herauf" bookmark covers the full herauf/hinauf spread
  44: ['herauf', 'hinauf', 'heraufHinauf'],
  // Vokale – "Tanne" bookmark at p162 = Tanne (Schwa); p212 = Anlaut; p220 = Geminate
  162: ['tanneSchwa'],
  // Vokale – "Abend" bookmark appears twice (Vokal then Endung)
  164: ['abendVokal'],
  166: ['abendEndung'],
  // Vokale – "Eis" bookmark appears twice (Vokal then Konsonant)
  172: ['vokalEis'],
  // Konsonanten – "Tag, Tanne" bookmark = Anlaut analysis
  212: ['tag', 'tanne'],
  218: ['konsonantEis'],
  // Konsonanten – second "Tanne" = Geminate; tanne already in index from p212
  220: ['tanne'],
  // Konsonanten – "Himmel" = Himmel (Geminate)
  222: ['geminateHimmel'],
  // Grammatik Verb – "kommen/haben/sein" bookmarks drop the "(Plural)" qualifier
  262: ['kommenPlural'],
  264: ['habenPlural'],
  266: ['seinPlural'],
  // Grammatik Adjektiv – "alt" = alte Männer, "ganz" = die ganze Nacht
  292: ['altFlexion'],
  294: ['ganzFlexion'],
  // Pragmatik – all 6 Grussformeln bookmarks share the title "Grussformeln"
  340: ['gruss01morgen'],
  342: ['gruss02mittag'],
  344: ['gruss03nami'],
  346: ['gruss04abend'],
  348: ['gruss05wandern'],
  350: ['telefongruss', 'walter_benjamin', 'walterBenjamin'],
  // Pragmatik – "Verabschieden und bedanken" = Bedanken im Bus
  354: ['busBedanken'],
  308: ['drei'],
};

// TOC entries known to have no word_data match (overview/bibliography pages or
// grammatical sentence tests that don't correspond to any CSV-derived word):
export const knownUnmatchable = new Set([
  'Sprechgeschwindigkeit',
  'Gesamtbild der Dialekte',
  'Vergleichstext',
  'Dialektregionen',
  'Daniel Müller',
  'Der Geissbock ist wild',
  'Quellen',
]);

// Keep content inside parentheses but drop the parens themselves, then strip
// all non-alphanumeric chars so "(Vokal)" becomes "Vokal" in the result.
// This lets "Abend (Vokal)" normalize to "abendvokal" matching "abendVokal".
const normalize = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-zäöüáéíóú0-9]/g, '');

export const matchTocLabel = (
  label: string,
  availableWordKeys: readonly string[]
): readonly string[] | null => {
  if (label in pdfWordOverrides) return pdfWordOverrides[label];
  const normalized = normalize(label);
  const matched = availableWordKeys.filter(
    key => normalize(key) === normalized
  );
  return matched.length > 0 ? matched : null;
};
