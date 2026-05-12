export const subjects = [
  "English", 
  "Mathematics", 
  "Science", 
  "Social Studies", 
  "Computing", 
  "Career Technology", 
  "RME", 
  "Creative Arts", 
  "French", 
  "Ghanaian Language", 
  "Elective Mathematics", 
  "Physics", 
  "Chemistry", 
  "Biology", 
  "Economics", 
  "Geography", 
  "History", 
  "Government", 
  "CRS", 
  "IRS", 
  "Literature in English", 
  "Financial Accounting", 
  "Cost Accounting", 
  "Business Management", 
  "Agricultural Science", 
  "Elective ICT", 
  "Food & Nutrition", 
  "Graphic Design"
];

export const levels = ["KG", "Primary", "JHS", "SHS"];

export const GHANA_REGIONS = [
  "Greater Accra", "Ashanti", "Central", "Eastern", "Western", 
  "Northern", "Upper East", "Upper West", "Volta", "Bono", 
  "Bono East", "Ahafo", "Savannah", "North East", "Oti", "Western North"
];

export const CLASSES_BY_LEVEL: Record<string, string[]> = {
  "KG": ["KG 1", "KG 2"],
  "Primary": ["Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6"],
  "JHS": ["Basic 7", "Basic 8", "Basic 9"],
  "SHS": ["Basic 10", "Basic 11", "Basic 12"]
};

export const SUBJECT_STRANDS: Record<string, string[]> = {
  "Mathematics": ["Number", "Algebra", "Geometry and Measurement", "Handling Data"],
  "Elective Mathematics": ["Algebra", "Trigonometry", "Calculus", "Coordinate Geometry", "Statics and Probability", "Vectors and Mechanics"],
  "Science": ["Diversity of Matter", "Cycles", "Systems", "Forces and Energy", "Humans and the Environment"],
  "Physics": ["Mechanics", "Thermal Physics", "Waves", "Electricity and Magnetism", "Atomic and Nuclear Physics"],
  "Chemistry": ["Atomic Structure", "Chemical Bonding", "Physical Chemistry", "Inorganic Chemistry", "Organic Chemistry", "Chemistry and Environment"],
  "Biology": ["Cell Biology", "Genetics", "Physiology", "Ecology", "Plant Biology", "Diversity of Life"],
  "English": ["Oral Language", "Reading", "Grammar Usage at Word and Phrase Levels", "Writing", "Writing Conventions and Grammar Usage", "Extensive Reading"],
  "History": ["History as a Subject", "My Country Ghana", "Europeans in Ghana", "Colonisation and Developments under Colonial Rule in Ghana", "Journey to Independence", "Independent Ghana"],
  "Social Studies": ["Environment", "Family Life", "Sense of Purpose", "Law and Order", "Socio-Economic Development", "Nationhood"],
  "Computing": [
    "Introduction to Computing", 
    "Word Processing", 
    "Presentation", 
    "Desktop Publishing", 
    "Programming and Databases", 
    "Internet and Social Media", 
    "Health and Safety in Using ICT Tools"
  ],
  "Creative Arts": ["Visual Arts", "Performing Arts"],
  "Financial Accounting": ["Financial Statements", "Partnership Accounts", "Company Accounts", "Cost Accounting Basics"],
  "Cost Accounting": ["Introduction to Cost Accounting", "Elements of Costing", "Materials Costing", "Labour and Overhead Costing", "Job and Batch Costing"],
  "Business Management": ["Nature of Management", "Functional Areas of Management", "Legal Environment of Business"],
  "French": ["L'Identité", "Parler de son Environnement", "Exprimer ses Goûts et ses Préférences", "Les Activités"],
  "Ghanaian Language": ["Customs and Institutions", "Listening and Speaking (GL)", "Reading (GL)", "Language and Usage", "Composition Writing", "Literature (GL)"],
  "Agricultural Science": ["Introduction to Agriculture", "Soil Science", "Crop Science", "Animal Science", "Agricultural Economics and Extension"],
  "Elective ICT": ["Information Systems", "Computer Architecture", "Networking and Data Communications", "Software Development", "Web and Multimedia Development"],
  "CRS": ["Biblical Studies", "History of the Church", "Ethics and Moral Life"],
  "IRS": ["Al-Quran", "Al-Hadith", "Al-Fiqh", "Islamic History"],
  "Literature in English": ["Introduction to Literature", "African Prose", "Non-African Prose", "African Poetry", "Non-African Poetry", "Drama"]
};

export const SUBJECT_SUB_STRANDS: Record<string, string[]> = {
  // Mathematics
  "Number": ["Number and Numeration Systems", "Number Operations", "Fractions, Decimals and Percentages", "Number: Ratios and Proportion"],
  "Algebra": ["Patterns and Relationships", "Algebraic Expressions", "Variables and Equations"],
  "Geometry and Measurement": ["Shapes and Space", "Measurement", "Position and Transformation"],
  "Handling Data": ["Data", "Chance or Probability"],
  
  // Science
  "Diversity of Matter": ["Materials", "Living Cells"],
  "Cycles": ["Earth Science", "Life Cycle of Organisms", "Crop Production", "Animal Production"],
  "Systems": ["The Human Body System", "The Solar System", "Ecosystem", "Farming Systems"],
  "Forces and Energy": ["Energy", "Electricity and Electronics", "Conversion and Conservation of Energy", "Force and Motion", "Agricultural Tools"],
  "Humans and the Environment": ["Waste Management", "Human Health", "Science and Industry", "Climate Change and Green Economy", "Understanding the Environment", "Soil as a Component of the Environment"],
  
  // English
  "Oral Language": ["Songs", "Rhymes", "Poems", "Story Telling", "Dramatisation and Role Play", "Conversation", "Listening Comprehension", "Asking and Answering Questions", "Giving and Following Commands", "Presentation"],
  "Reading": ["Pre-reading activities", "Phonics", "Word Families", "Diphthongs", "Blends and Consonant Clusters", "Vocabulary", "Comprehension", "Silent Reading", "Fluency", "Summarising"],
  "Grammar Usage at Word and Phrase Levels": ["Nouns", "Determiners", "Pronouns", "Adjectives", "Verbs", "Adverbs", "Idiomatic Expressions", "Conjunctions", "Modals", "Prepositions", "Adjective Phrase", "Adverb Phrase", "Direct and Reported Speech"],
  "Writing": ["Pre-writing Activities", "Penmanship/Handwriting", "Writing Letters", "Labeling Items", "Writing Simple Words and Sentences", "Paragraph Development", "Controlled Writing", "Guided Composition", "Writing as a Process", "Narrative Writing", "Creative/Free Writing", "Descriptive Writing", "Persuasive/Argumentative Writing", "Informative/Academic Writing", "Letter Writing"],
  "Writing Conventions and Grammar Usage": ["Capitalization", "Punctuation", "Naming Words", "Action Words", "Qualifying Words", "Simple Prepositions", "Conjunctions", "Sentences", "Spelling"],
  "Extensive Reading": ["Building the Love and Culture of Reading"],
  
  // History
  "History as a Subject": ["Why and how we study history", "The learner’s own history", "Family History", "Community History"],
  "My Country Ghana": ["The People of Ghana", "Inter-Group Relations", "How Ghana got its name", "Major Historical locations", "Some selected Individuals"],
  "Europeans in Ghana": ["Arrival of Europeans", "International trade including Slave Trade", "Missionary Activities", "Impact of European presence"],
  "Colonisation and Developments under Colonial Rule in Ghana": ["Establishing Colonial rule in Ghana", "Social Development", "Economic Development", "Political Development"],
  "Journey to Independence": ["Early Protest Movements", "Formation of Political Parties", "The 1948 riots", "Ghana gains independence"],
  "Independent Ghana": ["The Republics", "Military Rule"],
  
  // Social Studies
  "Environment": [
    "Environmental Issues", 
    "Mapping Skills", 
    "Understanding our Natural World", 
    "Our Natural and Human Resources"
  ],
  "Family Life": [
    "Adolescent Reproductive Health", 
    "The Family", 
    "Socialisation", 
    "Population"
  ],
  "Sense of Purpose": [
    "Self-Identity", 
    "The Individual and the Community", 
    "Culture and National Identity"
  ],
  "Law and Order": [
    "Citizenship and Human Rights", 
    "Conflict Prevention and Management", 
    "The 1992 Constitution", 
    "Peace and Security in Our Nation", 
    "Promoting Democracy and Political Stability"
  ],
  "Socio-Economic Development": [
    "Human Resource Development", 
    "Social Security and Pension", 
    "Tourism", 
    "Science and Technology"
  ],
  "Nationhood": [
    "Independent Ghana", 
    "The Republics"
  ],
  
  // Computing
  "Introduction to Computing": ["Generation of computers and parts of a computer and other gadgets", "Introduction to MS-Windows Interface", "Data, sources and usage", "Technology in the community (communication)"],
  "Word Processing": ["Introduction to Word Processing", "Tabs and ribbons of word processing"],
  "Presentation": ["Introduction to MS-PowerPoint", "Tabs and ribbons of MS-PowerPoint"],
  "Desktop Publishing": ["Introduction to MS-Publisher"],
  "Programming and Databases": ["Introduction to databases, algorithm and programming", "Introduction to programming languages (e.g. MS-Excel, Scratch, VB dot Net etc.)", "Introduction to Electronic Spreadsheet", "Tabs and ribbons manipulation"],
  "Internet and Social Media": ["Network Overview", "Web browsers and Web Pages", "Surfing the world wide web", "Favourite places and Search engine", "Using Online Forms", "Customising your browser", "Electronic Email", "Internet of things (IoT)", "Digital Literacy", "Network Etiquette"],
  "Health and Safety in Using ICT Tools": ["Health and safety in using ICT tools"],

  // Creative Arts
  "Visual Arts": ["Thinking and exploring ideas", "Planning, making and composing", "Displaying and sharing", "Appreciating and appraising"],
  "Performing Arts": ["Thinking and exploring ideas", "Planning, making and composing", "Displaying and sharing", "Appreciating and appraising"],

  // Career Technology
  "Health and Safety": ["Personal Hygiene and Food Hygiene", "Personal, Workshop and Food laboratory safety", "Environmental Health"],
  "Materials for Production": ["Compliant Materials", "Resistant Materials", "Smart and Modern Materials", "Food Commodities (animal and plant sources)"],
  "Tools, Equipment and Processes": ["Measuring and Marking Out", "Cutting/Shaping", "Joining and Assembling", "Kitchen Essentials", "Finishes and Finishing"],
  "Technology": ["Simple Structures and Mechanisms, Electric and Electronic Systems"],
  "Designing and Making of Artefacts/Products": ["Communicating Designs", "Designing", "Planning for making Artefacts/Products", "Making Artefacts from Compliant, Resistant Materials and Food Ingredients"],
  "Entrepreneurial Skills": ["Career Pathways and Career Opportunities", "Establishing and Managing a Small Business Enterprise"],
  // RME
  "God, His Creation and Attributes": ["God, His Nature and Attributes", "The Creation Stories", "The Purpose and Usefulness of God's Creation"],
  "Religious Practices": ["Worship", "Religious Songs and Recitations", "Rites of Passage", "Religious Festivals"],
  "The Family and the Community": ["Family Systems", "Authority and Obedience", "Religion and Social Cohesion"],
  "Religious Leaders and Personalities": ["Religious Leaders", "Prophets and Caliphs", "Women in Religion"],
  "Ethics and Moral Life": ["Manners and Decency", "Substance Abuse", "Moral Teachings", "Reward, Punishment and Repentance"],
  "Religion and Economic Life": ["Work and Entrepreneurship", "Money", "Bribery and Corruption", "Time and Leisure"],

  // Ghanaian Language
  "Customs and Institutions": ["Rites of Passage", "Naming Systems", "The Clan System", "Chieftaincy"],
  "Listening and Speaking (GL)": ["Conversation/Everyday discourse", "Listening Comprehension", "Speech sounds", "Tone", "Vocabulary development", "Presentation"],
  "Reading (GL)": ["Reading", "Translation"],
  "Language and Usage": ["Sentence", "Integrating grammar (nouns, pronouns, adjectives)", "Integrating grammar (verbs, adverbs, conjunctions, postpositions/prepositions)", "Vocabulary (spelling and punctuations)"],
  "Composition Writing": ["Structure and organise ideas in composition writing"],
  "Literature (GL)": ["Oral and written literature"],

  // French
  "L'Identité": ["Saluer et prendre congé", "Se présenter", "Présenter quelqu'un", "Décrire quelqu'un", "Décrire la famille et les liens familiaux"],
  "Parler de son Environnement": ["Parler de sa maison", "Parler de son école"],
  "Exprimer ses Goûts et ses Préférences": ["Dire ce que l’on aime", "Dire ce que l’on n’aime pas"],
  "Les Activités": ["Compter et faire des calculs simples", "Demander et donner l’heure", "Parler des jours de la semaine", "Situer les mois et les saisons dans le temps", "Entrer en contact par téléphone", "Inviter quelqu’un et accepter une invitation", "Identifier les professions et les métiers", "Demander et expliquer la position de personnes ou d’objets", "Donner et répondre à des ordres"],

  "Thermal Physics": ["Heat Transfer", "Thermodynamics"],

  // Chemistry
  "Atomic Structure": ["Subatomic Particles", "Electron Configuration"],
  "Chemical Bonding": ["Ionic Bonding", "Covalent Bonding", "Metallic Bonding"]
};

