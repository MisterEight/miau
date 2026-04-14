import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppStore } from '../context/appStore';
import { useAuth } from '../context/auth';

const COR_TAG: Record<string, string> = {
  Cultura: '#9B59B6',
  Ciência: '#2ECC71',
  Política: '#E74C3C',
  Tecnologia: '#3498DB',
  Entretenimento: '#F39C12',
};

const NOME_POR_ROLE: Record<string, string> = {
  autor: 'Ana Souza',
  editor: 'Elisa Ramos',
  admin: 'Super Admin',
  leitor: 'Leitor',
};

export default function NoticiaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { role } = useAuth();
  const { noticias, getComentarios, addComentario } = useAppStore();

  const noticia = noticias.find((n) => n.id === id);
  const comentarios = getComentarios(id!);

  const [novoComentario, setNovoComentario] = useState('');
  const [curtidas, setCurtidas] = useState<Set<number>>(new Set());

  if (!noticia) {
    return (
      <View style={styles.erro}>
        <Ionicons name="alert-circle-outline" size={48} color="#E94560" />
        <Text style={styles.erroTexto}>Notícia não encontrada.</Text>
      </View>
    );
  }

  const cor = COR_TAG[noticia.tag] ?? '#888';

  function handleComentar() {
    if (!novoComentario.trim()) return;
    const autorNome = NOME_POR_ROLE[role as string] ?? 'Você';
    addComentario(id!, novoComentario.trim(), autorNome);
    setNovoComentario('');
  }

  function toggleCurtida(comentarioId: number) {
    setCurtidas((prev) => {
      const next = new Set(prev);
      next.has(comentarioId) ? next.delete(comentarioId) : next.add(comentarioId);
      return next;
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Tag e UF */}
        <View style={styles.metaTopo}>
          <View style={[styles.tagBadge, { backgroundColor: cor + '22', borderColor: cor }]}>
            <Text style={[styles.tagTexto, { color: cor }]}>{noticia.tag}</Text>
          </View>
          <Text style={styles.uf}>{noticia.uf}</Text>
        </View>

        {/* Título */}
        <Text style={styles.titulo}>{noticia.titulo}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          <Ionicons name="person-circle-outline" size={16} color="#E94560" />
          <Text style={styles.autor}>{noticia.autor}</Text>
          <Text style={styles.separador}>·</Text>
          <Text style={styles.data}>{noticia.data}</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={14} color="#666" />
            <Text style={styles.statTexto}>{noticia.leituras.toLocaleString('pt-BR')} leituras</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble-outline" size={14} color="#666" />
            <Text style={styles.statTexto}>{comentarios.length} comentários</Text>
          </View>
        </View>

        {/* Divisor */}
        <View style={styles.divisor} />

        {/* Resumo em destaque */}
        <View style={styles.resumoBox}>
          <Text style={styles.resumoTexto}>{noticia.resumo}</Text>
        </View>

        {/* Conteúdo (simulado) */}
        <Text style={styles.paragrafo}>
          Esta é uma matéria de simulação para o portal Miau News. O conteúdo completo
          estaria aqui em um sistema real, carregado do banco de dados via ORM (Drizzle).
        </Text>
        <Text style={styles.paragrafo}>
          O portal permite que autores publiquem artigos, editores moderem o conteúdo e
          leitores interajam por meio de comentários e curtidas.
        </Text>
        <Text style={styles.paragrafo}>
          O Super Admin tem controle total, gerenciando usuários, perfis, tags, UFs e
          moderando toda a plataforma via dashboard.
        </Text>

        {/* Divisor */}
        <View style={styles.divisor} />

        {/* Seção de comentários */}
        <Text style={styles.comentariosTitulo}>
          Comentários ({comentarios.length})
        </Text>

        {/* Campo novo comentário */}
        <View style={styles.novoComentarioBox}>
          <TextInput
            style={styles.novoComentarioInput}
            value={novoComentario}
            onChangeText={setNovoComentario}
            placeholder={role ? 'Escreva um comentário...' : 'Faça login para comentar'}
            placeholderTextColor="#555"
            multiline
            editable={!!role}
          />
          <TouchableOpacity
            style={[styles.enviarBtn, !novoComentario.trim() && styles.enviarBtnDisabled]}
            onPress={handleComentar}
            disabled={!novoComentario.trim()}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Lista de comentários */}
        {comentarios.map((c) => {
          const curtido = curtidas.has(c.id);
          return (
            <View key={c.id} style={styles.comentarioCard}>
              <View style={styles.comentarioTopo}>
                <View style={styles.comentarioAvatar}>
                  <Text style={styles.comentarioLetra}>{c.autor[0]}</Text>
                </View>
                <View>
                  <Text style={styles.comentarioAutor}>{c.autor}</Text>
                  <Text style={styles.comentarioData}>{c.data}</Text>
                </View>
              </View>
              <Text style={styles.comentarioTexto}>{c.texto}</Text>
              <TouchableOpacity
                style={styles.curtirBtn}
                onPress={() => toggleCurtida(c.id)}
              >
                <Ionicons
                  name={curtido ? 'heart' : 'heart-outline'}
                  size={15}
                  color={curtido ? '#E94560' : '#666'}
                />
                <Text style={[styles.curtirTexto, curtido && { color: '#E94560' }]}>
                  {c.curtidas + (curtido ? 1 : 0)}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  content: { padding: 20, paddingBottom: 48 },
  erro: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  erroTexto: { color: '#888', fontSize: 16 },
  metaTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagBadge: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3 },
  tagTexto: { fontSize: 12, fontWeight: '600' },
  uf: { color: '#555', fontSize: 13 },
  titulo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 30,
    marginBottom: 12,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  autor: { color: '#E94560', fontSize: 13 },
  separador: { color: '#444' },
  data: { color: '#666', fontSize: 13 },
  stats: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statTexto: { color: '#666', fontSize: 13 },
  divisor: { height: 1, backgroundColor: '#0F3460', marginVertical: 16 },
  resumoBox: {
    backgroundColor: '#16213E',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E94560',
    padding: 14,
    marginBottom: 16,
  },
  resumoTexto: { color: '#ccc', fontSize: 14, lineHeight: 21, fontStyle: 'italic' },
  paragrafo: {
    color: '#bbb',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 14,
  },
  comentariosTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  novoComentarioBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 16,
  },
  novoComentarioInput: {
    flex: 1,
    backgroundColor: '#16213E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    color: '#fff',
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 100,
  },
  enviarBtn: {
    backgroundColor: '#E94560',
    borderRadius: 10,
    padding: 12,
  },
  enviarBtnDisabled: { backgroundColor: '#3a1a24' },
  comentarioCard: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  comentarioTopo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  comentarioAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E9456022',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E94560',
  },
  comentarioLetra: { color: '#E94560', fontWeight: 'bold', fontSize: 15 },
  comentarioAutor: { color: '#fff', fontSize: 13, fontWeight: '600' },
  comentarioData: { color: '#555', fontSize: 11 },
  comentarioTexto: { color: '#ccc', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  curtirBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  curtirTexto: { color: '#666', fontSize: 13 },
});
