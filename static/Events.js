function isCheckBox(el){
    if (el.type && el.type === 'checkbox') {
        return true;
    }
    return false;
}

const semesterDropdown = document.getElementById("semester");
const departmentDropdown = document.getElementById("department");
const numberDropdown = document.getElementById("number");
const loadingCircle = document.getElementById("loader");
const finalizedTab = document.getElementById("finalHolder");
const fullWarning = document.getElementById("fullWarning");
const overlapWarning = document.getElementById("overlapWarning");
const finalTemplate = document.getElementById("keep");
btn = document.getElementsByClassName("button");
const btnF = document.getElementsByClassName("buttonF")[0];
scrollPlace = document.getElementsByClassName("flex-container filebrowse-outer");

//get checkboxes
const TBASwitch = document.getElementById("TBA-switch");
let TBASwitchChildren = TBASwitch.children;
var TBACheckBox;
for (let i = 0; i < TBASwitchChildren.length; i++){
    let checkbox = isCheckBox(TBASwitchChildren[i]);
    if (checkbox){
        TBACheckBox = TBASwitchChildren[i];
        break;
    }
}
const FULLSwitch = document.getElementById("FULL-switch");
let FULLSwitchChildren = FULLSwitch.children;
var FULLCheckBox;
for (let i = 0; i < FULLSwitchChildren.length; i++){
    let checkbox = isCheckBox(FULLSwitchChildren[i]);
    if (checkbox){
        FULLCheckBox = FULLSwitchChildren[i];
        break;
    }
}

var xml = new XMLHttpRequest();
var splitTable;
var options;
var numItems = 0;
bgColors = ["peru", "blueviolet", "blue", "purple", "magenta", "black"];

function setVisibility(element, visibility){
    element.style.visibility = visibility;
}

function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.visibility === 'hidden')
}

function isHiddenD(el) {
    var hasDisplayNone = (el.offsetHeight === 0 && el.offsetWidth === 0);
    return hasDisplayNone;
}

function removeChildren(parent){
    while (parent.childElementCount > 1) {
        parent.removeChild(parent.lastChild);
    }
};

function warn(warning){
    alert(warning);
}

function getRandColor(){
    let rand1 = Math.random() * 256;
    let rand2 = Math.random() * 256;
    let rand3 = Math.random() * 256;
    while ((rand1 < 70) && (rand2 < 70) && (rand3 < 70)){
        rand1 = Math.random() * 256;
        rand2 = Math.random() * 256;
        rand3 = Math.random() * 256;
    }
    let colorStr = "rgb(" + rand1 + ", " + rand2 + ", " + rand3 + ")";
    return colorStr;
}

var TBAshow = true;
TBACheckBox.addEventListener("change", function(e){
    if (TBACheckBox.checked){
        TBAshow = true;
        let choices = document.getElementsByClassName("inDiv");
        for(let i = 0; i < choices.length; i++){
            if(choices[i].innerHTML.includes("TBA")){
                choices[i].parentElement.style.display = "inline-block";
            }
        }
    } else {
        TBAshow = false;
        let choices = document.getElementsByClassName("inDiv");
        for(let i = 0; i < choices.length; i++){
            if(choices[i].innerHTML.includes("TBA")){
                choices[i].parentElement.style.display = "none";
            }
        }
    }
})

var FULLshow = true;
FULLCheckBox.addEventListener("change", function(e){
    if (FULLCheckBox.checked){
        FULLshow = true;
        let choices = document.getElementsByClassName("inDiv");
        for(let i = 0; i < choices.length; i++){
            if(choices[i].innerHTML.includes("FULL")){
                choices[i].parentElement.style.display = "inline-block";
            }
        }
    } else {
        FULLshow = false;
        let choices = document.getElementsByClassName("inDiv");
        for(let i = 0; i < choices.length; i++){
            if(choices[i].innerHTML.includes("FULL")){
                choices[i].parentElement.style.display = "none";
            }
        }
    }
})

semesterDropdown.addEventListener("change", function(e) {
    departmentDropdown.style.visibility = "visible";
    numIsHidden = isHidden(numberDropdown);
    console.log(numIsHidden);
    // if num dropdown is shown then they selected everythin
    if (!numIsHidden) {
        // send msg to get new shit cuz changed the semester
        var departmentOption = departmentDropdown.value //options[department.selectedIndex].text;
        var semesterOption = semesterDropdown.value

        dataSend= JSON.stringify({
            "semester":semesterOption,
            "department":departmentOption
        });

        removeChildren(numberDropdown);

        //stop options from bein selected
        optionsInSem = semesterDropdown.getElementsByTagName("option");
        for (let i = 1; i < optionsInSem.length; i++) {
            optionsInSem[i].disabled = true;
        }

        optionsInDep = departmentDropdown.getElementsByTagName("option");
        for (let i = 1; i < optionsInDep.length; i++) {
            optionsInDep[i].disabled = true;
        }
    
        setVisibility(loadingCircle, "visible");
        xml.open("POST", "/func" ,true);//"{{url_for('func.func')}}",true); 
        xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xml.send(dataSend);
    }
});

departmentDropdown.addEventListener("change", function(e) {
    numberDropdown.style.visibility = "visible";

    var departmentOption = departmentDropdown.value //options[department.selectedIndex].text;
    var semesterOption = semesterDropdown.value //options[department.selectedIndex].text;
    dataSend= JSON.stringify({
        "semester":semesterOption,
        "department":departmentOption
    });

    removeChildren(numberDropdown);

    optionsInSem = semesterDropdown.getElementsByTagName("option");
    for (let i = 1; i < optionsInSem.length; i++) {
        optionsInSem[i].disabled = true;
    }

    optionsInDep = departmentDropdown.getElementsByTagName("option");
    for (let i = 1; i < optionsInDep.length; i++) {
        optionsInDep[i].disabled = true;
    }

    setVisibility(loadingCircle, "visible");
    xml.open("POST", "/func" ,true);//"{{url_for('func.func')}}",true); 
    xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xml.send(dataSend);
});

numberDropdown.addEventListener("change", function(e) {
    //extract from given shit
    if (numberDropdown.value != "class"){
        btn[0].style.visibility = "visible";
        btnF.style.visibility = "visible";
        TBASwitch.style.visibility = "visible";
        FULLSwitch.style.visibility = "visible";
    }
});