export const SUB_STRAND_STANDARDS: Record<string, Record<string, string[]>> = {
  "Number": {
    "Number and Numeration Systems": ["B7.1.1.1: Demonstrate understanding and the use of place value", "B8.1.1.1: Use place value for expressing quantities in standard form", "B9.1.1.1: Apply the understanding of place value in solving real life problems"],
    "Number Operations": ["B7.1.2.1: Apply mental mathematics strategies", "B8.1.2.1: Apply mental mathematics strategies", "B9.1.2.1: Apply mental mathematics and properties"],
    "Fractions, Decimals and Percentages": ["B7.1.3.1: Simplify, compare and order a mixture of positive fractions", "B8.1.3.1: Apply the understanding of operation on fractions", "B9.1.3.1: Apply the understanding of operations on fractions"],
    "Number: Ratios and Proportion": ["B7.1.4.1: Demonstrate an understanding of the concept of ratios", "B8.1.4.1: Demonstrate an understanding of ratio, rate and proportions", "B9.1.4.1: Apply the understanding of ratio, rate and proportions"]
  },
  "Algebra": {
    "Patterns and Relationships": ["B7.2.1.1: Derive the rule for a set of points of a relation", "B8.2.1.1: Determine the gradient of the line", "B9.2.1.1: Construct tables of values for pairs of linear relations"],
    "Algebraic Expressions": ["B7.2.2.1: Simplify algebraic expressions", "B8.2.2.1: Solve problems involving algebraic expressions", "B9.2.2.1: Demonstrate an understanding of change of subject"],
    "Variables and Equations": ["B7.2.3.1: Demonstrate an understanding of linear equations", "B8.2.3.1: Demonstrate an understanding of linear inequalities", "B9.2.3.1: Demonstrate understanding of single variable linear inequalities"]
  },
  "Geometry and Measurement": {
    "Shapes and Space": ["B7.3.1.1: Demonstrate understanding of angles", "B8.3.1.1: Relationship between parallel lines and alternate angles", "B9.3.1.1: Apply properties of angles at a point"],
    "Measurement": ["B7.3.2.1: Find the perimeter of plane shapes", "B8.3.2.1: Apply Pythagoras theorem", "B9.3.2.1: Determine the surface area of prisms"],
    "Position and Transformation": ["B7.3.3.1: Perform a single transformation (reflection and translation)", "B8.3.3.1: Perform a single transformation (rotation)", "B9.3.3.1: Perform an enlargement on a geometrical shape"]
  },
  "Handling Data": {
    "Data": ["B7.4.1.1: Select, justify, and use appropriate methods to collect data", "B8.4.1.1: Construct and interpret frequency tables", "B9.4.1.1: Construct and interpret frequency tables and histogram"],
    "Chance or Probability": ["B7.4.2.1: Identify the sample space for a probability experiment", "B8.4.2.1: Identify the sample space for a probability experiment (independent events)", "B9.4.2.1: Identify the sample space for a probability experiment (dependent events)"]
  },
  "Environment": {
    "Environmental Issues": [
      "B7.1.1.1: Demonstrate skills in dealing with environmental challenges",
      "B8.1.1.1: Demonstrate skills in dealing with environmental challenges (Water Pollution)",
      "B9.1.1.1: Demonstrate skills in dealing with environmental challenges (Air Pollution)"
    ],
    "Mapping Skills": [
      "B7.1.2.1: Demonstrate a range of mapping skills",
      "B8.1.2.1: Demonstrate skills in sketching maps and interpreting landscapes from maps"
    ],
    "Understanding our Natural World": [
      "B7.1.3.1: Show understanding of the world around us",
      "B7.1.3.2: Assess the issue of natural disasters and their management",
      "B8.1.3.1: Demonstrate understanding of the significance of weather and climate to the environment",
      "B8.1.3.2: Demonstrate understanding of natural disasters and their management"
    ],
    "Our Natural and Human Resources": [
      "B9.1.4.1: Investigate the natural and human resources around us"
    ]
  },
  "Family Life": {
    "Adolescent Reproductive Health": [
      "B7.2.1.1: Demonstrate understanding of adolescent behaviour and reproductive health issues"
    ],
    "The Family": [
      "B8.2.2.1: Show understanding of the family and family life issues",
      "B9.2.2.1: Evaluate the institution of marriage in Ghana",
      "B9.2.2.2: Assess the need for responsible parenting in the family"
    ],
    "Socialisation": [
      "B7.2.3.1: Exhibit knowledge of the importance of socialisation"
    ],
    "Population": [
      "B7.2.4.1: Analyse the population structure in Ghana and its related issues",
      "B8.2.4.1: Analyse the population structure in Ghana and its related issues (Comparison)",
      "B9.2.4.1: Analyse the population structure in Ghana and its related issues (Development)"
    ]
  },
  "Sense of Purpose": {
    "Self-Identity": [
      "B7.3.1.1: Show understanding of self as a unique individual"
    ],
    "The Individual and the Community": [
      "B8.3.2.1: Demonstrate knowledge of the role of the individual in the community"
    ],
    "Culture and National Identity": [
      "B9.3.3.1: Evaluate the place of culture in national identity"
    ]
  },
  "Law and Order": {
    "Citizenship and Human Rights": [
      "B7.4.1.1: Analyse the responsibilities of a citizen",
      "B8.4.1.1: Investigate the rights and responsibilities of a citizen"
    ],
    "Conflict Prevention and Management": [
      "B8.4.2.1: Analyse ways of preventing and managing conflict"
    ],
    "The 1992 Constitution": [
      "B9.4.3.1: Assess the relevance of the 1992 Constitution"
    ],
    "Peace and Security in Our Nation": [
      "B9.4.4.1: Assess the role of peace and security in national development"
    ],
    "Promoting Democracy and Political Stability": [
      "B9.4.5.1: Show understanding of how to promote democracy and political stability",
      "B9.4.5.2: Demonstrate understanding of the District Assembly concept in Ghana",
      "B9.4.5.3: Evaluate the importance of political stability in Ghana’s development"
    ]
  },
  "Socio-Economic Development": {
    "Human Resource Development": [
      "B7.5.1.1: Demonstrate knowledge of human resource development in Ghana"
    ],
    "Social Security and Pension": [
      "B7.5.2.1: Demonstrate understanding of social security and pension issues",
      "B8.5.2.1: Demonstrate understanding of employer and employee relations in social security and pension",
      "B9.5.2.1: Show understanding of the provisions under National Pensions Act 766 and PNDC Law 247"
    ],
    "Tourism": [
      "B7.5.3.1: Demonstrate knowledge on how tourism and leisure promote national development",
      "B8.5.3.1: Evaluate tourism as an important economic sector for national development"
    ],
    "Science and Technology": [
      "B9.5.4.1: Analyse the contribution of science and technology to national development"
    ]
  },
  "Nationhood": {
    "Independent Ghana": [
      "B7.6.1.1: Demonstrate understanding of how Ghana became an independent nation"
    ],
    "The Republics": [
      "B8.6.2.1: Analyse the main developments in the Republics between 1960 and 1972",
      "B9.6.2.1: Demonstrate understanding that Ghana had two republics between 1979 and 2000"
    ]
  },
  "Diversity of Matter": {
    "Materials": [
      "B7.1.1.1: Recognise materials as important resources for providing human needs",
      "B7.1.1.2: Understand the periodic table as different elements made up of metals, non-metals and noble gases arranged in an order",
      "B8.1.1.1: Identify types of mixtures by name and characteristics",
      "B8.1.1.2: Describe atoms as composed of sub-atomic particles",
      "B9.1.1.1: Show an understanding of formation of binary chemical compounds and their uses (Acids, Bases and Salts)",
      "B9.1.1.2: Demonstrate knowledge of atomic bonding in the formation of chemical compounds"
    ],
    "Living Cells": [
      "B7.1.2.1: Demonstrate understanding of the structure of organisms and functions of cells in living systems",
      "B8.1.2.1: Demonstrate an understanding of the types of cells and their structure in relation to different organisms",
      "B9.1.2.1: Demonstrate knowledge of specialist cells of dicotyledonous plants and humans, their formation and functions"
    ]
  },
  "Forces and Energy": {
    "Energy": [
      "B7.4.1.1: Demonstrate an understanding of forms of energy and their daily applications",
      "B7.4.1.2: Demonstrate an understanding of the concept of heat transfer and its applications in life",
      "B7.4.1.3: Demonstrate understanding of characteristics of light, such as travelling in a straight line, reflection, refraction and dispersion",
      "B8.4.1.1: Demonstrate the skill to evaluate the conversion of energy from one form to another",
      "B8.4.1.2: Show an understanding of the sources of renewable energy and how to manage these sources in a sustainable manner",
      "B8.4.1.3: Demonstrate an understanding of the relationship between heat and temperature",
      "B9.4.1.1: Show understanding of the concept of conservation of energy and ways of conserving energy",
      "B9.4.1.2: Demonstrate understanding in and the capability to do calculations involving energy",
      "B9.4.1.3: Evaluate the application of light energy in life"
    ],
    "Electricity and Electronics": [
      "B7.4.2.1: Demonstrate understanding of forms of electricity, its generation and effects on the environment",
      "B7.4.2.2: Demonstrate knowledge of how to assemble and explain the functions of basic electronic components and their interdependence in an electronic circuit",
      "B8.4.2.1: Demonstrate knowledge of electricity transmission",
      "B8.4.2.2: Demonstrate understanding of the functions of capacitors in relation to LEDs, Diodes and resistors in electronic circuits",
      "B9.4.2.1: Construct electrical circuits and illustrate how electrical energy is transformed into other forms of energy and perform electrical calculations",
      "B9.4.2.2: Demonstrate an understanding of Forward and Reverse Bias and explain the behaviour of LEDs, Diodes, Resistors and Capacitors in electronic circuits"
    ],
    "Conversion and Conservation of Energy": [
      "B7.4.3.1: Demonstrate an understanding of the principle of conservation and conversion of energy and their application in real life situations",
      "B8.4.3.1: Evaluate the impact of conversion of energy and energy conservation on the environment",
      "B9.4.3.1: Show an understanding of conversion and conservation of energy and their application to life"
    ],
    "Force and Motion": [
      "B7.4.4.1: Examine the concept of motion, Newton’s first law of motion, magnetic force in relation to motion and understand their applications to life",
      "B7.4.4.2: Recognise some simple machines, and show understanding of their efficiency in doing work",
      "B8.4.4.1: Demonstrate the production of magnet, domestic and industrial application of Magnetic force and its relationship with Newton’s Second law of motion and in everyday life",
      "B8.4.4.2: Demonstrate understanding of complex machines and how they work",
      "B9.4.4.1: Demonstrate understanding of the concept of pressure and explain how pressure acts in everyday life",
      "B9.4.4.2: Demonstrate an understanding of Newton’s Third Law of Motion and its application in everyday life"
    ],
    "Agricultural Tools": [
      "B7.4.5.1: Demonstrate knowledge and skills in handling and maintenance of basic and simple agricultural tools",
      "B8.4.5.1: Demonstrate knowledge and skills in the use of basic and simple agricultural tools for basic on-farm activities",
      "B9.4.5.1: Demonstrate knowledge and skills in making simple agricultural tools for on-farm activities"
    ]
  },
  "Humans and the Environment": {
    "Waste Management": [
      "B7.5.1.1: Exhibit knowledge and skill of scientific basis for management practices of types of waste in the environment",
      "B8.5.1.1: Demonstrate knowledge of waste management systems and apply it in an environment",
      "B9.5.1.1: Demonstrate an understanding of the scientific ways of waste management",
      "B9.5.1.2: Demonstrate an understanding of the impact of waste on an environment, innovative waste management technologies"
    ],
    "Human Health": [
      "B7.5.2.1: Demonstrate knowledge of common deficiency diseases of humans, their causes, symptoms, effects and prevention",
      "B7.5.2.2: Demonstrate knowledge of the nature of selected viral diseases of humans, their causes, symptoms, effects and management",
      "B8.5.2.1: Demonstrate knowledge of common communicable diseases, such as Hepatitis, of humans, causes, symptoms, effects and their prevention",
      "B8.5.2.2: Demonstrate knowledge of the nature of selected bacterial diseases of humans, their causes, symptoms, effects and prevention",
      "B9.5.2.1: Demonstrate knowledge of common non-communicable diseases of humans, their causes, symptoms, effects and prevention",
      "B9.5.2.2: Demonstrate understanding of the relationship of health and disease, the concept of common diseases"
    ],
    "Science and Industry": [
      "B7.5.3.1: Realise how careers in science can improve human life, and research about Ghanaian and internationally recognised scientists",
      "B8.5.3.1: Demonstrate an understanding of connections among science, technology, innovation, society and the environment",
      "B9.5.3.1: Analyse the scientific concepts, principles and processes applied in industries in and outside their community",
      "B9.5.3.2: Demonstrate an understanding of the concept of industry, the science underpinning the processes of production"
    ],
    "Climate Change and Green Economy": [
      "B7.5.4.1: Demonstrate understanding of sustainable energy choices and their impact on the environment",
      "B8.5.4.1: Demonstrate an understanding of the effects of climate change in the world and greening of other tropical countries",
      "B9.5.4.1: Demonstrate an understanding of the natural and human factors that influence climate change and a green economy",
      "B9.5.4.2: Evaluate the effectiveness of initiatives that address the issue of climate change and green economy"
    ],
    "Understanding the Environment": [
      "B7.5.5.1: Demonstrate understanding of different plants and animals found in different land forms and how they survive",
      "B8.5.5.1: Demonstrate understanding of the differences among soils, plant roots, stems, leaves, flowers, and fruits",
      "B9.5.5.1: Demonstrate knowledge and skills in the use of plant roots, stems, leaves, flowers, and fruits for agricultural and non-agricultural purposes"
    ],
    "Soil as a Component of the Environment": [
      "B8.5.6.1: Recognise the different types of rocks as origin of different types of soils"
    ]
  },
  "Systems": {
    "The Human Body System": [
      "B7.3.1.1: Show an understanding of the concept of food, and the process of digestion and appreciate its importance in humans",
      "B8.3.1.1: Demonstrate knowledge of parts of mammalian tooth and the functions of the different types of teeth",
      "B9.3.1.1: Demonstrate understanding of the blood circulatory system, health problems associated with the system"
    ],
    "The Solar System": [
      "B7.3.2.1: Demonstrate knowledge of the inner planets of the solar system and understand their movement in the system",
      "B8.3.2.1: Demonstrate knowledge of the outer planets of the solar system",
      "B9.3.2.1: Demonstrate knowledge of other non-planetary bodies such as comets, asteroids, and their relationship with the solar system"
    ],
    "Ecosystem": [
      "B7.3.3.1: Recognise the components of and interdependences in an ecosystem, and appreciate their interactions",
      "B8.3.3.1: Demonstrate an understanding of the interdependence of organisms in an ecosystem and their interaction",
      "B9.3.3.1: Recognise the interdependence of organisms in an ecosystem and appreciate their interaction to maintain balance"
    ],
    "Farming Systems": [
      "B7.3.4.1: Demonstrate an understanding of the differences among the various farming systems",
      "B8.3.4.1: Demonstrate understanding of the different crop, animal and land combinations under various farming systems",
      "B9.3.4.1: Demonstrate knowledge and skills in the preparation of different types of manure from animal and plant waste"
    ]
  },
  "Cycles": {
    "Earth Science": [
      "B7.2.1.1: Recognise that the water cycle is an example of repeated patterns of change in nature and understand how it occurs",
      "B8.2.1.1: Demonstrate understanding of the process of Carbon cycle as an example of repeated pattern of change in nature",
      "B9.2.1.1: Demonstrate an understanding of the Nitrogen cycle as a repeated pattern of change in nature"
    ],
    "Life Cycle of Organisms": [
      "B7.2.2.1: Demonstrate the skills of carrying out activities to show the stages of the life cycle of a housefly",
      "B8.2.2.1: Demonstrate an activity to show the life cycle of the Anopheles mosquito and show how the effects can be managed",
      "B9.2.2.1: Demonstrate an understanding of the life cycle of grasshopper and assess how their activities affect humans"
    ],
    "Crop Production": [
      "B7.2.3.1: Demonstrate understanding of the different plant nutrients (organic, and inorganic fertilizers) and their application",
      "B8.2.3.1: Demonstrate knowledge and skills in planting crops on different seed beds",
      "B8.2.3.2: Demonstrate understanding of the differences in height, size, and flowering of crops grown in different seed beds",
      "B9.2.3.1: Show an understanding of differences in maturities of different crops grown in different soils and seed beds",
      "B9.2.3.2: Demonstrate knowledge and understanding of uses of different crops at different maturity stages"
    ],
    "Animal Production": [
      "B7.2.4.1: Demonstrate an understanding of the differences among domestic animals such as ruminants, monogastrics and poultry",
      "B7.2.4.2: Show an understanding of the usefulness of the different types of animals for domestic and commercial purposes",
      "B8.2.4.1: Recognise the different types of feed for different types of animals",
      "B8.2.4.2: Demonstrate understanding of the importance of water and animal feed to the growth of animals",
      "B9.2.4.1: Demonstrate understanding of the preparation of feed for domestic and commercial animals",
      "B9.2.4.2: Demonstrate skills and knowledge of feeding domestic and commercial animals"
    ]
  },
  "Health and Safety": {
    "Personal Hygiene and Food Hygiene": [
      "B7.1.1.1: Demonstrate knowledge of basic concept of staying healthy", 
      "B8.1.1.1: Demonstrate understanding of basic practices that depict personal and food hygiene", 
      "B9.1.1.1: Demonstrate skills that relate to personal and food hygiene to self"
    ],
    "Personal, Workshop and Food laboratory safety": [
      "B7.1.2.1: Demonstrate knowledge of preventing accidents in the workshop/site and laboratory", 
      "B8.1.2.1: Demonstrate knowledge of preventing accidents in the workshop/site/food/sewing laboratory", 
      "B9.1.2.1: Demonstrate skills that relate to personal, workshop and laboratory safety"
    ],
    "Environmental Health": [
      "B7.1.3.1: Demonstrate knowledge of basic concept of Environmental Health", 
      "B8.1.3.1: Demonstrate understanding of the basic concept of Environmental health", 
      "B8.1.3.2: Demonstrate understanding of basic ways of disposing of household and industrial/workshop/site/laboratory waste",
      "B9.1.3.1: Demonstrate understanding and practice of environmental health in the school/home",
      "B9.1.3.2: Demonstrate understanding of clean energy, and Improved Cookstoves (ICS) and their accompanying fuels"
    ]
  },
  "Materials for Production": {
    "Compliant Materials": [
      "B7.2.1.1: Demonstrate knowledge of basic concept of compliant materials", 
      "B8.2.1.1: Demonstrate understanding of the properties of compliant materials", 
      "B9.2.1.1: Demonstrate skills in selecting compliant materials for making products and artefacts"
    ],
    "Resistant Materials": [
      "B7.2.2.1: Demonstrate knowledge of basic concept of resistant materials", 
      "B8.2.2.1: Demonstrate understanding of properties of resistant materials", 
      "B9.2.2.1: Demonstrate skills in selecting resistant materials for making products/artefacts"
    ],
    "Smart and Modern Materials": [
      "B7.2.3.1: Demonstrate understanding of the properties of smart and modern materials", 
      "B8.2.3.1: Demonstrate understanding and the use of smart and modern materials", 
      "B9.2.3.1: Demonstrate understanding of using smart and modern materials for making products/artefacts"
    ],
    "Food Commodities (animal and plant sources)": [
      "B7.2.4.1: Demonstrate knowledge of basic food commodities",
      "B8.2.4.1: Demonstrate understanding of the functions of food commodities",
      "B9.2.4.1: Demonstrate skills in selecting food commodities in meal preparation",
      "B9.2.4.2: Demonstrate skills in planning meals for various members of the family"
    ]
  },
  "Tools, Equipment and Processes": {
    "Measuring and Marking Out": [
      "B7.3.1.1: Demonstrate understanding of measuring and marking out tools and equipment for production", 
      "B8.3.1.1: Demonstrate understanding of measuring and marking out tools and equipment for production", 
      "B9.3.1.1: Demonstrate understanding of measuring and marking out tools and equipment"
    ],
    "Cutting/Shaping": [
      "B7.3.2.1: Demonstrate understanding of cutting/shaping tools and equipment for production", 
      "B8.3.2.1: Demonstrate understanding of cutting and shaping tools and equipment for making artefacts /products", 
      "B9.3.2.1: Demonstrate the understanding of cutting/shaping tools and equipment used for making artefacts/ products"
    ],
    "Joining and Assembling": [
      "B7.3.3.1: Demonstrate understanding of joining and assembling materials, tools and equipment used for production", 
      "B8.3.3.1: Demonstrate understanding of joining and assembling materials, tools and equipment used for making artefacts/products", 
      "B9.3.3.1: Demonstrate understanding of materials. tools and equipment used for joining and assembling artefacts/products"
    ],
    "Kitchen Essentials": [
      "B7.3.4.1: Demonstrate knowledge and understanding of the Kitchen Essentials", 
      "B8.3.4.1: Demonstrate understanding of maintaining kitchen essentials", 
      "B9.3.4.1: Demonstrate skills of selecting and purchasing kitchen essentials"
    ],
    "Finishes and Finishing": [
      "B7.3.5.1: Demonstrate knowledge of finishes and finishing",
      "B8.3.5.1: Demonstrate understanding of application of finishes",
      "B9.3.5.1: Demonstrate understanding of application of finishes"
    ]
  },
  "Technology": {
    "Simple Structures and Mechanisms, Electric and Electronic Systems": [
      "B7.4.1.1: Demonstrate understanding of structures in construction", 
      "B8.4.1.1: Demonstrate understanding of application of principles of forces acting on structures", 
      "B9.4.1.1: Demonstrate knowledge of mechanisms in projects construction"
    ]
  },
  "Designing and Making of Artefacts/Products": {
    "Communicating Designs": [
      "B7.5.1.1: Demonstrate knowledge and skills of drawing materials, instruments/equipment, lines and sketching", 
      "B8.5.1.1: Demonstrate understanding of drawing plane figures and solid objects using drawing instruments", 
      "B9.5.1.1: Demonstrate understanding of developing surfaces of objects for production/ manufacturing",
      "B9.5.1.2: Demonstrate understanding of orthographic projections"
    ],
    "Designing": [
      "B7.5.2.1: Demonstrate understanding of Designing", 
      "B8.5.2.1: Demonstrate knowledge and skills of Designing", 
      "B9.5.2.1: Demonstrate knowledge of Designing"
    ],
    "Planning for making Artefacts/Products": [
      "B7.5.3.1: Demonstrate understanding of planning for making artefacts/products", 
      "B8.5.3.1: Demonstrate understanding of planning for making artefacts/products and table setting", 
      "B9.5.3.1: Demonstrate understanding of planning for making artefacts/ products/ meals"
    ],
    "Making Artefacts from Compliant, Resistant Materials and Food Ingredients": [
      "B7.5.4.1: Demonstrate skills of making artefacts/products", 
      "B8.5.4.1: Demonstrate understanding of designing artefacts/products, and models and table setting", 
      "B9.5.4.1: Demonstrate understanding of gathering materials, tools and equipment for making meals/articles"
    ]
  },
  "Entrepreneurial Skills": {
    "Career Pathways and Career Opportunities": [
      "B7.6.1.1: Demonstrate awareness of own learning styles, interests, biases, beliefs and reasons", 
      "B8.6.1.1: Demonstrate knowledge of career opportunities in Career Technology", 
      "B9.6.1.1: Demonstrate understanding about the changing nature of the workplace and personal goals"
    ],
    "Establishing and Managing a Small Business Enterprise": [
      "B7.6.2.1: Demonstrate understanding of Establishing and managing a Small business enterprise", 
      "B8.6.2.1: Demonstrate understanding of establishing and managing micro and small business enterprises", 
      "B9.6.2.1: Demonstrate understanding of establishing and managing a small business enterprise"
    ]
  },
  "Customs and Institutions": {
    "Rites of Passage": ["B7.1.1.1: Childhood Rites", "B8.1.1.1: Puberty Rites", "B9.1.1.1: Marriage Rites"],
    "Naming Systems": ["B7.1.2.1: Day names and order of birth", "B8.1.2.1: Family names and kinship terms", "B9.1.2.1: Circumstantial, reincarnation and deity names"],
    "The Clan System": ["B7.1.3.1: Features of the clan system", "B8.1.3.1: Importance and threats to the clan system", "B9.1.3.1: Factors that militate against the clan system"],
    "Chieftaincy": ["B7.1.4.1: Selection and enstoolment of chiefs", "B8.1.4.1: Destoolment of chiefs", "B9.1.4.1: Traditional governing structure"]
  },
  "Listening and Speaking (GL)": {
    "Conversation/Everyday discourse": ["B7.1.1.1: Use of appropriate register", "B8.1.1.1: Narrating daily activities", "B9.1.1.1: Spontaneous social interaction"],
    "Listening Comprehension": ["B7.2.2.1: extended listening", "B8.2.2.1: level-appropriate dialogue", "B9.2.2.1: natural level-appropriate interactions"]
  },
  "Language and Usage": {
    "Integrating grammar (nouns, pronouns, adjectives)": ["B7.4.2.1: Basic forms", "B8.4.2.1: Abstract/Concrete", "B9.4.2.1: Singular/Plural"],
    "Integrating grammar (verbs, adverbs, conjunctions, postpositions/prepositions)": ["B7.4.3.1: Verbs and Adverbs", "B8.4.3.1: Tense and Aspectual forms", "B9.4.3.1: Auxiliary verbs"]
  },
  "Reading (GL)": {
    "Reading": ["B7.3.1.1: Reading and summarizing", "B8.3.1.1: Extended texts", "B9.3.1.1: Recall points and rewrite"],
    "Translation": ["B7.3.2.1: Translating words/phrases", "B8.3.2.1: Translating sentences", "B9.3.2.1: Decoding and translating"]
  },
  "Composition Writing": {
    "Structure and organise ideas in composition writing": ["B7.5.1.1: Paragraph features", "B8.5.1.1: Coherent essays", "B9.5.1.1: Extended texts and linking"]
  },
  "Listening and Speaking": {
    "Greetings and Introductions": ["B7.1.1.1: Greet and introduce oneself in French"],
    "Family and Home": ["B8.1.1.1: Describe family members in French"],
    "School and Education": ["B9.1.1.1: Talk about school subjects and teacher in French"]
  },
  "Literature (GL)": {
    "Oral and written literature": ["B7.6.1.1: Components of literature", "B8.6.1.1: Proverbs and idioms", "B9.6.1.1: Drum/horn language"]
  },
  "God, His Creation and Attributes": {
    "God, His Nature and Attributes": ["B7.1.1.1: Explain the nature of God seen through His attributes"],
    "The Creation Stories": ["B8.1.1.1: Outline and explain moral lessons in creation stories"],
    "The Purpose and Usefulness of God's Creation": ["B9.1.1.1: Describe purpose of God's creation"]
  },
  "Religious Practices": {
    "Worship": ["B7.2.1.1: Explain how worship is performed"],
    "Religious Songs and Recitations": ["B7.2.2.1: Analyse moral values in songs"],
    "Rites of Passage": ["B8.2.1.1: Explain rites of passage"],
    "Religious Festivals": ["B9.2.1.1: Understand religious festivals"]
  },
  "The Family and the Community": {
    "Family Systems": ["B7.3.1.1: Identify and explain importance of family systems"],
    "Authority and Obedience": ["B8.3.1.1: Identify and explain importance of obeying authority"],
    "Religion and Social Cohesion": ["B9.3.1.1: Ways people can co-exist peacefully"]
  },
  "Religious Leaders and Personalities": {
    "Religious Leaders": ["B7.4.1.1: Early life and call of religious leaders"],
    "Prophets and Caliphs": ["B8.4.1.1: Moral lessons from prophets and caliphs"],
    "Women in Religion": ["B9.4.1.1: Leadership role of women"]
  },
  "Ethics and Moral Life": {
    "Manners and Decency": ["B7.5.1.1: Develop good manners and apply them"],
    "Substance Abuse": ["B7.5.2.1: Need to stay away from substance abuse"],
    "Moral Teachings": ["B8.5.1.1: Moral teachings from scripture and oral traditions"],
    "Reward, Punishment and Repentance": ["B9.5.1.1: Good deeds and punishment"]
  },
  "Religion and Economic Life": {
    "Work and Entrepreneurship": ["B7.6.1.1: Cultivate hard work and entrepreneurship"],
    "Money": ["B8.6.1.1: Plan the wise use of money"],
    "Bribery and Corruption": ["B8.6.2.1: Avoid bribery and corruption"],
    "Time and Leisure": ["B9.6.1.1: Managing time profitably"]
  },
  "Visual Arts": {
    "Thinking and exploring ideas": ["B1-B6.1.1.1: Demonstrate understanding of how to generate own ideas for artistic expressions on the people, based on their history and culture, the environment and the topical local/national/global issues"],
    "Planning, making and composing": [
      "B1-B6.1.2.2: Demonstrate understanding of how to organise own ideas through experimenting with available media and techniques for creating/composing artworks, based on history and culture, the environment and topical local/national/global issues",
      "B1-B6.1.2.3: Demonstrate understanding of how to create expressive artworks based on own ideas by applying knowledge of media and methods of production to reflect other cultures in Africa, visual artists, their culture, the environment and emerging topical issues"
    ],
    "Displaying and sharing": [
      "B1-B6.1.3.4: Demonstrate understanding of how to plan a display/presentation of a portfolio of own artworks",
      "B1-B6.1.3.5: Demonstrate understanding of how to display/present a portfolio of art works that share own knowledge, concepts, ideas and experiences"
    ],
    "Appreciating and appraising": [
      "B1-B6.1.4.6: Demonstrate understanding of how to analyse, appreciate, appraise/critique and present report on own works and that of others",
      "B1-B6.1.4.7: Demonstrate the ability to make informed decisions on displays, presentations, performances, recordings and/or reports"
    ]
  },
  "Performing Arts": {
    "Thinking and exploring ideas": ["B1-B6.2.1.1: Demonstrate understanding of how to generate own ideas for artistic expressions on the people, based on their history and culture, the environment and the topical local/national/global issues"],
    "Planning, making and composing": [
      "B1-B6.2.2.2: Demonstrate understanding of how to organise own ideas through experimenting with available media and techniques for creating/composing artworks",
      "B1-B6.2.2.3: Demonstrate understanding of how to create expressive artworks based on own ideas by applying knowledge of media and methods of production"
    ],
    "Displaying and sharing": [
      "B1-B6.2.3.4: Demonstrate understanding of how to plan a display/presentation of a portfolio of own artworks",
      "B1-B6.2.3.5: Demonstrate understanding of how to display/present a portfolio of art works that share own knowledge, concepts, ideas and experiences"
    ],
    "Appreciating and appraising": [
      "B1-B6.2.4.6: Demonstrate understanding of how to analyse, appreciate, appraise/critique and present report on own works and that of others",
      "B1-B6.2.4.7: Demonstrate the ability to make informed decisions on displays, presentations, performances, recordings and/or reports"
    ]
  },
  "Introduction to Computing": {
    "Generation of computers and parts of a computer and other gadgets": ["B4-B6.1.1.1: Identify parts of a computer and technology tools"],
    "Introduction to MS-Windows Interface": ["B4-B6.1.2.1: Demonstrate the use of the Desktop Background as well as working with folders"],
    "Data, sources and usage": ["B4-B6.1.3.1: Identify Data and collect data from different sources"],
    "Technology in the community (communication)": ["B4-B6.1.4.1: Demonstrate the use of technology in the community"]
  },
  "Word Processing": {
    "Introduction to Word Processing": ["B4-B6.3.1.1: Demonstrate understanding of the use of word processing application"],
    "Tabs and ribbons of word processing": ["B4-B6.3.2.1: Demonstrate how to use the ribbons under the home ribbons"]
  },
  "Presentation": {
    "Introduction to MS-PowerPoint": ["B4-B6.2.1.1: Demonstrate how to use Microsoft PowerPoint"],
    "Tabs and ribbons of MS-PowerPoint": ["B4-B6.2.2.1: Demonstrate how to use the ribbons under the home ribbons"]
  },
  "Desktop Publishing": {
    "Introduction to MS-Publisher": ["B4-B6.4.1.1: Demonstrate how to use MS-Publisher"]
  },
  "Programming and Databases": {
    "Introduction to databases, algorithm and programming": ["B4-B6.5.1.1: Display understanding of basic database concepts"],
    "Introduction to programming languages (e.g. MS-Excel, Scratch, VB dot Net etc.)": ["B4-B6.5.2.1: Demonstrate understanding of the concept of programming"],
    "Introduction to Electronic Spreadsheet": ["B4-B6.5.3.1: Demonstrate how to use Electronic Spreadsheet"],
    "Tabs and ribbons manipulation": ["B4-B6.5.4.1: Demonstrate how to use the ribbons under the home ribbons"]
  },
  "Internet and Social Media": {
    "Network Overview": ["B4-B6.6.1.1: Demonstrate how to Network computers"],
    "Web browsers and Web Pages": ["B4-B6.6.2.1: Demonstrate how to use Web Pages"],
    "Surfing the world wide web": ["B4-B6.6.3.1: Demonstrate Surfing The World Wide Web"],
    "Favourite places and Search engine": ["B4-B6.6.4.1: Demonstrate searching for information on the Web"],
    "Using Online Forms": ["B4-B6.6.5.1: Demonstrate the Usage of Forms"],
    "Customising your browser": ["B4-B6.6.6.1: Show how to Customize a Browser"],
    "Electronic Email": ["B4-B6.6.7.1: Demonstrate the use of Electronic Mail"],
    "Internet of things (IoT)": ["B4-B6.6.8.1: Demonstrate the use of Internet of Things (IoT)"],
    "Digital Literacy": ["B4-B6.6.9.1: Demonstrate proficiency in Digital Literacy"],
    "Network Etiquette": ["B4-B6.6.10.1: Demonstrated the application of Network Etiquette (Netiquette)"]
  },
  "Health and Safety in Using ICT Tools": {
    "Health and safety in using ICT tools": ["B4-B6.7.1.1: Demonstrate the application of Health and safety measures, in using ICT tools"]
  },
  "Oral Language": {
    "Songs": ["B1.1.1.1: Listen to and sing familiar songs", "B2.1.1.1: Interpret familiar songs", "B3.1.1.1: Talk about the benefits of songs", "B4.1.1.1: Listen attentively to songs and sing them", "B5.1.1.1: Explain the central messages in songs", "B6.1.1.1: Relate the central messages in songs to personal experiences"],
    "Story Telling": ["B1.1.3.1: Listen to stories and identify characters", "B2.1.4.1: Identify characters in a story", "B3.1.4.1: Respond to and ask questions based on stories", "B4.1.4.1: Retell stories sequentially", "B5.1.4.1: Demonstrate understanding of lessons in stories", "B6.1.4.1: Make connections between texts or stories and personal experiences"],
    "Conversation": ["B1.1.6.1: Use appropriate greetings", "B2.1.6.1: Use certain culturally acceptable language", "B3.1.6.1: Use appropriate greetings for special occasions", "B4.1.6.1: Describe/talk about objects, events, dates and time", "B5.1.6.1: Describe/talk about names of regions/places", "B6.1.6.1: Describe/talk about objects/personalities/events"]
  },
  "Reading": {
    "Phonics": ["B1.2.2.1: Identify the alphabet in order", "B2.2.2.1: Blend syllables to produce words", "B3.2.2.1: Understand the relationship between spelling and sounds", "B4.2.2.1: Match sounds to their corresponding letter patterns", "B5.2.2.1: Apply common phonic generalisations", "B6.2.2.1: Read words with specific ending sounds"],
    "Comprehension": ["B1.2.7.1: Use self-correction strategies", "B2.2.7.1: Understand and analyse texts read", "B3.2.7.1: Use self-correction strategies to make meaning", "B4.2.7.1: Construct meaning from texts read", "B5.2.7.1: Use pre-reading and while-reading strategies", "B6.2.7.1: Use prior knowledge to adjust comprehension"]
  },
  "Writing": {
    "Penmanship/Handwriting": ["B1.4.2.1: Copy and write letters of the alphabet correctly", "B2.4.2.1: Copy and rewrite sentences correctly", "B3.4.2.1: Copy short paragraphs clearly", "B4.4.2.1: Write clearly using joined letters", "B5.4.2.1: Copy sentences clearly in joint script", "B6.4.2.1: Write with a legible, fluent and personal style"],
    "Narrative Writing": ["B1.4.10.1: Write about oneself", "B2.4.10.1: Narrate situations and express feelings", "B3.4.10.1: Add more details to a story structure", "B4.4.10.1: Write real or imagined experiences", "B5.4.10.1: Create settings, characters and plots", "B6.4.10.1: Use linking words for cohesion"]
  },
  "Grammar Usage at Word and Phrase Levels": {
    "Nouns": ["B4.3.1.1: Identify and use nouns to identify people, animals, events and objects", "B5.3.1.1: Identify and use nouns or noun phrases to refer to quantities or units", "B6.3.1.1: Identify and use nouns or noun phrases to describe conditions"],
    "Determiners": ["B4.3.2.1: Apply knowledge of different types of determiners", "B5.3.2.1: Apply knowledge of different types of determiners (e.g. articles, quantifiers)", "B6.3.2.1: Apply knowledge of definite and indefinite articles"],
    "Pronouns": ["B4.3.3.1: Apply knowledge of different types of pronouns", "B5.3.3.1: Identify and use indefinite pronouns", "B6.3.3.1: Identify and use reflexive, relative and reciprocal pronouns"],
    "Verbs": ["B4.3.5.1: Apply the knowledge of verbs in communication", "B5.3.5.1: Use different types of verbs in sentences", "B6.3.5.1: Use past continuous and past perfect forms"]
  },
  "Writing Conventions and Grammar Usage": {
    "Capitalization": ["B1.5.1.1: Write capital letters correctly", "B2.5.1.1: Capitalize names of people and places", "B3.5.1.1: use capitalization correctly", "B4.5.1.1: Use capitalization in varied contexts", "B5.5.1.1: Follow appropriate mechanical convention", "B6.5.1.1: Use capital letters in direct speech"],
    "Punctuation": ["B1.5.2.1: Use full stop", "B2.5.2.1: Use full stops and question marks", "B3.5.2.1: Use full stops in initials and abbreviations", "B4.5.2.1: Use the comma appropriately", "B5.5.2.1: Use comma for modifying phrases", "B6.5.2.1: Use quotation marks and apostrophes"],
    "Naming Words": ["B1.5.3.1: Identify naming words", "B2.5.3.1: Use common and proper nouns", "B3.5.3.1: Use collective nouns"],
    "Action Words": ["B1.5.4.1: Identify action words", "B2.5.4.1: Use simple present tense", "B3.5.4.1: Use simple past tense"],
    "Qualifying Words": ["B1.5.5.1: Identify qualifying words", "B2.5.5.1: Use adjectives for description", "B3.5.5.1: Use comparative and superlative forms"],
    "Simple Prepositions": ["B1.5.6.1: Use in, on, under", "B2.5.6.1: Use between, behind, in front of", "B3.5.6.1: Use above, below, beside"],
    "Conjunctions": ["B1.5.7.1: Use 'and'", "B2.5.7.1: Use 'but', 'or'", "B3.5.7.1: Use 'because', 'so'"],
    "Sentences": ["B1.5.8.1: Write simple sentences", "B2.5.8.1: Expand simple sentences", "B3.5.8.1: Write compound sentences"],
    "Spelling": ["B1.5.10.1: Spell simple words correctly", "B2.5.10.1: Spell words with irregular phonic patterns", "B3.5.10.1: Spell phonically irregular words", "B4.5.10.1: Use invented spelling to increase fluency", "B5.5.10.1: Use phonics knowledge to spell correctly", "B6.5.10.1: Check pieces of literary work for spelling"]
  },
  "Extensive Reading": {
    "Building the Love and Culture of Reading": ["B1.6.1.1: Read a variety of age-appropriate books", "B4.6.1.1: Read and present summaries", "B6.6.1.1: Read and critique a variety of books"]
  },
  "History as a Subject": {
    "Why and how we study history": ["B1.1.1.1: History as part of everyday life", "B4.1.1.1: Importance of studying history", "B4.1.1.2: Sources for writing history"],
    "The learner’s own history": ["B1.1.2.1: Recall own history"],
    "Family History": ["B1.1.3.1: Family history and ancestry"],
    "Community History": ["B1.1.4.1: History of the local community", "B1.1.4.2: Communities similarities and differences"]
  },
  "My Country Ghana": {
    "The People of Ghana": ["B2.2.1.1: Ethnic groups in Ghana", "B3.2.1.1: Origins of major ethnic groups", "B4.2.1.1: Rise and expansion of major kingdoms", "B5.2.1.1: Ancient life vs modern life"],
    "Inter-Group Relations": ["B3.2.2.1: Nature of exchanges among groups"],
    "How Ghana got its name": ["B1.2.3.1: From Gold Coast to Ghana"],
    "Major Historical locations": ["B2.2.4.1: History of major locations", "B3.2.4.1: Forts and castles along the coast", "B4.1.4.1: History of specific historical sites"],
    "Some selected Individuals": ["B1.2.5.1: Selected individuals and contributions", "B2.2.5.1: Ghanaian women and national development", "B3.2.5.1: Outstanding Ghanaian entrepreneurs", "B4.2.5.1: Significant traditional rulers", "B5.2.5.1: Ghanaians made significant contribution locally and internationally"]
  },
  "Europeans in Ghana": {
    "Arrival of Europeans": ["B1.3.1.1: Europeans who came to Ghana", "B3.3.1.1: Interaction and settlers"],
    "International trade including Slave Trade": ["B2.3.2.1: Early trade between Ghanaians and Europeans", "B5.3.2.1: Human trade and Trans-Atlantic Slave Trade"],
    "Missionary Activities": ["B4.3.3.1: European missionary activities"],
    "Impact of European presence": ["B6.3.4.1: Assessing changes brought by Europeans"]
  },
  "Colonisation and Developments under Colonial Rule in Ghana": {
    "Establishing Colonial rule in Ghana": ["B4.4.1.1: The Bond of 1844", "B4.4.1.2: Formation of the Gold Coast territory"],
    "Social Development": ["B5.4.2.1: Educational, Health and Housing developments"],
    "Economic Development": ["B5.4.3.1: Economic policies and projects"],
    "Political Development": ["B6.4.4.1: Features of British colonial rule"]
  },
  "Journey to Independence": {
    "Early Protest Movements": ["B5.5.1.1: Protest movements before 1945"],
    "Formation of Political Parties": ["B6.5.2.1: Role of UGCC and CPP"],
    "The 1948 riots": ["B5.5.3.1: Events leading to 1948 riots"],
    "Ghana gains independence": ["B6.5.4.1: Post WWII developments and constitutional means"]
  },
  "Independent Ghana": {
    "The Republics": ["B1.6.1.1: Presidents since 1960", "B4.6.1.1: The four Republics", "B6.6.1.1: Emergence of the Fourth Republic"],
    "Military Rule": ["B6.6.2.1: Military takeovers since 1966"]
  },

  // French
  "Saluer et prendre congé": {
    "Compréhension Orale": ["B4.1.1.1: Écouter et comprendre des salutations", "B5.1.1.1: Écouter et comprendre des salutations", "B6.1.1.1: Écouter et comprendre des salutations"],
    "Production Orale": ["B4.1.1.2: Saluer et répondre oralement", "B5.1.1.2: Saluer et répondre oralement", "B6.1.1.2: Saluer et répondre oralement"],
    "Compréhension Écrite": ["B4.1.1.3: Lire et comprendre des salutations", "B5.1.1.3: Lire et comprendre des salutations", "B6.1.1.3: Lire et comprendre des salutations"],
    "Production Écrite": ["B4.1.1.4: Écrire des mots de salutation", "B5.1.1.4: Écrire des mots de salutation", "B6.1.1.4: Écrire des mots de salutation"]
  },
  "Se présenter": {
    "Compréhension Orale": ["B4.1.2.1: Écouter et comprendre des présentations", "B5.1.2.1: Écouter et comprendre des présentations", "B6.1.2.1: Écouter et comprendre des présentations"],
    "Production Orale": ["B4.1.2.2: Se présenter oralement", "B5.1.2.2: Se présenter oralement", "B6.1.2.2: Se présenter oralement"],
    "Compréhension Écrite": ["B4.1.2.3: Lire et comprendre des présentations", "B5.1.2.3: Lire et comprendre des présentations", "B6.1.2.3: Lire et comprendre des présentations"],
    "Production Écrite": ["B4.1.2.4: Se présenter par écrit", "B5.1.2.4: Se présenter par écrit", "B6.1.2.4: Se présenter par écrit"]
  },
  "Présenter quelqu'un": {
    "Compréhension Orale": ["B4.1.3.1: Écouter et comprendre la présentation de quelqu'un", "B5.1.3.1: Écouter et comprendre la présentation de quelqu'un", "B6.1.3.1: Écouter et comprendre la présentation de quelqu'un"],
    "Production Orale": ["B4.1.3.2: Présenter quelqu'un oralement", "B5.1.3.2: Présenter quelqu'un oralement", "B6.1.3.2: Présenter quelqu'un oralement"],
    "Compréhension Écrite": ["B4.1.3.3: Lire et comprendre la présentation de quelqu'un", "B5.1.3.3: Lire et comprendre la présentation de quelqu'un", "B6.1.3.3: Lire et comprendre la présentation de quelqu'un"],
    "Production Écrite": ["B4.1.3.4: Présenter quelqu'un par écrit", "B5.1.3.4: Présenter quelqu'un par écrit", "B6.1.3.4: Présenter quelqu'un par écrit"]
  },
  "Décrire quelqu'un": {
    "Compréhension Orale": ["B4.1.4.1: Écouter et comprendre la description de quelqu'un", "B5.1.4.1: Écouter et comprendre la description de quelqu'un", "B6.1.4.1: Écouter et comprendre la description de quelqu'un"],
    "Production Orale": ["B4.1.4.2: Décrire quelqu'un oralement", "B5.1.4.2: Décrire quelqu'un oralement", "B6.1.4.2: Décrire quelqu'un oralement"],
    "Compréhension Écrite": ["B4.1.4.3: Lire et comprendre la description de quelqu'un", "B5.1.4.3: Lire et comprendre la description de quelqu'un", "B6.1.4.3: Lire et comprendre la description de quelqu'un"],
    "Production Écrite": ["B4.1.4.4: Décrire quelqu'un par écrit", "B5.1.4.4: Décrire quelqu'un par écrit", "B6.1.4.4: Décrire quelqu'un par écrit"]
  },
  "Compter et faire des calculs simples": {
    "Compréhension Orale": ["B4.4.1.1: Écouter et comprendre les nombres", "B5.4.1.1: Écouter et comprendre les nombres", "B6.4.1.1: Écouter et comprendre les nombres"],
    "Production Orale": ["B4.4.1.2: Compter à haute voix", "B5.4.1.2: Compter à haute voix", "B6.4.1.2: Compter à haute voix"],
    "Compréhension Écrite": ["B4.4.1.3: Lire les nombres", "B5.4.1.3: Lire les nombres", "B6.4.1.3: Lire les nombres"],
    "Production Écrite": ["B4.4.1.4: Écrire les nombres et faire des calculs", "B5.4.1.4: Écrire les nombres et faire des calculs", "B6.4.1.4: Écrire les nombres et faire des calculs"]
  },
  "Demander et donner l'heure": {
    "Compréhension Orale": ["B4.4.2.1: Écouter et comprendre l'heure", "B5.4.2.1: Écouter et comprendre l'heure", "B6.4.2.1: Écouter et comprendre l'heure"],
    "Production Orale": ["B4.4.2.2: Demander et donner l'heure oralement", "B5.4.2.2: Demander et donner l'heure oralement", "B6.4.2.2: Demander et donner l'heure oralement"],
    "Compréhension Écrite": ["B4.4.2.3: Lire l'heure", "B5.4.2.3: Lire l'heure", "B6.4.2.3: Lire l'heure"],
    "Production Écrite": ["B4.4.2.4: Écrire l'heure", "B5.4.2.4: Écrire l'heure", "B6.4.2.4: Écrire l'heure"]
  },
  "Parler des jours de la semaine": {
    "Compréhension Orale": ["B4.4.3.1: Écouter et comprendre les jours", "B5.4.3.1: Écouter et comprendre les jours", "B6.4.3.1: Écouter et comprendre les jours"],
    "Production Orale": ["B4.4.3.2: Parler des jours oralement", "B5.4.3.2: Parler des jours oralement", "B6.4.3.2: Parler des jours oralement"],
    "Compréhension Écrite": ["B4.4.3.3: Lire les jours", "B5.4.3.3: Lire les jours", "B6.4.3.3: Lire les jours"],
    "Production Écrite": ["B4.4.3.4: Écrire les jours", "B5.4.3.4: Écrire les jours", "B6.4.3.4: Écrire les jours"]
  },
  "Identifier les professions et les métiers": {
    "Compréhension Orale": ["B4.4.7.1: Écouter et comprendre les professions", "B5.4.7.1: Écouter et comprendre les professions", "B6.4.7.1: Écouter et comprendre les professions"],
    "Production Orale": ["B4.4.7.2: Parler des professions oralement", "B5.4.7.2: Parler des professions oralement", "B6.4.7.2: Parler des professions oralement"],
    "Compréhension Écrite": ["B4.4.7.3: Lire les professions", "B5.4.7.3: Lire les professions", "B6.4.7.3: Lire les professions"],
    "Production Écrite": ["B4.4.7.4: Écrire les professions", "B5.4.7.4: Écrire les professions", "B6.4.7.4: Écrire les professions"]
  },
  "Parler de son école": {
    "Compréhension Orale": ["B4.2.2.1: Écouter et comprendre l'environnement scolaire", "B5.2.2.1: Écouter et comprendre l'environnement scolaire", "B6.2.2.1: Écouter et comprendre l'environnement scolaire"],
    "Production Orale": ["B4.2.2.2: Parler de l'école oralement", "B5.2.2.2: Parler de l'école oralement", "B6.2.2.2: Parler de l'école oralement"],
    "Compréhension Écrite": ["B4.2.2.3: Lire sur l'école", "B5.2.2.3: Lire sur l'école", "B6.2.2.3: Lire sur l'école"],
    "Production Écrite": ["B4.2.2.4: Écrire sur l'école", "B5.2.2.4: Écrire sur l'école", "B6.2.2.4: Écrire sur l'école"]
  },
  "Dire ce que l’on aime": {
    "Compréhension Orale": ["B4.3.1.1: Écouter et comprendre les goûts", "B5.3.1.1: Écouter et comprendre les goûts", "B6.3.1.1: Écouter et comprendre les goûts"],
    "Production Orale": ["B4.3.1.2: Exprimer ses goûts oralement", "B5.3.1.2: Exprimer ses goûts oralement", "B6.3.1.2: Exprimer ses goûts oralement"],
    "Compréhension Écrite": ["B4.3.1.3: Lire sur les goûts", "B5.3.1.3: Lire sur les goûts", "B6.3.1.3: Lire sur les goûts"],
    "Production Écrite": ["B4.3.1.4: Écrire sur ses goûts", "B5.3.1.4: Écrire sur ses goûts", "B6.3.1.4: Écrire sur ses goûts"]
  },
};

