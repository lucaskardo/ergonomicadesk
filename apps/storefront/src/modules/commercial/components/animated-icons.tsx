"use client"

const STYLE_TAG = (
  <style>{`
    @keyframes icon-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
    @keyframes icon-pulse-ring { 0% { transform: scale(1); opacity: 0.3; } 100% { transform: scale(1.6); opacity: 0; } }
    @keyframes icon-dot-travel { 0% { offset-distance: 0%; opacity: 1; } 100% { offset-distance: 100%; opacity: 1; } }
    @keyframes icon-grow { 0% { transform: scaleY(1); } 100% { transform: scaleY(1.15); } }
    @keyframes icon-bounce-dot { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
    @keyframes icon-scan { 0% { transform: translateX(0); } 100% { transform: translateX(40px); } }
    @keyframes icon-slide-in { 0% { transform: translateX(-10px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
    @keyframes icon-pop { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
    @keyframes icon-cascade { 0%,20% { opacity: 0.3; } 40%,100% { opacity: 1; } }

    .icon-container:hover .icon-desk-surface { animation: icon-bounce 0.5s ease-in-out; }
    .icon-container:hover .icon-shield-ring { animation: icon-pulse-ring 0.8s ease-out; }
    .icon-container:hover .icon-dot-travel { animation: icon-dot-travel 0.8s ease-in-out forwards; }
    .icon-container:hover .icon-building-1 { animation: icon-grow 0.4s ease-out forwards; transform-origin: bottom; }
    .icon-container:hover .icon-building-2 { animation: icon-grow 0.4s 0.1s ease-out forwards; transform-origin: bottom; }
    .icon-container:hover .icon-building-3 { animation: icon-grow 0.4s 0.2s ease-out forwards; transform-origin: bottom; }
    .icon-container:hover .icon-chat-dot-1 { animation: icon-bounce-dot 0.4s ease-in-out; }
    .icon-container:hover .icon-chat-dot-2 { animation: icon-bounce-dot 0.4s 0.1s ease-in-out; }
    .icon-container:hover .icon-chat-dot-3 { animation: icon-bounce-dot 0.4s 0.2s ease-in-out; }
    .icon-container:hover .icon-scan-line { animation: icon-scan 0.8s ease-in-out; }
    .icon-container:hover .icon-truck { animation: icon-slide-in 0.5s ease-out; }
    .icon-container:hover .icon-check-pop { animation: icon-pop 0.4s 0.3s ease-out both; }
    .icon-container:hover .icon-spine-dot-1 { animation: icon-cascade 0.6s ease-out; }
    .icon-container:hover .icon-spine-dot-2 { animation: icon-cascade 0.6s 0.1s ease-out; }
    .icon-container:hover .icon-spine-dot-3 { animation: icon-cascade 0.6s 0.2s ease-out; }
    .icon-container:hover .icon-spine-dot-4 { animation: icon-cascade 0.6s 0.3s ease-out; }

    @media (prefers-reduced-motion: reduce) {
      .icon-container:hover .icon-desk-surface,
      .icon-container:hover .icon-shield-ring,
      .icon-container:hover .icon-dot-travel,
      .icon-container:hover .icon-building-1,
      .icon-container:hover .icon-building-2,
      .icon-container:hover .icon-building-3,
      .icon-container:hover .icon-chat-dot-1,
      .icon-container:hover .icon-chat-dot-2,
      .icon-container:hover .icon-chat-dot-3,
      .icon-container:hover .icon-scan-line,
      .icon-container:hover .icon-truck,
      .icon-container:hover .icon-check-pop,
      .icon-container:hover .icon-spine-dot-1,
      .icon-container:hover .icon-spine-dot-2,
      .icon-container:hover .icon-spine-dot-3,
      .icon-container:hover .icon-spine-dot-4 {
        animation: none !important;
      }
    }
  `}</style>
)

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="icon-container inline-flex items-center justify-center">
      {STYLE_TAG}
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glow background */}
        <circle cx="32" cy="32" r="28" fill="#5BC0EB" opacity="0.06" className="transition-opacity duration-300 group-hover:opacity-[0.12]" />
        {children}
      </svg>
    </div>
  )
}

