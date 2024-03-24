/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Nodes = require('nodes');
var Sights = require('sightseeing');

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

var nodeData;
Nodes.fetchData(
  function(data) {
    nodeData = data;
    console.log("Node Data Fetched");
  },
  function(error) {
    console.log("Error!");
  }
);

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      title: "Active Items",
      items: []
    }]
  });
  //menu._numPreloadItems = 5;
  var activeItems = 0;
  for (var i = 0; i < nodeData.length; i++) {
    item = nodeData[i];
    
    console.log(item.name);
    if (Util.isLogActive(item, null)) {
      var sectionItem = {
        title: item.name,
        subtitle: item.location,
        //icon: item.image, // Simply doesn't unload images that aren't seen so this destroys RAM
      };
      menu.item(0, activeItems, sectionItem);
      activeItems++;
    }
  }
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    backgroundColor: 'black'
  });
  var radial = new UI.Radial({
    size: new Vector2(140, 140),
    angle: 0,
    angle2: 300,
    radius: 20,
    backgroundColor: 'cyan',
    borderColor: 'celeste',
    borderWidth: 1,
  });
  var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-24-bold',
    text: 'Dynamic\nWindow',
    textAlign: 'center'
  });
  var windSize = wind.size();
  // Center the radial in the window
  var radialPos = radial.position()
      .addSelf(windSize)
      .subSelf(radial.size())
      .multiplyScalar(0.5);
  radial.position(radialPos);
  // Center the textfield in the window
  var textfieldPos = textfield.position()
      .addSelf(windSize)
      .subSelf(textfield.size())
      .multiplyScalar(0.5);
  textfield.position(textfieldPos);
  wind.add(radial);
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