export const STANDARD_INDICATORS: Record<string, string[]> = {
  // Career Technology - Health and Safety
  "B7.1.1.1: Demonstrate knowledge of basic concept of staying healthy": ["B7.1.1.1.1: Discuss the need to stay healthy", "B7.1.1.1.2: Describe ways of maintaining personal hygiene", "B7.1.1.1.3: Discuss food hygiene"],
  "B7.1.2.1: Demonstrate knowledge of preventing accidents in the workshop/site and laboratory": ["B7.1.2.1.1: Describe accidents in the workshop/site/laboratory", "B7.1.2.1.2: Explain the need for keeping the workshop/site and the laboratory safe"],
  "B7.1.3.1: Demonstrate knowledge of basic concept of Environmental Health": ["B7.1.3.1.1: Discuss the factors of environmental health", "B7.1.3.1.2: Demonstrate the preventive measures of environmental health"],
  "B8.1.1.1: Demonstrate understanding of basic practices that depict personal and food hygiene": ["B8.1.1.1.1: Demonstrate skills of personal hygiene", "B8.1.1.1.2: Demonstrate skills in keeping food safe (food hygiene)"],
  "B8.1.2.1: Demonstrate knowledge of preventing accidents in the workshop/site/food/sewing laboratory": ["B8.1.2.1.1: Demonstrate basic skills in applying First Aid to self and others"],
  "B8.1.3.1: Demonstrate understanding of the basic concept of Environmental health": ["B8.1.3.1.1: Discuss the causal factors, effects and prevention of desertification and deforestation"],
  "B8.1.3.2: Demonstrate understanding of basic ways of disposing of household and industrial/workshop/site/laboratory waste": ["B8.1.3.2.1: Identify proper management and disposal of household and industrial waste"],
  "B9.1.1.1: Demonstrate skills that relate to personal and food hygiene to self": ["B9.1.1.1.1: Practice good grooming", "B9.1.1.1.2: Observe appropriate food hygiene practices"],
  "B9.1.2.1: Demonstrate skills that relate to personal, workshop and laboratory safety": ["B9.1.2.1.1: Describe procedures for reporting accidents and unsafe practices", "B9.1.2.1.2: Use appropriate personal protective equipment when working", "B9.1.2.1.3: Maintain safe working environments"],
  "B9.1.3.1: Demonstrate understanding and practice of environmental health in the school/home": ["B9.1.3.1.1: Discuss the causes and prevention of poor sanitation"],
  "B9.1.3.2: Demonstrate understanding of clean energy, and Improved Cookstoves (ICS) and their accompanying fuels": ["B9.1.3.2.1: Discuss what is meant by clean energy and improved cookstoves and fuels", "B9.1.3.2.2: Discuss the benefits of improved cookstoves and fuels"],
  
  // Career Technology - Materials for Production
  "B7.2.1.1: Describe compliant materials": ["B7.2.1.1.1: Describe compliant materials", "B7.2.1.1.2: Distinguish between types of compliant materials", "B7.2.1.1.3: Explain how compliant materials are manufactured"],
  "B7.2.2.1: Describe resistant materials": ["B7.2.2.1.1: Describe resistant materials", "B7.2.2.1.2: Distinguish between the types of resistant materials", "B7.2.2.1.3: Explain how each of the resistant materials is manufactured"],
  "B7.2.3.1: Demonstrate understanding of the properties of smart and modern materials": ["B7.2.3.1.1: Explore the general properties of smart and modern materials"],
  "B7.2.4.1: Demonstrate knowledge of basic food commodities": ["B7.2.4.1.1: Discuss food commodities"],
  "B8.2.1.1: Demonstrate understanding of the properties of compliant materials": ["B8.2.1.1.2: Discuss the basic characteristics of compliant materials"],
  "B8.2.2.1: Demonstrate understanding of properties of resistant materials": ["B8.2.2.1.1: Explain the basic properties of resistant materials", "B8.2.2.1.2: Describe the properties of building materials"],
  "B8.2.3.1: Demonstrate understanding and the use of smart and modern materials": ["B8.2.3.1.1: Discuss smart and modern materials"],
  "B8.2.4.1: Demonstrate understanding of the functions of food commodities": ["B8.2.4.1.1: Explore the functions of food to the body"],
  "B9.2.1.1: Demonstrate skills in selecting compliant materials for making products and artefacts": ["B9.2.1.1.1: Discuss the factors that influence the selection of compliant materials"],
  "B9.2.2.1: Demonstrate skills in selecting resistant materials for making products/artefacts": ["B9.2.2.1.1: Discuss the factors that influence the selection of resistant materials", "B9.2.2.1.2: Discuss the reasons why resistant materials require particular techniques and tools"],
  "B9.2.3.1: Demonstrate understanding of using smart and modern materials for making products/artefacts": ["B9.2.3.1.1: Discuss reasons for using smart and modern materials", "B9.2.3.1.2: Demonstrate techniques for making prototypes/projects using smart and modern materials"],
  "B9.2.4.1: Demonstrate skills in selecting food commodities in meal preparation": ["B9.2.4.1.1: Discuss how to select food commodities used for meal preparation"],
  "B9.2.4.2: Demonstrate skills in planning meals for various members of the family": ["B9.2.4.1.2: Discuss the basic food requirements for different members of the family"],

  // Career Technology - Tools, Equipment and Processes
  "B7.3.1.1: Classify and use measuring and marking out tools": ["B7.3.1.1.1: Classify and use measuring and marking out tools and equipment", "B7.3.1.1.2: Demonstrate how to care for and maintain measuring and marking out tools"],
  "B7.3.4.1: Describe kitchen essentials": ["B7.3.4.1.1: Describe kitchen essentials", "B7.3.4.1.2: Demonstrate skills in the classification of kitchen essentials"],
  "B7.3.2.1: Identify cutting and shaping tools": ["B7.3.2.1.1: Identify cutting and shaping tools and equipment", "B7.3.2.1.2: Use appropriate skills in cutting, chopping, slicing, dicing and shaping"],
  "B7.3.3.1: Describe joining and assembling materials": ["B7.3.3.1.1: Describe joining and assembling materials, tools and equipment", "B7.3.3.1.2: Use appropriate skills for joining and assembling artefacts"],
  "B8.3.1.1: Demonstrate understanding of measuring and marking out tools and equipment for production": ["B8.3.1.1.1: Identify tools and equipment for measuring", "B8.3.1.1.2: Take body measurements", "B8.3.1.1.3: Use appropriate techniques to measure", "B8.3.1.1.4: Care for tools"],
  "B8.3.2.1: Demonstrate understanding of cutting and shaping tools and equipment for making artefacts /products": ["B8.3.2.1.1: Identify and use cutting tools", "B8.3.2.1.2: Skills in cutting/shaping", "B8.3.2.1.3: Care for tools"],
  "B8.3.3.1: Demonstrate understanding of joining and assembling materials, tools and equipment used for making artefacts/products": ["B8.3.3.1.1: Identify joining materials", "B8.3.3.1.2: Skills for joining/assembling", "B8.3.3.1.3: Care for tools"],
  "B8.3.4.1: Demonstrate understanding of maintaining kitchen essentials": ["B8.3.4.1.1: Care for kitchen essentials"],
  "B8.3.5.1: Demonstrate understanding of application of finishes": ["B8.3.5.1.1: Mix various finishes", "B8.3.5.1.2: Finishing edges"],
  "B9.3.1.1: Demonstrate understanding of measuring and marking out tools and equipment": ["B9.3.1.1.1: Discuss tools for measuring", "B9.3.1.1.2: Use tools for measuring"],
  "B9.3.2.1: Demonstrate the understanding of cutting/shaping tools and equipment used for making artefacts/ products": ["B9.3.2.1.1: Discuss tools for cutting", "B9.3.2.1.2: Use tools for cutting"],
  "B9.3.3.1: Demonstrate understanding of materials. tools and equipment used for joining and assembling artefacts/products": ["B9.3.3.1.1: Discuss joining materials", "B9.3.3.1.2: Skills in joining"],
  "B9.3.4.1: Demonstrate skills of selecting and purchasing kitchen essentials": ["B9.3.4.1.1: Select suitable kitchen essentials", "B9.3.4.1.2: Use labour-saving kitchen essentials"],
  "B9.3.5.1: Demonstrate understanding of application of finishes": ["B9.3.5.1.1: Apply finishes to resistant materials", "B9.3.5.1.2: Finish edges in sewing"],

  // English - Oral Language
  "B1.1.1.1: Listen to and sing familiar songs": ["B1.1.1.1.1: Listen to and sing familiar songs with appropriate expressions", "B1.1.1.1.2: Identify some familiar songs"],
  "B2.1.1.1: Interpret familiar songs": ["B2.1.1.1.1: Identify some familiar songs from learners’ locality", "B2.1.1.1.2: Have learners interpret the songs in their own words"],
  "B3.1.1.1: Talk about the benefits of songs": ["B3.1.1.1.1: Identify some familiar songs e.g. patriotic songs", "B3.1.1.1.2: Identify and talk about the moral lessons in the songs", "B3.1.1.1.3: Think-pair-share the benefits of songs"],
  "B4.1.1.1: Listen attentively to songs and sing them": ["B4.1.1.1.1: Listen attentively to songs and sing them with appropriate stress", "B4.1.1.1.2: Identify and discuss values in songs"],
  "B5.1.1.1: Explain the central messages in songs": ["B5.1.1.1.1: Explain the central messages in songs", "B5.1.1.1.2: Relate values in songs to real life experiences"],
  "B6.1.1.1: Relate the central messages in songs to personal experiences": ["B6.1.1.1.1: Relate the central messages in songs to personal experiences", "B6.1.1.1.2: Compose songs around values discussed"],

  // English - Reading
  "B1.2.2.1: Identify the alphabet in order": ["B1.2.2.1.1: Identify the alphabet in order (aA-zZ)", "B1.2.2.1.2: Recognise and produce letter names and sounds randomly"],
  "B4.2.2.1: Match sounds to their corresponding letter patterns": ["B4.2.2.1.1: Match sounds to their corresponding letter patterns", "B4.2.2.1.2: Read single-syllable-words with taught consonant digraphs"],
  "B5.2.2.1: Apply common phonic generalisations": ["B5.2.2.1.1: Apply common phonic generalisations (e.g. hard and soft “c” and “g”)", "B5.2.2.1.2: Read two syllable words with suffixes and 'r' controlled words"],
  "B6.2.2.1: Read words with specific ending sounds": ["B6.2.2.1.1: Read words with ending sounds like 'sure', 'ture' and 'tch'", "B6.2.2.1.2: Read ccvcc, cccvc words and multisyllabic words"],

  // English - Writing
  "B1.4.2.1: Copy and write letters of the alphabet correctly": ["B1.4.2.1.1: Copy letters of the alphabet clearly", "B1.4.2.1.2: Match lower and upper case letters"],
  "B4.4.2.1: Write clearly using joined letters": ["B4.4.2.1.1: Write clearly using joined letters of consistent size", "B4.4.2.1.2: Use simple sentences clearly and correctly"],
  "B5.4.2.1: Copy sentences clearly in joint script": ["B5.4.2.1.1: Copy sentences clearly in joint script maintaining legible handwriting", "B5.4.2.1.2: Write compound sentences clearly and correctly"],
  "B6.4.2.1: Write with a legible, fluent and personal style": ["B6.4.2.1.1: Write with a legible, fluent and personal handwriting style", "B6.4.2.1.2: Write complex sentences clearly and correctly"],

  // English - Grammar Usage at Word and Phrase Levels
  "B4.3.1.1: Identify and use nouns to identify people, animals, events and objects": ["B4.3.1.1.1: Identify and use nouns in sentences", "B4.3.1.1.2: Differentiate between common and proper nouns", "B4.3.1.1.3: Use collective and abstract nouns"],
  "B5.3.1.1: Identify and use nouns or noun phrases to refer to quantities or units": ["B5.3.1.1.1: Use nouns or noun phrases to refer to quantities or units", "B5.3.1.1.2: Use count and non-count nouns correctly"],
  "B6.3.1.1: Identify and use nouns or noun phrases to describe conditions": ["B6.3.1.1.1: Identify and use nouns in describing conditions", "B6.3.1.1.2: Use gerunds (-ing nouns) in activities"],
  "B4.3.2.1: Apply knowledge of different types of determiners": ["B4.3.2.1.1: Use definite and indefinite articles (a, an, the)", "B4.3.2.1.2: Use simple quantifiers (some, few, all)"],
  "B5.3.2.1: Apply knowledge of different types of determiners (e.g. articles, quantifiers)": ["B5.3.2.1.1: Use articles and quantifiers appropriately", "B5.3.2.1.2: Use possessive pronouns and demonstratives"],
  "B6.3.2.1: Apply knowledge of definite and indefinite articles": ["B6.3.2.1.1: Use articles in complex sentences", "B6.3.2.1.2: Use interrogative determiners"],
  "B4.3.3.1: Apply knowledge of different types of pronouns": ["B4.3.3.1.1: Use personal pronouns correctly", "B4.3.3.1.2: Use interrogative pronouns"],
  "B5.3.3.1: Identify and use indefinite pronouns": ["B5.3.3.1.1: Use indefinite pronouns (someone, anyone, everything)", "B5.3.3.1.2: Use possessive pronouns to show possession"],
  "B6.3.3.1: Identify and use reflexive, relative and reciprocal pronouns": ["B6.3.3.1.1: Use reflexive pronouns (myself, yourself)", "B6.3.3.1.2: Use relative and reciprocal pronouns"],
  "B4.3.5.1: Apply the knowledge of verbs in communication": ["B4.3.5.1.1: Use main and auxiliary verbs", "B4.3.5.1.2: Use simple present and simple past forms"],
  "B5.3.5.1: Use different types of verbs in sentences": ["B5.3.5.1.1: Differentiate between simple past and present perfect", "B5.3.5.1.2: Use past continuous form"],
  "B6.3.5.1: Use past continuous and past perfect forms": ["B6.3.5.1.1: Use past perfect form in speech and writing", "B6.3.5.1.2: Apply correct subject-verb agreement across multiple tenses"],

  // Career Technology - Technology
  "B7.4.1.1: Demonstrate understanding of structures in construction": ["B7.4.1.1.1: Outline the uses of structures in construction", "B7.4.1.1.2: Discuss the causes of structural failures in construction", "B7.4.1.1.3: Design and make simple structures"],

  // Creative Arts - Visual Arts
  "B1-B6.1.1.1: Demonstrate understanding of how to generate own ideas for artistic expressions on the people, based on their history and culture, the environment and the topical local/national/global issues": [
    "B1.1.1.1: Think about the people in the local community and their history/culture",
    "B2.1.1.1: Describe views of history and culture of people in other communities in the region",
    "B3.1.1.1: Explain views of history and culture of people in other regions in Ghana",
    "B4.1.1.1: Explain views on history and culture of people in African countries",
    "B5.1.1.1: Explain views on history and culture of people across the world",
    "B6.1.1.1: Reflect and share views on history and culture of people in the world"
  ],
  "B1-B6.1.2.2: Demonstrate understanding of how to organise own ideas through experimenting with available media and techniques for creating/composing artworks, based on history and culture, the environment and topical local/national/global issues": [
    "B1.1.2.2: Develop ideas for making artworks reflecting local community",
    "B4.1.2.2: Experiment with media and techniques reflecting African communities"
  ],
  "B1-B6.1.2.3: Demonstrate understanding of how to create expressive artworks based on own ideas by applying knowledge of media and methods of production to reflect other cultures in Africa, visual artists, their culture, the environment and emerging topical issues": [
    "B1.1.2.3: Create artworks that reflect the natural environment",
    "B4.1.2.3: Create artworks using media and techniques that reflect other African cultures"
  ],

  // Creative Arts - Performing Arts
  "B1-B6.2.1.1: Demonstrate understanding of how to generate own ideas for artistic expressions on the people, based on their history and culture, the environment and the topical local/national/global issues": [
    "B1.2.1.1: Describe history and culture of local community through performing arts",
    "B4.2.1.1: Explain views on history and culture of people in African countries through performing arts"
  ],

  // Computing - Introduction to Computing
  "B4-B6.1.1.1: Identify parts of a computer and technology tools": [
    "B4.1.1.1.1: Discuss the generation of computers",
    "B4.1.1.1.2: Demonstrate the use of different parts of a computer",
    "B5.1.1.1.1: Discuss types of computers (Mainframes, supercomputers, PCs)",
    "B6.1.1.1.1: Discuss importance of computers in everyday life"
  ],
  "B4-B6.1.2.1: Demonstrate the use of the Desktop Background as well as working with folders": [
    "B4.1.2.1.1: Describe icons on the desktop",
    "B4.1.2.1.2: Demonstrate how to create a folder",
    "B5.1.2.1.1: Demonstrate how to change desktop background",
    "B6.1.2.1.1: Demonstrate how to manage files and folders"
  ],

  // Computing - Word Processing
  "B4-B6.3.1.1: Demonstrate understanding of the use of word processing application": [
    "B4.3.1.1.1: Identify word processing applications",
    "B4.3.1.1.2: Demonstrate how to launch and exit word processor",
    "B5.3.1.1.1: Demonstrate how to create and save a document",
    "B6.3.1.1.1: Demonstrate how to format text in word processor"
  ],
  "B8.4.1.1: Demonstrate understanding of application of principles of forces acting on structures": ["B8.4.1.1.1: Perform experiments on forces", "B8.4.1.1.2: Design and make technology projects"],
  "B9.4.1.1: Demonstrate knowledge of mechanisms in projects construction": ["B9.4.1.1.1: Describe mechanisms", "B9.4.1.1.2: Principles of mechanisms", "B9.4.1.1.3: Design with mechanisms"],

  // Career Technology - Designing and Making
  "B7.5.1.1: Demonstrate knowledge and skills of drawing materials, instruments/equipment, lines and sketching": ["B7.5.1.1.1: Identify drawing materials", "B7.5.1.1.2: Types of lines", "B7.5.1.1.3: Lettering", "B7.5.1.1.4: Sketching"],
  "B8.5.1.1: Demonstrate understanding of drawing plane figures and solid objects using drawing instruments": ["B8.5.1.1.1: Draw plane figures", "B8.5.1.1.2: Pictorial drawing"],
  "B9.5.1.1: Demonstrate understanding of developing surfaces of objects for production/ manufacturing": ["B9.5.1.1.1: Prisms and pyramids", "B9.5.1.1.2: Develop surfaces"],
  "B9.5.1.2: Demonstrate understanding of orthographic projections": ["B9.5.1.2.1: Principles of orthographic projections", "B9.5.1.2.2: Draw orthographic projections"],
  "B7.5.2.1: Demonstrate understanding of Designing": ["B7.5.2.1.1: Work with design brief", "B7.5.2.1.2: Generate ideas"],
  "B8.5.2.1: Demonstrate knowledge and skills of Designing": ["B8.5.2.1.1: Design brief", "B8.5.2.1.2: Research problems", "B8.5.2.1.3: Specifications", "B8.5.2.1.4: Generate ideas", "B8.5.2.1.5: Make artefact", "B8.5.2.1.6: Evaluate artefact", "B8.5.2.1.7: Cutting without patterns"],
  "B9.5.2.1: Demonstrate knowledge of Designing": ["B9.5.2.1.1: User requirements", "B9.5.2.1.2: Clarify requirements", "B9.5.2.1.3: Generate ideas", "B9.5.2.1.4: Develop solution"],
  "B7.5.3.1: Demonstrate understanding of planning for making artefacts/products": ["B7.5.3.1.1: Factors in planning a meal", "B7.5.3.1.2: Moist methods of cooking"],
  "B8.5.3.1: Demonstrate understanding of planning for making artefacts/products and table setting": ["B8.5.3.1.1: Plan wooden/metal artefacts", "B8.5.3.1.2: Plan building artefacts", "B8.5.3.1.3: Table setting"],
  "B9.5.3.1: Demonstrate understanding of planning for making artefacts/ products/ meals": ["B9.5.3.1.1: Dry methods of cooking", "B9.5.3.1.2: Menu planning", "B9.5.3.1.3: Clarify user requirements", "B9.5.3.1.4: Natural building materials"],
  "B7.5.4.1: Demonstrate skills of making artefacts/products": ["B7.5.4.1.1: Preparing food", "B7.5.4.1.2: Sewing and crocheting", "B7.5.4.1.3: Mock-ups"],
  "B8.5.4.1: Demonstrate understanding of designing artefacts/products, and models and table setting": ["B8.5.4.1.1: Table setting", "B8.5.4.1.2: Sewing artefacts", "B8.5.4.1.3: Wood/metal artefacts"],
  "B9.5.4.1: Demonstrate understanding of gathering materials, tools and equipment for making meals/articles": ["B9.5.4.1.1: Preparations with dry methods", "B9.5.4.1.2: Advanced crocheting", "B9.5.4.1.3: Gather materials for artefacts"],

  // Career Technology - Entrepreneurial Skills
  "B7.6.1.1: Demonstrate awareness of own learning styles, interests, biases, beliefs and reasons": ["B7.6.1.1.1: Evaluate own learning styles"],
  "B8.6.1.1: Demonstrate knowledge of career opportunities in Career Technology": ["B8.6.1.1.1: Explore career pathways"],
  "B9.6.1.1: Demonstrate understanding about the changing nature of the workplace and personal goals": ["B9.6.1.1.1: Changing nature of workplace", "B9.6.1.1.2: Value of work", "B9.6.1.1.3: Career plan"],
  "B7.6.2.1: Demonstrate understanding of Establishing and managing a Small business enterprise": ["B7.6.2.1.1: Meaning of entrepreneurship", "B7.6.2.1.2: Characteristics of entrepreneur", "B7.6.2.1.3: Advantages of being entrepreneur", "B7.6.2.1.4: Opportunities in locality"],
  "B8.6.2.1: Demonstrate understanding of establishing and managing micro and small business enterprises": ["B8.6.2.1.1: Micro, small and medium enterprises"],
  "B9.6.2.1: Demonstrate understanding of establishing and managing a small business enterprise": ["B9.6.2.1.1: How to start a small business", "B9.6.2.1.2: Manage resources"],

  // Computing - Strand 1
  "B7.1.1.1: Examine the parts of a computer": ["B7.1.1.1.1: Discuss the fourth-generation computers", "B7.1.1.1.2: Demonstrate understanding in the use of input devices", "B7.1.1.1.3: Examine the uses of the output devices"],
  "B8.1.1.1: Identify parts a computer and technology tools": ["B8.1.1.1.1: Discuss the fifth generation of computers", "B8.1.1.1.2: Demonstrate understanding of direct data entry devices", "B8.1.1.1.3: Examine the uses of the output devices (3D printers, etc)"],
  "B9.1.1.1: Identify parts of a Computer and Technology Tools": ["B9.1.1.1.1: Discuss the trends in the next generation of computers", "B9.1.1.1.2: Examine the concept of Perceptual Computing", "B9.1.1.1.3: Discuss the uses of Wearable Displays"],
  "B7.1.2.1: Demonstrate the use of Technology in the community": ["B7.1.2.1.1: Describe technology tools for learning", "B7.1.2.1.2: Demonstrate the use of technology tools", "B7.1.2.1.3: Discuss the benefits of using technology tools in learning"],
  "B7.1.3.1: Demonstrate how to apply Health and Safety measures": ["B7.1.3.1.1: Describe health measures and computing-related disorders", "B7.1.3.1.2: Describe Safety measures in using ICT tools"],

  // Computing - Strand 2
  "B7.2.1.1: Demonstrate how to use Microsoft Word (Editing)": ["B7.2.1.1.1: Explain the importance of word processing software", "B7.2.1.1.2: Demonstrate how to insert, select, delete and move text", "B7.2.1.1.3: Demonstrate how to find and replace content"],
  "B8.2.3.1: Demonstrate how to use MS-Publisher": ["B8.2.3.1.1: Explain the importance of desktop publishing software", "B8.2.3.1.2: Create and save a new document from a blank or pre-designed template"],
  "B7.2.3.1: Demonstrate how to use the Spreadsheet": ["B7.2.3.1.1: Explain the importance of electronic spreadsheet", "B7.2.3.1.2: Explore features of MS-Excel interface"],

  // Computing - Strand 3
  "B7.3.1.1: Identify the concept of computer networking for global communications": ["B7.3.1.1.1: Draw diagrams to illustrate features of the network topologies", "B7.3.1.1.2: Describe types of networks (PAN, LAN, MAN, WAN)"],
  "B7.3.3.1: Recognise data threats and means of protection": ["B7.3.3.1.1: Discuss the key principles of information security", "B7.3.3.1.2: Explore legal issues regarding intellectual property rights"],

  // Computing - Strand 4
  "B7.4.1.1: Show an understanding of the concept of programming": ["B7.4.1.1.1: Demonstrate the correct use of programming terminologies", "B7.4.1.1.2: Demonstrate understanding in the use of data types"],
  "B7.4.2.1: Analyse the correct step-by-step procedure in solving any real-world problem": ["B7.4.2.1.1: Understand the use of sequence, selection and iteration", "B7.4.2.1.2: Perform a linear search"],
  "B7.4.4.1: Discuss Artificial intelligence concepts": ["B7.4.4.1.1: Discuss the application of various areas of artificial intelligence"],
  "B9.4.4.1: Discuss Artificial intelligence Concepts": ["B9.4.4.1.1: Describe the knowledge-based systems (Expert systems)"],

  // Creative Arts - Design
  "B7.1.1.1: Design in nature and manmade environment": ["B7.1.1.1.1: Meaning, importance and role of design", "B7.1.1.1.2: Record elements of design in nature"],
  "B8.1.1.1: Design as a concept": ["B8.1.1.1.1: Use elements and principles of design", "B8.1.1.1.2: Record elements of design in nature"],
  "B9.1.1.1: Design as a concept (variety, proportion)": ["B9.1.1.1.1: Use elements (form, value) and principles (variety, proportion)"],
  "B7.1.2.1: Outline drawing, shading, colouring": ["B7.1.2.1.1: Explore tools for outline drawing", "B7.1.2.1.2: Experiment with manual tools"],
  "B7.1.3.1: Design process and models": ["B7.1.3.1.1: Creativity and innovation differences", "B7.1.3.1.2: Design process steps"],

  // Creative Arts - Media and Techniques
  "B7.2.1.1: Visual Arts Media": ["B7.2.1.1.1: Tools for still-life drawing", "B7.2.1.1.2: Shading techniques"],
  "B7.2.1.2: Music Scale": ["B7.2.1.2.5: Sing diatonic major scale", "B7.2.1.2.6: Identify durational symbols"],
  "B7.2.1.3: Dance and Drama Techniques": ["B7.2.1.3.8: Ghanaian dance movements", "B7.2.1.3.9: Body movements and voice projections"],

  "B9.2.1.1: Visual Arts Casting": ["B9.2.1.1.1: Media and techniques for casting", "B9.2.1.1.2: Techniques in casting"],
  "B9.2.1.2: Music Triads": ["B9.2.1.2.5: Sing in pitch triads", "B9.2.1.2.6: Create/improvise a melody"],

  // Creative Arts - Expression
  "B7.2.2.1: Visual Arts Idea development": ["B7.2.2.1.1: Design and produce visual artworks"],
  "B9.2.2.3: Producing a Dance Drama": ["B9.2.2.3.7: Rehearse and perform original dance drama"],

  // Creative Arts - Connections
  "B7.2.3.1: Visual Arts Correlate ideas": ["B7.2.3.1.1: Narrate own views of history and culture"],
  "B9.2.3.1: Visual Arts Correlate African artists": ["B9.2.3.1.1: Analyse creative artworks of African visual artists"],

  // Mathematics - Number
  "B7.1.1.1: Demonstrate understanding and the use of place value": ["B7.1.1.1.1: Model number quantities up to 1,000,000,000", "B7.1.1.1.2: Compare and order whole numbers", "B7.1.1.1.3: Round whole numbers"],
  "B8.1.1.1: Use place value for expressing quantities in standard form": ["B8.1.1.1.4: Express integers of any size into standard form", "B8.1.1.1.5: Express integers in a given number of significant and decimal places"],
  "B9.1.1.1: Apply the understanding of place value in solving real life problems": ["B9.1.1.1.1: Express integers to a given number of significant and decimal places", "B9.1.1.1.2: Use knowledge of place value to solve real life problems"],
  "B7.1.2.1: Apply mental mathematics strategies": ["B7.1.2.1.1: Multiply and divide by powers of 10", "B7.1.2.1.2: Apply number properties for mental calculations"],
  "B7.1.4.1: Demonstrate an understanding of the concept of ratios": ["B7.1.4.1.1: Find ratio and use ratio language", "B7.1.4.1.2: Use the concept of a unit rate", "B7.1.4.1.3: Make tables of equivalent ratios"],
  
  // Mathematics - Algebra
  "B7.2.3.1: Demonstrate an understanding of linear equations": ["B7.2.3.1.1: Translate word problems to linear equations", "B7.2.3.1.2: Model and solve linear equations concretely"],
  "B8.2.1.1: Determine the gradient of the line": ["B8.2.1.1.1: Calculate the gradient and use y = mx + c", "B8.2.1.1.2: Use graph to determine missing elements"],
  "B9.2.1.1: Construct tables of values for pairs of linear relations": ["B9.2.1.1.1: Construct and graph linear relations", "B9.2.1.1.3: Solve equations involving two linear relations"],

  // Mathematics - Geometry
  "B7.3.1.1: Demonstrate understanding of angles": ["B7.3.1.1.1: Measure and classify angles", "B7.3.1.1.2: Apply complementary and supplementary angles"],
  "B8.3.2.1: Apply Pythagoras theorem": ["B8.3.2.1.1: Deduce formula for area of a circle", "B8.3.2.1.2: Establish relationship between hypotenuse and other sides"],
  "B9.3.2.1: Determine the surface area of prisms": ["B9.3.2.1.1: Identify cuboids and triangular prisms", "B9.3.2.1.2: Use net of a cuboid to determine surface area"],
  
  // Science - Diversity of Matter
  "B7.1.1.1: Recognise materials as important resources for providing human needs": [
    "B7.1.1.1.1: Classify materials into liquids, solids and gases",
    "B7.1.1.1.2: Discuss the importance of liquids in the life of humans",
    "B7.1.1.1.3: Discuss the importance of specific solids to life"
  ],
  "B7.1.1.2: Understand the periodic table as different elements made up of metals, non-metals and noble gases arranged in an order": [
    "B7.1.1.2.1: Demonstrate the knowledge of the orderly arrangement of metals, non-metals and noble gases in the periodic table"
  ],
  "B8.1.1.1: Identify types of mixtures by name and characteristics": [
    "B8.1.1.1.1: Identify types of mixtures by name and characteristics",
    "B8.1.1.1.2: Design and perform processes for separating kinds of mixtures"
  ],
  "B8.1.1.2: Describe atoms as composed of sub-atomic particles": [
    "B8.1.1.2.1: Describe atoms as composed of sub-atomic particles",
    "B8.1.1.2.2: Explain the arrangement of elements in terms of the number of protons in the nuclei of atoms of each element"
  ],
  "B9.1.1.1: Show an understanding of formation of binary chemical compounds and their uses (Acids, Bases and Salts)": [
    "B9.1.1.1.1: Identify by name binary chemical compounds and discuss their uses",
    "B9.1.1.1.2: Discuss the formation of binary chemical compounds",
    "B9.1.1.1.3: Describe the characteristics of common acids, bases and salts"
  ],
  "B9.1.1.2: Demonstrate knowledge of atomic bonding in the formation of chemical compounds": [
    "B9.1.1.2.1: Recognise that chemical bond results from the attraction between atoms in a compound"
  ],
  "B7.1.2.1: Demonstrate understanding of the structure of organisms and functions of cells in living systems": [
    "B7.1.2.1.1: Describe the structure and function of living cells of an animal",
    "B7.1.2.1.2: State the functions of each organelle in a plant cell"
  ],
  "B8.1.2.1: Demonstrate an understanding of the types of cells and their structure in relation to different organisms": [
    "B8.1.2.1.1: Examine and describe the structure of prokaryotic and eukaryotic cells",
    "B8.1.2.1.2: Classify organisms (plants or animals) as prokaryotic or eukaryotic based on the type of cells they are made of"
  ],
  "B9.1.2.1: Demonstrate knowledge of specialist cells of dicotyledonous plants and humans, their formation and functions": [
    "B9.1.2.1.1: Discuss the concepts of specialised cells and how they are formed in dicotyledonous plants and humans",
    "B9.1.2.1.2: Examine the functions of specialised cells in dicotyledonous plants such as epidermal, guard cells, cambium, xylem",
    "B9.1.2.1.3: Examine the functions of specialised animal cells such as (nerve, blood cells, muscle cells and sperm cells)"
  ],

  // Science - Cycles
  "B7.2.1.1: Recognise that the water cycle is an example of repeated patterns of change in nature and understand how it occurs": [
    "B7.2.1.1.1: Explain how the water cycle occurs as a repeated pattern in nature",
    "B7.2.1.1.2: Describe the importance of the water cycle in nature"
  ],
  "B8.2.1.1: Demonstrate understanding of the process of Carbon cycle as an example of repeated pattern of change in nature": [
    "B8.2.1.1.1: Explain the process of the carbon cycle",
    "B8.2.1.1.2: Describe the role of the carbon cycle to the environment"
  ],
  "B9.2.1.1: Demonstrate an understanding of the Nitrogen cycle as a repeated pattern of change in nature": [
    "B9.2.1.1.1: Explain the process of the nitrogen cycle as a repeated pattern in nature",
    "B9.2.1.1.2: Describe the importance of the nitrogen cycle to the environment"
  ],
  "B7.2.2.1: Demonstrate the skills of carrying out activities to show the stages of the life cycle of a housefly": [
    "B7.2.2.1.1: Describe the life cycle of the housefly",
    "B7.2.2.1.2: Discuss the activities of the housefly as a menace to humans and show how to reduce the effects"
  ],
  "B8.2.2.1: Demonstrate an activity to show the life cycle of the Anopheles mosquito and show how the effects can be managed": [
    "B8.2.2.1.1: Describe the life cycle and economic importance of the Anopheles mosquito",
    "B8.2.2.1.2: Discuss the impact of the Anopheles mosquito on humans and how it can be controlled"
  ],
  "B9.2.2.1: Demonstrate an understanding of the life cycle of grasshopper and assess how their activities affect humans": [
    "B9.2.2.1.1: Describe the life cycle of the grasshopper as a form of incomplete metamorphosis",
    "B9.2.2.1.2: Examine how the activities of the grasshopper affect humans"
  ],
  "B7.2.3.1: Demonstrate understanding of the different plant nutrients (organic, and inorganic fertilizers) and their application": [
    "B7.2.3.1.1: Observe and list all plant nutrient sources available in a community and categorise them",
    "B7.2.3.1.2: Describe the physical characteristics of different plant nutrients and how each is applied"
  ],
  "B8.2.3.1: Demonstrate knowledge and skills in planting crops on different seed beds": [
    "B8.2.3.1.1: Explore the different seed beds for planting crops in your community",
    "B8.2.3.1.2: Plant different types of crops on different seed beds"
  ],
  "B8.2.3.2: Demonstrate understanding of the differences in height, size, and flowering of crops grown in different seed beds": [
    "B8.2.3.2.1: Compare and contrast the differences in height, size, and flowering of crops grown in different seed beds"
  ],
  "B9.2.3.1: Show an understanding of differences in maturities of different crops grown in different soils and seed beds": [
    "B9.2.3.1.1: Observe and describe differences in maturation of crops grown in different soils and seed beds"
  ],
  "B9.2.3.2: Demonstrate knowledge and understanding of uses of different crops at different maturity stages": [
    "B9.2.3.2.1: Observe and record the uses of different crops at different maturity stages",
    "B9.2.3.2.2: Evaluate the importance of knowledge of the maturity stages of different crops to human beings"
  ],
  "B7.2.4.1: Demonstrate an understanding of the differences among domestic animals such as ruminants, monogastrics and poultry": [
    "B7.2.4.1.1: Examine and list domestic animals in the community",
    "B7.2.4.1.2: Show the differences and similarities among domestic animals"
  ],
  "B7.2.4.2: Show an understanding of the usefulness of the different types of animals for domestic and commercial purposes": [
    "B7.2.4.2.1: Discuss and write the domestic and commercial uses of different types of animals",
    "B7.2.4.2.2: Observe and compare the uses of the different types of animals"
  ],
  "B8.2.4.1: Recognise the different types of feed for different types of animals": [
    "B8.2.4.1.1: Compare and contrast the different types of feed for different types of animals"
  ],
  "B8.2.4.2: Demonstrate understanding of the importance of water and animal feed to the growth of animals": [
    "B8.2.4.2.1: Explain the importance of water and animal feed to the growth of animals"
  ],
  "B9.2.4.1: Demonstrate understanding of the preparation of feed for domestic and commercial animals": [
    "B9.2.4.1.1: List the ingredients and the method of preparation of different feed for different domestic and commercial animals"
  ],
  "B9.2.4.2: Demonstrate skills and knowledge of feeding domestic and commercial animals": [
    "B9.2.4.2.1: Describe and select appropriate feed for different domestic and commercial animals",
    "B9.2.4.2.2: Differentiate between different types of feed for different stages of domestic and commercial animals",
    "B9.2.4.2.3: Perform the feeding of domestic and commercial animals"
  ],

  // Science - Systems
  "B7.3.1.1: Show an understanding of the concept of food, and the process of digestion and appreciate its importance in humans": [
    "B7.3.1.1.1: Explain the concept of food and the need for humans to eat",
    "B7.3.1.1.2: Examine what happens to food at the stages of digestion in humans",
    "B7.3.1.1.3: Identify the end product of digestion of starchy, protein and oily foods"
  ],
  "B8.3.1.1: Demonstrate knowledge of parts of mammalian tooth and the functions of the different types of teeth": [
    "B8.3.1.1.1: Identify parts of a mammalian tooth",
    "B8.3.1.1.2: Discuss the functions of the different types of teeth such as incisors, canines, premolars, and molars",
    "B8.3.1.1.3: Explain the causes and prevention of tooth and gum decay"
  ],
  "B9.3.1.1: Demonstrate understanding of the blood circulatory system, health problems associated with the system": [
    "B9.3.1.1.1: Explain the concept of the circulatory system, state the function of each part of the system",
    "B9.3.1.1.2: Explain the concept of respiration and show how the respiratory and circulatory systems complement each other"
  ],
  "B7.3.2.1: Demonstrate knowledge of the inner planets of the solar system and understand their movement in the system": [
    "B7.3.2.1.1: Identify the inner planets of the solar system and describe their properties",
    "B7.3.2.1.2: Discuss the properties and the relative motions of the planets Mercury and Venus"
  ],
  "B8.3.2.1: Demonstrate knowledge of the outer planets of the solar system": [
    "B8.3.2.1.1: Identify the outer planets of the solar system and describe their properties"
  ],
  "B9.3.2.1: Demonstrate knowledge of other non-planetary bodies such as comets, asteroids, and their relationship with the solar system": [
    "B9.3.2.1.1: Understand the movement of non-planetary bodies in the solar system"
  ],
  "B7.3.3.1: Recognise the components of and interdependences in an ecosystem, and appreciate their interactions": [
    "B7.3.3.1.1: Analyse the components of ecosystems and identify the interactions within"
  ],
  "B8.3.3.1: Demonstrate an understanding of the interdependence of organisms in an ecosystem and their interaction": [
    "B8.3.3.1.1: Explore the feeding relationships within an ecosystem"
  ],
  "B9.3.3.1: Recognise the interdependence of organisms in an ecosystem and appreciate their interaction to maintain balance": [
    "B9.3.3.1.1: Conduct research into the composition of an ecosystem and discuss how the components depend on each other"
  ],
  "B7.3.4.1: Demonstrate an understanding of the differences among the various farming systems": [
    "B7.3.4.1.1: Examine and discuss the differences among the various farming systems",
    "B7.3.4.1.2: Categorise different farming systems",
    "B7.3.4.1.3: Discuss the usefulness of different farming systems"
  ],
  "B8.3.4.1: Demonstrate understanding of the different crop, animal and land combinations under various farming systems": [
    "B8.3.4.1.1: Identify and describe the types of crops, animals and land combinations for the different farming systems",
    "B8.3.4.1.2: Discuss the usefulness of the different crops and animals involved in the different farming systems"
  ],
  "B9.3.4.1: Demonstrate knowledge and skills in the preparation of different types of manure from animal and plant waste": [
    "B9.3.4.1.1: List and explain the different plant and animal waste used in preparing different types of manure",
    "B9.3.4.1.2: Demonstrate the preparation of different types of manure",
    "B9.3.4.1.3: Prepare different types of manure"
  ],

  // Science - Forces and Energy
  "B7.4.1.1: Demonstrate an understanding of forms of energy and their daily applications": [
    "B7.4.1.1.1: Identify the various forms of energy and show how they are related",
    "B7.4.1.1.2: Explain daily applications of forms of energy"
  ],
  "B7.4.1.2: Demonstrate an understanding of the concept of heat transfer and its applications in life": [
    "B7.4.1.2.1: Explain and demonstrate how heat is transferred in various media"
  ],
  "B7.4.1.3: Demonstrate understanding of characteristics of light, such as travelling in a straight line, reflection, refraction and dispersion": [
    "B7.4.1.3.1: Demonstrate how light travels in a straight line"
  ],
  "B8.4.1.1: Demonstrate the skill to evaluate the conversion of energy from one form to another": [
    "B8.4.1.1.1: Describe energy conversion",
    "B8.4.1.1.2: Discuss the importance of conversion of energy"
  ],
  "B8.4.1.2: Show an understanding of the sources of renewable energy and how to manage these sources in a sustainable manner": [
    "B8.4.1.2.1: Describe renewable and non-renewable forms of energy",
    "B8.4.1.2.2: Demonstrate how to manage sources of renewable energy sustainably"
  ],
  "B8.4.1.3: Demonstrate an understanding of the relationship between heat and temperature": [
    "B8.4.1.3.1: Discuss the differences and the relationship between heat and temperature in the environment"
  ],
  "B9.4.1.1: Show understanding of the concept of conservation of energy and ways of conserving energy": [
    "B9.4.1.1.1: List the ways to conserve energy",
    "B9.4.1.1.2: Explain the importance of energy conservation in daily life"
  ],
  "B9.4.1.2: Demonstrate understanding in and the capability to do calculations involving energy": [
    "B9.4.1.2.1: Explain how to calculate energy consumed over a period of time",
    "B9.4.1.2.2: Describe how images are formed in cameras",
    "B9.4.1.2.3: Describe the formation of shadows",
    "B9.4.1.2.4: Demonstrate the formation of an eclipse"
  ],
  "B9.4.1.3: Evaluate the application of light energy in life": [
    "B9.4.1.3.1: Demonstrate that light changes path when it travels from one medium to a different medium"
  ],
  "B7.4.2.1: Demonstrate understanding of forms of electricity, its generation and effects on the environment": [
    "B7.4.2.1.1: Describe the various forms of electricity generation",
    "B7.4.2.1.2: Explain the impact of electricity generation on the environment"
  ],
  "B7.4.2.2: Demonstrate knowledge of how to assemble and explain the functions of basic electronic components and their interdependence in an electronic circuit": [
    "B7.4.2.2.1: Demonstrate how to assemble basic electronic components in an electronic circuit",
    "B7.4.2.2.2: Discuss the function of each electronic component and their interdependence",
    "B7.4.2.2.3: Discuss the function of each electronic component such as resistor, diode, and inductor"
  ],
  "B8.4.2.1: Demonstrate knowledge of electricity transmission": [
    "B8.4.2.1.1: Explain how electricity transmission occurs"
  ],
  "B8.4.2.2: Demonstrate understanding of the functions of capacitors in relation to LEDs, Diodes and resistors in electronic circuits": [
    "B8.4.2.2.1: Demonstrate the charging and discharging action of a capacitor in a DC electronic circuit"
  ],
  "B9.4.2.1: Construct electrical circuits and illustrate how electrical energy is transformed into other forms of energy and perform electrical calculations": [
    "B9.4.2.1.1: Demonstrate transformation of electrical energy to other forms of energy"
  ],
  "B9.4.2.2: Demonstrate an understanding of Forward and Reverse Bias and explain the behaviour of LEDs, Diodes, Resistors and Capacitors in electronic circuits": [
    "B9.4.2.2.1: Describe forward bias and reverse bias and explain the relationship among the components"
  ],
  "B7.4.3.1: Demonstrate an understanding of the principle of conservation and conversion of energy and their application in real life situations": [
    "B7.4.3.1.1: Explain the principle underlying conservation and conversion of energy",
    "B7.4.3.1.2: Demonstrate the conversion of energy into useable forms",
    "B7.4.3.1.3: Know how energy could be conserved for future use in life"
  ],
  "B8.4.3.1: Evaluate the impact of conversion of energy and energy conservation on the environment": [
    "B8.4.3.1.1: Explain the importance of conversion of energy and energy conservation in daily life"
  ],
  "B9.4.3.1: Show an understanding of conversion and conservation of energy and their application to life": [
    "B9.4.3.1.1: Describe how energy can be converted from one form to another and show how conservation occurs",
    "B9.4.3.1.2: Describe how conversion and conservation of energy are applied in life"
  ],
  "B7.4.4.1: Examine the concept of motion, Newton’s first law of motion, magnetic force in relation to motion and understand their applications to life": [
    "B7.4.4.1.1: Understand that unbalanced forces acting on an object cause it to move",
    "B7.4.4.1.2: State and explain Newton’s First Law of motion",
    "B7.4.4.1.3: Examine the application of Newton’s First Law of motion in life",
    "B7.4.4.1.4: Demonstrate the behaviour of magnet and its use to life"
  ],
  "B7.4.4.2: Recognise some simple machines, and show understanding of their efficiency in doing work": [
    "B7.4.4.2.1: Identify simple machines",
    "B7.4.4.2.2: Describe the types and functions of levers",
    "B7.4.4.2.3: Know work input, and output and efficiency as they apply to machines"
  ],
  "B8.4.4.1: Demonstrate the production of magnet, domestic and industrial application of Magnetic force and its relationship with Newton’s Second law of motion and in everyday life": [
    "B8.4.4.1.1: Demonstrate simple ways of making magnets and show how magnetic force can be applied",
    "B8.4.4.1.2: Explain the relationship between magnetic force and Newton’s Second Law of motion"
  ],
  "B8.4.4.2: Demonstrate understanding of complex machines and how they work": [
    "B8.4.4.2.1: Identify complex machines and describe their functions in life"
  ],
  "B9.4.4.1: Demonstrate understanding of the concept of pressure and explain how pressure acts in everyday life": [
    "B9.4.4.1.1: Explain the concept of pressure and show how pressure relates to force",
    "B9.4.4.1.2: Demonstrate the application of Newton’s Third Law of motion in life"
  ],
  "B9.4.4.2: Demonstrate an understanding of Newton’s Third Law of Motion and its application in everyday life": [
    "B9.4.4.2.1: Explain Newton’s Laws of Motion and their applications to daily life"
  ],
  "B7.4.5.1: Demonstrate knowledge and skills in handling and maintenance of basic and simple agricultural tools": [
    "B7.4.5.1.1: Explain the basic rules in handling and maintaining simple agricultural tools",
    "B7.4.5.1.2: Apply the handling and maintenance of basic and simple agricultural tools in their community"
  ],
  "B8.4.5.1: Demonstrate knowledge and skills in the use of basic and simple agricultural tools for basic on-farm activities": [
    "B8.4.5.1.1: Show and discuss the use of basic and simple agricultural tools for basic on-farm activities",
    "B8.4.5.1.2: Engage in the use of basic and simple agricultural tools for basic farm activities"
  ],
  "B9.4.5.1: Demonstrate knowledge and skills in making simple agricultural tools for on-farm activities": [
    "B9.4.5.1.1: Identify materials used in making simple agricultural tools",
    "B9.4.5.1.2: Discuss and write activities involved in making simple agricultural tools",
    "B9.4.5.1.3: Manufacture simple agricultural tools"
  ],

  // Science - Humans and the Environment
  "B7.5.1.1: Exhibit knowledge and skill of scientific basis for management practices of types of waste in the environment": [
    "B7.5.1.1.1: Apply information from research on good management practices of waste to make the environment clean"
  ],
  "B8.5.1.1: Demonstrate knowledge of waste management systems and apply it in an environment": [
    "B8.5.1.1.1: Explain sustainable waste management practices",
    "B8.5.1.1.2: Apply knowledge of waste management practices to manage waste in a community"
  ],
  "B9.5.1.1: Demonstrate an understanding of the scientific ways of waste management": [
    "B9.5.1.1.1: Investigate the scientific methods used in waste management"
  ],
  "B9.5.1.2: Demonstrate an understanding of the impact of waste on an environment, innovative waste management technologies": [
    "B9.5.1.2.1: Describe innovative ways of waste management for sustainable development"
  ],
  "B7.5.2.1: Demonstrate knowledge of common deficiency diseases of humans, their causes, symptoms, effects and prevention": [
    "B7.5.2.1.1: Explain the relationship between food nutrients and common deficiency diseases and how they affect humans"
  ],
  "B7.5.2.2: Demonstrate knowledge of the nature of selected viral diseases of humans, their causes, symptoms, effects and management": [
    "B7.5.2.2.1: Explain the nature of viral diseases with special emphasis on corona virus (COVID-19)"
  ],
  "B8.5.2.1: Demonstrate knowledge of common communicable diseases, such as Hepatitis, of humans, causes, symptoms, effects and their prevention": [
    "B8.5.2.1.1: Explain the symptoms, effects and prevention of common communicable diseases",
    "B8.5.2.1.2: Analyse the risk factors of communicable diseases"
  ],
  "B8.5.2.2: Demonstrate knowledge of the nature of selected bacterial diseases of humans, their causes, symptoms, effects and prevention": [
    "B8.5.2.2.1: Explain the nature of bacterial diseases with special emphasis on food poisoning/gonorrhoea/ meningitis"
  ],
  "B9.5.2.1: Demonstrate knowledge of common non-communicable diseases of humans, their causes, symptoms, effects and prevention": [
    "B9.5.2.1.1: Explain the symptoms, effects and prevention of some non-communicable diseases and analyse risk factors"
  ],
  "B9.5.2.2: Demonstrate understanding of the relationship of health and disease, the concept of common diseases": [
    "B9.5.2.2.1: Explain the concepts of health and disease and show their relationship",
    "B9.5.2.2.2: Explain the concept of common diseases in an environment",
    "B9.5.2.2.3: Explain the nature of fungal diseases with special emphasis on Ringworm/candidiasis"
  ],
  "B7.5.3.1: Realise how careers in science can improve human life, and research about Ghanaian and internationally recognised scientists": [
    "B7.5.3.1.1: Discover and explain how careers in science can improve human conditions and relate these careers"
  ],
  "B8.5.3.1: Demonstrate an understanding of connections among science, technology, innovation, society and the environment": [
    "B8.5.3.1.1: Examine the relationship among science, technology, innovation and society"
  ],
  "B9.5.3.1: Analyse the scientific concepts, principles and processes applied in industries in and outside their community": [
    "B9.5.3.1.1: Investigate the scientific concepts, principles and processes involved in industries"
  ],
  "B9.5.3.2: Demonstrate an understanding of the concept of industry, the science underpinning the processes of production": [
    "B9.5.3.2.1: Explain the concept of industry and distinguish between modern and indigenous industries",
    "B9.5.3.2.2: Examine indigenous industries in their communities and show the scientific processes"
  ],
  "B7.5.4.1: Demonstrate understanding of sustainable energy choices and their impact on the environment": [
    "B7.5.4.1.1: Search for information on ways sustainable energy choices and scientific ideas are used"
  ],
  "B8.5.4.1: Demonstrate an understanding of the effects of climate change in the world and greening of other tropical countries": [
    "B8.5.4.1.1: Explain the concept of climate change and its effect on the environment",
    "B8.5.4.1.2: Describe climate change and green economy actions"
  ],
  "B9.5.4.1: Demonstrate an understanding of the natural and human factors that influence climate change and a green economy": [
    "B9.5.4.1.1: Examine various natural and human factors that influence climate change and green economy"
  ],
  "B9.5.4.2: Evaluate the effectiveness of initiatives that address the issue of climate change and green economy": [
    "B9.5.4.2.1: Assess data on climate change and green economy actions/ activities globally"
  ],
  "B7.5.5.1: Demonstrate understanding of different plants and animals found in different land forms and how they survive": [
    "B7.5.5.1.1: List and describe the different types of plants and animals that live in different land forms",
    "B7.5.5.1.2: Explain the nature of associations that exist among plants and animals in different landforms"
  ],
  "B8.5.5.1: Demonstrate understanding of the differences among soils, plant roots, stems, leaves, flowers, and fruits": [
    "B8.5.5.1.1: Discuss physical properties of soils",
    "B8.5.5.1.2: Analyse the physical properties of soils and soil water content and demonstrate importance in crop production"
  ],
  "B9.5.5.1: Demonstrate knowledge and skills in the use of plant roots, stems, leaves, flowers, and fruits for agricultural and non-agricultural purposes": [
    "B9.5.5.1.1: Show and list the uses of different plant parts for agricultural and non-agricultural purposes",
    "B9.5.5.1.2: Demonstrate the use of different plant parts for agricultural and non-agricultural purposes"
  ],
  "B8.5.6.1: Recognise the different types of rocks as origin of different types of soils": [
    "B8.5.6.1.1: Observe and describe different types of rocks as origins of soils"
  ],
  
  // English - Oral Language
  "B7.1.1.1: Demonstrate use of appropriate language orally in specific situations": [
    "B7.1.1.1.1: Use appropriate register in everyday communication with diverse partners on grade-level topics",
    "B7.1.1.1.2: Ask questions that elicit elaboration and respond to others’ questions in conversation",
    "B7.1.1.1.3: Use appropriate language orally to describe experiences about oneself and others",
    "B7.1.1.1.4: Listen to and give accurate directions to familiar places",
    "B7.1.1.1.5: Use techniques (voice modulation and eye contact) for effective oral communication"
  ],
  "B8.1.1.1: Demonstrate use of appropriate language orally in specific situations": [
    "B8.1.1.1.1: Use appropriate register in everyday communication with diverse partners on grade-level topics",
    "B8.1.1.1.2: Ask and respond to specific questions with elaboration by making comments that contribute to topics",
    "B8.1.1.1.3: Use appropriate language orally to describe familiar places and events",
    "B8.1.1.1.4: Listen to and give accurate directions of complex routes to different locations",
    "B8.1.1.1.5: Demonstrate appropriate turn taking for effective oral communication"
  ],
  "B9.1.1.1: Demonstrate the use of appropriate language orally in specific situations": [
    "B9.1.1.1.1: Use appropriate register in everyday communication with diverse partners",
    "B9.1.1.1.2: Ask questions that link the ideas of several speakers and respond to others’ questions in a discussion",
    "B9.1.1.1.3: Use appropriate language and open-ended questions to discuss grade-level national and global issues",
    "B9.1.1.1.4: Demonstrate appropriate turn taking and use techniques for effective argument (debating)"
  ],
  "B7.1.2.1: Demonstrate the ability to listen to extended reading and identify key information": [
    "B7.1.2.1.1: Listen to level-appropriate text attentively and identify key information",
    "B7.1.2.1.2: Listen to, discuss ideas and share opinions from a level-appropriate text"
  ],
  "B8.1.2.1: Demonstrate the ability to listen to extended reading and identify key information": [
    "B8.1.2.1.1: Listen to a level-appropriate dialogue/discussion by more than one speaker attentively",
    "B8.1.2.1.2: Listen to and discuss ideas and share opinions from a level-appropriate text"
  ],
  "B9.1.2.1: Demonstrate the ability to listen to extended reading and identify key information": [
    "B9.1.2.1.1: Listen to audio-visual texts attentively and support ideas with vocabulary/figures",
    "B9.1.2.1.2: Initiate and participate in meaningful and collaborative discussions using texts"
  ],
  "B7.1.3.1: Articulate English speech sounds to develop confidence and skills in listening and speaking": [
    "B7.1.3.1.1: Produce pure vowel sounds (short vowels) in context",
    "B7.1.3.1.2: Produce pure vowel sounds (long vowels) in context",
    "B7.1.3.1.3: Produce diphthongs in context (centring and closing)"
  ],
  "B8.1.3.1: Articulate English speech sounds to develop confidence and skills in listening and speaking": [
    "B8.1.3.1.1: Produce consonant sounds in context (plosives)",
    "B8.1.3.1.2: Produce consonant sounds (fricatives) in context",
    "B8.1.3.1.3: Produce consonant sounds (nasals and affricates) in context"
  ],
  "B9.1.3.1: Articulate English speech sounds to develop confidence and skills in listening and speaking": [
    "B9.1.3.1.1: Produce /r/ and /l/ sounds in different positions in word",
    "B9.1.3.1.2: Produce consonant clusters in context",
    "B9.1.3.1.3: Produce mono-syllabic and di-syllabic words with accurate stress in speech"
  ],

  // English - Reading
  "B7.2.1.1: Demonstrate increasing confidence and enjoyment in independent reading": [
    "B7.2.1.1.1: Read and understand a range of texts using monitoring and visualising strategies",
    "B7.2.1.1.2: Use prediction to assess and improve understanding of texts",
    "B7.2.1.1.3: Generate and answer questions to increase understanding of fiction texts",
    "B7.2.1.1.4: Use text structure to understand and read texts independently"
  ],
  "B7.2.1.2: Read, comprehend and interpret texts": [
    "B7.2.1.2.1: Identify the main text features of a non-literary texts",
    "B7.2.1.2.2: Interpret non-fiction texts pointing out attitudes, opinions, biases and facts",
    "B7.2.1.2.3: Interpret a non-literary text showing personal responses with textual evidence"
  ],
  "B8.2.1.1: Demonstrate increasing confidence and enjoyment in independent reading": [
    "B8.2.1.1.1: Use Monitoring and mental visualisation to engage and understand non-fictional texts",
    "B8.2.1.1.2: Use prediction to assess and improve engagement and understanding of non-fiction texts",
    "B8.2.1.1.3: Generate and answer questions to increase confidence through a variety of non-fiction"
  ],
  "B8.2.1.2: Read, comprehend, interpret texts": [
    "B8.2.1.2.1: Identify the main text features of non-fiction texts",
    "B8.2.1.2.2: Use contextual clues to analyse text",
    "B8.2.1.2.3: Read silently and answer more complex comprehension questions",
    "B8.2.1.2.4: Provide evidence and show mastery to support understanding of texts",
    "B8.2.1.2.5: Generate simple themes from a text and apply to different situations",
    "B8.2.1.2.6: Examine the connections between a text and other points of view",
    "B8.2.1.2.7: Use derivation to expand vocabulary to new contexts (historical, cultural, political)",
    "B8.2.1.2.8: Integrate appropriate grade level vocabulary in different contexts"
  ],
  "B9.2.1.1: Demonstrate increasing confidence and enjoyment in independent reading": [
    "B9.2.1.1.1: Read a variety of grade level texts and demonstrate understanding",
    "B9.2.1.1.2: Reflect on how reading impacts self and others see the world",
    "B9.2.1.1.3: Evaluate ways that the media helps to disseminate information",
    "B9.2.1.1.4: Expand various ideas and perspectives in texts"
  ],
  "B9.2.1.2: Read, comprehend, and analyse varieties of texts": [
    "B9.2.1.2.1: Read given text, within a specific time, for specific information",
    "B9.2.1.2.2: Make predictions, identify patterns and relationships of ideas",
    "B9.2.1.2.3: Make generalisations from text and link to real life situations",
    "B9.2.1.2.4: Compare language, style, structure and purpose across different texts",
    "B9.2.1.2.5: Read silently and answer more complex comprehension questions",
    "B9.2.1.2.6: Show the effect a text has on the reader",
    "B9.2.1.2.7: Interpret use of words/phases (figurative, symbolic, sensory) in complex texts",
    "B9.2.1.2.8: Demonstrate conceptual understanding of academic and technical vocabulary",
    "B9.2.1.2.9: Make conceptual connections between known and unknown words/phrases"
  ],

  // English - Summarising
  "B7.2.2.1: Demonstrate an understanding in summarising": [
    "B7.2.2.1.1: Use summarising to understand key ideas in a range of texts"
  ],
  "B7.2.2.2: Demonstrate understanding of textual evidence that supports a writing piece": [
    "B7.2.2.2.1: Determine and analyse central and supporting ideas of texts"
  ],
  "B8.2.2.1: Cite the textual evidence that supports an analysis of a text to determine the central idea and provide an objective summary": [
    "B8.2.2.1.1: Determine the central idea in paragraphs and analyse to identify supporting ideas"
  ],
  "B9.2.2.1: Cite the textual evidence that supports an analysis of what the text says, determining the central idea of a text and provide an objective summary": [
    "B9.2.2.1.1: Analyse critically a given text in entirety and provide an objective summary"
  ],

  // English - Grammar
  "B7.3.1.1: Apply the knowledge of word classes and their functions in Communication": [
    "B7.3.1.1.1: Demonstrate command and application of nouns in speaking and texts",
    "B7.3.1.1.2: Use types of pronouns accurately in speaking and texts",
    "B7.3.1.1.3: Explore accurate use of adjectives in texts",
    "B7.3.1.1.4: Relate forms of verbs to everyday activities (Tense & Aspects)",
    "B7.3.1.1.5: Use adverbs to modify verbs accurately at the phrase and sentence level",
    "B7.3.1.1.6: Use conjunctions accurately to link ideas in everyday discourse",
    "B7.3.1.1.7: Demonstrate command of the use of prepositions in daily discourse",
    "B7.3.1.1.8: Identify and use determiners in speaking and texts"
  ],
  "B7.3.1.2: Demonstrate command of structural and functional use of sentences": [
    "B7.3.1.2.1: Identify and use subject and predicate in text",
    "B7.3.1.3.1: Demonstrate command and use of compound sentences"
  ],
  "B7.3.1.4: Apply knowledge of clauses in communication": [
    "B7.3.1.4.1: Use dependent and independent clauses appropriately in speaking and writing"
  ],
  "B7.3.1.5: Demonstrate understanding of the use of conditional tenses in communication": [
    "B7.3.1.5.1: Use conditional sentences in communication to indicate possible conditions and results"
  ],
  "B7.3.1.6: Demonstrate mastery of use of active and passive voice": [
    "B7.3.1.6.1: Use passive sentences for a range of functions",
    "B7.3.1.6.2: Demonstrate use and command of reported speech"
  ],
  "B7.3.1.7: Show understanding and use of question tags in communication": [
    "B7.3.1.7.1: Use question tags accurately"
  ],
  "B8.3.1.1: Apply the knowledge of word classes and their functions in Communication": [
    "B8.3.1.1.1: Use an increasing range of singular and plural forms of compound nouns",
    "B8.3.1.1.2: Demonstrate use of relative pronouns correctly in speaking and writing",
    "B8.3.1.1.3: Demonstrate command of the use of adjectives in discourse",
    "B8.3.1.1.4: Use verb forms correctly when talking about future events",
    "B8.3.1.1.5: Demonstrate command of the knowledge of adverbs",
    "B8.3.1.1.6: Demonstrate command of use of prepositions in speaking and writing"
  ],
  "B8.3.1.5: Demonstrate command of the use of reported speech": [
    "B8.3.1.5.2: Demonstrate command of the use of reported speech (direct/indirect questions)"
  ],
  "B8.3.1.6: Show understanding and use of question tags in communication": [
    "B8.3.1.6.1: Demonstrate command of question tags"
  ],
  "B9.3.1.1: Apply the knowledge of phrases and clauses and their functions in Communication": [
    "B9.3.1.1.1: Use noun phrases accurately in context",
    "B9.3.1.1.2: Demonstrate command using multiple adjectives in correct order",
    "B9.3.1.1.3: Use more complex phrasal verbs accurately",
    "B9.3.1.1.4: Use knowledge of the adverbial phrase and its functions"
  ],
  "B9.3.1.2: Demonstrate understanding of the use of conditional tenses in communication": [
    "B9.3.1.2.1: Use conditional sentences to indicate impossible conditions in the past",
    "B9.3.1.2.2: Use defining and non-defining relative clauses appropriately"
  ],
  "B9.3.1.3: Demonstrate command of structural and functional use of sentences": [
    "B9.3.1.3.1: Identify and use subject and predicate in texts"
  ],
  "B9.3.1.4: Demonstrate mastery of the use of active and passive voice": [
    "B9.3.1.4.1: Use passive forms appropriately in speech and writing",
    "B9.3.1.4.2: Demonstrate command of the use of reported speech"
  ],

  // English - Punctuation, Vocabulary and Aesthetic Language
  "B7.3.2.1: Demonstrate use and mastery of capitalisation and punctuation in communication": [
    "B7.3.2.1.1: Identify and use punctuation marks (question, exclamation, full-stop, comma)"
  ],
  "B8.3.2.1: Demonstrate mastery of capitalisation and punctuation in communication": [
    "B8.3.2.1.1: Use punctuation marks (colon, semi-colon, apostrophe) in context"
  ],
  "B9.3.2.1: Demonstrate mastery of capitalisation and punctuation in communication": [
    "B9.3.2.1.1: Identify and use punctuation marks (dash, hyphen, bracket) in context"
  ],
  "B7.3.3.1: Demonstrate appropriate use of vocabulary in communication": [
    "B7.3.3.1.1: Apply vocabulary appropriately in specific contexts"
  ],
  "B7.3.4.1: Demonstrate understanding of use of aesthetic language to enrich communication": [
    "B7.3.4.1.1: Explore the use of proverbs to enrich communication"
  ],
  "B8.3.3.1: Demonstrate appropriate use of vocabulary in communication": [
    "B8.3.3.1.1: Use vocabulary appropriately in speaking and writing (synonyms, antonyms)"
  ],
  "B9.3.3.1: Demonstrate appropriate use of vocabulary and spelling conventions in communication": [
    "B9.3.3.1.1: Interpret vocabulary appropriately in more complex texts"
  ],

  // English - Writing
  "B7.4.1.1: Develop, organise and express ideas coherently and cohesively in writing": [
    "B7.4.1.1.1: Use cohesive devices (pronouns, punctuations, conjunctions) to link sentences"
  ],
  "B7.4.1.2: Create different paragraphs on a given topic": [
    "B7.4.1.2.1: Organise information in a logical manner"
  ],
  "B8.4.1.1: Develop, organise and express ideas coherently and cohesively in writing": [
    "B8.4.1.1.1: Demonstrate understanding of how different sentences relate within a paragraph"
  ],
  "B8.4.1.2: Create different paragraphs within a composition on a given topic": [
    "B8.4.1.2.1: Record and use different techniques to capture the reader's attention"
  ],
  "B9.4.1.1: Develop, organise and express ideas coherently and cohesively in writing": [
    "B9.4.1.1.1: Compose logically connected paragraphs to show unity and coherence",
    "B9.4.1.1.2: Develop a paragraph to show paragraph unity using supporting details"
  ],
  "B9.4.1.2: Create different paragraphs a given topic": [
    "B9.4.1.2.1: Compose more complex paragraphs using appropriate strategies"
  ],
  "B7.4.2.1: Develop, organise and express ideas coherently and cohesively in writing for a variety of purposes": [
    "B7.4.2.1.1: Write personal narratives using effective techniques",
    "B7.4.2.1.2: Use precise vocabulary and sensory language for vivid mental pictures",
    "B7.4.2.1.3: Create advertisements to persuade a given audience",
    "B7.4.2.1.4: Compose a paragraph to explain a process or phenomenon"
  ],
  "B7.4.2.2: Apply writing skills to specific life situations": [
    "B7.4.2.2.1: Compose informal letters on varied topics using appropriate format",
    "B7.4.2.2.2: Compose formal writing (application, invitation, email) using appropriate format",
    "B7.4.2.2.3: Take notes for academic and other purposes",
    "B7.4.2.2.4: Design notices and posters for different purposes",
    "B7.4.2.2.5: Write articles on given issues for publication",
    "B7.4.2.2.6: Create dialogues between two interlocutors"
  ],
  "B8.4.2.1: Use a process approach to compose descriptive, narrative/ imaginative, informational, persuasive and argumentative texts": [
    "B8.4.2.1.1: Write personal narratives using effective techniques and descriptive details",
    "B8.2.1.2: Use precise words, phrases and sensory language for vivid mental pictures",
    "B8.4.2.1.3: Create shorter transactional texts to convince an audience",
    "B8.4.2.1.4: Compose paragraphs that identify an issue and suggest solutions"
  ],
  "B8.4.2.2: Apply writing skills to specific life situations": [
    "B8.4.2.2.1: Compose formal writing (business letters, email) on given topics",
    "B8.4.2.2.2: Compose notes, brochures and flyers for different purposes",
    "B8.4.2.2.3: Write articles on given issues for publication in school magazines",
    "B8.4.2.2.4: Create dialogues among multiple interlocutors on different themes",
    "B8.4.2.2.5: Compose speeches for different purposes and occasions"
  ],
  "B9.4.2.1: Use a process approach to compose descriptive, narrative/ imaginative, informational and persuasive, argumentative texts": [
    "B9.4.2.1.1: Create effective descriptive sentences when describing characters or mood",
    "B9.4.2.1.2: Use different narrative techniques to manipulate time in a story",
    "B9.4.2.1.3: Write a well-organised persuasive piece that states and defends a position",
    "B9.4.2.1.4: Write an informative, explanatory text on a familiar or unfamiliar topic"
  ],
  "B9.4.2.2: Apply writing skills to specific life situations": [
    "B9.4.2.2.1: Compose formal writing (minutes, programme agenda reports) on given topics",
    "B9.4.2.2.2: Compose short text (flyers, posters, invitation cards, email) for different purposes",
    "B9.4.2.2.3: Write articles (short reports, letters and case studies) for publication",
    "B9.4.2.2.4: Compose speeches for different purposes and occasions"
  ],
  "B7.4.3.1: Research to build and present knowledge": [
    "B7.4.3.1.1: Identify and record information from non-text sources, organise and present in writing"
  ],
  "B8.4.3.1: Research to build and present knowledge": [
    "B8.4.3.1.1: Use information from non-text sources to support ideas in writing"
  ],
  "B9.4.3.1: Research to build and present knowledge": [
    "B9.4.3.1.1: Conduct short research projects based on focused questions"
  ],

  // English - Literature
  "B7.5.1.1: Demonstrate understanding of how various elements of literary genres contribute to meaning": [
    "B7.5.1.1.1: Demonstrate understanding of oral literature and how different genres contribute to meaning",
    "B7.5.1.1.2: Analyse the elements of written literature (narrative, drama, or poetry)",
    "B7.5.1.1.3: Use basic literary devices in texts (metaphor, simile, personification)"
  ],
  "B8.5.1.1: Demonstrate understanding of how various elements of literary genres contribute to meaning": [
    "B8.5.1.1.1: Analyse the types of characters in texts",
    "B8.5.1.1.2: Examine the features of different types of poems",
    "B8.5.1.1.3: Examine how monologues and dialogues are used to convey characters",
    "B8.5.1.1.4: Use literary devices (euphemism, hyperbole, onomatopoeia) in texts",
    "B8.5.1.1.5: Analyse the sequence of events in film/media, narratives and play scripts"
  ],
  "B9.5.1.1: Demonstrate understanding of how various elements of literary genres contribute to meaning": [
    "B9.5.1.1.1: Analyse the use of language to convey characters in film/media and narratives",
    "B9.5.1.1.2: Create monologues and dialogues narratives in play scripts",
    "B9.5.1.1.3: Analyse the sequence of events across texts",
    "B9.5.1.1.4: Create different types of poems (sonnet, acrostic, haiku etc.)",
    "B9.5.1.14: Use literary devices (imagery) in texts",
    "B9.5.1.1.5: Analyse common themes in texts"
  ],
  
  // Ghanaian Language - Customs
  "B7.1.1.1: Childhood Rites": ["B7.1.1.1.1: Identify processes in naming a child", "B7.1.1.1.2: Discuss significance of naming a child"],
  "B8.1.1.1: Puberty Rites": ["B8.1.1.1.1: Identify processes in puberty rites", "B8.1.1.1.2: Compare puberty rites across cultures"],
  "B9.1.1.1: Marriage Rites": ["B9.1.1.1.1: Discuss processes in marriage rites", "B9.1.1.1.2: Compare traditional and contemporary marriage"],
  "B7.1.3.1: Features of the clan system": ["B7.1.3.1.1: Describe the clan system", "B7.1.3.1.2: Discuss features of the clan system"],

  // Ghanaian Language - Reading
  "B7.3.1.1: Reading and summarizing": ["B7.3.1.1.1: Read and understand main ideas", "B7.3.1.1.2: Read and summarise ideas"],
  "B8.3.1.1: Extended texts": ["B8.3.1.1.1: Understand main ideas in extended texts", "B8.3.1.1.2: Summarise long passages"],
  "B7.3.2.1: Translating words/phrases": ["B7.3.2.1.1: Translate words from source to target language"],

  // Ghanaian Language - Composition
  "B7.5.1.1: Paragraph features": ["B7.5.1.1.1: Discuss features of a paragraph", "B7.5.1.1.2: Develop a three-paragraph essay"],
  "B9.5.1.1: Extended texts and linking": ["B9.5.1.1.1: Plan and structure extended texts"],

  // Mathematics additions
  "B7.1.3.1: Simplify, compare and order a mixture of positive fractions": ["B7.1.3.1.1: Determine recall percentages and decimals of benchmark fractions", "B7.1.3.1.2: Compare and order fractions"],
  "B8.3.1.1: Relationship between parallel lines and alternate angles": ["B8.3.1.1.1: Draw and determine alternate and corresponding angles", "B8.3.1.1.2: Determine values of angles in a triangle"],
  "B9.3.1.1: Apply properties of angles at a point": ["B9.3.1.1.1: Derive formula for sum of angles in a polygon"],
  
  // Ghanaian Language - Listening/Speaking
  "B7.2.1.1: Use of appropriate register": ["B7.2.1.1.1: Use suitable formal and informal register", "B7.2.1.1.2: Ask and respond to questions for elaboration"],
  "B8.2.1.1: Narrating daily activities": ["B8.2.1.1.1: Narrate home and community activities"],
  "B9.2.1.1: Spontaneous social interaction": ["B9.2.1.1.1: Use register in diverse social contexts"],
  
  // RME - God
  "B7.1.1.1: Explain the nature of God seen through His attributes": ["B7.1.1.1.1: Explain nature of God through attributes in major religions", "B7.1.1.1.2: Describe ways to demonstrate God's attributes in life"],
  "B8.1.1.1: Outline and explain moral lessons in creation stories": ["B8.1.1.1.1: Discuss creation stories of major religions", "B8.1.1.1.2: Identify moral values in creation stories"],
  
  // RME - Worship
  "B7.2.1.1: Explain how worship is performed": ["B7.2.1.1.1: Identify types of worship", "B7.2.1.1.2: Describe modes of worship", "B7.2.1.1.3: Explain moral lessons from worship"],
  
  // RME - Ethics
  "B7.5.1.1: Develop good manners and apply them": ["B7.5.1.1.1: Identify good manners", "B7.5.1.1.2: Discuss importance of decency", "B7.5.1.1.3: Discuss significance of chastity"],
  
  // RME - Economic Life
  "B7.6.1.1: Cultivate hard work and entrepreneurship": ["B7.6.1.1.1: Explain meaning of work", "B7.6.1.1.3: Identify steps to become an entrepreneur"],
  "B8.6.1.1: Plan the wise use of money": ["B8.6.1.1.1: Explain usefulness of money", "B8.6.1.1.2: Identify honest ways of acquiring money", "B8.6.1.1.4: Discuss benefits of SSNIT"],
  
  // RME - Family
  "B7.3.1.1: Identify and explain importance of family systems": ["B7.3.1.1.1: Explain concepts of family systems", "B7.3.1.1.2: Identify roles of family members"],
  "B8.3.1.1: Identify and explain importance of obeying authority": ["B8.3.1.1.1: Identify various sources of authority", "B8.3.1.1.2: Explain need to obey God and parents"],
  
  // RME - Leaders
  "B7.4.1.1: Early life and call of religious leaders": ["B7.4.1.1.1: Discuss early life and call", "B7.4.1.1.2: Describe ministries of leaders"],
  "B8.4.1.1: Moral lessons from prophets and caliphs": ["B8.4.1.1.1: Describe mission of prophets", "B8.4.1.1.2: Outline mission of caliphs"],
  
  // RME - Moral Teachings
  "B8.5.1.1: Moral teachings from scripture and oral traditions": ["B8.5.1.1.1: Identify moral teachings from religious texts", "B8.5.1.1.2: Apply moral teachings in daily life"],
  "B9.5.1.1: Good deeds and punishment": ["B9.5.1.1.1: Describe basis for good deeds", "B9.5.1.1.2: Identify acts that attract punishment", "B9.5.1.1.3: Outline stages of repentance"],
  
  // RME - Time
  "B9.6.1.1: Managing time profitably": ["B9.6.1.1.1: Explain time, leisure and idleness", "B9.6.1.1.2: Demonstrate how to plan and use time wisely"],
  "B9.1.1.1: Describe purpose of God's creation": ["B9.1.1.1.1: Identify purpose and usefulness of creation"],
  "B7.2.2.1: Analyse moral values in songs": ["B7.2.2.1.1: Differentiate between religious and non-religious songs"],
  "B8.2.1.1: Explain rites of passage": ["B8.2.1.1.1: Describe naming ceremonies", "B8.2.1.1.3: Describe puberty rites"],
  "B9.2.1.1: Understand religious festivals": ["B9.2.1.1.1: State meaning and types of festivals"],
  "B9.3.1.1: Ways people can co-exist peacefully": ["B9.3.1.1.1: Identify tolerant and intolerant communities"],
  "B9.4.1.1: Leadership role of women": ["B9.4.1.1.1: Discuss contributions of key women"],
  "B7.5.2.1: Need to stay away from substance abuse": ["B7.5.2.1.1: Summarise causes of substance abuse"],
  "B8.6.2.1: Avoid bribery and corruption": ["B8.6.2.1.1: Explain terms bribery and corruption"],

  // Social Studies - Environment
  "B7.1.1.1: Demonstrate skills in dealing with environmental challenges": ["B7.1.1.1.1. Examine ways of dealing with sanitation challenges in the environment"],
  "B8.1.1.1: Demonstrate skills in dealing with environmental challenges (Water Pollution)": ["B8.1.1.1.1. Examine water pollution as an environmental challenge"],
  "B9.1.1.1: Demonstrate skills in dealing with environmental challenges (Air Pollution)": ["B9.1.1.1.1. Examine air pollution as an environmental challenge"],
  "B7.1.2.1: Demonstrate a range of mapping skills": ["B7.1.2.1.1. Demonstrate skills involved in mapping and locating places in the environment"],
  "B8.1.2.1: Demonstrate skills in sketching maps and interpreting landscapes from maps": ["B8.1.2.1.1. Sketch maps and interpret landscapes from maps"],
  "B7.1.3.1: Show understanding of the world around us": ["B7.1.3.1.1. Examine major physical features of the earth"],
  "B7.1.3.2: Assess the issue of natural disasters and their management": ["B7.1.3.2.1. Examine natural disasters in the environment"],
  "B8.1.3.1: Demonstrate understanding of the significance of weather and climate to the environment": ["B8.1.3.1.1. Assess the significance of weather and climate to the environment"],
  "B8.1.3.2: Demonstrate understanding of natural disasters and their management": ["B8.1.3.2.1. Discuss natural disasters"],
  "B9.1.4.1: Investigate the natural and human resources around us": ["B9.1.4.1.1. Examine the importance of natural resources to the development of Ghana", "B9.1.4.1.2. Evaluate the importance of human resources to the development of Ghana"],

  // Social Studies - Family Life
  "B7.2.1.1: Demonstrate understanding of adolescent behaviour and reproductive health issues": ["B7.2.1.1.1. Examine issues on adolescent behaviour and reproductive health"],
  "B8.2.2.1: Show understanding of the family and family life issues": ["B8.2.2.1.1. Examine the composition and functions of the nuclear and the extended families", "B8.2.2.1.2. Discuss the issues of inheritance in Ghana"],
  "B9.2.2.1: Evaluate the institution of marriage in Ghana": ["B9.2.2.1.1. Examine the importance of marriage as a social institution in Ghana"],
  "B9.2.2.2: Assess the need for responsible parenting in the family": ["B9.2.2.2.1. Examine the importance of responsible parenting within the family system"],
  "B7.2.3.1: Exhibit knowledge of the importance of socialisation": ["B7.2.3.1.1 Examine the place of socialisation in developing the individual"],
  "B7.2.4.1: Analyse the population structure in Ghana and its related issues": ["B7.2.4.1.1 Examine the components of population growth"],
  "B8.2.4.1: Analyse the population structure in Ghana and its related issues (Comparison)": ["B8.2.4.1.1. Compare the population structure of high-income and middle/low income countries"],
  "B9.2.4.1: Analyse the population structure in Ghana and its related issues (Development)": ["B9.2.4.1.1. Assess population structure in Ghana and its associated development issues"],

  // Social Studies - Sense of Purpose
  "B7.3.1.1: Show understanding of self as a unique individual": ["B7.3.1.1.1. Exhibit knowledge of self-identity"],
  "B8.3.2.1: Demonstrate knowledge of the role of the individual in the community": ["B8.3.2.1.1. Examine the role of the individuals in the community", "B8.3.2.1.2. Discuss the relevance of volunteerism to community development"],
  "B9.3.3.1: Evaluate the place of culture in national identity": ["B9.3.3.1.1. Assess the significance of symbols, music and ceremonies in promoting national identity"],

  // Social Studies - Law and Order
  "B7.4.1.1: Analyse the responsibilities of a citizen": ["B7.4.1.1.1 Examine the value of citizenship in nation building"],
  "B8.4.1.1: Investigate the rights and responsibilities of a citizen": ["B8.4.1.1.1. Examine the importance of human rights in the Ghanaian society"],
  "B8.4.2.1: Analyse ways of preventing and managing conflict": ["B8.4.2.1.1 Examine ways of preventing and managing conflict in the community"],
  "B9.4.3.1: Assess the relevance of the 1992 Constitution": ["B9.4.3.1.1. Examine the 1992 Constitution and its significance to national development", "B9.4.3.1.2. Discuss the rights of the child as enshrined in the 1992 Constitution"],
  "B9.4.4.1: Assess the role of peace and security in national development": ["B9.4.4.1.1. Examine the relevance of peace and security in our community"],
  "B9.4.5.1: Show understanding of how to promote democracy and political stability": ["B9.4.5.1.1. Examine election as a way of promoting democracy and political stability"],
  "B9.4.5.2: Demonstrate understanding of the District Assembly concept in Ghana": ["B9.4.5.2.1. Examine the role of the District Assembly in promoting decentralisation"],
  "B9.4.5.3: Evaluate the importance of political stability in Ghana’s development": ["B9.4.5.3.1. Assess the significance of political stability in national development"],

  // Social Studies - Socio-Economic Development
  "B7.5.1.1: Demonstrate knowledge of human resource development in Ghana": ["B7.5.1.1.1. Mention ways of developing human resource in Ghana"],
  "B7.5.2.1: Demonstrate understanding of social security and pension issues": ["B7.5.2.1.1. Examine the importance of social security to the individual"],
  "B8.5.2.1: Demonstrate understanding of employer and employee relations in social security and pension": ["B8.5.2.1.1. Exhibit knowledge on employer and employee relation in social security and pension schemes"],
  "B9.5.2.1: Show understanding of the provisions under National Pensions Act 766 and PNDC Law 247": ["B9.5.2.1.1. Exhibit knowledge on pension rights under National Pensions Act 766 and PNDC Law 247"],
  "B7.5.3.1: Demonstrate knowledge on how tourism and leisure promote national development": ["B7.5.3.1.1. Examine the role of tourism and leisure in socio- economic development of Ghana"],
  "B8.5.3.1: Evaluate tourism as an important economic sector for national development": ["B8.5.3.1.1. Assess the importance of tourism to socio-economic development of Ghana"],
  "B9.5.4.1: Analyse the contribution of science and technology to national development": ["B9.5.4.1.1. Examine how science and technology can be used to promote development"],

  // Social Studies - Nationhood
  "B7.6.1.1: Demonstrate understanding of how Ghana became an independent nation": ["B7.6.1.1.1. Explain how events after the 1948 riots accelerated the move towards independence", "B7.6.1.1.2 Recount the formation of the Convention People’s Party (CPP) in 1949", "B7.6.1.1.3 Discuss the recommendations of the Coussey Committee and the outcomes of the 1951, 1954 and 1956 elections", "B7.6.1.1.4 Analyse the nature of government from 1957 to 1960"],
  "B8.6.2.1: Analyse the main developments in the Republics between 1960 and 1972": ["B8.6.2.1.1. Explain how the First Republic came into being", "B8.6.2.1.2. Explain political developments under the first republic", "B8.6.2.1.3. Explain how the Second Republic came into being.", "B8.6.2.1.4. Explain political developments under the Second Republic"],
  "B9.6.2.1: Demonstrate understanding that Ghana had two republics between 1979 and 2000": ["B9.6.2.1.1. Explain how the Third Republic came into being (1979-1981)", "B9.6.2.1.2. Explain political developments under the Third Republic", "B9.6.2.1.3. Explain how the Fourth Republic came into being", "B9.6.2.1.4. Explain political developments under the Fourth Republic"],

  // History - Indicators
  "B1.1.1.1: History as part of everyday life": ["B1.1.1.1.1: Explain that history deals with past human activities", "B1.1.1.1.2: Describe how sources of historical evidence help us find out about past human activities"],
  "B4.1.1.1: Importance of studying history": ["B4.1.1.1.1: Explain the importance of studying the history of Ghana"],
  "B4.1.1.2: Sources for writing history": ["B4.1.1.2.1: Identify the sources of history including archaeology, numismatics, oral tradition, wall paintings etc."],
  "B2.2.1.1: Ethnic groups in Ghana": ["B2.2.1.1.1: Identify the ethnic groups in each region in Ghana", "B2.2.1.1.2: State the characteristics of the ethnic groups in Ghana"],
  "B3.2.1.1: Origins of major ethnic groups": ["B3.2.1.1.1: Discuss the origins of the major ethnic groups in Ghana"],
  "B4.2.1.1: Rise and expansion of major kingdoms": ["B4.2.1.1.1: Describe how one major Kingdom was formed and the reasons behind its expansion", "B4.2.1.1.2: State the factors that led to decline of the Kingdom you have studied"],
  "B5.2.1.1: Ancient life vs modern life": ["B5.2.1.1.1: Describe how our ancestors lived in ancient times (before the 15th century) and compare it with how we live today", "B5.2.1.1.2: Describe some ancient towns in Ghana"],
  "B3.2.2.1: Nature of exchanges among groups": ["B3.2.2.1.1: Discuss the nature of exchanges among the ethnic groups", "B3.2.2.1.2: Name some of the items exchanged among the various groups", "B3.2.2.1.3: Describe the conflicts and alliances that existed among the ethnic groups in Ghana"],
  "B1.2.3.1: From Gold Coast to Ghana": ["B1.2.3.1.1: Explain why, in the past, Ghana was known as the Gold Coast", "B1.2.3.1.2: Recall when the name Ghana came into formal use"],
  "B2.2.4.1: History of major locations": ["B2.2.4.1.1: Discuss the history of Ghana’s major historical locations"],
  "B3.2.4.1: Forts and castles along the coast": ["B3.2.4.1.1: Identify the forts and castles built along the coast of Ghana"],
  "B4.1.4.1: History of specific historical sites": ["B4.1.4.1.1: Describe the history of Ghana’s major historical locations, specifically, Flagstaff house, Burma camp, James Town light house, Gbewa Palace, Larabanga Mosque etc."],
  "B1.2.5.1: Selected individuals and contributions": ["B1.2.5.1.1: Identify Ghanaians of diverse fields who have contributed significantly to national development"],
  "B2.2.5.1: Ghanaian women and national development": ["B2.2.5.1.1: Identify Ghanaian women who have made significant contributions to national development"],
  "B3.2.5.1: Outstanding Ghanaian entrepreneurs": ["B3.2.5.1.1: Describe Ghanaian entrepreneurs who have made significant contributions"],
  "B4.2.5.1: Significant traditional rulers": ["B4.2.5.1.1: Identify the role played by some traditional rulers in the national development"],
  "B5.2.5.1: Contributions locally and internationally": ["B5.2.5.1.1: Name Ghanaians who have made significant Contribution locally and internationally"],
  "B1.3.1.1: Europeans who came to Ghana": ["B1.3.1.1.1: Explore which Europeans came to Ghana"],
  "B3.3.1.1: Interaction and settlers": ["B3.3.1.1.1: Describe how the Europeans settled on the Gold Coast, including forming alliances with the local chiefs"],
  "B2.3.2.1: Early trade between Ghanaians and Europeans": ["B2.3.2.1.1: Describe how early trade was carried out between Ghanaians and Europeans"],
  "B5.3.2.1: Human trade and Trans-Atlantic Slave Trade": ["B5.3.2.1.1: Investigate why the Europeans began trading in humans by the 16th century"],
  "B4.3.3.1: Missionary societies and impact": ["B4.3.3.1.1: Describe European missionary activities in Ghana"],
  "B6.3.4.1: Assessing changes brought by Europeans": ["B6.3.4.1.1: Assess the changes that the European presence brought to Ghana"],
  "B4.4.1.1: The Bond of 1844": ["B4.4.1.1.1: Examine the Bond of 1844"],
  "B4.4.1.2: Formation of the Gold Coast territory": ["B4.4.1.2.1: Describe how the different areas – The Colony, Asante, The Northern Territories and The British Mandated Togoland– became one territory known as the Gold Coast"],
  "B5.4.2.1: Educational, Health and Housing developments": ["B5.4.2.1.1: Identify the developments in education during the colonial era (1874-1957)", "B5.4.2.1.2: Identify some of the health facilities and housing projects in the colonial period"],
  "B5.4.3.1: Economic policies and projects": ["B5.4.3.1.1: Describe the economic measures introduced during the colonial period including transport and communication projects"],
  "B6.4.4.1: Features of British colonial rule": ["B6.4.4.1.1: Describe the features of British colonial rule in Ghana including ‘direct’ and ‘indirect’ rule, 1874-1957"],
  "B5.5.1.1: Protest movements before 1945": ["B5.5.1.1.1: Identify the early protest movements in Ghana before 1945", "B5.5.1.1.2: Examine sources of evidence about the role of Joseph Mensah Sarbah"],
  "B6.5.2.1: Role of UGCC and CPP": ["B6.5.2.1.1: Describe the role played by the leaders of the two major political parties (UGCC and CPP) in the independence struggle"],
  "B5.5.3.1: Events leading to 1948 riots": ["B5.5.3.1.1: Explain why people were unhappy in the country after the Second World War", "B5.5.3.1.2: Examine sources of evidence about what happened during the 1948 riots"],
  "B6.5.4.1: Post WWII developments and constitutional means": ["B6.5.4.1.1: Explain post World War II developments in the Gold Coast", "B6.5.4.1.2: Explain how Ghana gained independence through constitutional means"],
  "B1.6.1.1: Presidents since 1960": ["B1.6.1.1.1: Identify the Presidents Ghana has had since 1960"],
  "B4.6.1.1: The four Republics": ["B4.6.1.1.1: Explain that Ghana up to June 1960, though independent, had the Queen of The UK as Head of State", "B4.6.1.1.2: State the dates and names of the leaders of the four Republics of Ghana since 1960"],
  "B6.6.1.1: Emergence of the Fourth Republic": ["B6.6.1.1.1: Describe the events leading to the emergence of the Fourth Republic", "B6.6.1.1.2: Identify the political parties that have governed the country under the Fourth Republic"],
  "B6.6.2.1: Military takeovers since 1966": ["B6.6.2.1.1: Identify the leaders of the coup d’états and names of their regimes", "B6.6.2.1.2: Assess the consequences of military takeovers on Ghana’s development"],
  // French - Indicators
  "B4.1.1.1: Écouter et comprendre des salutations": ["B4.1.1.1.1: Écouter et regarder un document audio-visuel où deux personnes se saluent"],
  "B4.1.1.2: Saluer et répondre oralement": ["B4.1.1.1.2: Saluer et répondre oralement aux salutations"],
  "B4.1.1.3: Lire et comprendre des salutations": ["B4.1.1.1.3: Lire et comprendre un texte/image décrivant une scène de salutation"],
  "B4.1.1.4: Écrire des mots de salutation": ["B4.1.1.1.4: Écrire des mots de salutation simples"],
  "B5.1.1.1: Écouter et comprendre des salutations": ["B5.1.1.1.1: Écouter/Regarder un document audio-visuel de salutations"],
  "B5.1.1.2: Saluer et répondre oralement": ["B5.1.1.1.2: Saluer et répondre oralement en respectant les codes"],
  "B6.1.1.1: Écouter et comprendre des salutations": ["B6.1.1.1.1: Écouter et comprendre des échanges de salutations complexes"],
  "B4.1.2.1: Écouter et comprendre des présentations": ["B4.1.2.1.1: Écouter et comprendre un dialogue de présentation"],
  "B4.1.2.2: Se présenter oralement": ["B4.1.2.2.1: Poser et répondre à des questions sur le nom, prénom et nationalité"],
  "B5.1.2.1: Écouter et comprendre des présentations": ["B5.1.2.1.1: Écouter un dialogue entre deux personnes qui se présentent"],
  "B5.1.2.2: Se présenter oralement": ["B5.1.2.2.1: Poser et répondre à des questions sur l'âge, profession and adresse"],
  "B4.4.1.1: Écouter et comprendre les nombres": ["B4.4.1.1.1: Écouter/Regarder un document audio-visuel sur les nombres"],
  "B4.4.1.2: Compter à haute voix": ["B4.4.1.2.1: Compter à haute voix des objets et personnes"],
  "B4.4.1.4: Écrire les nombres et faire des calculs": ["B4.4.1.4.1: Faire des calculs simples à l'écrit avec chiffres en lettres"],
  "B5.4.1.1: Écouter et comprendre les nombres": ["B5.4.1.1.1: Écouter un document audiovisuel sur les nombres étendus"],
  "B5.4.1.4: Écrire les nombres et faire des calculs": ["B5.4.1.4.1: Faire des calculs mentaux et écrits complexes"],
  "B4.4.2.1: Écouter et comprendre l'heure": ["B4.4.2.1.1: Écouter un document audio-visuel on les horaires"],
  "B4.4.2.2: Demander et donner l'heure oralement": ["B4.4.2.2.1: Poser et répondre à des questions sur l'heure qu'il est"],
  "B5.4.2.1: Écouter et comprendre l'heure": ["B5.4.2.1.1: Écouter des horaires de restaurant, train, avion"],
  "B5.4.2.2: Demander et donner l'heure oralement": ["B5.4.2.2.1: Se renseigner sur l'heure d'un rendez-vous"],
  "B4.4.7.1: Écouter et comprendre les professions": ["B4.4.7.1.1: Écouter un document audiovisuel sur les métiers"],
  "B4.4.7.2: Parler des professions oralement": ["B4.4.7.2.1: Poser et répondre à des questions sur les métiers de la famille", "B4.4.7.2.2: Dire la profession que l'on veut exercer"],
 };

