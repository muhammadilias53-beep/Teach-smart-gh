// Official NaCCA Pedagogical Lesson Frames & Exemplars for TeachSmart Ghana

export interface LessonFrameItem {
  topic: string;
  activities: string[];
  keyWords: string[];
  resources: string[];
  assessment?: string;
}

export const SCIENCE_B7_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B7.1.1.1.1": {
    topic: "States and Properties of Matter",
    activities: [
      "Group learners to observe ice melting and water boiling to demonstrate changes in states of matter",
      "Guide learners to draw and model the particle arrangement in solids, liquids, and gases using local bottle caps and clay",
      "Lead a classroom discussion on everyday applications of changes of state in food preservation and distillation"
    ],
    keyWords: ["matter", "solid", "liquid", "gas", "particle arrangement", "melting", "evaporation", "condensation"],
    resources: ["Beakers", "Ice cubes", "Burner", "Thermometer", "Bottle caps", "Clay models"],
    assessment: "Draw and explain the particle theory for solids, liquids, and gases."
  },
  "B7.1.2.1.1": {
    topic: "Cells and Living Tissues",
    activities: [
      "Observe plant and animal cells under a light microscope or magnified digital slides",
      "Draw and label the cell wall, cell membrane, cytoplasm, nucleus, and chloroplast",
      "Compare the structures and functions of plant and animal cells in a Venn diagram"
    ],
    keyWords: ["cell", "tissue", "organ", "nucleus", "cytoplasm", "chloroplast", "vacuole"],
    resources: ["Light microscope", "Onion skin", "Iodine solution", "Microscope slides", "Cell charts"],
    assessment: "Tabulate three differences between plant and animal cells."
  },
  "B7.2.1.1.1": {
    topic: "Life Cycles of Flowering Plants",
    activities: [
      "Dissect a fresh Hibiscus or Pride of Barbados flower to identify reproductive parts (stamen, pistil)",
      "Demonstrate the process of pollination and fertilization through role-play and diagrams",
      "Observe seed germination under different environmental conditions (light, moisture, temperature)"
    ],
    keyWords: ["pollination", "fertilization", "stamen", "pistil", "germination", "dispersal"],
    resources: ["Fresh Hibiscus flowers", "Magnifying glasses", "Razor blades/scalpels", "Dissecting trays"],
    assessment: "Identify the male and female reproductive parts of a flower and state their functions."
  },
  "B7.3.1.1.1": {
    topic: "Human Body Systems - The Circulatory System",
    activities: [
      "Trace the path of blood circulation through the heart, lungs, and body on a 3D model",
      "Measure learners' resting pulse rates and compare with post-exercise pulse rates",
      "Discuss healthy dietary habits and aerobic exercises that support cardiovascular health"
    ],
    keyWords: ["circulation", "heart", "artery", "vein", "capillary", "pulse rate", "oxygenated blood"],
    resources: ["Stopwatch", "Human circulatory model", "Stethoscope", "Heart anatomy wall chart"],
    assessment: "Explain why pulse rate increases during physical exercise."
  },
  "B7.4.1.1.1": {
    topic: "Forms and Sources of Energy",
    activities: [
      "Identify renewable and non-renewable energy sources in Ghana (solar, hydro, biomass, fossil fuels)",
      "Construct a simple solar cooker or wind vane model using cardboard, foil, and straws",
      "Debate the environmental and economic impact of energy generation choices in Ghana"
    ],
    keyWords: ["renewable energy", "solar", "hydroelectric", "biomass", "energy conservation", "efficiency"],
    resources: ["Cardboard", "Aluminum foil", "Solar cell demonstration kit", "Energy conversion charts"],
    assessment: "Suggest three practical ways to conserve electricity in the home and school."
  }
};

