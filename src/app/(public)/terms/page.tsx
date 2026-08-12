export default function TermsPage() {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to FreightConnect. These Terms and Conditions govern your use of our digital freight brokerage platform and services. By accessing or using our platform, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Services Provided</h2>
            <p>
              FreightConnect acts as an intermediary connecting product owners (Shippers) with verified truck owners (Carriers). We facilitate the booking, tracking, and payment of freight transportation services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Obligations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Shippers:</strong> Must provide accurate information regarding freight weight, dimensions, pickup/drop-off locations, and hazardous materials if any.</li>
              <li><strong>Carriers:</strong> Must maintain valid licenses, insurance, and operate vehicles in compliance with all national and state regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payments and Margins</h2>
            <p>
              Our brokerage operates on a transparent margin model. Shippers agree to pay the quoted amount, and Carriers agree to the offered amount. The difference constitutes our brokerage fee. All payments must be processed through our secure platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Liability and Insurance</h2>
            <p>
              While FreightConnect verifies carriers, we are not liable for direct damage to goods during transit. Carriers are required to hold sufficient cargo insurance to cover potential losses. Shippers are encouraged to purchase additional insurance for high-value goods.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
