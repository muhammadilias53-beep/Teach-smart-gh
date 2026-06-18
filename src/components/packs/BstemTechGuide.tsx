import React, { useState, useEffect, useRef } from 'react';
import { 
  Atom, Cpu, Play, Square, Settings, RefreshCw, FileText, Download, 
  Copy, Info, HelpCircle, BookOpen, Clock, CheckCircle, ChevronRight, 
  ArrowRight, ShieldAlert, Sparkles, Terminal, Volume2, VolumeX, List, 
  Layers, Hammer, Coins, BadgeAlert, Lightbulb, PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// ----------------------------------------------------
// Safe Web Audio Tone Player
// ----------------------------------------------------
let audioCtx: AudioContext | null = null;
function playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.1) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.value = freq;
    osc.type = type;
    
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn('Audio not supported or blocked:', e);
  }
}

// ----------------------------------------------------
// Static Data
// ----------------------------------------------------

interface KitComponent {
  id: string;
  name: string;
  category: 'mBot Core' | 'Sensors' | 'Data Logging' | 'Engineering Materials';
  qty: number;
  description: string;
  naCCARanking: string;
}

const KIT_COMPONENTS: KitComponent[] = [
  {
    id: 'T1',
    name: 'mCore Assembly Board',
    category: 'mBot Core',
    qty: 5,
    description: 'Central microcontroller unit with built-in buzzer, light sensor, RGB LEDs, and on-board push button.',
    naCCARanking: 'Essential for Computing and Robotics'
  },
  {
    id: 'T2',
    name: 'Ultrasonic Distance Sensor',
    category: 'Sensors',
    qty: 5,
    description: 'Calculates distances by emitting ultrasound. Plugs into RJ25 Slot 3 to enable obstacle avoidance loops.',
    naCCARanking: 'Core Sensor Practice'
  },
  {
    id: 'T3',
    name: 'Line Follower Infrared Sensor',
    category: 'Sensors',
    qty: 5,
    description: 'Detects black lines against light backgrounds. Relies on double transmitter/receiver paths in Slot 2.',
    naCCARanking: 'Pathing & Navigation'
  },
  {
    id: 'T4',
    name: 'Dual Temperature Probes',
    category: 'Data Logging',
    qty: 15,
    description: 'Waterproof thermal probes that connect to the RJ25 Adapter board in Slot 4 to write simultaneous logs.',
    naCCARanking: 'Scientific Telemetry Experiments'
  },
  {
    id: 'T5',
    name: 'PIR Motion Detector',
    category: 'Data Logging',
    qty: 5,
    description: 'Passive Infrared sensor to register human presence and motion fluctuations (0 or 1 outputs).',
    naCCARanking: 'Telemetry Security Systems'
  },
  {
    id: 'T6',
    name: 'Sound Intensity Probe',
    category: 'Data Logging',
    qty: 5,
    description: 'Registers surrounding sonic decibels to program volume alerts and clapping triggers.',
    naCCARanking: 'Data Metrics and Graphing'
  }
];

interface ProgramProject {
  title: string;
  description: string;
  blockCode: string[];
  pythonCode: string;
  pageRef: number;
}

const PROJECTS_LIST: ProgramProject[] = [
  {
    title: '1. Obstacle Avoidance Loop',
    description: 'Emits ultrasound beams. When an obstacle is detected within 5cm of the eyes, the robot reverses and turns to avoid conflict.',
    blockCode: [
      'when mBot(mcore) starts up',
      'forever:',
      '  if [ ultrasonic sensor {port3} distance < 5 ] then',
      '    play note [C4] for [0.25] beats',
      '    move backward at power [50]% for [0.5] secs',
      '    turn right at power [50]% for [0.5] secs',
      '  else',
      '    move forward at power [50]%'
    ],
    pythonCode: `import mbot\nimport time\n\nwhile True:\n    dist = mbot.read_ultrasonic(3)\n    if dist < 5:\n        mbot.play_note("C4", 0.25)\n        mbot.move_backward(50, 0.5)\n        mbot.turn_right(50, 0.5)\n    else:\n        mbot.move_forward(50)`,
    pageRef: 17
  },
  {
    title: '2. Follow the Track (Infrared Line Detection)',
    description: 'Keeps on-board wheels aligned to a physical black racetrack layout utilizing continuous ground reflections.',
    blockCode: [
      'when mBot(mcore) starts up',
      'forever:',
      '  if [ line follower {port2} = 0 (both black) ] then',
      '    move forward at power [40]%',
      '  if [ line follower {port2} = 1 (left black, right white) ] then',
      '    turn left at power [35]%',
      '  if [ line follower {port2} = 2 (left white, right black) ] then',
      '    turn right at power [35]%'
    ],
    pythonCode: `import mbot\n\nwhile True:\n    status = mbot.read_line_follower(2)\n    if status == 0:\n        mbot.move_forward(40)\n    elif status == 1:\n        mbot.turn_left(35)\n    elif status == 2:\n        mbot.turn_right(35)`,
    pageRef: 17
  },
  {
    title: '3. Hand Shield Siren',
    description: 'Simulates a physical alarm triggered when a hand is placed over the main unit at the front (light sensor < 800).',
    blockCode: [
      'when mBot(mcore) starts up',
      'forever:',
      '  if [ light sensor {on-board} < 800 ] then',
      '    repeat [5]:',
      '      LED {left} show color [red]',
      '      play note [D4] for [0.2] beats',
      '      LED {right} show color [blue]',
      '      play note [C4] for [0.2] beats',
      '  else',
      '    LED {all} show color [none]'
    ],
    pythonCode: `import mbot\nimport time\n\nwhile True:\n    light = mbot.read_light_sensor()\n    if light < 800:\n        for i in range(5):\n            mbot.set_led(1, 255, 0, 0) # Left red\n            mbot.play_note("D4", 0.2)\n            mbot.set_led(2, 0, 0, 255) # Right blue\n            mbot.play_note("C4", 0.2)\n    else:\n        mbot.clear_leds()`,
    pageRef: 26
  }
];

