import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const TAGS = ['Cultura', 'Ciência', 'Política', 'Tecnologia', 'Entretenimento'];

const UFS = ['SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'CE', 'PE', 'GO', 'DF'];

const COR_TAG: Record<string, string> = {
  Cultura: '#9B59B6',
  Ciência: '#2ECC71',
  Política: '#E74C3C',
  Tecnologia: '#3498DB',
  Entretenimento: '#F39C12',
};

export default function CriarScreen() {
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tag, setTag] = useState('');
  const [uf, setUf] = useState('');
  const [publicar, setPublicar] = useState(false);

  function handleSalvar() {
    if (!titulo.trim() || !conteudo.trim()) {
      Alert.alert('Atenção', 'Título e conteúdo são obrigatórios.');
      return;
    }
    Alert.alert(
      publicar ? 'Artigo publicado!' : 'Rascunho salvo!',
      publicar
        ? `"${titulo}" foi publicado com sucesso.`
        : `"${titulo}" foi salvo como rascunho.`,
      [{ text: 'OK', onPress: limpar }]
    );
  }

  function limpar() {
    setTitulo('');
    setResumo('');
    setConteudo('');
    setTag('');
    setUf('');
    setPublicar(false);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Novo Artigo</Text>

      {/* Título */}
      <View style={styles.campo}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Digite o título do artigo..."
          placeholderTextColor="#555"
          autoCapitalize="sentences"
          maxLength={120}
        />
        <Text style={styles.contador}>{titulo.length}/120</Text>
      </View>

      {/* Tag / Categoria */}
      <View style={styles.campo}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chips}>
          {TAGS.map((t) => {
            const cor = COR_TAG[t];
            const ativo = tag === t;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.chip, { borderColor: cor, backgroundColor: ativo ? cor : 'transparent' }]}
                onPress={() => setTag(ativo ? '' : t)}
              >
                <Text style={[styles.chipTexto, { color: ativo ? '#fff' : cor }]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* UF */}
      <View style={styles.campo}>
        <Text style={styles.label}>Estado (UF)</Text>
        <View style={styles.chips}>
          {UFS.map((u) => {
            const ativo = uf === u;
            return (
              <TouchableOpacity
                key={u}
                style={[styles.chipUf, ativo && styles.chipUfAtivo]}
                onPress={() => setUf(ativo ? '' : u)}
              >
                <Text style={[styles.chipUfTexto, ativo && styles.chipUfTextoAtivo]}>{u}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Resumo */}
      <View style={styles.campo}>
        <Text style={styles.label}>Resumo</Text>
        <TextInput
          style={[styles.input, styles.inputMedio]}
          value={resumo}
          onChangeText={setResumo}
          placeholder="Breve descrição do artigo (aparece na listagem)..."
          placeholderTextColor="#555"
          multiline
          textAlignVertical="top"
          maxLength={280}
        />
        <Text style={styles.contador}>{resumo.length}/280</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.campo}>
        <Text style={styles.label}>Conteúdo *</Text>
        <TextInput
          style={[styles.input, styles.inputGrande]}
          value={conteudo}
          onChangeText={setConteudo}
          placeholder="Escreva o artigo completo aqui..."
          placeholderTextColor="#555"
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Toggle publicar */}
      <TouchableOpacity
        style={styles.toggleRow}
        onPress={() => setPublicar(!publicar)}
        activeOpacity={0.7}
      >
        <View style={[styles.toggle, publicar && styles.toggleAtivo]}>
          <View style={[styles.toggleCirculo, publicar && styles.toggleCirculoAtivo]} />
        </View>
        <View>
          <Text style={styles.toggleLabel}>
            {publicar ? 'Publicar imediatamente' : 'Salvar como rascunho'}
          </Text>
          <Text style={styles.toggleDesc}>
            {publicar
              ? 'Ficará visível para todos os leitores'
              : 'Você pode publicar depois'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botões */}
      <TouchableOpacity style={styles.botao} onPress={handleSalvar} activeOpacity={0.8}>
        <Ionicons name={publicar ? 'send' : 'save-outline'} size={18} color="#fff" />
        <Text style={styles.botaoTexto}>{publicar ? 'Publicar Artigo' : 'Salvar Rascunho'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoLimpar} onPress={limpar} activeOpacity={0.8}>
        <Ionicons name="refresh-outline" size={16} color="#888" />
        <Text style={styles.botaoLimparTexto}>Limpar formulário</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  content: { padding: 20, paddingBottom: 48 },
  heading: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  campo: { marginBottom: 20 },
  label: {
    color: '#E94560',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
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
  inputMedio: { height: 80, paddingTop: 12 },
  inputGrande: { height: 180, paddingTop: 12 },
  contador: { color: '#444', fontSize: 11, textAlign: 'right', marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipTexto: { fontSize: 13, fontWeight: '500' },
  chipUf: {
    borderWidth: 1,
    borderColor: '#0F3460',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#16213E',
  },
  chipUfAtivo: { backgroundColor: '#E94560', borderColor: '#E94560' },
  chipUfTexto: { color: '#888', fontSize: 12 },
  chipUfTextoAtivo: { color: '#fff', fontWeight: '600' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F3460',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleAtivo: { backgroundColor: '#E94560' },
  toggleCirculo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#888',
    alignSelf: 'flex-start',
  },
  toggleCirculoAtivo: { backgroundColor: '#fff', alignSelf: 'flex-end' },
  toggleLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  toggleDesc: { color: '#666', fontSize: 12, marginTop: 2 },
  botao: {
    backgroundColor: '#E94560',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoLimpar: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  botaoLimparTexto: { color: '#888', fontSize: 14 },
});
