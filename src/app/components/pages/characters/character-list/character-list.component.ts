import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

import { ICharacter } from '@app/shared/interfaces/character.interface';
import { CharacterService } from '@app/shared/services/character.service';
type RequestInfo = {
  next: string;
};

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {

  characters: ICharacter[] = [];
  info: RequestInfo = {
    next: '',
  };

  private pageNum:number = 1;
  private query: string = '';
  private hideScrollHeight = 200;
  private showScrollHeight = 500;


  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
    ){
      this.onUrlChanged()

  }

  ngOnInit(): void{
    this.getCharactersByQuery()
  }

  private onUrlChanged(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe (() => {
          this.characters = [];
          this.pageNum = 1;
          this.getCharactersByQuery();
          }
        );
  }

  private getCharactersByQuery(): void{
    this.route.queryParams.pipe(take(1))
      .subscribe((params: any) => {
        console.log('Params -->', params);
        this.query = params['q'];
        this.getDataFromService();

      })
  }

  private getDataFromService(): void {
    this.characterService.searchCharacters(this.query, this.pageNum)
    .pipe(
      take(1)
    ).subscribe ((response:any)=>{

      if(response?.results?.length){
        const { info, results } = response;
        this.characters = [...this.characters, ...results];
        this.info = info;
      } else {
        this.characters = []
      }
    })
  }

}
