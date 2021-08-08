const socket = io("https://public-server.herokuapp.com/");
const msgContainer = document.querySelector(".msg-container");
const sendBtn = document.querySelector(".send-btn");
const msgInputField = document.querySelector("#send");
const userTyping = document.querySelector(".user__typing");
const onlineContainer = document.querySelector(".online-container");

let userName = prompt("please enter you name");

// validate username length
if (userName.length > 12) {
  userName = prompt("your name too long ");
}
socket.emit("userJoin", userName);
socket.on("userJoin", (user) => {
  if (user) {
    renderUser(user);
  } else {
    userName = prompt("Name already taken Please enter different name");
    socket.emit("userJoin", userName);
  }
});

let timout = undefined;

function timeoutFunction() {
  socket.emit("notTyping", false);
}

//typing notification event emit
msgInputField.addEventListener("input", (e) => {
  socket.emit("userTyping", userName);
  clearTimeout(timout);
  timout = setTimeout(timeoutFunction, 100);
});

//listing typin and not typing event
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
  const msg = msgInputField.value.trim();

  if (msg.length == 0) return false;
  socket.emit("msg", { userName, msg });
  renderMsg({ userName, msg, type: "sender" });
  msgInputField.value = "";
});

//receive message
socket.on("msg", (user) => {
  renderMsg(user);
});

//online show
socket.on("online", (user) => {
  renderOnline(user);
});

//show online function
function renderOnline(user) {
  onlineContainer.innerHTML = "";
  user.forEach((item) => {
    const h3 = document.createElement("h3");
    h3.className = "online__user";
    h3.innerHTML = `<span class="dot"></span> ${item.user}`;
    onlineContainer.append(h3);
  });
}

//renderUser when it connect
function renderUser(user) {
  const userJoin = document.createElement("div");
  userJoin.className = "msg user__join";
  userJoin.innerHTML = `<p class="join_noti">${user} joined</p>`;
  msgContainer.append(userJoin);
  msgContainer.scrollTop =
    msgContainer.scrollHeight - msgContainer.offsetHeight;
}

//get time
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
    <span class="user__name">${
      user.type === "sender" ? "" : user.userName
    }</span
    ><span class="msg__time">${getTime()}</span>`;
  if (user.type === "sender") msg.classList.add("sender");
  else msg.classList.add("receiver");
  msgContainer.append(msg);
  msgContainer.scrollTop =
    msgContainer.scrollHeight - msgContainer.offsetHeight;
}
