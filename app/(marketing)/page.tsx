import Footer from '@/app/(marketing)/_components/Footer';
import Heading from '@/app/(marketing)/_components/heading';
import Heroes from '@/app/(marketing)/_components/heroes';

export default function MarketingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center md:justify-start">
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  );
}
