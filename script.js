const allbtn = document.getElementById("allbtn");
const openbtn = document.getElementById("openbtn");
const closebtn = document.getElementById("closebtn");
let Open = [];
let Closed = [];
// let status = "allbtn";
let currentStatus = "allbtn";
const totalcount = document.getElementById("count");
const cardsection = document.getElementById("card-section");
const searchInput = document.getElementById("searchInput");


searchInput.addEventListener("input", (e) => {
    const searchText = e.target.value.trim().toLowerCase();

    if (searchText === "") {
        loadIssues();
        return;
    }

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`)
        .then(res => res.json())
        .then(data => display(data.data));
});

function toggleStyle(id){
    allbtn.classList.remove('btn-primary');
    openbtn.classList.remove('btn-primary');
    closebtn.classList.remove('btn-primary');

    allbtn.classList.add('btn-soft');
    openbtn.classList.add('btn-soft');
    closebtn.classList.add('btn-soft');

    const status = document.getElementById(id);
    currentStatus = id;

    status.classList.remove('btn-soft');
    status.classList.add('btn-primary');
};

allbtn.addEventListener("click", () => {
    toggleStyle("allbtn");
    display([...Open, ...Closed]);
});

openbtn.addEventListener("click", () => {
    toggleStyle("openbtn");
    display(Open);
});

closebtn.addEventListener("click", () => {
    toggleStyle("closebtn");
    display(Closed);
});


const loadIssues = () => {
    manageSpiner(true);
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then((res) => res.json())
        .then((data) => {
            const item = data.data;
            Open = item.filter(item => item.status === "open");
            Closed = item.filter(item => item.status === "closed");
            display(item);
        });
};

const manageSpiner = (isclicked) => {
    if(isclicked == true){
        document.getElementById("spiner").classList.remove("hidden");
        document.getElementById("container").classList.add("hidden");
    }
    else{
        document.getElementById("container").classList.remove("hidden");
        document.getElementById("spiner").classList.add("hidden");
    }
};

function calculate(){
    totalcount.innerText = cardsection.children.length;
    if(currentStatus === 'allbtn'){
        totalcount.innerText =  cardsection.children.length;
    }
    else if (currentStatus === "openbtn"){
        totalcount.innerText = Open.length;
    }
    else if (currentStatus === "closebtn"){
        totalcount.innerText = Closed.length;
    }
};
calculate();

const display = (issues) => {
    const card = document.getElementById("card-section");
    card.innerHTML = "";

    for (let issue of issues) {
        const cardDiv = document.createElement("div");

        cardDiv.className = `bg-white p-10 shadow rounded-2xl space-y-4 border-t-4 ${
            issue.status === "open" ? "border-green-500" : "border-purple-500"
        }`;

        cardDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <img src="${issue.status === "open" ? "./assets/Open-Status.png" : "./assets/Closed- Status .png"}">
                <p class="px-5 py-1 ${
                    issue.priority === "high"
                        ? "bg-red-200 text-red-600"
                        : issue.priority === "medium"
                        ? "bg-yellow-200 text-yellow-600"
                        : "bg-gray-200 text-gray-600"
                } rounded-4xl">${issue.priority}</p>
            </div>

            <div class="space-y-1.5">
                <h3 class="text-xl font-bold text-prim">${issue.title}</h3>
                <p class="text-p line-clamp-2">${issue.description}</p>
            </div>

            <div class="flex items-center gap-6"></div>

            <div class="border-t border-gray-300">
                 <div class = "mt-4">
<p class="text-p text-[#64748B]">
#1 by ${issue.author || "N/A"} <br>
${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "N/A"} <br>
${issue.assignee || "N/A"} <br>
${issue.updatedAt ? new Date(issue.updatedAt).toLocaleDateString() : "N/A"}
</p>                </div>
            </div>
        `;

        card.appendChild(cardDiv);
        manageSpiner(false);
    };
    calculate();
};

loadIssues();