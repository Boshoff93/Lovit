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
  ogImageAlt = 'Gruvi AI Music Generator',
  ogSiteName = 'Gruvi',
  ogLocale = 'en_US',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterSite = '@gruvimusic',
  twitterCreator,
  canonicalUrl,
  robots = 'index, follow',
  author,
  language = 'en',
  structuredData
}) => {
  // Use default image if not provided
  const defaultImage = '/gruvi.png';
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
      <meta property="og:site_name" content={"Gruvi: AI Music Generator"} />
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
      <meta name="theme-color" content="#007AFF" />
      <meta name="msapplication-TileColor" content="#007AFF" />
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
    "name": "Gruvi - AI Music Generator",
    "description": "Create original AI-generated music and stunning music videos with Gruvi",
    "applicationCategory": "MusicApplication",
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
      "name": "Gruvi",
      "url": "https://gruvimusic.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gruvi",
      "url": "https://gruvimusic.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gruvimusic.com/gruvi.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://gruvimusic.com"
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
      "name": "Gruvi",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gruvimusic.com/gruvi.png"
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
      name: 'Gruvi',
      url: 'https://gruvimusic.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };
};

// Organization Schema for rich snippets
export const createOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gruvi",
    "url": "https://gruvimusic.com",
    "logo": "https://gruvimusic.com/gruvi.png",
    "description": "AI music generator creating original songs and stunning music videos with advanced AI technology",
    "sameAs": [
      "https://www.tiktok.com/@gruvimusic",
      "https://www.instagram.com/gruvimusic",
      "https://www.youtube.com/@gruvimusic",
      "https://x.com/gruvimusic"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@gruvimusic.com"
    }
  };
};

// Music Recording Schema for songs
export const createMusicRecordingStructuredData = (song?: {
  name: string;
  description: string;
  duration: string;
  genre: string[];
}) => {
  const defaultSong = {
    name: "AI Generated Music",
    description: "Original AI-generated music created with Gruvi's advanced music generation technology",
    duration: "PT3M",
    genre: ["AI Music", "Electronic", "Pop", "Original Music"]
  };
  
  const data = song || defaultSong;
  
  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": data.name,
    "description": data.description,
    "duration": data.duration,
    "encodingFormat": "audio/mpeg",
    "genre": data.genre,
    "inLanguage": "en-US",
    "creator": {
      "@type": "Organization",
      "name": "Gruvi",
      "url": "https://gruvimusic.com"
    },
    "isPartOf": {
      "@type": "CreativeWork",
      "name": "Gruvi AI Music",
      "description": "AI-generated music and music videos"
    },
    "keywords": ["AI music", "AI music generator", "original music", "music creation", "AI songs"]
  };
};

// Software Application Schema
export const createSoftwareAppStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Gruvi - AI Music Generator",
    "description": "Create original AI-generated music and stunning music videos with Gruvi",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "8.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "100",
      "bestRating": "5",
      "worstRating": "1"
    },
    "url": "https://gruvimusic.com"
  };
};

// HowTo Schema for "How It Works" sections
export const createHowToStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Create AI Music with Gruvi",
    "description": "Learn how to create original AI-generated music and music videos with Gruvi in 3 simple steps",
    "image": "https://gruvimusic.com/gruvi.png",
    "totalTime": "PT2M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "8.99"
    },
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Describe your song",
        "text": "Type a description of the song you want to create - genre, mood, lyrics, or any musical idea.",
        "image": "https://gruvimusic.com/gruvi.png"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Generate with AI",
        "text": "Our advanced AI generates a complete original song with vocals, instrumentals, and lyrics in seconds.",
        "image": "https://gruvimusic.com/gruvi.png"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Create music videos",
        "text": "Turn your songs into stunning animated music videos in 16 different art styles.",
        "image": "https://gruvimusic.com/gruvi.png"
      }
    ]
  };
};

// Page Sections Schema for navigation and SEO
export const createPageSectionsStructuredData = (sections: Array<{ name: string; description: string; hash: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://gruvimusic.com",
    "name": "Gruvi AI Music Generator",
    "description": "Create original AI-generated music and music videos",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Gruvi",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web"
    },
    "hasPart": sections.map(section => ({
      "@type": "WebPageElement",
      "name": section.name,
      "url": `https://gruvimusic.com#${section.hash}`,
      "description": section.description
    }))
  };
};

// Music Playlist Schema for track listings
export const createMusicPlaylistStructuredData = (playlist: {
  name: string;
  description: string;
  url: string;
  tracks: Array<{ name: string; duration: string; genre?: string }>;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    "name": playlist.name,
    "description": playlist.description,
    "url": playlist.url,
    "numTracks": playlist.tracks.length,
    "creator": {
      "@type": "Organization",
      "name": "Gruvi",
      "url": "https://gruvi.ai"
    },
    "track": playlist.tracks.map((track, index) => ({
      "@type": "MusicRecording",
      "position": index + 1,
      "name": track.name,
      "duration": track.duration,
      ...(track.genre && { "genre": track.genre }),
      "creator": {
        "@type": "Organization",
        "name": "Gruvi AI"
      }
    }))
  };
};
