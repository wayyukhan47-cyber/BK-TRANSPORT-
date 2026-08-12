import Link from "next/link";
import { ArrowRight, ShieldCheck, MapPin, Truck, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519003722811-989206e5e50f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Seamless Long-Haul <span className="text-blue-400">Freight Matching</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              We connect product owners directly with verified truck owners. 
              Transparent pricing, instant booking, and reliable transport across the nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30">
                Book a Truck <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-white/10 backdrop-blur border border-white/20 px-8 py-4 text-base font-semibold text-white hover:bg-white/20 transition-all">
                Join as Truck Owner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us & How It Works */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">How FreightConnect Works</h2>
            <p className="text-lg text-gray-600">
              Our business model eliminates middlemen to provide better rates for shippers and higher earnings for carriers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200" />
            
            <div className="relative text-center z-10">
              <div className="mx-auto w-24 h-24 bg-blue-50 border-4 border-white shadow-lg rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Post Your Load</h3>
              <p className="text-gray-600">Shippers provide pickup, drop-off locations, and vehicle requirements.</p>
            </div>
            
            <div className="relative text-center z-10">
              <div className="mx-auto w-24 h-24 bg-blue-50 border-4 border-white shadow-lg rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Smart Matching</h3>
              <p className="text-gray-600">We match your freight with our network of verified, reliable truck owners instantly.</p>
            </div>
            
            <div className="relative text-center z-10">
              <div className="mx-auto w-24 h-24 bg-blue-50 border-4 border-white shadow-lg rounded-full flex items-center justify-center mb-6">
                <Truck className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Safe Transport</h3>
              <p className="text-gray-600">Goods are transported securely with real-time updates and transparent margins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose FreightConnect?</h2>
              <div className="space-y-6">
                {[
                  "Direct connection between Shippers and Carriers",
                  "No hidden fees or opaque brokerage margins",
                  "Verified nationwide fleet of commercial vehicles",
                  "Dedicated 24/7 support for both parties"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-lg text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link href="/contact" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                  Learn more about our services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/10 transform translate-x-4 translate-y-4 rounded-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop" 
                alt="Truck Fleet" 
                className="relative rounded-2xl shadow-xl w-full object-cover h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Move Your Freight?</h2>
        <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg">
          Join thousands of shippers and carriers who trust FreightConnect for their daily transport needs.
        </p>
        <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-bold text-blue-600 hover:bg-gray-100 transition-all shadow-lg">
          Contact Us Today
        </Link>
      </section>
    </div>
  );
}
