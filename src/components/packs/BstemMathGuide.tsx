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
  const [activeSubLab, setActiveSubLab] = useState<'snail' | 'hanoi' | 'pig' | 'picks' | 'happy' | 'handshake' | 'gridlines' | 'target'>('picks');

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
                  <button
                    onClick={() => setActiveSubLab('gridlines')}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[11px] uppercase tracking-wider font-bold transition-all",
                      activeSubLab === 'gridlines' ? "bg-[#1e293b] text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
                    )}
                  >
                    🧮 Gridlines Numbers
                  </button>
                  <button
                    onClick={() => setActiveSubLab('target')}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[11px] uppercase tracking-wider font-bold transition-all",
                      activeSubLab === 'target' ? "bg-[#1e293b] text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
                    )}
                  >
                    🎯 Target Maths
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

                  {/* LAB F: GRIDLINES NUMBERS */}
                  {activeSubLab === 'gridlines' && <GridlinesNumbersLab />}

                  {/* LAB G: TARGET MATHS */}
                  {activeSubLab === 'target' && <TargetMathsLab />}
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
// Sub-Lab 6: Gridlines Numbers Interactive Lab
// ----------------------------------------------------

interface GridlinesCard {
  id: string;
  value: string;
  type: 'D' | 'A' | 'R' | 'I' | 'E'; // Digit, Arithmetic, Rational, Indices, Equals
  points: number;
}

const GRIDLINES_DECK_PRESETS: Omit<GridlinesCard, 'id'>[] = [
  // Digits (D)
  { value: "0", type: "D", points: 1 },
  { value: "1", type: "D", points: 1 },
  { value: "2", type: "D", points: 1 },
  { value: "3", type: "D", points: 1 },
  { value: "4", type: "D", points: 1 },
  { value: "5", type: "D", points: 1 },
  { value: "6", type: "D", points: 1 },
  { value: "7", type: "D", points: 1 },
  { value: "8", type: "D", points: 2 },
  { value: "9", type: "D", points: 2 },
  { value: "10", type: "D", points: 2 },
  { value: "12", type: "D", points: 2 },
  { value: "13", type: "D", points: 2 },
  { value: "17", type: "D", points: 2 },
  { value: "47", type: "D", points: 3 },
  { value: "64", type: "D", points: 3 },
  
  // Arithmetic (A)
  { value: "+", type: "A", points: 1 },
  { value: "-", type: "A", points: 1 },
  { value: "*", type: "A", points: 2 },
  { value: "/", type: "A", points: 2 },
  { value: "+", type: "A", points: 1 },
  { value: "-", type: "A", points: 1 },

  // Rationals (R)
  { value: "0.8", type: "R", points: 3 },
  { value: "0.7", type: "R", points: 3 },
  { value: "0.15", type: "R", points: 3 },
  { value: "0.75", type: "R", points: 3 },
  { value: "0.65", type: "R", points: 3 },
  { value: "1/5", type: "R", points: 3 },
  { value: "3/4", type: "R", points: 3 },
  { value: "1/4", type: "R", points: 2 },
  { value: "1/10", type: "R", points: 3 },
  { value: "1/2", type: "R", points: 2 },
  { value: "1/3", type: "R", points: 3 },
  { value: "60%", type: "R", points: 3 },
  { value: "15%", type: "R", points: 3 },
  { value: "40%", type: "R", points: 3 },
  { value: "50%", type: "R", points: 2 },
  { value: "25%", type: "R", points: 2 },

  // Indices (I)
  { value: "^2", type: "I", points: 2 },
  { value: "^3", type: "I", points: 3 },
  { value: "^0", type: "I", points: 2 },
  { value: "^1", type: "I", points: 2 },
  { value: "√", type: "I", points: 3 }
];

// Lightweight synthesis of educational gaming retro beeps
function playGridlinesTone(freq: number, type: OscillatorType, duration: number) {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

function parseGridlinesToken(token: string): number | null {
  if (token.endsWith('%')) {
    const val = parseFloat(token.slice(0, -1));
    return isNaN(val) ? null : val / 100;
  }
  if (token.includes('/')) {
    const parts = token.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }
  const val = parseFloat(token);
  return isNaN(val) ? null : val;
}

function safeEvalGridlines(tokens: string[]): number | null {
  const outputQueue: string[] = [];
  const operatorStack: string[] = [];
  const precedence: { [key: string]: number } = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  for (const token of tokens) {
    const value = parseGridlinesToken(token);
    if (value !== null) {
      outputQueue.push(value.toString());
    } else if (token === '+' || token === '-' || token === '*' || token === '/' || token === 'x' || token === '÷') {
      const op = token === 'x' ? '*' : token === '÷' ? '/' : token;
      while (
        operatorStack.length > 0 &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[op]
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(op);
    } else {
      return null;
    }
  }

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop()!);
  }

  const stack: number[] = [];
  for (const token of outputQueue) {
    const num = parseFloat(token);
    if (!isNaN(num)) {
      stack.push(num);
    } else {
      if (stack.length < 2) return null;
      const b = stack.pop()!;
      const a = stack.pop()!;
      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else if (token === '/') {
        if (b === 0) return null;
        stack.push(a / b);
      } else {
        return null;
      }
    }
  }

  if (stack.length === 1) {
    return stack[0];
  }
  return null;
}

