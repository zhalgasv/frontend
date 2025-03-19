import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import { User } from './models/user.model';






@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api/users'; // Убедись, что URL правильный

  constructor(private http: HttpClient) {}

  getUsers(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(this.apiUrl));
  }

  addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);

  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
