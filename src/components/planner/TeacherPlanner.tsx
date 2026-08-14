import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, CheckSquare, Plus, Trash2, Printer, AlertCircle, RefreshCw, Star, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string; // 'exam', 'lesson', 'meeting'
}

export default function TeacherPlanner() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Grade Kwame Mensah\'s math test', completed: false },
    { id: '2', text: 'Prepare starter activity materials for Basic 7 Science', completed: true },
    { id: '3', text: 'Submit parent circular memo draft to principal', completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'PTA General Meeting', date: '2026-10-15', time: '14:00', type: 'meeting' },
    { id: '2', title: 'Basic 7 Science Exam', date: '2026-10-18', time: '09:00', type: 'exam' }
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventType, setNewEventType] = useState('lesson');

  // Task Handlers
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText('');
    toast.success('Task added!');
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success('Task deleted.');
  };

  // Event Handlers
  const handleAddEvent = () => {
    if (!newEventTitle.trim() || !newEventDate || !newEventTime) {
      toast.error('Please fill in all event fields.');
      return;
    }
    const newEv: CalendarEvent = {
      id: Date.now().toString(),
      title: newEventTitle.trim(),
      date: newEventDate,
      time: newEventTime,
      type: newEventType
    };
    setEvents([...events, newEv]);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    toast.success('Event scheduled in planner!');
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success('Event cancelled.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="px-2.5 py-1 bg-ghana-gold/20 text-emerald-950 text-[10px] font-black rounded-lg uppercase tracking-wider inline-block">
            Professional Workspace
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Teacher Planner & Timetable</h1>
          <p className="text-slate-500 text-sm mt-1">Organize your daily lessons, schedule tests/examinations, and manage your teaching checklists.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Task Checklist */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <CheckSquare size={18} className="text-ghana-gold" />
            Task Checklist
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add new chore (e.g. Grade papers)..."
              className="flex-1 bg-slate-50 border border-slate-150 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <button
              onClick={handleAddTask}
              className="p-2.5 bg-slate-900 text-white hover:bg-black rounded-xl transition-all"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {task.text}
                  </span>
                </div>

                <button
                  onClick={() => handleRemoveTask(task.id)}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Timetable / Event Scheduler */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <CalendarIcon size={18} className="text-ghana-gold" />
            Scheduled Timetable
          </h2>

          {/* Quick add event form */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Event/Lesson Title</label>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="e.g. B7 Mathematics Trial"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Date</label>
              <input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Time</label>
              <input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div className="col-span-1 sm:col-span-2 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {['lesson', 'exam', 'meeting'].map(type => (
                  <button
                    key={type}
                    onClick={() => setNewEventType(type)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                      newEventType === type 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAddEvent}
                className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all"
              >
                <Plus size={14} />
                Schedule
              </button>
            </div>
          </div>

          {/* List of scheduled events */}
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${
                    event.type === 'exam' ? 'bg-red-50 text-red-600' :
                    event.type === 'meeting' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {event.type === 'exam' ? <Star size={16} /> : <Clock size={16} />}
                  </div>

                  <div>
                    <h4 className="font-black text-xs text-slate-900">{event.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      {event.date} at {event.time} • <span className="uppercase">{event.type}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveEvent(event.id)}
                  className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
