import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';

interface User {
  id?: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  users: User[] = [];
  newUser: User = { id: 0, name: '', email: '' };
  editedUser: User | null = null;
  isLoading = {
    addUser: false,
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  async addUser() {
    if (!this.newUser.name || !this.newUser.email) {
      console.error('Заполните все поля!');
      return;
    }
    this.isLoading.addUser = true;
    const user: User = { ...this.newUser, id: Date.now() };
    try {
      await this.apiService.addUser(user);
      await this.loadData();
      this.newUser = {id: 0, name: '', email: ''};
    } catch (e) {
      console.error('Ошибка при добавлении пользователя:', e)
    } finally {
      this.isLoading.addUser = false;
    }
  }

  editUser(user: User): void {
    this.editedUser = { ...user };
  }

  updateUser(): void {
    if (!this.editedUser) return;
    this.apiService.updateUser(this.editedUser)
      .then(() => {
        this.editedUser = null;
        this.loadData();
      })
      .catch(error => console.error('Ошибка при обновлении пользователя:', error));
  }

  deleteUser(id: number): void {
    this.apiService.deleteUser(id)
      .then(() => this.loadData())
      .catch(error => console.error('Ошибка при удалении пользователя:', error));
  }

  saveData(): void {
    console.log('✅ Данные сохранены в Local Storage');
  }

  async loadData() {
    try {
      this.users = await this.apiService.getUsers();
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  deleteData(): void {
    this.apiService.clearUsers()
      .then(() => {
        this.users = [];
        console.log('❌ Данные удалены из Local Storage');
      })
      .catch(error => console.error('Ошибка при удалении данных:', error));
  }
}
