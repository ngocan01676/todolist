import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Todo } from 'src/app/models/todo.models';

const fadeStrikeThroughAnimation = trigger('fadeStrikeThrough', [
  state(
    'active',
    style({
      fontSize: '18px',
      color: 'black',
    }),
  ),
  state(
    'completed',
    style({
      fontSize: '17px',
      color: 'lightgrey',
      textDecoration: 'line-through',
    }),
  ),
  transition('active <=> completed', [animate(250)]),
]);

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  animations: [fadeStrikeThroughAnimation],
})


export class TodoItemComponent implements OnInit {

  isHovered = false;
  isEditing = false;
  @Input() todo:Todo
  @Output() changeStatus:EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() editTodo:EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() deleteTodo:EventEmitter<Todo> = new EventEmitter<Todo>();
  constructor() { }
  changeTodoStatus():void {
    this.changeStatus.emit({...this.todo,isComplete:!this.todo.isComplete});
  }
  submitEdit(event:KeyboardEvent):void {
    event.preventDefault();
    const { keyCode } = event;
    if (keyCode == 13) {
      this.editTodo.emit(this.todo);
      this.isEditing = false;
    }
  }

  removeTodo():void {
    this.deleteTodo.emit(this.todo);
  }
  ngOnInit(): void {
  }

}
