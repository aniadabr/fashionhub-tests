import { test as base } from '@playwright/test'

export const test = base.extend<{ consoleErrors: string[] }>({
    consoleErrors: async ({ page }, use) => {
        const errors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') errors.push(msg.text());
        });
        page.on('pageerror', (err) => errors.push(`Uncaught exception: ${err.message}`));
        await use(errors);
    },
});

export { expect } from '@playwright/test'