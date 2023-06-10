document.addEventListener("DOMContentLoaded", update);

async function update () {
    const budget = await fetchData();
    if (budget != null)
        loadBudget(budget);
    document.getElementById("add-savings").addEventListener("click",function(){addRow("savings",-1)});
    document.getElementById("add-expense").addEventListener("click",function(){addRow("expense",-1)});
    document.getElementById("add-income").addEventListener("click",function(){addRow("income",-1)});
    document.getElementById("submit").addEventListener("click", submit);
}

async function fetchData() {
    let response = await fetch("/get-budget");
    let budget = await response.json();
    return budget;
}

function loadBudget(budget){
    window.sessionStorage.setItem("income",JSON.stringify(budget.i));
    window.sessionStorage.setItem("expense",JSON.stringify(budget.e));
    window.sessionStorage.setItem("savings",JSON.stringify(budget.s));

    budget.i.forEach(e => {
        loadRow("income",e);
    });
    budget.e.forEach(e => {
        loadRow("expense",e);
    });
    budget.s.forEach(e => {
        loadRow("savings",e);
    });

    var tables = ["income","expense","savings",];
    tables.forEach(e =>{
        if(JSON.parse(window.sessionStorage.getItem(e)).length > 0){
            document.getElementById(e + "-table").classList.toggle("hidden");
            document.getElementById(e + "-overview-table").classList.toggle("hidden");
        }
    });
}

function loadRow(type,e){
    var table = document.getElementById(type + "-table");
    var row = document.createElement("tr");
    table.appendChild(row);
    var cellType = document.createElement("td");
    row.appendChild(cellType);
    var cellCost = document.createElement("td");
    row.appendChild(cellCost);
    var cellFreq = document.createElement("td");
    row.appendChild(cellFreq);
    var edit = document.createElement("td");
    row.appendChild(edit);
    var del = document.createElement("td");
    row.appendChild(del);

    cellType.innerHTML = e[0];
    cellCost.innerHTML = "$" + e[1];
    cellFreq.innerHTML = e[2];
    edit.innerHTML = "<button id='delete' type='button'>Edit</button>";
    edit.addEventListener("click", function(){editRow(type, edit.firstChild)});
    del.innerHTML = "<button id='delete' type='button'>Delete</button>";
    del.addEventListener("click", function(){removeRow(type, del.firstChild)});

    updateOverview();                
    var goalData = dateData(e[2],e[1]);

    var oTable = document.getElementById(type + "-overview-table");
    var oRow = oTable.insertRow();

    if (type == "savings"){
        var cellName = oRow.insertCell(0);
        var cellMonths = oRow.insertCell(1);
        var cellPay  = oRow.insertCell(2);
        cellName.innerHTML = e[0];
        cellMonths.innerHTML = goalData[0];
        cellPay.innerHTML = "$" + goalData[1];
    } else {
        var cellName = oRow.insertCell(0);
        var cellPay  = oRow.insertCell(1);
        cellName.innerHTML = e[0];
        cellPay.innerHTML = "$" + e[4];
    }
}

