"use client"

import type React from "react"
import { useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import type { Habit, Frequency } from "@/constants/types"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { createHabitAction } from "@/app/(redux)/hapitSlice"
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons"
import { COLORS, Colors } from "@/constants/Colors"
import { LinearGradient } from "expo-linear-gradient"
import { useSelector } from "react-redux"
import { RootState } from "@/app/(redux)/store"

const HabitCreationModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const dispatch = useAppDispatch()
  const colorScheme = useColorScheme() || "light"
  const colors = Colors[colorScheme]
const {createOrUbdateLoading}=useSelector((state:RootState)=>state.habit)
  const [form, setForm] = useState({
    title: "",
    description: "",
    frequency: "daily" as Frequency,
    reminderTime: new Date(),
    repeats: 0,
  })

  const [showTimePicker, setShowTimePicker] = useState(false)

 

  const handleCreateHabit = async () => {
    try {
      console.log("Creating habit...")

      const newHabit: Habit = {
        ...form,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const response = await dispatch(createHabitAction(newHabit))
      console.log("Habit created successfully") 
      if (createHabitAction.fulfilled.match(response)) {
        console.log("Habit created successfully")
              ToastAndroid.show("Habit created successfully", ToastAndroid.SHORT)

      }
     onClose()
    } catch (error) {
      console.error("Error creating habit:", error)

      Alert.alert("Error", "There was an error creating your habit", [{ text: "OK" }])
    }
  }

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios")
    if (selectedTime) {
      setForm({ ...form, reminderTime: selectedTime })
    }
  }

  const handleChange = (field: string, value: string | number | Date) => {
    setForm({ ...form, [field]: value })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <LinearGradient
          colors={
            colorScheme === "dark"
              ? [`${COLORS.primary}30`, colors.background]
              : [`${COLORS.primary}20`, colors.background]
          }
          style={styles.gradientContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: colorScheme === "dark" ? "#1A1A2E" : "#fff" }]}>
            <View style={styles.headerContainer}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
              >
                <Text style={styles.header}>Create New Habit</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <AntDesign name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Title</Text>
                <View
                  style={[styles.inputContainer, { backgroundColor: colorScheme === "dark" ? "#2A2A3C" : "#f5f5f5" }]}
                >
                  <Feather name="check-circle" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Habit title"
                    placeholderTextColor={colorScheme === "dark" ? "#9BA1A6" : "#687076"}
                    value={form.title}
                    onChangeText={(text) => handleChange("title", text)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                <View
                  style={[
                    styles.textAreaContainer,
                    { backgroundColor: colorScheme === "dark" ? "#2A2A3C" : "#f5f5f5" },
                  ]}
                >
                  <Feather name="file-text" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textArea, { color: colors.text }]}
                    placeholder="Describe your habit"
                    placeholderTextColor={colorScheme === "dark" ? "#9BA1A6" : "#687076"}
                    value={form.description}
                    onChangeText={(text) => handleChange("description", text)}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Repeats</Text>
                <View
                  style={[styles.inputContainer, { backgroundColor: colorScheme === "dark" ? "#2A2A3C" : "#f5f5f5" }]}
                >
                  <Feather name="repeat" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Number of repeats"
                    placeholderTextColor={colorScheme === "dark" ? "#9BA1A6" : "#687076"}
                    value={form.repeats.toString()}
                    onChangeText={(text) => handleChange("repeats", Number.parseInt(text, 10) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
                <View
                  style={[styles.pickerContainer, { backgroundColor: colorScheme === "dark" ? "#2A2A3C" : "#f5f5f5" }]}
                >
                  <Feather name="calendar" size={20} color={COLORS.primary} style={styles.pickerIcon} />
                  <Picker
                    selectedValue={form.frequency}
                    style={[styles.picker, { color: colors.text }]}
                    onValueChange={(itemValue: Frequency) => handleChange("frequency", itemValue)}
                    dropdownIconColor={COLORS.primary}
                  >
                    <Picker.Item label="Daily" value="daily" />
                    <Picker.Item label="Weekly" value="weekly" />
                    <Picker.Item label="Monthly" value="monthly" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Reminder Time</Text>
                <TouchableOpacity
                  style={[styles.timeButton, { backgroundColor: colorScheme === "dark" ? "#2A2A3C" : "#f5f5f5" }]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <MaterialIcons name="access-time" size={20} color={COLORS.primary} />
                  <Text style={[styles.timeText, { color: colors.text }]}>{formatTime(form.reminderTime)}</Text>
                </TouchableOpacity>
              </View>

              {showTimePicker && (
                <DateTimePicker value={form.reminderTime} mode="time" display="default" onChange={onTimeChange} />
              )}

             
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  { borderColor: colorScheme === "dark" ? "#3A3A4C" : "#ddd" },
                ]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreateHabit}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createButtonGradient}
                >
                  <Text style={styles.createButtonText}>
                    {createOrUbdateLoading ? (
                       <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text>Creating</Text>
                            <ActivityIndicator color={COLORS.primary} size={"large"} />
                        </View>
                                       
                     ) : (
                     "Create Habit"
                    )}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  gradientContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "90%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContainer: {
    overflow: "hidden",
  },
  headerGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
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
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  textAreaContainer: {
    flexDirection: "row",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    alignItems: "flex-start",
  },
  textArea: {
    flex: 1,
    height: 100,
    fontSize: 16,
    textAlignVertical: "top",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingLeft: 15,
    height: 50,
    overflow: "hidden",
  },
  pickerIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
  },
  timeText: {
    marginLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    marginRight: 10,
    borderWidth: 1,
  },
  createButton: {
    marginLeft: 10,
    overflow: "hidden",
  },
  createButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    opacity: 0.8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default HabitCreationModal

