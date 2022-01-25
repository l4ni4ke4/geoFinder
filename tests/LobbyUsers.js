import webdriver from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import chromedriver from 'chromedriver';
import { Builder, By, Key, until } from 'selenium-webdriver';
import {getUsersInGivenLobby} from '../src/firebase.js';

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var host = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
var user1 = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
var user2 = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

/**
 * Tests if users can connect to a lobby logically (in aspect to Firebase)
 */
async function LobbyUsersTest() {
    //Set time-outs for each driver
    host.manage()
        .setTimeouts({
            'pageLoad': 10000,
            'script': 60000,
            'implicit': 10000
        });
    user1.manage()
        .setTimeouts({
            'pageLoad': 10000,
            'script': 60000,
            'implicit': 10000
        });
    user2.manage()
        .setTimeouts({
            'pageLoad': 10000,
            'script': 60000,
            'implicit': 10000
        });
    try {
        await host.get('https://geofinder-9a266.web.app/');     //go to geofinder login page

        await host.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys("host-test@test.com");  //enter host email
        await host.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("123456");        //enter password
        await host.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button
        //await driver.wait(until.urlContains('Home'), 1000 * 5);     //wait for home page

        await host.wait(until.elementLocated(By.xpath("//div[@class='play-box-multiplayer']")), 5 * 1000);
        await host.findElement(By.xpath("//div[@class='play-box-multiplayer']")).click();   //Click MP button

        await host.wait(until.elementLocated(By.xpath("//button[text()='Create new Lobby']")), 5 * 1000);
        await host.findElement(By.xpath("//button[text()='Create new Lobby']")).click();   //Click Create new lobby

        await host.findElement(By.xpath("//p[text()='Multiplayer Lobby']"));  //this text should appear only in a lobby
        var lobbyCodeString = await host.findElement(By.xpath("//h2[text()='Lobby Code: ']")).getText();   //get the lobby code
        console.log(lobbyCodeString);
        var lobbyCode = lobbyCodeString.split(": ")[1];

        await user1.get('https://geofinder-9a266.web.app/');
        await user1.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys("usera-test@test.com");  //enter userA email
        await user1.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("123456");        //enter password
        await user1.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button

        await user1.wait(until.elementLocated(By.xpath("//div[@class='play-box-multiplayer']")), 5 * 1000);
        await user1.findElement(By.xpath("//div[@class='play-box-multiplayer']")).click();   //Click MP button
        await user1.findElement(By.xpath("//input[@id='lobbyLinkTextBox']")).click();   //Click on the textbox
        await user1.findElement(By.xpath("//input[@id='lobbyLinkTextBox']")).sendKeys(lobbyCode);   //and then enter the lobby code
        await user1.wait(until.elementIsEnabled(By.xpath("//button[text()='Join an existing Lobby']")), 1000);  //Wait for button to be enabled
        await user1.findElement(By.xpath("//button[text()='Join an existing Lobby']")).click(); //Click on join

        await user2.get('https://geofinder-9a266.web.app/');
        await user2.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys("userb-test@test.com");  //enter userB email
        await user2.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("123456");        //enter password
        await user2.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button

        await user2.wait(until.elementLocated(By.xpath("//div[@class='play-box-multiplayer']")), 5 * 1000);
        await user2.findElement(By.xpath("//div[@class='play-box-multiplayer']")).click();   //Click MP button
        await user2.findElement(By.xpath("//input[@id='lobbyLinkTextBox']")).click();   //Click on the textbox
        await user2.findElement(By.xpath("//input[@id='lobbyLinkTextBox']")).sendKeys(lobbyCode);   //and then enter the lobby code
        await user2.wait(until.elementIsEnabled(By.xpath("//button[text()='Join an existing Lobby']")), 1000);  //Wait for button to be enabled
        await user2.findElement(By.xpath("//button[text()='Join an existing Lobby']")).click(); //Click on join
        var userList = await getUsersInGivenLobby(lobbyCode);
        if(userList.includes("HOST-TEST") && userList.includes("USERA-TEST") && userList.includes("USERB-TEST")){
            console.log("LOBBYUSERSTEST SUCCESS");
        }
        else{
            console.log("LOBBYUSERSTEST FAILED");
            console.log(userList);
        }
    }
    finally {
        await host.quit();
        await user1.quit();
        await user2.quit();
    }
};


LobbyUsersTest()