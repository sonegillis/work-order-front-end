
const workOrdersUrl = "https://www.hatchways.io/api/assessment/work_orders";
const workerDetailUrl = "https://www.hatchways.io/api/assessment/workers/";
var workOrders;
var workerDetail = {};
var fetchedWorkers = [];    // here we store the workers whose detail have been fetched so that we don't query for them again

$(document).ajaxStop(function() {
    // $('.loading').hide(100);
    $(".blur").animate({left: '-5000px'}, 4000);
    console.log(workOrders);
    insertionSortByDeadline();
    console.log(workOrders);
    displayWorkOrders(workOrders);
});

$(document).ready(function(){
    getWorkOrders();
    workOrders.forEach((data, i) => {
        if (!fetchedWorkers.includes(data.workerId)) {
            getWorkerDetail(data.workerId);
            fetchedWorkers.push(data.workerId);
        }
    });
    console.log(workerDetail);
});

function displayWorkOrders(workOrders){
    $("#main").html("");
    var div_block = '<div class="container">'
    var container_start = '<div class="row">'
    var container_end = '</div>'
    div_block += container_start;
    for(let i = 0; i < workOrders.length; i++) {
        workOrder = workOrders[i]
        div_block += getDivBlock(workOrder.name, workOrder.description, workOrder.deadline, workOrder.workerId)
        if ((i+1)%3==0){
            div_block += container_end;
            div_block += container_start;
        }
    }
    div_block += container_end;
    div_block += '</div>';
    $("#main").html(div_block);
    $(".work-order").show('slow');
}

function insertionSortByDeadline(){
    let shiftArray = (from, to) => {
        for (let i = to; i >= from; i--) {
            workOrders[i] = workOrders[i-1];
        }
    }
    for (let i = 1; i < workOrders.length; i++) {
        for (let j = 0; j < i; j++) {
            if (workOrders[i].deadline < workOrders[j].deadline) {
                shiftArray(j-1, i);
                break;
            }
        }
    }
}

function SortWorkOrdersByDeadline(){
    newArray = []
    let flag = false;
    let condition;

    if (workOrders[0].deadline < workOrders[1].deadline) {
        newArray.push(workOrders[0]);
        newArray.push(workOrders[1]);
    }
    else{
        newArray.push(workOrders[1]);
        newArray.push(workOrders[0]);
    }
    console.log(newArray);
    for(let i = 2; i < workOrders.length; i++){
        for (let j = 0; j < newArray.length; j++) {
            if (workOrders[i].deadline < newArray[0].deadline) {
                newArray.unshift(workOrders[i]);
                flag = true;
                console.log(newArray);
                break;
            }
            if (workOrders[i].deadline > newArray[newArray.length-1].deadline) {
                newArray.push(workOrders[i]);
                console.log(newArray);
                flag = true;
                break;
            }
            
            if (j < newArray.length - 1) {
                condition = workOrders[i].deadline >= newArray[j].deadline && workOrders[i].deadline <= newArray[j+1].deadline;

                if (condition) {

                    newArray.splice(j, 0, workOrders[i]);
                    console.log(newArray);
                    flag = true;
                    break;
                }

            }    
 
        }
        if (!flag) {
            newArray.splice(newArray.length-1, 0, workOrder[i]);
            console.log(newArray);
        }
        flag = false;
    }
    workOrders = newArray;
}

function getWorkOrders(){
    $.ajax({
        type: "GET",
        url: workOrdersUrl,
        dataType: "json",
        global: false,
        async: false,
        success: function(result){
            workOrders = result.orders
        },
        error: function(xhr, status, error){
            console.log(xhr.responseText);
        }
    });
}

function getWorkerDetail(workerId){
    $.ajax({
        type: "GET",
        url: workerDetailUrl+workerId,
        dataType: "json",
        success: function(result){
            workerDetail[workerId] = result
        },
        error: function(xhr, status, error){
            console.log(xhr.responseText);
        }
    });
}

function getDivBlock(work_order, description, deadline, worker_id){
    let worker = workerDetail[worker_id]['worker']
    var block_div = `
        <div class="work-order col-sm-6 col-lg-4 text-center mb-4 style="display:none">
            <p class="mb-2 font-weight-bold">${work_order}</p>
            <p class="Description">${description}</p>
            <div class="worker mt-2 d-flex flex-row justify-content-around mb-2">
                <figure class="w-100 w-sm-25 ">
                    <img src=${worker['image']} alt=${worker['name']}>
                </figure>
                <div class="worker-detail w-100 w-sm-75 font-italic">
                    <p class="name"> <small>${worker['name']}</small> </p>
                    <p class="email"> <small>${worker['email']}</small> </p>
                    <p class="company"> <small>${worker['companyName']}</small> </p>
                </div>
            </div>
            <div class="dealine mt-2">
                <p class="text-right text-muted">${convertEpochToDateTime(deadline)}</p>
            </div>
        </div>
    `
    return block_div;
}

function filterByWorker(){
    let filterList = [];
    let workOrderFilter = [];
    let value = $("#search").val();

    for (worker in workerDetail) {
        if (workerDetail[worker]['worker']['name'].toLowerCase().includes(value.toLowerCase())) {
            filterList.push(parseInt(worker))
        }
    }
    console.log(filterList);
    workOrders.forEach((data, i) => {
        if (filterList.includes(data.workerId)) {
            workOrderFilter.push(data);
        }
    });
    console.log(workOrderFilter);
    displayWorkOrders(workOrderFilter);
}

function convertEpochToDateTime(epoch){

    var unixtimestamp = epoch;
    var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    var date = new Date(unixtimestamp*1000);
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();

    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
   
    // Display date time in MM-dd-yyyy h:m:s format
    var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    
    return convdataTime;
    
   }