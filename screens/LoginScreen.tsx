import React, { useContext, useEffect, useState } from 'react';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/useAuth';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout, loading } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`http://${BASE_URL}/api/users/login`, {
        username,
        password,
      });

      if (response.status === 200 && response.data.token) {
        await login(response.data);
      } else {
        Alert.alert('Erreur', "Type d'utilisateur non reconnu.");
      }
    } catch (error) {
      Alert.alert("Nom d'utilisateur ou mot de passe incorrect.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (loading || !user) return;
    const type = user.user.type;
    if (type === 'rh') {
      navigation.navigate('HRScreen' as never);
    } else if (type === 'medecin') {
      navigation.navigate('DoctorScreen' as never);
    } else if (type === 'admin') {
      navigation.navigate('AdminScreen' as never);
    } else {
      Alert.alert('Erreur', "Type d'utilisateur non reconnu.");
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se Connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'skyblue',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
