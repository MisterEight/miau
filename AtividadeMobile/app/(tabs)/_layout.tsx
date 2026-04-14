import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/auth';

const TAB_STYLE = {
  tabBarActiveTintColor: '#E94560',
  headerStyle: { backgroundColor: '#1A1A2E' },
  headerTintColor: '#fff',
  tabBarStyle: { backgroundColor: '#1A1A2E', borderTopColor: '#0F3460' },
  tabBarInactiveTintColor: '#666',
};

export default function TabLayout() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!role) {
      router.replace('/login');
    }
  }, [role]);

  const isAutor = role === 'autor';
  const isEditor = role === 'editor';
  const isAdmin = role === 'admin';
  const isLeitor = role === 'leitor';

  // Visibilidade: undefined = visível, null = oculto
  const hrefAutorOuAdmin = isAutor || isAdmin ? undefined : null;
  const hrefEditorOuAdmin = isEditor || isAdmin ? undefined : null;
  const hrefSomenteLeitor = isLeitor ? undefined : null;
  const hrefSomenteAdmin = isAdmin ? undefined : null;
  return (
    <Tabs screenOptions={TAB_STYLE}>
      {/* HOME — todos */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* BUSCAR — leitor */}
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          href: hrefSomenteLeitor,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* MINHAS NOTÍCIAS — autor */}
      <Tabs.Screen
        name="minhas-noticias"
        options={{
          title: 'Minhas',
          href: isAutor ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'newspaper' : 'newspaper-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* CRIAR / NOVA NOTÍCIA — autor + admin */}
      <Tabs.Screen
        name="criar"
        options={{
          title: 'Criar',
          href: hrefAutorOuAdmin,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* PAINEL — editor + admin */}
      <Tabs.Screen
        name="painel"
        options={{
          title: 'Painel',
          href: hrefEditorOuAdmin,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'albums' : 'albums-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* DASHBOARD — admin */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          href: hrefSomenteAdmin,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* PERFIL — todos */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Telas herdadas da Entrega 1 — ocultas */}
      <Tabs.Screen name="icones" options={{ href: null }} />
      <Tabs.Screen name="formulario" options={{ href: null }} />
    </Tabs>
  );
}
