import { ProjectSearchItem } from './projectSearchItem';
import { ProjectItemSearchItem } from './projectItemSearchItem';
import { BudgetSearchItem } from './budgetSearchItem';
import { BudgetItemSearchItem } from './budgetItemSearchItem';
import { NoteSearchItem } from './noteSearchItem';

export interface SearchResult {
  projectSearchItems: ProjectSearchItem[];
  projectItemSearchItems: ProjectItemSearchItem[];
  budgetSearchItems: BudgetSearchItem[];
  budgetItemSearchItems: BudgetItemSearchItem[];
  noteSearchItems: NoteSearchItem[];
}
