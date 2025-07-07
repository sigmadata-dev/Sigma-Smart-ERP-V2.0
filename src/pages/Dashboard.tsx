import React, { useEffect, useState } from 'react';
import { KPICard } from '@/components/common/KPICard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  LineChart,
  Line
} from 'recharts';
import { 
  Receipt, 
  Users, 
  Package, 
  Briefcase, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { getDashboardKPIs, getRecentActivities } from '@/lib/api';

interface KPIData {
  totalRevenue: number;
  totalInvoices: number;
  activeEmployees: number;
  inventoryValue: number;
  activeProjects: number;
  pendingOrders: number;
  revenueChange: number;
  invoicesChange: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

interface ChartData {
  monthlyRevenue: Array<{ month: string; revenue: number; }>;
  topClients: Array<{ name: string; value: number; }>;
  projectStatus: Array<{ name: string; value: number; color: string; }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load KPI data
      const kpiResponse = await getDashboardKPIs();
      if (kpiResponse.success) {
        setKpiData(kpiResponse.data as KPIData);
      } else {
        // Mock data for development
        setKpiData({
          totalRevenue: 2450000,
          totalInvoices: 234,
          activeEmployees: 45,
          inventoryValue: 180000,
          activeProjects: 12,
          pendingOrders: 28,
          revenueChange: 12.5,
          invoicesChange: -2.3,
        });
      }

      // Load recent activities
      const activitiesResponse = await getRecentActivities(8);
      if (activitiesResponse.success) {
        setRecentActivities(activitiesResponse.data as RecentActivity[]);
      } else {
        // Mock data for development
        setRecentActivities([
          {
            id: '1',
            type: 'invoice',
            description: 'New invoice #INV-2024-001 created for ElectroTech SRL',
            timestamp: '2 hours ago',
            status: 'success'
          },
          {
            id: '2',
            type: 'order',
            description: 'Order #CMD-2025-00010 completed',
            timestamp: '4 hours ago',
            status: 'success'
          },
          {
            id: '3',
            type: 'inventory',
            description: 'Low stock alert for product #P001',
            timestamp: '6 hours ago',
            status: 'warning'
          },
          {
            id: '4',
            type: 'employee',
            description: 'New employee Andrei Popescu added',
            timestamp: '1 day ago',
            status: 'info'
          }
        ]);
      }

      // Mock chart data
      setChartData({
        monthlyRevenue: [
          { month: 'Ian', revenue: 185000 },
          { month: 'Feb', revenue: 220000 },
          { month: 'Mar', revenue: 195000 },
          { month: 'Apr', revenue: 265000 },
          { month: 'Mai', revenue: 245000 },
          { month: 'Iun', revenue: 285000 },
        ],
        topClients: [
          { name: 'ElectroTech SRL', value: 85000 },
          { name: 'Construct Alfa SRL', value: 65000 },
          { name: 'Sigma Steel Works', value: 45000 },
          { name: 'TechnoBuilt SA', value: 35000 },
          { name: 'Green Energy S.R.L', value: 25000 },
        ],
        projectStatus: [
          { name: 'Active', value: 12, color: '#00C49F' },
          { name: 'Completed', value: 8, color: '#0088FE' },
          { name: 'On Hold', value: 3, color: '#FFBB28' },
          { name: 'Cancelled', value: 1, color: '#FF8042' },
        ]
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business performance and key metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={`${(kpiData?.totalRevenue || 0).toLocaleString('ro-RO')} RON`}
          change={{
            value: kpiData?.revenueChange || 0,
            type: (kpiData?.revenueChange || 0) >= 0 ? 'increase' : 'decrease'
          }}
          icon={TrendingUp}
          description="vs last month"
        />
        <KPICard
          title="Total Invoices"
          value={kpiData?.totalInvoices || 0}
          change={{
            value: kpiData?.invoicesChange || 0,
            type: (kpiData?.invoicesChange || 0) >= 0 ? 'increase' : 'decrease'
          }}
          icon={Receipt}
          description="this month"
        />
        <KPICard
          title="Active Employees"
          value={kpiData?.activeEmployees || 0}
          icon={Users}
          description="total workforce"
        />
        <KPICard
          title="Inventory Value"
          value={`${(kpiData?.inventoryValue || 0).toLocaleString('ro-RO')} RON`}
          icon={Package}
          description="current stock"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Projects"
          value={kpiData?.activeProjects || 0}
          icon={Briefcase}
          description="in progress"
        />
        <KPICard
          title="Pending Orders"
          value={kpiData?.pendingOrders || 0}
          icon={Clock}
          description="awaiting processing"
        />
        <KPICard
          title="Cost Centers"
          value="7"
          icon={Target}
          description="active centers"
        />
        <KPICard
          title="Low Stock Items"
          value="3"
          icon={AlertTriangle}
          description="need attention"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData?.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString('ro-RO')} RON`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Clients Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clients by Revenue</CardTitle>
            <CardDescription>Top 5 clients contributing to revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.topClients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString('ro-RO')} RON`, 'Revenue']}
                />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData?.projectStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData?.projectStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    <Badge variant={
                      activity.status === 'success' ? 'default' :
                      activity.status === 'warning' ? 'destructive' :
                      'secondary'
                    }>
                      {activity.type}
                    </Badge>
                  </div>
                  {index < recentActivities.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}