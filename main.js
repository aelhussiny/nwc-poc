const send = document.getElementById("send");
const question = document.getElementById("question");
const messagesContainer = document.getElementById("messages");

let tracker = 0;

const responses = [
    "According to NWC's operations layer, there is an ongoing valve maintenance in your area. Water pressure is expected to normalize by <b>6 PM today</b>. You can view live service status <a href='#'>here</a>. Would you like to <a href='#'>file a report?</a>",
    "The NRW rate in Jeddah currently stands at <b>22.6%</b>. Explore detailed breakdowns by pressure zone and DMA on the <a href='#'>NRW Analytics Dashboard</a>.",
    "NWC is <b>currently upgrading</b> pipelines in your area. View project locations and timelines on the <a href='#'>Infrastructure Projects Map</a>.",
];

function nextMessage() {
    question.setAttribute("disabled", "true");
    send.setAttribute("disabled", "true");
    const questionVal = question.value;
    question.value = "";
    const newMessageDiv = document.createElement("div");
    newMessageDiv.className = "question";
    newMessageDiv.innerText = questionVal;
    messagesContainer.appendChild(newMessageDiv);
    window.scrollTo(0, document.body.scrollHeight);

    const thinkingDiv = document.createElement("div");
    thinkingDiv.id = "thinking";
    thinkingDiv.className = "thinking";
    thinkingDiv.innerHTML = `<calcite-loader inline="true"></calcite-loader><span>Thinking...</span>`;
    window.setTimeout(() => {
        messagesContainer.appendChild(thinkingDiv);
        window.scrollTo(0, document.body.scrollHeight);
    }, 500);

    window.setTimeout(() => {
        messagesContainer.removeChild(document.getElementById("thinking"));
        const newMessageDiv = document.createElement("div");
        newMessageDiv.className = "answer";
        newMessageDiv.innerHTML = responses[tracker];
        messagesContainer.appendChild(newMessageDiv);
        window.scrollTo(0, document.body.scrollHeight);
        if (tracker < responses.length - 1) {
            question.removeAttribute("disabled");
            send.removeAttribute("disabled");
            question.setFocus();
            tracker++;
        } else {
            question.setAttribute("disabled", "true");
            send.setAttribute("disabled", "true");
            const endChatDiv = document.createElement("div");
            endChatDiv.className = "ending";
            endChatDiv.innerText = "This chat has ended.";
            messagesContainer.appendChild(endChatDiv);
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, Math.floor(Math.random() * 6500) + 1500);
}

send.addEventListener("click", () => {
    if (question.value.length > 0) {
        nextMessage();
    }
});
question.addEventListener("keyup", function (event) {
    if (event.key === "Enter" && question.value.length > 1) {
        nextMessage();
    }
});
