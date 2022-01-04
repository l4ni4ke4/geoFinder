const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
                 .build();


// This doesnt work for some reason idk why, fucking shitscript
const logins = {
    email: process.env.FIREBASE_TEST_EMAIL,
    pass: process.env.FIREBASE_TEST_PASS
};


async function createLobbyTest() {
  driver.manage()
        .setTimeouts({
        'pageLoad': 10000,
        'script': 60000,
        'implicit': 5000
        });
  try {
    await driver.get('https://geofinder-9a266.web.app/');     //go to geofinder login page

    await driver.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys("kek@kek.com");  //enter email
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("kekkek");        //enter password
    await driver.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button
    //await driver.wait(until.urlContains('Home'), 1000 * 5);     //wait for home page

    await driver.findElement(By.xpath("//div[@class='play-box-multiplayer-left']")).click();   //Click MP button
    //await driver.wait(until.elementLocated(By.xpath("//button['Create new Lobby']")));
    await driver.findElement(By.xpath("//button['Create new Lobby']")).click();   //Click Create new lobby
    await driver.findElement(By.xpath("//p['Multiplayer Lobby']"));    //This text shows up when the lobby is created
    console.log("CREATELOBBY SUCCESS");
  } 
  finally {
    await driver.quit();
  }
};


createLobbyTest()