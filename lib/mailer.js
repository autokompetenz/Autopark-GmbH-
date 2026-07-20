const nodemailer = require('nodemailer');
const crypto = require('crypto');

// ─── Transporter ────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL — more reliable than STARTTLS for deliverability
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true,         // reuse connections
  maxConnections: 5,
  rateLimit: 5,       // max 5 messages/second
  tls: {
    rejectUnauthorized: true,
  },
});

const DOMAIN = (process.env.SMTP_USER || '').split('@')[1] || 'gmail.com';
const FROM   = `"${process.env.FROM_NAME || 'Autopark GmbH'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`;

function getPublicSiteUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  return 'https://autopark-gmbh.vercel.app';
}

// ─── Base send helper — adds anti-spam headers ───────────────────────────────
async function sendMail({ to, subject, html, text }) {
  const messageId = `<${crypto.randomUUID()}@${DOMAIN}>`;

  return transporter.sendMail({
    from:    FROM,
    to,
    subject,
    html,
    text,     // plain-text fallback — required by RFC 2822, helps deliverability
    headers: {
      'Message-ID':        messageId,
      'X-Mailer':          'Autopark Mailer v2',
      'X-Entity-Ref-ID':   crypto.randomUUID(),  // unique per message — avoids threading bugs
      'Precedence':        'bulk',
      'List-Unsubscribe':  `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>`, // required by Gmail/Yahoo 2024 policy
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatEuro(amount) {
  if (!amount && amount !== 0) return '—';
  return '€' + new Intl.NumberFormat('en-US').format(Math.round(amount));
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ─── Base HTML wrapper ───────────────────────────────────────────────────────
function baseTemplate(content) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Autopark GmbH</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0B;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0B;min-height:100vh;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:#111113;border-radius:12px 12px 0 0;padding:32px 40px;border-bottom:2px solid #132853;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:0.04em;">AUTO KOMPETENZ</div>
                  <div style="font-size:9px;letter-spacing:0.4em;color:#132853;text-transform:uppercase;margin-top:3px;">GmbH · Naumburg</div>
                </td>
                <td align="right">
                  <div style="width:48px;height:48px;background:#132853;border-radius:8px;display:inline-block;line-height:48px;text-align:center;font-size:22px;">🚗</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CONTENT -->
        <tr>
          <td style="background:#18181A;padding:40px 40px 32px;">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#111113;border-radius:0 0 12px 12px;padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:12px;color:rgba(255,255,255,0.3);line-height:1.8;">
                  <strong style="color:rgba(255,255,255,0.5);">Autopark GmbH</strong><br/>
                   Franz-Julius-Haenel-Str. 3 · 06618 Naumburg, Allemagne<br/>
                   📧 info@autopark-gmbh.com<br/>
                  💬 <a href="https://wa.me/4915788823274" style="color:#132853;text-decoration:none;">WhatsApp</a>
                </td>
                <td align="right" style="font-size:11px;color:rgba(255,255,255,0.15);">
                  © ${new Date().getFullYear()} Autopark GmbH
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Email 1 : Bienvenue après inscription ───────────────────────────────────
async function sendWelcomeEmail({ email, firstName, lastName }) {
  const content = `
    <!-- Hero -->
    <div style="text-align:center;margin-bottom:36px;">
      <div style="width:72px;height:72px;background:rgba(19,40,83,0.1);border:2px solid rgba(19,40,83,0.3);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:20px;">👋</div>
      <h1 style="margin:0 0 10px;font-size:30px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;">Bienvenue, ${firstName} !</h1>
      <p style="margin:0;font-size:16px;color:rgba(255,255,255,0.45);line-height:1.6;">Votre compte Autopark est prêt.</p>
    </div>

    <!-- Divider -->
    <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:32px;"></div>

    <!-- Message -->
    <p style="font-size:15px;color:rgba(255,255,255,0.65);line-height:1.8;margin:0 0 24px;">
      Bonjour <strong style="color:#fff;">${firstName} ${lastName}</strong>,<br/><br/>
      Nous sommes ravis de vous accueillir dans la famille <strong style="color:#132853;">Autopark GmbH</strong>.
      Votre compte est désormais actif et vous pouvez dès à présent explorer notre catalogue de véhicules.
    </p>

    <!-- Features -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      ${[
        ['🔍', 'Catalogue complet', 'Explorez notre sélection de véhicules neufs et d\'occasion'],
        ['💳', '3 modes de paiement', 'Intégral (-5%), acompte 25% ou mensualités sur 60 mois'],
        ['📍', 'Suivi en temps réel', 'Suivez l\'avancement de vos commandes en ligne'],
      ].map(([icon, title, desc]) => `
      <tr>
        <td style="padding:10px 0;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:44px;height:44px;background:rgba(19,40,83,0.08);border:1px solid rgba(19,40,83,0.2);border-radius:8px;text-align:center;vertical-align:middle;font-size:20px;">${icon}</td>
              <td style="padding-left:14px;">
                <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:2px;">${title}</div>
                <div style="font-size:13px;color:rgba(255,255,255,0.4);">${desc}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`).join('')}
    </table>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${getPublicSiteUrl()}/catalog"
         style="display:inline-block;background:#132853;color:#fff;text-decoration:none;font-size:14px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:16px 40px;border-radius:6px;">
        🚘 Découvrir nos véhicules
      </a>
    </div>

    <p style="font-size:13px;color:rgba(255,255,255,0.25);text-align:center;margin:0;">
      Pour toute question, contactez-nous sur WhatsApp ou par email.
    </p>
  `;

  await sendMail({
    to:      email,
    subject: `Bienvenue chez Autopark, ${firstName} !`,
    html:    baseTemplate(content),
    text:    `Bienvenue, ${firstName} ${lastName} !\n\nVotre compte Autopark GmbH est actif.\n\nDécouvrez notre catalogue : ${getPublicSiteUrl()}/catalog\n\n-- Autopark GmbH\nFranz-Julius-Haenel-Str. 3 · 06618 Naumburg`,
  });
}

// ─── Email 2 : Confirmation de commande ─────────────────────────────────────
async function sendOrderConfirmationEmail({ email, firstName, order, items }) {
  const PAYMENT_LABELS = {
    full:    'Paiement intégral (-5%)',
    deposit: 'Acompte 25%',
    monthly: 'Mensualités 60 mois',
  };

  const itemsRows = items.map(item => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="width:70px;">
              <img src="${item.car.imageUrl || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&q=70'}"
                   alt="${item.car.make} ${item.car.model}"
                   width="70" height="50"
                   style="object-fit:cover;border-radius:6px;display:block;"/>
            </td>
            <td style="padding-left:14px;">
              <div style="font-size:15px;font-weight:700;color:#fff;">${item.car.make} ${item.car.model} ${item.car.year}</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.35);margin-top:3px;">${item.car.fuelType} · ${item.car.transmission}</div>
            </td>
            <td align="right" style="font-size:17px;font-weight:900;color:#132853;white-space:nowrap;">
              ${formatEuro(item.unitPrice)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  // Financial summary rows
  const finRows = [];
  if (order.discountAmount) {
    finRows.push(`<tr><td style="font-size:14px;color:#22C55E;padding:5px 0;">Remise appliquée (-5%)</td><td align="right" style="font-size:14px;color:#22C55E;font-weight:700;">- ${formatEuro(order.discountAmount)}</td></tr>`);
  }
  if (order.depositAmount) {
    finRows.push(`<tr><td style="font-size:14px;color:rgba(255,255,255,0.5);padding:5px 0;">Acompte à régler (25%)</td><td align="right" style="font-size:14px;color:#132853;font-weight:700;">${formatEuro(order.depositAmount)}</td></tr>`);
  }
  if (order.monthlyAmount) {
    finRows.push(`<tr><td style="font-size:14px;color:rgba(255,255,255,0.5);padding:5px 0;">Mensualité × ${order.monthlyDuration}</td><td align="right" style="font-size:14px;color:#132853;font-weight:700;">${formatEuro(order.monthlyAmount)}/mois</td></tr>`);
  }

  const content = `
    <!-- Hero -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="width:72px;height:72px;background:rgba(34,197,94,0.1);border:2px solid rgba(34,197,94,0.3);border-radius:50%;display:inline-block;line-height:72px;font-size:32px;margin-bottom:18px;">✓</div>
      <h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;">Commande confirmée !</h1>
      <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.45);">Merci pour votre confiance, ${firstName}.</p>
    </div>

    <!-- Order number badge -->
    <div style="background:rgba(19,40,83,0.06);border:1px solid rgba(19,40,83,0.2);border-radius:10px;padding:20px 24px;text-align:center;margin-bottom:28px;">
      <div style="font-size:11px;font-weight:800;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:8px;">Numéro de bon de commande</div>
      <div style="font-size:32px;font-weight:900;color:#132853;letter-spacing:0.08em;font-family:monospace;">${order.orderNumber}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.3);margin-top:6px;">Passée le ${formatDate(order.createdAt)}</div>
    </div>

    <!-- Items -->
    <div style="font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:14px;">Véhicules commandés</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${itemsRows}
    </table>

    <!-- Financial summary -->
    <div style="background:#111113;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <div style="font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:14px;">Récapitulatif financier</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:14px;color:rgba(255,255,255,0.5);padding:5px 0;">Mode de paiement</td>
          <td align="right" style="font-size:14px;color:#fff;font-weight:600;">${PAYMENT_LABELS[order.paymentType] || order.paymentType}</td>
        </tr>
        ${finRows.join('')}
        <tr><td colspan="2"><div style="height:1px;background:rgba(255,255,255,0.07);margin:10px 0;"></div></td></tr>
        <tr>
          <td style="font-size:16px;font-weight:700;color:#fff;">Total</td>
          <td align="right" style="font-size:26px;font-weight:900;color:#fff;letter-spacing:-0.02em;">${formatEuro(order.totalPrice)}</td>
        </tr>
      </table>
    </div>

    <!-- Delivery address -->
    ${order.shippingAddress ? `
    <div style="background:#111113;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:18px 24px;margin-bottom:28px;">
      <div style="font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:8px;">Adresse de livraison</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.65);line-height:1.6;">${order.shippingAddress.replace(/\n/g, '<br/>')}</div>
    </div>` : ''}

    <!-- CTAs -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding-right:8px;">
          <a href="${getPublicSiteUrl()}/track/${order.orderNumber}"
             style="display:block;background:#132853;color:#fff;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:14px 20px;border-radius:6px;text-align:center;">
            📍 Suivre ma commande
          </a>
        </td>
        <td style="padding-left:8px;">
          <a href="${getPublicSiteUrl()}/orders"
             style="display:block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.8);text-decoration:none;font-size:13px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:14px 20px;border-radius:6px;text-align:center;">
            📦 Mes commandes
          </a>
        </td>
      </tr>
    </table>

    <p style="font-size:13px;color:rgba(255,255,255,0.25);text-align:center;margin:0;line-height:1.7;">
      Notre équipe prend en charge votre commande.<br/>
      Vous recevrez une mise à jour dès que le statut évolue.
    </p>
  `;

  const itemsText = items.map(i => `- ${i.car.make} ${i.car.model} ${i.car.year} : ${formatEuro(i.unitPrice)}`).join('\n');
  const finText   = [
    order.discountAmount  ? `Remise : -${formatEuro(order.discountAmount)}`                         : null,
    order.depositAmount   ? `Acompte 25% : ${formatEuro(order.depositAmount)}`                      : null,
    order.monthlyAmount   ? `Mensualité : ${formatEuro(order.monthlyAmount)}/mois × ${order.monthlyDuration}` : null,
  ].filter(Boolean).join('\n');

  await sendMail({
    to:      email,
    subject: `Bon de commande ${order.orderNumber} - Autopark`,
    html:    baseTemplate(content),
    text: [
      `Commande confirmée - Autopark GmbH`,
      ``,
      `Bonjour ${firstName},`,
      `Votre commande ${order.orderNumber} a bien été enregistrée.`,
      ``,
      `VÉHICULES :`,
      itemsText,
      ``,
      `PAIEMENT : ${({ full:'Intégral (-5%)', deposit:'Acompte 25%', monthly:'Mensualités 60 mois' })[order.paymentType]}`,
      finText,
      `Total : ${formatEuro(order.totalPrice)}`,
      ``,
      `Suivi : ${getPublicSiteUrl()}/track/${order.orderNumber}`,
      ``,
      `-- Autopark GmbH`,
      `Franz-Julius-Haenel-Str. 3 · 06618 Naumburg`,
    ].join('\n'),
  });
}

const STATUS_LABELS_FR = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En traitement',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

/** Notifie le client lorsque l’admin fait progresser le statut de la commande (ou envoie un message). */
async function sendOrderStatusUpdateEmail({
  email,
  firstName,
  orderNumber,
  status,
  comment,
  statusChanged = true,
}) {
  const base = getPublicSiteUrl();
  const label = STATUS_LABELS_FR[status] || status;
  const safeComment = comment && String(comment).trim()
    ? String(comment).trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
    : '';
  const commentBlock = safeComment
    ? `<div style="margin-top:20px;padding:16px 18px;background:#111113;border:1px solid rgba(255,255,255,0.08);border-radius:10px;">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:8px;">Message de notre équipe</div>
        <div style="font-size:15px;color:rgba(255,255,255,0.75);line-height:1.65;white-space:pre-wrap;">${safeComment}</div>
      </div>`
    : '';

  const headline = statusChanged
    ? 'Étape de commande mise à jour'
    : 'Message concernant votre commande';
  const statusLine = statusChanged
    ? `<div style="margin-top:14px;font-size:15px;color:rgba(255,255,255,0.55);">Nouveau statut : <strong style="color:#fff;">${label}</strong></div>`
    : `<div style="margin-top:14px;font-size:15px;color:rgba(255,255,255,0.55);">Statut actuel : <strong style="color:#fff;">${label}</strong></div>`;

  const content = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:64px;height:64px;background:rgba(19,40,83,0.1);border:2px solid rgba(19,40,83,0.35);border-radius:50%;display:inline-block;line-height:64px;font-size:28px;margin-bottom:16px;">📦</div>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;">${headline}</h1>
      <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.45);">Bonjour <strong style="color:#fff;">${firstName}</strong>, le suivi de votre commande a été mis à jour.</p>
    </div>
    <div style="background:rgba(19,40,83,0.06);border:1px solid rgba(19,40,83,0.22);border-radius:10px;padding:20px 22px;text-align:center;margin-bottom:22px;">
      <div style="font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:8px;">Bon de commande</div>
      <div style="font-size:26px;font-weight:900;color:#132853;letter-spacing:0.06em;font-family:monospace;">${orderNumber}</div>
      ${statusLine}
    </div>
    ${commentBlock}
    <div style="text-align:center;margin-top:28px;">
      <a href="${base}/track/${orderNumber}"
         style="display:inline-block;background:#132853;color:#fff;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:14px 28px;border-radius:6px;">
        Voir le détail du suivi
      </a>
    </div>
    <p style="font-size:13px;color:rgba(255,255,255,0.28);text-align:center;margin:24px 0 0;line-height:1.7;">
      Une question ? Répondez à cet e-mail ou contactez-nous au +49 157 888 232 74.
    </p>
  `;

  const textIntro = statusChanged
    ? `Votre commande ${orderNumber} : nouveau statut « ${label} ».`
    : `Mise à jour pour la commande ${orderNumber} (statut : ${label}).`;
  const textLines = [
    `Bonjour ${firstName},`,
    ``,
    textIntro,
    safeComment ? `\nMessage :\n${safeComment}` : '',
    ``,
    `Suivi : ${base}/track/${orderNumber}`,
    ``,
    `— Autopark GmbH`,
  ].filter(Boolean);

  const subj = statusChanged
    ? `Commande ${orderNumber} — ${label} · Autopark`
    : `Commande ${orderNumber} — message Autopark`;

  await sendMail({
    to: email,
    subject: subj,
    html: baseTemplate(content),
    text: textLines.join('\n'),
  });
}

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};