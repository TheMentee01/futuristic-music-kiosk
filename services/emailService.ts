import { Session } from '../types';

/**
 * Creates and opens a mailto: link to send the track to the customer and BCC the admin.
 * @param session - The session object containing customer and song details.
 * @param businessEmail - The admin/business email to BCC.
 */
export const sendEmailWithTrack = (session: Session, businessEmail: string) => {
    const subject = `Your AI-Generated Track is Ready: "${session.song.title}"`;
    const body = `Hi ${session.contactInfo.name},

Your track "${session.song.title}" is ready for download!

Here is your download link: ${session.song.audioUrl}

Please note: In a real-world scenario, this link would be persistent. For this kiosk demonstration, it is a temporary data URL that will expire when you close the kiosk.

---
Order Details:
Package: ${session.song.tier.name}
Price: $${session.song.tier.price}
---

Thank you for using the Futuristic Music Kiosk!
`;
    
    // The admin gets a copy of the customer's email via BCC.
    const mailtoLink = `mailto:${session.contactInfo.email}?bcc=${businessEmail}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // In a real kiosk, this would ideally be handled by a backend service for true automation.
    // For this web-based simulation, we use a mailto link which opens the user's/operator's default email client.
    // We use window.open() in a timeout to avoid potential browser popup-blocking issues.
    setTimeout(() => {
        window.open(mailtoLink, '_self');
    }, 100);
};
