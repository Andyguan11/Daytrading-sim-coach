import React from 'react';
import { TraderDecision } from '../models/types';

interface TradingChartProps {
  decisions: TraderDecision[];
}

const TradingChart: React.FC<TradingChartProps> = ({ decisions }) => {
  if (!decisions || decisions.length === 0) {
    return (
      <div className="w-full">
        <div className="text-lg font-semibold mb-2">Trade Visualization</div>
        <div className="w-full h-[400px] border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">No trading data available to visualize</p>
        </div>
      </div>
    );
  }

  // Sort decisions by timestamp
  const sortedDecisions = [...decisions].sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  // Filter out only buy/sell/exit decisions (no holds)
  const tradeDecisions = sortedDecisions.filter(
    d => d.action === 'buy' || d.action === 'sell' || d.action === 'increase_position' || 
    d.action === 'decrease_position' || d.action === 'exit'
  );

  // Generate price data for visualization
  const generatePriceData = () => {
    const data = [];
    let basePrice = 100;
    
    for (let i = 0; i < 24; i++) {
      // Generate a price point for each hour of the day
      const hour = i;
      const hourStr = String(hour).padStart(2, '0');
      
      // Add some random noise to the price
      const noise = (Math.random() - 0.5) * 2;
      basePrice += noise;
      
      data.push({
        time: `2023-09-01T${hourStr}:00:00`,
        price: parseFloat(basePrice.toFixed(2))
      });
    }
    
    return data;
  };
  
  const priceData = generatePriceData();
  
  // Find min and max prices for scaling
  const prices = priceData.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.99;
  const maxPrice = Math.max(...prices) * 1.01;
  const priceRange = maxPrice - minPrice;

  return (
    <div className="w-full">
      <div className="text-lg font-semibold mb-2">Trade Visualization</div>
      
      {/* Price Chart with Trade Points */}
      <div className="w-full h-[400px] border border-gray-200 rounded-lg p-4 overflow-auto">
        <div className="relative h-[300px] w-full">
          {/* Price line */}
          <svg className="absolute inset-0 w-full h-full">
            <polyline
              points={priceData.map((point, index) => {
                const x = (index / (priceData.length - 1)) * 100;
                const y = 100 - ((point.price - minPrice) / priceRange) * 100;
                return `${x}%,${y}%`;
              }).join(' ')}
              fill="none"
              stroke="#2962FF"
              strokeWidth="2"
            />
          </svg>
          
          {/* Trade markers */}
          {tradeDecisions.map((decision, index) => {
            if (!decision.timestamp) return null;
            
            const time = new Date(decision.timestamp);
            const hour = time.getHours();
            const minute = time.getMinutes();
            
            // Find the closest price point
            const hourIndex = hour;
            if (hourIndex >= priceData.length) return null;
            
            // Calculate position
            const x = (hourIndex / (priceData.length - 1)) * 100;
            
            // Use actual trade price if available, otherwise use the price from our generated data
            const price = decision.entryPrice || decision.exitPrice || priceData[hourIndex].price;
            const y = 100 - ((price - minPrice) / priceRange) * 100;
            
            // Determine marker style based on action
            let markerColor = 'gray';
            let markerSymbol = '●';
            
            if (decision.action === 'buy' || decision.action === 'increase_position') {
              markerColor = 'green';
              markerSymbol = '▲';
            } else if (decision.action === 'sell' || decision.action === 'exit' || decision.action === 'decrease_position') {
              markerColor = 'red';
              markerSymbol = '▼';
            }
            
            return (
              <div 
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`,
                  color: markerColor
                }}
              >
                <div className="text-xl font-bold">{markerSymbol}</div>
              </div>
            );
          })}
          
          {/* Price labels */}
          <div className="absolute right-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
            <div>{maxPrice.toFixed(2)}</div>
            <div>{((maxPrice + minPrice) / 2).toFixed(2)}</div>
            <div>{minPrice.toFixed(2)}</div>
          </div>
          
          {/* Time labels */}
          <div className="absolute left-0 right-16 bottom-[-20px] flex justify-between text-xs text-gray-500">
            {[0, 6, 12, 18, 23].map(hour => (
              <div key={hour}>{`${hour}:00`}</div>
            ))}
          </div>
        </div>
        
        {/* Trade Details Table */}
        <div className="mt-8">
          <h3 className="text-md font-medium mb-2">Trade Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tradeDecisions.map((decision, index) => {
                  const time = new Date(decision.timestamp);
                  const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
                  
                  // Determine price to display
                  let priceDisplay = '-';
                  if (decision.action === 'buy' || decision.action === 'increase_position') {
                    priceDisplay = decision.entryPrice ? `$${decision.entryPrice.toFixed(2)}` : '-';
                  } else if (decision.action === 'sell' || decision.action === 'exit' || decision.action === 'decrease_position') {
                    priceDisplay = decision.exitPrice ? `$${decision.exitPrice.toFixed(2)}` : '-';
                  }
                  
                  // Determine P&L to display
                  let plDisplay = '-';
                  if (decision.tradeProfit) {
                    const isPositive = decision.tradeProfit > 0;
                    plDisplay = `${isPositive ? '+' : ''}$${decision.tradeProfit.toFixed(2)}`;
                  }
                  
                  return (
                    <tr key={index} className={decision.violatesStrategy ? 'bg-red-50' : ''}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{formattedTime}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{decision.session || 'N/A'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          decision.action === 'buy' || decision.action === 'increase_position' 
                            ? 'bg-green-100 text-green-800' 
                            : decision.action === 'sell' || decision.action === 'exit' || decision.action === 'decrease_position'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {decision.action.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{priceDisplay}</td>
                      <td className={`px-3 py-2 whitespace-nowrap text-sm ${
                        decision.tradeProfit && decision.tradeProfit > 0 
                          ? 'text-green-600 font-medium' 
                          : decision.tradeProfit && decision.tradeProfit < 0
                          ? 'text-red-600 font-medium'
                          : ''
                      }`}>{plDisplay}</td>
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
        </div>
      </div>
    </div>
  );
};

export default TradingChart; 