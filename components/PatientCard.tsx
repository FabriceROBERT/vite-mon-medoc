import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Pressable } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import DeletePatientModal from '../modals/DeletePatientModal';
import EditPatientModal from '../modals/EditPatientModal';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  poids: number;
  taille: number;
  traitement_en_cours: string;
  medicament: string;
  medecin_id: number;
  notes: string;
  rdv: Date;
  statut: string;
  numero_de_telephone: number;
  mail: string;
}

interface PatientCardProps {
  patient: Patient;
  onPress?: () => void;
  onReload: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onPress, onReload }) => {
  const rdvDate = patient.rdv ? new Date(patient.rdv) : null;
  const now = new Date();
  const label =
    rdvDate && rdvDate.getTime() > now.getTime()
      ? 'Date prévue le :'
      : 'Dernière consultation le :';

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handlePatientUpdated = () => {
    setEditModalVisible(false);
    onReload();
  };

  const handlePatientDeleted = () => {
    setDeleteModalVisible(false);
    onReload();
  };

  const scheduleNotificationNow = async (date: Date) => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Nouveau rendez-vous',
          body: `Votre rendez-vous est programmé pour le ${date.toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}`,
        },
        trigger: null, // notification immédiate
      });
      console.log('Notification envoyée immédiatement, ID :', notificationId);

      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Notifications programmées :', scheduled);
    } catch (error) {
      console.error('Erreur dans la notification immédiate :', error);
    } finally {
      hideDatePicker();
    }
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification reçue :', notification);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.name}>
            <Text style={styles.nameHighlight}>{patient.nom}</Text> {patient.prenom}
          </Text>
          <Text style={styles.info}>
            Âge :{' '}
            {patient.age ? (
              <Text style={styles.data}>{patient.age} ans </Text>
            ) : (
              <Text style={styles.noData}>Non renseigné</Text>
            )}
          </Text>
          <Text style={styles.info}>
            Poids :{' '}
            {patient.poids ? (
              <Text style={styles.data}>{patient.poids} kg </Text>
            ) : (
              <Text style={styles.noData}>Non renseigné</Text>
            )}
          </Text>
          <Text style={styles.info}>
            Traitement en cours :{' '}
            {patient.traitement_en_cours ? (
              <Text style={styles.data}>
                {patient.traitement_en_cours === 'false' ? 'Non' : 'Oui'}
              </Text>
            ) : (
              <Text style={styles.noData}>Non renseigné</Text>
            )}
          </Text>
          <Text style={styles.status}>Statut :</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{patient.statut ? patient.statut : 'Non renseigné'}</Text>
          </View>
          <Text style={styles.info}>
            Médicament :{' '}
            {patient.medicament ? (
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.data}>
                {patient.medicament}
              </Text>
            ) : (
              <Text style={styles.noData}>Aucun médicament prescrit</Text>
            )}
          </Text>
          <Text style={styles.info}>Notes : </Text>
          {patient.notes ? (
            <Text style={styles.notes}>{patient.notes}</Text>
          ) : (
            <Text style={styles.noData}>Aucun commentaire</Text>
          )}
          {patient.rdv ? (
            <Text style={styles.info}>
              {label}{' '}
              <Text style={styles.data}>
                {new Date(patient.rdv).toLocaleString('fr-FR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Text>
          ) : (
            <Text style={styles.noData}>Aucune date prévue</Text>
          )}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonAction} onPress={showDatePicker}>
              <Ionicons name="calendar" size={18} color="white" />
              <Text style={styles.buttonText}>Nouvelle Consultation</Text>
            </Pressable>
            {/* DateTimePicker pour la nouvelle consultation */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              accessibilityLanguage="fr_FR"
              textColor="black"
              onConfirm={scheduleNotificationNow}
              onCancel={hideDatePicker}
              locale="fr_FR"
            />
            <Pressable
              style={[styles.buttonAction, styles.buttonEdit]}
              onPress={() => {
                setEditPatient(patient);
                setEditModalVisible(true);
              }}>
              <Ionicons name="pencil" size={18} color="white" />
              <Text style={styles.buttonText}>Modifier</Text>
            </Pressable>
            <Pressable
              style={[styles.buttonAction, styles.buttonDelete]}
              onPress={() => {
                setSelectedPatient(patient);
                setDeleteModalVisible(true);
              }}>
              <Ionicons name="trash" size={18} color="white" />
              <Text style={styles.buttonText}>Supprimer</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <EditPatientModal
        visible={editModalVisible}
        patient={editPatient}
        onClose={() => setEditModalVisible(false)}
        onPatientUpdated={handlePatientUpdated}
      />

      <DeletePatientModal
        visible={deleteModalVisible}
        patient={selectedPatient}
        onClose={() => setDeleteModalVisible(false)}
        onPatientDeleted={handlePatientDeleted}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonEdit: {
    backgroundColor: 'skyblue',
  },
  buttonDelete: {
    backgroundColor: 'red',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonAction: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 15,
  },
  notes: {
    fontSize: 14,
    backgroundColor: '#f0f0f0',
    fontWeight: '600',
    alignContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: 'black',
    marginTop: 5,
    paddingTop: 10,
    borderRadius: 10,
    marginLeft: 2,
    fontStyle: 'italic',
  },
  labelContainer: {
    marginBottom: 4,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'salmon',
    borderRadius: 20,
    padding: 4,
    paddingHorizontal: 8,
  },
  data: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#666',
  },
  noData: {
    fontStyle: 'italic',
    color: 'gray',
    fontWeight: '300',
  },
  label: {
    textTransform: 'uppercase',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontStyle: 'italic',
  },
  status: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#555',
    marginTop: 2,
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 12,
    marginLeft: 2,
  },
  card: {
    backgroundColor: '#f2f8fd',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    color: '#222',
  },
  nameHighlight: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});

export default PatientCard;
