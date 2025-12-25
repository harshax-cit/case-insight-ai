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
  Line,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockClaimStats } from '@/data/mockData';
import { TrendingUp, TrendingDown, FileText, Clock, CheckCircle, AlertCircle, IndianRupee, Users } from 'lucide-react';

const COLORS = ['hsl(230, 80%, 55%)', 'hsl(38, 92%, 50%)', 'hsl(152, 76%, 36%)', 'hsl(199, 89%, 48%)'];

export function DashboardCharts() {
  const stats = mockClaimStats;

  return (
    <div className="flex-1 overflow-auto p-6 space-y-5 bg-background/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Claims overview and analytics</p>
        </div>
        <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          Last updated: Just now
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-success text-xs font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                +12%
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.totalClaims}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Claims</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-info" />
              </div>
              <div className="flex items-center gap-1 text-warning text-xs font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                +5
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.openClaims}</p>
            <p className="text-xs text-muted-foreground mt-1">Open Claims</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div className="flex items-center gap-1 text-success text-xs font-medium">
                92%
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.resolvedClaims}</p>
            <p className="text-xs text-muted-foreground mt-1">Resolved</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div className="flex items-center gap-1 text-success text-xs font-medium">
                <TrendingDown className="w-3.5 h-3.5" />
                -2 days
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.averageProcessingTime}d</p>
            <p className="text-xs text-muted-foreground mt-1">Avg. Processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Monthly Claims Area Chart */}
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Monthly Claims Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyData}>
                  <defs>
                    <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(230, 80%, 55%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(230, 80%, 55%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" className="text-[10px]" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-[10px]" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value}`, 'Claims']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="claims" 
                    stroke="hsl(230, 80%, 55%)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorClaims)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Claims by Type Pie Chart */}
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Claims by Type</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-56 flex items-center">
              <ResponsiveContainer width="55%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.claimsByType}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    strokeWidth={2}
                    stroke="hsl(var(--card))"
                  >
                    {stats.claimsByType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {stats.claimsByType.map((item, index) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-xs font-medium">{item.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claim Value Trend */}
      <Card className="card-elevated">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Claim Value Trend</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <IndianRupee className="w-3 h-3" />
              Values in Lakhs
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(230, 80%, 55%)" />
                    <stop offset="100%" stopColor="hsl(260, 70%, 60%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" className="text-[10px]" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis 
                  className="text-[10px]" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`₹${(value / 100000).toFixed(2)} Lakhs`, 'Amount']}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Total Value Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10 border-primary/20">
        <CardContent className="py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                <IndianRupee className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Claims Value</p>
                <p className="text-3xl font-bold tracking-tight">
                  ₹{(stats.totalValue / 10000000).toFixed(2)} Cr
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ₹{stats.totalValue.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">This Month</p>
              <p className="text-xl font-bold text-success">
                +₹{(30000000 / 10000000).toFixed(2)} Cr
              </p>
              <div className="flex items-center gap-1 justify-end text-success text-xs mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24% vs last month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
