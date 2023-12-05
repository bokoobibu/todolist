<template>
  <div>
    <h1>Список дел</h1>
    <form @submit.prevent="addTodo">
      <input v-model="newTodo.title" type="text" placeholder="Новое дело" />
      <input v-model="newTodo.userId" type="number" placeholder="ID пользователя" />
      <button type="submit">Добавить</button>
    </form>
    
    <select v-model="filter" @change="saveTodos">
      <option value="all">Все</option>
      <option value="completed">Выполненные</option>
      <option value="incomplete">Невыполненные</option>
    </select>
    
    <ul>
      <li v-for="todo in filteredTodos" :key="todo.id" :class="{ completed: todo.completed }">
        {{ todo.title }} (Пользователь: {{ todo.userId }})
        <div class="button-container">
          <button @click="toggleTodoCompletion(todo)">
            {{ todo.completed ? 'Отменить выполнение' : 'Выполнено' }}
          </button>
          <button @click="deleteTodo(todo.id)">Удалить</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      todos: [],
      newTodo: {
        title: '',
        userId: null
      },
      filter: 'all'
    };
  },
  methods: {
    fetchTodos() {
      if (this.todos.length > 0) {
        return;
      }

      axios.get('https://jsonplaceholder.typicode.com/todos')
        .then(response => {
          this.todos = response.data.map(todo => {
            return {
              ...todo,
              completed: todo.completed
            };
          });
        })
        .catch(error => {
          console.error(error);
        });
    },
    addTodo() {
      if (this.newTodo.title && this.newTodo.userId) {
        const newTodo = {
          id: Date.now(),
          title: this.newTodo.title,
          userId: this.newTodo.userId,
          completed: false
        };
        this.todos.unshift(newTodo);
        this.newTodo = {
          title: '',
          userId: null
        };

        this.saveTodos();
      }
    },
    deleteTodo(id) {
      axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
        .then(() => {
          this.todos = this.todos.filter(todo => todo.id !== id);
          this.saveTodos();
        })
        .catch(error => {
          console.error(error);
        });
    },
    toggleTodoCompletion(todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
    },
    saveTodos() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
      localStorage.setItem('filter', this.filter);
    },
    retrieveSavedTodos() {
      const savedTodos = localStorage.getItem('todos');
      const savedFilter = localStorage.getItem('filter');
      if (savedTodos) {
        this.todos = JSON.parse(savedTodos);
      }
      if (savedFilter) {
        this.filter = savedFilter;
      }
    }
  },
  computed: {
    filteredTodos() {
      if (this.filter === 'completed') {
        return this.todos.filter(todo => todo.completed);
      } else if (this.filter === 'incomplete') {
        return this.todos.filter(todo => !todo.completed);
      } else {
        return this.todos;
      }
    }
  },
  created() {
    this.retrieveSavedTodos();
    this.fetchTodos();
  }
}
</script>

<style>
  body {
    margin: 0;
  }

  .completed {
    color: #fff;
    background-color: green;
  }
  
  h1 {
    font-size: 24px;
    line-height: 24px;
    text-align: center;
    margin: 5px 0;
  }
  
  form {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  input[type="number"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button[type="submit"],
  button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  ul {
    padding: 0;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    list-style-type: none;
    margin: 0 5px;
  }
  
  li {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  li:not(:last-child) {
    border-bottom: 1px solid #000;
  }

  .button-container {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
  
  select {
    margin-left: 5px;
    margin-bottom: 5px;
    padding: 5px;
  }
</style>