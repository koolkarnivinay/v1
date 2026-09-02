import React, { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Avatar, Rating, Stack,
  useTheme, useMediaQuery, Container,
} from "@mui/material";
import { Quote } from 'lucide-react';
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { hosturl } from "../libs/Constant";

const token = localStorage.getItem("token");
const axiosInstance = axios.create({
  baseURL: hosturl,
  headers: { Authorization: `Bearer ${token}` },
});

const CustomerReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cReview, setCReview] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    axiosInstance.get("/testimonials/approved")
      .then(res => setCReview(
        res.data?.result?.map(i => ({
          name: i?.name,
          date: i?.createdAt?.slice(0, 10),
          rating: i?.rating,
          review: i?.review,
          avatar: i?.profilePic,
        })) || []
      ))
      .catch(console.error);
  }, []);

  const settings = {
    autoplay: true, autoplaySpeed: 2500, infinite: true, speed: 500,
    slidesToShow: isMobile ? 1 : 3, slidesToScroll: 1,
    centerMode: !isMobile, centerPadding: isMobile ? "0px" : "30px",
    arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  return (
    <Box sx={{ backgroundColor: '#fff', py: 6, overflow: "hidden" }}>
      <Container>
        <Typography variant="h6" className="section-title" mb={4}
          sx={{ fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif', color: '#1A1A2E' }}>
          What Our Users Say
        </Typography>
      </Container>

      <Box sx={{ mx: isMobile ? 0 : -4, overflow: "visible" }}>
        <Slider {...settings}>
          {cReview.map((item, idx) => {
            const isCenter = idx === currentSlide % cReview.length;
            return (
              <Box key={idx} px={1.5}>
                <Box
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    border: isCenter ? '2px solid #FF6B35' : '1.5px solid #F3F4F6',
                    boxShadow: isCenter ? '0 8px 32px rgba(255,107,53,0.14)' : '0 2px 10px rgba(0,0,0,0.05)',
                    p: 2.5,
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: isCenter && !isMobile ? 'scale(1.03)' : 'scale(0.97)',
                    transition: 'all 0.4s ease',
                  }}
                >
                  {/* Quote icon */}
                  <Box mb={1.5}>
                    <Quote size={24} color="#FF6B35" style={{ transform: 'rotate(180deg)' }} />
                    <Typography fontSize={13} color="#4B5563" fontFamily="Nunito Sans, sans-serif" lineHeight={1.6} mt={0.5}
                      sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.review}
                    </Typography>
                  </Box>

                  <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Avatar
                        alt={item.name}
                        src={item.avatar ? `${hosturl}${item.avatar}` : ""}
                        sx={{ width: 40, height: 40, border: '2px solid #FF6B3540' }}
                        imgProps={{ crossOrigin: "anonymous" }}
                      />
                      <Box>
                        <Typography fontWeight={700} fontSize={13} fontFamily="Nunito Sans, sans-serif" color="#1A1A2E">{item.name}</Typography>
                        <Typography fontSize={11} color="#9CA3AF" fontFamily="Nunito Sans, sans-serif">{item.date}</Typography>
                      </Box>
                    </Stack>
                    <Rating value={item.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Slider>
      </Box>

      {/* Dots */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.8, mt: 3 }}>
        {cReview.map((_, i) => (
          <Box key={i} sx={{
            height: 8, width: currentSlide === i ? 24 : 8,
            backgroundColor: currentSlide === i ? '#FF6B35' : '#E5E7EB',
            borderRadius: 4, transition: '0.3s',
          }} />
        ))}
      </Box>
    </Box>
  );
};

export default CustomerReviews;
