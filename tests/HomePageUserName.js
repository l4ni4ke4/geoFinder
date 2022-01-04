const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
                 .build();

/**
*Tests if username appears after logging in
*/
async function testHomePageUserName() {
  driver.manage()
        .setTimeouts({
        'pageLoad': 10000,
        'script': 60000,
        'implicit': 5000
        });

  try {
    await driver.get('https://geofinder-9a266.web.app/');     //go to geofinder login page

    await driver.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys("kek@kek.com");  //enter email and pass to login
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("kekkek");        
    await driver.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button

    await driver.findElement(By.xpath("//p['kek']"));   //The username is kek so it should apper on dropdown menu
    console.log("TESTHOMEPAGEUSERNAME SUCCESS");
  } 
  finally {
    await driver.quit();
  }
};


testHomePageUserName()