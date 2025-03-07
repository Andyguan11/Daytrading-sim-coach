import { TradingScenario, PriceAction, NewsEvent } from '../models/types';

// Helper function to generate price action data
const generatePriceAction = (
  basePrice: number, 
  volatility: number, 
  trend: number, 
  points: number
): PriceAction[] => {
  const priceAction: PriceAction[] = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < points; i++) {
    // Add random noise + trend component
    const randomChange = (Math.random() - 0.5) * volatility;
    const trendChange = trend * (i / points);
    currentPrice = currentPrice + randomChange + trendChange;
    
    // Ensure price doesn't go negative
    currentPrice = Math.max(currentPrice, 0.01);
    
    // Generate random volume
    const volume = Math.floor(Math.random() * 10000) + 1000;
    
    // Create timestamp (for demo purposes, using relative time)
    const timestamp = `2023-09-${String(i + 1).padStart(2, '0')}T${String(Math.floor(i / 4) + 9).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}:00`;
    
    priceAction.push({
      timestamp,
      price: parseFloat(currentPrice.toFixed(2)),
      volume,
    });
  }
  
  return priceAction;
};

// Sample trading scenarios
export const tradingScenarios: TradingScenario[] = [
  {
    id: 'scenario1',
    title: 'Earnings Surprise Reaction',
    description: 'A stock has just reported earnings that beat expectations, causing a gap up and continued momentum.',
    marketCondition: 'bullish',
    timeFrame: 'intraday',
    assetClass: 'stocks',
    priceAction: generatePriceAction(100, 2, 15, 20), // Starting at $100, moderate volatility, strong uptrend
    newsEvents: [
      {
        timestamp: '2023-09-01T09:00:00',
        headline: 'XYZ Corp Beats Earnings Expectations by 20%',
        impact: 'high',
        description: 'XYZ Corporation reported quarterly earnings of $1.20 per share, significantly above analyst estimates of $1.00.'
      },
      {
        timestamp: '2023-09-01T10:30:00',
        headline: 'Analysts Upgrade XYZ Corp to "Strong Buy"',
        impact: 'medium',
        description: 'Multiple analysts have upgraded their outlook on XYZ following the strong earnings report.'
      }
    ],
    idealBehaviors: ['trading_without_edge', 'deviation_from_plan'],
    commonMistakes: ['chasing_entries', 'oversizing', 'overtrading'],
    difficulty: 'medium'
  },
  {
    id: 'scenario2',
    title: 'Failed Breakout Trap',
    description: 'A stock appears to break out above resistance but quickly reverses, trapping breakout traders.',
    marketCondition: 'choppy',
    timeFrame: 'intraday',
    assetClass: 'stocks',
    priceAction: (() => {
      // Create a failed breakout pattern
      const baseData = generatePriceAction(50, 1, 5, 10); // Initial uptrend
      const breakout = generatePriceAction(baseData[baseData.length-1].price, 2, 3, 3); // Brief breakout
      const reversal = generatePriceAction(breakout[breakout.length-1].price, 2, -10, 7); // Sharp reversal
      
      // Combine the arrays and adjust timestamps
      return [...baseData, ...breakout, ...reversal];
    })(),
    newsEvents: [
      {
        timestamp: '2023-09-05T11:15:00',
        headline: 'ABC Stock Testing Key Resistance Level',
        impact: 'low',
        description: 'Technical analysts note ABC is approaching a significant resistance level at $55.'
      }
    ],
    idealBehaviors: ['deviation_from_plan', 'ignoring_risk_management'],
    commonMistakes: ['letting_losers_run', 'averaging_down', 'moving_stop_loss'],
    difficulty: 'hard'
  },
  {
    id: 'scenario3',
    title: 'Range-Bound Consolidation',
    description: 'A market that has been trading in a tight range for several days, causing frustration for trend traders.',
    marketCondition: 'ranging',
    timeFrame: 'swing',
    assetClass: 'futures',
    priceAction: generatePriceAction(1000, 15, 0, 30), // High base price (futures), moderate volatility, no trend
    newsEvents: [
      {
        timestamp: '2023-09-10T08:30:00',
        headline: 'Fed Signals No Change in Interest Rate Policy',
        impact: 'medium',
        description: 'Federal Reserve minutes indicate no change in monetary policy is expected in the near term.'
      }
    ],
    idealBehaviors: ['hesitation', 'deviation_from_plan'],
    commonMistakes: ['overtrading', 'trading_without_edge', 'chasing_entries'],
    difficulty: 'medium'
  },
  {
    id: 'scenario4',
    title: 'Flash Crash Recovery',
    description: 'A sudden market-wide selloff occurs, followed by a rapid recovery, testing traders\' emotional control.',
    marketCondition: 'volatile',
    timeFrame: 'intraday',
    assetClass: 'stocks',
    priceAction: (() => {
      // Create a flash crash pattern
      const baseData = generatePriceAction(200, 2, 0, 5); // Stable start
      const crash = generatePriceAction(baseData[baseData.length-1].price, 5, -40, 5); // Sharp crash
      const recovery = generatePriceAction(crash[crash.length-1].price, 4, 30, 10); // Recovery
      
      // Combine the arrays
      return [...baseData, ...crash, ...recovery];
    })(),
    newsEvents: [
      {
        timestamp: '2023-09-15T13:45:00',
        headline: 'Algorithmic Selling Triggers Market-Wide Circuit Breakers',
        impact: 'high',
        description: 'Trading halted temporarily as circuit breakers triggered by massive algorithmic selling pressure.'
      },
      {
        timestamp: '2023-09-15T14:15:00',
        headline: 'Markets Recovering as Selling Pressure Subsides',
        impact: 'medium',
        description: 'Buyers stepping in after the flash crash, pushing prices back toward previous levels.'
      }
    ],
    idealBehaviors: ['hesitation', 'deviation_from_plan'],
    commonMistakes: ['cutting_winners_early', 'overtrading', 'deviation_from_plan'],
    difficulty: 'hard'
  },
  {
    id: 'scenario5',
    title: 'Strong Trend Day',
    description: 'A market that is trending strongly in one direction all day, providing multiple entry opportunities.',
    marketCondition: 'trending',
    timeFrame: 'intraday',
    assetClass: 'forex',
    priceAction: generatePriceAction(1.2000, 0.0020, 0.0150, 24), // EUR/USD style pricing
    newsEvents: [
      {
        timestamp: '2023-09-20T08:30:00',
        headline: 'Eurozone Economic Data Exceeds Expectations',
        impact: 'high',
        description: 'Multiple economic indicators from the Eurozone came in stronger than expected, boosting the Euro.'
      }
    ],
    idealBehaviors: ['hesitation', 'deviation_from_plan'],
    commonMistakes: ['cutting_winners_early', 'hesitation', 'deviation_from_plan'],
    difficulty: 'easy'
  }
];

// Function to get a random scenario
export const getRandomScenario = (): TradingScenario => {
  const randomIndex = Math.floor(Math.random() * tradingScenarios.length);
  return tradingScenarios[randomIndex];
};

// Function to get a scenario by ID
export const getScenarioById = (id: string): TradingScenario | undefined => {
  return tradingScenarios.find(scenario => scenario.id === id);
};

// Function to get scenarios filtered by criteria
export const getFilteredScenarios = (
  marketCondition?: string,
  timeFrame?: string,
  assetClass?: string,
  difficulty?: string
): TradingScenario[] => {
  return tradingScenarios.filter(scenario => {
    let match = true;
    
    if (marketCondition && scenario.marketCondition !== marketCondition) {
      match = false;
    }
    
    if (timeFrame && scenario.timeFrame !== timeFrame) {
      match = false;
    }
    
    if (assetClass && scenario.assetClass !== assetClass) {
      match = false;
    }
    
    if (difficulty && scenario.difficulty !== difficulty) {
      match = false;
    }
    
    return match;
  });
}; 