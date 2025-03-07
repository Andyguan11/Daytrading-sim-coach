import { 
  TradingScenario, 
  TraderProfile, 
  EmotionalState, 
  EmotionType, 
  TradingBehavior,
  MarketCondition,
  TimeFrame,
  AssetClass,
  PriceAction,
  NewsEvent,
  TraderState,
  TraderDecision
} from '../models/types';
import { getRandomTraderProfile } from '../data/traderProfiles';
import { getRandomScenario } from '../data/tradingScenarios';
import { v4 as uuidv4 } from 'uuid';

// Emotion triggers based on market conditions and trader personality
const emotionTriggers: Record<MarketCondition, Record<string, string[]>> = {
  bullish: {
    missed_opportunity: [
      'Market rallying without your participation',
      'Watching others profit while sitting on sidelines',
      'Missing a breakout you identified earlier'
    ],
    fomo: [
      'Continuous upward momentum',
      'Social media buzz about gains',
      'Multiple stocks making new highs'
    ]
  },
  bearish: {
    fear: [
      'Account drawdown exceeding comfort level',
      'Breaking major support levels',
      'Negative headlines dominating news'
    ],
    opportunity: [
      'Oversold conditions',
      'Capitulation selling',
      'Stocks trading at significant discounts'
    ]
  },
  choppy: {
    frustration: [
      'Multiple false breakouts',
      'Getting stopped out repeatedly',
      'No clear direction to trade'
    ],
    overtrading: [
      'Trying to recoup small losses',
      'Forcing trades in unclear conditions',
      'Boredom from lack of clear setups'
    ]
  },
  trending: {
    greed: [
      'Profits accumulating quickly',
      'Strong momentum in your direction',
      'Multiple winning trades in a row'
    ],
    complacency: [
      'Extended trend making trading seem easy',
      'Relaxing risk management due to success',
      'Increasing position sizes after wins'
    ]
  },
  volatile: {
    anxiety: [
      'Large, rapid price swings',
      'Positions moving quickly against you',
      'Uncertainty about market direction'
    ],
    revenge: [
      'Stopped out just before favorable move',
      'Missing profit target by small amount before reversal',
      'Series of small losses from whipsaw action'
    ]
  },
  ranging: {
    boredom: [
      'Price contained in tight range',
      'Low volatility and volume',
      'Lack of trading opportunities'
    ],
    impatience: [
      'Waiting for breakout confirmation',
      'Anticipating range break too early',
      'Forcing trades within the range'
    ]
  }
};

// Emotional behaviors based on emotion type
const emotionalBehaviors: Record<EmotionType, TradingBehavior[]> = {
  fear: ['hesitation', 'cutting_winners_early', 'deviation_from_plan'],
  greed: ['oversizing', 'letting_losers_run', 'ignoring_risk_management'],
  revenge: ['overtrading', 'chasing_entries', 'ignoring_risk_management'],
  overconfidence: ['oversizing', 'trading_without_edge', 'deviation_from_plan'],
  anxiety: ['hesitation', 'cutting_winners_early', 'overtrading'],
  impatience: ['overtrading', 'chasing_entries', 'deviation_from_plan'],
  frustration: ['overtrading', 'moving_stop_loss', 'deviation_from_plan'],
  excitement: ['oversizing', 'chasing_entries', 'trading_without_edge'],
  boredom: ['overtrading', 'trading_without_edge', 'deviation_from_plan'],
  hope: ['averaging_down', 'letting_losers_run', 'moving_stop_loss'],
  desperation: ['oversizing', 'ignoring_risk_management', 'averaging_down']
};

