import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
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

export default function MinhasNoticiasScreen() {
  const router = useRouter();
  // Simula notícias do autor "Ana Souza"
  const [noticias, setNoticias] = useState<Noticia[]>(
    NOTICIAS.filter((n) => n.autor === 'Ana Souza')
  );

  function handleExcluir(id: string) {
    Alert.alert('Excluir', 'Tem certeza que deseja excluir esta notícia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => setNoticias((prev) => prev.filter((n) => n.id !== id)),
      },
    ]);
  }

  const publicadas = noticias.filter((n) => n.publicada).length;
  const rascunhos = noticias.filter((n) => !n.publicada).length;

  return (
    <View style={styles.container}>
      {/* Resumo */}
      <View style={styles.resumo}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{noticias.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: '#2ECC71' }]}>{publicadas}</Text>
          <Text style={styles.statLabel}>Publicadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: '#F0A500' }]}>{rascunhos}</Text>
          <Text style={styles.statLabel}>Rascunhos</Text>
        </View>
      </View>

      {/* Botão nova notícia */}
      <TouchableOpacity
        style={styles.botaoNova}
        onPress={() => router.push('/(tabs)/criar')}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.botaoNovaTexto}>Nova Notícia</Text>
      </TouchableOpacity>

      <FlatList
        data={noticias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const cor = COR_TAG[item.tag] ?? '#888';
          return (
            <View style={styles.card}>
              <View style={styles.cardTopo}>
                <View style={[styles.tagBadge, { backgroundColor: cor + '22', borderColor: cor }]}>
                  <Text style={[styles.tagTexto, { color: cor }]}>{item.tag}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.publicada ? '#2ECC7122' : '#F0A50022', borderColor: item.publicada ? '#2ECC71' : '#F0A500' }]}>
                  <View style={[styles.dot, { backgroundColor: item.publicada ? '#2ECC71' : '#F0A500' }]} />
                  <Text style={[styles.statusTexto, { color: item.publicada ? '#2ECC71' : '#F0A500' }]}>
                    {item.publicada ? 'Publicada' : 'Rascunho'}
                  </Text>
                </View>
              </View>

              <Text style={styles.titulo} numberOfLines={2}>{item.titulo}</Text>

              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Ionicons name="eye-outline" size={13} color="#666" />
                  <Text style={styles.statTexto}>{item.leituras.toLocaleString('pt-BR')}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="chatbubble-outline" size={13} color="#666" />
                  <Text style={styles.statTexto}>{item.comentarios}</Text>
                </View>
                <Text style={styles.data}>{item.data}</Text>
              </View>

              <View style={styles.acoes}>
                <TouchableOpacity
                  style={styles.acaoBotao}
                  onPress={() => router.push(`/noticia/${item.id}`)}
                >
                  <Ionicons name="eye-outline" size={16} color="#4A90D9" />
                  <Text style={[styles.acaoTexto, { color: '#4A90D9' }]}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acaoBotao}>
                  <Ionicons name="pencil-outline" size={16} color="#E94560" />
                  <Text style={[styles.acaoTexto, { color: '#E94560' }]}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acaoBotao}
                  onPress={() => handleExcluir(item.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#888" />
                  <Text style={[styles.acaoTexto, { color: '#888' }]}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="newspaper-outline" size={48} color="#333" />
            <Text style={styles.vazioTexto}>Nenhuma notícia ainda</Text>
            <Text style={styles.vazioSub}>Crie sua primeira notícia!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  resumo: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  statNum: { color: '#E94560', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 11, marginTop: 2 },
  botaoNova: {
    backgroundColor: '#E94560',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  botaoNovaTexto: { color: '#fff', fontSize: 14, fontWeight: '600' },
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusTexto: { fontSize: 11, fontWeight: '600' },
  titulo: { color: '#fff', fontSize: 15, fontWeight: '600', lineHeight: 21, marginBottom: 8 },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statTexto: { color: '#666', fontSize: 12 },
  data: { color: '#555', fontSize: 12, marginLeft: 'auto' },
  acoes: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#0F3460',
    paddingTop: 10,
    gap: 8,
  },
  acaoBotao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1A1A2E',
  },
  acaoTexto: { fontSize: 13 },
  vazio: { alignItems: 'center', paddingTop: 60, gap: 10 },
  vazioTexto: { color: '#555', fontSize: 16, fontWeight: '600' },
  vazioSub: { color: '#444', fontSize: 13 },
});
