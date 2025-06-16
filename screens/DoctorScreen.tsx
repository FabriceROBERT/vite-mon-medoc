import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabView, TabBar } from 'react-native-tab-view';
import axios from 'axios';
// @ts-ignore
import { BASE_URL } from '@env';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import PatientCard from '../components/PatientCard';
import { RootStackParamList } from '../App';

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

export default function DoctorScreen() {
  const layout = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [myPatients, setMyPatients] = useState<Patient[]>([]);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'agenda', title: 'Mon agenda' },
    { key: 'patients', title: 'Mes patients' },
  ]);
  const [doctorName, setDoctorName] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList, 'DoctorScreen'>>();

  useEffect(() => {
    AsyncStorage.getItem('username').then(setDoctorName);
  }, []);

  const fetchPatients = async () => {
    try {
      setError('');
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        setError('Token d’authentification manquant');
        return;
      }

      const response = await axios.get(`http://${BASE_URL}/api/patients/medecin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyPatients(response.data);
    } catch (err: any) {
      console.error('Erreur API :', err);

      if (err.response) {
        setError(err.response.data.message || 'Impossible de récupérer les patients');
      } else {
        setError('Problème de connexion au serveur.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [reload]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };

  // Liste des rendez-vous à venir triés
  const upcomingAppointments = myPatients
    .filter((p) => p.rdv && new Date(p.rdv) > new Date())
    .sort((a, b) => new Date(a.rdv).getTime() - new Date(b.rdv).getTime());

  // Onglet Agenda
  const AgendaRoute = () => (
    <View style={styles.tabContent}>
      <Text style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 18 }}>
        Prochains rendez-vous
      </Text>
      {upcomingAppointments.length === 0 ? (
        <Text style={{ color: '#888' }}>Aucun rendez-vous à venir.</Text>
      ) : (
        <FlatList
          data={upcomingAppointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.agendaCard}>
              <Text style={styles.agendaTitle}>
                {item.nom} {item.prenom}
              </Text>
              <Text style={styles.agendaDate}>
                {new Date(item.rdv).toLocaleString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text style={styles.agendaStatus}>Statut : {item.statut || 'Non renseigné'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );

  // Onglet Patients
  const PatientsRoute = () => (
    <View style={styles.tabContainer}>
      <FlatList
        data={myPatients}
        keyExtractor={(patient) => patient.id.toString()}
        renderItem={({ item }) => (
          <PatientCard
            patient={item}
            onReload={onRefresh}
            onPress={() =>
              navigation.navigate('PatientDetailScreen', { patientId: Number(item.id) })
            }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['skyblue']} />
        }
        ListEmptyComponent={<Text style={styles.empty}>Aucun patient trouvé.</Text>}
      />
    </View>
  );

  // Render Scene sans SceneMap
  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'agenda':
        return <AgendaRoute />;
      case 'patients':
        return <PatientsRoute />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="skyblue" />
      ) : (
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: 'skyblue' }}
                style={{ backgroundColor: '#fff' }}
                activeColor="skyblue"
                inactiveColor="#aaa"
              />
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 20,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 17,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
  },
  agendaCard: {
    backgroundColor: '#f5faff',
    marginBottom: 12,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  agendaTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  agendaDate: {
    color: '#348',
    marginBottom: 4,
  },
  agendaStatus: {
    fontSize: 12,
    color: '#888',
  },
});
