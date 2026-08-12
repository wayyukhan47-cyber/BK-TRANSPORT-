import Link from "next/link";
import { Truck } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">FreightConnect</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/#about" className="hover:text-blue-600 transition-colors">About Us</Link>
          <Link href="/#services" className="hover:text-blue-600 transition-colors">Services</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/admin/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Admin Login
          </Link>
          <Link href="/contact" className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2">
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
