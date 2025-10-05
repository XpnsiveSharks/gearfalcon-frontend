export default function TrustedCorporations() {
  const clients = [
    { name: "BPI", subtitle: "Banking Solutions" },
    { name: "PLDT", subtitle: "Telecommunications" },
    { name: "Robinsons", subtitle: "Retail Centers" },
    { name: "Social Security System", subtitle: "Government Services" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Trusted by Major Corporations
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Serving Metro Manila, Cavite, Laguna, and Rizal since 2005
          </p>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {clients.map((client, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
                {client.name}
              </h3>
              <p className="text-xs md:text-sm text-slate-500">{client.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-4">
            Our Mission
          </h3>
          <p className="text-slate-700 text-center text-sm md:text-base max-w-4xl mx-auto mb-6 leading-relaxed">
            "We are a growing team of experts passionately dedicated to identify our client's needs and provide
            the best solution in air conditioning, electrical, fire protection, data cabling & control."
          </p>
          <div className="text-center">
            <span className="inline-block bg-yellow-400 text-slate-900 font-bold text-xs md:text-sm px-6 py-3 rounded-lg">
              CUSTOMER SATISFACTION IS OUR #1 GOAL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}