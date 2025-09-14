import { ReactNode } from 'react';

interface WizardLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

export function WizardLayout({
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isLastStep,
  isFirstStep,
}: WizardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6 pb-16">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <main className="flex w-full flex-1 flex-col overflow-hidden px-4 sm:px-6">
        {/* Content */}
        <div className="flex-1 py-8">
          {children}
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
          <div className="container flex items-center justify-between">
            <button
              onClick={onBack}
              disabled={isFirstStep}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back
            </button>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
            <button
              onClick={onNext}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
