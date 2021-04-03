var ipFromBrowser;
var savedConfigData="/webapp/data/config.json";
var rpyDataUrl="/webapp/data/rpy.json";
var tphDataUrl="/webapp/data/tph.json";



var rpyData;
var tphData;

var sampleTime;
var sampleQuantity;
var ip;
var port;
var timer;



var tChart;
var pChart;
var hChart;
var rChart;
var piChart;
var yChart;

var tyData;
var pyData;
var hyData;
var ryData;
var piyData;
var yyData;

var xData;

var lastTimeStamp;







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
        createCharts()
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

    rpyData="http://"+ip+"/webapp/data/rpy.json";
    tphData="http://"+ip+"/webapp/data/tph.json";

    document.getElementById("sampletime").innerHTML=sampleTime*1000;
    document.getElementById("sampleQuantity").innerHTML=sampleQuantity;

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
function getDataRequest(dataURL,key){

    $.ajax(dataURL, {
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        cache: false,
        async : true,
        success: function(responseJSON, status, xhr) {
            if(key==="tph"){tphData=responseJSON;}
            else {rpyData=responseJSON;}

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
    getDataRequest(rpyDataUrl,"rpy");
    getDataRequest(tphDataUrl,"tph");
    updateChart();

}

/**
 * @brief Updates data in table
 * @param
 */
function updateChart(){

    if(tyData.length >= sampleQuantity)
    {
        xData.splice(0,1);

        tyData.splice(0,1);
        pyData.splice(0,1);
        hyData.splice(0,1);
        ryData.splice(0,1);
        piyData.splice(0,1);
        yyData.splice(0,1);

        lastTimeStamp += sampleTime;

        xData.push(lastTimeStamp.toFixed(2));
    }

    tyData.push(tphData.temp);
    pyData.push(tphData.press);
    hyData.push(tphData.humi);
    ryData.push(rpyData.roll);
    piyData.push(rpyData.pitch);
    yyData.push(rpyData.yaw);

    tChart.data.datasets[0].data =tyData ;
    pChart.data.datasets[0].data =pyData ;
    hChart.data.datasets[0].data =hyData ;
    rChart.data.datasets[0].data =ryData ;
    piChart.data.datasets[0].data =piyData ;
    yChart.data.datasets[0].data =yyData ;

    tChart.update();
    pChart.update();
    hChart.update();
    rChart.update();
    piChart.update();
    yChart.update();



}

function newChart(name,xData,yData,xlabel,ylabel,ymin,ymax,context){
    chart = new Chart(context, {
        // The type of chart: linear plot
        type: 'line',

        // Dataset: 'xdata' as labels, 'ydata' as dataset.data
        data: {
            labels: xData,
            datasets: [{
                fill: false,
                label: name,
                backgroundColor: 'rgb(0, 0, 255)',
                borderColor: 'rgb(0, 0, 255)',
                data: yData,
                lineTension: 0
            }]
        },
        // Configuration options
        options: {
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: ylabel
                    },
                    ticks: {
                        suggestedMin: ymin,
                        suggestedMax: ymax
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: xlabel
                    }
                }]
            }
        }
    });

    return chart
}
/**
 * @brief Generates table
 */
function createCharts(){

    xData = [...Array(sampleQuantity).keys()];

    xData.forEach(function (value,index){value=(value*sampleTime).toFixed(2);},xData)

    lastTimeStamp = xData[xData.length-1];

    tyData = [];
    pyData = [];
    hyData = [];
    ryData = [];
    piyData = [];
    yyData = [];


    tContext = $("#tChart")[0].getContext('2d');
    pContext = $("#pChart")[0].getContext('2d');
    hContext = $("#hChart")[0].getContext('2d');
    rContext = $("#rChart")[0].getContext('2d');
    piContext = $("#piChart")[0].getContext('2d');
    yContext = $("#yChart")[0].getContext('2d');



    tChart= newChart("Temperature Chart",xData,tyData,"[s]","[°C]",-30,105,tContext)
    pChart=newChart("Pressure Chart",xData,pyData,"[s]","[mbar]",260,1260,pContext)
    hChart=newChart("Humidity Chart",xData,hyData,"[s]","[%]",0,100,hContext)
    rChart=newChart("Roll Chart",xData,ryData,"[s]","[degree]",-180,180,rContext)
    piChart=newChart("Pitch Chart",xData,piyData,"[s]","[degree]",-180,180,piContext)
    yChart=newChart("Yaw Chart",xData,yyData,"[s]","[degree]",-180,180,yContext)


}









