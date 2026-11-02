import { useEffect } from "react";
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
  ogType = "website",
  ogUrl,
  ogImage,
  ogImageWidth = "1200",
  ogImageHeight = "630",
  ogImageAlt = "Gruvi content distribution for agents",
  ogSiteName = "Gruvi",
  ogLocale = "en_US",
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterSite = "@gruvimusic",
  twitterCreator,
  canonicalUrl,
  robots = "index, follow",
  author,
  language = "en",
  structuredData,
}) => {
  // Use default image if not provided
  const defaultImage = "/gruvi-social.png";
  const imageUrl = new URL(ogImage || defaultImage, "https://agentgruvi.com")
    .href;
  const twitterImg = twitterImage || imageUrl;

  useEffect(() => {
    document.title = title;
    const url =
      canonicalUrl ||
      ogUrl ||
      window.location.origin + window.location.pathname;
    const setMeta = (
      attribute: "name" | "property",
      key: string,
      content: string | undefined,
    ) => {
      const matches = Array.from(
        document.head.querySelectorAll<HTMLMetaElement>(
          `meta[${attribute}="${key}"]`,
        ),
      );
      if (!content) {
        matches.forEach((element) => element.remove());
        return;
      }
      const element = matches.shift() || document.createElement("meta");
      element.setAttribute(attribute, key);
      element.content = content;
      if (!element.parentNode) document.head.appendChild(element);
      matches.forEach((duplicate) => duplicate.remove());
    };
    for (const [key, value] of Object.entries({
      description,
      keywords,
      robots,
      language,
      author,
    }))
      setMeta("name", key, value);
    for (const [key, value] of Object.entries({
      title: ogTitle || title,
      description: ogDescription || description,
      type: ogType,
      site_name: ogSiteName,
      locale: ogLocale,
      url,
      image: imageUrl,
      "image:width": ogImageWidth,
      "image:height": ogImageHeight,
      "image:alt": ogImageAlt,
    }))
      setMeta("property", "og:" + key, value);
    for (const [key, value] of Object.entries({
      card: twitterCard,
      title: twitterTitle || title,
      description: twitterDescription || description,
      image: twitterImg,
      site: twitterSite,
      creator: twitterCreator,
    })) {
      // Remove legacy property-based Twitter tags before setting the name-based tag.
      document.head
        .querySelectorAll(`meta[property="twitter:${key}"]`)
        .forEach((element) => element.remove());
      setMeta("name", "twitter:" + key, value);
    }
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
    let schema = document.getElementById("gruvi-page-schema");
    if (structuredData) {
      if (!schema) {
        schema = document.createElement("script");
        schema.id = "gruvi-page-schema";
        schema.setAttribute("type", "application/ld+json");
        document.head.appendChild(schema);
      }
      schema.textContent = JSON.stringify(structuredData).replace(
        /</g,
        "\\u003c",
      );
    } else schema?.remove();
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogType,
    ogUrl,
    ogSiteName,
    ogLocale,
    imageUrl,
    ogImageWidth,
    ogImageHeight,
    ogImageAlt,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImg,
    twitterSite,
    twitterCreator,
    canonicalUrl,
    robots,
    author,
    language,
    structuredData,
  ]);
  return null;
};

export const createFAQStructuredData = (
  faqItems: Array<{ question: string; answer: string }>,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
};

export const createHomePageStructuredData = (
  featureItems: Array<{ title: string; description: string; image: string }>,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Gruvi",
    description:
      "Content distribution for agents. Upload finished videos, add thumbnails, publish to social channels and track delivery.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "10",
      highPrice: "50",
      offerCount: "3",
    },
    featureList: featureItems.map((item) => item.title).join(", "),
    screenshot: featureItems.map((item) => item.image),
    author: {
      "@type": "Organization",
      name: "Gruvi",
      url: "https://agentgruvi.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Gruvi",
      url: "https://agentgruvi.com",
      logo: {
        "@type": "ImageObject",
        url: "https://agentgruvi.com/gruvi.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://agentgruvi.com",
    },
  };
};

