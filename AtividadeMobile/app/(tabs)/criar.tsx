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
import { useAppStore } from '../context/appStore';
import { useAuth } from '../context/auth';

const UFS = ['SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'CE', 'PE', 'GO', 'DF'];

const NOME_POR_ROLE: Record<string, string> = {
  autor: 'Ana Souza',
  editor: 'Elisa Ramos',
  admin: 'Super Admin',
  leitor: 'Usuário Demo',
};

export default function CriarScreen() {
  const router = useRouter();
  const { addNoticia, tags } = useAppStore();
  const { role } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tag, setTag] = useState('');
  const [uf, setUf] = useState('');
  const [publicar, setPublicar] = useState(false);
  const [erro, setErro] = useState('');

  // Estado de sucesso: guarda o ID e o modo (publicado ou rascunho)
  const [noticiaId, setNoticiaId] = useState<string | null>(null);
  const [foiPublicada, setFoiPublicada] = useState(false);

  function handleSalvar() {
    setErro('');
    if (!titulo.trim()) {
      setErro('O título é obrigatório.');
      return;
    }
    if (!conteudo.trim()) {
      setErro('O conteúdo é obrigatório.');
      return;
    }

    const autor = NOME_POR_ROLE[role as string] ?? 'Demo';
    const hoje = new Date();
    const data = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });

    const id = addNoticia({
      titulo: titulo.trim(),
      resumo: resumo.trim() || titulo.trim(),
      autor,
      data,
      tag: tag || 'Geral',
      uf: uf || 'SP',
      publicada: publicar,
    });

    setNoticiaId(id);
    setFoiPublicada(publicar);
  }

  function limpar() {
    setTitulo('');
    setResumo('');
    setConteudo('');
    setTag('');
    setUf('');
    setPublicar(false);
    setErro('');
    setNoticiaId(null);
  }

  // Tela de sucesso
  if (noticiaId) {
    return (
      <View style={styles.sucessoContainer}>
        <View style={styles.sucessoIcone}>
          <Ionicons
            name={foiPublicada ? 'checkmark-circle' : 'save'}
            size={64}
            color={foiPublicada ? '#2ECC71' : '#4A90D9'}
          />
        </View>
        <Text style={styles.sucessoTitulo}>
          {foiPublicada ? 'Artigo publicado!' : 'Rascunho salvo!'}
        </Text>
        <Text style={styles.sucessoSub} numberOfLines={3}>
          "{titulo}"
        </Text>
        <Text style={styles.sucessoDesc}>
          {foiPublicada
            ? 'Seu artigo já está visível para todos os leitores.'
            : 'Você pode publicá-lo depois em Minhas Notícias.'}
        </Text>

        {foiPublicada && (
          <TouchableOpacity
            style={styles.botaoPrimario}
            onPress={() => router.push(`/noticia/${noticiaId}`)}
            activeOpacity={0.8}
          >
            <Ionicons name="newspaper-outline" size={18} color="#fff" />
            <Text style={styles.botaoPrimarioTexto}>Ver artigo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={foiPublicada ? styles.botaoSecundario : styles.botaoPrimario}
          onPress={() => router.push('/(tabs)/minhas-noticias')}
          activeOpacity={0.8}
        >
          <Ionicons name="list-outline" size={18} color={foiPublicada ? '#888' : '#fff'} />
          <Text style={foiPublicada ? styles.botaoSecundarioTexto : styles.botaoPrimarioTexto}>
            Minhas notícias
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoLimpar} onPress={limpar} activeOpacity={0.8}>
          <Ionicons name="add-outline" size={16} color="#888" />
          <Text style={styles.botaoLimparTexto}>Criar outro artigo</Text>
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
      <Text style={styles.heading}>Novo Artigo</Text>

      {!!erro && (
        <View style={styles.erroBox}>
          <Ionicons name="alert-circle-outline" size={16} color="#E94560" />
          <Text style={styles.erroTexto}>{erro}</Text>
        </View>
      )}

      {/* Título */}
      <View style={styles.campo}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={(t) => { setTitulo(t); setErro(''); }}
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
          {tags.map((t) => {
            const ativo = tag === t.nome;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.chip, { borderColor: t.cor, backgroundColor: ativo ? t.cor : 'transparent' }]}
                onPress={() => setTag(ativo ? '' : t.nome)}
              >
                <Text style={[styles.chipTexto, { color: ativo ? '#fff' : t.cor }]}>{t.nome}</Text>
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
          onChangeText={(t) => { setConteudo(t); setErro(''); }}
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

      <TouchableOpacity style={styles.botaoLimparForm} onPress={limpar} activeOpacity={0.8}>
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
  botaoLimparForm: {
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
  // Tela de sucesso
  sucessoContainer: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  sucessoIcone: { marginBottom: 8 },
  sucessoTitulo: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  sucessoSub: {
    color: '#E94560',
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  sucessoDesc: { color: '#666', fontSize: 13, textAlign: 'center', marginBottom: 16 },
  botaoPrimario: {
    backgroundColor: '#E94560',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  botaoPrimarioTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },
  botaoSecundario: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  botaoSecundarioTexto: { color: '#888', fontSize: 15 },
  botaoLimpar: {
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
});
