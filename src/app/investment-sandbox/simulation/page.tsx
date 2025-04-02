"use client";

import SandboxComponent from "./sandbox";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Play,
  Pause,
  DollarSign,
  TrendingUp,
  BarChart2,
  Clock,
  Info,
  Newspaper,
} from "lucide-react";

// Fetch data from the real API endpoint
const fetchStockData = async (stock) => {
  try {
    const response = await fetch(
      `https://fin-api-three.vercel.app/fakestockdata?stock=${stock}&days=365&interval=1d`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

// Helper function to format date as "MMM DD"
const formatDateString = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Helper function to get month key from date
const getMonthKey = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
};

export default function InvestmentSimulator() {
  const searchParams = useSearchParams();
  const stockSymbol = searchParams.get("stock") || "INFY";

  const [rawStockData, setRawStockData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [monthlyGroups, setMonthlyGroups] = useState({});
  const [visibleDataIndex, setVisibleDataIndex] = useState(1); // Start with first day visible
  const [playing, setPlaying] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(500); // ms per step
  const [balance, setBalance] = useState(10000); // Start with $10,000
  const [portfolio, setPortfolio] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(0);

  const timerRef = useRef(null);
  const newsIntervalRef = useRef(null);

  // Fetch data on mount or when stock symbol changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchStockData(stockSymbol);
        const data = response.data || [];
        const news = response.news || [];

        // Process and sort data by timestamp
        const processedData = data
          .map((item) => ({
            ...item,
            formattedDate: formatDateString(item.timestamp),
            monthKey: getMonthKey(item.timestamp),
            current_price: item.current_price || 0,
            change: item.change || 0,
            change_percent: item.change_percent || 0,
            volume: item.volume || 0,
            high: item.high || 0,
            low: item.low || 0,
            open: item.open || 0,
          }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setRawStockData(processedData);
        setStockData(processedData);
        setNewsArticles(news);

        // Group data by month for visualization
        const groups = {};
        processedData.forEach((item) => {
          if (!groups[item.monthKey]) {
            groups[item.monthKey] = {
              month: new Date(item.timestamp).toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
              }),
              days: [],
            };
          }
          groups[item.monthKey].days.push(item);
        });

        setMonthlyGroups(groups);

        // Set visible index to first day
        setVisibleDataIndex(Math.min(1, processedData.length - 1));
      } catch (error) {
        setError("Failed to load stock data. Please try again later.");
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (newsIntervalRef.current) clearInterval(newsIntervalRef.current);
    };
  }, [stockSymbol]);

  // Handle simulation playback
  useEffect(() => {
    if (playing && stockData.length > 0) {
      timerRef.current = setInterval(() => {
        setVisibleDataIndex((prev) => {
          const next = prev + 1;
          if (next >= stockData.length) {
            setPlaying(false);
            return prev;
          }
          return next;
        });
      }, simulationSpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, stockData, simulationSpeed]);

  // Auto-rotate news articles when playing
  useEffect(() => {
    if (playing && newsArticles.length > 0) {
      newsIntervalRef.current = setInterval(() => {
        setCurrentArticle((prev) => (prev + 1) % newsArticles.length);
      }, 10000); // Change news every 10 seconds
    } else if (newsIntervalRef.current) {
      clearInterval(newsIntervalRef.current);
    }

    return () => {
      if (newsIntervalRef.current) clearInterval(newsIntervalRef.current);
    };
  }, [playing, newsArticles]);

  // Calculate visible data
  const visibleData = stockData.slice(0, visibleDataIndex + 1);

  // Get current price - use the last visible day's data
  const currentDayData =
    visibleData.length > 0 ? visibleData[visibleData.length - 1] : null;
  const currentPrice = currentDayData ? currentDayData.current_price : 0;

  // Calculate portfolio value
  const portfolioShares = portfolio[stockSymbol] || 0;
  const portfolioValue = portfolioShares * currentPrice;
  const totalValue = balance + portfolioValue;

  // Buy stocks
  const buyStock = () => {
    if (balance >= currentPrice) {
      // Buy one share
      const newBalance = balance - currentPrice;
      const newPortfolio = { ...portfolio };
      newPortfolio[stockSymbol] = (newPortfolio[stockSymbol] || 0) + 1;

      setBalance(newBalance);
      setPortfolio(newPortfolio);

      // Record transaction
      setTransactions([
        ...transactions,
        {
          type: "BUY",
          symbol: stockSymbol,
          price: currentPrice,
          shares: 1,
          timestamp: new Date().toISOString(),
          dayIndex: visibleDataIndex,
          date: currentDayData.formattedDate,
        },
      ]);
    }
  };

  // Sell stocks
  const sellStock = () => {
    if ((portfolio[stockSymbol] || 0) > 0) {
      // Sell one share
      const newBalance = balance + currentPrice;
      const newPortfolio = { ...portfolio };
      newPortfolio[stockSymbol] = newPortfolio[stockSymbol] - 1;

      setBalance(newBalance);
      setPortfolio(newPortfolio);

      // Record transaction
      setTransactions([
        ...transactions,
        {
          type: "SELL",
          symbol: stockSymbol,
          price: currentPrice,
          shares: 1,
          timestamp: new Date().toISOString(),
          dayIndex: visibleDataIndex,
          date: currentDayData.formattedDate,
        },
      ]);
    }
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800">{data.formattedDate}</p>
          <p className="text-gray-600">
            Price: ${data.current_price.toFixed(2)}
          </p>
          <p
            className={`${
              data.change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Change: {data.change >= 0 ? "+" : ""}
            {data.change.toFixed(2)} ({data.change_percent.toFixed(2)}%)
          </p>
          <p className="text-gray-600">
            Volume: {data.volume.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Filter transactions for the current day
  const currentTransactions = transactions.filter(
    (t) => t.dayIndex === visibleDataIndex
  );

  // Get all transactions up to the current day
  const allTransactionsToDate = transactions.filter(
    (t) => t.dayIndex <= visibleDataIndex
  );

  // Get current month from visible data
  const currentMonth = currentDayData ? currentDayData.monthKey : null;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading stock data for {stockSymbol}...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (stockData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-yellow-500 text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-600 mb-4">
            No stock data available for {stockSymbol}. Please try a different
            stock symbol.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <TrendingUp className="mr-2" />
            Investment Simulator
          </h1>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <div className="bg-blue-900 rounded-lg px-4 py-2">
              <span className="font-medium">Stock: </span>
              <span className="font-bold">{stockSymbol}</span>
            </div>
            <div className="bg-blue-900 rounded-lg px-4 py-2">
              <span className="font-medium">Day: </span>
              <span className="font-bold">
                {visibleDataIndex + 1}/{stockData.length}
              </span>
            </div>
            {currentDayData && (
              <div className="bg-blue-900 rounded-lg px-4 py-2">
                <span className="font-medium">Date: </span>
                <span className="font-bold">
                  {currentDayData.formattedDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-grow p-4">
        {/* Chart card */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <BarChart2 className="mr-2" size={20} />
              {stockSymbol} Daily Price Chart
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setSimulationSpeed((prev) => Math.max(100, prev - 100))
                }
                className="bg-gray-200 hover:bg-gray-300 rounded-md p-2 text-gray-700"
                disabled={simulationSpeed <= 100}
              >
                Faster
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className={`${
                  playing
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } rounded-full p-2 text-white`}
              >
                {playing ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={() =>
                  setSimulationSpeed((prev) => Math.min(1000, prev + 100))
                }
                className="bg-gray-200 hover:bg-gray-300 rounded-md p-2 text-gray-700"
                disabled={simulationSpeed >= 1000}
              >
                Slower
              </button>
            </div>
          </div>

          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visibleData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                isAnimationActive={true}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis
                  domain={["dataMin - 5", "dataMax + 5"]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Month separators - visual indicators for month changes */}
                {Object.values(monthlyGroups).map((monthGroup, idx) => {
                  // Get the first day of each month
                  const firstDay = monthGroup.days[0];
                  if (!firstDay || idx === 0) return null; // Skip first month to avoid edge

                  return (
                    <ReferenceLine
                      key={`month-${idx}`}
                      x={firstDay.formattedDate}
                      stroke="#6B7280"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      label={{
                        value: monthGroup.month,
                        position: "top",
                        fill: "#6B7280",
                        fontSize: 10,
                      }}
                    />
                  );
                })}

                {/* Highlight buy/sell transactions */}
                {allTransactionsToDate.map((transaction, idx) => {
                  const dayData = stockData[transaction.dayIndex];
                  if (!dayData) return null;

                  return (
                    <ReferenceLine
                      key={`transaction-${idx}`}
                      x={dayData.formattedDate}
                      stroke={
                        transaction.type === "BUY" ? "#10B981" : "#EF4444"
                      }
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                  );
                })}

                <Line
                  type="monotone"
                  dataKey="current_price"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: "#2563EB" }}
                  isAnimationActive={true}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* News section */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Newspaper className="mr-2" size={20} />
            Market News
          </h2>

          <div
            className="relative overflow-hidden"
            style={{ minHeight: "200px" }}
          >
            <AnimatePresence mode="wait">
              {newsArticles.length > 0 ? (
                <motion.div
                  key={currentArticle}
                  className="p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-blue-800">
                      {newsArticles[currentArticle].headline}
                    </h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {newsArticles[currentArticle].date}
                    </span>
                  </div>
                  <p className="text-gray-700">
                    {newsArticles[currentArticle].article}
                  </p>
                </motion.div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 italic">
                    No news articles available
                  </p>
                </div>
              )}
            </AnimatePresence>

            {/* News navigation dots */}
            {newsArticles.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {newsArticles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentArticle(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      idx === currentArticle ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    aria-label={`News article ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Portfolio and actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Left column - Portfolio summary */}
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <DollarSign className="mr-2" size={20} />
              Portfolio Summary
            </h2>
            <div className="space-y-2 text-sm md:text-base">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Cash Balance:</span>
                <span className="font-semibold">${balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Shares Owned:</span>
                <span className="font-semibold">{portfolioShares}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Stock Value:</span>
                <span className="font-semibold">
                  ${portfolioValue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-3 text-lg">
                <span className="font-bold text-gray-700">Total Value:</span>
                <span className="font-bold">${totalValue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Middle column - Current stock details */}
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Info className="mr-2" size={20} />
                Stock Details
              </h2>
              <AnimatePresence mode="wait">
                {currentDayData && (
                  <motion.div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      currentDayData.change >= 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    key={visibleDataIndex}
                  >
                    {currentDayData.change >= 0 ? "+" : ""}
                    {currentDayData.change.toFixed(2)} (
                    {currentDayData.change_percent.toFixed(2)}%)
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {currentDayData && (
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">
                    {currentDayData.formattedDate}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Current Price:</span>
                  <span className="font-semibold">
                    ${currentDayData.current_price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Open:</span>
                  <span className="font-semibold">
                    ${currentDayData.open.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">High:</span>
                  <span className="font-semibold">
                    ${currentDayData.high.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Low:</span>
                  <span className="font-semibold">
                    ${currentDayData.low.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Volume:</span>
                  <span className="font-semibold">
                    {currentDayData.volume.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Actions */}
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Trading Actions
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={buyStock}
                  className={`py-3 px-4 ${
                    balance >= currentPrice
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-300 cursor-not-allowed"
                  } text-white font-bold rounded-lg shadow transition-colors`}
                  whileTap={balance >= currentPrice ? { scale: 0.95 } : {}}
                  disabled={!currentDayData || balance < currentPrice}
                >
                  BUY
                </motion.button>
                <motion.button
                  onClick={sellStock}
                  className={`py-3 px-4 ${
                    portfolioShares > 0
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-300 cursor-not-allowed"
                  } text-white font-bold rounded-lg shadow transition-colors`}
                  whileTap={portfolioShares > 0 ? { scale: 0.95 } : {}}
                  disabled={!currentDayData || portfolioShares <= 0}
                >
                  SELL
                </motion.button>
              </div>

              {/* Current day's transactions */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2">
                  Today's Transactions:
                </h3>
                {currentTransactions.length > 0 ? (
                  <div className="space-y-2 max-h-24 overflow-y-auto">
                    {currentTransactions.map((transaction, idx) => (
                      <motion.div
                        key={idx}
                        className={`p-2 rounded-md text-sm ${
                          transaction.type === "BUY"
                            ? "bg-green-50 text-green-800"
                            : "bg-red-50 text-red-800"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="font-bold">
                          {transaction.type} {transaction.shares} shares
                        </div>
                        <div className="text-xs">
                          at ${transaction.price.toFixed(2)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No transactions today
                  </p>
                )}
              </div>

              {/* Transaction history */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2">
                  Transaction History:
                </h3>
                {allTransactionsToDate.length > 0 ? (
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {allTransactionsToDate.map((transaction, idx) => (
                      <motion.div
                        key={idx}
                        className={`p-2 rounded-md text-sm ${
                          transaction.type === "BUY"
                            ? "bg-green-50 border-green-200 border"
                            : "bg-red-50 border-red-200 border"
                        }`}
                      >
                        <div className="font-semibold">
                          {transaction.type} {transaction.shares} shares
                        </div>
                        <div className="text-xs flex justify-between">
                          <span>Date: {transaction.date}</span>
                          <span>${transaction.price.toFixed(2)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No transactions yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="w-full h-[50px] pl-7 text-3xl font-bold">
        <span>Check out other stocks</span>
      </div>
      <SandboxComponent />

      <footer className="bg-gray-800 text-white p-4 mt-6">
        <div className="container mx-auto text-center text-sm">
          <p>
            Investment Simulator - For educational purposes only. Not financial
            advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
