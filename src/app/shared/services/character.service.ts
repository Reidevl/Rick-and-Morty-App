import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { ICharacter } from '@shared/interfaces/character.interface';
import { environment } from '@environment/environment';


@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(private http: HttpClient) { }

  searchCharacters(query:string = '', page = 1){
    const filter = `${environment.baseUrlAPI}/?name=${query}&page=${page}`
    return this.http.get<ICharacter[]>(filter)
  }

  getDetails(id:number){
    return this.http.get<ICharacter>(`${environment.baseUrlAPI}/${id}`)
  }
}
