import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from './context/auth';

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

export default function CadastroScreen() {
  const router = useRouter();
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [uf, setUf] = useState('');
  const [mostrarUfs, setMostrarUfs] = useState(false);
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  function handleCadastro() {
    setErro('');
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }
    const resultado = cadastrar(nome.trim(), email.trim(), senha, uf);
    console.log(resultado)
    if (!resultado.ok) {
      setErro(resultado.erro ?? 'Erro ao cadastrar.');
      return;
    }
    setSucesso(true);
  }

  if (sucesso) {
    return (
      <View style={styles.sucessoContainer}>
        <View style={styles.sucessoIcone}>
          <Ionicons name="checkmark-circle" size={64} color="#2ECC71" />
        </View>
        <Text style={styles.sucessoTitulo}>Conta criada!</Text>
        <Text style={styles.sucessoSub}>
          Bem-vindo, {nome}!{'\n'}Faça login com seu e-mail e senha.
        </Text>
        <TouchableOpacity style={styles.sucessoBotao} onPress={() => router.replace('/login')} activeOpacity={0.8}>
          <Ionicons name="log-in-outline" size={18} color="#fff" />
          <Text style={styles.sucessoBotaoTexto}>Ir para Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#E94560" />
        <Text style={styles.voltarTexto}>Voltar ao Login</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Criar Conta</Text>
      <Text style={styles.sub}>Preencha os dados para se cadastrar</Text>

      {!!erro && (
        <View style={styles.erroBox}>
          <Ionicons name="alert-circle-outline" size={16} color="#E94560" />
          <Text style={styles.erroTexto}>{erro}</Text>
        </View>
      )}

      <View style={styles.campo}>
        <Text style={styles.label}>Nome completo *</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={(t) => { setNome(t); setErro(''); }}
          placeholder="Ex: Leonardo Alcântara"
          placeholderTextColor="#555"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>E-mail *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(t) => { setEmail(t); setErro(''); }}
          placeholder="Ex: leo@email.com"
          placeholderTextColor="#555"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>Estado (UF)</Text>
        <TouchableOpacity
          style={styles.seletor}
          onPress={() => setMostrarUfs(!mostrarUfs)}
        >
          <Text style={uf ? styles.seletorTexto : styles.seletorPlaceholder}>
            {uf || 'Selecione seu estado'}
          </Text>
          <Ionicons
            name={mostrarUfs ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#888"
          />
        </TouchableOpacity>
        {mostrarUfs && (
          <View style={styles.ufGrid}>
            {UFS.map((u) => (
              <TouchableOpacity
                key={u}
                style={[styles.ufChip, uf === u && styles.ufChipAtivo]}
                onPress={() => { setUf(u); setMostrarUfs(false); }}
              >
                <Text style={[styles.ufTexto, uf === u && styles.ufTextoAtivo]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>Senha *</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={senha}
            onChangeText={(t) => { setSenha(t); setErro(''); }}
            placeholder="Mín. 6 caracteres"
            placeholderTextColor="#555"
            secureTextEntry={!verSenha}
          />
          <TouchableOpacity style={styles.olhoBtn} onPress={() => setVerSenha(!verSenha)}>
            <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>Confirmar senha *</Text>
        <TextInput
          style={styles.input}
          value={confirmar}
          onChangeText={(t) => { setConfirmar(t); setErro(''); }}
          placeholder="Repita a senha"
          placeholderTextColor="#555"
          secureTextEntry={!verSenha}
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleCadastro} activeOpacity={0.8}>
        <Ionicons name="person-add-outline" size={18} color="#fff" />
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.linkLogin}>
        <Text style={styles.linkLoginTexto}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  content: { padding: 24, paddingBottom: 48 },
  voltar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 28 },
  voltarTexto: { color: '#E94560', fontSize: 14 },
  titulo: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  sub: { color: '#888', fontSize: 13, marginBottom: 20 },
  erroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E9456015',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9456044',
  },
  erroTexto: { color: '#E94560', fontSize: 13, flex: 1 },
  campo: { marginBottom: 18 },
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
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  olhoBtn: {
    backgroundColor: '#16213E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    padding: 12,
  },
  seletor: {
    backgroundColor: '#16213E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seletorTexto: { color: '#fff', fontSize: 15 },
  seletorPlaceholder: { color: '#555', fontSize: 15 },
  ufGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  ufChip: {
    borderWidth: 1,
    borderColor: '#0F3460',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#16213E',
  },
  ufChipAtivo: { backgroundColor: '#E94560', borderColor: '#E94560' },
  ufTexto: { color: '#888', fontSize: 13 },
  ufTextoAtivo: { color: '#fff', fontWeight: '600' },
  botao: {
    backgroundColor: '#E94560',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkLogin: { alignItems: 'center', marginTop: 16 },
  linkLoginTexto: { color: '#888', fontSize: 14 },
  // Tela de sucesso
  sucessoContainer: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  sucessoIcone: { marginBottom: 24 },
  sucessoTitulo: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  sucessoSub: { color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  sucessoBotao: {
    backgroundColor: '#E94560',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sucessoBotaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
