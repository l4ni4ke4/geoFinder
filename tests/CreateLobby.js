const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
                 .build();


// This doesnt work for some reason idk why
const logins = {
    email: process.env.FIREBASE_TEST_EMAIL,
    pass: process.env.FIREBASE_TEST_PASS
};

/**
 * Tests if a multiplayer lobby is created successfully or not
 */
async function createLobbyTest() {
  driver.manage()
        .setTimeouts({
        'pageLoad': 10000,
        'script': 60000,
        'implicit': 10000
        });
  try {
    await driver.get('https://geofinder-9a266.web.app/');     //go to geofinder login page

    await driver.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys("kek@kek.com");  //enter email
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("kekkek");        //enter password
    await driver.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button
    //await driver.wait(until.urlContains('Home'), 1000 * 5);     //wait for home page

    await driver.wait(until.elementLocated(By.xpath("//div[@class='play-box-multiplayer']")), 5 * 1000);
    
    await driver.findElement(By.xpath("//div[@class='play-box-multiplayer']")).click();   //Click MP button

    await driver.wait(until.elementLocated(By.xpath("//button[text()='Create new Lobby']")), 5 * 1000);
    await driver.findElement(By.xpath("//button[text()='Create new Lobby']")).click();   //Click Create new lobby

    //await driver.findElement(By.xpath("//div[@class='game-lobby-header']"));
    var text = await driver.findElement(By.xpath("//p[text()='Multiplayer Lobby']"));  //this text should appear only in a lobby
    if(await text.getText() == 'Multiplayer Lobby')
        console.log("TESTCREATELOBBY SUCCESS");
    else{
        console.log("TESTCREATELOBBY FAILED");
        console.log(await text.getText());
    }

  } 
  finally {
    await driver.quit();
  }
};


createLobbyTest()