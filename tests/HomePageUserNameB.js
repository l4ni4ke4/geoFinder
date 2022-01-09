const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
                 .build();

/**
*Tests if username appears right after registeration
*/
async function testHomePageUserName() {
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
    await driver.findElement(By.xpath("//input[@placeholder='Nickname']")).sendKeys(randomName);   //enter random name
    await driver.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys(randomName + "@random.com");  //enter random email
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys(randomPass);  //enter random password
    await driver.findElement(By.xpath("//button[@class='register__btn']")).click();     //Click on register button

    var userName = await driver.findElement(By.xpath("//p[text()='" + randomName + "']"));   //The username is randomName so it should apper on dropdown menu
    if(await userName.getText() == randomName)
        console.log("TESTHOMEPAGEUSERNAME SUCCESS");
    else{
        console.log("TESTHOMEPAGEUSERNAME FAILED");
        console.log(await userName.getText());
    }
  } 
  finally {
    await driver.quit();
  }
};


testHomePageUserName()