import { Page } from '@playwright/test';

export async function getLinks(page: Page) {
  const hrefs = await page
    .locator('a[href]')
    .evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')));
  return hrefs;
}

export function normalizeLinks(
  hrefs: (string | null)[],
  pageUrl: string,
): string[] {
  const finalUrls: string[] = [];

  for (const href of hrefs) {
    if (!href) continue;
    if (href.startsWith('#')) continue;
    if (href.startsWith('mailto:')) continue;
    if (href.startsWith('tel:')) continue;
    if (href.startsWith('javascript:')) continue;

    finalUrls.push(new URL(href, pageUrl).toString());
  }

  return [...new Set(finalUrls)];
}
