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
  "Accounting",
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
  "Chemistry": ["Physical Chemistry", "Systematic Chemistry of the Elements", "Chemistry of Carbon Compounds"],
  "Biology": [
    "Exploring Biology in Society",
    "Life in the Fundamental Unit",
    "Diversity of Living Things and Their Environment",
    "Diversity of living things and their Environment",
    "Systems of Life",
    "Systems of life",
    "Cell Biology",
    "Genetics",
    "Physiology",
    "Ecology",
    "Plant Biology",
    "Diversity of Life"
  ],
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
  "Financial Accounting": ["Conceptual Framework", "Financial Data Analysis", "Financial Reporting", "Financial Statements", "Partnership Accounts", "Company Accounts", "Cost Accounting Basics"],
  "Cost Accounting": ["Controlling Cost to Improve Organisational Performance", "Determining Cost of Operations for Pricing and Controlling", "Analysing Information for Control and decision making", "Introduction to Cost Accounting", "Elements of Costing", "Materials Costing", "Labour and Overhead Costing", "Job and Batch Costing"],
  "Accounting": ["Financial Accounting", "Cost Accounting"],
  "Business Management": [
    "Managing Businesses and the Legal Framework of Businesses",
    "Glocal Business",
    "Forms of Business",
    "Functions of Management",
    "Functional Areas of Management",
    "Legal Environment of Business and Risk Management",
    "International Business and E-Business",
    "Business Development",
    "Nature of Management",
    "Legal Environment of Business"
  ],
  "French": ["L'Identité", "Parler de son Environnement", "Exprimer ses Goûts et ses Préférences", "Les Activités"],
  "Ghanaian Language": ["Oral Language (GL)", "Reading (GL)", "Writing (GL)", "Writing Conventions and Usage (GL)", "Extensive Reading (GL)", "Composition Writing", "Customs and Institutions", "Literature (GL)"],
  "Agricultural Science": ["Introduction to Agriculture", "Soil Science", "Crop Science", "Animal Science", "Agricultural Economics and Extension"],
  "Economics": [
    "Consumers' Rational Decision Making",
    "Consumers’ Rational Decision Making",
    "Firms' Innovative Decision Making",
    "Firms’ Innovative Decision Making",
    "Price Analysis and Prediction in the Modern Economy",
    "Government Economic Policy and Trade"
  ],
  "Elective ICT": ["Information Systems", "Computer Architecture", "Networking and Data Communications", "Software Development", "Web and Multimedia Development"],
  "CRS": ["Study of Religion, God's Creation and Humankind", "Religious Beliefs, Practices, Moral Values and Human Development", "Religious Communities and Nation Building", "Religion and Contemporary Issues"],
  "IRS": ["Al-Quran", "Al-Hadith", "Al-Fiqh", "Islamic History"],
  "Literature in English": ["Introduction to Literature", "African Prose", "Non-African Prose", "African Poetry", "Non-African Poetry", "Drama"],
  "Integrated Curriculum (KG)": ["All About Me", "My Family", "Values and Beliefs", "My Local Community", "My Nation Ghana", "All Around Us", "My Global Community"],
  "Our World Our People": ["All About Us", "All Around Us", "Our Beliefs and Values", "Our Nation Ghana", "My Global Community"],
  "Physical Education": ["Motor Skill and Movement Patterns", "Movement Concepts, Principles and Strategies", "Physical Fitness", "Physical Fitness Concepts, Principles and Strategies", "Values and Psycho-social Concepts, Principles and Strategies"],
  "RME": ["God, His Creation and Attributes", "Religious Practices and their Moral Implications", "Religious Leaders", "The Family and the Community", "The Family, Authority and Obedience", "Religious Leaders and Personalities", "Ethics and Moral Life", "Religion and Economic Life"],
  "Food & Nutrition": ["Nutrition and Health", "Food Production"],
  "Geography": ["The Earth and Its Neighbourhoods", "Navigating Our Environment", "Human and Environment"],
  "Government": ["Government and Development", "Constitution, Institutions and Administration", "Ghana in the Global System"]
};