function addRow(type,index) {
    document.getElementById("edit-" + type).style.display = "none";
    document.getElementById("add-" + type).style.display = "block";  

    if (window.sessionStorage.getItem(type) == null){
       var data = [];
    } else {
        var data = JSON.parse(window.sessionStorage.getItem(type));
    }

    var valueType = document.getElementById(type + "-type").value;
    var custom = false;
    if (valueType == "custom"){
        custom = true;
        valueType = document.getElementById(type + "-custom").value;
        document.getElementById(type + "-custom").value = "";
        document.getElementById("hidden-" + type).style.display = "none";

    }
    var valueCost = parseInt(document.getElementById(type + "-cost").value);
    var valueFreq = document.getElementById(type + "-frequency").value;

    document.getElementById(type + "-type").value = "";
    document.getElementById(type + "-cost").value = "";
    document.getElementById(type + "-frequency").value = "";


    if (valueType != "" && valueCost != "" && valueFreq != ""){
        if (data.length == 0){
            document.getElementById(type + "-table").classList.toggle("hidden");
            document.getElementById(type + "-overview-table").classList.toggle("hidden");
        }
        if (index != -1){
            if (type == "savings"){
                var goalData = dateData(valueFreq,valueCost);
                data.splice(index-1,1,[valueType,valueCost,valueFreq,custom,goalData[0],goalData[1]]);
                window.sessionStorage.setItem(type, JSON.stringify(data));
            } else {
                if (valueFreq == "Weekly")
                    var pay = valueCost*4;
                else
                    var pay = valueCost;
                data.splice(index-1,1,[valueType,valueCost,valueFreq,custom,pay]);
                window.sessionStorage.setItem(type, JSON.stringify(data));
            }
            var table = document.querySelector("." + type+ " table");
            table.rows[index].cells[0].innerHTML = valueType;
            table.rows[index].cells[1].innerHTML = "$" + valueCost;
            table.rows[index].cells[2].innerHTML = valueFreq;
        } else {
            if (type == "savings"){
                var goalData = dateData(valueFreq,valueCost);
                data.push([valueType,valueCost,valueFreq,custom,goalData[0],goalData[1]]);
                window.sessionStorage.setItem(type, JSON.stringify(data));
            } else {
                if (valueFreq == "Weekly")
                    var pay = valueCost*4;
                else
                    var pay = valueCost;
                data.push([valueType,valueCost,valueFreq,custom,pay]);
                window.sessionStorage.setItem(type, JSON.stringify(data));
            }
            
            var table = document.getElementById(type + "-table");
            var row = table.insertRow(index);
            var cellType = row.insertCell(0);
            var cellCost = row.insertCell(1);
            var cellFreq = row.insertCell(2);
            var edit = row.insertCell(3);
            var del = row.insertCell(4);
        
            cellType.innerHTML = valueType;
            cellCost.innerHTML = "$" + valueCost;
            cellFreq.innerHTML = valueFreq;
            edit.innerHTML = "<button id='delete' type='button'>Edit</button>";
            edit.addEventListener("click", function(){editRow(type, edit.firstChild)});
            del.innerHTML = "<button id='delete' type='button'>Delete</button>";
            del.addEventListener("click", function(){removeRow(type, del.firstChild)});
        }

        var oTable = document.getElementById(type + "-overview-table");

        if (index != -1){
            if(type == "savings"){
                oTable.rows[index].cells[0].innerHTML = valueType;
                oTable.rows[index].cells[1].innerHTML = goalData[0];
                oTable.rows[index].cells[2].innerHTML = "$" + goalData[1];
            } else {
                oTable.rows[index].cells[0].innerHTML = valueType;
                oTable.rows[index].cells[1].innerHTML = "$" + pay;
            }
        } else {
            var oRow = oTable.insertRow();
            if (type == "savings"){
                var cellName = oRow.insertCell(0);
                var cellMonths = oRow.insertCell(1);
                var cellPay  = oRow.insertCell(2);
                cellName.innerHTML = valueType;
                cellMonths.innerHTML = goalData[0];
                cellPay.innerHTML = "$" + goalData[1];
            } else {
                var cellName = oRow.insertCell(0);
                var cellPay  = oRow.insertCell(1);
                cellName.innerHTML = valueType;
                cellPay.innerHTML = "$" + pay;
            }
        }     
    }
    updateOverview();
}

function removeRow(type, btn){
    var td = btn.parentNode;
    var tr = td.parentNode;
    var index = tr.rowIndex;

    var data = JSON.parse(window.sessionStorage.getItem(type));
    data.splice(tr.rowIndex-1,1)
    window.sessionStorage.setItem(type,JSON.stringify(data));

    tr.parentNode.removeChild(tr);
    if (data.length == 0){
        document.getElementById(type + "-table").classList.toggle("hidden");
        document.getElementById(type + "-overview-table").classList.toggle("hidden");
    }
        
    updateOverview();

    var table = document.getElementById(type + "-overview-table");
    table.deleteRow(index);
}

