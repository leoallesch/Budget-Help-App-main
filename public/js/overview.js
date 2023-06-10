window.addEventListener("DOMContentLoaded", function(){update()});

async function fetchData() {
    let response = await fetch("/get-budget");
    let budget = await response.json();
    return budget;
}

async function fetchTransData() {
    let response = await fetch("/get-transactions");
    let transData = await response.json();
    return transData;
}

function updateTrans(transData, budgetTypes){
    let today = new Date();
    let month = today.getMonth();

    var budgetValues = {};
    budgetTypes.forEach(e => {
        budgetValues[e] = 0;
    });

    transData.forEach(e => {
        let tempMonth = new Date(e.date).getMonth();
        if (tempMonth == month){
            budgetValues[e.budget] += e.amount;
        }
    });
    return budgetValues;
}

async function update(){
    const budget = await fetchData();
    const transData = await fetchTransData();
    
    if(budget.i.length > 0 || budget.e.length > 0 || budget.s.length > 0){

        var budgetTypes = [];

        budget.e.forEach(e => {
            if(!budgetTypes.includes(e[0]))
                budgetTypes.push(e[0]);
        });
        budget.i.forEach(e => {
            if(!budgetTypes.includes(e[0]))
                budgetTypes.push(e[0]);
        });
        budget.s.forEach(e => {
            if(!budgetTypes.includes(e[0]))
                budgetTypes.push(e[0]);
        });

        var budgetValues = updateTrans(transData, budgetTypes);

        document.getElementById("create").classList.toggle("hidden");
        document.getElementById("overview").classList.toggle("hidden");
        document.getElementById("recent-transactions").classList.toggle("hidden");
        var ul = document.getElementById("overview-list");

        budget.i.forEach(e => {
            var li = document.createElement("li");
            li.classList.add("budget-item");
            ul.appendChild(li);

            var nameDiv = document.createElement("div");
            nameDiv.classList.add("budget-name");
            nameDiv.innerHTML = e[0];
            li.appendChild(nameDiv);

            var barDiv = document.createElement("div");
            barDiv.classList.add("budget-bar");
            li.appendChild(barDiv);

            var percentDiv = document.createElement("div");
            percentDiv.classList.add("budget-percentage");
            var p = Math.floor((budgetValues[e[0]]/e[4])*100);
            if (p > 100)
                p = 100;
            percentDiv.style.width = p + "%";
            barDiv.appendChild(percentDiv);

            var currentVal = document.createElement("span");
            currentVal.classList.add("current-value");
            currentVal.innerHTML = "$" + budgetValues[e[0]];
            if (p > 20)
                currentVal.style.color = "white";
            percentDiv.appendChild(currentVal);

            var totalDiv = document.createElement("div");
            totalDiv.classList.add("total-value");
            totalDiv.innerHTML = "$" + e[4];
            li.appendChild(totalDiv);
        });

        budget.e.forEach(e => {
            var li = document.createElement("li");
            li.classList.add("budget-item");
            ul.appendChild(li);

            var nameDiv = document.createElement("div");
            nameDiv.classList.add("budget-name");
            nameDiv.innerHTML = e[0];
            li.appendChild(nameDiv);

            var barDiv = document.createElement("div");
            barDiv.classList.add("budget-bar");
            li.appendChild(barDiv);

            var percentDiv = document.createElement("div");
            percentDiv.classList.add("budget-percentage");
            var p = Math.floor((budgetValues[e[0]]/e[4])*100);
            if (p > 100)
                p = 100;
            percentDiv.style.width = p + "%";
            percentDiv.style.backgroundColor = "red";
            barDiv.appendChild(percentDiv);

            var currentVal = document.createElement("span");
            currentVal.classList.add("current-value");
            currentVal.innerHTML = "$" + budgetValues[e[0]];
            if (p > 20)
                currentVal.style.color = "white";
            percentDiv.appendChild(currentVal);

            var totalDiv = document.createElement("div");
            totalDiv.classList.add("total-value");
            totalDiv.innerHTML = "$" + e[4];
            li.appendChild(totalDiv);
        })

    } else {
        var x = document.getElementById("overview");
        x.classList.add("hidden");
    }
}