export function IconStandingDesk() {
  return (
    <IconWrap>
      {/* Desk surface */}
      <rect className="icon-desk-surface" x="14" y="26" width="36" height="3" rx="1" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" />
      {/* Legs */}
      <line x1="18" y1="29" x2="18" y2="44" stroke="#2a2a28" strokeWidth="1" strokeLinecap="round" />
      <line x1="46" y1="29" x2="46" y2="44" stroke="#2a2a28" strokeWidth="1" strokeLinecap="round" />
      {/* Feet */}
      <line x1="14" y1="44" x2="22" y2="44" stroke="#8a8a82" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="42" y1="44" x2="50" y2="44" stroke="#8a8a82" strokeWidth="0.6" strokeLinecap="round" />
      {/* Monitor */}
      <rect x="26" y="18" width="12" height="8" rx="1" fill="#F5F2ED" stroke="#8a8a82" strokeWidth="0.6" />
      {/* Monitor stand */}
      <line x1="32" y1="26" x2="32" y2="28" stroke="#8a8a82" strokeWidth="0.6" />
      {/* Height arrows */}
      <circle cx="10" cy="35" r="1.5" fill="#5BC0EB" />
    </IconWrap>
  )
}

export function IconSpine() {
  return (
    <IconWrap>
      {/* Spine curve */}
      <path d="M32 16 C32 16, 30 22, 31 28 C32 34, 33 38, 32 48" stroke="#2a2a28" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Vertebrae dots */}
      <circle className="icon-spine-dot-1" cx="31.5" cy="20" r="2" fill="#F5F2ED" stroke="#8a8a82" strokeWidth="0.6" />
      <circle className="icon-spine-dot-2" cx="31" cy="27" r="2" fill="#F5F2ED" stroke="#8a8a82" strokeWidth="0.6" />
      <circle className="icon-spine-dot-3" cx="31.5" cy="34" r="2" fill="#F5F2ED" stroke="#8a8a82" strokeWidth="0.6" />
      <circle className="icon-spine-dot-4" cx="32" cy="41" r="2" fill="#F5F2ED" stroke="#8a8a82" strokeWidth="0.6" />
      {/* Accent dots */}
      <circle cx="38" cy="20" r="1" fill="#5BC0EB" />
      <circle cx="38" cy="34" r="1" fill="#5BC0EB" />
    </IconWrap>
  )
}

export function IconShield() {
  return (
    <IconWrap>
      {/* Shield body */}
      <path d="M32 14 L44 20 V32 C44 40 32 48 32 48 C32 48 20 40 20 32 V20 Z" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" strokeLinejoin="round" />
      {/* Star */}
      <path d="M32 24 L33.5 29 L38.5 29 L34.5 32.5 L36 37.5 L32 34 L28 37.5 L29.5 32.5 L25.5 29 L30.5 29 Z" fill="#5BC0EB" opacity="0.8" />
      {/* Pulse ring */}
      <circle className="icon-shield-ring" cx="32" cy="32" r="16" fill="none" stroke="#5BC0EB" strokeWidth="0.5" opacity="0" />
    </IconWrap>
  )
}

export function IconFactoryDirect() {
  return (
    <IconWrap>
      {/* Factory */}
      <rect x="12" y="24" width="14" height="16" rx="1" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" />
      <rect x="14" y="18" width="4" height="6" fill="#F5F2ED" stroke="#8a8a82" strokeWidth="0.6" />
      {/* Arrow path */}
      <path id="factory-arrow" d="M28 32 L40 32" stroke="#8a8a82" strokeWidth="0.6" strokeDasharray="2 2" />
      <polygon points="40,29 46,32 40,35" fill="#5BC0EB" opacity="0.6" />
      {/* Dot traveling along arrow */}
      <circle className="icon-dot-travel" cx="28" cy="32" r="2" fill="#5BC0EB" style={{ offsetPath: "path('M28 32 L40 32')" }} />
      {/* Office */}
      <rect x="42" y="26" width="10" height="14" rx="1" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" />
      <rect x="44" y="28" width="2.5" height="2.5" fill="#8a8a82" opacity="0.3" />
      <rect x="47.5" y="28" width="2.5" height="2.5" fill="#8a8a82" opacity="0.3" />
      <rect x="44" y="32" width="2.5" height="2.5" fill="#8a8a82" opacity="0.3" />
      <rect x="47.5" y="32" width="2.5" height="2.5" fill="#8a8a82" opacity="0.3" />
    </IconWrap>
  )
}

