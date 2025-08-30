import { Component,EventEmitter, Output, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [],
  templateUrl: './search-filter.html',
  styleUrl: './search-filter.css'
})
export class SearchFilter {
 @Output() searchChange = new EventEmitter<{ value: string, type: 'term' | 'squad' }>();

  isOpen = false;
  selectedSquad = '';

  constructor(private elementRef: ElementRef) {}

  onSearch(event: Event, type: 'term' | 'squad'): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit({ value, type });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectSquad(squad: string): void {
    this.selectedSquad = squad;
    this.isOpen = false;
    this.searchChange.emit({ value: squad, type: 'squad' });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
      }
    }
  }
}