import { Stack } from 'expo-router';
import { AuthProvider } from './context/auth';
import { AppStoreProvider } from './context/appStore';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppStoreProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ headerShown: false }} />
        <Stack.Screen name="lembrar" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="noticia/[id]"
          options={{
            title: 'Notícia',
            headerStyle: { backgroundColor: '#1A1A2E' },
            headerTintColor: '#fff',
            headerBackTitle: 'Voltar',
          }}
        />
        <Stack.Screen
          name="crud-perfis"
          options={{
            title: 'CRUD Perfis',
            headerStyle: { backgroundColor: '#1A1A2E' },
            headerTintColor: '#fff',
            headerBackTitle: 'Voltar',
          }}
        />
        <Stack.Screen
          name="crud-uf"
          options={{
            title: 'CRUD UF',
            headerStyle: { backgroundColor: '#1A1A2E' },
            headerTintColor: '#fff',
            headerBackTitle: 'Voltar',
          }}
        />
        <Stack.Screen
          name="crud-cidades"
          options={{
            title: 'CRUD Cidades',
            headerStyle: { backgroundColor: '#1A1A2E' },
            headerTintColor: '#fff',
            headerBackTitle: 'Voltar',
          }}
        />
      </Stack>
      </AppStoreProvider>
    </AuthProvider>
  );
}
