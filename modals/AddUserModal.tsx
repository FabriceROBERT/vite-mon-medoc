import { View, Text, Modal, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
// @ts-ignore
import { BASE_URL } from '@env';

type AddUserModalProps = {
  visible: boolean;
  onClose: () => void;
  onUserAdded: () => void;
};

export default function AddUserModal({ visible, onClose, onUserAdded }: AddUserModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [typeValue, setTypeValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'RH', value: 'rh' },
    { label: 'Médecin', value: 'medecin' },
    { label: 'Admin', value: 'admin' },
  ]);

  useEffect(() => {
    if (visible) {
      setUsername('');
      setPassword('');
      setTypeValue(null);
    }
  }, [visible]);

  const add_user = () => {
    if (!username || !password || !typeValue) {
      Alert.alert('Erreur', 'Tous les champs doivent être remplis.');
      return;
    }
    axios
      .post(`http://${BASE_URL}/api/users`, {
        username,
        type: typeValue,
        password,
      })
      .then(() => {
        onUserAdded();
        onClose();
        Alert.alert('Succès', 'L’utilisateur a été ajouté avec succès.');
      })
      .catch(() => {
        Alert.alert('Erreur', 'Impossible d’ajouter l’utilisateur.');
      });
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ajouter un employé</Text>

          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
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

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!username || !typeValue || !password) && styles.disabledButton,
              ]}
              onPress={add_user}
              disabled={!username || !typeValue || !password}>
              <Text style={styles.buttonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonText: { color: 'white', textAlign: 'center', fontWeight: '500', fontSize: 16 },
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
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  cancelButton: { backgroundColor: 'skyblue', padding: 10, borderRadius: 20 },
  confirmButton: { backgroundColor: 'lightgreen', padding: 10, borderRadius: 20 },
  disabledButton: { backgroundColor: 'lightgray', borderRadius: 20 },
  input: {
    borderWidth: 1,
    borderColor: 'skyblue',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  picker: { marginBottom: 15, width: '100%', borderColor: 'skyblue' },
});
