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
  "Graphic Design",
  "Integrated Curriculum (KG)",
  "Our World Our People",
  "Physical Education"
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
  "Career Technology": ["Health and Safety", "Materials for Production", "Tools, Equipment and Processes", "Technology", "Designing and Making of Artefacts/Products", "Entrepreneurial Skills"],
  "Creative Arts": ["Visual Arts", "Performing Arts"],
  "Financial Accounting": ["Financial Statements", "Partnership Accounts", "Company Accounts", "Cost Accounting Basics"],
  "Cost Accounting": ["Introduction to Cost Accounting", "Elements of Costing", "Materials Costing", "Labour and Overhead Costing", "Job and Batch Costing"],
  "Business Management": ["Nature of Management", "Functional Areas of Management", "Legal Environment of Business"],
  "French": ["L'Identité", "Parler de son Environnement", "Exprimer ses Goûts et ses Préférences", "Les Activités"],
  "Ghanaian Language": ["Oral Language (GL)", "Reading (GL)", "Writing (GL)", "Writing Conventions and Usage (GL)", "Extensive Reading (GL)", "Composition Writing", "Customs and Institutions", "Literature (GL)"],
  "Agricultural Science": ["Introduction to Agriculture", "Soil Science", "Crop Science", "Animal Science", "Agricultural Economics and Extension"],
  "Elective ICT": ["Information Systems", "Computer Architecture", "Networking and Data Communications", "Software Development", "Web and Multimedia Development"],
  "CRS": ["Biblical Studies", "History of the Church", "Ethics and Moral Life"],
  "IRS": ["Al-Quran", "Al-Hadith", "Al-Fiqh", "Islamic History"],
  "Literature in English": ["Introduction to Literature", "African Prose", "Non-African Prose", "African Poetry", "Non-African Poetry", "Drama"],
  "Integrated Curriculum (KG)": ["All About Me", "My Family", "Values and Beliefs", "My Local Community", "My Nation Ghana", "All Around Us", "My Global Community"],
  "Our World Our People": ["All About Us", "All Around Us", "Our Beliefs and Values", "Our Nation Ghana", "My Global Community"],
  "Physical Education": ["Motor Skill and Movement Patterns", "Movement Concepts, Principles and Strategies", "Physical Fitness", "Physical Fitness Concepts, Principles and Strategies", "Values and Psycho-social Concepts, Principles and Strategies"],
  "RME": ["God, His Creation and Attributes", "Religious Practices and their Moral Implications", "Religious Leaders", "The Family and the Community", "The Family, Authority and Obedience", "Religious Leaders and Personalities", "Ethics and Moral Life", "Religion and Economic Life"]
};

export const SUBJECT_SUB_STRANDS: Record<string, string[]> = {
  // Mathematics
  "Number": ["Number and Numeration Systems", "Number Operations", "Fractions, Decimals and Percentages", "Number: Ratios and Proportion"],
  "Algebra": ["Patterns and Relationships", "Algebraic Expressions", "Variables and Equations"],
  "Geometry and Measurement": ["Shapes and Space", "Measurement", "Position and Transformation"],
  "Handling Data": ["Data", "Chance or Probability"],
  
  // Our World Our People
  "All About Us": ["Nature of God", "Myself", "My Family and the Community", "Home and School"],
  "All Around Us OWOP": ["The Environment and the Weather", "Plants and Animals", "Map Making and Land Marks", "Population and Settlement"],
  "Our Beliefs and Values": ["Worship", "Festivals", "Basic Human Rights", "Being a Leader"],
  "Our Nation Ghana": ["Being a Citizen", "Authority and Power", "Responsible use of Resources", "Farming in Ghana"],
  "My Global Community OWOP": ["Our Neighbouring Countries", "Introduction to Computing", "Sources of Information", "Technology in Communication"],
  
  // Physical Education
  "Motor Skill and Movement Patterns": ["Locomotor movements", "Manipulative Skills", "Rhythmic Skills"],
  "Movement Concepts, Principles and Strategies": ["Space awareness", "Dynamics", "Relationships", "Body management", "Strategies"],
  "Physical Fitness": ["Aerobic Capacity", "Strength", "Endurance", "Flexibility", "Body Composition"],
  "Physical Fitness Concepts, Principles and Strategies": ["Fitness Programmes", "Healthy Diet", "Safety and injury", "Substances"],
  "Values and Psycho-social Concepts, Principles and Strategies": ["Self-responsibility", "Social Interaction", "Group Dynamics", "Critical thinking"],
  
  // Science / Agricultural Science
  "Introduction to Agriculture": ["Agric. as a Subject", "Agriculture and National Development"],
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
  
  // English JHS Sub-Strands
  "Oral Language JHS": ["Conversation/Everyday Discourse", "Listening Comprehension", "English Sounds"],
  "Reading JHS": ["Comprehension", "Summarising"],
  "Grammar Usage JHS": ["Grammar", "Punctuation and Capitalisation", "Vocabulary"],
  "Writing JHS": ["Production and Distribution of Writing", "Text Types and Purposes", "Building and Presenting Knowledge"],
  "Literature JHS": ["Narrative, Drama and Poetry"],
  
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
  "God, His Creation and Attributes": ["God the Creator", "The Environment", "Purpose of God's Creation", "God, His Nature and Attributes", "The Creation Stories", "The Purpose and Usefulness of God's Creation"],
  "Religious Practices and their Moral Implications": ["Religious Worship in the Three Major Religions in Ghana", "Religious Festivals in the Three Major Religions in Ghana", "Worship", "Religious Songs and Recitations", "Rites of Passage", "Religious Festivals"],
  "Religious Leaders": ["Birth of the Leaders of the three Major Religions in Ghana", "Early Life of the Leaders of the three Major Religions", "The Call of the Leaders of the Three Major Religions", "Ministry and latter Lives of Leaders of the Three Major Religions in Ghana"],
  "The Family and the Community": ["Roles and Relationships", "Personal Safety in the Community", "Family Systems", "Religion and Social Cohesion"],
  "The Family, Authority and Obedience": ["Authority and Obedience", "Roles, Relationships in the Family and Character Formation"],
  "Religious Leaders and Personalities": ["Religious Leaders JHS", "Prophets and Caliphs", "Women in Religion"],
  "Ethics and Moral Life": ["Manners and Decency", "Substance Abuse", "Moral Teachings", "Reward, Punishment and Repentance"],
  "Religion and Economic Life": ["Work and Entrepreneurship", "Money", "Bribery and Corruption", "Time and Leisure"],

  // Ghanaian Language
  "Oral Language (GL)": ["Songs", "Rhymes", "Poems", "Story Telling", "Dramatisation and Role Play", "Conversation", "Talking about Oneself, Family, People and Places", "Listening Comprehension", "Asking and Answering Questions", "Giving and Following Commands/ Instructions", "Presentation"],
  "Reading (GL)": ["Pre-Reading Activities", "Print Concept", "Phonological and Phonemic Awareness", "Phonics (Letter and Sound Knowledge)", "Vocabulary (Sight and Content Vocabulary)", "Comprehension", "Silent Reading", "Fluency"],
  "Writing (GL)": ["Penmanship/Handwriting", "Writing Letters-Small and Capital Letters", "Writing Simple Words /Names of People and Places", "Writing/Copying Simple Sentences with Correct Spacing"],
  "Writing Conventions and Usage (GL)": ["Integrating Grammar in Written Language (Capitalisation)", "Integrating Grammar in Written Language (Punctuation)", "Integrating Grammar in Written Language (Use of Action Words)", "Integrating Grammar in Written Language (Use of Qualifying Words)", "Integrating Grammar in Written Language (Use of Postpositions)", "Integrating Grammar in Written Language (Use of Simple and Compound Sentences)", "Integrating Grammar in Written Language (Spelling)", "Integrating Grammar in Written Language (Use of Conjunctions)"],
  "Extensive Reading (GL)": ["Building the Love and Culture of Reading in Learners", "Read Aloud with Children", "Reading Texts, Poems, Narratives and Short Stories and Respond to them"],
  "Customs and Institutions": ["Rites of Passage", "Naming Systems", "The Clan System", "Chieftaincy"],
  "Composition Writing": ["Creative/Free Writing", "Narrative Writing", "Descriptive Writing", "Persuasive Writing", "Argumentative Writing", "Informative/Academic Writing", "Extra-Curricular Writing"],
  "Literature (GL)": ["Oral and written literature"],

  // French
  "L'Identité": ["Saluer et prendre congé", "Se présenter", "Présenter quelqu'un", "Décrire quelqu'un", "Décrire la famille et les liens familiaux"],
  "Parler de son Environnement": ["Parler de sa maison", "Parler de son école"],
  "Exprimer ses Goûts et ses Préférences": ["Dire ce que l’on aime", "Dire ce que l’on n’aime pas"],
  "Les Activités": ["Compter et faire des calculs simples", "Demander et donner l’heure", "Parler des jours de la semaine", "Situer les mois et les saisons dans le temps", "Entrer en contact par téléphone", "Inviter quelqu’un et accepter une invitation", "Identifier les professions et les métiers", "Demander et expliquer la position de personnes ou d’objets", "Donner et répondre à des ordres"],

  "Thermal Physics": ["Heat Transfer", "Thermodynamics"],

  // Chemistry
  "Atomic Structure": ["Subatomic Particles", "Electron Configuration"],
  "Chemical Bonding": ["Ionic Bonding", "Covalent Bonding", "Metallic Bonding"],
  
  // KG Integrated
  "All About Me": ["I am a wonderful and unique creation", "The parts of the human body and their functions", "Caring for the parts of my body", "Keeping my body healthy by eating good food and taking my vaccination", "My environment and my Health", "Protecting ourselves from home and road accidents"],
  "My Family": ["Type and members of my family", "Origin and History of my Family", "Family Celebrations and Festivals", "My school family-rules and regulations"],
  "Values and Beliefs": ["Our Family Values", "My Cultural Values", "Our religious values", "Our beliefs"],
  "My Local Community": ["Knowing the special places in my community", "Knowing the important people/occupation in my community", "Knowing the special leaders in our community and country"],
  "My Nation Ghana": ["History and celebration of Ghana's Independence"],
  "All Around Us": ["Living and non-living things", "Living things: Animals (Domestic and wild)", "Water", "Air", "Plants", "Gardening", "Light - Day and Night", "Changing weather conditions"],
  "My Global Community": ["Connecting and communicating with the global community"]
};

