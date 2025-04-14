import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { usageService } from '@/services/api';

interface UsageDataPoint {
  name: string;
  calls: number;
}

interface ModelUsageDataPoint {
  name: string;
  usage: number;
}

interface UsageStats {
  todayCalls: number;
  quotaUsed: number;
  quotaTotal: number;
  activeModels: number;
}

interface UsageLog {
  timestamp: string;
  [key: string]: any;
}

export default function AnalyticsTab() {
  const [usageData, setUsageData] = useState<UsageDataPoint[]>([]);
  const [modelUsageData, setModelUsageData] = useState<ModelUsageDataPoint[]>([]);
  const [stats, setStats] = useState<UsageStats>({
    todayCalls: 0,
    quotaUsed: 0,
    quotaTotal: 50000,
    activeModels: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's usage data
      const usageResponse = await usageService.getMyUsage();
      const dailyData = processUsageDataForChart(usageResponse.data);
      setUsageData(dailyData);
      
      // Try to get developer stats
      try {
        const statsResponse = await usageService.getDeveloperStats();
        const modelData = processModelUsageData(statsResponse.data.modelUsage);
        setModelUsageData(modelData);
        
        setStats({
          todayCalls: statsResponse.data.todayCalls || 0,
          quotaUsed: statsResponse.data.monthlyUsage || 0,
          quotaTotal: 50000,
          activeModels: statsResponse.data.activeModels || 0
        });
      } catch (exception) {
        setStats({
          todayCalls: calculateTodayCalls(usageResponse.data),
          quotaUsed: calculateMonthlyUsage(usageResponse.data),
          quotaTotal: 50000,
          activeModels: 5
        });
      }
      
      setError('');
    } catch (exception) {
      console.error('Error fetching usage data:', exception);
      setError('Failed to load usage data. Please try again later.');
      
      // Use fallback data when API fails
      setUsageData(getFallbackUsageData());
      setModelUsageData(getFallbackModelData());
    } finally {
      setLoading(false);
    }
  };

  const processUsageDataForChart = (data: UsageLog[]): UsageDataPoint[] => {
    const dailyCounts: Record<string, number> = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize with zeros for the last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      dailyCounts[dayName] = 0;
    }
    
    // Fill in actual data
    if (data && data.length) {
      data.forEach(log => {
        const date = new Date(log.timestamp);
        const dayName = days[date.getDay()];
        if (isWithinLastWeek(date)) {
          dailyCounts[dayName] = (dailyCounts[dayName] || 0) + 1;
        }
      });
    }
    
    return Object.keys(dailyCounts).map(day => ({
      name: day,
      calls: dailyCounts[day]
    }));
  };

  const processModelUsageData = (data: any[]): ModelUsageDataPoint[] => {
    if (!data || !Array.isArray(data)) return getFallbackModelData();
    
    return data.slice(0, 5).map(item => ({
      name: item.modelName || 'Unknown Model',
      usage: item.count || 0
    }));
  };

  const isWithinLastWeek = (date: Date): boolean => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return date >= oneWeekAgo;
  };

  const calculateTodayCalls = (data: UsageLog[]): number => {
    if (!data || !Array.isArray(data)) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return data.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= today;
    }).length;
  };

  const calculateMonthlyUsage = (data: UsageLog[]): number => {
    if (!data || !Array.isArray(data)) return 0;
    
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    return data.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= firstDayOfMonth;
    }).length;
  };

  const getFallbackUsageData = (): UsageDataPoint[] => [
    { name: 'Mon', calls: 400 },
    { name: 'Tue', calls: 300 },
    { name: 'Wed', calls: 500 },
    { name: 'Thu', calls: 280 },
    { name: 'Fri', calls: 590 },
    { name: 'Sat', calls: 320 },
    { name: 'Sun', calls: 250 },
  ];

  const getFallbackModelData = (): ModelUsageDataPoint[] => [
    { name: 'GPT-4', usage: 65 },
    { name: 'DALL-E', usage: 45 },
    { name: 'Stable Diffusion', usage: 38 },
    { name: 'Claude', usage: 28 },
    { name: 'Whisper', usage: 18 },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading analytics data...</div>;
  }

  return (
    <div className="space-y-6 text-black">
      <h2 className="text-2xl font-bold text-black">Usage Analytics</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-2">API Calls Today</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.todayCalls.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">↑ 12% from yesterday</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-2">Monthly Quota</h3>
          <p className="text-3xl font-bold text-blue-600">
            {Math.round((stats.quotaUsed / stats.quotaTotal) * 100)}%
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {stats.quotaUsed.toLocaleString()} / {stats.quotaTotal.toLocaleString()} calls
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-2">Active Models</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.activeModels}</p>
          <p className="text-sm text-gray-600 mt-1">Out of 12 available</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">API Usage (Last 7 Days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="calls" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Top Used Models</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelUsageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}