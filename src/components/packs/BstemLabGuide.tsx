import React, { useState } from 'react';
import { 
  Atom, Search, Filter, BookOpen, Clock, CheckCircle, ChevronDown, 
  ChevronUp, Printer, FileText, Download, Copy, AlertCircle, Sparkles, 
  Calculator, ListPlus, Trash2, ArrowRight, CornerDownRight, Info, Library,
  Cpu, Compass, Layers, ShieldAlert, BadgeHelp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Definitive BSTEM JHS Equipment & Kit listings loaded from official guides
interface KitItem {
  name: string;
  qty: number;
}

interface BstemEquipment {
  id: string;
  category: 'science' | 'chemical' | 'math' | 'ict';
  name: string;
  specification: string;
  unit: string;
  qtyPerSite: number | string;
  kitBreakdown?: KitItem[];
  suitableGrades?: string[];
  suggestedPracticals?: string[];
}

const BSTEM_DATA: BstemEquipment[] = [
  // SCIENCE items
  {
    id: 'JS1',
    category: 'science',
    name: 'Balance Compression 2kg',
    specification: 'Durable Plastic body balance with wide dial and scale. Useful for weighing chemicals and general purposes. Zero adjustment knob included. Capacity 2kg, Sub division: 10g',
    unit: 'Each',
    qtyPerSite: 2,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Density of materials', 'Mixtures preparation', 'Measuring solid masses']
  },
  {
    id: 'JS2',
    category: 'science',
    name: 'Beaker Glass 100ml',
    specification: 'Graduation low form beaker with spout. Made of Borosilicate glass, graduated as per DIN 12231 / ISO 3819. Dia - 50 mm, Height - 70 mm, Weight - 54g.',
    unit: 'Each',
    qtyPerSite: 20,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Measuring liquids', 'Observing boiling points', 'Chemical solution mixing']
  },
  {
    id: 'JS3',
    category: 'science',
    name: 'Beaker Plastic 250ml',
    specification: 'Polypropylene, autoclavable, excellent clarity and very good chemical resistance. Easy to read printed graduation.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8'],
    suggestedPracticals: ['Cold water reactions', 'Safety measurement exercises']
  },
  {
    id: 'JS4',
    category: 'science',
    name: 'Beaker Plastic 500ml',
    specification: 'Polypropylene, with moulded graduations, excellent clarity, autoclaving-safe, with tapered spout.',
    unit: 'Each',
    qtyPerSite: 5,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Preparing standard dilutions', 'Filtration exercises']
  },
  {
    id: 'JS5',
    category: 'science',
    name: 'Conducting Thermal Rods',
    specification: 'Copper (Cu), Brass, Iron (Fe), Aluminium (Al), Zinc (Zn). 300 mm long x 3 mm dia',
    unit: 'Each',
    qtyPerSite: 5,
    suitableGrades: ['Basic 8'],
    suggestedPracticals: ['Comparing heat conductivity in metals', 'Thermal expansion studies']
  },
  {
    id: 'JS6',
    category: 'science',
    name: 'Conical Flask 100ml',
    specification: 'Borosilicate glass, Erlenmeyer neck, narrow neck. As per DIN ISO 1773 standard.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Acid-Base neutralization indicators', 'Filtration collection']
  },
  {
    id: 'JS7',
    category: 'science',
    name: 'Dropping Pipettes Plastic',
    specification: '1ml volume, graduated by 0.5ml. Translucent with precise graduation, Material LDPE.',
    unit: 'Each',
    qtyPerSite: 50,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Indicator testing (Starch/Iodine)', 'Micro-volume liquid additions']
  },
  {
    id: 'JS8',
    category: 'science',
    name: 'Electricity Kit',
    specification: 'Comprehensive low-voltage classroom electricity practical kit containing cell holders, bulbs, and conductors.',
    unit: 'Each',
    qtyPerSite: 1,
    suitableGrades: ['Basic 8', 'Basic 9'],
    suggestedPracticals: ['Series vs Parallel circuits', 'Ohmic conductors testing', 'Constructing simple electromagnets'],
    kitBreakdown: [
      { name: "Battery holders (for HP 2 cells)", qty: 12 },
      { name: "Blubs (Classic 2.5V)", qty: 40 },
      { name: "Bulb holders", qty: 20 },
      { name: "Resistance wire spool", qty: 1 },
      { name: "Insulated copper wire", qty: 1 },
      { name: "Bare copper wire", qty: 1 },
      { name: "Push switches", qty: 8 },
      { name: "Two-way switches", qty: 4 },
      { name: "Variable resistors (potentiometers)", qty: 4 },
      { name: "Universal connection clips", qty: 8 },
      { name: "Short connecting leads", qty: 24 },
      { name: "Long connecting leads", qty: 8 },
      { name: "Heavy-duty Crocodile clips", qty: 8 },
      { name: "Carbon electrodes", qty: 12 },
      { name: "Copper sheet patch", qty: 1 },
      { name: "Semiconductor Diodes", qty: 4 },
      { name: "Fixed Resistors", qty: 4 },
      { name: "Steel Rods", qty: 8 },
      { name: "Steel mesh wool roll", qty: 1 }
    ]
  },
  {
    id: 'JS9',
    category: 'science',
    name: 'Electronics Kit',
    specification: 'Solderless breadboard kit with components for computing, sensor integration, and basic circuit programming.',
    unit: 'Each',
    qtyPerSite: 9,
    suitableGrades: ['Basic 8', 'Basic 9'],
    suggestedPracticals: ['LDR light alarms', 'Transistor amplification circuits', 'Buzzer notifications'],
    kitBreakdown: [
      { name: "Breadboard (830 point)", qty: 1 },
      { name: "12-way Terminal block", qty: 1 },
      { name: "2.5V Miniature MES bulb", qty: 1 },
      { name: "Bulb holder", qty: 1 },
      { name: "Ultrabright red LED", qty: 1 },
      { name: "Red LED", qty: 5 },
      { name: "Yellow LED", qty: 5 },
      { name: "Green LED", qty: 5 },
      { name: "Light dependent resistor (LDR)", qty: 1 },
      { name: "Thermistor sensor", qty: 1 },
      { name: "BC547B NPN transistor", qty: 2 },
      { name: "1.5V piezo buzzer", qty: 1 },
      { name: "100uF capacitor", qty: 1 },
      { name: "470uF capacitor", qty: 1 },
      { name: "50kΩ preset potentiometer", qty: 1 },
      { name: "470R limiting resistors", qty: 5 },
      { name: "1K pull-up resistors", qty: 5 },
      { name: "10K pull-up resistors", qty: 5 },
      { name: "Solid core jumper wire pack", qty: 1 },
      { name: "Stranded connecting wire length", qty: 1 },
      { name: "Tinned copper wire length", qty: 1 },
      { name: "2AA battery box with manual switch", qty: 1 },
      { name: "4AA battery box", qty: 1 },
      { name: "Standard 9V battery snap", qty: 1 },
      { name: "Small electric motors", qty: 2 },
      { name: "Motor tag wire connectors", qty: 4 },
      { name: "Silicone protective tube", qty: 1 },
      { name: "Anti-static tweezers", qty: 1 },
      { name: "Metal mounting screws", qty: 1 },
      { name: "Miniature Solar Cell panel", qty: 1 },
      { name: "Robust plastic storage case", qty: 1 },
      { name: "Standard PN Diodes", qty: 2 },
      { name: "1000uF electrolytic capacitor", qty: 1 },
      { name: "Pluggable mini fan blades", qty: 1 }
    ]
  },
  {
    id: 'JS10',
    category: 'science',
    name: 'Evaporating Dish',
    specification: 'Easy to clean and safe to use for separating mixtures and ashing. Porcelain body with pouring spout, deep form, glazed. Capacity 100ml, outer dia 75mm.',
    unit: 'Each',
    qtyPerSite: 5,
    suitableGrades: ['Basic 7', 'Basic 8'],
    suggestedPracticals: ['Salt water evaporation', 'Separating soluble mixtures']
  },
  {
    id: 'JS11',
    category: 'science',
    name: 'Filter Paper (12.5cm)',
    specification: 'Pack of 100 Circles. Premium quality general laboratory filter paper. WHATMAN No.1 standard equivalent.',
    unit: 'Pack',
    qtyPerSite: 4,
    suitableGrades: ['Basic 7', 'Basic 8'],
    suggestedPracticals: ['Filtration of sand/water', 'Separating insoluble solids']
  },
  {
    id: 'JS12',
    category: 'science',
    name: 'Funnel Filter Plastic',
    specification: 'Polythene material, highly resistant to acids and alkalies. Spout diameter 75 mm, Stem Length 76 mm.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Assembling gravity filtration setups']
  },
  {
    id: 'JS13',
    category: 'science',
    name: 'Iron Filings',
    specification: 'Fine-grained iron filings packed inside a secure sprinkler jar for easy safety distribution.',
    unit: 'Pack',
    qtyPerSite: 4,
    suitableGrades: ['Basic 7', 'Basic 9'],
    suggestedPracticals: ['Visualizing magnetic field lines', 'Creating mixtures with sulfur/sand']
  },
  {
    id: 'JS14',
    category: 'science',
    name: 'JHS Mapped Science Activity Book',
    specification: 'Teacher resource book. Includes step-by-step training activities, comprehensive classroom lab guides, and printouts. Specifically linked to Ghana JHS curriculum.',
    unit: 'Each',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Inquiry lesson pacing planning', 'Competency grading alignments']
  },
  {
    id: 'JS15',
    category: 'science',
    name: 'Leads Red/Black with Crocodile Clips',
    specification: 'Insulated cable leads with spring-loaded alligator clips at both ends. 4 mm plug compatible. Length 750 mm, Black x10, Red x10',
    unit: 'Each',
    qtyPerSite: 20,
    suitableGrades: ['Basic 8', 'Basic 9'],
    suggestedPracticals: ['Hooking up electric circuit boards', 'Testing electrical conductivity']
  },
  {
    id: 'JS16',
    category: 'science',
    name: 'Litmus Paper - Blue',
    specification: 'Plastic containing 5 booklets, each containing 20 high-sensitivity blue test strips. Size: 63.5 x 10 mm.',
    unit: 'Books',
    qtyPerSite: 5,
    suitableGrades: ['Basic 7', 'Basic 9'],
    suggestedPracticals: ['Testing acidity of local foods', 'Distinguishing soil pH levels']
  },
  {
    id: 'JS17',
    category: 'science',
    name: 'Litmus Paper - Red',
    specification: 'Plastic containing 5 booklets, each containing 20 high-sensitivity red test strips. Size: 63.5 x 10 mm.',
    unit: 'Books',
    qtyPerSite: 5,
    suitableGrades: ['Basic 7', 'Basic 9'],
    suggestedPracticals: ['Alkalinity base checks', 'Neutralization reaction endpoints']
  },
  {
    id: 'JS18',
    category: 'science',
    name: 'Magnet Kit',
    specification: 'Study set of assorted educational magnets including bar, cylindrical, horseshoe and magnetic balls.',
    unit: 'Pack',
    qtyPerSite: 2,
    suitableGrades: ['Basic 7', 'Basic 9'],
    suggestedPracticals: ['Magnetic attraction laws', 'Constructing simple compasses', 'Testing non-magnetic materials'],
    kitBreakdown: [
      { name: "Plotting compasses", qty: 10 },
      { name: "Classic Horseshoe magnet", qty: 1 },
      { name: "Ferrite Black Bar magnetic pair", qty: 2 },
      { name: "Red/Blue Alnico Bar magnets", qty: 2 },
      { name: "Magnadur (ceramic block) magnets", qty: 3 },
      { name: "Sintered Cylindrical magnets", qty: 2 },
      { name: "Iron powder field trays", qty: 2 },
      { name: "Circular Ring magnets", qty: 3 },
      { name: "Assorted test metals (Al, Cu, Zn, Fe)", qty: 1 },
      { name: "Coloured magnetic iron balls", qty: 5 }
    ]
  },
  {
    id: 'JS19',
    category: 'science',
    name: 'Magnets (Bar)',
    specification: '100 x 12 x 5 mm Chrome steel magnets. Permanent bar configuration with embossed poles. High durability.',
    unit: 'Each',
    qtyPerSite: 20,
    suitableGrades: ['Basic 7', 'Basic 9'],
    suggestedPracticals: ['Attraction and repulsion studies']
  },
  {
    id: 'JS20',
    category: 'science',
    name: 'Masses 100g with Hanger',
    specification: '9 pieces of 100g slot masses on a 100g lock hanger hook. Zinc die casted, protective powder coating. Acc. within +/- 2%.',
    unit: 'Set',
    qtyPerSite: 4,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Investigating Hooke\'s Law', 'Calibrating spring balances', 'Testing force balance rules']
  },
  {
    id: 'JS21',
    category: 'science',
    name: 'Measuring Cylinder Plastic 100ml',
    specification: 'Translucent polypropylene base and body. Autoclavable, raised printed graduations. Capacity: 100ml, Subdivision: 1.0ml.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Precise volume measurements', 'Water displacement density checks']
  },
  {
    id: 'JS22',
    category: 'science',
    name: 'Measuring Cylinder Plastic 250ml',
    specification: 'Translucent polypropylene base and body. Autoclavable, high-impact structure. Capacity: 250ml, Subdivision: 2.0ml.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Liquids distribution', 'Bulk chemistry reactions']
  },
  {
    id: 'JS23',
    category: 'science',
    name: 'Metal Rod Retort Support Stand',
    specification: 'Stainless steel rod support shaft. Heavy powder coated iron base plate. Fitted with 4-pronged cork lined clamp and heating retort ring.',
    unit: 'Set',
    qtyPerSite: 3,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Grip flasks for heating', 'Holding filtration funnels', 'Hanging pendulums']
  },
  {
    id: 'JS24',
    category: 'science',
    name: 'Mirrors & Optics Kit',
    specification: 'Experimental physics kit designed for the study of reflection, refraction, focal points and lenses.',
    unit: 'Set',
    qtyPerSite: 3,
    suitableGrades: ['Basic 9'],
    suggestedPracticals: ['Measuring Angle of Reflection', 'Concave/Convex image properties', 'Ray-tracing refraction angles'],
    kitBreakdown: [
      { name: "Glass Plane mirrors (Block 100x75mm)", qty: 2 },
      { name: "Stainless steel Concave Mirror", qty: 1 },
      { name: "Stainless steel Convex Mirror", qty: 1 },
      { name: "Lenses (curved convex/concave 10cmFL)", qty: 2 }
    ]
  },
  {
    id: 'JS25',
    category: 'science',
    name: 'Optical Pins',
    specification: 'Nickel plated heavy iron pins, rust resistant. Pack of 100. Ideal for optical path boards.',
    unit: 'Pack',
    qtyPerSite: 1,
    suitableGrades: ['Basic 9'],
    suggestedPracticals: ['Optics ray pinning coordinates', 'Securing materials to boards']
  },
  {
    id: 'JS26',
    category: 'science',
    name: 'Petri Dish Plastic 90mm',
    specification: 'Standard biology grade petri dishes. Premium optical clarity, sterile, with lids included.',
    unit: 'Each',
    qtyPerSite: 20,
    suitableGrades: ['Basic 7', 'Basic 8'],
    suggestedPracticals: ['Seed germination environment studies', 'Mould growing biology lessons']
  },
  {
    id: 'JS27',
    category: 'science',
    name: 'Ray Box & Lenses Kit',
    specification: 'Optics study kit containing dynamic light ray emitter with adjustable slits, lenses and glass prisms.',
    unit: 'Each',
    qtyPerSite: 4,
    suitableGrades: ['Basic 9'],
    suggestedPracticals: ['White light splitting into spectrums', 'Focal length measurements'],
    kitBreakdown: [
      { name: "Solid Glass Prisms (Equilateral/Right)", qty: 3 },
      { name: "Double Concave optical lens", qty: 1 },
      { name: "Double Convex optical lens", qty: 1 },
      { name: "Low-heat Raybox with lamp holder", qty: 1 },
      { name: "Triple/Single light beam aperture slit", qty: 1 }
    ]
  },
  {
    id: 'JS28',
    category: 'science',
    name: 'Safety Goggles (Junior)',
    specification: 'General purpose clear protective goggles. Features side ventilation windows and soft frame. Fits over prescription glasses. Green adjustable elastic strap.',
    unit: 'Each',
    qtyPerSite: 45,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Strict safety rules protocol labs', 'Acid heating demonstrations']
  },
  {
    id: 'JS29',
    category: 'science',
    name: 'Spatula Stainless Steel',
    specification: 'Length 14 cm. Double-ended spoon/paddle configuration. Flat bent tongue and opposite hollow scoop spatula. Professional stainless steel.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Scooping chemical salts', 'Stirring small test quantities']
  },
  {
    id: 'JS30',
    category: 'science',
    name: 'Spirit Burners Glass',
    specification: 'Glass fuel reservoir, capacity 120 ml, fitted with wick holder, cotton wick, and airtight plastic cap.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Boiling water labs', 'Demonstrating heat of vaporization']
  },
  {
    id: 'JS31',
    category: 'science',
    name: 'Spring Balances 1kg',
    specification: 'Clear tubular plastic spring scale. Calibrated double measurements (Grams and Newtons). Zero calibration screw. Capacity: 1 Kg / 10 N.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 8', 'Basic 9'],
    suggestedPracticals: ['Measuring weight forces', 'Friction force measurements']
  },
  {
    id: 'JS32',
    category: 'science',
    name: 'Spring Balances 500g',
    specification: 'Clear tubular plastic spring scale. Calibrated double measurements (Grams and Newtons). Zero calibration screw. Capacity: 500g / 5N.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 8', 'Basic 9'],
    suggestedPracticals: ['Small hook balance evaluations', 'Floating density lift forces']
  },
  {
    id: 'JS33',
    category: 'science',
    name: 'Stirrer (Plastic, Hand)',
    specification: 'Polypropylene stirring rod. Heavy duty solid format. Diameter 10mm x Length 250mm.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Dissolving solutes', 'Mixing reagents securely']
  },
  {
    id: 'JS34',
    category: 'science',
    name: 'Stoppers Assorted Rubber',
    specification: 'Pack of high quality solid and pre-drilled rubber stoppers. Contains 10x 0-hole, 10x 1-hole, and 10x 2-hole patterns.',
    unit: 'Each',
    qtyPerSite: 1,
    suitableGrades: ['Basic 8', 'Basic 9'],
    suggestedPracticals: ['Sealing volatile flasks', 'Collecting gas delivery outputs']
  },
  {
    id: 'JS35',
    category: 'science',
    name: 'Stopwatch Digital',
    specification: 'Quartz electronics timer. Displays hours, minutes, seconds, date, calendar days. Accuracy 1/100th second, built-in lap memory and alarm.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Aqueous reaction rate checks', 'Speed of sound calculations', 'Period of a pendulum']
  },
  {
    id: 'JS36',
    category: 'science',
    name: 'Syringes re-useable 10ml',
    specification: 'Classroom-safe sterilized plastic syringe with graduated scale and generic Luer slip tip.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Measuring small volumes', 'Gas pressure experiments']
  },
  {
    id: 'JS40',
    category: 'science',
    name: 'Test-tube Holder Block',
    specification: 'Nickel plated spring-loaded steel wire clamp featuring finger grips and sliding wire sleeve for tightening around tubes. Length 16cm.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Holding hot test tubes', 'Handling reactive chemical experiments']
  },
  {
    id: 'JS41',
    category: 'science',
    name: 'Test-tube Rack (Aluminium)',
    specification: '3-tier anodized Z-shape aluminium sheet structure. Fits 5 holes of 23mm dia, 6 holes of 20mm dia, 8 holes of 13mm dia. Total length 200mm.',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Holding active test series', 'Organizing lab group equipment']
  },
  {
    id: 'JS43',
    category: 'science',
    name: 'Test-tubes 24x150mm Glass',
    specification: 'Borosilicate glass 3.3. Heavy walled, heat impact and corrosion resistant. Graduated. Vol 50ml, size 150x24mm.',
    unit: 'Each',
    qtyPerSite: 50,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Heating substances under flame', 'Boiling liquids tests']
  },
  {
    id: 'JS44',
    category: 'science',
    name: 'Thermometer Red/Blue Spirit',
    specification: 'Yellow protective enamel back, reinforced bulb filled with red/blue organic liquid spirit. Range: -10 to 110oC, Graduation 1oC. Length 305mm.',
    unit: 'Each',
    qtyPerSite: 12,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Monitoring temperature during phase change', 'Measuring climate temperatures']
  },
  {
    id: 'JS45',
    category: 'science',
    name: 'Tongs (Blackened Steel)',
    specification: 'General purpose labor clamp tongues. Corrugated inner jaws with double bow. Solid high durability construction. Length 20cm.',
    unit: 'Each',
    qtyPerSite: 5,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Retrieving hot dishes', 'Placing magnesium inside flame']
  },
  {
    id: 'JS48',
    category: 'science',
    name: 'White Tile Spotted Spot-Plate',
    specification: '12-well micro reaction spot plate. Made of highly chemical resistant high-density polyethylene (HDPE). Size: 4.5" X 3.5".',
    unit: 'Each',
    qtyPerSite: 10,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Acid-base spot color indicators', 'Fungi/mushrooms micro studies']
  },

  // CHEMICALS items
  {
    id: 'JC1',
    category: 'chemical',
    name: 'Aluminium Foil Roll',
    specification: 'Aviation-grade robust shielding foil. 30cm wide x 75 meters long. Excellent for thermal and electrical insulation experiments.',
    unit: 'Large Roll',
    qtyPerSite: 1,
    suitableGrades: ['Basic 8', 'Basic 9'],
    suggestedPracticals: ['Conductive shields', 'Heat reflection experiments']
  },
  {
    id: 'JC2',
    category: 'chemical',
    name: 'Benedict\'s Solution (Qualitative)',
    specification: 'Ready-to-use qualitative reagent. Formulated for detecting reducing sugars. Storage precautions: EUH031, P273.',
    unit: '500ml',
    qtyPerSite: 1,
    suitableGrades: ['Basic 8', 'Basic 9'],
    suggestedPracticals: ['Testing for glucose in local fruits/foods']
  },
  {
    id: 'JC3',
    category: 'chemical',
    name: 'Calcium Chloride (Anhydrous)',
    specification: 'Pure chemical desiccant pearls. Formula: CaCl2, ultra-fine white anhydrous granules. Assay minimum > 95%.',
    unit: '500g',
    qtyPerSite: 1,
    suitableGrades: ['Basic 9'],
    suggestedPracticals: ['Dehumidifying gases', 'Exothermic dissolving labs']
  },
  {
    id: 'JC4',
    category: 'chemical',
    name: 'Calcium Hydroxide (Lime)',
    specification: 'Dry white powder chemical compound. Formula: Ca(OH)2. Purified lab-grade powder. Assay minimum > 95%. Used for limewater preparation.',
    unit: '250g',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Testing for carbon dioxide gas (milky color change)', 'Neutralizing soil acidity']
  },
  {
    id: 'JC6',
    category: 'chemical',
    name: 'Copper Sulphate Pentahydrate',
    specification: 'Highly purified deep blue crystal salt. Formula: CuSO4.5H2O. Analytical grade. Assay minimum > 99%.',
    unit: '500g',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Testing for moisture (anhydrous white to blue)', 'Electrolysis solutions', 'Growing crystals JHS project']
  },
  {
    id: 'JC7',
    category: 'chemical',
    name: 'Hydrochloric Acid (1 Molar)',
    specification: 'Standard clear molar solution. Formula: HCl. Concentration calibrated at 36.46g/L. Packed in thick chemical safety glass.',
    unit: '2.5L',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Acid-metal hydrogen gas production', 'Acid-base indicators checking']
  },
  {
    id: 'JC8',
    category: 'chemical',
    name: 'Iodine Solution (1% KI)',
    specification: 'Analytical grade standard iodine solution formulated with 1% potassium iodide stabilizers. For organic nutrient tests.',
    unit: '500ml',
    qtyPerSite: 1,
    suitableGrades: ['Basic 8'],
    suggestedPracticals: ['Testing for starch in bread/yam/cassava', 'Cell staining biology labs']
  },
  {
    id: 'JC9',
    category: 'chemical',
    name: 'Magnesium Ribbon GLR',
    specification: 'Highly pure ductile Magnesium metal tape. Width 5mm, thickness 0.2mm. Highly purified. Assay minimum > 99%.',
    unit: '25g',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Combustion to form magnesium oxide (bright white light)', 'Reacting metals with acids']
  },
  {
    id: 'JC11',
    category: 'chemical',
    name: 'Sodium Hydrogen Carbonate (Baking Soda)',
    specification: 'Fine white analytical salt powder. Formula: NaHCO3. Pure grade. Assay minimum > 99.5%. Cool store requirement.',
    unit: '1KG',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Thermal decomposition gas checks', 'Chemical volcano demonstrations']
  },
  {
    id: 'JC12',
    category: 'chemical',
    name: 'Sodium Hydroxide (NaOH Pearl)',
    specification: 'Anhydrous caustic pearls. Formula: NaOH. Deliquescent pellets. Highly reactive base. Assay minimum > 99%. Strong safety warnings apply.',
    unit: '1KG',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Saponification (making soup/soap)', 'pH changes evaluations']
  },
  {
    id: 'JC13',
    category: 'chemical',
    name: 'Universal Indicator Solution pH4 - 11',
    specification: 'Wide-spectrum acid-base color indicators inside dropper bottle. Includes high-clarity color conversion scale chart.',
    unit: '250ml',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Measuring exact pH spectrum of liquid solutions', 'Demonstrating neutralizations']
  },

  // MATHEMATICS items
  {
    id: 'JM2',
    category: 'math',
    name: '360 Degree Protractor',
    specification: 'Heavy duty transparent plastic disc. Fitted with central rotating radial arm with alignment pointer. Compact storage case.',
    unit: 'Each',
    qtyPerSite: 45,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Measuring bearings and angles', 'Drawing pie charts', 'Studying cyclic geometry']
  },
  {
    id: 'JM3',
    category: 'math',
    name: 'Scientific Classroom Calculator',
    specification: 'Solar assisted 4-function layout, includes square roots, basic memories, percentage indices. Pack of 45 individually boxed.',
    unit: 'Each',
    qtyPerSite: 45,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Classroom statistical calculations', 'Index computation checks']
  },
  {
    id: 'JM5',
    category: 'math',
    name: 'Multi-Sided Dice (4,8,10,12,20 sides)',
    specification: 'Full kit of polyhedral probability gaming dice. Moulded in 5 premium distinct colors. Packed in grip seal transparent boxes.',
    unit: 'Pack of 5',
    qtyPerSite: 15,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Probability distributions', 'Statistical fair-game trial testing']
  },
  {
    id: 'JM9',
    category: 'math',
    name: 'GeoBoards (12x12) & Rubber Bands',
    specification: 'Robust heavy-duty double sided plastic boards. Molded grid pegs for stretching colored elastic bands. Elastic bands index pack.',
    unit: 'Each',
    qtyPerSite: 9,
    suitableGrades: ['Basic 7', 'Basic 8'],
    suggestedPracticals: ['Measuring perimeter and area of polygons', 'Studying coordinate systems']
  },
  {
    id: 'JM10',
    category: 'math',
    name: 'Geometric Solids Set (19 Pieces)',
    specification: 'Handmade solid mahogany hardwood structures. Includes cuboids, triangular pyramids, hexagonal prisms, cylinders, spheres, cones.',
    unit: 'Set',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Volume and surface area calculations', 'Identifying vertices, edges, and faces']
  },
  {
    id: 'JM11',
    category: 'math',
    name: 'Geometry Builder Kit (Platonic)',
    specification: 'Clip-together polydron framework grids, containing 12 pentagons and 6 geometric squares. Assorted high contrast colors.',
    unit: 'Pack',
    qtyPerSite: 9,
    suitableGrades: ['Basic 9'],
    suggestedPracticals: ['Assembling 3D Platonic solids', 'Understanding regular polyhedrons']
  },

  // ICT/TECHNOLOGY items
  {
    id: 'ICT1',
    category: 'ict',
    name: 'High-Bright projector',
    specification: '3200 ANSI Lumens, 1080p output, dual HDMI/VGA connections. Heat venting fans. Comes with ceiling mounts/mains cables.',
    unit: 'Each',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Displaying block programming IDEs', 'Interactive multimedia training']
  },
  {
    id: 'ICT2',
    category: 'ict',
    name: 'TeachSmart Chromebook/Laptop',
    specification: 'HP 250 G6 Pro Intel Core i5 processor, 4GB RAM, 500GB HDD, DVD player. Combined with high volume external multimedia speakers (3W).',
    unit: 'Each',
    qtyPerSite: 1,
    suitableGrades: ['Basic 7', 'Basic 8', 'Basic 9'],
    suggestedPracticals: ['Developing programming worksheets', 'Running simulation software']
  },
  {
    id: 'ICT5',
    category: 'ict',
    name: 'BSTEM Robotics Kit (Set of 5)',
    specification: 'Curriculum-aligned robotic educational framework. Supports block programming logic.',
    unit: 'Set',
    qtyPerSite: 1,
    suitableGrades: ['Basic 8', 'Basic 9'],
    suggestedPracticals: ['Programming line follower pathways', 'Avoid obstacle robot circuits', 'Coding basic motor loops'],
    kitBreakdown: [
      { name: "SMR educational robot core chassis", qty: 5 },
      { name: "Me RJ25 modular connectors", qty: 1 },
      { name: "Add-on Light & Sound modules", qty: 1 },
      { name: "Add-on Servo motor packages", qty: 1 },
      { name: "6P6C RJ25 wires - 20cm", qty: 1 },
      { name: "6P6C RJ25 wires - 35cm", qty: 1 },
      { name: "6P6C RJ25 wires - 50cm", qty: 1 },
      { name: "Add-on Six-legged robot mechanical legs", qty: 1 },
      { name: "High precision Ultrasonic distance sensor", qty: 1 },
      { name: "Infrared line tracker modules", qty: 1 }
    ]
  },
  {
    id: 'ICT6',
    category: 'ict',
    name: 'Datalogger & Microcontroller Kit',
    specification: 'Programmable electronic circuit kit for compiling and collecting physical sensor telemetry data.',
    unit: 'Set',
    qtyPerSite: 1,
    suitableGrades: ['Basic 8', 'Basic 9'],
    suggestedPracticals: ['Recording water heat curves', 'Flickering custom LED matrix emojis', 'Creating alarm triggers'],
    kitBreakdown: [
      { name: "Waterproof telemetry probe thermometer", qty: 3 },
      { name: "PIR motion sensor boards", qty: 1 },
      { name: "Fitted 8x16 programmable LED matrix boards", qty: 1 },
      { name: "7-Segment micro serial digits display", qty: 2 },
      { name: "Microprocessor main compiler board", qty: 1 },
      { name: "USB firmware data cables", qty: 1 }
    ]
  }
];

