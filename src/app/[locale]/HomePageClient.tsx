"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  Apple,
  ArrowRight,
  Baby,
  Ban,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  History,
  Lightbulb,
  Search,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Module 2 code status card icons (one distinct icon per card)
const CODE_CARD_ICONS = [Ban, History, Search, Bell];

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// Shared module header: eyebrow badge + linked title + subtitle + intro
function ModuleHeader({
  eyebrow,
  title,
  subtitle,
  intro,
  linkData,
  locale,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  intro: string;
  linkData: { url: string; title: string } | null | undefined;
  locale: string;
}) {
  return (
    <div className="text-center mb-10 md:mb-14 scroll-reveal">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
        <LinkedTitle linkData={linkData} locale={locale}>
          {title}
        </LinkedTitle>
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
          {subtitle}
        </p>
      )}
      <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://raise-the-biggest-family.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Raise The Biggest Family Wiki",
        description:
          "Complete Raise The Biggest Family Wiki covering adoption guides, baby care, Apples, Family Go mode, growth mechanics, codes status, and tips for the Roblox family adoption simulator.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1023,
          height: 576,
          caption: "Raise The Biggest Family - Roblox Family Adoption Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Raise The Biggest Family Wiki",
        alternateName: "Raise The Biggest Family",
        url: siteUrl,
        description:
          "Unofficial Raise The Biggest Family Wiki resource hub for adoption guides, baby care, Apples, Family Go, and growth mechanics",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1023,
          height: 576,
          caption: "Raise The Biggest Family Wiki - Roblox Family Adoption Simulator",
        },
        sameAs: [
          "https://www.roblox.com/games/89537559330901",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Raise The Biggest Family",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Adoption", "Family Roleplay", "Simulation"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 18,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/89537559330901",
        },
      },
      {
        "@type": "VideoObject",
        name: "Roblox Experience Raise The Biggest Family By Novkod X Level0Expert Basic Overview [0 Robux]",
        description:
          "Basic overview of Raise The Biggest Family on Roblox by Novkod X Level0Expert, showing gameplay of the family adoption and life simulator.",
        uploadDate: "2026-10-30",
        thumbnailUrl: "https://i.ytimg.com/vi/RfWsrczEb0U/hqdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/RfWsrczEb0U",
        url: "https://www.youtube.com/watch?v=RfWsrczEb0U",
      },
    ],
  };

  // Accordion states
  const [strategiesExpanded, setStrategiesExpanded] = useState<number | null>(null);
  const [updatesExpanded, setUpdatesExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x300"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300}
        />
      </aside> */}

      {/* 右侧广告容器 - Fixed 定位 */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x600"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600}
        />
      </aside> */}

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/89537559330901"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="RfWsrczEb0U"
              title="Roblox Experience Raise The Biggest Family By Novkod X Level0Expert Basic Overview [0 Robux]"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID（与下方 8 个模块一一对应）
              const sectionIds = [
                "beginner-guide",
                "codes",
                "apples-fast",
                "adoption-growth",
                "family-go",
                "strategies",
                "milestones",
                "updates",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.familyBeginnerGuide.eyebrow}
            title={t.modules.familyBeginnerGuide.title}
            subtitle={t.modules.familyBeginnerGuide.subtitle}
            intro={t.modules.familyBeginnerGuide.intro}
            linkData={moduleLinkMap["familyBeginnerGuide"]}
            locale={locale}
          />

          {/* Steps */}
          <div className="scroll-reveal space-y-4 md:space-y-5 mb-8 md:mb-10">
            {t.modules.familyBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 md:gap-5 p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-11 w-11 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[`familyBeginnerGuide::steps::${index}`]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    {step.goals && step.goals.length > 0 && (
                      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {step.goals.map((goal: string, gi: number) => (
                          <li
                            key={gi}
                            className="flex items-start gap-2 p-2 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]"
                          >
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            <span className="text-xs md:text-sm text-muted-foreground">
                              {goal}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Common Mistakes to Avoid */}
          <div className="scroll-reveal p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <AlertTriangle className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">
                Common Mistakes to Avoid
              </h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {t.modules.familyBeginnerGuide.mistakes.map(
                (mistake: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <X className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">
                      {mistake}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Codes */}
      <section
        id="codes"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.familyCodes.eyebrow}
            title={t.modules.familyCodes.title}
            subtitle={t.modules.familyCodes.subtitle}
            intro={t.modules.familyCodes.intro}
            linkData={moduleLinkMap["familyCodes"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.familyCodes.cards.map((card: any, index: number) => {
              const CardIcon = CODE_CARD_ICONS[index % CODE_CARD_ICONS.length];
              return (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <CardIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <h3 className="font-bold text-base md:text-lg">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[`familyCodes::cards::${index}`]
                          }
                          locale={locale}
                        >
                          {card.title}
                        </LinkedTitle>
                      </h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-medium whitespace-nowrap">
                      {card.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-2xl font-bold text-[hsl(var(--nav-theme-light))] font-mono">
                      {card.code}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {card.availability}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold text-foreground">
                      Reward:{" "}
                    </span>
                    {card.reward}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {card.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 3: How to Get Apples Fast */}
      <section id="apples-fast" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.familyApplesFast.eyebrow}
            title={t.modules.familyApplesFast.title}
            subtitle={t.modules.familyApplesFast.subtitle}
            intro={t.modules.familyApplesFast.intro}
            linkData={moduleLinkMap["familyApplesFast"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-4">
            {t.modules.familyApplesFast.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 md:gap-5 p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-11 w-11 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <Apple className="w-5 h-5 md:w-6 md:h-6 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg md:text-xl font-bold">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[`familyApplesFast::steps::${index}`]
                          }
                          locale={locale}
                        >
                          {step.title}
                        </LinkedTitle>
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <Sparkles className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                        Best for: {step.bestFor}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <Lightbulb className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                        {step.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Adoption & Family Growth */}
      <section
        id="adoption-growth"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.familyAdoptionGrowth.eyebrow}
            title={t.modules.familyAdoptionGrowth.title}
            subtitle={t.modules.familyAdoptionGrowth.subtitle}
            intro={t.modules.familyAdoptionGrowth.intro}
            linkData={moduleLinkMap["familyAdoptionGrowth"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.familyAdoptionGrowth.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-medium mb-3">
                    {card.tag}
                  </span>
                  <h3 className="font-bold text-base md:text-lg mb-2">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[`familyAdoptionGrowth::cards::${index}`]
                      }
                      locale={locale}
                    >
                      {card.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {card.description}
                  </p>
                  <ul className="space-y-1.5">
                    {card.list.map((item: string, li: number) => (
                      <li
                        key={li}
                        className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground"
                      >
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Family Go Guide */}
      <section id="family-go" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.familyGoGuide.eyebrow}
            title={t.modules.familyGoGuide.title}
            subtitle={t.modules.familyGoGuide.subtitle}
            intro={t.modules.familyGoGuide.intro}
            linkData={moduleLinkMap["familyGoGuide"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-4">
            {t.modules.familyGoGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-4 md:gap-5 p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-11 w-11 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <Baby className="w-5 h-5 md:w-6 md:h-6 text-[hsl(var(--nav-theme-light))]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[`familyGoGuide::steps::${index}`]
                      }
                      locale={locale}
                    >
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <ul className="space-y-1.5">
                    {step.actions.map((action: string, ai: number) => (
                      <li
                        key={ai}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Best Strategies & Progression */}
      <section
        id="strategies"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.familyStrategies.eyebrow}
            title={t.modules.familyStrategies.title}
            subtitle={t.modules.familyStrategies.subtitle}
            intro={t.modules.familyStrategies.intro}
            linkData={moduleLinkMap["familyStrategies"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3">
            {t.modules.familyStrategies.stages.map(
              (stage: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() =>
                      setStrategiesExpanded(
                        strategiesExpanded === index ? null : index,
                      )
                    }
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-semibold uppercase tracking-wide whitespace-nowrap">
                        {stage.stage}
                      </span>
                      <div className="min-w-0">
                        <span className="font-semibold block truncate">
                          <LinkedTitle
                            linkData={
                              moduleLinkMap[
                                `familyStrategies::stages::${index}`
                              ]
                            }
                            locale={locale}
                          >
                            {stage.title}
                          </LinkedTitle>
                        </span>
                        <span className="text-sm text-muted-foreground hidden md:block">
                          {stage.summary}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${strategiesExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {strategiesExpanded === index && (
                    <div className="px-5 pb-5">
                      <ul className="space-y-2">
                        {stage.details.map((detail: string, di: number) => (
                          <li
                            key={di}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Family Size & Progression Milestones */}
      <section id="milestones" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.familySizeMilestones.eyebrow}
            title={t.modules.familySizeMilestones.title}
            subtitle={t.modules.familySizeMilestones.subtitle}
            intro={t.modules.familySizeMilestones.intro}
            linkData={moduleLinkMap["familySizeMilestones"]}
            locale={locale}
          />
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  <th className="p-4 text-sm font-bold">
                    <span className="inline-flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      Milestone
                    </span>
                  </th>
                  <th className="p-4 text-sm font-bold">Requirement</th>
                  <th className="p-4 text-sm font-bold hidden lg:table-cell">
                    Progression Goal
                  </th>
                  <th className="p-4 text-sm font-bold hidden md:table-cell">
                    How to Track
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.familySizeMilestones.rows.map(
                  (row: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 align-top">
                        <span className="font-semibold text-sm text-[hsl(var(--nav-theme-light))]">
                          <LinkedTitle
                            linkData={
                              moduleLinkMap[
                                `familySizeMilestones::rows::${index}`
                              ]
                            }
                            locale={locale}
                          >
                            {row.milestone}
                          </LinkedTitle>
                        </span>
                        <p className="lg:hidden mt-2 text-xs text-muted-foreground">
                          <span className="font-semibold">Goal: </span>
                          {row.goal}
                        </p>
                        <p className="md:hidden mt-2 text-xs text-muted-foreground">
                          <span className="font-semibold">Track: </span>
                          {row.tracking}
                        </p>
                      </td>
                      <td className="p-4 align-top text-sm text-muted-foreground">
                        {row.requirement}
                      </td>
                      <td className="p-4 align-top text-sm text-muted-foreground hidden lg:table-cell">
                        {row.goal}
                      </td>
                      <td className="p-4 align-top text-sm text-muted-foreground hidden md:table-cell">
                        {row.tracking}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: Updates & New Features */}
      <section
        id="updates"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.familyUpdates.eyebrow}
            title={t.modules.familyUpdates.title}
            subtitle={t.modules.familyUpdates.subtitle}
            intro={t.modules.familyUpdates.intro}
            linkData={moduleLinkMap["familyUpdates"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3">
            {t.modules.familyUpdates.entries.map(
              (entry: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() =>
                      setUpdatesExpanded(
                        updatesExpanded === index ? null : index,
                      )
                    }
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm font-bold text-[hsl(var(--nav-theme-light))] flex-shrink-0">
                        {entry.sequence}
                      </span>
                      <div className="min-w-0">
                        <span className="font-semibold block truncate">
                          <LinkedTitle
                            linkData={
                              moduleLinkMap[`familyUpdates::entries::${index}`]
                            }
                            locale={locale}
                          >
                            {entry.title}
                          </LinkedTitle>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {entry.date}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${updatesExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {updatesExpanded === index && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground mb-3">
                        {entry.summary}
                      </p>
                      <ul className="space-y-2">
                        {entry.items.map((item: string, ii: number) => (
                          <li
                            key={ii}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/89537559330901"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
