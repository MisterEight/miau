import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppStore } from '../context/appStore';
import type { Noticia } from '../context/appStore';

export type { Noticia };

const COR_TAG: Record<string, string> = {
  Cultura: '#9B59B6',
  Ciência: '#2ECC71',
  Política: '#E74C3C',
  Tecnologia: '#3498DB',
  Entretenimento: '#F39C12',
};

type CardProps = { item: Noticia };

function NoticiaCard({ item }: CardProps) {
  const router = useRouter();
  const cor = COR_TAG[item.tag] ?? '#888';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/noticia/${item.id}`)}
      activeOpacity={0.85}
    >
      {!item.publicada && (
        <View style={styles.rascunhoBadge}>
          <Text style={styles.rascunhoTexto}>Rascunho</Text>
        </View>
      )}

      <View style={styles.cardTopo}>
        <View style={[styles.tagBadge, { backgroundColor: cor + '22', borderColor: cor }]}>
          <Text style={[styles.tagTexto, { color: cor }]}>{item.tag}</Text>
        </View>
        <Text style={styles.uf}>{item.uf}</Text>
      </View>

      <Text style={styles.titulo} numberOfLines={2}>{item.titulo}</Text>
      <Text style={styles.resumo} numberOfLines={2}>{item.resumo}</Text>

      <View style={styles.rodape}>
        <Text style={styles.autor}>por {item.autor}</Text>
        <Text style={styles.data}>{item.data}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="eye-outline" size={13} color="#666" />
          <Text style={styles.statTexto}>{item.leituras.toLocaleString('pt-BR')}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={13} color="#666" />
          <Text style={styles.statTexto}>{item.comentarios}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { noticias } = useAppStore();
  const publicadas = noticias.filter((n) => n.publicada);

  return (
    <FlatList
      style={styles.container}
      data={publicadas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NoticiaCard item={item} />}
      contentContainerStyle={styles.lista}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Últimas Notícias</Text>
          <Text style={styles.headerSub}>{publicadas.length} artigos publicados</Text>
        </View>
      }
      ItemSeparatorComponent={() => <View style={styles.separador} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  lista: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 16 },
  headerTitulo: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#666', fontSize: 12, marginTop: 2 },
  separador: { height: 12 },
  card: {
    backgroundColor: '#16213E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  rascunhoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0A50022',
    borderWidth: 1,
    borderColor: '#F0A500',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
  },
  rascunhoTexto: { color: '#F0A500', fontSize: 10, fontWeight: '600' },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagBadge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagTexto: { fontSize: 11, fontWeight: '600' },
  uf: { color: '#555', fontSize: 12 },
  titulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    marginBottom: 6,
  },
  resumo: { color: '#888', fontSize: 13, lineHeight: 19, marginBottom: 12 },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  autor: { color: '#E94560', fontSize: 12 },
  data: { color: '#555', fontSize: 12 },
  stats: { flexDirection: 'row', gap: 14 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statTexto: { color: '#666', fontSize: 12 },
});
