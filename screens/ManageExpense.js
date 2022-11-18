import { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { deleteExpense, storeExpense, updateExpense } from "../util/http";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

const ManageExpense = ({ route, navigation }) => {
  const expensesCtx = useContext(ExpensesContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;
  const selectedExpense = expensesCtx.expenses.find(expense => expense.id === editedExpenseId);

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEditing ? "Edit Expense" : "Add Expense" });
  }, [navigation, isEditing]);

  const confirmHandler = async (expenseData) => {
    setLoading(true);

    try {
      if (isEditing) {
        expensesCtx.updateExpense(editedExpenseId, expenseData);
        await updateExpense(editedExpenseId, expenseData);
      }
      else {
        const id = await storeExpense(expenseData);
        expensesCtx.addExpense({ ...expenseData, id });
      }
  
      navigation.goBack();
    }
    catch (err) {
      setLoading(false);
      setError("Could not save data - please try again later");
    }
  };

  const cancelHandler = () => {
    navigation.goBack();
  };

  const deleteExpenseHandler = async () => {
    setLoading(true);

    try {
      expensesCtx.deleteExpense(editedExpenseId);
      await deleteExpense(editedExpenseId);
      navigation.goBack();
    }
    catch (err) {
      setError("Could not delete expense - please try again later");
      setLoading(false);
    }
  };

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

  return (
    <View style={styles.container}>
      <ExpenseForm
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        submitButtonLabel={isEditing ? "Update" : "Add"}
        defaultValues={selectedExpense}
      />
      {isEditing ?
        <View style={styles.deleteContainer}>
          <IconButton icon="trash" color={GlobalStyles.colors.error500} size={36}
            onPress={deleteExpenseHandler}
          />
        </View> :
        null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center"
  }
});

export default ManageExpense;