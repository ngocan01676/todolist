import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../models/filtering.model';
import { Todo } from '../models/todo.models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private static readonly TodoStorageKey = 'todos';
  private todos:Todo[];
  private filteredTodos:Todo[];
  private lengthSubject:BehaviorSubject<Number> = new BehaviorSubject<Number>(0);
  private displayTodosSubject:BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  private currentFilter:Filter = Filter.All;

  todo$:Observable<Todo[]> = this.displayTodosSubject.asObservable();
  length$:Observable<Number> = this.lengthSubject.asObservable();  
  

  constructor(private storageService:LocalStorageService) { }

  addTodo(content:string):void {
    const date = new Date(Date.now()).getTime();
    //console.log(date);
    const newTodo = new Todo(date,content);
    this.todos.unshift(newTodo);
    console.log(this.todos);
    this.updateToLocalStorage();
  }

  onChangeTodoStatus(id:number,isComplete:boolean) {
    const index = this.todos.findIndex(item => item.id == id);
    // console.log(index);
    const todo = this.todos[index];
    todo.isComplete = isComplete;
    this.todos.splice(index,1,todo);
    this.updateToLocalStorage();
  }

  editTodo(id:number,content:string) {
    const index = this.todos.findIndex(item => item.id == id);
    // console.log(index);
    const todo = this.todos[index];
    todo.content = content
    this.todos.splice(index,1,todo);
    this.updateToLocalStorage();
  }

  deleteTodo(id:number):void {
    const index = this.todos.findIndex(item => item.id == id);
    this.todos.splice(index,1);
    this.updateToLocalStorage();
  }

  toggleAll() {
    this.todos = this.todos.map(item => {
      return {
        ...item,isComplete:!this.todos.every(t => t.isComplete)
      }
    });
    this.updateToLocalStorage();
  }

  fetchFromLocalStorage():void {
    this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    // this.filteredTodos = [...this.todos.map(item => ({...item}))];
    this.filteredTodos = [...this.todos];
    this.updateTodo();
  }

  updateTodo():void {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }

  updateToLocalStorage():void {
    this.storageService.setObject(TodoService.TodoStorageKey,this.todos);
    this.filterTodos(this.currentFilter,false);
    this.updateTodo();
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.isComplete);
    this.updateToLocalStorage();
  }

  filterTodos(filter:Filter,isFiltering:boolean=true):void {
    this.currentFilter = filter;
    switch(filter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter(item => !item.isComplete);
        break;
      case Filter.Completed:
        this.filteredTodos = this.todos.filter(item => item.isComplete);
        break;
      case Filter.All:
        // this.filteredTodos = [...this.todos.map(item => ({...item}))];
        this.filteredTodos = [...this.todos];
        break;
    }

    if (isFiltering) {
      this.updateTodo();
    }
  }
}
