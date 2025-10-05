export default function ServiceCoverageAreas() {
  const areas = [
    { name: "Metro Manila", description: "Primary coverage area" },
    { name: "Cavite", description: "Extended service area" },
    { name: "Laguna", description: "Extended service area" },
    { name: "Rizal", description: "Extended service area" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Service Coverage Areas
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Professional HVAC services across the region
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-8 text-center hover:shadow-md hover:border-blue-300 transition-all"
            >
              {/* Location Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Area Name */}
              <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-2">
                {area.name}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm text-slate-500">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}