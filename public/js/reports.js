/*
  Employee-Recognition: reports.js
  Jackie Bradnan
  Oct 14, 2018

  reports.js contains script to show reports available for employee recognition app.
*/

/*
  Gets data for all users report, calls function to render chart
*/
function displayAllUsers() {
    hideFields("#search");
    var url = "/displayAllUsers";
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (json) {
                getAllUsersChart(json);
            });
        } else {
            console.log("error");
        }
    });
}

/*
  Gets data for all awards report, calls function to render chart
*/
function displayAllAwards() {
    hideFields("#search");
    var url = "/displayAllAwards";
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (json) {
                getAllAwardsChart(json);
            });
        } else {
            console.log("error");
        }
    });
}

/*
  Gets data for distribution of awards created report, calls function to render chart
*/
function awardsCreated() {
    hideFields("#search");
    var url = "/awardsCreatedReport";
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (json) {
                getAwardsCreatedChart(json);
            });
        } else {
            console.log("error");
        }
    });
}

/*
  Gets data for all awards over report, calls function to render chart
*/
function awardsOverTime() {
    hideFields("#search");
    var url = "/awardsOverTimeReport";
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (json) {
                getAwardsOverTimeChart(json);
            });
        } else {
            console.log("error");
        }
    });
}

/*
  Allows searching for specific user and showing their awards.
*/
function userSearchUX() {
    $('#report').empty();
    showFields("#report_area");
    showFields("#search");
}

/*
  Search for a user whose awards you want to see.
*/
function searchForUser() {
    $("#error_text").addClass("invisible");
    var fullName = $('#name_search').val().split(' ');
    fname = fullName[0],
        lname = fullName[fullName.length - 1];
    var url = "/searchForUser" + "?fname=" + fname + "&lname=" + lname;
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (json) {
                console.log(json);
                if (json.length > 0) {
                    var id = json[0]['id'];
                    getUserAwards(id);
                } else {
                    displayError("No user found with that name");
                    $("#error_text").removeClass("invisible");
                }
            });
        } else {
            console.log("error");
        }
    });     
}

/*
  Retrieve awards for specific user
*/
function getUserAwards(id) {
    $("#error_text").addClass("invisible");
    var url = "/getUserAwardsReport" + "?id=" + id;
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (json) {
                if (json.length > 0) {
                    hideFields("#search");
                    var data = new google.visualization.DataTable();
                    showFields('#report_area');
                    data.addColumn('string', 'Name');
                    data.addColumn('string', 'Email');
                    data.addColumn('string', 'Award-Type');
                    data.addColumn('string', 'Time');
                    data.addColumn('string', 'Date');
                    var table = new Array();
                    for (i = 0; i < json.length; i++) {
                        var recipient = json[i]['name'];
                        var email = json[i]['email'];
                        var type = json[i]['type'];
                        var time = moment(json[i]['time'], 'HH:mm:ss').format('h:mm A');
                        var date = json[i]['date'].split("T");
                        var dateShortened = date[0];
                        table.push([recipient, email, type, time, dateShortened]);
                    }
                    data.addRows(table);
                    // Instantiate and draw our chart, passing in some options.
                    var chart = new google.visualization.Table(document.getElementById('report'));
                    chart.draw(data, { 'title': 'All Awards Issued', showRowNumber: true, width: '100%', height: '100%' });
                } else {
                    displayError("This user has no awards given.");
                    $("#error_text").removeClass("invisible");
                }
            });
        } else {
            console.log("error");
        }
    });
}

/*
  Renders table showing all users
*/
function getAllUsersChart(json) {
    var data = new google.visualization.DataTable();
    showFields('#report_area');
    data.addColumn('string', 'Name');
    data.addColumn('string', 'Email');
    data.addColumn('string', 'Type');

    var table = new Array();
    for (i = 0; i < json.length; i++) {
        var name = json[i]['fname'] + " " + json[i]['lname'];
        var email = json[i]['email'];
        var type = "user";
        if (json[i]['adminstrator'] !== null) {
            if (json[i]['administrator'] === true) {
                type = "administrator";
            }
        }
        table.push([name, email, type]);
    }
    data.addRows(table);
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.Table(document.getElementById('report'));
    chart.draw(data, { 'title': 'All Users', showRowNumber: true, width: '100%', height: '100%' });
}

