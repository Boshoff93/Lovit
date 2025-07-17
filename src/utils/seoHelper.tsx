interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageAlt?: string;
  ogSiteName?: string;
  ogLocale?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  robots?: string;
  author?: string;
  language?: string;
  structuredData?: any;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogType = 'website',
  ogUrl,
  ogImage,
  ogImageWidth = '1200',
  ogImageHeight = '630',
  ogImageAlt = 'Lovit AI Fashion Platform',
  ogSiteName = 'Lovit',
  ogLocale = 'en_US',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterSite = '@trylovit',
  twitterCreator,
  canonicalUrl,
  robots = 'index, follow',
  author,
  language = 'en',
  structuredData
}) => {
  // Use default image if not provided
  const defaultImage = '/lovit.png';
  const imageUrl = ogImage || defaultImage;
  const twitterImg = twitterImage || imageUrl;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <meta name="language" content={language} />
      {author && <meta name="author" content={author} />}
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={"Lovit: Your Virtual Fashion Studio"} />
      <meta property="og:locale" content={ogLocale} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={ogImageWidth} />
      <meta property="og:image:height" content={ogImageHeight} />
      <meta property="og:image:alt" content={ogImageAlt} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:image" content={twitterImg} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
      
      {/* Additional Social Media */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={title} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </>
  );
};

export const createFAQStructuredData = (faqItems: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
};

export const createHomePageStructuredData = (featureItems: Array<{ title: string; description: string; image: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Lovit - AI Fashion Platform",
    "description": "Create, customize and generate AI images of yourself in any outfit with Lovit",
    "applicationCategory": "FashionApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "9",
      "highPrice": "99",
      "offerCount": "3"
    },
    "featureList": featureItems.map(item => item.title).join(", "),
    "screenshot": featureItems.map(item => item.image),
    "author": {
      "@type": "Organization",
      "name": "Lovit",
      "url": "https://trylovit.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lovit",
      "url": "https://trylovit.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://trylovit.com/lovit.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://trylovit.com"
    }
  };
};

export const createBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const createVideoStructuredData = (videoData: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": videoData.name,
    "description": videoData.description,
    "thumbnailUrl": videoData.thumbnailUrl,
    "uploadDate": videoData.uploadDate,
    "duration": videoData.duration,
    "url": videoData.url,
    "embedUrl": videoData.url,
    "publisher": {
      "@type": "Organization",
      "name": "Lovit",
      "logo": {
        "@type": "ImageObject",
        "url": "https://trylovit.com/lovit.png"
      }
    }
  };
};

export const createArticleStructuredData = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url
}: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; url: string; } | string;
  url: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author: typeof author === 'string' ? author : {
      '@type': 'Person',
      name: author.name,
      url: author.url
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lovit',
      url: 'https://trylovit.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };
}; 