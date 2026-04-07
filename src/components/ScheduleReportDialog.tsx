import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleReportDialog({ open, onOpenChange }: ScheduleReportDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    report_name: '',
    format: 'csv',
    frequency: 'weekly',
    recipients: ''
  });

  const handleSchedule = async () => {
    if (!formData.report_name || !formData.recipients) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('team_id')
        .eq('id', user?.id)
        .single();

      const nextGeneration = new Date();
      if (formData.frequency === 'daily') nextGeneration.setDate(nextGeneration.getDate() + 1);
      else if (formData.frequency === 'weekly') nextGeneration.setDate(nextGeneration.getDate() + 7);
      else nextGeneration.setMonth(nextGeneration.getMonth() + 1);

      const recipientEmails = formData.recipients.split(',').map(e => e.trim());

      const { error } = await supabase.from('scheduled_reports').insert({
        created_by: user?.id,
        team_id: userData?.team_id,
        report_name: formData.report_name,
        report_type: 'analytics',
        format: formData.format,
        frequency: formData.frequency,
        recipients: formData.recipients.split(',').map(e => e.trim()),
        recipient_emails: recipientEmails,
        next_generation_at: nextGeneration.toISOString(),
        delivery_status: 'pending'
      });


      if (error) throw error;

      toast.success('Report scheduled successfully');
      onOpenChange(false);
      setFormData({ report_name: '', format: 'csv', frequency: 'weekly', recipients: '' });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Automated Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="report_name">Report Name</Label>
            <Input
              id="report_name"
              value={formData.report_name}
              onChange={(e) => setFormData({ ...formData, report_name: e.target.value })}
              placeholder="Weekly Analytics Report"
            />
          </div>

          <div>
            <Label htmlFor="format">Format</Label>
            <Select value={formData.format} onValueChange={(v) => setFormData({ ...formData, format: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={formData.frequency} onValueChange={(v) => setFormData({ ...formData, frequency: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="recipients">Recipients (comma-separated emails)</Label>
            <Input
              id="recipients"
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              placeholder="user1@example.com, user2@example.com"
            />
          </div>

          <Button onClick={handleSchedule} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
            Schedule Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
