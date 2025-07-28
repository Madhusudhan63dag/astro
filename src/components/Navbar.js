import React, { useState } from 'react';
import { HiMenu, HiX, HiChevronDown, HiOutlineUser } from 'react-icons/hi';
import { AiOutlineAppstore, AiFillStar, AiOutlineShop, AiOutlineGift, AiOutlineBook } from 'react-icons/ai';
import { BsGlobe } from 'react-icons/bs';
import { MdOutlineDashboard, MdHeadsetMic } from 'react-icons/md';

// Reduced icon size for more compact look (use size prop)
const iconProps = { size: 18, className: "text-indigo-500" };

const NAVBAR_LINKS = [
  { type: 'link', label: 'Home', href: '/', icon: <AiFillStar {...iconProps} /> },
  {
    type: 'dropdown', label: 'Astrology Services', icon: <AiOutlineAppstore {...iconProps} />, children: [
      { label: 'Personal Charts', href: '/personal', icon: <HiOutlineUser {...iconProps} /> },
      { label: 'Horoscope Reports', href: '/horoscope', icon: <AiOutlineBook {...iconProps} /> },
      // { label: 'Multiple Systems', href: '#systems', icon: <AiOutlineGift {...iconProps} /> },
      // { label: 'Consultations', href: '#consultations', icon: <MdHeadsetMic {...iconProps} /> },
    ]
  },
  { type: 'link', label: 'Pricing', href: '/pricing', icon: <AiOutlineGift {...iconProps} /> },
  // {
  //   type: 'dropdown', label: 'Blog / Learn', icon: <AiOutlineBook {...iconProps} />, children: [
  //     { label: 'Zodiac Signs', href: '#zodiacs', icon: <AiFillStar {...iconProps} /> },
  //     { label: 'Remedies', href: '#remedies', icon: <AiOutlineGift {...iconProps} /> },
  //     { label: 'Doshas', href: '#doshas', icon: <AiOutlineGift {...iconProps} /> },
  //     { label: 'Case Studies', href: '#case-studies', icon: <AiOutlineBook {...iconProps} /> },
  //   ]
  // },
  { type: 'link', label: 'Contact Us', href: '/contact', icon: <MdHeadsetMic {...iconProps} /> },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState({});

  // Desktop Dropdown
  const handleDropdown = idx => setDropdownOpen(idx);
  const handleDropdownLeave = () => setDropdownOpen(null);

  // Mobile Dropdown Handler
  const toggleMobileDropdown = idx => {
    setMobileDropdown(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <nav className="bg-[#10172a]/85 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-2 md:px-4 py-2">
        {/* Logo */}
        <a href="/">
          <span className="text-lg md:text-xl font-bold text-indigo-500 tracking-wider">AstroVastu</span>
        </a>
        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-2">
          {NAVBAR_LINKS.map((link, idx) => (
            link.type === 'link' ? (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center gap-2 px-2 py-1 text-[15px] rounded-md font-medium text-slate-100 hover:text-yellow-400 hover:bg-indigo-950/80 transition focus:outline-none"
                >
                  {link.icon}
                  {link.label}
                </a>
              </li>
            ) : (
              <li key={link.label} className="relative"
                onMouseEnter={() => handleDropdown(idx)}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 px-2 py-1 rounded-md font-medium text-[15px] text-slate-100 hover:text-yellow-400 hover:bg-indigo-950/80 transition"
                >
                  {link.icon}
                  {link.label}
                  <HiChevronDown size={16} className="ml-0.5" />
                </button>
                {/* Dropdown */}
                {dropdownOpen === idx && (
                  <ul className="absolute left-0 mt-1 min-w-[180px] py-1.5 z-50 rounded-xl shadow-lg
                   bg-[#182042] border border-slate-700 animate-fadeIn">
                    {link.children.map(child => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          className="flex items-center gap-2 px-4 py-[6px] text-slate-100 rounded-md text-[15px] hover:text-yellow-400 hover:bg-indigo-900/70 transition"
                        >
                          {child.icon}
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          ))}
        </ul>
        {/* Mobile Hamburger */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            className="text-indigo-500 text-2xl focus:outline-none"
          >{menuOpen ? <HiX /> : <HiMenu />}</button>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`fixed top-0 left-0 h-full w-11/12 max-w-xs bg-[#10172a]/95 border-r border-slate-800 shadow-xl
          z-[100] p-3 transition-transform duration-300
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden`}
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-lg font-bold text-indigo-500 tracking-wide">AstroVastu</span>
          <button className="text-2xl text-indigo-500" onClick={() => setMenuOpen(false)}><HiX /></button>
        </div>
        <ul>
          {NAVBAR_LINKS.map((link, idx) =>
            link.type === 'link' ? (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center gap-2 px-2 py-2 text-slate-100 rounded-md text-[16px] hover:text-yellow-400 hover:bg-indigo-900/80 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </a>
              </li>
            ) : (
              <li key={link.label}>
                <button
                  className="w-full flex items-center gap-2 px-2 py-2 text-slate-100 rounded-md font-medium text-[16px] hover:text-yellow-400 transition"
                  onClick={() => toggleMobileDropdown(idx)}
                >
                  {link.icon}
                  {link.label}
                  <HiChevronDown size={14} className={`ml-auto transition-transform ${mobileDropdown[idx] ? 'rotate-180' : ''}`} />
                </button>
                {/* Collapsible */}
                {mobileDropdown[idx] && (
                  <ul className="ml-5 mb-1">
                    {link.children.map(child =>
                      <li key={child.label}>
                        <a
                          href={child.href}
                          className="flex items-center gap-2 px-2 py-[7px] text-slate-100 rounded text-sm hover:text-yellow-400"
                          onClick={() => setMenuOpen(false)}
                        >
                          {child.icon}
                          {child.label}
                        </a>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )
          )}
        </ul>
      </div>
      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
}

export default Navbar;
