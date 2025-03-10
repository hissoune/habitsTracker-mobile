import { chalenge } from '@/constants/types';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  useColorScheme,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, Colors } from '@/constants/Colors';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createChalengeAction } from '@/app/(redux)/chalengesSlice';

type ChallengeCreationProps = {
  visible: boolean;
  onClose: () => void;
  
};

const ChallengeCreation: React.FC<ChallengeCreationProps> = ({ visible, onClose }) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
    const dispatch = useAppDispatch()
  
  const [formData, setFormData] = useState<Omit<chalenge, 'id'>>({
    title: '',
    description: '',
    frequency: 'daily',
    repeats: 1,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
  });
  
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  const updateFormData = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const onStartDateChange = (_: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      updateFormData('startDate', selectedDate.toISOString());
    }
  };
  
  const onEndDateChange = (_: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      updateFormData('endDate', selectedDate.toISOString());
    }
  };
  
  const handleCreate = () => {   
    dispatch(createChalengeAction(formData));

    setFormData({
      title: '',
      description: '',
      frequency: 'daily',
      repeats: 0,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    
    onClose();
  };
  
  const frequencyOptions = ['daily', 'weekly', 'monthly'];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <LinearGradient
          colors={colorScheme === 'dark' 
            ? [`${COLORS.primary}30`, colors.background] 
            : [`${COLORS.primary}20`, colors.background]}
          style={styles.gradientContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: colorScheme === 'dark' ? '#1A1A2E' : '#fff' }]}>
            <View style={styles.headerContainer}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
              >
                <Text style={styles.header}>Create New Challenge</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <AntDesign name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Title</Text>
                <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#2A2A3C' : '#f5f5f5' }]}>
                  <Feather name="award" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Challenge title"
                    placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
                    value={formData.title}
                    onChangeText={(text) => updateFormData('title', text)}
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                <View style={[styles.textAreaContainer, { backgroundColor: colorScheme === 'dark' ? '#2A2A3C' : '#f5f5f5' }]}>
                  <Feather name="file-text" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textArea, { color: colors.text }]}
                    placeholder="Describe your challenge"
                    placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
                    value={formData.description}
                    onChangeText={(text) => updateFormData('description', text)}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
                <View style={styles.frequencyContainer}>
                  {frequencyOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.frequencyOption,
                        formData.frequency === option && styles.frequencyOptionSelected,
                        { borderColor: colorScheme === 'dark' ? '#3A3A4C' : '#ddd' }
                      ]}
                      onPress={() => updateFormData('frequency', option)}
                    >
                      <Text
                        style={[
                          styles.frequencyText,
                          formData.frequency === option && styles.frequencyTextSelected,
                          { color: formData.frequency === option ? '#fff' : colors.text }
                        ]}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Repeats</Text>
                <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#2A2A3C' : '#f5f5f5' }]}>
                  <Feather name="repeat" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Number of repeats"
                    placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
                    value={formData.repeats.toString()}
                    onChangeText={(text) => updateFormData('repeats', Number(text) || 1)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.dateContainer}>
                <View style={styles.dateInputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Start Date</Text>
                  <TouchableOpacity 
                    style={[styles.dateButton, { backgroundColor: colorScheme === 'dark' ? '#2A2A3C' : '#f5f5f5' }]}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <MaterialIcons name="date-range" size={20} color={COLORS.primary} />
                    <Text style={[styles.dateText, { color: colors.text }]}>
                      {formatDate(formData.startDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dateInputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>End Date</Text>
                  <TouchableOpacity 
                    style={[styles.dateButton, { backgroundColor: colorScheme === 'dark' ? '#2A2A3C' : '#f5f5f5' }]}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <MaterialIcons name="event" size={20} color={COLORS.primary} />
                    <Text style={[styles.dateText, { color: colors.text }]}>
                      {formatDate(formData.endDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {showStartDatePicker && (
                <DateTimePicker
                  value={new Date(formData.startDate)}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                />
              )}
              
              {showEndDatePicker && (
                <DateTimePicker
                  value={new Date(formData.endDate)}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                />
              )}
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton, { borderColor: colorScheme === 'dark' ? '#3A3A4C' : '#ddd' }]} 
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.createButton]} 
                onPress={handleCreate}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createButtonGradient}
                >
                  <Text style={styles.createButtonText}>Create Challenge</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gradientContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContainer: {
    overflow: 'hidden',
  },
  headerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  textAreaContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  textArea: {
    flex: 1,
    height: 100,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  frequencyOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  frequencyTextSelected: {
    color: '#fff',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInputGroup: {
    flex: 1,
    marginRight: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 10,
    borderWidth: 1,
  },
  createButton: {
    marginLeft: 10,
    overflow: 'hidden',
  },
  createButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    opacity: 0.8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChallengeCreation;