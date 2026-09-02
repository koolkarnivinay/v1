import React from 'react';
import { Box, Typography, Button, Container, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BadgePercent, ChevronRight, CircleCheck, Sparkles, Tag, Star } from 'lucide-react';
import heroShopping from '../../assets/images/deals-hero-shopping.png';

const STATS = [
  { value: '5,000+', label: 'Live Deals' },
  { value: '500+',   label: 'Top Brands' },
  { value: '100%',   label: 'Verified' },
];

const BannerPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF4D6 40%, #FFF0E8 100%)',
      borderBottom: '1px solid #F0E4AA',
    }}>
      {/* Subtle dot-grid overlay */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(#EDCF6A 1px, transparent 1px)',
        backgroundSize: '22px 22px', opacity: 0.22,
        pointerEvents: 'none',
      }} />

      {/* Decorative blob top-right */}
      <Box sx={{
        position: 'absolute', top: -80, right: -80,
        width: 360, height: 360,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,53,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 5, md: 7.5 } }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.08fr 0.92fr' },
          gap: { xs: 3, md: 6 },
          alignItems: 'center',
        }}>
          {/* ── LEFT ── */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            {/* Pill badge */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.8,
              bgcolor: '#0F1B35', color: '#fff',
              borderRadius: 50, px: 1.6, py: 0.7, mb: 2.5,
              boxShadow: '0 4px 14px rgba(15,27,53,0.18)',
            }}>
              <Sparkles size={13} color="#FFD60A" />
              <Typography sx={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: 0.9,
                textTransform: 'uppercase', fontFamily: 'Inter, sans-serif',
              }}>
                Verified savings, every day
              </Typography>
            </Box>

            {/* Headline */}
            <Typography
              component="h1"
              sx={{
                color: '#0F1B35', fontWeight: 900,
                fontSize: { xs: '2.3rem', sm: '3rem', md: '3.75rem' },
                lineHeight: 1.06, letterSpacing: '-0.05em',
                mb: 2, fontFamily: 'Inter, sans-serif',
                animation: 'slideUp 0.7s ease-out both',
              }}
            >
              Your shortcut to{' '}
              <Box
                component="span"
                sx={{
                  color: '#FF6B35',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 2, left: 0, right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #FF6B35, #e63946)',
                    borderRadius: 2,
                  },
                }}
              >
                better deals.
              </Box>
            </Typography>

            {/* Subtitle */}
            <Typography sx={{
              color: '#4A5568', fontSize: { xs: 14, md: 16 },
              maxWidth: 500, mx: { xs: 'auto', md: 0 },
              lineHeight: 1.7, mb: 3.5,
              fontFamily: 'Inter, sans-serif', fontWeight: 400,
            }}>
              Explore handpicked offers, coupon codes and price drops from the brands you already love.
            </Typography>

            {/* CTA buttons */}
            <Box sx={{
              display: 'flex', gap: 1.5,
              justifyContent: { xs: 'center', md: 'flex-start' },
              flexWrap: 'wrap', mb: 3.5,
            }}>
              <Button
                onClick={() => navigate('/alldeals')}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35, #e63946)',
                  color: '#fff', fontWeight: 800, fontSize: 14,
                  px: 3.2, py: 1.3, borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 6px 20px rgba(255,107,53,0.35)',
                  fontFamily: 'Inter, sans-serif',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e55a26, #c62a35)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 28px rgba(255,107,53,0.4)',
                  },
                  transition: 'all 0.25s ease',
                }}
              >
                Explore deals <ChevronRight size={16} style={{ marginLeft: 2 }} />
              </Button>
              <Button
                onClick={() => navigate('/stores')}
                sx={{
                  color: '#0F1B35', border: '2px solid #0F1B35',
                  fontWeight: 700, fontSize: 14,
                  px: 3, py: 1.25, borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: '#0F1B35',
                    color: '#fff',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.25s ease',
                }}
              >
                Browse stores
              </Button>
            </Box>

            {/* Trust badges */}
            <Box sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              gap: { xs: 1.5, md: 2.5 },
              flexWrap: 'wrap',
            }}>
              {['Fresh offers daily', 'Curated top brands', 'Quick, simple savings'].map(label => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: '#374151' }}>
                  <CircleCheck size={15} color="#10B981" strokeWidth={2.5} />
                  <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── RIGHT: Hero image + float cards ── */}
          <Box sx={{
            position: 'relative', minHeight: { xs: 260, md: 380 },
            display: { xs: 'none', md: 'block' },
          }}>
            <Box
              component="img"
              src={heroShopping}
              alt="Shopping bags, coupon tags and a smartphone"
              sx={{
                position: 'absolute',
                width: '118%', maxWidth: 620,
                right: -46, top: '50%',
                transform: 'translateY(-50%)',
                filter: 'drop-shadow(0 24px 28px rgba(15,27,53,0.14))',
              }}
            />

            {/* Float card — Savings */}
            <Box sx={{
              position: 'absolute', right: 24, bottom: 20,
              bgcolor: '#fff', borderRadius: '14px',
              px: 1.8, py: 1.2,
              display: 'flex', alignItems: 'center', gap: 1,
              boxShadow: '0 12px 32px rgba(15,27,53,0.14)',
              border: '1px solid #F0F2F7',
            }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #FF6B35, #FF4500)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(255,107,53,0.3)' }}>
                <BadgePercent size={18} color="#fff" />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: 12, color: '#0F1B35', fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>
                  Savings that feel good
                </Typography>
                <Typography sx={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  Verified & updated daily
                </Typography>
              </Box>
            </Box>

            {/* Float card — Rating */}
            <Box sx={{
              position: 'absolute', left: 20, top: 30,
              bgcolor: '#fff', borderRadius: '14px',
              px: 1.8, py: 1.2,
              display: 'flex', alignItems: 'center', gap: 1,
              boxShadow: '0 12px 32px rgba(15,27,53,0.12)',
              border: '1px solid #F0F2F7',
            }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(245,158,11,0.3)' }}>
                <Star size={18} color="#fff" fill="#fff" />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: 12, color: '#0F1B35', fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>
                  4.9 / 5.0 Rating
                </Typography>
                <Typography sx={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  Trusted by users
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── STATS STRIP ── */}
        <Box sx={{
          mt: { xs: 4, md: 5 },
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' },
          gap: { xs: 3, md: 5 },
          flexWrap: 'wrap',
        }}>
          {STATS.map(({ value, label }) => (
            <Box key={label} sx={{ textAlign: 'center' }}>
              <Typography sx={{
                fontWeight: 900, fontSize: { xs: '1.5rem', md: '1.9rem' },
                color: '#0F1B35', fontFamily: 'Inter, sans-serif',
                lineHeight: 1, letterSpacing: '-0.02em',
              }}>
                {value}
              </Typography>
              <Typography sx={{
                fontSize: 12, color: '#6B7280',
                fontFamily: 'Inter, sans-serif', fontWeight: 500, mt: 0.2,
              }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default BannerPage;
