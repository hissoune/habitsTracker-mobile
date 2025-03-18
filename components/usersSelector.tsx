import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  useColorScheme,
  SafeAreaView,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, Colors } from '@/constants/Colors';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/(redux)/store';
import { User } from '@/constants/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { getAllUsersAction } from '@/app/(redux)/aithSlice';
import replaceIp from '@/app/helpers/replaceIp';



interface UsersSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectParticipants: (selectedUsers: any) => void;
}



const UsersSelector: React.FC<UsersSelectorProps> = ({ visible, onClose, onSelectParticipants }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const {users}=useSelector((state:RootState)=>state.auth)
  const dispatch = useAppDispatch()

  useEffect(()=>{
    dispatch(getAllUsersAction())
  },[])
  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prevSelectedUsers => {
      if (prevSelectedUsers.find(u => u._id === user._id)) {
        return prevSelectedUsers.filter(u => u._id !== user._id);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  const handleConfirm = () => {
    onSelectParticipants(selectedUsers);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
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
                <Text style={styles.header}>Select Participants</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <AntDesign name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
            
            <View style={styles.contentContainer}>
              <View style={styles.selectionInfo}>
                <Text style={[styles.selectionText, { color: colors.text }]}>
                  {selectedUsers.length === 0 
                    ? "No participants selected" 
                    : `${selectedUsers.length} participant${selectedUsers.length > 1 ? 's' : ''} selected`}
                </Text>
              </View>
              
              <FlatList
                data={users}
                keyExtractor={(item) => item._id || item.name}
                renderItem={({ item }) => {
                  const isSelected = selectedUsers.find(u => u._id === item._id);
                  return (
                    <TouchableOpacity 
                      onPress={() => toggleUserSelection(item)}
                      style={[
                        styles.userItem, 
                        { 
                          backgroundColor: isSelected 
                            ? colorScheme === 'dark' ? `${COLORS.primary}30` : `${COLORS.primary}15`
                            : colorScheme === 'dark' ? '#2A2A3C' : '#f5f5f5'
                        }
                      ]}
                    >
                      <View style={styles.userInfo}>
                        <View style={[styles.userAvatar, { backgroundColor: COLORS.primary }]}>
                        <Image
              source={{ uri: replaceIp(item.image || "", process.env.EXPO_PUBLIC_REPLACE || "") || "https://via.placeholder.com/150" }}
              style={[styles.profileImage, { borderColor: COLORS.primary }]}
            />
                        </View>
                        <Text style={[styles.userName, { color: colors.text }]}>{item.name}</Text>
                      </View>
                      
                      {isSelected ? (
                        <View style={[styles.checkmark, { backgroundColor: COLORS.primary }]}>
                          <Feather name="check" size={16} color="#fff" />
                        </View>
                      ) : (
                        <View style={[styles.checkmarkOutline, { borderColor: colorScheme === 'dark' ? '#3A3A4C' : '#ddd' }]} />
                      )}
                    </TouchableOpacity>
                  );
                }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
              
           
            </View>
            
          </View>
          <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton, { borderColor: colorScheme === 'dark' ? '#3A3A4C' : '#ddd' }]} 
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.confirmButton]} 
                  onPress={handleConfirm}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.confirmButtonGradient}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
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
  contentContainer: {
    padding: 20,
  },
  selectionInfo: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  selectionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkOutline: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,

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
  },
  confirmButton: {
    marginLeft: 10,
    padding:10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    opacity: 0.8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 3,
  },
});

export default UsersSelector;