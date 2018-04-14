function init() {
    $.ajax({
        url: "/socDiagnoses",
        method: 'GET',
        async: true,
        cache: false,
        timeout: 5000,
        dataType: "json",
        success: function (data) {
            console.log("success");
            createDropdown(data);
        },
        complete: function (data) {
            console.log("completed");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error connecting to the Node.js server... ' + textStatus + " " + errorThrown);
        }
    });
};

function createDropdown(data) {
    for (d in data) {
        $("#x").append("<option value=\"/soc" + d + "\">" + data[d] + "</option>");
        $("#y").append("<option value=\"/soc" + d + "\">" + data[d] + "</option>");
    }
}

init();
