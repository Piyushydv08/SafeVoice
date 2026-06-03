import React, { useState, useEffect } from 'react';
import { useSafety } from '../context/SafetyContext';
import { 
  CheckCircle, 
  Calendar as CalendarIcon, 
  CloudSun, 
  ListTodo, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  FileText, 
  Bell, 
  Search,
  ChevronRight
} from 'lucide-react';

export default function DisguiseView() {
  const { toggleDisguise } = useSafety();
  const [time, setTime] = useState(new Date());
  
  // Task list state
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: '1', text: 'Review quarterly financial presentation', completed: false },
    { id: '2', text: 'Finalize developer API documentation updates', completed: true },
    { id: '3', text: 'Confirm schedule for team sync call on Friday', completed: false },
    { id: '4', text: 'Draft email blast for product newsletter', completed: false }
  ]);
  const [newTask, setNewTask] = useState('');

  // Calendar state
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  // Note state
  const [note, setNote] = useState('Meeting notes - June 2026\n- Review product roadmap draft\n- Follow up on security compliance report\n- Confirm UX design milestones\n');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), text: newTask.trim(), completed: false }]);
    setNewTask('');
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-[#f8fafc] text-[#0f172a] font-sans overflow-y-auto flex flex-col md:flex-row h-screen"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar Camouflage */}
      <aside className="w-full md:w-64 bg-[#1e293b] text-slate-300 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-700">
            <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              T
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-wide">TaskFlow</span>
              <p className="text-[10px] text-slate-400">Workspace Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button type="button" className="w-full text-left px-4 py-2.5 rounded-lg bg-blue-600/10 text-blue-400 font-medium flex items-center gap-3 transition">
              <ListTodo className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button type="button" className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium flex items-center gap-3 transition">
              <CalendarIcon className="h-5 w-5" />
              <span>Calendar</span>
            </button>
            <button type="button" className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium flex items-center gap-3 transition">
              <FileText className="h-5 w-5" />
              <span>Documents</span>
            </button>
            <button type="button" className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium flex items-center gap-3 transition">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* User Info & Subtle Safe Exit Trigger */}
        <div className="p-4 border-t border-slate-700 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-600 rounded-full flex items-center justify-center font-semibold text-white">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-white">John Doe</p>
              <p className="text-xs text-slate-400">Project Manager</p>
            </div>
          </div>
          {/* Innocent logout button that toggles back to SafeVoice */}
          <button 
            type="button"
            onClick={toggleDisguise}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <LogOut className="h-4 w-4 text-slate-400" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Camouflage Content Area */}
      <main className="flex-1 bg-[#f1f5f9] p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-sm text-slate-500">Welcome back, John. Here is your productivity summary.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Clock Widget */}
            <div className="text-right">
              <span className="text-lg font-bold text-slate-800 block leading-tight">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <button type="button" className="p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tasks and Notes */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Task Manager Card */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-blue-500" />
                  Task Manager
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                  {tasks.filter(t => !t.completed).length} pending
                </span>
              </div>

              {/* Add Task Form */}
              <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Create a new task..."
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
                <button 
                  type="submit"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </form>

              {/* Tasks Checklist */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border border-slate-100 transition ${
                      task.completed ? 'bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1 select-none">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className={`text-sm ${task.completed ? 'line-through' : 'font-medium'}`}>
                        {task.text}
                      </span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Notes Card */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-amber-500" />
                Notepad
              </h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type temporary notes here..."
                rows={5}
                className="w-full p-4 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-700"
              />
            </section>
          </div>

          {/* Right Column: Weather and Calendar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Weather Widget */}
            <section className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold opacity-95">Weather</h3>
                  <p className="text-xl font-bold mt-1">Chicago, IL</p>
                </div>
                <CloudSun className="h-10 w-10 text-amber-300" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">21°C</span>
                <span className="text-sm opacity-90 font-medium">Partly Cloudy</span>
              </div>
              <div className="mt-6 border-t border-white/20 pt-4 flex justify-between text-xs opacity-90">
                <div className="text-center">
                  <p>Mon</p>
                  <p className="font-bold mt-1">20°</p>
                </div>
                <div className="text-center">
                  <p>Tue</p>
                  <p className="font-bold mt-1">22°</p>
                </div>
                <div className="text-center">
                  <p>Wed</p>
                  <p className="font-bold mt-1">19°</p>
                </div>
                <div className="text-center">
                  <p>Thu</p>
                  <p className="font-bold mt-1">21°</p>
                </div>
                <div className="text-center">
                  <p>Fri</p>
                  <p className="font-bold mt-1">23°</p>
                </div>
              </div>
            </section>

            {/* Calendar Widget */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-slate-800">June 2026</h2>
                <div className="flex gap-1">
                  <button type="button" className="p-1 hover:bg-slate-100 rounded text-slate-600 transition text-xs font-bold">&lt;</button>
                  <button type="button" className="p-1 hover:bg-slate-100 rounded text-slate-600 transition text-xs font-bold">&gt;</button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Empty offsets for starting day */}
                <span className="p-1 text-slate-300">31</span>
                {daysInMonth.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`p-1 rounded-full font-medium transition ${
                      selectedDay === day 
                        ? 'bg-blue-600 text-white font-bold' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer info link serving as another exit shortcut */}
        <footer className="mt-auto border-t border-slate-200 pt-5 text-center text-xs text-slate-400 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
          <span>&copy; 2026 TaskFlow Inc. All rights reserved.</span>
          <button 
            type="button" 
            onClick={toggleDisguise}
            className="text-slate-400 hover:text-slate-600 underline font-medium flex items-center gap-1"
          >
            <span>Support Portal View</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </footer>
      </main>
    </div>
  );
}
