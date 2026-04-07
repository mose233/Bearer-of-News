# Email Notification Setup Guide

## Overview
The Bearer of News platform now includes automated email notifications for content workflow events.

## Edge Function Setup

To enable email notifications, update the `send-report-email` edge function with the following code:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    // Handle content notifications
    if (body.notificationType) {
      const { recipientEmail, notificationType, draftTitle, reviewerName, comment } = body;
      const appUrl = Deno.env.get('APP_URL') || 'https://app.example.com';
      
      let subject = '', html = '';
      
      if (notificationType === 'content_submitted') {
        subject = \`📝 New Content: "\${draftTitle}"\`;
        html = \`<div style="font-family:Arial;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:30px;text-align:center"><h1 style="color:white;margin:0">📝 New Content Submitted</h1></div><div style="padding:30px;background:#f9fafb"><p>A new draft needs review:</p><div style="background:white;border-left:4px solid #667eea;padding:20px;margin:20px 0"><h2 style="margin:0 0 10px 0">\${draftTitle}</h2></div><a href="\${appUrl}/content-approval" style="display:inline-block;background:#667eea;color:white;padding:12px 24px;text-decoration:none;border-radius:6px">Review Content</a></div></div>\`;
      } else if (notificationType === 'content_approved') {
        subject = \`✅ Content Approved: "\${draftTitle}"\`;
        html = \`<div style="font-family:Arial;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:30px;text-align:center"><h1 style="color:white;margin:0">✅ Content Approved!</h1></div><div style="padding:30px;background:#f9fafb"><p>Your content was approved:</p><div style="background:white;border-left:4px solid #10b981;padding:20px;margin:20px 0"><h2 style="margin:0 0 10px 0">\${draftTitle}</h2><p style="color:#6b7280">Reviewed by: \${reviewerName || 'Team Reviewer'}</p>\${comment ? \`<p style="color:#6b7280;margin-top:10px;font-style:italic">"\${comment}"</p>\` : ''}</div></div></div>\`;
      } else if (notificationType === 'content_rejected') {
        subject = \`📋 Revision Needed: "\${draftTitle}"\`;
        html = \`<div style="font-family:Arial;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);padding:30px;text-align:center"><h1 style="color:white;margin:0">📋 Content Needs Revision</h1></div><div style="padding:30px;background:#f9fafb"><p>Your content needs changes:</p><div style="background:white;border-left:4px solid #ef4444;padding:20px;margin:20px 0"><h2 style="margin:0 0 10px 0">\${draftTitle}</h2>\${comment ? \`<div style="background:#fef2f2;padding:15px;margin-top:15px;border-radius:6px"><p style="color:#991b1b;font-weight:bold;margin:0">Feedback:</p><p style="color:#991b1b;margin:10px 0 0 0">\${comment}</p></div>\` : ''}</div></div></div>\`;
      }
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': \`Bearer \${RESEND_API_KEY}\`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Bearer of News <notifications@bearerof.news>',
          to: recipientEmail,
          subject,
          html
        })
      });
      
      const result = await response.json();
      return new Response(JSON.stringify({ success: response.ok, result }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Handle analytics reports (existing functionality)
    const { recipientEmails, reportData, dateRange } = body;
    // ... rest of analytics report code
    
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
```

## Environment Variables Required
- `RESEND_API_KEY`: Your Resend API key
- `APP_URL`: Your application URL (e.g., https://yourapp.com)

## Features Implemented
1. Real-time in-app notifications with bell icon dropdown
2. Email notifications for content_submitted, content_approved, content_rejected
3. User notification preferences in profile settings
4. Professional HTML email templates
5. Delivery tracking in scheduled_reports table
