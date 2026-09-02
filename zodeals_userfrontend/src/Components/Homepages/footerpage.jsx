import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, List, ListItem, Button, Divider, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link as RouterLink } from "react-router-dom";
import { Mail, Phone, MapPin, ChevronRight, Heart } from 'lucide-react';
import logo from "../../assets/images/zodealsLogo.png";
import Addreview from "./Addreview";
import { hosturl } from "../libs/Constant";
import axios from "axios";
import VendorPartnershipButton from "./vendorButton";

const footerLinks = {
  company: [
    { label: "About Us",          path: "/aboutus" },
    { label: "FAQ",               path: "/faq" },
    { label: "Privacy Policy",    path: "/privacy-policy" },
    { label: "Terms & Conditions",path: "/Terms-and-conditions" },
    { label: "Refund Policy",     path: "/refund/policy" },
    { label: "Product Pricing",   path: "/product/pricing/policy" },
  ],
};

const slugify = t => t.toLowerCase().replace(/\s+/g, "-");

const FooterLink = ({ to, children, state }) => (
  <ListItem sx={{ py: 0.45, px: 0 }}>
    <Box
      component={RouterLink} to={to} state={state}
      sx={{
        display: 'flex', alignItems: 'center', gap: 0.5,
        color: '#9CA3AF', fontSize: 13,
        fontFamily: 'Inter, sans-serif', fontWeight: 500,
        textDecoration: 'none', transition: 'color 0.2s',
        '&:hover': { color: '#FF6B35' },
      }}
    >
      <ChevronRight size={11} color="currentColor" /> {children}
    </Box>
  </ListItem>
);

