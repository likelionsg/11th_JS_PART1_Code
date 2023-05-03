const todo_generator = document.querySelector(".todo_generator");
const todo_lists = document.querySelector(".todo_lists");

// 추후 변경해줘야 하므로 let 필수!
let todos = [];

const deleteTodo = (target) => {
  todo_lists.removeChild(target);

  const renewedTodos = todos.filter((el) => {
    return el.id !== target.id;
  });

  todos = renewedTodos;
  saveTodo();
};

const reviseTodo = (target) => {
  const form = document.createElement("form");
  const input = document.createElement("input");

  input.type = "text";
  form.className = "revise__form";

  const value = target.children[0].innerHTML;
  input.value = value;

  form.appendChild(input);

  target.replaceChild(form, target.children[0]);

  const reviseEnd = (event, target) => {
    event.preventDefault();

    if (target.id != event.target?.parentNode?.id) return;

    const text = document.createElement("span");
    const revisedText = event.target.children[0].value;
    text.innerHTML = revisedText;

    todos.forEach((el) => {
      if (el.id === target.id) {
        el.text = revisedText;
      }
    });

    target.replaceChild(text, target.children[0]);

    saveTodo();
  };

  form.addEventListener("submit", (e) => reviseEnd(e, target));
};

const loadTodo = () => {
  const loadedTodos = localStorage.getItem("todos");

  if (loadedTodos === null) return;

  const parsedTodos = JSON.parse(loadedTodos);
  parsedTodos.forEach((el) => paintTodo(el.text));
};

const resetInputText = () => {
  document.querySelector(".todo_generator > input").value = "";
};

const paintTodo = (text) => {
  const li = document.createElement("li");
  const span = document.createElement("span");

  span.innerHTML = text;
  li.appendChild(span);

  const reviseBtn = document.createElement("img");
  reviseBtn.src = "./image/revision.png";
  reviseBtn.className = "revise_todo";
  li.appendChild(reviseBtn);

  const deleteBtn = document.createElement("img");
  deleteBtn.src = "./image/delete.png";
  deleteBtn.className = "delete_todo";
  li.appendChild(deleteBtn);

  const newId = `todo_${todos.length}`;

  li.id = newId;

  const todoObject = {
    text,
    id: newId,
  };
  todos.push(todoObject);

  todo_lists.appendChild(li);
};

const saveTodo = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const makeReadHandler = (event) => {
  event.preventDefault();
  const todo_text = event.target.children[0].value;
  paintTodo(todo_text);
  saveTodo();
  resetInputText();
};

const updateDeleteHandler = (event) => {
  const method = event.target.className;
  const target = event.target.parentNode;

  if (method === "revise_todo") {
    reviseTodo(target);
  } else if (method === "delete_todo") {
    deleteTodo(target);
  }
};

todo_generator.addEventListener("submit", makeReadHandler);
todo_lists.addEventListener("click", updateDeleteHandler);

(() => {
  loadTodo();
})();