export const SCIENCE_B8_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B8.1.1.1.1": {
    topic: "Atoms, Elements, and Compounds",
    activities: [
      "Build physical 3D models of simple molecules (H2O, CO2, NaCl) using colored plasticine and toothpicks",
      "Distinguish between elements, compounds, and mixtures using common lab samples",
      "Write chemical symbols and formulas for the first 20 elements of the periodic table"
    ],
    keyWords: ["atom", "molecule", "element", "compound", "mixture", "chemical symbol", "periodic table"],
    resources: ["Periodic table charts", "Colored plasticine", "Toothpicks", "Sample chemical compounds"],
    assessment: "Differentiate between a compound and a mixture with two examples of each."
  },
  "B8.3.1.1.1": {
    topic: "Respiratory and Excretory Systems",
    activities: [
      "Construct a bell jar and balloon lung model to simulate inhalation and exhalation mechanics",
      "Identify the main excretory organs (skin, lungs, kidneys, liver) and their waste products",
      "Analyze the dangers of smoking and air pollution on respiratory health"
    ],
    keyWords: ["respiration", "excretion", "inhalation", "exhalation", "kidneys", "lungs", "alveoli"],
    resources: ["Bell jar apparatus", "Balloons", "Rubber stoppers", "Excretory system diagrams"],
    assessment: "Describe the role of the diaphragm during inhalation."
  }
};

export const SCIENCE_B9_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B9.1.1.1.1": {
    topic: "Acids, Bases, and Neutralization",
    activities: [
      "Extract natural pH indicators from red cabbage and Hibiscus petals",
      "Test acidity and alkalinity of lemon juice, vinegar, wood ash solution, and soap using litmus paper",
      "Perform a neutralization reaction by mixing dilute acid and base to observe temperature changes"
    ],
    keyWords: ["acid", "base", "alkali", "pH scale", "neutralization", "litmus paper", "universal indicator"],
    resources: ["Litmus papers", "Red cabbage extract", "Lemon juice", "Soap solution", "Test tubes"],
    assessment: "State two properties of acids and two practical applications of neutralization."
  },
  "B9.4.1.1.1": {
    topic: "Electricity and Magnetism",
    activities: [
      "Connect simple series and parallel electrical circuits using batteries, bulbs, switches, and wires",
      "Map magnetic field lines around bar magnets using iron filings and compasses",
      "Build an electromagnet using an iron nail, copper wire, and a dry cell"
    ],
    keyWords: ["circuit", "current", "voltage", "series", "parallel", "magnetic field", "electromagnet"],
    resources: ["Dry cells", "Connecting wires", "Miniature bulbs", "Bar magnets", "Iron filings", "Compass"],
    assessment: "Explain why parallel circuits are preferred for household wiring."
  }
};

export const MATH_B7_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B7.1.1.1.1": {
    topic: "Sets and Set Operations",
    activities: [
      "Guide learners to define sets using listing and descriptive methods with classroom objects",
      "Demonstrate union, intersection, and complement of sets using two-set Venn diagrams",
      "Solve practical word problems involving two intersecting sets from daily market transactions"
    ],
    keyWords: ["set", "subset", "universal set", "union", "intersection", "complement", "Venn diagram"],
    resources: ["Venn diagram charts", "Set sorting cards", "Real-life item sets"],
    assessment: "Draw a Venn diagram to represent the union and intersection of two given sets."
  },
  "B7.1.2.1.1": {
    topic: "Fractions, Decimals, and Percentages",
    activities: [
      "Convert between improper fractions, mixed numbers, recurring decimals, and percentages",
      "Model fractional addition and subtraction using rectangular fraction strips and circular fraction wheels",
      "Apply percentage calculations to profit, loss, discount, and VAT in Ghanaian market contexts"
    ],
    keyWords: ["fraction", "decimal", "percentage", "equivalent", "simplification", "profit", "discount"],
    resources: ["Fraction strips", "Fraction circles", "Ghana cedi play money", "Price tag cards"],
    assessment: "Calculate the percentage discount on an item originally priced at GHS 120 sold for GHS 90."
  },
  "B7.2.1.1.1": {
    topic: "Algebraic Expressions and Linear Equations",
    activities: [
      "Translate word statements into algebraic expressions using variables, coefficients, and constants",
      "Simplify linear algebraic expressions by grouping like terms and applying the distributive law",
      "Solve one-variable linear equations using balance scales and algebraic inverse operations"
    ],
    keyWords: ["algebra", "variable", "coefficient", "constant", "expression", "linear equation"],
    resources: ["Balance scale", "Algebra tiles", "Equation flashcards"],
    assessment: "Solve the linear equation: 3x - 7 = 14."
  }
};