export const PEDAGOGICAL_PHASES = {
  starter: {
    duration: "10 minutes",
    goal: "Preparing the brain for learning",
    description: "A starter should stimulate curiosity and open mindedness. Review and reinforcement of previous content.",
    activities: [
      "Mental maths games (fast-paced)",
      "Skip counting forward/backwards",
      "Number facts review",
      "Review related previous knowledge",
      "Short reinforcement activities"
    ]
  },
  main: {
    duration: "35 minutes",
    goal: "New learning including assessment",
    description: "Activities to explore new learning content for the day, including at least 20 minutes of independent or collaborative problem solving.",
    activities: [
      "Explore new learning areas",
      "Work in pairs or groups on differentiated tasks",
      "Work with resources or tools",
      "Share and discuss results and strategies"
    ]
  },
  plenary: {
    duration: "5 minutes",
    goal: "Plenary/Reflections (Learner and teacher)",
    description: "Reflect, recap and consolidate the learning that has happened in the day's lesson.",
    activities: [
      "Recap on learning outcomes",
      "Learning progress voting (e.g., 5-finger scale)",
      "Identify and correct misconceptions",
      "Direct learners to the next phase of learning"
    ]
  }
};

export const FORMATIVE_ASSESSMENT_STRATEGIES = [
  {
    name: "Think-Pair-Share",
    description: "Learners think for 30s-1min, brainstorm in pairs for 2-3 mins, then share with the whole class."
  },
  {
    name: "2 Stars and a Wish",
    description: "Peer assessment: 2 things that are good (stars) and 1 thing to improve (wish)."
  },
  {
    name: "Traffic Lights",
    description: "Visual signal of understanding: Red (struggling), Amber (not quite sure), Green (fully understand)."
  },
  {
    name: "Hand Signals",
    description: "Thumbs up/down or 5-finger scale to determine acknowledged understanding."
  },
  {
    name: "Show and Tell",
    description: "Use mini-whiteboards or slates for every learner to write/draw their answer simultaneously."
  },
  {
    name: "K-W-L Grid",
    description: "What they Know, What they Want to know, and at end, What they Have Learnt."
  }
];

