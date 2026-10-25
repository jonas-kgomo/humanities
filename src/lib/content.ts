export const site = {
  name: "Centre for Digital Humanities",
  shortName: "CDH",
  tagline: "Inquiry + Design + Evaluation",
  description:
    "The Centre connects historical, philosophical, literary, linguistic, artistic, and social inquiry with technical design and evaluation.",
  missionLead:
    "Humanities researchers formulate the questions, select methods, interpret findings, and determine what a successful system should do.",
};

export const partners = [
  {
    name: "University of Johannesburg",
    short: "UJ",
    role: "Humanities & postgraduate leadership",
  },
  {
    name: "Loyola University Chicago",
    short: "Loyola",
    role: "Ethics & interdisciplinary scholarship",
  },
  {
    name: "Sciences Po",
    short: "Sciences Po",
    role: "Education, inquiry & public life",
  },
  {
    name: "Equiano Institute",
    short: "Equiano",
    role: "Institution-building & technical collaboration",
  },
] as const;

export const nav = [
  { href: "/about", label: "About" },
  { href: "/teaching", label: "Teaching" },
  { href: "/people", label: "People" },
  { href: "/fellowship", label: "Fellowship" },
  { href: "/symposium", label: "Symposium" },
  { href: "/readings", label: "Readings" },
] as const;

export type Person = {
  name: string;
  institution: string;
  role: string;
  focus: string;
  image?: string;
};

export const people: Person[] = [
  {
    name: "Prof. Catherine F. Botha",
    institution: "University of Johannesburg",
    role: "Consortium Lead",
    focus:
      "Philosophy of mind, ethics, and contemporary philosophy. Extensive experience supervising postgraduate researchers and leading interdisciplinary academic initiatives.",
    image: "/people/catherine-f-botha.jpg",
  },
  {
    name: "Dr. Diana Acosta Navas",
    institution: "Loyola University Chicago",
    role: "Consortium Partner",
    focus:
      "Philosophy, ethics, and interdisciplinary scholarship connecting philosophical inquiry to broader societal and technological questions.",
    image: "/people/diana-acosta-navas.jpg",
  },
  {
    name: "Sarah Nicole",
    institution: "Sciences Po",
    role: "Consortium Partner",
    focus:
      "Teaches Critical Thinking in the Age of AI in the Master's programme in Finance & Strategy. Bridges philosophy, education, governance, and emerging AI challenges.",
    image: "/people/sarah-nicole.jpg",
  },
  {
    name: "Jonas Kgomo",
    institution: "Equiano Institute; Cosmos Fellow",
    role: "Consortium Partner",
    focus:
      "AI governance, philosophy, and institution-building, with experience convening interdisciplinary collaborations and developing international research initiatives.",
    image: "/people/jonas-kgomo.jpg",
  },
  {
    name: "Dr. Asheel Singh",
    institution: "University of Johannesburg",
    role: "Consortium Partner",
    focus:
      "Applied ethics, bioethics, population ethics, environmental ethics, meaning in life, African philosophy, and Eastern philosophical approaches.",
  },
];

export type Reading = {
  title: string;
  author?: string;
  note?: string;
};

export type CurriculumUnit = {
  id: string;
  title: string;
  topics: string[];
  readings: Reading[];
};

export type CurriculumModule = {
  number: number;
  slug: string;
  title: string;
  summary: string;
  units: CurriculumUnit[];
};

