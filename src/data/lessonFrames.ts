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

export const COMPUTING_B7_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B7.1.1.1.1": {
    topic: "Components of a Personal Computer and Peripheral Devices",
    activities: [
      "Demonstrate and identify the essential hardware components of a personal computer: System Unit, Monitor, Keyboard, Mouse, and secondary storage",
      "Group learners to classify hardware components into input, processing, output, and secondary storage units using physical peripherals and diagrams",
      "Guide learners in connecting external peripheral cables (USB, HDMI, VGA, power, audio) safely to appropriate system unit ports"
    ],
    keyWords: ["hardware", "system unit", "input device", "output device", "central processing unit (CPU)", "storage", "peripheral", "ports"],
    resources: ["Desktop computer system unit", "Keyboard", "Mouse", "Monitor", "Computer hardware anatomy poster", "Peripherals and cables"],
    assessment: "Classify five computer parts into input, processing, output, or storage devices and state their functions."
  },
  "B7.1.1.1.2": {
    topic: "Generations of Computers and Electronic Technology",
    activities: [
      "Examine the five generations of computers from First Generation (Vacuum Tubes) to Fifth Generation (Artificial Intelligence)",
      "Guide learners to create a comparative timeline matching computer generations with their primary electronic component, physical size, processing speed, and power consumption",
      "Discuss how the evolution of microprocessors has enabled modern smartphones, laptops, tablets, and wearable technology"
    ],
    keyWords: ["vacuum tube", "transistor", "integrated circuit (IC)", "microprocessor", "artificial intelligence", "generation", "timeline"],
    resources: ["Computer generations timeline chart", "Sample integrated circuit chips / motherboards", "Flashcards"],
    assessment: "State the primary electronic technology used in each of the first four generations of computers."
  },
  "B7.1.2.1.1": {
    topic: "Operating System Interface and Desktop Navigation",
    activities: [
      "Identify essential elements of the graphical user interface (GUI): Desktop background, Start Menu, Taskbar, Notification area, and Icons",
      "Demonstrate how to create, rename, copy, move, and organize files and hierarchical folders",
      "Practice launching applications, switching between open windows, and shutting down the computer properly"
    ],
    keyWords: ["operating system", "GUI", "desktop", "taskbar", "icon", "file management", "folder directory"],
    resources: ["Computer lab PCs / Laptops", "Windows / OS interface simulation sheets", "Projector"],
    assessment: "Create a folder on the desktop titled 'My Subject Notes' and save a text document inside it."
  },
  "B7.1.3.1.1": {
    topic: "Data, Sources, and Data Processing Cycle",
    activities: [
      "Differentiate between raw data and processed information using familiar Ghanaian examples (attendance tally vs. attendance register)",
      "Map the four stages of the Data Processing Cycle: Input -> Processing -> Output -> Storage",
      "Identify authentic primary and secondary data collection sources in school, commerce, and community administration"
    ],
    keyWords: ["data", "information", "data processing cycle", "input", "processing", "output", "storage"],
    resources: ["Data vs. Information comparison chart", "Sample student marks sheets", "Diagrams"],
    assessment: "Illustrate the data processing cycle with a real-world example from a school or market."
  },
  "B7.1.4.1.1": {
    topic: "Technology in the Community & Communication Gadgets",
    activities: [
      "Identify communication technologies and gadgets used in Ghanaian communities (smartphones, radio, satellite, optical fiber, wireless routers)",
      "Discuss the benefits and challenges of digital communication in education, healthcare, mobile money (MoMo), and agriculture",
      "Analyze responsible use of ICT tools and respectful communication etiquette in online spaces"
    ],
    keyWords: ["communication gadgets", "mobile money", "telecommunication", "digital literacy", "netiquette"],
    resources: ["Communication gadgets poster", "Sample modern and legacy phone devices", "Scenario cards"],
    assessment: "Mention three community sectors in Ghana positively transformed by digital communication technology."
  },
  "B7.2.1.1.1": {
    topic: "Introduction to Word Processing Tools",
    activities: [
      "Open word processing software (MS Word / Google Docs / Writer) and explore the Title Bar, Ribbon tabs, Ruler, and Status Bar",
      "Demonstrate basic text entry, selection techniques, font formatting (bold, italic, underline, font face, size, and font color)",
      "Format a short composition applying text alignment (left, center, right, justify) and save using appropriate file naming conventions"
    ],
    keyWords: ["word processor", "ribbon", "font formatting", "text alignment", "editing", "document save"],
    resources: ["Word processing software", "Sample formatted documents", "Keyboard shortcut charts"],
    assessment: "Format a 3-sentence paragraph using center alignment, bold heading, and size 14 font."
  },
  "B7.3.1.1.1": {
    topic: "Computer Networks, the Internet, and Web Browsing",
    activities: [
      "Distinguish between Local Area Networks (LAN) and Wide Area Networks (WAN) with practical school and banking scenarios",
      "Explore web browser features: Address bar, URL navigation, hyperlinks, search bar, back/forward buttons, and bookmarks",
      "Demonstrate practical internet search techniques using keywords to find educational research materials"
    ],
    keyWords: ["network", "LAN", "WAN", "Internet", "web browser", "URL", "search engine", "hyperlink"],
    resources: ["Network diagram charts", "Web browser interface illustrations", "Internet-connected devices"],
    assessment: "Define a computer network and state two differences between a LAN and a WAN."
  },
  "B7.3.2.1.1": {
    topic: "Cyber Safety, Digital Footprint, and Online Ethics",
    activities: [
      "Analyze online risks: phishing scams, malware, cyberbullying, password theft, and sharing personal information with strangers",
      "Guide learners to create robust, secure passwords combining letters, numbers, and symbols",
      "Discuss the concept of digital footprint and formulate classroom guidelines for responsible internet behavior"
    ],
    keyWords: ["cyber safety", "strong password", "digital footprint", "phishing", "cyberbullying", "privacy"],
    resources: ["Cyber safety case study cards", "Password security meter demonstration", "Poster board"],
    assessment: "List three essential cyber safety rules every student must follow when browsing online."
  },
  "B7.4.1.1.1": {
    topic: "Computational Thinking - Algorithms and Sequencing",
    activities: [
      "Define an algorithm as a finite sequence of precise, step-by-step instructions to accomplish a specific task",
      "Write sequential algorithms for daily activities (e.g. washing hands, preparing tea, booting a desktop PC)",
      "Demonstrate algorithm tracing and identify logic bugs in flawed step sequences"
    ],
    keyWords: ["computational thinking", "algorithm", "sequence", "step-by-step", "debugging", "logic"],
    resources: ["Algorithm task cards", "Flow sequence flashcards", "Whiteboard"],
    assessment: "Write a step-by-step algorithm containing at least 5 clear steps for sending an SMS message."
  },
  "B7.4.2.1.1": {
    topic: "Introduction to Flowcharts and Visual Symbols",
    activities: [
      "Introduce standard ANSI flowchart symbols: Oval (Start/End), Rectangle (Process), Parallelogram (Input/Output), Diamond (Decision), and Arrow lines",
      "Convert simple sequential algorithms into visual flowcharts using correct symbol shapes and directional arrows",
      "Guide learners in pairs to trace the flow of execution through a conditional decision branch"
    ],
    keyWords: ["flowchart", "terminator", "process symbol", "decision symbol", "input/output symbol", "flow lines"],
    resources: ["Flowchart symbol flashcards", "Flowchart stencils", "Graph paper"],
    assessment: "Draw standard flowchart symbols for Start/Stop, Process, and Decision, labeling each accurately."
  }
};

