import React, { useState, useEffect } from 'react';
import { 
  Atom, Calculator, Layers, Sparkles, BookOpen, Clock, CheckCircle, 
  ChevronRight, ArrowRight, CornerDownRight, RotateCcw, Award, Play, 
  AlertCircle, Info, Download, Printer, Users, HelpCircle, Shuffle, 
  BarChart3, RefreshCw, Eye, EyeOff, Check, Heart, Trophy, FileSpreadsheet, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// ----------------------------------------------------
// Interfaces & Static Definitions
// ----------------------------------------------------

interface KitItem {
  id: string;
  name: string;
  category: 'Equipment' | 'Counters & Dice' | 'Card Games' | 'Geometry';
  qty: number;
  description: string;
  classroomUse: string;
  photoIdea?: string;
}

const MATHEMATICS_KIT: KitItem[] = [
  {
    id: 'MK1',
    name: 'Teacher Board Drawing Equipment',
    category: 'Equipment',
    qty: 1,
    description: 'Enlarged ruler, pair of compasses, and protractor for blackboard/whiteboard illustrations.',
    classroomUse: 'Enables high-quality teacher board constructions of circles, angles, and margins.'
  },
  {
    id: 'MK2',
    name: 'Personal Student Tape Measure',
    category: 'Equipment',
    qty: 15,
    description: 'Durable sewing-type 150cm tape measures for student measurement activities.',
    classroomUse: 'Distributed 1 per group of three to support practical geometry, circle and body proportions experiments.'
  },
  {
    id: 'MK3',
    name: 'Safety Student Scissors',
    category: 'Equipment',
    qty: 15,
    description: '12 right-handed and 3 left-handed child-safe round-tip scissors.',
    classroomUse: 'Essential for paper constructions of nets, folding symmetries, and fraction blocks.'
  },
  {
    id: 'MK4',
    name: '360° Circular Protractor',
    category: 'Equipment',
    qty: 45,
    description: 'Full-circle protractors with index values from 0° to 360° for perfect orientation.',
    classroomUse: '1 per student. Used to measure exterior angles of polygons, navigation coordinates, and pie chart degrees.'
  },
  {
    id: 'MK5',
    name: '30cm Metric Ruler',
    category: 'Equipment',
    qty: 45,
    description: 'Clear plastic ruler to layout linear coordinates and margins.',
    classroomUse: 'Supports neat written algebra tables, drawing axes from -10 to 10, and straight edge lines.'
  },
  {
    id: 'MK6',
    name: 'Geared Direct Compasses',
    category: 'Equipment',
    qty: 45,
    description: 'Compasses with sturdy joints that lock securely to maintain radius precision.',
    classroomUse: 'Individual student use for bisecting angles, constructing 60°/30° angles, and triquetras.'
  },
  {
    id: 'MK7',
    name: 'Mini Handheld Chalkboards',
    category: 'Equipment',
    qty: 45,
    description: 'Compact slate-style individual slates for active student polling and instant feedback.',
    classroomUse: 'Core tool for formative Assessment for Learning (AfL). Students write answers to check understanding simultaneously.'
  },
  {
    id: 'MK8',
    name: 'JHS Arithmetic Calculators',
    category: 'Equipment',
    qty: 45,
    description: 'Standard four-function solar calculator with percentage and square root keys.',
    classroomUse: 'Strict play guidelines: Only for verifying mental equations, irrational approximations (Pi, roots), and Pig game scoring.'
  },
  {
    id: 'MK9',
    name: 'Multicoloured Counting Chips',
    category: 'Counters & Dice',
    qty: 1000,
    description: '1000 bright tokens in 4 distinct colours.',
    classroomUse: 'Supports probability trials, prime factor grouping arrays, ratio models, and Oware seed beads.'
  },
  {
    id: 'MK10',
    name: 'Polyhedral Multi-Sided Dice Multi-set',
    category: 'Counters & Dice',
    qty: 15,
    description: 'Assorted 4-sided (tetrahedron), 8-sided, 10-sided, 12-sided (dodecagon), and 20-sided (icosahedron) dice.',
    classroomUse: 'Used in B7.4.2.1.1 Outcomes, generating large random samples, and building statistics graphs.'
  },
  {
    id: 'MK11',
    name: 'Standard Numeral Dice (1-6)',
    category: 'Counters & Dice',
    qty: 100,
    description: 'A generous pool of standard six-sided cubic dice showing dots or digits.',
    classroomUse: 'Used in Place Value Game, Rounding War, Snail Racing, and basic algebraic arithmetic challenges.'
  },
  {
    id: 'MK12',
    name: 'Arithmetic Operation Dice',
    category: 'Counters & Dice',
    qty: 45,
    description: 'Six-sided dice showing the symbols: +, −, ×, ÷, <, and =.',
    classroomUse: 'Enables algebraic operation puzzles like "Algebra - Finding an Unknown Number" and algebraic inequality races.'
  },
  {
    id: 'MK13',
    name: 'Mechanical Sand Timers',
    category: 'Counters & Dice',
    qty: 15,
    description: '3-minute and 5-minute hourglass-style plastic timing logs.',
    classroomUse: 'Forces speed-work boundaries in Mental Numeracy starters and competitive group card collections.'
  },
  {
    id: 'MK14',
    name: 'GridLines Card Game Pack',
    category: 'Card Games',
    qty: 9,
    description: 'Creative card games focused on lines, plotting coordinate slopes, and geometric grids.',
    classroomUse: 'Supports group dynamics around linear relations (B8.2.1.1.1) and cartesian vectors.'
  },
  {
    id: 'MK15',
    name: 'Target Maths Card Collection',
    category: 'Card Games',
    qty: 9,
    description: 'Cards containing operations and targets used to drill order of operations (PEDMAS).',
    classroomUse: 'Played in groups of 5 with sand timers to synthesize numeric statements and mental mathematics.'
  },
  {
    id: 'MK16',
    name: '100 Cards Number Game (1-100)',
    category: 'Card Games',
    qty: 9,
    description: 'A complete card sequence numbered individually from 1 to 100.',
    classroomUse: 'Highly versatile. Used for prime number elimination tasks, HCF games, Bundles Card battles, and fraction ordering.'
  },
  {
    id: 'MK17',
    name: '19-Piece Geometric Solid Shapes',
    category: 'Geometry',
    qty: 1,
    description: 'Rigid plastic 3D geometric shapes including cylinders, cones, spheres, pyramids, and cubes.',
    classroomUse: 'Encompasses B9.3.2.1.1 Shape identification, counting faces/vertices (Euler formula), and cross-sections.'
  },
  {
    id: 'MK18',
    name: 'Polydron Clip Geometry Builder Pack',
    category: 'Geometry',
    qty: 9,
    description: 'Interlocking hinged plastic triangles, squares, and hexagons to construct 3-dimensional polyhedra.',
    classroomUse: 'Indispensable for net discovery experiments (B9.3.2.1.2 Nets). Students clip faces and unfold flat.'
  },
  {
    id: 'MK19',
    name: 'Hanger Geoboard & Rubber Bands',
    category: 'Geometry',
    qty: 9,
    description: '10x10 dual-sided geoboards with rubber bands of multiple widths and colours.',
    classroomUse: 'Used in Pick\'s Theorem Area labs, equivalent fractions demonstration, and translation drawings.'
  }
];

interface CaseStudy {
  id: string;
  situation: string;
  correctStrategy: string;
  options: { label: string; text: string; correct: boolean }[];
  consequence: string;
  payload?: any;
}

const CASES_DATA: CaseStudy[] = [
  {
    id: 'CS1',
    situation: 'The teacher asks the class for the solution to the algebraic equation 4x + 3 = 31. The main purpose is to immediately diagnose what proportion of the class can perform basic subtraction and dividing operations to isolate x.',
    correctStrategy: 'F. Ask students to write the answer on their individual mini-chalkboards and hold them up at the same time on command. This gives immediate global feedback on errors.',
    options: [
      { label: 'A', text: 'Ask for a show of hands and pick the student sitting at the front to answer loudly on the blackboard.', correct: false },
      { label: 'B', text: 'Go around individual desks while students work, putting a tick in the notebooks of those who are first to complete it.', correct: false },
      { label: 'C', text: 'Request students to write the answer on mini-chalkboards and hold them up simultaneously so the teacher reviews all. Discuss incorrect ideas first to review the mistake.', correct: true },
      { label: 'D', text: 'Give a 10-question written exam on paper and score them out of 10 at home over the weekend.', correct: false }
    ],
    consequence: 'Mini-chalkboard AfL enables mark-as-you-go feedback without the negative peer pressure of being singled out, allowing immediate lesson correction.'
  },
  {
    id: 'CS2',
    situation: 'Students are working on complex geometric constructions with compasses on specialized drawing templates. You notice Akua sitting in the back is struggling substantially, constantly getting up to look at diagrams on the board, but writes very quickly once back at her seat.',
    correctStrategy: 'D. This case indicates a potential eyesight issue. Seat Akua as close as possible to the front board. Recommend inexpensive glasses or an optician.',
    options: [
      { label: 'A', text: 'Reprimand Akua for moving repeatedly and disturbing other students, telling her to stay in her seat.', correct: false },
      { label: 'B', text: 'Seat Akua at the absolute front of the class immediately, assist with her drawing materials, and communicate instructions clearly and closely.', correct: true },
      { label: 'C', text: 'Assume Akua is lazy or hyperactive, and hand her pre-drawn shapes so she does not have to construct them.', correct: false },
      { label: 'D', text: 'Encourage peer-evaluation where a neighbor does all the circle constructions for her.', correct: false }
    ],
    consequence: 'Differentiating for special needs ensures inclusion. Akua\'s vision was the bottleneck, not her mathematical cognitive capacity.'
  },
  {
    id: 'CS3',
    situation: 'During a lesson on B7.1.3.2.1 "Addition of Unlike Fractions", you want to demonstrate that denominators are NOT simply additive (e.g. 1/2 + 2/3 is not equal to 3/5, a classic student misconception!). how do you address this with physical models?',
    correctStrategy: 'Utilize equal-length rows of blocks/counters of differing colors (e.g. 12 counters) to visualize equivalent fraction sizes.',
    options: [
      { label: 'A', text: 'Force students to write the definitions of numerators and denominators 5 times in their notebooks.', correct: false },
      { label: 'B', text: 'Show them abstract algebraic formulas on the chalkboard and tell them to memorize the Lowest Common Multiple (LCM) method directly.', correct: false },
      { label: 'C', text: 'Arrange counters in rows representing fractions (e.g. a row of 12 blocks split into halves of 6 blocks, and thirds of 4 blocks). Let them visually add 6 blocks + 4 blocks to get 10 blocks out of 12 (5/6). This proves why denominators must match.', correct: true }
    ],
    payload: {
      blocksConfig: [
        { label: '1/2 Row', colors: ['bg-amber-400', 'bg-amber-400', 'bg-amber-400', 'bg-amber-400', 'bg-amber-400', 'bg-amber-400', 'bg-slate-300', 'bg-slate-300', 'bg-slate-300', 'bg-slate-300', 'bg-slate-300', 'bg-slate-300'] },
        { label: '1/3 Row', colors: ['bg-indigo-500', 'bg-indigo-500', 'bg-indigo-500', 'bg-indigo-500', 'bg-slate-300', 'bg-slate-300', 'bg-slate-300', 'bg-slate-300', 'bg-slate-300', 'bg-slate-300', 'bg-slate-300', 'bg-slate-300'] }
      ]
    },
    consequence: 'Visual blocks demonstrate mathematical fraction parts so clearly that it busts standard procedural myths instantly.'
  }
];

// Master NaCCA JHS Syllabus map entries
interface SyllabusMapItem {
  grade: string;
  strand: string;
  substrand: string;
  indicator: string;
  standard: string;
  title: string;
  kitLink: string;
  pedagogicalTip: string;
}

const SYLLABUS_MAP: SyllabusMapItem[] = [
  {
    grade: 'Basic 7',
    strand: 'Strand 1: Numbers',
    substrand: 'Sub-strand 1: Systems',
    indicator: 'B7.1.1.1.1',
    standard: 'Model large quantities (> 1,000,000,000) with place-value grids.',
    title: 'The Nine-Place Value Roll',
    kitLink: 'Multi-set numeral dice & Place Value Slate grids (Slide 69)',
    pedagogicalTip: 'Use empty slots to represent the 0 digit. Circulate to ensure students say out loud names like "Millions" and "Billions" correctly.'
  },
  {
    grade: 'Basic 7',
    strand: 'Strand 1: Numbers',
    substrand: 'Sub-strand 2: Operations',
    indicator: 'B7.1.2.1.3',
    standard: 'Apply estimation strategies to check arithmetic answers on paper.',
    title: 'Multiplication & Division Bounds',
    kitLink: 'Ten-sided dice & Sand timers (Slide 79)',
    pedagogicalTip: 'Encourage instant mental bounding first (e.g. 2 x 387 is "about 800") before doing precise calculation.'
  },
  {
    grade: 'Basic 7',
    strand: 'Strand 1: Numbers',
    substrand: 'Sub-strand 3: Fractions',
    indicator: 'B7.1.3.1.2',
    standard: 'Simplify, compare and order positive fractions with geoboards.',
    title: 'Geoboard Equivalent Fractions',
    kitLink: 'Hanger Geoboard, Rubber bands & 100 Cards (Slide 73)',
    pedagogicalTip: 'Have pairs outline rectangular bounds with a rubber band to map the partition ratios visually.'
  },
  {
    grade: 'Basic 8',
    strand: 'Strand 2: Algebra',
    substrand: 'Sub-strand 1: Relations',
    indicator: 'B8.2.1.1.1',
    standard: 'Determine slope/gradient and graph custom linear functions (y = mx + c).',
    title: 'Straight Line Coordinate Plot',
    kitLink: '30cm Metric Ruler & graph templates (Slide 132)',
    pedagogicalTip: 'Have students systematically change "c" and observe parallel y-intercept moves, then "m" to observe steepness shifts.'
  },
  {
    grade: 'Basic 8',
    strand: 'Strand 3: Space',
    substrand: 'Sub-strand 1: Shapes',
    indicator: 'B8.3.1.2.3',
    standard: 'Find the locus of moving points under boundary conditions.',
    title: 'Loci & Moving Objects',
    kitLink: 'Sturdy compasses, scissors & paper circles (Slide 135)',
    pedagogicalTip: 'Guide students to physically roll a paper coin around a cardboard square to trace the beautifully rounded locus curve.'
  },
  {
    grade: 'Basic 8',
    strand: 'Strand 3: Space',
    substrand: 'Sub-strand 2: Measurement',
    indicator: 'B8.3.2.1.1',
    standard: 'Investigate Pick\'s theorem on lattices for complex polygon areas.',
    title: 'Lattice Area Formula (Shape Theorem)',
    kitLink: 'Plastic geoboards & multi-coloured grids (Slide 137)',
    pedagogicalTip: 'Let students hold the "Inside pins" variable stable at 1, while changing the perimeter pins to inspect progress patterns.'
  },
  {
    grade: 'Basic 9',
    strand: 'Strand 3: Space',
    substrand: 'Sub-strand 2: Measurement',
    indicator: 'B9.3.2.1.1',
    standard: 'Identify and construct 3D prisms and pyramids from Polydron pieces.',
    title: 'Prism vs Pyramid Nets',
    kitLink: 'Polydron Clip Geometry Builders & Solids (Slide 152)',
    pedagogicalTip: 'Emphasize that a circular prism is a cylinder, and a circular-based pyramid is a cone. Allow touch and feel discoveries.'
  },
  {
    grade: 'Basic 9',
    strand: 'Strand 4: Data & Probability',
    substrand: 'Sub-strand 2: Chance',
    indicator: 'B9.4.2.1.1',
    standard: 'Explore experimental outcome sample spaces via dice sum relative frequency.',
    title: 'Dual-Dice Snail Racing',
    kitLink: '12-row Snail cards & 2 numeral dice pack (Slide 159)',
    pedagogicalTip: 'Illustrate why Snail 7 wins most often by charting the 36 possible outcomes matrix. Snail 1 remains completely frozen.'
  }
];

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------

export default function BstemMathGuide() {
  const [activeTab, setActiveTab] = useState<'kit' | 'standards' | 'case' | 'syllabus' | 'games'>('kit');
  
  // Game states
  const [activeSubLab, setActiveSubLab] = useState<'snail' | 'hanoi' | 'pig' | 'picks' | 'happy' | 'handshake'>('picks');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      {/* Brand Elegant Header Header with deep navy, gold, and red/green subtle badges */}
      <div className="bg-[#1e293b] text-white py-8 px-6 sm:px-8 md:px-12 relative overflow-hidden border-b-4 border-amber-500 shadow-md">
        {/* Subtle decorative colors representing Ghana / branding */}
        <div className="absolute top-0 right-0 w-24 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-gradient-to-tr from-green-600/10 to-transparent rounded-full blur-2xl font-mono"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-600/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/30">
                🇬🇭 NaCCA Curriculum Aligned
              </span>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-amber-500/30">
                BSTEM Companion
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Atom className="text-amber-500 animate-pulse h-9 w-9" />
              TeachSmartGH <span className="font-light text-slate-300 text-2xl">BSTEM Mathematics JHS Guide</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Equipping classrooms with active mathematical simulations, NaCCA curriculum mapping, physical kit guides, and interactive diagnostic simulators.
            </p>
          </div>
          <div className="md:text-right border-l-4 border-emerald-500 pl-4 py-1">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Parent Brand</p>
            <p className="text-lg font-bold text-white">CATALYST CREATIVE</p>
            <p className="text-xs text-amber-400 font-mono italic">“AI-Powered Teaching. Smarter Tomorrow.”</p>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap items-center bg-[#0f172a] p-1.5 rounded-xl shadow-inner gap-1 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('kit')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap",
              activeTab === 'kit' 
                ? "bg-amber-500 text-[#0f172a] shadow-md font-bold" 
                : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Layers className="h-4 w-4" />
            🎒 Mathematics Kit Contents
          </button>
          <button
            onClick={() => setActiveTab('standards')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap",
              activeTab === 'standards' 
                ? "bg-amber-500 text-[#0f172a] shadow-md font-bold" 
                : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <BookOpen className="h-4 w-4" />
            📐 Drafting & Writing Standards
          </button>
          <button
            onClick={() => setActiveTab('case')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap",
              activeTab === 'case' 
                ? "bg-amber-500 text-[#0f172a] shadow-md font-bold" 
                : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Users className="h-4 w-4" />
            💡 CCP Diagnostics & Case Studies
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap",
              activeTab === 'syllabus' 
                ? "bg-amber-500 text-[#0f172a] shadow-md font-bold" 
                : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Atom className="h-4 w-4" />
            📖 NaCCA Syllabus Map
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap",
              activeTab === 'games' 
                ? "bg-amber-500 text-[#0f172a] shadow-md font-bold" 
                : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Sparkles className="h-4 w-4" />
            🎲 Interactive Activity Labs
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            
            {/* TAB 1: KIT EXPLORER */}
            {activeTab === 'kit' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      🎒 Visual JHS Mathematics BSTEM Kit Inventory
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Check lists of specialized physical math tools provided to Junior High Schools for class sizes of 45 pupils.
                    </p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg py-1.5 px-3 text-xs font-bold mt-2 md:mt-0 flex items-center gap-1.5 self-start">
                    <Users className="h-4 w-4 text-emerald-600" />
                    Optimized for Groupings of 5 Students
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MATHEMATICS_KIT.map((item) => (
                    <div key={item.id} className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {item.category}
                          </span>
                          <span className="font-mono text-xs text-slate-400 font-semibold">
                            {item.id}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                        <p className="text-xs text-slate-600 mt-2">{item.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                        <div className="bg-slate-200 border border-slate-300 rounded-md py-1 px-2.5 text-center font-mono text-[11px] font-bold text-slate-700">
                          Qty: <span className="text-emerald-700 font-extrabold">{item.qty}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic max-w-xs text-right leading-tight">
                          {item.classroomUse}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: STANDARDS FOR DRAFTING & DIAGRAMS */}
            {activeTab === 'standards' && (
              <div>
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    📏 Writing and Drawing Mathematics standards
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official pedagogical rules for compass/ruler posture, written notation alignment, coordinate axes, and selecting statistical charts.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column - Drawing guides */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2 text-emerald-750">
                        <Compass className="h-4.5 w-4.5 text-emerald-600" />
                        Aesthetics of Geometric Drafting
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                        <div className="bg-white p-3 rounded-lg border border-slate-150">
                          <p className="font-bold text-[#1e293b] mb-1">Using a Pair of Compasses:</p>
                          <ul className="list-disc pl-4 space-y-1 text-slate-600">
                            <li>Always use a pencil <strong>shorter</strong> than the compass leg.</li>
                            <li><strong>Do not</strong> hold the metal leg while drawing! Hold only the knurled top pin with thumb and forefinger to allow clean rotational pressure.</li>
                            <li>Tighten joints regularly with a micro-screwdriver.</li>
                          </ul>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-150">
                          <p className="font-bold text-[#1e293b] mb-1">Using the 30cm Ruler:</p>
                          <ul className="list-disc pl-4 space-y-1 text-slate-600">
                            <li>Spread fingers as wide as possible to hold the ruler flat against cardboard/paper templates.</li>
                            <li>Use clean sharp pencils to trace coordinate paths to ensure zero parallax error.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4">
                      <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-amber-500" />
                        Algebraic Equation Formatting Rules
                      </h3>
                      <p className="text-xs text-slate-600 mb-2">
                        Train students to write step-by-step down the page with all **equals signs vertically aligned** so they visually check logic flows easily (Slide 29):
                      </p>
                      <div className="bg-[#1e293b] text-slate-100 p-4 rounded-lg font-mono text-xs max-w-md mx-auto space-y-2 border border-slate-800 shadow-sm relative">
                        <div className="absolute top-2 right-2 text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 leading-none">
                          Vertical Alignment
                        </div>
                        <p className="text-slate-400">Solve:  3x + 4 = 22</p>
                        <p className="text-slate-200">       3x + 4 = 22</p>
                        <p className="text-emerald-400">           3x = 18   <span className="text-slate-500 italic ml-4">(-4 from both sides)</span></p>
                        <p className="text-emerald-400">            x = 6    <span className="text-slate-500 italic ml-4">(÷3 both sides)</span></p>
                        <div className="border-t border-slate-700 pt-1 mt-1 text-[11px] text-amber-400">
                          <u>x = 6</u>  <span className="text-slate-400 ml-4 font-sans text-xs inline-block">(Always double underline the final outcome)</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <h3 className="font-bold text-slate-800 text-sm mb-3">
                        📈 Plotting Cartesian Linear Functions (Activity 1 - 3)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <p className="font-bold text-slate-800">1. Draw Axes (-10 to 10)</p>
                          <p className="text-slate-500 mt-1">Arrowheads must terminate at both coordinate endings with labels (x, y).</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <p className="font-bold text-slate-800">2. Plot with Neat Crosspoints</p>
                          <p className="text-slate-500 mt-1">Plot with neat tiny "X" marks. Avoid drawing thick blobs on graph scales.</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <p className="font-bold text-slate-800">3. Label the Line Formula</p>
                          <p className="text-slate-500 mt-1">Always write the algebraic function code right next to the straight line (e.g. y = 2x + 1).</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Data categorizations */}
                  <div className="lg:col-span-4 bg-[#0f172a] text-slate-205 rounded-2xl p-4 text-xs font-sans text-slate-200 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm mb-3 border-b border-slate-800 pb-2">
                        📊 Statistical Chart Selection Guide
                      </h3>
                      <p className="text-slate-400 mb-4 leading-relaxed">
                        Slide 31 requires JHS teachers to ensure students categorize data accurately before drawing graphical representations:
                      </p>

                      <div className="space-y-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                          <p className="font-bold text-amber-400 mb-1">Categorical Data</p>
                          <p className="text-slate-400">Non-ordered groups (e.g. Favorite Ghanaian fruits/names like Abina, Coffie).</p>
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded px-1.5 py-0.5 mt-1.5 inline-block font-semibold">
                            Chart Choice: Pie Chart with gaps
                          </span>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                          <p className="font-bold text-amber-400 mb-1">Discrete Numeric Data</p>
                          <p className="text-slate-400">Values are exact integers (e.g. shoe sizes, coin prices in GH¢).</p>
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded px-1.5 py-0.5 mt-1.5 inline-block font-semibold">
                            Chart Choice: Bar Graph with middle labels
                          </span>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                          <p className="font-bold text-amber-400 mb-1">Continuous Numeric Data</p>
                          <p className="text-slate-400">Measurements showing continuous decimals (e.g. JHS height meters, time logs).</p>
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded px-1.5 py-0.5 mt-1.5 inline-block font-semibold">
                            Chart Choice: Block / Line graph with NO gaps
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 italic">
                      💡 Pro Tip: When drawing currencies, use local JHS units "GH¢" and "Gp" accordingly. Let the axes commence at 0, or outline a "broken axes" sign (Slide 32).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CCP DIAGNOSTICS & CASE STUDIES */}
            {activeTab === 'case' && (
              <div>
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    💡 Common Core Pedagogy Hub & Diagnosis
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Navigate real JHS classroom situations to diagnose special needs or choose high-quality Assessment for Learning (AfL) strategies.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {CASES.map((cs, idx) => (
                    <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-150 px-2.5 py-0.5 rounded-full">
                            Diagnostic Case #{idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            NaCCA Standard
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-850 text-sm mb-2">Classroom Situation:</h4>
                        <p className="text-xs text-slate-600 mb-4 bg-white p-3 rounded-lg border border-slate-150 leading-relaxed font-sans">
                          {cs.situation}
                        </p>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                          <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                            <Info className="h-4 w-4 text-amber-600" />
                            Pedagogical Support Strategy
                          </p>
                          <p className="text-xs text-slate-700 mt-1">
                            {cs.correctStrategy}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs font-medium text-emerald-800 leading-snug">
                        <strong>Outcome:</strong> {cs.consequence}
                      </div>

                      {cs.id === 'CS3' && (
                        <div className="mt-4 p-3 bg-slate-100 rounded-lg space-y-2 border border-slate-200">
                          <p className="text-[11px] font-bold text-slate-700">Equivalent Block Partition Grid (Visual Model B7.1.3.2.1):</p>
                          <div className="space-y-1.5 font-mono text-[10px]">
                            {cs.payload?.blocksConfig.map((row: any, rIdx: number) => (
                              <div key={rIdx} className="flex items-center gap-2">
                                <span className="w-12 text-slate-600 font-bold">{row.label}</span>
                                <div className="flex flex-1 gap-0.5 bg-slate-200 p-0.5 rounded border">
                                  {row.colors.map((cName: string, cIdx: number) => (
                                    <div key={cIdx} className={cn("h-3 flex-1 rounded-sm", cName)}></div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SYLLABUS OUTCOMES */}
            {activeTab === 'syllabus' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      📖 Interactive NaCCA Math Syllabus Map with Activity Links
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Explore strand indicator codes mapped directly to specialized activity book templates and teacher-assisted tutorial videos.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1e293b] text-white font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-3 rounded-tl-lg">Level</th>
                        <th className="p-3">Strand / Code</th>
                        <th className="p-3">NaCCA Indicator</th>
                        <th className="p-3">Active BSTEM Topic</th>
                        <th className="p-3">Equipment Required</th>
                        <th className="p-3 rounded-tr-lg">Pedagogical Guide & Tip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {SYLLABUS_MAP.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-[#1e293b] whitespace-nowrap">
                            {item.grade}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-emerald-800 font-semibold whitespace-nowrap">
                            {item.indicator}
                          </td>
                          <td className="p-3 text-slate-600 max-w-xs leading-tight">
                            {item.standard}
                          </td>
                          <td className="p-3 text-slate-800 font-bold">
                            {item.title}
                          </td>
                          <td className="p-3 text-slate-650 italic">
                            {item.kitLink}
                          </td>
                          <td className="p-3 text-slate-700 bg-slate-50/50 max-w-xs font-sans">
                            {item.pedagogicalTip}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: ACTIVE ACTIVITY LABS */}
            {activeTab === 'games' && (
              <div>
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    🎲 Interactive BSTEM Mathematical Activity Labs
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Launch virtual versions of physical card and dice puzzle games from the Teacher Activity Book.
                  </p>
                </div>

                {/* Sub tabs inside Labs */}
                <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setActiveSubLab('picks')}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[11px] uppercase tracking-wider font-bold transition-all",
                      activeSubLab === 'picks' ? "bg-[#1e293b] text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
                    )}
                  >
                    📍 Pick's Geoboard
                  </button>
                  <button
                    onClick={() => setActiveSubLab('snail')}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[11px] uppercase tracking-wider font-bold transition-all",
                      activeSubLab === 'snail' ? "bg-[#1e293b] text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
                    )}
                  >
                    🐌 Snail Racing
                  </button>
                  <button
                    onClick={() => setActiveSubLab('hanoi')}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[11px] uppercase tracking-wider font-bold transition-all",
                      activeSubLab === 'hanoi' ? "bg-[#1e293b] text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
                    )}
                  >
                    🗼 Tower of Hanoi
                  </button>
                  <button
                    onClick={() => setActiveSubLab('pig')}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[11px] uppercase tracking-wider font-bold transition-all",
                      activeSubLab === 'pig' ? "bg-[#1e293b] text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
                    )}
                  >
                    🐷 Game of Pig
                  </button>
                  <button
                    onClick={() => setActiveSubLab('happy')}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[11px] uppercase tracking-wider font-bold transition-all",
                      activeSubLab === 'happy' ? "bg-[#1e293b] text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
                    )}
                  >
                    🌈 Happy Numbers
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                  {/* LAB A: PICK'S GEOBOARD */}
                  {activeSubLab === 'picks' && <PicksTheoremGeoboard />}

                  {/* LAB B: SNAIL RACING */}
                  {activeSubLab === 'snail' && <SnailRacingSimulator />}

                  {/* LAB C: TOWER OF HANOI */}
                  {activeSubLab === 'hanoi' && <TowerOfHanoiLab />}

                  {/* LAB D: GAME OF PIG */}
                  {activeSubLab === 'pig' && <GameOfPigLab />}

                  {/* LAB E: HAPPY NUMBERS */}
                  {activeSubLab === 'happy' && <HappyNumbersLab />}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Sub-Lab 1: Pick's Theorem Geoboard Simulator
// ----------------------------------------------------
function PicksTheoremGeoboard() {
  const [grid, setGrid] = useState<('empty' | 'boundary' | 'interior')[][]>(
    Array(5).fill(null).map(() => Array(5).fill('empty'))
  );

  const [insideCount, setInsideCount] = useState(4);
  const [boundaryCount, setBoundaryCount] = useState(9);

  // Initialize a demo shape as shown in Slide 137 (A = 7.5, T = 9, I = 4)
  useEffect(() => {
    const demo: ('empty' | 'boundary' | 'interior')[][] = [
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'boundary', 'boundary', 'boundary', 'empty'],
      ['empty', 'boundary', 'interior', 'boundary', 'empty'],
      ['empty', 'boundary', 'interior', 'boundary', 'empty'],
      ['empty', 'boundary', 'boundary', 'boundary', 'empty']
    ];
    setGrid(demo);
  }, []);

  useEffect(() => {
    let internal = 0;
    let bound = 0;
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell === 'interior') internal++;
        if (cell === 'boundary') bound++;
      });
    });
    setInsideCount(internal);
    setBoundaryCount(bound);
  }, [grid]);

  const togglePin = (r: number, c: number) => {
    const nextGrid = grid.map((row, rIdx) => 
      row.map((cell, cIdx) => {
        if (rIdx === r && cIdx === c) {
          if (cell === 'empty') return 'boundary';
          if (cell === 'boundary') return 'interior';
          return 'empty';
        }
        return cell;
      })
    );
    setGrid(nextGrid);
  };

  const calculatedArea = insideCount + (boundaryCount / 2) - 1;

  return (
    <div className="max-w-3xl mx-auto text-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      <div className="md:col-span-6 space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
            Indicator B8.3.2.1.1 Formula Lab
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">Pick's Theorem Geoboard Space</h3>
          <p className="text-slate-600 mt-1">
            Toggle the coordinate lattice points to define boundary perimeter pins and interior peg variables. Observe the changes in area calculation live.
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2.5 font-mono shadow-sm">
          <p className="text-slate-700 font-bold border-b pb-1 text-center">Interactive Equation Console</p>
          <div className="flex justify-between items-center text-xs">
            <span>🔴 Boundary Pins (T):</span>
            <span className="font-extrabold text-pink-600">{boundaryCount} pins</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span>🟢 Interior Enclosed (I):</span>
            <span className="font-extrabold text-emerald-600">{insideCount} pins</span>
          </div>
          <div className="p-2 bg-slate-900 text-white rounded text-center text-[13px] font-bold border border-amber-500/30">
            Area = I + (T/2) − 1 = <span className="text-amber-400 text-base">{calculatedArea.toFixed(1)}</span> units²
          </div>
        </div>

        <div className="bg-slate-100 p-3 rounded-lg text-[10px] border border-slate-200">
          <p className="font-bold text-slate-700 uppercase">💡 JHS Teacher Lesson Tip:</p>
          <p className="text-slate-600 mt-0.5 italic">
            "Ask students to sketch a rectangle of 2x3. Boundary points touch the lines (T = 10), interior points sit completely inside (I = 2). Compute: 2 + (10/2) - 1 = 6. This aligns perfectly with classical base x height!" (Slide 138)
          </p>
        </div>
      </div>

      <div className="md:col-span-6 flex flex-col items-center">
        {/* Legends */}
        <div className="flex gap-4 mb-3 text-[10px] uppercase font-bold tracking-wider">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-300 rounded-full border border-slate-400"></span> Empty</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-pink-500 rounded-full border border-pink-700 animate-pulse"></span> Perimeter (T)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-full border border-emerald-700"></span> Interior (I)</span>
        </div>

        <div className="bg-[#1e293b] p-5 rounded-xl shadow-lg border border-slate-700">
          <div className="grid grid-cols-5 gap-4">
            {grid.map((row, rIdx) => 
              row.map((cell, cIdx) => (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => togglePin(rIdx, cIdx)}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-between relative transition-all border-2",
                    cell === 'empty' && "bg-slate-100 border-slate-400 hover:bg-slate-250",
                    cell === 'boundary' && "bg-pink-500 border-pink-700 text-white font-black shadow-md scale-105",
                    cell === 'interior' && "bg-emerald-500 border-emerald-700 text-white font-black shadow-md scale-105"
                  )}
                >
                  <span className="absolute -top-1 pointer-events-none scale-[0.6] text-[8px] font-mono text-slate-400 w-full text-center">
                    {rIdx},{cIdx}
                  </span>
                  <span className="w-1.5 h-1.5 bg-black rounded-full mx-auto shadow-inner"></span>
                </button>
              ))
            )}
          </div>
        </div>
        <button 
          onClick={() => setGrid(Array(5).fill(null).map(() => Array(5).fill('empty')))} 
          className="mt-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white border border-slate-200 rounded-md transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Clear Lattice Pegboards
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Sub-Lab 2: Snail Racing Simulator
// ----------------------------------------------------
function SnailRacingSimulator() {
  const [snails, setSnails] = useState<number[]>(Array(13).fill(0)); // snails 1-12 (index 0 unused)
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [rollsCount, setRollsCount] = useState(0);
  const [winner, setWinner] = useState<number | null>(null);
  const [rollsLog, setRollsLog] = useState<{ rollNum: number, sum: number, pair: [number, number] }[]>([]);

  const rollDice = () => {
    if (winner) return;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;
    const currentRoll = rollsCount + 1;

    setDice([d1, d2]);
    setRollsCount(currentRoll);

    const nextSnails = [...snails];
    nextSnails[sum] = Math.min(nextSnails[sum] + 1, 5);

    setRollsLog(prev => [{ rollNum: currentRoll, sum, pair: [d1, d2] }, ...prev.slice(0, 7)]);
    setSnails(nextSnails);

    if (nextSnails[sum] === 5) {
      setWinner(sum);
      toast.success(`🐌 Snail ${sum} won the BSTEM Probability Race!`, { duration: 5000 });
    }
  };

  const resetRace = () => {
    setSnails(Array(13).fill(0));
    setDice([1, 1]);
    setRollsCount(0);
    setWinner(null);
    setRollsLog([]);
  };

  return (
    <div className="max-w-4xl mx-auto text-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#1e293b] bg-indigo-150 px-2 py-0.5 rounded">
            Strand 4: Chance & Probability Simulator
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">Interactive Snail Racing Workspace</h3>
          <p className="text-slate-600 mt-1 leading-relaxed">
            Illustrate probability sample spaces (Slide 159). Two dice are thrown, their values added, and the corresponding Snail (2-12) moves forward. Snail 7 has the highest probability ratio (6/36), while Snail 1 remains permanently locked.
          </p>
        </div>

        {/* Dice visualizer */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-around shadow-sm">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-mono font-bold text-xl border-2 border-emerald-700 shadow-md">
              {dice[0]}
            </div>
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-mono font-bold text-xl border-2 border-emerald-700 shadow-md">
              {dice[1]}
            </div>
          </div>
          <div className="text-center font-mono">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dice Sum</p>
            <p className="text-2xl font-extrabold text-[#10b981]">{dice[0] + dice[1]}</p>
          </div>
          <div>
            {winner ? (
              <button onClick={resetRace} className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-[#0f172a] rounded-lg font-bold uppercase tracking-wider transition-colors flex items-center gap-1">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            ) : (
              <button onClick={rollDice} className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md">
                <Play className="h-4 w-4 text-emerald-400 animate-pulse" /> Throw Dice
              </button>
            )}
          </div>
        </div>

        {/* Math insights */}
        <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-100 space-y-2">
          <h4 className="font-bold border-b border-emerald-200 pb-1">Mathematical Questions & Answers:</h4>
          <p className="text-[11px] leading-relaxed text-slate-700">
            ❓ <strong>Why is Snail 1 stationary?</strong> Two dice have a minimum value of 1+1=2, so rolling a sum of 1 is impossible. Snail 1 never leaves the starting line!
          </p>
          <p className="text-[11px] leading-relaxed text-slate-700">
            🚀 <strong>What about Snail 7?</strong> 7 possesses the absolute largest combination count (1+6, 6+1, 2+5, 5+2, 3+4, 4+3 = 6 ways out of 36), giving it a 16.7% probability rate!
          </p>
        </div>

        {rollsLog.length > 0 && (
          <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[10px] border border-slate-800">
            <p className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-1 uppercase tracking-widest text-[9px]">Throw History Logs</p>
            {rollsLog.map((log, index) => (
              <div key={index} className="flex justify-between border-b border-slate-800/40 py-0.5">
                <span>Throw #{log.rollNum}: rolled {log.pair[0]} & {log.pair[1]}</span>
                <span className="text-emerald-400 font-bold">Sum = {log.sum}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Snail Racing board */}
      <div className="lg:col-span-7 bg-[#1e293b] p-5 rounded-2xl shadow-lg border border-slate-700 space-y-2">
        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-700 pb-2">
          <span>Snail Sum Row</span>
          <div className="flex gap-8">
            <span>Sart Line</span>
            <span>Finish (Col 5)</span>
          </div>
        </div>

        <div className="space-y-1.5 font-mono">
          {Array(11).fill(null).map((_, i) => {
            const snailNum = i + 2; // snails 2-12
            const steps = snails[snailNum] || 0;
            return (
              <div key={snailNum} className="flex items-center gap-3">
                <span className="w-5 text-right font-black text-amber-500 text-xs">
                  {snailNum}
                </span>
                <div className="flex-1 bg-slate-900 border border-slate-800 p-1 rounded flex gap-1 relative overflow-hidden h-7 items-center justify-between">
                  <div className="absolute top-0 left-0 w-full h-full flex justify-around pointer-events-none text-slate-800 font-bold text-[8px] items-center">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>🏁</span>
                  </div>

                  <div className="flex gap-1 h-full items-center z-10 w-full">
                    {Array(5).fill(null).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "flex-1 h-full rounded transition-all duration-300 flex items-center justify-center text-[10px] font-sans",
                          idx < steps 
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 border border-emerald-700 text-white font-bold" 
                            : "bg-transparent border border-dashed border-slate-850"
                        )}
                      >
                        {idx < steps && idx === steps - 1 && "🐌"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Snail 1 Special Row indicating 0 probability */}
          <div className="flex items-center gap-3 opacity-40">
            <span className="w-5 text-right font-black text-slate-500 text-xs">1</span>
            <div className="flex-1 bg-slate-950/60 p-1 rounded flex items-center justify-center h-7 text-[10px] text-slate-500 italic border border-dashed border-slate-900">
              Snail 1 cannot leave the starting grid (Dice can never sum to 1)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Sub-Lab 3: Tower of Hanoi Calculator and Game
// ----------------------------------------------------
function TowerOfHanoiLab() {
  const [discs, setDiscs] = useState(3);
  const [pegs, setPegs] = useState<number[][]>([[3, 2, 1], [], []]); // disks are numbered 1-max
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [movesCount, setMovesCount] = useState(0);

  useEffect(() => {
    const list = Array.from({ length: discs }, (_, i) => discs - i);
    setPegs([list, [], []]);
    setMovesCount(0);
    setSelectedPeg(null);
  }, [discs]);

  const selectOrMove = (pegIdx: number) => {
    if (selectedPeg === null) {
      if (pegs[pegIdx].length === 0) return;
      setSelectedPeg(pegIdx);
    } else {
      if (selectedPeg === pegIdx) {
        setSelectedPeg(null);
        return;
      }
      const sourcePeg = pegs[selectedPeg];
      const targetPeg = pegs[pegIdx];
      const movingDisc = sourcePeg[sourcePeg.length - 1];

      // standard Tower of Hanoi checks
      if (targetPeg.length > 0 && targetPeg[targetPeg.length - 1] < movingDisc) {
        toast.error("Standard Rules Violation: A larger disk cannot sit on a smaller disk!", { id: 'hanoi-rule' });
        setSelectedPeg(null);
        return;
      }

      const nextPegs = pegs.map((p, idx) => {
        if (idx === selectedPeg) return p.slice(0, -1);
        if (idx === pegIdx) return [...p, movingDisc];
        return p;
      });

      setPegs(nextPegs);
      setMovesCount(prev => prev + 1);
      setSelectedPeg(null);

      // check if won
      if (pegIdx === 2 && nextPegs[2].length === discs) {
        toast.success(`🎉 Masterfully Solved in ${movesCount + 1} movements!`, { duration: 5000 });
      }
    }
  };

  const calculatedMoves = Math.pow(2, discs) - 1;

  // slide 45 formula estimations
  const secondsFor64 = Math.pow(2, 64) - 1;
  const movesAt10s = secondsFor64 * 10;
  const yearsRepresented = 584942417355; // 584 billion years

  return (
    <div className="max-w-4xl mx-auto text-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-5 space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
            JHS Problem-Solving Challenge #1
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">The Tower of Hanoi & Universe Lifespan</h3>
          <p className="text-slate-650 leading-relaxed font-sans">
            The mathematical story describes priests moving 64 massive golden discs (Slide 44). Below, you can customize the disc height variable to inspect recursive step progressions.
          </p>
        </div>

        <div className="p-3 bg-white border rounded-xl border-slate-200">
          <label className="font-bold text-slate-700 block mb-1">Select Active Discs: {discs}</label>
          <input 
            type="range" 
            min="1" 
            max="6" 
            value={discs} 
            onChange={(e) => setDiscs(parseInt(e.target.value))} 
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
          />
        </div>

        <div className="bg-[#1e293b] text-slate-200 p-4 rounded-xl font-mono text-xs border border-slate-800 space-y-2">
          <p className="text-amber-400 font-bold uppercase tracking-wide text-xs border-b border-slate-800 pb-1">Mathematical Estimations</p>
          <div className="flex justify-between text-[11px]">
            <span>Minimum Moves ($2^N - 1$):</span>
            <span className="font-extrabold text-white text-sm">{calculatedMoves} moves</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal border-t border-slate-800/50 pt-2">
            🚨 <strong>Universe Scenario for 64 Discs:</strong>
            <br />
            If a priest moves one disc every 10 seconds, solving the complete 64-disc sequence takes:
            <br />
            <span className="text-amber-400 text-xs font-bold leading-normal block mt-1">
              $1.84 \times 10^{20}$ seconds ≈ 584,942,417,355 years!
            </span>
            Our solar universe is expected to expire before the puzzle finishes!
          </p>
        </div>
      </div>

      <div className="md:col-span-7 bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center">
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Move Counters: {movesCount}</p>
        
        {/* Peg containers */}
        <div className="flex justify-between w-full h-36 border-b-8 border-slate-750 pb-1 items-end relative px-4 gap-6 bg-slate-50 p-2 rounded-t-lg">
          {pegs.map((peg, pIdx) => {
            const isSelected = selectedPeg === pIdx;
            return (
              <button 
                key={pIdx} 
                onClick={() => selectOrMove(pIdx)}
                className={cn(
                  "relative flex-1 h-full flex flex-col justify-end items-center group transition-colors",
                  isSelected && "bg-[#10b981]/5 rounded border border-dashed border-[#10b981]"
                )}
              >
                {/* Vertical peg shafts */}
                <div className={cn(
                  "absolute bottom-0 w-2.5 h-28 rounded-t-full transition-colors",
                  isSelected ? "bg-[#10b981]" : "bg-slate-400 group-hover:bg-slate-500"
                )}></div>

                {/* Disks */}
                <div className="w-full flex flex-col gap-1 items-center z-10 select-none pb-1">
                  {[...peg].reverse().map((diskValue) => {
                    const widthPercent = (diskValue / discs) * 90;
                    return (
                      <div 
                        key={diskValue} 
                        style={{ width: `${widthPercent}%` }}
                        className="bg-indigo-600 text-white rounded text-center text-[10px] font-bold h-4 flex items-center justify-center font-mono border-b-2 border-indigo-800 shadow"
                      >
                        {diskValue}
                      </div>
                    );
                  })}
                </div>
                <span className="absolute bottom-1 text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  Peg {pIdx + 1} {pIdx === 0 && "(Source)"} {pIdx === 2 && "(Target)"}
                </span>
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => {
            const list = Array.from({ length: discs }, (_, i) => discs - i);
            setPegs([list, [], []]);
            setMovesCount(0);
            setSelectedPeg(null);
          }} 
          className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border text-slate-700 font-bold uppercase text-[10px] rounded transition-all tracking-wider flex items-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reload Stack
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Sub-Lab 4: Game of Pig Dice Accumulator
// ----------------------------------------------------
function GameOfPigLab() {
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [turnTotal, setTurnTotal] = useState(0);
  const [activePlayer, setActivePlayer] = useState<'human' | 'bot'>('human');
  const [diceValues, setDiceValues] = useState<[number, number]>([1, 1]);
  const [isLosingRoll, setIsLosingRoll] = useState(false);

  const rollDicePig = () => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDiceValues([d1, d2]);

    const sum = d1 + d2;

    if (d1 === 6 && d2 === 6) {
      // worst case: reset entire score to zero!
      toast.error("Double 6! Your entire cumulative score resets to ZERO!", { duration: 4000 });
      setPlayerScore(0);
      setTurnTotal(0);
      endTurn();
    } else if (d1 === 6 || d2 === 6) {
      // single 6 rolled: terminate turn and lose turn progress
      toast.error("Single 6 rolled! This turn scores nothing.", { id: 'pig-single-6', duration: 2500 });
      setTurnTotal(0);
      endTurn();
    } else {
      setTurnTotal(prev => prev + sum);
    }
  };

  const passAndSave = () => {
    setPlayerScore(prev => {
      const next = prev + turnTotal;
      if (next >= 100) toast.success("Trophy! You won the Game of Pig!");
      return next;
    });
    setTurnTotal(0);
    endTurn();
  };

  const endTurn = () => {
    setActivePlayer('bot');
  };

  // Bot logic
  useEffect(() => {
    if (activePlayer === 'bot') {
      const delay = setTimeout(() => {
        // Simple bot strategy: roll once
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2;
        setDiceValues([d1, d2]);

        if (d1 === 6 && d2 === 6) {
          setBotScore(0);
          toast.success("Bot rolled a double 6! Its score is reset to zero.");
        } else if (d1 === 6 || d2 === 6) {
          toast.success("Bot rolled a single 6 and scored nothing this turn.");
        } else {
          setBotScore(prev => prev + sum);
          toast.success(`Bot rolled a sum of ${sum} and holds.`);
        }
        setActivePlayer('human');
      }, 1500);
      return () => clearTimeout(delay);
    }
  }, [activePlayer]);

  const restartPig = () => {
    setPlayerScore(0);
    setBotScore(0);
    setTurnTotal(0);
    setActivePlayer('human');
    setDiceValues([1, 1]);
  };

  return (
    <div className="max-w-4xl mx-auto text-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-5 space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
            B7.1.3.2.2 Logic Strategy Game
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">BSTEM Game of Pig Arena</h3>
          <p className="text-slate-650 leading-relaxed font-sans">
            A high-stakes two-dice competitive activity (Slide 47). Accumulate points towards the target score of 100. Be careful: roll one 6 to terminate the turn with 0 score; roll a double 6 to lose your entire cumulative points bank!
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4 flex justify-between gap-4 text-center">
          <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100">
            <p className="font-extrabold text-slate-550 text-[10px] uppercase">My Score</p>
            <p className="text-3xl font-extrabold text-indigo-700">{playerScore}</p>
          </div>
          <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100">
            <p className="font-extrabold text-slate-550 text-[10px] uppercase">Bot (JHS Class)</p>
            <p className="text-3xl font-extrabold text-slate-700">{botScore}</p>
          </div>
        </div>

        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl leading-normal text-slate-750">
          📍 <strong>Active Turn Total:</strong> <span className="font-black text-indigo-800 text-sm">{turnTotal}</span>
          <p className="text-[11px] text-slate-600 mt-1">If you "Hold & Save Points", these turn scores are added permanently to your bank! If you roll a six, they vanish!</p>
        </div>
      </div>

      <div className="md:col-span-7 bg-slate-900 text-white rounded-2xl p-6 flex flex-col items-center border border-slate-800 relative">
        <div className="absolute top-3 left-3 flex items-center gap-1.5 uppercase font-bold text-[9px] tracking-wider text-emerald-400">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          Active Turn: {activePlayer === 'human' ? "Your Trn" : "Classroom Bot"}
        </div>

        <div className="flex gap-4 my-8">
          <div className="w-16 h-16 bg-white text-[#1e293b] rounded-xl flex flex-col justify-between p-2.5 border-4 border-slate-750 font-bold shadow-md">
            <span className="text-[8px] uppercase tracking-wide text-slate-400">Die A</span>
            <span className="text-center text-2xl font-black">{diceValues[0]}</span>
          </div>
          <div className="w-16 h-16 bg-white text-[#1e293b] rounded-xl flex flex-col justify-between p-2.5 border-4 border-slate-750 font-bold shadow-md">
            <span className="text-[8px] uppercase tracking-wide text-slate-400">Die B</span>
            <span className="text-center text-2xl font-black">{diceValues[1]}</span>
          </div>
        </div>

        {activePlayer === 'human' ? (
          <div className="flex gap-3">
            <button 
              onClick={rollDicePig}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#0f172a] font-bold text-xs uppercase rounded-lg shadow transition-all"
            >
              Roll Dice
            </button>
            <button 
              onClick={passAndSave}
              disabled={turnTotal === 0}
              className="px-4 py-2 bg-[#ffffff]/10 hover:bg-[#ffffff]/20 border border-white/20 text-white font-bold text-xs uppercase rounded-lg shadow transition-all disabled:opacity-40"
            >
              Hold & Save Points
            </button>
          </div>
        ) : (
          <p className="text-xs text-amber-400 font-mono italic animate-pulse">Wait: Simulated classrooms rolling dice...</p>
        )}

        <button onClick={restartPig} className="mt-8 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-400 flex items-center gap-1 transition-colors">
          <RotateCcw className="h-3.5 w-3.5" /> Restart Game
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Sub-Lab 5: Happy Numbers Tracer
// ----------------------------------------------------
function HappyNumbersLab() {
  const [inputValue, setInputValue] = useState(13);
  const [chain, setChain] = useState<number[]>([13, 10, 1]);
  const [isHappy, setIsHappy] = useState<boolean | null>(true);

  const checkHappiness = (num: number) => {
    let current = num;
    const history: number[] = [current];
    const visited = new Set<number>([current]);

    let happy = false;
    let limit = 0;

    while (limit < 50) {
      const digits = current.toString().split('').map(d => parseInt(d));
      const nextSum = digits.reduce((sum, d) => sum + (d * d), 0);
      
      history.push(nextSum);
      
      if (nextSum === 1) {
        happy = true;
        break;
      }
      if (visited.has(nextSum)) {
        happy = false;
        break;
      }
      
      visited.add(nextSum);
      current = nextSum;
      limit++;
    }

    setChain(history);
    setIsHappy(happy);
    
    if (happy) {
      toast.success(`${num} is a delightfully HAPPY number!`, { duration: 3000 });
    } else {
      toast.error(`${num} is UNHAPPY (stuck in a digit square loop!)`, { duration: 3000 });
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-xs grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
            B7.1.2.3.5 Prime Factors Companion
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">Happy Numbers Chain Tracer</h3>
          <p className="text-slate-650 font-sans">
            A Happy Number leads to a squares sum sequence that eventually ends at **1** (Slide 46). Input any natural integer variable below to trace why it belongs to the happy subset!
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
          <div>
            <label className="block text-slate-550 font-bold mb-1 uppercase tracking-wider text-[9px]">Enter Positive Integer</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={inputValue} 
                onChange={(e) => setInputValue(Math.max(1, parseInt(e.target.value) || 1))} 
                className="flex-1 bg-slate-50 border border-slate-200 outline-none rounded p-2 text-xs font-mono font-bold font-sans text-slate-800"
              />
              <button 
                onClick={() => checkHappiness(inputValue)}
                className="px-4 py-2 bg-[#1e293b] hover:bg-slate-800 text-white rounded-lg font-bold uppercase text-[10px] transition-all tracking-wider"
              >
                Trace Chains
              </button>
            </div>
          </div>

          <div className="flex gap-4 text-center border-t pt-3 text-[10px] text-slate-500 uppercase font-bold">
            <button onClick={() => { setInputValue(7); checkHappiness(7); }} className="hover:text-indigo-650">e.g. 7 (Happy)</button>
            <button onClick={() => { setInputValue(13); checkHappiness(13); }} className="hover:text-indigo-650">e.g. 13 (Happy)</button>
            <button onClick={() => { setInputValue(4); checkHappiness(4); }} className="hover:text-pink-650">e.g. 4 (Unhappy Loop)</button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white flex flex-col justify-center min-h-48 text-center font-mono relative overflow-hidden">
        {isHappy !== null && (
          <div className="absolute top-2.5 right-2.5">
            <span className={cn(
              "text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded leading-none border",
              isHappy 
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-950" 
                : "bg-pink-950/40 text-pink-400 border-pink-950"
            )}>
              {isHappy ? "Happy Number ✨" : "Unhappy Cycle 🔄"}
            </span>
          </div>
        )}

        <p className="text-slate-400 font-bold text-[10px] uppercase mb-4 tracking-wider">Squares Sequence Trace</p>
        
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {chain.map((num, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-500">→</span>}
              <div className={cn(
                "p-2 rounded-lg font-bold border",
                num === 1 && "bg-emerald-500 border-emerald-700 text-white font-black scale-110",
                idx === 0 && "bg-indigo-650/40 border-indigo-900 text-indigo-300",
                num !== 1 && idx > 0 && "bg-slate-800 border-slate-700 text-slate-100"
              )}>
                {num}
              </div>
            </React.Fragment>
          ))}
        </div>

        {isHappy === false && (
          <p className="text-[10px] text-pink-400 mt-4 leading-normal font-sans bg-pink-950/20 p-2.5 rounded border border-pink-950/40">
            🔄 Unhappy Loop Detected! Notice that {chain[chain.length - 1]} has already been visited in the chain logic, trapping this number in an infinite non-terminating digit squaring loop.
          </p>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Diagnostic Cases Static Table
// ----------------------------------------------------
const CASES = [
  ...CASES_DATA
];