/*
  Renders table showing all awards
*/
function getAllAwardsChart(json) {
    var data = new google.visualization.DataTable();
    showFields('#report_area');
    data.addColumn('string', 'Award From');
    data.addColumn('string', 'Award To');
    data.addColumn('string', 'Email');
    data.addColumn('string', 'Award-Type');
    data.addColumn('string', 'Time');
    data.addColumn('string', 'Date');
    var table = new Array();
    for (i = 0; i < json.length; i++) {
        var sender = json[i]['fname'] + " " + json[i]['lname'];
        var recipient = json[i]['name'];
        var email = json[i]['email'];
        var type = json[i]['type'];
        var time = moment(json[i]['time'], 'HH:mm:ss').format('h:mm A');
        var date = json[i]['date'].split("T");
        var dateShortened = date[0];
        table.push([sender, recipient, email, type, time, dateShortened]);
    }
    data.addRows(table);
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.Table(document.getElementById('report'));
    chart.draw(data, { 'title': 'All Awards Issued', showRowNumber: true, width: '100%', height: '100%' });
}

/*
  Renders chart showing awards over time - all awards, monthly, weekly
*/
function getAwardsOverTimeChart(json) {
    var data = new google.visualization.DataTable();
    var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    showFields('#report_area');
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Awards');
    data.addColumn('number', 'Weekly');
    data.addColumn('number', 'Monthly');
    console.log(json);
    var table = new Array();
    var keys = [];
    var awardsCount = {};
    var typeCount = {};
    for (i = 0; i < json.length; i++) {
        var returnedDate = json[i]['date'];
        var date = returnedDate.split("T");
        console.log(date[0]);
        var parts = date[0].split("-");
        var month = parts[1];
        var year = parts[0];
        var id = month + year;
        var type = json[i]['type'];
        if (!awardsCount.hasOwnProperty(id)) {
            keys.push(id);
            if (type === "Month") {
                awardsCount[id] = [1, 0, 1];
            } else {
                awardsCount[id] = [1, 1, 0];
            }
        } else {
            awardsCount[id][0] += 1;
            if (type === "Month") {
                awardsCount[id][2] += 1;
            } else {
                awardsCount[id][1] += 1;
            }
        }
    }
    // var keys = Object.keys(awardsCount);   // need these in date sorted order
    for (j = 0; j < keys.length; j++) {
        var monthLabel = keys[j].substring(0, 2).replace(/^[0|\D]*/, '');
        var monthPosition = parseInt(monthLabel) - 1;
        var yearLabel = keys[j].substring(2, 6);
        var count = awardsCount[keys[j]][0];
        var weekly = awardsCount[keys[j]][1];
        var monthly = awardsCount[keys[j]][2];
        var dateLabel = months[monthPosition] + " " + yearLabel;
        table.push([dateLabel, count, weekly, monthly]);
    }
    data.addRows(table);
    // Set chart options
    var options = {
        'title': 'Awards by month',
        curveType: 'function',
        'width': 400,
        'height': 300,
        legend: { position: 'bottom' }
    };
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.LineChart(document.getElementById('report'));
    chart.draw(data, options);

}

/*
  Renders pie chart showing distribution of awards created by who created them
*/
function getAwardsCreatedChart(json) {
    var data = new google.visualization.DataTable();

    showFields('#report_area');
    data.addColumn('string', 'Name');
    data.addColumn('number', 'count');

    var size = Object.keys(json).length;
    var awardsCount = {};
    for (i = 0; i < json.length; i++) {
        var id = json[i]['user_id'];
        if (!awardsCount.hasOwnProperty(id)) {
            awardsCount[id] = 1;
        } else {
            awardsCount[id] += 1;
        }
    }
    var table = new Array();
    var keys = Object.keys(awardsCount);
    for (j = 0; j < keys.length; j++) {
        var id = keys[j];
        url = "/get-user" + "?id=" + id;
        fetch(url).then(function (response) {
            if (response.ok) {
                response.json().then(function (json) {
                    var userData = json[0];
                    var name = userData.fname + " " + userData.lname;
                    var count = Number(awardsCount[userData.id]);
                    table.push([name, count]);

                    console.log(table);
                    if (table.length === keys.length) {
                        data.addRows(table);
                        // Set chart options
                        var options = {
                            'title': 'Who is making awards',
                            'width': 400,
                            'height': 300
                        };

                        // Instantiate and draw our chart, passing in some options.
                        var chart = new google.visualization.PieChart(document.getElementById('report'));
                        chart.draw(data, options);
                    }
                });
            } else {
                console.log("error");
            }
        });
    }

}


