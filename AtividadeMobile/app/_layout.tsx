import { Stack } from 'expo-router';
import { AuthProvider } from './context/auth';

export default function RootLayout() {
  return (
    <AuthProvider>
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
      </Stack>
    </AuthProvider>
  );
}