function evaluateGridlinesStatement(tokens: string[]): number | null {
  try {
    // Process unary "√" (root) operators
    const processed: string[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t === '√') {
        if (i + 1 < tokens.length) {
          const nextVal = parseGridlinesToken(tokens[i + 1]);
          if (nextVal !== null && nextVal >= 0) {
            processed.push(Math.sqrt(nextVal).toString());
            i++; 
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        processed.push(t);
      }
    }

    // Process exponential powers like "^2", "^3"
    const withPowers: string[] = [];
    for (let i = 0; i < processed.length; i++) {
      const t = processed[i];
      if (t.startsWith('^')) {
        const exponentStr = t.slice(1);
        const exponent = parseFloat(exponentStr);
        if (withPowers.length > 0) {
          const lastNum = parseFloat(withPowers[withPowers.length - 1]);
          if (!isNaN(lastNum)) {
            withPowers[withPowers.length - 1] = Math.pow(lastNum, exponent).toString();
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        withPowers.push(t);
      }
    }

    return safeEvalGridlines(withPowers);
  } catch (err) {
    return null;
  }
}

function generateClassicGridlinesDeck(): GridlinesCard[] {
  let counter = 0;
  return GRIDLINES_DECK_PRESETS.map(item => ({
    ...item,
    id: `card-${counter++}-${Math.random()}`
  }));
}

function solveGridlinesHint(visibleCards: GridlinesCard[]): string {
  const digits = visibleCards.filter(c => c.type === 'D');
  const ops = visibleCards.filter(c => c.type === 'A');
  
  for (const d1 of digits) {
    for (const d2 of digits) {
      if (d1.id === d2.id) continue;
      for (const op of ops) {
        const v1 = parseFloat(d1.value);
        const v2 = parseFloat(d2.value);
        if (isNaN(v1) || !isFinite(v1) || isNaN(v2) || !isFinite(v2)) continue;
        
        let result: number | null = null;
        if (op.value === '+') result = v1 + v2;
        if (op.value === '-') result = v1 - v2;
        if (op.value === '*' || op.value === 'x') result = v1 * v2;
        if (op.value === '/' || op.value === '÷') {
          if (v2 !== 0) result = v1 / v2;
        }
        
        if (result !== null) {
          const matchDigit = digits.find(d => d.id !== d1.id && d.id !== d2.id && Math.abs(parseFloat(d.value) - result!) < 0.001);
          if (matchDigit) {
            return `💡 hint: Select cards "${d1.value}", "${op.value}", "${d2.value}", click "Insert =", then select "${matchDigit.value}"!`;
          }
        }
      }
    }
  }

  // Check simple powers
  const indices = visibleCards.filter(c => c.type === 'I');
  for (const d1 of digits) {
    for (const ind of indices) {
      if (ind.value === '^2') {
        const val = parseFloat(d1.value);
        const sq = val * val;
        const target = digits.find(d => d.id !== d1.id && Math.abs(parseFloat(d.value) - sq) < 0.001);
        if (target) {
          return `💡 hint: Square the "${d1.value}" card ("${d1.value}", "^2"), insert "=", and match it with "${target.value}"!`;
        }
      }
      if (ind.value === '^3') {
        const val = parseFloat(d1.value);
        const cb = val * val * val;
        const target = digits.find(d => d.id !== d1.id && Math.abs(parseFloat(d.value) - cb) < 0.001);
        if (target) {
          return `💡 hint: Cube the "${d1.value}" card ("${d1.value}", "^3"), insert "=", and match it with "${target.value}"!`;
        }
      }
      if (ind.value === '√') {
        const val = parseFloat(d1.value);
        if (val >= 0) {
          const s = Math.sqrt(val);
          const target = digits.find(d => d.id !== d1.id && Math.abs(parseFloat(d.value) - s) < 0.001);
          if (target) {
            return `💡 hint: Take the square root of "${d1.value}" ("√", "${d1.value}"), insert "=", and match it with "${target.value}"!`;
          }
        }
      }
    }
  }

  // Check ratio equivalence
  const rationals = visibleCards.filter(c => c.type === 'R');
  for (const rat of rationals) {
    const val = parseGridlinesToken(rat.value);
    if (val !== null) {
      const mat = rationals.find(r => r.id !== rat.id && Math.abs(parseGridlinesToken(r.value)! - val) < 0.001);
      if (mat) {
        return `💡 hint: Try evaluating rationals! "${rat.value}" equals "${mat.value}" directly in the NaCCA curriculum!`;
      }
    }
  }

  return "💡 hint: Draw new cards or reset if the board seems too complex. Look for basic numbers first!";
}

function GridlinesNumbersLab() {
  const [deck, setDeck] = useState<GridlinesCard[]>([]);
  const [visibleGrid, setVisibleGrid] = useState<GridlinesCard[]>([]);
  const [activeStatement, setActiveStatement] = useState<GridlinesCard[]>([]);
  const [equalsRemaining, setEqualsRemaining] = useState(10);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [verifiedEquations, setVerifiedEquations] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showRulesGuide, setShowRulesGuide] = useState(false);
  const [hintsBox, setHintsBox] = useState<string | null>(null);

  // Load Highscore
  useEffect(() => {
    const saved = localStorage.getItem('gridlines_high_score');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
    resetGridlinesGame();
  }, []);

  const resetGridlinesGame = () => {
    const fullDeck = [...generateClassicGridlinesDeck(), ...generateClassicGridlinesDeck()].sort(() => Math.random() - 0.5);
    const gridSelection = fullDeck.slice(0, 25);
    const remainingDeck = fullDeck.slice(25);

    setDeck(remainingDeck);
    setVisibleGrid(gridSelection);
    setActiveStatement([]);
    setEqualsRemaining(10);
    setScore(0);
    setVerifiedEquations([]);
    setHintsBox(null);
    if (soundEnabled) playGridlinesTone(520, 'sine', 0.2);
    toast.success('Gridlines Numbers Board Initialized!')
  };

  const handleCardClick = (card: GridlinesCard) => {
    // If card is already in active statement, clicking it removes it
    if (activeStatement.some(c => c.id === card.id)) {
      setActiveStatement(prev => prev.filter(c => c.id !== card.id));
      if (soundEnabled) playGridlinesTone(350, 'sine', 0.08);
      return;
    }

    // Append to active statement
    setActiveStatement(prev => [...prev, card]);
    if (soundEnabled) playGridlinesTone(600, 'sine', 0.08);
  };

  const handleInsertEquals = () => {
    // Check if statement already has an equals sign
    if (activeStatement.some(c => c.type === 'E')) {
      toast.error('Only one equals sign allowed in Gridlines equations.');
      return;
    }
    const equalsCard: GridlinesCard = {
      id: `eq-${Math.random()}`,
      value: '=',
      type: 'E',
      points: 0
    };
    setActiveStatement(prev => [...prev, equalsCard]);
    if (soundEnabled) playGridlinesTone(450, 'sine', 0.1);
  };

  const clearActiveStatement = () => {
    setActiveStatement([]);
    if (soundEnabled) playGridlinesTone(280, 'sine', 0.15);
  };

  const getHint = () => {
    const hint = solveGridlinesHint(visibleGrid);
    setHintsBox(hint);
    if (soundEnabled) playGridlinesTone(880, 'sine', 0.15);
  };

  const validateStatement = () => {
    if (activeStatement.length < 3) {
      toast.error('Statements must be at least 3 cards (e.g. A = B).');
      return;
    }

    // Verify there is exactly one equals card
    const eqIdx = activeStatement.findIndex(c => c.type === 'E');
    if (eqIdx === -1) {
      toast.error('Please insert an equals (=) card to complete the equation!');
      return;
    }

    if (activeStatement.filter(c => c.type === 'E').length > 1) {
      toast.error('Multiple equals signs found. Keep to a single equation.');
      return;
    }

    const leftCards = activeStatement.slice(0, eqIdx);
    const rightCards = activeStatement.slice(eqIdx + 1);

    if (leftCards.length === 0 || rightCards.length === 0) {
      toast.error('Left Hand Side or Right Hand Side can not be empty.');
      return;
    }

    // Evaluate
    const lhsVal = evaluateGridlinesStatement(leftCards.map(c => c.value));
    const rhsVal = evaluateGridlinesStatement(rightCards.map(c => c.value));

    if (lhsVal === null || rhsVal === null) {
      if (soundEnabled) playGridlinesTone(150, 'sawtooth', 0.35);
      toast.error(`Invalid structure! Could not evaluate values. Check syntax.`);
      return;
    }

    // Account for float precision using small epsilon
    const isMatched = Math.abs(lhsVal - rhsVal) < 0.002;

    if (!isMatched) {
      if (soundEnabled) playGridlinesTone(150, 'sawtooth', 0.35);
      toast.error(`Calculation mismatch! LHS evaluated to ${Number(lhsVal.toFixed(2))} but RHS evaluated to ${Number(rhsVal.toFixed(2))}. Try again.`);
      return;
    }

    // SUCCESS! Let's tally scores
    // Points score = Sum of points of all used cards + optional multiplier for length
    const matchedCardPoints = activeStatement.reduce((acc, curr) => acc + curr.points, 0);
    const lengthMultiplier = activeStatement.length >= 6 ? 2.0 : activeStatement.length >= 5 ? 1.5 : activeStatement.length >= 4 ? 1.25 : 1.0;
    const equationPoints = Math.round(matchedCardPoints * lengthMultiplier);

    const updatedScore = score + equationPoints;
    setScore(updatedScore);

    // Save High Score
    if (updatedScore > highScore) {
      setHighScore(updatedScore);
      localStorage.setItem('gridlines_high_score', updatedScore.toString());
    }

    // Format equation trace
    const equationText = activeStatement.map(c => c.value).join(' ');
    setVerifiedEquations(prev => [equationText, ...prev]);

    // Play fanfare sequence
    if (soundEnabled) {
      playGridlinesTone(523.25, 'triangle', 0.15); // C5
      setTimeout(() => playGridlinesTone(659.25, 'triangle', 0.15), 140); // E5
      setTimeout(() => playGridlinesTone(783.99, 'triangle', 0.3), 280); // G5
    }

    // Consume one equals card from the solver
    setEqualsRemaining(prev => Math.max(0, prev - 1));

    // Remove cards from the 25-grid and refill from deck
    const usedIds = activeStatement.filter(c => c.type !== 'E').map(c => c.id);
    const refilledGrid = visibleGrid.map(card => {
      if (usedIds.includes(card.id)) {
        if (deck.length > 0) {
          const nextCard = deck[0];
          setDeck(prev => prev.slice(1));
          return nextCard;
        } else {
          // If deck is empty, reshuffle a new pack
          const freshPack = generateClassicGridlinesDeck().sort(() => Math.random() - 0.5);
          const nextCard = freshPack[0];
          setDeck(freshPack.slice(1));
          return nextCard;
        }
      }
      return card;
    });

    setVisibleGrid(refilledGrid);
    setActiveStatement([]);
    setHintsBox(null);
    toast.success(`Correct Statement! +${equationPoints} Points Added. 🎉`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden font-sans">
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-[#1e293b] to-indigo-700 py-5 px-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2.5 py-0.5 rounded-full">
            NaCCA Aligned Classroom Game
          </span>
          <h2 className="text-xl font-bold flex items-center gap-1.5 mt-1">
            🧮 Gridlines Numbers: Interactive Challenge
          </h2>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Construct mathematically equivalent equations using integers, decimals, indices, and roots.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowRulesGuide(!showRulesGuide)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold select-none flex items-center gap-1 transition-all"
          >
            <BookOpen size={12} />
            Rules Guide
          </button>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold select-none flex items-center gap-1 transition-all"
          >
            {soundEnabled ? "🔊 Sound On" : "🔇 Silent"}
          </button>
        </div>
      </div>

      {/* Game Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2 text-center md:text-left">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Score</p>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{score} pts</p>
        </div>
        <div className="p-2 text-center md:text-left">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Personal Best</p>
          <p className="text-xl font-extrabold text-[#1e293b] dark:text-slate-200 mt-0.5">{highScore} pts</p>
        </div>
        <div className="p-2 text-center md:text-left">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Equals Stack (=)</p>
          <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {equalsRemaining > 0 ? `🎟️ ${equalsRemaining} Left` : "🏁 Round Finished!"}
          </p>
        </div>
        <div className="p-2 text-center md:text-left">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Draw Deck size</p>
          <p className="text-xl font-extrabold text-slate-700 dark:text-slate-400 mt-0.5">📦 {deck.length} cards</p>
        </div>
      </div>

      {/* Rules Guide Overlay Block */}
      {showRulesGuide && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-indigo-50/75 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900 p-5 text-xs text-slate-700 dark:text-slate-300 grid grid-cols-1 md:grid-cols-2 gap-4 leading-normal"
        >
          <div>
            <h4 className="font-bold text-indigo-900 dark:text-indigo-400 mb-1">AIM OF THE GAME</h4>
            <p>
              Match cards together in the 25-Card Grid to form validated algebraic equations. Every equation must include exactly one Equals sign (=). Click cards to add them to your equation bar!
            </p>
            <h4 className="font-bold text-indigo-900 dark:text-indigo-400 mt-3 mb-1">CARD COLOR CODES:</h4>
            <ul className="space-y-1">
              <li>🔘 <strong className="text-slate-800 dark:text-slate-100">Digits (D):</strong> Whole integers like <code className="font-semibold select-all font-mono">0</code> to <code className="font-semibold select-all font-mono">64</code>.</li>
              <li>🟡 <strong className="text-amber-800 dark:text-amber-400">Arithmetic (A):</strong> Operational symbols: <code className="font-semibold select-all font-mono">+</code>, <code className="font-semibold select-all font-mono">-</code>, <code className="font-semibold select-all font-mono">*</code>, <code className="font-semibold select-all font-mono">/</code>.</li>
              <li>🟢 <strong className="text-emerald-800 dark:text-emerald-400">Rationals (R):</strong> Decimals, fractions, and percent values. E.g. <code className="font-semibold select-all font-mono">1/5</code> and <code className="font-semibold select-all font-mono">20%</code>.</li>
              <li>🔴 <strong className="text-rose-800 dark:text-rose-400">Indices (I):</strong> Powers & root symbols: <code className="font-semibold select-all font-mono">^2</code>, <code className="font-semibold select-all font-mono">^3</code>, <code className="font-semibold select-all font-mono">√</code>.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-indigo-900 dark:text-indigo-400 mb-1">HOW SCORING WORKS:</h4>
            <p>
              Cards list their specific difficulty points on the top-left! Basic digits are worth 1-2 points. Rational values, indices, and roots are worth 3 points!
            </p>
            <p className="mt-1.5 font-bold">
              ⚡ Multipliers: 4-card statement = 1.25x point bonus. 5-card statement = 1.5x bonus. 6+ cards = 2.0x mega bonus!
            </p>
            <div className="bg-white/80 dark:bg-slate-900 border border-slate-200/50 rounded-lg p-2.5 mt-2.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">Example equations:</span>
              <ul className="space-y-0.5 list-disc pl-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <li>2 + 3 = 5 (Simple Arithmetic)</li>
                <li>2 ^ 3 = 8 (Power Indice value)</li>
                <li>0.8 - 60% = 1/5 (Rational expressions!)</li>
                <li>√ 9 + 4 = 7 (Root logic)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Game Interface Block */}
      {equalsRemaining === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-950 text-center animate-fade-in">
          <Trophy size={48} className="text-yellow-500 animate-bounce mb-3" />
          <h3 className="text-2xl font-black text-[#1e293b] dark:text-white uppercase tracking-tight">Challenge Completed!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            Superb job! You used all available Equals cards to construct complex, curriculum-aligned mathematical equations.
          </p>
          <div className="my-6 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center max-w-xs w-full">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1e293b]">Final Score</span>
            <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{score} pts</p>
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2 text-xs rounded border border-slate-100 dark:border-slate-850 mt-4">
              <span className="text-slate-500">Equations Solved:</span>
              <span className="font-bold text-[#1e293b] dark:text-white">{verifiedEquations.length}</span>
            </div>
          </div>
          <button
            onClick={resetGridlinesGame}
            className="px-6 py-2.5 bg-indigo-650 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            Play Gridlines Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          
          {/* LEFT PANEL: The 5x5 Card Grid (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-850">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                🃏 The 5x5 Gridlines Table
              </span>
              <button 
                onClick={resetGridlinesGame}
                className="text-[10px] border border-slate-200 hover:bg-slate-100 font-bold px-2 py-1 rounded flex items-center gap-1 transition"
              >
                <RotateCcw size={10} />
                Reset Board
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3 p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl">
              {visibleGrid.map((card, idx) => {
                const isSelected = activeStatement.some(c => c.id === card.id);
                return (
                  <motion.div
                    key={card.id || idx}
                    onClick={() => handleCardClick(card)}
                    className={cn(
                      "relative h-16 w-full max-w-[80px] sm:h-24 sm:max-w-none rounded-xl border-2 flex flex-col justify-between p-1 cursor-pointer select-none transition-all shadow-sm",
                      isSelected 
                        ? "opacity-30 border-dashed border-slate-200 bg-slate-100 dark:bg-slate-800 scale-90 cursor-not-allowed" 
                        : card.type === 'D' ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-350 dark:hover:border-slate-700 hover:scale-105"
                        : card.type === 'A' ? "bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-400 hover:border-amber-350 hover:scale-105"
                        : card.type === 'R' ? "bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-400 hover:border-emerald-350 hover:scale-105"
                        : "bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-400 hover:border-rose-350 hover:scale-105"
                    )}
                  >
                    {/* Points value (Top-Left) */}
                    <span className="text-[8px] sm:text-[9px] font-black text-slate-400/80 leading-none">
                      {card.points}p
                    </span>

                    {/* Category Code (Top-Right) */}
                    <span className="text-[8px] sm:text-[9px] font-bold text-slate-400/80 leading-none text-right">
                      {card.type}
                    </span>

                    {/* Value in center */}
                    <span className="text-center text-xs sm:text-base font-extrabold tracking-tight my-1 sm:my-2 block text-[#1e293b] dark:text-white">
                      {card.value}
                    </span>

                    {/* Fine subtle bottom spacer */}
                    <div className="text-[5px] sm:text-[6px] tracking-widest text-[#1e293b]/30 dark:text-white/20 uppercase font-mono text-center">
                      GRIDLINES
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: Formulating Equations & Active Builder */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Active Equation Bar */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-2">
                  🛠️ Active Equation builder
                </span>

                <div className="min-h-[80px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl p-3 flex flex-wrap gap-1.5 items-center justify-start relative">
                  {activeStatement.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">
                      Click cards from the grid leftward to construct your mathematical statement...
                    </span>
                  ) : (
                    activeStatement.map((card, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (card.type === 'E') {
                            setActiveStatement(prev => prev.filter((_, i) => i !== idx));
                          } else {
                            handleCardClick(card);
                          }
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded font-bold text-xs shadow-xs cursor-pointer select-none transition hover:scale-95 flex items-center gap-1 border",
                          card.type === 'E' ? "bg-indigo-600 text-white border-indigo-700 font-extrabold"
                          : card.type === 'D' ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                          : card.type === 'A' ? "bg-amber-100 dark:bg-amber-950/45 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900"
                          : card.type === 'R' ? "bg-emerald-100 dark:bg-emerald-950/45 text-emerald-800 dark:text-emerald-400 border-emerald-250 dark:border-emerald-900"
                          : "bg-rose-105 dark:bg-rose-950/45 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900"
                        )}
                      >
                        {card.value}
                      </div>
                    ))
                  )}
                </div>

                {/* Insertion Utilities buttons */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={handleInsertEquals}
                    className="py-2 bg-[#1e293b] text-white hover:bg-slate-800 font-bold rounded-lg text-[10px] uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <span>➕ Insert Equals (=)</span>
                  </button>
                  <button
                    onClick={clearActiveStatement}
                    className="py-2 border border-slate-200 hover:bg-slate-100 font-bold rounded-lg text-[10px] uppercase tracking-wide flex items-center justify-center gap-1.5 text-slate-650 transition"
                  >
                    <span>🗑️ Clear Line</span>
                  </button>
                </div>
              </div>

              {/* Validation panel */}
              <div className="pt-4 border-t border-slate-200/50 mt-4 space-y-3">
                <button
                  onClick={validateStatement}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm select-none"
                >
                  <CheckCircle size={16} />
                  Validate Math Statement
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={getHint}
                    className="flex-1 py-1 px-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/35 text-yellow-800 dark:text-yellow-400 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition-all"
                  >
                    💡 TeachSmart Hint
                  </button>
                </div>

                {hintsBox && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-[11px] text-yellow-900 dark:text-yellow-400"
                  >
                    {hintsBox}
                  </motion.div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* FOOTER: Activity Tracker List */}
      {verifiedEquations.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/20">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
            📝 Validated equations (This Round)
          </p>
          <div className="flex flex-wrap gap-2">
            {verifiedEquations.map((eqText, index) => (
              <span 
                key={index}
                className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1"
              >
                <Check size={12} />
                {eqText}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// Diagnostic Cases Static Table
// ----------------------------------------------------
const CASES = [
  ...CASES_DATA
];

// ----------------------------------------------------
// Sub-Lab 7: Target Maths Classroom Game Lab
// ----------------------------------------------------

interface TargetMathsCard {
  id: string;
  target: number;
  numbers: (number | string)[]; // Can include 'x' for unknowns
  category: 'single' | 'double' | 'fractions' | 'unknowns';
  solutionX?: number; // Correct value of x for unknowns mode
}

const TARGET_MATHS_PRESETS: TargetMathsCard[] = [
  // Single Digits (Green)
  { id: 'tm-s1', target: 7, numbers: [8, 2, 3, 3], category: 'single' },
  { id: 'tm-s2', target: 6, numbers: [2, 3, 5, 1], category: 'single' },
  { id: 'tm-s3', target: 10, numbers: [1, 2, 3, 4], category: 'single' },
  { id: 'tm-s4', target: 12, numbers: [9, 5, 1, 3], category: 'single' },
  { id: 'tm-s5', target: 14, numbers: [3, 5, 2, 9], category: 'single' },
  { id: 'tm-s6', target: 20, numbers: [6, 2, 5, 8], category: 'single' },
  { id: 'tm-s7', target: 8, numbers: [4, 2, 1, 1], category: 'single' },
  { id: 'tm-s8', target: 9, numbers: [5, 4, 3, 3], category: 'single' },

  // Double Digits (Red)
  { id: 'tm-d1', target: 9, numbers: [16, 13, 12, 7], category: 'double' },
  { id: 'tm-d2', target: 5, numbers: [10, 15, 2, 5], category: 'double' },
  { id: 'tm-d3', target: 4, numbers: [12, 11, 10, 9], category: 'double' },
  { id: 'tm-d4', target: 7, numbers: [14, 6, 3, 2], category: 'double' },
  { id: 'tm-d5', target: 13, numbers: [25, 12, 10, 6], category: 'double' },
  { id: 'tm-d6', target: 11, numbers: [20, 15, 5, 2], category: 'double' },

  // Fractions (Purple)
  { id: 'tm-f1', target: 1, numbers: [5, 4, 3, 0.5], category: 'fractions' }, // 0.5 is 1/2
  { id: 'tm-f2', target: 5, numbers: [9, 3, 0.333, 2], category: 'fractions' }, // 0.333 is 1/3
  { id: 'tm-f3', target: 8, numbers: [6, 2, 0.5, 4], category: 'fractions' },
  { id: 'tm-f4', target: 3, numbers: [8, 4, 1, 0.5], category: 'fractions' },
  { id: 'tm-f5', target: 6, numbers: [12, 3, 1.5, 0.5], category: 'fractions' },

  // Unknowns (Orange)
  { id: 'tm-u1', target: 5, numbers: [5, 7, 5, 'x'], category: 'unknowns', solutionX: 2 },
  { id: 'tm-u2', target: 9, numbers: [10, 4, 'x', 3], category: 'unknowns', solutionX: 2 },
  { id: 'tm-u3', target: 12, numbers: [15, 5, 'x', 2], category: 'unknowns', solutionX: 3 },
  { id: 'tm-u4', target: 8, numbers: [12, 'x', 2, 6], category: 'unknowns', solutionX: 4 },
];

interface TargetMathsToken {
  id: string;
  type: 'num' | 'op' | 'x';
  value: string;
  cardIndex?: number; // 0, 1, 2, 3 to track usage
}

function playTargetMathsTone(freq: number, type: OscillatorType, duration: number) {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Autoplay constraint bypass
  }
}

// Solver function
interface TargetSolveResult {
  expr: string;
  steps: string[];
}

function solveTargetMathsCard(numbers: number[], target: number): TargetSolveResult | null {
  const ops = ['+', '-', '*', '/'];
  
  function evalOp(a: number, b: number, op: string): number | null {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') {
      if (Math.abs(b) < 0.0001) return null;
      return a / b;
    }
    return null;
  }

  function permute(arr: number[]): number[][] {
    if (arr.length === 1) return [arr];
    const res: number[][] = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
      const remainingPerms = permute(remaining);
      for (const p of remainingPerms) {
        res.push([current, ...p]);
      }
    }
    return res;
  }

  const numPerms = permute(numbers);

  for (const p of numPerms) {
    const [A, B, C, D] = p;
    for (const op1 of ops) {
      for (const op2 of ops) {
        for (const op3 of ops) {
          
          // Case 1: ((A op B) op C) op D
          let val1 = evalOp(A, B, op1);
          if (val1 !== null) {
            let val2 = evalOp(val1, C, op2);
            if (val2 !== null) {
              let val3 = evalOp(val2, D, op3);
              if (val3 !== null && Math.abs(val3 - target) < 0.002) {
                return {
                  expr: `((${A} ${op1} ${B}) ${op2} ${C}) ${op3} ${D}`,
                  steps: [
                    `Combine ${A} and ${B}: ${A} ${op1} ${B} = ${Number(val1.toFixed(2))}`,
                    `Combine that with ${C}: ${Number(val1.toFixed(2))} ${op2} ${C} = ${Number(val2.toFixed(2))}`,
                    `Apply ${D} to finish: ${Number(val2.toFixed(2))} ${op3} ${D} = ${target}`
                  ]
                };
              }
            }
          }

          // Case 2: (A op (B op C)) op D
          let valBC = evalOp(B, C, op2);
          if (valBC !== null) {
            let val1 = evalOp(A, valBC, op1);
            if (val1 !== null) {
              let val3 = evalOp(val1, D, op3);
              if (val3 !== null && Math.abs(val3 - target) < 0.002) {
                return {
                  expr: `(${A} ${op1} (${B} ${op2} ${C})) ${op3} ${D}`,
                  steps: [
                    `Combine inside brackets (${B} ${op2} ${C}): ${valBC}`,
                    `Combine ${A} with that output: ${A} ${op1} ${valBC} = ${Number(val1.toFixed(2))}`,
                    `Apply ${D} with ${op3}: ${Number(val1.toFixed(2))} ${op3} ${D} = ${target}`
                  ]
                };
              }
            }
          }

          // Case 3: A op ((B op C) op D)
          if (valBC !== null) {
            let valInner = evalOp(valBC, D, op3);
            if (valInner !== null) {
              let valFinal = evalOp(A, valInner, op1);
              if (valFinal !== null && Math.abs(valFinal - target) < 0.002) {
                return {
                  expr: `${A} ${op1} ((${B} ${op2} ${C}) ${op3} ${D})`,
                  steps: [
                    `Combine inside brackets (${B} ${op2} ${C}): ${valBC}`,
                    `Combine with ${D} using ${op3}: ${valInner}`,
                    `Complete the formula with ${A} ${op1} ${valInner} = ${target}`
                  ]
                };
              }
            }
          }

          // Case 4: A op (B op (C op D))
          let valCD = evalOp(C, D, op3);
          if (valCD !== null) {
            let valInner = evalOp(B, valCD, op2);
            if (valInner !== null) {
              let valFinal = evalOp(A, valInner, op1);
              if (valFinal !== null && Math.abs(valFinal - target) < 0.002) {
                return {
                  expr: `${A} ${op1} (${B} ${op2} (${C} ${op3} ${D}))`,
                  steps: [
                    `Evaluate RHS first (${C} ${op3} ${D}): ${valCD}`,
                    `Merge with ${B} using ${op2}: ${valInner}`,
                    `Apply ${A} with ${op1}: ${A} ${op1} ${valInner} = ${target}`
                  ]
                };
              }
            }
          }

          // Case 5: (A op B) op (C op D)
          let valAB = evalOp(A, B, op1);
          let valCD_c5 = evalOp(C, D, op3);
          if (valAB !== null && valCD_c5 !== null) {
            let valFinal = evalOp(valAB, valCD_c5, op2);
            if (valFinal !== null && Math.abs(valFinal - target) < 0.002) {
              return {
                expr: `(${A} ${op1} ${B}) ${op2} (${C} ${op3} ${D})`,
                steps: [
                  `Evaluate Left: (${A} ${op1} ${B}) = ${valAB}`,
                  `Evaluate Right: (${C} ${op3} ${D}) = ${valCD_c5}`,
                  `Combine both parts: ${valAB} ${op2} ${valCD_c5} = ${target}`
                ]
              };
            }
          }

        }
      }
    }
  }
  return null;
}

function TargetMathsLab() {
  const [activeCategory, setActiveCategory] = useState<'single' | 'double' | 'fractions' | 'unknowns'>('single');
  const [currentCard, setCurrentCard] = useState<TargetMathsCard>(TARGET_MATHS_PRESETS[0]);
  const [activeTokens, setActiveTokens] = useState<TargetMathsToken[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [xValue, setXValue] = useState<number>(2);
  const [showGuide, setShowGuide] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [puzzleHistory, setPuzzleHistory] = useState<string[]>([]);
  const [hintResult, setHintResult] = useState<TargetSolveResult | null>(null);

  // Load Highscore on Mount
  useEffect(() => {
    const saved = localStorage.getItem('target_maths_high_score');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
    loadNewCard('single');
  }, []);

  const loadNewCard = (category: typeof activeCategory) => {
    const filtered = TARGET_MATHS_PRESETS.filter(c => c.category === category);
    // Grab a random card from this collection
    const randomCard = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentCard(randomCard);
    setActiveTokens([]);
    setHintResult(null);
    if (category === 'unknowns') {
      setXValue(randomCard.solutionX ?? 2);
    }
    if (soundEnabled) playTargetMathsTone(580, 'sine', 0.15);
  };

  const handleCategoryChange = (category: typeof activeCategory) => {
    setActiveCategory(category);
    loadNewCard(category);
  };

  const handleCardNumberClick = (num: number | string, elementIndex: number) => {
    // Verify if this specific card node is already in the formula
    if (activeTokens.some(t => t.cardIndex === elementIndex)) {
      toast.error('To preserve NaCCA Target rules, each outside number must be used exactly once.');
      return;
    }

    const valueStr = num === 'x' ? 'x' : num.toString();
    const tokenType = num === 'x' ? 'x' : 'num';

    const newToken: TargetMathsToken = {
      id: `token-card-${Math.random()}`,
      type: tokenType,
      value: valueStr,
      cardIndex: elementIndex
    };

    setActiveTokens(prev => [...prev, newToken]);
    if (soundEnabled) playTargetMathsTone(640, 'sine', 0.08);
  };

  const handleOperatorClick = (op: string) => {
    const newToken: TargetMathsToken = {
      id: `token-op-${Math.random()}`,
      type: 'op',
      value: op
    };
    setActiveTokens(prev => [...prev, newToken]);
    if (soundEnabled) playTargetMathsTone(520, 'sine', 0.08);
  };

  const clearFormula = () => {
    setActiveTokens([]);
    setHintResult(null);
    if (soundEnabled) playTargetMathsTone(300, 'sine', 0.12);
  };

  const deleteLastToken = () => {
    setActiveTokens(prev => prev.slice(0, -1));
    if (soundEnabled) playTargetMathsTone(380, 'sine', 0.05);
  };

  const formatFractionDisplay = (numVal: number | string): string => {
    if (typeof numVal === 'string') return numVal;
    if (Math.abs(numVal - 0.5) < 0.01) return '1/2';
    if (Math.abs(numVal - 0.333) < 0.02) return '1/3';
    if (Math.abs(numVal - 1.5) < 0.01) return '1.5';
    return numVal.toString();
  };

  // Automated Formula Evaluator Whitelister
  const evaluateFormula = (): number | null => {
    if (activeTokens.length === 0) return null;
    
    // Convert tokens to eval expression string
    let expr = '';
    for (const t of activeTokens) {
      if (t.type === 'x') {
        expr += ` ${xValue} `;
      } else {
        let v = t.value;
        if (v === '×') v = '*';
        if (v === '÷') v = '/';
        // handle decimal fractions safely
        if (v === '1/2') v = '0.5';
        if (v === '1/3') v = '0.33333333';
        expr += ` ${v} `;
      }
    }

    // Clean space and validate structure
    const sanitized = expr.replace(/\s+/g, '');
    if (!/^[0-9+\-*/().]+$/.test(sanitized)) return null;

    try {
      const solverFn = new Function(`return (${sanitized});`);
      const val = solverFn();
      return typeof val === 'number' && isFinite(val) ? val : null;
    } catch {
      return null;
    }
  };

  const checkSolution = () => {
    // 1. Verify that all 4 outer cards have been clicked exactly once!
    const indicesUsed = activeTokens.filter(t => t.cardIndex !== undefined).map(t => t.cardIndex);
    const uniqueIndices = Array.from(new Set(indicesUsed));
    
    if (uniqueIndices.length < 4 || indicesUsed.length > 4) {
      toast.error('Rule Violation: You MUST use each outer number once and once only!');
      if (soundEnabled) playTargetMathsTone(160, 'sawtooth', 0.35);
      return;
    }

    // 2. Evaluate
    const result = evaluateFormula();
    if (result === null) {
      toast.error('Syntax error in formula structure. Check details.');
      if (soundEnabled) playTargetMathsTone(160, 'sawtooth', 0.35);
      return;
    }

    const isMatch = Math.abs(result - currentCard.target) < 0.01;

    if (isMatch) {
      // For unknowns, verify if x is also correct!
      if (activeCategory === 'unknowns' && currentCard.solutionX !== undefined && xValue !== currentCard.solutionX) {
        toast.error(`Equation is balanced but the algebraic value of unknown 'x' is incorrect for this card! Find another value for x.`);
        if (soundEnabled) playTargetMathsTone(200, 'sawtooth', 0.35);
        return;
      }

      // Success! Play arcade sound sequence
      if (soundEnabled) {
        playTargetMathsTone(523, 'triangle', 0.12);
        setTimeout(() => playTargetMathsTone(659, 'triangle', 0.12), 100);
        setTimeout(() => playTargetMathsTone(783, 'triangle', 0.12), 200);
        setTimeout(() => playTargetMathsTone(1046, 'triangle', 0.25), 300);
      }

      // Calculate score based on difficulty
      let points = 20;
      if (activeCategory === 'double') points = 35;
      if (activeCategory === 'fractions') points = 50;
      if (activeCategory === 'unknowns') points = 60;

      const newScore = score + points;
      setScore(newScore);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('target_maths_high_score', newScore.toString());
      }

      const formulaText = activeTokens.map(t => t.value).join(' ');
      const historyStr = `🎯 ${formulaText} = ${currentCard.target} (${activeCategory.toUpperCase()})`;
      setPuzzleHistory(prev => [historyStr, ...prev]);

      toast.success(`Target Attained! +${points} Points Added! 🎉`);
      loadNewCard(activeCategory);
    } else {
      toast.error(`Target not reached! Evaluation equals ${Number(result.toFixed(2))}, but target is ${currentCard.target}.`);
      if (soundEnabled) playTargetMathsTone(180, 'sawtooth', 0.35);
    }
  };

  const getSmarterHint = () => {
    // Build direct numbers array replacing fraction strings
    const numList: number[] = currentCard.numbers.map((val) => {
      if (val === 'x') {
        return currentCard.solutionX ?? 2;
      }
      return typeof val === 'number' ? val : parseFloat(val);
    });

    const solved = solveTargetMathsCard(numList, currentCard.target);
    if (solved) {
      setHintResult(solved);
      if (soundEnabled) playTargetMathsTone(880, 'sine', 0.15);
    } else {
      toast.error('No solution found! Reshuffle card.');
    }
  };

  // Color theme selectors based on selected category
  const borderTheme = activeCategory === 'single' ? 'border-emerald-500'
    : activeCategory === 'double' ? 'border-rose-500'
    : activeCategory === 'fractions' ? 'border-purple-500'
    : 'border-amber-500';

  const textTheme = activeCategory === 'single' ? 'text-emerald-700 dark:text-emerald-400'
    : activeCategory === 'double' ? 'text-rose-700 dark:text-rose-450'
    : activeCategory === 'fractions' ? 'text-purple-700 dark:text-purple-400'
    : 'text-amber-700 dark:text-amber-450';

  const badgeBg = activeCategory === 'single' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : activeCategory === 'double' ? 'bg-rose-50 text-rose-700 border-rose-200'
    : activeCategory === 'fractions' ? 'bg-purple-50 text-purple-700 border-purple-200'
    : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm overflow-hidden font-sans">
      {/* Banner design */}
      <div className="bg-gradient-to-r from-red-650 via-teal-700 to-amber-600/90 py-5 px-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded-full">
            NaCCA 2026 Interactive Board Game
          </span>
          <h2 className="text-xl font-bold flex items-center gap-1.5 mt-1">
            🎯 Target Maths: Clovers Board Room
          </h2>
          <p className="text-[11px] text-slate-200 mt-0.5">
            Construct target numbers using four balanced parameters. Strictly respect operations ordering.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold select-none flex items-center gap-1 transition-all"
          >
            <BookOpen size={12} />
            Instructions Mode
          </button>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold select-none"
          >
            {soundEnabled ? "🔊 Sound" : "🔇 Mute"}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-1.5 text-center md:text-left">
          <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total Score</p>
          <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{score} pts</p>
        </div>
        <div className="p-1.5 text-center md:text-left">
          <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Personal Best</p>
          <p className="text-lg font-extrabold text-slate-700 dark:text-slate-350">{highScore} pts</p>
        </div>
        <div className="p-1.5 text-center md:text-left">
          <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Active Mode</p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5 capitalize">
            {activeCategory} Piles
          </p>
        </div>
        <div className="p-1.5 text-center md:text-left">
          <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Completed</p>
          <p className="text-lg font-extrabold text-[#1e293b] dark:text-slate-200">✅ {puzzleHistory.length}</p>
        </div>
      </div>

      {/* Category selector row */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 justify-center">
        {(['single', 'double', 'fractions', 'unknowns'] as const).map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border",
                isActive 
                  ? cat === 'single' ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : cat === 'double' ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                    : cat === 'fractions' ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
              )}
            >
              {cat === 'single' ? "🟢 Single Digit"
                : cat === 'double' ? "🔴 Double Digit"
                : cat === 'fractions' ? "🟣 Fractions Mode"
                : "🟠 Unknowns (x)"}
            </button>
          );
        })}
      </div>

      {/* Guide Overlay */}
      {showGuide && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="bg-slate-50/90 dark:bg-slate-950/20 px-6 py-4 border-b border-slate-150 dark:border-slate-850 text-xs text-slate-600 dark:text-slate-400 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mb-1">TARGET MATHS GOALS:</h4>
            <p>
              Arrange the 4 numbers shown on the outer leaf circles to calculate the target value shown in the center! Use operations like addition, subtraction, multiplication, and division, as well as bracket parenthesis templates to enforce correct hierarchy.
            </p>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mt-2.5 mb-1">MANDATORY RULE:</h4>
            <p className="font-semibold text-rose-600 dark:text-rose-450 border border-rose-100 bg-rose-50/50 p-2 rounded">
              ⚠️ You must use EVERY outside parameter EXACTLY once. Reusing, doubling, or omitting parameters is forbidden!
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mb-1">ALGEBRAIC UNKNOWNS:</h4>
            <p>
              In "Unknowns" mode, one leaf contains the icon <strong className="font-semibold select-all font-mono">x</strong>. You must set what the value of <strong className="font-semibold select-all font-mono">x</strong> represents using the dynamic math sliders, and then construct the valid equation.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg mt-2 text-[11px] text-amber-900 dark:text-amber-400 font-mono">
              <strong>Example calculation:</strong><br />
              LHS outer nodes: [8, 2, 3, 3] target: 7<br />
              Solution: (8 * 2) - (3 * 3) = 16 - 9 = 7!
            </div>
          </div>
        </motion.div>
      )}

      {/* Main core layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
        
        {/* LEFT PANEL: Interactive Card rendering (5 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6 bg-slate-50/40 dark:bg-slate-950/10 p-4 rounded-3xl border border-slate-100 dark:border-slate-850/60">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block tracking-tight">
            CLOVER CAROUSEL VIEWPLATE
          </span>

          {/* Visual 3D Ring container */}
          <div className="relative w-64 h-64 flex items-center justify-center select-none">
            
            {/* Center Target Node */}
            <motion.div 
              key={currentCard.id}
              initial={{ scale: 0.8, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className={cn(
                "w-24 h-24 rounded-full border-8 flex flex-col items-center justify-center shadow-lg font-black text-2xl z-20 bg-white dark:bg-slate-900",
                borderTheme
              )}
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Target
              </span>
              <span className="text-3xl font-black mt-1 text-slate-800 dark:text-white">
                {currentCard.target}
              </span>
            </motion.div>

            {/* Pointer SVG connection lines */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 256 256">
              {/* Top pointer */}
              <line x1="128" y1="50" x2="128" y2="88" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="3 3" />
              {/* Right pointer */}
              <line x1="206" y1="128" x2="168" y2="128" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="3 3" />
              {/* Bottom pointer */}
              <line x1="128" y1="206" x2="128" y2="168" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="3 3" />
              {/* Left pointer */}
              <line x1="50" y1="128" x2="88" y2="128" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="3 3" />
            </svg>

            {/* Loop over nodes: top, right, bottom, left */}
            {currentCard.numbers.map((num, idx) => {
              const isUsed = activeTokens.some(t => t.cardIndex === idx);
              const isX = num === 'x';
              const displayVal = isX ? 'x' : formatFractionDisplay(num);

              // Absolute coordinates
              const positionClasses = idx === 0 ? "top-0 left-[98px]"
                : idx === 1 ? "top-[98px] right-0"
                : idx === 2 ? "bottom-0 left-[98px]"
                : "top-[98px] left-0";

              return (
                <motion.button
                  key={`${currentCard.id}-node-${idx}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardNumberClick(num, idx)}
                  disabled={isUsed}
                  className={cn(
                    "absolute w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-sm sm:text-base shadow-md transition-all duration-150",
                    positionClasses,
                    isUsed 
                      ? "opacity-25 bg-slate-100 border-slate-250 cursor-not-allowed scale-90"
                      : isX ? "bg-amber-550 border-amber-500 text-amber-900 dark:text-amber-300 hover:shadow-amber-200/50"
                      : activeCategory === 'single' ? "bg-emerald-50 border-emerald-400 text-emerald-800 dark:text-emerald-300 hover:shadow-emerald-200/50"
                      : activeCategory === 'double' ? "bg-rose-50 border-rose-400 text-rose-800 dark:text-rose-305 hover:shadow-rose-200/50"
                      : "bg-purple-50 border-purple-400 text-purple-800 dark:text-purple-305 hover:shadow-purple-200/50"
                  )}
                >
                  {displayVal}
                </motion.button>
              );
            })}
          </div>

          <div className="flex gap-2 w-full max-w-xs mt-2 select-none">
            <button
              onClick={() => loadNewCard(activeCategory)}
              className="flex-1 py-1 px-3 border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-all flex items-center justify-center gap-1"
            >
              🔄 Reshuffle Pile
            </button>
            <button
              onClick={getSmarterHint}
              className="flex-1 py-1 px-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
            >
              💡 Solver Solution
            </button>
          </div>

          {/* Algebraic Unknown sliders */}
          {activeCategory === 'unknowns' && (
            <div className="w-full max-w-xs p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/60 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 dark:text-amber-400 block text-center">
                🛠️ Choose value of variable 'x'
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={xValue}
                  onChange={(e) => {
                    setXValue(parseInt(e.target.value, 10));
                    if (soundEnabled) playTargetMathsTone(450, 'sine', 0.05);
                  }}
                  className="w-full h-1.5 bg-amber-250 dark:bg-amber-900 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-black text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-955 px-2.5 py-1 rounded-full border border-amber-400/30">
                  x = {xValue}
                </span>
              </div>
              <p className="text-[9px] text-amber-700 dark:text-amber-500 italic text-center">
                Slide to calibrate active values before writing your expressions!
              </p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Drafting Block & Numeric Pad (7 cols) */}
        <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block tracking-tight">
              FORMULA EXPRESSION builder
            </span>

            {/* active build pad */}
            <div className="min-h-[90px] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex flex-wrap gap-2 items-center justify-start relative shadow-inner">
              {activeTokens.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Tap card leaves above and mathematical pads below to draft your balanced equation...
                </p>
              ) : (
                activeTokens.map((t, index) => (
                  <span
                    key={t.id}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-mono font-black border tracking-tight flex items-center justify-center shadow-xs",
                      t.type === 'op' ? "bg-[#1e293b] text-white border-slate-800"
                        : t.type === 'x' ? "bg-amber-100 text-amber-800 border-amber-300"
                        : activeCategory === 'single' ? "bg-emerald-50 text-emerald-800 border-emerald-250"
                        : activeCategory === 'double' ? "bg-rose-50 text-rose-800 border-rose-250"
                        : "bg-purple-50 text-purple-800 border-purple-250"
                    )}
                  >
                    {t.type === 'x' ? `x (${xValue})` : t.value}
                  </span>
                ))
              )}
            </div>

            {/* Operations pad */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                ❌ Operations keypad
              </span>
              <div className="grid grid-cols-6 gap-2">
                {(['+', '-', '×', '÷', '(', ')'] as const).map((op) => (
                  <button
                    key={op}
                    onClick={() => handleOperatorClick(op)}
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold rounded-xl transition-all shadow-xs text-sm"
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            {/* deletion row */}
            <div className="grid grid-cols-2 gap-2 select-none">
              <button
                onClick={deleteLastToken}
                disabled={activeTokens.length === 0}
                className="py-2 px-3 border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 disabled:opacity-50 rounded-xl font-bold text-xs uppercase text-slate-650 transition flex items-center justify-center gap-1.5"
              >
                <span>⬅️ Retract Key</span>
              </button>
              <button
                onClick={clearFormula}
                disabled={activeTokens.length === 0}
                className="py-2 px-3 border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 disabled:opacity-50 rounded-xl font-bold text-xs uppercase text-slate-650 transition flex items-center justify-center gap-1.5"
              >
                <span>🗑️ Wipe Screen</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/55 space-y-4">
            <button
              onClick={checkSolution}
              disabled={activeTokens.length === 0}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-extrabold rounded-2xl shadow-md tracking-wide text-sm transition flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              Verify Formula Equation
            </button>

            {/* Solver solver visual section */}
            {hintResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-50/70 dark:bg-indigo-950/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/40 text-xs"
              >
                <span className="font-extrabold text-indigo-900 dark:text-indigo-300 block mb-1.5 uppercase tracking-wide">
                  💡 TeachSmart AI Solver Output:
                </span>
                <p className="font-mono font-black text-sm text-indigo-750 dark:text-indigo-400 bg-white/80 dark:bg-slate-900 p-2 border border-indigo-100 dark:border-slate-850 rounded-xl">
                  {hintResult.expr}
                </p>
                <div className="mt-2 text-slate-600 dark:text-slate-400 space-y-1">
                  <strong>Permuted Solution Path:</strong>
                  {hintResult.steps.map((st, sidx) => (
                    <div key={sidx} className="flex gap-1.5 items-start">
                      <span className="text-indigo-600 font-bold">➢</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>

      {/* FOOTER: Activity Tracker List */}
      {puzzleHistory.length > 0 && (
        <div className="border-t border-slate-150 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/20">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
            📝 Validated Target equations (This Session)
          </p>
          <div className="flex flex-wrap gap-2">
            {puzzleHistory.map((item, idx) => (
              <span 
                key={idx}
                className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5"
              >
                <Check size={12} className="text-emerald-600" />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

