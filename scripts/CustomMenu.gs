//GalacticPrices-0.1.1@latest-1

// Add a custom menu to the Google Sheet on open
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Create a new menu
  ui.createMenu('Galactic Prices')
    .addItem('Update Prices', 'updateGalacticPricesSheet') // Assuming this is the main function you've provided
    .addToUi();
}

