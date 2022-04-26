/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ToastAndroid, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-native-datepicker'

import { Colors } from '../constants';
import globalStyles from '../styles/global';
import CustomButton from '../components/CustomButton';
import { updateTask, deleteTask } from '../store/actions/taskActions';

const TaskScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [des, setDes] = useState('');
  const [date, setDate] = useState('');
  const [dateend, setDateend] = useState('');
  const [completed, setCompleted] = useState(false);
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.task);

  useEffect(() => {
    const taskFound = tasks.find(t => t.id === route.params.id);
    if (taskFound) {
      setName(taskFound.name);
      setDes(taskFound.des);
      setDate(taskFound.date);
      setDateend(taskFound.dateend);
      setCompleted(taskFound.completed);
      setTask(taskFound);
      setLoading(false);
    }
  }, [tasks, route.params.id]);

  const updateTaskHandler = () => {
    if (task.name === name && task.completed === completed && task.des === des) {
      return Alert.alert('Nothing changed', 'Cannot update because nothing was changed!');
    }

    const updatedTask = {
      ...task,
      name,
      des,
      date,
      dateend,
      completed,
    };

    dispatch(updateTask(
      updatedTask,
      () => {
        navigation.goBack();
        ToastAndroid.show('Task updated!', ToastAndroid.LONG);
      },
      () => {
        ToastAndroid.show('Something went wrong. Please try again!', ToastAndroid.LONG);
      },
    ));
  };

  const deleteTaskClickHandler = () => {
    Alert.alert(
      'Delete task',
      'Are you sure you want to delete this task?',
      [{ text: 'Cancel' }, { text: 'Delete', onPress: () => deleteTaskHandler() }]
    );
  };

  const deleteTaskHandler = () => {
    dispatch(deleteTask(
      task.id,
      () => {
        navigation.goBack();
        ToastAndroid.show(`Task "${task.name} deleted!"`, ToastAndroid.LONG);
      },
      () => {
        ToastAndroid.show('Something went wrong. Please try again!', ToastAndroid.LONG);
      },
    ));
  };

  if (loading) {
    return <ActivityIndicator color={Colors.primary} size="large" style={globalStyles.loader} />;
  }

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
        <View style={globalStyles.switchContainer}>
          <Switch
            value={completed}
            onValueChange={(val) => setCompleted(val)}
            thumbColor={completed ? Colors.primary : Colors.secondary}
            trackColor={{ false: Colors.tertiary, true: Colors.quaternary }}
          />
          <Text style={globalStyles.switchText}>Complete task</Text>
        </View>
        <CustomButton text="Update task" onPress={updateTaskHandler} round style={styles.spaceBottom} />
        <CustomButton text="Delete task" onPress={deleteTaskClickHandler} round danger />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  spaceBottom: {
    marginBottom: 30,
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

export default TaskScreen;
