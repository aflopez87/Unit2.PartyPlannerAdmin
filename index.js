// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2503-FTB-ET-WEB-PT";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// ==== States ====
let parties = [];
let selectedParty;

// Fetch all parties
const getParties = async ()=>{
    try{
        const response = await fetch(API);
        const info = await response.json();
        parties = info.data;
        // console.log(parties);
    }catch(e){
        console.error(e);
    };
};

// Fetch single party
const getParty = async (partyId)=>{
    try{
        const response = await fetch(API + "/" + partyId);
        const info = await response.json();
        selectedParty = info.data;
        // console.log(selectedParty);
        render();
        return selectedParty;
    }catch(e){
        console.error(e);
    };
};
// getParty(8617)

// CREATE/POST a party to the API
const addParty = async (party)=>{
    try{
        const response = await fetch(API, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(party)
        });
        const info = await response.json();
        const apiParty = info.data.party || info.data;
        await getParties();
        if (apiParty && apiParty.id) {
            await getParty(apiParty.id);
        }else{
            render();
        }
    }catch(err){
        console.log(err.message);
    };
};

// DELETE a selected artist from API
const deleteParty = async (partyId)=>{
    try{
    const response = await fetch(API+'/'+partyId, {
        method: "DELETE"
    });
    await response.json();
    }catch(err){
        console.log(err.message);
    };
};

// ==== Component Functions ====
// clicking name fetches information about single party from API
const singleEventItem = (party)=>{
    const $li = document.createElement("li");
    $li.innerHTML = `
        <p>${party.name}</p>
    `;
    $li.addEventListener("click", ()=>getParty(party.id));
        if (selectedParty && selectedParty.id === party.id){
            $li.classList.add("highlighted"); 
        };
    return $li;
};

// render list of party names
const partyList = ()=>{
    const $ul = document.createElement("ul");
    $ul.classList.add("events");
    const $parties = parties.map(singleEventItem);
    $ul.replaceChildren(...$parties);
    return $ul;
};

// add and eventListener to party give details of selected event
// render name, ID, date, description, and location of selected party
const partyDetail = ()=>{
    if (!selectedParty){
        const $p = document.createElement("p");
        $p.textContent = "Please select an event from the list"
        return $p;
    };
    const $party = document.createElement("div");
    $party.classList.add("party");
    $party.innerHTML = `
    <h3 id="party-name">${selectedParty.name} #${selectedParty.id}</h3>
    <p id="party-date">${selectedParty.date}</p>
    <p id="party-location">${selectedParty.location}</p>
    <p id="party-description">${selectedParty.description}</p>
    <button id="delete" class="details">Delete party</button> 
    `;

    $party.querySelector("#delete").addEventListener("click", async ()=>{
        await deleteParty(selectedParty.id);
        selectedParty = "";
        await getParties();
        render();
    });
    return $party;
};

// form to add parties
const addPartyItem = ()=>{
    const form = document.createElement("form");
    form.innerHTML =`
        <label for="name">Name:</label>
        <input name="name"/>
        
        <label for="description">Description:</label>
        <input name="description"/>
                
        <label for="date">Date:</label>
        <input type="date" name="date">

        <label for="location">Location:</label>
        <input name="location"/>
        
        <input type="submit" value="Add Party" id="submit"/>
    `;
    form.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const newParty ={
            name:e.target.name.value,
            description:e.target.description.value,
            date:new Date(e.target.date.value).toISOString(),
            location:e.target.location.value,
        };
        console.log("submitting party", newParty);
        await addParty(newParty);
        form.reset();
    });
 
    return form;
};

// ==== Render page ====
const render = async ()=>{
    const $app = document.querySelector("#app");
    $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
        <section id="upcoming">
            <div id="list-form">
            <h2>Upcoming Parties</h2>
            <div id="party-list"></div>
            </div>
            <div>
            <h2>Add a new party</h2>
            <form id="add-party-form"></form>
            </div>
        </section>
        <section id="details">
            <h2>Party Details</h2>
            <div id="party-details"></div>
        </section>
    </main>
    `;
    $app.querySelector("#party-list").replaceWith(partyList());
    $app.querySelector("#party-details").replaceWith(partyDetail());
    $app.querySelector("#add-party-form").replaceWith(addPartyItem());
};

const init = async ()=>{
    await getParties();
    render();
}

init();