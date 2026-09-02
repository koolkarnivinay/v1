import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import {
  Box, Typography, CircularProgress, useTheme, useMediaQuery, Container,
} from '@mui/material';
import { Timer } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { hosturl } from '../libs/Constant';

const DealsCarousel = () => {
  const [timer, setTimer] = useState('23:59:59');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pincode = localStorage.getItem('userPinCode');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Countdown
  useEffect(() => {
    const getNextMidnight = () => {
      const now = new Date();
      const m = new Date(now); m.setHours(24, 0, 0, 0); return m.getTime();
    };
    const target = getNextMidnight();
    const iv = setInterval(() => {
      const dist = target - Date.now();
      if (dist <= 0) { setTimer('00:00:00'); clearInterval(iv); return; }
      const h = String(Math.floor((dist / 3600000) % 24)).padStart(2, '0');
      const m = String(Math.floor((dist / 60000) % 60)).padStart(2, '0');
      const s = String(Math.floor((dist / 1000) % 60)).padStart(2, '0');
      setTimer(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Fetch
  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        let url = `${hosturl}/home/deals`;
        if (pincode && pincode !== 'null' && pincode.trim() !== '') url += `?pinCode=${pincode}`;
        const r = await fetch(url);
        const d = await r.json();
        if (d.statusCode !== 200 || !d.result) throw new Error(d.displayMessage || 'Failed');
        const matched = Array.isArray(d.result.matchedDeals) ? d.result.matchedDeals : [];
        const panIndia = Array.isArray(d.result.panIndiaDeals) ? d.result.panIndiaDeals : [];
        setDeals([...matched, ...panIndia]);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchDeals();
  }, [pincode]);

  const settings = {
    dots: false, infinite: true, autoplay: true, autoplaySpeed: 3000,
    speed: 500, slidesToShow: 3, slidesToScroll: 1,
    centerMode: true, centerPadding: '0px', arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerMode: true } },
      { breakpoint: 600,  settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  const [hh, mm, ss] = timer.split(':');

  return (
    <Box sx={{ backgroundColor: '#fff', py: 5, borderTop: '1px solid #F0F2F7', borderBottom: '1px solid #F0F2F7' }}>
      <Container>
        {/* Heading row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B35, #e63946)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
            }}>
              ⚡
            </Box>
            <Typography sx={{
              fontWeight: 800, fontSize: 18, fontFamily: 'Inter, sans-serif',
              color: '#0F1B35', letterSpacing: '-0.01em',
            }}>
              Grab Before It Ends
            </Typography>
          </Box>

          {/* Timer display */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.8,
            backgroundColor: '#0F1B35', borderRadius: '12px', px: 2, py: 1,
            boxShadow: '0 4px 16px rgba(15,27,53,0.2)',
          }}>
            <Timer size={14} color="#FFD60A" />
            <Typography sx={{
              fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
              fontFamily: 'Inter, sans-serif', mr: 0.5,
            }}>
              ENDS IN
            </Typography>
            {[hh, mm, ss].map((unit, i) => (
              <React.Fragment key={i}>
                <Box sx={{
                  backgroundColor: '#FF6B35', color: '#fff',
                  borderRadius: '7px', px: 1, py: 0.4,
                  fontWeight: 900, fontSize: 15,
                  fontFamily: '"Inter", monospace, sans-serif',
                  minWidth: 30, textAlign: 'center', lineHeight: 1.3,
                  boxShadow: '0 2px 6px rgba(255,107,53,0.4)',
                }}>
                  {unit}
                </Box>
                {i < 2 && (
                  <Typography fontWeight={900} fontSize={14} color="rgba(255,255,255,0.5)">:</Typography>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        {loading ? (
          <Box textAlign="center" py={4}><CircularProgress sx={{ color: '#FF6B35' }} /></Box>
        ) : error ? (
          <Typography color="error" fontSize={14} fontFamily="Inter, sans-serif">{error}</Typography>
        ) : (
          <Box sx={{ mx: isMobile ? 0 : -3 }}>
            <Slider {...settings}>
              {deals.map((item, idx) => {
                const isCenter = idx === currentSlide % deals.length;
                return (
                  <Box key={idx} px={1.5}>
                    <Box
                      className="hover-lift"
                      sx={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        border: isCenter ? '2px solid #FF6B35' : '1.5px solid #E8ECF4',
                        overflow: 'hidden',
                        height: 265,
                        display: 'flex', flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        transform: isCenter && !isMobile ? 'scale(1.04)' : 'scale(0.97)',
                        boxShadow: isCenter
                          ? '0 16px 40px rgba(255,107,53,0.2)'
                          : '0 2px 10px rgba(15,27,53,0.06)',
                      }}
                    >
                      {/* Gradient top strip */}
                      <Box sx={{
                        height: 4,
                        background: isCenter
                          ? 'linear-gradient(90deg, #FF6B35, #e63946)'
                          : '#F0F2F7',
                      }} />

                      <Box sx={{ p: 2.2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <img
                          crossOrigin="anonymous"
                          src={`${hosturl}${item.logo}`}
                          alt="logo"
                          style={{ height: 28, objectFit: 'contain', marginBottom: 10 }}
                        />
                        <Typography sx={{
                          fontWeight: 700, fontSize: 13.5,
                          fontFamily: 'Inter, sans-serif',
                          color: '#0F1B35', mb: 0.6,
                          lineHeight: 1.3, letterSpacing: '-0.01em',
                        }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{
                          fontSize: 12, color: '#6B7280',
                          fontFamily: 'Inter, sans-serif', flex: 1, lineHeight: 1.5,
                          display: '-webkit-box', WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {item.description}
                        </Typography>
                      </Box>

                      <Box sx={{
                        background: isCenter
                          ? 'linear-gradient(135deg, #FF6B35, #e55a26)'
                          : '#F5F7FA',
                        py: 1.3, textAlign: 'center', cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e55a26, #c94a1e)',
                        },
                      }}>
                        <Typography sx={{
                          color: isCenter ? '#fff' : '#6B7280',
                          fontWeight: 800, fontSize: 12,
                          fontFamily: 'Inter, sans-serif',
                          letterSpacing: 0.5,
                        }}>
                          GET DEAL →
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Slider>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DealsCarousel;