const ColHeading = ({ children }) => (
  <Typography sx={{
    fontWeight: 800, fontSize: 14, color: '#fff',
    fontFamily: 'Inter, sans-serif', mb: 2,
    pb: 1.2, borderBottom: '1px solid rgba(255,255,255,0.08)',
    letterSpacing: 0.3, textTransform: 'uppercase',
  }}>
    {children}
  </Typography>
);

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [details, setDetails] = useState({});
  const pincode = localStorage.getItem("userPinCode");

  useEffect(() => {
    fetch(`${hosturl}/category`)
      .then(r => r.json())
      .then(d => { if (d.result) setCategories(d.result.slice(0, 6)); });
    axios.get(`${hosturl}/contact-us`).then(r => setDetails(r.data.result)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!pincode) return;
    axios.get(`${hosturl}/stores/?pinCode=${pincode || ""}`)
      .then(r => setStores(r.data?.result?.matchedStores?.slice(0, 6) || []))
      .catch(() => setStores([]));
  }, [pincode]);

  const socialLinks = [
    { href: details?.facebook,  Icon: FacebookIcon,  color: '#3B82F6',  label: 'Facebook' },
    { href: details?.instagram, Icon: InstagramIcon, color: '#EC4899',  label: 'Instagram' },
    { href: details?.linkedIn,  Icon: LinkedInIcon,  color: '#2563EB',  label: 'LinkedIn' },
    { href: details?.twitter,   Icon: TwitterIcon,   color: '#06B6D4',  label: 'Twitter' },
  ];

  return (
    <Box component="footer" sx={{ backgroundColor: '#0A1628', color: '#fff' }}>
      {/* Top gradient border */}
      <Box sx={{ height: 3, background: 'linear-gradient(90deg, #FF6B35 0%, #e63946 50%, #FF6B35 100%)' }} />

      <Box sx={{ px: { xs: 3, md: 7 }, pt: 6, pb: 4 }}>
        <Grid container spacing={5}>
          {/* Brand + Review */}
          <Grid item xs={12} md={3.5}>
            {/* Logo on dark bg */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: '14px', p: 1.2, mb: 2.5,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <img src={logo} width={120} alt="ZoDeals" style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }} />
            </Box>

            <Typography fontSize={13} color="#6B7280" fontFamily="Inter, sans-serif" mb={3} lineHeight={1.7} maxWidth={260}>
              Discover verified coupons, deals and offers from 500+ top brands across India.
            </Typography>

            {/* Social icons */}
            <Box display="flex" gap={1} mb={3}>
              {socialLinks.map(({ href, Icon, color, label }) => (
                <a key={label} href={href || '#'} target="_blank" rel="noopener noreferrer">
                  <Box sx={{
                    width: 36, height: 36, borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.22s',
                    '&:hover': {
                      backgroundColor: `${color}25`,
                      borderColor: `${color}60`,
                      transform: 'translateY(-2px)',
                    },
                  }}>
                    <Icon sx={{ fontSize: 17, color: 'rgba(255,255,255,0.55)' }} />
                  </Box>
                </a>
              ))}
            </Box>

            <Addreview />
          </Grid>

          {/* Popular Stores */}
          <Grid item xs={6} md={2}>
            <ColHeading>Top Stores</ColHeading>
            <List disablePadding>
              {stores.map(store => (
                <FooterLink
                  key={store._id}
                  to="/single-store-page"
                  state={{ storeId: store._id, name: store.name, logo: store.logo }}
                >
                  {store.name}
                </FooterLink>
              ))}
            </List>
          </Grid>

          {/* Categories */}
          <Grid item xs={6} md={2}>
            <ColHeading>Categories</ColHeading>
            <List disablePadding>
              {categories.map(cat => (
                <FooterLink
                  key={cat._id}
                  to={`/category/${slugify(cat.title)}`}
                  state={{ id: cat._id, title: cat.title }}
                >
                  {cat.title}
                </FooterLink>
              ))}
            </List>
          </Grid>

          {/* Company */}
          <Grid item xs={6} md={2}>
            <ColHeading>Company</ColHeading>
            <List disablePadding>
              {footerLinks.company.map(item => (
                <FooterLink key={item.label} to={item.path}>{item.label}</FooterLink>
              ))}
            </List>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={2.5}>
            <ColHeading>Contact Us</ColHeading>

            {[
              { Icon: Mail,   text: details?.email,         label: 'Email' },
              { Icon: Phone,  text: details?.primaryNumber, label: 'Phone' },
              { Icon: MapPin, text: details?.location,      label: 'Location' },
            ].map(({ Icon, text, label }) => text && (
              <Box key={label} display="flex" gap={1.5} mb={2} alignItems="flex-start">
                <Box sx={{
                  mt: 0.2, width: 30, height: 30, borderRadius: '9px',
                  backgroundColor: 'rgba(255,107,53,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  border: '1px solid rgba(255,107,53,0.2)',
                }}>
                  <Icon size={14} color="#FF6B35" />
                </Box>
                <Typography fontSize={13} color="#6B7280" fontFamily="Inter, sans-serif" lineHeight={1.6}>
                  {text}
                </Typography>
              </Box>
            ))}

            <Box display="flex" flexDirection="column" gap={1.2} mt={2.5}>
              <VendorPartnershipButton />
              <Button
                component={RouterLink}
                to="/agent-contact"
                variant="outlined"
                sx={{
                  color: '#9CA3AF', borderColor: 'rgba(255,255,255,0.12)',
                  fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13,
                  textTransform: 'none', borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: '#FF6B35', borderColor: '#FF6B35', color: '#fff',
                    boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
                  },
                  transition: 'all 0.22s',
                }}
              >
                Become an Agent
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom bar */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', py: 2.5, px: { xs: 3, md: 7 } }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 1,
        }}>
          <Typography fontSize={12} color="#4B5563" fontFamily="Inter, sans-serif">
            © 2025 ZoDeals.in — All Rights Reserved
          </Typography>
          <Typography fontSize={12} color="#4B5563" fontFamily="Inter, sans-serif"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Built with <Heart size={12} color="#FF6B35" fill="#FF6B35" /> by Aptapace
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
