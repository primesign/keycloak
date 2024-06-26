import { expect, test } from "@playwright/test";
import { login } from "./login";

test.describe("Applications test", () => {
  test.beforeEach(async ({ page }) => {
    // Sign out all devices before each test
    await login(page, "admin", "admin", "master");
    await page.getByTestId("accountSecurity").click();
    await page.getByTestId("account-security/device-activity").click();

    await page
      .getByRole("button", { name: "Sign out all devices", exact: true })
      .click();
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(
      page.getByRole("heading", { name: "Sign in to your account" }),
    ).toBeVisible();
  });

  test("Single application", async ({ page }) => {
    await login(page, "admin", "admin", "master");

    await page.getByTestId("applications").click();

    await expect(page.getByTestId("applications-list-item")).toHaveCount(1);
    await expect(page.getByTestId("applications-list-item")).toContainText(
      process.env.CI ? "Account Console" : "security-admin-console-v2",
    );
  });

  test("Single application twice", async ({ browser }) => {
    const context1 = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
    });
    const context2 = await browser.newContext();
    try {
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();

      await login(page1, "admin", "admin", "master");
      await login(page2, "admin", "admin", "master");

      await page1.getByTestId("applications").click();

      await expect(page1.getByTestId("applications-list-item")).toHaveCount(1);
      await expect(
        page1.getByTestId("applications-list-item").nth(0),
      ).toContainText(
        process.env.CI ? "Account Console" : "security-admin-console-v2",
      );
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test("Two applications", async ({ page }) => {
    test.skip(
      !process.env.CI,
      "Skip this test if not running with regular Keycloak",
    );

    await login(page, "admin", "admin", "master");

    // go to admin console
    await page.goto("/");
    await expect(page).toHaveURL("http://localhost:8080/admin/master/console/");
    await page.waitForURL("http://localhost:8080/admin/master/console/");

    await page.goto("/realms/master/account");
    await page.waitForURL("http://localhost:8080/realms/master/account/");

    await page.getByTestId("applications").click();

    await expect(page.getByTestId("applications-list-item")).toHaveCount(2);
    await expect(
      page
        .getByTestId("applications-list-item")
        .filter({ hasText: "Account Console" }),
    ).toBeVisible();
    await expect(
      page
        .getByTestId("applications-list-item")
        .filter({ hasText: "security-admin-console" }),
    ).toBeVisible();
  });
});