interface LowCostActivity {
  id: number;
  title: string;
  timeLimit: string;
  costAssessment: string;
  idealBudget?: number;
  equipment: string[];
  task: string;
  procedure: string[];
  hints: string;
  safetyRules: string[];
  coreCompetency: string;
}

const LOW_COST_ACTIVITIES: LowCostActivity[] = [
  {
    id: 1,
    title: 'Building a Paper Platform',
    timeLimit: '45 mins - 1 hour',
    costAssessment: 'Zero Cost (Uses scrap)',
    equipment: ['Three sheets A4 paper', 'Scissors', 'Glue or sticky tape', 'Ruler', 'Heavy similar textbooks'],
    task: 'Use exactly two sheets of A4 paper to support as many textbooks as possible at least 10cm above the flat table top.',
    procedure: [
      'Ask pupils whether they think a single sheet of paper could support a heavy textbook.',
      'Demonstrate how folding paper into a stout cylinder gives significant vertical load-bearing strength.',
      'Give one initial sheet of paper to each group of 5 for rapid 5-minute planning and trial testing.',
      "Distribute two fresh sheets of paper. Groups have 15 minutes to craft their strongest platform (must exceed 10cm minimum height).",
      "Invite all groups to stand back. Systematically add books one by one. Count and record the survival capacity of each platform before collapse."
    ],
    hints: "The strongest constructs typically use multiple upright cylindrical folds positioned in a strategic triangular or quad array. Exact cuts and flush edges ensure high stability.",
    safetyRules: ['Keep audiences back during competitive testing to avoid dropping heavy books on toes.', 'Use child-safe round-tip scissors only.'],
    coreCompetency: 'Resourcefulness, Cooperation, Observation skills'
  },
  {
    id: 2,
    title: 'Building a Paper Bridge',
    timeLimit: '45 minutes',
    costAssessment: 'Zero Cost',
    equipment: ['Two sheets A4 paper', 'Four paper clips', 'Scissors', 'Two solid books or blocks (used as piers)', 'Coins/weights'],
    task: 'Investigate how structural shape changes affect the load-bearing capacity of a paper span across a 15cm gap.',
    procedure: [
      'Cut each A4 sheet into three equal strips of about 21cm x 10cm lines.',
      'Place the two solid book piers exactly 15cm apart on the workstation.',
      'Lay a flat strip of paper straight across the piers and observe immediate sagging (holds zero coins).',
      'Challenge groups to fold their remaining strips into corrugated pleats, I-beams, or tubular arches to make different trial spans.',
      'Use paper clips to clamp ends and test structural load capacities using identical coins one at a time.'
    ],
    hints: "Folding flat paper into accordion-pleated zig-zags creates vertical flanges that successfully resist downward bending stress.",
    safetyRules: ['Ensure coin stacks are added gently to avoid sudden dynamic collapse.', 'Keep workspaces tidy in case of flying paper clips.'],
    coreCompetency: 'Creativity, Measurement skills, Mechanical observation'
  },
  {
    id: 3,
    title: 'Designing a Solar Heater',
    timeLimit: '2 hours +',
    costAssessment: 'Low Cost (foil & plastic)',
    equipment: ['Aluminium foil', 'Black plastic sheet', '250ml Beaker / Cup', 'Thermometer Red spirit', 'Cardboard boxes'],
    task: 'Construct a highly efficient solar cavity heater prototype to maximize the rising temperature of 150ml of liquid water.',
    procedure: [
      'Discuss the three thermal laws: conduction, convection, and absorption of heat by dark matte surfaces.',
      'Guide students to line their cardboard inner box walls with reflecting foil to concentrate focus onto the central beaker.',
      'Wrap the outer base of the beaker with dark matte black plastic to maximize heat entrapment.',
      'Fill with 150ml of cool water, record the baseline start temperature, and expose to direct midday sunlight for 20 minutes.',
      'Take final temp measurements and compare structural efficiency among groups.'
    ],
    hints: "Ensure concave foil reflector curves are shaped correctly to create a sharp focused hotspot on the black collector surface.",
    safetyRules: ['Ensure extreme care when handling beakers of hot water.', 'Never look directly at highly concentrated solar focal patches on foil surfaces.'],
    coreCompetency: 'Scientific formulation, Materials investigation'
  },
  {
    id: 4,
    title: 'Improving a Paper Glider',
    timeLimit: '45 mins - 1 hour',
    costAssessment: 'Zero Cost',
    equipment: ['A4 paper', 'Scissors', 'Paper clips (weight loads)', 'Thin card / Aluminium foil fragments'],
    task: 'Identify and tweak aerodynamic variables of a basic glider to maximize glide distance and flight trajectory precision.',
    procedure: [
      'Construct a baseline glider using standard folded halves of A4 paper.',
      'Train pupils to release with a gentle, consistent horizontal push in a draft-free corridor.',
      'Select a single isolated wing/rudder variable (e.g. adding a paper clip, shifting wing flap folds, altering surface weight).',
      'Record multiple flight trials in a metrics table. Chart distance trends and plot path curves.',
      'Present team findings on flight physics to the surrounding peers.'
    ],
    hints: "Adding a tiny twist upwards at the back edge of the main wing flaps corrects nose-heavy dives by generating stable aerodynamic lift.",
    safetyRules: ['Clear flight lanes completely before testing.', 'Never aim paper gliders towards classmates eyes.'],
    coreCompetency: 'Aero-mechanics, Variable isolation, Data logging'
  },
  {
    id: 5,
    title: 'Building a Balloon-Powered Car',
    timeLimit: '1 hour +',
    costAssessment: 'Low Cost',
    equipment: ['One balloon', 'Cardboard or plastic bottle chassis', 'Water bottle caps (wheels)', 'Drinking straws', 'Wooden skewers (axles)'],
    task: 'Build a jet-reaction vehicle powered solely by escaping air that travels at least 2 meters across the surface.',
    procedure: [
      'Blow up a balloon and release it to explain air pressure converting stored potential energy into kinetic energy.',
      'Instruct pupils to make clean central holes in plastic caps to form functioning circular wheels.',
      'Slide wooden bamboo skewers inside drinking straws to construct low-friction axle units connected to the chassis.',
      'Mount the balloon securely onto the vehicle, blowing it up through an exhaust straw.',
      'Pinch the straw shut, align the wheels on the starting line, release, and trace displacement length.'
    ],
    hints: "Friction is the ultimate enemy. Ensure wheel-axle slots are aligned perfectly and keep the overall weight of the chassis extremely light.",
    safetyRules: ['Supervise safety holes creation using nails or heated tips; only teachers must perform hot procedures.', 'Dispose of popped balloon fragments immediately.'],
    coreCompetency: 'Friction mechanics, Fluid conversion, Practical assembly'
  },
  {
    id: 6,
    title: 'Carrying a Load Down a Zip Line',
    timeLimit: '45 mins - 1 hour',
    costAssessment: 'Budget Challenge (12 Cedis limit)',
    idealBudget: 12,
    equipment: ['Guide line (string/wire)', 'Plastic cup', 'Weights (stone)', 'Straws (4 cedis)', 'Sticky tape (1 cedi/10cm)', 'Foil (2 cedis)', 'Paper clips (1 cedi)'],
    task: 'Assemble a carrier capsule to transport a heavy stone as quickly as possible down a steep zip wire within a strict budget constraint of 12 Cedis.',
    procedure: [
      'Setup a baseline test zip line from a high hook down to a heavy workstation leg.',
      'Write sample materials unit-costs clearly on the board. Force groups to fill out a written purchase order form.',
      'Assemble the capsule; it must clip onto the line seamlessly without dismantling the main wire hook.',
      'Measure trip duration using a digital stopwatch across three successive trials.',
      'Calculate structural efficiency by dividing payload mass by total Cedis spent.'
    ],
    hints: "The line connection must be smooth. Minimize sliding surface friction by making a curved plastic straw sheath or greasing contact points with vaseline.",
    safetyRules: ['Ensure line anchoring structures are extremely sturdy to avoid sudden snapping.', 'Set safety buffers around the high points.'],
    coreCompetency: 'Budget planning, Friction optimization, Speed metrics'
  },
  {
    id: 7,
    title: 'Egg Breaker Capsule',
    timeLimit: '60 - 75 minutes',
    costAssessment: 'Budget Challenge (75 Cedis limit)',
    idealBudget: 75,
    equipment: ['One raw egg', 'Newspaper (5 cedis)', 'Plastic bag (10 cedis)', 'Plastic cup (2 cedis)', 'Sticks (3 cedis)', 'Cotton wool (5 cedis)', 'Straws (4 cedis)'],
    task: 'Construct a protective capsule to absorb impact forces and drop a raw egg from a second-floor window without fractures, on a 75 Cedis budget.',
    procedure: [
      'Review acceleration rules and load-shock absorption strategies (parachutes to drop terminal speed, cotton padding to split load).',
      'Distribute the purchase list. Enforce a budget limit of 75 Cedis maximum per workstation.',
      'Wrap and pad the raw egg. Formulate protective safety cells.',
      'Conduct the drop trial from the designated school building high window on a clear ground sheet.',
      'Carefully unwrap the landing gear in front of the classroom jury to verify if the egg survived.'
    ],
    hints: "Combine surface area air-resistance (parachutes) with crumple zones. Cotton wool directly around the shell handles high localized shocks.",
    safetyRules: ['Drops must only be executed by secondary teachers under high-ground controls.', 'Clean up spilled egg contents and waste wrapping immediately.'],
    coreCompetency: 'Physics impulse study, Financial auditing, Structural integrity'
  }
];

