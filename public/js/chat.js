let socket = io();

function scroolTobottom() {
  let message = document.querySelector("#chec").lastElementChild;
  message.scrollIntoView();
}

socket.on("connect", function () {
  let searchItem = window.location.search.substring(1);
  let params = JSON.parse(
    '{"' +
      decodeURI(searchItem)
        .replace(/&/g, '","')
        .replace(/\+g/, " ")
        .replace(/=/g, '":"') +
      '"}'
  );

  socket.emit("join", params, function (err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("no error!");
    }
  });
});

socket.on("disconnect", function () {
  console.log("disconnected client side");
});

socket.on("newMessage", (message) => {
  const formatTime = moment(message.createdAt).format("LT");
  let span = document.createElement("span");
  span.innerText = `${message.from} : ${message.text} (${formatTime})  `;
  document.querySelector(".middle").appendChild(span);
});

socket.on("updateUsersList", function (users) {
  let ol = document.createElement("ol");
  ol.classList.add("chat-list-c");
  users.forEach(function (user) {
    let li = document.createElement("li");
    li.classList.add("section");
    ol.appendChild(li);
    let img = document.createElement("img");
    img.classList.add("src");
    img.src =
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVs9NQJf9FuAO8y2NaasMqa7MAjrKIX4U8iA&usqp=CAU";
   
    li.appendChild(img);
    let div = document.createElement("div");
    div.classList.add("top");
    li.appendChild(div);
    let span = document.createElement("span");
    span.innerHTML = user;
    div.appendChild(span);
    let p = document.createElement("p");
    p.innerText = "just join yet !";
    div.appendChild(p);
  });
  let userList = document.querySelector(".chat-list-container");
  userList.innerHTML = "";
  userList.appendChild(ol);
});

socket.on("sendMessage", (message) => {
  const formatTime = moment(message.createdAt).format("LT");
  let div = document.createElement("div");
  div.classList.add("message");
  div.classList.add("received");
  div.innerHTML = `<div><div class="off">~${message.from} </div></div>${message.text}`;
  let span = document.createElement("span");
  span.classList.add("metadata");
  span.innerHTML = `<span class="time">${formatTime}</span>`;
  div.appendChild(span);
  document.querySelector("#chec").appendChild(div);
  scroolTobottom();

  // Creating the sender div according to the requirement

  // let div= document.createElement('div');
  // div.classList.add('message');
  // div.classList.add('sent');
  // div.innerText=`${message.text}`;
  // let span=document.createElement('span');
  // span.classList.add('time');
  // span.classList.add('second');
  // span.innerHTML=`<span class="time">${formatTime}</span>`
  // div.appendChild(span)
  // document.querySelector('#chec').appendChild(div);
});

let button = document.querySelector("#btn");
let inputs = document.querySelectorAll("#input");
button.addEventListener("click", function (e) {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "user",
      text: document.querySelector('input[name="message"]').value,
    },
    function () {}
  );
});
button.addEventListener("click", () => {
  inputs.forEach(input => (input.value = " "));
});

socket.on("checkmessage", (message) => {
  alert(message.text);
});
