window.addEventListener("DOMContentLoaded", function(){update()});

async function fetchData() {
    let response = await fetch("/get-budget");
    let budget = await response.json();
    return budget;
}

async function update(){
    const budget = await fetchData();
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

    var dropdown = document.getElementById("budget-dropdown");
    var uDropdown = document.getElementById("update-budget-dropdown");

    budgetTypes.forEach(e => {
        var option = document.createElement("option");
        var uOption = document.createElement("option");
        option.value = e;
        option.text = e;
        uOption.value = e;
        uOption.text = e;
        dropdown.appendChild(option);
        uDropdown.appendChild(uOption);
    });
}

function edit(btn){
    document.getElementById("add-form").classList.toggle("hidden");
    document.getElementById("edit-form").classList.toggle("hidden");

    var index = btn.parentNode.parentNode.rowIndex;
    var cells = document.getElementById("trans-table").rows[index].cells;
    
    document.getElementById("trans_id").value = cells[0].innerHTML;
    document.getElementById("date").value = cells[1].innerHTML;
    document.getElementById("vender").value = cells[2].innerHTML;
    document.getElementById("amount").value = cells[3].firstElementChild.innerHTML;
    document.getElementById("update-budget-dropdown").value = cells[4].innerHTML;
}