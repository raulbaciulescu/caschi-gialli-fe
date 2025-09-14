import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { analytics } from '../utils/analytics';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

  const handleContactCG = async (cgId: string, cgName: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Track SEO conversion
      const categoryName = getCategoryFromService(service || '');
      const cityName = getCityFromSlug(city || '');
      if (categoryName && cityName) {
        analytics.trackSEOConversion(categoryName, cityName, cgId);
      }
      
      // Track CG contact
      analytics.trackCGContact(cgId, cgName, 'chat');
      
      await createChat([user.id, cgId], [user.name, cgName]);
      navigate('/chat');
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };