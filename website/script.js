
// Current mission
let STATE = -1;

// Current secondary scroller
let IMLOAD = null;

const CATEGORIES = ["Rule of Law", "Governance", "Political Competition", "Civil Society", "Media", "Human Rights"];

let ACTIVE1 = null;
let ACTIVE2 = null;
let THRESHOLD = 0.9;

/***********************************************************************/
function loadMission(nstate){
    STATE = nstate;
    loadIM(mdata[STATE], "IMs");
    loadContent(-1, 0);
}


function loadIM(nim, title){
    // No need to reload
    if (IMLOAD == nim){
        return;
    }

    // Get parent
    const parent = document.querySelector("#ibar");

    // Destroy previous elements 
    if (IMLOAD != null){
        // Destroy all elements after the first child
        let child = parent.firstElementChild;
        child.textContent = title;
        while (child.nextElementSibling){
            parent.removeChild(child.nextElementSibling);
        }
    }

    IMLOAD = nim;

    // Load the current IMLOAD
    for (let i = 0; i < IMLOAD.length; i++){
        let li = document.createElement("a");
        li.textContent = IMLOAD[i][1] + ": " + IMLOAD[i][2];
        parent.appendChild(li);
        li.addEventListener("click", (e)=>{
            if (ACTIVE2 == li){
                ACTIVE2.style.backgroundColor = "";
                ACTIVE2 = null;
                loadMission(STATE);
                return;
            }


            loadContent(i, 0);
            if (ACTIVE2 != null){
                ACTIVE2.style.backgroundColor = "";
            }
            li.style.backgroundColor = "lightgreen";
            ACTIVE2 = li;
        });
    }
}


function twoCellTable(tbody, left, right){
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");

    td1.textContent = left;
    td2.textContent = right;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tbody.appendChild(tr);
}

function insertSimple(par, tag, text, cls){
    let elem = document.createElement(tag);
    elem.textContent = text;
    if (cls != ""){
        elem.classList.add(cls);
    }
    par.appendChild(elem);
    return elem;
}

function addToTableRow(row, text){
    let elem = document.createElement("td");
    elem.textContent = text;
    row.appendChild(elem);
}


