// This file documents the automated report scheduling system
// In production, you would set up a cron job or scheduled task to run this periodically

import { supabase } from '@/lib/supabase';

export async function processScheduledReports() {
  // Fetch all scheduled reports that are due
  const now = new Date();
  
  const { data: dueReports } = await supabase
    .from('scheduled_reports')
    .select('*')
    .lte('next_generation_at', now.toISOString())
    .eq('is_active', true);

  if (!dueReports) return;

  for (const report of dueReports) {
    try {
      // Fetch analytics data for the report period
      const { data: drafts } = await supabase
        .from('content_drafts')
        .select('*, users(full_name)')
        .eq('team_id', report.team_id);

      if (!drafts) continue;

      // Calculate metrics
      const reportData = {
        totalContent: drafts.length,
        approvalRate: Math.round((drafts.filter(d => d.status === 'approved').length / drafts.length) * 100) || 0,
        avgReviewTime: calculateAvgReviewTime(drafts),
        activeContributors: new Set(drafts.map(d => d.created_by)).size,
        recentContent: drafts.slice(0, 10).map(d => ({
          title: d.title,
          status: d.status,
          created_at: d.created_at
        }))
      };

      // Send email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-report-email', {
        body: {
          recipientEmails: report.recipient_emails,
          reportData,
          dateRange: {
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            to: new Date().toLocaleDateString()
          }
        }
      });

      // Update report status
      const nextGeneration = calculateNextGeneration(report.frequency);
      await supabase
        .from('scheduled_reports')
        .update({
          last_sent_at: now.toISOString(),
          next_generation_at: nextGeneration.toISOString(),
          delivery_status: emailError ? 'failed' : 'sent',
          delivery_error: emailError?.message || null,
          total_sends: (report.total_sends || 0) + 1
        })
        .eq('id', report.id);

    } catch (error) {
      console.error('Error processing report:', report.id, error);
    }
  }
}

function calculateAvgReviewTime(drafts: any[]) {
  const reviewed = drafts.filter(d => d.reviewed_at && d.submitted_at);
  if (reviewed.length === 0) return 0;
  const total = reviewed.reduce((sum, d) => {
    return sum + (new Date(d.reviewed_at).getTime() - new Date(d.submitted_at).getTime());
  }, 0);
  return Math.round(total / reviewed.length / (1000 * 60 * 60));
}

function calculateNextGeneration(frequency: string) {
  const next = new Date();
  if (frequency === 'daily') next.setDate(next.getDate() + 1);
  else if (frequency === 'weekly') next.setDate(next.getDate() + 7);
  else next.setMonth(next.getMonth() + 1);
  return next;
}
