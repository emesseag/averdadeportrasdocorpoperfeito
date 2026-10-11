/** Cria uma conta de teste e a sessão no navegador do Playwright (sem passar pela tela de cadastro). */
export const QA_USER = { id: 'qa-user', name: 'Pessoa Teste', email: 'qa@example.com', username: 'pessoa.teste', bio: 'Conta usada nos testes.', createdAt: 1, salt: 'x', passwordHash: 'x' };

export async function seedSession(ctx) {
  await ctx.addInitScript((user) => {
    if (location.pathname.startsWith('/login')) return;
    if (!localStorage.getItem('avtcp:users')) localStorage.setItem('avtcp:users', JSON.stringify([user]));
    if (!localStorage.getItem('avtcp:session')) localStorage.setItem('avtcp:session', JSON.stringify({ userId: user.id }));
  }, QA_USER);
}
