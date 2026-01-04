import { useEffect, useState } from 'react';
import { Book, Target, Users, TrendingUp } from 'lucide-react';
import { duasAPI, challengesAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDuas: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    featuredDuas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [duasRes, challengesRes] = await Promise.all([
        duasAPI.getAll({ limit: 100 }),
        challengesAPI.getAll({ limit: 100 }),
      ]);

      const allDuas = duasRes.data.data.data;
      const allChallenges = challengesRes.data.data.data;

      setStats({
        totalDuas: duasRes.data.data.meta.total,
        totalChallenges: challengesRes.data.data.meta.total,
        activeChallenges: allChallenges.filter(c => c.is_active).length,
        featuredDuas: allDuas.filter(d => d.is_featured).length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Duas',
      value: stats.totalDuas,
      icon: Book,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Challenges',
      value: stats.totalChallenges,
      icon: Target,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Challenges',
      value: stats.activeChallenges,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Featured Duas',
      value: stats.featuredDuas,
      icon: Users,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/duas" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Book className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Manage Duas</p>
                  <p className="text-sm text-blue-700">Add, edit, or delete duas</p>
                </div>
              </div>
            </a>
            <a href="/challenges" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Manage Challenges</p>
                  <p className="text-sm text-green-700">Add, edit, or delete challenges</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Backend API</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Languages</span>
              <span className="text-gray-900 font-medium">3 (EN, AR, UR)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
