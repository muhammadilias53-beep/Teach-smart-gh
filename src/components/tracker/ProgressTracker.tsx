import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, Clock, Activity, Calendar, ShieldCheck, Mail, Printer, AlertTriangle, TrendingUp, Filter, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProgressTracker() {
  const [selectedStudent, setSelectedStudent] = useState('Kwame Mensah');
  const [metricTab, setMetricTab] = useState<'attendance' | 'academic' | 'behaviour'>('academic');

  const studentsList = [
    { name: 'Kwame Mensah', id: '1', level: 'Basic 7', attendance: 92, behavior: 'Excellent', avgScore: 84 },
    { name: 'Ama Serwaa', id: '2', level: 'Basic 7', attendance: 98, behavior: 'Exceptional', avgScore: 91 },
    { name: 'Kofi Owusu', id: '3', level: 'Basic 7', attendance: 81, behavior: 'Needs Improvement', avgScore: 54 }
  ];

  // Dummy progression data over 4 terms or weeks
  const performanceHistory = [
    { week: 'Wk 1', Kwame: 75, Ama: 82, Kofi: 45 },
    { week: 'Wk 2', Kwame: 80, Ama: 85, Kofi: 50 },
    { week: 'Wk 3', Kwame: 82, Ama: 90, Kofi: 52 },
    { week: 'Wk 4', Kwame: 84, Ama: 91, Kofi: 54 }
  ];

  const currentStudent = studentsList.find(s => s.name === selectedStudent) || studentsList[0];

  const handleSendToParent = () => {
    toast.success(`Progress report card successfully prepared and scheduled to send to ${currentStudent.name}'s parent/guardian!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="px-2.5 py-1 bg-ghana-gold/20 text-emerald-950 text-[10px] font-black rounded-lg uppercase tracking-wider inline-block">
            Pedagogical Analytics
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Student Progress Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor classroom scores, record attendance, track student behaviour, and identify weak learning areas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Roster & Filter */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Users size={18} className="text-ghana-gold" />
            Class Roster
          </h2>

          <div className="space-y-3">
            {studentsList.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student.name)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  selectedStudent === student.name 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-950/10' 
                    : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <h4 className="font-black text-sm">{student.name}</h4>
                  <p className={`text-[10px] font-bold ${selectedStudent === student.name ? 'text-slate-400' : 'text-slate-400'}`}>{student.level}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                    student.avgScore >= 80 
                      ? (selectedStudent === student.name ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700')
                      : student.avgScore >= 50
                        ? (selectedStudent === student.name ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700')
                        : (selectedStudent === student.name ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700')
                  }`}>
                    {student.avgScore}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Analytical Pane */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Avg Score */}
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 text-slate-400 mb-3">
                <div className="p-2 bg-slate-50 text-slate-800 rounded-xl"><Award size={16} /></div>
                <span className="text-[10px] font-black uppercase tracking-wider">Average Grade</span>
              </div>
              <h3 className="text-2xl font-black text-slate-950">{currentStudent.avgScore}%</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">SBC Termly Ratio</p>
            </div>

            {/* Attendance */}
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 text-slate-400 mb-3">
                <div className="p-2 bg-slate-50 text-slate-800 rounded-xl"><Clock size={16} /></div>
                <span className="text-[10px] font-black uppercase tracking-wider">Attendance Rate</span>
              </div>
              <h3 className="text-2xl font-black text-slate-950">{currentStudent.attendance}%</h3>
              <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">Good Standing</p>
            </div>

            {/* Behaviour */}
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 text-slate-400 mb-3">
                <div className="p-2 bg-slate-50 text-slate-800 rounded-xl"><Activity size={16} /></div>
                <span className="text-[10px] font-black uppercase tracking-wider">Class Conduct</span>
              </div>
              <h3 className={`text-lg font-black truncate ${
                currentStudent.behavior === 'Needs Improvement' ? 'text-red-600' : 'text-slate-950'
              }`}>{currentStudent.behavior}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase">Teacher Remarked</p>
            </div>
          </div>

          {/* Graph Card */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">Performance History</h3>
                <p className="text-slate-400 text-xs font-medium">Progress curves across the current academic weeks</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-slate-900 rounded-full inline-block" />
                <span className="text-[10px] font-black text-slate-600 uppercase">{selectedStudent}</span>
              </div>
            </div>

            {/* Beautiful, responsive custom inline SVG Line Chart */}
            <div className="w-full h-48 bg-slate-50 rounded-2xl p-4 flex items-end relative border border-slate-100">
              <div className="absolute top-4 left-4 text-[9px] font-black text-slate-400 uppercase tracking-wider">Academic Grade Curve</div>
              
              <svg className="w-full h-full pt-6" viewBox="0 0 400 100" preserveAspectRatio="none">
                {/* Horizontal reference lines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" strokeWidth="1" />

                {/* SVG path mapping performance */}
                <path
                  d={`M 20 ${100 - (performanceHistory[0][selectedStudent === 'Kwame Mensah' ? 'Kwame' : selectedStudent === 'Ama Serwaa' ? 'Ama' : 'Kofi'] || 50)} 
                      L 120 ${100 - (performanceHistory[1][selectedStudent === 'Kwame Mensah' ? 'Kwame' : selectedStudent === 'Ama Serwaa' ? 'Ama' : 'Kofi'] || 50)} 
                      L 220 ${100 - (performanceHistory[2][selectedStudent === 'Kwame Mensah' ? 'Kwame' : selectedStudent === 'Ama Serwaa' ? 'Ama' : 'Kofi'] || 50)} 
                      L 320 ${100 - (performanceHistory[3][selectedStudent === 'Kwame Mensah' ? 'Kwame' : selectedStudent === 'Ama Serwaa' ? 'Ama' : 'Kofi'] || 50)}`}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data point circles */}
                {performanceHistory.map((pt, idx) => {
                  const score = pt[selectedStudent === 'Kwame Mensah' ? 'Kwame' : selectedStudent === 'Ama Serwaa' ? 'Ama' : 'Kofi'] || 50;
                  const x = 20 + idx * 100;
                  const y = 100 - score;
                  return (
                    <circle key={idx} cx={x} cy={y} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  );
                })}
              </svg>

              {/* Labels */}
              <div className="absolute bottom-2 left-0 right-0 px-4 flex justify-between text-[9px] font-bold text-slate-400">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <TrendingUp size={80} />
            </div>
            
            <div className="space-y-2 relative z-10">
              <h3 className="font-black text-lg">Send Progress Summary to Parent</h3>
              <p className="text-slate-400 text-xs max-w-md">Instantly compile Kwame's current attendance sheets, conduct charts, and academic progress into a highly encouraging PDF report card.</p>
            </div>

            <div className="flex gap-2 relative z-10">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <Printer size={14} />
                Print Cards
              </button>
              <button
                onClick={handleSendToParent}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
              >
                <Mail size={14} />
                Send Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
