const send = document.getElementById("send");
const question = document.getElementById("question");
const messagesContainer = document.getElementById("messages");

const thinkingMessages = [
    "Thinking",
    "Just a moment",
    "Checking",
    "Let me think about this",
    "Hmmmm",
];

const askedQuestions = [];
let QnA = {};

let lastInteractionTime = new Date().getTime();
let sentStillHere = false;
let gotUnknown = false;

function nextMessage() {
    lastInteractionTime = new Date().getTime();
    sentStillHere = false;
    question.setAttribute("disabled", "true");
    send.setAttribute("disabled", "true");
    const questionVal = question.value;
    question.value = "";
    const newMessageDiv = document.createElement("div");
    newMessageDiv.className = "question";
    newMessageDiv.innerText = questionVal.trim();
    messagesContainer.appendChild(newMessageDiv);
    const newMessageTimeDiv = document.createElement("div");
    newMessageTimeDiv.className = "question time";
    messagesContainer.appendChild(newMessageTimeDiv);
    newMessageTimeDiv.innerText = new Date().toLocaleTimeString();
    window.scrollTo(0, document.body.scrollHeight);

    const thinkingDiv = document.createElement("div");
    thinkingDiv.id = "thinking";
    thinkingDiv.className = "thinking";
    thinkingDiv.innerHTML = `<calcite-loader inline="true"></calcite-loader><span>${
        thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]
    }...</span>`;

    window.setTimeout(() => {
        messagesContainer.appendChild(thinkingDiv);
        window.scrollTo(0, document.body.scrollHeight);
    }, 500);

    window.setTimeout(() => {
        messagesContainer.removeChild(document.getElementById("thinking"));
        const newMessageDiv = document.createElement("div");
        newMessageDiv.className = "answer";
        const response = getAnswer(questionVal);
        newMessageDiv.innerHTML = response.answer;
        messagesContainer.appendChild(newMessageDiv);
        const newMessageTimeDiv = document.createElement("div");
        newMessageTimeDiv.className = "answer time";
        newMessageTimeDiv.innerText = new Date().toLocaleTimeString();
        messagesContainer.appendChild(newMessageTimeDiv);
        window.setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 100);

        if (!response.end) {
            question.removeAttribute("disabled");
            send.removeAttribute("disabled");
            question.setFocus();
            lastInteractionTime = new Date().getTime();
            sentStillHere = false;
        } else {
            sentStillHere = true;
            const newMessageDiv = document.createElement("div");
            newMessageDiv.className = "ending";
            newMessageDiv.innerText = "This chat has ended.";
            messagesContainer.appendChild(newMessageDiv);
            const newMessageTimeDiv = document.createElement("div");
            newMessageTimeDiv.className = "ending time";
            newMessageTimeDiv.innerText = new Date().toLocaleTimeString();
            messagesContainer.appendChild(newMessageTimeDiv);
            window.setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, 100);
        }
    }, Math.floor(Math.random() * 6500) + 1500);
}

function getAnswer(questionVal) {
    const greetings = ["hi", "hello", "bye", "yes", "no"];
    if (questionVal.toLowerCase().includes("help")) {
        const topics = Object.keys(QnA).filter(
            (questionKeyword) => greetings.indexOf(questionKeyword) === -1
        );
        return {
            answer: `I can respond to questions about ${topics
                .slice(0, topics.length - 1)
                .join(", ")}, and ${topics[topics.length - 1]}`,
            end: false,
        };
    }
    const possibleQuestions = Object.keys(QnA).filter(
        (questionKeyword) =>
            questionVal.toLowerCase().indexOf(questionKeyword.toLowerCase()) >
            -1
    );

    if (possibleQuestions.length > 0) {
        let answer = QnA[possibleQuestions[0]];
        if (askedQuestions.includes(possibleQuestions[0])) {
            answer = asStated(answer);
        } else {
            if (greetings.indexOf(possibleQuestions[0]) === -1) {
                askedQuestions.push(possibleQuestions[0]);
            }
        }
        return {
            answer,
            end: possibleQuestions[0] === "bye",
        };
    } else {
        if (!gotUnknown) {
            gotUnknown = true;
            return {
                answer: "<p>Hmmm... I don't seem to know this one. Sorry about this, I'm still learning.</p>",
                end: false,
            };
        } else
            return {
                answer: "<p>Sorry, I don't know this one either. Would you like to <a href='#'>send feedback</a>?</p>",
                end: false,
            };
    }
}

function asStated(answer) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = answer;

    const currentHTML = tempDiv.firstElementChild.innerHTML;

    tempDiv.firstElementChild.innerHTML =
        `As I've previously stated, ` +
        (currentHTML.charAt(1).toUpperCase() !== currentHTML.charAt(1)
            ? currentHTML.charAt(0).toLowerCase()
            : currentHTML.charAt(0)) +
        currentHTML.slice(1);
    return tempDiv.innerHTML;
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

fetch("./QnA.json")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        QnA = data;
        question.removeAttribute("disabled");
        send.removeAttribute("disabled");
    });

window.setInterval(() => {
    const secondsSince = (new Date().getTime() - lastInteractionTime) / 1000;
    console.log("We are checking", secondsSince);
    const newMessageDiv = document.createElement("div");
    if (secondsSince >= 120 && question.getAttribute("disabled") !== "true") {
        question.setAttribute("disabled", "true");
        send.setAttribute("disabled", "true");

        newMessageDiv.className = "ending";
        newMessageDiv.innerText = "This chat has ended.";

        messagesContainer.appendChild(newMessageDiv);
        const newMessageTimeDiv = document.createElement("div");
        newMessageTimeDiv.className = "ending time";
        newMessageTimeDiv.innerText = new Date().toLocaleTimeString();
        messagesContainer.appendChild(newMessageTimeDiv);
        window.setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 100);
    } else if (secondsSince >= 60 && !sentStillHere) {
        newMessageDiv.className = "answer";
        newMessageDiv.innerHTML = "Still there?";
        sentStillHere = true;

        messagesContainer.appendChild(newMessageDiv);
        const newMessageTimeDiv = document.createElement("div");
        newMessageTimeDiv.className = "answer time";
        newMessageTimeDiv.innerText = new Date().toLocaleTimeString();
        messagesContainer.appendChild(newMessageTimeDiv);
        window.setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 100);
    }
}, 10000);