export const createBreadcrumbStructuredData = (
  items: Array<{ name: string; url: string }>,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
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
    name: videoData.name,
    description: videoData.description,
    thumbnailUrl: videoData.thumbnailUrl,
    uploadDate: videoData.uploadDate,
    duration: videoData.duration,
    url: videoData.url,
    embedUrl: videoData.url,
    publisher: {
      "@type": "Organization",
      name: "Gruvi",
      logo: {
        "@type": "ImageObject",
        url: "https://agentgruvi.com/gruvi.png",
      },
    },
  };
};

export const createArticleStructuredData = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; url: string } | string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author:
      typeof author === "string"
        ? author
        : {
            "@type": "Person",
            name: author.name,
            url: author.url,
          },
    publisher: {
      "@type": "Organization",
      name: "Gruvi",
      url: "https://agentgruvi.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
};

// Organization Schema for rich snippets
export const createOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Gruvi",
    url: "https://agentgruvi.com",
    logo: "https://agentgruvi.com/gruvi.png",
    description:
      "Content distribution for agents and teams through one dashboard, API and MCP server.",
    sameAs: [
      "https://www.tiktok.com/@gruvimusic",
      "https://www.instagram.com/gruvimusic",
      "https://www.youtube.com/@gruvimusic",
      "https://x.com/gruvimusic",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "admin@wbtechventures.com",
    },
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
    description:
      "Original AI-generated music created with Gruvi's advanced music generation technology",
    duration: "PT3M",
    genre: ["AI Music", "Electronic", "Pop", "Original Music"],
  };

  const data = song || defaultSong;

  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: data.name,
    description: data.description,
    duration: data.duration,
    encodingFormat: "audio/mpeg",
    genre: data.genre,
    inLanguage: "en-US",
    creator: {
      "@type": "Organization",
      name: "Gruvi",
      url: "https://agentgruvi.com",
    },
    isPartOf: {
      "@type": "CreativeWork",
      name: "Gruvi AI Music",
      description: "AI-generated music and music videos",
    },
    keywords: [
      "AI music",
      "AI music generator",
      "original music",
      "music creation",
      "AI songs",
    ],
  };
};

// Software Application Schema
export const createSoftwareAppStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Gruvi",
    description:
      "Upload finished content, schedule social posts and check delivery through Gruvi's dashboard, API and MCP server.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "10",
      highPrice: "50",
      offerCount: "3",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    url: "https://agentgruvi.com",
  };
};

// HowTo Schema for "How It Works" sections
export const createHowToStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to publish social content with Gruvi",
    description:
      "Connect your accounts, upload finished content and choose when to publish.",
    image: "https://agentgruvi.com/gruvi.png",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Connect your social accounts",
        text: "Create a free account and connect the social profiles you want to publish to.",
        image: "https://agentgruvi.com/gruvi.png",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Upload your finished content",
        text: "Upload a video, add your thumbnail and write your caption.",
        image: "https://agentgruvi.com/gruvi.png",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Publish and track delivery",
        text: "Choose a plan when you are ready to publish or schedule. Check delivery in your calendar or through the API.",
        image: "https://agentgruvi.com/gruvi.png",
      },
    ],
  };
};

// Page Sections Schema for navigation and SEO
export const createPageSectionsStructuredData = (
  sections: Array<{ name: string; description: string; hash: string }>,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: "https://agentgruvi.com",
    name: "Gruvi | Content Distribution Built for Agents",
    description: "Upload, schedule and publish social content with Gruvi.",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Gruvi",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    },
    hasPart: sections.map((section) => ({
      "@type": "WebPageElement",
      name: section.name,
      url: `https://agentgruvi.com#${section.hash}`,
      description: section.description,
    })),
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
    name: playlist.name,
    description: playlist.description,
    url: playlist.url,
    numTracks: playlist.tracks.length,
    creator: {
      "@type": "Organization",
      name: "Gruvi",
      url: "https://gruvi.ai",
    },
    track: playlist.tracks.map((track, index) => ({
      "@type": "MusicRecording",
      position: index + 1,
      name: track.name,
      duration: track.duration,
      ...(track.genre && { genre: track.genre }),
      creator: {
        "@type": "Organization",
        name: "Gruvi AI",
      },
    })),
  };
};
