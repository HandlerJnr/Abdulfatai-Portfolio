/* Vercel's tracker handles initial visits, pushState and browser history.
   Keep previews/local development out of production traffic. */
(()=>{
  'use strict';
  if (!location.hostname.endsWith('.vercel.app')) return;
  if (document.querySelector('script[src="/_vercel/insights/script.js"]')) return;
  const script = document.createElement('script');
  script.src = '/_vercel/insights/script.js';
  script.defer = true;
  document.head.appendChild(script);
})();