// get classes button
btn[0].addEventListener("click", function(e) {
    requestedClass = numberDropdown.value;
    stored = document.getElementsByClassName("inDiv");
    for (let i = 0; i < stored.length; i++) {
        currentChoice = stored[i].innerHTML;
        if (currentChoice.includes(requestedClass)){
            return;
        }
    }
    for (let i = 0; i < options.length; i++) {
        if (options[i][0] == requestedClass) {
            console.log(options[i]);
            // classID, available, taken, (type), section, credits, start, end, isNight, M, T, W, TH, F, extraInfo //15 items// IF LAB: type(REC/LAB), start, end, isNight, M, T, W, TH, F //24 items//
            newDiv = document.createElement("div");
            newDiv.classList.add("display");
            //put styles onto the div
            left = parseInt(options[i][1]);
            taken = parseInt(options[i][2]);
            total = -1;
            if (!isNaN(left)) {
                total = left + taken;
            }
            M = " ", T = " ", W = " ", TH =" ", F = " ", N= "";
            if (options[i][8]){N=" Night"};
            if (options[i][9]){M="M"};
            if (options[i][10]){T="T"};
            if (options[i][11]){W="W"};
            if (options[i][12]){TH="TH"};
            if (options[i][13]){F="F"};

            ML = " ", TL = " ", WL = " ", THL =" ", FL = " ", NL= "";
            if (options[i].length > 15){
                if (options[i][18]){NL=" Night"};
                if (options[i][19]){ML="M"};
                if (options[i][20]){TL="T"};
                if (options[i][21]){WL="W"};
                if (options[i][22]){THL="TH"};
                if (options[i][23]){FL="F"};
            }

            
            // set color based on percentage
            colorString = "";
            if (total != -1){
                if (left/total < .25){
                    newDiv.style.borderColor = "red";
                    colorString = "red";
                } else if (left/total < .5) {
                    newDiv.style.borderColor = "orange";
                    colorString = "orange";
                } else if (left/total < .75){
                    newDiv.style.borderColor = "yellow";
                    colorString = "yellow";
                } else {
                    newDiv.style.borderColor = "green";
                    colorString = "green";
                }
            } else {
                newDiv.style.borderColor = "darkred";
                colorString = "darkred";
            }
            newText = document.createElement("p");
            newText.classList.add("inDiv");
            // set text
            if (total == -1){
                //starttime is TBA when it is TBA
                if (options[i].length == 15){
                    newText.innerHTML = options[i][0] + " FULL " + options[i][3] + " Section: " + options[i][4] +" "+ options[i][5] +" <br />"+options[i][6]+"-"+options[i][7]+" "+M+T+W+TH+F+N + " " + options[i][14];
                    
                } else {
                    newText.innerHTML = options[i][0] + " FULL " + options[i][3] + " Section: " + options[i][4] +" "+ options[i][5] +" <br />"+options[i][6]+"-"+options[i][7]+" "+M+T+W+TH+F+N + " " + options[i][14] + "<br />" + options[i][15] + ": " + +options[i][16]+"-"+options[i][17]+" "+ML+TL+WL+THL+FL+NL;
                    
                }
            } else {
                if (options[i].length == 15){
                    newText.innerHTML = options[i][0] + " " + taken + "/" + total + " " + options[i][3] + " Section: " + options[i][4]+" "+ options[i][5] +"<br />"+options[i][6]+"-"+options[i][7]+ " "+M+T+W+TH+F+N + " " + options[i][14];
                    
                } else {
                    newText.innerHTML = options[i][0] + " " + taken + "/" + total + " " + options[i][3] + " Section: " + options[i][4]+" "+ options[i][5] +"<br />"+options[i][6]+"-"+options[i][7]+ " "+M+T+W+TH+F+N + " " + options[i][14] + "<br />" + options[i][15] + ": " + +options[i][16]+"-"+options[i][17]+" "+ML+TL+WL+THL+FL+NL;
                   
                }
            }
            newDiv.appendChild(newText);
            scrollPlace[0].appendChild(newDiv);

//  0           1       2       3       4        5       6      7       8    9  10 11 12 13     14                         
// classID, available, taken, (type), section, credits, start, end, isNight, M, T, W, TH, F, extraInfo //15 items// IF LAB: type(REC/LAB), start, end, isNight, M, T, W, TH, F //24 items//
            //set datasets
            newDiv.dataset.classId = options[i][0];
            newDiv.dataset.color = colorString;
            if (total == -1){
                newDiv.dataset.seats = "FULL"
            } else {
                newDiv.dataset.seats = taken + "/" + total;
            }
            newDiv.dataset.section = options[i][4];
            newDiv.dataset.credits = options[i][5];
            newDiv.dataset.startTime = options[i][6];
            newDiv.dataset.endTime = options[i][7];
            newDiv.dataset.isNight = options[i][8];
            newDiv.dataset.m = options[i][9];
            newDiv.dataset.t = options[i][10];
            newDiv.dataset.w = options[i][11];
            newDiv.dataset.th = options[i][12];
            newDiv.dataset.f = options[i][13];
            newDiv.dataset.text = newText.innerHTML;
            if (options[i].length > 15){
                newDiv.dataset.startTimeL = options[i][16];
                newDiv.dataset.endTimeL = options[i][17];
                newDiv.dataset.isNightL = options[i][18];
                newDiv.dataset.mL = options[i][19];
                newDiv.dataset.tL = options[i][20];
                newDiv.dataset.wL = options[i][21];
                newDiv.dataset.thL = options[i][22];
                newDiv.dataset.fL = options[i][23];
            }








            //
            newDiv.addEventListener("click", function(e){
                if (((this.dataset.startTime).includes("T"))){
                    warn("something is TBA.");
                    return;
                }
                //FIND IF THERE IS THIS CLASS ALREADY THERE
                let displays = document.getElementsByClassName("display");
                let schedItems = document.getElementsByClassName("scheduleItem");
                let found = false;
                for (let i = schedItems.length - 1; i >= 0; i--){
                    if (schedItems[i].dataset.classId == this.dataset.classId){
                        found = true;
                        schedItems[i].remove();
                    }
                }

                if (found){
                    // toggle displays back to black
                    numItems--;
                    for (let i = 0; i < displays.length; i++){
                        if (displays[i].dataset.classId == this.dataset.classId){
                            displays[i].style.color = "white";
                        }
                    }
                } else {
                    if (numItems >= 10){
                        warn("you can only add 10 classes at once!");
                        return;
                    }
                    numItems++;
                    for (let i = 0; i < displays.length; i++){
                        if (displays[i].dataset.classId == this.dataset.classId){
                            displays[i].style.color = "darkCyan";
                        }
                    }
                    this.style.color = "cyan";
                    let randColor = getRandColor();
                    //M 534, T 666, W 798, TH 930, F 1062
                    //top: 92 + 42xtime
                    if (this.dataset.m == "true"){
                        scheduleDiv = document.createElement("div");
                        scheduleDiv.classList.add("scheduleItem");
                        scheduleDiv.dataset.section = this.dataset.section;
                        scheduleDiv.dataset.credits = this.dataset.credits;
                        scheduleDiv.dataset.classId = this.dataset.classId;
                        scheduleDiv.dataset.startTime = this.dataset.startTime;
                        scheduleDiv.dataset.endTime = this.dataset.endTime;
                        scheduleDiv.innerHTML = "<strong>" + this.dataset.classId + " <br/>" + this.dataset.startTime + "-" + this.dataset.endTime + "<br/>" + this.dataset.seats +  "</strong";
                        //styles
                        scheduleDiv.style.backgroundColor = randColor;
                        scheduleDiv.style.borderColor = this.dataset.color;
                        scheduleDiv.style.position = "absolute";
                        scheduleDiv.style.textAlign = "center";
                        scheduleDiv.style.borderRadius = "5px";
                        scheduleDiv.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
                        scheduleDiv.style.width = "130px";
                        scheduleDiv.style.left = "534px"; // LEFT WILL CHANGE DEPENDING ON DAY
                        //calculating size, startTime
                        let startTime = parseInt(this.dataset.startTime);
                        let endTime = parseInt(this.dataset.endTime);
                        if (startTime > endTime){
                            endTime += 1200;
                        }
                        let size = 0;
                        console.log(startTime + "    " + endTime);

                        let endTimeEnd2 = parseInt(this.dataset.endTime.slice(-2))/60;
                        let startTimeEnd2 = parseInt(this.dataset.startTime.slice(-2))/60;
                        let TimeDif = endTimeEnd2-startTimeEnd2;
                        if (TimeDif < 0){
                            TimeDif + 1;
                        }
                        size+= TimeDif;
                        let sizeIn100s = (endTime - (endTime % 100)) - (startTime - (startTime % 100));
                        size += (sizeIn100s)/100;

                        scheduleDiv.style.height = (size * 40.5) + "px";
                        this.dataset.size = size;
                        let isNightClass = this.dataset.isNight;
                        if ((isNightClass == "true") || (startTime - 700 < 0)){
                            console.log(isNightClass, startTime - 700);
                            startTime += 1200;
                        } 

                        if (size < 1){
                            scheduleDiv.style.fontSize = "9px";
                        } else {
                            scheduleDiv.style.fontSize = "15px";
                        }

                        let subtracted = startTime - 700;
                        let increments = Math.floor(subtracted/100);
                        if (subtracted % 100 != 0){
                            increments += ((subtracted % 100)/60);
                            if ((subtracted % 100)/60 > 1){
                                warn("assert error. subtracted/60 > 1");
                            }
                        }

                        scheduleDiv.dataset.length = increments * 100;
                        
                        // TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP
                        scheduleDiv.style.top = (92+ increments * 40.5) + "px";
                        
                        scheduleDiv.addEventListener("click", function(e){
                            numItems--;
                            let displays = document.getElementsByClassName("display");
                            let schedItems = document.getElementsByClassName("scheduleItem");
                            
                            for (let i = 0; i < displays.length; i++){
                                if (displays[i].dataset.classId == this.dataset.classId){
                                    displays[i].style.color = "white";
                                }
                            }

                            for (let i = schedItems.length - 1; i >= 0; i--){
                                if (schedItems[i].dataset.classId == this.dataset.classId){
                                    schedItems[i].remove();
                                }
                            }
                        })

                        document.getElementsByTagName("body")[0].appendChild(scheduleDiv);

                    }

                    //ML
                    if (this.dataset.mL == "true"){
                        scheduleDiv = document.createElement("div");
                        scheduleDiv.classList.add("scheduleItem");
                        scheduleDiv.dataset.section = this.dataset.section;
                        scheduleDiv.dataset.credits = this.dataset.credits;
                        scheduleDiv.dataset.classId = this.dataset.classId;
                        scheduleDiv.dataset.startTime = this.dataset.startTimeL;
                        scheduleDiv.dataset.endTime = this.dataset.endTimeL;
                        scheduleDiv.innerHTML = "<strong>" + this.dataset.classId + " <br/>" + this.dataset.startTimeL + "-" + this.dataset.endTimeL + "<br/>" + this.dataset.seats + "</strong";
                        //styles
                        scheduleDiv.style.backgroundColor = randColor;
                        scheduleDiv.style.borderColor = this.dataset.color;
                        scheduleDiv.style.position = "absolute";
                        scheduleDiv.style.textAlign = "center";
                        scheduleDiv.style.borderRadius = "5px";
                        scheduleDiv.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
                        scheduleDiv.style.width = "130px";
                        scheduleDiv.style.left = "534px"; // LEFT WILL CHANGE DEPENDING ON DAY
                        //calculating size, startTime
                        let startTime = parseInt(this.dataset.startTimeL);
                        let endTime = parseInt(this.dataset.endTimeL);
                        if (startTime > endTime){
                            endTime += 1200;
                        }

                        // calculate size
                        let size = 0;
                        console.log(startTime + "    " + endTime);

                        let endTimeEnd2 = parseInt(this.dataset.endTimeL.slice(-2))/60;
                        let startTimeEnd2 = parseInt(this.dataset.startTimeL.slice(-2))/60;
                        let TimeDif = endTimeEnd2-startTimeEnd2;
                        if (TimeDif < 0){
                            TimeDif + 1;
                        }
                        size+= TimeDif;
                        let sizeIn100s = (endTime - (endTime % 100)) - (startTime - (startTime % 100));
                        size += (sizeIn100s)/100;

                        scheduleDiv.style.height = (size * 40.5) + "px";
                        this.dataset.size = size;

                        let isNightClass = this.dataset.isNightL
                        if ((isNightClass == "true") || (startTime - 700 < 0)){
                            console.log(isNightClass, startTime - 700);
                            startTime += 1200;
                        } 

                        if (size < 1){
                            scheduleDiv.style.fontSize = "9px";
                        } else {
                            scheduleDiv.style.fontSize = "15px";
                        }

                        let subtracted = startTime - 700;
                        let increments = Math.floor(subtracted/100);
                        if (subtracted % 100 != 0){
                            increments += ((subtracted % 100)/60);
                            if ((subtracted % 100)/60 > 1){
                                warn("assert error. subtracted/60 > 1");
                            }
                        }

                        scheduleDiv.dataset.length = increments * 100;
                        
                        // TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP
                        scheduleDiv.style.top = (92+ increments * 40.5) + "px";
                        
                        scheduleDiv.addEventListener("click", function(e){
                            numItems--;
                            let displays = document.getElementsByClassName("display");
                            let schedItems = document.getElementsByClassName("scheduleItem");
                            
                            for (let i = 0; i < displays.length; i++){
                                if (displays[i].dataset.classId == this.dataset.classId){
                                    displays[i].style.color = "white";
                                }
                            }

                            for (let i = schedItems.length - 1; i >= 0; i--){
                                if (schedItems[i].dataset.classId == this.dataset.classId){
                                    schedItems[i].remove();
                                }
                            }
                        })

                        document.getElementsByTagName("body")[0].appendChild(scheduleDiv);

                    }

                    if (this.dataset.t == "true"){
                        scheduleDiv = document.createElement("div");
                        scheduleDiv.classList.add("scheduleItem");
                        scheduleDiv.dataset.section = this.dataset.section;
                        scheduleDiv.dataset.credits = this.dataset.credits;
                        scheduleDiv.dataset.classId = this.dataset.classId;
                        scheduleDiv.dataset.startTime = this.dataset.startTime;
                        scheduleDiv.dataset.endTime = this.dataset.endTime;
                        scheduleDiv.innerHTML = "<strong>" + this.dataset.classId + " <br/>" + this.dataset.startTime + "-" + this.dataset.endTime + "<br/>" + this.dataset.seats +  "</strong";
                        //styles
                        scheduleDiv.style.backgroundColor = randColor;
                        scheduleDiv.style.borderColor = this.dataset.color;
                        scheduleDiv.style.position = "absolute";
                        scheduleDiv.style.textAlign = "center";
                        scheduleDiv.style.borderRadius = "5px";
                        scheduleDiv.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
                        scheduleDiv.style.width = "130px";
                        scheduleDiv.style.left = "666px"; // LEFT WILL CHANGE DEPENDING ON DAY
                        //calculating size, startTime
                        let startTime = parseInt(this.dataset.startTime);
                        let endTime = parseInt(this.dataset.endTime);
                        if (startTime > endTime){
                            endTime += 1200;
                        }
                        let size = 0;
                        console.log(startTime + "    " + endTime);

                        let endTimeEnd2 = parseInt(this.dataset.endTime.slice(-2))/60;
                        let startTimeEnd2 = parseInt(this.dataset.startTime.slice(-2))/60;
                        let TimeDif = endTimeEnd2-startTimeEnd2;
                        if (TimeDif < 0){
                            TimeDif + 1;
                        }
                        size+= TimeDif;
                        let sizeIn100s = (endTime - (endTime % 100)) - (startTime - (startTime % 100));
                        size += (sizeIn100s)/100;

                        scheduleDiv.style.height = (size * 40.5) + "px";
                        this.dataset.size = size;
                        let isNightClass = this.dataset.isNight
                        if ((isNightClass == "true") || (startTime - 700 < 0)){
                            console.log(isNightClass, startTime - 700);
                            startTime += 1200;
                        } 

                        if (size < 1){
                            scheduleDiv.style.fontSize = "9px";
                        } else {
                            scheduleDiv.style.fontSize = "15px";
                        }

                        let subtracted = startTime - 700;
                        let increments = Math.floor(subtracted/100);
                        if (subtracted % 100 != 0){
                            increments += ((subtracted % 100)/60);
                            if ((subtracted % 100)/60 > 1){
                                warn("assert error. subtracted/60 > 1");
                            }
                        }

                        scheduleDiv.dataset.length = increments * 100;
                        
                        // TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP
                        scheduleDiv.style.top = (92+ increments * 40.5) + "px";
                        
                        scheduleDiv.addEventListener("click", function(e){
                            numItems--;
                            let displays = document.getElementsByClassName("display");
                            let schedItems = document.getElementsByClassName("scheduleItem");
                            
                            for (let i = 0; i < displays.length; i++){
                                if (displays[i].dataset.classId == this.dataset.classId){
                                    displays[i].style.color = "white";
                                }
                            }

                            for (let i = schedItems.length - 1; i >= 0; i--){
                                if (schedItems[i].dataset.classId == this.dataset.classId){
                                    schedItems[i].remove();
                                }
                            }
                        })

                        document.getElementsByTagName("body")[0].appendChild(scheduleDiv);

                    }

                    if (this.dataset.tL == "true"){
                        scheduleDiv = document.createElement("div");
                        scheduleDiv.classList.add("scheduleItem");
                        scheduleDiv.dataset.section = this.dataset.section;
                        scheduleDiv.dataset.credits = this.dataset.credits;
                        scheduleDiv.dataset.classId = this.dataset.classId;
                        scheduleDiv.dataset.startTime = this.dataset.startTimeL;
                        scheduleDiv.dataset.endTime = this.dataset.endTimeL;
                        scheduleDiv.innerHTML = "<strong>" + this.dataset.classId + " <br/>" + this.dataset.startTimeL + "-" + this.dataset.endTimeL + "<br/>" + this.dataset.seats + "</strong";
                        //styles
                        scheduleDiv.style.backgroundColor = randColor;
                        scheduleDiv.style.borderColor = this.dataset.color;
                        scheduleDiv.style.position = "absolute";
                        scheduleDiv.style.textAlign = "center";
                        scheduleDiv.style.borderRadius = "5px";
                        scheduleDiv.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
                        scheduleDiv.style.width = "130px";
                        scheduleDiv.style.left = "666px"; // LEFT WILL CHANGE DEPENDING ON DAY
                        //calculating size, startTime
                        let startTime = parseInt(this.dataset.startTimeL);
                        let endTime = parseInt(this.dataset.endTimeL);
                        if (startTime > endTime){
                            endTime += 1200;
                        }

                        // calculate size
                        let size = 0;
                        console.log(startTime + "    " + endTime);

                        let endTimeEnd2 = parseInt(this.dataset.endTimeL.slice(-2))/60;
                        let startTimeEnd2 = parseInt(this.dataset.startTimeL.slice(-2))/60;
                        let TimeDif = endTimeEnd2-startTimeEnd2;
                        if (TimeDif < 0){
                            TimeDif + 1;
                        }
                        size+= TimeDif;
                        let sizeIn100s = (endTime - (endTime % 100)) - (startTime - (startTime % 100));
                        size += (sizeIn100s)/100;

                        scheduleDiv.style.height = (size * 40.5) + "px";
                        this.dataset.size = size;

                        let isNightClass = this.dataset.isNightL
                        if ((isNightClass == "true") || (startTime - 700 < 0)){
                            console.log(isNightClass, startTime - 700);
                            startTime += 1200;
                        } 

                        if (size < 1){
                            scheduleDiv.style.fontSize = "9px";
                        } else {
                            scheduleDiv.style.fontSize = "15px";
                        }

                        let subtracted = startTime - 700;
                        let increments = Math.floor(subtracted/100);
                        if (subtracted % 100 != 0){
                            increments += ((subtracted % 100)/60);
                            if ((subtracted % 100)/60 > 1){
                                warn("assert error. subtracted/60 > 1");
                            }
                        }

                        scheduleDiv.dataset.length = increments * 100;
                        
                        // TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP
                        scheduleDiv.style.top = (92+ increments * 40.5) + "px";
                        
                        scheduleDiv.addEventListener("click", function(e){
                            numItems--;
                            let displays = document.getElementsByClassName("display");
                            let schedItems = document.getElementsByClassName("scheduleItem");
                            
                            for (let i = 0; i < displays.length; i++){
                                if (displays[i].dataset.classId == this.dataset.classId){
                                    displays[i].style.color = "white";
                                }
                            }

                            for (let i = schedItems.length - 1; i >= 0; i--){
                                if (schedItems[i].dataset.classId == this.dataset.classId){
                                    schedItems[i].remove();
                                }
                            }
                        })

                        document.getElementsByTagName("body")[0].appendChild(scheduleDiv);

                    }

                    if (this.dataset.w == "true"){
                        scheduleDiv = document.createElement("div");
                        scheduleDiv.classList.add("scheduleItem");
                        scheduleDiv.dataset.section = this.dataset.section;
                        scheduleDiv.dataset.credits = this.dataset.credits;
                        scheduleDiv.dataset.classId = this.dataset.classId;
                        scheduleDiv.dataset.startTime = this.dataset.startTime;
                        scheduleDiv.dataset.endTime = this.dataset.endTime;
                        scheduleDiv.innerHTML = "<strong>" + this.dataset.classId + " <br/>" + this.dataset.startTime + "-" + this.dataset.endTime + "<br/>" + this.dataset.seats +  "</strong";
                        //styles
                        scheduleDiv.style.backgroundColor = randColor;
                        scheduleDiv.style.borderColor = this.dataset.color;
                        scheduleDiv.style.position = "absolute";
                        scheduleDiv.style.textAlign = "center";
                        scheduleDiv.style.borderRadius = "5px";
                        scheduleDiv.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
                        scheduleDiv.style.width = "130px";
                        scheduleDiv.style.left = "798px"; // LEFT WILL CHANGE DEPENDING ON DAY
                        //calculating size, startTime
                        let startTime = parseInt(this.dataset.startTime);
                        let endTime = parseInt(this.dataset.endTime);
                        if (startTime > endTime){
                            endTime += 1200;
                        }
                        let size = 0;
                        console.log(startTime + "    " + endTime);

                        let endTimeEnd2 = parseInt(this.dataset.endTime.slice(-2))/60;
                        let startTimeEnd2 = parseInt(this.dataset.startTime.slice(-2))/60;
                        let TimeDif = endTimeEnd2-startTimeEnd2;
                        if (TimeDif < 0){
                            TimeDif + 1;
                        }
                        size+= TimeDif;
                        let sizeIn100s = (endTime - (endTime % 100)) - (startTime - (startTime % 100));
                        size += (sizeIn100s)/100;

                        scheduleDiv.style.height = (size * 40.5) + "px";
                        this.dataset.size = size;
                        let isNightClass = this.dataset.isNight
                        if ((isNightClass == "true") || (startTime - 700 < 0)){
                            console.log(isNightClass, startTime - 700);
                            startTime += 1200;
                        } 

                        if (size < 1){
                            scheduleDiv.style.fontSize = "10px";
                        } else {
                            scheduleDiv.style.fontSize = "16px";
                        }

                        let subtracted = startTime - 700;
                        let increments = Math.floor(subtracted/100);
                        if (subtracted % 100 != 0){
                            increments += ((subtracted % 100)/60);
                            if ((subtracted % 100)/60 > 1){
                                warn("assert error. subtracted/60 > 1");
                            }
                        }

                        scheduleDiv.dataset.length = increments * 100;
                        
                        // TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP
                        scheduleDiv.style.top = (92+ increments * 40.5) + "px";
                        
                        scheduleDiv.addEventListener("click", function(e){
                            numItems--;
                            let displays = document.getElementsByClassName("display");
                            let schedItems = document.getElementsByClassName("scheduleItem");
                            
                            for (let i = 0; i < displays.length; i++){
                                if (displays[i].dataset.classId == this.dataset.classId){
                                    displays[i].style.color = "white";
                                }
                            }

                            for (let i = schedItems.length - 1; i >= 0; i--){
                                if (schedItems[i].dataset.classId == this.dataset.classId){
                                    schedItems[i].remove();
                                }
                            }
                        })

                        document.getElementsByTagName("body")[0].appendChild(scheduleDiv);

                    }

                    if (this.dataset.wL == "true"){
                        scheduleDiv = document.createElement("div");
                        scheduleDiv.classList.add("scheduleItem");
                        scheduleDiv.dataset.section = this.dataset.section;
                        scheduleDiv.dataset.credits = this.dataset.credits;
                        scheduleDiv.dataset.classId = this.dataset.classId;
                        scheduleDiv.dataset.startTime = this.dataset.startTimeL;
                        scheduleDiv.dataset.endTime = this.dataset.endTimeL;
                        scheduleDiv.innerHTML = "<strong>" + this.dataset.classId + " <br/>" + this.dataset.startTimeL + "-" + this.dataset.endTimeL + "<br/>" + this.dataset.seats + "</strong";
                        //styles
                        scheduleDiv.style.backgroundColor = randColor;
                        scheduleDiv.style.borderColor = this.dataset.color;
                        scheduleDiv.style.position = "absolute";
                        scheduleDiv.style.textAlign = "center";
                        scheduleDiv.style.borderRadius = "5px";
                        scheduleDiv.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
                        scheduleDiv.style.width = "130px";
                        scheduleDiv.style.left = "798px"; // LEFT WILL CHANGE DEPENDING ON DAY
                        //calculating size, startTime
                        let startTime = parseInt(this.dataset.startTimeL);
                        let endTime = parseInt(this.dataset.endTimeL);
                        if (startTime > endTime){
                            endTime += 1200;
                        }

                        // calculate size
                        let size = 0;
                        console.log(startTime + "    " + endTime);

                        let endTimeEnd2 = parseInt(this.dataset.endTimeL.slice(-2))/60;
                        let startTimeEnd2 = parseInt(this.dataset.startTimeL.slice(-2))/60;
                        let TimeDif = endTimeEnd2-startTimeEnd2;
                        if (TimeDif < 0){
                            TimeDif + 1;
                        }
                        size+= TimeDif;
                        let sizeIn100s = (endTime - (endTime % 100)) - (startTime - (startTime % 100));
                        size += (sizeIn100s)/100;

                        scheduleDiv.style.height = (size * 40.5) + "px";
                        this.dataset.size = size;

                        let isNightClass = this.dataset.isNightL
                        if ((isNightClass == "true") || (startTime - 700 < 0)){
                            console.log(isNightClass, startTime - 700);
                            startTime += 1200;
                        } 

                        if (size < 1){
                            scheduleDiv.style.fontSize = "9px";
                        } else {
                            scheduleDiv.style.fontSize = "15px";
                        }

                        let subtracted = startTime - 700;
                        let increments = Math.floor(subtracted/100);
                        if (subtracted % 100 != 0){
                            increments += ((subtracted % 100)/60);
                            if ((subtracted % 100)/60 > 1){
                                warn("assert error. subtracted/60 > 1");
                            }
                        }

                        scheduleDiv.dataset.length = increments * 100;
                        
                        // TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP
                        scheduleDiv.style.top = (92+ increments * 40.5) + "px";
                        
                        scheduleDiv.addEventListener("click", function(e){
                            numItems--;
                            let displays = document.getElementsByClassName("display");
                            let schedItems = document.getElementsByClassName("scheduleItem");
                            
                            for (let i = 0; i < displays.length; i++){
                                if (displays[i].dataset.classId == this.dataset.classId){
                                    displays[i].style.color = "white";
                                }
                            }

                            for (let i = schedItems.length - 1; i >= 0; i--){
                                if (schedItems[i].dataset.classId == this.dataset.classId){
                                    schedItems[i].remove();
                                }
                            }
                        })

                        document.getElementsByTagName("body")[0].appendChild(scheduleDiv);

                    }

                    if (this.dataset.th == "true"){
                        scheduleDiv = document.createElement("div");
                        scheduleDiv.classList.add("scheduleItem");
                        scheduleDiv.dataset.section = this.dataset.section;
                        scheduleDiv.dataset.credits = this.dataset.credits;
                        scheduleDiv.dataset.classId = this.dataset.classId;
                        scheduleDiv.dataset.startTime = this.dataset.startTime;
                        scheduleDiv.dataset.endTime = this.dataset.endTime;
                        scheduleDiv.innerHTML = "<strong>" + this.dataset.classId + " <br/>" + this.dataset.startTime + "-" + this.dataset.endTime + "<br/>" + this.dataset.seats +  "</strong";
                        //styles
                        scheduleDiv.style.backgroundColor = randColor;
                        scheduleDiv.style.borderColor = this.dataset.color;
                        scheduleDiv.style.position = "absolute";
                        scheduleDiv.style.textAlign = "center";
                        scheduleDiv.style.borderRadius = "5px";
                        scheduleDiv.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
                        scheduleDiv.style.width = "130px";
                        scheduleDiv.style.left = "930px"; // LEFT WILL CHANGE DEPENDING ON DAY
                        //calculating size, startTime
                        let startTime = parseInt(this.dataset.startTime);
                        let endTime = parseInt(this.dataset.endTime);
                        if (startTime > endTime){
                            endTime += 1200;
                        }
                        let size = 0;
                        console.log(startTime + "    " + endTime);

                        let endTimeEnd2 = parseInt(this.dataset.endTime.slice(-2))/60;
                        let startTimeEnd2 = parseInt(this.dataset.startTime.slice(-2))/60;
                        let TimeDif = endTimeEnd2-startTimeEnd2;
                        if (TimeDif < 0){
                            TimeDif + 1;
                        }
                        size+= TimeDif;
                        let sizeIn100s = (endTime - (endTime % 100)) - (startTime - (startTime % 100));
                        size += (sizeIn100s)/100;

                        scheduleDiv.style.height = (size * 40.5) + "px";
                        this.dataset.size = size;
                        let isNightClass = this.dataset.isNight
                        if ((isNightClass == "true") || (startTime - 700 < 0)){
                            console.log(isNightClass, startTime - 700);
                            startTime += 1200;
                        } 

                        if (size < 1){
                            scheduleDiv.style.fontSize = "9px";
                        } else {
                            scheduleDiv.style.fontSize = "15px";
                        }

                        let subtracted = startTime - 700;
                        let increments = Math.floor(subtracted/100);
                        if (subtracted % 100 != 0){
                            increments += ((subtracted % 100)/60);
                            if ((subtracted % 100)/60 > 1){
                                warn("assert error. subtracted/60 > 1");
                            }
                        }

                        scheduleDiv.dataset.length = increments * 100;
                        
                        // TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP
                        scheduleDiv.style.top = (92+ increments * 40.5) + "px";
                        
                        scheduleDiv.addEventListener("click", function(e){
                            numItems--;
                            let displays = document.getElementsByClassName("display");
                            let schedItems = document.getElementsByClassName("scheduleItem");
                            
                            for (let i = 0; i < displays.length; i++){
                                if (displays[i].dataset.classId == this.dataset.classId){
                                    displays[i].style.color = "white";
                                }
                            }

                            for (let i = schedItems.length - 1; i >= 0; i--){
                                if (schedItems[i].dataset.classId == this.dataset.classId){
                                    schedItems[i].remove();
                                }
                            }
                        })

                        document.getElementsByTagName("body")[0].appendChild(scheduleDiv);

                    }

                    if (this.dataset.thL == "true"){
                        scheduleDiv = document.createElement("div");
                        scheduleDiv.classList.add("scheduleItem");
                        scheduleDiv.dataset.section = this.dataset.section;
                        scheduleDiv.dataset.credits = this.dataset.credits;
                        scheduleDiv.dataset.classId = this.dataset.classId;
                        scheduleDiv.dataset.startTime = this.dataset.startTimeL;
                        scheduleDiv.dataset.endTime = this.dataset.endTimeL;
                        scheduleDiv.innerHTML = "<strong>" + this.dataset.classId + " <br/>" + this.dataset.startTimeL + "-" + this.dataset.endTimeL + "<br/>" + this.dataset.seats + "</strong>" ;
                        //styles
                        scheduleDiv.style.backgroundColor = randColor;
                        scheduleDiv.style.borderColor = this.dataset.color;
                        scheduleDiv.style.position = "absolute";
                        scheduleDiv.style.textAlign = "center";
                        scheduleDiv.style.borderRadius = "5px";
                        scheduleDiv.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
                        scheduleDiv.style.width = "130px";
                        scheduleDiv.style.left = "930px"; // LEFT WILL CHANGE DEPENDING ON DAY
                        //calculating size, startTime
                        let startTime = parseInt(this.dataset.startTimeL);
                        let endTime = parseInt(this.dataset.endTimeL);
                        if (startTime > endTime){
                            endTime += 1200;
                        }

                        // calculate size
                        let size = 0;
                        console.log(startTime + "    " + endTime);

                        let endTimeEnd2 = parseInt(this.dataset.endTimeL.slice(-2))/60;
                        let startTimeEnd2 = parseInt(this.dataset.startTimeL.slice(-2))/60;
                        let TimeDif = endTimeEnd2-startTimeEnd2;
                        if (TimeDif < 0){
                            TimeDif + 1;
                        }
                        size+= TimeDif;
                        let sizeIn100s = (endTime - (endTime % 100)) - (startTime - (startTime % 100));
                        size += (sizeIn100s)/100;

                        scheduleDiv.style.height = (size * 40.5) + "px";
                        this.dataset.size = size;

                        let isNightClass = this.dataset.isNightL
                        if ((isNightClass == "true") || (startTime - 700 < 0)){
                            console.log(isNightClass, startTime - 700);
                            startTime += 1200;
                        } 

                        if (size < 1){
                            scheduleDiv.style.fontSize = "9px";
                        } else {
                            scheduleDiv.style.fontSize = "15px";
                        }

                        let subtracted = startTime - 700;
                        let increments = Math.floor(subtracted/100);
                        if (subtracted % 100 != 0){
                            increments += ((subtracted % 100)/60);
                            if ((subtracted % 100)/60 > 1){
                                warn("assert error. subtracted/60 > 1");
                            }
                        }

                        scheduleDiv.dataset.length = increments * 100;
                        
                        // TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP
                        scheduleDiv.style.top = (92+ increments * 40.5) + "px";
                        
                        scheduleDiv.addEventListener("click", function(e){
                            numItems--;
                            let displays = document.getElementsByClassName("display");
                            let schedItems = document.getElementsByClassName("scheduleItem");
                            
                            for (let i = 0; i < displays.length; i++){
                                if (displays[i].dataset.classId == this.dataset.classId){
                                    displays[i].style.color = "white";
                                }
                            }

                            for (let i = schedItems.length - 1; i >= 0; i--){
                                if (schedItems[i].dataset.classId == this.dataset.classId){
                                    schedItems[i].remove();
                                }
                            }
                        })

                        document.getElementsByTagName("body")[0].appendChild(scheduleDiv);

                    }

                    if (this.dataset.f == "true"){
                        scheduleDiv = document.createElement("div");
                        scheduleDiv.classList.add("scheduleItem");
                        scheduleDiv.dataset.section = this.dataset.section;
                        scheduleDiv.dataset.credits = this.dataset.credits;
                        scheduleDiv.dataset.classId = this.dataset.classId;
                        scheduleDiv.dataset.startTime = this.dataset.startTime;
                        scheduleDiv.dataset.endTime = this.dataset.endTime;
                        scheduleDiv.innerHTML = "<strong>" + this.dataset.classId + " <br/>" + this.dataset.startTime + "-" + this.dataset.endTime + "<br/>" + this.dataset.seats +  "</strong";
                        //styles
                        scheduleDiv.style.backgroundColor = randColor;
                        scheduleDiv.style.borderColor = this.dataset.color;
                        scheduleDiv.style.position = "absolute";
                        scheduleDiv.style.textAlign = "center";
                        scheduleDiv.style.borderRadius = "5px";
                        scheduleDiv.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
                        scheduleDiv.style.width = "130px";
                        scheduleDiv.style.left = "1062px"; // LEFT WILL CHANGE DEPENDING ON DAY
                        //calculating size, startTime
                        let startTime = parseInt(this.dataset.startTime);
                        let endTime = parseInt(this.dataset.endTime);
                        if (startTime > endTime){
                            endTime += 1200;
                        }
                        let size = 0;
                        console.log(startTime + "    " + endTime);

                        let endTimeEnd2 = parseInt(this.dataset.endTime.slice(-2))/60;
                        let startTimeEnd2 = parseInt(this.dataset.startTime.slice(-2))/60;
                        let TimeDif = endTimeEnd2-startTimeEnd2;
                        if (TimeDif < 0){
                            TimeDif + 1;
                        }
                        size+= TimeDif;
                        let sizeIn100s = (endTime - (endTime % 100)) - (startTime - (startTime % 100));
                        size += (sizeIn100s)/100;

                        scheduleDiv.style.height = (size * 40.5) + "px";
                        this.dataset.size = size;
                        let isNightClass = this.dataset.isNight
                        if ((isNightClass == "true") || (startTime - 700 < 0)){
                            console.log(isNightClass, startTime - 700);
                            startTime += 1200;
                        } 

                        if (size < 1){
                            scheduleDiv.style.fontSize = "9px";
                        } else {
                            scheduleDiv.style.fontSize = "15px";
                        }

                        let subtracted = startTime - 700;
                        let increments = Math.floor(subtracted/100);
                        if (subtracted % 100 != 0){
                            increments += ((subtracted % 100)/60);
                            if ((subtracted % 100)/60 > 1){
                                warn("assert error. subtracted/60 > 1");
                            }
                        }

                        scheduleDiv.dataset.length = increments * 100;
                        
                        // TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP
                        scheduleDiv.style.top = (92+ increments * 40.5) + "px";
                        
                        scheduleDiv.addEventListener("click", function(e){
                            numItems--;
                            let displays = document.getElementsByClassName("display");
                            let schedItems = document.getElementsByClassName("scheduleItem");
                            
                            for (let i = 0; i < displays.length; i++){
                                if (displays[i].dataset.classId == this.dataset.classId){
                                    displays[i].style.color = "white";
                                }
                            }

                            for (let i = schedItems.length - 1; i >= 0; i--){
                                if (schedItems[i].dataset.classId == this.dataset.classId){
                                    schedItems[i].remove();
                                }
                            }
                        })

                        document.getElementsByTagName("body")[0].appendChild(scheduleDiv);

                    }

                    if (this.dataset.fL == "true"){
                        scheduleDiv = document.createElement("div");
                        scheduleDiv.classList.add("scheduleItem");
                        scheduleDiv.dataset.section = this.dataset.section;
                        scheduleDiv.dataset.credits = this.dataset.credits;
                        scheduleDiv.dataset.classId = this.dataset.classId;
                        scheduleDiv.dataset.startTime = this.dataset.startTimeL;
                        scheduleDiv.dataset.endTime = this.dataset.endTimeL;
                        scheduleDiv.innerHTML = "<strong>" + this.dataset.classId + " <br/>" + this.dataset.startTimeL + "-" + this.dataset.endTimeL + "<br/>" + this.dataset.seats + "</strong";
                        //styles
                        scheduleDiv.style.backgroundColor = randColor;
                        scheduleDiv.style.borderColor = this.dataset.color;
                        scheduleDiv.style.position = "absolute";
                        scheduleDiv.style.textAlign = "center";
                        scheduleDiv.style.borderRadius = "5px";
                        scheduleDiv.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
                        scheduleDiv.style.width = "130px";
                        scheduleDiv.style.left = "1062px"; // LEFT WILL CHANGE DEPENDING ON DAY
                        //calculating size, startTime
                        let startTime = parseInt(this.dataset.startTimeL);
                        let endTime = parseInt(this.dataset.endTimeL);
                        if (startTime > endTime){
                            endTime += 1200;
                        }

                        // calculate size
                        let size = 0;
                        console.log(startTime + "    " + endTime);

                        let endTimeEnd2 = parseInt(this.dataset.endTimeL.slice(-2))/60;
                        let startTimeEnd2 = parseInt(this.dataset.startTimeL.slice(-2))/60;
                        let TimeDif = endTimeEnd2-startTimeEnd2;
                        if (TimeDif < 0){
                            TimeDif + 1;
                        }
                        size+= TimeDif;
                        let sizeIn100s = (endTime - (endTime % 100)) - (startTime - (startTime % 100));
                        size += (sizeIn100s)/100;

                        scheduleDiv.style.height = (size * 40.5) + "px";
                        this.dataset.size = size;

                        let isNightClass = this.dataset.isNightL
                        if ((isNightClass == "true") || (startTime - 700 < 0)){
                            console.log(isNightClass, startTime - 700);
                            startTime += 1200;
                        } 

                        if (size < 1){
                            scheduleDiv.style.fontSize = "9px";
                        } else {
                            scheduleDiv.style.fontSize = "15px";
                        }

                        let subtracted = startTime - 700;
                        let increments = Math.floor(subtracted/100);
                        if (subtracted % 100 != 0){
                            increments += ((subtracted % 100)/60);
                            if ((subtracted % 100)/60 > 1){
                                warn("assert error. subtracted/60 > 1");
                            }
                        }

                        scheduleDiv.dataset.length = increments * 100;
                        
                        // TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP
                        scheduleDiv.style.top = (92+ increments * 40.5) + "px";
                        
                        scheduleDiv.addEventListener("click", function(e){
                            numItems--;
                            let displays = document.getElementsByClassName("display");
                            let schedItems = document.getElementsByClassName("scheduleItem");
                            
                            for (let i = 0; i < displays.length; i++){
                                if (displays[i].dataset.classId == this.dataset.classId){
                                    displays[i].style.color = "white";
                                }
                            }

                            for (let i = schedItems.length - 1; i >= 0; i--){
                                if (schedItems[i].dataset.classId == this.dataset.classId){
                                    schedItems[i].remove();
                                }
                            }
                        })

                        document.getElementsByTagName("body")[0].appendChild(scheduleDiv);

                    }

                }


            })
        }
    }
    if (!FULLshow){
        let choices = document.getElementsByClassName("inDiv");
        for(let i = 0; i < choices.length; i++){
            if(choices[i].innerHTML.includes("FULL")){
                choices[i].parentElement.style.display = "none";
            }
        }
    }

    if (!TBAshow){
        let choices = document.getElementsByClassName("inDiv");
        for(let i = 0; i < choices.length; i++){
            if(choices[i].innerHTML.includes("TBA")){
                choices[i].parentElement.style.display = "none";
            }
        }
    }
})

