$(document).ready(function(){
    let get_work_orders_url = "​https://www.hatchways.io/api/assessment/work_orders/";
    getWorkOrders(get_work_orders_url);
});

function getWorkOrders(get_work_orders_url){
    $.ajax({
        type: "GET",
        url: get_work_orders_url,
        dataType: "jsonp",
        success: function(result, status, xhr){
            alert(result);
        },
        error: function(xhr, status, error){
            alert(status);
            alert(error);
            alert(xhr.responseText);
        }
    });

}