function editRow(type,btn){
    var data = JSON.parse(window.sessionStorage.getItem(type));

    var td = btn.parentNode;
    var tr = td.parentNode;
    index = tr.rowIndex;
	
    if (data[index-1][3] == true){
        document.getElementById("hidden-" + type).style.display = "block";
        document.getElementById(type + "-type").value = "custom";
        document.getElementById(type + "-custom").value = data[index-1][0];
        document.getElementById(type + "-cost").value = data[index-1][1];
        document.getElementById(type + "-frequency").value = data[index-1][2];
    } else {
        document.getElementById(type + "-type").value = data[index-1][0];
	    document.getElementById(type + "-cost").value = data[index-1][1];
        document.getElementById(type + "-frequency").value = data[index-1][2];
    }

	document.getElementById("edit-" + type).style.display = "block";
    document.getElementById("add-" + type).style.display = "none";

    document.getElementById("edit-" + type).addEventListener("click",function(){addRow(type,index)});
}

function submit() {
    if (window.sessionStorage.getItem("expense") != null){
        var expenses = JSON.parse(window.sessionStorage.getItem("expense"));
    } else 
        var expenses = [];
    if (window.sessionStorage.getItem("savings") != null){
        var savings = JSON.parse(window.sessionStorage.getItem("savings"));
    } else 
        var savings = [];
    if (window.sessionStorage.getItem("income") != null){
        var income = JSON.parse(window.sessionStorage.getItem("income"));
    } else 
        var income = [];
    if (window.sessionStorage.getItem("totalData") != null){
        var total = JSON.parse(window.sessionStorage.getItem("totalData"));
    } else 
        var total = [];

    var valid = false;
    var error = document.querySelector("#error-msg p");

    if (income.length > 0)
        valid = true;
    if (valid){
        if(total.net >= 0){
            var budget = {
                i:income,
                e:expenses,
                s:savings
            }
            
            window.sessionStorage.clear();
            error.innerHTML = "";
            
            var data = JSON.stringify(budget);

            fetch("/save-budget", 
            {
                method: "POST",
                headers : {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: data
            })
            .then(function(){ window.location.href = "/"})
            .catch(error => {
                console.log("Error: " + error);
            })

        } else {
            error.innerHTML = "Cannot Create Budget, Negative Balance";
        }
    } else
        error.innerHTML = "Cannot Create Budget, No Income added";
}

function updateOverview(){
    if (window.sessionStorage.getItem("expense") != null){
        var expenses = JSON.parse(window.sessionStorage.getItem("expense"));
    } else 
        var expenses = [];
    if (window.sessionStorage.getItem("savings") != null){
        var savings = JSON.parse(window.sessionStorage.getItem("savings"));
    } else 
        var savings = [];
    if (window.sessionStorage.getItem("income") != null){
        var income = JSON.parse(window.sessionStorage.getItem("income"));
    } else 
        var income = [];

    var total = {
        iTotal: 0,
        eTotal: 0,
        sTotal: 0,
        net: 0
    };

    income.forEach(e => {
        total.iTotal += e[4];
    });

    expenses.forEach(e => {
        total.eTotal += e[4];
    });

    savings.forEach(e => {
        total.sTotal += e[5];
    });

    total.net = total.iTotal - total.eTotal - total.sTotal;

    window.sessionStorage.setItem("totalData",JSON.stringify(total));

    document.querySelector("#income-overview span").innerHTML = total.iTotal;
    document.querySelector("#expense-overview span").innerHTML = total.eTotal;
    document.querySelector("#savings-overview span").innerHTML = total.sTotal;
    document.querySelector("#balance span").innerHTML = total.net;

    if (total.net < 0)
        document.querySelector("#balance span").style.color = "red";
    else if (total.net > 0)
        document.querySelector("#balance span").style.color = "green";

}

function dateData (date, cost){
    const d = new Date();
    const mm = d.getMonth();
    const yyyy = d.getYear();

    var nDate = new Date(date);
    var diff = ((nDate.getYear()-yyyy)*12) + (nDate.getMonth() - mm)+1;
    var payment = Math.ceil(cost/diff);
    var x = [diff, payment];
    return x;
}

function toggleHidden(btn, id){
    var x = document.getElementById(id);
    x.classList.toggle("hidden");
    if (btn.innerHTML == "+")
        btn.innerHTML = "-";
    else
        btn.innerHTML = "+";
}

function showDiv(divId){
    var x = document.getElementById(divId);
    x.classList.toggle("hidden");
}

function showHidden (divId, input, val){
    if(input.value == val){
        document.getElementById(divId).style.display = "block";
    } else {
        document.getElementById(divId).style.display = "none";
    }
}