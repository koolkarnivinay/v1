import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import heroShopping  from '../../assets/images/deals-hero-shopping.png';
import bgFashion      from '../../assets/images/bg_womens_fashion.jpg';
import bgElectronics  from '../../assets/images/bg_electronics.jpg';

const font = "'Inter', sans-serif";

const STATS = [
  { value: '5,000+', label: 'Live Deals' },
  { value: '500+',   label: 'Top Brands'  },
  { value: '100%',   label: 'Verified'    },
];

const SLIDES = [
  {
    type: 'image',
    id: 'deals',
    badge: 'Verified savings, every day',
    badgeBg: '#0F1B35',
    badgeEmoji: 'NEW',
    headline: 'Your shortcut to',
    accentText: 'better deals.',
    accentColor: '#FF6B35',
    subtitle: 'Explore handpicked offers, coupon codes and price drops from the brands you already love.',
    ctaPrimary:   { label: 'Explore deals', path: '/alldeals' },
    ctaSecondary: { label: 'Browse stores', path: '/stores'   },
    ctaPrimaryBg: 'linear-gradient(135deg, #FF6B35, #e63946)',
    ctaPrimaryBgHover: 'linear-gradient(135deg, #e55a26, #c62a35)',
    ctaPrimaryShadow: 'rgba(255,107,53,0.35)',
    ctaSecondaryColor: '#0F1B35',
    badges: ['Fresh offers daily', 'Curated top brands', 'Quick, simple savings'],
    bg: 'linear-gradient(135deg, #FFF9E6 0%, #FFF4D6 40%, #FFF0E8 100%)',
    dotColor: '#EDCF6A',
    blobColor: 'rgba(255,107,53,0.10)',
    heroImg: heroShopping,
    isBgImg: false,
    card1Title: 'Savings that feel good', card1Sub: 'Verified & updated daily',
    card1BgIcon: 'linear-gradient(135deg, #FF6B35, #FF4500)', card1Emoji: 'tag',
    card2Title: '4.9 / 5.0 Rating', card2Sub: 'Trusted by users',
    card2BgIcon: 'linear-gradient(135deg, #F59E0B, #D97706)', card2Emoji: 'star',
  },
  {
    type: 'image',
    id: 'fashion',
    badge: 'Latest fashion trends',
    badgeBg: '#6D28D9',
    badgeEmoji: 'HOT',
    headline: 'Dress to impress,',
    accentText: 'spend less.',
    accentColor: '#8B5CF6',
    subtitle: "Discover exclusive fashion deals from top brands — women's, men's, and accessories all in one place.",
    ctaPrimary:   { label: 'Shop fashion',  path: '/alldeals' },
    ctaSecondary: { label: 'Browse stores', path: '/stores'   },
    ctaPrimaryBg: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    ctaPrimaryBgHover: 'linear-gradient(135deg, #7C3AED, #DB2777)',
    ctaPrimaryShadow: 'rgba(139,92,246,0.35)',
    ctaSecondaryColor: '#6D28D9',
    badges: ['Trending styles', 'Top designer brands', 'Unbeatable prices'],
    bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 40%, #FCE7F3 100%)',
    dotColor: '#C4B5FD',
    blobColor: 'rgba(139,92,246,0.10)',
    heroImg: bgFashion,
    isBgImg: true,
    card1Title: 'New arrivals weekly', card1Sub: 'Curated fashion picks',
    card1BgIcon: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', card1Emoji: 'shirt',
    card2Title: 'Up to 70% off', card2Sub: 'On premium brands',
    card2BgIcon: 'linear-gradient(135deg, #EC4899, #DB2777)', card2Emoji: 'star',
  },
  {
    type: 'image',
    id: 'electronics',
    badge: 'Best tech deals today',
    badgeBg: '#0369A1',
    badgeEmoji: 'TECH',
    headline: 'Power up with',
    accentText: 'epic tech deals.',
    accentColor: '#0EA5E9',
    subtitle: "Shop the latest gadgets, smartphones, laptops and accessories at prices you won't find anywhere else.",
    ctaPrimary:   { label: 'Shop electronics', path: '/alldeals' },
    ctaSecondary: { label: 'Browse stores',    path: '/stores'   },
    ctaPrimaryBg: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
    ctaPrimaryBgHover: 'linear-gradient(135deg, #0284C7, #4F46E5)',
    ctaPrimaryShadow: 'rgba(14,165,233,0.35)',
    ctaSecondaryColor: '#0369A1',
    badges: ['Latest gadgets', 'Certified sellers', 'Price-drop alerts'],
    bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 40%, #E0F2FE 100%)',
    dotColor: '#93C5FD',
    blobColor: 'rgba(14,165,233,0.10)',
    heroImg: bgElectronics,
    isBgImg: true,
    card1Title: 'Flash sales daily', card1Sub: 'Limited-time tech offers',
    card1BgIcon: 'linear-gradient(135deg, #0EA5E9, #0284C7)', card1Emoji: 'zap',
    card2Title: 'Top-rated products', card2Sub: 'Verified by buyers',
    card2BgIcon: 'linear-gradient(135deg, #6366F1, #4F46E5)', card2Emoji: 'star',
  },
  {
    type: 'video',
    id: 'promo-video',
    badge: 'Watch our story',
    badgeBg: '#065F46',
    badgeEmoji: 'PLAY',
    headline: 'See how ZoDeals',
    accentText: 'saves you money.',
    accentColor: '#10B981',
    subtitle: 'Watch how thousands of shoppers discover the best deals every day with ZoDeals.',
    ctaPrimary:   { label: 'Explore deals', path: '/alldeals' },
    ctaSecondary: { label: 'Browse stores', path: '/stores'   },
    ctaPrimaryBg: 'linear-gradient(135deg, #10B981, #059669)',
    ctaPrimaryBgHover: 'linear-gradient(135deg, #059669, #047857)',
    ctaPrimaryShadow: 'rgba(16,185,129,0.35)',
    ctaSecondaryColor: '#065F46',
    badges: ['Real savings', 'Verified deals', 'Join 10,000+ users'],
    bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 40%, #A7F3D0 100%)',
    dotColor: '#6EE7B7',
    blobColor: 'rgba(16,185,129,0.12)',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    card1Title: 'Best deals curated', card1Sub: 'Handpicked every day',
    card1BgIcon: 'linear-gradient(135deg, #10B981, #059669)', card1Emoji: 'tag',
    card2Title: '10,000+ happy users', card2Sub: 'Join the community',
    card2BgIcon: 'linear-gradient(135deg, #F59E0B, #D97706)', card2Emoji: 'star',
  },
];

