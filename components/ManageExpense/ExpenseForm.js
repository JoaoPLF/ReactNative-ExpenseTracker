import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { getFormattedDate } from "../../util/date";
import Button from "../UI/Button";
import Input from "./Input";

const ExpenseForm = ({ onCancel, onSubmit, submitButtonLabel, defaultValues }) => {
  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: true
    },
    date: {
      value: defaultValues ?  getFormattedDate(defaultValues.date) : "",
      isValid: true
    },
    description: {
      value: defaultValues ? defaultValues.description : "",
      isValid: true
    },
  });

  const inputChangedHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => ({
      ...currentInputs,
      [inputIdentifier]: { value: enteredValue, isValid: true }
    }));
  };

  const submitHandler = () => {
    const expenseData = {
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;

    if (amountIsValid && dateIsValid && descriptionIsValid) {
      onSubmit(expenseData);
    }
    else {
      setInputs((currentInputs) => ({
        amount: { value: currentInputs.amount.value, isValid: amountIsValid },
        date: { value: currentInputs.date.value, isValid: dateIsValid },
        description: { value: currentInputs.description.value, isValid: descriptionIsValid },
      }));
    }
  };

  const formIsInvalid = 
    !inputs.amount.isValid ||
    !inputs.date.isValid ||
    !inputs.description.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputRow}>
        <Input label="Amount" style={styles.rowInput} invalid={!inputs.amount.isValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            value: inputs.amount.value,
            onChangeText: (enteredValue) => inputChangedHandler("amount", enteredValue)
          }}
        />
        <Input label="Date" style={styles.rowInput} invalid={!inputs.date.isValid}
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            value: inputs.date.value,
            onChangeText: (enteredValue) => inputChangedHandler("date", enteredValue)
          }}
        />
      </View>
      <Input label="Description" invalid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          value: inputs.description.value,
          onChangeText: (enteredValue) => inputChangedHandler("description", enteredValue)
        }}
      />
      {formIsInvalid ?
        <Text style={styles.errorText}>Invalid input values - please check entered data!</Text> :
        null
      }
      <View style={styles.buttonContainer}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>Cancel</Button>
        <Button style={styles.button} onPress={submitHandler}>{submitButtonLabel}</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center"
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  rowInput: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8
  }
});

export default ExpenseForm;