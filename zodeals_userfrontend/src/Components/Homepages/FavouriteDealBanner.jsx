import React from "react";
import { Box, Typography, Button, Grid, Container } from "@mui/material";
import { Heart, ArrowRight, Star } from 'lucide-react';
import bgImage from "../../assets/images/signinBanner.jpg";
import couponImage from "../../assets/images/coupenimage.png";

const FavoriteDealsBanner = () => {
  const token = localStorage.getItem("token");

  return (
    <Box sx={{ backgroundColor: '#FFF4EF', py: { xs: 4, md: 5 }, px: 2 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FF6B35 0%, #e63946 100%)',
            overflow: 'hidden',
            position: 'relative',
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
          }}
        >
          {/* Decorative circles */}
          <Box sx={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -20, left: '40%', width: 100, height: 100, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                <Heart size={22} color="#FFD700" fill="#FFD700" />
                <Typography sx={{ color: '#FFD700', fontWeight: 800, fontSize: 13, fontFamily: 'Nunito Sans, sans-serif', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Favourites Feature
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1.5, lineHeight: 1.2 }}>
                Never Miss a Deal You Love ❤️
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontFamily: 'Nunito Sans, sans-serif', mb: 3, lineHeight: 1.6 }}>
                Save your favourite coupons and deals. Get notified when prices drop or new offers arrive.
              </Typography>

              {!token ? (
                <Button href="/login" variant="contained" sx={{
                  backgroundColor: '#fff', color: '#FF6B35', fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 800, fontSize: 14, px: 3.5, py: 1.2, borderRadius: 2,
                  textTransform: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  '&:hover': { backgroundColor: '#FFF4EF', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: 0.8,
                }}>
                  Sign In to Save <ArrowRight size={16} />
                </Button>
              ) : (
                <Button href="/favorites" variant="contained" sx={{
                  backgroundColor: '#fff', color: '#FF6B35', fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 800, fontSize: 14, px: 3.5, py: 1.2, borderRadius: 2,
                  textTransform: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  '&:hover': { backgroundColor: '#FFF4EF', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: 0.8,
                }}>
                  View My Wishlist <Heart size={16} fill="#FF6B35" />
                </Button>
              )}
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={couponImage}
                alt="Favourite Deals"
                sx={{ height: { xs: 140, md: 200 }, objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))', animation: 'float 3s ease-in-out infinite' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FavoriteDealsBanner;
