import { View, Text, Modal, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

type EditModalProps = {
  visible: boolean;
  user: { id: number; username: string; type: string } | null;
  onClose: () => void;
  onUserUpdated: () => void;
};

export default function EditUserModal({ visible, user, onClose, onUserUpdated }: EditModalProps) {
  const [username, setUsername] = useState('');
  const [typeValue, setTypeValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'RH', value: 'rh' },
    { label: 'Médecin', value: 'medecin' },
    { label: 'Admin', value: 'admin' },
  ]);

  useEffect(() => {
    if (visible && user) {
      setUsername(user.username);
      setTypeValue(user.type);
    }
  }, [visible, user]);

  const modify_user = () => {
    if (!user) return;
    axios
      .put(`http://172.20.10.11:3000/api/users/${user.id}`, {
        username,
        type: typeValue,
      })
      .then(() => {
        onUserUpdated();
        onClose();
        Alert.alert('Succès', 'L’utilisateur a été modifié avec succès.');
      })
      .catch(() => {
        Alert.alert(
          'Erreur',
          'Impossible de modifier l’utilisateur. Veuillez réessayer plus tard.'
        );
      });
  };

  const isDisabled = !username.trim() || !typeValue;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modifier l'utilisateur</Text>

          <TextInput
            style={styles.input}
            value={username}
            placeholder="Nom d'utilisateur"
            onChangeText={setUsername}
          />

          <DropDownPicker
            open={open}
            value={typeValue}
            items={items}
            setOpen={setOpen}
            setItems={setItems}
            setValue={setTypeValue}
            placeholder="Type d'utilisateur"
            style={styles.picker}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, isDisabled && styles.disabledButton]}
              onPress={modify_user}
              disabled={isDisabled}>
              <Text style={styles.buttonText}>Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'skyblue',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    marginBottom: 20,
    borderColor: 'skyblue',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  confirmButton: {
    backgroundColor: 'lightgreen',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
});
