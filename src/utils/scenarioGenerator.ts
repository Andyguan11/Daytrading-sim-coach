import { 
  TradingScenario, 
  TraderProfile, 
  TraderState, 
  EmotionalState, 
  EmotionType, 
  TradingBehavior,
  MarketCondition,
  TimeFrame,
  AssetClass,
  TraderDecision
} from '../models/types';
import { getRandomTraderProfile } from '../data/traderProfiles';
import { getRandomScenario } from '../data/tradingScenarios';
import { v4 as uuidv4 } from 'uuid';

// Trading sessions
type TradingSession = 'Asian' | 'London' | 'New York' | 'Overnight';

// Rule violations
type RuleViolation = 
  | 'trading_outside_session'
  | 'trading_during_news'
  | 'ignoring_market_condition'
  | 'trading_wrong_timeframe'
  | 'breaking_risk_parameters'
  | 'trading_without_confirmation'
  | 'ignoring_stop_loss'
  | 'moving_profit_target'
  | 'averaging_into_losers'
  | 'trading_revenge'
  | 'trading_boredom'
  | 'trading_fomo'
  | 'cutting_winners_early';

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
    ],
    greed: [
      'Account up significantly for the day',
      'Several winning trades in a row',
      'Position showing large unrealized gains'
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
    ],
    anxiety: [
      'Positions moving against you rapidly',
      'Uncertainty about market direction',
      'Fear of further losses'
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
    ],
    impatience: [
      'Waiting for confirmation that never comes',
      'Entering before setup is complete',
      'Jumping between different strategies'
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
    ],
    overconfidence: [
      'Believing you\'ve mastered the market',
      'Ignoring warning signs of trend exhaustion',
      'Taking trades outside your plan'
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
    ],
    fear: [
      'Extreme volatility causing large swings in P&L',
      'News-driven market with unpredictable moves',
      'Stop losses getting hit due to wide ranges'
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
    ],
    frustration: [
      'Multiple failed breakout attempts',
      'Getting chopped up at range extremes',
      'Missing the eventual breakout'
    ]
  }
};

// Trading sessions with their characteristics
const tradingSessions: Record<TradingSession, {
  hours: string,
  volatility: 'low' | 'medium' | 'high',
  volume: 'low' | 'medium' | 'high',
  bestFor: string[]
}> = {
  'Asian': {
    hours: '19:00-02:00 EST',
    volatility: 'low',
    volume: 'low',
    bestFor: ['ranging', 'technical patterns', 'forex pairs with JPY/AUD']
  },
  'London': {
    hours: '03:00-11:00 EST',
    volatility: 'medium',
    volume: 'high',
    bestFor: ['forex', 'European stocks', 'breakouts']
  },
  'New York': {
    hours: '09:30-16:00 EST',
    volatility: 'high',
    volume: 'high',
    bestFor: ['US stocks', 'futures', 'news-driven moves']
  },
  'Overnight': {
    hours: '16:00-09:30 EST',
    volatility: 'medium',
    volume: 'low',
    bestFor: ['gap plays', 'futures', 'global news reactions']
  }
};