export const MATH_B7_LESSON_FRAMES: Record<string, any> = {
  "B7.1.1.1": {
    topic: "Number and Numerals - Whole numbers up to 10,000,000,000",
    keyWords: ["Model", "place value", "strategy", "rounding up/down/off", "less/greater than"],
    activities: [
      "Read and write numbers using words and numerals",
      "Skip counting forward/backwards in 10,000s, 100,000s, etc.",
      "Model 8-digit numbers using graph sheets and multi-base blocks",
      "Rounding whole numbers to the nearest hundred-thousand, ten-thousands, etc."
    ],
    resources: ["Flash cards (4-7 digit numbers)", "Graph sheets", "Multi-base ten materials", "Place value chart"]
  },
  "B7.1.2.1": {
    topic: "Number Operations – Mental Mathematics Strategies",
    keyWords: ["halving", "doubling", "distributive property"],
    activities: [
      "Recall multiplication and related division facts",
      "Apply halving and doubling to determine products (e.g., 28 x 5 → 14 x 10)",
      "Solve mental maths word problems involving basic operations"
    ],
    resources: ["Multiplication chart", "Place value chart", "Abacus"]
  },
  "B7.1.2.2": {
    topic: "Number Operations – Basic Operations on Whole and Decimal Numbers",
    keyWords: ["Addition", "subtraction", "multiplication", "division", "decimals"],
    activities: [
      "Use partitioning and place value system for addition/subtraction",
      "Multiply or divide multi-digit numbers by 1- and 2-digit numbers",
      "Solve story problems involving decimals"
    ],
    resources: ["Place value chart", "Multiplication chart", "Calculator (for checking)"]
  },
  "B7.1.2.3": {
    topic: "Number Operations – Powers of Numbers",
    keyWords: ["Power", "base", "index", "indices", "simplify", "exponent"],
    activities: [
      "Explain the meaning of repeated factors",
      "Solve for the value of a number written in index form",
      "Apply product of primes to find HCF"
    ],
    resources: ["Index cards", "Indices dominos", "Counters"]
  },
  "B7.1.3.1": {
    topic: "Fractions – Comparing Fractions",
    keyWords: ["Numerator", "denominator", "benchmark fractions", "percentages", "decimals"],
    activities: [
      "Work out common, decimal and percent equivalences of benchmark fractions",
      "Change fractions to same denominator to compare using < or >",
      "Order a set of fractions, decimals and percentages"
    ],
    resources: ["Square grid paper", "Benchmark fractions chart", "Geodot paper"]
  },
  "B7.3.1.1": {
    topic: "Geometry and Measurement – Angles",
    keyWords: ["Acute", "Right", "Obtuse", "Reflex", "Supplementary", "Complementary"],
    activities: [
      "Watch short clips of construction sites to see angles in use",
      "Classify angles based on measured sizes",
      "Apply facts about complementary (90°) and supplementary (180°) angles",
      "Solve problems using adjacent and vertically opposite angles"
    ],
    resources: ["Protractor", "Ruler", "Geostrips (or straws)", "Geometry sets"]
  },
  "B7.3.2.1": {
    topic: "Measurement – Perimeter of Plane Shapes Including Circles",
    keyWords: ["Perimeter", "Dimension", "Circle", "Diameter", "Pi (π)"],
    activities: [
      "Calculate perimeter using multiple units (e.g., cm and mm)",
      "Measure diameter and circumference of circular objects",
      "Deduce the formula for circumference by observing C ÷ D ratio"
    ],
    resources: ["Circular objects (cans, bowls)", "String", "Ruler", "Square grid paper"]
  },
  "B7.4.1.1": {
    topic: "Handling Data - Data Collection",
    keyWords: ["Survey", "Questionnaire", "Interview", "Observation", "Quantitative", "Qualitative"],
    activities: [
      "Select and justify methods for data collection",
      "Design and administer a simple questionnaire",
      "Organise survey data into frequency tables and charts"
    ],
    resources: ["Sticker papers", "Permanent markers", "Sample survey forms"]
  },
  "B7.4.2.1": {
    topic: "Handling Data - Probability",
    keyWords: ["Impossible", "Possible", "Certain", "Sample space", "Random"],
    activities: [
      "Classify events from personal contexts as impossible, possible, or certain",
      "Calculate simple probabilities for single event experiments",
      "Express probabilities as fractions, decimals, percentages, and ratios"
    ],
    resources: ["Dice", "Coins", "Fractions/Decimals flash cards"]
  }
};

