const d=e=>{const o=localStorage.getItem("userEmail")||e.email,n=localStorage.getItem("mobileNumber")||e.phone,t="Request Ad space",s=`
Advertising Request

Business Name: ${e.businessName}
Email: ${o}
Phone: ${e.phone||n}
Ad Link: ${e.adLink}

Recommended ad banner size: 768 x 250 (width x height)

Message:
${e.message}
  `;return`mailto:admin@hapogroup.co.za?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(s)}`};export{d as b};
