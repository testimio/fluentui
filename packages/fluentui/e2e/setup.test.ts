import puppeteer from 'puppeteer';

import { safeLaunchOptions } from '@uifabric/build/puppeteer/puppeteer.config';
import { E2EApi } from './e2eApi';
import { attach, testEnd } from '@testim/screenplay';
import * as ScreenplayJestReporter from 'screenplay-jest-integration/src/ScreenplayJestReporter';

// @ts-ignore
jasmine.getEnv().addReporter({
  // @ts-ignore
  specStarted: result => (jasmine.currentTest = result),
  // @ts-ignore
  specDone: result => (jasmine.currentTest = result),
});

jest.setTimeout(10000);

let browser: puppeteer.Browser;
let page: puppeteer.Page;
let wrappedPage: puppeteer.Page;
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
  page = await browser.newPage();

  wrappedPage = attach(page as any, {
    noResultsServer: true,
    // we use full name to try and avoid collisions
    // @ts-ignore
    externalTestName: jasmine.currentTest.fullName.replace(/ /g, '_'),
    // externalTestName: fullTestNameToSlug(jasmine.currentTest.description),
    resultsDirectory: process.cwd(),
  }) as any;
  // setup console errors detection
  consoleErrors = [];
  wrappedPage.on('console', message => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  global['e2e'] = new E2EApi(wrappedPage);
});

afterEach(async () => {
  // @ts-ignore
  const testEndStatus =
    // @ts-ignore
    jasmine.currentTest.failedExpectations.length > 0
      ? ({
          success: false,
          error:
            // @ts-ignore
            jasmine.currentTest.failedExpectations[0],
        } as const)
      : ({
          success: true,
          data:
            // @ts-ignore
            jasmine.currentTest.passedExpectations,
        } as const);
  await testEnd(wrappedPage as any, testEndStatus);

  await page.close();
  expect(consoleErrors).toEqual([]);

  global['e2e'] = null;
});

afterAll(async () => {
  await browser.close();
});
