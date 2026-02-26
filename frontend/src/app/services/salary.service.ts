import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Salary {
    id?: number;
    staff_id?: number;
    basicSalary?: number;
    bonus?: number;
    month?: number;
}

@Injectable({
    providedIn: 'root'
})
export class SalaryService {
    private apiUrl = 'http://localhost:8080/salaries';
    constructor(private http: HttpClient) { }

    getStaffSalary(staff_id: number): Observable<Salary[]> {
        return this.http.get<Salary[]>(`${this.apiUrl}/${staff_id}`);
    }

    createStaffSalary(staff_id: number, salary: Salary): Observable<Salary[]> {
        return this.http.post<Salary[]>(`${this.apiUrl}/${staff_id}`, salary);
    }

    updateStaffSalary(salary_id: number, salary: Salary): Observable<Salary[]> {
        return this.http.put<Salary[]>(`${this.apiUrl}/${salary_id}`, salary);
    }

    deleteStaffSalary(salary_id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${salary_id}`);
    }
}