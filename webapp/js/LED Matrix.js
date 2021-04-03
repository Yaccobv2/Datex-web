var ipFromBrowser;
var savedConfigData="/webapp/data/config.json";
var url = '/webapp/setled.php';
var ip;
var port;

var r=0;
var g=0;
var b=0;






/**
 * @brief Gets data about hostname, starts func that gets config
 * data from server while document is loaded
 */
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

    });

}



/**
 * @brief Update config values with data downloaded from server
 * @param responseJSON: data structure that keeps information about configuration
 */
function updateConfigValues(responseJSON){
    ip=responseJSON.ip;
    port=responseJSON.port;
    console.log("Config values updated");
}


/**
 * @brief Gets value from sliders
 * @param key: information which slider was moved
 */
function getSliderValue(key){
    switch(key) {

        case "r":
        {
          r=$("#rSlider").val();
            break;
        }
        case "g":
        {
            g=$("#gSlider").val();
            break;
        }
        case "b":
        {
            b=$("#bSlider").val();
            break;
        }
        default: {}
    }
   let color=createColor();
    updateDivsBackground(color);


}

/**
 * @brief Creates string to set color from rgb
 * @return created rgb string to set color
 */
function createColor(){
    if(r===undefined) r=0;
    if(g===undefined) g=0;
    if(b===undefined) b=0;
    return "rgb(" + r + ", " + g + ", " + b + ")"
}

/**
 * @brief Updates color of div that shows chosen color
 * @param color: string that contains color as rgb
 */
function updateDivsBackground(color){
    console.log(color);
    document.getElementById("ColorDiv").style.backgroundColor=color;

}

/**
 * @brief Updates background color of clicked button in matrix
 * @param id: information which button in matrix was clicked
 */
function updateBtn(id){
    let color= document.getElementById("ColorDiv").style.backgroundColor;
    console.log(color);
    let btnId="btn"+id;
    document.getElementById(btnId).style.backgroundColor=color;
}

/**
 * @brief  onclick func to reset matrix
 */
function resetLED(){
    let clearMssg=clearMatrix();
    updateMatrix(clearMssg);
}

/**
 * @brief  creates clearing matrix data to send to server
 * @return created clearing matrix data to send to server
 */
function clearMatrix(){
    let clearMssg="";
    for(let x=0;x<=7;x++)
    {
        for(let y=0;y<=7;y++)
        {
            let btnId="btn"+x+"_"+y;
            console.log(btnId);
            document.getElementById(btnId).style.backgroundColor='white';
            clearMssg = clearMssg + 'LED'+x+y+'=['+x+','+y+',0,0,0]&&';

        }

    }
    clearMssg=clearMssg.substring(0, clearMssg.length - 2);
    return clearMssg
}

/**
 * @brief  onclick func to send matrix
 */
function sendLED(){
    let sendMssg=sendMatrix();
    updateMatrix(sendMssg);
}

/**
 * @brief  creates matrix data to send to server by getting background
 * colors of buttons in matrix
 * @return created matrix data to send to server
 */
function sendMatrix(){
let sendMssg="";
for(let x=0;x<=7;x++)
{
    for(let y=0;y<=7;y++)
    {
        let btnId="btn"+x+"_"+y;
        let button=  window.getComputedStyle(document.getElementById(btnId), null);
        let color = button.backgroundColor;
        color=color.substring(4, color.length - 1);
        sendMssg = sendMssg + 'LED'+x+y+'=['+x+','+y+','+color+']&&';

    }

}
sendMssg=sendMssg.substring(0, sendMssg.length - 2);
return sendMssg
}

/**
 * @brief  send message to server with jqery ajax
 */
function updateMatrix(TextToSend) {


    console.log("Updating Config..."+url);

    $.ajax(url, {
        type: "POST",
        data: TextToSend,
        dataType: "text",
        crossDomain: true,

        beforeSend: function (x) {
            console.log("AJAX POST REQUEST: initialization");
        },
        success: function (result) {
            console.log("AJAX POST REQUEST SUCCESFULL: " + result);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("AJAX POST REQUEST: FAILURE");
            console.log("STATUS: " + textStatus);
            console.log("ERROR: " + errorThrown);
        },
        cache: false

    });
}






