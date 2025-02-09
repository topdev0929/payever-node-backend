export async function up(db: any): Promise<void> {
  const facebookEmailIds: string[] = [
    'c2ad6151-fdb3-4a74-87fa-3d4d8213a188',
    'f11294b4-712e-4767-a164-c341881e2fb5',
    '66c41809-f5fe-484c-808e-bf9e8d610a90',
    '66c41809-f5fe-484c-808e-bf9e8d610a90',
    '9ecf0c5b-c6f7-4f89-b873-23ded13e5572',
    '9cb3c7b0-401e-493b-8fa5-b8a3ebd5adcb',
    '84a17d5f-5a25-428f-9626-dd4561df20f9',
    '30adc382-dd7e-4d9f-a2ce-084b04c8cba3',
    '2c4b9d84-65ba-493d-8f9c-689c966bc2a2', // old user password reset e-mail
    '9e1913ad-13b0-4cc7-8fcd-485485446537', // autoregistered user, was used in old checkout
  ];

  for (const _id of facebookEmailIds) {
    await db._run('remove', 'email_templates', { _id });
  }

  return null;
}

export function down(): void {
  return null;
}
