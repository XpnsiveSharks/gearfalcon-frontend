export default function Footer() {
  // SVG Icon Components
  const PhoneIcon = () => (
    <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const MailIcon = () => (
    <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const MapPinIcon = () => (
    <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="13" cy="12" r="10" strokeWidth={2}></circle>
      <polyline points="12,6 12,12 16,14" strokeWidth={2}></polyline>
    </svg>
  );

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Info Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {/* Logo placeholder - left blank as requested */}
              <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400">GEARFALCON</h3>
                <p className="text-sm text-gray-300">Electro-Mechanical Services</p>
                <p className="text-xs text-yellow-400">Since 2005</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Professional HVAC, electrical, and fire safety solutions for residential and commercial properties across Metro Manila and nearby provinces.
            </p>
            
            <div className="bg-slate-800 border border-yellow-400/20 rounded-lg p-4">
              <p className="text-yellow-400 font-semibold text-sm">
                "CUSTOMER SATISFACTION IS OUR #1 GOAL"
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <PhoneIcon />
                <span className="text-gray-300 text-sm">(0939) 717-6257</span>
              </div>
              
              <div className="flex items-center gap-3">
                <MailIcon />
                <span className="text-gray-300 text-sm">makakapaliberty@yahoo.com</span>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPinIcon />
                <div className="text-gray-300 text-sm">
                  <p>262 St. Peter St. cor Sta. Monica</p>
                  <p>Brgy. Holy Spirit, QC</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">Business Information</h4>
            
            <div className="mb-6">
              <h5 className="text-yellow-400 font-medium text-sm mb-2">Service Areas</h5>
              <div className="text-gray-300 text-sm space-y-1">
                <p>Metro Manila</p>
                <p>Cavite</p>
                <p>Laguna</p>
                <p>Rizal</p>
              </div>
            </div>

            <div>
              <h5 className="text-yellow-400 font-medium text-sm mb-2">Business Hours</h5>
              <div className="text-gray-300 text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <ClockIcon />
                  <span>Mon-Fri: 8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon />
                  <span>Sat: 8:00 AM - 4:00 PM</span>
                </div>
                <div className="text-yellow-400 font-medium">
                  <span>Emergency: 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 GEARFALCON Electro-Mechanical Services. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Quick Access</span>
              <div className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold">
                19+ Years of Excellence • Since 2005
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}