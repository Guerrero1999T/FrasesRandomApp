import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';

// Importa el archivo JSON con tus frases
const frases = require('./2000_frases_motivadoras_divertidas_provocativas.json');

// Define el Drawer fuera del componente principal
const Drawer = createDrawerNavigator();

// Configuración básica de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Registrar canal de notificaciones en Android
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Frases del día ✨',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

// Función para pedir permisos de notificaciones
async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permiso de notificaciones no concedido');
  }
}

// Función para programar notificación con frase aleatoria
async function scheduleRandomNotification(seconds) {
  const randomIndex = Math.floor(Math.random() * frases.length);
  const frase = frases[randomIndex];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Frase del día ✨',
      body: frase.texto || frase,
    },
    trigger: {
      seconds,
      repeats: false,
    },
  });
}

// Programar varias notificaciones al día
async function scheduleDailyNotifications() {
  const intervals = [60 * 60 * 3, 60 * 60 * 6, 60 * 60 * 9]; // 3h, 6h, 9h
  for (let seconds of intervals) {
    await scheduleRandomNotification(seconds);
  }
}

function HomeScreen() {
  React.useEffect(() => {
    requestNotificationPermissions();
    scheduleDailyNotifications();
  }, []);

  return (
    <LinearGradient colors={GRADIENT_COLORS} style={styles.container}>
      <Text style={styles.title}>
        Bienvenido a mi aplicación de frases aleatorias 🎉
      </Text>
      <TouchableOpacity style={styles.button} onPress={scheduleDailyNotifications}>
        <Text style={styles.buttonText}>🔔 Reprogramar frases del día</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

function PhrasesScreen({ route }) {
  const { categoria } = route.params || {};
  const frasesFiltradas = categoria
    ? frases.filter((f) => f.tipo === categoria)
    : frases;

  const [frase, setFrase] = React.useState('');

  const getRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * frasesFiltradas.length);
    const fraseSeleccionada = frasesFiltradas[randomIndex];
    setFrase(fraseSeleccionada.texto || fraseSeleccionada);
  };

  React.useEffect(() => {
    getRandomPhrase();
  }, []);

  return (
    <LinearGradient colors={GRADIENT_COLORS} style={styles.container}>
      <Text style={styles.phrase}>{frase}</Text>
      <TouchableOpacity style={styles.button} onPress={getRandomPhrase}>
        <Text style={styles.buttonText}>🔄 Nueva frase</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

function SettingsScreen() {
  return (
    <LinearGradient colors={GRADIENT_COLORS} style={styles.container}>
      <Text style={styles.text}>Configuraciones ⚙️</Text>
    </LinearGradient>
  );
}

function AboutScreen() {
  return (
    <LinearGradient colors={GRADIENT_COLORS} style={styles.container}>
      <Text style={styles.text}>Acerca de 📖</Text>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: 'red' },
          headerTintColor: '#fff',
          drawerActiveTintColor: 'red',
        }}
      >
        <Drawer.Screen name="Inicio" component={HomeScreen} />
        <Drawer.Screen name="Frases" component={PhrasesScreen} />
        <Drawer.Screen
          name="Motivadoras"
          component={PhrasesScreen}
          initialParams={{ categoria: 'motivadora' }}
        />
        <Drawer.Screen
          name="Divertidas"
          component={PhrasesScreen}
          initialParams={{ categoria: 'divertida' }}
        />
        <Drawer.Screen
          name="Provocativas"
          component={PhrasesScreen}
          initialParams={{ categoria: 'provocativa' }}
        />
        <Drawer.Screen name="Configuraciones" component={SettingsScreen} />
        <Drawer.Screen name="Acerca de" component={AboutScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// Constante para gradiente
const GRADIENT_COLORS = ['#ff0000', '#990000'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  phrase: {
    color: '#fff',
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});