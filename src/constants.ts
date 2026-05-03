export const subjects = [
  "English", 
  "Mathematics", 
  "Science", 
  "Integrated Science",
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

export const SUBJECT_STRANDS: Record<string, string[]> = {
  "Mathematics": ["Numbers", "Algebra", "Geometry and Measurement", "Data"],
  "Elective Mathematics": ["Algebra", "Trigonometry", "Calculus", "Coordinate Geometry", "Statics and Probability", "Vectors and Mechanics"],
  "Science": ["Diversity of Matter", "Cycles", "Systems", "Energy", "Interactions of Matter"],
  "Integrated Science": ["Diversity of Matter", "Cycles", "Systems", "Energy", "Interactions of Matter"],
  "Physics": ["Mechanics", "Thermal Physics", "Waves", "Electricity and Magnetism", "Atomic and Nuclear Physics"],
  "Chemistry": ["Atomic Structure", "Chemical Bonding", "Physical Chemistry", "Inorganic Chemistry", "Organic Chemistry", "Chemistry and Environment"],
  "Biology": ["Cell Biology", "Genetics", "Physiology", "Ecology", "Plant Biology", "Diversity of Life"],
  "English": ["Oral Language", "Reading", "Writing", "Using Language Expressions", "Literature"],
  "Social Studies": ["Environment", "Governance", "Socio-Economic Development", "Socialization"],
  "Computing": ["Computing Systems", "Internet and Social Media", "Productivity Software", "Computational Thinking"],
  "Career Technology": ["Health and Safety", "Materials for Production", "Tools, Process and Application", "Technology", "Personal Entrepreneurial Skills"],
  "Economics": ["Price Theory", "Consumer Behaviour", "Theory of Production", "National Income", "Money and Banking", "International Trade"],
  "Government": ["Concepts of Governance", "Political Systems", "International Relations", "Public Administration"],
  "History": ["Historiography", "Pre-Colonial Africa", "Colonial Rule", "Post-Colonial Africa"],
  "Geography": ["Physical Geography", "Human and Economic Geography", "Map Work and Practical Geography"],
  "RME": ["God, His Creation and Attributes", "Religious Practices", "Ethics and Moral Life", "Social and Economic Development"],
  "Creative Arts": ["Visual Arts", "Performing Arts"],
  "Financial Accounting": ["Financial Statements", "Partnership Accounts", "Company Accounts", "Cost Accounting Basics"],
  "Cost Accounting": ["Introduction to Cost Accounting", "Elements of Costing", "Materials Costing", "Labour and Overhead Costing", "Job and Batch Costing"],
  "Business Management": ["Nature of Management", "Functional Areas of Management", "Legal Environment of Business"],
  "French": ["Listening and Speaking", "Reading and Writing", "Grammar and Vocabulary", "Oral Expression", "Oral Comprehension"],
  "Ghanaian Language": ["Language and Culture", "Oral Literature", "Grammar", "Reading and Writing"],
  "Agricultural Science": ["Introduction to Agriculture", "Soil Science", "Crop Science", "Animal Science", "Agricultural Economics and Extension"],
  "Elective ICT": ["Information Systems", "Computer Architecture", "Networking and Data Communications", "Software Development", "Web and Multimedia Development"],
  "CRS": ["Biblical Studies", "History of the Church", "Ethics and Moral Life"],
  "IRS": ["Al-Quran", "Al-Hadith", "Al-Fiqh", "Islamic History"],
  "Literature in English": ["Introduction to Literature", "African Prose", "Non-African Prose", "African Poetry", "Non-African Poetry", "Drama"]
};

export const SUBJECT_SUB_STRANDS: Record<string, string[]> = {
  // Mathematics
  "Numbers": ["Whole Numbers", "Number Operations", "Fractions, Decimals and Percentages", "Ratios and Proportion", "Number Theory", "Standard Form and Indices"],
  "Algebra": ["Patterns and Relationships", "Algebraic Expressions", "Variables and Equations", "Functions", "Sequences and Series"],
  "Geometry and Measurement": ["Shapes and Space", "Measurement", "Geometric Reasoning", "Position and Transformation", "Trigonometry"],
  "Data": ["Data Collection and Presentation", "Data Analysis", "Probability"],
  
  // Science
  "Diversity of Matter": ["Living and Non-Living Things", "Materials", "Classification of Organisms", "Physical and Chemical Changes", "Atomic Structure", "The Periodic Table"],
  "Cycles": ["Life Cycles of Animals", "Plant Life Cycles", "The Solar System", "Water and Rock Cycles", "Nitrogen and Carbon Cycles"],
  "Systems": ["The Human Body Systems", "The Ecosystem", "Electrical Systems", "Mechanical Systems", "Agricultural Systems"],
  "Energy": ["Forms and Sources of Energy", "Light and Sound", "Heat and Electricity", "Nuclear Energy", "Alternative Energy Sources"],
  "Interactions of Matter": ["Forces and Motion", "Magnetism", "Soil and Atmosphere", "Environmental Issues", "Erosion and Conservation"],
  
  // English
  "Oral Language": ["Listening and Speaking", "Phonological Awareness", "Vocabulary and Oral Expressions", "Listening Comprehension"],
  "Reading": ["Word Analysis", "Comprehension", "Fluency and Appreciation", "Scanning and Skimming"],
  "Writing": ["Penmanship", "Composition", "Spelling and Grammar", "Creative Writing", "Letter Writing", "Formal Writing"],
  "Using Language Expressions": ["Grammar", "Punctuation", "Sentence Structure", "Figures of Speech", "Idioms and Maxims"],
  "Literature": ["Prose", "Poetry", "Drama", "Ghanaian Literature", "African Authors"],
  
  // Social Studies
  "Environment": ["Our Physical Environment", "Environmental Challenges", "Mapping Our World", "Natural Resources"],
  "Governance": ["Citizenship", "The Constitution", "Governance in Ghana", "Human Rights", "The Rule of Law"],
  "Socio-Economic Development": ["Productive Activities", "Financial Literacy", "Tourism", "National Integration", "Population"],
  "Socialization": ["Culture and National Identity", "Family and Community", "Social Conflict", "Self and Self-Worth"],
  
  // Computing
  "Computing Systems": ["Hardware and Software", "Operating Systems", "Computer Laboratory Management", "Artificial Intelligence Basics"],
  "Internet and Social Media": ["Web Browsing", "Digital Communication", "Cyber Security", "Social Media Ethics"],
  "Productivity Software": ["Word Processing", "Spreadsheets", "Presentation Tools", "Desktop Publishing"],
  "Computational Thinking": ["Algorithms", "Programming", "Problem Solving", "Database Management"],

  // RME
  "God, His Creation and Attributes": ["The Creator", "God's Attributes", "Relationship with God"],
  "Religious Practices": ["Prayer", "Festivals", "Sacred Places", "Rites of Passage"],
  "Ethics and Moral Life": ["Good Morals", "Social Vices", "Personal Responsibility", "Honesty"],

  // Physics
  "Mechanics": ["Statics", "Dynamics", "Fluid Mechanics"],
  "Thermal Physics": ["Heat Transfer", "Thermodynamics"],

  // Chemistry
  "Atomic Structure": ["Subatomic Particles", "Electron Configuration"],
  "Chemical Bonding": ["Ionic Bonding", "Covalent Bonding", "Metallic Bonding"]
};

export const SUB_STRAND_STANDARDS: Record<string, Record<string, string[]>> = {
  "Numbers": {
    "Whole Numbers": ["B7.1.1.1: Count, read, and write whole numbers", "B7.1.1.2: Compare and order whole numbers"],
    "Number Operations": ["B7.1.2.1: Add and subtract integers", "B7.1.2.2: Multiplication and division of integers"],
    "Fractions, Decimals and Percentages": ["B7.1.3.1: Concepts of fractions", "B7.1.3.2: Conversion between types"],
    "Ratios and Proportion": ["B7.1.4.1: Demonstrate an understanding of the concept of ratios and its relationship to fractions"]
  },
  "Algebra": {
    "Variables and Equations": ["B7.2.3.1: Demonstrate an understanding of linear equations of the form x + a = b"]
  },
  "Systems": {
    "The Human Body Systems": ["B7.3.1.1: The respiratory system", "B7.3.1.2: The digestive system"],
    "The Ecosystem": ["B7.3.2.1: Food chains and webs", "B7.3.2.2: Energy flow"],
    "Farming Systems": ["B7.3.4.1: Demonstrate an understanding of the differences among the various farming systems"]
  },
  "Cycles": {
    "Animal Production": ["B7.2.4.1: Demonstrate an understanding of the differences among domestic animals", "B7.2.4.2: Show an understanding of the usefulness of different types of animals"]
  },
  "Oral Language": {
    "Listening and Speaking": ["B7.1.1.1: Conversation skills", "B7.1.1.2: Public speaking basics"],
    "English Sounds": ["B7.1.3.1: Articulate English speech sounds to develop confidence and skills in listening and speaking"],
    "Listening Comprehension": ["B7.1.2.1: Identifying main ideas", "B7.1.2.2: Note-taking from audio"]
  },
  "Reading": {
    "Comprehension": ["B7.2.1.2: Read, comprehend and interpret texts"],
    "Summarising": ["B7.2.2.1: Demonstrate an understanding in summarizing", "B7.2.2.2: Demonstrate understanding of textual evidence that supports a writing piece"]
  }
};

export const STANDARD_INDICATORS: Record<string, string[]> = {
  // Mathematics
  "B7.1.1.1: Count, read, and write whole numbers": ["B7.1.1.1.1: Use place value to count", "B7.1.1.1.2: Write numbers in words"],
  "B7.1.2.1: Add and subtract integers": ["B7.1.2.1.1: Use number lines for addition", "B7.1.2.1.2: Solve word problems"],
  "B7.1.4.1: Demonstrate an understanding of the concept of ratios and its relationship to fractions": ["B7.1.4.1.1: Find ratio and use ratio language", "B7.1.4.1.2: Use unit rate concept", "B7.1.4.1.3: Make tables of equivalent ratios"],
  "B7.2.3.1: Demonstrate an understanding of linear equations of the form x + a = b": ["B7.2.3.1.1: Translate word problems to linear equations", "B7.2.3.1.2: Model and solve linear equations using concrete materials"],
  
  // Science
  "B7.3.1.1: The respiratory system": ["B7.3.1.1.1: Identify parts of the system", "B7.3.1.1.2: Describe gas exchange"],
  "B7.2.4.1: Demonstrate an understanding of the differences among domestic animals": ["B7.2.4.1.1: Examine and list domestic animals", "B7.2.4.1.2: Show differences and similarities among domestic animals"],
  "B7.2.4.2: Show an understanding of the usefulness of different types of animals": ["B7.2.4.2.1: Discuss domestic and commercial uses of animals", "B7.2.4.2.2: Observe and compare uses of different types of animals"],
  "B7.3.4.1: Demonstrate an understanding of the differences among the various farming systems": ["B7.3.4.1.1: Examine and discuss differences among farming systems", "B7.3.4.1.2: Categorise different farming systems", "B7.3.4.1.3: Discuss usefulness of different farming systems"],
  
  // English
  "B7.1.1.1: Conversation skills": ["B7.1.1.1.1: Demonstrate active listening", "B7.1.1.1.2: Responding appropriately in dialogue"],
  "B7.1.3.1: Articulate English speech sounds to develop confidence and skills in listening and speaking": ["B7.1.3.1.1: Produce pure vowel sounds (short vowels) in context", "B7.1.3.1.2: Produce pure vowel sounds (long vowels) in context", "B7.1.3.1.3: Produce diphthongs in context"],
  "B7.2.1.2: Read, comprehend and interpret texts": ["B7.2.1.2.3: Interpret a non-literary text showing personal responses"],
  "B7.2.2.1: Demonstrate an understanding in summarizing": ["B7.2.2.1.1: Use summarising to understand key ideas in a range of texts"],
  "B7.2.2.2: Demonstrate understanding of textual evidence that supports a writing piece": ["B7.2.2.2.1: Determine and analyse central and supporting ideas of texts"]
};
