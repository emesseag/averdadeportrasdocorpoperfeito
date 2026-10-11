/** Ícones Lucide para trechos de HTML criados pelo navegador (Astro cuida do restante). */
import trash from 'lucide-static/icons/trash-2.svg?raw';
import check from 'lucide-static/icons/check.svg?raw';
import heart from 'lucide-static/icons/heart.svg?raw';
import sparkles from 'lucide-static/icons/sparkles.svg?raw';

function render(raw: string, size: number): string {
  const inner = raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg[^>]*>/, '')
    .replace('</svg>', '');
  return `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
}

export const icons = {
  trash: (size = 18) => render(trash, size),
  check: (size = 16) => render(check, size),
  heart: (size = 18) => render(heart, size),
  sparkles: (size = 18) => render(sparkles, size),
};
