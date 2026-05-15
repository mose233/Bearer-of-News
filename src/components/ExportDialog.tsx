import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, Loader2, Mail } from 'lucide-react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: string, metrics: string[], emailRecipients?: string[]) => Promise<void>;
}

const availableMetrics = [
  { id: 'total_content', label: 'Total Content' },
  { id: 'approval_rate', label: 'Approval Rate' },
  { id: 'avg_review_time', label: 'Average Review Time' },
  { id: 'active_contributors', label: 'Active Contributors' },
  { id: 'pending_count', label: 'Pending Approvals' },
  { id: 'approved_count', label: 'Approved Content' },
  { id: 'rejected_count', label: 'Rejected Content' },
];

export function ExportDialog({ open, onOpenChange, onExport }: ExportDialogProps) {
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    availableMetrics.map(m => m.id)
  );
  const [loading, setLoading] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleExport = async () => {
    if (selectedMetrics.length === 0) return;

    setLoading(true);

    try {
      const recipients =
        sendEmail && emailRecipients
          ? emailRecipients
              .split(',')
              .map(e => e.trim())
              .filter(Boolean) // ✅ removes empty emails (IMPORTANT FIX)
          : undefined;

      await onExport(format, selectedMetrics, recipients);

      onOpenChange(false);
    } catch (err) {
      console.error('EXPORT ERROR:', err);
      alert('Export failed. Check console or server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Analytics Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* FORMAT */}
          <div>
            <Label className="mb-2 block">Export Format</Label>
            <div className="flex gap-2">
              <Button
                variant={format === 'csv' ? 'default' : 'outline'}
                onClick={() => setFormat('csv')}
                className="flex-1"
              >
                CSV
              </Button>
              <Button
                variant={format === 'pdf' ? 'default' : 'outline'}
                onClick={() => setFormat('pdf')}
                className="flex-1"
              >
                PDF
              </Button>
            </div>
          </div>

          {/* METRICS */}
          <div>
            <Label className="mb-2 block">Select Metrics</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableMetrics.map(metric => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={() => toggleMetric(metric.id)}
                  />
                  <label htmlFor={metric.id} className="text-sm cursor-pointer">
                    {metric.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* EMAIL */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="send-email"
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(!!checked)}
              />
              <label
                htmlFor="send-email"
                className="text-sm font-medium cursor-pointer flex items-center"
              >
                <Mail className="w-4 h-4 mr-1" />
                Send via Email
              </label>
            </div>

            {sendEmail && (
              <div>
                <Label htmlFor="email-recipients" className="text-xs">
                  Recipients (comma-separated)
                </Label>
                <Input
                  id="email-recipients"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  placeholder="user1@example.com, user2@example.com"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <Button
            onClick={handleExport}
            disabled={loading || selectedMetrics.length === 0}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4 mr-2" />
            )}

            {sendEmail ? 'Export & Send Email' : 'Export Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
