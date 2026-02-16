export const buildAdRequestMailto = (params: {
  businessName: string;
  email: string;
  phone: string;
  description: string;
  infoLink: string;
}) => {
  const userEmail = localStorage.getItem('userEmail') || params.email;
  const userPhone = localStorage.getItem('mobileNumber') || params.phone;

  const subject = `Advertising Space Request - ${params.businessName}`;
  const body = `BUSINESS DETAILS
Business Name: ${params.businessName}
Email: ${userEmail}
Phone: ${params.phone || userPhone}

AD DETAILS
Description: ${params.description}
More info link: ${params.infoLink || ''}

ATTACHMENT
Please attach your banner image.
Recommended size: 768 x 250 (Width 768, Height 250)
`;

  const supportEmail = 'admin@hapogroup.co.za';
  return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
