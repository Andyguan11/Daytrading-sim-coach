# Trading Coach Simulator

A hybrid application that helps traders identify and overcome emotional trading pitfalls through scenario-based learning, coaching, and personal journaling.

## Features

- **Scenario Simulator**: Diverse trading situations with randomized market conditions
- **Trader Profiles**: Various trader personalities exhibiting different emotional behaviors
- **Coaching Interface**: Identify issues and provide guidance to virtual traders
- **Personal Journal**: Track your own trades and emotional patterns
- **Performance Analytics**: Review your coaching and trading progress

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `/src/components`: UI components
- `/src/models`: Data models and types
- `/src/data`: Scenario and trader profile data
- `/src/utils`: Helper functions and utilities

## How Scenarios Work

The application generates diverse trading scenarios by combining:

1. **Market Conditions**: Bull, bear, choppy, trending, volatile, etc.
2. **Trader Profiles**: Different personality types and experience levels
3. **Emotional Triggers**: News events, P&L swings, streak of losses/wins
4. **Trading Strategies**: Different approaches that may or may not fit current conditions
5. **Time Frames**: Intraday, swing, position trading scenarios

Scenarios are randomized to ensure variety and prevent predictability in the learning experience. 