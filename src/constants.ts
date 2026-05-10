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
  "English": ["Listening and Speaking", "Grammar", "Reading", "Writing", "Literature"],
  "Social Studies": ["Environment", "Governance, Politics and Stability", "Socio-Economic Development"],
  "Computing": ["Introduction to Computing", "Productivity Software", "Communication Networks", "Computational Thinking"],
  "Career Technology": ["Health and Safety", "Materials for Production", "Tools, Equipment and Processes", "Technology", "Designing and Making of Artefacts/Products", "Entrepreneurial Skills"],
  "Economics": ["Price Theory", "Consumer Behaviour", "Theory of Production", "National Income", "Money and Banking", "International Trade"],
  "Government": ["Concepts of Governance", "Political Systems", "International Relations", "Public Administration"],
  "History": ["Historiography", "Pre-Colonial Africa", "Colonial Rule", "Post-Colonial Africa"],
  "Geography": ["Physical Geography", "Human and Economic Geography", "Map Work and Practical Geography"],
  "RME": ["God, His Creation and Attributes", "Religious Practices", "The Family and the Community", "Religious Leaders and Personalities", "Ethics and Moral Life", "Religion and Economic Life"],
  "Creative Arts": ["Design", "Creative Arts"],
  "Financial Accounting": ["Financial Statements", "Partnership Accounts", "Company Accounts", "Cost Accounting Basics"],
  "Cost Accounting": ["Introduction to Cost Accounting", "Elements of Costing", "Materials Costing", "Labour and Overhead Costing", "Job and Batch Costing"],
  "Business Management": ["Nature of Management", "Functional Areas of Management", "Legal Environment of Business"],
  "French": ["Listening and Speaking", "Reading and Writing", "Grammar and Vocabulary", "Oral Expression", "Oral Comprehension"],
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
  "Systems": ["The Human Body Systems", "The Solar System", "Ecosystem", "Farming Systems"],
  "Forces and Energy": ["Energy", "Electricity and Electronics", "Conversion and Conservation of Energy", "Force and Motion", "Agricultural Tools"],
  "Humans and the Environment": ["Waste Management", "Human Health", "Science and Industry", "Climate Change and Green Economy", "Understanding the Environment", "Soil as a Component of the Environment"],
  
  // English
  "Listening and Speaking": ["Oral Work", "Conversation"],
  "Grammar": ["Language Structure", "Grammar Rules"],
  "Reading": ["Comprehension", "Fluency"],
  "Writing": ["Composition", "Functional Writing", "Summary Writing"],
  "Literature": ["Prose", "Poetry", "Drama"],
  
  // Social Studies
  "Environment": ["The Environment and Environmental Problems", "Adolescent Reproductive Health", "Our Culture", "Mapping our Environment", "Our Country Ghana", "Significance of some Natural Features", "Population Growth and Development"],
  "Governance, Politics and Stability": ["Ghana as a Nation", "Colonization And National Development", "Independence and Nationhood", "Citizenship and Human Rights", "Our Constitution", "Law and Order in our Community", "Conflict Prevention and Management", "Ghana’s Co-operation with Other Nations", "Government and Society", "Promoting Political Stability in Ghana"],
  "Socio-Economic Development": ["The Use of Land in Our Community", "Our Natural and Human Resources", "Production in Ghana", "Managing Our Finances", "Tourism, Leisure and Development", "Education and Productivity", "Entrepreneurship", "Problems of Development in Ghana", "Sustainable Development"],
  
  // Computing
  "Introduction to Computing": ["Components of Computers and Computer Systems", "Technology in the Community", "Health and Safety in the use of ICT Tools"],
  "Productivity Software": ["Introduction to Word Processing", "Introduction to Presentation", "Introduction to Desktop Publishing", "Introduction to Electronic Spreadsheet"],
  "Communication Networks": ["Computer Networks", "Internet and Social Media", "Information Security", "Web Technologies"],
  "Computational Thinking": ["Introduction to Programming", "Algorithm", "Robotics", "Artificial Intelligence"],

  // Creative Arts
  "Design": ["Design in Nature and Manmade Environment", "Drawing, Shading, Colouring and Modelling for Design", "Creativity, Innovation and the Design Process"],
  "Creative Arts": ["Media and Techniques", "Creative and Aesthetic Expression", "Connections in Local and Global Cultures"],

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
  "The Environment and Environmental Problems": {
    "Basic 7": ["B7.1.1.1: Meaning and components of environment"]
  },
  "Adolescent Reproductive Health": {
    "Basic 7": ["B7.1.2.1: Concept of adolescence"]
  },
  "Our Culture": {
    "Basic 8": ["B8.1.1.1: Meaning and elements of culture"]
  },
  "Ghana as a Nation": {
    "Basic 7": ["B7.2.1.1: Migration and settlement"]
  },
  "Our Constitution": {
    "Basic 8": ["B8.2.1.1: Features of the 1992 Constitution"]
  },
  "Production in Ghana": {
    "Basic 7": ["B7.3.3.1: Meaning and types of production"]
  },
  "Education and Productivity": {
    "Basic 8": ["B8.3.2.1: Improving productivity"]
  },
  "Problems of Development in Ghana": {
    "Basic 9": ["B9.3.1.1: Factors responsible for development problems"]
  },
  "Diversity of Matter": {
    "Materials": ["B7.1.1.1: Recognise materials as important resources", "B8.1.1.1: Types of mixtures", "B9.1.1.1: Binary chemical compounds"],
    "Living Cells": ["B7.1.2.1: Structure of organisms", "B8.1.2.1: Types of cells and their structure", "B9.1.2.1: Specialist cells of plants and humans"]
  },
  "Forces and Energy": {
    "Energy": ["B7.4.1.1: Forms of energy and their daily applications", "B8.4.1.1: Conversion of energy", "B9.4.1.1: Conservation of energy"],
    "Electricity and Electronics": ["B7.4.2.1: Forms of electricity", "B8.4.2.1: Electricity transmission", "B9.4.2.1: Electrical circuits"],
    "Conversion and Conservation of Energy": ["B7.4.3.1: Principle of conservation and conversion", "B8.4.3.1: Impact of energy conversion", "B9.4.3.1: Conversion and conservation in life"],
    "Force and Motion": ["B7.4.4.1: Concept of motion", "B8.4.4.1: Magnetic force", "B9.4.4.1: Force and pressure"],
    "Agricultural Tools": ["B7.4.5.1: Handling and maintenance", "B8.4.5.1: Use of basic tools", "B9.4.5.1: Making simple tools"]
  },
  "Humans and the Environment": {
    "Waste Management": ["B7.5.1.1: Scientific basis for management of waste", "B8.5.1.1: Waste management systems", "B9.5.1.1: Scientific methods used in waste management"],
    "Human Health": ["B7.5.2.1: Common deficiency diseases", "B8.5.2.1: Communicable diseases", "B9.5.2.1: Non-communicable diseases"],
    "Science and Industry": ["B7.5.3.1: Careers in science", "B8.5.3.1: Connections among science and society", "B9.5.3.1: Scientific concepts in industries"],
    "Climate Change and Green Economy": ["B7.5.4.1: Sustainable energy choices", "B8.5.4.1: Effects of climate change", "B9.5.4.1: Natural and human factors of climate change"],
    "Understanding the Environment": ["B7.5.5.1: Plants and animals in different land forms", "B8.5.5.1: Differences among soils", "B9.5.5.1: Use of plant parts"],
    "Soil as a Component of the Environment": ["B8.5.6.1: Rocks as origin of soils"]
  },
  "Systems": {
    "The Human Body Systems": ["B7.3.1.1: The respiratory and digestive system", "B8.3.1.1: Mammalian tooth", "B9.3.1.1: Circulatory and respiratory systems"],
    "The Solar System": ["B7.3.2.1: Inner planets", "B8.3.2.1: Outer planets", "B9.3.2.1: Non-planetary bodies"],
    "Ecosystem": ["B7.3.3.1: Components and interdependences", "B8.3.3.1: Feeding relationships", "B9.3.3.1: Composition of an ecosystem"],
    "Farming Systems": ["B7.3.4.1: Differences among farming systems", "B8.3.4.1: Crop, animal and land combinations", "B9.3.4.1: Manure from animal and plant waste"]
  },
  "Cycles": {
    "Earth Science": ["B7.2.1.1: Water cycle", "B8.2.1.1: Carbon cycle", "B9.2.1.1: Nitrogen cycle"],
    "Life Cycle of Organisms": ["B7.2.2.1: Life cycle of a housefly", "B8.2.2.1: Life cycle of the Anopheles mosquito", "B9.2.2.1: Life cycle of the grasshopper"],
    "Crop Production": ["B7.2.3.1: Plant nutrients", "B8.2.3.1: Planting crops on seed beds", "B9.2.3.1: Maturities of different crops"],
    "Animal Production": ["B7.2.4.1: Differences among domestic animals", "B8.2.4.1: Types of feed", "B9.2.4.1: Preparation of feed"]
  },
  "Health and Safety": {
    "Personal Hygiene and Food Hygiene": ["B7.1.1.1: Demonstrate knowledge of basic concept of staying healthy", "B8.1.1.1: Demonstrate skills of personal hygiene", "B9.1.1.1: Practice good grooming"],
    "Personal, Workshop and Food laboratory safety": ["B7.1.2.1: Demonstrate knowledge of preventing accidents in the workshop/site and laboratory", "B8.1.2.1: Demonstrate basic skills in applying First Aid", "B9.1.2.1: Describe procedures for reporting accidents"],
    "Environmental Health": ["B7.1.3.1: Demonstrate knowledge of basic concept of Environmental Health", "B8.1.3.1: Discuss desertification and deforestation", "B9.1.3.1: Discuss causes and prevention of poor sanitation"]
  },
  "Materials for Production": {
    "Compliant Materials": ["B7.2.1.1: Describe compliant materials", "B8.2.1.1: Discuss basic characteristics of compliant materials", "B9.2.1.1: Discuss factors that influence the selection of compliant materials"],
    "Resistant Materials": ["B7.2.2.1: Describe resistant materials", "B8.2.2.1: Explain basic properties of resistant materials", "B9.2.2.1: Select resistant materials for making products"],
    "Smart and Modern Materials": ["B7.2.3.1: Explore general properties of smart and modern materials", "B8.2.3.1: Discuss use of smart and modern materials", "B9.2.3.1: Discuss reasons for using smart and modern materials"]
  },
  "Tools, Equipment and Processes": {
    "Measuring and Marking Out": ["B7.3.1.1: Classify and use measuring and marking out tools", "B8.3.1.1: Identify tools and equipment for measuring and marking out", "B9.3.1.1: Discuss tools and equipment used for measuring and marking out"],
    "Cutting/Shaping": ["B7.3.2.1: Identify cutting and shaping tools", "B8.3.2.1: Identify and use cutting and shaping tools", "B9.3.2.1: Discuss tools and equipment used for cutting and shaping"],
    "Joining and Assembling": ["B7.3.3.1: Describe joining and assembling materials", "B8.3.3.1: Identify joining and assembling materials", "B9.3.3.1: Discuss materials, tools and equipment for joining"],
    "Kitchen Essentials": ["B7.3.4.1: Describe kitchen essentials", "B8.3.4.1: Maintain kitchen essentials", "B9.3.4.1: Select and purchase suitable kitchen essentials"]
  },
  "Technology": {
    "Simple Structures and Mechanisms, Electric and Electronic Systems": ["B7.4.1.1: Demonstrate understanding of structures in construction", "B8.4.1.1: Demonstrate understanding of forces acting on structures", "B9.4.1.1: Demonstrate knowledge of mechanisms in projects"]
  },
  "Designing and Making of Artefacts/Products": {
    "Communicating Designs": ["B7.5.1.1: Demonstrate knowledge and skills of drawing materials", "B8.5.1.1: Demonstrate understanding of drawing plane figures", "B9.5.1.1: Demonstrate understanding of developing surfaces of objects"],
    "Designing": ["B7.5.2.1: Demonstrate understanding of Designing", "B8.5.2.1: Demonstrate knowledge and skills of Designing", "B9.5.2.1: Demonstrate knowledge of Designing"],
    "Planning for making Artefacts/Products": ["B7.5.3.1: Demonstrate understanding of planning for making artefacts", "B8.5.3.1: Plan and make building artefacts", "B9.5.3.1: Demonstrate understanding for planning for making artefacts"],
    "Making Artefacts from Compliant, Resistant Materials and Food Ingredients": ["B7.5.4.1: Demonstrate skills of making artefacts", "B8.5.4.1: Demonstrate understanding of designing artefacts", "B9.5.4.1: Demonstrate understanding of gathering materials for making articles"]
  },
  "Entrepreneurial Skills": {
    "Career Pathways and Career Opportunities": ["B7.6.1.1: Demonstrate awareness of own learning styles", "B8.6.1.1: Demonstrate knowledge of career opportunities", "B9.6.1.1: Demonstrate understanding about the changing nature of the workplace"],
    "Establishing and Managing a Small Business Enterprise": ["B7.6.2.1: Demonstrate understanding of Establishing and managing a Small business", "B8.6.2.1: Demonstrate understanding of establishing and managing micro and small business", "B9.6.2.1: Demonstrate understanding of establishing and managing a small business"]
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
  "Literature (GL)": {
    "Oral and written literature": ["B7.6.1.1: Components of literature", "B8.6.1.1: Proverbs and idioms", "B9.6.1.1: Drum/horn language"]
  },
  "God, His Nature and Attributes": {
    "Basic 7": ["B7.1.1.1: Explain the nature of God seen through His attributes"]
  },
  "The Creation Stories": {
    "Basic 8": ["B8.1.1.1: Outline and explain moral lessons in creation stories"]
  },
  "Worship": {
    "Basic 7": ["B7.2.1.1: Explain how worship is performed"]
  },
  "Manners and Decency": {
    "Basic 7": ["B7.5.1.1: Develop good manners and apply them"]
  },
  "Work and Entrepreneurship": {
    "Basic 7": ["B7.6.1.1: Cultivate hard work and entrepreneurship"]
  },
  "Money": {
    "Basic 8": ["B8.6.1.1: Plan the wise use of money"]
  },
  "Family Systems": {
    "Basic 7": ["B7.3.1.1: Identify and explain importance of family systems"]
  },
  "Authority and Obedience": {
    "Basic 8": ["B8.3.1.1: Identify and explain importance of obeying authority"]
  },
  "Religious Leaders": {
    "Basic 7": ["B7.4.1.1: Early life and call of religious leaders"]
  },
  "Prophets and Caliphs": {
    "Basic 8": ["B8.4.1.1: Moral lessons from prophets and caliphs"]
  },
  "Moral Teachings": {
    "Basic 8": ["B8.5.1.1: Moral teachings from scripture and oral traditions"]
  },
  "Reward, Punishment and Repentance": {
    "Basic 9": ["B9.5.1.1: Good deeds and punishment"]
  },
  "Time and Leisure": {
    "Basic 9": ["B9.6.1.1: Managing time profitably"]
  },
  "The Purpose and Usefulness of God's Creation": {
    "Basic 9": ["B9.1.1.1: Describe purpose of God's creation"]
  },
  "Religious Songs and Recitations": {
    "Basic 7": ["B7.2.2.1: Analyse moral values in songs"]
  },
  "Rites of Passage": {
    "Basic 8": ["B8.2.1.1: Explain rites of passage"]
  },
  "Religious Festivals": {
    "Basic 9": ["B9.2.1.1: Understand religious festivals"]
  },
  "Religion and Social Cohesion": {
    "Basic 9": ["B9.3.1.1: Ways people can co-exist peacefully"]
  },
  "Women in Religion": {
    "Basic 9": ["B9.4.1.1: Leadership role of women"]
  },
  "Substance Abuse": {
    "Basic 7": ["B7.5.2.1: Need to stay away from substance abuse"]
  },
  "Bribery and Corruption": {
    "Basic 8": ["B8.6.2.1: Avoid bribery and corruption"]
  },
  // Computing - Strand 1
  "Components of Computers and Computer Systems": {
    "Basic 7": ["B7.1.1.1: Examine the parts of a computer"],
    "Basic 8": ["B8.1.1.1: Identify parts a computer and technology tools"],
    "Basic 9": ["B9.1.1.1: Identify parts of a Computer and Technology Tools"]
  },
  "Technology in the Community": {
    "Basic 7": ["B7.1.2.1: Demonstrate the use of Technology in the community"],
    "Basic 8": ["B8.1.2.1: Demonstrate the use of Technology in the Community"],
    "Basic 9": ["B9.1.2.1: Demonstrate the Use of Technology in the Community"]
  },
  "Health and Safety in the use of ICT Tools": {
    "Basic 7": ["B7.1.3.1: Demonstrate how to apply Health and Safety measures"],
    "Basic 8": ["B8.1.3.1: Demonstrate How to Apply Health and Safety measures"],
    "Basic 9": ["B9.1.3.1: Demonstrate How to Apply Health and Safety Measures"]
  },
  // Computing - Strand 2
  "Introduction to Word Processing": {
    "Basic 7": ["B7.2.1.1: Demonstrate how to use Microsoft Word (Editing)"],
    "Basic 8": ["B8.2.1.1: Demonstrate How to Use Microsoft Word (tables and hyperlink pages)"],
    "Basic 9": ["B9.2.1.1: Demonstrate How to Use Microsoft Word (Multimedia)"]
  },
  "Introduction to Presentation": {
    "Basic 7": ["B7.2.2.1: Demonstrate how to use Microsoft PowerPoint (Editing)"],
    "Basic 8": ["B8.2.2.1: Demonstrate how to use Microsoft PowerPoint (Multimedia)"],
    "Basic 9": ["B9.2.2.1: Demonstrate How to use Microsoft PowerPoint (Multimedia)"]
  },
  "Introduction to Desktop Publishing": {
    "Basic 8": ["B8.2.3.1: Demonstrate how to use MS-Publisher"],
    "Basic 9": ["B9.2.3.1: Critique a Desktop Published Document"]
  },
  "Introduction to Electronic Spreadsheet": {
    "Basic 7": ["B7.2.3.1: Demonstrate how to use the Spreadsheet"],
    "Basic 8": ["B8.2.4.1: Demonstrate How to Use the Spreadsheet (using functions)"],
    "Basic 9": ["B9.2.4.1: Demonstrate How to Use Spreadsheet (Advanced Operations)"]
  },
  // Computing - Strand 3
  "Computer Networks": {
    "Basic 7": ["B7.3.1.1: Identify the concept of computer networking for global communications"],
    "Basic 8": ["B8.3.1.1: Identify the concept of computer networking for global communication"],
    "Basic 9": ["B9.3.1.1: Know the Concept of Computer Networking for Global Communications"]
  },
  "Internet and Social Media": {
    "Basic 7": ["B7.3.2.1: Demonstrate the use of Social Networking and Electronic Mail"],
    "Basic 8": ["B8.3.2.1: Demonstrate the use of Social Networking and Electronic Mail"],
    "Basic 9": ["B9.3.2.1: Demonstrate the Use of Social Networking and Electronic Mail"]
  },
  "Information Security": {
    "Basic 7": ["B7.3.3.1: Recognise data threats and means of protection"],
    "Basic 8": ["B8.3.3.1: Recognise data threats and security protections"],
    "Basic 9": ["B9.3.3.1: Recognise data threats and the means of protection"]
  },
  "Web Technologies": {
    "Basic 7": ["B7.3.4.1: Demonstrate the use of a Web Browser (Search engine)"],
    "Basic 8": ["B8.3.4.1: Demonstrate the use of a web browser (Search engine)"],
    "Basic 9": ["B9.3.4.1: Demonstrate the Use of a Web Browser (Blogging)"]
  },
  // Computing - Strand 4
  "Introduction to Programming": {
    "Basic 7": ["B7.4.1.1: Show an understanding of the concept of programming"],
    "Basic 8": ["B8.4.1.1: Show an understanding of the concept of programming"],
    "Basic 9": ["B9.4.1.1: Show an Understanding of the Concept of Programming"]
  },
  "Algorithm": {
    "Basic 7": ["B7.4.2.1: Analyse the correct step-by-step procedure in solving any real-world problem"],
    "Basic 8": ["B8.4.2.1: Analyse the correct step-by-step procedure in solving any real-world problem"],
    "Basic 9": ["B9.4.2.1: Analyse the Correct Step-by-step Procedure in Solving any Real-world Problem"]
  },
  "Robotics": {
    "Basic 7": ["B7.4.3.1: Discuss Robot Intelligence Concepts"],
    "Basic 8": ["B8.4.3.1: Discuss Robot Intelligence Concepts"],
    "Basic 9": ["B9.4.3.1: Discuss Robot Intelligence Concepts"]
  },
  "Artificial Intelligence": {
    "Basic 7": ["B7.4.4.1: Discuss Artificial intelligence concepts"],
    "Basic 8": ["B8.4.4.1: Discuss Artificial Intelligence Concepts"],
    "Basic 9": ["B9.4.4.1: Discuss Artificial intelligence Concepts"]
  },
  "Design": {
    "Design in Nature and Manmade Environment": ["B7.1.1.1: Design in nature and manmade environment", "B8.1.1.1: Design as a concept", "B9.1.1.1: Design as a concept (variety, proportion)"],
    "Drawing, Shading, Colouring and Modelling for Design": ["B7.1.2.1: Outline drawing, shading, colouring", "B8.1.2.1: 2-D drawing, shading, colouring", "B9.1.2.1: 3-D drawing, shading, colouring"],
    "Creativity, Innovation and the Design Process": ["B7.1.3.1: Design process and models", "B8.1.3.1: Design process in problem solving", "B9.1.3.1: Design process in problem solving (B9)"]
  },
  "Creative Arts": {
    "Media and Techniques": ["B7.2.1.1: Visual Arts Media", "B7.2.1.2: Music Scale", "B7.2.1.3: Dance and Drama Techniques", "B8.2.1.1: Visual Arts Drawing/Printmaking", "B8.2.1.2: Music Tempo", "B8.2.1.3: Ghanaian Dance forms", "B9.2.1.1: Visual Arts Casting", "B9.2.1.2: Music Triads", "B9.2.1.3: Dance Drama Application"],
    "Creative and Aesthetic Expression": ["B7.2.2.1: Visual Arts Idea development", "B7.2.2.2: Music Idea development", "B7.2.2.3: Dance and Drama Idea development", "B8.2.2.1: Visual Arts apply design process", "B8.2.2.2: Music produce musical artworks", "B8.2.2.3: Dance and Drama apply design process", "B9.2.2.1: Visual Arts Exhibit artworks", "B9.2.2.2: Music Exhibit musical works", "B9.2.2.3: Producing a Dance Drama"],
    "Connections in Local and Global Cultures": ["B7.2.3.1: Visual Arts Correlate ideas", "B7.2.3.2: Music Correlate musical forms", "B7.2.3.3: Dance and Drama Correlate dancers", "B8.2.3.1: Visual Arts Correlate visual artists", "B8.2.3.2: Music Correlate art musicians", "B8.2.3.3: Dance and Drama Correlate artistes", "B9.2.3.1: Visual Arts Correlate African artists", "B9.2.3.2: Music Correlate African composers", "B9.2.3.3: Dance and Drama Correlate African dance"]
  },
  "Listening and Speaking": {
    "Oral Work": ["B7.1.1.1: Pure Vowel Sounds", "B7.1.1.2: Consonants", "B7.1.1.3: Diphthongs", "B8.1.1.1: Revision of Vowels and Consonants"],
    "Conversation": ["B7.1.4.1: Conversation", "B8.1.2.1: Intonation", "B9.1.4.1: Spontaneous Speech"]
  },
  "Grammar": {
    "Language Structure": ["B7.2.1.1: Noun Classes", "B7.2.4.1: Verb Tense Forms", "B8.2.1.1: Auxiliary Verbs (Modals)", "B9.2.1.1: Relative Clauses"],
    "Grammar Rules": ["B7.2.6.1: Subject - Verb Agreement", "B8.2.3.1: Clauses", "B9.2.6.1: Subject-Verb Agreement (B9)"]
  },
  "Reading": {
    "Comprehension": ["B7.3.3.1: Reading Comprehension", "B8.3.1.1: Literal and Inferential Comprehension", "B9.3.1.1: Reading for Meaning"],
    "Fluency": ["B7.3.1.1: Fluent Reading", "B7.3.2.1: Fast Reading"]
  },
  "Writing": {
    "Composition": ["B7.4.3.1: Paragraph and Paragraphing", "B7.4.4.1: Narrative Writing", "B8.4.5.1: Writing Reports"],
    "Functional Writing": ["B7.4.7.1: Writing Friendly Letters", "B8.4.2.1: Writing Dialogues", "B9.4.5.1: Functional Writing: Formal Letters"],
    "Summary Writing": ["B7.4.9.1: Guided Summary Writing", "B8.4.8.1: Summary Writing", "B9.4.2.1: Summary Writing of Texts"]
  },
  "Literature": {
    "Prose": ["B7.5.1.1: Oral Narratives (Folktales, Myths, Legends)", "B8.5.1.1: African/Non-African Short Stories", "B9.5.1.1: Novels"],
    "Poetry": ["B7.5.2.1: Traditional African Poetry", "B8.5.2.1: Simple Poems", "B9.5.2.1: Poetry (B9)"],
    "Drama": ["B7.5.4.1: Traditional Drama", "B8.5.3.1: Simple Plays", "B9.5.3.1: Drama (B9)"]
  },
};

