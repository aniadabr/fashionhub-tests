import { requireEnv } from '../src/config/environment';
import { LoginPage } from '../src/pages/login.page';
import { AccountPage } from '../src/pages/account.page';
import { expect, test } from '@playwright/test';

test('user is able to login correctly', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);

  await loginPage.goto();
  await loginPage.login(
    requireEnv('FASHIONHUB_USERNAME'),
    requireEnv('FASHIONHUB_PASSWORD'),
  );
  await expect(accountPage.welcomeMessage).toBeVisible();
  await expect(page).toHaveURL(/account\.html/);
});

test('user is not able to login with incorrect credentials', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);

  await loginPage.goto();
  await loginPage.login('wrong', 'wrong');
  await expect(accountPage.welcomeMessage).not.toBeVisible();
  await expect(loginPage.errorMessage).toBeVisible();
});