export const MATH_B1_B3_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B1.1.1.1.1": {
    topic: "Counting, Reading, and Writing Numbers up to 100",
    activities: [
      "Count physical bottle caps, seeds, and pebbles in groups of tens and ones",
      "Match number names to numeric digits using tactile flashcards",
      "Arrange numbers in ascending and descending order on a classroom number line"
    ],
    keyWords: ["count", "number", "tens", "ones", "place value", "ascending", "descending"],
    resources: ["Bottle caps", "Pebbles", "Number flashcards", "Classroom floor number track"],
    assessment: "Count and write the number of objects displayed."
  }
};

export const MATH_B4_B6_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B4.1.1.1.1": {
    topic: "Place Value and Operations with Whole Numbers up to 100,000",
    activities: [
      "Represent 5-digit numbers using Dienes blocks and place value abacuses",
      "Perform multi-digit column addition and subtraction with regrouping",
      "Estimate sums and differences to check the reasonableness of calculation results"
    ],
    keyWords: ["place value", "thousands", "regrouping", "estimation", "algorithm"],
    resources: ["Abacus", "Dienes blocks", "Place value charts"],
    assessment: "Write 45,672 in expanded form and round it to the nearest thousand."
  }
};

export const ENGLISH_B7_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B7.1.1.1.1": {
    topic: "Listening and Speaking - Conversation and Active Listening",
    activities: [
      "Engage learners in paired dialogue discussing environmental cleanliness in their community",
      "Practice active listening strategies by summarizing a peer's spoken argument without interruption",
      "Deliver a 2-minute impromptu speech on school values using audible tone and body posture"
    ],
    keyWords: ["dialogue", "active listening", "articulation", "intonation", "impromptu", "fluency"],
    resources: ["Audio recordings", "Speech cue cards", "Discussion prompt cards"],
    assessment: "Deliver a 2-minute speech with clear pronunciation and appropriate gestures."
  },
  "B7.2.1.1.1": {
    topic: "Reading Comprehension - Critical Reading Strategies",
    activities: [
      "Skim an informative passage on Ghanaian cultural festivals for general overview and scan for dates",
      "Annotate text with questions, unknown words, and main idea highlights in the margins",
      "Answer inferential and evaluative questions supported by direct textual evidence"
    ],
    keyWords: ["skimming", "scanning", "inference", "context clues", "main idea", "author's purpose"],
    resources: ["Reading passages", "Highlighters", "Graphic organizers"],
    assessment: "Identify the main idea of paragraph 2 and cite two supporting details."
  }
};

export const ENGLISH_B1_B6_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B1.1.1.1.1": {
    topic: "Oral Language - Songs, Rhymes, and Phonemic Awareness",
    activities: [
      "Sing traditional action rhymes emphasizing rhythm, clapping, and initial letter sounds",
      "Identify rhyming words from recited poems through call-and-response chanting",
      "Participate in show-and-tell describing a personal favorite toy or family member"
    ],
    keyWords: ["rhyme", "song", "listen", "sound", "action", "story"],
    resources: ["Picture storybooks", "Puppets", "Rhythm instruments"],
    assessment: "Recite a short rhyme with correct actions and identify two rhyming words."
  }
};

export const FRENCH_B4_B6_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B4.1.1.1.1": {
    topic: "Salutations et Présentations (Greetings and Introductions)",
    activities: [
      "Practice formal and informal greetings (Bonjour, Bonsoir, Salut) in paired role-play",
      "Introduce oneself using simple French sentence structures (Je m'appelle..., J'ai ... ans)",
      "Sing French alphabet and greeting songs with interactive actions"
    ],
    keyWords: ["Bonjour", "Salut", "Je m'appelle", "Comment ça va", "Merci", "Au revoir"],
    resources: ["French dialogue flashcards", "Audio pronunciation tracks", "Puppet props"],
    assessment: "Role-play a greeting and introduce yourself in French."
  }
};

