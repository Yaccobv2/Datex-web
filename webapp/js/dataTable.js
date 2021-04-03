var ipFromBrowser;
var savedConfigData="/webapp/data/config.json";
var joystickData="/webapp/data/joy.json";
var rpyData="/webapp/data/rpy.json";
var tphData="/webapp/data/tph.json";

var sampleTime;
var sampleQuantity;
var ip;
var port;
var timer;
var key;



var indexJSON=JSON.parse("{\"temp\":0, \"press\":0, \"humi\":0, \"roll\":0, " +
    "\"pitch\":0, \"yaw\":0, \"x\":0, \"y\":0, \"z\":0}");





$(document).ready(function(){

    ipFromBrowser=self.location.hostname
    console.log(ipFromBrowser);
    getConfigDataFromServer();


});



/**
 * @brief Download config data from server and starts updateConfigValues function.
 */
function getConfigDataFromServer() {
    $.ajax(savedConfigData, {
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        cache: false,
        success: function(responseJSON, status, xhr) {
            updateConfigValues(responseJSON);
        },
        error: function (ajaxContext) {
            console.log("Error while getting data from server");
        },

    }).done(function(html){
    updateTableConfig()
    startTimer();
});

}



/**
 * @brief Update config values with data downloaded from server
 * @param responseJSON: data structure that keeps information about configuration
 */
function updateConfigValues(responseJSON){
    ip=responseJSON.ip;
    port=responseJSON.port;
    sampleTime=responseJSON.sampleTime;
    sampleQuantity=responseJSON.sampleQuantity;

    joystickData="http://"+ip+"/webapp/data/joy.json";
    rpyData="http://"+ip+"/webapp/data/rpy.json";
    tphData="http://"+ip+"/webapp/data/tph.json";

    document.getElementById("sampletime").innerHTML=responseJSON.sampleTime*1000;

    console.log("Config values updated");
}


/**
 * @brief Update key to identify data to plot
  */
function updateKey(){
    key=document.getElementById("tableKey").value;
}

/**
 * @brief Update table content to plot and calls function to start timer
 */
function updateTableConfig(){
   updateKey();
   createTable();
}

/**
 * @brief Start timer that downloads data
 */
function startTimer(){
    timer=setInterval(chooseDataToGet, sampleTime*1000);
}

/**
 * @brief Gets chosen data from server
 * @param dataURL: URL of json file to download
 * @param key: information what data was downloaded
 */
function getDataRequest(dataURL,key){

    $.ajax(dataURL, {
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        cache: false,
        async : true,
        success: function(responseJSON, status, xhr) {
            updateTable(responseJSON,key)

        },
        error: function (ajaxContext) {
            console.log("Error while getting data from server");
        },

    });


}

/**
 * @brief Choose data to get from server, calls getDataRequest function
 * and updateTable function
 */
function chooseDataToGet(){

       switch(key) {

        case "all":
            getDataRequest(joystickData,"joy");
            getDataRequest(rpyData,"rpy");
            getDataRequest(tphData,"tph");
            break;

        case "tph":
            getDataRequest(tphData,key);
            break;

        case "rpy":
            getDataRequest(rpyData,key);
            break;

        case "joy":
            getDataRequest(joystickData,key);
            break;

        default:
            console.log("error: No data to get chosen")

    }

}

/**
 * @brief Updates data in table
 * @param data: new downloaded json data
 * @param local_key: key used to choose which data update
 */
function updateTable(data,local_key){

    var table=document.getElementById("table");

    switch(local_key){

        case "tph":
            table.rows[indexJSON.temp].cells[1].innerHTML = data.temp;
            table.rows[indexJSON.press].cells[1].innerHTML = data.press;
            table.rows[indexJSON.humi].cells[1].innerHTML = data.humi;
            break;

        case "rpy":
            table.rows[indexJSON.roll].cells[1].innerHTML = data.roll;
            table.rows[indexJSON.pitch].cells[1].innerHTML = data.pitch;
            table.rows[indexJSON.yaw].cells[1].innerHTML = data.yaw;

            break;

        case "joy":
            table.rows[indexJSON.x].cells[1].innerHTML = data.x;
            table.rows[indexJSON.y].cells[1].innerHTML = data.y;
            table.rows[indexJSON.z].cells[1].innerHTML = data.z;

            break;

        default:
            console.log("error: No data to update chosen")
    }

}

/**
 * @brief Generates table
 */
function createTable(joyJSON,rpyJSON,tphJSON){

    var data = [];

    data.push(["Name", "Value", "Unit"]);

    switch(key){
        case "all":
            data.push(["Temperature", "---", 'C']);		indexJSON.temp=1;
            data.push(["Pressure", "---", 'mbar']);		indexJSON.press=2;
            data.push(["Humidity", "---", '%']); 		indexJSON.humi=3;
            data.push(["Roll", "---", 'degrees']);		indexJSON.roll=4;
            data.push(["Pitch", "---", 'degrees']);		indexJSON.pitch=5;
            data.push(["Yaw", "---", 'degrees']);		indexJSON.yaw=6;
            data.push(["Joystick X", "---", '[-]']);	indexJSON.x=7;
            data.push(["Joystick Y", "---", '[-]']);	indexJSON.y=8;
            data.push(["Joystick Z", "---", '[-]']);	indexJSON.z=9;
            break;

        case "tph":
            data.push(["Temperature", "---", 'C']);		indexJSON.temp=1;
            data.push(["Pressure", "---", 'mbar']);		indexJSON.press=2;
            data.push(["Humidity", "---", '%']); 		indexJSON.humi=3;
            break;

        case "rpy":
            data.push(["Roll", "---", 'degrees']);		indexJSON.roll=1;
            data.push(["Pitch", "---", 'degrees']);		indexJSON.pitch=2;
            data.push(["Yaw", "---", 'degrees']);		indexJSON.yaw=3;
            break;

        case "joy":
            data.push(["Joystick X", "---", '[-]']);	indexJSON.x=1;
            data.push(["Joystick Y", "---", '[-]']);	indexJSON.y=2;
            data.push(["Joystick Z", "---", '[-]']);	indexJSON.z=3;
            break;

        default:
            console.log("error: No data to create table chosen")
    }

    //Create table element and format it
    var table = document.createElement('table');
    table.style.width = '100%';
    table.setAttribute('border', '1');
    table.id="table";
    table.style.fontSize="20px";


    var columnsNumber = data[0].length;

    //Add the header row.
    //Insert row at the end of the current table
    var row = table.insertRow(-1);

    for (var i = 0; i < columnsNumber; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = data[0][i];
        row.appendChild(headerCell);
    }

    //Add the data rows.
    for (var i = 1; i < data.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < columnsNumber; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = data[i][j];
        }
    }

    //Set table in html file
    var container = document.getElementById('TableDiv');
    container.innerHTML = "";
    container.appendChild(table);

}









