var Nodes = module.exports;

var ajax = require("ajax");
var Settings = require("settings");

var currentFetchedNodeHash = Settings.option("lastNodeHash");
var parsedData;

Nodes.fetchData = function(success, failure) {
    console.log(currentFetchedNodeHash);
    parsedData = Settings.option("parsedNodes");
    if (parsedData == null) {
        parsedData = [];
        currentFetchedNodeHash = null;
    }

    ajax(
        { url: "https://api.github.com/repos/9001-Solutions/ffxivclock-data/commits/master", headers: { 'Accept': 'application/vnd.github.VERSION.sha' }, type: "text" },
        function (data) {
            console.log(data);
            if (currentFetchedNodeHash == null || data != currentFetchedNodeHash) {
                currentFetchedNodeHash = data;
                Settings.option("lastNodeHash", data);

                ajax(
                    { url: "https://github.com/9001-Solutions/ffxivclock-data/raw/master/items.json", type: "json" },
                    function (itemJson) {
                        ajax(
                            { url: "https://github.com/9001-Solutions/ffxivclock-data/raw/master/nodes.json", type: "json" },
                            function (nodeJson) {
                                for(var i = 0; i < nodeJson.nodes.length; i++) {
                                    var node = nodeJson.nodes[i];
                                    for(var j = 0; j < node.itemIds.length; j++) {
                                        var item;
                                        for(var l = 0; l < itemJson.items.length; l++) {
                                            if (itemJson.items[l].id == node.itemIds[j]) {
                                                item = itemJson.items[l];
                                            }
                                        }
                                        console.log(item.name);
                                        var startSplit = node.startTime.split(':');
                                        var startTime = parseInt(startSplit[0]) + parseInt(startSplit[1]) / 60;
                                        var endSplit = node.endTime.split(':');
                                        var endTime = parseInt(endSplit[0]) + parseInt(endSplit[1]) / 60;
                                        parsedData.push(new Util.TimedEvent(item.name, node.zone, item.description, "https://www.ffxivclock.com/items/" + item.imageUrl, startTime, endTime, [], []));
                                    }
                                }

                                success(parsedData);
                            },
                            function(data, status, req) {
                                failure(data, status, req);
                            }
                        );
                    },
                    function(data, status, req) {
                        failure(data, status, req);
                    }
                );
            }
        },
        function(data, status, req) {
            failure(data, status, req);
        }
    );
}