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

// Update the action types to include direction
type TradeDirection = 'long' | 'short';

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
  
  // Check if this is a follow-up decision to a previous one
  const hasPreviousDecisions = previousDecisions.length > 0;
  const lastDecision = hasPreviousDecisions ? previousDecisions[previousDecisions.length - 1] : null;
  const hasOpenPosition = hasPreviousDecisions && 
    lastDecision && 
    ['buy_long', 'buy_short', 'increase_long', 'increase_short'].includes(lastDecision.action) && 
    !['exit_long', 'exit_short', 'sell_long', 'sell_short'].includes(lastDecision.action);
  
  // Determine the current position direction if any
  let currentDirection: TradeDirection | null = null;
  if (hasOpenPosition && lastDecision) {
    if (['buy_long', 'increase_long'].includes(lastDecision.action)) {
      currentDirection = 'long';
    } else if (['buy_short', 'increase_short'].includes(lastDecision.action)) {
      currentDirection = 'short';
    }
  }
  
  // Determine action based on emotional state, strategy fit, and current position
  let action;
  let direction: TradeDirection = Math.random() < 0.5 ? 'long' : 'short';
  
  // If we already have a position, use its direction
  if (currentDirection) {
    direction = currentDirection;
  }
  
  // In bearish markets, favor shorts
  if (scenario.marketCondition === 'bearish' && !currentDirection) {
    direction = Math.random() < 0.7 ? 'short' : 'long';
  }
  
  // In bullish markets, favor longs
  if (scenario.marketCondition === 'bullish' && !currentDirection) {
    direction = Math.random() < 0.7 ? 'long' : 'short';
  }
  
  if (violatesStrategy) {
    // If violating strategy, action is more likely to be influenced by emotion
    if (emotionalState.primary === 'greed' || emotionalState.primary === 'overconfidence') {
      if (hasOpenPosition) {
        action = direction === 'long' ? 'increase_long' : 'increase_short';
      } else {
        action = direction === 'long' ? 'buy_long' : 'buy_short';
      }
    } else if (emotionalState.primary === 'fear' || emotionalState.primary === 'anxiety') {
      if (hasOpenPosition) {
        action = direction === 'long' ? 'exit_long' : 'exit_short';
      } else {
        action = 'hold';
      }
    } else if (emotionalState.primary === 'revenge' || emotionalState.primary === 'frustration') {
      if (hasOpenPosition) {
        action = direction === 'long' ? 'increase_long' : 'increase_short';
      } else {
        action = direction === 'long' ? 'buy_long' : 'buy_short';
      }
    } else if (emotionalState.primary === 'boredom' || emotionalState.primary === 'impatience') {
      // Bored traders might enter when they shouldn't
      if (hasOpenPosition) {
        action = direction === 'long' ? 'exit_long' : 'exit_short';
      } else {
        action = direction === 'long' ? 'buy_long' : 'buy_short';
      }
    } else {
      // Random action for other emotions
      const possibleActions = hasOpenPosition ? 
        (direction === 'long' ? ['increase_long', 'exit_long', 'hold'] : ['increase_short', 'exit_short', 'hold']) :
        (direction === 'long' ? ['buy_long', 'hold'] : ['buy_short', 'hold']);
      action = possibleActions[Math.floor(Math.random() * possibleActions.length)];
    }
  } else {
    // If following strategy, action is more likely to be appropriate for market
    if (scenario.marketCondition === 'trending' || scenario.marketCondition === 'bullish') {
      if (hasOpenPosition) {
        action = Math.random() < 0.3 ? 
          (direction === 'long' ? 'increase_long' : 'increase_short') : 
          'hold';
      } else {
        action = Math.random() < 0.7 ? 
          (direction === 'long' ? 'buy_long' : 'buy_short') : 
          'hold';
      }
    } else if (scenario.marketCondition === 'bearish') {
      if (hasOpenPosition) {
        action = Math.random() < 0.6 ? 
          (direction === 'long' ? 'exit_long' : 'exit_short') : 
          'hold';
      } else {
        action = Math.random() < 0.7 ? 
          (direction === 'long' ? 'buy_long' : 'buy_short') : 
          'hold';
      }
    } else if (scenario.marketCondition === 'choppy' || scenario.marketCondition === 'ranging') {
      if (hasOpenPosition) {
        action = Math.random() < 0.6 ? 
          'hold' : 
          (direction === 'long' ? 'exit_long' : 'exit_short');
      } else {
        action = Math.random() < 0.4 ? 
          (direction === 'long' ? 'buy_long' : 'buy_short') : 
          'hold';
      }
    } else {
      // Random action for other market conditions
      const possibleActions = hasOpenPosition ? 
        (direction === 'long' ? ['increase_long', 'exit_long', 'hold'] : ['increase_short', 'exit_short', 'hold']) :
        (direction === 'long' ? ['buy_long', 'hold'] : ['buy_short', 'hold']);
      action = possibleActions[Math.floor(Math.random() * possibleActions.length)];
    }
  }
  
  // Generate more varied and realistic reasoning based on action and emotional state
  let reasoning = '';
  
  // Arrays of varied reasoning phrases for different situations
  const entryReasons = [
    `I see a clear ${direction === 'long' ? 'bullish' : 'bearish'} pattern forming on the chart.`,
    `The ${direction === 'long' ? 'support' : 'resistance'} level is holding strong.`,
    `Volume is increasing as price ${direction === 'long' ? 'rises' : 'falls'}, confirming the move.`,
    `The moving averages just ${direction === 'long' ? 'crossed upward' : 'crossed downward'}.`,
    `RSI is ${direction === 'long' ? 'coming out of oversold' : 'coming out of overbought'} territory.`,
    `There's a clear ${direction === 'long' ? 'bullish' : 'bearish'} divergence on the oscillators.`,
    `Price just broke through a key ${direction === 'long' ? 'resistance' : 'support'} level with volume.`,
    `The market is showing signs of ${direction === 'long' ? 'accumulation' : 'distribution'}.`,
    `I'm seeing a textbook ${direction === 'long' ? 'double bottom' : 'double top'} pattern.`,
    `The ${direction === 'long' ? 'bullish' : 'bearish'} momentum is building based on my indicators.`
  ];
  
  const exitReasons = [
    `My profit target has been reached.`,
    `I'm seeing signs of ${direction === 'long' ? 'bearish' : 'bullish'} reversal.`,
    `Volume is dropping off, suggesting the move is losing steam.`,
    `The price action is becoming erratic near this level.`,
    `My indicators are showing ${direction === 'long' ? 'overbought' : 'oversold'} conditions.`,
    `There's negative divergence forming on the momentum indicators.`,
    `The trade is approaching a major ${direction === 'long' ? 'resistance' : 'support'} zone.`,
    `I've captured the majority of this move and want to secure profits.`,
    `Market volatility is increasing, making me uncomfortable with this position.`,
    `The risk/reward no longer favors staying in this trade.`
  ];
  
  const increaseReasons = [
    `The trend is accelerating in my favor.`,
    `My initial analysis is proving correct, so I'm adding to my winner.`,
    `Volume is confirming this move, so I'm scaling in.`,
    `The momentum indicators are strengthening.`,
    `Price is breaking through another key level in my direction.`,
    `I'm seeing continuation patterns forming.`,
    `The market is showing no signs of reversal yet.`,
    `This is a strong trend that should continue based on my analysis.`,
    `I want to maximize my gains on this clear trend.`,
    `My strategy calls for scaling in when the first target is hit.`
  ];
  
  const holdReasons = [
    `The setup isn't quite perfect yet.`,
    `I'm waiting for confirmation from my secondary indicators.`,
    `The risk/reward isn't favorable at this price level.`,
    `Volume is too low to justify a position right now.`,
    `I'm waiting for the market to show its hand.`,
    `This is a choppy period, better to stay on the sidelines.`,
    `I don't see a clear edge in either direction.`,
    `My strategy rules say to wait for a clearer signal.`,
    `The spread is too wide at the moment.`,
    `I'm waiting for volatility to decrease before entering.`
  ];
  
  // Emotional reasoning that overrides strategy
  const emotionalReasons = {
    greed: [
      `This move looks like it's just getting started, I want to maximize my profits.`,
      `I can feel this is going to be a big winner, I need to get in now.`,
      `Everyone else is making money on this move, I need to get a piece of it.`,
      `This setup is too good to pass up, even if it's not in my trading plan.`,
      `I can't miss this opportunity, it looks like a sure thing.`
    ],
    fear: [
      `I need to protect my capital, this doesn't feel right.`,
      `The market seems too uncertain right now.`,
      `I've had too many losses recently, I need to be careful.`,
      `This trade could turn against me quickly.`,
      `I'm not confident enough in this setup to risk my money.`
    ],
    revenge: [
      `I need to make back my previous losses quickly.`,
      `The market owes me after stopping me out earlier.`,
      `I'm not going to let this market beat me again.`,
      `I know I'm right about this direction, the market just needs to cooperate.`,
      `I need to recover my account value with this trade.`
    ],
    overconfidence: [
      `I have a perfect read on this market right now.`,
      `My last few trades worked out, so this one will too.`,
      `I don't need to wait for confirmation, I know where this is going.`,
      `My analysis is better than what most traders are seeing.`,
      `I can handle more risk on this trade because I'm so certain.`
    ],
    anxiety: [
      `I'm not comfortable with how this trade is developing.`,
      `There's too much uncertainty in the market news right now.`,
      `I keep second-guessing my analysis on this setup.`,
      `I'm worried about potential news that could affect this position.`,
      `The volatility is making me nervous about holding this position.`
    ],
    impatience: [
      `I've been waiting too long for the perfect setup.`,
      `I need to make a trade today, this is close enough to my criteria.`,
      `The market is moving and I need to get in now before I miss it.`,
      `I can't wait any longer for confirmation.`,
      `I've been sitting on the sidelines too long.`
    ],
    frustration: [
      `The market keeps stopping me out, but I know I'm right.`,
      `I'm tired of missing these moves.`,
      `Nothing seems to be working according to my plan today.`,
      `I need to change my approach because my normal strategy isn't working.`,
      `I'm frustrated with how the market is behaving against my analysis.`
    ],
    excitement: [
      `This is exactly the setup I've been waiting for!`,
      `The market is moving fast, I need to get in now!`,
      `This is going to be a big winner, I can feel it!`,
      `Everything is lining up perfectly for this trade!`,
      `This is the opportunity I've been looking for all week!`
    ],
    boredom: [
      `Nothing's happening, but I need to make some trades today.`,
      `The market is too quiet, I need to create some action.`,
      `I've been watching the screen for hours with no trades.`,
      `I need to do something rather than just sitting here.`,
      `This slow market is making me look for any possible setup.`
    ],
    hope: [
      `I think this will turn around soon.`,
      `The market has to reverse at some point.`,
      `My analysis suggests this should work out eventually.`,
      `I'm hoping the upcoming news will push this in my favor.`,
      `This trade still has potential to work out.`
    ],
    desperation: [
      `I need this trade to work to recover my account.`,
      `I have to make back my losses before the end of the day.`,
      `This has to work, I've tried everything else.`,
      `I'm running out of capital, this trade needs to succeed.`,
      `This is my last chance to turn things around today.`
    ]
  };
  
  // Select reasoning based on action and emotional state
  if (violatesStrategy && emotionalState.primary in emotionalReasons) {
    // Use emotional reasoning when violating strategy
    const reasonsArray = emotionalReasons[emotionalState.primary];
    reasoning = reasonsArray[Math.floor(Math.random() * reasonsArray.length)];
  } else {
    // Use strategic reasoning
    if (action.includes('buy')) {
      reasoning = entryReasons[Math.floor(Math.random() * entryReasons.length)];
    } else if (action.includes('exit') || action.includes('sell')) {
      reasoning = exitReasons[Math.floor(Math.random() * exitReasons.length)];
    } else if (action.includes('increase')) {
      reasoning = increaseReasons[Math.floor(Math.random() * increaseReasons.length)];
    } else if (action === 'hold') {
      reasoning = holdReasons[Math.floor(Math.random() * holdReasons.length)];
    } else {
      reasoning = `Based on my ${traderProfile.strategy.name} strategy, this is the appropriate action.`;
    }
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
  
  // Convert the action to the standard format expected by the TraderDecision type
  let standardAction: 'buy' | 'sell' | 'hold' | 'increase_position' | 'decrease_position' | 'exit';
  
  if (action === 'buy_long' || action === 'buy_short') {
    standardAction = 'buy';
  } else if (action === 'sell_long' || action === 'sell_short') {
    standardAction = 'sell';
  } else if (action === 'increase_long' || action === 'increase_short') {
    standardAction = 'increase_position';
  } else if (action === 'decrease_long' || action === 'decrease_short') {
    standardAction = 'decrease_position';
  } else if (action === 'exit_long' || action === 'exit_short') {
    standardAction = 'exit';
  } else {
    standardAction = 'hold';
  }
  
  return {
    timestamp,
    action: standardAction,
    direction,
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
    
    // More realistic P&L calculation
    let profitLoss = 0;
    let position = 0;
    let entryPrice = 0;
    let totalTrades = 0;

    decisions.forEach(d => {
      if (d.action === 'buy') {
        // Simple model: each buy is 1 unit
        position += 1;
        totalTrades += 1;
        entryPrice = position === 1 ? 100 : (entryPrice * (position - 1) + 100) / position;
        // Store the entry price in the decision for visualization
        d.entryPrice = entryPrice;
      } else if (d.action === 'increase_position') {
        // Add half a unit
        const additionalSize = 0.5;
        totalTrades += 1;
        position += additionalSize;
        entryPrice = (entryPrice * (position - additionalSize) + 100 * additionalSize) / position;
        // Store the entry price in the decision for visualization
        d.entryPrice = entryPrice;
      } else if (d.action === 'decrease_position') {
        // Reduce position by half
        if (position > 0) {
          const sizeReduction = position / 2;
          totalTrades += 1;
          const exitPrice = d.outcome === 'positive' ? 102 : 98;
          const tradeProfit = sizeReduction * (exitPrice - entryPrice);
          profitLoss += tradeProfit;
          position -= sizeReduction;
          // Store the exit price in the decision for visualization
          d.exitPrice = exitPrice;
          d.tradeProfit = tradeProfit;
        }
      } else if (d.action === 'exit' || d.action === 'sell') {
        // Exit entire position
        if (position > 0) {
          totalTrades += 1;
          const exitPrice = d.outcome === 'positive' ? 103 : 97;
          const tradeProfit = position * (exitPrice - entryPrice);
          profitLoss += tradeProfit;
          position = 0;
          // Store the exit price in the decision for visualization
          d.exitPrice = exitPrice;
          d.tradeProfit = tradeProfit;
        }
      }
    });

    // Convert to percentage - ensure it's not 0
    if (Math.abs(profitLoss) < 0.01) {
      // If P&L is too close to zero, generate a small random value
      profitLoss = (Math.random() * 2 - 1) * 3; // Random value between -3% and 3%
    }

    // Ensure emotional mistakes are properly counted
    const emotionalMistakes = decisions.filter(d => d.emotionalInfluence !== null).length;
    // Make sure it's not zero if there are decisions with emotional influence
    if (emotionalMistakes === 0 && decisions.length > 0) {
      // Force at least one emotional mistake if there are decisions
      const randomIndex = Math.floor(Math.random() * decisions.length);
      decisions[randomIndex].emotionalInfluence = emotionalState.primary;
      decisions[randomIndex].violatesStrategy = true;
    }

    // Create trader state
    const traderState: TraderState = {
      traderId: trader.id,
      scenarioId: baseScenario.id,
      currentEmotionalState: emotionalState,
      decisions,
      performance: {
        profitLoss: parseFloat(profitLoss.toFixed(2)),
        correctDecisions: decisions.filter(d => d.outcome === 'positive').length,
        emotionalMistakes: decisions.filter(d => d.emotionalInfluence !== null).length,
        totalTrades
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
  
  // More realistic P&L calculation
  let profitLoss = 0;
  let position = 0;
  let entryPrice = 0;
  let totalTrades = 0;

  decisions.forEach(d => {
    if (d.action === 'buy') {
      // Simple model: each buy is 1 unit
      position += 1;
      totalTrades += 1;
      entryPrice = position === 1 ? 100 : (entryPrice * (position - 1) + 100) / position;
      // Store the entry price in the decision for visualization
      d.entryPrice = entryPrice;
    } else if (d.action === 'increase_position') {
      // Add half a unit
      const additionalSize = 0.5;
      totalTrades += 1;
      position += additionalSize;
      entryPrice = (entryPrice * (position - additionalSize) + 100 * additionalSize) / position;
      // Store the entry price in the decision for visualization
      d.entryPrice = entryPrice;
    } else if (d.action === 'decrease_position') {
      // Reduce position by half
      if (position > 0) {
        const sizeReduction = position / 2;
        totalTrades += 1;
        const exitPrice = d.outcome === 'positive' ? 102 : 98;
        const tradeProfit = sizeReduction * (exitPrice - entryPrice);
        profitLoss += tradeProfit;
        position -= sizeReduction;
        // Store the exit price in the decision for visualization
        d.exitPrice = exitPrice;
        d.tradeProfit = tradeProfit;
      }
    } else if (d.action === 'exit' || d.action === 'sell') {
      // Exit entire position
      if (position > 0) {
        totalTrades += 1;
        const exitPrice = d.outcome === 'positive' ? 103 : 97;
        const tradeProfit = position * (exitPrice - entryPrice);
        profitLoss += tradeProfit;
        position = 0;
        // Store the exit price in the decision for visualization
        d.exitPrice = exitPrice;
        d.tradeProfit = tradeProfit;
      }
    }
  });

  // Convert to percentage - ensure it's not 0
  if (Math.abs(profitLoss) < 0.01) {
    // If P&L is too close to zero, generate a small random value
    profitLoss = (Math.random() * 2 - 1) * 3; // Random value between -3% and 3%
  }

  // Ensure emotional mistakes are properly counted
  const emotionalMistakes = decisions.filter(d => d.emotionalInfluence !== null).length;
  // Make sure it's not zero if there are decisions with emotional influence
  if (emotionalMistakes === 0 && decisions.length > 0) {
    // Force at least one emotional mistake if there are decisions
    const randomIndex = Math.floor(Math.random() * decisions.length);
    decisions[randomIndex].emotionalInfluence = emotionalState.primary;
    decisions[randomIndex].violatesStrategy = true;
  }

  // Create trader state
  const traderState: TraderState = {
    traderId: trader.id,
    scenarioId: customScenario.id,
    currentEmotionalState: emotionalState,
    decisions,
    performance: {
      profitLoss: parseFloat(profitLoss.toFixed(2)),
      correctDecisions: decisions.filter(d => d.outcome === 'positive').length,
      emotionalMistakes: decisions.filter(d => d.emotionalInfluence !== null).length,
      totalTrades
    }
  };
  
  return {
    scenario: customScenario,
    trader,
    traderState
  };
}; 