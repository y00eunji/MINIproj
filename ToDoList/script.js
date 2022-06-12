(function () {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  const $todos = get(".todos");
  const $form = get(".todo_form");
  const $todoInput = get(".todo_input");
  const API_URL = `http://localhost:3000/todos`;

  const createTodoElement = (item) => {
    const { id, content, completed } = item;
    const isChecked = completed ? "checked" : "";
    const $todoItem = document.createElement("div");
    $todoItem.classList.add("item");
    $todoItem.dataset.id = id;
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' 
                ${isChecked}
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `;
    return $todoItem;
  };

  const renderAllTodos = (todos) => {
    $todos.innerHTML = "";
    todos.forEach((item) => {
      const todoElement = createTodoElement(item);
      $todos.appendChild(todoElement);
    });
  };

  const getTodos = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((todos) => {
        renderAllTodos(todos);
      })
      .catch((error) => console.error(error.message));
  };

  //일정 입력하면 리스트에 추가하기
  const addTodo = (e) => {
    // 새로고침이 안되게 하는 것
    e.preventDefault();
    const content = $todoInput.value;
    if (!content) return;
    const todo = {
      content,
      completed: false,
    };
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(todo),
    })
      .then((response) => response.json())
      .then(getTodos)
      .then(() => {
        $todoInput.value = "";
        $todoInput.focus();
      })
      .catch((error) => console.error(error.message));
  };

  //체크박스
  const toggleTodo = (e) => {
    if (e.target.className !== "todo_checkbox") return;
    const $item = e.target.closest(".item"); //체크박스 기준으로 가장 가까운 item 클래스를 찾아줌
    const id = $item.dataset.id;
    const completed = e.target.checked;
    fetch(`${API_URL}/${id}`, {
      //url주소
      method: "PATCH", //부분적으로 변경하는 거라서 patch
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ completed }),
    })
      .then((response) => response.json())
      .then(getTodos)
      .catch((error) => console.error(error.message));
  };

  //수정모드로 바꾸기 , 수정 누르면 버튼 모양 바뀜
  const changeEditMode = (e) => {
    const $item = e.target.closest(".item");
    const $label = $item.querySelector("label");
    const $editInput = $item.querySelector('input[type="text"]');
    const $contentButtons = $item.querySelector(".content_buttons");
    const $editButtons = $item.querySelector(".edit_buttons");
    const value = $editInput.value;

    if (e.target.className === "todo_edit_button") {
      $label.style.display = "none";
      $editInput.style.display = "block";
      $contentButtons.style.display = "none";
      $editButtons.style.display = "block";
      $editInput.focus(); //수정 시 포커스 주기
      $editInput.value = ""; //커서를 맨뒤로 보내기 위함, 먼저 아예 다 삭제하고
      $editInput.value = value; //기존에 있던 내용을 넣어주면, 커서가 맨 뒤로감
    }

    if (e.target.className === "todo_edit_cancel_button") {
      $label.style.display = "block";
      $editInput.style.display = "none";
      $contentButtons.style.display = "block";
      $editButtons.style.display = "none";
      $editInput.value = $label.innerText;
    }
  };

  //수정한 TODO
  const editTodo = (e) => {
    if (e.target.className !== "todo_edit_confirm_button") return;
    const $item = e.target.closest(".item");
    const id = $item.dataset.id;
    const $editInput = $item.querySelector('input[type="text"]');
    const content = $editInput.value;

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ content }),
    })
      .then((response) => response.json())
      .then(getTodos)
      .catch((error) => console.error(error.message));
  };

  const init = () => {
    window.addEventListener("DOMContentLoaded", () => {
      getTodos();
    });

    $form.addEventListener("submit", addTodo);
    $todos.addEventListener("click", toggleTodo);
    $todos.addEventListener("click", changeEditMode);
    $todos.addEventListener("click", editTodo);
    $todos.addEventListener("click", removeTodo);
  };

  init();
})();