export const GHANAIAN_LANGUAGE_B1_B3_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B1.1.1.1.1": {
    topic: "Listening and Speaking in the Mother Tongue",
    activities: [
      "Recite traditional proverbs, riddles, and folktales (Anansesem) in the Ghanaian mother tongue",
      "Demonstrate cultural greetings and respectful gestures (bowing, addressing elders) appropriately",
      "Discuss family lineage and community clan totems in interactive circle time"
    ],
    keyWords: ["Anansesem", "greeting", "elders", "culture", "clan", "community"],
    resources: ["Folktale storybooks", "Traditional cultural artifacts", "Audio recordings"],
    assessment: "Narrate a simple moral lesson from a shared Ananse story."
  }
};

export const KG_INTEGRATED_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "KG1.1.1.1.1": {
    topic: "All About Me - Parts of My Body and Self-Awareness",
    activities: [
      "Sing and touch body parts with 'Head, Shoulders, Knees and Toes'",
      "Trace learner hands and feet on cardboard to decorate personal identity posters",
      "Explore sensory stations (sight, hearing, touch, taste, smell) with safe classroom materials"
    ],
    keyWords: ["body", "eyes", "ears", "hands", "feet", "senses", "cleanliness"],
    resources: ["Mirrors", "Crayons", "Large butcher paper", "Sensory texture objects"],
    assessment: "Point to and name four parts of the body."
  }
};

export const OWOP_B1_B3_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B1.1.1.1.1": {
    topic: "All About Us - Personal Hygiene and Healthy Habits",
    activities: [
      "Demonstrate correct handwashing techniques using soap and running water (Veronica bucket)",
      "Role-play morning grooming routines (brushing teeth, bathing, combing hair)",
      "Identify clean and dirty environmental habits around the school compound"
    ],
    keyWords: ["hygiene", "cleanliness", "germs", "handwashing", "health", "water"],
    resources: ["Veronica bucket", "Soap", "Towels", "Hygiene sequence flashcards"],
    assessment: "Demonstrate the 6 steps of effective handwashing."
  }
};

export const OWOP_B4_B6_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B4.1.1.1.1": {
    topic: "Our Nation Ghana - Cultural Heritage and National Symbols",
    activities: [
      "Analyze the symbolism of the Ghana National Flag (Red, Gold, Green, Black Star) and Coat of Arms",
      "Recite and reflect upon the words of the National Anthem and National Pledge",
      "Map the 16 administrative regions of Ghana and their regional capitals on a blank outline map"
    ],
    keyWords: ["national flag", "black star", "coat of arms", "national pledge", "anthem", "heritage"],
    resources: ["Ghana national flag", "Coat of Arms poster", "Outline maps of Ghana"],
    assessment: "Explain the meaning of the colors of the Ghana flag."
  }
};

export const PE_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B7.1.1.1.1": {
    topic: "Locomotor and Non-Locomotor Movement Skills",
    activities: [
      "Perform warm-up dynamic stretches and cardio jogging around the athletic field",
      "Practice agility ladder drills, sprinting, skipping, and lateral jumping",
      "Cool down with rhythmic breathing and static muscle stretching"
    ],
    keyWords: ["locomotor", "agility", "coordination", "warm-up", "cool-down", "flexibility"],
    resources: ["Agility cones", "Whistle", "Stopwatch", "Jump ropes"],
    assessment: "Demonstrate proper running form and pacing during relay sprints."
  }
};

export const RME_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B7.1.1.1.1": {
    topic: "God's Creation and the Environment",
    activities: [
      "Compare the creation accounts in Christianity, Islam, and Traditional African Religion",
      "Take a nature walk around the school compound to observe and sketch living organisms",
      "Discuss human responsibility as stewards of the environment to curb illegal mining (galamsey) and deforestation"
    ],
    keyWords: ["creation", "stewardship", "environment", "sacred", "conservation", "nature"],
    resources: ["Holy Bible", "Holy Quran", "Nature observation journals", "Environmental posters"],
    assessment: "Explain two ways humans can care for God's creation."
  }
};
