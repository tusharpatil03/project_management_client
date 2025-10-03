import React, { useEffect, useMemo } from 'react';
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
  BarChart3,
  PlayCircle,
  PauseCircle,
} from 'lucide-react';
import { GET_PROJECT_STAT } from '../../graphql/Query/project';
import LoadingState from '../../components/LoadingState';

interface ActiveSprintStat {
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  inProgressIssues: number;
}

interface ProjectStat {
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  inProgressIssues: number;
  totalSprints: number;
  activeSprintStat: ActiveSprintStat;
}

interface GetProjectStatResponse {
  getProjectStat: ProjectStat;
}

interface ProjectMetrics {
  overall: {
    completionRate: number;
    progressRate: number;
    openRate: number;
    productivity: 'High' | 'Medium' | 'Low';
    health: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  };
  activeSprint: {
    completionRate: number;
    progressRate: number;
    openRate: number;
    isActive: boolean;
  };
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

  const { data, loading, error, refetch } = useQuery<GetProjectStatResponse>(
    GET_PROJECT_STAT,
    {
      variables: { projectId },
      skip: !projectId,
      errorPolicy: 'all',
    }
  );

  useEffect(() => {
    refetch();
  }, [projectId, refetch]);

  const stats = data?.getProjectStat;

  // Type-safe metrics calculation with null checks
  const metrics = useMemo((): ProjectMetrics | null => {
    if (!stats) return null;

    // Ensure all required properties exist and are valid numbers
    const safeStats = {
      totalIssues: Number(stats.totalIssues) || 0,
      openIssues: Number(stats.openIssues) || 0,
      closedIssues: Number(stats.closedIssues) || 0,
      inProgressIssues: Number(stats.inProgressIssues) || 0,
      totalSprints: Number(stats.totalSprints) || 0,
      activeSprintStat: {
        totalIssues: Number(stats.activeSprintStat?.totalIssues) || 0,
        openIssues: Number(stats.activeSprintStat?.openIssues) || 0,
        closedIssues: Number(stats.activeSprintStat?.closedIssues) || 0,
        inProgressIssues: Number(stats.activeSprintStat?.inProgressIssues) || 0,
      },
    };

    // Overall project metrics
    const overallCompletionRate =
      safeStats.totalIssues > 0
        ? Math.round((safeStats.closedIssues / safeStats.totalIssues) * 100)
        : 0;

    const overallProgressRate =
      safeStats.totalIssues > 0
        ? Math.round((safeStats.inProgressIssues / safeStats.totalIssues) * 100)
        : 0;

    const overallOpenRate =
      safeStats.totalIssues > 0
        ? Math.round((safeStats.openIssues / safeStats.totalIssues) * 100)
        : 0;

    // Active sprint metrics
    const sprintCompletionRate =
      safeStats.activeSprintStat.totalIssues > 0
        ? Math.round(
            (safeStats.activeSprintStat.closedIssues /
              safeStats.activeSprintStat.totalIssues) *
              100
          )
        : 0;

    const sprintProgressRate =
      safeStats.activeSprintStat.totalIssues > 0
        ? Math.round(
            (safeStats.activeSprintStat.inProgressIssues /
              safeStats.activeSprintStat.totalIssues) *
              100
          )
        : 0;

    const sprintOpenRate =
      safeStats.activeSprintStat.totalIssues > 0
        ? Math.round(
            (safeStats.activeSprintStat.openIssues /
              safeStats.activeSprintStat.totalIssues) *
              100
          )
        : 0;

    // Determine productivity level
    const productivity: 'High' | 'Medium' | 'Low' =
      overallCompletionRate > 70
        ? 'High'
        : overallCompletionRate > 40
          ? 'Medium'
          : 'Low';

    // Determine project health
    const health: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention' =
      overallCompletionRate > 60 && safeStats.inProgressIssues > 0
        ? 'Excellent'
        : overallCompletionRate > 40
          ? 'Good'
          : overallCompletionRate > 20
            ? 'Fair'
            : 'Needs Attention';

    return {
      overall: {
        completionRate: overallCompletionRate,
        progressRate: overallProgressRate,
        openRate: overallOpenRate,
        productivity,
        health,
      },
      activeSprint: {
        completionRate: sprintCompletionRate,
        progressRate: sprintProgressRate,
        openRate: sprintOpenRate,
        isActive: safeStats.activeSprintStat.totalIssues > 0,
      },
    };
  }, [stats]);

  // Chart data with null safety
  const issueDistributionData = useMemo(() => {
    if (!stats) return [];

    return [
      { name: 'Completed', value: stats.closedIssues || 0, color: '#10B981' },
      {
        name: 'In Progress',
        value: stats.inProgressIssues || 0,
        color: '#3B82F6',
      },
      { name: 'Open', value: stats.openIssues || 0, color: '#F59E0B' },
    ].filter((item) => item.value > 0);
  }, [stats]);

