import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

export default function FormularioScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [mensagem, setMensagem] = useState('');

  function handleEnviar() {
    if (!nome.trim() || !email.trim() || !idade.trim()) {
      Alert.alert('Ops!', 'Preenche pelo menos nome, email e idade.');
      return;
    }

    Alert.alert(
      'Dados recebidos!',
      `Nome: ${nome}\nEmail: ${email}\nIdade: ${idade}\nMensagem: ${mensagem || '(vazia)'}`,
      [{ text: 'OK', onPress: () => limparForm() }]
    );
  }

  function limparForm() {
    setNome('');
    setEmail('');
    setIdade('');
    setMensagem('');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Formulário</Text>
      <Text style={styles.sub}>Preenche os campos abaixo</Text>

      <View style={styles.campo}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Leonardo"
          placeholderTextColor="#555"
          keyboardType="default"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Ex: leo@email.com"
          placeholderTextColor="#555"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          value={idade}
          onChangeText={setIdade}
          placeholder="Ex: 21"
          placeholderTextColor="#555"
          keyboardType="numeric"
          maxLength={3}
        />
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>Mensagem</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={mensagem}
          onChangeText={setMensagem}
          placeholder="Escreve o que quiser..."
          placeholderTextColor="#555"
          keyboardType="default"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleEnviar} activeOpacity={0.8}>
        <Text style={styles.botaoTexto}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoLimpar} onPress={limparForm} activeOpacity={0.8}>
        <Text style={styles.botaoLimparTexto}>Limpar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sub: {
    color: '#888',
    fontSize: 13,
    marginBottom: 24,
  },
  campo: {
    marginBottom: 16,
  },
  label: {
    color: '#E94560',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  inputMultiline: {
    height: 110,
    paddingTop: 12,
  },
  botao: {
    backgroundColor: '#E94560',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  botaoLimpar: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  botaoLimparTexto: {
    color: '#888',
    fontSize: 14,
  },
});
