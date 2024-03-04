const puppeteer = require('puppeteer');

console.log('Secrets?', process.env.SECRETS);

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Navigate to the login
  const signIn = await page.goto('https://actionnetwork.org/users/sign_in');
  console.log('Sign in Status:', signIn.headers().status);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Type into login box
  await page.type('#ipt-login', process.env.EMAIL);

  // Type into password box
  await page.type('#iptpassword', process.env.PASSWORD);

  // Click submit and wait too login
  const submitButtonSelector = '[name="commit"]';
  await page.waitForSelector(submitButtonSelector);
  const [submit] = await Promise.all([
    page.waitForNavigation(),
    page.click(submitButtonSelector)
  ]);
  console.log('Submit Status:', submit.headers().status);

  // Go to the subscriptions
  const subs = await page.goto('https://actionnetwork.org/subscriptions');
  console.log('Subs Status:', subs.headers().status);

  // find subs and unsub
  const unsubButtonSelector = '.subscription_list_button';
  const elUnsubs = await page.$$(unsubButtonSelector);
  console.log('Found unsub buttons:', elUnsubs.length);
  await page.waitForSelector(unsubButtonSelector);
  await page.click(unsubButtonSelector);

  const confirmSelector = 'form[action^="/unsubscribe"] input[name="commit"]';
  const elConfirms = await page.$$(confirmSelector);
  console.log('Found confirm form buttons:', elConfirms.length);
  const confirmFormButtonSelector = 'form[action^="/unsubscribe"] input[type="submit"]';
  await page.waitForSelector(confirmFormButtonSelector);
  await page.click(confirmFormButtonSelector);
  // TODO: test with more than one

  await browser.close();
})();
