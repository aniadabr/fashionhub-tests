import { PAGES } from '../src/data/pages';
import { test, expect } from '../src/fixtures/console-errors'


for (const selectedPage of PAGES) {
test(`${selectedPage.name} page has no console errors`, async ({ page, consoleErrors}) => {
    await page.goto(selectedPage.path);
    if (selectedPage.waitForUrl) {
        await page.waitForURL(selectedPage.waitForUrl);
    }
    expect(consoleErrors, `Found console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
});
}

test('about page contains intentional error in console', async ({ page, consoleErrors}) => {
    await page.goto('about.html');
    expect(consoleErrors.some((e) => e.includes('intentional'))).toBe(true);
})