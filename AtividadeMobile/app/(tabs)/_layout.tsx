import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E94560',
        headerStyle: { backgroundColor: '#1A1A2E' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#1A1A2E' },
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Foto',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'image' : 'image-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="icones"
        options={{
          title: 'Ícones',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'apps' : 'apps-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="formulario"
        options={{
          title: 'Formulário',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
