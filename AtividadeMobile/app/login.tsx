import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth, Role } from './context/auth';

type PerfilOpcao = {
  role: Role;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  cor: string;
};

const PERFIS: PerfilOpcao[] = [
  {
    role: 'leitor',
    label: 'Leitor',
    desc: 'Leia notícias e deixe comentários',
    icon: 'book-outline',
    cor: '#4A90D9',
  },
  {
    role: 'autor',
    label: 'Autor',
    desc: 'Crie e gerencie seus artigos',
    icon: 'create-outline',
    cor: '#E94560',
  },
  {
    role: 'admin',
    label: 'Super Admin',
    desc: 'Controle total do sistema',
    icon: 'shield-checkmark-outline',
    cor: '#F0A500',
  },
];

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  function handleLogin(role: Role) {
    login(role);
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="newspaper" size={48} color="#E94560" />
        </View>
        <Text style={styles.titulo}>Miau News</Text>
        <Text style={styles.sub}>Portal de Notícias</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Entrar como</Text>

        {PERFIS.map((p) => (
          <TouchableOpacity
            key={p.role}
            style={[styles.card, { borderLeftColor: p.cor }]}
            onPress={() => handleLogin(p.role)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, { backgroundColor: p.cor + '22' }]}>
              <Ionicons name={p.icon} size={28} color={p.cor} />
            </View>
            <View style={styles.cardTexto}>
              <Text style={styles.cardLabel}>{p.label}</Text>
              <Text style={styles.cardDesc}>{p.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#444" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.rodapeLinks}>
        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>
        <Text style={styles.separador}>·</Text>
        <TouchableOpacity onPress={() => router.push('/lembrar')}>
          <Text style={styles.link}>Esqueci a senha</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.rodapeNota}>Modo de simulação — sem autenticação real</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E94560',
    marginBottom: 16,
  },
  titulo: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sub: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
  },
  secao: {
    gap: 12,
  },
  secaoTitulo: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#16213E',
    borderRadius: 14,
    borderLeftWidth: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTexto: {
    flex: 1,
  },
  cardLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDesc: {
    color: '#666',
    fontSize: 12,
  },
  rodapeLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  link: {
    color: '#E94560',
    fontSize: 14,
    fontWeight: '500',
  },
  separador: {
    color: '#444',
    fontSize: 14,
  },
  rodapeNota: {
    color: '#333',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
  },
});
