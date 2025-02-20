import { User } from '@/constants/types';
import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const BirthDayPicker = ({handleConfirm,form}:{handleConfirm:any,form:User}) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

   const handelConfrimTheDte=(date:Date)=>{
    setDatePickerVisibility(false);
    handleConfirm(date)
   }

    return (
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <TextInput
                style={{ borderBottomWidth: 1, marginBottom: 20, padding: 10 }}
                placeholder="Select Birth Date"
                value={form?.birthDay ? form.birthDay.toDateString() : ''}
                onFocus={() => setDatePickerVisibility(true)}
                editable={false} 
            />

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handelConfrimTheDte}
                onCancel={() => setDatePickerVisibility(false)}
            />
        </TouchableOpacity>
    );
};

export default BirthDayPicker;
