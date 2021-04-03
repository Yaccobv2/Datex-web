var ipFromBrowser;
var savedConfigData="/webapp/data/config.json";
var joyDataUrl="/webapp/data/joy.json";




var joyData;


var sampleTime;
var sampleQuantity;
var ip;
var port;
var timer;

var joyDIV;
var joyyData;


var xData;
var lastTimeStamp;







$(document).ready(function(){

    ipFromBrowser=self.location.hostname
    console.log(ipFromBrowser);
    joyDIV = document.getElementById('joyChart');
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
        createChart()
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

    joyData="http://"+ip+"/webapp/data/joy.json";

    document.getElementById("sampletime").innerHTML=sampleTime*1000;


    console.log("Config values updated");
}




/**
 * @brief Start timer that downloads data
 */
function startTimer(){
    timer=setInterval(getData, sampleTime*1000);
}

/**
 * @brief Gets chosen data from server
 * @param dataURL: URL of json file to download
 * @param key: information what data was downloaded
 */
function getDataRequest(dataURL){

    $.ajax(dataURL, {
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        cache: false,
        async : true,
        success: function(responseJSON, status, xhr) {
            joyData=responseJSON

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
function getData(){
    getDataRequest(joyDataUrl);
    updateChart();

}

/**
 * @brief Updates data in chart
 * @param
 */
function updateChart(){

    Plotly.update(joyDIV, {"x": [[joyData.x]],"y": [[joyData.y]],"z": [[joyData.z]]});

}


/**
 * @brief Generates table
 */
function createChart(){

    xData = [...Array(sampleQuantity).keys()];

    xData.forEach(function (value,index){value=(value*sampleTime).toFixed(2);},xData)

    lastTimeStamp = xData[xData.length-1];

    let trace = {x:[0],y:[0],z:[0],
        mode:'markers',
        marker: {
            color: 'rgb(17, 17, 17)',
            size: 10,
            symbol: 'circle',
            line: {
                color: 'rgb(204, 204, 204)',
                width: 2},
            opacity: 0.8},
        type: 'scatter3d'};


    joyyData=[trace];

    var layout = {margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        }};
    Plotly.newPlot(joyDIV, joyyData,layout,{responsive: true},{staticPlot: true});
}









