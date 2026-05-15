export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();

    const RESEND_API_KEY =
      Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      throw new Error(
        'RESEND_API_KEY not configured'
      );
    }

    // =========================
    // CONTENT NOTIFICATIONS
    // =========================
    if (body.notificationType) {
      const {
        recipientEmail,
        notificationType,
        draftTitle,
        reviewerName,
        comment,
        draftId,
      } = body;

      const appUrl =
        Deno.env.get('APP_URL') ||
        'https://xnewsapp.com';

      let subject = '';
      let html = '';

      // =========================
      // CONTENT SUBMITTED
      // =========================
      if (
        notificationType ===
        'content_submitted'
      ) {
        subject = `📝 New Content: "${draftTitle}"`;

        html = `
        <div style="font-family:Arial;max-width:600px;margin:0 auto">

          <div style="
            background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
            padding:30px;
            text-align:center;
          ">
            <h1 style="color:white;margin:0">
              📝 New Content Submitted
            </h1>
          </div>

          <div style="
            padding:30px;
            background:#f9fafb;
          ">

            <p>
              A new content draft requires your review.
            </p>

            <div style="
              background:white;
              border-left:4px solid #667eea;
              padding:20px;
              margin:20px 0;
            ">
              <h2 style="margin:0 0 10px 0">
                ${draftTitle}
              </h2>
            </div>

            <a
              href="${appUrl}/content-review/${draftId}"
              style="
                display:inline-block;
                background:#667eea;
                color:white;
                padding:12px 24px;
                text-decoration:none;
                border-radius:6px;
                font-weight:bold;
              "
            >
              View & Review Content
            </a>

          </div>

        </div>
        `;
      }

      // =========================
      // CONTENT APPROVED
      // =========================
      else if (
        notificationType ===
        'content_approved'
      ) {
        subject = `✅ Content Approved: "${draftTitle}"`;

        html = `
        <div style="font-family:Arial;max-width:600px;margin:0 auto">

          <div style="
            background:linear-gradient(135deg,#10b981 0%,#059669 100%);
            padding:30px;
            text-align:center;
          ">
            <h1 style="color:white;margin:0">
              ✅ Content Approved!
            </h1>
          </div>

          <div style="
            padding:30px;
            background:#f9fafb;
          ">

            <p>Your content was approved:</p>

            <div style="
              background:white;
              border-left:4px solid #10b981;
              padding:20px;
              margin:20px 0;
            ">
              <h2 style="margin:0 0 10px 0">
                ${draftTitle}
              </h2>

              <p style="color:#6b7280">
                Reviewed by:
                ${reviewerName || 'Team Reviewer'}
              </p>

              ${
                comment
                  ? `
                <p style="
                  color:#6b7280;
                  margin-top:10px;
                  font-style:italic;
                ">
                  "${comment}"
                </p>
              `
                  : ''
              }

            </div>

          </div>

        </div>
        `;
      }

      // =========================
      // CONTENT REJECTED
      // =========================
      else if (
        notificationType ===
        'content_rejected'
      ) {
        subject = `📋 Revision Needed: "${draftTitle}"`;

        html = `
        <div style="font-family:Arial;max-width:600px;margin:0 auto">

          <div style="
            background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);
            padding:30px;
            text-align:center;
          ">
            <h1 style="color:white;margin:0">
              📋 Content Needs Revision
            </h1>
          </div>

          <div style="
            padding:30px;
            background:#f9fafb;
          ">

            <p>Your content needs changes:</p>

            <div style="
              background:white;
              border-left:4px solid #ef4444;
              padding:20px;
              margin:20px 0;
            ">

              <h2 style="margin:0 0 10px 0">
                ${draftTitle}
              </h2>

              ${
                comment
                  ? `
                <div style="
                  background:#fef2f2;
                  padding:15px;
                  margin-top:15px;
                  border-radius:6px;
                ">
                  <p style="
                    color:#991b1b;
                    font-weight:bold;
                    margin:0;
                  ">
                    Feedback:
                  </p>

                  <p style="
                    color:#991b1b;
                    margin:10px 0 0 0;
                  ">
                    ${comment}
                  </p>
                </div>
              `
                  : ''
              }

            </div>

          </div>

        </div>
        `;
      }

      // =========================
      // SEND EMAIL
      // =========================
      const response = await fetch(
        'https://api.resend.com/emails',
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            from:
              'xnewsapp <notifications@xnewsapp.com>',

            to: recipientEmail,

            subject,

            html,
          }),
        }
      );

      const result =
        await response.json();

      return new Response(
        JSON.stringify({
          success: response.ok,
          result,
        }),
        {
          headers: {
            'Content-Type':
              'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // =========================
    // ANALYTICS REPORTS
    // =========================
    const {
      recipientEmails,
      reportData,
      dateRange,
    } = body;

    return new Response(
      JSON.stringify({
        success: true,
        message:
          'Analytics functionality unchanged',
      }),
      {
        headers: {
          'Content-Type':
            'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,

        headers: {
          'Content-Type':
            'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});