export default function BstemTechGuide() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'welcome' | 'inventory' | 'code' | 'datalogger' | 'lowcost'>('welcome');
  
  // Code view states
  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [codeType, setCodeType] = useState<'blocks' | 'python'>('blocks');

  // Data logger simulator state
  const [simulationActive, setSimulationActive] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [waitSecs, setWaitSecs] = useState<number>(1);
  const [maxRepeats, setSimRepeats] = useState<number>(45);
  const [dataLogs, setDataLogs] = useState<{ time: number; foilTemp: number; controlTemp: number }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const simTimerRef = useRef<any>(null);

  // Low-cost generator state
  const [selectedActivity, setSelectedActivity] = useState<LowCostActivity>(LOW_COST_ACTIVITIES[0]);
  const [generatedNote, setGeneratedNote] = useState<string>('');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  // Navigation top-scroll mechanism is already handeled globally by ScrollToTop!
  
  // ----------------------------------------------------
  // Simulated Temperature Probe Mechanics
  // ----------------------------------------------------
  const startSimulation = () => {
    if (simulationActive) {
      // Pause
      setSimulationActive(false);
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      return;
    }

    setSimulationActive(true);
    setSimTime(0);
    setDataLogs([]);
    if (soundEnabled) playTone(520, 'sine', 0.15);

    // Initial temperature conditions: Water starts very hot (e.g., 85 degrees C)
    let currentFoilTemp = 85.0;
    let currentControlTemp = 85.0;

    let timeCounter = 0;
    const tempLogs = [];

    simTimerRef.current = setInterval(() => {
      timeCounter += waitSecs;
      
      // Cooling model: Control cools faster than the foil-covered flask (Hypothesis check p36)
      // Foil cools by ~ 0.08 C per sec, Control cools by ~ 0.15 C per sec
      const foilCoolingRate = 0.06 + Math.random() * 0.04;
      const controlCoolingRate = 0.14 + Math.random() * 0.07;

      currentFoilTemp = Math.max(28.0, currentFoilTemp - (foilCoolingRate * waitSecs));
      currentControlTemp = Math.max(28.0, currentControlTemp - (controlCoolingRate * waitSecs));

      const newLog = {
        time: timeCounter,
        foilTemp: parseFloat(currentFoilTemp.toFixed(1)),
        controlTemp: parseFloat(currentControlTemp.toFixed(1))
      };

      tempLogs.push(newLog);
      setDataLogs([...tempLogs]);
      setSimTime(timeCounter);

      if (soundEnabled) {
        // High frequency ticking sound to represent telemeters (p32, p35)
        playTone(380, 'sine', 0.04);
      }

      if (timeCounter >= maxRepeats) {
        setSimulationActive(false);
        if (simTimerRef.current) clearInterval(simTimerRef.current);
        if (soundEnabled) {
          playTone(520, 'sine', 0.12);
          setTimeout(() => playTone(650, 'sine', 0.12), 100);
          setTimeout(() => playTone(880, 'sine', 0.22), 200);
        }
        toast.success("Telemetry sweep complete!");
      }
    }, 1000);
  };

  const stopSimulation = () => {
    setSimulationActive(false);
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    if (soundEnabled) playTone(250, 'sawtooth', 0.2);
    toast.error("Telemetry interrupted.");
  };

  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, []);

  // ----------------------------------------------------
  // Dynamic Lesson Notes / NaCCA Prep Generator
  // ----------------------------------------------------
  const generateLessonNote = (act: LowCostActivity) => {
    setIsGeneratingNote(true);
    setGeneratedNote('');
    
    // Simulate smart curation aligned with Catalyst Creative brand
    setTimeout(() => {
      const template = `=== CATALYST CREATIVE / TEACHSMART GHANA ===
OFFICIAL NaCCA COMPLIANT JHS TEACHING PLAN & LESSON SHEET
------------------------------------------------------------
SUBJECT: JHS DESIGN AND TECHNOLOGY
STRAND: STRAND 6: LOW-COST ENGINEERING PROBLEM SOLVING
ACTIVITY: ${act.title.toUpperCase()}
EXPECTED DURATION: ${act.timeLimit}
CLASS SIZE DESIGN: 45 Pupils (9 Workstations of 5 Pupils)
BUDGET DIRECTIVE: ${act.costAssessment}

1. BEHAVIOURAL OBJECTIVES / CORE EXPECTATIONS:
By the end of this engineering session, JHS learners will successfully:
- Brainstorm, draft, and assemble a functioning physical prototype for: "${act.title}".
- Cooperatively manage workspace resources following strict professional safety guidelines.
- Isolating and testing mechanical variables under controlled classroom environments.

2. DETAILED INFRASTRUCTURE SETUP & MATERIALS:
Workstations must confirm secure retrieval of the following before commencing:
${act.equipment.map(eq => `   [ ] ${eq}`).join('\n')}

3. STEP-BY-STEP CLASSROOM INSTRUCTIONAL DELIVERY PATHWAY:
A. PHASE 1: STARTER / STIMULUS (10 Minutes)
   Explain physical rules. ${act.procedure[0]} Then, introduce: ${act.procedure[1]}

B. PHASE 2: BRAINSTORM & DESIGN LAYOUT (15 Minutes)
   Pupils gather in groups of 5 to outline sketch designs. Discuss variables and options:
   - Challenge Topic focus: ${act.task}
   - Reference Cost/Budget factors: ${act.costAssessment}

C. PHASE 3: ACTIVE BUILDING & TEST RUNS (30 Minutes)
   ${act.procedure[2] || "Construct active prototype using low-friction joins safely."}
   ${act.procedure[3] || "Analyze test trials and modify alignments logically."}

D. PHASE 4: SUMMATIVE TRIAL CONTEST (15 Minutes)
   Execute testing. ${act.procedure[4] || "Measure displacement levels, count parts, or check load limits."}

4. SPECIAL CLINICAL HINTS & ADVICE:
* ${act.hints}

5. CORE GE COMPETENCIES FOCUS AREAS:
* ${act.coreCompetency}

6. MANDATORY STANDARDS FOR LABORATORY SAFETY:
${act.safetyRules.map((sr, idx) => `   ${idx + 1}. [SAFETY ALIGNMENT]: ${sr}`).join('\n')}

------------------------------------------------------------
TeachSmartGH • Aligned with NaCCA & Ghana Education Service Guidelines
"AI-Powered Teaching. Smarter Tomorrow."
============================================================`;
      setGeneratedNote(template);
      setIsGeneratingNote(false);
      toast.success("Perfect NaCCA Lesson Plan structure curated!");
    }, 850);
  };

  const copyNoteClipboard = () => {
    if (generatedNote) {
      navigator.clipboard.writeText(generatedNote);
      toast.success("Lesson template copied to clipboard!");
    }
  };

  const downloadNoteTxt = () => {
    if (!generatedNote) return;
    const element = document.createElement("a");
    const file = new Blob([generatedNote], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `TeachSmart_${selectedActivity.title.replace(/\s+/g, '_')}_LessonPlan.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("TXT Lesson note downloaded!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-12 font-sans transition-colors duration-300">
      
      {/* 🇬🇭 Parent Brand Premium Banner */}
      <div className="bg-[#0b1329] text-white py-10 px-6 sm:px-8 md:px-12 relative overflow-hidden border-b-4 border-amber-500 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-1.5 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600"></div>
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30">
                🇬🇭 NaCCA JHS Curriculum Approved
              </span>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
                BSTEM Project Companion
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              BSTEM Technology & Engineering
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Elevate classroom engagement using the official JHS teacher activity guidelines. Guide pupils through Scratch programming block logic, mBot robot circuits, real Data Logging telemetry loops, and creative low-cost engineering tournaments.
            </p>
          </div>
          <div className="border-l-4 border-emerald-500 pl-5 py-2 shrink-0 bg-slate-900/40 p-4 rounded-r-3xl">
            <p className="text-[10px] uppercase tracking-widest text-[#fbd512] font-black leading-none mb-1">Parent Brand Group</p>
            <p className="text-lg font-black tracking-tight text-white leading-none">CATALYST CREATIVE</p>
            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Product: TeachSmartGH</p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap bg-slate-900 p-2 rounded-[2rem] gap-1 shadow-lg overflow-x-auto select-none border border-slate-800">
          <button
            onClick={() => setActiveTab('welcome')}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'welcome' ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Sparkles size={14} />
            <span>Overview & BSTEM Portal</span>
          </button>
          
          <button
            onClick={() => setActiveTab('inventory')}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'inventory' ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Layers size={14} />
            <span>Kit / Sensors Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'code' ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Terminal size={14} />
            <span>mBlock Code Labs</span>
          </button>

          <button
            onClick={() => setActiveTab('datalogger')}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'datalogger' ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Atom size={14} />
            <span>Interactive Data Logging</span>
          </button>

          <button
            onClick={() => setActiveTab('lowcost')}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'lowcost' ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Hammer size={14} />
            <span>Low-Cost Engineering</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TABS CONTAINER */}
        {/* ---------------------------------------------------- */}
        <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-6 lg:p-10 shadow-sm">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'welcome' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400 text-[10px] font-black uppercase tracking-wider rounded-lg">
                    <Info size={12} className="text-yellow-600" />
                    <span>Resource Guide Chapter 1 - 3</span>
                  </div>
                  <h2 className="text-2xl lg:text-3.5xl font-black uppercase tracking-tight leading-none text-slate-900 dark:text-white">
                    The BSTEM School Portal Layout & Navigation
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                    Each BSTEM school has been supplied with a high-capacity teacher laptop, a high-brightness projector, and high-fidelity sound speakers. The desk software is centered around the official <strong>BSTEM Portal</strong>, allowing teachers to browse resources in four major sections:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-600">1. MS Office Training</p>
                      <p className="text-[11px] text-slate-500 leading-snug">Instructions and 26-video tutorials guiding teachers on using Word, PowerPoint, and Excel registers.</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest text-ghana-red">2. Direct Programming</p>
                      <p className="text-[11px] text-slate-500 leading-snug">Equips JHS students on using <strong>Scratch Block Controls</strong> first before moving onto professional text-based <strong>Python</strong>.</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest text-amber-500">3. Robotics Operations</p>
                      <p className="text-[11px] text-slate-500 leading-snug">Building and compiling code logs for the 3-wheeled mBot. Includes obstacle avoidance and Line follower setups.</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest text-indigo-500">4. Low-Cost Projects</p>
                      <p className="text-[11px] text-slate-500 leading-snug">13 custom hands-on projects utilizing inexpensive materials like scrap paper, clips, boxes, and plastic bottles.</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 relative bg-slate-950 text-white rounded-[2.5rem] p-6 border-2 border-slate-800 overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">🚨 TEACHER ACTION CHECKLIST (GES STANDARD)</p>
                      <Clock size={14} className="text-slate-400" />
                    </div>
                    <ul className="space-y-3 text-[11px] font-medium text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Restore factory firmware</strong> after every programming session so follow-the-line sensors are not broken for other teachers.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>Setup an after-school BSTEM Club to allow flexible design of low-cost engineering models outside packed timetables.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>Let pupils form groups of 5, distribute tasks and give them control over assembly bags. Direct them as active guides.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-ghana-gold/5 rounded-full blur-xl pointer-events-none"></div>
                </div>
              </div>
            </div>
          )}

          {/* KIT INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers size={18} className="text-amber-500" />
                  Visual JHS Technology Kit & Sensors List
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  Comprehensive listing of all electronic boards, sensors, probes, and support frames distributed per physical workstation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {KIT_COMPONENTS.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900">{item.category}</span>
                        <span>{item.id}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 uppercase tracking-tight transition-all">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                      <span className="px-3 py-1 bg-slate-200 dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-300 text-[10px] font-black rounded-lg">
                        QTY: {item.qty} units
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 italic">
                        {item.naCCARanking}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CODE LABS TAB */}
          {activeTab === 'code' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal size={18} className="text-emerald-500 animate-pulse" />
                  On-Board mBlock Visual Code Logic Reference
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  Study the graphical Scratch block chains used in mBlock software programs alongside their actual compiled Python logic translations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Select Project Left list */}
                <div className="lg:col-span-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projects Directory</p>
                  {PROJECTS_LIST.map((proj, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedProject(idx);
                        if (soundEnabled) playTone(450, 'sine', 0.05);
                      }}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border text-xs font-bold uppercase tracking-tight transition-all flex flex-col gap-1",
                        selectedProject === idx 
                          ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10" 
                          : "bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350"
                      )}
                    >
                      <span>{proj.title}</span>
                      <span className="text-[9px] font-bold text-amber-500 italic lowercase normal-case tracking-normal">Activity book page {proj.pageRef}</span>
                    </button>
                  ))}
                </div>

                {/* Show Compiled Code Right box */}
                <div className="lg:col-span-8 bg-slate-950 text-white rounded-[2.5rem] border-2 border-slate-800 p-6 flex flex-col justify-between h-[450px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">
                          {PROJECTS_LIST[selectedProject].title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-snug">
                          {PROJECTS_LIST[selectedProject].description}
                        </p>
                      </div>

                      <div className="flex bg-slate-900 p-1 rounded-xl text-[9px] font-black uppercase tracking-widest shrink-0">
                        <button 
                          onClick={() => setCodeType('blocks')}
                          className={cn("px-3 py-1.5 rounded-lg transition-all", codeType === 'blocks' ? "bg-amber-500 text-slate-950" : "text-white/60")}
                        >
                          Scratch Blocks
                        </button>
                        <button 
                          onClick={() => setCodeType('python')}
                          className={cn("px-3 py-1.5 rounded-lg transition-all", codeType === 'python' ? "bg-amber-500 text-slate-950" : "text-white/60")}
                        >
                          Python (3.6)
                        </button>
                      </div>
                    </div>

                    <div className="font-mono text-xs overflow-y-auto max-h-[300px] space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
                      {codeType === 'blocks' ? (
                        <div className="space-y-1 px-2 border-l-2 border-amber-500">
                          {PROJECTS_LIST[selectedProject].blockCode.map((line, lIdx) => (
                            <div key={lIdx} className={cn(
                              "p-1.5 rounded-md", 
                              line.startsWith('when') && "bg-amber-500/20 text-amber-300 font-bold",
                              line.trim().startsWith('forever') && "bg-indigo-500/20 text-indigo-300 font-bold ml-1",
                              line.trim().startsWith('if') && "bg-orange-500/10 text-orange-300 font-semibold ml-2",
                              line.trim().startsWith('LED') && "bg-emerald-500/20 text-emerald-300 ml-4",
                              line.trim().startsWith('move') && "bg-blue-500/20 text-blue-300 ml-4"
                            )}>
                              {line}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <pre className="text-emerald-400 p-3 bg-slate-900/60 rounded-xl overflow-x-auto text-[11px] leading-relaxed">
                          {PROJECTS_LIST[selectedProject].pythonCode}
                        </pre>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/10 pt-3 text-[10px] text-slate-400 font-bold">
                    <span>Compiles into on-board mCore binary</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(codeType === 'blocks' ? PROJECTS_LIST[selectedProject].blockCode.join('\n') : PROJECTS_LIST[selectedProject].pythonCode);
                        toast.success("Logic script copied!");
                      }} 
                      className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-white uppercase font-black"
                    >
                      Copy Script
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC DATA LOGGER SIMULATOR */}
          {activeTab === 'datalogger' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Atom size={18} className="text-indigo-500 animate-spin" />
                    Interactive Flask Thermal Loss Data-Logger
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">
                    Simulate identical conical flasks filled with boiling water. Telemetry compares heat loss in a foil-covered flask vs a plain control flask (Activity Book p.32).
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audio feedback:</span>
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={cn("px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all", soundEnabled ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400")}
                  >
                    {soundEnabled ? "On" : "Off"}
                  </button>
                </div>
              </div>

              {/* Grid Simulator & Control Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Control Box Left */}
                <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-950 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
                  <div className="flex items-center gap-2 border-b dark:border-slate-800 pb-3">
                    <Settings size={16} className="text-indigo-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Telemetry Configuration</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Telemetry sweep period (Seconds)</label>
                      <input 
                        type="number"
                        min="10"
                        max="180"
                        value={maxRepeats}
                        onChange={(e) => setSimRepeats(parseInt(e.target.value) || 20)}
                        className="w-full p-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl text-xs font-bold"
                        disabled={simulationActive}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Telemetric sampling rate (Secs)</label>
                      <input 
                        type="number"
                        min="1"
                        max="10"
                        value={waitSecs}
                        onChange={(e) => setWaitSecs(parseInt(e.target.value) || 1)}
                        className="w-full p-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl text-xs font-bold"
                        disabled={simulationActive}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t dark:border-slate-800">
                    {simulationActive ? (
                      <button 
                        onClick={stopSimulation}
                        className="w-full py-4 bg-ghana-red text-white flex items-center justify-center gap-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/10"
                      >
                        <Square size={13} fill="white" />
                        <span>Abrupt Stop (Abort)</span>
                      </button>
                    ) : (
                      <button 
                        onClick={startSimulation}
                        className="w-full py-4 bg-indigo-900 hover:bg-indigo-800 text-white flex items-center justify-center gap-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-950/20"
                      >
                        <Play size={13} fill="white" />
                        <span>Start Telemetry Stream</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Simulated Graph Right Column */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-slate-950 border-2 border-slate-850 p-6 rounded-[2.5rem] flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                      <div>
                        <p className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Active Stream: JHS Data Telemetry</p>
                        <div className="flex items-center gap-4 mt-1 font-mono text-xs text-white">
                          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>Foil Vessel</span>
                          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>Control Vessel</span>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs text-slate-400">
                        <p>Time elapsed: <span className="text-white font-bold">{simTime}s</span> / {maxRepeats}s</p>
                      </div>
                    </div>

                    {/* Highly Aesthetic SVG Micro Graph */}
                    <div className="h-64 bg-slate-900 rounded-2xl border border-white/5 relative p-4 flex flex-col justify-between font-mono text-[9px] text-slate-500 select-none">
                      
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                        <div className="border-b border-white/5 w-full"></div>
                        <div className="border-b border-white/5 w-full"></div>
                        <div className="border-b border-white/5 w-full"></div>
                        <div className="border-b border-white/5 w-full"></div>
                        <div className="border-b border-white/5 w-full"></div>
                      </div>

                      {/* Render temperature reading lines */}
                      <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {dataLogs.length > 1 && (
                          <>
                            {/* Foil Temp (Yellow Line) */}
                            <path 
                              d={`M ${dataLogs.map((log, index) => {
                                const x = (index / (maxRepeats / waitSecs)) * 100;
                                const y = 100 - ((log.foilTemp - 20) / (90 - 20)) * 100;
                                return `${x},${y}`;
                              }).join(' L ')}`}
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              className="transition-all duration-300"
                            />
                            {/* Control Temp (Blue Line) */}
                            <path 
                              d={`M ${dataLogs.map((log, index) => {
                                const x = (index / (maxRepeats / waitSecs)) * 100;
                                const y = 100 - ((log.controlTemp - 20) / (90 - 20)) * 100;
                                return `${x},${y}`;
                              }).join(' L ')}`}
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              className="transition-all duration-300"
                            />
                          </>
                        )}
                      </svg>

                      {/* Display temperatures vertically */}
                      <div className="flex justify-between items-start h-full">
                        <div className="flex flex-col justify-between h-full text-slate-400 font-bold">
                          <span>90°C</span>
                          <span>70°C</span>
                          <span>50°C</span>
                          <span>30°C</span>
                        </div>
                        
                        {dataLogs.length > 0 && (
                          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-bold space-y-1 self-start z-10 mr-4 shadow-xl">
                            <p className="text-yellow-400">Foil: {dataLogs[dataLogs.length - 1].foilTemp}°C</p>
                            <p className="text-blue-400">Control: {dataLogs[dataLogs.length - 1].controlTemp}°C</p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-slate-400 mt-2 font-bold px-8">
                        <span>0s</span>
                        <span>Halfpoint</span>
                        <span>{maxRepeats}s max</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1 text-[10px] font-mono text-slate-400">
                      <p className="shrink-0 font-bold">Realtime Telemetry log:</p>
                      {dataLogs.map((log, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 px-2 py-1 rounded">
                          {log.time}s: F({log.foilTemp}°C) C({log.controlTemp}°C)
                        </span>
                      ))}
                      {dataLogs.length === 0 && <span className="italic text-slate-500">Awaiting stream launch...</span>}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* LOW-COST ENGINEERING TAB */}
          {activeTab === 'lowcost' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Hammer size={18} className="text-yellow-600" />
                  Manual Low-Cost Engineering Projects
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  Access 13 hands-on structural and mechanical problem-solving tasks. Generate structured NaCCA plans and download worksheets (Activity book p.37-59).
                </p>
              </div>

              {/* Layout splits into Activities selection & Curated lesson note output */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Select Activity Column */}
                <div className="lg:col-span-5 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activities Directory</p>
                  
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                    {LOW_COST_ACTIVITIES.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => {
                          setSelectedActivity(act);
                          setGeneratedNote('');
                          if (soundEnabled) playTone(450, 'sine', 0.05);
                        }}
                        className={cn(
                          "w-full text-left p-5 rounded-[2rem] border text-xs font-bold uppercase tracking-tight transition-all flex flex-col gap-2 relative overflow-hidden group",
                          selectedActivity.id === act.id 
                            ? "bg-slate-950 text-white border-amber-500 shadow-md transform scale-102" 
                            : "bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn(
                            "text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider",
                            selectedActivity.id === act.id 
                              ? "bg-amber-400 text-slate-950" 
                              : "bg-slate-200 text-slate-600"
                          )}>
                            Activity #{act.id}
                          </span>
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest",
                            selectedActivity.id === act.id ? "text-emerald-400 animate-pulse" : "text-slate-400"
                          )}>
                            {act.timeLimit}
                          </span>
                        </div>
                        
                        <h3 className="font-extrabold text-sm uppercase tracking-tight">{act.title}</h3>
                        <p className={cn("text-[10px] leading-snug line-clamp-2 mt-1", selectedActivity.id === act.id ? "text-slate-300" : "text-slate-500")}>
                          {act.task}
                        </p>

                        <div className="pt-2 border-t border-dashed border-slate-500/20 flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 text-[9px] text-[#fbd512] font-black">
                            <Coins size={12} />
                            <span>Cost level: {act.costAssessment}</span>
                          </div>
                          <ChevronRight size={14} className="text-slate-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Output Column */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Quick Card Details */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[2.5rem] border border-slate-150 dark:border-slate-800 space-y-6">
                    <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Activity Worksheet</p>
                        <h4 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white mt-1">
                          {selectedActivity.title}
                        </h4>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900 text-yellow-800 dark:text-yellow-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest shrink-0">
                        <BadgeAlert size={14} />
                        <span>Worksheets</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs font-medium text-slate-700 dark:text-slate-350 leading-relaxed">
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                        <p className="font-bold text-slate-900 dark:text-white">🎯 Dynamic Task Statement:</p>
                        <p className="text-slate-600 dark:text-slate-400">{selectedActivity.task}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                          <p className="font-bold text-slate-900 dark:text-white">🎒 Workstation Materials:</p>
                          <ul className="list-disc pl-3 text-[11px] text-slate-500 space-y-1">
                            {selectedActivity.equipment.map((eq, index) => (
                              <li key={index}>{eq}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                          <p className="font-bold text-slate-900 dark:text-white">💡 JHS Pedagogical Notes:</p>
                          <p className="text-[11px] text-slate-500 leading-snug">{selectedActivity.hints}</p>
                        </div>
                      </div>

                      {/* Safety Warning Card */}
                      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4 rounded-2xl flex gap-3 text-red-800 dark:text-red-400">
                        <ShieldAlert size={20} className="shrink-0 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-bold text-[11px] uppercase tracking-wider">Mandatory Laboratory Safety Rules:</p>
                          <ul className="list-disc pl-3 text-[11px] mt-1 space-y-1">
                            {selectedActivity.safetyRules.map((sr, index) => (
                              <li key={index}>{sr}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 border-t dark:border-slate-800 pt-5">
                      <button 
                        onClick={() => generateLessonNote(selectedActivity)}
                        disabled={isGeneratingNote}
                        className="flex-1 btn-primary bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-3.5 text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={14} className={cn(isGeneratingNote && "animate-spin")} />
                        <span>{isGeneratingNote ? "Curing..." : "Curate NaCCA Lesson Plan"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Render Lesson Note Code output Box */}
                  <AnimatePresence>
                    {generatedNote && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-slate-950 text-white rounded-[2.5rem] border-2 border-slate-850 p-6 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                          <p className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Teacher Output File: Curriculum compliant</p>
                          <div className="flex gap-2">
                            <button onClick={copyNoteClipboard} className="p-1 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] uppercase font-bold rounded-lg flex items-center gap-1 text-slate-300">
                              <Copy size={12} />
                              <span>Copy Code</span>
                            </button>
                            <button onClick={downloadNoteTxt} className="p-1 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] uppercase font-bold rounded-lg flex items-center gap-1 text-slate-300">
                              <Download size={12} />
                              <span>Download .TXT</span>
                            </button>
                          </div>
                        </div>

                        <pre className="font-mono text-[10px] text-slate-300 bg-slate-900/60 p-4 rounded-2xl overflow-y-auto max-h-[350px] leading-relaxed whitespace-pre-wrap select-all">
                          {generatedNote}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
