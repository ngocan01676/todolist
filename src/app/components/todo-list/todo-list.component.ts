import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from 'src/app/models/todo.models';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  constructor(private todoService:TodoService) { }
  todos$:Observable<Todo[]>;
  ngOnInit(): void {

    this.todos$ = this.todoService.todo$;
  }
  onChangeTodoStatus(todo:Todo):void {
    console.log(todo);
    this.todoService.onChangeTodoStatus(todo.id,todo.isComplete);
  }

  onEditTodo(todo:Todo):void {
    this.todoService.editTodo(todo.id,todo.content);
  }
  onDeleteTodo(todo:Todo):void {
    this.todoService.deleteTodo(todo.id);
  }

}