export const curriculumModules: CurriculumModule[] = [
  {
    number: 1,
    slug: "historical-inquiry",
    title: "Historical Inquiry",
    summary:
      "Digitisation is not a neutral transfer of the past. The Centre treats archives, corpora, and timelines as arguments — asking who was recorded, what was discarded, and how technical pipelines inherit those choices.",
    units: [
      {
        id: "1.1",
        title: "Archives, Provenance, and Missing Records",
        topics: [
          "Provenance as a research question, not only a metadata field",
          "Silences in the archive: what digitisation cannot recover, and what it can pretend to",
          "Periodisation and the politics of the timeline",
        ],
        readings: [
          {
            title: "Silencing the Past",
            author: "Michel-Rolph Trouillot",
            note: "1995, Chs. 1–2",
          },
          {
            title: "New Digital Worlds",
            author: "Roopika Risam",
            note: "2018, Chs. 1–2",
          },
          {
            title: "Confronting the Digital",
            author: "Tim Hitchcock",
            note: "Cultural and Social History, 2013",
          },
        ],
      },
      {
        id: "1.2",
        title: "Digitisation as Interpretation",
        topics: [
          "OCR, encoding, and cataloguing as editorial acts",
          "Colonial collections: when access and extraction travel together",
          "What a ‘complete’ digital collection claims, and what it hides",
        ],
        readings: [
          {
            title: "Mechanisms",
            author: "Matthew Kirschenbaum",
            note: "2008, Introduction & Ch. 1",
          },
          {
            title: "Raw Data Is an Oxymoron",
            author: "Lisa Gitelman, ed.",
            note: "2013, Introduction",
          },
        ],
      },
      {
        id: "1.3",
        title: "Historical Questions Technical Systems Can Hold",
        topics: [
          "Formulating a historical question that a corpus study can actually test",
          "Selecting methods whose limits are visible to other historians",
          "What counts as a finding when the source base is partial",
        ],
        readings: [
          {
            title: "Distant Horizons",
            author: "Ted Underwood",
            note: "2019, Chs. 1–2",
          },
          {
            title: "Making a Case for the Black Digital Humanities",
            author: "Kim Gallon",
            note: "Debates in the Digital Humanities, 2016",
          },
        ],
      },
    ],
  },
  {
    number: 2,
    slug: "philosophical-inquiry",
    title: "Philosophical Inquiry",
    summary:
      "Before a system is built, someone must say what the question is, what would count as an answer, and what must not be delegated to a metric. Philosophy here is not commentary after the fact — it sets the terms of design and evaluation.",
    units: [
      {
        id: "2.1",
        title: "Questions, Methods, and Success Criteria",
        topics: [
          "Who formulates the research question, and who may revise it once implementation starts",
          "What a successful system should do — and who is authorised to say so",
          "The difference between a measurement and an interpretation",
        ],
        readings: [
          {
            title: "Epistemic Injustice",
            author: "Miranda Fricker",
            note: "2007, Chs. 1–2",
          },
          {
            title: "Situated Knowledges",
            author: "Donna Haraway",
            note: "1988",
          },
        ],
      },
      {
        id: "2.2",
        title: "Technology as a Mode of Inquiry",
        topics: [
          "Instrumental vs. constitutive accounts of technical tools",
          "Cosmotechnics and the refusal of a single default technical order",
          "What systems can reliably deliver, and what they can only simulate",
        ],
        readings: [
          {
            title: "The Question Concerning Technology",
            author: "Martin Heidegger",
            note: "1954",
          },
          {
            title: "The Question Concerning Technology in China",
            author: "Yuk Hui",
            note: "2019, Introduction",
          },
          {
            title: "Technology and the Lifeworld",
            author: "Don Ihde",
            note: "1990, Chs. 1–3",
          },
        ],
      },
      {
        id: "2.3",
        title: "Judgment That Should Not Be Automated",
        topics: [
          "Non-delegable interpretive stakes in historical, literary, and ethical work",
          "When a model’s fluency is mistaken for understanding",
          "Writing evaluation criteria that a humanist can still refuse",
        ],
        readings: [
          {
            title: "On the Dangers of Stochastic Parrots",
            author: "Emily M. Bender, Timnit Gebru, Angelina McMillan-Major, and Shmargaret Shmitchell",
            note: "FAccT, 2021",
          },
          {
            title: "Meaning in Life",
            author: "Thaddeus Metz",
            note: "2013, Chs. 2–3",
          },
        ],
      },
    ],
  },
  {
    number: 3,
    slug: "literary-linguistic-inquiry",
    title: "Literary and Linguistic Inquiry",
    summary:
      "Close reading and computational methods ask different things of a text. The Centre treats corpus design, annotation, and language-model analysis as literary and linguistic arguments — not as a substitute for reading.",
    units: [
      {
        id: "3.1",
        title: "Close Reading, Distant Reading, and Scale",
        topics: [
          "What distant reading can show that a single text cannot",
          "What is lost when scale becomes the only warrant",
          "Building a corpus as an interpretive claim, not a data dump",
        ],
        readings: [
          {
            title: "Distant Reading",
            author: "Franco Moretti",
            note: "2013, selected essays",
          },
          {
            title: "Distant Horizons",
            author: "Ted Underwood",
            note: "2019, Chs. 3–4",
          },
        ],
      },
      {
        id: "3.2",
        title: "Language, Variation, and Models of Text",
        topics: [
          "Dialect, register, and the fiction of a standard corpus",
          "Annotation schemes that smuggle a theory of genre or identity",
          "Machine translation and low-resource languages: consent, loss, and authority",
        ],
        readings: [
          {
            title: "How We Think",
            author: "N. Katherine Hayles",
            note: "2012, Chs. 1–3",
          },
          {
            title: "On the Dangers of Stochastic Parrots",
            author: "Emily M. Bender et al.",
            note: "2021 — sections on language and documentation",
          },
        ],
      },
      {
        id: "3.3",
        title: "Evaluating Text Systems Without Surrendering the Text",
        topics: [
          "An evaluation a close reading can still falsify",
          "When fluency, BLEU, or preference scores are the wrong success measure",
          "What technical collaborators must implement — and what they must not flatten",
        ],
        readings: [
          {
            title: "How We Think",
            author: "N. Katherine Hayles",
            note: "2012, Chs. 4–6",
          },
          {
            title: "What’s Next: The Radical, Unrealized Potential of Digital Humanities",
            author: "Miriam Posner",
            note: "Debates in the Digital Humanities, 2016",
          },
        ],
      },
    ],
  },
  {
    number: 4,
    slug: "artistic-inquiry",
    title: "Artistic Inquiry",
    summary:
      "Interfaces, visualisations, and collections are arguments in form. Artistic inquiry here means specifying what should be built, how it should look and behave, and where a polished system would be a failure.",
    units: [
      {
        id: "4.1",
        title: "Interface and Visualisation as Argument",
        topics: [
          "Graphical form as interpretation, not illustration",
          "What a dashboard claims about order, cause, and importance",
          "Designing displays that keep uncertainty visible",
        ],
        readings: [
          {
            title: "Graphesis",
            author: "Johanna Drucker",
            note: "2014, Chs. 1–2",
          },
          {
            title: "The Language of New Media",
            author: "Lev Manovich",
            note: "2001, Introduction",
          },
        ],
      },
      {
        id: "4.2",
        title: "Making, Specification, and Refusal",
        topics: [
          "Writing a brief a technical collaborator can implement without guessing the argument",
          "When not to build: refusal as a design outcome",
          "Material constraints — file formats, platforms, labour — as part of the work",
        ],
        readings: [
          {
            title: "Mechanisms",
            author: "Matthew Kirschenbaum",
            note: "2008, Chs. 2–3",
          },
          {
            title: "Graphesis",
            author: "Johanna Drucker",
            note: "2014, Chs. 3–4",
          },
        ],
      },
      {
        id: "4.3",
        title: "Audiences, Exhibition, and Critique",
        topics: [
          "Who the work is for, and who can contest its form",
          "Exhibition, performance, and scholarly publication as different evaluations",
          "Critiquing a system in the terms of art, not only usability",
        ],
        readings: [
          {
            title: "The Language of New Media",
            author: "Lev Manovich",
            note: "2001, Part II",
          },
          {
            title: "Race After Technology",
            author: "Ruha Benjamin",
            note: "2019, Chs. 1–2",
          },
        ],
      },
    ],
  },
  {
    number: 5,
    slug: "social-inquiry-design-evaluation",
    title: "Social Inquiry, Design, and Evaluation",
    summary:
      "Technical collaborators implement, measure, and state what systems can and cannot reliably deliver. Humanities researchers decide whether that delivery answers a question worth asking — and for whom.",
    units: [
      {
        id: "5.1",
        title: "Who the Work Is For",
        topics: [
          "Stakeholders, excluded voices, and the social life of a dataset",
          "Community collaboration versus extraction dressed as access",
          "Institutional incentives that reward shipping over interpretation",
        ],
        readings: [
          {
            title: "Data Feminism",
            author: "Catherine D’Ignazio and Lauren Klein",
            note: "2020, Chs. 1–3",
          },
          {
            title: "Algorithms of Oppression",
            author: "Safiya Umoja Noble",
            note: "2018, Chs. 1–2",
          },
        ],
      },
      {
        id: "5.2",
        title: "Design with Interpreters in the Loop",
        topics: [
          "A working arrangement: humanities set the question; engineering states the constraint",
          "Measurement plans that do not replace judgment",
          "Documentation that another scholar could contest",
        ],
        readings: [
          {
            title: "Where Is Cultural Criticism in the Digital Humanities?",
            author: "Alan Liu",
            note: "Debates in the Digital Humanities, 2012",
          },
          {
            title: "What’s Next: The Radical, Unrealized Potential of Digital Humanities",
            author: "Miriam Posner",
            note: "2016",
          },
        ],
      },
      {
        id: "5.3",
        title: "Labour, Institutions, and Lasting Infrastructure",
        topics: [
          "The work of maintenance: who keeps a project alive after the demo",
          "Credit, authorship, and invisible technical labour",
          "Building capacity across institutions, especially where infrastructure is thin",
        ],
        readings: [
          {
            title: "Technology and the Virtues",
            author: "Shannon Vallor",
            note: "2016, selected chapters",
          },
          {
            title: "New Digital Worlds",
            author: "Roopika Risam",
            note: "2018, Chs. 3–4",
          },
        ],
      },
    ],
  },
];

