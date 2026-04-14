import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NOTICIAS, Noticia } from './index';

const COR_TAG: Record<string, string> = {
  Cultura: '#9B59B6',
  Ciência: '#2ECC71',
  Política: '#E74C3C',
  Tecnologia: '#3498DB',
  Entretenimento: '#F39C12',
};

type Filtro = 'todos' | 'publicadas' | 'rascunhos';

export default function PainelScreen() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<Noticia[]>(NOTICIAS);
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const filtradas = noticias.filter((n) => {
    if (filtro === 'publicadas') return n.publicada;
    if (filtro === 'rascunhos') return !n.publicada;
    return true;
  });

  function togglePublicar(id: string) {
    setNoticias((prev) =>
      prev.map((n) => (n.id === id ? { ...n, publicada: !n.publicada } : n))
    );
  }

  function handleEditar(n: Noticia) {
    Alert.alert('Editar notícia', `Abrindo editor para:\n"${n.titulo}"`, [
      { text: 'OK' },
    ]);
  }

  const publicadas = noticias.filter((n) => n.publicada).length;
  const rascunhos = noticias.filter((n) => !n.publicada).length;

  const FILTROS: { key: Filtro; label: string }[] = [
    { key: 'todos', label: `Todos (${noticias.length})` },
    { key: 'publicadas', label: `Publicadas (${publicadas})` },
    { key: 'rascunhos', label: `Rascunhos (${rascunhos})` },
  ];

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Ionicons name="newspaper-outline" size={22} color="#4A90D9" />
          <Text style={styles.statNum}>{noticias.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#2ECC71" />
          <Text style={[styles.statNum, { color: '#2ECC71' }]}>{publicadas}</Text>
          <Text style={styles.statLabel}>Publicadas</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={22} color="#F0A500" />
          <Text style={[styles.statNum, { color: '#F0A500' }]}>{rascunhos}</Text>
          <Text style={styles.statLabel}>Rascunhos</Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtros}>
        {FILTROS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filtroBotao, filtro === f.key && styles.filtroBotaoAtivo]}
            onPress={() => setFiltro(f.key)}
          >
            <Text style={[styles.filtroTexto, filtro === f.key && styles.filtroTextoAtivo]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const cor = COR_TAG[item.tag] ?? '#888';
          return (
            <View style={styles.card}>
              <View style={styles.cardTopo}>
                <View style={[styles.tagBadge, { backgroundColor: cor + '22', borderColor: cor }]}>
                  <Text style={[styles.tagTexto, { color: cor }]}>{item.tag}</Text>
                </View>
                <Text style={styles.uf}>{item.uf} · {item.data}</Text>
              </View>

              <Text style={styles.titulo} numberOfLines={2}>{item.titulo}</Text>
              <Text style={styles.autor}>por {item.autor}</Text>

              <View style={styles.stats2}>
                <View style={styles.stat}>
                  <Ionicons name="eye-outline" size={13} color="#666" />
                  <Text style={styles.statTexto}>{item.leituras.toLocaleString('pt-BR')}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="chatbubble-outline" size={13} color="#666" />
                  <Text style={styles.statTexto}>{item.comentarios}</Text>
                </View>
              </View>

              {/* Ações do editor */}
              <View style={styles.acoes}>
                <TouchableOpacity
                  style={styles.acaoBotao}
                  onPress={() => router.push(`/noticia/${item.id}`)}
                >
                  <Ionicons name="eye-outline" size={15} color="#4A90D9" />
                  <Text style={[styles.acaoTexto, { color: '#4A90D9' }]}>Ver</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.acaoBotao}
                  onPress={() => handleEditar(item)}
                >
                  <Ionicons name="pencil-outline" size={15} color="#E94560" />
                  <Text style={[styles.acaoTexto, { color: '#E94560' }]}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.acaoBotaoPublicar,
                    { backgroundColor: item.publicada ? '#F0A50022' : '#2ECC7122', borderColor: item.publicada ? '#F0A500' : '#2ECC71' },
                  ]}
                  onPress={() => togglePublicar(item.id)}
                >
                  <Ionicons
                    name={item.publicada ? 'eye-off-outline' : 'cloud-upload-outline'}
                    size={15}
                    color={item.publicada ? '#F0A500' : '#2ECC71'}
                  />
                  <Text style={[styles.acaoTexto, { color: item.publicada ? '#F0A500' : '#2ECC71' }]}>
                    {item.publicada ? 'Despublicar' : 'Publicar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  stats: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  statNum: { color: '#E94560', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 10 },
  filtros: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filtroBotao: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0F3460',
    alignItems: 'center',
  },
  filtroBotaoAtivo: { backgroundColor: '#E94560', borderColor: '#E94560' },
  filtroTexto: { color: '#666', fontSize: 11 },
  filtroTextoAtivo: { color: '#fff', fontWeight: '600' },
  lista: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#16213E',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tagBadge: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  tagTexto: { fontSize: 11, fontWeight: '600' },
  uf: { color: '#555', fontSize: 11 },
  titulo: { color: '#fff', fontSize: 14, fontWeight: '600', lineHeight: 20, marginBottom: 4 },
  autor: { color: '#666', fontSize: 12, marginBottom: 8 },
  stats2: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statTexto: { color: '#666', fontSize: 12 },
  acoes: {
    flexDirection: 'row',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#0F3460',
    paddingTop: 10,
  },
  acaoBotao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#1A1A2E',
  },
  acaoBotaoPublicar: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  acaoTexto: { fontSize: 12, fontWeight: '500' },
});
