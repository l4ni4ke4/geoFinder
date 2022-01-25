const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
                 .build();

/**
 * Tests if local account registeration and login works or not
 */
async function testLogout() {
  driver.manage()
        .setTimeouts({
        'pageLoad': 10000,
        'script': 60000,
        'implicit': 5000
        });
  try {
    await driver.get('https://geofinder-9a266.web.app/');     //go to geofinder login page

    await driver.wait(until.urlIs('https://geofinder-9a266.web.app/'), 1000 * 5)  //Wait until login page
    await driver.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys("host-test@test.com");  //enter random email used to register
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("123456");        //enter random password used to register
    await driver.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button
    await driver.wait(until.urlContains('Home'), 1000 * 5);     //wait for home page    

    await driver.findElement(By.xpath("//p[@class='dropdown-toggle']")).click();   //To Logout
    await driver.findElement(By.xpath("//a[@href='/']")).click();   //Now Logout
    var h1 = await driver.findElement(By.xpath("//h1")).getText();   //get header 1 text
    if(h1 == 'Welcome to Geofinder!')
        console.log("LOGOUT SUCCESS");
        else console.log("LOGOUT FAILED");
  } 
  finally {
    await driver.quit();
  }
};


testLogout()