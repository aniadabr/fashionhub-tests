import { test, expect } from '@playwright/test';
import { createCsv, PrRecord } from '../src/utils/csv';
import fs from 'fs';

interface GitHubPr {
  title: string;
  created_at: string;
  user: { login: string };
}

test('open PRs are exported to the csv file', async ({ request }) => {
  let pageSize = 100;
  const allPrs: PrRecord[] = [];
  let pageNumber = 1;
  const token = process.env.GITHUB_TOKEN;
  while (pageSize === 100) {
    const response = await request.get(
      `https://api.github.com/repos/appwrite/appwrite/pulls?state=open&per_page=100&page=${pageNumber}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    expect(response.status()).toBe(200);
    const prs: GitHubPr[] = await response.json();

    const prsPerPage = prs.map((pr) => ({
      title: pr.title,
      createdAt: pr.created_at,
      author: pr.user.login,
    }));

    allPrs.push(...prsPerPage);

    pageSize = prs.length;
    pageNumber++;
  }
  expect(allPrs.length).toBeGreaterThan(0);
  for (const pr of allPrs) {
    expect
      .soft(pr.title, `PR without title: ${JSON.stringify(pr)}`)
      .toBeTruthy();
    expect.soft(pr.createdAt).toBeTruthy();
    expect.soft(pr.author).toBeTruthy();
  }

  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/open-prs.csv', createCsv(allPrs));
});
