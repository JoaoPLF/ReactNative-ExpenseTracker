import { useContext, useEffect, useState } from "react";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";

import ExpensesOutput from "../constants/ExpensesOutput/ExpensesOutput";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

const RecentExpenses = () => {
  const expensesCtx = useContext(ExpensesContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const expenses = await fetchExpenses();
        expensesCtx.setExpenses(expenses);
      }
      catch (err) {
        setError("Could not fetch expenses!");
      }

      setLoading(false);
    };

    getExpenses();
  }, []);

  if (loading) {
    return (
      <LoadingOverlay />
    );
  }

  if (error) {
    return (
      <ErrorOverlay message={error} />
    );
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return ((expense.date >= date7DaysAgo) && (expense.date <= today));
  });

  return (
    <ExpensesOutput expenses={recentExpenses} expensesPeriod="Last 7 Days"
      fallbackText="No expenses registered for the last 7 days."
    />
  );
};

export default RecentExpenses;