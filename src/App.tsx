import { useAppStore } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SalarySetup } from './pages/SalarySetup';
import { BudgetAllocation } from './pages/BudgetAllocation';
import { DebtTracker } from './pages/DebtTracker';
import { MonthlyTracker } from './pages/MonthlyTracker';
import { Achievements } from './pages/Achievements';

export default function App() {
  const store = useAppStore();
  const { state } = store;

  const renderPage = () => {
    switch (state.currentPage) {
      case 'salary':
        return <SalarySetup current={state.salary} onSave={store.setSalary} />;
      case 'budget':
        return (
          <BudgetAllocation
            netMonthly={state.salary?.netMonthly ?? 0}
            categories={state.categories}
            onSetCategories={store.setCategories}
          />
        );
      case 'debt':
        return (
          <DebtTracker
            debts={state.debts}
            strategy={state.debtStrategy}
            onAddDebt={store.addDebt}
            onRemoveDebt={store.removeDebt}
            onAddPayment={store.addDebtPayment}
            onSetStrategy={store.setDebtStrategy}
          />
        );
      case 'monthly':
        return (
          <MonthlyTracker
            categories={state.categories}
            monthlyEntries={state.monthlyEntries}
            monthRecords={state.monthRecords}
            onSetEntry={store.setMonthlyEntry}
            onCompleteMonth={store.completeMonth}
          />
        );
      case 'achievements':
        return <Achievements achievements={state.achievements} xp={state.xp} />;
      case 'dashboard':
      default:
        return <Dashboard state={state} onNavigate={store.navigate} />;
    }
  };

  return (
    <Layout
      currentPage={state.currentPage}
      onNavigate={store.navigate}
      xp={state.xp}
      level={state.level}
      xpToast={store.xpToast}
      onDismissToast={store.dismissToast}
    >
      {renderPage()}
    </Layout>
  );
}
