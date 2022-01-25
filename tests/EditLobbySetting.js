const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
                 .build();

/**
 * Tests if lobby setting can be changed successfully or not
 */
async function editLobbySettingsTest() {
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

        await driver.findElement(By.xpath("//input[@placeholder='E-mail Address']")).sendKeys("host-test@test.com");  //enter email
        await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("123456");        //enter password
        await driver.findElement(By.xpath("//button[@class='btn-login']")).click();     //Click login button
        //await driver.wait(until.urlContains('Home'), 1000 * 5);     //wait for home page

        await driver.wait(until.elementLocated(By.xpath("//div[@class='play-box-multiplayer']")), 5 * 1000);
        await driver.findElement(By.xpath("//div[@class='play-box-multiplayer']")).click();   //Click MP button

        await driver.wait(until.elementLocated(By.xpath("//button[text()='Create new Lobby']")), 5 * 1000);
        await driver.sleep(1000);
        await driver.findElement(By.xpath("//button[text()='Create new Lobby']")).click();   //Click Create new lobby
        await driver.sleep(1000);
        //await driver.findElement(By.xpath("//div[@class='game-lobby-header']"));
        var text = await driver.findElement(By.xpath("//p[text()='Multiplayer Lobby']"));  //this text should appear only in a lobby

        await driver.findElement(By.xpath("//button[text()='Edit Game Settings']")).click();   //Click edit settings

        await driver.wait(until.elementLocated(By.xpath("//input[@id='flexCheckZooming']")), 5 * 1000);
        await driver.findElement(By.xpath("//input[@id='flexCheckZooming']")).click();  //Zooming : On
        await driver.findElement(By.xpath("//input[@id='flexCheckMovement']")).click();  //Movement : On

        const actions = driver.actions();
        var slider_time = await driver.findElement(By.xpath("//input[@id='timeLimitRange']"))   //Get timer slider element
        var time_rect = await slider_time.getRect();
        await actions.move({
            x: Math.floor(parseInt(time_rect.x) + (parseInt(time_rect.width) * ((45 - 10) / (60 - 10)))),
            y: Math.floor(parseInt(time_rect.y) + (parseInt(time_rect.height) / 2))
        }).pause(200).click().perform();    //Set Slider to 7

        var slider_round = await driver.findElement(By.xpath("//input[@id='numberOfRoundsRange']")); //Get rounds slider element
        var round_rect = await slider_round.getRect();
        await actions.move({
            x: Math.floor(parseInt(round_rect.x) + (parseInt(round_rect.width) * ((7 - 3) / (10 - 3)))),
            y: Math.floor(parseInt(round_rect.y) + (parseInt(round_rect.height) / 2))
        }).pause(200).click().perform();    //Set Slider to 45
        
        await driver.sleep(1000);
        await driver.findElement(By.xpath("//button[text()='Save Changes']")).click(); //Click to save
        await driver.sleep(500);
        var zoom = await driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div/p[1]/span")).getText();
        var move = await driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div/p[2]/span")).getText();
        var round = await driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div/p[3]/span")).getText();
        var time = await driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div/p[4]/span")).getText();
        if (zoom == 'true' && move == 'true' && round == 7 && time == 45) {
            console.log("EDITLOBBYSETTINGS SUCCESS");
        }
        else {
            console.log("EDITLOBBYSETTINGS FAILED");
            console.log("zoom:"+zoom);
            console.log("move:"+move);
            console.log("round:"+round);
            console.log("time:"+time);
        }

    }
    finally {
        await driver.quit();
    }
};


editLobbySettingsTest()