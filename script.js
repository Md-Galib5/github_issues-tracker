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
const modal = document.getElementById("issue-modal");
    const modalelement = document.getElementById("modal-element");

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
        document.getElementById("card-section").classList.add("hidden");
    }
    else{
        document.getElementById("card-section").classList.remove("hidden");
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


const levels = (labels) => {
    let labelHtml = "";

    for (let label of labels){

        if (label === "bug"){
            labelHtml += `
            <p class="inline-flex items-center gap-1 h-6 px-4 py-4 text-s bg-red-200 text-red-600 rounded-full">
                <i class="fa-solid fa-bug"></i> Bug
            </p>
            `;
        }

        else if (label === "help wanted"){
            labelHtml += `
            <p class="inline-flex items-center gap-1 h-6 px-2 py-4 text-s bg-yellow-200 text-yellow-700 rounded-full">
                <i class="fa-brands fa-chrome"></i> Help Wanted
            </p>
            `;
        }

        else if (label === "enhancement"){
            labelHtml += `
            <p class="inline-flex items-center gap-1 h-6 px-2 py-4 text-s bg-green-200 text-green-700 rounded-full">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Enhancement
            </p>
            `;
        }

        else if (label === "documentation"){
            labelHtml += `
            <p class="inline-flex items-center gap-1 h-6 px-2 py-4 text-s bg-blue-200 text-blue-700 rounded-full">
                <i class="fa-solid fa-file"></i> Documentation
            </p>
            `;
        }

        else if (label === "good first issue"){
            labelHtml += `
            <p class="inline-flex items-center gap-1 h-6 px-3 py-4 text-s bg-pink-200 text-pink-600 rounded-full">
                <i class="fa-solid fa-clover"></i> Good First Issue
            </p>
            `;
        }
    }

    return labelHtml;
};

const singleIssues = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then((res) => res.json())
    .then((json) => displayModal(json.data));
};


const display = (issues) => {
    const card = document.getElementById("card-section");
    card.innerHTML = "";

    for (let issue of issues) {
        const cardDiv = document.createElement("div");

        cardDiv.addEventListener("click", () => {
            singleIssues(issue.id);
        });

        cardDiv.className = `bg-white p-10 shadow rounded-2xl space-y-4 border-t-4 ${
            issue.status === "open" ? "border-green-500" : "border-purple-500"
        }`;
         labelsHTML = levels(issue.labels);
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
                 <div class="flex items-center gap-2 flex-wrap">
                  ${labelsHTML}
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


const displayModal = (issue) => {
    // const modal = document.getElementById("issue-modal");
    // const modalelement = document.getElementById("modal-element");

    const labelsHtml = levels(issue.labels);

    modalelement.innerHTML = `
    <div class="space-y-4 bg-white p-5">
        <h3 class="text-xl text-prim font-semibold">${issue.title}</h3>
        <div class="flex items-center gap-4">
            <p class=" px-3 py-1 text-white text-center items-center ${issue.status === "open" ? "bg-green-700" : "bg-purple-500"} rounded-3xl">${issue.status === "open" ? issue.status + "ed" : issue.status}</p>
            <p class="text-p"> •  ${issue.status === "open" ? "Opended" : "Closed"} by ${issue.author ? issue.author : "N/A"}  •  ${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "N/A"}</p>
        </div>
         <div class="flex items-center gap-2">
            ${labelsHtml}
        </div>
        <p class="pcolor">${issue.description}</p>
        <div class="flex justify-between bg-gray-100 rounded-xl p-3">
      <div class="space-y-1.5">
        <p class="pcolor">Assignee:</p>
        <h4 class="font-semibold text-xl">${issue.assignee ? issue.assignee : "N/A"}</h4>
      </div>
      <div class="space-y-1.5">
        <p class="pcolor">Prioty:</p>
        <p class=" px-3 py-1 ${issue.priority === "high" ? "bg-red-200 text-red-600" : issue.priority === "medium" ?  "bg-yellow-200 text-yellow-600" : "bg-gray-200 text-gray-600"} rounded-3xl">${issue.priority}</p>
      </div>
    </div>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-primary">Close</button>
          </form>
        </div>
    </div>
    `;
    modal.showModal();
}

loadIssues();