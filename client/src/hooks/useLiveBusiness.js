/**
 * useLiveBusiness — fetch live business data from API, fall back to static.
 *
 * Returns the same shape as client/src/data/business.js:
 *   { name, phone, email, address, navLinks, messengerUrl, venue, ... }
 *
 * Usage:
 *   import { useLiveBusiness } from '../hooks/useLiveBusiness';
 *   const business = useLiveBusiness();
 */
import { useState, useEffect } from 'react';
import { business as businessStatic } from '../data/business';
import { fetchBusiness } from '../lib/contentApi';

export function useLiveBusiness() {
  const [business, setBusiness] = useState(businessStatic);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchBusiness();
        if (res?.data) setBusiness(res.data);
      } catch (err) {
        // Static fallback already in place — silent
        console.debug('[useLiveBusiness] API unavailable, using static fallback:', err.message);
      }
    })();
  }, []);

  return business;
}