export const COMPUTING_B8_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B8.1.1.1.1": {
    topic: "Internal Components of the System Unit",
    activities: [
      "Open a decommissioned system unit to inspect the motherboard, processor heat sink, RAM slots, power supply unit (PSU), and expansion slots",
      "Explain the roles of volatile (RAM) and non-volatile memory (ROM, CMOS, Hard Drive/SSD)",
      "Discuss electrostatic discharge (ESD) precautions when handling internal computer hardware"
    ],
    keyWords: ["motherboard", "RAM", "ROM", "PSU", "expansion slot", "volatile memory", "heat sink"],
    resources: ["Opened desktop computer system unit", "Anti-static wrist strap", "RAM sticks", "Component chart"],
    assessment: "Differentiate between RAM and ROM with two key characteristics each."
  },
  "B8.2.1.1.1": {
    topic: "Spreadsheet Basics - Worksheets, Cells, and Formulas",
    activities: [
      "Navigate a spreadsheet application (MS Excel / Sheets) identifying rows, columns, active cells, and cell addresses",
      "Enter numeric data and write basic arithmetic formulas using addition (+), subtraction (-), multiplication (*), and division (/)",
      "Apply SUM and AVERAGE functions to calculate totals and class mark averages"
    ],
    keyWords: ["spreadsheet", "row", "column", "cell address", "formula", "function", "SUM", "AVERAGE"],
    resources: ["Spreadsheet software", "Sample grade sheet data", "Formula reference guide"],
    assessment: "Write the Excel formula to calculate the average of cells B2 through B10."
  },
  "B8.4.1.1.1": {
    topic: "Visual Block Programming with Scratch",
    activities: [
      "Explore the Scratch programming interface: Stage, Sprites, Script area, and Blocks palette",
      "Create an interactive animated sprite using Motion, Looks, and Sound blocks triggered by the Green Flag event",
      "Implement simple repeat loops and conditional statements (if-then) to control sprite movement"
    ],
    keyWords: ["Scratch", "sprite", "stage", "script", "event block", "loop", "conditional statement"],
    resources: ["Scratch 3.0 software / offline editor", "Coding activity flashcards", "Projector"],
    assessment: "Create a Scratch script that moves a sprite 10 steps forward and plays a sound when clicked."
  }
};

