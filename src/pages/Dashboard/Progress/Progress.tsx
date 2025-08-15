import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Calendar,
  Activity,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { GET_PROJECT_STAT } from '../../../graphql/Query/project';
import LoadingState from '../../../components/LoadingState';

interface ProjectStat {
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  inProgressIssues: number;
  totalSprints: number;
  activeSprint: number;
}

const ProjectProgress: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <div className="text-red-500 font-medium">Project ID is required</div>
        </div>
      </div>
    );
  }

  const { data, loading, error } = useQuery<{ getProjectStat: ProjectStat }>(
    GET_PROJECT_STAT,
    {
      variables: { projectId },
      skip: !projectId,
    }
  );

  const stats = data?.getProjectStat;

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!stats) return null;

    const completionRate = stats.totalIssues > 0 
      ? Math.round((stats.closedIssues / stats.totalIssues) * 100)
      : 0;

    const progressRate = stats.totalIssues > 0
      ? Math.round((stats.inProgressIssues / stats.totalIssues) * 100)
      : 0;

    const openRate = stats.totalIssues > 0
      ? Math.round((stats.openIssues / stats.totalIssues) * 100)
      : 0;

    return {
      completionRate,
      progressRate,
      openRate,
      productivity: completionRate > 70 ? 'High' : completionRate > 40 ? 'Medium' : 'Low',
      health: completionRate > 60 && stats.inProgressIssues > 0 ? 'Excellent' : 
               completionRate > 40 ? 'Good' : 
               completionRate > 20 ? 'Fair' : 'Needs Attention'
    };
  }, [stats]);

  // Chart data
  const issueDistributionData = useMemo(() => {
    if (!stats) return [];
    
    return [
      { name: 'Completed', value: stats.closedIssues, color: '#10B981' },
      { name: 'In Progress', value: stats.inProgressIssues, color: '#3B82F6' },
      { name: 'Open', value: stats.openIssues, color: '#F59E0B' },
    ].filter(item => item.value > 0);
  }, [stats]);

  const barChartData = useMemo(() => {
    if (!stats) return [];
    
    return [
      { category: 'Open', count: stats.openIssues, color: '#F59E0B' },
      { category: 'In Progress', count: stats.inProgressIssues, color: '#3B82F6' },
      { category: 'Completed', count: stats.closedIssues, color: '#10B981' },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingState size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <div className="text-red-500 font-medium mb-2">Failed to load project statistics</div>
          <div className="text-red-400 text-sm">{error.message}</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 font-medium">No statistics available</div>
        </div>
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Fair': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getProductivityColor = (productivity: string) => {
    switch (productivity) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-8 h-8 text-blue-600" />
            Project Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive view of your project's progress and performance
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last updated</div>
          <div className="font-medium text-gray-900">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Issues */}
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalIssues}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              {stats.totalSprints} sprint{stats.totalSprints !== 1 ? 's' : ''} total
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {metrics?.completionRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              {stats.closedIssues} of {stats.totalIssues} issues completed
            </div>
          </div>
        </div>

        {/* Active Work */}
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {stats.inProgressIssues}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              {metrics?.progressRate}% of total issues
            </div>
          </div>
        </div>

        {/* Active Sprints */}
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sprints</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {stats.activeSprint}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              {stats.totalSprints - stats.activeSprint} completed
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Issue Distribution
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Open</span>
              </div>
            </div>
          </div>
          
          {issueDistributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issueDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent || 0 * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issueDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Issue Status Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Issue Status Overview
            </h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="count" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              >
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Health & Productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Health */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Project Health
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(metrics?.health || '')}`}>
              {metrics?.health}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Completion Progress</span>
                <span className="text-sm font-medium">{metrics?.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics?.completionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Work in Progress</span>
                <span className="text-sm font-medium">{metrics?.progressRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics?.progressRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Productivity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Productivity Insights
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProductivityColor(metrics?.productivity || '')}`}>
              {metrics?.productivity}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Issues Resolved</div>
                  <div className="text-sm text-gray-500">This month</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.closedIssues}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Active Work Items</div>
                  <div className="text-sm text-gray-500">Currently in progress</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.inProgressIssues}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      {stats.totalIssues > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Project Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">
                {metrics?.completionRate && metrics.completionRate > 50 
                  ? '🎯 On Track' 
                  : '⚡ Needs Focus'}
              </div>
              <div className="text-gray-600">
                {metrics?.completionRate && metrics.completionRate > 50
                  ? 'Your project is progressing well with good completion rate'
                  : 'Consider reviewing priorities to improve completion rate'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">
                {stats.activeSprint > 0 ? '🚀 Active Development' : '📋 Planning Phase'}
              </div>
              <div className="text-gray-600">
                {stats.activeSprint > 0
                  ? `${stats.activeSprint} sprint${stats.activeSprint !== 1 ? 's' : ''} currently running`
                  : 'No active sprints - consider starting development'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">
                {stats.inProgressIssues > 0 ? '💪 Active Team' : '🔄 Ready to Start'}
              </div>
              <div className="text-gray-600">
                {stats.inProgressIssues > 0
                  ? `${stats.inProgressIssues} issue${stats.inProgressIssues !== 1 ? 's' : ''} in active development`
                  : 'Team ready to pick up new work items'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectProgress;