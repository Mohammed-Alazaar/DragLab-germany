const fs = require('fs');
const nodemailer = require('nodemailer');
const sg = require('@sendgrid/mail');

const EMAIL_DELIVERY_ENABLED = String(process.env.EMAIL_DELIVERY_ENABLED || 'true') === 'true';
const SENDGRID_SANDBOX = String(process.env.SENDGRID_SANDBOX || 'false') === 'true';

if (process.env.SENDGRID_API_KEY) {
  sg.setApiKey(process.env.SENDGRID_API_KEY);
}

const TEMPLATES = {
  technicalSupport: 'd-66deb38dcff64e8e8fe7140d1bd0c808',
  warrantyRegistration: 'd-fcd989123b6a4dbbb6af8ef1767c042b',
  contactUs:'d-072c00ede8154038b00431343edd9bdf'

};

function pickTemplate(form) {
  const id = TEMPLATES[form];
  if (!id) throw new Error(`Unknown form: ${form}`);
  return id;
}

function logDryRun(obj) {
  const line = `[${new Date().toISOString()}] ${JSON.stringify(obj)}\n`;
  console.warn('📭 [email:dry-run]', obj);
  try { fs.appendFileSync('./mail-dry-run.log', line); } catch {}
}

// ---------- SMTP transport for INTERNAL alerts ----------
const internalTx = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || 'true') === 'true',
      auth: (process.env.SMTP_USER && process.env.SMTP_PASS)
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  : null;

// ---------- Send customer email via SendGrid ----------
async function sendCustomerEmail({ to, form, data }) {
  const templateId = pickTemplate(form);

  if (!EMAIL_DELIVERY_ENABLED) {
    logDryRun({ type: 'customer', to, form, templateId, data });
    return { ok: true, dryRun: true };
  }

  const msg = {
    to,
    from: process.env.SENDGRID_FROM,
    replyTo: process.env.SENDGRID_REPLYTO || process.env.SENDGRID_FROM,
    templateId,
    dynamicTemplateData: data,
    mailSettings: { sandboxMode: { enable: SENDGRID_SANDBOX } },
    // (optional) tracking off:
    // trackingSettings: { clickTracking: { enable:false, enableText:false }, openTracking: { enable:false } }
  };

  try { await sg.send(msg); return { ok: true }; }
  catch (err) {
    console.error('SendGrid sendCustomerEmail error:', err?.response?.body || err?.message || err);
    return { ok: false, error: err };
  }
}

// ---------- Send internal notification: SMTP for @drag-lab.de; SG for others ----------
async function notifyInternal({ to, subject, html, text }) {
  if (!EMAIL_DELIVERY_ENABLED) {
    logDryRun({ type: 'internal', to, subject, html, text });
    return { ok: true, dryRun: true };
  }

  const isInternal = /@drag-lab\.de$/i.test(to);

  if (isInternal) {
    if (!internalTx) {
      const err = new Error('SMTP transport not configured for internal mail');
      console.error(err.message);
      return { ok: false, error: err };
    }
    try {
      await internalTx.sendMail({
        from: process.env.SMTP_FROM || process.env.SENDGRID_FROM,
        to, subject, html, text,
      });
      return { ok: true };
    } catch (err) {
      console.error('Local SMTP notifyInternal error:', err?.message || err);
      return { ok: false, error: err };
    }
  }

  // External recipients → SendGrid
  const msg = {
    to,
    from: process.env.SENDGRID_FROM,
    replyTo: process.env.SENDGRID_REPLYTO || process.env.SENDGRID_FROM,
    subject,
    ...(html ? { html } : { text }),
    mailSettings: { sandboxMode: { enable: SENDGRID_SANDBOX } },
  };

  try { await sg.send(msg); return { ok: true }; }
  catch (err) {
    console.error('SendGrid notifyInternal error:', err?.response?.body || err?.message || err);
    return { ok: false, error: err };
  }
}

// ---------- verify helpers ----------
async function verifyMailTransports() {
  if (internalTx) {
    try {
      await internalTx.verify();
      console.log('✅ SMTP transport ready for internal mail');
    } catch (e) {
      console.error('❌ SMTP transport verify failed:', e?.message || e);
    }
  } else {
    console.warn('⚠️ SMTP transport not configured (set SMTP_HOST/PORT/SECURE/USER/PASS/SMTP_FROM)');
  }

  if (process.env.SENDGRID_API_KEY) {
    if (!process.env.SENDGRID_FROM) {
      console.warn('⚠️ SENDGRID_FROM is not set (customer emails will fail to send)');
    } else {
      console.log(`✅ SendGrid configured with FROM: ${process.env.SENDGRID_FROM}`);
    }
  } else {
    console.warn('⚠️ SENDGRID_API_KEY not set (customer emails will be disabled)');
  }
}

module.exports = { sendCustomerEmail, notifyInternal, verifyMailTransports };
