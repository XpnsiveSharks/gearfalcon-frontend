export default function HowItWorks() {
  const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-1 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );

  const Step = ({
    index,
    title,
    description,
    variant = "blue",
  }: {
    index?: number;
    title: string;
    description: string;
    variant?: "blue" | "yellow" | "check";
  }) => {
    const indicator = (() => {
      if (variant === "check") {
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      }
      const color = variant === "yellow" ? "bg-yellow-400" : "bg-blue-600";
      return (
        <div className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center font-bold`}>
          {index}
        </div>
      );
    })();

    return (
      <div className="text-center">
        <div className="flex justify-center mb-3">{indicator}</div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>
    );
  };

  return (
    <section className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          title="How It Works"
          subtitle="Simple steps to get your service scheduled"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Step
            index={1}
            title="Book Online"
            description="Choose your service and schedule an appointment through our easy online booking system"
            variant="blue"
          />
          <Step
            index={2}
            title="Site Visit"
            description="Our expert technician visits your location to assess your needs and provide a detailed quote"
            variant="blue"
          />
          <Step
            title="Service Delivery"
            description="Professional service delivery with 100% satisfaction guarantee and quality assurance"
            variant="check"
          />
        </div>
      </div>
    </section>
  );
}


