import React from 'react';
import { TeacherOnboardingGuide } from '../onboarding/TeacherOnboardingGuide';

// Re-export TeacherOnboardingGuide as Onboarding for backwards compatibility
export const Onboarding = ({ forceOpen = true }: { forceOpen?: boolean }) => {
  return <TeacherOnboardingGuide forceOpen={forceOpen} />;
};

export default Onboarding;
