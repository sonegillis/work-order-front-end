
const workOrdersUrl = "https://www.hatchways.io/api/assessment/work_orders";
const workerDetailUrl = "https://www.hatchways.io/api/assessment/workers/";
var workOrders;
var workOrderFilter = [];
var workerDetail = {};
var fetchedWorkers = [];  

$(document).ajaxStop(function() {
    $(".blur").animate({left: '-5000px'}, 4000);
    insertionSortByDeadline();
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
    $("#toggle-switch-label").on('click', () => {
        workOrders = workOrders.reverse();
        workOrderFilter = workOrderFilter.reverse();
        if ($("#search").val() != "") displayWorkOrders(workOrderFilter);
        else displayWorkOrders(workOrders);
    });
    
});

function displayWorkOrders(workOrders){
    $("#main").html("");
    var div_block = '<div class="d-flex container-fluid justify-content-between flex-wrap flex-row text-center">';
    for(let i = 0; i < workOrders.length; i++) {
        workOrder = workOrders[i]
        div_block += getDivBlock(workOrder.name, workOrder.description, workOrder.deadline, workOrder.workerId)
    }
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
                let temp = workOrders[i];
                shiftArray(j+1, i);
                workOrders[j] = temp;
                break;
            }
        }
    }
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
        <div class="work-order mb-2 p-2">
            <p class="mb-2 font-weight-bold">${work_order}</p>
            <p class="Description">${description}</p>
            <div class="worker mt-2 d-flex flex-row justify-content-around mb-2">
                <figure class="w-100 w-sm-25">
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
    workOrderFilter = [];
    let value = $("#search").val();

    for (worker in workerDetail) {
        if (workerDetail[worker]['worker']['name'].toLowerCase().includes(value.toLowerCase())) {
            filterList.push(parseInt(worker))
        }
    }

    workOrders.forEach((data, i) => {
        if (filterList.includes(data.workerId)) {
            workOrderFilter.push(data);
        }
    });

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