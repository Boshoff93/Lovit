import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: string[];
  canonical?: string;
  hreflang?: Array<{ lang: string; url: string }>;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Gruvi - AI Music Generator & Music Video Creator',
  description = 'Create original AI-generated music and stunning music videos in any style. Your personal AI music studio.',
  keywords = 'AI music generator, music video creator, AI songs, create music, AI studio, free music generator',
  ogTitle,
  ogDescription,
  ogType = 'website',
  ogUrl = 'https://vibemusic.ai',
  ogImage = 'https://vibemusic.ai/vibe-og-image.jpg',
  twitterTitle,
  twitterDescription,
  twitterImage = 'https://vibemusic.ai/vibe-og-image.jpg',
  structuredData = [],
  canonical,
  hreflang = [],
}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Language and Regional URLs - hreflang */}
      {hreflang.length > 0 && hreflang.map((item, index) => (
        <link key={index} rel="alternate" hrefLang={item.lang} href={item.url} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Gruvi" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={twitterImage} />
      
      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: data }}
        />
      ))}
    </>
  );
};

// Helper function to create FAQ structured data
export const createFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  return JSON.stringify(faqData);
};

// Helper function to create breadcrumb structured data
export const createBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  return JSON.stringify(breadcrumbData);
};

// Helper function to create product structured data for music service
export const createMusicServiceStructuredData = () => {
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Gruvi - AI Music Generator",
    "applicationCategory": "MusicApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier available"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };
  return JSON.stringify(serviceData);
};

// Helper to create slug from text
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default SEO;

