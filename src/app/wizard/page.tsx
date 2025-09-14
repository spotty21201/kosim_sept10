"use client";

import { WizardLayout } from "@/components/wizard/WizardLayout";
import { WizardStep } from "@/components/wizard/WizardStep";
import { LandRulesForm } from "@/components/wizard/LandRulesForm";
import { RoomMixForm } from "@/components/wizard/RoomMixForm";
import { CostsOperationsForm } from "@/components/wizard/CostsOperationsForm";
import { ResultsSummary } from "@/components/wizard/ResultsSummary";
import { useWizardStore } from "@/lib/store/wizard";
import { useRouter } from "next/navigation";

export default function WizardPage() {
  const { currentStep, setCurrentStep } = useWizardStore();
  const totalSteps = 4;
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const projectId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
      router.push(`/sim/${projectId}/summary`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={handleBack}
      isLastStep={currentStep === totalSteps}
      isFirstStep={currentStep === 1}
    >
      <WizardStep
        title="Land & Rules"
        description="Enter your site details and building regulations"
        isActive={currentStep === 1}
        stepNumber={1}
        totalSteps={totalSteps}
      >
        <LandRulesForm />
      </WizardStep>

      <WizardStep
        title="Rooms & Mix"
        description="Define your room types and their distribution"
        isActive={currentStep === 2}
        stepNumber={2}
        totalSteps={totalSteps}
      >
        <RoomMixForm />
      </WizardStep>

      <WizardStep
        title="Costs & Operations"
        description="Set up your financial parameters"
        isActive={currentStep === 3}
        stepNumber={3}
        totalSteps={totalSteps}
      >
        <CostsOperationsForm />
      </WizardStep>

      <WizardStep
        title="Results"
        description="Review your project metrics"
        isActive={currentStep === 4}
        stepNumber={4}
        totalSteps={totalSteps}
      >
        <ResultsSummary />
      </WizardStep>
    </WizardLayout>
  );
}
