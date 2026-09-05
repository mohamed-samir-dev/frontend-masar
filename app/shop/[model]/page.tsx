import { notFound } from "next/navigation";
import { getCachedProducts } from "../../lib/products-cache";
import ShopModelClient from "./ShopModelClient";
import type { Product } from "../../components/products/types";

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  highlight?: string;
}

const MODEL_MAP: Record<
  string,
  { label: string; keywords: string[]; hero: HeroSlide[] }
> = {
  "17-pro-max": {
    label: "آيفون 17 برو ماكس",
    keywords: ["17 برو ماكس", "17 pro max", "17promax"],
    hero: [
      { image: "/iphone-17-promax/i-hero1.webp", title: "تصميم بريميوم من ألومنيوم", subtitle: "تصميم بقطعة واحدة من الألومنيوم المشكّل بالحرارة لقدرات احترافية استثنائية.", highlight: "احترافية استثنائية" },
      { image: "/iphone-17-promax/i-hero2.webp", title: "أداء نار مع شريحة A19 Pro", subtitle: "تبريد بالبخار، سرعة فائقة، وبطارية تدوم أكثر", highlight: "سرعة فائقة" },
      { image: "/iphone-17-promax/i-hero3.webp", title: "كاميرا احترافية.. تفاصيل مذهلة", subtitle: "ثلاث كاميرات 48MP Fusion مع أطول زووم في تاريخ iPhone", highlight: "أطول زووم" },
      { image: "/iphone-17-promax/i-hero4.webp", title: "كاميرا Center Stage.. سيلفي أذكى", subtitle: "تأطير مرن، صور جماعية أفضل، وتجربة سيلفي أكثر ذكاءً", highlight: "أكثر ذكاءً" },
      { image: "/iphone-17-promax/i-hero5.webp", title: "iOS 26.. ستايل جديد وتجربة أجمل", subtitle: "تصميم جديد، مزايا أكثر، وتجربة استخدام أكثر سلاسة", highlight: "أكثر سلاسة" },
      { image: "/iphone-17-promax/i-hero6.webp", title: "Apple Intelligence.. ذكاء يساعدك أكثر", subtitle: "إنشاء الصور، الترجمة المباشرة، ومزايا ذكية تجعل يومك أسهل", highlight: "يومك أسهل" },
    ],
  },
  "17-pro": {
    label: "آيفون 17 برو",
    keywords: ["17 برو", "17 pro"],
    hero: [
      { image: "/iphone-17-promax/i-hero1.webp", title: "تصميم بريميوم من ألومنيوم", subtitle: "تصميم بقطعة واحدة من الألومنيوم المشكّل بالحرارة لقدرات احترافية استثنائية.", highlight: "احترافية استثنائية" },
      { image: "/iphone-17-promax/i-hero2.webp", title: "أداء نار مع شريحة A19 Pro", subtitle: "تبريد بالبخار، سرعة فائقة، وبطارية تدوم أكثر", highlight: "سرعة فائقة" },
      { image: "/iphone-17-promax/i-hero3.webp", title: "كاميرا احترافية.. تفاصيل مذهلة", subtitle: "ثلاث كاميرات 48MP Fusion مع أطول زووم في تاريخ iPhone", highlight: "أطول زووم" },
      { image: "/iphone-17-promax/i-hero4.webp", title: "كاميرا Center Stage.. سيلفي أذكى", subtitle: "تأطير مرن، صور جماعية أفضل، وتجربة سيلفي أكثر ذكاءً", highlight: "أكثر ذكاءً" },
      { image: "/iphone-17-promax/i-hero5.webp", title: "iOS 26.. ستايل جديد وتجربة أجمل", subtitle: "تصميم جديد، مزايا أكثر، وتجربة استخدام أكثر سلاسة", highlight: "أكثر سلاسة" },
      { image: "/iphone-17-promax/i-hero6.webp", title: "Apple Intelligence.. ذكاء يساعدك أكثر", subtitle: "إنشاء الصور، الترجمة المباشرة، ومزايا ذكية تجعل يومك أسهل", highlight: "يومك أسهل" },
    ],
  },
  "17-air": {
    label: "آيفون 17 إير",
    keywords: ["17 اير", "17 إير", "17 air"],
    hero: [
      {
        image: "/iphone-17-air/i-hero1.webp",
        title: "أنحف iPhone على الإطلاق",
        subtitle: "في قلبه قوة عملاق.",
        highlight: "أنحف"
      },
      {
        image: "/iphone-17-air/i-hero2.webp",
       title: "كاميرا Center Stage",
        subtitle: "تأطير مرن. سيلفي جماعية أذكى.",
        highlight: "Center Stage"
      },
      {
        image: "/iphone-17-air/i-hero3.webp",
         title: "كاميرا Fusion 48MP",
        subtitle: "كاميرتان متطورتان في كاميرا واحدة.",
        highlight: "48MP"
      },
      {
        image: "/iphone-17-air/i-hero4.webp",
         title: "iOS 26",
        subtitle: "ستايل جديد. يبهرك بالمزيد.",
        highlight: "ستايل جديد"
      },
      {
        image: "/iphone-17-air/i-hero5.webp",
        title: "شريحة A19 Pro",
        subtitle: "قوة هائلة وبطارية تدوم طوال اليوم.",
        highlight: "A19 Pro"
      },
     
    ],
  },
  "17": {
    label: "آيفون 17",
    keywords: ["ايفون 17", "آيفون 17", "iphone 17"],
    hero: [
     { 
  image: "/iphone-17/i-hero1.webp",
  title: "ملك جمال اللون.",
  subtitle: "ألوان تخطف الأنظار",
  highlight: "تخطف الأنظار"
},
{ 
  image: "/iphone-17/i-hero4.webp",
  title: "الجديد، بالمختصر المفيد.",
  subtitle: "ستايل جديد. يبهرك بالمزيد.",
  highlight: "يبهرك بالمزيد"
},
{ 
  image: "/iphone-17/i-hero2.webp",
  title: "أصلب. وإلى القلب أقرب.",
  subtitle: "تصميم ينفرد بخطوط انسيابية",
  highlight: "أصلب"
},
{ 
  image: "/iphone-17/i-hero5.webp",
  title: "شاشة أكبر. تجربة أمتع.",
  subtitle: "سوبر ريتنا XDR مع ProMotion حتى 120Hz",
  highlight: "تجربة أمتع"
},
{ 
  image: "/iphone-17/i-hero3.webp",
  title: "من بعيد أو قريب، يبهرك.",
  subtitle: "نظام كاميرا Fusion مزدوجة 48MP",
  highlight: "يبهرك عندما تصوّر"
},
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(MODEL_MAP).map((model) => ({ model }));
}

export default async function ShopModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model } = await params;
  const config = MODEL_MAP[model];
  if (!config) notFound();

  const allProducts: Product[] = await getCachedProducts();

  const products = allProducts.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    return config.keywords.some(
      (kw) =>
        name.includes(kw.toLowerCase()) || category.includes(kw.toLowerCase())
    );
  });

  const filtered =
    model === "17-pro"
      ? products.filter(
        (p) =>
          !(p.name || "").toLowerCase().includes("ماكس") &&
          !(p.name || "").toLowerCase().includes("max")
      )
      : products;

  const storageOrder = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];
  const getStorage = (p: Product) => {
    const match = (p.storage ?? p.name ?? "").match(/\d+\s*(GB|TB|جيجابايت|تيرابايت)/i);
    return match ? match[0].replace(/\s/g, "").replace(/جيجابايت/i, "GB").replace(/تيرابايت/i, "TB").toUpperCase() : "";
  };
  const sorted = [...filtered].sort((a, b) => {
    const ai = storageOrder.indexOf(getStorage(a));
    const bi = storageOrder.indexOf(getStorage(b));
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <ShopModelClient
      products={sorted}
      modelName={config.label}
      hero={config.hero}
    />
  );
}
