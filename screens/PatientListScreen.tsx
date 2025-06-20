import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Pressable,
} from 'react-native';
import DeletePatientModal from '../modals/DeletePatientModal';
import EditPatientModal from '../modals/EditPatientModal';
// @ts-ignore
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

export default function PatientListScreen() {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'PatientDetailScreen'>>();
  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editPatient, setEditPatient] = useState<{
    id: number;
    nom: string;
    prenom: string;
    age: number;
    poids: number;
    taille: number;
    traitement_en_cours: string;
    medicament: string;
    medecin_id: number;
    medecin: string;
    notes: string;
    rdv: Date;
    statut: string;
    numero_de_telephone: number;
    mail: string;
    created_at: Date;
  } | null>(null);

  const [selectedPatient, setSelectedPatient] = useState<{
    id: number;
    nom: string;
    prenom: string;
    age: number;
    poids: number;
    taille: number;
    traitement_en_cours: string;
    medicament: string;
    medecin: string;
    notes: string;
    rdv: Date;
    statut: string;
    numero_de_telephone: number;
    mail: string;
    created_at: Date;
  } | null>(null);

  const fetchPatients = async () => {
    try {
      setError('');
      const response = await axios.get(`http://${BASE_URL}/api/patients`);
      setPatientsData(response.data);
    } catch (err) {
      setError('Impossible de récupérer la liste des patients');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePatientUpdated = () => {
    setReload(!reload);
  };

  const handlePatientDeleted = () => {
    setReload((prev) => !prev);
  };

  useEffect(() => {
    fetchPatients();
  }, [reload]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };

  const renderPatient = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PatientDetailScreen', { patientId: Number(item.id) })}>
      <View
        style={{
          flexDirection: 'row',
          gap: 30,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={styles.name}>
            <Text style={{ textTransform: 'uppercase', fontWeight: 'bold', fontStyle: 'italic' }}>
              {item.nom}
              {'  '}
            </Text>
            {item.prenom}
          </Text>

          <Text style={styles.info}>
            Âge :{' '}
            {item.age ? (
              <Text style={styles.data}>{item.age} ans </Text>
            ) : (
              <Text style={styles.noData}>Non renseigné</Text>
            )}{' '}
          </Text>
          <Text style={styles.status}>Statut :</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {item.statut ? item.statut : <Text style={styles.label}>Non renseigné</Text>}
            </Text>
          </View>

          <Text style={styles.info}>
            Téléphone :{' '}
            {item.numero_de_telephone ? (
              item.numero_de_telephone
            ) : (
              <Text style={styles.noData}>Non renseigné</Text>
            )}
          </Text>
          <Text style={styles.info}>
            Mail :{' '}
            {item.mail ? (
              item.mail.length > 20 ? (
                item.mail.substring(0, 15) + '...'
              ) : (
                item.mail
              )
            ) : (
              <Text style={styles.noData}>Non renseigné</Text>
            )}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.buttonAction}
            onPress={() => {
              setEditPatient(item);
              setEditModalVisible(true);
            }}>
            <Ionicons name="pencil" size={18} color="white" />
            <Text style={styles.buttonText}>Modifier</Text>
          </Pressable>

          <Pressable
            style={[styles.buttonAction, styles.buttonDelete]}
            onPress={() => {
              setSelectedPatient(item);
              setDeleteModalVisible(true);
            }}>
            <Ionicons name="trash" size={18} color="white" />
            <Text style={styles.buttonText}>Supprimer</Text>
          </Pressable>
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="skyblue" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPatients}>
          <Text style={{ color: 'white' }}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 10, marginTop: 60 }}>
      <FlatList
        data={patientsData}
        keyExtractor={(patient) => patient.id.toString()}
        renderItem={renderPatient}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['skyblue']} />
        }
        ListEmptyComponent={<Text style={styles.empty}>Aucun patient trouvé.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  data: { fontSize: 16, marginBottom: 10, fontWeight: 600, color: '#666' },
  noData: {
    fontStyle: 'italic',
    color: 'gray',
    fontWeight: '300',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'flex-end',
  },

  buttonAction: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonDelete: {
    backgroundColor: 'red',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f2f8fd',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 1,
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
  label: {
    color: 'white',
    fontStyle: 'italic',
  },
  name: {
    marginBottom: 8,
    fontSize: 18,
    color: '#222',
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
  status: {
    fontSize: 15,
    color: '#555',
    marginTop: 2,
    marginBottom: 4,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 17,
  },
  retryButton: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
