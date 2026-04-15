'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { submitPersonality } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const questions = [
  {
    id: 'social_pref',
    question: 'How do you prefer to spend your social time?',
    options: [
      { value: 'large_crowd', label: 'Big crowds & buzzing energy', icon: '🎉' },
      { value: 'small_group', label: 'Intimate circles & deep chats', icon: '☕' },
      { value: 'solo', label: 'Flying solo mostly', icon: '🎧' },
    ],
  },
  {
    id: 'environment',
    question: 'Where would you rather be right now?',
    options: [
      { value: 'outdoor', label: 'Out in nature or under the open sky', icon: '🌲' },
      { value: 'indoor', label: 'In a comfortable, curated indoor space', icon: '🏛️' },
      { value: 'both', label: 'A mix of both works for me', icon: '🌤️' },
    ],
  },
  {
    id: 'interests',
    question: 'What gets you excited? (Select all that apply)',
    multiSelect: true,
    options: [
      { value: 'tech', label: 'Tech & Startups', icon: '💻' },
      { value: 'music', label: 'Live Music & Festivals', icon: '🎸' },
      { value: 'art', label: 'Art Galleries & Design', icon: '🎨' },
      { value: 'sports', label: 'Sports & Fitness', icon: '🏃' },
      { value: 'networking', label: 'Networking & Biz', icon: '🤝' },
    ],
  },
  {
    id: 'energy',
    question: 'What\'s your ideal event pace?',
    options: [
      { value: 'high', label: 'High energy, fast-paced, non-stop', icon: '⚡' },
      { value: 'medium', label: 'Engaging but relaxed', icon: '🚶' },
      { value: 'low', label: 'Quiet, chill, and slow-paced', icon: '🧘' },
    ],
  },
  {
    id: 'schedule',
    question: 'When are you usually free?',
    options: [
      { value: 'weekday', label: 'Weekdays (evenings mostly)', icon: '📅' },
      { value: 'weekend', label: 'Weekends only', icon: '🎈' },
      { value: 'both', label: 'My schedule is flexible', icon: '🕒' },
    ],
  },
  {
    id: 'budget',
    question: 'How do you feel about paid events?',
    options: [
      { value: 'free', label: 'Free events only at the moment', icon: '🆓' },
      { value: 'paid', label: 'Happy to pay for great experiences', icon: '💳' },
      { value: 'any', label: 'Mix of both is fine', icon: '⚖️' },
    ],
  },
  {
    id: 'personality_type',
    question: 'Which word describes you better?',
    options: [
      { value: 'creative', label: 'Creative', icon: '✨' },
      { value: 'analytical', label: 'Analytical', icon: '🧠' },
      { value: 'balanced', label: 'A bit of both', icon: '⚖️' },
    ],
  },
  {
    id: 'goal',
    question: 'What is your primary goal when attending events?',
    options: [
      { value: 'learn', label: 'Learn something new', icon: '📚' },
      { value: 'network', label: 'Meet people & network', icon: '👥' },
      { value: 'compete', label: 'Compete or challenge myself', icon: '🏆' },
      { value: 'fun', label: 'Just have fun and relax', icon: '🌴' },
    ],
  },
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleSelect = (questionId, value, multiSelect) => {
    if (multiSelect) {
      const current = answers[questionId] || [];
      if (current.includes(value)) {
        setAnswers({ ...answers, [questionId]: current.filter((v) => v !== value) });
      } else {
        setAnswers({ ...answers, [questionId]: [...current, value] });
      }
    } else {
      setAnswers({ ...answers, [questionId]: value });
      // Auto advance for single select
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep((prev) => prev + 1);
        }
      }, 300);
    }
  };

  const isCurrentAnswered = () => {
    const q = questions[currentStep];
    const a = answers[q.id];
    if (q.multiSelect) return a && a.length > 0;
    return !!a;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      await submitPersonality(formattedAnswers);
      await refreshUser(); // Update user context with quiz completed
      toast.success('Personality profile generated!');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Failed to save quiz results');
      setLoading(false);
    }
  };

  const q = questions[currentStep];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center pt-16">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span>STEP {currentStep + 1} OF {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Question Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {q.question}
              </h2>

              <div className="grid gap-4">
                {q.options.map((opt) => {
                  const isSelected = q.multiSelect
                    ? (answers[q.id] || []).includes(opt.value)
                    : answers[q.id] === opt.value;

                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(q.id, opt.value, q.multiSelect)}
                      className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                        isSelected
                          ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{opt.icon}</span>
                        <span className={`text-lg font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {opt.label}
                        </span>
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-indigo-500 rounded-full p-1"
                        >
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className={`flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors ${
              currentStep === 0 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {(q.multiSelect || isCurrentAnswered()) && (
            <button
              onClick={handleNext}
              disabled={loading || !isCurrentAnswered()}
              className="btn-primary py-3 px-8"
            >
              <span className="mr-2">
                {currentStep === questions.length - 1 ? 'Analyze Personality' : 'Next Question'}
              </span>
              {currentStep === questions.length - 1 ? (
                <Sparkles className="w-4 h-4 animate-pulse" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
