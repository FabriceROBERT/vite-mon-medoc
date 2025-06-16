import { View, Text, Modal, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import axios from 'axios';
// @ts-ignore
import { BASE_URL } from '@env';

type DeletePatientModalProps = {
  visible: boolean;
  patient: {
    id: number;
    nom: string;
    prenom: string;
  } | null;
  onClose: () => void;
  onPatientDeleted: () => void;
};

export default function DeletePatientModal({
  visible,
  patient,
  onClose,
  onPatientDeleted,
}: DeletePatientModalProps) {
  const delete_patient = () => {
    if (!patient) return;

    axios
      .delete(`http://${BASE_URL}/api/patients/${patient.id}`)
      .then(() => {
        onPatientDeleted();
        onClose();
        Alert.alert('Succès', `L’utilisateur ${patient.nom} a été supprimé avec succès.`);
      })
      .catch((e) => {
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
            Êtes-vous sûr de vouloir supprimer {patient?.nom} {patient?.prenom} ?
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={delete_patient}>
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