//show in finalized form
btnF.addEventListener("click", function(e){
    let schedItems = document.getElementsByClassName("scheduleItem");
    if (schedItems.length < 1){
        if (!isHiddenD(finalizedTab)){
            finalizedTab.style.display = "none";
            return;
        }
        warn("You need at least one class to show in finalized form");
        return;
    }
    let clones = document.getElementsByClassName("finalSched");
    fullWarning.style.display = "none";
    if (isHiddenD(finalizedTab)){
        finalizedTab.style.display = "block";
    } else {
        finalizedTab.style.display = "none";
        return;
    }

    for (let i = clones.length - 1; i >= 0; i--){
        if (clones[i].id != "keep"){
            console.log(clones.length);
            clones[i].remove();
        }
    }

    if (isHiddenD(finalizedTab)){
        return;
    }

    let current = [];
    for(let i = 0; i < schedItems.length; i++){
        //add to current the classes that are on the screen
        let currentItem = schedItems[i];
        if (current.length < 1){
            current.push(currentItem);
        } else if( currentItem.dataset.classId != current[current.length - 1].dataset.classId ){
            current.push(currentItem);
        }
    }
    for(let i = 0; i < current.length; i++){
        if (current[i].innerHTML.includes("FULL")){
            fullWarning.style.display = "block";
        }

        let clone = document.createElement("div")
        clone.classList.add("finalSched")
        let substring = Math.floor(current[i].dataset.classId.length/2);
        clone.innerHTML = "Department: " + current[i].dataset.classId.substring(0, substring) + ", Course Number: " + current[i].dataset.classId.substring(substring, current[i].dataset.classId.length) + ", Section: " + current[i].dataset.section + ", Credits: " + current[i].dataset.credits;
        finalTemplate.parentElement.appendChild(clone);
    }
})

