import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AppComponent {
  users: User[] = [];
  newUser: User = { name: '', email: '' };
  editedUser: User | null = null;
  isLoading = { addUser: false };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getUsers().then((data) => {
      this.users = data;
    });
  }

  async addUser() {
    try {
      const { email, name } = this.newUser;
      if (!email) {
        throw new Error('No Email');
      }
      if (!name) {
        throw new Error('No Name');
      }
      this.apiService.addUser(this.newUser).subscribe((user) => {
        this.users.push(user);
        this.newUser = { name: '', email: '' };
      });
    } catch (e) {
      const err = e as Error;
      console.error(err.message);
    }
  }

  editUser(user: User) {
    this.editedUser = { ...user };
  }

  updateUser() {
    if (this.editedUser) {
      this.apiService.updateUser(this.editedUser).subscribe(() => {
        this.apiService.getUsers().then((data) => {
          this.users = data;
        });
        this.editedUser = null;
      });
    }
  }

  deleteUser(id: number) {
    this.apiService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter((user) => user.id !== id);
    });
  }

  saveData() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  loadData() {
    const data = localStorage.getItem('users');
    if (data) {
      this.users = JSON.parse(data);
    }
  }

  deleteData() {
    localStorage.removeItem('users');
    this.users = [];
  }
}
