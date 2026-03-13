import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS = 'BizStack AI <hello@bizstack.vip>';
const TEAM_EMAIL   = 'andrew@peakagentai.com';

// ─── HTML EMAIL TO TEAM ───────────────────────────────────────────
function buildTeamEmail(d) {
  const businessName = d.business_name || 'Unknown Business';
  const contactName  = d.full_name || 'Unknown';
  const email        = d.business_email || '';
  const phone        = d.business_phone || '';

  // Collect checked brand feel pills
  const feelPills = ['professional','friendly','luxury','bold','minimalist','playful','corporate','creative']
    .filter(f => d['feel_' + f]).join(', ') || '—';

  // Collect checked page pills
  const pages = ['home','about','services','contact','blog','faq','testimonials','gallery','booking','other']
    .filter(p => d['page_' + p]).join(', ') || '—';

  // Collect lead contact methods
  const leadMethods = ['phone','email','website_form','social','walkin','referral','other']
    .filter(m => d['lead_' + m]).map(m => m.replace('_', ' ')).join(', ') || '—';

  // Tools with "yes"
  const TOOLS = ['google_business','google_analytics','facebook_page','instagram_business',
    'google_ads','facebook_ads','email_list','stripe','scheduling_tool'];
  const hasTools = TOOLS.filter(t => d['tool_' + t]).map(t => t.replace(/_/g, ' ')).join(', ') || 'None';

  const bool = v => v ? '<span style="color:#10B981;font-weight:600;">Yes</span>' : '<span style="color:#475569;">No</span>';

  const row = (label, value) => `
    <tr>
      <td style="padding:7px 0;border-bottom:1px solid #1E293B;font-size:13px;color:#94A3B8;width:38%;vertical-align:top;">${label}</td>
      <td style="padding:7px 0;border-bottom:1px solid #1E293B;font-size:13px;color:#F1F5F9;vertical-align:top;">${value || '<span style="color:#475569;">—</span>'}</td>
    </tr>`;

  const section = (title, accentColor, rows) => `
    <tr><td colspan="2" style="padding:20px 0 8px;">
      <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accentColor};">${title}</p>
    </td></tr>
    ${rows}`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0F172A;font-family:'Inter',system-ui,sans-serif;color:#F1F5F9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;">

  <!-- Header -->
  <tr><td style="padding-bottom:24px;text-align:center;">
    <div style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:20px;font-weight:800;color:#FFFFFF;">
      BizStack<span style="color:#3B82F6;">.vip</span>
    </div>
  </td></tr>

  <!-- Eyebrow -->
  <tr><td style="padding-bottom:6px;text-align:center;">
    <span style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#10B981;">New Onboarding Submission</span>
  </td></tr>

  <!-- Hero -->
  <tr><td style="padding-bottom:6px;text-align:center;">
    <h1 style="margin:0;font-family:'Space Grotesk',system-ui,sans-serif;font-size:24px;font-weight:800;color:#FFFFFF;letter-spacing:-.02em;">
      ${businessName}
    </h1>
  </td></tr>
  <tr><td style="padding-bottom:28px;text-align:center;">
    <p style="margin:0;font-size:14px;color:#94A3B8;">Submitted by ${contactName} &mdash; your 48-hour clock is running</p>
  </td></tr>

  <!-- Quick contact bar -->
  <tr><td style="padding-bottom:24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1E293B;border:1px solid rgba(255,255,255,.08);border-radius:10px;overflow:hidden;">
      <tr><td style="height:2px;background:linear-gradient(90deg,#3B82F6,#8B5CF6);"></td></tr>
      <tr>
        <td style="padding:14px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="font-size:13px;color:#94A3B8;">
                📧 <a href="mailto:${email}" style="color:#3B82F6;text-decoration:none;">${email || '—'}</a>
              </td>
              <td width="50%" style="font-size:13px;color:#94A3B8;">
                📞 <a href="tel:${phone}" style="color:#3B82F6;text-decoration:none;">${phone || '—'}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Data table -->
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1E293B;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:0 20px;">
      <tr><td style="height:2px;background:#3B82F6;border-radius:10px 10px 0 0;" colspan="2"></td></tr>
      <tr><td colspan="2" style="padding:4px;"></td></tr>

      ${section('Section 1 — Business', '#3B82F6', `
        ${row('Business Name', d.business_name)}
        ${row('Contact Name', d.full_name)}
        ${row('Role / Title', d.role_title)}
        ${row('Phone', d.business_phone)}
        ${row('Email', d.business_email)}
        ${row('Address / City', d.business_address)}
        ${row('Website', d.website_url)}
        ${row('Year Founded', d.year_founded)}
        ${row('Industry', d.industry)}
        ${row('Employees', d.num_employees)}
        ${row('Primary Service', d.primary_service)}
        ${row('Key Products / Services & Pricing', d.key_products_services)}
        ${row('Ideal Customer', d.ideal_customer)}
        ${row('Differentiator', d.differentiator)}
      `)}

      ${section('Section 2 — Brand', '#8B5CF6', `
        ${row('Primary Color', d.color_primary || '—')}
        ${row('Secondary Color', d.color_secondary || '—')}
        ${row('Color Description', d.color_description)}
        ${row('Design Elements', d.design_elements)}
        ${row('Font Preference', d.font_preference)}
        ${row('Brand Feel', feelPills)}
        ${row('3 Brand Words', d.brand_words)}
        ${row('Brands Admired', d.brands_admire)}
      `)}

      ${section('Section 3 — Website', '#06B6D4', `
        ${row('Domain', d.domain_name)}
        ${row('Registrar', d.domain_registrar)}
        ${row('Current Hosting', d.current_hosting)}
        ${row('Pages Wanted', pages)}
        ${row('Custom Pages', d.pages_other)}
        ${row('Services on Site', d.services_on_site)}
        ${row('Booking Form?', bool(d.want_booking))}
        ${row('Contact Form?', bool(d.want_contact))}
        ${row('Chatbot?', bool(d.want_chatbot))}
        ${row('Site Examples', d.website_examples)}
        ${row('Website Hates', d.website_hates)}
      `)}

      ${section('Section 4 — CRM & Lead Flow', '#F59E0B', `
        ${row('Current CRM', d.current_crm === 'other' ? d.crm_other : d.current_crm)}
        ${row('Lead Contact Methods', leadMethods)}
        ${row('Follow-up Speed', d.followup_speed)}
        ${row('Sales Cycle', d.sales_cycle)}
        ${row('Lead Journey', d.lead_journey)}
        ${row('Avg Transaction', d.avg_transaction)}
        ${row('Appt Reminders?', bool(d.want_reminders))}
        ${row('Review Requests?', bool(d.want_reviews))}
        ${row('Email Marketing Tool', d.email_marketing_tool)}
        ${row('SMS Platform', d.sms_platform)}
      `)}

      ${section('Section 5 — Goals', '#10B981', `
        ${row('90-Day Goal', d.goal_90_days)}
        ${row('Revenue Goal', d.revenue_goal)}
        ${row('Biggest Problem', d.biggest_problem)}
        ${row('Tasks to Automate', d.tasks_to_automate)}
        ${row('Success in 12 Months', d.success_12mo)}
        ${row('Anything Else', d.anything_else)}
      `)}

      ${section('Section 6 — Existing Tools', '#94A3B8', `
        ${row('Has Tools', hasTools)}
        ${TOOLS.map(t => {
          const notes = d['tool_' + t + '_notes'] || '';
          const contacts = t === 'email_list' ? d['tool_email_list_contacts'] : null;
          let extra = notes ? ` — <em style="color:#64748B;">${notes}</em>` : '';
          if (contacts) extra += ` (${contacts} contacts)`;
          return row(t.replace(/_/g, ' '), d['tool_' + t] ? `<span style="color:#10B981;">Yes</span>${extra}` : '<span style="color:#475569;">No</span>');
        }).join('')}
        ${row('Other Tools', d.other_tools)}
      `)}

      <tr><td colspan="2" style="padding:8px;"></td></tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding-top:24px;text-align:center;">
    <p style="margin:0 0 4px;font-family:'Space Grotesk',system-ui,sans-serif;font-size:13px;font-weight:700;color:#FFFFFF;">
      BizStack<span style="color:#3B82F6;">.vip</span>
    </p>
    <p style="margin:0;font-size:11px;color:#475569;">
      Built in 48 hours.
      &nbsp;·&nbsp;
      <a href="mailto:hello@bizstack.vip" style="color:#475569;">hello@bizstack.vip</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── HANDLER ─────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const d = req.body || {};
  const businessName = d.business_name || 'Unknown Business';
  const contactEmail = d.business_email;

  if (!contactEmail) {
    return res.status(400).json({ error: 'Missing business_email' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('[onboarding-submit] RESEND_API_KEY not set — skipping email');
    return res.status(200).json({ success: true, mode: 'dev-no-key' });
  }

  const teamHtml = buildTeamEmail(d);

  try {
    const result = await resend.emails.send({
      from:    FROM_ADDRESS,
      to:      [TEAM_EMAIL],
      subject: `Onboarding Checklist Submitted: ${businessName}`,
      html:    teamHtml,
    });

    console.log('[onboarding-submit] Team email sent:', result.data?.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[onboarding-submit] Resend error:', err);
    // Don't fail the client — just log
    return res.status(200).json({ success: true, emailError: err.message });
  }
}
