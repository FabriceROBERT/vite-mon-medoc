import { View, Text, Modal, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React from 'react';
import axios from 'axios';
// @ts-ignore
import { BASE_URL } from '@env';

type DeleteUserModalProps = {
  visible: boolean;
  user: { id: number; username: string; type: string } | null;
  onClose: () => void;
  onUserDeleted: () => void;
};

export default function DeleteUserModal({
  visible,
  user,
  onClose,
  onUserDeleted,
}: DeleteUserModalProps) {
  const delete_user = () => {
    if (!user) return;

    axios
      .delete(`http://${BASE_URL}/api/users/${user.id}`)
      .then(() => {
        onUserDeleted();
        onClose();
        Alert.alert('Succès', `L’utilisateur ${user.username} a été supprimé avec succès.`);
      })
      .catch(() => {
        Alert.alert(
          'Erreur',
          'Impossible de supprimer l’utilisateur. Veuillez réessayer plus tard.'
        );
      });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirmer la suppression</Text>
          <Text style={styles.modalMessage}>
            Êtes-vous sûr de vouloir supprimer {user?.username} ?
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={delete_user}>
              <Text style={styles.buttonText}>Supprimer</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
