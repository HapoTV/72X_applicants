import React from "react";
import { useNavigate } from "react-router-dom";
import PricingComparisonTable from "./components/PricingComparisonTable";
import PricingFeatureHighlights from "./components/PricingFeatureHighlights";
import PricingFooter from "./components/PricingFooter";
import PricingHeader from "./components/PricingHeader";
import PricingPlansSection from "./components/PricingPlansSection";

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const upgradesDisabled = true;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <PricingHeader navigate={navigate} />

      <main className="min-h-screen bg-white py-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600">Start free and upgrade as you grow</p>
          </div>

          <PricingPlansSection upgradesDisabled={upgradesDisabled} />
        </div>

        <PricingFeatureHighlights />
        <PricingComparisonTable />
      </main>

      <PricingFooter navigate={navigate} />
    </div>
  );
};

export default Pricing;
