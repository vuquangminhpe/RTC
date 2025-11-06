export interface HistoricalEvent {
  id: string;
  year: number;
  title: string;
  subtitle: string;
  description: string;
  detailedContent: {
    meaning: string;
    lessons?: string;
    impact?: string;
  };
  image: string;
  buttonText: string;
  position: 'left' | 'right';
  color: string;
}

export interface TimelinePosition {
  progress: number;
  visible: boolean;
}
