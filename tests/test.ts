import { expect, test } from '@playwright/test';

test('index page has expected content', async ({ page }) => {
	await page.goto('/');
	// Verify the main heading or text present in the new design
	await expect(page.getByText('Δημιουργία - επίλυση σιτηρεσίων')).toBeVisible();
	await expect(page.getByText('για φοιτητές και ιδιώτες!')).toBeVisible();
});
