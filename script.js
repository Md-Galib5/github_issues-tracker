const allbtn = document.getElementById("allbtn");
const openbtn = document.getElementById("openbtn");
const closebtn = document.getElementById("closebtn");

let status = allbtn;

const loadIssues = () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then((res) => res.json())
        .then((data) => display(data.data));
};

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
                <p class="px-3 py-1 ${
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
                <div class="mt-4">
                    <p class="text-p">
                        ${issue.author || "N/A"} <br>
                        ${issue.createdAt || "N/A"} <br>
                        ${issue.assignee || "N/A"} <br>
                        ${issue.updatedAt || "N/A"}
                    </p>
                </div>
            </div>
        `;

        card.appendChild(cardDiv);
    }
};

loadIssues();