xml.onload = function(){
    var dataReply = JSON.parse(this.responseText);
    setVisibility(loadingCircle, "hidden");
    if (dataReply.classes == "found") {
        everythingString = dataReply.String;
        var lastIndex = everythingString.lastIndexOf("--");

        //assertions
        if (lastIndex > 400){
            warn("last Index is greater than 400");
        }
        if (lastIndex < 300){
            warn("last Index is less than 300");
        }
        removeBeginStr = dataReply.String.slice(lastIndex + 2);
        console.log(removeBeginStr);
        // removed begining part

        splitTable = removeBeginStr.split("\n");
        console.log(splitTable);
        splitTable.pop();
        options = [];
        for (let i = 1; i < splitTable.length; i++) {
            //going through the lines
            line = splitTable[i];
            //make sure line is not a *** comment
            trimmed = line.trim();
            if (trimmed.charAt(0) == "*") {
                console.log("this line should ignore" + line);
            } else {
                available = line.substring(0, 3).trim();
                taken = line.substring(6, 9).trim();
                //test that line isnt a random empty line left by WONDERFUL LSU website...
                if ((available.length >= 1) || (taken.length >= 1)){
                    // default taken to 0 if its empty
                    if (taken.length == 0) {
                        taken = "0";
                    }
                    
                    // make sure that class isnt on hold
                    if (available == "(H)"){
                        console.log("this line is on hold, ignore" + line);
                    } else {
                        className = line.substring(11, 15).trim();
                        classNumber = line.substring(16, 20).trim();
                        classType = line.substring(21, 24).trim();
                        classSection = line.substring(27, 30).trim();
                        classCredits = line.substring(55, 58).trim();
                        startTime = line.substring(60, 64).trim();
                        endTime = line.substring(65, 69).trim();
                        isNight = false;
                        if (line.charAt(69) == "N") {
                            isNight = true;
                        }
                        //start at 72
                        monday = false;
                        if (line.charAt(72) == "M") {
                            monday = true;
                        }
                        tuesday = false;
                        if (line.charAt(73) == "T") {
                            tuesday = true;
                        }
                        wednesday = false;
                        if (line.charAt(74) == "W") {
                            wednesday = true;
                        }
                        thursday = false;
                        if (line.charAt(75) == "T") {
                            thursday = true;
                        }
                        friday = false;
                        if (line.charAt(76) == "F") {
                            friday = true;
                        }
                        //extra info start at 99
                        extraInfo = line.substring(99, line.length).trim();

                        console.log(line);
                        //console.log("available = " + available, "taken = " + taken, "className = " + className, "classNumber = " + classNumber, "classType = " + classType, "classSection = " + classSection, "classCredits = " + classCredits, "startTime = " + startTime, "endTime = " + endTime, "isNight = " + isNight + "days = " + monday + tuesday + wednesday + thursday + friday );
                        // classID, available, taken, (type), section, credits, start, end, isNight, M, T, W, TH, F, extraInfo //15 items// IF LAB:Type, start, end,IsNight, M, T, W, TH, F //24 items//
                        options[options.length] = [className + " " + classNumber, available, taken, classType, classSection, classCredits, startTime, endTime, isNight, monday, tuesday, wednesday, thursday, friday, extraInfo];

                    }

                } else {
                    // might be a LAB class

                    if ((trimmed.substring(0, 3) == "LAB") || (trimmed.substring(0, 3) == "REC")){
                        // its a lab
                        console.log("found secondary class = " + trimmed.substring(0,3));
                        LabOrRec = trimmed.substring(0,3);//REC OR LAB
                        startTime = line.substring(60, 64).trim();
                        endTime = line.substring(65, 69).trim();
                        isNight = false;
                        if (line.charAt(69) == "N") {
                            isNight = true;
                        }
                        monday = false;
                        if (line.charAt(72) == "M") {
                            monday = true;
                        }
                        tuesday = false;
                        if (line.charAt(73) == "T") {
                            tuesday = true;
                        }
                        wednesday = false;
                        if (line.charAt(74) == "W") {
                            wednesday = true;
                        }
                        thursday = false;
                        if (line.charAt(75) == "T") {
                            thursday = true;
                        }
                        friday = false;
                        if (line.charAt(76) == "F") {
                            friday = true;
                        }
                        options[options.length-1].push(LabOrRec, startTime, endTime, isNight, monday, tuesday, wednesday, thursday, friday);

                    } else {
                        console.log("this line is not a lab and useless " + trimmed);
                    }
                }
            }
        }
        console.log(options);
        prev = "";
        // create option for classes (ex: MATH1100)
        for (let i = 0; i < options.length; i++) {
            if (options[i][0] != prev){
                newOption = document.createElement("option");
                newOption.value = options[i][0];
                newOption.text = options[i][0];
                numberDropdown.add(newOption);
                prev = options[i][0];
            }
        }

    } else {
        warn("No classes were found for this semester");
    }

    optionsInSem = semesterDropdown.getElementsByTagName("option");
    for (let i = 1; i < optionsInSem.length; i++) {
        optionsInSem[i].disabled = false;
    }

    optionsInDep = departmentDropdown.getElementsByTagName("option");
    for (let i = 1; i < optionsInDep.length; i++) {
        optionsInDep[i].disabled = false;
    }
};