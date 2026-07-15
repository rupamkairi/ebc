export const EBC_CONTACT = {
  address: "Bardhaman, West Bengal, India",
  email: "econbuildingcentre@gmail.com",
  phone: "+91 95644 39100",
  whatsappNumber: "919564439100",
  whatsappUrl: "https://wa.me/919564439100",
  facebookUrl: "https://www.facebook.com/econbuildingcentre",
  youtubeUrl: "https://youtube.com/@econbuildingcentre9557?si=eew-Q1EKPj548omM",
} as const;

export const getEbcWhatsappUrl = (message?: string) => {
  const params = message ? `?text=${encodeURIComponent(message)}` : "";
  return `${EBC_CONTACT.whatsappUrl}${params}`;
};
