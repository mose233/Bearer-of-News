import { Resend } from "resend";

export async function onRequestPost(context: any) {
  try {
    const resend = new Resend(context.env.RESEND_API_KEY);

    const { email, link } = await context.request.json();

    const response = await resend.emails.send({
      from: "Bearer of News <noreply@xnewsapp.com>",
      to: email,
      subject: "You are invited to join a team",
      html: `
        <h2>You have been invited</h2>
        <p>Click below to join:</p>
        <a href="${link}">${link}</a>
      `,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
