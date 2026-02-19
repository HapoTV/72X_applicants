export const buildAdRequestMailto = (params: {
  businessName: string;
  email: string;
  phone: string;
  adLink: string;
  message: string;
}) => {
  const userEmail = localStorage.getItem('userEmail') || params.email;
  const userPhone = localStorage.getItem('mobileNumber') || params.phone;

  const subject = 'Request Ad space';
  const body = `
Advertising Request

Business Name: ${params.businessName}
Email: ${userEmail}
Phone: ${params.phone || userPhone}
Ad Link: ${params.adLink}

Recommended ad banner size: 768 x 250 (width x height)

Message:
${params.message}
  `;

  const adminEmail = 'admin@hapogroup.co.za';
  return `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