// Generate a random emotional state based on market condition and trader profile
const generateEmotionalState = (
  marketCondition: MarketCondition,
  traderProfile: TraderProfile
): EmotionalState => {
  // Select a random emotion from the trader's tendencies or a random one if none match the market
  let emotionPool: EmotionType[] = [];
  
  // Filter emotions that are likely in this market condition
  if (marketCondition === 'bullish') {
    emotionPool = ['greed', 'overconfidence', 'excitement', 'hope'];
  } else if (marketCondition === 'bearish') {
    emotionPool = ['fear', 'anxiety', 'desperation', 'hope'];
  } else if (marketCondition === 'choppy' || marketCondition === 'ranging') {
    emotionPool = ['frustration', 'boredom', 'impatience'];
  } else if (marketCondition === 'volatile') {
    emotionPool = ['fear', 'anxiety', 'revenge', 'excitement'];
  } else if (marketCondition === 'trending') {
    emotionPool = ['greed', 'excitement', 'overconfidence'];
  }
  
  // Intersect with trader's tendencies to make it more realistic
  const matchingEmotions = traderProfile.emotionalTendencies.filter(emotion => 
    emotionPool.includes(emotion)
  );
  
  // If no matching emotions, just use the market-based pool
  const finalEmotionPool = matchingEmotions.length > 0 ? matchingEmotions : emotionPool;
  
  // Select a random emotion
  const primaryEmotion = finalEmotionPool[Math.floor(Math.random() * finalEmotionPool.length)];
  
  // Get trigger based on market condition
  const triggerCategory = Object.keys(emotionTriggers[marketCondition])[
    Math.floor(Math.random() * Object.keys(emotionTriggers[marketCondition]).length)
  ];
  const triggerPool = emotionTriggers[marketCondition][triggerCategory];
  const trigger = triggerPool[Math.floor(Math.random() * triggerPool.length)];
  
  // Get behaviors associated with this emotion
  const behaviors = emotionalBehaviors[primaryEmotion];
  
  // Generate random intensity (higher for emotional traders, lower for analytical ones)
  let intensityBase = 5; // Default mid-range
  if (traderProfile.personality === 'impulsive' || traderProfile.personality === 'aggressive') {
    intensityBase = 7; // Higher base for emotional personalities
  } else if (traderProfile.personality === 'analytical' || traderProfile.personality === 'patient') {
    intensityBase = 3; // Lower base for controlled personalities
  }
  
  // Add randomness to intensity
  const intensity = Math.min(10, Math.max(1, intensityBase + Math.floor(Math.random() * 4) - 2));
  
  return {
    primary: primaryEmotion,
    intensity,
    trigger,
    behaviors
  };
};

// Generate a random trader decision based on emotional state and scenario
const generateTraderDecision = (
  emotionalState: EmotionalState,
  traderProfile: TraderProfile,
  scenario: TradingScenario
): TraderDecision => {
  // Determine if the trader's strategy is suitable for current market conditions
  const strategyFit = traderProfile.strategy.bestMarketConditions.includes(scenario.marketCondition);
  const strategyMisfit = traderProfile.strategy.worstMarketConditions.includes(scenario.marketCondition);
  
  // Higher probability of violation when emotional intensity is high or strategy doesn't fit
  const violationProbability = 
    (emotionalState.intensity / 10) * 0.7 + // Emotional component (0-0.7)
    (strategyMisfit ? 0.2 : 0) + // Strategy misfit adds 0.2
    (strategyFit ? -0.2 : 0); // Strategy fit reduces by 0.2
  
  const violatesStrategy = Math.random() < violationProbability;
  
  // Determine action based on emotional state and strategy fit
  let actions = ['buy', 'sell', 'hold', 'increase_position', 'decrease_position', 'exit'];
  let action;
  
  if (violatesStrategy) {
    // If violating strategy, action is more likely to be influenced by emotion
    if (emotionalState.primary === 'greed' || emotionalState.primary === 'overconfidence') {
      action = Math.random() < 0.7 ? 'increase_position' : 'buy';
    } else if (emotionalState.primary === 'fear' || emotionalState.primary === 'anxiety') {
      action = Math.random() < 0.7 ? 'decrease_position' : 'exit';
    } else if (emotionalState.primary === 'revenge' || emotionalState.primary === 'frustration') {
      action = Math.random() < 0.6 ? 'buy' : 'increase_position';
    } else {
      // Random action for other emotions
      action = actions[Math.floor(Math.random() * actions.length)];
    }
  } else {
    // If following strategy, action is more likely to be appropriate for market
    if (scenario.marketCondition === 'trending' || scenario.marketCondition === 'bullish') {
      action = Math.random() < 0.6 ? 'buy' : (Math.random() < 0.5 ? 'hold' : 'increase_position');
    } else if (scenario.marketCondition === 'bearish') {
      action = Math.random() < 0.6 ? 'sell' : (Math.random() < 0.5 ? 'hold' : 'decrease_position');
    } else if (scenario.marketCondition === 'choppy' || scenario.marketCondition === 'ranging') {
      action = Math.random() < 0.6 ? 'hold' : (Math.random() < 0.5 ? 'buy' : 'sell');
    } else {
      // Random action for other market conditions
      action = actions[Math.floor(Math.random() * actions.length)];
    }
  }
  
  // Generate reasoning based on action and emotional state
  let reasoning = '';
  if (violatesStrategy) {
    // Reasoning influenced by emotion
    if (emotionalState.primary === 'greed') {
      reasoning = 'I see potential for much bigger gains here.';
    } else if (emotionalState.primary === 'fear') {
      reasoning = 'I need to protect my capital from further losses.';
    } else if (emotionalState.primary === 'revenge') {
      reasoning = 'I need to make back my previous losses quickly.';
    } else if (emotionalState.primary === 'overconfidence') {
      reasoning = 'I have a strong feeling this will work out well.';
    } else {
      reasoning = 'This feels like the right move right now.';
    }
  } else {
    // Strategy-based reasoning
    reasoning = `Based on my ${traderProfile.strategy.name} strategy, this is the appropriate action.`;
  }
  
  // Determine outcome (more likely to be negative if violating strategy)
  const successProbability = violatesStrategy ? 0.3 : 0.7;
  const outcome = Math.random() < successProbability ? 'positive' : 'negative';
  
  return {
    timestamp: new Date().toISOString(),
    action,
    reasoning,
    emotionalInfluence: violatesStrategy ? emotionalState.primary : null,
    violatesStrategy,
    outcome
  };
};

