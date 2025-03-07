import React from 'react';

const TraderCoaching: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Trader Coaching
          </h2>
          <p className="mt-1 text-gray-500">
            Review your coaching history and performance
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Coaching History</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your past coaching sessions and feedback
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="text-center py-10">
            <p className="text-gray-500">No coaching sessions yet. Start by using the Scenario Simulator!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderCoaching; 