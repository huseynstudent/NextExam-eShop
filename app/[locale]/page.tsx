import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesBar from "@/components/FeaturesBar";
import Categories from "@/components/Categories";
import BestSelling from "@/components/BestSelling";
import DiscountBanner from "@/components/DiscountBanner";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main>
      <Header />
      <Hero />
      <FeaturesBar />
      <Categories />
      <BestSelling locale={locale} />
      <DiscountBanner />
    </main>
  );
}
