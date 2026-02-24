import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ApprovalRateChartProps {
  data: Array<{ date: string; approved: number; rejected: number; rate: number }>;
}

export function ApprovalRateChart({ data }: ApprovalRateChartProps) {
  const chartConfig = {
    approved: { label: 'Approved', color: 'hsl(var(--chart-1))' },
    rejected: { label: 'Rejected', color: 'hsl(var(--chart-2))' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Rate Over Time</CardTitle>
        <CardDescription>Track approval and rejection trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="approved" stroke="var(--color-approved)" strokeWidth={2} />
              <Line type="monotone" dataKey="rejected" stroke="var(--color-rejected)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
