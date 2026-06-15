import { useAppStore } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SalarySetup } from './pages/SalarySetup';
import { BudgetAllocation } from './pages/BudgetAllocation';
import { DebtTracker } from './pages/DebtTracker';
import { MonthlyTracker } from './pages/MonthlyTracker';
import { Achievements } from './pages/Achievements';

export function App() {
  const {
    state, navigate, xpToast, dismissToast,
    setSalary, setCategories,
    addDebt, removeDebt, addDebtPayment, setDebtStrategy,
    setMonthlyEntry, completeMonth,
  } = useAppStore();

  function renderPage() {
    switch (state.currentPage) {
      case 'salary':
        return <SalarySetup current={state.salary} onSave={setSalary} />;
      case 'budget':
        return (
          <BudgetAllocation
            netMonthly={state.salary?.netMonthly ?? 0}
            categories={state.categories}
            onSetCategories={setCategories}
          />
        );
      case 'debt':
        return (
          <DebtTracker
            debts={state.debts}
            strategy={state.debtStrategy}
            onAddDebt={addDebt}
            onRemoveDebt={removeDebt}
            onAddPayment={addDebtPayment}
            onSetStrategy={setDebtStrategy}
          />
        );
      case 'monthly':
        return (
          <MonthlyTracker
            categories={state.categories}
            monthlyEntries={state.monthlyEntries}
            monthRecords={state.monthRecords}
            onSetEntry={setMonthlyEntry}
            onCompleteMonth={completeMonth}
          />
        );
      case 'achievements':
        return <Achievements achievements={state.achievements} xp={state.xp} />;
      default:
        return <Dashboard state={state} onNavigate={navigate} />;
    }
  }

  return (
    <Layout
      currentPage={state.currentPage}
      onNavigate={navigate}
      xp={state.xp}
      level={state.level}
      xpToast={xpToast}
      onDismissToast={dismissToast}
    >
      {renderPage()}
    </Layout>
  );
}
