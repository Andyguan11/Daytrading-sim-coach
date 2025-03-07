// Market-related types
export type MarketCondition = 'bullish' | 'bearish' | 'choppy' | 'trending' | 'volatile' | 'ranging';
export type TimeFrame = 'scalping' | 'intraday' | 'swing' | 'position';
export type AssetClass = 'stocks' | 'futures' | 'forex' | 'crypto' | 'options' | 'etfs' | 'bonds';

// Trader profile types
export type TraderPersonality = 'impulsive' | 'analytical' | 'cautious' | 'aggressive' | 'patient';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Emotional states that can affect trading
export type EmotionalState = {
  primary: EmotionType;
  intensity: number; // 1-10 scale
  trigger: string;
  behaviors: TradingBehavior[];
};

export type EmotionType = 
  | 'fear' 
  | 'greed' 
  | 'revenge' 
  | 'overconfidence' 
  | 'anxiety' 
  | 'impatience'
  | 'frustration'
  | 'excitement'
  | 'boredom'
  | 'hope'
  | 'desperation';

export type TradingBehavior = 
  | 'oversizing' 
  | 'cutting_winners_early' 
  | 'letting_losers_run' 
  | 'averaging_down' 
  | 'chasing_entries'
  | 'overtrading'
  | 'hesitation'
  | 'deviation_from_plan'
  | 'ignoring_risk_management'
  | 'moving_stop_loss'
  | 'trading_without_edge';

// Trading strategy types
export type StrategyType = 
  | 'trend_following' 
  | 'mean_reversion' 
  | 'breakout' 
  | 'momentum' 
  | 'scalping'
  | 'swing'
  | 'position'
  | 'news_based'
  | 'technical'
  | 'fundamental';

export interface TradingStrategy {
  name: string;
  type: StrategyType;
  timeFrames: TimeFrame[];
  bestMarketConditions: MarketCondition[];
  worstMarketConditions: MarketCondition[];
  description: string;
  rules: string[];
}

// Trader profile
export interface TraderProfile {
  id: string;
  name: string;
  personality: TraderPersonality;
  experience: ExperienceLevel;
  preferredAssets: AssetClass[];
  preferredTimeFrames: TimeFrame[];
  emotionalTendencies: EmotionType[];
  strategy: TradingStrategy;
  strengths: string[];
  weaknesses: string[];
  avatar: string; // path to avatar image
}

// Trading scenario
export interface TradingScenario {
  id: string;
  title: string;
  description: string;
  marketCondition: MarketCondition;
  timeFrame: TimeFrame;
  assetClass: AssetClass;
  priceAction: PriceAction[];
  newsEvents: NewsEvent[];
  idealBehaviors: TradingBehavior[];
  commonMistakes: TradingBehavior[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PriceAction {
  timestamp: string;
  price: number;
  volume: number;
  description?: string;
}

export interface NewsEvent {
  timestamp: string;
  headline: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
}

// Trader state during a scenario
export interface TraderState {
  traderId: string;
  scenarioId: string;
  currentEmotionalState: EmotionalState;
  decisions: TraderDecision[];
  performance: {
    profitLoss: number;
    correctDecisions: number;
    emotionalMistakes: number;
    totalTrades: number;
  };
}

export interface TraderDecision {
  timestamp: string;
  action: 'buy' | 'sell' | 'hold' | 'increase_position' | 'decrease_position' | 'exit';
  direction?: 'long' | 'short';
  reasoning: string;
  emotionalInfluence: EmotionType | null;
  violatesStrategy: boolean;
  outcome: 'positive' | 'negative' | 'neutral';
  session?: 'Asian' | 'London' | 'New York' | 'Overnight';
  entryPrice?: number;
  exitPrice?: number;
  tradeProfit?: number;
}

// User coaching and journal
export interface CoachingSession {
  id: string;
  scenarioId: string;
  traderId: string;
  userIdentifiedIssues: {
    emotionalState: EmotionType;
    behaviors: TradingBehavior[];
    advice: string;
  }[];
  score: number;
  feedback: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  trades: {
    symbol: string;
    entry: number;
    exit: number;
    size: number;
    direction: 'long' | 'short';
    result: number;
    strategy: string;
    emotionalStates: EmotionalState[];
    notes: string;
  }[];
  overallMood: string;
  lessonsLearned: string;
  goalsForNextSession: string;
} 