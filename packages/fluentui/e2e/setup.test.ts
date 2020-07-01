// import puppeteer from 'puppeteer';
import playwright from 'playwright';

import { safeLaunchOptions } from '@uifabric/build/puppeteer/puppeteer.config';
import { E2EApi } from './e2eApi';

import * as screenplayHelpers from '@testim/screenplay/src/jest/helpers';
import { EndTestFunction } from '@testim/screenplay';

screenplayHelpers.registerJasmineReporterToGlobal();

jest.setTimeout(10000);

let browser: playwright.Browser;
let page: playwright.Page;
let endTest: EndTestFunction;
let consoleErrors: string[] = [];

const launchOptions: playwright.LaunchOptions = safeLaunchOptions({
  headless: true,
  dumpio: false,
  slowMo: 10,
});

beforeAll(async () => {
  browser = await playwright.chromium.launch(launchOptions);
});

beforeEach(async () => {
  const originalPage = await browser.newPage();

  // setup console errors detection
  consoleErrors = [];
  originalPage.on('console', message => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  ({ page, endTest } = await screenplayHelpers.forBeforeEachGivenPage(originalPage));

  // page.viewport = page.viewportSize();
  // make like in puppeteer
  page.constructor.prototype.viewport = page.constructor.prototype.viewportSize;
  page.constructor.prototype.setViewport = page.constructor.prototype.setViewportSize;

  global['e2e'] = new E2EApi(page as any);
});

afterEach(async () => {
  await screenplayHelpers.forAfterEachEndTest(endTest);
  await page.close();
  expect(consoleErrors).toEqual([]);

  global['e2e'] = null;
});

afterAll(async () => {
  await browser.close();
});