export const COMPUTING_B9_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B9.1.1.1.1": {
    topic: "Computer Storage Systems and Storage Media Management",
    activities: [
      "Compare primary and secondary storage media: Magnetic (HDD), Optical (CD/DVD), and Solid-State (SSD, Flash Drive, SD card)",
      "Calculate storage capacities converting between bits, bytes, kilobytes (KB), megabytes (MB), gigabytes (GB), and terabytes (TB)",
      "Demonstrate data backup strategies and formatting storage drives safely"
    ],
    keyWords: ["storage media", "SSD", "HDD", "byte", "kilobyte", "megabyte", "gigabyte", "backup"],
    resources: ["Storage devices sample kit", "Data capacity conversion chart", "Flash drives"],
    assessment: "How many megabytes (MB) are in 2 gigabytes (GB)? Show your working."
  },
  "B9.2.1.1.1": {
    topic: "Electronic Presentation Tools (MS PowerPoint)",
    activities: [
      "Create a multi-slide electronic presentation applying consistent slide layout, themes, and font hierarchy",
      "Insert multimedia elements: relevant images, audio narration, shapes, and tables into slides",
      "Apply subtle slide transitions and custom animations suitable for formal academic presentations"
    ],
    keyWords: ["presentation", "slide", "theme", "transition", "animation", "multimedia", "slideshow"],
    resources: ["Presentation software", "Sample presentation slides", "Projector"],
    assessment: "Create a 3-slide presentation on 'Safe Internet Use' with transitions and bullet points."
  },
  "B9.4.1.1.1": {
    topic: "Introductory Python Programming Concepts",
    activities: [
      "Introduce Python syntax: printing output (`print()`), assigning variables, and taking user text input (`input()`)",
      "Explore fundamental Python data types: String (`str`), Integer (`int`), and Float (`float`)",
      "Write a short Python program that asks for the user's name and age, then displays a personalized greeting"
    ],
    keyWords: ["Python", "syntax", "variable", "data type", "string", "integer", "print function", "input"],
    resources: ["Python IDLE / online compiler", "Python syntax quick-reference sheet", "Computers"],
    assessment: "Write a simple Python script to accept two numbers from a user and display their sum."
  }
};

export const COMPUTING_B4_B6_LESSON_FRAMES: Record<string, LessonFrameItem> = {
  "B4.1.1.1.1": {
    topic: "Parts of a Computer and Technology Tools",
    activities: [
      "Point to and name external computer parts: monitor, keyboard, mouse, system unit, and speakers",
      "Practice correct mouse gripping, clicking, double-clicking, and drag-and-drop actions through interactive games",
      "Demonstrate typing letters and numbers on the keyboard using home row finger placement"
    ],
    keyWords: ["monitor", "keyboard", "mouse", "system unit", "click", "double-click", "drag and drop"],
    resources: ["Desktop computers", "Mouse practice games", "Keyboard layout wall charts"],
    assessment: "Point to three parts of a computer and demonstrate how to double-click an icon."
  },
  "B5.1.1.1.1": {
    topic: "Input and Output Devices in Technology",
    activities: [
      "Classify classroom computing gadgets into devices that take in information (input) and devices that show information (output)",
      "Explore specialized input/output devices: barcode scanner, webcam, digital camera, speakers, and printer",
      "Role-play a supermarket checkout scenario demonstrating how barcode scanners and receipt printers work"
    ],
    keyWords: ["input", "output", "scanner", "printer", "speaker", "webcam", "display"],
    resources: ["Input/output flashcards", "Barcode scanner", "Sample receipts and printouts"],
    assessment: "Give two examples of input devices and two examples of output devices."
  },
  "B6.1.1.1.1": {
    topic: "Introduction to the Internet and Safe Browsing",
    activities: [
      "Discuss what the World Wide Web is and identify popular web browsers (Chrome, Firefox, Edge)",
      "Practice entering a web address (URL) into the address bar to open educational websites",
      "Learn basic internet safety: never share passwords, full names, or home addresses online"
    ],
    keyWords: ["Internet", "web browser", "website", "URL", "online safety", "privacy"],
    resources: ["Web browser demonstration", "Internet safety pledge chart", "Computers / tablets"],
    assessment: "Mention two safety precautions to take when using the Internet."
  }
};

