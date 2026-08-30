import { ProductGrid } from "./components/products";
import CustomerReviews from "./components/CustomerReviews";
import HeroSection from "./components/HeroSection";
import ShopByModel from "./components/ShopByModel";
import { getCachedProducts } from "./lib/products-cache";

export const dynamic = "force-dynamic";
const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://albilaad-ksa.com";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

async function getHomeConfig() {
  try {
    const [settingsRes, maxRes] = await Promise.all([
      fetch(`${BACKEND}/api/admin/sub-categories/home-settings`, { next: { tags: ["home-settings"], revalidate: 3600 } }),
      fetch(`${BACKEND}/api/admin/sub-categories/max`, { next: { tags: ["home-settings"], revalidate: 3600 } }),
    ]);
    const settings = settingsRes.ok ? await settingsRes.json() : [];
    const { max = 4 } = maxRes.ok ? await maxRes.json() : {};
    return { settings, max };
  } catch {
    return { settings: [], max: 4 };
  }
}

async function getBannerMap(categories: string[]) {
  if (!categories.length) return {};
  try {
    const r = await fetch(
      `${BACKEND}/api/admin/category-banners-bulk?categories=${encodeURIComponent(categories.join(","))}`,
      { cache: "no-store" }
    );
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export default async function Home() {
  const [c, products, homeConfig] = await Promise.all([
    getCompany(),
    getCachedProducts(),
    getHomeConfig(),
  ]);
  const categories = [...new Set((products as { category?: string }[]).map((p) => p.category).filter(Boolean))] as string[];
  const bannerMap = await getBannerMap(categories);
  const siteName = c.nameAr || "مؤسسة البلاد الحديثة للإلكترونيات";
  const logoUrl = c.logo
    ? (c.logo.startsWith("http") ? c.logo : `${BACKEND}${c.logo}`)
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: c.nameEn || "Al Bilad Modern Electronics",
    url: SITE_URL,
    logo: logoUrl,
    contactPoint: [
      c.phone && {
        "@type": "ContactPoint",
        telephone: c.phone,
        contactType: "customer service",
        areaServed: "SA",
        availableLanguage: "Arabic",
      },
      c.whatsapp && {
        "@type": "ContactPoint",
        telephone: c.whatsapp,
        contactType: "sales",
        areaServed: "SA",
        availableLanguage: "Arabic",
      },
    ].filter(Boolean),
    address: c.addressAr ? {
      "@type": "PostalAddress",
      addressLocality: c.addressAr,
      addressCountry: "SA",
    } : undefined,
    email: c.email || undefined,
    sameAs: c.website ? [c.website] : [],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <main className="min-h-screen" style={{ background: "radial-gradient(ellipse at 70% 0%, #e8eeff 0%, #f4f6ff 35%, #f9fafb 70%, #ffffff 100%)" }}>
        <HeroSection />
        <ShopByModel />
        <ProductGrid products={products} homeConfig={homeConfig} bannerMap={bannerMap} />
        <CustomerReviews />
      </main>
    </>
  );
}
