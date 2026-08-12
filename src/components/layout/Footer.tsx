import Link from "next/link";
import { Truck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Truck className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl tracking-tight">FreightConnect</span>
          </Link>
          <p className="text-sm text-gray-400">
            Connecting product owners directly with verified truck owners across the nation for seamless long-haul transport.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link href="/#about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link href="/#services" className="hover:text-blue-400 transition-colors">Services</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@freightconnect.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: Mumbai, Maharashtra, India</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} FreightConnect Brokerage. All rights reserved.
      </div>
    </footer>
  );
}
