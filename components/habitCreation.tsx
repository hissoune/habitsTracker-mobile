import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Habit, Frequency } from '@/constants/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createHabitAction } from '@/app/(redux)/hapitSlice';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

const HabitCreationModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
    const dispatch = useAppDispatch();
    const [form, setForm] = useState({
        title: '',
        description: '',
        frequency: 'daily' as Frequency,
        reminderTime: new Date(),
        repeats: 0,
    });

    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleCreateHabit = async () => {
        const newHabit: Habit = {
            ...form,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await dispatch(createHabitAction(newHabit));
        console.log('New Habit:', newHabit);
        onClose();
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || form.reminderTime;
        setShowDatePicker(Platform.OS === 'ios');
        setForm({ ...form, reminderTime: currentDate });
    };

    const handleChange = (field: string, value: string | number | Date) => {
        setForm({ ...form, [field]: value });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <View style={styles.titleContainer}>
                    <TouchableOpacity
                            style={[ styles.cancelButton]}
                            onPress={onClose}
                        >
                            <MaterialIcons name="cancel" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Create New Habit</Text>

                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        placeholderTextColor="#888"
                        value={form.title}
                        onChangeText={(text) => handleChange('title', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        placeholderTextColor="#888"
                        value={form.description}
                        onChangeText={(text) => handleChange('description', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Repeats"
                        placeholderTextColor="#888"
                        value={form.repeats.toString()}
                        onChangeText={(text) => handleChange('repeats', parseInt(text, 10) || 0)}
                        keyboardType="numeric"
                    />
                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Frequency</Text>
                        <Picker
                            selectedValue={form.frequency}
                            style={styles.picker}
                            onValueChange={(itemValue: Frequency) => handleChange('frequency', itemValue)}
                            dropdownIconColor={COLORS.primary}
                        >
                            <Picker.Item style={styles.picker}   label="Daily" value="daily" color="#fff" />
                            <Picker.Item style={styles.picker} label="Weekly" value="weekly" color="#fff" />
                            <Picker.Item style={styles.picker} label="Monthly" value="monthly" color="#fff" />
                        </Picker>
                    </View>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.label}>Reminder Time</Text>
                        <Button title="Select Reminder Time" onPress={() => setShowDatePicker(true)} color={COLORS.primary} />
                        {showDatePicker && (
                            <DateTimePicker
                                value={form.reminderTime}
                                mode="time"
                                display="default"
                                onChange={onDateChange}
                                textColor="#fff"
                              
                            />
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.createButton]}
                            onPress={handleCreateHabit}
                        >
                            <Text style={styles.buttonText}>Create Habit</Text>
                        </TouchableOpacity>
                       
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#444',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#333',
        color: '#fff',
    },
    pickerContainer: {
        marginBottom: 12,
       
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#333',
        borderColor: '#444',
        borderWidth: 1,
        borderRadius: 4,
        color: '#fff',
    },
    datePickerContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5, 
    },
    createButton: {
        backgroundColor: COLORS.primary,
        padding:1,
    },
    cancelButton: {
        width:100,
        flex:1,
        marginTop:4,
      },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff', 
    },
    titleContainer:{
        flexDirection:"row",
        justifyContent:"center",
        gap:5
    }
});

export default HabitCreationModal;