export const SCIENCE_B7_LESSON_FRAMES: Record<string, any> = {
  "B7.1.1.1": {
    topic: "Materials - Recognise materials as important resources",
    keyWords: ["Resources", "Solid", "Liquid", "Gas", "Water Vapour"],
    activities: [
      "Name and describe materials from environment (texture, appearance, color)",
      "Group materials into liquids, solids and gases with reasons",
      "Discuss differences between the three states of matter",
      "Demonstrate the presence of air (gas) by heating water"
    ],
    resources: ["Water", "Oil", "Sand", "Gravel", "Vinegar", "Source of heat"]
  },
  "B7.1.2.1": {
    topic: "Living Cells - Structure and function of animal cells",
    keyWords: ["Organelle", "Mitochondrion", "Nucleus", "Cell Wall", "Epidermis"],
    activities: [
      "Identify and describe animal cell structure from videos and charts",
      "Discuss functions of organelles (nucleus, mitochondrion, etc.)",
      "Draw and label an animal cell",
      "Develop a model of an animal cell using local materials"
    ],
    resources: ["Microscope", "Slides", "Magnifier", "Models", "Charts"]
  },
  "B7.2.1.1": {
    topic: "Earth Science - The Water Cycle",
    keyWords: ["Transpiration", "Condensation", "Precipitation", "Evaporation", "Collection"],
    activities: [
      "Discuss origin of Earth's water",
      "List and explain the stages of the water cycle",
      "Draw a flow chart showing links between water cycle stages",
      "Identify community situations that illustrate the water cycle"
    ],
    resources: ["Videos", "Pictures", "Pop bottles", "Ice crystals", "Charts"]
  },
  "B7.4.1.1": {
    topic: "Energy - Forms of energy and daily applications",
    keyWords: ["Kinetic", "Potential", "Mechanical", "Heat", "Sound", "Nuclear"],
    activities: [
      "List various forms of energy (Solar, Electrical, Chemical, etc.)",
      "Demonstrate Potential Energy (PE) vs Kinetic Energy (KE)",
      "Use PE = mgh and KE = 1/2mv² to solve mechanical energy problems",
      "Match energy forms to daily appliances/gadgets"
    ],
    resources: ["Pictures", "Videos", "Objects for dropping", "Energy charts"]
  },
  "B7.4.2.2": {
    topic: "Electricity and Electronics - Basic electronic components",
    keyWords: ["Electronic", "Diode", "Capacitor", "Resistor", "Inductor", "LED"],
    activities: [
      "Examine electronic components (LEDs, Resistors, Capacitors)",
      "Dismantle and assemble spoilt electronic gadgets (Radio, TV)",
      "Identify P and N regions of a P-N junction diode",
      "Construct a simple electronic circuit with a 3V battery, switch and LED"
    ],
    resources: ["P-N Junction diodes", "Resistors", "Capacitors", "LEDs", "3V Battery"]
  }
};

