import { articles } from './contents';
import { categoryById, contentCategories } from './categories';

export interface SearchItem {
  group: string;
  title: string;
  text: string;
  href: string;
}

/** Itens estáticos do índice de busca (conteúdos e recursos). Posts e desafios entram no navegador. */
export const staticSearchItems: SearchItem[] = [
  ...articles.map((a) => ({
    group: 'Conteúdos',
    title: a.title,
    text: `${categoryById(a.category)?.label ?? ''} ${a.masculine ? 'Espaço masculino' : ''} ${a.summary}`.trim(),
    href: `/conteudos/${a.slug}`,
  })),
  ...contentCategories.map((c) => ({
    group: 'Recursos',
    title: c.label,
    text: c.description,
    href: `/recursos#${c.id}`,
  })),
];
