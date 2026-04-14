import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LembrarScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  function handleEnviar() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail.');
      return;
    }
    setEnviado(true);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#E94560" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </TouchableOpacity>

      {!enviado ? (
        <View style={styles.form}>
          <View style={styles.iconeContainer}>
            <Ionicons name="lock-open-outline" size={48} color="#E94560" />
          </View>

          <Text style={styles.titulo}>Recuperar Senha</Text>
          <Text style={styles.sub}>
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </Text>

          <View style={styles.campo}>
            <Text style={styles.label}>E-mail cadastrado</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Ex: leo@email.com"
              placeholderTextColor="#555"
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
          </View>

          <TouchableOpacity style={styles.botao} onPress={handleEnviar} activeOpacity={0.8}>
            <Ionicons name="send-outline" size={18} color="#fff" />
            <Text style={styles.botaoTexto}>Enviar link de recuperação</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.sucesso}>
          <View style={styles.sucessoIcone}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
          </View>
          <Text style={styles.sucessoTitulo}>E-mail enviado!</Text>
          <Text style={styles.sucessoTexto}>
            Verifique sua caixa de entrada em{' '}
            <Text style={styles.emailDestaque}>{email}</Text> e siga as instruções para
            redefinir sua senha.
          </Text>

          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => router.replace('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.botaoVoltarTexto}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    padding: 24,
  },
  voltar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 40 },
  voltarTexto: { color: '#E94560', fontSize: 14 },
  form: { flex: 1, justifyContent: 'center' },
  iconeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#0F3460',
  },
  titulo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  campo: { marginBottom: 20 },
  label: {
    color: '#E94560',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#16213E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  botao: {
    backgroundColor: '#E94560',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  botaoTexto: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  sucesso: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sucessoIcone: { marginBottom: 20 },
  sucessoTitulo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sucessoTexto: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  emailDestaque: { color: '#E94560', fontWeight: '600' },
  botaoVoltar: {
    borderWidth: 1,
    borderColor: '#E94560',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 32,
  },
  botaoVoltarTexto: { color: '#E94560', fontSize: 15, fontWeight: '600' },
});