function FloatCard({ title, sub, iconBg }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 12px 32px rgba(15,27,53,0.14)',
      border: '1px solid #F0F2F7', zIndex: 2, position: 'absolute',
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: iconBg, flexShrink: 0 }} />
      <div>
        <div style={{ fontWeight: 900, fontSize: 12, color: '#0F1B35', fontFamily: font, lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 10, color: '#6B7280', fontFamily: font }}>{sub}</div>
      </div>
    </div>
  );
}

function HeroSlide({ slide, navigate, isActive }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (slide.type !== 'video' || !videoRef.current) return;
    if (isActive) { videoRef.current.play().catch(() => {}); }
    else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  }, [isActive, slide.type]);

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: slide.bg, borderBottom: '1px solid rgba(0,0,0,0.06)',
      minHeight: 420,
    }}>
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(${slide.dotColor} 1px, transparent 1px)`,
        backgroundSize: '22px 22px', opacity: 0.22,
      }} />
      {/* Blob */}
      <div style={{
        position: 'absolute', top: -80, right: -80, pointerEvents: 'none',
        width: 360, height: 360, borderRadius: '50%',
        background: `radial-gradient(circle, ${slide.blobColor} 0%, transparent 70%)`,
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '60px 24px',
        position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)',
        gap: 48, alignItems: 'center',
      }}>
        {/* LEFT */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: slide.badgeBg, color: '#fff', borderRadius: 50,
            padding: '6px 14px', marginBottom: 20,
            fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
            textTransform: 'uppercase', fontFamily: font,
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          }}>
            {slide.badgeEmoji} &nbsp; {slide.badge}
          </div>

          <h1 style={{
            color: '#0F1B35', fontWeight: 900,
            fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
            lineHeight: 1.06, letterSpacing: '-0.05em',
            margin: '0 0 8px', fontFamily: font,
          }}>
            {slide.headline}{' '}
            <span style={{ color: slide.accentColor }}>{slide.accentText}</span>
          </h1>

          <p style={{
            color: '#4A5568', fontSize: 15, maxWidth: 500,
            lineHeight: 1.7, margin: '12px 0 28px',
            fontFamily: font, fontWeight: 400,
          }}>
            {slide.subtitle}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <button
              onClick={() => navigate(slide.ctaPrimary.path)}
              style={{
                background: slide.ctaPrimaryBg, color: '#fff', fontWeight: 800,
                fontSize: 14, padding: '12px 26px', borderRadius: 12, border: 'none',
                cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${slide.ctaPrimaryShadow}`,
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {slide.ctaPrimary.label} &rarr;
            </button>
            <button
              onClick={() => navigate(slide.ctaSecondary.path)}
              style={{
                color: slide.ctaSecondaryColor, border: `2px solid ${slide.ctaSecondaryColor}`,
                background: 'transparent', fontWeight: 700, fontSize: 14,
                padding: '11px 24px', borderRadius: 12, cursor: 'pointer',
                fontFamily: font, transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = slide.ctaSecondaryColor; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = slide.ctaSecondaryColor; }}
            >
              {slide.ctaSecondary.label}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
            {slide.badges.map(b => (
              <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#374151', fontSize: 12, fontWeight: 600, fontFamily: font }}>
                <span style={{ color: '#10B981', fontSize: 15 }}>&#10003;</span> {b}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,1.9rem)', color: '#0F1B35', fontFamily: font, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: '#6B7280', fontFamily: font, fontWeight: 500, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ position: 'relative', minHeight: 380 }}>
          {slide.type === 'video' ? (
            <video
              ref={videoRef}
              src={slide.videoUrl}
              muted
              loop
              playsInline
              controls
              style={{
                position: 'absolute', width: '110%', maxWidth: 580,
                right: -30, top: '50%', transform: 'translateY(-50%)',
                borderRadius: 20, objectFit: 'cover', height: 360,
                boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
              }}
            />
          ) : (
            <img
              src={slide.heroImg}
              alt={slide.badge}
              style={slide.isBgImg ? {
                position: 'absolute', width: '110%', maxWidth: 580,
                right: -30, top: '50%', transform: 'translateY(-50%)',
                borderRadius: 20, objectFit: 'cover', height: 360,
                filter: 'drop-shadow(0 24px 28px rgba(15,27,53,0.16))',
              } : {
                position: 'absolute', width: '118%', maxWidth: 620,
                right: -46, top: '50%', transform: 'translateY(-50%)',
                filter: 'drop-shadow(0 24px 28px rgba(15,27,53,0.14))',
              }}
            />
          )}
          <div style={{ position: 'absolute', right: 24, bottom: 20 }}>
            <FloatCard title={slide.card1Title} sub={slide.card1Sub} iconBg={slide.card1BgIcon} />
          </div>
          <div style={{ position: 'absolute', left: 20, top: 30 }}>
            <FloatCard title={slide.card2Title} sub={slide.card2Sub} iconBg={slide.card2BgIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BannerPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = SLIDES.length;

  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides track */}
      <div style={{
        display: 'flex',
        transform: `translateX(-${current * 100}%)`,
        transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
        willChange: 'transform',
      }}>
        {SLIDES.map((slide, i) => (
          <div key={slide.id} style={{ minWidth: '100%', flex: '0 0 100%' }}>
            <HeroSlide slide={slide} navigate={navigate} isActive={i === current} />
          </div>
        ))}
      </div>

      {/* Prev arrow */}
      <button onClick={prev} aria-label="Previous slide" style={{
        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        zIndex: 10, width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(255,255,255,0.88)', border: 'none',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)', cursor: 'pointer',
        fontSize: 22, backdropFilter: 'blur(6px)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease',
        color: '#0F1B35', fontWeight: 'bold',
      }}>&#8249;</button>

      {/* Next arrow */}
      <button onClick={next} aria-label="Next slide" style={{
        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
        zIndex: 10, width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(255,255,255,0.88)', border: 'none',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)', cursor: 'pointer',
        fontSize: 22, backdropFilter: 'blur(6px)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease',
        color: '#0F1B35', fontWeight: 'bold',
      }}>&#8250;</button>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 16, width: '100%',
        display: 'flex', justifyContent: 'center', gap: 8, zIndex: 10,
      }}>
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? 24 : 8, height: 8, borderRadius: 4,
              border: 'none', cursor: 'pointer', padding: 0,
              background: i === current ? '#0F1B35' : 'rgba(15,27,53,0.25)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