/** Home / research theme cards — derived from curriculum modules. */
export const themes = curriculumModules.map((module) => ({
  slug: module.slug,
  title: module.title,
  summary: module.summary,
  detail: module.units.map((unit) => unit.title).join(" · "),
  refs: module.units.flatMap((unit) =>
    unit.readings.slice(0, 1).map((r) =>
      r.author ? `${r.author}, ${r.title}` : r.title,
    ),
  ),
}));

export const philosophyCoreReadings: (Reading & { note: string })[] = [
  {
    title: "The Question Concerning Technology",
    author: "Martin Heidegger",
    note: "Treats technology as a mode of revealing rather than a pile of tools — a starting point for asking what digital methods do to inquiry itself.",
  },
  {
    title: "How We Think",
    author: "N. Katherine Hayles",
    note: "Maps the shift from print-centred humanities to technogenetic practices of reading, writing, and interpretation alongside machines.",
  },
  {
    title: "New Digital Worlds",
    author: "Roopika Risam",
    note: "Argues that digital humanities is already geopolitical: whose archives, languages, and institutions get to define the field.",
  },
  {
    title: "Graphesis",
    author: "Johanna Drucker",
    note: "Shows visualisation as knowledge production. A graph is an argument, not a transparent window onto data.",
  },
  {
    title: "Fragment on Machines",
    author: "Karl Marx",
    note: "A reminder that automated systems reorganise labour and authority — including the labour of interpretation.",
  },
];

