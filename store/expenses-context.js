import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
  expenses: [],
  setExpenses: (expenses) => {},
  addExpense: ({ description, amount, date }) => { },
  deleteExpense: (id) => { },
  updateExpense: (id, { description, amount, date }) => { },
});

const expensesReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];

    case "SET": 
      const inverted = action.payload.reverse();
      return action.payload;

    case "UPDATE":
      const toUpdateExpenseIndex = state.findIndex((expense) => expense.id === action.payload.id);
      const toUpdateExpense = state[toUpdateExpenseIndex];
      const updatedItem = { ...toUpdateExpense, ...action.payload.expenseData };

      const updatedExpenses = [...state];
      updatedExpenses[toUpdateExpenseIndex] = updatedItem;
      return updatedExpenses;

    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);

    default:
      return state;
  }
};

const ExpensesContextProvider = ({ children }) => {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  const addExpense = (expenseData) => {
    dispatch({ type: "ADD", payload: expenseData });
  };

  const setExpenses = (expenses) => {
    dispatch({ type: "SET", payload: expenses });
  };

  const deleteExpense = (id) => {
    dispatch({ type: "DELETE", payload: id });
  };

  const updateExpense = (id, expenseData) => {
    dispatch({ type: "UPDATE", payload: { id, expenseData } });
  };

  return (
    <ExpensesContext.Provider value={{
      expenses: expensesState,
      addExpense, setExpenses, updateExpense, deleteExpense
    }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export default ExpensesContextProvider;