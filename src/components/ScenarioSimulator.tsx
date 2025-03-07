import React, { useState } from 'react';
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
  EmotionType
} from '../models/types';
import { 
  ChartBarIcon, 
  ArrowPathIcon as RefreshIcon, 
  UserIcon, 
  CogIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const ScenarioSimulator: React.FC = () => {
  const [scenario, setScenario] = useState<TradingScenario | null>(null);
  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [traderState, setTraderState] = useState<TraderState | null>(null);
  const [loading, setLoading] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [showTraderDetails, setShowTraderDetails] = useState(false);

  // Custom scenario settings
  const [marketCondition, setMarketCondition] = useState<MarketCondition>('trending');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('intraday');
  const [assetClass, setAssetClass] = useState<AssetClass>('stocks');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionType[]>(['greed', 'fear']);

  const marketConditions: MarketCondition[] = ['bullish', 'bearish', 'choppy', 'trending', 'volatile', 'ranging'];
  const timeFrames: TimeFrame[] = ['scalping', 'intraday', 'swing', 'position'];
  const assetClasses: AssetClass[] = ['stocks', 'futures', 'forex', 'crypto', 'options'];
  const difficulties = ['easy', 'medium', 'hard'];
  const emotions: EmotionType[] = [
    'fear', 'greed', 'revenge', 'overconfidence', 'anxiety', 
    'impatience', 'frustration', 'excitement', 'boredom', 'hope', 'desperation'
  ];

  const handleRandomScenario = () => {
    setLoading(true);
    setTimeout(() => {
      const { scenario: newScenario, trader: newTrader, traderState: newTraderState } = generateRandomScenario();
      setScenario(newScenario);
      setTrader(newTrader);
      setTraderState(newTraderState);
      setLoading(false);
    }, 500); // Simulate loading
  };

  const handleCustomScenario = () => {
    if (selectedEmotions.length === 0) {
      alert('Please select at least one emotion type');
      return;
    }

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

          {/* Coaching Interface */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Your Coaching Assessment</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="emotional-state" className="block text-sm font-medium text-gray-700">
                  What emotional state is affecting this trader?
                </label>
                <select
                  id="emotional-state"
                  name="emotional-state"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select an emotion</option>
                  {emotions.map((emotion) => (
                    <option key={emotion} value={emotion}>
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  What problematic behaviors do you observe?
                </label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {Object.keys(getBehaviorColor('')).map((behavior) => (
                    <div key={behavior} className="flex items-center">
                      <input
                        id={`behavior-${behavior}`}
                        name={`behavior-${behavior}`}
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`behavior-${behavior}`} className="ml-2 text-sm text-gray-700">
                        {behavior.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="advice" className="block text-sm font-medium text-gray-700">
                  What advice would you give this trader?
                </label>
                <div className="mt-1">
                  <textarea
                    id="advice"
                    name="advice"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter your coaching advice..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Coaching Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator; 