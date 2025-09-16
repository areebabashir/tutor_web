import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterSite?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = "Bizlish - Learn from the Best Tutors Anytime, Anywhere",
  description = "Explore courses that elevate your skills and career with flexible learning options. Expert tutors, affordable pricing, and interactive learning.",
  keywords = "online learning, courses, tutors, education, skills, career development, IELTS, spoken English, competitive exams, GRE vocabulary",
  author = "Bizlish",
  ogTitle,
  ogDescription,
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  ogUrl,
  twitterCard = "summary_large_image",
  twitterSite = "@bizlishofficial",
  canonical = window.location.origin + window.location.pathname,
  noindex = false,
  nofollow = false
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Open Graph meta tags
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:image', ogImage, true);
    if (ogUrl) {
      updateMetaTag('og:url', ogUrl, true);
    }

    // Twitter Card meta tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:site', twitterSite);
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    }

    // Robots meta tag
    const robotsContent = [];
    if (noindex) robotsContent.push('noindex');
    if (nofollow) robotsContent.push('nofollow');
    if (robotsContent.length > 0) {
      updateMetaTag('robots', robotsContent.join(', '));
    } else {
      // Default robots for SEO
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Additional SEO meta tags
    updateMetaTag('googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('bingbot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Add structured data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Bizlish",
      "description": description,
      "url": canonical,
      "logo": "https://bizlish.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+92-318-5078571",
        "contactType": "customer service",
        "email": "bizlishofficial@gmail.com"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PK"
      },
      "sameAs": [
        "https://www.instagram.com/bizlishofficial"
      ],
      "offers": {
        "@type": "Offer",
        "category": "English Language Learning",
        "description": "IELTS preparation, Spoken English, Competitive Exams, GRE Vocabulary courses"
      }
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function to reset to default values when component unmounts
    return () => {
      document.title = "Bizlish - Learn from the Best Tutors Anytime, Anywhere";
      // Remove structured data on cleanup
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, keywords, author, ogTitle, ogDescription, ogImage, ogUrl, twitterCard, twitterSite, canonical, noindex, nofollow]);

  return null; // This component doesn't render anything
};

export default SEO;
