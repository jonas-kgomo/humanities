export type ClaimStub = {
  id: string;
  text: string;
};

export type LibraryPaper = {
  id: string;
  title: string;
  author: string;
  note?: string;
  moduleSlugs: string[];
  claims: ClaimStub[];
};

/** Curated mini-library for the apply demo — claim stubs are one-liners, not summaries. */
export const claimLibrary: LibraryPaper[] = [
  {
    id: "trouillot-silencing",
    title: "Silencing the Past",
    author: "Michel-Rolph Trouillot",
    note: "1995",
    moduleSlugs: ["historical-inquiry"],
    claims: [
      {
        id: "c1",
        text: "Silences enter historical production at the making of sources, archives, narratives, and retrospective significance.",
      },
      {
        id: "c2",
        text: "What is missing from a record is often an achievement of power, not an accident of storage.",
      },
      {
        id: "c3",
        text: "Digitising an archive does not by itself restore the voices it never collected.",
      },
    ],
  },
  {
    id: "risam-new-digital-worlds",
    title: "New Digital Worlds",
    author: "Roopika Risam",
    note: "2018",
    moduleSlugs: ["historical-inquiry", "social-inquiry-design-evaluation"],
    claims: [
      {
        id: "c1",
        text: "Digital humanities is already geopolitical: whose languages and institutions define the field.",
      },
      {
        id: "c2",
        text: "Access projects can reproduce colonial extraction if communities do not set the terms.",
      },
      {
        id: "c3",
        text: "A project’s success should be judged from the worlds it claims to represent, not only from its interface.",
      },
    ],
  },
  {
    id: "fricker-epistemic-injustice",
    title: "Epistemic Injustice",
    author: "Miranda Fricker",
    note: "2007",
    moduleSlugs: ["philosophical-inquiry", "social-inquiry-design-evaluation"],
    claims: [
      {
        id: "c1",
        text: "People can be wronged specifically in their capacity as knowers.",
      },
      {
        id: "c2",
        text: "Testimonial injustice systematically discounts speakers from certain social positions.",
      },
      {
        id: "c3",
        text: "Who counts as an epistemic authority in a digital project is itself a justice question.",
      },
    ],
  },
  {
    id: "yuk-hui-cosmotechnics",
    title: "The Question Concerning Technology in China",
    author: "Yuk Hui",
    note: "2019",
    moduleSlugs: ["philosophical-inquiry"],
    claims: [
      {
        id: "c1",
        text: "Technology is not culturally neutral; different cosmotechnics are possible.",
      },
      {
        id: "c2",
        text: "A single default technical order risks locking in one moral-technical world.",
      },
      {
        id: "c3",
        text: "Local institutions should be able to revise what a tool is for, not only how it is deployed.",
      },
    ],
  },
  {
    id: "moretti-distant-reading",
    title: "Distant Reading",
    author: "Franco Moretti",
    note: "2013",
    moduleSlugs: ["literary-linguistic-inquiry"],
    claims: [
      {
        id: "c1",
        text: "Some literary-historical questions are only visible at a scale no close reading can occupy.",
      },
      {
        id: "c2",
        text: "A model of a corpus is an interpretation, not a substitute for the text.",
      },
      {
        id: "c3",
        text: "Distance is a condition of knowledge, not a failure to read carefully.",
      },
    ],
  },
  {
    id: "hayles-how-we-think",
    title: "How We Think",
    author: "N. Katherine Hayles",
    note: "2012",
    moduleSlugs: ["literary-linguistic-inquiry", "philosophical-inquiry"],
    claims: [
      {
        id: "c1",
        text: "Humanistic thought is already technogenetic: tools change how interpretation happens.",
      },
      {
        id: "c2",
        text: "Print-centred habits of reading are not the only legitimate humanities method.",
      },
      {
        id: "c3",
        text: "Machine-aided reading still requires a human who can say what would count as a finding.",
      },
    ],
  },
  {
    id: "drucker-graphesis",
    title: "Graphesis",
    author: "Johanna Drucker",
    note: "2014",
    moduleSlugs: ["artistic-inquiry"],
    claims: [
      {
        id: "c1",
        text: "Visualisation is knowledge production, not a transparent window onto data.",
      },
      {
        id: "c2",
        text: "Graphical form carries an argument about order, cause, and importance.",
      },
      {
        id: "c3",
        text: "A polished interface can be a failure if it hides uncertainty the interpreter still needs.",
      },
    ],
  },
  {
    id: "kirschenbaum-mechanisms",
    title: "Mechanisms",
    author: "Matthew Kirschenbaum",
    note: "2008",
    moduleSlugs: ["artistic-inquiry", "historical-inquiry"],
    claims: [
      {
        id: "c1",
        text: "Inscription is material: storage, formats, and forensic traces are part of the text.",
      },
      {
        id: "c2",
        text: "A digital object’s behaviour is evidence, not only its displayed contents.",
      },
      {
        id: "c3",
        text: "Specification for implementers should include what the system must not flatten.",
      },
    ],
  },
  {
    id: "dignazio-klein-data-feminism",
    title: "Data Feminism",
    author: "Catherine D’Ignazio and Lauren Klein",
    note: "2020",
    moduleSlugs: ["social-inquiry-design-evaluation", "artistic-inquiry"],
    claims: [
      {
        id: "c1",
        text: "Data science that ignores power will reproduce it under a banner of neutrality.",
      },
      {
        id: "c2",
        text: "Who does the counting, and who is counted, is a design decision.",
      },
      {
        id: "c3",
        text: "Evaluation should include whose labour and whose risk the system depends on.",
      },
    ],
  },
  {
    id: "liu-cultural-criticism",
    title: "Where Is Cultural Criticism in the Digital Humanities?",
    author: "Alan Liu",
    note: "2012",
    moduleSlugs: ["social-inquiry-design-evaluation"],
    claims: [
      {
        id: "c1",
        text: "Digital humanities that only builds tools, without cultural criticism, is incomplete.",
      },
      {
        id: "c2",
        text: "Technical collaborators should be able to state what a system cannot reliably deliver.",
      },
      {
        id: "c3",
        text: "A project that cannot be contested in humanities terms has not yet been evaluated.",
      },
    ],
  },
];

function shuffle<T>(items: T[], seed: string): T[] {
  const arr = [...items];
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    const j = Math.abs(h) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Pick three papers for the applicant — prefer module match, fill from the rest. */
export function drawPapersForModule(moduleSlug: string, seed: string) {
  const preferred = claimLibrary.filter((p) =>
    p.moduleSlugs.includes(moduleSlug),
  );
  const others = claimLibrary.filter((p) => !p.moduleSlugs.includes(moduleSlug));
  const ordered = [
    ...shuffle(preferred, seed + ":pref"),
    ...shuffle(others, seed + ":rest"),
  ];
  return ordered.slice(0, 3);
}

export function getPaper(id: string) {
  return claimLibrary.find((p) => p.id === id);
}
