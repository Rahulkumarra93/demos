import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-epic-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './epic-card.html',
  styleUrl: './epic-card.css'
})
export class EpicCard {
 @Input() epic: any;

  getStakeholders(): { role: string, name: string }[] {
    const stakeholders = [];
    for (const [role, name] of Object.entries(this.epic.stakeholders)) {
      if (Array.isArray(name)) {
        stakeholders.push({ role, name: name.join(', ') });
      } else {
        stakeholders.push({ role, name: name as string });
      }
    }
    return stakeholders;
  }

  handleExport(): void {
    const { epicName, stakeholders } = this.epic;
    const header = "Role,Name\n";
    const rows = Object.entries(stakeholders).map(([role, name]) => {
      if (Array.isArray(name)) {
        return name.map(n => `"${role}","${n}"`).join('\n');
      }
      return `"${role}","${name}"`;
    }).join('\n');

    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${epicName.replace(/\s+/g, '_')}_stakeholders.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
