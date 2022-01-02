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
    email: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    pass: process.env.REACT_APP_FIREBASE_PROJECT_ID
};


async function createLobby() {

  try {
    await driver.get('http://localhost:3000/');     //go to geofinder login page

    await driver.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys();  //enter random email used to register
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys(randomPass);        //enter random password used to register
    await driver.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button
    await driver.wait(until.urlContains('Home'), 1000 * 5);     //wait for home page

    await driver.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys("kek@kek.com");  //enter email
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("kekkek");        //enter password
    await driver.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button
    await driver.wait(until.urlContains('Home'), 1000 * 5);     //wait for home page
    await driver.findElement(By.xpath("//img[@class='mp-image image']")).click();   //Click MP button
    await driver.findElement(By.xpath("//button[@class='btn btn-success']")).click();   //Create new lobby
    await driver.findElement(By.xpath("//h1['Multiplayer Lobby']"));    //This text shows up when the lobby is created

  } 
  finally {
    await driver.quit();
  }
};


createLobby()