// Common rule violations based on emotional state
const commonRuleViolations: Record<EmotionType, RuleViolation[]> = {
  fear: ['ignoring_market_condition', 'cutting_winners_early', 'trading_without_confirmation'],
  greed: ['breaking_risk_parameters', 'ignoring_stop_loss', 'moving_profit_target'],
  revenge: ['trading_revenge', 'breaking_risk_parameters', 'trading_outside_session'],
  overconfidence: ['ignoring_market_condition', 'breaking_risk_parameters', 'trading_wrong_timeframe'],
  anxiety: ['trading_without_confirmation', 'cutting_winners_early', 'ignoring_market_condition'],
  impatience: ['trading_without_confirmation', 'trading_boredom', 'ignoring_market_condition'],
  frustration: ['trading_revenge', 'ignoring_stop_loss', 'trading_boredom'],
  excitement: ['trading_fomo', 'breaking_risk_parameters', 'trading_outside_session'],
  boredom: ['trading_boredom', 'trading_wrong_timeframe', 'trading_during_news'],
  hope: ['averaging_into_losers', 'moving_profit_target', 'ignoring_stop_loss'],
  desperation: ['trading_revenge', 'breaking_risk_parameters', 'averaging_into_losers']
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

// Generate a random emotional state based on market condition and trader profile
const generateEmotionalState = (
  marketCondition: MarketCondition,
  traderProfile: TraderProfile,
  session: TradingSession
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
  scenario: TradingScenario,
  session: TradingSession,
  previousDecisions: TraderDecision[] = []
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
  
  // Check if this is a follow-up decision to a previous one
  const hasPreviousDecisions = previousDecisions.length > 0;
  const lastDecision = hasPreviousDecisions ? previousDecisions[previousDecisions.length - 1] : null;
  const hasOpenPosition = hasPreviousDecisions && 
    lastDecision && 
    ['buy', 'increase_position'].includes(lastDecision.action) && 
    !['exit', 'sell'].includes(lastDecision.action);
  
  if (violatesStrategy) {
    // If violating strategy, action is more likely to be influenced by emotion
    if (emotionalState.primary === 'greed' || emotionalState.primary === 'overconfidence') {
      action = hasOpenPosition ? 'increase_position' : 'buy';
    } else if (emotionalState.primary === 'fear' || emotionalState.primary === 'anxiety') {
      action = hasOpenPosition ? 'decrease_position' : 'exit';
    } else if (emotionalState.primary === 'revenge' || emotionalState.primary === 'frustration') {
      action = hasOpenPosition ? 'increase_position' : 'buy';
    } else if (emotionalState.primary === 'boredom' || emotionalState.primary === 'impatience') {
      // Bored traders might enter when they shouldn't
      action = Math.random() < 0.7 ? 'buy' : 'sell';
    } else {
      // Random action for other emotions
      action = actions[Math.floor(Math.random() * actions.length)];
    }
  } else {
    // If following strategy, action is more likely to be appropriate for market
    if (scenario.marketCondition === 'trending' || scenario.marketCondition === 'bullish') {
      action = hasOpenPosition ? 
        (Math.random() < 0.3 ? 'increase_position' : 'hold') : 
        (Math.random() < 0.7 ? 'buy' : 'hold');
    } else if (scenario.marketCondition === 'bearish') {
      action = hasOpenPosition ? 
        (Math.random() < 0.6 ? 'decrease_position' : 'exit') : 
        (Math.random() < 0.7 ? 'sell' : 'hold');
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
    } else if (emotionalState.primary === 'boredom') {
      reasoning = 'Nothing\'s happening, but I need to make some trades today.';
    } else if (emotionalState.primary === 'impatience') {
      reasoning = 'I can\'t wait any longer for the perfect setup.';
    } else if (emotionalState.primary === 'anxiety') {
      reasoning = 'I\'m not comfortable with this position size.';
    } else if (emotionalState.primary === 'frustration') {
      reasoning = 'The market keeps stopping me out, but I know I\'m right.';
    } else if (emotionalState.primary === 'excitement') {
      reasoning = 'This is moving fast, I need to get in now!';
    } else if (emotionalState.primary === 'hope') {
      reasoning = 'I think this will turn around soon.';
    } else if (emotionalState.primary === 'desperation') {
      reasoning = 'I need this trade to work to recover my account.';
    } else {
      reasoning = 'This feels like the right move right now.';
    }
  } else {
    // Strategy-based reasoning
    reasoning = `Based on my ${traderProfile.strategy.name} strategy, this is the appropriate action.`;
  }
  
  // Add session-specific context to reasoning
  if (session === 'Asian' && !traderProfile.strategy.rules.some(rule => rule.includes('Asian'))) {
    reasoning += ' Trading during Asian session for extra opportunities.';
  } else if (session === 'Overnight' && !traderProfile.strategy.rules.some(rule => rule.includes('Overnight'))) {
    reasoning += ' Taking advantage of overnight moves.';
  }
  
  // Determine outcome (more likely to be negative if violating strategy)
  const successProbability = violatesStrategy ? 0.3 : 0.7;
  const outcome = Math.random() < successProbability ? 'positive' : 'negative';
  
  // Generate a timestamp based on the trading session
  let hour = 0;
  let minute = Math.floor(Math.random() * 60);
  
  switch(session) {
    case 'Asian':
      hour = Math.floor(Math.random() * 7) + 19; // 19:00 - 02:00 EST
      if (hour > 23) hour -= 24;
      break;
    case 'London':
      hour = Math.floor(Math.random() * 8) + 3; // 03:00 - 11:00 EST
      break;
    case 'New York':
      hour = Math.floor(Math.random() * 6.5) + 9.5; // 09:30 - 16:00 EST
      break;
    case 'Overnight':
      const isLateEvening = Math.random() < 0.5;
      hour = isLateEvening ? 
        Math.floor(Math.random() * 5) + 16 : // 16:00 - 21:00 EST
        Math.floor(Math.random() * 9); // 00:00 - 09:00 EST
      break;
  }
  
  const hourStr = String(Math.floor(hour)).padStart(2, '0');
  const minuteStr = String(minute).padStart(2, '0');
  const timestamp = `2023-09-01T${hourStr}:${minuteStr}:00`;
  
  // Ensure action is one of the allowed types
  const validAction = action as 'buy' | 'sell' | 'hold' | 'increase_position' | 'decrease_position' | 'exit';
  
  return {
    timestamp,
    action: validAction,
    reasoning,
    emotionalInfluence: violatesStrategy ? emotionalState.primary : null,
    violatesStrategy,
    outcome,
    session
  };
};

// Generate a complete randomized scenario with trader state
export const generateRandomScenario = (): {
  scenario: TradingScenario;
  trader: TraderProfile;
  traderState: TraderState;
} => {
  try {
    // Get base scenario and trader
    const baseScenario = getRandomScenario();
    if (!baseScenario) {
      throw new Error('Failed to get random scenario');
    }
    
    const trader = getRandomTraderProfile();
    if (!trader) {
      throw new Error('Failed to get random trader profile');
    }
    
    // Randomly select a trading session
    const sessions: TradingSession[] = ['Asian', 'London', 'New York', 'Overnight'];
    const primarySession = sessions[Math.floor(Math.random() * sessions.length)];
    
    // Randomly decide if trader will trade in multiple sessions
    const useMultipleSessions = Math.random() < 0.4; // 40% chance
    let secondarySession: TradingSession | null = null;
    
    if (useMultipleSessions) {
      // Pick a different session
      const availableSessions = sessions.filter(s => s !== primarySession);
      secondarySession = availableSessions[Math.floor(Math.random() * availableSessions.length)];
    }
    
    // Generate emotional state based on market condition and trader profile
    const emotionalState = generateEmotionalState(baseScenario.marketCondition, trader, primarySession);
    
    // Generate a series of decisions
    const numDecisions = Math.floor(Math.random() * 4) + 3; // 3-6 decisions
    const decisions: TraderDecision[] = [];
    
    for (let i = 0; i < numDecisions; i++) {
      // Determine which session this decision happens in
      const currentSession = (secondarySession && i > numDecisions / 2) ? secondarySession : primarySession;
      
      const decision = generateTraderDecision(
        emotionalState, 
        trader, 
        baseScenario, 
        currentSession,
        decisions
      );
      
      if (decision) {
        decisions.push(decision);
      }
    }
    
    // Calculate performance metrics
    const correctDecisions = decisions.filter(d => d.outcome === 'positive').length;
    const emotionalMistakes = decisions.filter(d => d.emotionalInfluence !== null).length;
    
    // More realistic P&L calculation
    let profitLoss = 0;
    let position = 0;
    let entryPrice = 0;
    
    decisions.forEach(d => {
      if (d.action === 'buy') {
        // Simple model: each buy is 1 unit
        position += 1;
        entryPrice = position === 1 ? 100 : (entryPrice * (position - 1) + 100) / position;
      } else if (d.action === 'increase_position') {
        // Add half a unit
        const additionalSize = 0.5;
        position += additionalSize;
        entryPrice = (entryPrice * (position - additionalSize) + 100 * additionalSize) / position;
      } else if (d.action === 'decrease_position') {
        // Reduce position by half
        if (position > 0) {
          const sizeReduction = position / 2;
          const exitPrice = d.outcome === 'positive' ? 102 : 98;
          profitLoss += sizeReduction * (exitPrice - entryPrice);
          position -= sizeReduction;
        }
      } else if (d.action === 'exit' || d.action === 'sell') {
        // Exit entire position
        if (position > 0) {
          const exitPrice = d.outcome === 'positive' ? 103 : 97;
          profitLoss += position * (exitPrice - entryPrice);
          position = 0;
        }
      }
    });
    
    // Convert to percentage
    profitLoss = parseFloat((profitLoss).toFixed(2));
    
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
  } catch (error) {
    console.error('Error in generateRandomScenario:', error);
    throw error;
  }
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
  
  // Randomly select a trading session
  const sessions: TradingSession[] = ['Asian', 'London', 'New York', 'Overnight'];
  const primarySession = sessions[Math.floor(Math.random() * sessions.length)];
  
  // Randomly decide if trader will trade in multiple sessions
  const useMultipleSessions = Math.random() < 0.4; // 40% chance
  let secondarySession: TradingSession | null = null;
  
  if (useMultipleSessions) {
    // Pick a different session
    const availableSessions = sessions.filter(s => s !== primarySession);
    secondarySession = availableSessions[Math.floor(Math.random() * availableSessions.length)];
  }
  
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
    // Determine which session this decision happens in
    const currentSession = (secondarySession && i > numDecisions / 2) ? secondarySession : primarySession;
    
    decisions.push(generateTraderDecision(
      emotionalState, 
      trader, 
      customScenario, 
      currentSession,
      decisions
    ));
  }
  
  // Calculate performance metrics
  const correctDecisions = decisions.filter(d => d.outcome === 'positive').length;
  const emotionalMistakes = decisions.filter(d => d.emotionalInfluence !== null).length;
  
  // More realistic P&L calculation
  let profitLoss = 0;
  let position = 0;
  let entryPrice = 0;
  
  decisions.forEach(d => {
    if (d.action === 'buy') {
      // Simple model: each buy is 1 unit
      position += 1;
      entryPrice = position === 1 ? 100 : (entryPrice * (position - 1) + 100) / position;
    } else if (d.action === 'increase_position') {
      // Add half a unit
      const additionalSize = 0.5;
      position += additionalSize;
      entryPrice = (entryPrice * (position - additionalSize) + 100 * additionalSize) / position;
    } else if (d.action === 'decrease_position') {
      // Reduce position by half
      if (position > 0) {
        const sizeReduction = position / 2;
        const exitPrice = d.outcome === 'positive' ? 102 : 98;
        profitLoss += sizeReduction * (exitPrice - entryPrice);
        position -= sizeReduction;
      }
    } else if (d.action === 'exit' || d.action === 'sell') {
      // Exit entire position
      if (position > 0) {
        const exitPrice = d.outcome === 'positive' ? 103 : 97;
        profitLoss += position * (exitPrice - entryPrice);
        position = 0;
      }
    }
  });
  
  // Convert to percentage
  profitLoss = parseFloat((profitLoss).toFixed(2));
  
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