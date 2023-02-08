import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

import { DOCUMENT } from '@angular/common';

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
  showGoUpButton = false;
  private pageNum:number = 1;
  private query: string = '';
  private hideScrollHeight = 200;
  private showScrollHeight = 500;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
    ){
      this.onUrlChanged()
  }

  ngOnInit(): void{
    this.getCharactersByQuery()
  }

  // METHODS

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
    .pipe(take(1)
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

  @HostListener('window:scroll',[])
  onWindowScroll():void{
    const yOffSet = window.pageYOffset;
    if((yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) > this.showScrollHeight) {
      this.showGoUpButton = true
    } else if(this.showGoUpButton && (yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) < this.hideScrollHeight){
      this.showGoUpButton = false;
    }

  }

  onScrollDown():void{
    if(this.info.next){
      this.pageNum++;
      this.getDataFromService();
    }
  }

  onScrollTop():void{
    this.document.body.scrollTop = 0; //Safari
    this.document.documentElement.scrollTop = 0; // Other
  }

}
