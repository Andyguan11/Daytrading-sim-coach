import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PresentationChartLineIcon, 
  UserGroupIcon, 
  BoltIcon as LightningBoltIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Navigate to the simulator page when Quick Start is clicked
  const handleQuickStart = () => {
    navigate('/simulator');
  };

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Trading Coach Dashboard
          </h2>
          <p className="mt-1 text-gray-500">
            Improve your trading psychology by coaching virtual traders and analyzing your own trades
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Get started with common activities</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={handleQuickStart}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <div className="flex-shrink-0">
                <LightningBoltIcon className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Quick Start Scenario</p>
                <p className="text-sm text-gray-500">Jump into a random coaching scenario</p>
              </div>
            </button>

            <Link
              to="/simulator"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <div className="flex-shrink-0">
                <PresentationChartLineIcon className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Scenario Simulator</p>
                <p className="text-sm text-gray-500">Create custom trading scenarios</p>
              </div>
            </Link>

            <Link
              to="/journal"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <div className="flex-shrink-0">
                <PresentationChartLineIcon className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Trading Journal</p>
                <p className="text-sm text-gray-500">Log and analyze your real trades</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Progress</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Trading psychology improvement metrics</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Scenarios Completed</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
            </div>

            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Coaching Accuracy</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">0%</dd>
            </div>

            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Journal Entries</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Common trading pitfalls */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Common Trading Pitfalls</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Emotional biases to watch for in your trading</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">FOMO (Fear of Missing Out)</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 sm:mt-0 sm:col-span-2">
              Entering trades based on fear of missing profits, often chasing after a move has already happened.
            </div>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Revenge Trading</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 sm:mt-0 sm:col-span-2">
              Taking trades to "get back" at the market after a loss, often with larger size and less analysis.
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Overconfidence</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 sm:mt-0 sm:col-span-2">
              Taking excessive risk after a series of winning trades, often abandoning proper risk management.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 