export const SUBJECT_SUB_STRANDS: Record<string, string[]> = {
  // Food & Nutrition Mappings
  "Nutrition and Health": ["Food For Healthy Living", "Food Security"],
  "Food Production": ["Food Production Technology", "Food Processing Techniques"],

  // Geography Mappings
  "The Earth and Its Neighbourhoods": ["The Earth and Its Features", "Rocks, Weathering, Soil and Mass Wasting", "The Earth Atmosphere"],
  "Navigating Our Environment": ["Maps, Their Elements and Analyses", "Geospatial Data Collection, Representation and Interpretation"],
  "Human and Environment": ["Physical Settings and People", "Economic Activities", "Environmental Degradation", "Environmental Hazards and Their Management"],

  // Government Mappings
  "Government and Development": ["Basics of Government", "Indigenous and Contemporary Governance in Ghana"],
  "Constitution, Institutions and Administration": ["Constitution and Organs of Government", "State and Non-State Actors in Ghana"],
  "Ghana in the Global System": ["Ghana in the Community of Nations", "Globalization and Development"],

  // History Mappings (SHS)
  "Historical Inquiry and Writing": ["Nature and Scope of History", "Sources and Methods of Reconstructing History"],
  "States and Societies in Pre-Colonial Times": ["Emergence of Complex States", "Pre-Colonial Economy and Economic Activities", "Emergence of Complex States and Societies"],
  "Age of Encounter and Exchanges Up to the 20th Century": ["Religion and Religious Change", "Global Connections", "Prelude to Colonisation and Colonial Rule", "Response to Colonial Rule"],
  "Independence and Post-Colonial Developments": ["Socio-Economic and Political Developments in Ghana (1957 - 2007)"],

  // Accounting & Business Accounting Mappings
  "Financial Accounting": ["Conceptual Framework", "Financial Data Analysis", "Financial Reporting", "Financial Statements", "Partnership Accounts", "Company Accounts", "Cost Accounting Basics"],
  "Cost Accounting": ["Controlling Cost to Improve Organisational Performance", "Determining Cost of Operations for Pricing and Controlling", "Analysing Information for Control and decision making", "Introduction to Cost Accounting", "Elements of Costing", "Materials Costing", "Labour and Overhead Costing", "Job and Batch Costing"],
  
  "Conceptual Framework": ["Accounting Principles & System", "Accounting Equation & Ledger", "Users of Accounting Info", "Accounting Standards", "Scope of Accounting", "Accounting Equation", "Double Entry Principle", "Trial Balance"],
  "Financial Data Analysis": ["Correction of Errors & Suspense Accounts", "Bank Reconciliation Statements", "Receivables & Payables Control Accounts", "Ratio Analysis", "Correction of Errors", "Suspense Account", "Bank Reconciliation Statement", "Control Accounts"],
  "Financial Reporting": ["Sole Proprietorship FINAL Accounts", "Not-for-Profit Final Accounts", "Incomplete Records Accounts", "Partnership Accounts Form", "Company Final Accounts", "Sole Proprietorship Accounts", "Accounts of Not-for-Profit Organisations", "Accounts from Incomplete Records", "Partnership Accounts", "Company Accounts"],
  "Financial Statements": ["Trading, Profit and Loss Account", "Balance Sheet", "Adjustments", "Incomplete Records Final Accounts"],
  "Partnership Accounts": ["Partnership Deed", "Appropriation Account", "Partnership Balance Sheet", "Goodwill Treatment"],
  "Company Accounts": ["Issue of Shares & Debentures", "Company Annual Reports", "Statement of Retained Earnings"],
  "Cost Accounting Basics": ["Introduction to Cost Concepts", "Classification of Costs", "Costing Terminology"],
  "Introduction to Cost Accounting": ["Definition & Scope of Costing", "Difference between Financial & Costing", "Standard Installation"],
  "Elements of Costing": ["Materials Management", "Labour Remuneration", "Overheads Cost Pool"],
  "Materials Costing": ["Store Ledger pricing (FIFO/LIFO/WAM)", "Inventory Valuation", "Material Requisitions"],
  "Labour and Overhead Costing": ["Wages and Salary Computation", "Overhead Analysis & Sheets", "Overhead Absorption Rates"],
  "Job and Batch Costing": ["Job Costing System", "Batch Costing System", "Contract Cost Accounts", "Process Cost Accounts", "Service Costing"],
  "Controlling Cost to Improve Organisational Performance": ["FIFO, LIFO, and Weighted Average Pricing", "Labour Remuneration & Idle Time", "Payroll and Wages Sheet", "Overhead Allocation and Apportionment", "Overhead Analysis Sheet"],
  "Determining Cost of Operations for Pricing and Controlling": ["Job Costing Sheets", "Contract Costing & Work Certified", "Service Cost Accounts", "Process Costing and Normal Losses"],
  "Analysing Information for Control and decision making": ["Activity Based Costing & Cost Drivers", "Marginal costing vs Absorption Costing", "Cost-Volume-Profit and Break-Even Point", "Standard Costing and Variance Analysis", "Budgetary Control and Functional Budgets"],

  // Business Management Mappings
  "Business Management": [
    "Managing Businesses and the Legal Framework of Businesses",
    "Glocal Business",
    "Forms of Business",
    "Functions of Management",
    "Functional Areas of Management",
    "Legal Environment of Business and Risk Management",
    "International Business and E-Business",
    "Business Development",
    "Nature of Management",
    "Legal Environment of Business"
  ],
  "Managing Businesses and the Legal Framework of Businesses": [
    "Forms of Business",
    "Functions of Management",
    "Functional Areas of Management",
    "Legal Environment of Business and Risk Management"
  ],
  "Glocal Business": [
    "International Business and E-Business",
    "Business Development"
  ],
  "Nature of Management": [
    "Forms of Business",
    "Functions of Management"
  ],
  "Legal Environment of Business": [
    "Legal Environment of Business and Risk Management",
    "Law of Contract"
  ],
  "Forms of Business": [
    "Forms of Business Ownership", 
    "Sole Proprietorship", 
    "Partnership", 
    "Company & SOEs", 
    "Concept of Business", 
    "Joint Stock Companies", 
    "State-owned Enterprises"
  ],
  "Functions of Management": [
    "Planning and Decision Making", 
    "Organising and Org Structures", 
    "Leading styles & Power", 
    "Controlling processes & tools", 
    "Management and Administration"
  ],
  "Functional Areas of Management": [
    "Production Management", 
    "Procurement Management", 
    "Marketing and Digital Marketing", 
    "Human Resource Management", 
    "Financial Management", 
    "Decision-making", 
    "Delegation", 
    "Business Communication", 
    "Performance Management"
  ],
  "Legal Environment of Business and Risk Management": [
    "Law of Contract", 
    "Risk Management & Insurance", 
    "Legal Environment of Business"
  ],
  "International Business and E-Business": [
    "Approaches to International Business", 
    "Domestic vs International Trade", 
    "Restrictions in International Trade", 
    "Multinational Corporations & E-Business"
  ],
  "Business Development": [
    "Entrepreneurship and Setting up a Business", 
    "Creating a Simple Business Plan", 
    "Factors affecting Business Environment",
    "Business Ethics and CSR"
  ],
  // Biology
  "Exploring Biology in Society": ["Biology as the Science of Life", "Biology and Entrepreneurship"],
  "Life in the Fundamental Unit": ["Cell Structure and Functions", "Movement of Substances in Living Organisms"],
  "Diversity of Living Things and Their Environment": ["Living Organisms", "Ecology", "Diseases and Infections"],
  "Diversity of living things and their Environment": ["Living Organisms", "Ecology", "Diseases and Infections"],
  "Diversity of living things and their Environmnet": ["Living Organisms", "Ecology", "Diseases and Infections"],
  "Systems of Life": ["Mammalian Systems", "Plant Systems"],
  "Systems of life": ["Mammalian Systems", "Plant Systems"],
  // Legacy mappings for backwards-compatible / robust selection
  "Cell Biology": ["Cell Structure and Functions", "Movement of Substances in Living Organisms"],
  "Genetics": ["Genetics Key Terms", "Mendel's Laws of Inheritance", "Variation", "Evolution", "Cell Cycle and Cell Division"],
  "Physiology": ["Mammalian Systems", "Plant Systems", "Cardiovascular and Excretory Systems"],
  "Ecology": ["Ecological terms", "Ecology in Named Habitats", "Interdependency of Living Organisms", "Energy Flow in Ecosystems"],
  "Plant Biology": ["Morphology of Flowering Plants", "Plant Tissues and Functions", "Photosynthesis and Transportation", "Reproduction and Excretion in Flowering Plants"],
  "Diversity of Life": ["Living Organisms", "Classification of Lower Organisms", "Diseases and Infections"],

  // CRS Strands Map to Sub-Strands
  "Study of Religion, God's Creation and Humankind": [
    "Background to the Study of Religion and Christianity",
    "The Nature of God and His Creation"
  ],
  "Religious Beliefs, Practices, Moral Values and Human Development": [
    "The Major Beliefs of Christianity",
    "Worship and Moral Values for Development",
    "Christian Music and Values for Development",
    "Christian Prayer and National Development"
  ],
  "Religious Communities and Nation Building": [
    "The Origin and Nature of Religious Communities",
    "Religion and Nation Building",
    "Religious Communities, Gender and Development"
  ],
  "Religion and Contemporary Issues": [
    "Religion and the Environment",
    "Religion and Sexual Morality",
    "Religion and Fraud"
  ],

  "Consumers' Rational Decision Making": ["Introduction to the Subject Economics", "Demand for Goods and Services", "Consumer Behaviour"],
  "Consumers’ Rational Decision Making": ["Introduction to the Subject Economics", "Demand for Goods and Services", "Consumer Behaviour"],
  "Firms' Innovative Decision Making": ["Production of Goods and Services", "Supply of Goods and Services", "Market Analysis"],
  "Firms’ Innovative Decision Making": ["Production of Goods and Services", "Supply of Goods and Services", "Market Analysis"],
  "Price Analysis and Prediction in the Modern Economy": ["Price and Equilibrium Analysis"],
  "Government Economic Policy and Trade": [
    "Macroeconomic Variables (GDP, Inflation, Unemployment, Exchange Rate)", 
    "Concept of Money, Financial Institutions and Public Finance", 
    "Agriculture, Industrialization and Trade"
  ],
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
  "Physical Chemistry": ["Matter and its Properties", "Equilibria"],
  "Systematic Chemistry of the Elements": ["Periodicity", "Bonding"],
  "Chemistry of Carbon Compounds": ["Characterisation of Organic Compounds", "Organic Functional Groups"],
  
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
  "Financial Accounting": {
    "Conceptual Framework": [
      "B10.1.1.1: Demonstrate knowledge and understanding of Accounting, its nature, principles, purpose and application."
    ],
    "Financial Data Analysis": [
      "B11.1.2.1: Analyze accounting transactions using the double-entry system, adjusting ledgers, correcting errors and extracting trial balances.",
      "B11.1.2.2: Prepare updated cash books, and bank reconciliation statements to monitor liquidity.",
      "B11.1.2.3: Draft receivables and payables control accounts to audit sub-ledger operations."
    ],
    "Financial Reporting": [
      "B10.1.3.1: Prepare sole proprietorship final financial statements with basic internal adjustments.",
      "B11.1.3.1: Prepare final statements from single-entry and incomplete financial records.",
      "B11.1.3.2: Account for financial items in non-profit operations, compiling subscriptions and accumulated funds.",
      "B12.1.3.1: Account for the constitution, profit distribution, and goodwill of general business partnerships.",
      "B12.1.3.2: Prepare final structured financial accounts and reports for companies."
    ],
    "Financial Statements": [
      "B10.1.4.1: Compute trading, profit and loss components to determine business profitability."
    ],
    "Partnership Accounts": [
      "B12.1.5.1: Allocate partnership rewards using profit and loss appropriation accounts."
    ],
    "Company Accounts": [
      "B12.1.6.1: Examine company share capital issues and balance sheet groupings."
    ],
    "Cost Accounting Basics": [
      "B10.1.7.1: Classify general overhead and prime expenses in basic production sheets."
    ]
  },
  "Cost Accounting": {
    "Controlling Cost to Improve Organisational Performance": [
      "B10.2.1.1: Distinguish nature, purpose, basics and installation guidelines of modern cost accounting files.",
      "B10.2.1.2: Demonstrate material storage, purchase documentation, and issue pricing under FIFO, LIFO and Weighted Average schemes.",
      "B11.2.1.1: Account for labour remuneration, idle time metrics, and calculate complete payroll sheets.",
      "B11.2.1.2: Formulate overhead analysis sheets to apportion common indirect overheads."
    ],
    "Determining Cost of Operations for Pricing and Controlling": [
      "B11.2.2.1: Draft job and batch cost records to compute margins on specific custom orders.",
      "B12.2.2.1: Account for process costing scenarios including treatment of normal and abnormal losses.",
      "B12.2.2.2: Reconcile contract costing procedures with architectural certificate milestones.",
      "B12.2.2.3: Formulate service cost schedules for passenger transport and related service sectors."
    ],
    "Analysing Information for Control and decision making": [
      "B11.2.3.1: Apply Activity Based Costing methods to link overheads to strategic cost pools.",
      "B11.2.3.2: Contrast Marginal and Absorption costing treatments on period adjustments and profits.",
      "B12.2.3.1: Draft cost-volume-profit graphs to pinpoint break-even outcomes and margin of safety indices.",
      "B12.2.3.2: Prepare functional sales, production, purchase, and cash budgets to schedule operations.",
      "B12.2.3.3: Calculate standard material and labour variances to evaluate operational efficiency discrepancies."
    ],
    "Introduction to Cost Accounting": [
      "B10.2.4.1: Distinguish cost accounting systems from traditional financial ledgers."
    ],
    "Elements of Costing": [
      "B10.2.5.1: Categorize overhead allocations, material supplies, and direct labor costs."
    ],
    "Materials Costing": [
      "B10.2.6.1: Record inventory values using FIFO and LIFO methods."
    ],
    "Labour and Overhead Costing": [
      "B11.2.7.1: Allocate administrative overheads across active service centers."
    ],
    "Job and Batch Costing": [
      "B12.2.8.1: Compute total costs for job-ordered projects and batches."
    ]
  },
  "Business Management": {
    "Managing Businesses and the Legal Framework of Businesses": [
      "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership.",
      "1.1.2.CS.1: Demonstrate knowledge and understanding of the basic functions of management.",
      "2.1.2.CS.1: Demonstrate knowledge, understanding and application of decision-making skills in organisations.",
      "2.1.3.CS.1: Demonstrate knowledge and understanding of the Law of Contract."
    ],
    "Glocal Business": [
      "1.2.1.CS1: Demonstrate knowledge and understanding of the business environment and corporate social responsibility.",
      "2.2.1.CS.1: Demonstrate knowledge and understanding of the approaches to international business.",
      "3.2.1.CS.1: Demonstrate knowledge and understanding of digital marketing."
    ],
    "Forms of Business": [
      "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership."
    ],
    "Forms of Business Ownership": [
      "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership."
    ],
    "Sole Proprietorship": [
      "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership."
    ],
    "Partnership": [
      "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership."
    ],
    "Company & SOEs": [
      "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership."
    ],
    "Concept of Business": [
      "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership."
    ],
    "Joint Stock Companies": [
      "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership."
    ],
    "State-owned Enterprises": [
      "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership."
    ],
    "Functions of Management": [
      "1.1.2.CS.1: Demonstrate knowledge and understanding of the basic functions of management."
    ],
    "Planning and Decision Making": [
      "1.1.2.CS.1: Demonstrate knowledge and understanding of the basic functions of management."
    ],
    "Organising and Org Structures": [
      "1.1.2.CS.1: Demonstrate knowledge and understanding of the basic functions of management."
    ],
    "Leading styles & Power": [
      "1.1.2.CS.1: Demonstrate knowledge and understanding of the basic functions of management."
    ],
    "Controlling processes & tools": [
      "1.1.2.CS.1: Demonstrate knowledge and understanding of the basic functions of management."
    ],
    "Management and Administration": [
      "1.1.2.CS.1: Demonstrate knowledge and understanding of the basic functions of management."
    ],
    "Functional Areas of Management": [
      "2.1.2.CS.1: Demonstrate knowledge, understanding and application of decision-making skills in organisations.",
      "2.1.2.CS.2: Demonstrate knowledge and understanding of delegation.",
      "2.1.2.CS.3: Demonstrate understanding and application of effective communication skills in organisations.",
      "2.1.3.CS.4: Demonstrate knowledge and understanding of Human Resource Management.",
      "3.1.2.CS.1: Demonstrate knowledge and understanding of production management.",
      "3.1.2.CS.2: Demonstrate knowledge and understanding of Procurement Management."
    ],
    "Production Management": [
      "3.1.2.CS.1: Demonstrate knowledge and understanding of production management."
    ],
    "Procurement Management": [
      "3.1.2.CS.2: Demonstrate knowledge and understanding of Procurement Management."
    ],
    "Marketing and Digital Marketing": [
      "3.2.1.CS.1: Demonstrate knowledge and understanding of digital marketing."
    ],
    "Human Resource Management": [
      "2.1.3.CS.4: Demonstrate knowledge and understanding of Human Resource Management."
    ],
    "Decision-making": [
      "2.1.2.CS.1: Demonstrate knowledge, understanding and application of decision-making skills in organisations."
    ],
    "Delegation": [
      "2.1.2.CS.2: Demonstrate knowledge and understanding of delegation."
    ],
    "Business Communication": [
      "2.1.2.CS.3: Demonstrate understanding and application of effective communication skills in organisations."
    ],
    "Performance Management": [
      "2.1.3.CS.4: Demonstrate knowledge and understanding of Human Resource Management."
    ],
    "Legal Environment of Business and Risk Management": [
      "2.1.3.CS.1: Demonstrate knowledge and understanding of the Law of Contract.",
      "2.1.3.CS.2: Demonstrate knowledge and understanding of business risk and insurance."
    ],
    "Law of Contract": [
      "2.1.3.CS.1: Demonstrate knowledge and understanding of the Law of Contract."
    ],
    "Risk Management & Insurance": [
      "2.1.3.CS.2: Demonstrate knowledge and understanding of business risk and insurance."
    ],
    "International Business and E-Business": [
      "2.2.1.CS.1: Demonstrate knowledge and understanding of the approaches to international business.",
      "2.2.1.CS.2: Demonstrate knowledge and understanding of Domestic and International Trade.",
      "3.2.1.CS.1: Demonstrate knowledge and understanding of digital marketing.",
      "1.2.2.CS1: Demonstrate knowledge and understanding of globalization and international business and how to transform Ghanaian companies into multinational corporations."
    ],
    "Approaches to International Business": [
      "2.2.1.CS.1: Demonstrate knowledge and understanding of the approaches to international business."
    ],
    "Domestic vs International Trade": [
      "2.2.1.CS.2: Demonstrate knowledge and understanding of Domestic and International Trade."
    ],
    "Restrictions in International Trade": [
      "2.2.1.CS.2: Demonstrate knowledge and understanding of Domestic and International Trade."
    ],
    "Multinational Corporations & E-Business": [
      "1.2.2.CS1: Demonstrate knowledge and understanding of globalization and international business and how to transform Ghanaian companies into multinational corporations."
    ],
    "Business Development": [
      "1.2.1.CS1: Demonstrate knowledge and understanding of the business environment and corporate social responsibility.",
      "3.2.2.CS.1: Demonstrate knowledge and understanding of entrepreneurship and setting up businesses."
    ],
    "Entrepreneurship and Setting up a Business": [
      "3.2.2.CS.1: Demonstrate knowledge and understanding of entrepreneurship and setting up businesses."
    ],
    "Creating a Simple Business Plan": [
      "3.2.2.CS.1: Demonstrate knowledge and understanding of entrepreneurship and setting up businesses."
    ],
    "Factors affecting Business Environment": [
      "1.2.1.CS1: Demonstrate knowledge and understanding of the business environment and corporate social responsibility."
    ],
    "Business Ethics and CSR": [
      "1.2.1.CS1: Demonstrate knowledge and understanding of the business environment and corporate social responsibility."
    ],
    "Nature of Management": [
      "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership.",
      "1.1.2.CS.1: Demonstrate knowledge and understanding of the basic functions of management."
    ],
    "Legal Environment of Business": [
      "2.1.3.CS.1: Demonstrate knowledge and understanding of the Law of Contract.",
      "2.1.3.CS.2: Demonstrate knowledge and understanding of business risk and insurance."
    ]
  },
  "Conceptual Framework": {
    "Accounting Principles & System": [
      "B10.1.1.1: Explain Accounting as a system and its purpose in daily life."
    ],
    "Accounting Equation & Ledger": [
      "B10.1.1.2: Compute assets, liabilities and capital values using the basic accounting equation."
    ],
    "Users of Accounting Info": [
      "B10.1.1.3: Examine the information needs of various users of accounting information."
    ],
    "Accounting Standards": [
      "B10.1.1.4: Discuss the need for general accounting standards and the role of regulatory bodies."
    ],
    "Scope of Accounting": [
      "B10.1.1.5: Describe the core definitions of bookkeeping, financial accounting and cost accounting."
    ],
    "Accounting Equation": [
      "B10.1.1.6: Apply the double entry guidelines to adjust transactions in the accounting equation."
    ],
    "Double Entry Principle": [
      "B10.1.1.7: Post basic ledger adjustments on various asset, liability, and capital accounts."
    ],
    "Trial Balance": [
      "B10.1.1.8: Extract a standard trial balance from historical ledger balances."
    ]
  },
  "Financial Data Analysis": {
    "Correction of Errors & Suspense Accounts": [
      "B11.1.2.1: Identify types of errors not affecting the trial balance and demonstrate the rectification entry procedures."
    ],
    "Bank Reconciliation Statements": [
      "B11.1.2.2: Prepare updated cashbook balances and reconcile with the bank statement to verify financial balances."
    ],
    "Receivables & Payables Control Accounts": [
      "B11.1.2.3: Compile sales and purchase ledger control accounts to audit sub-ledger operations."
    ],
    "Ratio Analysis": [
      "B12.1.2.1: Compute and interpret gross profit, net profit, current, quick, and efficiency ratios."
    ],
    "Correction of Errors": [
      "B11.1.2.4: Distinguish between errors of omission, commission, principle, and complete reversal."
    ],
    "Suspense Account": [
      "B11.1.2.5: Design a suspense account to balance the trial balance temporaries pending audits."
    ],
    "Bank Reconciliation Statement": [
      "B11.1.2.6: Draft a formal bank reconciliation statement starting with cashbook or bank statement balances."
    ],
    "Control Accounts": [
      "B11.1.2.7: Reconcile sub-ledgers with general ledger control totals."
    ]
  },
  "Financial Reporting": {
    "Sole Proprietorship FINAL Accounts": [
      "B10.1.3.1: Prepare sole proprietorship final financial statements with adjusting entries."
    ],
    "Not-for-Profit Final Accounts": [
      "B11.1.3.1: Draft receipts and payments, and income and expenditure statements for non-governmental projects."
    ],
    "Incomplete Records Accounts": [
      "B11.1.3.2: Reconstruct profit calculations using Statement of Affairs and single entry conversions."
    ],
    "Partnership Accounts Form": [
      "B12.1.3.1: Draft partnership appropriation accounts, current and capital capital sheets."
    ],
    "Company Final Accounts": [
      "B12.1.3.2: Prepare company income statements and statements of financial position under regulatory frameworks."
    ],
    "Sole Proprietorship Accounts": [
      "B10.1.3.3: Calculate adjustments for prepayments, accruals, depreciation, and bad debts for sole traders."
    ],
    "Accounts of Not-for-Profit Organisations": [
      "B11.1.3.3: Formulate a subscription account to track accrued or prepaid member dues."
    ],
    "Accounts from Incomplete Records": [
      "B11.1.3.4: Convert incomplete records into dual double-entry structures using ledger summaries."
    ],
    "Partnership Accounts": [
      "B12.1.3.3: Manage the entry/retirement of a partner, calculating goodwill shares."
    ],
    "Company Accounts": [
      "B12.1.3.4: Account for share and debenture subscription and payments in general company ledgers."
    ]
  },
  "Financial Statements": {
    "Trading, Profit and Loss Account": [
      "B10.1.4.1: Compute gross margins and operating outputs in trading businesses."
    ],
    "Balance Sheet": [
      "B10.1.4.2: Present a classified statement of financial position grouping local capital structures."
    ],
    "Adjustments": [
      "B10.1.4.3: Calculate end-of-period adjustments for outstanding and accrued variables."
    ],
    "Incomplete Records Final Accounts": [
      "B11.1.4.1: Derive sales, purchases, and cash flows to prepare standard sole-proprietor reports."
    ]
  },
  "Partnership Accounts": {
    "Partnership Deed": [
      "B12.1.5.1: Review essential clauses in a partnership agreement and deed."
    ],
    "Appropriation Account": [
      "B12.1.5.2: Prepare partnership profit distributions inside appropriation accounts."
    ],
    "Partnership Balance Sheet": [
      "B12.1.5.3: Draft partner capital and current account reports."
    ],
    "Goodwill Treatment": [
      "B12.1.5.4: Formulate ledger adjustments for goodwill in partners entry or exits."
    ]
  },
  "Company Accounts": {
    "Issue of Shares & Debentures": [
      "B12.1.6.1: Prepare financial entries for share allocations and payments."
    ],
    "Company Annual Reports": [
      "B12.1.6.2: Outline standard company components (statement of cash flows, director findings)."
    ],
    "Statement of Retained Earnings": [
      "B12.1.6.3: Present company income reserves balances correctly."
    ]
  },
  "Cost Accounting Basics": {
    "Introduction to Cost Concepts": [
      "B10.1.7.1: Distinguish between overhead expenditures and primary costs."
    ],
    "Classification of Costs": [
      "B10.1.7.2: Group costs on production volumes, target departments, and product relationships."
    ],
    "Costing Terminology": [
      "B10.1.7.3: Outline basic cost center and cost unit definitions."
    ]
  },
  "Introduction to Cost Accounting": {
    "Definition & Scope of Costing": [
      "B10.2.4.1: Explain core definitions and bounds of cost accounting tools."
    ],
    "Difference between Financial & Costing": [
      "B10.2.4.2: Contrast information requirements of cost ledgers versus general accounting."
    ],
    "Standard Installation": [
      "B10.2.4.3: Plan core requirements of implementing a sound cost accounting structure."
    ]
  },
  "Elements of Costing": {
    "Materials Management": [
      "B10.2.5.1: Summarize procurement routes of manufacturing resources."
    ],
    "Labour Remuneration": [
      "B10.2.5.2: Trace time sheet outputs to payroll rates."
    ],
    "Overheads Cost Pool": [
      "B10.2.5.3: Explain direct and indirect categorization of operating targets."
    ]
  },
  "Materials Costing": {
    "Store Ledger pricing (FIFO/LIFO/WAM)": [
      "B10.2.6.1: Record resource issues under FIFO, LIFO, and Weighted Average costings."
    ],
    "Inventory Valuation": [
      "B10.2.6.2: Compute closing inventory values at lower of aggregate cost or market value."
    ],
    "Material Requisitions": [
      "B10.2.6.3: Formulate requisition sheets tracking stock movements."
    ]
  },
  "Labour and Overhead Costing": {
    "Wages and Salary Computation": [
      "B11.2.7.1: Prepare full payroll spreadsheets with core tax and welfare deductions."
    ],
    "Overhead Analysis & Sheets": [
      "B11.2.7.2: Apply step-down distribution rules to assign overheads across cost units."
    ],
    "Overhead Absorption Rates": [
      "B11.2.7.3: Formulate overhead absorption configurations on direct machine or labor metrics."
    ]
  },
  "Job and Batch Costing": {
    "Job Costing System": [
      "B12.2.8.1: Construct job sheets detailing prime costs and overhead bounds."
    ],
    "Batch Costing System": [
      "B12.2.8.2: Compute unit costs based on bulk batch executions."
    ],
    "Contract Cost Accounts": [
      "B12.2.8.3: Formulate contract sheets tracking retention moneys and work certified values."
    ],
    "Process Cost Accounts": [
      "B12.2.8.4: Track work-in-progress values across linear production processes."
    ],
    "Service Costing": [
      "B12.2.8.5: Compute cost-per-passenger-kilometer in commercial networks."
    ]
  },
  "Controlling Cost to Improve Organisational Performance": {
    "FIFO, LIFO, and Weighted Average Pricing": [
      "B10.2.1.2: Demonstrate material store ledger pricing and issue computation."
    ],
    "Labour Remuneration & Idle Time": [
      "B11.2.1.1: Describe labor cost structures, incentive rewards, and idle hours."
    ],
    "Payroll and Wages Sheet": [
      "B11.2.1.3: Compile payroll spreadsheets detailing gross and net payouts."
    ],
    "Overhead Allocation and Apportionment": [
      "B11.2.1.4: Group indirect expenses to production departments using primary sheets."
    ],
    "Overhead Analysis Sheet": [
      "B11.2.1.5: Perform step-down secondary redistributions of service budgets."
    ]
  },
  "Determining Cost of Operations for Pricing and Controlling": {
    "Job Costing Sheets": [
      "B11.2.2.1: Compile individual job sheets determining production profitability."
    ],
    "Contract Costing & Work Certified": [
      "B12.2.2.2: Compute profit reserves on partially completed structural contracts."
    ],
    "Service Cost Accounts": [
      "B12.2.2.4: Formulate operational cost metrics in the services domain."
    ],
    "Process Costing and Normal Losses": [
      "B12.2.2.1: Account for scrap yields and work developments in process accounts."
    ]
  },
  "Analysing Information for Control and decision making": {
    "Activity Based Costing & Cost Drivers": [
      "B11.2.3.1: Formulate driver-based rates across multi-channel cost items."
    ],
    "Marginal costing vs Absorption Costing": [
      "B11.2.3.2: contrast income statements prepared under marginal and absorption rules."
    ],
    "Cost-Volume-Profit and Break-Even Point": [
      "B12.2.3.1: Calculate sales thresholds securing target profitability ratios."
    ],
    "Standard Costing and Variance Analysis": [
      "B12.2.3.3: Reconcile actual costs with standard estimates analyzing labor/material spreads."
    ],
    "Budgetary Control and Functional Budgets": [
      "B12.2.3.2: Formulate cash receipts and operational schedules aiding cashflow balance."
    ]
  },
  "Exploring Biology in Society": {
    "Biology as the Science of Life": [
      "B10.1.1.1: Demonstrate knowledge and understanding of Biology, the various branches and fields of study, and their benefits in everyday life.",
      "B10.1.1.2: Apply knowledge and understanding of the scientific method to solve everyday problems.",
      "B10.1.1.3: Apply knowledge of body symmetry, orientation, and sectioning of various organisms, and make labelled drawings of specimens.",
      "B10.1.1.4: Demonstrate knowledge, skill, and safety in the use of the microscope.",
      "B11.1.1.1: Relate the knowledge of the characteristics and life processes of common simple living organisms to their economic importance."
    ],
    "Biology and Entrepreneurship": [
      "B10.1.2.1: Apply the knowledge of basic concepts in biology to improve productivity in fish farming.",
      "B11.1.2.1: Apply the knowledge of basic concepts in biology to improve crop and animal production.",
      "B12.1.2.1: Apply knowledge and skills in biotechnology to enhance the value of products that help improve human lives and the environment."
    ]
  },
  "Life in the Fundamental Unit": {
    "Cell Structure and Functions": [
      "B11.2.1.1: Demonstrate knowledge and understanding of cell structure and functions, and relate them to organizational hierarchies.",
      "B12.2.1.1: Explain the molecular structure of nucleic acids (DNA/RNA) and their roles in protein synthesis.",
      "B12.2.1.2: Explain the cell cycle, cell division (mitosis/meiosis), and their relevance in living things."
    ],
    "Movement of Substances in Living Organisms": [
      "B10.2.2.1: Explain the significance of the various processes involved in the movement of substances in and out of the cell and the factors affecting them."
    ]
  },
  "Diversity of Living Things and Their Environment": {
    "Living Organisms": [
      "B10.3.1.1: Identify living organisms using numbered and dichotomous keys.",
      "B10.3.1.2: Explain how lower organisms are classified into their taxonomic groups.",
      "B11.3.1.1: Describe the distinctive characteristics, life cycle and characteristics of grain weevil, butterfly, housefly and honeybee.",
      "B12.3.1.1: Relate the characteristic features and life processes of tilapia, toad, wall gecko and domestic fowl to their economic importance."
    ],
    "Ecology": [
      "B10.3.2.1: Demonstrate knowledge and understanding of major tropical ecological habitats and how living things are adapted to these habitats.",
      "B10.3.2.2: Use the appropriate ecological tool/devices and methods to estimate the population of given species in a named habitat.",
      "B11.3.2.1: Explain the features of various tropical habitats and how living organisms are adapted to these habitats.",
      "B12.3.2.1: Explain the interdependencies of living things and their environment (food chains, webs, and symbiotic relationships) and indicate their importance."
    ],
    "Diseases and Infections": [
      "B10.3.3.1: Discuss the life cycles of common disease-causing organisms, and their effects on humans and other living things.",
      "B11.3.3.1: Explain immunization, vaccination, and inoculation and state their importance in the environment.",
      "B12.3.3.1: Examine and explain emerging diseases and infections (SARS, COVID-19, Ebola, Swine flu, etc.) and suggest prevention methods."
    ]
  },
  "Diversity of living things and their Environment": {
    "Living Organisms": [
      "B10.3.1.1: Identify living organisms using numbered and dichotomous keys.",
      "B10.3.1.2: Explain how lower organisms are classified into their taxonomic groups.",
      "B11.3.1.1: Describe the distinctive characteristics, life cycle and characteristics of grain weevil, butterfly, housefly and honeybee.",
      "B12.3.1.1: Relate the characteristic features and life processes of tilapia, toad, wall gecko and domestic fowl to their economic importance."
    ],
    "Ecology": [
      "B10.3.2.1: Demonstrate knowledge and understanding of major tropical ecological habitats and how living things are adapted to these habitats.",
      "B10.3.2.2: Use the appropriate ecological tool/devices and methods to estimate the population of given species in a named habitat.",
      "B11.3.2.1: Explain the features of various tropical habitats and how living organisms are adapted to these habitats.",
      "B12.3.2.1: Explain the interdependencies of living things and their environment (food chains, webs, and symbiotic relationships) and indicate their importance."
    ],
    "Diseases and Infections": [
      "B10.3.3.1: Discuss the life cycles of common disease-causing organisms, and their effects on humans and other living things.",
      "B11.3.3.1: Explain immunization, vaccination, and inoculation and state their importance in the environment.",
      "B12.3.3.1: Examine and explain emerging diseases and infections (SARS, COVID-19, Ebola, Swine flu, etc.) and suggest prevention methods."
    ]
  },
  "Diversity of living things and their Environmnet": {
    "Living Organisms": [
      "B10.3.1.1: Identify living organisms using numbered and dichotomous keys.",
      "B10.3.1.2: Explain how lower organisms are classified into their taxonomic groups.",
      "B11.3.1.1: Describe the distinctive characteristics, life cycle and characteristics of grain weevil, butterfly, housefly and honeybee.",
      "B12.3.1.1: Relate the characteristic features and life processes of tilapia, toad, wall gecko and domestic fowl to their economic importance."
    ],
    "Ecology": [
      "B10.3.2.1: Demonstrate knowledge and understanding of major tropical ecological habitats and how living things are adapted to these habitats.",
      "B10.3.2.2: Use the appropriate ecological tool/devices and methods to estimate the population of given species in a named habitat.",
      "B11.3.2.1: Explain the features of various tropical habitats and how living organisms are adapted to these habitats.",
      "B12.3.2.1: Explain the interdependencies of living things and their environment (food chains, webs, and symbiotic relationships) and indicate their importance."
    ],
    "Diseases and Infections": [
      "B10.3.3.1: Discuss the life cycles of common disease-causing organisms, and their effects on humans and other living things.",
      "B11.3.3.1: Explain immunization, vaccination, and inoculation and state their importance in the environment.",
      "B12.3.3.1: Examine and explain emerging diseases and infections (SARS, COVID-19, Ebola, Swine flu, etc.) and suggest prevention methods."
    ]
  },
  "Systems of Life": {
    "Mammalian Systems": [
      "B10.4.1.1: Describe the morphology of mammals and relate the external and internal structures to their functions.",
      "B11.4.1.1: Discuss the human cardiovascular and excretory systems and relate their parts to homeostasis and general well-being.",
      "B12.4.1.1: Explain the mammalian respiratory, reproductive, musculoskeletal, nervous, and hormonal systems and how they work together."
    ],
    "Plant Systems": [
      "B10.4.2.1: Describe the morphology of flowering plants and explain how these are related to their growth and development.",
      "B11.4.2.1: Explain transport and nutrition (photosynthesis) in flowering plants and state the factors affecting them.",
      "B12.4.2.1: Describe reproduction and excretion in flowering plants and relate them to survival."
    ]
  },
  "Systems of life": {
    "Mammalian Systems": [
      "B10.4.1.1: Describe the morphology of mammals and relate the external and internal structures to their functions.",
      "B11.4.1.1: Discuss the human cardiovascular and excretory systems and relate their parts to homeostasis and general well-being.",
      "B12.4.1.1: Explain the mammalian respiratory, reproductive, musculoskeletal, nervous, and hormonal systems and how they work together."
    ],
    "Plant Systems": [
      "B10.4.2.1: Describe the morphology of flowering plants and explain how these are related to their growth and development.",
      "B11.4.2.1: Explain transport and nutrition (photosynthesis) in flowering plants and state the factors affecting them.",
      "B12.4.2.1: Describe reproduction and excretion in flowering plants and relate them to survival."
    ]
  },
  "Cell Biology": {
    "Cell Structure and Functions": [
      "B11.2.1.1: Demonstrate knowledge and understanding of cell structure and functions, and relate them to organizational hierarchies."
    ],
    "Movement of Substances in Living Organisms": [
      "B10.2.2.1: Explain the significance of the various processes involved in the movement of substances in and out of the cell and the factors affecting them."
    ]
  },
  "Genetics": {
    "Genetics Key Terms": [
      "B12.2.1.1: Explain the molecular structure of nucleic acids (DNA/RNA) and their roles in protein synthesis."
    ],
    "Mendel's Laws of Inheritance": [
      "B12.2.1.2: Explain the cell cycle, cell division (mitosis/meiosis), and their relevance in living things."
    ]
  },
  "Physiology": {
    "Mammalian Systems": [
      "B10.4.1.1: Describe the morphology of mammals and relate the external and internal structures to their functions."
    ],
    "Plant Systems": [
      "B10.4.2.1: Describe the morphology of flowering plants and explain how these are related to their growth and development."
    ]
  },
  "Ecology": {
    "Ecological terms": [
      "B10.3.2.1: Demonstrate knowledge and understanding of major tropical ecological habitats and how living things are adapted to these habitats."
    ],
    "Ecology in Named Habitats": [
      "B11.3.2.1: Explain the features of various tropical habitats and how living organisms are adapted to these habitats."
    ]
  },
  "Plant Biology": {
    "Morphology of Flowering Plants": [
      "B10.4.2.1: Describe the morphology of flowering plants and explain how these are related to their growth and development."
    ],
    "Plant Tissues and Functions": [
      "B11.4.2.1: Explain transport and nutrition (photosynthesis) in flowering plants and state the factors affecting them."
    ]
  },
  "Diversity of Life": {
    "Living Organisms": [
      "B10.3.1.1: Identify living organisms using numbered and dichotomous keys."
    ]
  },
  "Consumers' Rational Decision Making": {
    "Introduction to the Subject Economics": [
      "B10.1.1.1: Use relevant information gathered from learners’ home, school and community through observation to carefully define economics and stimulate their interest in the subject.",
      "B11.1.1.1: Use the appropriate economics tools to explain everyday economic issues.",
      "B12.1.1.1: Exhibit knowledge of advanced economic methodologies and tools."
    ],
    "Demand for Goods and Services": [
      "B10.1.2.1: Use concepts of demand to solve everyday life and societal challenges.",
      "B11.1.2.1: Use the appropriate factors of demand to explain the differences between change in quantity demanded and change in demand.",
      "B12.1.2.1: Interpret elasticity of demand and apply the concept to daily life."
    ],
    "Consumer Behaviour": [
      "B10.1.3.1: Use relevant information gathered from home, school and community through observation to carefully explain the concept of utility and the law of diminishing marginal utility.",
      "B11.1.3.1: Exhibit rational behaviour in determining the equilibrium in consumption of goods and services through practical experiences.",
      "B12.1.3.1: Use information from the environment to explain income and substitution effects."
    ]
  },
  "Consumers’ Rational Decision Making": {
    "Introduction to the Subject Economics": [
      "B10.1.1.1: Use relevant information gathered from learners’ home, school and community through observation to carefully define economics and stimulate their interest in the subject.",
      "B11.1.1.1: Use the appropriate economics tools to explain everyday economic issues.",
      "B12.1.1.1: Exhibit knowledge of advanced economic methodologies and tools."
    ],
    "Demand for Goods and Services": [
      "B10.1.2.1: Use concepts of demand to solve everyday life and societal challenges.",
      "B11.1.2.1: Use the appropriate factors of demand to explain the differences between change in quantity demanded and change in demand.",
      "B12.1.2.1: Interpret elasticity of demand and apply the concept to daily life."
    ],
    "Consumer Behaviour": [
      "B10.1.3.1: Use relevant information gathered from home, school and community through observation to carefully explain the concept of utility and the law of diminishing marginal utility.",
      "B11.1.3.1: Exhibit rational behaviour in determining the equilibrium in consumption of goods and services through practical experiences.",
      "B12.1.3.1: Use information from the environment to explain income and substitution effects."
    ]
  },
  "Firms' Innovative Decision Making": {
    "Production of Goods and Services": [
      "B10.2.1.1: Evaluate the relevance of factors of production.",
      "B11.2.1.1: Use information gathered from the environment to determine the time periods, TP, AP, MP, labour and capital-intensive methods and the cost of production.",
      "B12.2.1.1: Describe Economies and Diseconomies of scale and demonstrate their effects on production output."
    ],
    "Supply of Goods and Services": [
      "B10.2.2.1: Use relevant information from the environment to explain the meaning, types and the law of supply.",
      "B11.2.2.1: Use the factors of supply to explain the differences between change in quantity supplied and change in supply.",
      "B12.2.2.1: Explain elasticity of supply and its importance."
    ],
    "Market Analysis": [
      "B10.2.3.1: Use relevant information from the environment to examine the concept of market and its types.",
      "B11.2.3.1: Analyse the various markets and determine the types of profits.",
      "B12.2.3.1: Explain the methods, agencies, problems and solutions of distribution."
    ]
  },
  "Firms’ Innovative Decision Making": {
    "Production of Goods and Services": [
      "B10.2.1.1: Evaluate the relevance of factors of production.",
      "B11.2.1.1: Use information gathered from the environment to determine the time periods, TP, AP, MP, labour and capital-intensive methods and the cost of production.",
      "B12.2.1.1: Describe Economies and Diseconomies of scale and demonstrate their effects on production output."
    ],
    "Supply of Goods and Services": [
      "B10.2.2.1: Use relevant information from the environment to explain the meaning, types and the law of supply.",
      "B11.2.2.1: Use the factors of supply to explain the differences between change in quantity supplied and change in supply.",
      "B12.2.2.1: Explain elasticity of supply and its importance."
    ],
    "Market Analysis": [
      "B10.2.3.1: Use relevant information from the environment to examine the concept of market and its types.",
      "B11.2.3.1: Analyse the various markets and determine the types of profits.",
      "B12.2.3.1: Explain the methods, agencies, problems and solutions of distribution."
    ]
  },
  "Price Analysis and Prediction in the Modern Economy": {
    "Price and Equilibrium Analysis": [
      "B10.3.1.1: Use relevant information from the environment to discuss pricing.",
      "B11.3.1.1: Use the concepts of demand and supply to determine the equilibrium in the market.",
      "B12.3.1.1: Distinguish between minimum (Price Floor) and maximum (Price Ceiling) price controls."
    ]
  },
  "Government Economic Policy and Trade": {
    "Macroeconomic Variables (GDP, Inflation, Unemployment, Exchange Rate)": [
      "B10.4.1.1: Examine the meaning and the type of ownership and control of resources and fundamental macroeconomic variables in the local and global economy.",
      "B11.4.1.1: Determine the effects of changes in the fundamental macroeconomics variables on the economy and their control policies.",
      "B12.4.1.1: Distinguish the linkages and connections between the fundamental macroeconomic variables."
    ],
    "Concept of Money, Financial Institutions and Public Finance": [
      "B10.4.2.1: Use relevant information from the environment to discuss the concept of money and financial institutions in an economy.",
      "B11.4.2.1: Employ relevant information in the environment to examine the reasons for holding money, role of financial institutions and taxation in an economy.",
      "B12.4.2.1: Employ relevant information in the country to examine the national budget and debt."
    ],
    "Agriculture, Industrialization and Trade": [
      "B10.4.3.1: Employ relevant information in the environment to examine the agricultural activities and their importance.",
      "B11.4.3.1: Use relevant information in the environment to examine the challenges in Agricultural, industrial and Service sectors.",
      "B12.4.3.1: Use relevant information in the environment to examine the connection between Agriculture and Industry."
    ]
  },
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
  },
  "Chemistry": {
    "Physical Chemistry": [
      "1.1.1.CS.1: Explain atomic structure, nuclear stability, and behavior of matter using scientific practices.",
      "1.1.1.CS.2: Explain reaction energetics, enthalpy changes, and rate parameters.",
      "1.1.2.CS.1: Apply dynamic equilibrium to chemical operations and industrial processes.",
      "1.1.2.CS.2: Analyze acid-base properties, ionization, and titration quantities."
    ],
    "Systematic Chemistry of the Elements": [
      "1.2.1.CS.1: Explain periodic trends, and pattern of properties across periods and groups of elements.",
      "1.2.2.CS.1: Predict and explain interatomic (ionic, covalent, metallic) and intermolecular bonding.",
      "2.2.1.CS.1: Explain chemical patterns of the halogens and period three elements."
    ],
    "Chemistry of Carbon Compounds": [
      "1.3.1.CS.1: Describe organic purification, and qualitative/quantitative elemental analysis.",
      "1.3.2.CS.1: Classify organic compounds, explain homologies, and assign IUPAC nomenclature.",
      "2.3.2.CS.1: Explain structure, properties, reactions, and uses of alkanes, alkenes, alkynes, benzene, alcohols, and carboxylic acids."
    ],
    "Matter and its Properties": [
      "1.1.1.CS.1: Explain atomic structure, nuclear stability, and behavior of matter using scientific practices.",
      "1.1.1.CS.2: Explain reaction energetics, enthalpy changes, and rate parameters."
    ],
    "Equilibria": [
      "1.1.2.CS.1: Apply dynamic equilibrium to chemical operations and industrial processes.",
      "1.1.2.CS.2: Analyze acid-base properties, ionization, and titration quantities."
    ],
    "Periodicity": [
      "1.2.1.CS.1: Explain periodic trends, and pattern of properties across periods and groups of elements.",
      "2.2.1.CS.1: Explain chemical patterns of the halogens and period three elements."
    ],
    "Bonding": [
      "1.2.2.CS.1: Predict and explain interatomic (ionic, covalent, metallic) and intermolecular bonding."
    ],
    "Characterisation of Organic Compounds": [
      "1.3.1.CS.1: Describe organic purification, and qualitative/quantitative elemental analysis."
    ],
    "Organic Functional Groups": [
      "1.3.2.CS.1: Classify organic compounds, explain homologies, and assign IUPAC nomenclature.",
      "2.3.2.CS.1: Explain structure, properties, reactions, and uses of alkanes, alkenes, alkynes, benzene, alcohols, and carboxylic acids."
    ]
  },
  "CRS": {
    "Background to the Study of Religion and Christianity": [
      "1.1.1.CS.1: Explain the concept of religion, recount the history and spread of Christianity, and analyze its influence on traditional beliefs in Ghana."
    ],
    "The Nature of God and His Creation": [
      "1.1.2.CS.1: Explain the nature and attributes of God from Christian and AIR viewpoints, and analyze biblical accounts of creation and the Fall."
    ],
    "The Major Beliefs of Christianity": [
      "2.2.1.CS.1: Identify core Christian doctrines, examine denominational differences, and evaluate the effects of scriptural misinterpretations."
    ],
    "Worship and Moral Values for Development": [
      "2.2.2.CS.1: Analyze Christian and traditional worship practices, and synthesize inherent moral values like humility and love."
    ],
    "Christian Music and Values for Development": [
      "3.2.3.CS.1: Describe forms of Christian music in Ghana, the influence of local traditions, and its role as a tool for national message transmission."
    ],
    "Christian Prayer and National Development": [
      "3.2.4.CS.1: Evaluate the personal/national roles of Christian prayer, critique controversial misuses, and align values with civic duties."
    ],
    "The Origin and Nature of Religious Communities": [
      "1.3.1.CS.1: Trace the historical emergence of Christian enclaves in Ghana, describing their communal characteristics and relationship with traditional society."
    ],
    "Religion and Nation Building": [
      "2.3.2.CS.1: Examine how religious communities negotiate national development, peace, and pluralistic coexistence in Ghana."
    ],
    "Religious Communities, Gender and Development": [
      "3.3.3.CS.1: Evaluate Christian teachings on and contributions of women, aligning them with international/national empowerment frameworks."
    ],
    "Religion and the Environment": [
      "1.4.1.CS.1: Assess Christian environmental stewardship values and show how they combine with traditional taboos and science to care for nature."
    ],
    "Religion and Sexual Morality": [
      "2.4.2.CS.1: Analyze Christian teachings on sexual morality and evaluate how they address contemporary relationships and abuses."
    ],
    "Religion and Fraud": [
      "3.4.3.CS.1: Describe contemporary fraudulent acts (sakawa, cybercrime) and evaluate how Christian ethical teachings address them."
    ]
  },
  "Food & Nutrition": {
    "Food For Healthy Living": [
      "1.1.1.CS.1: Demonstrate knowledge and understanding of food commodities, select and use food to meet the needs of individuals and families for healthy living.",
      "1.1.1.CS.2: Demonstrate Scientific knowledge of food nutrients and their implication to growth and development among individuals, families and the community.",
      "1.1.1.CS.3: Demonstrate Scientific knowledge in food habit/lifestyles and its implications on growth and development on individuals and families.",
      "2.1.1.CS.1: Analyse the relationship between food choices and the overall health of individuals, family members and special groups.",
      "2.1.1.CS.2: Demonstrate the ability to investigate food and nutritional interventions for managing food-related diseases at the household, community, national and global levels.",
      "2.1.1.CS.3: Demonstrate the ability to plan balanced meals that promote healthy living and meet nutritional needs.",
      "2.1.1.CS.4: Demonstrate appropriate skills in preparation, cooking and serving of meals for individuals and special groups in the family.",
      "3.1.1.CS.1: Demonstrate an understanding of the role of Ghanaian festivals and festive occasions in preserving culture, promoting sustainable nutrition and enhancing social well-being.",
      "3.1.1.CS.2: Demonstrate skills in modifying and preparing festival and festive meals for special occasions, events, and entertainment."
    ],
    "Food Security": [
      "1.1.2.CS.1: Demonstrate knowledge and understanding of how to apply the concepts of food security and its components to ensure sustainable access to nutritious food in everyday living.",
      "1.1.2.CS.2: Demonstrate knowledge and understanding of applying food storage principles to prevent food spoilage and promote food safety practices for healthy living.",
      "2.1.2.CS.1: Explain the principles and methods of food preservation and their role in ensuring food security.",
      "2.1.2.CS.2: Demonstrate the ability to apply appropriate food preservation techniques to extend the shelf life of perishable foods and promote sustainable food security practices.",
      "3.1.2.CS.1: Demonstrate knowledge and skills in appropriate packaging techniques to maintain the nutritional quality and safety of food products.",
      "3.1.2.CS.2: Develop entrepreneurial skills in creating and marketing nutritious food products that promote healthy living practices."
    ],
    "Food Production Technology": [
      "1.2.1.CS.1: Demonstrate knowledge and understanding of the types, functions and layout of food laboratories used in food production.",
      "1.2.1.CS.2: Demonstrate knowledge and understanding in innovative ways of planning and using food laboratories.",
      "2.2.1.CS.1: Demonstrate an understanding of how to apply scientific principles of heat transfer in food preparation and processing to promote food safety.",
      "2.2.1.CS.2: Demonstrate the ability to apply knowledge and principles of heat transfer to select and use appropriate cooking methods, tools, and fuels for food preparation and processing.",
      "3.2.1.CS.1: Demonstrate knowledge and understanding of sugars and apply creative and innovative sugar craft techniques to enhance the appearance and quality of confectionery products.",
      "3.2.1.CS.2: Demonstrate knowledge, understanding and skills in the application of scientific principles in developing recipes."
    ],
    "Food Processing Techniques": [
      "1.2.2.CS.1: Demonstrate knowledge, understanding, and skills in applying scientific principles to beverage production.",
      "1.2.2.CS.2: Demonstrate knowledge and understanding of the principles of nutrition and apply them to produce, enrich and fortify beverages to meet the diverse needs of individuals, families and society.",
      "2.2.2.CS.1: Demonstrate knowledge, understanding, and skills in the development and use of food additives and condiments.",
      "2.2.2.CS.2: Demonstrate knowledge, understanding and skills in the application of scientific principles in flour cookery and enrichment.",
      "3.2.2.CS.1: Demonstrate the ability to plan, organize, and manage food exhibitions and bazaars to promote food products and develop entrepreneurial and career opportunities."
    ]
  },
  "Geography": {
    "The Earth and Its Features": [
      "1.1.1.CS.1: Demonstrate understanding of Geography as a subject of study.",
      "1.1.1.CS.2: Demonstrate knowledge of the Solar System and its constituents.",
      "1.1.1.CS.3: Demonstrate knowledge and skills in describing the shape and movements of The Earth, and the effects of the earth's rotation and revolution.",
      "1.1.1.CS.4: Demonstrate skills in locating places using longitudes and latitudes.",
      "2.1.1.CS.1: Demonstrate an understanding of the internal structure of the earth and the concept of continental drift.",
      "2.1.1.CS.2: Demonstrate knowledge and understanding of landforms, their importance and the processes that leads to their creation.",
      "3.1.1.CS.1: Demonstrate knowledge and understanding of river channels and associated landforms."
    ],
    "Rocks, Weathering, Soil and Mass Wasting": [
      "1.1.2.CS.1: Demonstrate knowledge in rocks formation and weathering processes.",
      "2.1.2.CS.1: Demonstrate knowledge and understanding of soils.",
      "3.1.2.CS.1: Demonstrate knowledge of mass wasting as a geomorphic process."
    ],
    "The Earth Atmosphere": [
      "1.1.3.CS.1: Demonstrate knowledge of the structure and composition of the Earth's atmosphere and explain the terms weather and climate.",
      "2.1.3.CS.1: Demonstrate understanding of the factors that influence the elements of climate, the world climatic zones and associated vegetation types.",
      "3.1.3.CS.1: Demonstrate knowledge of climate change and its impacts on the environment and socio-economic development."
    ],
    "Maps, Their Elements and Analyses": [
      "1.2.1.CS.1: Demonstrate understanding of maps, their importance and the map scales.",
      "1.2.1.CS.2: Demonstrate knowledge and skills of representing relief features on maps.",
      "2.2.1.CS.1: Demonstrate skill in map analysis.",
      "3.2.1.CS.1: Demonstrate skills and competencies in interpreting and analysing maps."
    ],
    "Geospatial Data Collection, Representation and Interpretation": [
      "1.2.2.CS.1: Demonstrate knowledge and skills in basic geospatial data collection methods.",
      "2.2.2.CS.1: Demonstrate skills in basic geospatial data collection methods.",
      "3.2.2.CS.1: Demonstrate skills in basic geospatial data representation and interpretation using diagrams."
    ],
    "Physical Settings and People": [
      "1.3.1.CS.1: Demonstrate understanding of the physical environment of Ghana and its socio-economic importance and challenges.",
      "2.3.1.CS.1: Demonstrate skills of drawing and showing the physical setting of West Africa and Africa.",
      "3.3.1.CS.1: Demonstrate understanding of population growth and distribution, migration trends and settlement types in Ghana.",
      "3.3.1.CS.2: Analyse the population growth and migration trends in Africa and the world."
    ],
    "Economic Activities": [
      "1.3.2.CS.1: Demonstrate an understanding of the various primary economic activities in Ghana and beyond.",
      "2.3.2.CS.1: Analyse the manufacturing sector in Ghana.",
      "3.3.2.CS.1: Evaluate the tourism, trade and transport/communication sectors in Ghana."
    ],
    "Environmental Degradation": [
      "1.3.3.CS.1: Demonstrate an understanding of the causes of environmental pollution and the strategies for dealing with it.",
      "2.3.3.CS.1: Demonstrate skills of preventing or mitigating land degradation and soil pollution in Ghana.",
      "3.3.3.CS.1: Demonstrate skills in waste management in Ghana."
    ],
    "Environmental Hazards and Their Management": [
      "1.3.4.CS.1: Demonstrate understanding of the concepts 'hazard' and 'disaster'.",
      "2.3.4.CS.1: Demonstrate skills for managing earthquakes, floods, drought and fires.",
      "3.3.4.CS.1: Demonstrate knowledge and skills for preventing or mitigating desert encroachment and landslides."
    ]
  },
  "Government": {
    "Basics of Government": [
      "1.1.1.CS.1: Demonstrate understanding of the meanings, basic concepts, principles, and importance of government.",
      "2.1.1.CS.1: Demonstrate understanding and application of citizenships, rights, and responsibilities to the state.",
      "3.1.1.CS.1: Demonstrate knowledge and understanding and application of the systems of government."
    ],
    "Indigenous and Contemporary Governance in Ghana": [
      "1.1.2.CS.1: Exhibit understanding and application of the Indigenous systems of government in Ghana.",
      "2.1.2.CS.1: Demonstrate knowledge and understanding of contemporary Governance System in Ghana.",
      "3.1.2.CS.1: Compare Indigenous and contemporary Governance in Ghana."
    ],
    "Constitution and Organs of Government": [
      "1.2.1.CS.1: Demonstrate knowledge and understanding of the constitution and organs of government.",
      "2.2.1.CS.1: Demonstrate knowledge, understanding and appreciation of the organs of government.",
      "3.2.1.CS.1: Demonstrate understanding and appreciation of the 1992 Republican Constitution."
    ],
    "State and Non-State Actors in Ghana": [
      "1.2.2.CS.1: Exhibit knowledge and understanding of State-Society Relations in Ghana.",
      "2.2.2.CS.1: Demonstrate understanding and application of State-Society Relations in Ghana.",
      "3.2.2.CS.1: Evaluate State-Society Relations and Administration."
    ],
    "Ghana in the Community of Nations": [
      "1.3.1.CS.1: Demonstrate knowledge and understanding of Ghana's external relations.",
      "2.3.1.CS.1: Demonstrate knowledge and understanding of Ghana's external relations.",
      "3.3.1.CS.1: Demonstrate knowledge, understanding and appreciation of Ghana's external Relations."
    ],
    "Globalization and Development": [
      "2.3.2.CS.1: Demonstrate knowledge and understanding of globalization and development of States.",
      "3.3.2.CS.1: Demonstrate knowledge and understanding of globalization and development of States."
    ]
  },
  "History": {
    "Nature and Scope of History": [
      "1.1.1.CS.1: Demonstrate understanding of the origins, meanings, and nature of history as a discipline.",
      "1.1.1.CS.2: Exhibit knowledge on the relevance of history to human survival and development."
    ],
    "Sources and Methods of Reconstructing History": [
      "2.1.2.CS.1: Develop application of skills in analysing and interpreting primary and secondary sources.",
      "3.1.2.CS.1: Demonstrate the application of skills in interpreting and reconstructing the past."
    ],
    "Emergence of Complex States": [
      "1.2.1.CS.1: Demonstrate understanding of Pre-Historic Ghana. (50, 000 BCE to 700 CE)",
      "1.2.1.CS.2: Demonstrate understanding of the diverse accounts of the emergence of major states in Ghana, including the causes of migration and creation of settlements.",
      "1.2.1.CS.3: Demonstrate knowledge of the complex social, political, and scientific systems of selected states and kingdoms in Ghana."
    ],
    "Emergence of Complex States and Societies": [
      "3.2.1.CS.1: Demonstrate understanding of African Pre-History from the Earliest Times to 500 BCE and appreciate the unique features of the complex African civilisations."
    ],
    "Pre-Colonial Economy and Economic Activities": [
      "1.2.2.CS.1: Demonstrate knowledge and understanding of pre-colonial economy and economic activities in Ghana.",
      "3.2.2.CS.1: Demonstrate understanding of the origins, organisation, and impact of the Trans-Saharan Trade"
    ],
    "Religion and Religious Change": [
      "1.3.1.CS.1: Demonstrate understanding of the religious change and continuity in Ghana.",
      "3.3.1.CS.1: Demonstrate understanding of the religious change and continuity in Africa."
    ],
    "Global Connections": [
      "2.3.2.CS.1: Exhibit knowledge and understanding of the advent of European presence and activities along the coast of Ghana",
      "3.3.2.CS.1: Demonstrate understanding of the advent and impact of the Trans-Atlantic Slave Trade in Africa."
    ],
    "Prelude to Colonisation and Colonial Rule": [
      "2.3.3.CS.1: Demonstrate understanding of the processes leading to the establishment of British rule in the Gold Coast and the impact on the people of Ghana.",
      "3.3.3.CS.1: Demonstrate understanding of how the Europeans scrambled for and partitioned Africa and how Africans were eventually drawn into the two World Wars."
    ],
    "Response to Colonial Rule": [
      "2.3.4.CS.1: Demonstrate understanding of the nature and activities of Nationalist Movements including their efforts in resisting colonial domination in the Gold Coast.",
      "3.3.4.CS.1: Demonstrate understanding of Africans’ resistance against colonial rule."
    ],
    "Socio-Economic and Political Developments in Ghana (1957 - 2007)": [
      "2.4.1.CS.1: Demonstrate understanding of the socio-economic and political developments in Ghana from 1957 - 2007."
    ]
  }
};