export const ENGLISH_B1_B6_LESSON_FRAMES: Record<string, any> = {
  "B1.2.2.1": {
    topic: "Alphabet Sounds and Blending",
    keyWords: ["Vowels", "Consonants", "Blending", "Phonemes"],
    activities: [
      "Sing the alphabet song and identify each letter name and sound",
      "Use letter cards to form simple three-letter words",
      "Clap the syllables of common words identified in the classroom",
      "Practice blending vowel and consonant sounds to form words like 'at', 'am', 'man'"
    ],
    resources: ["Alphabet charts", "Letter cards", "Sound recordings", "Word trees"]
  },
  "B4.3.1.1": {
    topic: "Types of Nouns",
    keyWords: ["Common Noun", "Proper Noun", "Collective Noun", "Abstract Noun"],
    activities: [
      "Identify objects in the classroom and categorize them as common nouns",
      "List names of cities and countries in Ghana as proper nouns",
      "Play 'Lucky Dip' with collective noun cards (e.g., 'a flock of sheep')",
      "Discuss abstract concepts like 'honesty' and 'patience' as nouns"
    ],
    resources: ["Noun charts", "Sentence strips", "Globe or Map", "Worksheets"]
  },
  "B6.2.2.1": {
    topic: "Phonics: Ending Sounds and Multisyllabic Words",
    keyWords: ["Suffixes", "Multisyllabic", "Ending Sounds", "CCVCC"],
    activities: [
      "Identify words with ending sounds like 'sure', 'ture' and 'tch'",
      "Read multisyllabic words like 'communication' and 'immediate' independently",
      "Practice reading words with CCVCC and CCCVC patterns (e.g., 'trust', 'scrap')",
      "Play the 'Pick and Read' game with target phonics patterns"
    ],
    resources: ["Phonics cards", "Short story texts", "Digital literacy tools", "Word games"]
  }
};

