import puppeteer from 'puppeteer';

import { safeLaunchOptions } from '@uifabric/build/puppeteer/puppeteer.config';
import { E2EApi } from './e2eApi';

import * as rootCauseHelpers from '@testim/root-cause-jest/lib/helpers';
import { EndTestFunction } from '@testim/root-cause-core';

rootCauseHelpers.registerJasmineReporterToGlobal();

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

  if ('BENCHMARK_CONTROL_GROUP' in process.env && process.env.BENCHMARK_CONTROL_GROUP !== 'NO_ROOT_CAUSE') {
    ({ page, endTest } = await rootCauseHelpers.forBeforeEachGivenPage(originalPage));
  } else {
    page = originalPage;
  }

  global['e2e'] = new E2EApi(page);
});

afterEach(async () => {
  if (endTest) {
    await rootCauseHelpers.forAfterEachEndTest(endTest);
  }
  await page.close();
  expect(consoleErrors).toEqual([]);

  global['e2e'] = null;
});

afterAll(async () => {
  await browser.close();
});
