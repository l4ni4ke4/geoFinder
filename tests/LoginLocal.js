const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
                 .build();


async function testLocal() {
  //6 chars random name
  var randomName = Math.random().toString(36).substr(2, 6);
  //8 chars random password
  var randomPass = Math.random().toString(36).substr(2, 8);
  driver.manage()
        .setTimeouts({
        'pageLoad': 10000,
        'script': 60000,
        'implicit': 5000
        });
  try {
    await driver.get('https://geofinder-9a266.web.app/');     //go to geofinder login page
    
    await driver.findElement(By.xpath("//a[@href='/register']")).click();   //go to register page
    //await driver.wait(until.urlContains('register'), 1000 * 5);     //wait until register page comes up
    await driver.findElement(By.xpath("//input[@placeholder='Full Name']")).sendKeys(randomName);   //enter random name
    await driver.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys(randomName + "@random.com");  //enter random email
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys(randomPass);  //enter random password
    await driver.findElement(By.xpath("//button[@class='register__btn']")).click();     //Click on register button
    
    //await driver.wait(until.urlContains('Home'), 1000 * 5);     //Wait until registeration completed and be redirected to home page
    await driver.findElement(By.xpath("//p[@class='dropdown-toggle']")).click();   //To Logout
    await driver.findElement(By.xpath("//a[@href='/']")).click();   //Now Logout

    await driver.wait(until.urlIs('https://geofinder-9a266.web.app/'), 1000 * 5)  //Wait until login page
    await driver.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys(randomName + "@random.com");  //enter random email used to register
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys(randomPass);        //enter random password used to register
    await driver.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button
    //await driver.wait(until.urlContains('Home'), 1000 * 5);     //wait for home page
    console.log("TESTLOCAL SUCCESS");
  } 
  finally {
    await driver.quit();
  }
};


testLocal()