import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MetricCard } from '@/components/MetricCard';
import { ApprovalRateChart } from '@/components/ApprovalRateChart';
import { StatusDistributionChart } from '@/components/StatusDistributionChart';
import { ContributorActivityChart } from '@/components/ContributorActivityChart';
import { ExportDialog } from '@/components/ExportDialog';
import { ScheduleReportDialog } from '@/components/ScheduleReportDialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, TrendingUp, Clock, Users, CheckCircle, FileDown, CalendarClock } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { exportToCSV, formatDateForExport } from '@/utils/exportUtils';
import { toast } from 'sonner';

export default function Analytics() {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [allDrafts, setAllDrafts] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalContent: 0,
    approvalRate: 0,
    avgReviewTime: 0,
    activeContributors: 0,
  });
  const [approvalData, setApprovalData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [contributorData, setContributorData] = useState<any[]>([]);

  useEffect(() => {
    fetchTeamMembers();
    fetchAnalytics();
  }, [dateRange, selectedMember]);

  const fetchTeamMembers = async () => {
    const { data } = await supabase.from('users').select('id, full_name, email');
    setTeamMembers(data || []);
  };

  const fetchAnalytics = async () => {
    const { data: drafts } = await supabase
      .from('content_drafts')
      .select('*, users(full_name)')
      .gte('created_at', dateRange?.from?.toISOString() || '')
      .lte('created_at', dateRange?.to?.toISOString() || '');

    if (drafts) {
      setAllDrafts(drafts);
      const filtered = selectedMember === 'all' ? drafts : drafts.filter(d => d.created_by === selectedMember);
      
      setMetrics({
        totalContent: filtered.length,
        approvalRate: Math.round((filtered.filter(d => d.status === 'approved').length / filtered.length) * 100) || 0,
        avgReviewTime: calculateAvgReviewTime(filtered),
        activeContributors: new Set(filtered.map(d => d.created_by)).size,
      });

      setApprovalData(generateApprovalData(filtered));
      setStatusData(generateStatusData(filtered));
      setContributorData(generateContributorData(filtered));
    }
  };

  const calculateAvgReviewTime = (drafts: any[]) => {
    const reviewed = drafts.filter(d => d.reviewed_at && d.submitted_at);
    if (reviewed.length === 0) return 0;
    const total = reviewed.reduce((sum, d) => {
      return sum + (new Date(d.reviewed_at).getTime() - new Date(d.submitted_at).getTime());
    }, 0);
    return Math.round(total / reviewed.length / (1000 * 60 * 60));
  };

  const generateApprovalData = (drafts: any[]) => {
    const days = 7;
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(dateRange?.to || new Date(), days - i - 1);
      const dayDrafts = drafts.filter(d => 
        format(new Date(d.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      return {
        date: format(date, 'MM/dd'),
        approved: dayDrafts.filter(d => d.status === 'approved').length,
        rejected: dayDrafts.filter(d => d.status === 'rejected').length,
      };
    });
  };

  const generateStatusData = (drafts: any[]) => [
    { name: 'Draft', value: drafts.filter(d => d.status === 'draft').length, color: '#94a3b8' },
    { name: 'Pending', value: drafts.filter(d => d.status === 'pending').length, color: '#fbbf24' },
    { name: 'Approved', value: drafts.filter(d => d.status === 'approved').length, color: '#10b981' },
    { name: 'Rejected', value: drafts.filter(d => d.status === 'rejected').length, color: '#ef4444' },
  ];

  const generateContributorData = (drafts: any[]) => {
    const contributors = new Map();
    drafts.forEach(d => {
      const name = d.users?.full_name || 'Unknown';
      if (!contributors.has(name)) {
        contributors.set(name, { name, drafts: 0, approved: 0 });
      }
      const stats = contributors.get(name);
      stats.drafts++;
      if (d.status === 'approved') stats.approved++;
    });
    return Array.from(contributors.values()).sort((a, b) => b.drafts - a.drafts).slice(0, 5);
  };

  const handleExport = async (format: string, selectedMetrics: string[], emailRecipients?: string[]) => {
    const filtered = selectedMember === 'all' ? allDrafts : allDrafts.filter(d => d.created_by === selectedMember);
    
    if (format === 'csv') {
      const exportData = filtered.map(d => ({
        Title: d.title,
        Status: d.status,
        Author: d.users?.full_name || 'Unknown',
        Created: formatDateForExport(d.created_at),
        Submitted: formatDateForExport(d.submitted_at),
        Reviewed: formatDateForExport(d.reviewed_at),
      }));
      exportToCSV(exportData, `analytics-report-${format(new Date(), 'yyyy-MM-dd')}`);
      toast.success('Report exported successfully');
    } else {
      try {
        const reportMetrics = [
          { label: 'Total Content', value: metrics.totalContent },
          { label: 'Approval Rate', value: `${metrics.approvalRate}%` },
          { label: 'Avg Review Time', value: `${metrics.avgReviewTime}h` },
          { label: 'Active Contributors', value: metrics.activeContributors },
        ];

        const { data, error } = await supabase.functions.invoke('generate-pdf-report', {
          body: {
            reportData: filtered.map(d => ({
              Title: d.title,
              Status: d.status,
              Author: d.users?.full_name || 'Unknown',
              Created: formatDateForExport(d.created_at),
            })),
            reportName: 'Analytics Report',
            metrics: reportMetrics,
            dateRange: {
              from: dateRange?.from ? format(dateRange.from, 'MMM dd, yyyy') : 'N/A',
              to: dateRange?.to ? format(dateRange.to, 'MMM dd, yyyy') : 'N/A',
            }
          }
        });

        if (error) throw error;
        
        const blob = new Blob([data.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.html`;
        link.click();
        
        toast.success('PDF report generated successfully');
      } catch (error: any) {
        toast.error('Failed to generate PDF: ' + error.message);
      }
    }

    // Send email if recipients provided
    if (emailRecipients && emailRecipients.length > 0) {
      try {
        const reportData = {
          totalContent: metrics.totalContent,
          approvalRate: metrics.approvalRate,
          avgReviewTime: metrics.avgReviewTime,
          activeContributors: metrics.activeContributors,
          recentContent: filtered.slice(0, 10).map(d => ({
            title: d.title,
            status: d.status,
            created_at: d.created_at
          }))
        };

        const { data, error } = await supabase.functions.invoke('send-report-email', {
          body: {
            recipientEmails: emailRecipients,
            reportData,
            dateRange: {
              from: dateRange?.from ? format(dateRange.from, 'MMM dd, yyyy') : 'N/A',
              to: dateRange?.to ? format(dateRange.to, 'MMM dd, yyyy') : 'N/A',
            }
          }
        });

        if (error) throw error;
        toast.success(`Report sent to ${emailRecipients.length} recipient(s)`);
      } catch (error: any) {
        toast.error('Failed to send email: ' + error.message);
      }
    }
  };


  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={() => setExportDialogOpen(true)} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setScheduleDialogOpen(true)} variant="outline">
            <CalendarClock className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? format(dateRange.from, 'MMM dd') : 'Start'} - {dateRange?.to ? format(dateRange.to, 'MMM dd') : 'End'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              {teamMembers.map(member => (
                <SelectItem key={member.id} value={member.id}>{member.full_name || member.email}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Content" value={metrics.totalContent} icon={TrendingUp} />
        <MetricCard title="Approval Rate" value={`${metrics.approvalRate}%`} icon={CheckCircle} />
        <MetricCard title="Avg Review Time" value={`${metrics.avgReviewTime}h`} icon={Clock} />
        <MetricCard title="Active Contributors" value={metrics.activeContributors} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ApprovalRateChart data={approvalData} />
        <StatusDistributionChart data={statusData} />
      </div>

      <ContributorActivityChart data={contributorData} />

      <ExportDialog 
        open={exportDialogOpen} 
        onOpenChange={setExportDialogOpen}
        onExport={handleExport}
      />
      
      <ScheduleReportDialog 
        open={scheduleDialogOpen} 
        onOpenChange={setScheduleDialogOpen}
      />
    </div>
  );
}
