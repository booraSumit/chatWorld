const socket = io("https://public-server.herokuapp.com/");
const msgContainer = document.querySelector(".msg-container");
const sendBtn = document.querySelector(".send-btn");
const msgInputField = document.querySelector("#send");
const userTyping = document.querySelector(".user__typing");
const onlineContainer = document.querySelector(".online-container");
const popUp = document.querySelector(".popup");

let userName = prompt("please enter your name");

// validate username length
while (!userName) {
  userName = prompt("please enter your name");
}
socket.emit("userJoin", userName);
socket.on("userJoin", (user) => {
  if (user) {
    renderUser(user);
  } else {
    userName = prompt("Name already taken Please enter different name");
    while (!userName) {
      userName = prompt("please enter your name");
    }
    if (userName.length > 12) {
      userName = prompt("your name too long ");
      while (!userName) {
        userName = prompt("please enter your name");
      }
    }

    socket.emit("userJoin", userName);
  }
});

// welcome popup message
socket.on("welcome", (user) => {
  popUp.innerHTML = `Welcome ${user}`;
  popUp.style.backgroundColor = "green";
  popUp.className = "popup slide";
  setTimeout(() => {
    popUp.classList.remove("slide");
  }, 2000);
});

// check for user typing section

let timout = undefined;

function timeoutFunction() {
  socket.emit("notTyping", false);
}

//typing notification event emit
msgInputField.addEventListener("input", (e) => {
  socket.emit("userTyping", userName);
  clearTimeout(timout);
  timout = setTimeout(timeoutFunction, 900);
});

//listen typing and not typing event
socket.on("userTyping", (user) => {
  userTyping.innerHTML = `${user} typing...`;
  msgContainer.append(userTyping);
  msgContainer.scrollTop =
    msgContainer.scrollHeight - msgContainer.offsetHeight;
});
socket.on("notTyping", (user) => {
  msgContainer.removeChild(userTyping);
  msgContainer.scrollTop =
    msgContainer.scrollHeight - msgContainer.offsetHeight;
});

//send a message
sendBtn.addEventListener("click", (e) => {
  socket.emit("notTyping", false);
  const msg = msgInputField.value.trim();

  if (msg.length == 0) return false;
  socket.emit("msg", { userName, msg });
  renderMsg({ userName, msg, type: "sender" });
  msgInputField.value = "";
});

// send message with enter key
msgInputField.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    socket.emit("notTyping", false);
    const msg = msgInputField.value.trim();
    if (msg.length == 0) return false;
    socket.emit("msg", { userName, msg });
    renderMsg({ userName, msg, type: "sender" });
    msgInputField.value = "";
  }
});

//receive message render on screen
socket.on("msg", (user) => {
  renderMsg(user);
});

//online users update
socket.on("online", (user) => {
  renderOnline(user);
});

// user left popup to all users
socket.on("left", (user) => {
  popUp.innerHTML = `${user.user} left`;
  popUp.style.backgroundColor = "red";
  popUp.className = "popup slide";
  setTimeout(() => {
    popUp.classList.remove("slide");
  }, 1500);
});

//function to show online users
function renderOnline(user) {
  onlineContainer.innerHTML = "";
  user.forEach((item) => {
    const h3 = document.createElement("h3");
    h3.className = "online__user";
    h3.innerHTML = `<span class="dot"></span> ${item.user}`;
    onlineContainer.append(h3);
  });
}

//renderUser connected user on screen function
function renderUser(user) {
  const userJoin = document.createElement("div");
  userJoin.className = "msg user__join";
  userJoin.innerHTML = `<p class="join_noti">${user} joined</p>`;
  msgContainer.append(userJoin);
  msgContainer.scrollTop =
    msgContainer.scrollHeight - msgContainer.offsetHeight;
}

//get time function
function getTime() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h}:${m}`;
}

//render message
function renderMsg(user) {
  const msg = document.createElement("div");
  msg.className = "msg";
  msg.innerHTML = `<p class="msg__text">${user.msg}</p>
    <span class="user__name ${user.type === "receiver" ? "get" : ""} ">${
    user.type === "sender" ? "" : user.userName
  }</span
    ><span class="msg__time ${
      user.type === "receiver" ? "get" : ""
    }">${getTime()}</span>`;
  if (user.type === "sender") msg.classList.add("sender");
  else msg.classList.add("receiver");
  msgContainer.append(msg);
  msgContainer.scrollTop =
    msgContainer.scrollHeight - msgContainer.offsetHeight;
}
