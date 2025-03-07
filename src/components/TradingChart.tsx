import React, { useEffect, useRef } from 'react';
import { TraderDecision } from '../models/types';
import { createChart, IChartApi, SeriesType } from 'lightweight-charts';

interface TradingChartProps {
  decisions: TraderDecision[];
}

const TradingChart: React.FC<TradingChartProps> = ({ decisions }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Clean up previous chart if it exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    
    // If no decisions, show empty chart
    if (!decisions || decisions.length === 0) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
      });
      
      chartRef.current = chart;
      return;
    }
    
    try {
      // Create chart
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });
      
      chartRef.current = chart;
      
      // Generate price data based on decisions
      const priceSeries = chart.addAreaSeries({
        lineColor: '#2962FF',
        topColor: 'rgba(41, 98, 255, 0.3)',
        bottomColor: 'rgba(41, 98, 255, 0.0)',
        lineWidth: 2,
      });
      
      // Generate sample price data
      const priceData = generatePriceData(decisions);
      if (priceData && priceData.length > 0) {
        priceSeries.setData(priceData);
        
        // Add markers for buy/sell decisions
        const markers = generateMarkers(decisions, priceData);
        if (markers && markers.length > 0) {
          priceSeries.setMarkers(markers);
        }
        
        // Fit content
        chart.timeScale().fitContent();
      }
    } catch (error) {
      console.error('Error creating chart:', error);
    }
    
    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [decisions]);
  
  // Generate sample price data based on decisions
  const generatePriceData = (decisions: TraderDecision[]) => {
    try {
      if (!decisions || decisions.length === 0) return [];
      
      const data: Array<{ time: number; value: number }> = [];
      let basePrice = 100;
      let currentPrice = basePrice;
      
      // Sort decisions by timestamp
      const sortedDecisions = [...decisions].sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      
      // Generate price data points
      for (let i = 0; i < sortedDecisions.length; i++) {
        const decision = sortedDecisions[i];
        if (!decision || !decision.timestamp) continue;
        
        const time = new Date(decision.timestamp);
        if (isNaN(time.getTime())) continue;
        
        // Generate some price movement based on the decision
        if (decision.outcome === 'positive') {
          currentPrice = currentPrice * (1 + Math.random() * 0.02); // Up to 2% gain
        } else if (decision.outcome === 'negative') {
          currentPrice = currentPrice * (1 - Math.random() * 0.02); // Up to 2% loss
        } else {
          // Neutral outcome - small random movement
          currentPrice = currentPrice * (1 + (Math.random() * 0.01 - 0.005));
        }
        
        data.push({
          time: time.getTime() / 1000,
          value: currentPrice
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error generating price data:', error);
      return [];
    }
  };
  
  // Generate markers for buy/sell decisions
  const generateMarkers = (decisions: TraderDecision[], priceData: Array<{ time: number; value: number }>) => {
    try {
      if (!decisions || decisions.length === 0 || !priceData || priceData.length === 0) return [];
      
      return decisions.map((decision, index) => {
        if (!decision || !decision.timestamp) return null;
        
        const time = new Date(decision.timestamp);
        if (isNaN(time.getTime())) return null;
        
        const timeValue = time.getTime() / 1000;
        const pricePoint = priceData.find(p => p.time === timeValue);
        
        if (!pricePoint) return null;
        
        let position: 'aboveBar' | 'belowBar' = 'aboveBar';
        let color = 'gray';
        let shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown' = 'circle';
        let text = '';
        
        switch (decision.action) {
          case 'buy':
            position = 'belowBar';
            color = 'green';
            shape = 'arrowUp';
            text = 'BUY';
            break;
          case 'sell':
            position = 'aboveBar';
            color = 'red';
            shape = 'arrowDown';
            text = 'SELL';
            break;
          case 'increase_position':
            position = 'belowBar';
            color = 'green';
            shape = 'circle';
            text = 'ADD';
            break;
          case 'decrease_position':
            position = 'aboveBar';
            color = 'orange';
            shape = 'circle';
            text = 'REDUCE';
            break;
          case 'exit':
            position = 'aboveBar';
            color = 'red';
            shape = 'square';
            text = 'EXIT';
            break;
          case 'hold':
            return null; // Don't show markers for hold decisions
          default:
            return null;
        }
        
        return {
          time: timeValue,
          position,
          color,
          shape,
          text,
          size: 1,
        };
      }).filter(Boolean);
    } catch (error) {
      console.error('Error generating markers:', error);
      return [];
    }
  };
  
  return (
    <div className="w-full">
      <div className="text-lg font-semibold mb-2">Trade Visualization</div>
      {!decisions || decisions.length === 0 ? (
        <div className="w-full h-[400px] border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">No trading data available to visualize</p>
        </div>
      ) : (
        <div 
          ref={chartContainerRef} 
          className="w-full h-[400px] border border-gray-200 rounded-lg"
        />
      )}
    </div>
  );
};

export default TradingChart; 