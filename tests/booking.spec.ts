import { expect, test, type Page } from "@playwright/test";

async function startBooking(page: Page, packageName: RegExp) {
  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "Book a detail" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: packageName }).click();
  await dialog.getByRole("button", { name: "Continue" }).click();
  return dialog;
}

async function pickFirstDayAndTime(page: Page) {
  const dialog = page.getByRole("dialog");
  await dialog.locator('button[data-date][aria-disabled="false"]').first().click();
  await dialog.getByRole("button", { name: "Continue" }).click();
  await dialog.getByRole("radio").first().click();
  await dialog.getByRole("button", { name: "Continue" }).click();
}

async function fillDetails(page: Page) {
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Full name").fill("Test Customer");
  await dialog.getByLabel("Email").fill("test.customer@example.com");
  await dialog.getByLabel("Mobile").fill("(312) 555-0101");
  await dialog.getByLabel("Vehicle make and model").fill("Mazda MX-5");
}

test.describe("booking", () => {
  test("falls back to demo availability with a visible banner when Cal.com is not configured", async ({ page }) => {
    // Requires the server to run without CALCOM_API_KEY (the default).
    const dialog = await startBooking(page, /Signature Detail/);
    await expect(dialog.getByText("Demo availability.")).toBeVisible();
  });

  test("each date's slots are fetched once, however often you switch between them", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (r) => r.url().includes("/api/availability?") && r.url().includes("date=") && requests.push(r.url()));
    const dialog = await startBooking(page, /Signature Detail/);
    const days = dialog.locator('button[data-date][aria-disabled="false"]');
    for (const i of [0, 1, 0, 1, 0]) {
      await days.nth(i).click();
      await page.waitForTimeout(250);
    }
    expect(new Set(requests).size).toBe(2);
    expect(requests).toHaveLength(2);
  });

  test("an invalid email shows an inline error below the field", async ({ page }) => {
    await startBooking(page, /Interior Reset/);
    await pickFirstDayAndTime(page);
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Email").fill("not-an-email");
    await dialog.getByRole("button", { name: "Continue" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Enter an email address" })).toBeVisible();
  });

  test("a half-filled booking survives a hard refresh", async ({ page }) => {
    await startBooking(page, /Interior Reset/);
    await pickFirstDayAndTime(page);
    await page.getByRole("dialog").getByLabel("Full name").fill("Marisol Vega");
    await page.waitForTimeout(500); // draft writes are debounced
    await page.reload();
    await page.getByRole("banner").getByRole("link", { name: "Book a detail" }).click();
    await expect(page.getByRole("dialog").getByLabel("Full name")).toHaveValue("Marisol Vega");
  });

  // Opt in with E2E_STRIPE=1 when the server has a Stripe test key: this talks
  // to Stripe's hosted Checkout over the network.
  test("happy path: package to paid deposit with the Stripe test card", async ({ page }) => {
    test.skip(!process.env.E2E_STRIPE, "set E2E_STRIPE=1 to run against Stripe test mode");
    await startBooking(page, /Signature Detail/);
    await pickFirstDayAndTime(page);
    await fillDetails(page);
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Continue" }).click();
    await expect(dialog.getByText("Stripe test mode.")).toBeVisible();
    await dialog.getByRole("button", { name: /Pay \$75 deposit/ }).click();

    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 });
    await page.getByText("Payment method").waitFor();
    await page.locator('[data-testid="card-accordion-item-button"], input[value="card"]').first().click({ force: true });
    await page.locator("#cardNumber").fill("4242 4242 4242 4242");
    await page.locator("#cardExpiry").fill("12 / 34");
    await page.locator("#cardCvc").fill("123");
    await page.locator("#billingName").fill("Test Customer");
    if (await page.locator("#billingPostalCode").isVisible()) await page.locator("#billingPostalCode").fill("60612");
    await page.locator(".SubmitButton").click();

    await page.waitForURL(/booking\/confirmation/, { timeout: 60_000 });
    await expect(page.getByText("Your drop-off is confirmed.")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/^LQ-[A-Z0-9]{6}$/)).toBeVisible();
  });
});
