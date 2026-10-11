export interface Reminder {
  id: string;
  label: string;
  when: string;
}

/** Lembretes gentis que a pessoa pode ativar. Os ativos aparecem em "Meu dia". */
export const reminders: Reminder[] = [
  { id: 'humor', label: 'Registrar como estou me sentindo', when: 'Manhã' },
  { id: 'agua', label: 'Beber um copo de água', when: 'Ao longo do dia' },
  { id: 'pausa', label: 'Fazer uma pausa e respirar fundo', when: 'Tarde' },
  { id: 'redes', label: 'Dar um intervalo das redes sociais', when: 'Tarde' },
  { id: 'gratidao', label: 'Anotar uma gratidão do dia', when: 'Noite' },
  { id: 'dormir', label: 'Me preparar para dormir com calma', when: 'Noite' },
];
