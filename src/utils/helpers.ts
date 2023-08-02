type TimeSlot = {
  startTime: string;
  endTime: string;
};

export const validateTimeSlots = (timeSlots: TimeSlot[]) => {
  if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
    return "Time slots are missing.";
  }

  for (let i = 0; i < timeSlots.length - 1; i++) {
    const currentSlot = timeSlots[i];
    const nextSlot = timeSlots[i + 1];

    const currentEndTime = currentSlot.endTime;
    const nextStartTime = nextSlot.startTime;

    if (currentEndTime >= nextStartTime) {
      return `Start time ${nextStartTime} should be greater than previous end time ${currentEndTime}.`;
    }

    if (i > 0) {
      const prevSlot = timeSlots[i - 1];
      const prevEndTime = prevSlot.endTime;

      if (currentSlot.startTime != prevEndTime) {
        return `There cannot be a gap between previous end time ${prevEndTime} and next start time ${currentSlot.startTime}.`;
      }

      if (currentSlot.startTime <= prevEndTime) {
        return `Start time ${currentSlot.startTime} should be greater than previous end time ${prevEndTime}.`;
      }
    }
  }

  return null;
};