export function IconSkyline() {
  return (
    <IconWrap>
      {/* Ground line */}
      <line x1="10" y1="46" x2="54" y2="46" stroke="#8a8a82" strokeWidth="0.6" />
      {/* Building 1 — short */}
      <rect className="icon-building-1" x="14" y="30" width="8" height="16" rx="1" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" />
      <rect x="16" y="32" width="2" height="2" fill="#8a8a82" opacity="0.3" />
      <rect x="16" y="36" width="2" height="2" fill="#8a8a82" opacity="0.3" />
      {/* Building 2 — tall */}
      <rect className="icon-building-2" x="24" y="20" width="10" height="26" rx="1" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" />
      <rect x="26" y="22" width="2.5" height="2.5" fill="#8a8a82" opacity="0.3" />
      <rect x="29.5" y="22" width="2.5" height="2.5" fill="#8a8a82" opacity="0.3" />
      <rect x="26" y="27" width="2.5" height="2.5" fill="#5BC0EB" opacity="0.3" />
      <rect x="29.5" y="27" width="2.5" height="2.5" fill="#8a8a82" opacity="0.3" />
      <rect x="26" y="32" width="2.5" height="2.5" fill="#8a8a82" opacity="0.3" />
      <rect x="29.5" y="32" width="2.5" height="2.5" fill="#5BC0EB" opacity="0.3" />
      {/* Building 3 — medium */}
      <rect className="icon-building-3" x="36" y="26" width="8" height="20" rx="1" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" />
      <rect x="38" y="28" width="2" height="2" fill="#8a8a82" opacity="0.3" />
      <rect x="38" y="32" width="2" height="2" fill="#8a8a82" opacity="0.3" />
      <rect x="38" y="36" width="2" height="2" fill="#8a8a82" opacity="0.3" />
    </IconWrap>
  )
}

export function IconChat() {
  return (
    <IconWrap>
      {/* Chat bubble */}
      <path d="M16 18 H48 C49 18 50 19 50 20 V36 C50 37 49 38 48 38 H26 L20 44 V38 H16 C15 38 14 37 14 36 V20 C14 19 15 18 16 18Z" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" strokeLinejoin="round" />
      {/* 3 dots */}
      <circle className="icon-chat-dot-1" cx="26" cy="28" r="2" fill="#5BC0EB" />
      <circle className="icon-chat-dot-2" cx="32" cy="28" r="2" fill="#5BC0EB" />
      <circle className="icon-chat-dot-3" cx="38" cy="28" r="2" fill="#5BC0EB" />
    </IconWrap>
  )
}

export function IconFloorPlan() {
  return (
    <IconWrap>
      {/* Floor plan outline */}
      <rect x="14" y="16" width="36" height="32" rx="1" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" />
      {/* Internal walls */}
      <line x1="14" y1="30" x2="34" y2="30" stroke="#8a8a82" strokeWidth="0.6" />
      <line x1="34" y1="16" x2="34" y2="30" stroke="#8a8a82" strokeWidth="0.6" />
      <line x1="26" y1="30" x2="26" y2="48" stroke="#8a8a82" strokeWidth="0.6" />
      {/* Door gaps */}
      <line x1="28" y1="30" x2="32" y2="30" stroke="#F5F2ED" strokeWidth="1.5" />
      {/* Furniture dots */}
      <circle cx="24" cy="23" r="1.5" fill="#5BC0EB" opacity="0.6" />
      <circle cx="42" cy="23" r="1.5" fill="#5BC0EB" opacity="0.6" />
      <circle cx="20" cy="40" r="1.5" fill="#5BC0EB" opacity="0.6" />
      {/* Scan line */}
      <rect className="icon-scan-line" x="14" y="16" width="2" height="32" fill="#5BC0EB" opacity="0.15" />
    </IconWrap>
  )
}

export function IconDelivery() {
  return (
    <IconWrap>
      {/* Truck body */}
      <g className="icon-truck">
        <rect x="10" y="26" width="24" height="14" rx="1" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" />
        {/* Truck cabin */}
        <path d="M34 30 H42 L46 36 V40 H34 V30Z" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" strokeLinejoin="round" />
        {/* Wheels */}
        <circle cx="20" cy="42" r="3" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" />
        <circle cx="40" cy="42" r="3" fill="#F5F2ED" stroke="#2a2a28" strokeWidth="1" />
        {/* Wheel centers */}
        <circle cx="20" cy="42" r="1" fill="#8a8a82" />
        <circle cx="40" cy="42" r="1" fill="#8a8a82" />
      </g>
      {/* Check mark */}
      <g className="icon-check-pop" style={{ transformOrigin: "50px 20px" }}>
        <circle cx="50" cy="20" r="6" fill="#5BC0EB" />
        <polyline points="47,20 49,22.5 53,17.5" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </IconWrap>
  )
}
