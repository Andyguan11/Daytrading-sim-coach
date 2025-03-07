import React, { useState, useRef, useEffect } from 'react';
import { 
  generateRandomScenario, 
  generateCustomScenario 
} from '../utils/scenarioGenerator';
import { 
  TradingScenario, 
  TraderProfile, 
  TraderState, 
  MarketCondition,
  TimeFrame,
  AssetClass,
  EmotionType,
  TradingBehavior,
  TraderDecision
} from '../models/types';
import { 
  ChartBarIcon, 
  ArrowPathIcon as RefreshIcon, 
  UserIcon, 
  CogIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MicrophoneIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import TradingChart from './TradingChart';

// Fix the TypeScript errors for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// Define the relatedEmotions object outside the component
const relatedEmotions: Record<EmotionType, EmotionType[]> = {
  'fear': ['anxiety', 'desperation'],
  'anxiety': ['fear', 'desperation'],
  'greed': ['overconfidence', 'excitement'],
  'overconfidence': ['greed', 'excitement'],
  'revenge': ['frustration', 'impatience'],
  'frustration': ['revenge', 'impatience'],
  'excitement': ['greed', 'overconfidence'],
  'boredom': ['impatience'],
  'hope': ['excitement'],
  'desperation': ['fear', 'anxiety'],
  'impatience': ['frustration', 'boredom']
};

const ScenarioSimulator: React.FC = () => {
  const [scenario, setScenario] = useState<TradingScenario | null>(null);
  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [traderState, setTraderState] = useState<TraderState | null>(null);
  const [loading, setLoading] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [showTraderDetails, setShowTraderDetails] = useState(false);

  // New state variables for coaching assessment
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | ''>('');
  const [coachingAdvice, setCoachingAdvice] = useState('');
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Custom scenario settings
  const [marketCondition, setMarketCondition] = useState<MarketCondition>('trending');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('intraday');
  const [assetClass, setAssetClass] = useState<AssetClass>('stocks');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionType[]>([]);
  const [primaryEmotion, setPrimaryEmotion] = useState<EmotionType | null>(null);

  // Add this to the state declarations
  const [error, setError] = useState<string | null>(null);

  const marketConditions: MarketCondition[] = ['bullish', 'bearish', 'choppy', 'trending', 'volatile', 'ranging'];
  const timeFrames: TimeFrame[] = ['scalping', 'intraday', 'swing', 'position'];
  const assetClasses: AssetClass[] = ['stocks', 'futures', 'forex', 'crypto', 'options'];
  const difficulties = ['easy', 'medium', 'hard'];
  const emotions: EmotionType[] = [
    'fear', 'greed', 'revenge', 'overconfidence', 'anxiety', 
    'impatience', 'frustration', 'excitement', 'boredom', 'hope', 'desperation'
  ];

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setCoachingAdvice(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setRecordingError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };
      
      speechRecognitionRef.current = recognition;
    }
  }, []);

  // Voice recording functions
  const startRecording = async () => {
    setRecordingError('');
    
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setRecordingError('Could not start speech recognition. Please try again.');
      }
    } else {
      // Fallback to audio recording if speech recognition is not available
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        const audioChunks: BlobPart[] = [];
        
        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener('stop', async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          
          // In a real app, you would send this to a speech-to-text API
          setTranscribing(true);
          
          // Simulate a more realistic transcription with a delay
          setTimeout(() => {
            // Generate a more contextual response based on the selected emotion
            let contextualAdvice = "";
            
            if (selectedEmotion) {
              switch(selectedEmotion) {
                case 'fear':
                  contextualAdvice = `I notice you're experiencing fear in your trading. This is causing you to exit trades too early and miss potential profits. Try setting clear profit targets before entering a trade and stick to them. Remember that some fear is natural, but don't let it override your trading plan.`;
                  break;
                case 'greed':
                  contextualAdvice = `Your trading shows signs of greed. You're holding positions too long hoping for bigger gains, which often leads to giving back profits. Consider using trailing stops to lock in profits while still allowing room for growth. Stick to your exit strategy rather than hoping for "just a bit more."`;
                  break;
                case 'revenge':
                  contextualAdvice = `I can see you're revenge trading after losses. This is leading to oversized positions and poor entry points. Take a break after a loss, analyze what went wrong objectively, and only re-enter when you have a clear setup that meets your criteria.`;
                  break;
                case 'overconfidence':
                  contextualAdvice = `You're showing overconfidence in your trading decisions. This is causing you to take excessive risks and ignore warning signs. Remember that markets can change quickly, and past success doesn't guarantee future results. Maintain consistent position sizing regardless of recent wins.`;
                  break;
                default:
                  contextualAdvice = `I notice you're experiencing ${selectedEmotion} in your trading. This emotional state is affecting your decision-making process. Try to step back and evaluate your trades objectively based on your predefined strategy rather than how you feel in the moment.`;
              }
            } else {
              contextualAdvice = "I notice your trading decisions are being influenced by emotions. Try to maintain a trading journal to identify patterns in your emotional responses and how they affect your trading outcomes. Developing awareness is the first step to improvement.";
            }
            
            setCoachingAdvice(contextualAdvice);
            setTranscribing(false);
          }, 1500);
          
          // Clean up
          stream.getTracks().forEach(track => track.stop());
        });
        
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setRecordingError('Could not access microphone. Please check your browser permissions.');
      }
    }
  };
  
  const stopRecording = () => {
    if (speechRecognitionRef.current && isRecording) {
      speechRecognitionRef.current.stop();
      setIsRecording(false);
    } else if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRandomScenario = () => {
    try {
      setLoading(true);
      // Reset assessment state
      setSelectedEmotion('');
      setCoachingAdvice('');
      setAssessmentSubmitted(false);
      setAssessmentScore(null);
      setFeedbackMessage('');
      
      setTimeout(() => {
        try {
          const result = generateRandomScenario();
          
          if (!result || !result.scenario || !result.trader || !result.traderState) {
            console.error('Invalid scenario data generated:', result);
            setError('Failed to generate a valid scenario. Please try again.');
            setLoading(false);
            return;
          }
          
          setScenario(result.scenario);
          setTrader(result.trader);
          setTraderState(result.traderState);
          setLoading(false);
        } catch (error) {
          console.error('Error in scenario generation:', error);
          setError('An error occurred while generating the scenario. Please try again.');
          setLoading(false);
        }
      }, 500); // Simulate loading
    } catch (error) {
      console.error('Error in handleRandomScenario:', error);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleCustomScenario = () => {
    if (selectedEmotions.length === 0) {
      alert('Please select at least one emotion type');
      return;
    }

    // Reset assessment state
    setSelectedEmotion('');
    setCoachingAdvice('');
    setAssessmentSubmitted(false);
    setAssessmentScore(null);
    setFeedbackMessage('');
    
    setLoading(true);
    setTimeout(() => {
      const { scenario: newScenario, trader: newTrader, traderState: newTraderState } = generateCustomScenario(
        marketCondition,
        timeFrame,
        assetClass,
        difficulty as 'easy' | 'medium' | 'hard',
        selectedEmotions
      );
      setScenario(newScenario);
      setTrader(newTrader);
      setTraderState(newTraderState);
      setLoading(false);
    }, 500); // Simulate loading
  };

  const handleSubmitAssessment = () => {
    if (!traderState) return;
    
    if (!selectedEmotion) {
      alert('Please select an emotional state');
      return;
    }
    
    // Calculate score based only on emotion identification
    let score = 0;
    
    // Check if emotion is correct (worth 100% of total score now)
    if (selectedEmotion === traderState.currentEmotionalState.primary) {
      score = 100;
    } else {
      // Partial credit for related emotions
      if (relatedEmotions[traderState.currentEmotionalState.primary]?.includes(selectedEmotion)) {
        score = 60; // Partial credit for related emotion
      } else {
        score = 30; // Some credit for at least trying
      }
    }
    
    setAssessmentScore(score);
    
    // Generate feedback message
    let feedback = '';
    if (selectedEmotion === traderState.currentEmotionalState.primary) {
      feedback += `✅ Excellent! You correctly identified that the trader is experiencing ${selectedEmotion}. `;
    } else if (score === 60) {
      feedback += `👍 Good observation. The trader's primary emotion is ${traderState.currentEmotionalState.primary}, but ${selectedEmotion} is closely related and may also be present. `;
    } else {
      feedback += `❌ The trader's primary emotion is ${traderState.currentEmotionalState.primary}, which is driving their decisions. `;
    }
    
    // Add advice about the behaviors
    feedback += `\n\nThe trader is exhibiting these behaviors: ${traderState.currentEmotionalState.behaviors.map(b => 
      b.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ).join(', ')}. `;
    
    // Add context about the trader's decisions
    const profitableTrades = traderState.decisions.filter(d => d.outcome === 'positive').length;
    const totalTrades = traderState.decisions.length;
    
    feedback += `\n\nThe trader made ${profitableTrades} profitable trades out of ${totalTrades} total trades. `;
    
    if (traderState.performance.profitLoss >= 0) {
      feedback += `Despite the emotional influence, they managed to achieve a profit of ${traderState.performance.profitLoss.toFixed(2)}%.`;
    } else {
      feedback += `The emotional influence led to a loss of ${Math.abs(traderState.performance.profitLoss).toFixed(2)}%.`;
    }
    
    setFeedbackMessage(feedback);
    setAssessmentSubmitted(true);
  };

  const toggleEmotionSelection = (emotion: EmotionType) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getEmotionColor = (emotion: EmotionType) => {
    const emotionColors: Record<EmotionType, string> = {
      fear: 'bg-red-100 text-red-800',
      greed: 'bg-green-100 text-green-800',
      revenge: 'bg-purple-100 text-purple-800',
      overconfidence: 'bg-yellow-100 text-yellow-800',
      anxiety: 'bg-orange-100 text-orange-800',
      impatience: 'bg-blue-100 text-blue-800',
      frustration: 'bg-pink-100 text-pink-800',
      excitement: 'bg-indigo-100 text-indigo-800',
      boredom: 'bg-gray-100 text-gray-800',
      hope: 'bg-teal-100 text-teal-800',
      desperation: 'bg-red-100 text-red-800'
    };
    return emotionColors[emotion];
  };

  const getEmotionEmoji = (emotion: EmotionType) => {
    const emotionEmojis: Record<EmotionType, string> = {
      fear: '😨',
      greed: '🤑',
      revenge: '😡',
      overconfidence: '😎',
      anxiety: '😰',
      impatience: '⏱️',
      frustration: '😤',
      excitement: '🤩',
      boredom: '😴',
      hope: '🙏',
      desperation: '😫'
    };
    return emotionEmojis[emotion];
  };

  const getBehaviorColor = (behavior: string) => {
    const behaviorColors: Record<string, string> = {
      oversizing: 'bg-red-100 text-red-800',
      cutting_winners_early: 'bg-yellow-100 text-yellow-800',
      letting_losers_run: 'bg-red-100 text-red-800',
      averaging_down: 'bg-orange-100 text-orange-800',
      chasing_entries: 'bg-purple-100 text-purple-800',
      overtrading: 'bg-blue-100 text-blue-800',
      hesitation: 'bg-gray-100 text-gray-800',
      deviation_from_plan: 'bg-pink-100 text-pink-800',
      ignoring_risk_management: 'bg-red-100 text-red-800',
      moving_stop_loss: 'bg-orange-100 text-orange-800',
      trading_without_edge: 'bg-yellow-100 text-yellow-800'
    };
    return behaviorColors[behavior] || 'bg-gray-100 text-gray-800';
  };

  const getBehaviorEmoji = (behavior: TradingBehavior) => {
    const behaviorEmojis: Record<TradingBehavior, string> = {
      oversizing: '🐘',
      cutting_winners_early: '✂️',
      letting_losers_run: '🏃‍♂️',
      averaging_down: '⬇️',
      chasing_entries: '🏃‍♀️',
      overtrading: '🔄',
      hesitation: '🤔',
      deviation_from_plan: '🛣️',
      ignoring_risk_management: '⚠️',
      moving_stop_loss: '🚶‍♂️',
      trading_without_edge: '🎲'
    };
    return behaviorEmojis[behavior];
  };

  // Helper function to get a human-readable behavior name
  const getBehaviorName = (behavior: TradingBehavior) => {
    return behavior.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Function to render a simple price chart based on decisions
  const renderPriceChart = (decisions: TraderDecision[], priceAction: any[]) => {
    // This would be replaced with a real chart library in a production app
    return (
      <div className="h-40 bg-gray-100 rounded-lg p-2 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Price chart visualization would go here</p>
      </div>
    );
  };

  // Helper functions for formatting trader actions
  const formatAction = (action: string): string => {
    switch (action) {
      case 'buy':
        return 'Buy';
      case 'sell':
        return 'Sell';
      case 'hold':
        return 'Hold';
      case 'increase_position':
        return 'Increase Position';
      case 'decrease_position':
        return 'Decrease Position';
      case 'exit':
        return 'Exit';
      default:
        return action;
    }
  };

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'buy':
        return 'bg-green-100 text-green-800';
      case 'sell':
        return 'bg-red-100 text-red-800';
      case 'hold':
        return 'bg-gray-100 text-gray-800';
      case 'increase_position':
        return 'bg-green-200 text-green-800';
      case 'decrease_position':
        return 'bg-yellow-100 text-yellow-800';
      case 'exit':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Scenario Simulator
          </h2>
          <p className="mt-1 text-gray-500">
            Generate trading scenarios to practice identifying emotional trading behaviors
          </p>
        </div>
      </div>

      {/* Scenario Generator */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Generate a Scenario</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Choose between random or custom scenarios
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setCustomMode(false)}
                className={`px-4 py-2 rounded-md ${
                  !customMode 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                Random Scenario
              </button>
              <button
                onClick={() => setCustomMode(true)}
                className={`px-4 py-2 rounded-md ${
                  customMode 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                Custom Scenario
              </button>
            </div>

            {customMode ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Market Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Market Condition</label>
                  <select
                    value={marketCondition}
                    onChange={(e) => setMarketCondition(e.target.value as MarketCondition)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {marketConditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Frame */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Frame</label>
                  <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {timeFrames.map((frame) => (
                      <option key={frame} value={frame}>
                        {frame.charAt(0).toUpperCase() + frame.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Asset Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Asset Class</label>
                  <select
                    value={assetClass}
                    onChange={(e) => setAssetClass(e.target.value as AssetClass)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {assetClasses.map((asset) => (
                      <option key={asset} value={asset}>
                        {asset.charAt(0).toUpperCase() + asset.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Emotions */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emotional States</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {emotions.map((emotion) => (
                      <div key={emotion} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`emotion-${emotion}`}
                          checked={selectedEmotions.includes(emotion)}
                          onChange={() => toggleEmotionSelection(emotion)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`emotion-${emotion}`} className="ml-2 text-sm text-gray-700">
                          {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Generate a completely random scenario with varied market conditions, trader profiles, and emotional states.
              </p>
            )}

            <div className="pt-4">
              <button
                onClick={customMode ? handleCustomScenario : handleRandomScenario}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <>
                    <RefreshIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate {customMode ? 'Custom' : 'Random'} Scenario
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Display */}
      {scenario && trader && traderState && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{scenario.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{scenario.description}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${scenario.difficulty === 'easy' ? 'green' : scenario.difficulty === 'medium' ? 'yellow' : 'red'}-100 text-${scenario.difficulty === 'easy' ? 'green' : scenario.difficulty === 'medium' ? 'yellow' : 'red'}-800`}>
                {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {scenario.marketCondition.charAt(0).toUpperCase() + scenario.marketCondition.slice(1)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {scenario.timeFrame.charAt(0).toUpperCase() + scenario.timeFrame.slice(1)}
              </span>
            </div>
          </div>

          {/* Trader Profile */}
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer" onClick={() => setShowTraderDetails(!showTraderDetails)}>
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h4 className="text-md font-medium text-gray-900">Trader: {trader.name}</h4>
              </div>
              <div>
                {showTraderDetails ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {showTraderDetails && (
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Personality</h5>
                    <p className="mt-1 text-sm text-gray-900">{trader.personality.charAt(0).toUpperCase() + trader.personality.slice(1)}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Experience</h5>
                    <p className="mt-1 text-sm text-gray-900">{trader.experience.charAt(0).toUpperCase() + trader.experience.slice(1)}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Strategy</h5>
                    <p className="mt-1 text-sm text-gray-900">{trader.strategy.name}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Preferred Time Frames</h5>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {trader.preferredTimeFrames.map((frame) => (
                        <span key={frame} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {frame.charAt(0).toUpperCase() + frame.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <h5 className="text-sm font-medium text-gray-500">Emotional Tendencies</h5>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {trader.emotionalTendencies.map((emotion) => (
                        <span key={emotion} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getEmotionColor(emotion)}`}>
                          {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current Emotional State */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-md font-medium text-gray-900 mb-2">Current Emotional State</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEmotionColor(traderState.currentEmotionalState.primary)}`}>
                  {traderState.currentEmotionalState.primary.charAt(0).toUpperCase() + traderState.currentEmotionalState.primary.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  Intensity: {traderState.currentEmotionalState.intensity}/10
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Trigger:</strong> {traderState.currentEmotionalState.trigger}
              </p>
              <div>
                <strong className="text-sm text-gray-700">Behaviors:</strong>
                <div className="mt-1 flex flex-wrap gap-1">
                  {traderState.currentEmotionalState.behaviors.map((behavior) => (
                    <span key={behavior} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBehaviorColor(behavior)}`}>
                      {behavior.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trading Decisions */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Trading Decisions</h4>
            <div className="flow-root">
              <ul className="-mb-8">
                {traderState.decisions.map((decision, decisionIdx) => (
                  <li key={decisionIdx}>
                    <div className="relative pb-8">
                      {decisionIdx !== traderState.decisions.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            decision.outcome === 'positive' ? 'bg-green-500' : decision.outcome === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                          }`}>
                            <ChartBarIcon className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">
                                {decision.action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </span>
                              {decision.emotionalInfluence && (
                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getEmotionColor(decision.emotionalInfluence)}`}>
                                  {decision.emotionalInfluence.charAt(0).toUpperCase() + decision.emotionalInfluence.slice(1)}
                                </span>
                              )}
                              {decision.violatesStrategy && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  Violates Strategy
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{decision.reasoning}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={decision.timestamp}>{formatDate(decision.timestamp)}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-md font-medium text-gray-900 mb-2">Performance Summary</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-md">
                <dt className="text-sm font-medium text-gray-500">Profit/Loss</dt>
                <dd className={`mt-1 text-xl font-semibold ${traderState.performance.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {traderState.performance.profitLoss.toFixed(2)}%
                </dd>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <dt className="text-sm font-medium text-gray-500">Correct Decisions</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  {traderState.performance.correctDecisions} / {traderState.decisions.length}
                </dd>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <dt className="text-sm font-medium text-gray-500">Emotional Mistakes</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  {traderState.performance.emotionalMistakes}
                </dd>
              </div>
            </div>
          </div>

          {/* Coaching Interface - Improved UI */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Your Coaching Assessment</h4>
            
            {!assessmentSubmitted ? (
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                {/* Explanation of the assessment process */}
                <div className="mb-6 bg-blue-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">How Your Assessment Works</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Your task is to identify what's driving this trader's decisions:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>Identify the primary emotion affecting the trader</li>
                          <li>Provide coaching advice (voice or text)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Primary Emotion</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      What is the trader's primary emotional state?
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {emotions.map((emotion) => (
                        <button
                          key={emotion}
                          className={`p-2 rounded-md text-sm ${
                            primaryEmotion === emotion
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          onClick={() => {
                            setPrimaryEmotion(emotion);
                            if (!selectedEmotions.includes(emotion)) {
                              setSelectedEmotions([...selectedEmotions, emotion]);
                            }
                          }}
                        >
                          {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Secondary Emotions</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Select up to two additional emotions the trader might be experiencing
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {emotions
                        .filter(emotion => emotion !== primaryEmotion)
                        .map((emotion) => (
                          <button
                            key={emotion}
                            className={`p-2 rounded-md text-sm ${
                              selectedEmotions.includes(emotion) && emotion !== primaryEmotion
                                ? 'bg-blue-300 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={() => {
                              if (selectedEmotions.includes(emotion)) {
                                setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
                              } else if (selectedEmotions.length < 3) {
                                setSelectedEmotions([...selectedEmotions, emotion]);
                              }
                            }}
                          >
                            {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="advice" className="block text-base font-medium text-gray-900 mb-3">
                      What coaching advice would you give? 💬
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="advice"
                        name="advice"
                        rows={4}
                        value={coachingAdvice}
                        onChange={(e) => setCoachingAdvice(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg"
                        placeholder="Enter your coaching advice to help the trader overcome their emotional challenges..."
                      />
                    </div>
                    
                    {/* Voice recording controls */}
                    <div className="mt-3 flex items-center">
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <MicrophoneIcon className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" />
                          Record Voice Advice
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <StopIcon className="-ml-0.5 mr-2 h-4 w-4 text-red-500" />
                          Stop Recording
                        </button>
                      )}
                      
                      {isRecording && (
                        <div className="ml-3 flex items-center">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                          <span className="ml-2 text-sm text-gray-500">Recording...</span>
                        </div>
                      )}
                      
                      {transcribing && (
                        <div className="ml-3 flex items-center">
                          <RefreshIcon className="animate-spin h-4 w-4 text-indigo-500 mr-2" />
                          <span className="text-sm text-gray-500">Transcribing...</span>
                        </div>
                      )}
                    </div>
                    
                    {recordingError && (
                      <p className="mt-2 text-sm text-red-600">{recordingError}</p>
                    )}
                    
                    <p className="mt-2 text-sm text-gray-500">
                      Your advice helps the trader understand their emotional patterns. Type or use voice recording.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSubmitAssessment}
                      disabled={!selectedEmotion}
                      className={`inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                        !selectedEmotion
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                    >
                      Submit Assessment
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="text-center mb-6">
                  <div className="inline-block rounded-full bg-gray-100 p-4">
                    {assessmentScore !== null && assessmentScore >= 70 ? (
                      <CheckCircleIcon className="h-10 w-10 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-10 w-10 text-red-500" />
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-medium text-gray-900">Assessment Results</h3>
                  <div className="mt-1">
                    {assessmentScore !== null && (
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              assessmentScore >= 80 ? 'bg-green-500' : 
                              assessmentScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${assessmentScore}%` }}
                          ></div>
                        </div>
                        <span className={`text-lg font-medium ${
                          assessmentScore >= 80 ? 'text-green-600' : 
                          assessmentScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {assessmentScore >= 80 ? 'Excellent' : 
                           assessmentScore >= 60 ? 'Good' : 'Needs Improvement'} 
                          ({assessmentScore}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-3">Feedback:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{feedbackMessage}</p>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-3">Your Coaching Advice:</h4>
                  <p className="text-sm text-gray-700 italic">"{coachingAdvice}"</p>
                </div>
                
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAssessmentSubmitted(false);
                      setSelectedEmotion('');
                      setCoachingAdvice('');
                      setAssessmentScore(null);
                      setFeedbackMessage('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={handleRandomScenario}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next Scenario
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Trader Actions */}
          {traderState && (
            <>
              <div className="mt-6 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Trader Actions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reasoning</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {traderState.decisions.map((decision, index) => {
                        const time = new Date(decision.timestamp);
                        const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
                        
                        return (
                          <tr key={index} className={decision.violatesStrategy ? 'bg-red-50' : ''}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{formattedTime}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{decision.session || 'N/A'}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                              <span className={`px-2 py-1 rounded-full text-xs ${getActionColor(decision.action)}`}>
                                {formatAction(decision.action)}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500">
                              {decision.reasoning}
                              {decision.emotionalInfluence && (
                                <span className="ml-1 text-xs text-red-500">
                                  (Influenced by {decision.emotionalInfluence})
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                decision.outcome === 'positive' ? 'bg-green-100 text-green-800' : 
                                decision.outcome === 'negative' ? 'bg-red-100 text-red-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {decision.outcome}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">P&L: </span>
                      <span className={`text-sm font-bold ${
                        traderState.performance.profitLoss > 0 ? 'text-green-600' : 
                        traderState.performance.profitLoss < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {traderState.performance.profitLoss > 0 ? '+' : ''}
                        {traderState.performance.profitLoss.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Correct Decisions: </span>
                      <span className="text-sm">{traderState.performance.correctDecisions}/{traderState.decisions.length}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Emotional Mistakes: </span>
                      <span className="text-sm">{traderState.performance.emotionalMistakes}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-white p-4 rounded-lg shadow">
                <TradingChart decisions={traderState.decisions} />
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="font-medium">{error}</p>
          <button 
            className="text-sm underline mt-1"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator; 