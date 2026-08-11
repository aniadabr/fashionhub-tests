export interface AppPage {
  name: string;
  path: string;
  waitForUrl?: string;
}

export const PAGES: AppPage[] = [
  { name: 'home', path: './' },
  {
    name: 'account (redirects to login)',
    path: 'account.html',
    waitForUrl: '**/login.html',
  },
  { name: 'clothing', path: 'products.html' },
  { name: 'shopping bag', path: 'cart.html' },
  { name: 'login', path: 'login.html' },
];
