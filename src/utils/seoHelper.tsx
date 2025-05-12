interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
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
  twitterCard = 'summary',
  twitterTitle,
  twitterDescription,
  structuredData
}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1000"
    },
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