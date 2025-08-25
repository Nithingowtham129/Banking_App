import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountsComponent } from './accounts.component';
import { CommonModule } from '@angular/common';

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, AccountsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize accounts array with correct data', () => {
    expect(component.accounts.length).toBe(3);
    expect(component.accounts[0].name).toBe('Primary Checking');
    expect(component.accounts[0].balance).toBe('$4,250.75');
    expect(component.accounts[1].name).toBe('High-Yield Savings');
    expect(component.accounts[2].name).toBe('Rewards Credit Card');
  });

  it('should initialize summary object with correct data', () => {
    expect(component.summary.totalBalance).toBe('$16,580.92');
    expect(component.summary.monthlyIncome).toBe('$5,240.50');
    expect(component.summary.monthlyExpenses).toBe('$3,180.25');
  });

  it('should render accounts in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const accountItems = compiled.querySelectorAll('li.border');
    expect(accountItems.length).toBe(3);
    expect(accountItems[0].textContent).toContain('Primary Checking');
    expect(accountItems[1].textContent).toContain('High-Yield Savings');
    expect(accountItems[2].textContent).toContain('Rewards Credit Card');
  });

  it('should render account summary in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const summaryItems = compiled.querySelectorAll('.row.row-cols-md-3 > .col');
    expect(summaryItems.length).toBe(3);
    expect(summaryItems[0].textContent).toContain('Total Balance');
    expect(summaryItems[0].textContent).toContain('$16,580.92');
    expect(summaryItems[1].textContent).toContain('Monthly Income');
    expect(summaryItems[2].textContent).toContain('Monthly Expenses');
  });
});