  const comparisonData = useMemo(() => {
    if (!stats || !stats.activeSprintStat) return [];

    return [
      {
        category: 'Open',
        overall: stats.openIssues || 0,
        activeSprint: stats.activeSprintStat.openIssues || 0,
      },
      {
        category: 'In Progress',
        overall: stats.inProgressIssues || 0,
        activeSprint: stats.activeSprintStat.inProgressIssues || 0,
      },
      {
        category: 'Completed',
        overall: stats.closedIssues || 0,
        activeSprint: stats.activeSprintStat.closedIssues || 0,
      },
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
          <div className="text-red-500 font-medium mb-2">
            Failed to load project statistics
          </div>
          <div className="text-red-400 text-sm">{error.message}</div>
        </div>
      </div>
    );
  }

  if (!stats || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 font-medium">
            No statistics available
          </div>
        </div>
      </div>
    );
  }

  const getHealthColor = (health: string): string => {
    switch (health) {
      case 'Excellent':
        return 'text-green-600 bg-green-100';
      case 'Good':
        return 'text-blue-600 bg-blue-100';
      case 'Fair':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-red-600 bg-red-100';
    }
  };

  const getProductivityColor = (productivity: string): string => {
    switch (productivity) {
      case 'High':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-red-600 bg-red-100';
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
              {stats.totalSprints} sprint{stats.totalSprints !== 1 ? 's' : ''}{' '}
              total
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completion Rate
              </p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {metrics.overall.completionRate}%
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
              {metrics.overall.progressRate}% of total issues
            </div>
          </div>
        </div>

        {/* Active Sprint Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sprint</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {stats.activeSprintStat.totalIssues}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              {metrics.activeSprint.isActive ? (
                <PlayCircle className="w-6 h-6 text-purple-600" />
              ) : (
                <PauseCircle className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              {metrics.activeSprint.isActive
                ? `${metrics.activeSprint.completionRate}% completed`
                : 'No active sprint'}
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
              Overall Issue Distribution
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
                  label={({ name, percent }) =>
                    `${name} ${(percent || 0 * 100).toFixed(0)}%`
                  }
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
              No issues to display
            </div>
          )}
        </div>

        {/* Overall vs Active Sprint Comparison */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Overall vs Active Sprint
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Overall</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Active Sprint</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="overall" fill="#3B82F6" name="Overall Project" />
              <Bar dataKey="activeSprint" fill="#8B5CF6" name="Active Sprint" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Sprint Details */}
      {metrics.activeSprint.isActive && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Active Sprint Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {metrics.activeSprint.completionRate}%
              </div>
              <div className="text-sm text-gray-600">Sprint Completion</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.activeSprint.completionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.activeSprintStat.inProgressIssues}
              </div>
              <div className="text-sm text-gray-600">Issues in Progress</div>
              <div className="text-xs text-gray-500 mt-1">
                {metrics.activeSprint.progressRate}% of sprint
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {stats.activeSprintStat.openIssues}
              </div>
              <div className="text-sm text-gray-600">Remaining Issues</div>
              <div className="text-xs text-gray-500 mt-1">
                {metrics.activeSprint.openRate}% of sprint
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Health & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Health */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Project Health
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(metrics.overall.health)}`}
            >
              {metrics.overall.health}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Overall Completion
                </span>
                <span className="text-sm font-medium">
                  {metrics.overall.completionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.overall.completionRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Work in Progress</span>
                <span className="text-sm font-medium">
                  {metrics.overall.progressRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.overall.progressRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Insights */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Productivity Insights
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getProductivityColor(metrics.overall.productivity)}`}
            >
              {metrics.overall.productivity}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Issues Completed
                  </div>
                  <div className="text-sm text-gray-500">Total resolved</div>
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
                  <div className="font-medium text-gray-900">Active Work</div>
                  <div className="text-sm text-gray-500">
                    Currently in progress
                  </div>
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
            Smart Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">
                {metrics.overall.completionRate > 50
                  ? '🎯 Project on Track'
                  : '⚡ Needs Attention'}
              </div>
              <div className="text-gray-600">
                {metrics.overall.completionRate > 50
                  ? `Great progress with ${metrics.overall.completionRate}% completion rate`
                  : 'Consider reviewing priorities and removing blockers'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">
                {metrics.activeSprint.isActive
                  ? '🚀 Sprint Active'
                  : '📋 No Active Sprint'}
              </div>
              <div className="text-gray-600">
                {metrics.activeSprint.isActive
                  ? `Current sprint: ${stats.activeSprintStat.totalIssues} issues, ${metrics.activeSprint.completionRate}% done`
                  : 'Consider starting a new sprint to organize work'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">
                {stats.inProgressIssues > 0
                  ? '💪 Team Active'
                  : '🔄 Ready for Work'}
              </div>
              <div className="text-gray-600">
                {stats.inProgressIssues > 0
                  ? `${stats.inProgressIssues} issue${stats.inProgressIssues !== 1 ? 's' : ''} currently being worked on`
                  : 'Team available to pick up new tasks'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectProgress;
