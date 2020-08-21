const toDoList = document.querySelector("#to-do-list");
const toDoListTableBody = document.querySelector("#to-do-list-table-body");
const form = document.querySelector("#form");
const toDoInput = document.querySelector("#to-do");
const deadlineInput = document.querySelector("#deadline");
const info = document.querySelector("#info");

let date = new Date();
date.setHours(date.getHours() + 171);
deadlineInput.value = date.toISOString().slice(0, 16);

fetch("http://localhost:3000/todos")
  .then((response) => response.json())
  .then((data) => {
    data.map((todo) => {
      toDoListTableBody.innerHTML += `
          <tr>
            <td data-id="${todo.id}"><input ${
        todo.isChecked === true ? "checked" : ""
      } type="checkbox"></td>
            <td><span class="align-middle">${todo.todo}</span></td>
            <td><span class="align-middle">${new Date(
              todo.deadline + "Z"
            ).toLocaleString()}</span></td>
            <td ><button data-type="remove" class="btn btn-danger">Remove</button></td>
          </tr>`;
    });
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    Array.from(checkboxes).map((checkbox) => {
      if (checkbox.checked) {
        checkbox.parentNode.parentNode.children[1].classList.toggle("did");
        checkbox.parentNode.parentNode.classList.toggle("row-did");
      } else {
        console.log();
      }
    });
  });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const todo = await fetch("http://localhost:3000/todo", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      todo: toDoInput.value,
      deadline: deadlineInput.value,
      isChecked: false,
    }),
  })
    .then((data) => data.json())
    .then((data) => data)
    .catch((err) => err);
  console.log(todo);
  toDoListTableBody.innerHTML += `
  <tr>
    <td data-id="${todo.id}"><input type="checkbox"></td>
    <td><span class="align-middle">${todo.todo}</span></td>
    <td><span class="align-middle">${new Date(
      todo.deadline + "Z"
    ).toLocaleString()}</span></td>
    <td><button data-type="remove" class="btn btn-danger">Remove</button></td>
  </tr>`;

  info.style.display = "block";
  setTimeout(() => {
    info.style.display = "none";
  }, 1000);
});

toDoList.addEventListener("click", async (e) => {
  if (e.target.type == "checkbox") {
    const result = await fetch("http://localhost:3000/todo", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        id: e.target.parentNode.dataset.id,
        todo: e.target.parentNode.parentNode.children[1].innerHTML,
        deadline: deadlineInput.value,
        isChecked: e.target.checked,
      }),
    });
    if (await result.json()) {
      e.target.parentNode.parentNode.children[1].classList.toggle("did");
      e.target.parentNode.parentNode.classList.toggle("row-did");
    }
  } else if (e.target.dataset.type == "remove") {
    e.target.innerHTML = `<div class="spinner-border spinner-border-sm" role="status">
    <span class="sr-only">Loading...</span>
  </div>`;

    const result = await fetch("http://localhost:3000/todo", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        id: e.target.parentNode.parentNode.children[0].dataset.id,
      }),
    })
      .then((data) => data.json())
      .then((data) => data)
      .catch((err) => console.log(err));

    if (result) {
      console.log((e.target.parentNode.parentNode.style.opacity = 0));
      setTimeout(() => {
        e.target.parentNode.parentNode.parentNode.removeChild(
          e.target.parentNode.parentNode
        );
      }, 500);
    } else {
      e.target.innerHTML = "remove";
    }
  }
});
