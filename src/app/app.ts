import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, startWith, BehaviorSubject, Observable } from 'rxjs';
import { EpicCard } from './components/epic-card/epic-card';
import { SearchFilter } from './components/search-filter/search-filter';

@Component({
  selector: 'app-root',
    standalone: true, 
  imports: [CommonModule, EpicCard, SearchFilter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
private allEpics$: Observable<any[]>;
  private searchTerm$ = new BehaviorSubject<string>('');
  private squadFilter$ = new BehaviorSubject<string>('');

  public filteredEpics: any[] = [];
  constructor(private http: HttpClient) {
     this.allEpics$ = this.http.get<any[]>('assets/stakeholders.json');
  }

  ngOnInit() {
    combineLatest([
      this.allEpics$,
      this.searchTerm$.pipe(startWith('')),
      this.squadFilter$.pipe(startWith('')),
    ])
      .pipe(
        map(([epics, term, squad]) =>
          epics.filter((epic) => {
            const termLower = term.toLowerCase();
            const stakeholdersString = Object.values(epic.stakeholders)
              .flat()
              .join(' ')
              .toLowerCase();

            const matchesTerm =
              epic.epicName.toLowerCase().includes(termLower) ||
              epic.squadName.toLowerCase().includes(termLower) ||
              stakeholdersString.includes(termLower);

            const matchesSquad = squad ? epic.squadName === squad : true;

            return matchesTerm && matchesSquad;
          })
        )
      )
      .subscribe((epics) => {
        this.filteredEpics = epics;
      });
  }

  onSearchChange({ value, type }: { value: string; type: 'term' | 'squad' }) {
    if (type === 'term') {
      this.searchTerm$.next(value);
    } else if (type === 'squad') {
      this.squadFilter$.next(value);
    }
  }
}