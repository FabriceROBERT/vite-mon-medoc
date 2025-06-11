import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from 'screens/HomeScreen';
import HRScreen from 'screens/HRScreen';
import LoginScreen from 'screens/LoginScreen';
import RegisterScreen from 'screens/RegisterScreen';
import AdminScreen from 'screens/AdminScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen
          name="RegisterScreen"
          options={{ headerShown: false }}
          component={RegisterScreen}
        />
        <Stack.Screen name="HRScreen" options={{ headerShown: false }} component={HRScreen} />
        <Stack.Screen name="AdminScreen" options={{ headerShown: false }} component={AdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
