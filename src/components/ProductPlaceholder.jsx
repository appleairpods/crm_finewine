import './ProductPlaceholder.css';

const ICONS = {
  'red-wine': (
    <svg viewBox="0 0 80 120" fill="none" className="placeholder-svg">
      <path d="M28 8h24l-4 44c0 16-8 28-8 36s-8-20-8-36L28 8z" fill="currentColor" opacity="0.3" />
      <path d="M36 96v16h8V96" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="40" cy="100" rx="12" ry="3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  ),
  'white-wine': (
    <svg viewBox="0 0 80 120" fill="none" className="placeholder-svg">
      <path d="M30 8h20l-2 48c0 14-6 24-8 32s-6-18-8-32L30 8z" fill="currentColor" opacity="0.25" />
      <path d="M36 92v20h8V92" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'rose-wine': (
    <svg viewBox="0 0 80 120" fill="none" className="placeholder-svg">
      <path d="M29 8h22l-3 46c0 15-7 26-8 34s-7-19-8-34L29 8z" fill="currentColor" opacity="0.28" />
      <path d="M36 94v18h8V94" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  sparkling: (
    <svg viewBox="0 0 80 120" fill="none" className="placeholder-svg">
      <rect x="32" y="8" width="16" height="70" rx="2" fill="currentColor" opacity="0.2" />
      <path d="M28 78h24l-2 18H30L28 78z" fill="currentColor" opacity="0.3" />
      <circle cx="40" cy="20" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="36" cy="35" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="44" cy="50" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  whisky: (
    <svg viewBox="0 0 80 120" fill="none" className="placeholder-svg">
      <rect x="26" y="20" width="28" height="60" rx="4" fill="currentColor" opacity="0.25" />
      <rect x="30" y="8" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <rect x="32" y="80" width="16" height="8" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  water: (
    <svg viewBox="0 0 80 120" fill="none" className="placeholder-svg">
      <rect x="30" y="12" width="20" height="72" rx="6" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <rect x="32" y="30" width="16" height="40" rx="4" fill="currentColor" opacity="0.15" />
    </svg>
  ),
  mixer: (
    <svg viewBox="0 0 80 120" fill="none" className="placeholder-svg">
      <rect x="28" y="16" width="24" height="68" rx="4" fill="currentColor" opacity="0.2" />
      <rect x="32" y="8" width="16" height="10" rx="2" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  soft: (
    <svg viewBox="0 0 80 120" fill="none" className="placeholder-svg">
      <path d="M32 12h16l2 70H30L32 12z" fill="currentColor" opacity="0.2" />
      <ellipse cx="40" cy="12" rx="10" ry="4" fill="currentColor" opacity="0.3" />
    </svg>
  ),
};

export default function ProductPlaceholder({ type = 'red-wine', size = 'md' }) {
  return (
    <div className={`product-placeholder product-placeholder--${type} product-placeholder--${size}`}>
      {ICONS[type] || ICONS['red-wine']}
    </div>
  );
}