export default function BstemLabGuide() {
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'science' | 'chemical' | 'math' | 'ict'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedKitId, setExpandedKitId] = useState<string | null>(null);

  // Lab Builder/Planner cart state
  const [labCart, setLabCart] = useState<{ item: BstemEquipment; countNeeded: number }[]>([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [studentCount, setStudentCount] = useState<number>(40);
  const [groupSize, setGroupSize] = useState<number>(5);
  const [labTopic, setLabTopic] = useState('');
  const [selectedTargetGrade, setSelectedTargetGrade] = useState('Basic 7');

  // Calculates groups
  const totalGroups = Math.max(1, Math.ceil(studentCount / Math.max(1, groupSize)));

  // Filter items
  const filteredItems = BSTEM_DATA.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.specification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle Item in Lab Planner
  const toggleCartItem = (item: BstemEquipment) => {
    const exists = labCart.find(c => c.item.id === item.id);
    if (exists) {
      setLabCart(prev => prev.filter(c => c.item.id !== item.id));
      toast.success(`${item.name} removed from lab list.`);
    } else {
      // By default, assume 1 unit needed per student group
      setLabCart(prev => [...prev, { item, countNeeded: 1 }]);
      toast.success(`${item.name} added to lab checklist.`);
    }
  };

  // Adjust count factor ('group' mode or 'each' mode - represented by simple scaling multipliers)
  const updateCartItemNeedCount = (itemId: string, val: number) => {
    setLabCart(prev => prev.map(c => c.item.id === itemId ? { ...c, countNeeded: Math.max(1, val) } : c));
  };

  const removeAllFromCart = () => {
    setLabCart([]);
    toast.success("Lab prep checklist cleared.");
  };

  // Export to PDF
  const handleExportPDF = () => {
    if (labCart.length === 0) {
      toast.error("Please add some equipment to your checklist first!");
      return;
    }

    const doc = new jsPDF();
    const ghsGold = [218, 165, 32];
    const deepNavy = [15, 23, 42];

    // Document header
    doc.setFillColor(15, 23, 42); // deepNavy
    doc.rect(0, 0, 210, 45, 'F');

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("TeachSmartGH Lab Preparation Sheet", 14, 18);

    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(218, 165, 32); // gold
    doc.text("ALIGNED WITH NaCCA JHS BSTEM STANDARDS • CATALYST CREATIVE", 14, 25);

    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text(`Generated for: ${profile?.displayName || 'Ghana Educator'} • School: ${profile?.school || 'GES Institution'}`, 14, 32);
    doc.text(`Date of Prep: ${new Date().toLocaleDateString('en-GB')} • Local District: ${profile?.district || 'Generic District'}`, 14, 38);

    // Section 1: Parameters Info Box
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 50, 182, 32, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, 50, 182, 32);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("1. LESSON / PRACTICAL INFORMATION", 18, 56);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(`Practical Topic: ${labTopic || 'Hands-on Scientific Inquiry Lab'}`, 18, 63);
    doc.text(`Target Grade: ${selectedTargetGrade} • Total Class Enrollment: ${studentCount} Students`, 18, 69);
    doc.text(`Active Collaborative Groups: ${totalGroups} Groups (Sized at approx ${groupSize} students per workstation)`, 18, 75);

    // Section 2: Equipment Table
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("2. DESIGNATED LAB EQUIPMENT & ALLOCATIONS", 14, 90);

    const tableData = labCart.map((c, i) => {
      // Calculate total required
      const totalRequired = c.countNeeded * totalGroups;
      const alloc = typeof c.item.qtyPerSite === 'number' ? c.item.qtyPerSite : 0;
      const isAdequate = alloc === 0 || alloc >= totalRequired;

      return [
        c.item.id,
        c.item.name,
        c.item.unit,
        `${c.countNeeded} / Group`,
        totalRequired,
        alloc > 0 ? alloc : 'N/A',
        isAdequate ? '✅ Available' : '⚠ Shortage (Source local TLR)'
      ];
    });

    autoTable(doc, {
      startY: 95,
      head: [['ID', 'Material Name', 'Unit', 'Need Per Group', 'Total Needed', 'Site Qty', 'Status']],
      body: tableData,
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8.5 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 }
    });

    // Notes area at page bottom
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    const finalY = (doc as any).lastAutoTable.finalY + 12;
    doc.text("3. MANDATORY CLASSROOM SAFETY PROCEDURES (NaCCA aligned):", 14, finalY);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    const safetyGuidelines = [
      "• All JHS student groups must be equipped with Junior Safety Goggles (JS28) before handling any reagents or heating equipment.",
      "• If handling 1 Molar Hydrochloric Acid (JC7) or Sodium Hydroxide (JC12), teachers must conduct a mandatory safe-glove handling demo.",
      "• Electrical and electronic breadboard circuits must use low-voltage cells (max 9V) to avoid damage or shock potentials.",
      "• Return all multi-piece kits, including magnetic kits (JS18) and mathematics solid geometry blocks (JM10), carefully counted to boxes."
    ];
    let offset = 6;
    safetyGuidelines.forEach(line => {
      doc.text(line, 14, finalY + offset);
      offset += 5.5;
    });

    // Save document
    doc.save(`TeachSmartGH_BSTEM_Lab_Prep_${labTopic.replace(/\s+/g, '_') || 'Inquiry'}.pdf`);
    toast.success("GES Lab Prep Sheet exported successfully to PDF!");
  };

  return (
    <div className="space-y-10">
      {/* Decorative Brand Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-8 lg:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-60 h-60 bg-ghana-gold/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                <Atom className="animate-spin text-emerald-500" size={13} />
                NaCCA Ghana Verified
              </span>
              <span className="px-3 py-1 bg-ghana-gold/20 text-emerald-950 dark:text-ghana-gold text-[10px] font-black rounded-lg uppercase tracking-wider">
                BSTEM Standard
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white leading-none">
              JHS Basic STEM Lab & Equipment Guide
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Fully browse, filter, and plan classroom operations using the official list of science kits, chemical reagents, geometry modules, and robotics structures distributed under the national Junior High School BSTEM initiative.
            </p>
          </div>

          <button
            onClick={() => setIsBuilderOpen(!isBuilderOpen)}
            className="flex items-center gap-2 px-6 py-4 bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/10 transition-all active:scale-95 text-center shrink-0 w-full md:w-auto justify-center"
          >
            <Calculator size={16} className={cn("transition-transform duration-300", isBuilderOpen && "rotate-45")} />
            <span>{isBuilderOpen ? "Hide Lab Planner" : "Open Interactive Lab Planner"}</span>
            {labCart.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-ghana-gold text-emerald-950 text-[9px] font-black rounded-full">
                {labCart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Interactive GES Lab Builder Workspace */}
      <AnimatePresence>
        {isBuilderOpen && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white border border-slate-800 rounded-[3rem] p-8 lg:p-10 shadow-lg space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Calculator className="text-ghana-gold" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight">Interactive GES Lab Prep Calculator</h2>
                    <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-black">Plan required group quantities and detect logistical gaps</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={removeAllFromCart}
                    disabled={labCart.length === 0}
                    className="px-4 py-2 bg-white/5 hover:bg-red-500/25 border border-white/10 disabled:opacity-40 transition-all rounded-xl text-[9px] font-black uppercase tracking-widest"
                  >
                    Clear Checklist
                  </button>
                </div>
              </div>

              {/* Input details row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
                    Practical Experiment Topic
                  </label>
                  <input
                    type="text"
                    value={labTopic}
                    onChange={(e) => setLabTopic(e.target.value)}
                    placeholder="e.g. Acid-Base Neutralization"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-emerald-400 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
                    Target Grade / Level
                  </label>
                  <select
                    value={selectedTargetGrade}
                    onChange={(e) => setSelectedTargetGrade(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-emerald-400 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="Basic 7" className="bg-slate-900">Basic 7 JHS</option>
                    <option value="Basic 8" className="bg-slate-900">Basic 8 JHS</option>
                    <option value="Basic 9" className="bg-slate-900">Basic 9 JHS</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
                    Total Students Enrolled
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={studentCount}
                      onChange={(e) => setStudentCount(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-emerald-400 rounded-xl text-xs text-white focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-white/40 font-black">STUDENTS</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
                    Students Per Group/Station
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={groupSize}
                      onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-emerald-400 rounded-xl text-xs text-white focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-white/40 font-black">MEMBERS</span>
                  </div>
                </div>
              </div>

              {/* Computed groups visualizer */}
              <div className="p-4 bg-white/5 border border-white/15 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Info className="text-ghana-gold" size={16} />
                  <span>
                    Your class calculations: **{studentCount} students** split into **{groupSize} members** yields exactly <strong className="text-ghana-gold">{totalGroups} classroom groups / active workbenches</strong>.
                  </span>
                </div>
              </div>

              {/* Table of selected lab items */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Materials Allocation Worksheet ({labCart.length} item{labCart.length === 1 ? '' : 's'} added)</p>

                {labCart.length === 0 ? (
                  <div className="py-12 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center space-y-3">
                    <Info size={32} className="mx-auto text-white/20 animate-bounce" />
                    <p className="text-xs text-white/50 font-bold">Your Lab Planner Worksheet is currently empty.</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Scroll down to the equipment guide repository below and click **Add to Lab Checklist** on any item.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/10 text-emerald-300 text-[10px] font-black uppercase tracking-widest pb-2">
                          <th className="py-3 px-3">Item ID</th>
                          <th className="py-3 px-3">Material Name</th>
                          <th className="py-3 px-3">Unit</th>
                          <th className="py-3 px-3">Need Per Group</th>
                          <th className="py-3 px-3 text-center">Total Quantity Needed</th>
                          <th className="py-3 px-3 text-center">Standard JHS Site Qty</th>
                          <th className="py-3 px-3 text-center">In Stock Status</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {labCart.map(({ item, countNeeded }) => {
                          const totalNeeded = countNeeded * totalGroups;
                          const standardStock = typeof item.qtyPerSite === 'number' ? item.qtyPerSite : 0;
                          const hasDeficit = standardStock > 0 && standardStock < totalNeeded;

                          return (
                            <tr key={item.id} className="hover:bg-white/5 group transition-colors">
                              <td className="py-4 px-3 font-mono font-black text-ghana-gold">{item.id}</td>
                              <td className="py-4 px-3">
                                <div className="font-bold">{item.name}</div>
                                <div className="text-[9px] text-white/40 truncate max-w-xs">{item.specification}</div>
                              </td>
                              <td className="py-4 px-3 font-medium text-white/60">{item.unit}</td>
                              <td className="py-4 px-3">
                                <div className="flex items-center gap-1.5 w-24">
                                  <input
                                    type="number"
                                    value={countNeeded}
                                    onChange={(e) => updateCartItemNeedCount(item.id, parseInt(e.target.value) || 0)}
                                    className="w-12 px-2 py-1 bg-white/10 rounded-lg text-center font-bold focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                  />
                                  <span className="text-[9px] text-white/40 uppercase">/grp</span>
                                </div>
                              </td>
                              <td className="py-4 px-3 text-center font-black">
                                {totalNeeded} <span className="text-[10px] font-normal text-white/40">{item.unit}</span>
                              </td>
                              <td className="py-4 px-3 text-center text-white/60 font-black">
                                {item.qtyPerSite}
                              </td>
                              <td className="py-4 px-3 text-center">
                                {standardStock === 0 ? (
                                  <span className="px-2.5 py-1 bg-white/10 text-white/70 text-[9px] font-black rounded-lg uppercase">Variable</span>
                                ) : hasDeficit ? (
                                  <span className="px-2.5 py-1 bg-red-500/20 text-red-300 text-[9px] font-black rounded-lg uppercase flex items-center justify-center gap-1">
                                    <ShieldAlert size={10} />
                                    Deficit ({totalNeeded - standardStock})
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-emerald-500/25 text-emerald-300 text-[9px] font-black rounded-lg uppercase">Adequate</span>
                                )}
                              </td>
                              <td className="py-4 px-3 text-right">
                                <button
                                  onClick={() => toggleCartItem(item)}
                                  className="p-2 bg-white/5 group-hover:bg-red-500/10 text-white/60 hover:text-red-400 rounded-xl transition-all"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* PDF & Download Buttons */}
              {labCart.length > 0 && (
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Info size={14} className="text-ghana-gold" />
                    <span>Always ensure items with "Deficit" are sourced using local substitute teaching materials (TLRs).</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-ghana-gold text-emerald-950 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-yellow-500 active:scale-95 transition-all w-full sm:w-auto"
                    >
                      <Download size={14} />
                      <span>Export GES Lab PDF Checklist</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Categories filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              selectedCategory === 'all'
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                : "bg-white dark:bg-slate-900 text-slate-500 hover:text-emerald-deep border border-slate-100 dark:border-slate-800"
            )}
          >
            All Equipment
          </button>
          
          <button
            onClick={() => setSelectedCategory('science')}
            className={cn(
              "px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              selectedCategory === 'science'
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                : "bg-white dark:bg-slate-900 text-slate-500 hover:text-emerald-deep border border-slate-100 dark:border-slate-800"
            )}
          >
            🔬 Science & Labs (JS)
          </button>

          <button
            onClick={() => setSelectedCategory('chemical')}
            className={cn(
              "px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              selectedCategory === 'chemical'
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                : "bg-white dark:bg-slate-900 text-slate-500 hover:text-emerald-deep border border-slate-100 dark:border-slate-800"
            )}
          >
            🧪 Chemicals (JC)
          </button>

          <button
            onClick={() => setSelectedCategory('math')}
            className={cn(
              "px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              selectedCategory === 'math'
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                : "bg-white dark:bg-slate-900 text-slate-500 hover:text-emerald-deep border border-slate-100 dark:border-slate-800"
            )}
          >
            📐 Mathematics (JM)
          </button>

          <button
            onClick={() => setSelectedCategory('ict')}
            className={cn(
              "px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              selectedCategory === 'ict'
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                : "bg-white dark:bg-slate-900 text-slate-500 hover:text-emerald-deep border border-slate-100 dark:border-slate-800"
            )}
          >
            🤖 Computing & Robotics (ICT)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specs, item codes..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:border-emerald-500 focus:outline-none text-xs text-slate-800 dark:text-white rounded-2xl placeholder-slate-400"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        </div>
      </div>

      {/* Main Grid View of BSTEM Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map(item => {
          const isExpanded = expandedKitId === item.id;
          const isAddedToCart = labCart.some(c => c.item.id === item.id);

          return (
            <motion.div
              key={item.id}
              layout
              className={cn(
                "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden group",
                isAddedToCart && "ring-2 ring-emerald-500 dark:ring-emerald-400"
              )}
            >
              <div className="space-y-4">
                {/* Header bar of card */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 bg-slate-900 dark:bg-slate-800 text-ghana-gold text-xs font-black rounded-xl font-mono">
                    {item.id}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Category: {item.category.toUpperCase()}
                  </span>
                </div>

                {/* Name */}
                <div className="space-y-11">
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-950 dark:group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </h3>
                </div>

                {/* specifications */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {item.specification}
                </p>

                {/* Quantitative Details Pills */}
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100/50 dark:border-slate-800/10">
                    <span className="block text-[8px] font-black uppercase text-slate-400">Inventory Unit</span>
                    <strong className="text-slate-700 dark:text-slate-300">{item.unit}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100/50 dark:border-slate-800/10">
                    <span className="block text-[8px] font-black uppercase text-slate-400">Qty Provided Per Site</span>
                    <strong className="text-slate-700 dark:text-slate-300">{item.qtyPerSite}</strong>
                  </div>
                </div>

                {/* Suggested practicals */}
                {item.suggestedPracticals && item.suggestedPracticals.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Compass size={11} />
                      Suggested Experiments
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.suggestedPracticals.map((pract, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[9px] font-black rounded-md">
                          {pract}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Kit Breakdown Expanding Drawer (e.g. for electricity/electronics kits) */}
                {item.kitBreakdown && (
                  <div className="pt-2">
                    <button
                      onClick={() => setExpandedKitId(isExpanded ? null : item.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? "Hide Kit Components" : "View Package Contents Breakdown"}</span>
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-2.5 max-h-60 overflow-y-auto"
                        >
                          <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Allocated Kit Quantities</div>
                          <div className="grid grid-cols-1 gap-1">
                            {item.kitBreakdown.map((comp, cIdx) => (
                              <div key={cIdx} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100/40 dark:border-slate-800/20 last:border-0">
                                <span className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                  <CornerDownRight size={10} className="text-slate-400" />
                                  {comp.name}
                                </span>
                                <span className="font-black text-slate-900 dark:text-white">x{comp.qty}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Lab Planning Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <span className="text-[9px] font-bold text-slate-400">Suitable: {item.suitableGrades?.join(', ')}</span>

                <button
                  type="button"
                  onClick={() => toggleCartItem(item)}
                  className={cn(
                    "px-4.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                    isAddedToCart 
                      ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 hover:bg-red-100" 
                      : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 hover:bg-emerald-100"
                  )}
                >
                  {isAddedToCart ? "Remove from List" : "Add to Lab Checklist"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