// Generate a complete randomized scenario with trader state
export const generateRandomScenario = (): {
  scenario: TradingScenario;
  trader: TraderProfile;
  traderState: TraderState;
} => {
  // Get base scenario and trader
  const baseScenario = getRandomScenario();
  const trader = getRandomTraderProfile();
  
  // Generate emotional state based on market condition and trader profile
  const emotionalState = generateEmotionalState(baseScenario.marketCondition, trader);
  
  // Generate a series of decisions
  const numDecisions = Math.floor(Math.random() * 3) + 2; // 2-4 decisions
  const decisions: TraderDecision[] = [];
  
  for (let i = 0; i < numDecisions; i++) {
    decisions.push(generateTraderDecision(emotionalState, trader, baseScenario));
  }
  
  // Calculate performance metrics
  const correctDecisions = decisions.filter(d => d.outcome === 'positive').length;
  const emotionalMistakes = decisions.filter(d => d.emotionalInfluence !== null).length;
  const profitLoss = decisions.reduce((total, d) => {
    // Simple model: positive outcomes add 1-3%, negative outcomes subtract 1-2%
    if (d.outcome === 'positive') {
      return total + (Math.random() * 2 + 1);
    } else {
      return total - (Math.random() * 1 + 1);
    }
  }, 0);
  
  // Create trader state
  const traderState: TraderState = {
    traderId: trader.id,
    scenarioId: baseScenario.id,
    currentEmotionalState: emotionalState,
    decisions,
    performance: {
      profitLoss,
      correctDecisions,
      emotionalMistakes
    }
  };
  
  return {
    scenario: baseScenario,
    trader,
    traderState
  };
};

// Generate a completely custom scenario with specified parameters
export const generateCustomScenario = (
  marketCondition: MarketCondition,
  timeFrame: TimeFrame,
  assetClass: AssetClass,
  difficulty: 'easy' | 'medium' | 'hard',
  emotionTypes: EmotionType[]
): {
  scenario: TradingScenario;
  trader: TraderProfile;
  traderState: TraderState;
} => {
  // Get base scenario and trader that best match the criteria
  const baseScenario = getRandomScenario();
  const trader = getRandomTraderProfile();
  
  // Override scenario properties with custom values
  const customScenario: TradingScenario = {
    ...baseScenario,
    id: uuidv4(),
    marketCondition,
    timeFrame,
    assetClass,
    difficulty
  };
  
  // Force the emotional state to use one of the specified emotion types
  const primaryEmotion = emotionTypes[Math.floor(Math.random() * emotionTypes.length)];
  
  // Get trigger based on market condition
  const triggerCategory = Object.keys(emotionTriggers[marketCondition])[
    Math.floor(Math.random() * Object.keys(emotionTriggers[marketCondition]).length)
  ];
  const triggerPool = emotionTriggers[marketCondition][triggerCategory];
  const trigger = triggerPool[Math.floor(Math.random() * triggerPool.length)];
  
  // Create custom emotional state
  const emotionalState: EmotionalState = {
    primary: primaryEmotion,
    intensity: Math.floor(Math.random() * 5) + 6, // Higher intensity (6-10) for custom scenarios
    trigger,
    behaviors: emotionalBehaviors[primaryEmotion]
  };
  
  // Generate decisions with this emotional state
  const numDecisions = Math.floor(Math.random() * 3) + 3; // 3-5 decisions for custom scenarios
  const decisions: TraderDecision[] = [];
  
  for (let i = 0; i < numDecisions; i++) {
    decisions.push(generateTraderDecision(emotionalState, trader, customScenario));
  }
  
  // Calculate performance metrics
  const correctDecisions = decisions.filter(d => d.outcome === 'positive').length;
  const emotionalMistakes = decisions.filter(d => d.emotionalInfluence !== null).length;
  const profitLoss = decisions.reduce((total, d) => {
    if (d.outcome === 'positive') {
      return total + (Math.random() * 2 + 1);
    } else {
      return total - (Math.random() * 1 + 1);
    }
  }, 0);
  
  // Create trader state
  const traderState: TraderState = {
    traderId: trader.id,
    scenarioId: customScenario.id,
    currentEmotionalState: emotionalState,
    decisions,
    performance: {
      profitLoss,
      correctDecisions,
      emotionalMistakes
    }
  };
  
  return {
    scenario: customScenario,
    trader,
    traderState
  };
}; 