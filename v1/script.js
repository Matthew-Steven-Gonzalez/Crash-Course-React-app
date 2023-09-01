const CATEGORIES = [
    { name: "technology", color: "#3b82f6" },
    { name: "science", color: "#16a34a" },
    { name: "finance", color: "#ef4444" },
    { name: "society", color: "#eab308" },
    { name: "entertainment", color: "#db2777" },
    { name: "health", color: "#14b8a6" },
    { name: "history", color: "#f97316" },
    { name: "news", color: "#8b5cf6" },
];


const initialFacts = [
    {
        id: 1,
        text: "React is being developed by Meta (formerly facebook)",
        source: "https://opensource.fb.com/",
        category: "technology",
        votesInteresting: 24,
        votesMindblowing: 9,
        votesFalse: 4,
        createdIn: 2021,
    },
    {
        id: 2,
        text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
        source:
            "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
        category: "society",
        votesInteresting: 11,
        votesMindblowing: 2,
        votesFalse: 0,
        createdIn: 2019,
    },
    {
        id: 3,
        text: "Lisbon is the capital of Portugal",
        source: "https://en.wikipedia.org/wiki/Lisbon",
        category: "society",
        votesInteresting: 8,
        votesMindblowing: 3,
        votesFalse: 1,
        createdIn: 2015,
    },
];


//selecting DOM elements
const formStatus = document.querySelector(".formBtn");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");

//creating DOM elements
factsList.innerHTML = "";


//loading data

loadFacts();


async function loadFacts() {
    const res = await fetch("https://vfmozptpadnkckfsiviv.supabase.co/rest/v1/Facts", {
        headers: {
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbW96cHRwYWRua2NrZnNpdml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMzNDg4MDIsImV4cCI6MjAwODkyNDgwMn0.h83eFCcAUxXW2ZGPuoyGpXbvU4SdB3RuXe7kLEf_xJ4",
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbW96cHRwYWRua2NrZnNpdml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMzNDg4MDIsImV4cCI6MjAwODkyNDgwMn0.h83eFCcAUxXW2ZGPuoyGpXbvU4SdB3RuXe7kLEf_xJ4"
        }
    });

    const data = await res.json();

    const filteredData = data.filter((fact) => fact.category == "society");

    console.log(filteredData);

    createFactsList(data);



}






//to hide form
formStatus.addEventListener("click", function () {

    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        formStatus.textContent = "CANCEL";
    }
    else {
        form.classList.add('hidden');
        formStatus.textContent = "SHARE A FACT";
    }
});


console.log(CATEGORIES.find((cat) => cat.name === 'society'));



function createFactsList(dataArray) {

    const htmlArr = dataArray.map(
        (fact) =>
            `<li class="fact">
            <p>${fact.text}
            <a class="source"
                href="${fact.source}"
                target="_blank">(Source)</a>
        </p>
        <span class="tag" style="background-color:${CATEGORIES.find((cat) => cat.name === fact.category).color}">${fact.category}</span>

        <div class="vote-buttons">
            <button>👍 ${fact.thumbsUp}</button>
            <button>🤯 ${fact.mindBlowing}</button>
            <button>⛔️ ${fact.falseFact}</button>
        </div>
        

`);

    const html = htmlArr.join("");

    factsList.insertAdjacentHTML("afterbegin", html);

}

