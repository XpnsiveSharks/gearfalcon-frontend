export default function EmergencyService() {
  return (
    <section className="py-16 bg-red-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Clock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          24/7 Emergency Service
        </h2>

        {/* Description */}
        <p className="text-white text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          HVAC emergencies don't wait. Neither do we. Available 24/7 for urgent repairs with
          same-day service capability throughout Metro Manila and nearby provinces.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-white text-red-600 font-bold px-8 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Get Emergency Service
          </button>

          <a
            href="tel:+639397176257"
            className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-red-600 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >            <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call Now: (0939) 717-6257
          </a>
        </div>
      </div>
    </section>
  );
}