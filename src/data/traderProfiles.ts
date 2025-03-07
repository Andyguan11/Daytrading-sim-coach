import { TraderProfile, TradingStrategy } from '../models/types';

// Sample trading strategies
const strategies: TradingStrategy[] = [
  {
    name: 'Breakout Momentum',
    type: 'breakout',
    timeFrames: ['intraday', 'swing'],
    bestMarketConditions: ['trending', 'volatile'],
    worstMarketConditions: ['choppy', 'ranging'],
    description: 'Enters trades when price breaks through significant levels with increased volume',
    rules: [
      'Wait for price to break through resistance/support',
      'Confirm with volume increase',
      'Use 2:1 risk-reward ratio minimum',
      'Exit if price returns below breakout level',
      'Size position at 1% risk per trade',
      'Only trade during New York session'
    ]
  },
  {
    name: 'Mean Reversion',
    type: 'mean_reversion',
    timeFrames: ['intraday', 'scalping'],
    bestMarketConditions: ['ranging', 'choppy'],
    worstMarketConditions: ['trending', 'volatile'],
    description: 'Trades the return to average price after extreme moves',
    rules: [
      'Enter after 2 standard deviation move from mean',
      'Use technical indicators for confirmation (RSI, Bollinger)',
      'Take profit at mean/average price',
      'Cut losses if price continues in extreme direction',
      'Size position at 0.5% risk per trade',
      'No trading during major news events'
    ]
  },
  {
    name: 'Trend Following',
    type: 'trend_following',
    timeFrames: ['swing', 'position'],
    bestMarketConditions: ['trending', 'bullish', 'bearish'],
    worstMarketConditions: ['choppy', 'ranging'],
    description: 'Identifies and follows established trends',
    rules: [
      'Only enter in direction of major trend',
      'Use moving averages for trend confirmation',
      'Trail stops to lock in profits',
      'Add to position on pullbacks',
      'Size position at 2% risk per trade',
      'Hold positions for at least 3 days'
    ]
  },
  {
    name: 'News Catalyst',
    type: 'news_based',
    timeFrames: ['intraday', 'swing'],
    bestMarketConditions: ['volatile'],
    worstMarketConditions: ['ranging'],
    description: 'Trades significant price movements following news events',
    rules: [
      'Wait for news release and initial volatility to settle',
      'Enter in direction of post-news trend',
      'Use tight stops due to unpredictability',
      'Take profits quickly',
      'Size position at 0.75% risk per trade',
      'Only trade high-impact news events'
    ]
  },
  {
    name: 'Technical Scalping',
    type: 'scalping',
    timeFrames: ['scalping'],
    bestMarketConditions: ['ranging', 'trending'],
    worstMarketConditions: ['volatile', 'choppy'],
    description: 'Makes many small trades based on short-term technical patterns',
    rules: [
      'Look for small price inefficiencies',
      'Use 1:1 risk-reward ratio',
      'Exit trades within minutes',
      'Trade high-liquidity assets only',
      'Size position at 0.25% risk per trade',
      'Only trade during high volume hours'
    ]
  },
  {
    name: 'Support/Resistance Bounces',
    type: 'technical',
    timeFrames: ['intraday', 'swing'],
    bestMarketConditions: ['ranging', 'choppy'],
    worstMarketConditions: ['trending', 'volatile'],
    description: 'Trades bounces off established support and resistance levels',
    rules: [
      'Identify key support/resistance levels on multiple timeframes',
      'Enter only with confirmation candle patterns',
      'Place stops beyond the support/resistance level',
      'Take profit at next major level',
      'Size position at 1% risk per trade',
      'No trading during first 30 minutes of session'
    ]
  },
  {
    name: 'Fibonacci Retracement',
    type: 'technical',
    timeFrames: ['swing', 'position'],
    bestMarketConditions: ['trending', 'bullish', 'bearish'],
    worstMarketConditions: ['choppy', 'ranging'],
    description: 'Uses Fibonacci retracement levels to identify potential reversal points in trends',
    rules: [
      'Draw Fibonacci from significant swing high to low (or vice versa)',
      'Look for price action confirmation at key levels (38.2%, 50%, 61.8%)',
      'Enter only in direction of the main trend',
      'Place stops beyond the retracement level',
      'Size position at 1.5% risk per trade',
      'Hold for at least 24 hours'
    ]
  },
  {
    name: 'Volume Profile Trading',
    type: 'technical',
    timeFrames: ['intraday', 'swing'],
    bestMarketConditions: ['volatile', 'trending'],
    worstMarketConditions: ['ranging', 'choppy'],
    description: 'Uses volume profile to identify significant price levels with high trading activity',
    rules: [
      'Identify high volume nodes and value areas',
      'Trade breakouts from low volume areas',
      'Use volume confirmation for entries',
      'Exit at next high volume node',
      'Size position at 1% risk per trade',
      'Only trade during London or New York session'
    ]
  },
  {
    name: 'Gap Trading',
    type: 'technical',
    timeFrames: ['intraday'],
    bestMarketConditions: ['volatile'],
    worstMarketConditions: ['ranging'],
    description: 'Trades price gaps that occur between market sessions',
    rules: [
      'Identify significant overnight gaps',
      'Wait for first 30 minutes of trading before entering',
      'Trade in direction of gap fill for reversal gaps',
      'Trade in direction of gap for continuation gaps',
      'Size position at 0.5% risk per trade',
      'Exit by end of session if target not reached'
    ]
  },
  {
    name: 'Harmonic Patterns',
    type: 'technical',
    timeFrames: ['swing', 'position'],
    bestMarketConditions: ['trending', 'ranging'],
    worstMarketConditions: ['choppy', 'volatile'],
    description: 'Identifies and trades specific geometric price patterns based on Fibonacci ratios',
    rules: [
      'Identify valid harmonic patterns (Gartley, Butterfly, Bat, etc.)',
      'Enter at completion of pattern (D point)',
      'Place stop beyond pattern extreme',
      'Take profit at predefined Fibonacci extensions',
      'Size position at 1% risk per trade',
      'Confirm with other technical indicators'
    ]
  }
];

