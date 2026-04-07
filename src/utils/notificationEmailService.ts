import { supabase } from '@/lib/supabase';

interface EmailNotificationParams {
  userId: string;
  draftTitle: string;
  notificationType: 'content_submitted' | 'content_approved' | 'content_rejected';
  reviewerName?: string;
  comment?: string;
}

export async function sendContentNotificationEmail(params: EmailNotificationParams) {
  try {
    // Get user preferences and email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, notification_preferences')
      .eq('id', params.userId)
      .single();

    if (userError || !user) {
      console.error('User not found for email notification');
      return { success: false, error: 'User not found' };
    }

    const prefs = user.notification_preferences || {};
    
    // Check if email notifications are enabled
    const emailEnabled = prefs.email_notifications !== false;
    const eventEnabled = prefs[params.notificationType] !== false;

    if (!emailEnabled || !eventEnabled) {
      return { success: true, message: 'Email notifications disabled' };
    }

    // Call edge function to send email
    const { data, error } = await supabase.functions.invoke('send-report-email', {
      body: {
        recipientEmail: user.email,
        notificationType: params.notificationType,
        draftTitle: params.draftTitle,
        reviewerName: params.reviewerName,
        comment: params.comment
      }
    });

    if (error) {
      console.error('Failed to send email notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error: String(error) };
  }
}