export const ENGLISH_B7_LESSON_FRAMES: Record<string, any> = {
  "B7.1.1.1": {
    topic: "Greetings and Introductions",
    keyWords: ["Salutations", "Formal", "Informal", "Self-introduction"],
    activities: [
      "Role-play different greeting scenarios (morning, afternoon, formal meetings)",
      "Practice introducing oneself and others using correct pronouns",
      "Discuss the importance of eye contact and posture during greetings",
      "Listen to recordings of greetings in various contexts"
    ],
    resources: ["Audio recordings", "Flashcards", "Role-play cards", "Videos of social interactions"]
  },
  "B7.2.1.1": {
    topic: "Reading for Comprehension",
    keyWords: ["Skimming", "Scanning", "Main Idea", "Context Clues"],
    activities: [
      "Read short passages and identify the primary theme",
      "Practice skimming for overview and scanning for specific facts",
      "Use context clues to determine the meaning of unfamiliar words",
      "Summarize paragraphs in one sentence"
    ],
    resources: ["Newspaper clippings", "Short story books", "Dictionaries", "Worksheets"]
  }
};

export const SCIENCE_B8_LESSON_FRAMES: Record<string, any> = {
  "B8.1.1.1": {
    topic: "Physical Properties of Materials",
    keyWords: ["Purity", "Density", "Melting Point", "Boiling Point"],
    activities: [
      "Discuss physical properties of materials (boiling point, density)",
      "Carry out experiments to distinguish between pure and impure substances",
      "Demonstrate the effects of impurities on boiling and melting points",
      "Calculate density of various solid objects"
    ],
    resources: ["Thermometers", "Pure water", "Salt", "Beakers", "Weighing scales"]
  },
  "B8.1.2.1": {
    topic: "Plant Cells - Structure and function",
    keyWords: ["Chloroplast", "Vacuole", "Cell Wall", "Cytoplasm"],
    activities: [
      "Identify and describe plant cell structure under a microscope",
      "Compare and contrast plant and animal cells",
      "Discuss the functions of unique plant cell organelles",
      "Prepare slides of onion epidermal cells for observation"
    ],
    resources: ["Microscope", "Onions", "Iodine solution", "Cover slips", "Charts"]
  }
};

export const SCIENCE_B9_LESSON_FRAMES: Record<string, any> = {
  "B9.1.1.1": {
    topic: "Acids, Bases and Salts",
    keyWords: ["pH scale", "Indicators", "Neutralisation", "Litmus"],
    activities: [
      "Identify common acids and bases used in the home",
      "Prepare natural indicators from flowers and plants",
      "Test solutions with pH paper and indicators",
      "Demonstrate a neutralisation reaction"
    ],
    resources: ["Indicators", "Lemon juice", "Soap solution", "pH paper", "Test tubes"]
  },
  "B9.1.2.1": {
    topic: "Genetics and Heredity",
    keyWords: ["DNA", "Genes", "Chromosomes", "Inheritance", "Variation"],
    activities: [
      "Discuss basic concepts of genetics and DNA",
      "Investigate variation in human traits (earlobes, tongue rolling)",
      "Outline how traits are passed from parents to offspring",
      "Construct a simple DNA model"
    ],
    resources: ["Charts", "Videos", "Mirror", "Paper for traits chart", "Model building kits"]
  }
};

export const FRENCH_B4_B6_LESSON_FRAMES: Record<string, any> = {
  "B4.1.1.1": {
    topic: "Saluer et prendre congé (Greetings and Leave-taking)",
    keyWords: ["Bonjour", "Au revoir", "Comment vas-tu ?", "Je vais bien", "À bientôt"],
    activities: [
      "Listen to an audio of two people greeting each other in different settings",
      "Role-play greetings with classmates using appropriate physical gestures",
      "Identify formal and informal greeting expressions",
      "Practice the song 'Bonjour mes amis'"
    ],
    resources: ["Audio recordings", "Flashcards with greeting scenes", "Video clips from YouTube"]
  },
  "B4.1.2.1": {
    topic: "Se présenter (Self-introduction)",
    keyWords: ["Je m'appelle", "Mon nom est", "Je suis ghanéen(ne)", "Prénom"],
    activities: [
      "Listen to the teacher introducing themselves to the class",
      "Practice saying your name and nationality in French",
      "Complete a simple identity card (fiche d'identité)",
      "Ask a partner 'Comment tu t'appelles ?' and respond"
    ],
    resources: ["ID card templates", "Flags of Ghana and France", "Name tags"]
  },
  "B4.4.1.1": {
    topic: "Les Nombres 1-20 (Numbers 1-20)",
    keyWords: ["Un", "Deux", "Trois", "Calcul", "Plus", "Égal"],
    activities: [
      "Count objects in the classroom (chairs, tables) in French",
      "Play a counting game where learners eliminate those who miss a number",
      "Perform simple additions like 'deux plus deux égal quatre' in French",
      "Sing a numerical rhyme"
    ],
    resources: ["Counters", "Number cards", "Abacus"]
  },
  "B5.1.2.1": {
    topic: "Se présenter - Âge et Profession (Introduction - Age and Profession)",
    keyWords: ["J'ai ... ans", "Je suis élève", "J'habite à", "Quel âge as-tu ?"],
    activities: [
      "Role-play a dialogue about age and place of residence",
      "Describe one's father's or mother's profession in French",
      "Write a short postcard to a pen-pal introducing oneself with age and address",
      "Listen to a presentation of a public personality"
    ],
    resources: ["Envelope/Postcard samples", "Occupation flashcards", "Map of Ghana"]
  },
  "B6.1.3.2": {
    topic: "Présenter quelqu'un (Presenting someone else)",
    keyWords: ["Voici", "Il/Elle s'appelle", "Il/Elle est né(e) le", "Son numéro de téléphone"],
    activities: [
      "Present a famous Ghanaian historical figure in French",
      "Create a mini-biography including date of birth and address",
      "Role-play a douane (customs) scene where you provide information for someone else",
      "Practice dictation of phone numbers in French"
    ],
    resources: ["Biographies of heroes", "Mock phone/sim cards", "Passport templates"]
  }
};
