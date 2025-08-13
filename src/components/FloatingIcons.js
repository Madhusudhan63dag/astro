import React from 'react';

// A fixed floating action column shown on the bottom-right across the site
// Props allow passing real contact details; falls back to /contact if missing
const FloatingIcons = ({ whatsappNumber = '', phoneNumber = '', email = '' }) => {
  const sanitizeDigits = (s) => (s || '').replace(/[^\d]/g, '');
  const waDigits = sanitizeDigits(whatsappNumber);
  const waLink = waDigits ? `https://wa.me/${waDigits}` : '/contact';
  const phoneLink = phoneNumber ? `tel:${phoneNumber}` : '/contact';
  const mailLink = email ? `mailto:${email}` : '/contact';

  // Helper to add rel when opening external link
  const ext = (href) => (href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {});

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-center gap-3 pointer-events-auto">
      {/* WhatsApp */}
      <a
        href={waLink}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="w-12 h-12 rounded-full bg-green-500 text-white shadow-lg ring-1 ring-green-400/50 flex items-center justify-center hover:bg-green-600 hover:scale-105 transition-transform"
        {...ext(waLink)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-current">
          <path d="M19.11 17.44c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.17.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.63-1.54-1.9-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.5.14-.17.19-.28.28-.47.09-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.36-.26.28-1 1-1 2.45s1.03 2.84 1.17 3.04c.14.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.31.19 1.8.11.55-.08 1.66-.68 1.89-1.33.23-.66.23-1.22.16-1.33-.07-.12-.26-.19-.54-.33z" />
          <path d="M16.02 3.11C9.41 3.11 4.07 8.45 4.07 15.06c0 2.11.55 4.09 1.51 5.82L4 28.03l7.31-1.55c1.67.91 3.58 1.43 5.62 1.43 6.61 0 11.95-5.34 11.95-11.95 0-6.61-5.34-11.85-11.86-11.85zm0 21.6c-1.93 0-3.73-.59-5.21-1.6l-.37-.23-4.34.92.92-4.23-.25-.39a9.86 9.86 0 01-1.53-5.22c0-5.46 4.45-9.91 9.91-9.91 5.46 0 9.91 4.45 9.91 9.91 0 5.46-4.45 9.75-9.95 9.75z" />
        </svg>
      </a>

      

      
    </div>
  );
};

export default FloatingIcons;
