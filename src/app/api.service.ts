import { Injectable } from '@angular/core';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly storageKey = 'users';

  getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users: User[] = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
          resolve(users);
        } catch (error) {
          reject(error);
        }
      }, 2000);
    });
  }

  addUser(user: User): Promise<void> {
    return this.getUsers().then(users => {
      users.push(user);
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    });
  }

  updateUser(updatedUser: User): Promise<void> {
    return this.getUsers().then(users => {
      const index = users.findIndex(user => user.id === updatedUser.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem(this.storageKey, JSON.stringify(users));
      }
    }, err => {

    });
  }

  deleteUser(id: number): Promise<void> {
    return this.getUsers().then(users => {
      const filteredUsers = users.filter(user => user.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers));
    });
  }

  clearUsers(): Promise<void> {
    return new Promise(resolve => {
      localStorage.removeItem(this.storageKey);
      resolve();
    });
  }
}
