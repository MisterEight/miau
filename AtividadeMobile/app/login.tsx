import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth, Role } from './context/auth';

const PERFIS_DEMO = [
  {
    role: 'leitor' as Role,
    label: 'Leitor',
    desc: 'Leia notícias e deixe comentários',
    icon: 'book-outline' as const,
    cor: '#4A90D9',
  },
  {
    role: 'autor' as Role,
    label: 'Autor',
    desc: 'Crie e gerencie seus artigos',
    icon: 'create-outline' as const,
    cor: '#E94560',
  },
  {
    role: 'admin' as Role,
    label: 'Super Admin',
    desc: 'Controle total do sistema',
    icon: 'shield-checkmark-outline' as const,
    cor: '#F0A500',
  },
];

export default function LoginScreen() {
  const { login, loginComCredenciais } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [modoDemo, setModoDemo] = useState(false);

  function handleLogin() {
    setErro('');
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    const resultado = loginComCredenciais(email.trim(), senha);
    if (!resultado.ok) {
      setErro(resultado.erro ?? 'Erro ao fazer login.');
      return;
    }
    router.replace('/(tabs)');
  }

  function handleLoginDemo(role: Role) {
    login(role);
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="newspaper" size={48} color="#E94560" />
          </View>
          <Text style={styles.titulo}>Miau News</Text>
          <Text style={styles.sub}>Portal de Notícias</Text>
        </View>

        {/* Formulário de Login */}
        <View style={styles.formBox}>
          <Text style={styles.formTitulo}>Entrar na sua conta</Text>

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(t) => { setEmail(t); setErro(''); }}
            placeholder="seu@email.com"
            placeholderTextColor="#555"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={senha}
              onChangeText={(t) => { setSenha(t); setErro(''); }}
              placeholder="Sua senha"
              placeholderTextColor="#555"
              secureTextEntry={!verSenha}
            />
            <TouchableOpacity style={styles.olhoBtn} onPress={() => setVerSenha(!verSenha)}>
              <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {!!erro && (
            <View style={styles.erroBox}>
              <Ionicons name="alert-circle-outline" size={14} color="#E94560" />
              <Text style={styles.erroTexto}>{erro}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.botaoLogin} onPress={handleLogin} activeOpacity={0.8}>
            <Ionicons name="log-in-outline" size={18} color="#fff" />
            <Text style={styles.botaoTexto}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/lembrar')} style={styles.linkEsqueci}>
            <Text style={styles.linkEsqueciTexto}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>

        {/* Dica de contas demo */}
        <View style={styles.dicaBox}>
          <Ionicons name="information-circle-outline" size={14} color="#555" />
          <Text style={styles.dicaTexto}>Demo: use ana@miau.com / 123456 (autor) ou admin@miau.com / 123456</Text>
        </View>

        {/* Acesso rápido (demonstração) */}
        <TouchableOpacity style={styles.demoBotao} onPress={() => setModoDemo(!modoDemo)} activeOpacity={0.7}>
          <Text style={styles.demoTexto}>Acesso rápido (demonstração)</Text>
          <Ionicons name={modoDemo ? 'chevron-up' : 'chevron-down'} size={16} color="#555" />
        </TouchableOpacity>

        {modoDemo && (
          <View style={styles.demoSection}>
            {PERFIS_DEMO.map((p) => (
              <TouchableOpacity
                key={p.role}
                style={[styles.card, { borderLeftColor: p.cor }]}
                onPress={() => handleLoginDemo(p.role)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconBox, { backgroundColor: p.cor + '22' }]}>
                  <Ionicons name={p.icon} size={26} color={p.cor} />
                </View>
                <View style={styles.cardTexto}>
                  <Text style={styles.cardLabel}>{p.label}</Text>
                  <Text style={styles.cardDesc}>{p.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#444" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Criar conta */}
        <View style={styles.rodapeLinks}>
          <Text style={styles.rodapeTexto}>Não tem conta?</Text>
          <TouchableOpacity onPress={() => router.push('/cadastro')}>
            <Text style={styles.link}>Criar conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  scroll: { padding: 24, paddingBottom: 48 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 8 },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E94560',
    marginBottom: 14,
  },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold', letterSpacing: 1 },
  sub: { color: '#888', fontSize: 13, marginTop: 4 },
  formBox: {
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0F3460',
    marginBottom: 12,
  },
  formTitulo: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 18,
  },
  label: {
    color: '#E94560',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  olhoBtn: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    padding: 12,
  },
  erroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E9456015',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9456044',
  },
  erroTexto: { color: '#E94560', fontSize: 13, flex: 1 },
  botaoLogin: {
    backgroundColor: '#E94560',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  botaoTexto: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  linkEsqueci: { alignItems: 'center', paddingVertical: 4 },
  linkEsqueciTexto: { color: '#888', fontSize: 13 },
  dicaBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  dicaTexto: { color: '#444', fontSize: 11, flex: 1, lineHeight: 16 },
  demoBotao: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    marginBottom: 10,
  },
  demoTexto: { color: '#555', fontSize: 13 },
  demoSection: { gap: 8, marginBottom: 16 },
  card: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTexto: { flex: 1 },
  cardLabel: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 2 },
  cardDesc: { color: '#666', fontSize: 12 },
  rodapeLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  rodapeTexto: { color: '#666', fontSize: 14 },
  link: { color: '#E94560', fontSize: 14, fontWeight: '600' },
});