export const STANDARD_INDICATORS: Record<string, string[]> = {
  // Career Technology - Health and Safety
  "B7.1.1.1: Demonstrate knowledge of basic concept of staying healthy": ["B7.1.1.1.1: Discuss the need to stay healthy", "B7.1.1.1.2: Describe ways of maintaining personal hygiene", "B7.1.1.1.3: Discuss food hygiene"],
  "B7.1.2.1: Demonstrate knowledge of preventing accidents in the workshop/site and laboratory": ["B7.1.2.1.1: Describe accidents in the workshop/site/laboratory", "B7.1.2.1.2: Explain the need for keeping the workshop/site and the laboratory safe"],
  "B7.1.3.1: Demonstrate knowledge of basic concept of Environmental Health": ["B7.1.3.1.1: Discuss the factors of environmental health", "B7.1.3.1.2: Demonstrate the preventive measures of environmental health"],
  
  // Career Technology - Materials for Production
  "B7.2.1.1: Describe compliant materials": ["B7.2.1.1.1: Describe compliant materials", "B7.2.1.1.2: Distinguish between types of compliant materials", "B7.2.1.1.3: Explain how compliant materials are manufactured"],
  "B7.2.2.1: Describe resistant materials": ["B7.2.2.1.1: Describe resistant materials", "B7.2.2.1.2: Distinguish between the types of resistant materials", "B7.2.2.1.3: Explain how each of the resistant materials is manufactured"],
  
  // Career Technology - Tools, Equipment and Processes
  "B7.3.1.1: Classify and use measuring and marking out tools": ["B7.3.1.1.1: Classify and use measuring and marking out tools and equipment", "B7.3.1.1.2: Demonstrate how to care for and maintain measuring and marking out tools"],
  "B7.3.4.1: Describe kitchen essentials": ["B7.3.4.1.1: Describe kitchen essentials", "B7.3.4.1.2: Demonstrate skills in the classification of kitchen essentials"],
  "B7.3.2.1: Identify cutting and shaping tools": ["B7.3.2.1.1: Identify cutting and shaping tools and equipment", "B7.3.2.1.2: Use appropriate skills in cutting, chopping, slicing, dicing and shaping"],
  "B7.3.3.1: Describe joining and assembling materials": ["B7.3.3.1.1: Describe joining and assembling materials, tools and equipment", "B7.3.3.1.2: Use appropriate skills for joining and assembling artefacts"],

  // Career Technology - Technology
  "B7.4.1.1: Demonstrate understanding of structures in construction": ["B7.4.1.1.1: Outline the uses of structures in construction", "B7.4.1.1.2: Discuss the causes of structural failures in construction", "B7.4.1.1.3: Design and make simple structures"],

  // Career Technology - Designing and Making
  "B7.5.1.1: Demonstrate knowledge and skills of drawing materials": ["B7.5.1.1.1: Identify drawing materials, instruments and equipment", "B7.5.1.1.2: Discuss the types of lines used in graphic communication", "B7.5.1.1.3: Make sketches of lines, curves, objects, and write letterings"],

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
  "B7.1.1.1: Recognise materials as important resources": ["B7.1.1.1.1: Classify materials into liquids, solids and gases", "B7.1.1.1.2: Discuss importance of liquids", "B7.1.1.1.3: Discuss importance of solids"],
  "B8.1.1.1: Types of mixtures": ["B8.1.1.1.1: Identify types of mixtures", "B8.1.1.1.2: Design and perform processes for separating mixtures"],
  "B9.1.1.1: Binary chemical compounds": ["B9.1.1.1.1: Identify binary chemical compounds", "B9.1.1.1.2: Discuss formation of binary chemical compounds", "B9.1.1.1.3: Characteristics of common acids, bases and salts"],
  "B7.1.2.1: Structure of organisms": ["B7.1.2.1.1: Describe structure and function of animal cells", "B7.1.2.1.2: State functions of organelles in plant cells"],

  // Science - Cycles
  "B7.2.1.1: Water cycle": ["B7.2.1.1.1: Explain how water cycle occurs", "B7.2.1.1.2: Describe importance of water cycle"],
  "B8.2.1.1: Carbon cycle": ["B8.2.1.1.1: Explain process of carbon cycle", "B8.2.1.1.2: Describe role of carbon cycle to the environment"],
  "B9.2.1.1: Nitrogen cycle": ["B9.2.1.1.1: Explain process of nitrogen cycle", "B9.2.1.1.2: Describe importance of nitrogen cycle"],
  "B7.2.2.1: Life cycle of a housefly": ["B7.2.2.1.1: Describe life cycle of housefly", "B7.2.2.1.2: Discuss housefly as a menace"],
  
  // Science - Systems
  "B7.3.1.1: The respiratory and digestive system": ["B7.3.1.1.1: Explain concept of food", "B7.3.1.1.2: Examine what happens during digestion"],
  "B8.3.1.1: Mammalian tooth": ["B8.3.1.1.1: Identify parts of mammalian tooth", "B8.3.1.1.2: Functions of human teeth", "B8.3.1.1.3: Causes and prevention of tooth decay"],
  "B7.3.2.1: Inner planets": ["B7.3.2.1.1: Identify inner planets", "B7.3.2.1.2: Properties of Mercury and Venus"],
  "B8.3.2.1: Outer planets": ["B8.3.2.1.1: Identify outer planets", "B8.3.2.1.2: Properties of Jupiter, Saturn, Uranus, Neptune"],

  // Science - Forces and Energy
  "B7.4.1.1: Forms of energy and their daily applications": ["B7.4.1.1.1: Identify forms of energy", "B7.4.1.1.2: Explain daily applications"],
  "B8.4.1.1: Conversion of energy": ["B8.4.1.1.1: Describe energy conversion", "B8.4.1.1.2: Discuss importance of conversion"],
  "B9.4.1.1: Conservation of energy": ["B9.4.1.1.1: List ways to conserve energy", "B9.4.1.1.2: Explain importance of energy conservation"],

  // Science - Humans and the Environment
  "B7.5.1.1: Scientific basis for management of waste": ["B7.5.1.1.1: Apply information for management of waste"],
  "B8.5.1.1: Waste management systems": ["B8.5.1.1.1: Explain sustainable waste management practices"],
  "B9.5.1.1: Scientific methods used in waste management": ["B9.5.1.1.1: Investigate scientific methods in waste management"],

  // Science - More Forces/Energy
  "B7.4.3.1: Principle of conservation and conversion": ["B7.4.3.1.1: Explain principle of conservation", "B7.4.3.1.2: Demonstrate conversion of energy"],
  "B7.4.4.1: Concept of motion": ["B7.4.4.1.1: Understand unbalanced forces", "B7.4.4.1.2: State Newton's first law"],
  "B7.4.5.1: Handling and maintenance": ["B7.4.5.1.1: Explain rules in handling simple tools"],
  "B8.4.3.1: Impact of energy conversion": ["B8.4.3.1.1: Explain importance of energy conversion"],
  "B8.4.4.1: Magnetic force": ["B8.4.4.1.1: Demonstrate simple ways of making magnets"],

  // Science - More Humans/Environment
  "B7.5.3.1: Careers in science": ["B7.5.3.1.1: Discover and explain careers in science"],
  "B7.5.4.1: Sustainable energy choices": ["B7.5.4.1.1: Search for information on sustainable energy choices"],
  "B7.5.5.1: Plants and animals in different land forms": ["B7.5.5.1.1: List and describe plants and animals in different land forms"],
  "B8.5.6.1: Rocks as origin of soils": ["B8.5.6.1.1: Observe and describe different types of rocks"],
  
  // English - Listening and Speaking
  "B7.1.1.1: Pure Vowel Sounds": ["B7.1.1.1.1: Distinguish between various pure vowel sounds", "B7.1.1.1.2: Make pure vowel sounds correctly in isolation and context"],
  "B7.1.1.2: Consonants": ["B7.1.1.2.1: Pronounce distinct consonant sounds", "B7.1.1.2.2: Recognise differences in articulation of consonants"],
  "B7.1.4.1: Conversation": ["B7.1.4.1.1: Talk about/describe people and objects", "B7.1.4.1.2: Talk about/describe occasions and festivals"],
  "B8.1.2.1: Intonation": ["B8.1.2.1.1: Identify the two basic tunes", "B8.1.2.1.2: Recognize changes in meaning produced by tunes"],

  // English - Grammar
  "B7.2.1.1: Noun Classes": ["B7.2.1.1.1: Identify common and proper nouns", "B7.2.1.1.2: Distinguish between common and proper nouns"],
  "B7.2.4.1: Verb Tense Forms": ["B7.2.4.1.1: Identify and use appropriate verb tense forms", "B7.2.4.1.2: Use correct verb forms in speech and writing"],
  "B9.2.1.1: Relative Clauses": ["B9.2.1.1.1: Identify relative clauses", "B9.2.1.1.2: Use defining/non-defining relative clauses"],

  // English - Reading
  "B7.3.3.1: Reading Comprehension": ["B7.3.3.1.1: Read silently and answer factual and inferential questions"],
  "B9.3.1.1: Reading for Meaning": ["B9.3.1.1.1: Read silently with understanding", "B9.3.1.1.2: Recall facts and ideas", "B9.3.1.1.3: Infer meaning from texts"],

  // English - Writing
  "B7.4.4.1: Narrative Writing": ["B7.4.4.1.1: Narrate incidents/events orally/written", "B7.4.4.1.2: Reproduce stories in writing"],
  "B9.4.5.1: Functional Writing: Formal Letters": ["B9.4.5.1.1: Write formal letters using appropriate features"],
  
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
  "B7.1.1.1: Meaning and components of environment": ["B7.1.1.1.1: Explain meaning of environment", "B7.1.1.1.2: Identify physical and social components"],
  "B7.1.2.1: Concept of adolescence": ["B7.1.2.1.1: Explain the concept of adolescence", "B7.1.2.1.2: Discuss characteristics of adolescence"],
  "B8.1.1.1: Meaning and elements of culture": ["B8.1.1.1.1: Explain the meaning of culture", "B8.1.1.1.2: Identify factors responsible for cultural change"],

  // Social Studies - Governance
  "B7.2.1.1: Migration and settlement": ["B7.2.1.1.1: Trace migration routes of major ethnic groups", "B7.2.1.1.2: Identify original settlements in Ghana"],
  "B8.2.1.1: Features of the 1992 Constitution": ["B8.2.1.1.1: Explain the meaning and importance of a constitution", "B8.2.1.1.2: Identify the three organs of government"],

  // Social Studies - Socio-Economic
  "B7.3.3.1: Meaning and types of production": ["B7.3.3.1.1: Explain the meaning of production", "B7.3.3.1.2: Identify types of primary production in Ghana"],
  "B8.3.2.1: Improving productivity": ["B8.3.2.1.1: Explain education, training and productivity", "B8.3.2.1.2: Identify factors that improve productivity"],
  "B9.3.1.1: Factors responsible for development problems": ["B9.3.1.1.1: Discuss economic and social factors", "B9.3.1.1.2: Suggest solutions for development problems"]
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
