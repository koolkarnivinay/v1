import React from 'react';
import { Box } from '@mui/material';
import BannerPage from './Bannerpage';
import FeaturedStores from './featuredStores';
import TopDeals from './topdeals';
import CategoriesSection from './categorysection';
import LatestDeals from './latestDeals';
import CouponsSection from './coupenscomponent';
import GrabDealsCarousel from './grabdeals';
import MensFashionDeals from './mensfashion';
import WomensFashion from './womensfashion';
import PharmacyCoupens from './pharmacypage';
import ElectronicsPage from './electronicspage';
import SkinCarePage from './skincarepage';
import FlightDealsPage from './flightdealspage';
import FavoriteDealsBanner from './FavouriteDealBanner';
import DealsOfTheDay from './DealsofDay';
import CustomerReviews from './reviewsPage';
import ErrorBoundary from '../libs/ErrorBoundary';

export default function HomePage() {
  return (
    <Box sx={{ backgroundColor: '#F5F7FA' }}>
      <ErrorBoundary debug label="BannerPage"><BannerPage /></ErrorBoundary>
      <ErrorBoundary debug label="FeaturedStores"><FeaturedStores /></ErrorBoundary>
      <ErrorBoundary debug label="TopDeals"><TopDeals /></ErrorBoundary>
      <ErrorBoundary debug label="DealsOfTheDay"><DealsOfTheDay /></ErrorBoundary>
      <ErrorBoundary debug label="CategoriesSection"><CategoriesSection /></ErrorBoundary>
      <ErrorBoundary debug label="LatestDeals"><LatestDeals /></ErrorBoundary>
      <ErrorBoundary debug label="CouponsSection"><CouponsSection /></ErrorBoundary>
      <ErrorBoundary debug label="GrabDealsCarousel"><GrabDealsCarousel /></ErrorBoundary>
      <ErrorBoundary debug label="WomensFashion"><WomensFashion /></ErrorBoundary>
      <ErrorBoundary debug label="MensFashionDeals"><MensFashionDeals /></ErrorBoundary>
      <ErrorBoundary debug label="PharmacyCoupens"><PharmacyCoupens /></ErrorBoundary>
      <ErrorBoundary debug label="ElectronicsPage"><ElectronicsPage /></ErrorBoundary>
      <ErrorBoundary debug label="SkinCarePage"><SkinCarePage /></ErrorBoundary>
      <ErrorBoundary debug label="FlightDealsPage"><FlightDealsPage /></ErrorBoundary>
      <ErrorBoundary debug label="FavoriteDealsBanner"><FavoriteDealsBanner /></ErrorBoundary>
      <ErrorBoundary debug label="CustomerReviews"><CustomerReviews /></ErrorBoundary>
    </Box>
  );
}
