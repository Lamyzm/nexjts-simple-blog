import { expect, test } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Next.js FSD Template/);
});

test("homepage has get started button", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Get Started" })).toBeVisible();
});
