export interface Mood {
  id: string;
  label: string;
}

export const moods: Mood[] = [
  { id: 'feliz', label: 'Feliz' },
  { id: 'animado', label: 'Animado' },
  { id: 'tranquilo', label: 'Tranquilo' },
  { id: 'cansado', label: 'Cansado' },
  { id: 'ansioso', label: 'Ansioso' },
  { id: 'triste', label: 'Triste' },
  { id: 'motivado', label: 'Motivado' },
  { id: 'outro', label: 'Outro' },
];
