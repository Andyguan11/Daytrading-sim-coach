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
      'Size position at 1% risk per trade'
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
      'Size position at 0.5% risk per trade'
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
      'Size position at 2% risk per trade'
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
      'Size position at 0.75% risk per trade'
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
      'Size position at 0.25% risk per trade'
    ]
  }
];

// Sample trader profiles
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