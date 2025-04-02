"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiPlay, FiBookOpen, FiCheckCircle, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface Lecture {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article';
  completed: boolean;
  videoThumbnail?: string;
  videoUrl?: string;
  articleContent?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lectures: Lecture[];
  expanded: boolean;
}

const CoursePage = () => {
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'm1',
      title: 'Introduction to Trading',
      description: 'Learn the fundamentals of trading and market analysis',
      expanded: false,
      lectures: [
        {
          id: 'l1',
          title: 'What is Trading?',
          duration: '8:32',
          type: 'video',
          completed: false,
          videoThumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'l2',
          title: 'Market Participants',
          duration: '12:45',
          type: 'video',
          completed: false,
          videoThumbnail: 'https://i.ytimg.com/vi/7q7E91pHoW8/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=7q7E91pHoW8'
        },
        {
          id: 'l3',
          title: 'Basic Terminology',
          duration: '5 min read',
          type: 'article',
          completed: false,
          articleContent: 'Trading involves buying and selling financial instruments...'
        }
      ]
    },
    {
      id: 'm2',
      title: 'Technical Analysis',
      description: 'Master chart patterns, indicators, and technical tools',
      expanded: false,
      lectures: [
        {
          id: 'l4',
          title: 'Candlestick Patterns',
          duration: '15:20',
          type: 'video',
          completed: false,
          videoThumbnail: 'https://i.ytimg.com/vi/GEYf1qQb4eE/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=GEYf1qQb4eE'
        },
        {
          id: 'l5',
          title: 'Support and Resistance',
          duration: '10 min read',
          type: 'article',
          completed: false,
          articleContent: 'Support and resistance are key concepts in technical analysis...'
        }
      ]
    },
    {
      id: 'm3',
      title: 'Risk Management',
      description: 'Learn how to protect your capital and manage risk',
      expanded: false,
      lectures: [
        {
          id: 'l6',
          title: 'Position Sizing',
          duration: '9:15',
          type: 'video',
          completed: false,
          videoThumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A'
        },
        {
          id: 'l7',
          title: 'Risk-Reward Ratio',
          duration: '7 min read',
          type: 'article',
          completed: false,
          articleContent: 'Understanding risk-reward ratio is crucial for long-term success...'
        }
      ]
    }
  ]);

  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState<number | null>(null);

  // Calculate progress whenever modules change
  useEffect(() => {
    const totalLectures = modules.reduce((acc, module) => acc + module.lectures.length, 0);
    const completedLectures = modules.reduce(
      (acc, module) => acc + module.lectures.filter(lecture => lecture.completed).length,
      0
    );
    setProgress(Math.round((completedLectures / totalLectures) * 100));
  }, [modules]);

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, expanded: !module.expanded } 
        : module
    ));
  };

  const toggleLectureCompletion = (lectureId: string) => {
    setModules(modules.map(module => ({
      ...module,
      lectures: module.lectures.map(lecture => 
        lecture.id === lectureId 
          ? { ...lecture, completed: !lecture.completed } 
          : lecture
      )
    })));
  };

  const selectLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setCurrentVideoTime(null); // Reset video time when selecting new lecture
    if (!lecture.completed) {
      toggleLectureCompletion(lecture.id);
    }
  };

  const navigateLecture = (direction: 'next' | 'prev') => {
    if (!selectedLecture) return;

    // Find current module and lecture index
    let currentModuleIndex = -1;
    let currentLectureIndex = -1;
    
    modules.forEach((module, mIdx) => {
      module.lectures.forEach((lecture, lIdx) => {
        if (lecture.id === selectedLecture.id) {
          currentModuleIndex = mIdx;
          currentLectureIndex = lIdx;
        }
      });
    });

    if (currentModuleIndex === -1) return;

    const currentModule = modules[currentModuleIndex];
    
    if (direction === 'next') {
      // Try next lecture in current module
      if (currentLectureIndex < currentModule.lectures.length - 1) {
        selectLecture(currentModule.lectures[currentLectureIndex + 1]);
        return;
      }
      // Try first lecture in next module
      if (currentModuleIndex < modules.length - 1) {
        const nextModule = modules[currentModuleIndex + 1];
        if (nextModule.lectures.length > 0) {
          selectLecture(nextModule.lectures[0]);
          // Expand the next module
          setModules(modules.map((mod, idx) => 
            idx === currentModuleIndex + 1 ? { ...mod, expanded: true } : mod
          ))
        }
      }
    } else { // prev
      // Try previous lecture in current module
      if (currentLectureIndex > 0) {
        selectLecture(currentModule.lectures[currentLectureIndex - 1]);
        return;
      }
      // Try last lecture in previous module
      if (currentModuleIndex > 0) {
        const prevModule = modules[currentModuleIndex - 1];
        if (prevModule.lectures.length > 0) {
          selectLecture(prevModule.lectures[prevModule.lectures.length - 1]);
          // Expand the previous module
          setModules(modules.map((mod, idx) => 
            idx === currentModuleIndex - 1 ? { ...mod, expanded: true } : mod
          ))
        }
      }
    }
  };

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    // This would work better with a proper YouTube API integration
    // For demo purposes, we'll just simulate time tracking
    if (currentVideoTime === null) {
      setCurrentVideoTime(10); // Simulate starting at 10 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar - Course modules */}
          <div className="w-full md:w-1/3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-gradient-to-br from-pink-600 to-blue-800 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-gray-700"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-2xl font-bold text-white mb-2">Trading Masterclass</h1>
                <p className="text-purple-200 mb-4">Master the art of trading with our comprehensive course</p>
                
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">Your Progress</span>
                    <span className="text-sm font-bold text-purple-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full shadow-purple-glow" 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
              
              <div className="space-y-3">
                {modules.map((module, moduleIndex) => (
                  <motion.div 
                    key={module.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * moduleIndex, duration: 0.4 }}
                    className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm"
                  >
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300"
                    >
                      <div className="text-left">
                        <h3 className="font-semibold text-white">{module.title}</h3>
                        <p className="text-sm text-purple-200">{module.description}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: module.expanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-purple-400"
                      >
                        {module.expanded ? <FiChevronUp /> : <FiChevronDown />}
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {module.expanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="bg-gray-900/30"
                        >
                          <ul className="divide-y divide-gray-700">
                            {module.lectures.map((lecture, lectureIndex) => (
                              <motion.li 
                                key={lecture.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * lectureIndex, duration: 0.2 }}
                                className={`p-3 hover:bg-gray-800/50 cursor-pointer transition-all duration-200 ${selectedLecture?.id === lecture.id ? 'bg-gray-800/70' : ''}`}
                                onClick={() => selectLecture(lecture)}
                              >
                                <div className="flex items-center space-x-3">
                                  <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${lecture.completed ? 'bg-green-900/70 text-green-400' : 'bg-purple-900/70 text-purple-400'}`}
                                  >
                                    {lecture.completed ? <FiCheckCircle /> : lecture.type === 'video' ? <FiPlay /> : <FiBookOpen />}
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${lecture.completed ? 'text-gray-400 line-through' : 'text-white'} truncate`}>
                                      {lecture.title}
                                    </p>
                                    <p className={`text-xs ${lecture.completed ? 'text-gray-500' : 'text-gray-400'}`}>{lecture.duration}</p>
                                  </div>
                                  {lecture.type === 'video' && (
                                    <motion.div 
                                      whileHover={{ scale: 1.05 }}
                                      className="w-12 h-8 rounded overflow-hidden border border-gray-600"
                                    >
                                      <img src={lecture.videoThumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </motion.div>
                                  )}
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right content area - Selected lecture */}
          <div className="w-full md:w-2/3">
            <motion.div 
              key={selectedLecture ? selectedLecture.id : 'empty'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 h-full border border-gray-700 backdrop-blur-sm"
            >
              {selectedLecture ? (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedLecture.title}</h2>
                    <div className="flex items-center space-x-2 text-sm text-purple-200">
                      <span>{selectedLecture.type === 'video' ? 'Video Lesson' : 'Reading Material'}</span>
                      <span>•</span>
                      <span>{selectedLecture.duration}</span>
                      <span>•</span>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleLectureCompletion(selectedLecture.id)}
                        className={`flex items-center space-x-1 ${selectedLecture.completed ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                      >
                        <FiCheckCircle size={14} />
                        <span>{selectedLecture.completed ? 'Completed' : 'Mark as completed'}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  {selectedLecture.type === 'video' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative rounded-xl overflow-hidden bg-black shadow-lg"
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedLecture.videoUrl?.split('v=')[1]}${currentVideoTime ? `?start=${currentVideoTime}` : ''}`}
                        className="w-full h-96"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={handleVideoTimeUpdate}
                      />
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="prose max-w-none text-gray-300"
                    >
                      <p className="text-lg">{selectedLecture.articleContent}</p>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg border border-purple-900/50"
                      >
                        <h3 className="text-purple-300 font-medium mb-2">Key Takeaways</h3>
                        <ul className="text-purple-200 space-y-2">
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-start"
                          >
                            <span className="text-purple-400 mr-2">•</span>
                            <span>Understand the basic concepts of trading</span>
                          </motion.li>
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-start"
                          >
                            <span className="text-purple-400 mr-2">•</span>
                            <span>Learn how to analyze market trends</span>
                          </motion.li>
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-start"
                          >
                            <span className="text-purple-400 mr-2">•</span>
                            <span>Develop a solid trading strategy</span>
                          </motion.li>
                        </ul>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-between pt-4 border-t border-gray-700"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigateLecture('prev')}
                      className="px-4 py-2 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg text-white transition-all flex items-center space-x-2 border border-gray-700"
                    >
                      <FiArrowLeft />
                      <span>Previous</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(124, 58, 237, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigateLecture('next')}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-white transition-all flex items-center space-x-2 shadow-lg shadow-purple-900/30"
                    >
                      <span>Next</span>
                      <FiArrowRight />
                    </motion.button>
                  </motion.div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(124, 58, 237, 0)',
                        '0 0 0 10px rgba(124, 58, 237, 0.1)',
                        '0 0 0 20px rgba(124, 58, 237, 0)'
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-full flex items-center justify-center mb-4 border border-purple-700"
                  >
                    <FiPlay className="text-purple-300 text-3xl" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-white mb-2">Select a lecture to begin</h3>
                  <p className="text-gray-400 max-w-md">
                    Choose any lecture from the sidebar to start learning about trading strategies, market analysis, and risk management.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoursePage;