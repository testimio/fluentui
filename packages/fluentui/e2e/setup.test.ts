import puppeteer from 'puppeteer';

import { safeLaunchOptions } from '@uifabric/build/puppeteer/puppeteer.config';
import { E2EApi } from './e2eApi';

import * as screenplayHelpers from '@testim/screenplay/src/jest/helpers';
import { EndTestFunction } from '@testim/screenplay';

screenplayHelpers.registerJasmineReporterToGlobal();

jest.setTimeout(10000);

let browser: puppeteer.Browser;
let page: puppeteer.Page;
let endTest: EndTestFunction;
let consoleErrors: string[] = [];

const launchOptions: puppeteer.LaunchOptions = safeLaunchOptions({
  headless: true,
  dumpio: false,
  slowMo: 10,
});

beforeAll(async () => {
  browser = await puppeteer.launch(launchOptions);
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

  global['e2e'] = new E2EApi(page);
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