/**
 * Centrally retrieve curriculum lesson frames strictly isolated by subject and class level.
 * Guarantees that frames from one subject (e.g. RME or Science) NEVER leak into another subject (e.g. Computing).
 */
export function getSubjectLessonFrame(
  subject?: string,
  classLevel?: string,
  indicatorCode?: string
): LessonFrameItem | null {
  if (!subject || !indicatorCode) return null;

  const rawCode = indicatorCode.split(':')[0].trim();
  const sub = subject.toLowerCase().trim();
  const cls = (classLevel || '').toLowerCase().trim();

  // 1. Computing / ICT Isolation
  if (sub.includes('comput') || sub.includes('ict')) {
    if (cls.includes('8') || rawCode.startsWith('B8')) {
      return COMPUTING_B8_LESSON_FRAMES[rawCode] || null;
    }
    if (cls.includes('9') || rawCode.startsWith('B9')) {
      return COMPUTING_B9_LESSON_FRAMES[rawCode] || null;
    }
    if (cls.includes('7') || rawCode.startsWith('B7')) {
      return COMPUTING_B7_LESSON_FRAMES[rawCode] || null;
    }
    if (
      cls.includes('4') || cls.includes('5') || cls.includes('6') ||
      rawCode.startsWith('B4') || rawCode.startsWith('B5') || rawCode.startsWith('B6')
    ) {
      return COMPUTING_B4_B6_LESSON_FRAMES[rawCode] || null;
    }
    return (
      COMPUTING_B7_LESSON_FRAMES[rawCode] ||
      COMPUTING_B8_LESSON_FRAMES[rawCode] ||
      COMPUTING_B9_LESSON_FRAMES[rawCode] ||
      COMPUTING_B4_B6_LESSON_FRAMES[rawCode] ||
      null
    );
  }

  // 2. Religious & Moral Education (RME) Isolation
  if (sub.includes('religio') || sub.includes('moral') || sub === 'rme') {
    return RME_LESSON_FRAMES[rawCode] || null;
  }

  // 3. Science Isolation
  if (sub.includes('science')) {
    if (cls.includes('8') || rawCode.startsWith('B8')) {
      return SCIENCE_B8_LESSON_FRAMES[rawCode] || null;
    }
    if (cls.includes('9') || rawCode.startsWith('B9')) {
      return SCIENCE_B9_LESSON_FRAMES[rawCode] || null;
    }
    return SCIENCE_B7_LESSON_FRAMES[rawCode] || null;
  }

  // 4. Mathematics Isolation
  if (sub.includes('math')) {
    if (cls.includes('1') || cls.includes('2') || cls.includes('3') || rawCode.startsWith('B1') || rawCode.startsWith('B2') || rawCode.startsWith('B3')) {
      return MATH_B1_B3_LESSON_FRAMES[rawCode] || null;
    }
    if (cls.includes('4') || cls.includes('5') || cls.includes('6') || rawCode.startsWith('B4') || rawCode.startsWith('B5') || rawCode.startsWith('B6')) {
      return MATH_B4_B6_LESSON_FRAMES[rawCode] || null;
    }
    return MATH_B7_LESSON_FRAMES[rawCode] || null;
  }

  // 5. English Isolation
  if (sub.includes('english')) {
    if (cls.includes('7') || rawCode.startsWith('B7')) {
      return ENGLISH_B7_LESSON_FRAMES[rawCode] || null;
    }
    return ENGLISH_B1_B6_LESSON_FRAMES[rawCode] || null;
  }

  // 6. French Isolation
  if (sub.includes('french')) {
    return FRENCH_B4_B6_LESSON_FRAMES[rawCode] || null;
  }

  // 7. Ghanaian Language Isolation
  if (sub.includes('ghanaian')) {
    return GHANAIAN_LANGUAGE_B1_B3_LESSON_FRAMES[rawCode] || null;
  }

  // 8. OWOP (Our World and Our People) Isolation
  if (sub.includes('our world') || sub === 'owop') {
    if (cls.includes('4') || cls.includes('5') || cls.includes('6') || rawCode.startsWith('B4') || rawCode.startsWith('B5') || rawCode.startsWith('B6')) {
      return OWOP_B4_B6_LESSON_FRAMES[rawCode] || null;
    }
    return OWOP_B1_B3_LESSON_FRAMES[rawCode] || null;
  }

  // 9. Physical Education (PE) Isolation
  if (sub.includes('physical') || sub === 'pe') {
    return PE_LESSON_FRAMES[rawCode] || null;
  }

  // 10. KG Integrated Curriculum Isolation
  if (cls.includes('kg') || sub.includes('integrated curriculum')) {
    return KG_INTEGRATED_LESSON_FRAMES[rawCode] || null;
  }

  // STRICT FAIL-CLOSED: NEVER return a frame from an unrelated subject
  return null;
}
