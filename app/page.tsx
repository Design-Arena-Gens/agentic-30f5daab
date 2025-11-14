'use client';

import { useState, useEffect } from 'react';
import { Activity, Brain, Target, TrendingUp, Moon, Droplets, Dumbbell, CheckCircle2, Plus, X, Sparkles } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface HealthMetric {
  date: string;
  sleep: number;
  exercise: number;
  mood: number;
  hydration: number;
}

interface ProductivityMetric {
  date: string;
  tasksCompleted: number;
  focusHours: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'productivity' | 'health' | 'ai'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [todayHealth, setTodayHealth] = useState({ sleep: 7, exercise: 30, mood: 7, hydration: 6 });
  const [aiChat, setAiChat] = useState<{role: 'user' | 'ai', message: string}[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [focusHours, setFocusHours] = useState(0);

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedHealth = localStorage.getItem('todayHealth');
    const savedFocusHours = localStorage.getItem('focusHours');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHealth) setTodayHealth(JSON.parse(savedHealth));
    if (savedFocusHours) setFocusHours(parseFloat(savedFocusHours));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('todayHealth', JSON.stringify(todayHealth));
  }, [todayHealth]);

  useEffect(() => {
    localStorage.setItem('focusHours', focusHours.toString());
  }, [focusHours]);

  // Generate mock historical data
  const generateHistoricalData = () => {
    const healthData: HealthMetric[] = [];
    const productivityData: ProductivityMetric[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'MM/dd');
      healthData.push({
        date,
        sleep: Math.floor(Math.random() * 3) + 6,
        exercise: Math.floor(Math.random() * 40) + 20,
        mood: Math.floor(Math.random() * 4) + 6,
        hydration: Math.floor(Math.random() * 4) + 5,
      });
      productivityData.push({
        date,
        tasksCompleted: Math.floor(Math.random() * 8) + 3,
        focusHours: Math.floor(Math.random() * 4) + 3,
      });
    }

    return { healthData, productivityData };
  };

  const { healthData, productivityData } = generateHistoricalData();

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        createdAt: new Date()
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const sendAiMessage = () => {
    if (!aiInput.trim()) return;

    const userMessage = aiInput;
    setAiChat([...aiChat, { role: 'user', message: userMessage }]);
    setAiInput('');

    // Simulate AI response
    setTimeout(() => {
      const completedTasks = tasks.filter(t => t.completed).length;
      const totalTasks = tasks.length;
      const avgSleep = todayHealth.sleep;
      const avgMood = todayHealth.mood;

      let response = '';

      if (userMessage.toLowerCase().includes('productivity') || userMessage.toLowerCase().includes('task')) {
        response = `Based on your data, you've completed ${completedTasks} out of ${totalTasks} tasks today. ${
          completedTasks / totalTasks > 0.7
            ? "Excellent work! You're crushing your goals! 🎯"
            : "Consider breaking down larger tasks into smaller ones for better momentum. You've got this! 💪"
        }`;
      } else if (userMessage.toLowerCase().includes('health') || userMessage.toLowerCase().includes('sleep') || userMessage.toLowerCase().includes('exercise')) {
        response = `Your health metrics show ${avgSleep} hours of sleep. ${
          avgSleep >= 7
            ? "Great sleep! Keep it up! 😴"
            : "Try to get at least 7-8 hours tonight. Sleep is crucial for cognitive performance and recovery. 🌙"
        } ${
          todayHealth.exercise >= 30
            ? "You're hitting your exercise goals! 💪"
            : "Consider adding a 30-minute workout to boost energy and mood. 🏃"
        }`;
      } else if (userMessage.toLowerCase().includes('improve') || userMessage.toLowerCase().includes('better')) {
        response = `Here are personalized tips:\n\n1. 🎯 Break your day into focused 90-minute blocks\n2. 💧 Aim for 8 glasses of water daily\n3. 🌙 Maintain consistent sleep schedule (${avgSleep}h → 8h target)\n4. 📝 Review and plan your tasks each morning\n5. 🧘 Take 5-minute breaks between focus sessions`;
      } else if (userMessage.toLowerCase().includes('mood') || userMessage.toLowerCase().includes('feel')) {
        response = `Your mood is tracked at ${avgMood}/10. ${
          avgMood >= 7
            ? "You're feeling great! Keep up the positive momentum! ✨"
            : "Consider these mood boosters: morning sunlight, exercise, connecting with friends, or trying meditation. 🌟"
        }`;
      } else {
        response = `I'm here to help you optimize your productivity and health! Ask me about:\n\n• Your productivity patterns\n• Health metrics analysis\n• Personalized improvement tips\n• Daily goal strategies\n• Energy optimization\n\nWhat would you like to explore? 🚀`;
      }

      setAiChat(prev => [...prev, { role: 'ai', message: response }]);
    }, 800);
  };

  const tasksCompleted = tasks.filter(t => t.completed).length;
  const tasksPending = tasks.filter(t => !t.completed).length;

  const pieData = [
    { name: 'Completed', value: tasksCompleted, color: '#10b981' },
    { name: 'Pending', value: tasksPending, color: '#6366f1' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="text-purple-400" />
            Health & Productivity AI
          </h1>
          <p className="text-slate-300">Your intelligent companion for optimal performance</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'productivity', label: 'Productivity', icon: Target },
            { id: 'health', label: 'Health', icon: TrendingUp },
            { id: 'ai', label: 'AI Assistant', icon: Brain },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Tasks Today</h3>
                <CheckCircle2 className="text-purple-200" />
              </div>
              <p className="text-4xl font-bold">{tasksCompleted}/{tasks.length}</p>
              <p className="text-purple-200 mt-2">
                {tasks.length > 0 ? Math.round((tasksCompleted / tasks.length) * 100) : 0}% Complete
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Focus Hours</h3>
                <Target className="text-blue-200" />
              </div>
              <p className="text-4xl font-bold">{focusHours}h</p>
              <p className="text-blue-200 mt-2">Deep work time</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Sleep Quality</h3>
                <Moon className="text-green-200" />
              </div>
              <p className="text-4xl font-bold">{todayHealth.sleep}h</p>
              <p className="text-green-200 mt-2">
                {todayHealth.sleep >= 7 ? 'Excellent' : 'Needs improvement'}
              </p>
            </div>

            {/* Charts */}
            <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Productivity Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="tasksCompleted" stroke="#a855f7" strokeWidth={2} />
                  <Line type="monotone" dataKey="focusHours" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Task Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl md:col-span-2 lg:col-span-3">
              <h3 className="text-xl font-semibold mb-4">Health Metrics (7 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  />
                  <Bar dataKey="sleep" fill="#8b5cf6" />
                  <Bar dataKey="mood" fill="#10b981" />
                  <Bar dataKey="hydration" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Productivity Tab */}
        {activeTab === 'productivity' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Task Input */}
              <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="What do you want to accomplish?"
                    className="flex-1 bg-slate-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={addTask}
                    className="bg-purple-600 hover:bg-purple-700 rounded-lg px-6 py-3 font-medium transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Task List */}
              <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Today's Tasks</h3>
                <div className="space-y-2">
                  {tasks.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No tasks yet. Add one above!</p>
                  ) : (
                    tasks.map(task => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-slate-500 hover:border-purple-500'
                          }`}
                        >
                          {task.completed && <CheckCircle2 size={16} />}
                        </button>
                        <span className={`flex-1 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                          {task.text}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Focus Timer */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Focus Timer</h3>
                <div className="text-center">
                  <p className="text-5xl font-bold mb-4">{focusHours.toFixed(1)}h</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFocusHours(prev => prev + 0.5)}
                      className="flex-1 bg-white/20 hover:bg-white/30 rounded-lg py-2 transition-colors"
                    >
                      +30m
                    </button>
                    <button
                      onClick={() => setFocusHours(prev => Math.max(0, prev - 0.5))}
                      className="flex-1 bg-white/20 hover:bg-white/30 rounded-lg py-2 transition-colors"
                    >
                      -30m
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Tasks</span>
                    <span className="font-semibold">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Completed</span>
                    <span className="font-semibold text-green-400">{tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pending</span>
                    <span className="font-semibold text-yellow-400">{tasksPending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Completion Rate</span>
                    <span className="font-semibold text-purple-400">
                      {tasks.length > 0 ? Math.round((tasksCompleted / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Health Metrics Input */}
            <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Moon className="text-purple-400" />
                Sleep Hours
              </h3>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={todayHealth.sleep}
                onChange={(e) => setTodayHealth({ ...todayHealth, sleep: parseFloat(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-2xl font-bold mt-2">{todayHealth.sleep} hours</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Dumbbell className="text-green-400" />
                Exercise Minutes
              </h3>
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={todayHealth.exercise}
                onChange={(e) => setTodayHealth({ ...todayHealth, exercise: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-2xl font-bold mt-2">{todayHealth.exercise} minutes</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="text-blue-400" />
                Mood (1-10)
              </h3>
              <input
                type="range"
                min="1"
                max="10"
                value={todayHealth.mood}
                onChange={(e) => setTodayHealth({ ...todayHealth, mood: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-2xl font-bold mt-2">{todayHealth.mood}/10</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Droplets className="text-cyan-400" />
                Water Glasses
              </h3>
              <input
                type="range"
                min="0"
                max="12"
                value={todayHealth.hydration}
                onChange={(e) => setTodayHealth({ ...todayHealth, hydration: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-2xl font-bold mt-2">{todayHealth.hydration} glasses</p>
            </div>

            {/* Health Insights */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 shadow-xl md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Today's Health Score</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{Math.round((todayHealth.sleep / 8) * 100)}%</p>
                  <p className="text-green-100">Sleep</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{Math.round((todayHealth.exercise / 60) * 100)}%</p>
                  <p className="text-green-100">Exercise</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{todayHealth.mood * 10}%</p>
                  <p className="text-green-100">Mood</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{Math.round((todayHealth.hydration / 8) * 100)}%</p>
                  <p className="text-green-100">Hydration</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-500/30">
                <p className="text-2xl font-bold text-center">
                  Overall: {Math.round(((todayHealth.sleep / 8) + (todayHealth.exercise / 60) + (todayHealth.mood / 10) + (todayHealth.hydration / 8)) * 25)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant Tab */}
        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl h-[600px] flex flex-col">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Brain className="text-purple-400" />
                  AI Assistant
                </h3>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {aiChat.length === 0 ? (
                    <div className="text-center text-slate-400 py-12">
                      <Brain size={48} className="mx-auto mb-4 text-purple-400" />
                      <p className="text-lg mb-2">Hi! I'm your AI assistant 👋</p>
                      <p>Ask me anything about your productivity or health!</p>
                    </div>
                  ) : (
                    aiChat.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            msg.role === 'user'
                              ? 'bg-purple-600'
                              : 'bg-slate-700'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()}
                    placeholder="Ask about your productivity or health..."
                    className="flex-1 bg-slate-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={sendAiMessage}
                    className="bg-purple-600 hover:bg-purple-700 rounded-lg px-6 py-3 font-medium transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Quick Tips</h3>
                <ul className="space-y-3 text-purple-100">
                  <li>💡 Ask about productivity trends</li>
                  <li>🎯 Get personalized advice</li>
                  <li>📊 Analyze your metrics</li>
                  <li>🚀 Set better goals</li>
                  <li>🧠 Optimize your routine</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Suggested Questions</h3>
                <div className="space-y-2">
                  {[
                    "How's my productivity?",
                    "Analyze my health metrics",
                    "Give me improvement tips",
                    "How can I sleep better?",
                  ].map((question, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAiInput(question);
                        setTimeout(() => sendAiMessage(), 100);
                      }}
                      className="w-full text-left bg-slate-700/30 hover:bg-slate-700/50 rounded-lg p-3 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
