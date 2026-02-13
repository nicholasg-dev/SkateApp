/**
 * Shared email HTML templates for SkateApp notifications.
 * Uses inline CSS for maximum email-client compatibility.
 */

const BRAND_DARK = "#0f172a";
const BRAND_GRADIENT = "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)";
const TEXT_PRIMARY = "#334155";
const TEXT_SECONDARY = "#475569";
const TEXT_MUTED = "#94a3b8";
const SURFACE = "#f1f5f9";
const BORDER = "#e2e8f0";

function wrapInLayout(content: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SkateApp</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', 'Segoe UI', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function headerBlock(title: string, subtitle?: string): string {
    return `
  <tr>
    <td style="background: ${BRAND_GRADIENT}; padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">${title}</h1>
      ${subtitle ? `<p style="color: #cbd5e1; margin: 12px 0 0; font-size: 14px;">${subtitle}</p>` : ""}
    </td>
  </tr>`;
}

function footerBlock(): string {
    return `
  <tr>
    <td style="background: ${SURFACE}; padding: 24px 32px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid ${BORDER}; border-top: none;">
      <p style="color: ${TEXT_MUTED}; font-size: 12px; margin: 0;">SkateApp — Drop-in Hockey Manager</p>
      <p style="color: ${TEXT_MUTED}; font-size: 11px; margin: 8px 0 0;">You received this email because you're on the SkateApp roster.</p>
    </td>
  </tr>`;
}

/**
 * Registration confirmation email sent when a new player signs up.
 */
export function buildRegistrationEmail(
    name: string,
    position: string,
    role: string
): string {
    const content = `
    ${headerBlock("🏒 Welcome to SkateApp!", "You've been added to the roster")}
    <tr>
      <td style="background: #ffffff; padding: 32px; border-left: 1px solid ${BORDER}; border-right: 1px solid ${BORDER};">
        <p style="color: ${TEXT_PRIMARY}; font-size: 16px; margin: 0 0 16px; line-height: 1.6;">
          Hey <strong>${name}</strong>,
        </p>
        <p style="color: ${TEXT_SECONDARY}; font-size: 15px; margin: 0 0 24px; line-height: 1.6;">
          You've been successfully added to the roster! Here are your details:
        </p>

        <!-- Details Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background: ${SURFACE}; padding: 20px 24px; border-radius: 8px; border: 1px solid ${BORDER};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 6px 0; color: ${TEXT_SECONDARY}; font-size: 14px; width: 100px;">Position</td>
                  <td style="padding: 6px 0; color: ${TEXT_PRIMARY}; font-size: 14px; font-weight: 600;">${position}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: ${TEXT_SECONDARY}; font-size: 14px;">Role</td>
                  <td style="padding: 6px 0; color: ${TEXT_PRIMARY}; font-size: 14px; font-weight: 600;">${role === "Sub" ? "Substitute" : "Regular"}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="color: ${TEXT_SECONDARY}; font-size: 15px; margin: 24px 0 8px; line-height: 1.6;">
          You'll receive weekly session announcements with date, time, and location details. Keep an eye on your inbox!
        </p>
        <p style="color: ${TEXT_SECONDARY}; font-size: 15px; margin: 0; line-height: 1.6;">
          See you on the ice! 🎉
        </p>
      </td>
    </tr>
    ${footerBlock()}`;

    return wrapInLayout(content);
}

/**
 * Weekly skate announcement email sent to all rostered players.
 */
export function buildAnnouncementEmail(
    playerName: string,
    sessionDate: string,
    sessionTime: string,
    location: string,
    maxPlayers: number,
    maxGoalies: number,
    inviteMessage: string
): string {
    // Format the date nicely if possible
    let formattedDate = sessionDate;
    try {
        const d = new Date(sessionDate + "T00:00:00");
        formattedDate = d.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        // keep raw string
    }

    // Format time
    let formattedTime = sessionTime;
    try {
        const [h, m] = sessionTime.split(":");
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        formattedTime = `${display}:${m} ${ampm}`;
    } catch {
        // keep raw string
    }

    // Convert newlines in the invite message to <br> tags
    const formattedMessage = inviteMessage
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

    const content = `
    ${headerBlock("🏒 Sk8 This Week!", formattedDate)}
    <tr>
      <td style="background: #ffffff; padding: 32px; border-left: 1px solid ${BORDER}; border-right: 1px solid ${BORDER};">
        <p style="color: ${TEXT_PRIMARY}; font-size: 16px; margin: 0 0 16px; line-height: 1.6;">
          Hey <strong>${playerName}</strong>,
        </p>

        <!-- Session Details Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
          <tr>
            <td style="background: ${SURFACE}; padding: 20px 24px; border-radius: 8px; border: 1px solid ${BORDER};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 8px 0; color: ${TEXT_SECONDARY}; font-size: 14px; width: 110px; vertical-align: top;">📅 Date</td>
                  <td style="padding: 8px 0; color: ${TEXT_PRIMARY}; font-size: 14px; font-weight: 600;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${TEXT_SECONDARY}; font-size: 14px; vertical-align: top;">🕐 Time</td>
                  <td style="padding: 8px 0; color: ${TEXT_PRIMARY}; font-size: 14px; font-weight: 600;">${formattedTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${TEXT_SECONDARY}; font-size: 14px; vertical-align: top;">📍 Location</td>
                  <td style="padding: 8px 0; color: ${TEXT_PRIMARY}; font-size: 14px; font-weight: 600;">${location}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${TEXT_SECONDARY}; font-size: 14px; vertical-align: top;">👥 Max Spots</td>
                  <td style="padding: 8px 0; color: ${TEXT_PRIMARY}; font-size: 14px; font-weight: 600;">${maxPlayers}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${TEXT_SECONDARY}; font-size: 14px; vertical-align: top;">🥅 Goalie Spots</td>
                  <td style="padding: 8px 0; color: ${TEXT_PRIMARY}; font-size: 14px; font-weight: 600;">${maxGoalies}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Invite Message -->
        ${inviteMessage ? `
        <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 0 0 24px;">
          <p style="color: ${TEXT_PRIMARY}; font-size: 14px; margin: 0; line-height: 1.7;">
            ${formattedMessage}
          </p>
        </div>
        ` : ""}

        <p style="color: ${TEXT_SECONDARY}; font-size: 15px; margin: 0 0 8px; line-height: 1.6;">
          Reply to this email or reach out to the organizer to confirm your spot!
        </p>
      </td>
    </tr>
    ${footerBlock()}`;

    return wrapInLayout(content);
}
