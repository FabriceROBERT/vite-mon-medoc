import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from 'screens/HomeScreen';
import HRScreen from 'screens/HRScreen';
import LoginScreen from 'screens/LoginScreen';
import PatientListScreen from 'screens/PatientListScreen';
import DoctorScreen from 'screens/DoctorScreen';
import AuthProvider from 'provider/AuthProvider';
import SplashScreen from 'screens/SplashScreen';
import { useAuth } from 'context/useAuth';

const Stack = createStackNavigator();

function NavigatorWrapper() {
  const { loading, user } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
      <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen} />
      <Stack.Screen name="HRScreen" options={{ headerShown: false }} component={HRScreen} />
      <Stack.Screen
        name="PatientListScreen"
        options={{ headerShown: false }}
        component={PatientListScreen}
      />
      <Stack.Screen name="DoctorScreen" options={{ headerShown: false }} component={DoctorScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <NavigatorWrapper />
      </NavigationContainer>
    </AuthProvider>
  );
}
