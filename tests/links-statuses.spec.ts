import { test, expect } from '@playwright/test';
import { getLinks, normalizeLinks } from '../src/utils/links';

test('all links on the home page return successful status codes', async ({
  page,
  request,
}) => {
  await page.goto('./');
  const fetchedHrefs = await getLinks(page);
  const links = normalizeLinks(fetchedHrefs, page.url());
  expect(links.length).toBeGreaterThan(0);

  for (const url of links) {
    const response = await request.get(url);
    expect
      .soft(response.status(), `${url} responded with ${response.status()}`)
      .toBeLessThan(400);
  }
});