// Loads the main text frame
// * Load the mission summary, ctag = -1
// * Load the IM contents, ctag >= 0
function loadContent(CTAG, CTYPE){
    // Get parent
    const parent = document.querySelector("#content-panel");

    // Remove all children
    while (parent.firstChild) {
        parent.firstChild.remove();
    }

    if (CTAG == -1){
        // Load the mission summary
        let title = document.createElement("div");
        title.textContent = mdata[STATE][0][0];
        parent.appendChild(title);
        

        for(let i = 0; i < CATEGORIES.length; i++){
            let elem = document.createElement("button");
            elem.textContent = "" + CATEGORIES[i] + ":" + pdr[STATE][i].length;
            elem.addEventListener("click", (e)=>{
                // Get IMs that are only on the list
                let sub = pdr[STATE][i].map(i2 => mdata[STATE][i2]);
                loadIM(sub,  CATEGORIES[i] + " IMs");
            });
            parent.appendChild(elem);
        }

    } else if (CTAG >= 0){
        // Load a specific IM
        let im = IMLOAD[CTAG];

        // Table Summary
        if (CTYPE == 0){

            // Identify a DR category
            insertSimple(parent, "h3", "DR Topics", "IM");
            for (let i = 0; i < CATEGORIES.length; i++){
                if (im[im.length - CATEGORIES.length + i] > THRESHOLD){
                    insertSimple(parent, "p", CATEGORIES[i] + " program", "IM");
                }
            }

            
            // Create table with info
            insertSimple(parent, "h3", "General Information", "IM");
            let table = document.createElement("table");
            table.classList.add("IM");

            //
            let colgroup = document.createElement("colgroup");
            let col = document.createElement("col");
            colgroup.appendChild(col);

            //
            let tbody = document.createElement("tbody");
            twoCellTable(tbody, "IM #", im[1]);
            twoCellTable(tbody, "Name", im[2]);
            twoCellTable(tbody, "Partner", im[3]);
            twoCellTable(tbody, "Award #", im[4]);
            twoCellTable(tbody, "IM Type", im[5]);
            twoCellTable(tbody, "Source", im[6]);
            twoCellTable(tbody, "Implementer", im[7]);
            twoCellTable(tbody, "PPARM", im[8]);
            twoCellTable(tbody, "Funding", im[9]);
            twoCellTable(tbody, "Start", im[10]);
            twoCellTable(tbody, "End", im[11]);
            twoCellTable(tbody, "Cost", im[12]);

            //
            table.append(colgroup);
            table.appendChild(tbody);
            parent.appendChild(table);
            
            let but1 = insertSimple(parent, "button", "Narrative", "IM");
            but1.addEventListener("click", (e)=>{
                loadContent(CTAG, 1);
            });

            let but2 = insertSimple(parent, "button", "Funding", "IM");
            but2.addEventListener("click", (e)=>{
                loadContent(CTAG, 2);
            });

            // Insert keywords list
            insertSimple(parent, "h3", "Keywords", "IM");
            let t2 = insertSimple(parent, "table", "", "IM");

            //
            let cgroup2 = document.createElement("colgroup");
            let col2 = document.createElement("col");
            cgroup2.appendChild(col2);
            t2.appendChild(cgroup2);

            // 
            let t2body = insertSimple(t2, "tbody", "", "");
            for (let i = 0; i < CATEGORIES.length; i++){
                twoCellTable(t2body, CATEGORIES[i], im[21 + i]);
            }
            

        } else if (CTYPE == 1){
            insertSimple(parent, "h3", "Narrative", "IM");
            insertSimple(parent, "p", im[13], "IM");
            insertSimple(parent, "h3", "Summary", "IM");
            insertSimple(parent, "p", im[41], "IM");   
        } else if (CTYPE == 2){
            let table = document.createElement("table");
            table.classList.add("IM");

            //
            let tbody = document.createElement("tbody");
            let base = document.createElement("tr");
            addToTableRow(base, "SPSD");
            addToTableRow(base, "Account");
            addToTableRow(base, "MO");
            addToTableRow(base, "Program");
            addToTableRow(base, "Program Unit");
            addToTableRow(base, "Benefiting Country");
            addToTableRow(base, "Direct Funding");
            addToTableRow(base, "PO Total");
            addToTableRow(base, "Total Funding");
            tbody.appendChild(base);
            
            if (im[14] == -1){
                console.log("early exit");
                return;
            }
            
            let funding = fsum[im[14]];
            for(let i2 = 0; i2 < funding.length; i2++){
                let nrow = document.createElement("tr");
                for (let i3 = 0; i3 < funding[i2].length - 1; i3++){
                    addToTableRow(nrow, funding[i2][i3]);
                }
                tbody.appendChild(nrow);
            }

            //
            table.appendChild(tbody);
            parent.appendChild(table);
        }



    } else {
        console.log("Unrecognized tag!");
    }

}



/**********************************************************************/
// Listen for messages from the iframe
window.addEventListener('message', function(event) {
    // Handle the received message
    console.log(mmap[event.data - 108][1], "clicked!");
    document.querySelector("#mbar").children[mmap[event.data - 108][0] + 1].click();
});


// Load the missions
let mbar = document.querySelector("#mbar");
for (let i = 0; i < mdata.length; i++){
    let li = document.createElement("a");
    li.textContent = mdata[i][0][0];
    mbar.appendChild(li);
    li.addEventListener("click", (e)=>{
        loadMission(i);

        if (ACTIVE1 != null){
            ACTIVE1.style.backgroundColor = "";
        }

        if (ACTIVE2 != null){
            ACTIVE2.style.backgroundColor = "";
        }

        li.style.backgroundColor = "lightgreen";
        ACTIVE1 = li;
    });
}




