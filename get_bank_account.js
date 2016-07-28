(function(){

  'use strict';

  // var origFn = browser.driver.controlFlow().execute;

  // browser.driver.controlFlow().execute = function() {
  //   var args = arguments;

  //   // queue 100ms wait
  //   origFn.call(browser.driver.controlFlow(), function() {
  //     return protractor.promise.delayed(100);
  //   });

  //   return origFn.apply(browser.driver.controlFlow(), args);
  // };

  describe('Obteniendo balance del banco.', bankAccountBalanceDescription);

  function bankAccountBalanceDescription(){

    var PAGE_SELECTORS = {
      RUT: 'd_rut',
      PASSWORD: 'd_pin', //OBTENER HASH DESDE OTRO ARCHIVO
      LOGIN_BTN_ID: 'botonenvio',
      LAST_MOVES_BTN_ID: 'UMN',
      CHECKING_ACCOUNT_BTN_ID: 'UMA',
      MOVEMENTS_IFRAME_ID: 'p4',
      TABLE_HEADER_SELECTOR: '.hdr:nth-of-type(1)',
      BALANCE_VALUE_SELECTOR: '.td_n:nth-of-type(5)',
      INCOME_VALUE_SELECTOR: '.td_n:nth-of-type(3)',
      MOVEMENT_DESCRIPTION_SELECTOR: '.td_t'

    };

    var buttonRut,
        buttonPass,
        buttonSend,
        buttonLastMoves,
        buttonCheckingAccount,
        buttonAccount,
        balanceTableHeader,
        balanceContainer,
        incomeContainer,
        descriptionContainer;
    
    it('Saldo diario', spec1);

    function spec1(){
      
      browser.driver.get('http://www.santander.cl');

      buttonRut = browser.driver.findElement(by.id(PAGE_SELECTORS.RUT));
      buttonRut.sendKeys(process.env['RUT']);

      buttonPass = browser.driver.findElement(by.id(PAGE_SELECTORS.PASSWORD));
      buttonPass.sendKeys(process.env['PASSWORD']);

      buttonSend = browser.driver.findElement(by.id(PAGE_SELECTORS.LOGIN_BTN_ID));
      buttonSend.click();
      browser.driver.sleep(3000);
      
      browser.driver.switchTo().frame(1);

      buttonLastMoves = browser.driver.findElement(by.id(PAGE_SELECTORS.LAST_MOVES_BTN_ID));
      buttonLastMoves.click();
      browser.driver.sleep(2000);
      
      buttonCheckingAccount = browser.driver.findElement(by.id(PAGE_SELECTORS.CHECKING_ACCOUNT_BTN_ID));
      buttonCheckingAccount.click();
      browser.driver.sleep(3000);
      
      browser.driver.switchTo().frame(browser.driver.findElement(by.id(PAGE_SELECTORS.MOVEMENTS_IFRAME_ID)));
      
      balanceTableHeader = browser.driver.findElement(by.css(PAGE_SELECTORS.TABLE_HEADER_SELECTOR));
      balanceContainer = browser.driver.findElement(by.css(PAGE_SELECTORS.BALANCE_VALUE_SELECTOR)); //saldo en la primera fila  
      balanceTableHeader.getText().then(getAccountHeader);
    }

    function getAccountHeader(textHeader){
      console.log("\x1b[31m", textHeader);
      balanceContainer.getText().then(getBalanceContent);
    }
    
    function getBalanceContent(balanceText){
      console.log("\x1b[32m", "Saldo diario: $" + balanceText);
      //checkear si hay un abono
      incomeContainer = browser.driver.findElement(by.css(PAGE_SELECTORS.INCOME_VALUE_SELECTOR));
      incomeContainer.getText().then(getIncomeContent);
    }

    function getIncomeContent(incomeText){
      if(!(/^$/).test(incomeText)){
        descriptionContainer = browser.driver.findElement(by.css(PAGE_SELECTORS.MOVEMENT_DESCRIPTION_SELECTOR));
        descriptionContainer.getText().then(getDescriptionContent.bind(null,incomeText));
      }
    }

    function getDescriptionContent(incomeText, descriptionText){
      console.log("\x1b[33m", "Recibiste un abono por $" + incomeText + "con la siguiente descripción: " + descriptionText);
    }

  }

})();