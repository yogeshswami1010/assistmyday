import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/contact-us/",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/service/website-development-company-in-stcatharines/",
        destination: "/services/websites-ecommerce",
        permanent: true,
      },
      {
        source: "/service/digital-marketng-company-in-stcatharines/",
        destination: "/services/performance-marketing",
        permanent: true,
      },
      {
        source: "/service/graphics-designing-company-in-stcatharines/",
        destination: "/services/brand-content-social",
        permanent: true,
      },
      {
        source: "/service/social-media-marketing-company-in-stcatharines/",
        destination: "/services/brand-content-social",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
