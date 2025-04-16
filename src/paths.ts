export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    assistant: '/dashboard/assistant',
    settings: '/dashboard/settings',
    tickets: '/dashboard/tickets',
    automation: '/dashboard/emailing',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