export const STANDARD_INDICATORS: Record<string, string[]> = {
  // Chemistry Standard Indicators
  "1.1.1.CS.1: Explain atomic structure, nuclear stability, and behavior of matter using scientific practices.": [
    "1.1.1.LI.1: Describe chemical processes around us, and their applications in everyday life (food, agriculture, medicine, energy).",
    "1.1.1.LI.2: Discuss and explain safety rules and hazard symbols (corrosive, toxic, flammable) in the chemistry laboratory.",
    "1.1.1.LI.3: Explain why chemicals should be stored by compatibility rather than alphabetically.",
    "1.1.1.LI.4: Describe the steps involved in the scientific method of inquiry.",
    "1.1.1.LI.5: State the main postulates of Dalton's atomic theory and describe its historical weaknesses.",
    "1.1.1.LI.6: Describe cathode rays and alpha scattering experiments, explaining weaknesses in J. J. Thomson and Rutherford's models.",
    "1.1.1.LI.7: Describe Bohr's planetary theory and explain the importance of quantum numbers to electronic structures.",
    "1.1.1.LI.8: Apply properties of solids, liquids, and gases under the kinetic theory of matter to distinguish states.",
    "1.1.1.LI.9: Perform calculations on gas behavior using Boyle's, Charles', Gay-Lussac's, and the combined gas laws.",
    "1.1.1.LI.10: State Graham's law of diffusion and Dalton's law of partial pressures and perform calculations from experimental data.",
    "1.1.1.LI.11: Distinguish ideal and real gas deviations using the van der Waals equation.",
    "1.1.1.LI.12: Describe laboratory preparation and tests for hydrogen, ammonia, and carbon (IV) oxide gases."
  ],
  "1.1.1.CS.2: Explain reaction energetics, enthalpy changes, and rate parameters.": [
    "1.1.1.LI.13: Explain chemical energy, endothermic/exothermic profiles, and state standard enthalpy definitions (formation, combustion).",
    "1.1.1.LI.14: Calculate reaction enthalpy changes using calorimetry relationships (q = mcΔT) and experimental results.",
    "1.1.1.LI.15: State Hess's law of constant heat summation and construct energy cycles to determine unknown enthalpies.",
    "1.1.1.LI.16: Use Born-Haber cycles to calculate lattice energy, electron affinity, and ionization energy properties.",
    "1.1.1.LI.17: Discuss bond energy as a measure of bond strength and calculate reaction enthalpies.",
    "1.1.1.LI.18: Define rate of reaction and explain methods for measuring rates (initial, average, and instantaneous rates).",
    "1.1.1.LI.19: Investigate experimental factors affecting reaction rates (concentration, surface area, temperature, catalyst).",
    "1.1.1.LI.20: State collision theory principles and sketch Maxwell-Boltzmann energy distribution curves.",
    "1.1.1.LI.21: Construct rate equations (r = k[A]^x[B]^y) from experimental tables and determine order of reactions."
  ],
  "1.1.2.CS.1: Apply dynamic equilibrium to chemical operations and industrial processes.": [
    "1.1.2.LI.1: Explain dynamic equilibrium state, write reversibility models, and perform calculations on initial/equilibrium concentration lists.",
    "1.1.2.LI.2: State Le Chatelier's Principle and deduce qualitative shifts from stress factors (concentration, temperature, pressure).",
    "1.1.2.LI.3: Apply dynamic equilibrium and reaction rates to evaluate commercial efficiency in the Haber and Contact processes.",
    "1.1.2.LI.4: Establish mathematical relationships between Kp and Kc using the ideal gas law and calculate Ksp values."
  ],
  "1.1.2.CS.2: Analyze acid-base properties, ionization, and titration quantities.": [
    "1.1.2.LI.5: Explain Arrhenius, Bronsted-Lowry, and Lewis concepts of acids and bases, highlighting strengths and constraints.",
    "1.1.2.LI.6: Differentiate strong/weak acids and bases using extent of dissociation, conductivity, pH, and neutralization values.",
    "1.1.2.LI.7: Describe physical and chemical reactions of acids/bases with metals, carbonates, basic oxides, and ammonium salts.",
    "1.1.2.LI.8: Differentiate acidic, basic, normal, double, hydrated, and complex salts and list their domestic/industrial uses.",
    "1.1.2.LI.9: Perform acid-base titrations (including back titrations and double-indicator systems) to determine unknown quantities.",
    "1.1.2.LI.10: Define pH and pOH, convert hydrogen ion concentrations, and discuss ionic product of water (Kw).",
    "1.1.2.LI.11: State the concept of salt hydrolysis and predict acidity/alkalinity for different salt groups.",
    "1.1.2.LI.12: Draw standard acid-base titration curves and select appropriate indicators (methyl orange, phenolphthalein)."
  ],
  "1.2.1.CS.1: Explain periodic trends, and pattern of properties across periods and groups of elements.": [
    "1.2.1.LI.1: Use electron configuration to classify elements into s, p, and d blocks and find positions in the periodic table.",
    "1.2.1.LI.2: Explain trends in periodic properties (atomic radius, ionic radius, ionization energy, electronegativity).",
    "1.2.1.LI.3: Account for discrepancies/anomalies in periodic trends with respect to beryllium, boron, oxygen, and nitrogen.",
    "1.2.1.LI.4: Describe trends in physical and chemical properties of period 3 elements and their compounds (hydrides, oxides, chlorides).",
    "1.2.1.LI.5: Study thermal stability trends under heat tests on period 2 and 3 nitrates/carbonates."
  ],
  "1.2.2.CS.1: Predict and explain interatomic (ionic, covalent, metallic) and intermolecular bonding.": [
    "1.2.2.LI.1: Distinguish chemical bonding categories (ionic, covalent, metallic) and describe properties of their compounds.",
    "1.2.2.LI.2: Explain factors influencing ionic bond formation (ionization energy, lattice energy) and model NaCl crystal lattice structure.",
    "1.2.2.LI.3: Model covalent bond categories (simple, coordinate/dative, polar) using Lewis dot structures.",
    "1.2.2.LI.4: Explain orbital mixing and hybridization (sp, sp2, sp3, sp3d, sp3d2) to predict molecular shapes and bond angles using VSEPR.",
    "1.2.2.LI.5: Explain intermolecular forces (dipole-dipole, van der Waals, hydrogen bonding) and analyze factors affecting their strengths.",
    "1.2.2.LI.6: Relate intermolecular forces to variations in physical properties (solubility, boiling points, viscosity)."
  ],
  "2.2.1.CS.1: Explain chemical patterns of the halogens and period three elements.": [
    "2.2.1.LI.1: Detail physical and chemical properties of Group 17 halogens (physical state, electronegativity differences, bond energy curves).",
    "2.2.1.LI.2: Describe displacement and precipitation reactions of h halides/halogens to compare standard electrode potentials.",
    "2.2.1.LI.3: Discuss acid strength trends, Ka values, and thermal stability of hydrogen halides.",
    "2.2.1.LI.4: Write electron configurations of first-row transition elements and describe their characteristics (variable oxidation, color, complexes, catalysis).",
    "2.2.1.LI.5: Use molecular models/reagents to analyze geometry and coordination circles of first-row complex ions."
  ],
  "1.3.1.CS.1: Describe organic purification, and qualitative/quantitative elemental analysis.": [
    "1.3.1.LI.1: Outline techniques to purify organic solids and liquids (distillation, crystallization, chromatography).",
    "1.3.1.LI.2: Explain qualitative tests and perform mass composition calculations for carbon, hydrogen, nitrogen, sulfur, and halogens in organic compounds.",
    "1.3.1.LI.3: Interpret paper chromatography sheets and Rf values to index purity of organic extracts."
  ],
  "1.3.2.CS.1: Classify organic compounds, explain homologies, and assign IUPAC nomenclature.": [
    "1.3.2.LI.1: Distinguish organic vs inorganic compounds and categorize structures (aliphatic, cyclic, heterocyclic, aromatic).",
    "1.3.2.LI.2: Explain homologous series characteristics, general formulas, and various representations (molecular, structural, condensed).",
    "1.3.2.LI.3: Define structural and stereoisomerism (chain, positional, functional, geometrical cis-trans isomerism).",
    "1.3.2.LI.4: Apply IUPAC rules to name and draw parent alkanes, alkenes, alkynes, and their branched structures up to six carbons."
  ],
  "2.3.2.CS.1: Explain structure, properties, reactions, and uses of alkanes, alkenes, alkynes, benzene, alcohols, and carboxylic acids.": [
    "2.3.2.LI.1: Discuss source, naming, low reactivity, combustion reactions, and free-radical substitution mechanisms of alkanes.",
    "2.3.2.LI.2: Describe preparation and addition reactions of alkenes and alkynes, applying Markovnikov's rule.",
    "2.3.2.LI.3: Describe structure, resonance/stability, and electrophilic substitution reactions of benzene (nitration, halogenation, Friedel-Crafts).",
    "2.3.2.LI.4: Explain industrial production, classification, dehydration/esterification, and characteristic tests (Lucas/iodoform) of alcohols.",
    "2.3.2.LI.5: Explain structure, synthesis, acidity factors, and organic salt/ester reactions of alkanoic (carboxylic) acids.",
    "2.3.2.LI.6: Describe preparation, properties, nucleophilic substitution mechanisms, and commercial uses of alkanoic acid derivatives (esters, amides).",
    "2.3.2.LI.7: Detail fats and oils structure as triglycerides, describe saponification, and contrast properties of soapy vs soapless detergents.",
    "2.3.2.LI.8: Define polymers and map addition vs condensation paths (producing nylon-6,6 or terylene) alongside plastic pollution remedies.",
    "2.3.2.LI.9: Describe molecular structures/bonding of amino acids, proteins, and carbohydrates, performing diagnostic tests (Fehling's, Biuret)."
  ],
  // CRS Standard Indicators
  "1.1.1.CS.1: Explain the concept of religion, recount the history and spread of Christianity, and analyze its influence on traditional beliefs in Ghana.": [
    "1.1.1.LI.1: Explain the concept of religion from learners' perspectives, classical definitions (Emile Durkheim, Edward Tylor, Paul Tillich), and misconceptions.",
    "1.1.1.LI.2: Discuss the characteristics of religion and categorize ways in which definitions of religion are classified (theological, sociological, psychological, moral).",
    "1.1.1.LI.3: Justify the need to study religion at SHS, detailing reasons (moral development, civic responsibility, interfaith harmony) and career avenues.",
    "1.1.1.LI.4: Recount the global origins of Christianity and trace its historical backgrounds in Ghana (Portuguese arrival, missionary groups).",
    "1.1.1.LI.5: State the contributions of indigenous agents such as Philip Quaque and the role of mission schools/churches in nation-building.",
    "1.1.1.LI.6: Contrast African Indigenous Religion (AIR) before European contact and assess the areas of conflict, convergence, and blending with Christianity."
  ],
  "1.1.2.CS.1: Explain the nature and attributes of God from Christian and AIR viewpoints, and analyze biblical accounts of creation and the Fall.": [
    "1.1.2.LI.1: Explain the Father, Son, and Holy Spirit as the Christian concept of Trinity with scriptural references.",
    "1.1.2.LI.2: Explain how the natural environment reveals God's character (orderliness, care, beauty, design, peace, mystery) in Christianity and AIR.",
    "1.1.2.LI.3: Analyze unique attributes of God (omniscience, omnipotence, omnipresence) and attributes of God found in humans (mercy, holiness, justice).",
    "1.1.2.LI.4: Examine theological approaches and debates over God's nature (the problem of evil, personal vs impersonal God).",
    "1.1.2.LI.5: Contrast Christianity and other religions' views of God, and discuss how moral values in divine attributes apply to life.",
    "1.1.2.LI.6: Analyze and compare the Priestly and Yahwist accounts of creation (Genesis 1-2) with scientific theories like the Big Bang or evolution.",
    "1.1.2.LI.7: Discuss the original close relationship between God and humankind, trace the temptation/disobedience in Genesis 3, and examine the origin of sin.",
    "1.1.2.LI.8: Critically examine philosophical tensions (free will vs. determinism, justice vs. mercy) and compare how AIR accounts handle the origin of sin/moral failure."
  ],
  "2.2.1.CS.1: Identify core Christian doctrines, examine denominational differences, and evaluate the effects of scriptural misinterpretations.": [
    "2.2.1.LI.1: Describe major Christian beliefs, the second coming of Jesus, resurrection, judgment, and the doctrinal significance of holy scriptures.",
    "2.2.1.LI.2: Interrogate differences in denominational interpretations of Christian beliefs (Catholicism vs. Protestantism, baptism, sacraments, tithing, role of women).",
    "2.2.1.LI.3: Assess the personal and social effects of scriptural misinterpretations (misrepresenting 'God will provide' to excuse laziness, or misinterpreting 'generational curses').",
    "2.2.1.LI.4: Examine how African traditional witchcraft beliefs, spiritual protective objects, and musical expressions influenced Ghanaian Christianity."
  ],
  "2.2.2.CS.1: Analyze Christian and traditional worship practices, and synthesize inherent moral values like humility and love.": [
    "2.2.2.LI.1: Explain how Christian worship is performed in Ghana, highlighting liturgical, charismatic, musical, prayer, and preaching styles.",
    "2.2.2.LI.2: Compare traditional and contemporary worship elements (prayer, praise, giving, sacraments, deliverance) across major denominations.",
    "2.2.2.LI.3: Synthesise moral values inherent in Christian worship (humility, gratitude, forgiveness, love, obedience) and apply them to life dilemmas."
  ],
  "3.2.3.CS.1: Describe forms of Christian music in Ghana, the influence of local traditions, and its role as a tool for national message transmission.": [
    "3.2.3.LI.1: Identify the nature and different forms of Christian music in Ghana (classical hymns, choral anthems, traditional/charismatic praise, urban gospel).",
    "3.2.3.LI.2: Describe how churches in Ghana have incorporated local language, musical rhythms, instruments, and traditional proverbs.",
    "3.2.3.LI.3: Assess the spiritual, emotional, doctrinal, and community-unifying functions of gospel music in Ghanaian society.",
    "3.2.3.LI.4: Propose how Christian music serves as a tool for moral education, social cohesion, cultural preservation, and national campaigns/messaging."
  ],
  "3.2.4.CS.1: Evaluate the personal/national roles of Christian prayer, critique controversial misuses, and align values with civic duties.": [
    "3.2.4.LI.1: Examine scriptural foundations and forms of prayer (silent, spontaneous, liturgical) used across different Christian denominations.",
    "3.2.4.LI.2: Evaluate the practice of Christian prayer at state and secular events, and explore issues of religious pluralism and constitutional neutrality.",
    "3.2.4.LI.3: Critique the misuse and abuse of Christian prayer (imprecatory prayer for harm, commercialisation of prayer, or public showy displays)."
  ],
  "1.3.1.CS.1: Trace the historical emergence of Christian enclaves in Ghana, describing their communal characteristics and relationship with traditional society.": [
    "1.3.1.LI.1: Trace the circumstances that led to the creation of separate Christian enclaves (Abokobi, Osu Salems, Akropong) in Ghana.",
    "1.3.1.LI.2: Describe core characteristics of early Christian communities (unity, love, fellowship, moral living, biblical foundations in Acts 2).",
    "1.3.1.LI.3: Compare early community characteristics with traditional society relating to authority, dress, work conduct, and membership regulations."
  ],
  "2.3.2.CS.1: Examine how religious communities negotiate national development, peace, and pluralistic coexistence in Ghana.": [
    "2.3.2.LI.1: Examine the traditional and evolving roles of Christian communities in addressing education, healthcare, and peacebuilding.",
    "2.3.2.LI.2: Explain the concept of religious pluralism, contrasting it with exclusivism and inclusivism in pluralistic Ghanaian towns.",
    "2.3.2.LI.3: Analyze opportunities and challenges of religious nationalism and investigate real-life examples (Chief Imam's visit to a Catholic church, inter-religious marriages)."
  ],
  "3.3.3.CS.1: Evaluate Christian teachings on and contributions of women, aligning them with international/national empowerment frameworks.": [
    "3.3.3.LI.1: Identify key scriptures affirming the dignity and spiritual equality of women (Genesis 1:27, Galatians 3:28) and rebut patriarchal misinterpretations.",
    "3.3.3.LI.2: Assess the vital roles and financial contributions of key women during Jesus' ministry, the resurrection witnesses, and in the early Church (Lydia, Phoebe, Priscilla).",
    "3.3.3.LI.3: Describe the traditional and leadership roles of women in modern churches, and identify ways religious teachings have historically constrained females.",
    "3.3.3.LI.4: Examine structural alignments between Christian values and (inter)national frameworks for women's empowerment (UN SDG 5, Ghana's Affirmative Action Act)."
  ],
  "1.4.1.CS.1: Assess Christian environmental stewardship values and show how they combine with traditional taboos and science to care for nature.": [
    "1.4.1.LI.1: Identify negative human activities affecting the environment (deforestation, galamsey/illegal mining, plastic waste) and suggest recovery options.",
    "1.4.1.LI.2: Describe biblical teachings on environment care, creation stewardship, and Christian values applied to ecological preservation.",
    "1.4.1.LI.3: Comparatively analyze overlaps between Christian stewardship and traditional African practices (sacred groves, taboos) on nature preservation."
  ],
  "2.4.2.CS.1: Analyze Christian teachings on sexual morality and evaluate how they address contemporary relationships and abuses.": [
    "2.4.2.LI.1: Examine the concept of sexual morality, contrasting traditional religious and contemporary secular viewpoints in Ghana.",
    "2.4.2.LI.2: Describe various forms of contemporary sexual behaviors (sexting, cohabitation, hookup, revenge porn) and their social implications.",
    "2.4.2.LI.3: Analyze Christian teachings on chastity, fidelity, purity, and self-discipline to prevent sexual abuse, exploitation, and stigmatisation."
  ],
  "3.4.3.CS.1: Describe contemporary fraudulent acts (sakawa, cybercrime) and evaluate how Christian ethical teachings address them.": [
    "3.4.3.LI.1: Describe contemporary fraudulent practices (SIM box fraud, sakawa, phishing, mobile money scams) and their emotional/economic impacts.",
    "3.4.3.LI.2: Explain scriptural instructions against fraud (dishonest weights, stealing) and define the roles of conscience, repentance, and restitution.",
    "3.4.3.LI.3: Discuss how Christian ethical values (honesty, accountability, stewardship) can be practically applied in schools, workplaces, and communities."
  ],
  // Food & Nutrition Standard Indicators
  "1.1.1.CS.1: Demonstrate knowledge and understanding of food commodities, select and use food to meet the needs of individuals and families for healthy living.": [
    "1.1.1.LI.1: Explain basic concepts in food and nutrition and their implication to healthy living.",
    "1.1.1.LI.2: Classify food commodities under the various food groups to enhance food selection and utilisation.",
    "1.1.1.LI.3: Analyse ways convenience foods can be processed and used to promote healthy nutritional practice in households.",
    "1.1.1.LI.4: Analyse the effect of heat on the nutritional values of the various food commodities."
  ],
  "1.1.1.CS.2: Demonstrate Scientific knowledge of food nutrients and their implication to growth and development among individuals, families and the community.": [
    "1.1.1.LI.5: Identify food nutrients and their effects on growth and development in the body (proteins, carbohydrates, fats/lipids, vitamins, minerals, water).",
    "1.1.1.LI.6: Discuss the effects of nutrient deficiencies on growth and development of the individual, family and society (Kwashiorkor, Marasmus, scurvy, etc.)."
  ],
  "1.1.1.CS.3: Demonstrate Scientific knowledge in food habit/lifestyles and its implications on growth and development on individuals and families.": [
    "1.1.1.LI.7: Discuss food habits/ lifestyles and their implications on the nutritional status of individuals, families and societies (eating frequency, balanced diet).",
    "1.1.1.LI.8: Analyse factors that influence food habits/ lifestyle practices in daily nutrition (geographical, cultural, technological, religious, economic, etc.)."
  ],
  "2.1.1.CS.1: Analyse the relationship between food choices and the overall health of individuals, family members and special groups.": [
    "2.1.1.LI.1: Explain the importance of consuming a balanced diet for maintaining good health (proteins, vitamins, minerals, and water functions).",
    "2.1.1.LI.2: Identify dietary-related diseases and their causes among individuals, families and the community (obesity, diabetes, hypertension, malnutrition).",
    "2.1.1.LI.3: Analyse the effects of excessive consumption of processed foods and sugary drinks on health."
  ],
  "2.1.1.CS.2: Demonstrate the ability to investigate food and nutritional interventions for managing food-related diseases at the household, community, national and global levels.": [
    "2.1.1.LI.4: Explain basic concepts of nutritional interventions (dietary diversification, school feeding programs, nutrition education, supplementation).",
    "2.1.1.LI.5: Examine household and community-based food and nutritional interventions supporting individuals, families and societies to manage dietary related diseases.",
    "2.1.1.LI.6: Apply basic research skills (interviews, questionnaires) to assess the impact and challenges of household-based and community-based food and nutritional interventions."
  ],
  "2.1.1.CS.3: Demonstrate the ability to plan balanced meals that promote healthy living and meet nutritional needs.": [
    "2.1.1.LI.7: Demonstrate appropriate cooking methods that help retain nutrients in food to promote healthy living (steaming, grilling, poaching, boiling).",
    "2.1.1.LI.8: Develop a meal plan that meets the nutritional needs of individuals and families (toddlers, adolescents, pregnant/lactating mothers, manual workers, sedentary).",
    "2.1.1.LI.9: Plan special meals to support groups of individuals suffering from dietary related diseases (hypertensive, diabetic, anaemic) in the family."
  ],
  "2.1.1.CS.4: Demonstrate appropriate skills in preparation, cooking and serving of meals for individuals and special groups in the family.": [
    "2.1.1.LI.10: Prepare and cook balanced meals that meet the dietary needs of special groups in the family (toddlers, adolescents, pregnant/lactating mothers, invalids).",
    "2.1.1.LI.11: Apply proper serving techniques and table-setting skills suitable for different individuals and special groups (basic, formal, buffet table settings)."
  ],
  "3.1.1.CS.1: Demonstrate an understanding of the role of Ghanaian festivals and festive occasions in preserving culture, promoting sustainable nutrition and enhancing social well-being.": [
    "3.1.1.LI.1: Describe major Ghanaian festivals and their associated traditional foods (Religious, Cultural, Harvest, National festivals).",
    "3.1.1.LI.2: Analyse the role of traditional foods in promoting sustainable nutrition and their impact on healthy living (balanced diet, medicinal/healing properties).",
    "3.1.1.LI.3: Analyse how traditional festive meals can be modified for improved health benefits and sustainability (reducing excess salt and oil, eco-friendly cooking).",
    "3.1.1.LI.4: Examine the social and communal benefits of festive and festivals dishes in strengthening relationships and enhancing overall well-being."
  ],
  "3.1.1.CS.2: Demonstrate skills in modifying and preparing festival and festive meals for special occasions, events, and entertainment.": [
    "3.1.1.LI.5: Plan festive and festivals meals suitable for various occasions or events (dinners, cocktails, luncheons, tea parties).",
    "3.1.1.LI.6: Prepare and cook dishes for festive/festivals/occasions/events (cakes, jollof rice, fries with sauces) and display for peer feedback."
  ],
  "1.1.2.CS.1: Demonstrate knowledge and understanding of how to apply the concepts of food security and its components to ensure sustainable access to nutritious food in everyday living.": [
    "1.1.2.LI.1: Explain the concept of food security and the implication of its components (availability, affordability, accessibility, safety, stability) in everyday living.",
    "1.1.2.LI.2: Analyse the factors influencing food security at the household and national levels (socio-economic, environmental, and political factors)."
  ],
  "1.1.2.CS.2: Demonstrate knowledge and understanding of applying food storage principles to prevent food spoilage and promote food safety practices for healthy living.": [
    "1.1.2.LI.3: Explain the concept and principles of food storage and their role in preventing food spoilage (dry, refrigerated, frozen storage, FIFO).",
    "1.1.2.LI.4: Discuss the causes of food spoilage and its implication for food safety (microbial spoilage, enzymatic activity, chemical reactions, physical factors).",
    "1.1.2.LI.5: Demonstrate appropriate food handling, storage and hygiene practices to minimise contamination and ensure food safety (storing fish, onion, mango, banana, beans)."
  ],
  "2.1.2.CS.1: Explain the principles and methods of food preservation and their role in ensuring food security.": [
    "2.1.2.LI.1: Describe the principles of food preservation and how they help maintain food quality and safety (prevention of microbial growth, moisture control, acidity, oxidation).",
    "2.1.2.LI.2: Describe the various food preservation methods and their effectiveness in extending food shelf life (freezing, canning, drying, salting, sugaring, pickling).",
    "2.1.2.LI.3: Differentiate between various food preservation methods such as drying, freezing, fermentation and canning."
  ],
  "2.1.2.CS.2: Demonstrate the ability to apply appropriate food preservation techniques to extend the shelf life of perishable foods and promote sustainable food security practices.": [
    "2.1.2.LI.4: Demonstrate the application of appropriate food preservation methods (marmalade, jam, pickles, shito) to support sustainable food security.",
    "2.1.2.LI.5: Package and store preserved food under suitable conditions to maintain quality and safety (vapour proof, grease proof, waterproof, glass, vacuum, etc.).",
    "2.1.2.LI.6: Apply appropriate eco-friendly packaging methods (biodegradable, edible packaging, beeswax wraps, glass) to enhance preservation and minimise waste."
  ],
  "3.1.2.CS.1: Demonstrate knowledge and skills in appropriate packaging techniques to maintain the nutritional quality and safety of food products.": [
    "3.1.2.LI.1: Explain the role of food packaging in maintaining nutritional quality, hygiene and food safety (barrier against contaminants, temperature, moisture).",
    "3.1.2.LI.2: Apply appropriate eco-friendly packaging methods (compostable, beeswax, glass, bioplastics) to enhance food preservation and design prototypes."
  ],
  "3.1.2.CS.2: Develop entrepreneurial skills in creating and marketing nutritious food products that promote healthy living practices.": [
    "3.1.2.LI.3: Identify business opportunities in food production that support healthy eating habits and sustainable nutrition (agricultural production, retail, catering).",
    "3.1.2.LI.4: Develop, package and market a nutritious food product that aligns with consumer health needs and industry standards, and perform break-even analyses."
  ],
  "1.2.1.CS.1: Demonstrate knowledge and understanding of the types, functions and layout of food laboratories used in food production.": [
    "1.2.1.LI.1: Discuss the concept of food laboratories and their functions in food production (kitchens, microbiological, chemical, sensory evaluation laboratories).",
    "1.2.1.LI.2: Discuss the types of kitchen laboratories layout and their implication in food production (single-line, L-shaped, U-shaped, island, parallel layouts)."
  ],
  "1.2.1.CS.2: Demonstrate knowledge and understanding in innovative ways of planning and using food laboratories.": [
    "1.2.1.LI.3: Evaluate the factors that affect the planning and layout of food laboratories (purpose, infrastructure, equipment, space, safety, socio-cultural, budget).",
    "1.2.1.LI.4: Suggest ways of re-designing/ renovation/refurbishment of a food laboratory to enhance the functions of various areas within the laboratory.",
    "1.2.1.LI.5: Discuss ways of ensuring hygiene in the food laboratory (personal hygiene, food hygiene, environmental hygiene)."
  ],
  "2.2.1.CS.1: Demonstrate an understanding of how to apply scientific principles of heat transfer in food preparation and processing to promote food safety.": [
    "2.2.1.LI.1: Discuss the various methods of food preparation and processing that apply principles of heat transfer (conduction, convection, radiation).",
    "2.2.1.LI.2: Relate the various principles of heat transfer (conduction on stovetop, oven convection, radiation grilling/microwaving) to cooking methods."
  ],
  "2.2.1.CS.2: Demonstrate the ability to apply knowledge and principles of heat transfer to select and use appropriate cooking methods, tools, and fuels for food preparation and processing.": [
    "2.2.1.LI.3: Discuss the different methods of food preparation and processing to promote sustainable food safety practices (Upcycling food scraps, composting, portion control).",
    "2.2.1.LI.4: Analyse the challenges of applying the various heat transfer principles in food preparation and processing (uneven heat distribution, energy consumption, safety)."
  ],
  "3.2.1.CS.1: Demonstrate knowledge and understanding of sugars and apply creative and innovative sugar craft techniques to enhance the appearance and quality of confectionery products.": [
    "3.2.1.LI.1: Discuss the types, properties and functions of sugars/sweeteners (granulated, cubes, liquid, powder) in food production and sugar craft.",
    "3.2.1.LI.2: Demonstrate the application of creative and innovative sugar craft techniques to design and decorate confectionery products (fondant, royal, butter icing)."
  ],
  "3.2.1.CS.2: Demonstrate knowledge, understanding and skills in the application of scientific principles in developing recipes.": [
    "3.2.1.LI.3: Explain the scientific principles involved in recipe development (protein, carbohydrate, fat interactions, moist/dry/combination cooking methods).",
    "3.2.1.LI.4: Develop and modify recipes using scientific principles to improve taste, texture, nutritional content and presentation (réchauffé/leftover design rules)."
  ],
  "1.2.2.CS.1: Demonstrate knowledge, understanding, and skills in applying scientific principles to beverage production.": [
    "1.2.2.LI.1: Discuss the types of beverages and their uses (alcoholic vs non-alcoholic: stimulants, nourishing, refreshing, hydration, nutrition, energy).",
    "1.2.2.LI.2: Explain the scientific principles involved in the selection, processing, and preservation of beverages (cleanliness, safety, temperature control, tannin extraction)."
  ],
  "1.2.2.CS.2: Demonstrate knowledge and understanding of the principles of nutrition and apply them to produce, enrich and fortify beverages to meet the diverse needs of individuals, families and society.": [
    "1.2.2.LI.3: Analyse how to enrich or fortify beverages with vitamins, minerals, proteins, and plant extracts to meet nutrition needs.",
    "1.2.2.LI.4: Conduct experiments to produce non-alcoholic beverages using local food commodities (sobolo leaves, prekese, turkey berry) to meet nutritional needs.",
    "1.2.2.LI.5: Evaluate how scientific principles influence alcoholic beverage production (biochemical fermentation, physical distillation, aging/maturation) using local food commodities."
  ],
  "2.2.2.CS.1: Demonstrate knowledge, understanding, and skills in the development and use of food additives and condiments.": [
    "2.2.2.LI.1: Distinguish between food additives (naturally/artificially produced stocks, mixed spices) and condiments (vinegar, ketchup, mustard, ground ginger).",
    "2.2.2.LI.2: Conduct experiments to develop natural colours from natural food sources (beetroot, turmeric, karadafa leaves).",
    "2.2.2.LI.3: Prepare food additives and condiments from local food sources and label them (prekese, turkey berry, aniseed/rosemary, karadafa powder)."
  ],
  "2.2.2.CS.2: Demonstrate knowledge, understanding and skills in the application of scientific principles in flour cookery and enrichment.": [
    "2.2.2.LI.4: Explain the scientific principles underlying flour cookery, including gluten formation, gelatinisation and leavening (yeast, baking powder, baking soda).",
    "2.2.2.LI.5: Discuss the basic ingredients used in flour cookery (flour structure, fat tenderness, sugar sweetening/coloring, egg value/raising).",
    "2.2.2.LI.6: Apply appropriate techniques to improve the texture and nutritional value of flour-based products through enrichment and fortification.",
    "2.2.2.LI.7: Evaluate the quality of different flour products based on texture, appearance and nutritional composition."
  ],
  "3.2.2.CS.1: Demonstrate the ability to plan, organize, and manage food exhibitions and bazaars to promote food products and develop entrepreneurial and career opportunities.": [
    "3.2.2.LI.1: Plan and organise a food exhibition or bazaar to showcase newly developed food products to target consumers (objectives, target audience, venue selection, budget).",
    "3.2.2.LI.2: Apply marketing and promotional strategies to attract consumers and enhance the visibility of food products (pre-event promotion, booth design, free sampling, pricing).",
    "3.2.2.LI.3: Explore career opportunities in the food industry (nutrition/dietetics, food science, culinary services, agribusness development, R&D).",
    "3.2.2.LI.4: Discuss work ethics in the food industry, highlighting qualities like punctuality, honesty, reliability, and hygiene practices."
  ],
  // Business Management Standard Indicators
  "1.1.1.CS.1: Demonstrate functional knowledge and understanding of business and its various forms of ownership.": [
    "1.1.1.LI.1: Explain business, its objectives, discuss its role in society, and classify its different forms.",
    "1.1.1.LI.2: Examine the features of sole proprietorship business, identify its benefits, challenges and sources of funding.",
    "1.1.1.LI.3: Discuss partnership business, its features, deed, formation, benefits, challenges and sources of funding.",
    "1.1.1.LI.4: Describe a company and discuss its features, types, the procedure for registration, benefits, challenges and sources of funding.",
    "1.1.1.LI.5: Examine State-owned enterprises, their features, types, benefits, challenges and sources of funding."
  ],
  "1.1.2.CS.1: Demonstrate knowledge and understanding of the basic functions of management.": [
    "1.1.2.LI.1: Explain management, its levels and skills",
    "1.1.2.LI.2: Differentiate between management and administration and identify the career paths in business management",
    "1.1.2.LI.3: Explain planning, its tools, processes, benefits and limitations.",
    "1.1.2.LI.4: Explain the concept of organising, its principles, importance and describe organisational structures.",
    "1.1.2.LI.5: Describe departmentalisation, its types and explain the reasons, benefits and challenges of dividing an organisation into distinct units.",
    "1.1.2.LI.6: Differentiate between centralisation and decentralisation and examine their advantages and disadvantages",
    "1.1.2.LI.7: Explain leadership, its various styles/forms, sources of power in leadership and the importance of effective leadership.",
    "1.1.2.LI.8: Discuss emotional intelligence, leadership skill development, and conflict management, and relate these concepts to effective leadership practices.",
    "1.1.2.LI.9: Explain controlling, its types, processes, tools and importance."
  ],
  "2.1.2.CS.1: Demonstrate knowledge, understanding and application of decision-making skills in organisations.": [
    "2.1.2.LI.1: Explain decision-making, its importance, types and tools.",
    "2.1.2.LI.2: Identify management levels and the decisions they make and analyse the steps in the decision-making process."
  ],
  "2.1.2.CS.2: Demonstrate knowledge and understanding of delegation.": [
    "2.1.2.LI.1: Explain delegation and outline its principles and steps involved in the process of delegation.",
    "2.1.2.LI.2: Identify the benefits of delegation, its limitations and ways of making it effective"
  ],
  "2.1.2.CS.3: Demonstrate understanding and application of effective communication skills in organisations.": [
    "2.1.2.LI.1: Explain business communication, its importance, processes and forms/types.",
    "2.1.2.LI.2: Explain the channels of business communication, the barriers and ways of making communication effective."
  ],
  "2.1.3.CS.4: Demonstrate knowledge and understanding of Human Resource Management.": [
    "2.2.3.LI.1: Explain Human Resource Management, its functions and describe the processes involved in recruitment and selection.",
    "2.2.3.LI.2: Explain the components of Performance Management and its importance.",
    "2.2.3.LI.3: Explain Labour and Industrial relations including Collective bargaining processes."
  ],
  "3.1.2.CS.1: Demonstrate knowledge and understanding of production management.": [
    "3.1.2.LI.1: Explain the functions of Production Management and identify the main forms of production.",
    "3.1.2.LI.2: Describe the types of production and the steps in production planning and control."
  ],
  "3.1.2.CS.2: Demonstrate knowledge and understanding of Procurement Management.": [
    "3.1.2.LI.1: Explain Procurement Management and discuss its importance and process.",
    "3.1.2.LI.2: Explain the strategies in procurement, legal and ethical guidelines governing procurement and identify the challenges in the procurement management."
  ],
  "2.1.3.CS.1: Demonstrate knowledge and understanding of the Law of Contract.": [
    "2.1.3.LI.1: Explain a contract and its elements.",
    "2.1.3.LI.2: Explain types of contracts and how contracts may be vitiated and discharged."
  ],
  "2.1.3.CS.2: Demonstrate knowledge and understanding of business risk and insurance.": [
    "2.1.3.LI.1: Explain business risk, identify the types of business risks and how to manage risk",
    "2.1.3.LI.2: Explain insurance and outline its principles, policies and importance to businesses"
  ],
  "2.2.1.CS.1: Demonstrate knowledge and understanding of the approaches to international business.": [
    "2.2.1.LI.1: Explain the following approaches to international business: a. franchising, b. joint venturing, c. licensing and d. wholly-owned subsidiary"
  ],
  "2.2.1.CS.2: Demonstrate knowledge and understanding of Domestic and International Trade.": [
    "2.2.1.LI.1: Differentiate between domestic and international trade, and outline the basis and documents used in international trade.",
    "2.2.1.LI.2: Analyse the various restrictions in international trade, the reasons for restrictions and explain the benefits and challenges of international trade."
  ],
  "3.2.1.CS.1: Demonstrate knowledge and understanding of digital marketing.": [
    "3.2.1.LI.1: Explain marketing, evaluate its functions and analyse the Extended Marketing Mix (7Ps)",
    "3.2.1.LI.2: Discuss the processes involved in new product development and the product life cycle",
    "3.2.1.LI.3: Explain e-business and digital marketing, its tools and assess the benefits and challenges in their applications in business"
  ],
  "1.2.2.CS1: Demonstrate knowledge and understanding of globalization and international business and how to transform Ghanaian companies into multinational corporations.": [
    "1.2.2.LI.1: Explain the factors driving globalisation, analyse its impact on local businesses, and discuss the benefits and challenges of operating businesses in a global market.",
    "1.2.2.LI.2: Explain international business, it features, the reasons for engaging in it, and discuss its benefits and the challenges.",
    "1.2.2.LI.3: Describe multinational corporation and discuss its features, benefits and challenges including factors driving companies to become multination corporation.",
    "1.2.1.LI.4: Explain indigenous Ghanaian businesses with examples, outline the steps to become a multinational corporation, and discuss strategies for Ghanaian companies to transform into multinational operations."
  ],
  "1.2.1.CS1: Demonstrate knowledge and understanding of the business environment and corporate social responsibility.": [
    "1.2.1.LI.1: Analyse the factors affecting the internal and external environment of business using SWOT and PESTEL",
    "1.2.1.LI.2: Define business ethics, outline its key principles, and explain the importance of business ethics in promoting integrity, trust, and accountability within organisations.",
    "1.2.1.LI.3: Explain corporate social responsibility and discuss its types of initiatives",
    "1.2.1.LI.4: Discuss the benefits and challenges of Corporate Social Responsibility"
  ],
  "3.2.2.CS.1: Demonstrate knowledge and understanding of entrepreneurship and setting up businesses.": [
    "3.2.2.LI.1: Describe entrepreneurship and outline the characteristics and roles of entrepreneurs",
    "3.2.2.LI.2: Identify ways of entering into businesses and describe the various documents needed by entrepreneurs.",
    "3.2.2.LI.3: Analyse the process of setting up a business, prepare a simple business plan for the establishment of business and outline the reasons for business successes and failures."
  ],

  // Accounting and Financial/Cost Accounting Standard Indicators
  "B10.1.1.1: Demonstrate knowledge and understanding of Accounting, its nature, principles, purpose and application.": [
    "B10.1.1.1.1: Distinguish between financial and cost accounting functions, stating objectives and scope of each.",
    "B10.1.1.1.2: Research standard bookkeeping processes used in local businesses (sole traders, retail, corporate)."
  ],
  "B11.1.2.1: Analyze accounting transactions using the double-entry system, adjusting ledgers, correcting errors and extracting trial balances.": [
    "B11.1.2.1.1: Apply basic double-entry ledger posting rules to debit and credit asset/liability actions.",
    "B11.1.2.1.2: Post entries in journals and adjust physical ledger mappings."
  ],
  "B11.1.2.2: Prepare updated cash books, and bank reconciliation statements to monitor liquidity.": [
    "B11.1.2.2.1: Identify causes of differences between general cashbooks and Bank Statement structures.",
    "B11.1.2.2.2: Draft bank reconciliation reports resolving unpresented cheques and direct debits."
  ],
  "B11.1.2.3: Draft receivables and payables control accounts to audit sub-ledger operations.": [
    "B11.1.2.3.1: Reconcile trade receivable sub-ledgers with general ledger control accounts.",
    "B11.1.2.3.2: Account for contra entries, bad debts, and dishonoured cheques in control ledgers."
  ],
  "B10.1.3.1: Prepare sole proprietorship final financial statements with basic internal adjustments.": [
    "B10.1.3.1.1: Construct standard trading profit & loss sheets resolving inventory and margin outcomes.",
    "B10.1.3.1.2: Account for accrued or prepaid expenses and depreciation adjustments."
  ],
  "B11.1.3.1: Prepare final statements from single-entry and incomplete financial records.": [
    "B11.1.3.1.1: Construct opening and closing Statements of Affairs to derive net asset capitals.",
    "B11.1.3.1.2: Reconstruct summary cash receipt ledgers to compute total credit sales."
  ],
  "B11.1.3.2: Account for financial items in non-profit operations, compiling subscriptions and accumulated funds.": [
    "B11.1.3.2.1: Reconcile nonprofit receipts and payments accounts with income/expense spreadsheets.",
    "B11.1.3.2.2: Prepare ledger accounts tracing prepaid and outstanding member subscriptions."
  ],
  "B12.1.3.1: Account for the constitution, profit distribution, and goodwill of general business partnerships.": [
    "B12.1.3.1.1: Formulate partner capital/current accounts following profit distribution sharing arrangements.",
    "B12.1.3.1.2: Post ledger entries for goodwill treatment on admission or retirement of general partners."
  ],
  "B12.1.3.2: Prepare final structured financial accounts and reports for companies.": [
    "B12.1.3.2.1: Sketch standardized company financial layouts mapping share reserves, retained gains, and debentures.",
    "B12.1.3.2.2: Analyze corporate annual reports checking cash flows and auditing declarations."
  ],
  "B10.1.4.1: Compute trading, profit and loss components to determine business profitability.": [
    "B10.1.4.1.1: Calculate gross margin ratios and operating net returns from merchant logs."
  ],
  "B12.1.5.1: Allocate partnership rewards using profit and loss appropriation accounts.": [
    "B12.1.5.1.1: Compute interest on capital allocations, drawings charges, and partner salary distributions."
  ],
  "B12.1.6.1: Examine company share capital issues and balance sheet groupings.": [
    "B12.1.6.1.1: Post company ledger entries accounting for share subscriptions and share premium reserves."
  ],
  "B10.1.7.1: Classify general overhead and prime expenses in basic production sheets.": [
    "B10.1.7.1.1: Group expenditures into prime costs, factory overheads, and administrative costs."
  ],
  "B10.2.1.1: Distinguish nature, purpose, basics and installation guidelines of modern cost accounting files.": [
    "B10.2.1.1.1: Compare information outputs of cost accounting databases with financial ledgers.",
    "B10.2.1.1.2: Assess local operational targets before installing custom costing parameters."
  ],
  "B10.2.1.2: Demonstrate material storage, purchase documentation, and issue pricing under FIFO, LIFO and Weighted Average schemes.": [
    "B10.2.1.2.1: Record warehouse receipts and issues using FIFO, LIFO, and Weighted Average structures.",
    "B10.2.1.2.2: Calculate lower of cost or net realizable value for raw material stock balances."
  ],
  "B11.2.1.1: Account for labour remuneration, idle time metrics, and calculate complete payroll sheets.": [
    "B11.2.1.1.1: Compute base wages using standard day-rate, piece-rate, and differential incentive systems.",
    "B11.2.1.1.2: Formulate standard payroll spreadsheets showing itemized statutory tax and union deductions."
  ],
  "B11.2.1.2: Formulate overhead analysis sheets to apportion common indirect overheads.": [
    "B11.2.1.2.1: Allocate administrative overhead budgets using mathematical step-down reapportionment models.",
    "B11.2.1.2.2: Determine machine-hour or direct labor-hour overhead absorption rates."
  ],
  "B11.2.2.1: Draft job and batch cost records to compute margins on specific custom orders.": [
    "B11.2.2.1.1: Complete customer job cost sheets summing raw resource requisitions and prime wage variables.",
    "B11.2.2.1.2: Formulate batch cost schedules tracking cost-per-unit metrics on serialized print or chemical batches."
  ],
  "B12.2.2.1: Account for process costing scenarios including treatment of normal and abnormal losses.": [
    "B12.2.2.1.1: Chart process account flows calculating equivalent units of production on work-in-progress stock.",
    "B12.2.2.1.2: Reconcile scrap returns, byproduct transfers, and process spill normal/abnormal waste parameters."
  ],
  "B12.2.2.2: Reconcile contract costing procedures with architectural certificate milestones.": [
    "B12.2.2.2.1: Draft contract accounts summing materials sent to site, site wages, and plant depreciation.",
    "B12.2.2.2.2: Calculate reserve profits recognizing architect certified percentage milestones."
  ],
  "B12.2.2.3: Formulate service cost schedules for passenger transport and related service sectors.": [
    "B12.2.2.3.1: Prepare operating and service sheets for logistics and transport businesses."
  ],
  "B11.2.3.1: Apply Activity Based Costing methods to link overheads to strategic cost pools.": [
    "B11.2.3.1.1: Classify factory overhead items into defined cost activity pools.",
    "B11.2.3.1.2: Calculate cost-driver rates (setups, inspections, machine hours) to assign resource demands dynamically."
  ],
  "B11.2.3.2: Contrast Marginal and Absorption costing treatments on period adjustments and profits.": [
    "B11.2.3.2.1: Prepare monthly income comparisons accounting for differences in closing stock valuations.",
    "B11.2.3.2.2: Reconcile marginal costing profits with traditional absorption costing reports."
  ],
  "B12.2.3.1: Draft cost-volume-profit graphs to pinpoint break-even outcomes and margin of safety indices.": [
    "B12.2.3.1.1: Calculate contribution-to-sales ratios, break-even unit quantities, and target profit sales targets.",
    "B12.2.3.1.2: Plot multi-variable margins of safety on coordinates charts mapping operational thresholds."
  ],
  "B12.2.3.2: Prepare functional sales, production, purchase, and cash budgets to schedule operations.": [
    "B12.2.3.2.1: Formulate production budgets using anticipated sales targets adjusted for holding stock policies.",
    "B12.2.3.2.2: Draft comprehensive cash budgets mapping receipts and layouts to preserve liquid buffers."
  ],
  "B12.2.3.3: Calculate standard material and labour variances to evaluate operational efficiency discrepancies.": [
    "B12.2.3.3.1: Analyze price, usage, rate, and efficiency variances comparing standard targets with audited payments.",
    "B12.2.3.3.2: Formulate ledger adjustments reconciling theoretical standards with physical production invoices."
  ],
  "B10.1.1.2: Compute assets, liabilities and capital values using the basic accounting equation.": [
    "B10.1.1.2.1: State and demonstrate how transaction impacts preserve basic account equation states."
  ],
  "B10.1.1.3: Examine the information needs of various users of accounting information.": [
    "B10.1.1.3.1: Distinguish information targets of internal managers, tax authorities, and creditors."
  ],
  "B10.1.1.4: Discuss the need for general accounting standards and the role of regulatory bodies.": [
    "B10.1.1.4.1: Examine how the IFRS frameworks protect global reporting honesty."
  ],
  "B10.1.1.5: Describe the core definitions of bookkeeping, financial accounting and cost accounting.": [
    "B10.1.1.5.1: List the differences between original records entry and analytical spreadsheet operations."
  ],
  "B10.1.1.6: Apply the double entry guidelines to adjust transactions in the accounting equation.": [
    "B10.1.1.6.1: Draft double-entry balances across dual asset transactions."
  ],
  "B10.1.1.7: Post basic ledger adjustments on various asset, liability, and capital accounts.": [
    "B10.1.1.7.1: Open, ledger, and extract closing balances across t-accounts."
  ],
  "B10.1.1.8: Extract a standard trial balance from historical ledger balances.": [
    "B10.1.1.8.1: Reconcile general ledger balances to prove computational equality."
  ],
  "B11.1.2.4: Distinguish between errors of omission, commission, principle, and complete reversal.": [
    "B11.1.2.4.1: Identify structural errors and summarize rectify procedures."
  ],
  "B11.1.2.5: Design a suspense account to balance the trial balance temporaries pending audits.": [
    "B11.1.2.5.1: Rectify errors utilizing journal corrections posted to suspense accounts."
  ],
  "B11.1.2.6: Draft a formal bank reconciliation statement starting with cashbook or bank statement balances.": [
    "B11.1.2.6.1: Prepare unadjusted Cashbook balances and bank adjustments."
  ],
  "B11.1.2.7: Reconcile sub-ledgers with general ledger control totals.": [
    "B11.1.2.7.1: Identify outstanding invoice differences in Control Account sheets."
  ],
  "B10.1.3.3: Calculate adjustments for prepayments, accruals, depreciation, and bad debts for sole traders.": [
    "B10.1.3.3.1: Calculate reducing balance or straight line depreciation schedules."
  ],
  "B11.1.3.3: Formulate a subscription account to track accrued or prepaid member dues.": [
    "B11.1.3.3.1: Distinguish prepaid/outstanding subscription members data."
  ],
  "B11.1.3.4: Convert incomplete records into dual double-entry structures using ledger summaries.": [
    "B11.1.3.4.1: Formulate cash receipt and payment analysis ledgers."
  ],
  "B12.1.3.3: Manage the entry/retirement of a partner, calculating goodwill shares.": [
    "B12.1.3.3.1: Post double entry shares for partners entry/retirement records."
  ],
  "B12.1.3.4: Account for share and debenture subscription and payments in general company ledgers.": [
    "B12.1.3.4.1: Journalize company share payments in general ledger files."
  ],
  "B10.1.4.2: Present a classified statement of financial position grouping local capital structures.": [
    "B10.1.4.2.1: Group asset resources by current/noncurrent balance structures."
  ],
  "B10.1.4.3: Calculate end-of-period adjustments for outstanding and accrued variables.": [
    "B10.1.4.3.1: Allocate month-end adjustments to the cost of operations."
  ],
  "B11.1.4.1: Derive sales, purchases, and cash flows to prepare standard sole-proprietor reports.": [
    "B11.1.4.1.1: Reconstruct control records under single entry rules."
  ],
  "B12.1.5.2: Prepare partnership profit distributions inside appropriation accounts.": [
    "B12.1.5.2.1: draft partner profit appropriation schedules."
  ],
  "B12.1.5.3: Draft partner capital and current account reports.": [
    "B12.1.5.3.1: distinguish fluctuating and fixed partner current structures."
  ],
  "B12.1.5.4: Formulate ledger adjustments for goodwill in partners entry or exits.": [
    "B12.1.5.4.1: Post entries adjusting partners ledger capital lines for goodwill transfers."
  ],
  "B12.1.6.2: Outline standard company components (statement of cash flows, director findings).": [
    "B11.1.6.2.1: Identify elements in published financial profiles."
  ],
  "B12.1.6.3: Present company income reserves balances correctly.": [
    "B12.1.6.3.1: Map reserves balances inside statement of changes in equity."
  ],
  "B10.2.4.2: Contrast information requirements of cost ledgers versus general accounting.": [
    "B10.2.4.2.1: Differentiate internal management data from external reporting files."
  ],
  "B10.2.4.3: Plan core requirements of implementing a sound cost accounting structure.": [
    "B10.2.4.3.1: Outline cost sheet installation pathways."
  ],
  "B10.2.5.2: Trace time sheet outputs to payroll rates.": [
    "B10.2.5.2.1: Reconcile production clocks with labor cost databases."
  ],
  "B10.2.5.3: Explain direct and indirect categorization of operating targets.": [
    "B10.2.5.3.1: Map expenses to prime vs general factory overhead sectors."
  ],
  "B10.2.6.2: Compute closing inventory values at lower of aggregate cost or market value.": [
    "B10.2.6.2.1: Apply IAS 2 rules mapping realistic inventory markets."
  ],
  "B10.2.6.3: Formulate requisition sheets tracking stock movements.": [
    "B10.2.6.3.1: Track store receipts with official requisition tickets."
  ],
  "B11.2.7.2: Apply step-down distribution rules to assign overheads across cost units.": [
    "B11.2.7.2.1: Allocate support center expenditures using mathematical proportions."
  ],
  "B11.2.7.3: Formulate overhead absorption configurations on direct machine or labor metrics.": [
    "B11.2.7.3.1: Derive factory absorption base factors."
  ],
  "B12.2.8.2: Compute unit costs based on bulk batch executions.": [
    "B12.2.8.2.1: Summarize average unit cost per batch yield."
  ],
  "B12.2.8.3: Formulate contract sheets tracking retention moneys and work certified values.": [
    "B12.2.8.3.1: Compile contract ledger adjustments computing architectural values."
  ],
  "B12.2.8.4: Track work-in-progress values across linear production processes.": [
    "B12.2.8.4.1: Compute equivalent production units."
  ],
  "B12.2.8.5: Compute cost-per-passenger-kilometer in commercial networks.": [
    "B12.2.8.5.1: Calculate service costing parameters for public transit fleets."
  ],
  "B11.2.1.3: Compile payroll spreadsheets detailing gross and net payouts.": [
    "B11.2.1.3.1: Compute monthly salary sheets mapping personal tax tiers."
  ],
  "B11.2.1.4: Group indirect expenses to production departments using primary sheets.": [
    "B11.2.1.4.1: Distribute general rent and power budgets based on floor layouts."
  ],
  "B11.2.1.5: Perform step-down secondary redistributions of service budgets.": [
    "B11.2.1.5.1: Balance support center sheets with standard allocation tiers."
  ],
  "B12.2.2.4: Formulate operational cost metrics in the services domain.": [
    "B12.2.2.4.1: Prepare cost unit metrics for public transport networks."
  ],
  "B12.2.3.2: Formulate cash receipts and operational schedules aiding cashflow balance.": [
    "B12.2.3.2.1: Reconcile cashflow schedules tracking planned payouts."
  ],
  // Biology Standard Indicators
  "B10.1.1.1: Demonstrate knowledge and understanding of Biology, the various branches and fields of study, and their benefits in everyday life.": [
    "B10.1.1.1.1: Observe specimen samples (honey, fish, milk, medicines) and identify respective biological domains.",
    "B10.1.1.1.2: Prepare a research report outlining how various fields of biology apply to human careers and health."
  ],
  "B10.1.1.2: Apply knowledge and understanding of the scientific method to solve everyday problems.": [
    "B10.1.1.2.1: Outline key processes of scientific investigation (observation, hypothesis, experiment, analysis, conclusion).",
    "B10.1.1.2.2: Apply the scientific method to address immediate local environmental challenges (e.g. sanitation, water security)."
  ],
  "B10.1.1.3: Apply knowledge of body symmetry, orientation, and sectioning of various organisms, and make labelled drawings of specimens.": [
    "B10.1.1.3.1: Distinguish between bilateral, radial and spherical symmetries of common plant/animal specimens.",
    "B10.1.1.3.2: Make clear, well-annotated biological drawings of cross-sections and longitudinal-sections of specific structures."
  ],
  "B10.1.1.4: Demonstrate knowledge, skill, and safety in the use of the microscope.": [
    "B10.1.1.4.1: Examine and describe the main parts and functions of a compound light microscope.",
    "B10.1.1.4.2: Demonstrate correct, safe manipulative technique to configure the stage and obtain clear glass slide focuses."
  ],
  "B11.1.1.1: Relate the knowledge of the characteristics and life processes of common simple living organisms to their economic importance.": [
    "B11.1.1.1.1: Describe biological processes and characteristics of Rhizopus, Moss, and Fern.",
    "B11.1.1.1.2: Discuss the ecological benefits and harmful qualities of these basic lower plants/fungi."
  ],
  "B10.1.2.1: Apply the knowledge of basic concepts in biology to improve productivity in fish farming.": [
    "B10.1.2.1.1: Identify optimal environmental criteria (pH, dissolved oxygen, temperature) for nursery pond stocking.",
    "B10.1.2.1.2: Build an experimental aquarium to analyze feeding behaviors and growth scales of fingerlings."
  ],
  "B11.1.2.1: Apply the knowledge of basic concepts in biology to improve crop and animal production.": [
    "B11.1.2.1.1: Demonstrate how soil enrichment mechanisms (composting, mulching) depend on basic bacterial activities.",
    "B11.1.2.1.2: Discuss biological principles underlying selective animal breeding, immunization, and deworming routines."
  ],
  "B12.1.2.1: Apply knowledge and skills in biotechnology to enhance the value of products that help improve human lives and the environment.": [
    "B12.1.2.1.1: Describe microbial fermentation pathways used in local dietary production (Kenkey, Yoghurt, Bread, Pito).",
    "B12.1.2.1.2: Outline fundamental molecular techniques used for tissue culturing, gene splicing, and bioremediation."
  ],
  "B11.2.1.1: Demonstrate knowledge and understanding of cell structure and functions, and relate them to organizational hierarchies.": [
    "B11.2.1.1.1: Distinguish between prokaryotic and eukaryotic cells, and compare specialized animal and plant cell organelles.",
    "B11.2.1.1.2: Relate cellular specialization to structural levels (cells -> tissues -> organs -> systems -> organisms)."
  ],
  "B12.2.1.1: Explain the molecular structure of nucleic acids (DNA/RNA) and their roles in protein synthesis.": [
    "B12.2.1.1.1: Draw and label the double-helix Watson-Crick model of DNA, describing nucleotide pairing principles.",
    "B12.2.1.1.2: Outline the phase stages of transcription and translation within cellular protein production mechanisms."
  ],
  "B12.2.1.2: Explain the cell cycle, cell division (mitosis/meiosis), and their relevance in living things.": [
    "B12.2.1.2.1: Contrast the phase events of Mitosis and Meiosis, citing chromosomal replication behaviors.",
    "B11.2.1.2.2: Discuss the biological significance of cell divisions to organism growth, tissue repair, and sexual heredity."
  ],
  "B10.2.2.1: Explain the significance of the various processes involved in the movement of substances in and out of the cell and the factors affecting them.": [
    "B10.2.2.1.1: Demonstrate the occurrence of passive diffusion, osmosis, active transport, and bulk cellular transport.",
    "B10.2.2.1.2: Design model experiments checking temperature, surface-to-volume ratio, and concentration dependencies."
  ],
  "B10.3.1.1: Identify living organisms using numbered and dichotomous keys.": [
    "B10.3.1.1.1: Sample local animals and plants and build standard dichotomous keys based on physical features."
  ],
  "B10.3.1.2: Explain how lower organisms are classified into their taxonomic groups.": [
    "B10.3.1.2.1: Explain taxonomic ranking hierarchies (Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species)."
  ],
  "B11.3.1.1: Describe the distinctive characteristics, life cycle and characteristics of grain weevil, butterfly, housefly and honeybee.": [
    "B11.3.1.1.1: Examine body segmentation, appendages, and metamorphic cycles of weevils, butterflies, houseflies, and honeybees.",
    "B11.3.1.1.2: Evaluate economic roles (pollination, honey yields) and health risks (vector transmissions) of these insects."
  ],
  "B12.3.1.1: Relate the characteristic features and life processes of tilapia, toad, wall gecko and domestic fowl to their economic importance.": [
    "B12.3.1.1.1: Compare respiratory, reproductive, and thermoregulatory structures of tilapia, toad, gecko, and fowl.",
    "B12.3.1.1.2: Discuss local perceptions, dietary values, and agricultural benefits of these diverse classes."
  ],
  "B10.3.2.1: Demonstrate knowledge and understanding of major tropical ecological habitats and how living things are adapted to these habitats.": [
    "B10.3.2.1.1: Describe characteristics of rainforest, savannah, desert, seashore, river pond, and lagoon habitats.",
    "B10.3.2.1.2: Investigate morphologic and behavioral adaptive traits of organisms living in specialized regions."
  ],
  "B10.3.2.2: Use the appropriate ecological tool/devices and methods to estimate the population of given species in a named habitat.": [
    "B10.3.2.2.1: Apply quadrat sampling, pitfall traps, pooters, and Lincoln Indice strategies to compute local insect profiles."
  ],
  "B11.3.2.1: Explain the features of various tropical habitats and how living organisms are adapted to these habitats.": [
    "B11.3.2.1.1: Document the adaptative features of tropical organisms during field trips or simulated digital explorations."
  ],
  "B12.3.2.1: Explain the interdependencies of living things and their environment (food chains, webs, and symbiotic relationships) and indicate their importance.": [
    "B12.3.2.1.1: Plot complex food webs mapping tropical biotic dependencies.",
    "B12.3.2.1.2: Distinguish between biological associations: parasitism, mutualism, commensalism, saprophytism, and epiphytism."
  ],
  "B10.3.3.1: Discuss the life cycles of common disease-causing organisms, and their effects on humans and other living things.": [
    "B10.3.3.1.1: Analyze life cycles, vectors, symptoms, and control measures for Plasmodium, Schistosoma, and Hookworms."
  ],
  "B11.3.3.1: Explain immunization, vaccination, and inoculation and state their importance in the environment.": [
    "B11.3.3.1.1: Distinguish between active/passive immunity and artificial inoculation procedures promoting health."
  ],
  "B12.3.3.1: Examine and explain emerging diseases and infections (SARS, COVID-19, Ebola, Swine flu, etc.) and suggest prevention methods.": [
    "B12.3.3.1.1: Conduct epidemiological checks detailing transmission dynamics of SARS, COVID-19, and Monkeypox, outlining hygiene options."
  ],
  "B10.4.1.1: Describe the morphology of mammals and relate the external and internal structures to their functions.": [
    "B10.4.1.1.1: Dissect a sedated small mammal (rat/rabbit) to examine internal organs and draw annotated body maps."
  ],
  "B11.4.1.1: Discuss the human cardiovascular and excretory systems and relate their parts to homeostasis and general well-being.": [
    "B11.4.1.1.1: Plot blood flow routes inside mammalian hearts and describe double-circulation pathways.",
    "B11.4.1.1.2: Chart nephrotic waste filtration loops inside mammalian kidneys defending chemical equilibrium."
  ],
  "B12.4.1.1: Explain the mammalian respiratory, reproductive, musculoskeletal, nervous, and hormonal systems and how they work together.": [
    "B12.4.1.1.1: Contrast mammalian skeletal subsystems (axial and appendicular skull, vertebrae, limbs and girdles).",
    "B12.4.1.1.2: Outline chemical and electrical coordination loops combining neuro-endocrine centers with muscle targets."
  ],
  "B10.4.2.1: Describe the morphology of flowering plants and explain how these are related to their growth and development.": [
    "B10.4.2.1.1: Classify monocotyledonous and dicotyledonous plant root, stem, leaf, and seed adaptive characteristics."
  ],
  "B11.4.2.1: Explain transport and nutrition (photosynthesis) in flowering plants and state the factors affecting them.": [
    "B11.4.2.1.1: Map water and mineral ascending routes through vascular tissues (xylem and phloem).",
    "B11.4.2.1.2: Perform light-to-chlorophyll tests showing constraints influencing organic sugar yields."
  ],
  "B12.4.2.1: Describe reproduction and excretion in flowering plants and relate them to survival.": [
    "B12.4.2.1.1: Sketch and annotate complete whorl sectors of a flower (calyx, corolla, androecium, gynoecium).",
    "B12.4.2.1.2: Distinguish botanical waste release patterns (excreting resins, gums, latexes, carbon dioxide, and excess water)."
  ],

  // Economics Standard Indicators
  "B10.1.1.1: Use relevant information gathered from learners’ home, school and community through observation to carefully define economics and stimulate their interest in the subject.": [
    "B10.1.1.1.1: Brainstorm in mixed ability groups to define Economics based on everyday experiences.",
    "B10.1.1.1.2: Research career options (finance, policy, academia) available to Economics graduates."
  ],
  "B11.1.1.1: Use the appropriate economics tools to explain everyday economic issues.": [
    "B11.1.1.1.1: Apply basic mathematical tables and models (equations) to economic problems.",
    "B11.1.1.1.2: Interpret and plot line graphs, bar charts, and pie charts/pictograms for pricing."
  ],
  "B12.1.1.1: Exhibit knowledge of advanced economic methodologies and tools.": [
    "B12.1.1.1.1: Demonstrate how to construct and derive algebraic demand and supply schedules."
  ],
  "B10.1.2.1: Use concepts of demand to solve everyday life and societal challenges.": [
    "B10.1.2.1.1: Describe wants, scarcity, choice, scale of preference and opportunity cost.",
    "B10.1.2.1.2: Role-play situations illustrating the principle of opportunity cost and scarcity."
  ],
  "B11.1.2.1: Use the appropriate factors of demand to explain the differences between change in quantity demanded and change in demand.": [
    "B11.1.2.1.1: Plot shift in demand vs movement along the demand curve under ceteris paribus.",
    "B11.1.2.1.2: Analyze non-price determinants (income, tastes, seasons) affecting total demand."
  ],
  "B12.1.2.1: Interpret elasticity of demand and apply the concept to daily life.": [
    "B12.1.2.1.1: Calculate price, income and cross elasticity of demand using standard formulas.",
    "B12.1.2.1.2: Discuss applications of elasticity to business price settings and government taxation."
  ],
  "B10.1.3.1: Use relevant information gathered from home, school and community through observation to carefully explain the concept of utility and the law of diminishing marginal utility.": [
    "B10.1.3.1.1: Explain total utility, average utility and marginal utility using food/water tests."
  ],
  "B11.1.3.1: Exhibit rational behaviour in determining the equilibrium in consumption of goods and services through practical experiences.": [
    "B11.1.3.1.1: Graphically model consumer equilibrium where marginal utility equals price."
  ],
  "B12.1.3.1: Use information from the environment to explain income and substitution effects.": [
    "B12.1.3.1.1: Distinguish between substitution effect and income effect using indifference curves."
  ],
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

  // Geography Standard Indicators
  "1.1.1.CS.1: Demonstrate understanding of Geography as a subject of study.": [
    "1.1.1.LI.1: Explain Geography and its branches.",
    "1.1.1.LI.2: Discuss career prospects and the importance of studying geography."
  ],
  "1.1.1.CS.2: Demonstrate knowledge of the Solar System and its constituents.": [
    "1.1.1.LI.3: Describe the solar system and its constituents.",
    "1.1.1.LI.4: Discuss the characteristics of the planets in the solar system."
  ],
  "1.1.1.CS.3: Demonstrate knowledge and skills in describing the shape and movements of The Earth, and the effects of the earth's rotation and revolution.": [
    "1.1.1.LI.5: Discuss evidence of the shape of earth.",
    "1.1.1.LI.6: Examine the effects of the Earth's rotation and revolution."
  ],
  "1.1.1.CS.4: Demonstrate skills in locating places using longitudes and latitudes.": [
    "1.1.1.LI.7: Use latitudes and longitudes to locate places on the earth's surface.",
    "1.1.1.LI.8: Calculate distances using latitudes and time using longitudes."
  ],
  "2.1.1.CS.1: Demonstrate an understanding of the internal structure of the earth and the concept of continental drift.": [
    "2.1.1.LI.1: Sketch, label and describe the internal structure of the Earth.",
    "2.1.1.LI.2: Explain the concept of continental drift and discuss the supporting evidence."
  ],
  "2.1.1.CS.2: Demonstrate knowledge and understanding of landforms, their importance and the processes that leads to their creation.": [
    "2.1.1.LI.3: Identify the different types of mountains (e.g. volcanic, fold and block), their characteristics, the processes that create them and their importance.",
    "2.1.1.LI.4: Describe the types of plains (structural, erosional and depositional) and the processes that create them and their importance."
  ],
  "3.1.1.CS.1: Demonstrate knowledge and understanding of river channels and associated landforms.": [
    "3.1.1.LI.1: Describe the development of river channels and associated landforms.",
    "3.1.1.LI.2: Examine the importance of river landforms to the socio-economic development in Ghana."
  ],
  "1.1.2.CS.1: Demonstrate knowledge in rocks formation and weathering processes.": [
    "1.1.2.LI.1: Discuss the three types of rock, their characteristics, formational processes and their importance.",
    "1.1.2.LI.2: Explain weathering and the factors affecting its processes.",
    "1.1.2.LI.3: Evaluate the three weathering processes (physical, chemical and biological weathering processes)."
  ],
  "2.1.2.CS.1: Demonstrate knowledge and understanding of soils.": [
    "2.1.2.LI.1: State and explain the factors of soil formation.",
    "2.1.2.LI.2: Differentiate between the soil types and discuss the importance of soil."
  ],
  "3.1.2.CS.1: Demonstrate knowledge of mass wasting as a geomorphic process.": [
    "3.1.2.LI.1: Discuss mass wasting and the factors that influence it.",
    "3.1.2.LI.2: Examine the types of mass wasting.",
    "3.1.2.LI.3: Discuss the socio-economic and environmental effects of mass wasting."
  ],
  "1.1.3.CS.1: Demonstrate knowledge of the structure and composition of the Earth's atmosphere and explain the terms weather and climate.": [
    "1.1.3.LI.1: Discuss the physical structure and composition of the Earth's atmosphere and their importance.",
    "1.1.3.LI.2: Explain the differences between the weather and climate and the factors that affect them.",
    "1.1.3.LI.3: Calculate the annual and mean rainfall and temperature data of a station with appropriate instruments for measuring the various elements of weather."
  ],
  "2.1.3.CS.1: Demonstrate understanding of the factors that influence the elements of climate, the world climatic zones and associated vegetation types.": [
    "2.1.3.LI.1: Discuss the factors influencing the various climatic elements.",
    "2.1.3.LI.2: Identify the forms of precipitation and the types of rainfall.",
    "2.1.3.LI.3: Describe the characteristics associated with vegetation within each climatic zone in the world."
  ],
  "3.1.3.CS.1: Demonstrate knowledge of climate change and its impacts on the environment and socio-economic development.": [
    "3.1.3.LI.1: Discuss the causes and evidence of climate change in Ghana.",
    "3.1.3.LI.2: Discuss the socio-economic and environmental impacts of climate change in Ghana and beyond.",
    "3.1.3.LI.3: Discuss adaptation strategies and remedies for climate change in Ghana."
  ],
  "1.2.1.CS.1: Demonstrate understanding of maps, their importance and the map scales.": [
    "1.2.1.LI.1: Discuss the types of maps and their importance.",
    "1.2.1.LI.2: Explain the concept of map scale and convert from one scale type to another."
  ],
  "1.2.1.CS.2: Demonstrate knowledge and skills of representing relief features on maps.": [
    "1.2.1.LI.3: Examine the methods of representing relief on maps.",
    "1.2.1.LI.4: Read and interpret contours on maps."
  ],
  "2.2.1.CS.1: Demonstrate skill in map analysis.": [
    "2.2.1.LI.1: Reproduce map by reduction and enlargement.",
    "2.2.1.LI.2: Measure distances and areas on maps.",
    "2.2.1.LI.3: Determine directions and bearings.",
    "2.2.1.LI.4: Draw sectional profiles (annotated) and calculate vertical exaggeration and gradient."
  ],
  "3.2.1.CS.1: Demonstrate skills and competencies in interpreting and analysing maps.": [
    "3.2.1.LI.1: Analyse natural features on maps (e.g. relief, drainage).",
    "3.2.1.LI.2: Analyse cultural features on maps (e.g. settlements, farms and roads).",
    "3.2.1.LI.3: Analyse the interrelationships between natural and cultural features on maps."
  ],
  "1.2.2.CS.1: Demonstrate knowledge and skills in basic geospatial data collection methods.": [
    "1.2.2.LI.1: Discuss the methods of collecting geospatial data (surveying, remote sensing, GPS etc.).",
    "1.2.2.LI.2: Assess the geospatial data collection tools."
  ],
  "2.2.2.CS.1: Demonstrate skills in basic geospatial data collection methods.": [
    "2.2.2.LI.1: Identify and discuss the methods of collecting geospatial data (surveying, remote sensing, GIS, GPS etc).",
    "2.2.2.LI.2: Collect and map geospatial data using Computer and Mobile Apps, GIS and GPS.",
    "2.2.2.LI.3: Explore the emerging technologies for geospatial data collection."
  ],
  "3.2.2.CS.1: Demonstrate skills in basic geospatial data representation and interpretation using diagrams.": [
    "3.2.2.LI.1: Analyse and interpret geospatial data using dot maps.",
    "3.2.2.LI.2: Analyse and interpret geospatial data using flow charts."
  ],
  "1.3.1.CS.1: Demonstrate understanding of the physical environment of Ghana and its socio-economic importance and challenges.": [
    "1.3.1.LI.1: Draw the outline map of Ghana and describe the location and size, and indicate the administrative regions.",
    "1.3.1.LI.2: Discuss the major relief and drainage features of Ghana and their importance and challenges to development.",
    "1.3.1.LI.3: Discuss the climate, vegetation and soil types in Ghana and their importance and challenges to socio-economic development."
  ],
  "2.3.1.CS.1: Demonstrate skills of drawing and showing the physical setting of West Africa and Africa.": [
    "2.3.1.LI.1: Describe the geographic location, size and political divisions of West Africa and Africa.",
    "2.3.1.LI.2: Describe the relief, drainage, climate and vegetation of West Africa and Africa."
  ],
  "3.3.1.CS.1: Demonstrate understanding of population growth and distribution, migration trends and settlement types in Ghana.": [
    "3.3.1.LI.1: Examine population growth and distribution in Ghana.",
    "3.3.1.LI.2: Discuss migration trends, settlement types and patterns in Ghana.",
    "3.3.1.LI.3: Discuss factors influencing population growth, population distribution and migration in Ghana."
  ],
  "3.3.1.CS.2: Analyse the population growth and migration trends in Africa and the world.": [
    "3.3.1.LI.4: Compare Ghana's population growth to that of Africa and the world.",
    "3.3.1.LI.5: Explore the socio-economic implications of migration from Africa to the rest of the world."
  ],
  "1.3.2.CS.1: Demonstrate an understanding of the various primary economic activities in Ghana and beyond.": [
    "1.3.2.LI.1: Discuss the characteristics of subsistence and commercial agriculture and their importance and challenges in Ghana.",
    "1.3.2.LI.2: Examine the methods, importance and problems of lumbering and mining in Ghana."
  ],
  "2.3.2.CS.1: Analyse the manufacturing sector in Ghana.": [
    "2.3.2.LI.1: Discuss the distribution, types and characteristics of manufacturing industries in Ghana.",
    "2.3.2.LI.2: Discuss the importance and challenges of manufacturing industries in Ghana."
  ],
  "3.3.2.CS.1: Evaluate the tourism, trade and transport/communication sectors in Ghana.": [
    "3.3.2.LI.1: Examine the role of tourism in the socio-economic development of Ghana and the challenges facing the tourism sector.",
    "3.3.2.LI.2: Assess the role of trade in the socio-economic development of Ghana and the challenges facing the sector.",
    "3.3.2.LI.3: Examine the role of transport and communication in the socio-economic development of Ghana and the challenges facing the sector."
  ],
  "1.3.3.CS.1: Demonstrate an understanding of the causes of environmental pollution and the strategies for dealing with it.": [
    "1.3.3.LI.1: Examine causes and measures for preventing or mitigating air pollution in Ghana.",
    "1.3.3.LI.2: Examine causes and measures for preventing/mitigating water pollution in Ghana."
  ],
  "2.3.3.CS.1: Demonstrate skills of preventing or mitigating land degradation and soil pollution in Ghana.": [
    "2.3.3.LI.1: Discuss the causes of land degradation, its effects and management strategies in Ghana.",
    "2.3.3.LI.2: Discuss the causes of soil pollution, its effects and management strategies in Ghana."
  ],
  "3.3.3.CS.1: Demonstrate skills in waste management in Ghana.": [
    "3.3.3.LI.1: Discuss the sources of waste in your community and Ghana.",
    "3.3.3.LI.2: Discuss the effects of improper waste management or disposal in your community and Ghana.",
    "3.3.3.LI.3: Examine appropriate methods of waste management in Ghana: Reduce, Reuse and Recycle (3Rs)."
  ],
  "1.3.4.CS.1: Demonstrate understanding of the concepts 'hazard' and 'disaster'.": [
    "1.3.4.LI.1: Differentiate between hazards and disasters.",
    "1.3.4.LI.2: Sketch areas in Ghana prone to floods, drought, bushfires and earthquakes."
  ],
  "2.3.4.CS.1: Demonstrate skills for managing earthquakes, floods, drought and fires.": [
    "2.3.4.LI.1: Examine the measures for managing floods in Ghana.",
    "2.3.4.LI.2: Examine the measures for managing drought and fires in Ghana."
  ],
  "3.3.4.CS.1: Demonstrate knowledge and skills for preventing or mitigating desert encroachment and landslides.": [
    "3.3.4.LI.1: Examine ways of managing desert encroachment.",
    "3.3.4.LI.2: Examine measures for the prevention/mitigation of landslides."
  ],
  // Government Standard Indicators
  "1.1.1.CS.1: Demonstrate understanding of the meanings, basic concepts, principles, and importance of government.": [
    "1.1.1.LI.1: Analyse the meanings of government.",
    "1.1.1.LI.2: Analyse basic concepts and principles of government.",
    "1.1.1.LI.3: Explain the importance of the study of government."
  ],
  "1.1.2.CS.1: Exhibit understanding and application of the Indigenous systems of government in Ghana": [
    "1.1.2.LI.1: Describe the structure of indigenous systems of government in Ghana.",
    "1.1.2.LI.2: Describe how traditional leaders contribute to the socio-economic development of Ghana."
  ],
  "1.2.1.CS.1: Demonstrate knowledge and understanding of the constitution and organs of government": [
    "1.2.1.LI.1: Explain the meaning of constitution and constitutionalism.",
    "1.2.1.LI.2: Discuss the various types of constitution.",
    "1.2.1.LI.3: Explain the meaning, composition and types of the executive.",
    "1.2.1.LI.4: Explain the meaning, types, and structure of the legislature.",
    "1.2.1.LI.5: Explain the meaning and structure of the Judiciary."
  ],
  "1.2.2.CS.1: Exhibit knowledge and understanding of State-Society Relations in Ghana": [
    "1.2.2.LI.1: Explain how public opinion influences public policy decisions.",
    "1.2.2.LI.2: Discuss the principles of mass media.",
    "1.2.2.LI.3: Explain political party and its structure and Pressure Group."
  ],
  "1.3.1.CS.1: Demonstrate knowledge and understanding of Ghana's external relations.": [
    "1.3.1.LI.1: Identify and explain state and non-state actors in the international system.",
    "1.3.1.LI.2: Discuss the role of state and non-state actors in the international system."
  ],
  "2.1.1.CS.1: Demonstrate understanding and application of citizenships, rights, and responsibilities to the state.": [
    "2.1.1.LI.1: Explain the concept of citizenship.",
    "2.1.1.LI.2: Discuss how citizenship is acquired in Ghana.",
    "2.1.1.LI.3: Explain the meaning and types of rights.",
    "2.1.1.LI.4: Examine how citizens' rights are protected.",
    "2.1.1.LI.5: Establish the symbiotic relationship between the responsibility of the state towards citizens and vice versa in national development.",
    "2.1.1.LI.6: Discuss how the rights of a citizen can be restricted."
  ],
  "2.1.2.CS.1: Demonstrate knowledge and understanding of contemporary Governance System in Ghana.": [
    "2.1.2.LI.1: Examine the features of democratic system of governance.",
    "2.1.2.LI.2: Analyse the features of good governance."
  ],
  "2.2.1.CS.1: Demonstrate knowledge, understanding and appreciation of the organs of government.": [
    "2.2.1.LI.1: Examine the functions of the executive organ of government.",
    "2.2.1.LI.2: Discuss the significance of the legislature in a democratic state.",
    "2.2.1.LI.3: Discuss the role of the Judiciary in a democratic state."
  ],
  "2.2.2.CS.1: Demonstrate understanding and application of State-Society Relations in Ghana.": [
    "2.2.2.LI.1: Mass media and democratic state development.",
    "2.2.2.LI.2: Discuss party systems.",
    "2.2.2.LI.3: Assess the significance of the EC in Ghana's democratic practice.",
    "2.2.2.LI.4: Describe Decentralization, types, and structure of Ghana’s local government system.",
    "2.2.2.LI.5: Describe the Public Service.",
    "2.2.2.LI.6: Distinguish between E-government and E-governance."
  ],
  "2.3.1.CS.1: Demonstrate knowledge and understanding of Ghana's external relations.": [
    "2.3.1.LI.1: Discuss Diplomacy.",
    "2.3.1.LI.2: Examine the determinants of Ghana's foreign policy.",
    "2.3.1.LI.3: Discuss the actors and institutions involved in Ghana's foreign policy."
  ],
  "2.3.2.CS.1: Demonstrate knowledge and understanding of globalization and development of States.": [
    "2.3.2.LI.1: Explain the meaning and characteristics of globalisation.",
    "2.3.2.LI.2: Discuss the types of globalisation."
  ],
  "3.1.1.CS.1: Demonstrate knowledge and understanding and application of the systems of government.": [
    "3.1.1.LI.1: Discuss the systems of government.",
    "3.1.1.LI.2: Provide reasons for Ghana's adoption of unitary system of government."
  ],
  "3.1.2.CS.1: Compare Indigenous and contemporary Governance in Ghana.": [
    "3.1.2.LI.1: Assess the democratic features of the indigenous governance system.",
    "3.1.2.LI.2: Examine the role of the chieftaincy institution in contemporary governance in Ghana."
  ],
  "3.2.1.CS.1: Demonstrate understanding and appreciation of the 1992 Republican Constitution.": [
    "3.2.1.LI.1: Examine the salient features of the 1992 Republican Constitution.",
    "3.2.1.LI.2: Describe separation of powers, checks and balances.",
    "3.2.1.LI.3: Discuss the relevance of the existence of separation of powers, checks and balances in Ghana."
  ],
  "3.2.2.CS.1: Evaluate State-Society Relations and Administration.": [
    "3.2.2.LI.1: Discuss the role of political parties in a democratic state.",
    "3.2.2.LI.2: Assess the types and functions of elections.",
    "3.2.2.LI.3: Assess the effects of the concept of decentralization on development.",
    "3.2.2.LI.4: Examine the functions and challenges of the Public Service.",
    "3.2.2.LI.5: Examine the relevance of e-governance in the socio-economic development of Ghana."
  ],
  "3.3.1.CS.1: Demonstrate knowledge, understanding and appreciation of Ghana's external Relations.": [
    "3.3.1.LI.1: Assess Ghana's foreign policy of good neighbourliness.",
    "3.3.1.LI.2: Analyse Ghana's foreign policy towards Economic Community of West African States (ECOWAS), Africa Union (AU), European Union (EU) and United Nations Organisation (UNO)."
  ],
  "3.3.2.CS.1: Demonstrate knowledge and understanding of globalization and development of States.": [
    "3.3.2.LI.1: Assess the effects of globalisation on the development of the Ghanaian economy.",
    "3.3.2.LI.2: Discuss the measures aimed at mitigating the negative effects of globalization on Ghana's development."
  ],
  // History Standard Indicators (SHS)
  "1.1.1.CS.1: Demonstrate understanding of the origins, meanings, and nature of history as a discipline.": [
    "1.1.1.LI.1: Trace the origins and meanings of the word 'history' using conventional and non-conventional sources.",
    "1.1.1.LI.2: Analyse the nature and scope of History as an academic discipline.",
    "1.1.1.LI.3: Investigate some common misconceptions associated with the study of History."
  ],
  "1.1.1.CS.2: Exhibit knowledge on the relevance of history to human survival and development.": [
    "1.1.1.LI.1: Justify why the study of History is relevant to individuals and the society.",
    "1.1.1.LI.2: Analyse the need for the study of History in Ghanaian schools."
  ],
  "2.1.2.CS.1: Develop application of skills in analysing and interpreting primary and secondary sources.": [
    "2.1.2.LI.1: Categorise sources of history into Primary and Secondary.",
    "2.1.2.LI.2: Examine the authenticity of Primary and Secondary Sources.",
    "2.1.2.LI.3: Assess authentic online historical sources."
  ],
  "3.1.2.CS.1: Demonstrate the application of skills in interpreting and reconstructing the past.": [
    "3.1.2.LI.1: Corroborate historical sources and draw conclusions.",
    "3.1.2.LI.2: Explore how methods and skills for reconstructing history can provide avenues for societal development."
  ],
  "1.2.1.CS.1: Demonstrate understanding of Pre-Historic Ghana. (50, 000 BCE to 700 CE)": [
    "1.2.1.LI.1: Examine the nature of the earliest human culture in Ghana.",
    "1.2.1.LI.2: Analyse the Pre-Historic Periods in Ghana."
  ],
  "1.2.1.CS.2: Demonstrate understanding of the diverse accounts of the emergence of major states in Ghana, including the causes of migration and creation of settlements.": [
    "1.2.1.LI.1: Analyse the multiple perspectives on the migration accounts of any major ethnic group that settled in each of the three vegetation zones in Ghana.",
    "1.2.1.LI.2: Discuss the reasons for the migration of the various ethnic groups into Ghana.",
    "1.2.1.LI.3: Recount factors responsible for the rise and decline of major states and kingdoms in Ghana."
  ],
  "1.2.1.CS.3: Demonstrate knowledge of the complex social, political, and scientific systems of selected states and kingdoms in Ghana.": [
    "1.2.1.LI.1: Analyse the socio-cultural organisation of the major kingdoms in Pre-Colonial Ghana.",
    "1.2.1.LI.2: Examine the political organisation of states and kingdoms in Pre-Colonial Ghana.",
    "1.2.1.LI.3: Explain the unique methods of providing health care in pre-colonial Ghana.",
    "1.2.1.LI.4: Analyse the history of Art and Technology in pre-colonial Ghana."
  ],
  "3.2.1.CS.1: Demonstrate understanding of African Pre-History from the Earliest Times to 500 BCE and appreciate the unique features of the complex African civilisations.": [
    "3.2.1.LI.1: Trace the origin of human beings from diverse point of views including scientific and non-scientific theories.",
    "3.2.1.LI.2: Assess the factors leading to the emergence of earliest African states and kingdoms.",
    "3.2.1.LI.3: Analyse the key features of earliest African civilisations."
  ],
  "1.2.2.CS.1: Demonstrate knowledge and understanding of pre-colonial economy and economic activities in Ghana.": [
    "1.2.2.LI.1: Examine agricultural activities in pre-colonial Ghana.",
    "1.2.2.LI.2: Investigate the existence and the development of pre-colonial Ghanaian industries.",
    "1.2.2.LI.3: Investigate the nature of trade and the development of trading activities in pre-colonial Ghana."
  ],
  "3.2.2.CS.1: Demonstrate understanding of the origins, organisation, and impact of the Trans-Saharan Trade": [
    "3.2.2.LI.1: Discuss the origin and nature of the Trans-Saharan Trade in Africa.",
    "3.2.2.LI.2: Assess the socio-economic and political effects of the Trans-Saharan Trade on pre-colonial African societies.",
    "3.2.2.LI.3: Investigate reasons for the decline of the Trans-Saharan Trade."
  ],
  "1.3.1.CS.1: Demonstrate understanding of the religious change and continuity in Ghana.": [
    "1.3.1.LI.1: Discuss the indigenous Ghanaian religious beliefs and practices.",
    "1.3.1.LI.2: Trace the advent and influences of Islam and Christianity in Ghana."
  ],
  "3.3.1.CS.1: Demonstrate understanding of the religious change and continuity in Africa.": [
    "3.3.1.LI.1: Discuss indigenous African religious beliefs and practices.",
    "3.3.1.LI.2: Trace the advent and influence of Islam and Christianity on Africa."
  ],
  "2.3.2.CS.1: Exhibit knowledge and understanding of the advent of European presence and activities along the coast of Ghana": [
    "2.3.2.LI.1: Identify the European countries whose citizens sailed to the coast of Ghana.",
    "2.3.2.LI.2: Explore the diverse motives behind European exploration to the coast of Ghana.",
    "2.3.2.LI.3: Examine the changing patterns of trade with the coming of Europeans."
  ],
  "3.3.2.CS.1: Demonstrate understanding of the advent and impact of the Trans-Atlantic Slave Trade in Africa.": [
    "3.3.2.LI.1: Investigate the nature and impact of the Trans-Atlantic Slave Trade.",
    "3.3.2.LI.2: Analyse the nature of African resistance against the Trans-Atlantic Slave Trade."
  ],
  "2.3.3.CS.1: Demonstrate understanding of the processes leading to the establishment of British rule in the Gold Coast and the impact on the people of Ghana.": [
    "2.3.3.LI.1: Examine sources on the processes leading to colonial rule in the Gold Coast.",
    "2.3.3.LI.2: Assess the socio-political effects of European (British) presence in Ghana.",
    "2.3.3.LI.3: Examine the effects of the European presence on the economy of Ghana."
  ],
  "3.3.3.CS.1: Demonstrate understanding of how the Europeans scrambled for and partitioned Africa and how Africans were eventually drawn into the two World Wars.": [
    "3.3.3.LI.1: Assess the Berlin Conference of 1884-1885 and its impact on Africa.",
    "3.3.3.LI.2: Assess indirect and direct rule systems in West Africa.",
    "3.3.3.LI.3: Assess Africa's role in the First and Second World Wars and how this influenced independence struggle across different regions."
  ],
  "2.3.4.CS.1: Demonstrate understanding of the nature and activities of Nationalist Movements including their efforts in resisting colonial domination in the Gold Coast.": [
    "2.3.4.LI.1: Describe the nature of resistance against colonial rule in Ghana.",
    "2.3.4.LI.2: Identify nationalist movements in Ghana before the WWII.",
    "2.3.4.LI.3: Analyse the activities of nationalist movements before the WWII.",
    "2.3.4.LI.4: Identify nationalist movements in Ghana after the WWII.",
    "2.3.4.LI.5: Examine post-WWII nationalist struggles in Ghana that led to the attainment of Independence."
  ],
  "3.3.4.CS.1: Demonstrate understanding of Africans’ resistance against colonial rule.": [
    "3.3.4.LI.1: Discuss the conditions that led to African resistance to colonial rule.",
    "3.3.4.LI.2: Analyse the nature of African resistance against colonial rule."
  ],
  "2.4.1.CS.1: Demonstrate understanding of the socio-economic and political developments in Ghana from 1957 - 2007.": [
    "2.4.1.LI.1: Examine the nature of the diarchic system of government in Ghana from 1957 – 1960.",
    "2.4.1.LI.2: Assess the Socio-economic and political developments in Ghana from 1957 – 1969.",
    "2.4.1.LI.3: Examine Ghana's socio-economic and political developments from 1969 - 1981.",
    "2.4.1.LI.4: Analyse the processes leading to the birth of the Fourth Republic.",
    "2.4.1.LI.5: Assess the socio-economic and political developments in Ghana from 1993 to 2007."
  ]
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