/** Aggregated reading library for /readings — module key readings + core set. */
export const readings = [
  ...curriculumModules.map((module) => ({
    category: module.title,
    items: dedupeReadings(
      module.units.flatMap((unit) =>
        unit.readings.map((r) => ({
          title: r.title,
          author: r.author,
          note: r.note ?? `Module ${module.number} · ${unit.title}`,
        })),
      ),
    ),
  })),
  {
    category: "Philosophy Core Readings",
    items: philosophyCoreReadings,
  },
];

function dedupeReadings(items: Reading[]): Reading[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.author ?? ""}::${item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const teachings = [
  {
    title: "Critical Thinking in the Age of AI",
    institution: "Sciences Po",
    programme: "Master's in Finance & Strategy",
    lead: "Sarah Nicole",
    description:
      "A graduate seminar exploring how AI reshapes judgment, evidence, and decision-making — and what critical thinking requires when machines participate in knowledge production.",
  },
  {
    title: "Digital Humanities Research Seminar",
    institution: "University of Johannesburg",
    programme: "Postgraduate Research Seminar",
    lead: "Prof. Catherine F. Botha",
    description:
      "Close reading, method, and research supervision on how historical, philosophical, and literary questions should govern digital projects — with emphasis on building research capacity across Africa.",
  },
  {
    title: "Ethics, Technology & Society",
    institution: "Loyola University Chicago",
    programme: "Interdisciplinary Seminar",
    lead: "Dr. Diana Acosta Navas",
    description:
      "Philosophical inquiry into the ethical stakes of technical systems, connecting classical ethical frameworks to contemporary design and institutional questions.",
  },
  {
    title: "Methods & Evaluation Reading Group",
    institution: "Equiano Institute / Consortium",
    programme: "Open consortium series",
    lead: "Jonas Kgomo",
    description:
      "A cross-institutional reading group on what humanities questions require of implementation and measurement — and what technical systems cannot reliably deliver.",
  },
] as const;

export const fellowshipProjects = [
  {
    title: "Historical methods",
    body: "Stage a small archive or corpus study and document the interpretive limits of the source base.",
  },
  {
    title: "Philosophy",
    body: "Write a position paper on what would count as a successful system in your domain — and who decides.",
  },
  {
    title: "Literary & linguistic methods",
    body: "Design an evaluation that a close reading or a speaker community could still falsify.",
  },
  {
    title: "Artistic specification",
    body: "Write a brief for a technical collaborator: what to implement, how it should behave, and what to refuse.",
  },
  {
    title: "Social evaluation",
    body: "Map who is served and who is excluded by a proposed digital method in your institution or region.",
  },
] as const;

export const fellowshipSeminarFormats = [
  {
    title: "Weekly seminars (2 hours)",
    body: "Humanities foundations and technical constraints in the same room.",
  },
  {
    title: "Guest lectures (monthly)",
    body: "Scholars, designers, archivists, and engineers from partner institutions.",
  },
  {
    title: "Peer teaching",
    body: "Fellows present methods and works-in-progress to each other.",
  },
  {
    title: "Reading groups",
    body: "Structured engagement with difficult texts.",
  },
] as const;

export const fellowshipCommunity = [
  {
    title: "Monthly cohort calls",
    body: "Peer support and cross-project learning.",
  },
  {
    title: "Conference attendance",
    body: "Digital humanities, STS, and related scholarly meetings.",
  },
  {
    title: "Mentorship",
    body: "One-to-one guidance from senior researchers.",
  },
  {
    title: "Alumni network",
    body: "Ongoing connections after the fellowship.",
  },
] as const;

export const fellowshipHighlights = [
  "Guided research projects (choose 2–3)",
  "Weekly seminars & monthly guest lectures",
  "Peer teaching and reading groups",
  "Mentorship from senior researchers",
  "Cross-institutional cohort & alumni network",
] as const;

export const symposiumActivities = [
  "Paper presentations",
  "Keynote lectures",
  "Panel discussions",
  "Networking and future collaboration",
] as const;

/** Planted hollow paragraph for applicants to critique — deliberately AI-generic. */
export const fellowshipAiBaitParagraph =
  "Digital humanities is crucial for the future of knowledge. By leveraging interdisciplinary frameworks and fostering inclusive dialogue across stakeholders, we can unlock transformative insights into culture, data, and innovation. Cutting-edge collaboration will empower researchers to navigate uncertainty and drive responsible digital transformation at scale.";

export const fellowshipApplicationQuestions = [
  {
    id: "scene",
    label: "A concrete scene from the last 90 days",
    help: "Describe one moment — a seminar, archive visit, code review, editorial meeting, or conversation — that changed how you think about a digital method or a humanities question. Name the place and what you got wrong before it. No general mission statements.",
    maxWords: 150,
  },
  {
    id: "critique",
    label: "Mark what is hollow",
    help: "The boxed paragraph below is deliberately generic. Quote two phrases that sound impressive but say almost nothing, and rewrite the claim in plain words as you would actually defend it — or say why you would refuse to defend it.",
    maxWords: 160,
    showBait: true,
  },
  {
    id: "reading",
    label: "A real disagreement with a text",
    help: "Name one paper or chapter you actually read (author + title). State the claim you reject, in one sentence, then why — tied to an argument in the text, not a vibe.",
    maxWords: 140,
  },
  {
    id: "module",
    label: "Weakest assumption in a CDH module — for your context",
    help: "Pick one curriculum module. Name the assumption that travels least well into your institution, region, or discipline. What would have to be true for that module to matter where you work?",
    maxWords: 140,
  },
  {
    id: "failure",
    label: "How this fellowship would fail you",
    help: "Be specific about your constraints: time, language, institutional pressure, or intellectual mismatch. What would make the year a waste for you personally?",
    maxWords: 100,
  },
] as const;