export const SUB_STRAND_STANDARDS: Record<string, Record<string, string[]>> = {
  "Number": {
    "Number and Numeration Systems": ["B1.1.1.1: Describe numbers 0 to 100", "B2.1.1.1: Count and estimate 0 to 1000", "B3.1.1.1: Count and estimate 0 to 10,000", "B4.1.1.1: Multi-digit whole numerals to 100,000", "B4.1.1.2: Roman numerals up to XXX (30)", "B5.1.1.1: Multi-digit numerals up to 1,000,000", "B5.1.1.2: Roman numerals up to C (100)", "B6.1.1.1: Multi-digit numerals up to 1 billion", "B7.1.1.1: Demonstrate understanding and the use of place value", "B8.1.1.1: Use place value for expressing quantities in standard form", "B9.1.1.1: Apply the understanding of place value in solving real life problems"],
    "Number Operations": ["B1.1.2.1: Conceptual addition and subtraction", "B2.1.2.1: Sums up to 100", "B3.1.2.1: Sums up to 1000", "B4.1.2.1: Recall multiplication up to 12x12", "B5.1.2.1: Mental math strategies for multiplication", "B6.1.2.1: Basic multiplication facts to 144", "B7.1.2.1: Apply mental mathematics strategies", "B8.1.2.1: Apply mental mathematics strategies", "B9.1.2.1: Apply mental mathematics and properties"],
    "Fractions, Decimals and Percentages": ["B1.1.3.1: Understanding halves", "B2.1.3.1: Halves and fourths", "B3.1.3.1: Unit fractions and multiples", "B4.1.3.1: Equivalent and improper fractions", "B4.1.4.1: Decimals (tenths and hundredths)", "B4.1.5.1: Understanding percent", "B5.1.3.1: Strategies for multiplying fractions", "B6.1.3.1: Comparing mixture of common, dec and percent", "B7.1.3.1: Simplify, compare and order a mixture of positive fractions", "B8.1.3.1: Apply the understanding of operation on fractions", "B9.1.3.1: Apply the understanding of operations on fractions"],
    "Number: Ratios and Proportion": ["B6.1.4.1: Concept of ratios", "B6.1.4.2: Proportional reasoning", "B7.1.4.1: Demonstrate an understanding of the concept of ratios", "B8.1.4.1: Demonstrate an understanding of ratio, rate and proportions", "B9.1.4.1: Apply the understanding of ratio, rate and proportions"]
  },
  "Algebra": {
    "Patterns and Relationships": ["B1.2.1.1: Repeating patterns", "B2.2.1.1: Increasing and decreasing patterns", "B3.2.1.1: Complex numerical patterns", "B4.2.1.1: Understanding patterns in tables/charts", "B5.2.1.1: Pattern rules and predictions", "B6.2.1.1: Algebraic rules for linear patterns", "B7.2.1.1: Derive the rule for a set of points of a relation", "B8.2.1.1: Determine the gradient of the line", "B9.2.1.1: Construct tables of values for pairs of linear relations"],
    "Algebraic Expressions": ["B5.2.2.1: Basic algebraic expressions", "B6.2.2.1: Simplify and evaluate expressions", "B7.2.2.1: Simplify algebraic expressions", "B8.2.2.1: Solve problems involving algebraic expressions", "B9.2.2.1: Demonstrate an understanding of change of subject"],
    "Variables and Equations": ["B4.2.2.1: Expressing word problems as equations", "B5.2.3.1: One-step equations with whole number coefficients", "B6.2.3.1: Single-variable one-step equations", "B7.2.3.1: Demonstrate an understanding of linear equations", "B8.2.3.1: Demonstrate an understanding of linear inequalities", "B9.2.3.1: Demonstrate understanding of single variable linear inequalities"]
  },
  "Geometry and Measurement": {
    "Shapes and Space": ["B1.3.1.1: Attributes of 2D and 3D shapes", "B2.3.1.1: Describe and analyse 2D/3D objects", "B3.3.1.1: Irregular polygons", "B4.3.1.1: Lines of symmetry", "B5.3.1.1: Sort quadrilaterals by attributes", "B6.3.1.1: Understanding prisms", "B7.3.1.1: Demonstrate understanding of angles", "B8.3.1.1: Relationship between parallel lines and alternate angles", "B9.3.1.1: Apply properties of angles at a point"],
    "Measurement": ["B1.3.3.1: Non-standard units", "B2.3.3.1: Comparison logic", "B3.3.3.1: Metres and centimetres", "B4.3.3.1: Perimeter and Area concept", "B5.3.2.1: Surface area of 2D shapes", "B5.3.3.3: Understanding angles", "B5.3.2.2: Volume of common 3D shapes", "B7.3.2.1: Find the perimeter of plane shapes", "B8.3.2.1: Apply Pythagoras theorem", "B9.3.2.1: Determine the surface area of prisms"],
    "Position and Transformation": ["B4.3.2.1: Cardinal points", "B5.3.4.1: Motion in space", "B6.3.3.5: Advanced cardinal points (NE, NW...)", "B7.3.3.1: Perform a single transformation (reflection and translation)", "B8.3.3.1: Perform a single transformation (rotation)", "B9.3.3.1: Perform an enlargement on a geometrical shape"]
  },
  "Handling Data": {
    "Data": ["B1.4.1.1: Organise data in 3 categories", "B2.4.1.1: Tallies and pictographs", "B3.4.1.1: Concrete graphs", "B4.4.1.1: Many-to-one correspondence", "B5.4.1.1: First-hand and second-hand data", "B6.4.1.1: Line graphs", "B6.4.1.2: Data collection techniques", "B7.4.1.1: Select, justify, and use appropriate methods to collect data", "B8.4.1.1: Construct and interpret frequency tables", "B9.4.1.1: Construct and interpret frequency tables and histogram"],
    "Chance or Probability": ["B5.4.2.1: Likelihood of outcomes", "B6.4.2.2: Theoretical and experimental probability", "B7.4.2.1: Identify the sample space for a probability experiment", "B8.4.2.1: Identify the sample space for a probability experiment (independent events)", "B9.4.2.1: Identify the sample space for a probability experiment (dependent events)"]
  },
  "Motor Skill and Movement Patterns": {
    "Locomotor movements": ["B1.1.1.1: Travel over/under objects", "B2.1.1.1: Travel in zigzag pathways", "B3.1.1.1: Change direction quickly", "B4.1.1.1: Slow vs fast movement", "B5.1.2.1: Walk on straight line edges", "B6.1.1.1: Cooperative movement games"],
    "Manipulative Skills": ["B1.1.3.1: Roll a ball stationary", "B2.1.10.1: Dribbling with hand", "B3.1.10.1: Dribbling around obstacles", "B4.1.6.1: Strike a bounce ball", "B5.1.6.1: Strike dropping ball", "B6.1.10.1: Dribbling under guard"]
  },
  "Movement Concepts, Principles and Strategies": {
    "Space awareness": ["B7.2.1.1: Demonstrate awareness of body and space constraints", "B8.2.1.1: Apply spatial positioning in offensive and defensive plays", "B9.2.1.1: Create movement sequences maximizing spatial coverage"],
    "Dynamics": ["B7.2.2.1: Discuss how forces act on moving bodies", "B8.2.2.1: Analyse the effects of speed and flow changes in movement patterns", "B9.2.2.1: Manipulate speed, force, and flow to improve skill execution"],
    "Relationships": ["B7.2.3.1: Work cooperatively in pairs or small groups during physical drills", "B8.2.3.1: Coordinate movement plans with teammates in a tactical space", "B9.2.3.1: Match movements to opponent tactics in real-time play"],
    "Body management": ["B7.2.4.1: Control balance during complex locomotion changes", "B8.2.4.1: Demonstrate body alignment and posture stability under pressure", "B9.2.4.1: Design creative routines requiring advanced body control"],
    "Strategies": ["B7.2.5.1: Formulate personal fitness plans based on movement concepts", "B8.2.5.1: Apply team play tactics in cooperative physical games", "B9.2.5.1: Evaluate and adapt strategies mid-performance to solve game problems"]
  },
  "Physical Fitness": {
    "Aerobic Capacity": ["B7.3.1.1: Cardiovascular fitness and running test", "B8.3.1.1: Cardiovascular-respiratory fitness endurance tests", "B9.3.1.1: Evaluate fitness levels through standardized testing"],
    "Strength": ["B1.3.2.3: Perform push-ups", "B2.3.2.3: Abdominal curls", "B3.3.2.3: Continuous step-ups"],
    "Endurance": ["B4.3.1.3: 15-min brisk walk", "B5.3.1.3: 10-min jogging", "B6.3.1.3: 8-min running test"],
    "Strength and Endurance": ["B1.3.2.3: Perform push-ups", "B2.3.2.3: Abdominal curls", "B3.3.2.3: Continuous step-ups", "B4.3.1.3: 15-min brisk walk", "B5.3.1.3: 10-min jogging", "B6.3.1.3: 8-min running test"],
    "Flexibility": ["B7.3.4.1: Perform joint mobility exercises", "B8.3.4.1: Demonstrate flexibility through dynamic stretching", "B9.3.4.1: Implement core flexibility sequences"],
    "Body Composition": ["B7.3.5.1: Analyse body mass index", "B8.3.5.1: Track changes in body fat ratios", "B9.3.5.1: Maintain balanced body type profiles"]
  },
  "Physical Fitness Concepts, Principles and Strategies": {
    "Fitness Programmes": ["B7.3.1.2: Research standard exercise routines", "B8.3.1.2: Design localized personal fitness schedules", "B9.3.1.2: Execute and adjust multi-week fitness programmes"],
    "Healthy Diet": ["B7.3.2.2: Establish links between nutritional choices and training outcomes", "B8.3.2.2: Plan appropriate food charts to sustain physical development", "B9.3.2.2: Evaluate diets and metabolic rates for various sports profiles"],
    "Safety and injury": ["B7.3.3.2: Explain warm-up and cool-down significance", "B8.3.3.2: Implement basic field-level first-aid procedures", "B9.3.3.2: Prevent common exercise-related injuries through proper form"],
    "Substances": ["B7.3.4.2: Discuss negative outcomes of substance misuse on stamina", "B8.3.4.2: Investigate legal and physical penalties of sports doping", "B9.3.4.2: Promote healthy lifestyle alternatives to performance enhancement drugs"]
  },
  "Values and Psycho-social Concepts, Principles and Strategies": {
    "Self-responsibility": ["B7.5.1.1: Demonstrate personal commitment to physical safety and goals", "B8.5.1.1: Set realistic physical development targets independently", "B9.5.1.1: Critique personal growth records and take responsibility for improvement"],
    "Social Interaction": ["B7.5.2.1: Promote respect and teamwork standards during field games", "B8.5.2.1: Manage conflicting views productively during cooperative work", "B9.5.2.1: Model inclusive and positive feedback strategies in group drills"],
    "Group Dynamics": ["B7.5.3.1: Distribute roles fairly during team competitive events", "B8.5.3.1: Facilitate shared team strategies to optimize performance", "B9.5.3.1: Resolve structural team division problems constructively"],
    "Critical thinking": ["B7.5.4.1: Discuss how spatial logic informs effective movement selection", "B8.5.4.1: Analyse tactical choices made by opposing parties in real games", "B9.5.4.1: Invent creative solutions to tactical problems faced in performance tasks"]
  },
  "All About Us": {
    "Nature of God": ["B1.1.1.1: Nature of God", "B2.1.1.1: Attributes of God", "B3.1.1.1: Purpose of God's creation", "B4.1.1.1: Uniqueness of human creation", "B5.1.1.1: Man as God's representative", "B6.1.1.1: God's attributes in mankind"],
    "Myself": ["B1.1.2.1: Myself", "B4.1.2.1: Self-awareness and harmony", "B5.1.2.1: Changes during adolescence", "B6.1.2.1: Challenges of adolescence"],
    "My Family and the Community": ["B1.1.3.1: My Family and Community", "B4.1.3.1: Commitment to family", "B5.1.3.1: Family roles and gender equity", "B6.1.3.1: Responsible family membership"],
    "Home and School": ["B1.1.4.1: Home and School", "B4.1.4.1: Work as a civic duty", "B5.1.4.1: Peer pressure and social life", "B6.1.4.1: Food safety and table manners"]
  },
  "All Around Us OWOP": {
    "The Environment and the Weather": ["B1.2.1.1: Environment and Weather", "B4.2.1.1: Environmental safety", "B5.2.1.1: Greenhouse effect and climate change", "B6.2.1.1: Reforestation and tree planting"],
    "Plants and Animals": ["B2.2.2.1: Plants and Animals", "B4.2.2.1: Interdependence of living things", "B5.2.2.1: Animal housing and care", "B6.2.2.1: Use of animal waste"],
    "Map Making and Land Marks": ["B3.2.3.1: Map Making and Land Marks", "B4.2.3.1: Mapping the school", "B5.2.3.1: Major landmarks in Ghana", "B6.2.3.1: Map of Ghana (Regions/Capitals)"],
    "Population and Settlement": ["B3.2.4.1: Population and Settlement", "B4.2.4.1: Settlement patterns in Ghana", "B5.2.4.1: Features of rural and urban areas", "B6.2.4.1: Internal migration"]
  },
  "Our Beliefs and Values": {
    "Worship": ["B1.3.1.1: Worship", "B4.3.1.1: Obedience through worship", "B5.3.1.1: Moral lessons from sacred texts", "B6.3.1.1: Importance of prayer"],
    "Festivals": ["B2.3.2.1: Festivals", "B4.3.2.1: Significance of Ghanaian festivals", "B5.3.2.1: Cultural practices in festivals", "B6.3.2.1: Settle disputes during festivals"],
    "Basic Human Rights": ["B3.3.3.1: Basic Human Rights", "B4.3.3.1: Fundamental rights of a child", "B5.3.3.1: Respecting rights in the family", "B6.3.3.1: Sources of help for rights abuse"],
    "Being a Leader": ["B3.3.4.1: Being a Leader", "B4.3.4.1: Leadership skills", "B5.3.4.1: Ministry of religious leaders", "B6.3.4.1: Latter lives of leaders"]
  },
  "Our Nation Ghana": {
    "Being a Citizen": ["B1.4.1.1: Being a Citizen", "B4.4.1.1: Etiquette and manners", "B5.4.1.1: Effective citizenship attitudes", "B6.4.1.1: Peaceful living and conflict"],
    "Authority and Power": ["B2.4.2.1: Authority and Power", "B4.4.2.1: Respect for authority", "B5.4.2.1: Responsible adulthood", "B6.4.2.1: Democratic governance features"],
    "Responsible use of Resources": ["B3.4.3.1: Responsible use of Resources", "B4.4.3.1: Responsible use of water", "B5.4.3.1: Safe water bodies", "B6.4.3.1: Protecting water resources"],
    "Farming in Ghana": ["B3.4.4.1: Farming in Ghana", "B4.4.4.1: Gardening and nursing seeds", "B5.4.4.1: Transplanting techniques", "B6.4.4.1: Job opportunities in agriculture"]
  },
  "My Global Community OWOP": {
    "Our Neighbouring Countries": ["B1.5.1.1: Our Neighbouring Countries", "B4.5.1.1: Cultural exchanges with neighbours", "B5.5.1.1: Economic exchanges with neighbours", "B6.5.1.1: Cooperation with other nations"],
    "Introduction to Computing": ["B2.5.2.1: Introduction to Computing", "B5.5.1.2: Earth's rotation and revolution", "B6.5.1.2: Effects of climate change"],
    "Sources of Information": ["B3.5.3.1: Sources of Information"],
    "Technology in Communication": ["B3.5.4.1: Technology in Communication"]
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
      "B1.1.1.1: Identify different materials in the environment",
      "B2.1.1.1: Describe materials based on their physical properties",
      "B3.1.1.1: Distinguish between various materials and their uses",
      "B4.1.1.1: Classify solids, liquids and gases",
      "B5.1.1.1: Investigate the properties of matter",
      "B6.1.1.1: Describe the changes of state of matter",
      "B7.1.1.1: Recognise materials as important resources for providing human needs",
      "B7.1.1.2: Understand the periodic table as different elements made up of metals, non-metals and noble gases arranged in an order",
      "B8.1.1.1: Identify types of mixtures by name and characteristics",
      "B8.1.1.2: Describe atoms as composed of sub-atomic particles",
      "B9.1.1.1: Show an understanding of formation of binary chemical compounds and their uses (Acids, Bases and Salts)",
      "B9.1.1.2: Demonstrate knowledge of atomic bonding in the formation of chemical compounds"
    ],
    "Living Cells": [
      "B1.1.2.1: Identify parts of the human body",
      "B2.1.2.1: Explain the functions of the sense organs",
      "B3.1.2.1: Describe how we grow and change",
      "B4.1.2.1: Explain the parts of a flowering plant",
      "B5.1.2.1: Describe the life cycle of a flowering plant",
      "B6.1.2.1: Explain the structure of the human heart",
      "B7.1.2.1: Demonstrate understanding of the structure of organisms and functions of cells in living systems",
      "B8.1.2.1: Demonstrate an understanding of the types of cells and their structure in relation to different organisms",
      "B9.1.2.1: Demonstrate knowledge of specialist cells of dicotyledonous plants and humans, their formation and functions"
    ]
  },
  "Forces and Energy": {
    "Energy": [
      "B1.4.1.1: Identify different sources of light and heat in the home",
      "B2.4.1.1: Demonstrate how light travels",
      "B3.4.1.1: Identify simple sources of energy",
      "B4.4.1.1: Identify renewable and non-renewable energy sources",
      "B5.4.1.1: Demonstrate the conversion of energy",
      "B6.4.1.1: Explain the conservation of energy",
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
      "B1.5.1.1: Identify different types of waste in the home and school",
      "B2.5.1.1: Describe ways of managing waste in the school",
      "B3.5.1.1: Explain the importance of keeping the environment clean",
      "B4.5.1.1: Identify ways of disposing of liquid waste",
      "B5.5.1.1: Explain the concept of the 3Rs (Reduce, Reuse, Recycle)",
      "B6.5.1.1: Demonstrate how to prepare compost from organic waste",
      "B7.5.1.1: Exhibit knowledge and skill of scientific basis for management practices of types of waste in the environment",
      "B8.5.1.1: Demonstrate knowledge of waste management systems and apply it in an environment",
      "B9.5.1.1: Demonstrate an understanding of the scientific ways of waste management",
      "B9.5.1.2: Demonstrate an understanding of the impact of waste on an environment, innovative waste management technologies"
    ],
    "Human Health": [
      "B1.5.2.1: Identify common diseases in the community",
      "B2.5.2.1: Discuss how to prevent common diseases like malaria",
      "B3.5.2.1: Explain the importance of personal hygiene",
      "B4.5.2.1: Identify common skin diseases and their prevention",
      "B5.5.2.1: Discuss the importance of immunization",
      "B6.5.2.1: Explain the causes and effects of waterborne diseases",
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
      "B1.3.1.1: Identify the external parts of the human body",
      "B2.3.1.1: Explain the functions of the five senses",
      "B3.3.1.1: Describe the digestive system in humans (intro)",
      "B4.3.1.1: Identify the parts of the respiratory system",
      "B5.3.1.1: Explain how the human body system works together",
      "B6.3.1.1: Describe the nervous system functions",
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
      "B1.2.1.1: Observe and group changes in weather",
      "B2.2.1.1: Identify the sun as the main source of light and heat",
      "B3.2.1.1: Describe the movement of the earth",
      "B4.2.1.1: Identify the main sources of water in the community",
      "B5.2.1.1: Explain the stages of the water cycle",
      "B6.2.1.1: Discuss the importance of the atmosphere",
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
  "Oral Language (GL)": {
    "Conversation/Everyday discourse": ["B7.1.1.1: Use of appropriate register", "B8.1.1.1: Narrating daily activities", "B9.1.1.1: Spontaneous social interaction"],
    "Listening Comprehension": ["B7.2.2.1: extended listening", "B8.2.2.1: level-appropriate dialogue", "B9.2.2.1: natural level-appropriate interactions"],
    "Songs": ["B1.1.1.1: Demonstrate knowledge of a song by saying the words heard", "B2.1.1.1: Demonstrate an understanding of types of work and play songs", "B3.1.1.1: Demonstrate an understanding of some selected songs", "B4.1.1.1: Exhibit knowledge of traditional and occupational songs", "B5.1.1.1: Show an understanding of cradle songs/lullaby", "B6.1.1.1: Investigate some traditional dances and their songs"],
    "Rhymes": ["B1.1.2.1: Demonstrate an understanding of words in a rhyme", "B2.1.2.1: Demonstrate knowledge of some selected rhymes", "B3.1.2.1: Show an understanding of some rhymes"],
    "Poems": ["B3.1.3.1: Demonstrate knowledge of poem recitation", "B4.1.3.1: Demonstrate knowledge and understanding of selected poems", "B5.1.3.1: Demonstrate knowledge and understanding of selected poems", "B6.1.3.1: Demonstrate knowledge and understanding of selected poems"],
    "Story Telling": ["B1.1.4.1: Exhibit knowledge of listening and retelling simple stories", "B2.1.4.1: Exhibit knowledge of listening to and retelling simple stories", "B3.1.4.1: Exhibit knowledge of listening to and reading simple stories", "B4.1.4.1: Demonstrate knowledge on the structure and features of folktales", "B5.1.4.1: Demonstrate knowledge on the structure and features of folktales", "B6.1.4.1: Demonstrate an understanding and comparison of folktales to stories"],
    "Conversation": ["B1.1.6.1: Demonstrate knowledge and understanding of greetings", "B2.1.6.1: Exhibit knowledge of greeting and responding appropriately", "B3.1.6.1: Exhibit an understanding of appropriate non-formal forms of greeting", "B4.1.6.1: Talk about personal experiences and that of others", "B5.1.6.1: Name and discuss some basic items used at home and in school", "B6.1.6.1: Exhibit knowledge of the names of some towns, cities and villages in Ghana"],
    "Presentation": ["B1.1.11.1: Demonstrate knowledge of the days of the week", "B2.1.11.1: Demonstrate knowledge on the days of the week and time", "B3.1.11.1: Demonstrate knowledge on the days of the week and minutes", "B4.1.11.1: Demonstrate knowledge and understanding of the names and sequence of days", "B6.1.11.1: Demonstrate knowledge on the need for safety measures in the environment"]
  },
  "Language and Usage": {
    "Integrating grammar (nouns, pronouns, adjectives)": ["B7.4.2.1: Basic forms", "B8.4.2.1: Abstract/Concrete", "B9.4.2.1: Singular/Plural"],
    "Integrating grammar (verbs, adverbs, conjunctions, postpositions/prepositions)": ["B7.4.3.1: Verbs and Adverbs", "B8.4.3.1: Tense and Aspectual forms", "B9.4.3.1: Auxiliary verbs"]
  },
  "Reading (GL)": {
    "Reading": ["B7.3.1.1: Reading and summarizing", "B8.3.1.1: Extended texts", "B9.3.1.1: Recall points and rewrite"],
    "Translation": ["B7.3.2.1: Translating words/phrases", "B8.3.2.1: Translating sentences", "B9.3.2.1: Decoding and translating"],
    "Pre-Reading Activities": ["B1.2.1.1: Recognise and talk about objects at home and school"],
    "Print Concept": ["B1.2.2.1: Demonstrate knowledge on handling print materials"],
    "Phonological and Phonemic Awareness": ["B1.2.3.1: Demonstrate knowledge on hearing/recognising sounds", "B2.2.3.1: Demonstrate knowledge of hearing/differentiating sounds", "B3.2.3.1: Demonstrate knowledge of listening/recognising sounds"],
    "Phonics (Letter and Sound Knowledge)": ["B1.2.4.1: Show an understanding of connecting sounds to letters", "B2.2.4.1: Show an understanding of connecting sounds to letters", "B3.2.4.1: Show an understanding of connecting sounds to letters", "B4.2.4.1: Demonstrate knowledge in listening and pronouncing words", "B5.2.4.1: Demonstrate the ability to listen to and pronounce words", "B6.2.4.1: Demonstrate the ability to listen and pronounce words"],
    "Vocabulary (Sight and Content Vocabulary)": ["B4.2.5.1: Show an understanding of, recognise and read about things", "B5.2.5.1: Show an understanding of recognising and reading about things", "B6.2.5.1: Show an ability to recognise and read about things"],
    "Comprehension": ["B4.2.6.1: Exhibit knowledge of answering questions based on texts presented", "B5.2.6.1: Exhibit knowledge of answering questions based on texts presented", "B6.2.6.1: Exhibit the ability to answer questions based on texts presented"],
    "Silent Reading": ["B4.2.7.1: Demonstrate knowledge on reading for comprehension", "B5.2.7.1: Demonstrate knowledge on reading for comprehension", "B6.2.7.1: Demonstrate knowledge on reading for comprehension"],
    "Fluency": ["B4.2.8.1: Exhibit knowledge by reading with minimal mistakes", "B5.2.8.1: Exhibit the ability to read longer texts", "B6.2.8.1: Exhibit knowledge by reading with minimal mistakes"],
    "Summarising": ["B4.2.9.1: Show an understanding of how main ideas are extracted", "B5.2.9.1: Show an understanding of how main ideas are extracted", "B6.2.9.1: Show an understanding of how main ideas from a text are extracted"]
  },
  "Composition Writing": {
    "Structure and organise ideas in composition writing": ["B7.5.1.1: Paragraph features", "B8.5.1.1: Coherent essays", "B9.5.1.1: Extended texts and linking"],
    "Narrative Writing": ["B4.4.1.1: Show an understanding in using punctuation marks appropriately", "B5.4.1.1: Comprehend and use punctuation marks", "B6.4.1.1: Show an understanding of writing a narrative composition"],
    "Creative/ Free Writing": ["B4.4.2.1: Show an understanding of composing short simple stories", "B5.4.2.1: Show an understanding of creating and writing longer stories", "B6.4.2.1: Show an understanding of writing good imaginative and real stories"]
  },
  "Listening and Speaking": {
    "Greetings and Introductions": ["B7.1.1.1: Greet and introduce oneself in French"],
    "Family and Home": ["B8.1.1.1: Describe family members in French"],
    "School and Education": ["B9.1.1.1: Talk about school subjects and teacher in French"]
  },
  "Literature (GL)": {
    "Oral and written literature": ["B7.6.1.1: Components of literature", "B8.6.1.1: Proverbs and idioms", "B9.6.1.1: Drum/horn language"]
  },
  "Extensive Reading (GL)": {
    "Building the Love and Culture of Reading in Learners": ["B4.6.1.1: Exhibit knowledge of reading long stories", "B5.6.1.1: Exhibit the ability to read other materials", "B6.6.1.1: Exhibit knowledge of understanding and appreciating magazines"],
    "Read Aloud with Children": ["B4.6.2.1: Exhibit knowledge of reading long stories with correct tone", "B5.6.2.1: Exhibit knowledge in reading sentences/paragraphs aloud", "B6.6.2.1: Exhibit knowledge of reading dialogue and long passages"],
    "Reading short stories and respond to them": ["B4.6.3.1: Demonstrate knowledge on reading materials", "B5.6.3.1: Demonstrate knowledge in reading materials", "B6.6.3.1: Demonstrate knowledge on reading materials other than reader"]
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
    "Conversation/Everyday Discourse": [
      "B7.1.1.1: Demonstrate use of appropriate language orally in specific situations",
      "B8.1.1.1: Demonstrate use of appropriate language orally in specific situations",
      "B9.1.1.1: Demonstrate the use of appropriate language orally in specific situations"
    ],
    "Listening Comprehension": [
      "B7.1.2.1: Demonstrate the ability to listen to extended reading and identify key information",
      "B8.1.2.1: Demonstrate the ability to listen to extended reading and identify key information",
      "B9.1.2.1: Demonstrate the ability to listen to extended reading and identify key information"
    ],
    "English Sounds": [
      "B7.1.3.1: Articulate English speech sounds to develop confidence and skills in listening and speaking",
      "B8.1.3.1: Articulate English speech sounds to develop confidence and skills in listening and speaking",
      "B9.1.3.1: Articulate English speech sounds to develop confidence and skills in listening and speaking"
    ],
    "Songs": ["B1.1.1.1: Listen to and sing familiar songs", "B2.1.1.1: Interpret familiar songs", "B3.1.1.1: Talk about the benefits of songs", "B4.1.1.1: Listen attentively to songs and sing them", "B5.1.1.1: Explain the central messages in songs", "B6.1.1.1: Relate the central messages in songs to personal experiences"],
    "Story Telling": ["B1.1.3.1: Listen to stories and identify characters", "B2.1.4.1: Identify characters in a story", "B3.1.4.1: Respond to and ask questions based on stories", "B4.1.4.1: Retell stories sequentially", "B5.1.4.1: Demonstrate understanding of lessons in stories", "B6.1.4.1: Make connections between texts or stories and personal experiences"],
    "Conversation": ["B1.1.6.1: Use appropriate greetings", "B2.1.6.1: Use certain culturally acceptable language", "B3.1.6.1: Use appropriate greetings for special occasions", "B4.1.6.1: Describe/talk about objects, events, dates and time", "B5.1.6.1: Describe/talk about names of regions/places", "B6.1.6.1: Describe/talk about objects/personalities/events"]
  },
  "Reading": {
    "Comprehension": [
      "B1.2.7.1: Use self-correction strategies", "B2.2.7.1: Understand and analyse texts read", "B3.2.7.1: Use self-correction strategies to make meaning", "B4.2.7.1: Construct meaning from texts read", "B5.2.7.1: Use pre-reading and while-reading strategies", "B6.2.7.1: Use prior knowledge to adjust comprehension",
      "B7.2.1.1: Demonstrate increasing confidence and enjoyment in independent reading",
      "B7.2.1.2: Read, comprehend and interpret texts",
      "B8.2.1.1: Demonstrate increasing confidence and enjoyment in independent reading",
      "B8.2.1.2: Read, comprehend, interpret texts",
      "B9.2.1.1: Demonstrate increasing confidence and enjoyment in independent reading",
      "B9.2.1.2: Read, comprehend, and analyse varieties of texts"
    ],
    "Summarising": [
      "B7.2.2.1: Demonstrate an understanding in summarising",
      "B7.2.2.2: Demonstrate understanding of textual evidence that supports a writing piece",
      "B8.2.2.1: Cite the textual evidence that supports an analysis of a text to determine the central idea and provide an objective summary",
      "B9.2.2.1: Cite the textual evidence that supports an analysis of what the text says, determining the central idea of a text and provide an objective summary"
    ],
    "Phonics": ["B1.2.2.1: Identify the alphabet in order", "B2.2.2.1: Blend syllables to produce words", "B3.2.2.1: Understand the relationship between spelling and sounds", "B4.2.2.1: Match sounds to their corresponding letter patterns", "B5.2.2.1: Apply common phonic generalisations", "B6.2.2.1: Read words with specific ending sounds"]
  },
  "Writing": {
    "Production and Distribution of Writing": [
      "B7.4.1.1: Develop, organise and express ideas coherently and cohesively in writing",
      "B7.4.1.2: Create different paragraphs on a given topic",
      "B8.4.1.1: Develop, organise and express ideas coherently and cohesively in writing",
      "B8.4.1.2: Create different paragraphs within a composition on a given topic",
      "B9.4.1.1: Develop, organise and express ideas coherently and cohesively in writing",
      "B9.4.1.2: Create different paragraphs a given topic"
    ],
    "Text Types and Purposes": [
      "B7.4.2.1: Develop, organise and express ideas coherently and cohesively in writing for a variety of purposes",
      "B7.4.2.2: Apply writing skills to specific life situations",
      "B8.4.2.1: Use a process approach to compose descriptive, narrative/ imaginative, informational, persuasive and argumentative texts",
      "B8.4.2.2: Apply writing skills to specific life situations",
      "B9.4.2.1: Use a process approach to compose descriptive, narrative/ imaginative, informational and persuasive, argumentative texts",
      "B9.4.2.2: Apply writing skills to specific life situations"
    ],
    "Building and Presenting Knowledge": [
      "B7.4.3.1: Research to build and present knowledge",
      "B8.4.3.1: Research to build and present knowledge",
      "B9.4.3.1: Research to build and present knowledge"
    ],
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
  "Grammar Usage": {
    "Grammar": [
      "B7.3.1.1: Apply the knowledge of word classes and their functions in Communication",
      "B7.3.1.2: Demonstrate command of structural and functional use of sentences",
      "B7.3.1.4: Apply knowledge of clauses in communication",
      "B7.3.1.5: Demonstrate understanding of the use of conditional tenses in communication",
      "B7.3.1.6: Demonstrate mastery of use of active and passive voice",
      "B7.3.1.7: Show understanding and use of question tags in communication",
      "B8.3.1.1: Apply the knowledge of word classes and their functions in Communication",
      "B8.3.1.5: Demonstrate command of the use of reported speech",
      "B8.3.1.6: Show understanding and use of question tags in communication",
      "B9.3.1.1: Apply the knowledge of phrases and clauses and their functions in Communication",
      "B9.3.1.2: Demonstrate understanding of the use of conditional tenses in communication",
      "B9.3.1.3: Demonstrate command of structural and functional use of sentences",
      "B9.3.1.4: Demonstrate mastery of the use of active and passive voice"
    ],
    "Punctuation and Capitalisation": [
      "B7.3.2.1: Demonstrate use and mastery of capitalisation and punctuation in communication",
      "B8.3.2.1: Demonstrate mastery of capitalisation and punctuation in communication",
      "B9.3.2.1: Demonstrate mastery of capitalisation and punctuation in communication"
    ],
    "Vocabulary": [
      "B7.3.3.1: Demonstrate appropriate use of vocabulary in communication",
      "B7.3.4.1: Demonstrate understanding of use of aesthetic language to enrich communication",
      "B8.3.3.1: Demonstrate appropriate use of vocabulary in communication",
      "B9.3.3.1: Demonstrate appropriate use of vocabulary and spelling conventions in communication"
    ]
  },
  "Literature": {
    "Narrative, Drama and Poetry": [
      "B7.5.1.1: Demonstrate understanding of how various elements of literary genres contribute to meaning",
      "B8.5.1.1: Demonstrate understanding of how various elements of literary genres contribute to meaning",
      "B9.5.1.1: Demonstrate understanding of how various elements of literary genres contribute to meaning"
    ]
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
  "L'Identité": {
    "Saluer et prendre congé": [
      "B4.1.1.1: Écouter et comprendre des salutations",
      "B4.1.1.2: Saluer et répondre oralement",
      "B4.1.1.3: Lire et comprendre des salutations",
      "B4.1.1.4: Écrire des mots de salutation",
      "B5.1.1.1: Écouter et comprendre des salutations",
      "B5.1.1.2: Saluer et répondre oralement",
      "B5.1.1.3: Lire et comprendre des salutations",
      "B5.1.1.4: Écrire des mots de salutation",
      "B6.1.1.1: Écouter et comprendre des salutations",
      "B6.1.1.2: Saluer et répondre oralement",
      "B6.1.1.3: Lire et comprendre des salutations",
      "B6.1.1.4: Écrire des mots de salutation"
    ],
    "Se présenter": [
      "B4.1.2.1: Écouter et comprendre des présentations",
      "B4.1.2.2: Se présenter oralement",
      "B4.1.2.3: Lire et comprendre des présentations",
      "B4.1.2.4: Se présenter par écrit",
      "B5.1.2.1: Écouter et comprendre des présentations",
      "B5.1.2.2: Se présenter oralement",
      "B5.1.2.3: Lire et comprendre des présentations",
      "B5.1.2.4: Se présenter par écrit",
      "B6.1.2.1: Écouter et comprendre des présentations",
      "B6.1.2.2: Se présenter oralement",
      "B6.1.2.3: Lire et comprendre des présentations",
      "B6.1.2.4: Se présenter par écrit"
    ],
    "Présenter quelqu'un": [
      "B4.1.3.1: Écouter et comprendre la présentation de quelqu'un",
      "B4.1.3.2: Présenter quelqu'un oralement",
      "B4.1.3.3: Lire et comprendre la présentation de quelqu'un",
      "B4.1.3.4: Présenter quelqu'un par écrit",
      "B5.1.3.1: Écouter et comprendre la présentation de quelqu'un",
      "B5.1.3.2: Présenter quelqu'un oralement",
      "B5.1.3.3: Lire et comprendre la présentation de quelqu'un",
      "B5.1.3.4: Présenter quelqu'un par écrit",
      "B6.1.3.1: Écouter et comprendre la présentation de quelqu'un",
      "B6.1.3.2: Présenter quelqu'un oralement",
      "B6.1.3.3: Lire et comprendre la présentation de quelqu'un",
      "B6.1.3.4: Présenter quelqu'un par écrit"
    ],
    "Décrire quelqu'un": [
      "B4.1.4.1: Écouter et comprendre la description de quelqu'un",
      "B4.1.4.2: Décrire quelqu'un oralement",
      "B4.1.4.3: Lire et comprendre la description de quelqu'un",
      "B4.1.4.4: Décrire quelqu'un par écrit",
      "B5.1.4.1: Écouter et comprendre la description de quelqu'un",
      "B5.1.4.2: Décrire quelqu'un oralement",
      "B5.1.4.3: Lire et comprendre la description de quelqu'un",
      "B5.1.4.4: Décrire quelqu'un par écrit",
      "B6.1.4.1: Écouter et comprendre la description de quelqu'un",
      "B6.1.4.2: Décrire quelqu'un oralement",
      "B6.1.4.3: Lire et comprendre la description de quelqu'un",
      "B6.1.4.4: Décrire quelqu'un par écrit"
    ],
    "Décrire la famille et les liens familiaux": [
      "B7.1.1.1: Describe family members and relationships"
    ]
  },
  "Parler de son Environnement": {
    "Parler de sa maison": [
      "B7.2.1.1: Describe different rooms and parts of a house in French"
    ],
    "Parler de son école": [
      "B4.2.2.1: Écouter et comprendre l'environnement scolaire",
      "B4.2.2.2: Parler de l'école oralement",
      "B4.2.2.3: Lire sur l'école",
      "B4.2.2.4: Écrire sur l'école",
      "B5.2.2.1: Écouter et comprendre l'environnement scolaire",
      "B5.2.2.2: Parler de l'école oralement",
      "B5.2.2.3: Lire sur l'école",
      "B5.2.2.4: Écrire sur l'école",
      "B6.2.2.1: Écouter et comprendre l'environnement scolaire",
      "B6.2.2.2: Parler de l'école oralement",
      "B6.2.2.3: Lire sur l'école",
      "B6.2.2.4: Écrire sur l'école"
    ]
  },
  "Exprimer ses Goûts et ses Préférences": {
    "Dire ce que l’on aime": [
      "B4.3.1.1: Écouter et comprendre les goûts",
      "B4.3.1.2: Exprimer ses goûts oralement",
      "B4.3.1.3: Lire sur les goûts",
      "B4.3.1.4: Écrire sur ses goûts",
      "B5.3.1.1: Écouter et comprendre les goûts",
      "B5.3.1.2: Exprimer ses goûts oralement",
      "B5.3.1.3: Lire sur les goûts",
      "B5.3.1.4: Écrire sur ses goûts",
      "B6.3.1.1: Écouter et comprendre les goûts",
      "B6.3.1.2: Exprimer ses goûts oralement",
      "B6.3.1.3: Lire sur les goûts",
      "B6.3.1.4: Écrire sur ses goûts"
    ],
    "Dire ce que l'on aime": [
      "B4.3.1.1: Écouter et comprendre les goûts",
      "B4.3.1.2: Exprimer ses goûts oralement",
      "B4.3.1.3: Lire sur les goûts",
      "B4.3.1.4: Écrire sur ses goûts",
      "B5.3.1.1: Écouter et comprendre les goûts",
      "B5.3.1.2: Exprimer ses goûts oralement",
      "B5.3.1.3: Lire sur les goûts",
      "B5.3.1.4: Écrire sur ses goûts",
      "B6.3.1.1: Écouter et comprendre les goûts",
      "B6.3.1.2: Exprimer ses goûts oralement",
      "B6.3.1.3: Lire sur les goûts",
      "B6.3.1.4: Écrire sur ses goûts"
    ],
    "Dire ce que l’on n’aime pas": [
      "B7.3.1.1: Express dislikes in French"
    ],
    "Dire ce que l'on n'aime pas": [
      "B7.3.1.1: Express dislikes in French"
    ]
  },
  "Les Activités": {
    "Compter et faire des calculs simples": [
      "B4.4.1.1: Écouter et comprendre les nombres",
      "B4.4.1.2: Compter à haute voix",
      "B4.4.1.3: Lire les nombres",
      "B4.4.1.4: Écrire les nombres et faire des calculs",
      "B5.4.1.1: Écouter et comprendre les nombres",
      "B5.4.1.2: Compter à haute voix",
      "B5.4.1.3: Lire les nombres",
      "B5.4.1.4: Écrire les nombres et faire des calculs",
      "B6.4.1.1: Écouter et comprendre les nombres",
      "B6.4.1.2: Compter à haute voix",
      "B6.4.1.3: Lire les nombres",
      "B6.4.1.4: Écrire les nombres et faire des calculs"
    ],
    "Demander et donner l’heure": [
      "B4.4.2.1: Écouter et comprendre l'heure",
      "B4.4.2.2: Demander et donner l'heure oralement",
      "B4.4.2.3: Lire l'heure",
      "B4.4.2.4: Écrire l'heure",
      "B5.4.2.1: Écouter et comprendre l'heure",
      "B5.4.2.2: Demander et donner l'heure oralement",
      "B5.4.2.3: Lire l'heure",
      "B5.4.2.4: Écrire l'heure",
      "B6.4.2.1: Écouter et comprendre l'heure",
      "B6.4.2.2: Demander et donner l'heure oralement",
      "B6.4.2.3: Lire l'heure",
      "B6.4.2.4: Écrire l'heure"
    ],
    "Demander et donner l'heure": [
      "B4.4.2.1: Écouter et comprendre l'heure",
      "B4.4.2.2: Demander et donner l'heure oralement",
      "B4.4.2.3: Lire l'heure",
      "B4.4.2.4: Écrire l'heure",
      "B5.4.2.1: Écouter et comprendre l'heure",
      "B5.4.2.2: Demander et donner l'heure oralement",
      "B5.4.2.3: Lire l'heure",
      "B5.4.2.4: Écrire l'heure",
      "B6.4.2.1: Écouter et comprendre l'heure",
      "B6.4.2.2: Demander et donner l'heure oralement",
      "B6.4.2.3: Lire l'heure",
      "B6.4.2.4: Écrire l'heure"
    ],
    "Parler des jours de la semaine": [
      "B4.4.3.1: Écouter et comprendre les jours",
      "B4.4.3.2: Parler des jours oralement",
      "B4.4.3.3: Lire les jours",
      "B4.4.3.4: Écrire les jours",
      "B5.4.3.1: Écouter et comprendre les jours",
      "B5.4.3.2: Parler des jours oralement",
      "B5.4.3.3: Lire les jours",
      "B5.4.3.4: Écrire les days",
      "B6.4.3.1: Écouter et comprendre les jours",
      "B6.4.3.2: Parler des jours oralement",
      "B6.4.3.3: Lire les jours",
      "B6.4.3.4: Écrire les jours"
    ],
    "Identifier les professions et les métiers": [
      "B4.4.7.1: Écouter et comprendre les professions",
      "B4.4.7.2: Parler des professions oralement",
      "B4.4.7.3: Lire les professions",
      "B4.4.7.4: Écrire les professions",
      "B5.4.7.1: Écouter et comprendre les professions",
      "B5.4.7.2: Parler des professions oralement",
      "B5.4.7.3: Lire les professions",
      "B5.4.7.4: Écrire les professions",
      "B6.4.7.1: Écouter et comprendre les professions",
      "B6.4.7.2: Parler des professions oralement",
      "B6.4.7.3: Lire les professions",
      "B6.4.7.4: Écrire les professions"
    ]
  },
  
  // Ghanaian Language B1-B3
  "Writing (GL)": {
    "Penmanship/Handwriting": ["B1.3.1.1: Make given patterns and objects", "B2.3.1.1: Understand how to copy sentences clearly", "B3.3.1.1: Write and practise saying letters or words", "B4.3.1.1: Exhibit knowledge of the use of full stops, commas and question marks", "B5.3.1.1: Exhibit knowledge in the use of full stops, commas and question marks", "B6.3.1.1: Write sentences clearly and correctly"],
    "Writing Simple Words /Names of People and Places": ["B1.3.3.1: Show an understanding of combining strokes", "B2.3.3.2.1: Show understanding of items in the environment", "B3.3.3.1: Write simple words/names of people and places"]
  },
  "Writing Conventions and Usage (GL)": {
    "Integrating Grammar in Written Language (Capitalisation)": ["B1.5.1.1: Exhibit knowledge of writing capital letters", "B2.5.1.1: Exhibit knowledge of using capital letters", "B3.5.1.1: Exhibit knowledge of using capital letters appropriately", "B4.5.1.1: Exhibit knowledge of using capital letters appropriately", "B5.5.1.1: Show an understanding in the use of capital letters", "B6.5.1.1: Exhibit knowledge of using capital letters appropriately"],
    "Integrating Grammar in Written Language (Action Words)": ["B1.5.3.1: Show an understanding of writing action words", "B2.5.3.1: Show an understanding of writing action words", "B3.5.3.1: Demonstrate knowledge on recognition of action words", "B4.5.3.1: Demonstrate knowledge on recognition and use of action words", "B5.5.3.1: Demonstrate knowledge on use of action words appropriately", "B6.5.3.1: Demonstrate knowledge on the appropriate use of action words"],
    "Integrating Grammar in Written Language (Conjunctions)": ["B4.5.8.1: Apply the knowledge of conjunctions in writing", "B5.5.8.1: Apply the knowledge on the use of conjunctions", "B6.5.8.1: Apply the knowledge of conjunctions in writing"]
  },
  "All About Me": {
    "I am a wonderful and unique creation": ["K1.1.1.1: Demonstrate understanding that all learners are wonderful and have unique body features", "K2.1.1.1: Demonstrate understanding that all learners are wonderful and unique"],
    "The parts of the human body and their functions": ["K1.1.2.1: Demonstrate understanding of appropriate names of parts of the body and their functions", "K2.1.2.1: Demonstrate knowledge of appropriate names of parts of internal body and their functions"],
    "Caring for the parts of my body": ["K1.1.3.1: Demonstrate understanding of the importance of personal hygiene", "K2.1.3.1: Demonstrate understanding of personal hygiene and care of human body"],
    "Keeping my body healthy by eating good food and taking my vaccination": ["K1.1.4.1: Demonstrate understanding that eating good food and vaccinations keep us healthy", "K2.1.4.1: Demonstrate understanding of keeping our bodies healthy"],
    "My environment and my Health": ["K1.1.5.1: Demonstrate understanding of keeping home and school environment clean", "K2.1.5.1: Demonstrate understanding of the environment and how to keep it safe"],
    "Protecting ourselves from home and road accidents": ["K1.1.6.1: Demonstrate understanding of measures to take to keep safe", "K2.1.6.1: Demonstrate understanding of how to be safe and identify strangers"]
  },
  "My Family": {
    "Type and members of my family": ["K1.2.1.1: Demonstrate understanding of importance, roles and responsibilities of family members", "K2.2.1.1: Demonstrate understanding of the rights, roles and responsibilities of family members"],
    "Origin and History of my Family": ["K1.2.2.1: Demonstrate knowledge of the origin and history of our families", "K2.2.2.1: Demonstrate understanding of origin and history of our families"],
    "Family Celebrations and Festivals": ["K1.2.3.1: Demonstrate knowledge of celebrations and festivals", "K2.2.3.1: Demonstrate understanding of importance of activities in festivals"],
    "My school family-rules and regulations": ["K1.2.4.1: Demonstrate understanding of rules and regulations of school", "K2.2.4.1: Demonstrate understanding of rules and regulations for learners and teachers"]
  },
  "Values and Beliefs": {
    "Our Family Values": ["K1.3.1.1: Demonstrate understanding of good manners families value", "K2.3.1.1: Demonstrate understanding of personal value in relation to likes/dislikes"],
    "My Cultural Values": ["K1.3.2.1: Talk about important cultural values and good manners", "K2.3.2.1: Demonstrate understanding of virtues and behaviour patterns community values"],
    "Our religious values": ["K1.3.3.1: Demonstrate understanding of religious and moral values", "K2.3.3.1: Demonstrate understanding of values and virtues we need to exhibit"],
    "Our beliefs": ["K1.3.4.1: Demonstrate understanding of and relating well with people of different beliefs", "K2.3.4.1: Demonstrate understanding of relating well with people with different beliefs"]
  },
  "My Local Community": {
    "Knowing the special places in my community": ["K1.4.1.1: Demonstrate understanding of special places in our local communities", "K2.4.1.1: Demonstrate understanding of special places in our local community"],
    "Knowing the important people/occupation in my community": ["K1.4.2.1: Demonstrate knowledge of people in the community and their occupation", "K2.4.2.1: Demonstrate understanding of knowing important people/occupation"],
    "Knowing the special leaders in our community and country": ["K1.4.3.1: Demonstrate understanding of special leaders and their roles", "K2.4.3.1: Demonstrate understanding and knowledge of special leaders"]
  },
  "My Nation Ghana": {
    "History and celebration of Ghana's Independence": ["K1.5.1.1: Demonstrate knowledge of history and independence of Ghana", "K2.5.1.1: Demonstrate understanding of history and celebrations of Ghana"]
  },
  "All Around Us": {
    "Living and non-living things": ["K1.6.1.1: Demonstrate understanding of living and non-living things", "K2.6.1.1: Demonstrate understanding of why things are living/non-living"],
    "Living things: Animals (Domestic and wild)": ["K1.6.2.1: Demonstrate understanding of domestic and wild animals", "K2.6.2.1: Demonstrate understanding of domestic and wild animals"],
    "Water": ["K1.6.3.1: Demonstrate understanding of sources of water and its uses", "K2.6.3.1: Demonstrate understanding that water is an important natural resource"],
    "Air": ["K1.6.4.1: Demonstrate understanding of the presence of air and its importance", "K2.6.4.1: Demonstrate understanding that air is all around us"],
    "Plants": ["K1.6.5.1: Demonstrate understanding of parts of plants and their functions", "K2.6.6.1: Demonstrate understanding of how plants grow"],
    "Gardening": ["K1.6.7.1: Demonstrate understanding of types of soil", "K2.6.7.1: Demonstrate understanding of types of soil we find around us"],
    "Light - Day and Night": ["K1.6.8.1: Demonstrate understanding of sources of light for day and night", "K2.6.8.1: Demonstrate understanding of sources of light"],
    "Changing weather conditions": ["K1.6.9.1: Demonstrate understanding of changing weather conditions and seasons", "K2.6.9.1: Demonstrate understanding of positive and negative effects of weather"]
  },
  "God, His Creation and Attributes": {
    "God the Creator": ["B1.1.1.1: Explain who the Creator is", "B2.1.1.1: Demonstrate an appreciation of God's creation", "B3.1.1.1: Differentiate between God's creation and those made by man", "B4.1.1.1: Demonstrate an understanding of the attributes of God", "B5.1.1.1: Explain that God created human beings in His own image", "B6.1.1.1: Describe the nature of God through His attributes"],
    "The Environment": ["B2.1.2.1: Discuss our responsibilities towards the environment", "B3.1.2.1: Explain why we must care for the environment", "B4.1.2.1: Discuss the benefits of the environment", "B5.1.2.1: Describe ways to care for the environment", "B6.1.2.1: Discuss ways of protecting the environment"],
    "Purpose of God's Creation": ["B3.1.3.1: List some of the purposes for which God created things"],
    "God, His Nature and Attributes": ["B7.1.1.1: Explain the nature of God seen through His attributes"],
    "The Creation Stories": ["B8.1.1.1: Outline and explain moral lessons in creation stories"],
    "The Purpose and Usefulness of God's Creation": ["B9.1.1.1: Describe purpose of God's creation"]
  },
  "Religious Practices and their Moral Implications": {
    "Religious Worship in the Three Major Religions in Ghana": ["B1.2.1.1: Explain the meaning of worship", "B2.2.1.1: Recognise the things used in worship in the three major religions", "B4.2.1.1: Explain what constitutes worship in the three major religions", "B5.2.1.1: Mention types of prayer in the three major religions"],
    "Religious Festivals in the Three Major Religions in Ghana": ["B6.2.1.1: Mention the types and the importance of festivals"],
    "Worship": ["B7.2.1.1: Explain how worship is performed"],
    "Religious Songs and Recitations": ["B3.2.1.1: Recite his / her religious songs and prayers", "B7.2.2.1: Analyse moral values in songs"],
    "Rites of Passage": ["B8.2.1.1: Explain rites of passage"],
    "Religious Festivals": ["B9.2.1.1: Understand religious festivals"]
  },
  "Religious Leaders": {
    "Birth of the Leaders of the three Major Religions in Ghana": ["B2.3.1.1: State the names and the places of birth of the divine leaders"],
    "Early Life of the Leaders of the three Major Religions": ["B1.3.1.1: Reveal common stages in the lives of Leaders", "B3.3.1.1: Narrate the events that took place during the early lives of religious leaders"],
    "The Call of the Leaders of the Three Major Religions": ["B4.3.1.1: Narrate the early life and call of the leaders"],
    "Ministry and latter Lives of Leaders of the Three Major Religions in Ghana": ["B5.3.1.1: Describe the ministry and the latter lives of the leaders"]
  },
  "The Family and the Community": {
    "Roles and Relationships": ["B3.5.1.1: Discuss the roles of the individual in the family and in the community", "B6.5.1.1: Describe the roles of family members"],
    "Personal Safety in the Community": ["B1.4.1.1: Explain the Importance of keeping safety in the community"],
    "Family Systems": ["B7.3.1.1: Identify and explain importance of family systems"],
    "Religion and Social Cohesion": ["B9.3.1.1: Ways people can co-exist peacefully"]
  },
  "The Family, Authority and Obedience": {
    "Authority and Obedience": ["B1.5.1.1: Explain the need to obey authority", "B4.5.1.1: Examine the need for authority and obedience", "B5.5.1.1: Discuss the importance of being obedient to authority"],
    "Roles, Relationships in the Family and Character Formation": ["B2.5.1.1: Demonstrate how to relate with family members"]
  },
  "Religious Leaders and Personalities": {
    "Religious Leaders JHS": ["B7.4.1.1: Early life and call of religious leaders"],
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
  }
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

  // Ghanaian Language B1-B3 Indicators
  "B1.1.1.1: Demonstrate knowledge of a song by saying the words heard": ["B1.1.1.1.1: Sing familiar songs of more than six lines and recognise place names"],
  "B1.1.6.1: Demonstrate knowledge and understanding of greetings": ["B1.1.6.1.1: Recognise the various categories of people to greet", "B1.1.6.1.2: Discuss the correct terms for the various categories of people"],
  "B2.1.1.1: Demonstrate an understanding of types of work and play songs": ["B2.1.1.1.1: Sing work and play songs and discuss their importance", "B2.1.1.1.2: Relate types of play songs to everyday activities"],
  "B2.1.6.1: Exhibit knowledge of greeting and responding appropriately": ["B2.1.6.1.1: Discuss occasions to greet and talk about importance", "B2.1.6.1.2: Discuss greetings associated with different occasions"],
  "B3.1.2.1: Show an understanding of some rhymes": ["B3.1.2.1.1: Recognise rhyming words", "B3.1.2.1.2: Produce own rhyming words"],
  "B3.5.7.1: Exhibit knowledge of recognising and spelling words correctly": ["B3.5.7.1.1: Write four and five letter words correctly", "B3.5.7.1.2: Write five and six letter words correctly"],
  "B1.2.4.1: Show an understanding of connecting sounds to letters": ["B1.2.4.1.1: Blend sounds to produce syllables", "B1.2.4.1.2: Blend syllables to produce simple words"],
  "B2.2.4.1: Show an understanding of connecting sounds to letters": ["B2.2.4.1.1: Blend syllables to produce simple words", "B2.2.4.1.2: Use alphabetic knowledge to decode words"],
  "B3.2.4.1: Show an understanding of connecting sounds to letters": ["B3.2.4.1.1: Use alphabetic awareness to decode words", "B3.2.4.1.2: Use alphabetic awareness to decode compound words"],
  "B4.1.1.1: Exhibit knowledge of traditional and occupational songs": ["B4.1.1.1.1: Sing and discuss songs connected to traditional occupations"],
  "B5.1.1.1: Show an understanding of cradle songs/lullaby": ["B5.1.1.1.1: Sing cradle songs/lullaby with focus on importance"],
  "B6.1.1.1: Investigate some traditional dances and their songs": ["B6.1.1.1.1: Sing traditional songs used for traditional dances", "B6.1.1.1.2: Discuss importance and moral lessons of songs/dances"],
  "B4.3.1.1: Exhibit knowledge of the use of full stops, commas and question marks": ["B4.3.1.1.1: Recognise full stops at end of sentences", "B4.3.1.1.2: Recognise comma usage for pauses", "B4.3.1.1.3: Recognise question marks at end of questions"],
  "B5.3.1.1: Exhibit knowledge in the use of full stops, commas and question marks": ["B5.3.1.1.1: Recognise full stops for sentences/initials", "B5.3.1.1.3: Recognise colon usage for lists", "B5.3.1.1.4: Recognise quotation marks for speech"],
  "B6.3.1.1: Write sentences clearly and correctly": ["B6.3.1.1.1: Pay attention to ascending/descending letters", "B6.3.1.1.2: Write sentences using joint scripts"],

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
  "B1.1.1.1: Identify different materials in the environment": [
    "B1.1.1.1.1: Observe and name different materials in the classroom",
    "B1.1.1.1.2: Group materials based on their colour and size"
  ],
  "B2.1.1.1: Describe materials based on their physical properties": [
    "B2.1.1.1.1: Describe textures of different materials (rough, smooth)",
    "B2.1.1.1.2: Classify materials as hard or soft"
  ],
  "B3.1.1.1: Distinguish between various materials and their uses": [
    "B3.1.1.1.1: Identify materials used to make common objects",
    "B3.1.1.1.2: Discuss why certain materials are used for specific purposes"
  ],
  "B4.1.1.1: Classify solids, liquids and gases": [
    "B4.1.1.1.1: State physical properties of solids, liquids and gases",
    "B4.1.1.1.2: Group substances into the three states of matter"
  ],
  "B5.1.1.1: Investigate the properties of matter": [
    "B5.1.1.1.1: Demonstrate that matter has weight and occupies space",
    "B5.1.1.1.2: Research on the internal structure of matter (atoms and molecules)"
  ],
  "B6.1.1.1: Describe the changes of state of matter": [
    "B6.1.1.1.1: Explain the processes of melting and freezing",
    "B6.1.1.1.2: Demonstrate evaporation and condensation"
  ],
  "B1.1.2.1: Identify parts of the human body": [
    "B1.1.2.1.1: Mention names of external parts of the body",
    "B1.1.2.1.2: Point to specific body parts when named"
  ],
  "B2.1.2.1: Explain the functions of the sense organs": [
    "B2.1.2.1.1: Identify the five sense organs",
    "B2.1.2.1.2: Describe the function of each sense organ"
  ],
  "B3.1.2.1: Describe how we grow and change": [
    "B3.1.2.1.1: Compare physical features as one grows",
    "B3.1.2.1.2: Identify things that help us grow healthy"
  ],
  "B4.1.2.1: Explain the parts of a flowering plant": [
    "B4.1.2.1.1: Label the parts of a flowering plant",
    "B4.1.2.1.2: State the functions of the roots, stem and leaves"
  ],
  "B5.1.2.1: Describe the life cycle of a flowering plant": [
    "B5.1.2.1.1: Sequence the stages in the life cycle of a plant",
    "B5.1.2.1.2: Discuss the conditions necessary for germination"
  ],
  "B6.1.2.1: Explain the structure of the human heart": [
    "B6.1.2.1.1: Identify the main parts of the heart",
    "B6.1.2.1.2: Discuss the function of the heart in the body"
  ],
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
  "B1.2.1.1: Observe and group changes in weather": [
    "B1.2.1.1.1: Describe the daily weather (sunny, rainy, cloudy)",
    "B1.2.1.1.2: Discuss how weather affects what we wear"
  ],
  "B2.2.1.1: Identify the sun as the main source of light and heat": [
    "B2.2.1.1.1: Discuss the benefits of sunlight to plants and humans",
    "B2.2.1.1.2: Observe the shadows at different times of the day"
  ],
  "B3.2.1.1: Describe the movement of the earth": [
    "B3.2.1.1.1: Demonstrate day and night using a globe and torch",
    "B3.2.1.1.2: Explain why we have day and night"
  ],
  "B4.2.1.1: Identify the main sources of water in the community": [
    "B4.2.1.1.1: List sources like rivers, wells and rain",
    "B4.2.1.1.2: Discuss the uses of water in the community"
  ],
  "B5.2.1.1: Explain the stages of the water cycle": [
    "B5.2.1.1.1: Define evaporation and condensation",
    "B5.2.1.1.2: Illustrate the water cycle with a diagram"
  ],
  "B6.2.1.1: Discuss the importance of the atmosphere": [
    "B6.2.1.1.1: Identify the gases found in the air",
    "B6.2.1.1.2: Explain the importance of air to living things"
  ],
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
  "B1.3.1.1: Identify the external parts of the human body": [
    "B1.3.1.1.1: Point and name head, hands, legs and torso",
    "B1.3.1.1.2: State the functions of the hands and legs"
  ],
  "B2.3.1.1: Explain the functions of the five senses": [
    "B2.3.1.1.1: Name the five sense organs",
    "B2.3.1.1.2: Match each sense organ to its function"
  ],
  "B3.3.1.1: Describe the digestive system in humans (intro)": [
    "B3.3.1.1.1: Identify the mouth and stomach as parts of digestion",
    "B3.3.1.1.2: Discuss the importance of chewing food"
  ],
  "B4.3.1.1: Identify the parts of the respiratory system": [
    "B4.3.1.1.1: Name the nose, windpipe and lungs",
    "B4.3.1.1.2: Explain the process of breathing (inhaling and exhaling)"
  ],
  "B5.3.1.1: Explain how the human body system works together": [
    "B5.3.1.1.1: Discuss how different systems support each other",
    "B5.3.1.1.2: Identify things that keep the body systems healthy"
  ],
  "B6.3.1.1: Describe the nervous system functions": [
    "B6.3.1.1.1: Identify the brain and spinal cord",
    "B6.3.1.1.2: Discuss how the brain controls body actions"
  ],
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
  "B1.4.1.1: Identify different sources of light and heat in the home": [
    "B1.4.1.1.1: Identify sources of light (sun, bulb, candle)",
    "B1.4.1.1.2: Identify sources of heat (sun, coal pot, stove)"
  ],
  "B2.4.1.1: Demonstrate how light travels": [
    "B2.4.1.1.1: Show that light travels in a straight line using simple objects",
    "B2.4.1.1.2: Discuss the importance of light for seeing"
  ],
  "B3.4.1.1: Identify simple sources of energy": [
    "B3.4.1.1.1: Identify food as a source of energy for humans",
    "B3.4.1.1.2: Mention other simple sources like batteries and sun"
  ],
  "B4.4.1.1: Identify renewable and non-renewable energy sources": [
    "B4.4.1.1.1: Define renewable and non-renewable energy",
    "B4.4.1.1.2: Give examples of each type of energy source"
  ],
  "B5.4.1.1: Demonstrate the conversion of energy": [
    "B5.4.1.1.1: Explain the conversion of electrical energy to light and heat",
    "B5.4.1.1.2: Show conversion of chemical energy to kinetic energy"
  ],
  "B6.4.1.1: Explain the conservation of energy": [
    "B6.4.1.1.1: State the law of conservation of energy",
    "B6.4.1.1.2: Identify ways to prevent energy wastage"
  ],
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
  "B1.5.1.1: Identify different types of waste in the home and school": [
    "B1.5.1.1.1: List examples of solid waste (paper, plastic)",
    "B1.5.1.1.2: Identify liquid waste like soapy water"
  ],
  "B2.5.1.1: Describe ways of managing waste in the school": [
    "B2.5.1.1.1: Discuss the importance of putting waste in dustbins",
    "B2.5.1.1.2: Identify things that can be reused"
  ],
  "B3.5.1.1: Explain the importance of keeping the environment clean": [
    "B3.5.1.1.1: Discuss the effects of dirty environment on health",
    "B3.5.1.1.2: Demonstrate how to clean the school yard"
  ],
  "B4.5.1.1: Identify ways of disposing of liquid waste": [
    "B4.5.1.1.1: Describe safe ways of pouring away dirty water",
    "B4.5.1.1.2: Discuss the dangers of stagnant water"
  ],
  "B5.5.1.1: Explain the concept of the 3Rs (Reduce, Reuse, Recycle)": [
    "B5.5.1.1.1: Define Reduce, Reuse and Recycle",
    "B5.5.1.1.2: Identify materials that can be recycled"
  ],
  "B6.5.1.1: Demonstrate how to prepare compost from organic waste": [
    "B6.5.1.1.1: Identify materials suitable for composting",
    "B6.5.1.1.2: Explain the stages of making compost"
  ],
  "B1.5.2.1: Identify common diseases in the community": [
    "B1.5.2.1.1: Name common ailments like cold and stomach ache",
    "B1.5.2.1.2: Discuss how people get sick"
  ],
  "B2.5.2.1: Discuss how to prevent common diseases like malaria": [
    "B2.5.2.1.1: Identify the mosquito as the cause of malaria",
    "B2.5.2.1.2: Suggest ways to avoid mosquito bites"
  ],
  "B3.5.2.1: Explain the importance of personal hygiene": [
    "B3.5.2.1.1: Discuss why we wash our hands with soap",
    "B3.5.2.1.2: Demonstrate correct hand washing steps"
  ],
  "B4.5.2.1: Identify common skin diseases and their prevention": [
    "B4.5.2.1.1: Name skin problems like rashes and ringworm",
    "B4.5.2.1.2: Discuss how to keep the skin healthy"
  ],
  "B5.5.2.1: Discuss the importance of immunization": [
    "B5.5.2.1.1: Explain what vaccines are and how they help",
    "B5.5.2.1.2: Mention some diseases that can be prevented by vaccines"
  ],
  "B6.5.2.1: Explain the causes and effects of waterborne diseases": [
    "B6.5.2.1.1: Identify cholera and typhoid as waterborne diseases",
    "B6.5.2.1.2: Discuss how to treat water to make it safe for drinking"
  ],
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
  
  // KG Integrated Curriculum Indicators
  // Theme 1: All About Me - KG 1
  "K1.1.1.1: Demonstrate understanding that all learners are wonderful and have unique body features": [
    "K1.1.1.1.1: Identify and talk in simple sentences, about the features of our body that make us unique",
    "K1.1.1.1.2: Sing an action song that helps learners name the parts of the body and point to them",
    "K1.1.1.1.3: Recognize and talk about the different parts of book",
    "K1.1.1.1.4: Use new and positive expressions/vocabulary related to the parts of the body"
  ],
  "K1.1.2.1: Demonstrate understanding of appropriate names of parts of the body and their functions": [
    "K1.1.2.1.1: Identify and name parts of the human body and state their functions",
    "K1.1.2.1.2: Identify and talk about the special parts of the body (the five senses) and what they do"
  ],
  "K1.1.3.1: Demonstrate understanding of the importance of personal hygiene": [
    "K1.1.3.1.1: Identify and talk about how to keep our bodies clean (Personal Hygiene)",
    "K1.1.3.1.2: Demonstrate the correct way of washing hands with soap under running water"
  ],

  // Theme 1: All About Me - KG 2
  "K2.1.1.1: Demonstrate understanding that all learners are wonderful and unique": [
    "K2.1.1.1.1: Identify and describe in simple sentences (using home language), the wonderful features of our body that make us special and unique",
    "K2.1.1.1.2: Recognize and describe the different parts of book",
    "K2.1.1.1.3: Use positive words learnt from the Shared reading related to parts of the body"
  ],
  "K2.1.2.1: Demonstrate knowledge of appropriate names of parts of internal body and their functions": [
    "K2.1.2.1.1: Name parts of the human body and state their functions (including heart, stomach etc)",
    "K2.1.2.1.2: Identify and talk about the special parts of the body (the five senses) and state their functions"
  ],
  
  // Theme 2: My Family - KG 1
  "K1.2.1.1: Demonstrate understanding of importance, roles and responsibilities of family members": [
    "K1.2.1.1.1: Identify and talk about members of their families using simple sentences",
    "K1.2.1.1.2: Recite a rhyme/sing a song about the family and talk about the roles of members"
  ],
  // Math B1-B3
  "B1.1.1.1: Describe numbers 0 to 100": ["B1.1.1.1.1: Count by 1s, 2s and 10s forward and backward between 0 and 100", "B1.1.1.1.4: Represent number of objects with written numerals 0-100"],
  "B2.1.1.1.4: Understanding place value to 100": ["B2.1.1.1.4.1: Explain the meaning of each digit in a 2-digit number using bundles of 10s"],
  "B3.1.2.5: Multiplication up to 5x5": ["B3.1.2.5.1: Represent and explain multiplication using equal groupings", "B3.1.2.5.2: Represent and explain multiplication using rectangular arrays"],
  "B1.3.1.1: Attributes of 2D and 3D shapes": ["B1.3.1.1.1: Distinguish between attributes that define a shape and attributes that do not"],
  "B3.3.3.1: Metres and centimetres": ["B3.3.3.1.1: Model and describe the relationship between metre and centimetre (100cm = 1m)"],
  // Mathematics B4
  "B4.1.1.1: Multi-digit whole numerals to 100,000": ["B4.1.1.1.1: Model number quantities, place value for multi-digit using graph sheets up to 100,000", "B4.1.1.1.2: Read and write numbers in figures and in words up to 100,000"],
  "B4.1.1.2: Roman numerals up to XXX (30)": ["B4.1.1.2.1: Develop an understanding of Roman Numeral system up to XXX (30)"],
  "B4.1.1.3: Factors, multiples and squared numbers": ["B4.1.1.3.1: Determine set of factors of a given number up to 50", "B4.1.1.3.2: Determine the highest common factor (HCF) of any two whole numbers between 1 and 50"],
  "B4.1.3.1: Equivalent and improper fractions": ["B4.1.3.1.1: Generate unit fractions and locate a unit fraction on a number line", "B4.1.3.1.4: Recognise fractions that are greater than one (improper fractions)"],
  "B4.3.3.1: Perimeter and Area concept": ["B4.3.3.1.2: Measure and record perimeter for regular and irregular shapes in cm and m", "B4.3.3.2.1: Recognise that area is measured in square units"],
  "B4.4.1.1: Many-to-one correspondence": ["B4.4.1.1.2: Use an understanding of many-to-one correspondence to display or construct graphs"],

  // Mathematics B5
  "B5.1.1.1: Multi-digit numerals up to 1,000,000": ["B5.1.1.1.1: Model number quantities up to 1,000,000 using graph sheets and multi-base block"],
  "B5.1.2.4: Divide 3-digit numbers by 1-digit number efficiently": ["B5.1.2.4.1: Divide 3-digit numbers by 1-digit number efficiently using long division"],
  "B5.1.4.1: Decimals (tenths and hundredths)": ["B5.1.4.1.1: Describe and represent decimals (up to the thousandths) concretely, pictorially, and symbolically"],
  "B5.3.3.3: Understanding angles": ["B5.3.3.3.2: Measure given angles with a protractor and classify them (right, acute, obtuse)"],
  "B5.4.1.1: First-hand and second-hand data": ["B5.4.1.1.1: Explain the difference between first-hand and second-hand data"],

  // Mathematics B6
  "B6.1.1.1: Multi-digit numerals up to 1 billion": ["B6.1.1.1.1: Model number quantities up to 1,000,000,000 using graph sheets and multi-base block"],
  "B6.1.3.1: Comparing mixture of common, dec and percent": ["B6.1.3.1.2: Add and subtract unlike and mixed fractions"],
  "B6.1.4.1: Concept of ratios": ["B6.1.4.1.1: Use concrete models and pictorial representations to explain a ratio as a concept"],
  "B6.3.3.5: Advanced cardinal points (NE, NW...)": ["B6.3.3.5.1: Tell the position and motion of objects in space using 8 cardinal points"],
  "B6.4.2.2: Theoretical and experimental probability": ["B6.4.2.2.1: List the possible outcomes and determine theoretical probability for an experiment"],

  // Our World Our People B1-B3
  "B1.1.1.1: Nature of God": ["B1.1.1.1.1: Examine our relationship with the Creator"],
  "B3.1.1.1: Purpose of God's creation": ["B3.1.1.1.1: Examine the purpose of God's creation of human beings"],
  "B1.2.1.1: Environment and Weather": ["B1.2.1.1.1: Explore the uses of things in the environment"],
  "B2.2.2.1: Plants and Animals": ["B2.2.2.1.1: Explore the important plants in the community", "B2.2.2.1.2: Explore the important animals in the community"],
  "B3.2.1.1: Use of land and water": ["B3.2.1.1.1: Explain problems with the use of land and water"],
  "B3.3.3.1: Basic Human Rights": ["B3.3.3.1.1: Describe ways of claiming one's rights"],
  "B1.5.1.1: Our Neighbouring Countries": ["B1.5.1.1.1: Mention Ghana's Neighbours"],

  // Our World Our People B4-B6
  "B4.1.1.1: Uniqueness of human creation": ["B4.1.1.1.1: Explain how special each individual is in relation to others"],
  "B4.2.1.1: Environmental safety": ["B4.2.1.1.1: Explain ways of making the environment safe (sanitation, tree planting)"],
  "B5.1.2.1: Changes during adolescence": ["B5.1.2.1.1: Describe physical and emotional changes that occur during adolescence"],
  "B5.4.2.2: Democratic governance": ["B5.4.2.2.1: Explain and appreciate the importance of democratic governance in school"],
  "B6.1.2.2: Personal hygiene during adolescence": ["B6.1.2.2.1: Explain how to maintain personal hygiene during adolescence"],
  "B6.4.6.1: Job opportunities in agriculture": ["B6.4.6.1.1: Describe the agricultural value chain and the job opportunities within it"],
  "B4.3.2.1: Significance of Ghanaian festivals": ["B4.3.2.1.1: Identify and describe celebrations and positive traditions"],
  "B5.2.1.1: Greenhouse effect and climate change": ["B5.2.1.1.1: Record human activities that cause concentration of greenhouse gases"],
  "B6.2.3.1: Map of Ghana (Regions/Capitals)": ["B6.2.3.1.1: Identify the political regions and capitals on a map of Ghana"],
  "B6.5.1.2: Effects of climate change": ["B6.5.1.2.1: Investigate the effects of climate change on the environment"],

  // Physical Education
  "B1.1.1.1: Travel over/under objects": ["B1.1.1.1.1: Travel over, under, in front of and behind objects"],
  "B2.1.1.1: Travel in zigzag pathways": ["B2.1.1.1.1: Move in straight, curved and zigzag pathways"],
  "B3.1.10.1: Dribbling around obstacles": ["B3.1.10.1.13: Hand-dribble a ball continuously while moving around obstacles"],
  "B4.1.6.1: Strike a bounce ball": ["B4.1.6.1.6: Strike a bounce ball with the hands and feet"],
  "B5.3.1.3: 10-min jogging": ["B5.3.1.3.1: Perform 10 minutes jogging with music"],
  "B6.4.1.4: Physical fitness plan": ["B6.4.1.4.1: Develop a one-day personal physical fitness plan"],

  // RME B1-B6
  "B1.1.1.1: Explain who the Creator is": ["B1.1.1.1.1: Explore God's Creation", "B1.1.1.1.2: Mention names of things God created", "B1.1.1.1.3: Examine some attributes of God"],
  "B2.1.1.1: Demonstrate an appreciation of God's creation": ["B2.1.1.1.1: Demonstrate appreciation of God's creation", "B2.1.1.1.2: Show care for God's creation"],
  "B3.1.1.1: Differentiate between God's creation and those made by man": ["B3.1.1.1.1: Differentiate between natural and man-made things"],
  "B4.1.1.1: Demonstrate an understanding of the attributes of God": ["B4.1.1.1.1: Demonstrate understanding of attributes of God"],
  "B5.1.1.1: Explain that God created human beings in His own image": ["B5.1.1.1.1: Explain man created in God's image"],
  "B6.1.1.1: Describe the nature of God through His attributes": ["B6.1.1.1.1: Describe nature of God through attributes"],
  "B2.1.2.1: Discuss our responsibilities towards the environment": ["B2.1.2.1.1: Discuss roles in caring for the environment", "B2.1.2.1.2: Identify types of things in the environment"],
  "B3.1.2.1: Explain why we must care for the environment": ["B3.1.2.1.1: Explain why we must care for the environment"],
  "B4.1.2.1: Discuss the benefits of the environment": ["B4.1.2.1.1: Discuss benefits of the environment"],
  "B5.1.2.1: Describe ways to care for the environment": ["B5.1.2.1.1: Describe ways to care for the environment"],
  "B6.1.2.1: Discuss ways of protecting the environment": ["B6.1.2.1.1: Discuss ways of protecting environment"],
  "B3.1.3.1: List some of the purposes for which God created things": ["B3.1.3.1.1: List purposes of God's creation"],
  "B1.2.1.1: Explain the meaning of worship": ["B1.2.1.1.1: Explain the meaning of worship", "B1.2.1.1.2: State the importance of worship"],
  "B2.2.1.1: Recognise the things used in worship in the three major religions": ["B2.2.1.1.1: Recognise things used in worship"],
  "B4.2.1.1: Explain what constitutes worship in the three major religions": ["B4.2.1.1.1: Explain what constitutes worship"],
  "B5.2.1.1: Mention types of prayer in the three major religions": ["B5.2.1.1.1: Mention types of prayer"],
  "B6.2.1.1: Mention the types and the importance of festivals": ["B6.2.1.1.1: Mention types and importance of festivals"],
  "B3.2.1.1: Recite his / her religious songs and prayers": ["B3.2.1.1.1: Recite his/her religious songs and prayers"],
  "B2.3.1.1: State the names and the places of birth of the divine leaders": ["B2.3.1.1.1: State names and places of birth of divine leaders"],
  "B1.3.1.1: Reveal common stages in the lives of Leaders": ["B1.3.1.1.1: Reveal common stages in the lives of religious leaders"],
  "B3.3.1.1: Narrate the events that took place during the early lives of religious leaders": ["B3.3.1.1.1: Narrate events from early lives of leaders"],
  "B4.3.1.1: Narrate the early life and call of the leaders": ["B4.3.1.1.1: Narrate early life and call of leaders"],
  "B5.3.1.1: Describe the ministry and the latter lives of the leaders": ["B5.3.1.1.1: Describe ministry and latter lives of leaders"],
  "B3.5.1.1: Discuss the roles of the individual in the family and in the community": ["B3.5.1.1.1: Discuss roles of individuals in family and community"],
  "B6.5.1.1: Describe the roles of family members": ["B6.5.1.1.1: Describe roles of family members"],
  "B1.4.1.1: Explain the Importance of keeping safety in the community": ["B1.4.1.1.1: Explain importance of safety in the community"],
  "B1.5.1.1: Explain the need to obey authority": ["B1.5.1.1.1: Explain the need to obey authority"],
  "B4.5.1.1: Examine the need for authority and obedience": ["B4.5.1.1.1: Examine need for authority and obedience"],
  "B5.5.1.1: Discuss the importance of being obedient to authority": ["B5.5.1.1.1: Discuss importance of obedience"],
  "B2.5.1.1: Demonstrate how to relate with family members": ["B2.5.1.1.1: Demonstrate how to relate with family members"],
};

export const PE_LESSON_FRAMES: Record<string, any> = {
  "B1.1.1.1.1": {
    topic: "Moving Over and Under Obstacles",
    keyWords: ["Over", "Under", "Obstacles", "Locomotor"],
    activities: [
      "Set up cones and bars as hurdles",
      "Teacher demonstrates crawling 'under' and jumping 'over'",
      "Learner practice at their own pace in a circuit",
      "Game: 'Bridge and River' - some learners act as bridges (under) and some as stones (over)"
    ],
    resources: ["Cones", "Poles/Hurdles", "Mats"]
  },
  "B3.1.10.1.13": {
    topic: "Hand Dribbling with Agility",
    keyWords: ["Dribbling", "Control", "Hand-eye Coordination"],
    activities: [
      "Practice bouncing the ball stationary first",
      "Dribble through a line of 5 cones using one hand",
      "Change hands (left/right) at each cone",
      "Relay race: Dribbling around obstacles back to the team"
    ],
    resources: ["Handballs/Basketballs", "Skittles/Cones"]
  },
  "B5.3.1.3.1": {
    topic: "Aerobic Capacity: Jogging to Rhythm",
    keyWords: ["Jogging", "Pulse", "Endurance", "Rhythm"],
    activities: [
      "Choose a local upbeat song",
      "Learners jog in a circle following the tempo of the music",
      "Monitor breathing and encourage steady pace for 10 minutes",
      "Group stretch and cool down after the music stops"
    ],
    resources: ["Bluetooth speaker", "Local music playlists", "Stopwatch"]
  }
};

export const OWOP_B4_B6_LESSON_FRAMES: Record<string, any> = {
  "B4.1.1.1.1": {
    topic: "The Uniqueness of Mankind",
    keyWords: ["Unique", "Aspirations", "Talent", "Special"],
    activities: [
      "Learners identify ways they are different from classmates (height, mass, skills)",
      "Role-play: Demonstrate a gift/talent they have that others may not",
      "Draft a poster titled 'I am Special' listing their unique qualities"
    ],
    resources: ["Mirror", "Paper/Markers", "Success stories of Ghanaians"]
  },
  "B5.1.2.1.1": {
    topic: "Adolescent Changes",
    keyWords: ["Adolescence", "Puberty", "Physical", "Emotional"],
    activities: [
      "Group discussion (boys/girls separate then together) on body changes",
      "Teacher explains hormones and emotional shifts (shyness, excitement)",
      "Match-the-change game: Primary cards with adolescent outcomes"
    ],
    resources: ["Body change charts", "Guest health worker", "Video clips"]
  },
  "B5.4.2.2.1": {
    topic: "Introduction to Democracy",
    keyWords: ["Democracy", "Election", "Accountability", "Leadership"],
    activities: [
      "Organize a mock class election for a project leader",
      "Discuss the features of democracy: transparency, voting, majority rule",
      "Watch a video of a Ghanaian parliamentary session"
    ],
    resources: ["Ballot box", "Ghanaian Constitution (simplified)", "News clips"]
  },
  "B6.4.6.1.1": {
    topic: "Agribusiness and Job Opportunities",
    keyWords: ["Value Chain", "Processing", "Logistics", "Revenue"],
    activities: [
      "Draw a flow-map from Cocoa Farm to Chocolate Bar",
      "List jobs at each stage: Farmer, Driver, Factory worker, Marketer",
      "Debate: 'Is farming better than white-collar jobs?'"
    ],
    resources: ["Career brochures", "Food samples", "Local farmer interview"]
  },
  "B4.3.2.1.1": {
    topic: "Ghanaian Festivals and Heritage",
    keyWords: ["Aboakyer", "Homowo", "Eid", "Heritage"],
    activities: [
      "Identify festivals celebrated in the local community",
      "Role-play the arrival of chiefs at a durbar",
      "Write a short essay on why festivals are important for unity"
    ],
    resources: ["Festival pictures", "Traditional items (kente, beads)", "Videos"]
  },
  "B5.2.1.1.1": {
    topic: "Greenhouse Gases and Human Activity",
    keyWords: ["Greenhouse", "Carbon Dioxide", "Emission", "Global Warming"],
    activities: [
      "Brainstorm human activities that produce smoke (vehicles, bush burning)",
      "Diagram: How greenhouse gases trap heat in the atmosphere",
      "Survey: Group walk to find signs of smoke emission in the community"
    ],
    resources: ["Diagrams", "Local environment", "Fact sheets"]
  },
  "B6.2.3.1.1": {
    topic: "Political Regions of Ghana",
    keyWords: ["Regions", "Capitals", "Administrative", "Boundary"],
    activities: [
      "Locate the 16 regions on a political map of Ghana",
      "Memory game: Matching regions to their administrative capitals",
      "Colouring project: Shading regions correctly on a blank map"
    ],
    resources: ["Blank maps", "Wall map of Ghana", "Puzzle games"]
  }
};

export const MATH_B1_B3_LESSON_FRAMES: Record<string, any> = {
  "B1.1.1.1.1": {
    topic: "Counting in 1s, 2s and 10s",
    keyWords: ["Counting", "Forward", "Backward", "Sequence"],
    activities: [
      "Learners count sticks or stones in 1s up to 50",
      "Game: 'Skip and Jump' - counting in 2s while jumping in the yard",
      "Use bundles of 10 to practice counting in tens",
      "Identify missing numbers in a sequence on the board"
    ],
    resources: ["Stones", "Bundles of sticks", "100-number chart"]
  },
  "B2.1.1.1.4.1": {
    topic: "Place Value: Tens and Ones",
    keyWords: ["Tens", "Ones", "Digit", "Value"],
    activities: [
      "Use base-ten blocks (flats and units) to represent numbers like 42",
      "Decompose numbers: 57 = 5 tens and 2 ones",
      "Interactive: Learners move units to the 'Tens' house when they reach 10",
      "Writing numbers in expanded form: 40 + 8 = 48"
    ],
    resources: ["Base-ten blocks", "Place value mats", "Number cards"]
  },
  "B3.1.2.5.1": {
    topic: "Intro to Multiplication: Equal Groups",
    keyWords: ["Groups", "Multiplier", "Product", "Total"],
    activities: [
      "Arrange 12 bottle caps into 3 groups of 4",
      "Link grouping to addition: 4 + 4 + 4 = 12",
      "Learner drawing: 'Draw 5 trees with 2 mangoes on each'",
      "Introduce the 'x' symbol as shorthand for 'groups of'"
    ],
    resources: ["Bottle caps", "Drawing sheets", "Multiplication chart"]
  }
};

export const MATH_B4_B6_LESSON_FRAMES: Record<string, any> = {
  "B4.1.1.2.1": {
    topic: "Introduction to Roman Numerals (1-30)",
    keyWords: ["Roman Numerals", "I, V, X", "Symbols", "Conversion"],
    activities: [
      "Show a clock with Roman Numerals and discuss the symbols",
      "Teacher demonstrates symbols: I=1, V=5, X=10",
      "Game: Call out a number and learners form the Roman symbol with their fingers or sticks",
      "Match word cards of Hindu-Arabic numbers to Roman cards"
    ],
    resources: ["Roman Numeral chart", "Matches/Sticks", "Clock face"]
  },
  "B4.1.2.5.1": {
    topic: "Division as Repeated Subtraction",
    keyWords: ["Division", "Subtraction", "Quotient", "Efficient"],
    activities: [
      "Use 25 straws and take groups of 5 away until none are left",
      "Model the long division frame on the board",
      "Practice dividing 2-digit numbers by 1-digit (e.g., 48 ÷ 4)",
      "Peer teaching: One learner explains the 'Big 7' method to another"
    ],
    resources: ["Straws", "Division frames", "Worksheets"]
  },
  "B5.3.3.3.2": {
    topic: "Measuring Angles with a Protractor",
    keyWords: ["Protractor", "Degrees", "Acute", "Obtuse", "Right Angle"],
    activities: [
      "Demonstrate how to align the midpoint of the protractor with the vertex",
      "Learners draw various 'V' shapes and measure the opening in degrees",
      "Sort measured angles into Acute (< 90), Obtuse (> 90), and Right (90)",
      "Treasure Hunt: Find angles in the classroom (e.g., door hinge) and measure them"
    ],
    resources: ["Protractors", "Rulers", "Angle charts"]
  },
  "B6.1.3.1.2": {
    topic: "Adding Mixed Fractions",
    keyWords: ["Mixed Fractions", "Improper", "LCD", "Denominator"],
    activities: [
      "Use folded paper circles to show 1 1/2 + 2 1/2",
      "Convert mixed fractions to improper fractions (2 1/3 = 7/3)",
      "Find the Lowest Common Denominator (LCD) for unlike fractions",
      "Solve real-life problems: 'Add 2 1/2 bags of cement to 1 1/4 bags'"
    ],
    resources: ["Fraction circles", "Grid paper", "Fraction wall"]
  },
  "B6.1.4.1.1": {
    topic: "Understanding Ratios",
    keyWords: ["Ratio", "Comparison", "Proportion", "Simplest Form"],
    activities: [
      "Compare quantities of items: 4 red pens to 2 blue pens (4:2)",
      "Simplify ratios by dividing by HCF (4:2 = 2:1)",
      "Model with area: 'Shape A is 1/4 the size of Shape B'",
      "Recipe scaling: '3 cups of water to 1 cup of rice'"
    ],
    resources: ["Pens/Stones", "Measuring cups", "Area blocks"]
  }
};

export const OWOP_B1_B3_LESSON_FRAMES: Record<string, any> = {
  "B1.1.1.1.1": {
    topic: "Our Relationship with the Creator",
    keyWords: ["God", "Creator", "Creation", "Faith"],
    activities: [
      "Learners talk about God's creation using pictures and real things from the environment",
      "Retell the creation story through role-play",
      "Draw and colour animals, trees, and stars as part of God's creation"
    ],
    resources: ["Pictures", "Drawing sheets", "Environment"]
  },
  "B2.2.2.1.1": {
    topic: "Important Plants in our Community",
    keyWords: ["Plants", "Crops", "Cocoa", "Food"],
    activities: [
      "Nature walk to observe and talk about different plants in the environment",
      "Identify uses of plants (food, medicine, shade)",
      "Draw and label a plant found in the community"
    ],
    resources: ["Garden", "Plant samples", "Crayons"]
  },
  "B3.2.1.1.1": {
    topic: "Problems with Use of Land and Water",
    keyWords: ["Pollution", "Degradation", "Land", "Water"],
    activities: [
      "Discuss activities like Galamsey and bush burning through pictures",
      "Trip to observe a local water body (if safe)",
      "Brainstorm ways to protect our land and water sources"
    ],
    resources: ["Videos/Photos of illegal mining", "Local environment"]
  }
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

export const GHANAIAN_LANGUAGE_B1_B3_LESSON_FRAMES: Record<string, any> = {
  "B1.1.1.1": {
    topic: "Songs: Singing Familiar Songs and Recognising Place Names",
    keyWords: ["Akom", "Fontomfrom", "Language", "Melody", "Place names"],
    activities: [
      "Use a recorder to play some popular songs in the community",
      "Ask learners to sing popular songs and dance with gestures",
      "Lead learners to mention names of people and animals heard in the songs",
      "Discuss the meaning of the songs with learners"
    ],
    resources: ["Audio recorder", "Musical instruments", "Song books", "Flashcards"]
  },
  "B1.1.6.1": {
    topic: "Conversation: Greetings and Appropriate Address Terms",
    keyWords: ["Anopa Akye", "Maakye", "Elders", "Peers", "Respect"],
    activities: [
      "Discuss different categories of people in the community (elders, peers, etc.)",
      "Demonstrate appropriate greetings for each category using correct terms",
      "Role-play greetings in various settings (morning at home, arriving at school)",
      "Practice using address terms like 'Papa', 'Maame', 'Nana'"
    ],
    resources: ["Role-play cards", "Pictures of community members", "Videos of social greetings"]
  },
  "B2.1.1.1": {
    topic: "Work and Play Songs",
    keyWords: ["Occupations", "Fatigue", "Unity", "Rhythm", "Boredom"],
    activities: [
      "Revise traditional occupations and their associated work songs (fishing, farming)",
      "Teach a new play song and demonstrate how the accompanying game is performed",
      "Discuss the importance of work songs in reducing fatigue and improving productivity",
      "Perform a moonlight play in groups while singing"
    ],
    resources: ["Pictures of people at work", "Playground equipment", "Drums/Percussion"]
  },
  "B3.1.2.1": {
    topic: "Rhymes: Recognising and Producing Rhyming Words",
    keyWords: ["Rhyme", "Sound patterns", "Couplet", "Poetry", "Verse"],
    activities: [
      "Read aloud a familiar rhyme and let learners identify words that sound the same",
      "Model how to write a simple two-line rhyme",
      "Encourage learners to produce their own rhyming words for given objects",
      "Play a 'Rhyme Chain' game where each learner adds a word that rhymes with the previous one"
    ],
    resources: ["Rhyme books", "Word cards", "Chart with rhyming words"]
  },
  "B3.5.7.1": {
    topic: "Spelling: Four, Five, and Six Letter Words",
    keyWords: ["Spelling", "Consonant", "Vowel", "Syllable", "Accuracy"],
    activities: [
      "Practice spelling four and five letter words using flashcards",
      "Engage in a spelling bee competition among groups",
      "Write lists of six-letter words related to common objects in the environment",
      "Use target words in simple sentences to demonstrate meaning"
    ],
    resources: ["Letter cards", "Sand trays", "Chalkboard", "Exercise books"]
  },
  "B4.1.1.1": {
    topic: "Traditional and Occupational Songs",
    keyWords: ["Occupations", "Lyrics", "Melody", "Rhythm", "Context"],
    activities: [
      "Sing a familiar traditional song with the class",
      "Watch a video of a traditional song being performed",
      "Discuss the lyrics and the specific occupation it relates to",
      "Identify the importance of these songs in the workplace"
    ],
    resources: ["Video of traditional dance", "Audio recorder", "Song texts"]
  },
  "B4.3.1.1": {
    topic: "Punctuation: Full Stops, Commas and Question Marks",
    keyWords: ["Punctuation", "Sentence structure", "Pause", "Clarity", "Tone"],
    activities: [
      "Identify punctuation marks in a given paragraph",
      "Practice placing full stops at the end of complete thoughts",
      "Use commas to separate items in a list",
      "Convert statements into questions using appropriate marks"
    ],
    resources: ["Punctuation charts", "Worksheets", "Flashcards"]
  },
  "B5.1.1.1": {
    topic: "Cradle Songs and Lullabies",
    keyWords: ["Lullaby", "Cradle", "Soothing", "Role-play", "Rhythm"],
    activities: [
      "Listen to recordings of traditional lullabies",
      "Discuss the soothing nature and purpose of cradle songs",
      "Role-play a mother or caretaker singing to a child",
      "Analyze the lyrics for common themes of love and protection"
    ],
    resources: ["Audio recordings of lullabies", "Dolls for role-play", "Lyrics sheets"]
  },
  "B6.1.1.1": {
    topic: "Investigating Traditional Dances and Songs",
    keyWords: ["Traditional dance", "Investigation", "Heritage", "Performance", "Rhythm"],
    activities: [
      "Research a specific traditional dance from a chosen region in Ghana",
      "Perform the corresponding songs using the correct rhythms",
      "Demonstrate basic dance steps associated with the songs",
      "Discuss the cultural significance and history of the dance"
    ],
    resources: ["Drums", "Traditional costumes (props)", "Videos of cultural festivals"]
  },
  "B6.3.1.1": {
    topic: "Writing Sentences: Joint Scripts and Capitalisation",
    keyWords: ["Handwriting", "Joint script", "Capitalisation", "Legibility", "Fluency"],
    activities: [
      "Practice writing sentences using joint/cursive handwriting",
      "Focus on the correct formation of ascending and descending letters",
      "Apply rules of capitalisation for proper nouns and sentence beginnings",
      "Peer-review writing for legibility and accuracy"
    ],
    resources: ["Joint script templates", "Writing guides", "Specially ruled exercise books"]
  }
};

export const KG_INTEGRATED_LESSON_FRAMES: Record<string, any> = {
  "K1.1.1.1": {
    topic: "I am a wonderful and unique creation",
    keyWords: ["Unique", "Wonderful", "Body parts", "Special"],
    activities: [
      "Guide learners to look at each other and talk about their unique features (height, skin colour, etc.)",
      "Sing action songs about parts of the body",
      "Learners draw and colour a picture of themselves",
      "Identify parts of a book (front, back, spine)"
    ],
    resources: ["Mirror", "Crayons", "Charts of body parts", "Big Books"]
  },
  "K2.1.1.1": {
    topic: "I am a wonderful and unique creation (Review and Extend)",
    keyWords: ["Unique", "Special", "Features", "Confidence"],
    activities: [
      "Think-Pair-Share: Talk about what makes each member of the pair special",
      "Draw and label simple parts of the body",
      "Shared reading of a story about a unique child",
      "Practice using positive words to describe oneself"
    ],
    resources: ["Story books", "Drawing sheets", "Word cards", "Mirror"]
  },
  "K1.2.1.1": {
    topic: "My Family Members and Roles",
    keyWords: ["Father", "Mother", "Siblings", "Love", "Roles"],
    activities: [
      "Mention names of family members",
      "Role-play family activities (cooking, cleaning, etc.)",
      "Sing songs about the family",
      "Discuss the importance of helping at home"
    ],
    resources: ["Family pictures", "Dolls", "Role-play props"]
  }
};

export const RME_LESSON_FRAMES: Record<string, any> = {
  "B1.1.1.1.1": {
    topic: "Exploring God's Creation",
    keyWords: ["Creation", "Environment", "Living things", "Non-living things"],
    activities: [
      "Go on a nature walk around the school compound",
      "Identify and mention names of things seen (trees, birds, stones)",
      "Draw one thing that God has created",
      "Sing songs that praise God for His creation"
    ],
    resources: ["Nature", "Drawing books", "Pencils", "Crayons"]
  },
  "B2.1.2.1.1": {
    topic: "Caring for the Environment",
    keyWords: ["Stewardship", "Responsibility", "Sanitation", "Hygiene"],
    activities: [
      "Discuss why we need to keep our surroundings clean",
      "Demonstrate proper waste disposal techniques",
      "Participate in a clean-up exercise in the classroom",
      "Create posters about protecting the environment"
    ],
    resources: ["Brooms", "Dustbins", "Poster sheets", "Markers"]
  },
  "B3.1.3.1.1": {
    topic: "Purpose of God's Creation",
    keyWords: ["Purpose", "Utility", "Benefits", "Environment"],
    activities: [
      "Identify various things God created in the community",
      "Discuss the uses of some specific things (e.g., water for drinking, trees for shade)",
      "Draw something God created and write one use for it",
      "Role-play how humans benefit from God's creation"
    ],
    resources: ["Pictures of creation", "Worksheets", "Coloured pencils"]
  },
  "B4.3.1.1.1": {
    topic: "Early Life and Call of religious leaders",
    keyWords: ["Call", "Prophecy", "Vision", "Enlightenment", "Leaders"],
    activities: [
      "Watch a video about the early life of a religious leader (e.g. Jesus, Muhammad)",
      "Role-play the scenes of the 'Call' of a chosen leader",
      "Discuss the qualities demonstrated by these leaders during their childhood",
      "Identify common themes in the calls of the different leaders"
    ],
    resources: ["Video clips", "Costumes for role-play", "Storybooks"]
  },
  "B5.3.1.1.1": {
    topic: "Ministry and latter lives of religions leaders",
    keyWords: ["Ministry", "Service", "Teachings", "Legacy", "Sacrifice"],
    activities: [
      "Discuss the major teachings of a specific religious leader",
      "Identify the key miracles or signficant events in their ministry",
      "Narrate the events leading to the latter lives of the leaders",
      "Make a group presentation on the moral lessons from their lives"
    ],
    resources: ["Flashcards", "Chart with timeline of leaders", "Relevant scriptures"]
  },
  "B6.2.1.1.1": {
    topic: "Types and Importance of Religious Festivals",
    keyWords: ["Eid", "Easter", "Christmas", "Hogbetsotso", "Celebration"],
    activities: [
      "List different religious festivals celebrated in Ghana",
      "Describe how one specific festival is celebrated",
      "Discuss why people celebrate these festivals (thanksgiving, remembrance)",
      "Design a greeting card for a chosen religious festival"
    ],
    resources: ["Festival pictures", "Cardboard", "Coloured pencils", "Glue"]
  }
};
