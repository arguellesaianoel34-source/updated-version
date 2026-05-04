import { useEffect } from 'react';
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";

interface LogoContent {
  logoUrl?: string;
}

export function DynamicFavicon() {
  const { data: logoData } = useGetSiteContent("logo", {
    query: { 
      queryKey: getGetSiteContentQueryKey("logo"), 
      refetchInterval: 15000,
      retry: false,
    },
  });

  const logoContent = (logoData?.content ?? {}) as LogoContent;
  const logoUrl = logoContent.logoUrl;

  useEffect(() => {
    if (logoUrl) {
      // Update favicon
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = logoUrl;

      // Update apple-touch-icon
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleTouchIcon);
      }
      appleTouchIcon.href = logoUrl;
    }
  }, [logoUrl]);

  return null;
}
