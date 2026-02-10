export const buildAdRequestMailto = (params: {
  businessName: string;
  email: string;
  phone: string;
  message: string;
}) => {
  const userId = localStorage.getItem('userId') || 'anonymous';
  const userName = localStorage.getItem('fullName') || params.businessName;
  const userEmail = localStorage.getItem('userEmail') || params.email;
  const userPhone = localStorage.getItem('mobileNumber') || params.phone;
  const companyName = localStorage.getItem('companyName') || params.businessName;
  const industry = localStorage.getItem('industry') || 'Not specified';
  const userPackage = localStorage.getItem('userPackage') || 'Free';

  const subject = `New Advertising Space Request - ${params.businessName}`;
  const body = `
NEW ADVERTISING SPACE REQUEST

========================================
BUSINESS DETAILS:
========================================
Business Name: ${params.businessName}
Contact Person: ${userName}
Email: ${userEmail}
Phone: ${params.phone || userPhone}
Industry: ${industry}
Package: ${userPackage}

========================================
USER DETAILS:
========================================
User ID: ${userId}
Company: ${companyName}
Email (from account): ${localStorage.getItem('userEmail') || 'Not available'}
Phone (from account): ${localStorage.getItem('mobileNumber') || 'Not available'}

========================================
ADVERTISING REQUEST:
========================================
${params.message}

========================================
REQUEST DETAILS:
========================================
Request Date: ${new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    dateStyle: 'full',
    timeStyle: 'long',
  })}

========================================
ACTION REQUIRED:
========================================
1. Review this request
2. Contact the business if needed
3. Create ad campaign in admin panel
4. Notify user when ad is live

ADMIN PANEL: ${window.location.origin}/admin/ads
========================================
  `;

  const adminEmail = 'admin@hapogroup.co.za';
  return `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
