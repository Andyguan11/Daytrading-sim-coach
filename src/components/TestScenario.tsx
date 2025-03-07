import React, { useState } from 'react';
import { generateRandomScenario } from '../utils/scenarioGenerator';
import { TraderState, TradingScenario, TraderProfile } from '../models/types';

const TestScenario: React.FC = () => {
  const [scenario, setScenario] = useState<TradingScenario | null>(null);
  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [traderState, setTraderState] = useState<TraderState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateScenario = () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Generating random scenario...");
      
      const result = generateRandomScenario();
      console.log("Result:", result);
      
      setScenario(result.scenario);
      setTrader(result.trader);
      setTraderState(result.traderState);
      setLoading(false);
    } catch (error) {
      console.error("Error generating scenario:", error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Test Scenario Generator</h1>
      
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        onClick={handleGenerateScenario}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Random Scenario'}
      </button>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Scenario</h2>
          {scenario ? (
            <pre className="text-xs overflow-auto max-h-60">
              {JSON.stringify(scenario, null, 2)}
            </pre>
          ) : (
            <p>No scenario generated yet</p>
          )}
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Trader</h2>
          {trader ? (
            <pre className="text-xs overflow-auto max-h-60">
              {JSON.stringify(trader, null, 2)}
            </pre>
          ) : (
            <p>No trader generated yet</p>
          )}
        </div>
        
        <div className="border p-4 rounded col-span-1 md:col-span-2">
          <h2 className="font-bold mb-2">Trader State</h2>
          {traderState ? (
            <pre className="text-xs overflow-auto max-h-60">
              {JSON.stringify(traderState, null, 2)}
            </pre>
          ) : (
            <p>No trader state generated yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestScenario; 