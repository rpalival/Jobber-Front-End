import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contacts } from '../models/contacts.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

    constructor(
        private http: HttpClient
    ) {}
    
    callGetContacts(): Observable<Contacts[]> {
        return this.http.get<Contacts[]>('/api/contacts/');
    }

    createContact(applicationData: Contacts): Observable<Contacts> {
        return this.http.post<Contacts>('/api/contacts/', applicationData)
    }

    deleteContact(id: number): Observable<void> {
        return this.http.delete<void>(`/api/contacts/${id}`);
    }

    updateContact(id: number, updateData: any): Observable<Contacts> {
        return this.http.put<Contacts>(`/api/contacts/${id}/`, updateData);
    }
}