// Expanded list of trader profiles
export const traderProfiles: TraderProfile[] = [
  {
    id: 'trader1',
    name: 'Alex Thompson',
    personality: 'impulsive',
    experience: 'intermediate',
    preferredAssets: ['stocks', 'options'],
    preferredTimeFrames: ['intraday', 'scalping'],
    emotionalTendencies: ['impatience', 'overconfidence', 'excitement'],
    strategy: strategies[0], // Breakout Momentum
    strengths: ['Quick decision making', 'Pattern recognition'],
    weaknesses: ['Lacks discipline', 'Overtrades', 'Chases entries'],
    avatar: '/avatars/trader1.png'
  },
  {
    id: 'trader2',
    name: 'Sarah Chen',
    personality: 'analytical',
    experience: 'advanced',
    preferredAssets: ['futures', 'forex'],
    preferredTimeFrames: ['swing', 'intraday'],
    emotionalTendencies: ['anxiety', 'fear', 'frustration'],
    strategy: strategies[1], // Mean Reversion
    strengths: ['Thorough analysis', 'Patient', 'Good risk management'],
    weaknesses: ['Analysis paralysis', 'Cuts winners too early', 'Hesitates on entries'],
    avatar: '/avatars/trader2.png'
  },
  {
    id: 'trader3',
    name: 'Marcus Johnson',
    personality: 'aggressive',
    experience: 'expert',
    preferredAssets: ['stocks', 'options', 'futures'],
    preferredTimeFrames: ['intraday', 'scalping'],
    emotionalTendencies: ['greed', 'overconfidence', 'revenge'],
    strategy: strategies[2], // Trend Following
    strengths: ['High conviction', 'Maximizes winners', 'Adapts quickly'],
    weaknesses: ['Oversizes positions', 'Ignores stop losses', 'Takes excessive risk'],
    avatar: '/avatars/trader3.png'
  },
  {
    id: 'trader4',
    name: 'Emma Rodriguez',
    personality: 'cautious',
    experience: 'beginner',
    preferredAssets: ['stocks', 'crypto'],
    preferredTimeFrames: ['swing', 'position'],
    emotionalTendencies: ['fear', 'anxiety', 'hope'],
    strategy: strategies[3], // News Catalyst
    strengths: ['Careful planning', 'Follows rules', 'Manages risk well'],
    weaknesses: ['Misses opportunities', 'Undersizes positions', 'Lacks confidence'],
    avatar: '/avatars/trader4.png'
  },
  {
    id: 'trader5',
    name: 'David Kim',
    personality: 'patient',
    experience: 'advanced',
    preferredAssets: ['futures', 'forex', 'stocks'],
    preferredTimeFrames: ['intraday', 'swing'],
    emotionalTendencies: ['boredom', 'frustration', 'impatience'],
    strategy: strategies[4], // Technical Scalping
    strengths: ['Waits for setups', 'Disciplined', 'Consistent execution'],
    weaknesses: ['Overtrading when bored', 'Deviates from plan when frustrated', 'Impatient with winners'],
    avatar: '/avatars/trader5.png'
  },
  {
    id: 'trader6',
    name: 'Sophia Patel',
    personality: 'analytical',
    experience: 'expert',
    preferredAssets: ['stocks', 'options'],
    preferredTimeFrames: ['swing', 'position'],
    emotionalTendencies: ['anxiety', 'frustration', 'hope'],
    strategy: strategies[5], // Support/Resistance Bounces
    strengths: ['Detailed analysis', 'Systematic approach', 'Strong technical skills'],
    weaknesses: ['Overthinking', 'Hesitates at entry points', 'Second-guesses decisions'],
    avatar: '/avatars/trader6.png'
  },
  {
    id: 'trader7',
    name: 'James Wilson',
    personality: 'impulsive',
    experience: 'intermediate',
    preferredAssets: ['crypto', 'stocks'],
    preferredTimeFrames: ['scalping', 'intraday'],
    emotionalTendencies: ['excitement', 'greed', 'impatience'],
    strategy: strategies[4], // Technical Scalping
    strengths: ['Quick reactions', 'Adapts to market changes', 'High energy'],
    weaknesses: ['Lacks patience', 'Chases momentum', 'Ignores risk parameters'],
    avatar: '/avatars/trader7.png'
  },
  {
    id: 'trader8',
    name: 'Olivia Martinez',
    personality: 'cautious',
    experience: 'beginner',
    preferredAssets: ['stocks', 'etfs'],
    preferredTimeFrames: ['position', 'swing'],
    emotionalTendencies: ['fear', 'anxiety', 'desperation'],
    strategy: strategies[2], // Trend Following
    strengths: ['Risk-aware', 'Methodical', 'Follows system'],
    weaknesses: ['Exits too early', 'Misses opportunities', 'Lacks conviction'],
    avatar: '/avatars/trader8.png'
  },
  {
    id: 'trader9',
    name: 'Michael Zhang',
    personality: 'aggressive',
    experience: 'advanced',
    preferredAssets: ['futures', 'forex', 'options'],
    preferredTimeFrames: ['intraday', 'scalping'],
    emotionalTendencies: ['overconfidence', 'revenge', 'excitement'],
    strategy: strategies[3], // News Catalyst
    strengths: ['Decisive', 'High risk tolerance', 'Capitalizes on volatility'],
    weaknesses: ['Overtrading', 'Ignores stop losses', 'Revenge trades after losses'],
    avatar: '/avatars/trader9.png'
  },
  {
    id: 'trader10',
    name: 'Aiden Nakamura',
    personality: 'patient',
    experience: 'expert',
    preferredAssets: ['stocks', 'futures'],
    preferredTimeFrames: ['swing', 'position'],
    emotionalTendencies: ['boredom', 'overconfidence', 'greed'],
    strategy: strategies[6], // Fibonacci Retracement
    strengths: ['Technical precision', 'Disciplined approach', 'Long-term perspective'],
    weaknesses: ['Overcomplicates analysis', 'Misses short-term opportunities', 'Holds losers too long'],
    avatar: '/avatars/trader10.png'
  },
  {
    id: 'trader11',
    name: 'Zoe Williams',
    personality: 'impulsive',
    experience: 'beginner',
    preferredAssets: ['crypto', 'stocks'],
    preferredTimeFrames: ['scalping', 'intraday'],
    emotionalTendencies: ['excitement', 'fear', 'hope'],
    strategy: strategies[0], // Breakout Momentum
    strengths: ['Enthusiasm', 'Willing to learn', 'Adapts quickly'],
    weaknesses: ['Lacks experience', 'Emotional trading', 'Poor risk management'],
    avatar: '/avatars/trader11.png'
  },
  {
    id: 'trader12',
    name: 'Benjamin Foster',
    personality: 'analytical',
    experience: 'intermediate',
    preferredAssets: ['stocks', 'etfs'],
    preferredTimeFrames: ['swing', 'position'],
    emotionalTendencies: ['anxiety', 'frustration', 'impatience'],
    strategy: strategies[7], // Volume Profile Trading
    strengths: ['Research-oriented', 'Systematic', 'Attention to detail'],
    weaknesses: ['Analysis paralysis', 'Slow to execute', 'Overthinks simple setups'],
    avatar: '/avatars/trader12.png'
  },
  {
    id: 'trader13',
    name: 'Liam O\'Connor',
    personality: 'aggressive',
    experience: 'advanced',
    preferredAssets: ['options', 'futures'],
    preferredTimeFrames: ['intraday', 'scalping'],
    emotionalTendencies: ['greed', 'revenge', 'overconfidence'],
    strategy: strategies[8], // Gap Trading
    strengths: ['Quick decision making', 'Capitalizes on volatility', 'High risk tolerance'],
    weaknesses: ['Oversizing positions', 'Chasing entries', 'Ignoring risk management'],
    avatar: '/avatars/trader13.png'
  },
  {
    id: 'trader14',
    name: 'Aisha Khan',
    personality: 'analytical',
    experience: 'advanced',
    preferredAssets: ['stocks', 'etfs'],
    preferredTimeFrames: ['swing', 'position'],
    emotionalTendencies: ['anxiety', 'impatience', 'hope'],
    strategy: strategies[2], // Value Investing
    strengths: ['Thorough research', 'Patient approach', 'Risk management'],
    weaknesses: ['Hesitation on entries', 'Cutting winners too early', 'Overthinking'],
    avatar: '/avatars/trader14.png'
  },
  {
    id: 'trader15',
    name: 'Jamal Washington',
    personality: 'patient',
    experience: 'expert',
    preferredAssets: ['futures', 'options'],
    preferredTimeFrames: ['intraday', 'swing'],
    emotionalTendencies: ['overconfidence', 'excitement', 'frustration'],
    strategy: strategies[5], // Breakout Trading
    strengths: ['Pattern recognition', 'Quick execution', 'Disciplined approach'],
    weaknesses: ['Overtrading during volatility', 'Position sizing issues', 'FOMO on missed setups'],
    avatar: '/avatars/trader15.png'
  },
  {
    id: 'trader16',
    name: 'Sofia Rodriguez',
    personality: 'aggressive',
    experience: 'intermediate',
    preferredAssets: ['crypto', 'stocks'],
    preferredTimeFrames: ['scalping', 'intraday'],
    emotionalTendencies: ['greed', 'excitement', 'revenge'],
    strategy: strategies[4], // Momentum Trading
    strengths: ['Quick decision making', 'Trend identification', 'High energy'],
    weaknesses: ['Chasing entries', 'Ignoring stop losses', 'Overtrading'],
    avatar: '/avatars/trader16.png'
  },
  {
    id: 'trader17',
    name: 'Wei Chen',
    personality: 'analytical',
    experience: 'expert',
    preferredAssets: ['stocks', 'etfs', 'bonds'],
    preferredTimeFrames: ['position', 'swing'],
    emotionalTendencies: ['fear', 'anxiety', 'impatience'],
    strategy: strategies[1], // Mean Reversion
    strengths: ['Statistical analysis', 'Patience', 'Risk management'],
    weaknesses: ['Hesitation', 'Overthinking', 'Missing opportunities'],
    avatar: '/avatars/trader17.png'
  },
  {
    id: 'trader18',
    name: 'Priya Patel',
    personality: 'cautious',
    experience: 'intermediate',
    preferredAssets: ['stocks', 'etfs'],
    preferredTimeFrames: ['swing', 'position'],
    emotionalTendencies: ['fear', 'hope', 'anxiety'],
    strategy: strategies[0], // Trend Following
    strengths: ['Thorough research', 'Disciplined approach', 'Patience'],
    weaknesses: ['Hesitation on entries', 'Taking small profits', 'Overthinking'],
    avatar: '/avatars/trader18.png'
  },
  {
    id: 'trader19',
    name: 'Mia Robinson',
    personality: 'cautious',
    experience: 'beginner',
    preferredAssets: ['etfs', 'stocks'],
    preferredTimeFrames: ['position', 'swing'],
    emotionalTendencies: ['fear', 'anxiety', 'desperation'],
    strategy: strategies[2], // Trend Following
    strengths: ['Risk-aware', 'Follows system', 'Disciplined'],
    weaknesses: ['Lacks confidence', 'Misses opportunities', 'Undersizes positions'],
    avatar: '/avatars/trader19.png'
  },
  {
    id: 'trader20',
    name: 'Lucas Taylor',
    personality: 'patient',
    experience: 'expert',
    preferredAssets: ['stocks', 'futures'],
    preferredTimeFrames: ['swing', 'intraday'],
    emotionalTendencies: ['boredom', 'frustration', 'overconfidence'],
    strategy: strategies[5], // Support/Resistance Bounces
    strengths: ['Technical expertise', 'Disciplined', 'Consistent execution'],
    weaknesses: ['Complacency', 'Trading during low-probability periods', 'Overconfidence after wins'],
    avatar: '/avatars/trader20.png'
  },
  {
    id: 'trader21',
    name: 'Amelia Kowalski',
    personality: 'impulsive',
    experience: 'intermediate',
    preferredAssets: ['crypto', 'stocks'],
    preferredTimeFrames: ['scalping', 'intraday'],
    emotionalTendencies: ['excitement', 'impatience', 'hope'],
    strategy: strategies[8], // Gap Trading
    strengths: ['Quick reactions', 'Adaptability', 'Opportunity recognition'],
    weaknesses: ['Poor risk management', 'Chases momentum', 'Ignores trading plan'],
    avatar: '/avatars/trader21.png'
  },
  {
    id: 'trader22',
    name: 'Elijah Washington',
    personality: 'analytical',
    experience: 'advanced',
    preferredAssets: ['stocks', 'etfs'],
    preferredTimeFrames: ['position', 'swing'],
    emotionalTendencies: ['anxiety', 'frustration', 'fear'],
    strategy: strategies[9], // Harmonic Patterns
    strengths: ['Detailed analysis', 'Pattern recognition', 'Systematic approach'],
    weaknesses: ['Analysis paralysis', 'Misses simple setups', 'Overthinking'],
    avatar: '/avatars/trader22.png'
  },
  {
    id: 'trader23',
    name: 'Charlotte Davis',
    personality: 'aggressive',
    experience: 'expert',
    preferredAssets: ['options', 'futures'],
    preferredTimeFrames: ['intraday', 'scalping'],
    emotionalTendencies: ['greed', 'overconfidence', 'revenge'],
    strategy: strategies[3], // News Catalyst
    strengths: ['Decisive', 'Capitalizes on volatility', 'High risk tolerance'],
    weaknesses: ['Oversizing positions', 'Ignoring risk management', 'Revenge trading'],
    avatar: '/avatars/trader23.png'
  },
  {
    id: 'trader24',
    name: 'Henry Gupta',
    personality: 'cautious',
    experience: 'beginner',
    preferredAssets: ['stocks', 'etfs'],
    preferredTimeFrames: ['position', 'swing'],
    emotionalTendencies: ['fear', 'anxiety', 'hope'],
    strategy: strategies[2], // Trend Following
    strengths: ['Risk-aware', 'Follows system', 'Disciplined'],
    weaknesses: ['Lacks confidence', 'Exits too early', 'Misses opportunities'],
    avatar: '/avatars/trader24.png'
  },
  {
    id: 'trader25',
    name: 'Scarlett Murphy',
    personality: 'patient',
    experience: 'intermediate',
    preferredAssets: ['stocks', 'futures'],
    preferredTimeFrames: ['swing', 'intraday'],
    emotionalTendencies: ['boredom', 'impatience', 'frustration'],
    strategy: strategies[7], // Volume Profile Trading
    strengths: ['Technical expertise', 'Disciplined', 'Consistent execution'],
    weaknesses: ['Overtrading when bored', 'Trading during low-probability periods', 'Deviating from plan'],
    avatar: '/avatars/trader25.png'
  }
];

// Function to get a random trader profile
export const getRandomTraderProfile = (): TraderProfile => {
  const randomIndex = Math.floor(Math.random() * traderProfiles.length);
  return traderProfiles[randomIndex];
};

// Function to get a trader profile by ID
export const getTraderProfileById = (id: string): TraderProfile | undefined => {
  return traderProfiles.find(trader => trader.id === id);
}; 