const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
                 .build();

async function testGoogle() {
  try {
    await driver.get('http://localhost:3000/');     //go to geofinder login page
    await driver.wait(until.urlIs('http://localhost:3000/'), 1000 * 5)  //Wait until login page
    ///var mainHandle = await driver.getWindowHandle();
    await driver.findElement(By.xpath("//button[@class='btn-login google-login']")).click();     //Click on register with google button
    var handles = await driver.getAllWindowHandles()
    
    await driver.wait(until.urlContains('accounts'), 1000 * 10);
    await driver.findElement(By.xpath("//input[@name='identifier']")).sendKeys("");  //Enter gmail
    await driver.findElement(By.xpath("//input[@name='password']")).sendKeys("");  //Enter pass
    await driver.switchTo().defaultContent();
    await driver.wait(until.urlContains('Home'), 1000 * 10);     //wait for home page
  } 
  finally {
    await driver.quit();
  }
};

testGoogle()