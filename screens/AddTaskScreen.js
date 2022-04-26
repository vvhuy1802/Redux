import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, TextInput, Keyboard, Alert, ToastAndroid, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-native-datepicker'

import CustomButton from '../components/CustomButton';
import { Colors } from '../constants';
import globalStyles from '../styles/global';
import { createTask } from '../store/actions/taskActions';

const AddTaskScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [des, setDes] = useState('');
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.task);
  const { activeListId } = useSelector(state => state.list);
  const [date, setDate] = useState('');
  const [dateend, setDateend] = useState('');

  const submitHandler = () => {
    if (name.trim() === '') {
      return Alert.alert('Validation', 'Name is required!');
    }
    const alreadyExist = tasks.find(t => t.name.toLowerCase() === name.trim().toLowerCase() && t.listId === activeListId);
    if (alreadyExist) {
      return Alert.alert('Validation', 'Task with this name already exist in this list!');
    }

    dispatch(createTask(
      name,
      des,
      date,
      dateend,
      activeListId,
      () => {
        ToastAndroid.show(`Task "${name}" created!`, ToastAndroid.LONG);
        Keyboard.dismiss();
        navigation.goBack();
      },
      () => { ToastAndroid.show('Something went wrong, please try again!', ToastAndroid.LONG); },
    ));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.view}>
          <Text style={styles.textstyle}>Title</Text>
          <TextInput style={styles.input}
            value={name}
            onChangeText={(val) => setName(val)}
            placeholder="Task name"
            placeholderTextColor={Colors.tertiary} />
        </View>
        <View style={styles.view}>
          <Text style={styles.textstyle}>Description</Text>
          <TextInput style={styles.input1}
            value={des}
            onChangeText={(val) => setDes(val)}
            placeholder="Description"
            placeholderTextColor={Colors.tertiary} />
        </View>
        <View style={{ marginLeft: 10, marginRight: 10, marginTop: 30, flexDirection: 'row' }}>
          <Text style={styles.textstyle}>Start time: </Text>
          <DatePicker
            style={{ width: 200, marginLeft: 30 }}
            date={date}
            placeholder="select date"
            format="YYYY-MM-DD"
            onDateChange={(date) => setDate(date)}
          />
        </View>
        <View style={{ marginLeft: 10, marginRight: 10, marginTop: 50, flexDirection: 'row' }}>
          <Text style={styles.textstyle}>End time: </Text>
          <DatePicker
            style={{ width: 200, marginLeft: 41 }}
            date={dateend}
            placeholder="select date"
            format="YYYY-MM-DD"
            onDateChange={(dateend) => setDateend(dateend)}
          />
        </View>
        <View style={{marginTop:90}}>
          <CustomButton text="Submit" onPress={submitHandler} round />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flex: 1,
  },
  view: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  textstyle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  input1: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    height: 100,
  },
});

export default AddTaskScreen;
