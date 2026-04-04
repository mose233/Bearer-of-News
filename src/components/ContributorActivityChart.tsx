import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ContributorActivityChartProps {
  data: Array<{ name: string; drafts: number; approved: number }>;
}

export function ContributorActivityChart({ data }: ContributorActivityChartProps) {
  const chartConfig = {
    drafts: { label: 'Drafts Created', color: 'hsl(var(--chart-3))' },
    approved: { label: 'Approved', color: 'hsl(var(--chart-1))' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Active Contributors</CardTitle>
        <CardDescription>Team member activity and success rates</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="drafts" fill="var(--color-drafts)" />
              <Bar dataKey="approved" fill="var(--color-approved)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
