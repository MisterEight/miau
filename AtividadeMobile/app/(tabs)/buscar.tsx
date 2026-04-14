import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NOTICIAS } from './index';

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

const TAGS = ['Cultura', 'Ciência', 'Política', 'Tecnologia', 'Entretenimento'];

const COR_TAG: Record<string, string> = {
  Cultura: '#9B59B6',
  Ciência: '#2ECC71',
  Política: '#E74C3C',
  Tecnologia: '#3498DB',
  Entretenimento: '#F39C12',
};

export default function BuscarScreen() {
  const router = useRouter();
  const [texto, setTexto] = useState('');
  const [ufSelecionada, setUfSelecionada] = useState('');
  const [tagSelecionada, setTagSelecionada] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'uf' | 'tag'>('tag');

  const resultados = NOTICIAS.filter((n) => {
    if (!n.publicada) return false;
    const matchTexto = texto.trim()
      ? n.titulo.toLowerCase().includes(texto.toLowerCase()) ||
        n.resumo.toLowerCase().includes(texto.toLowerCase())
      : true;
    const matchUf = ufSelecionada ? n.uf === ufSelecionada : true;
    const matchTag = tagSelecionada ? n.tag === tagSelecionada : true;
    return matchTexto && matchUf && matchTag;
  });

  function limpar() {
    setTexto('');
    setUfSelecionada('');
    setTagSelecionada('');
  }

  return (
    <View style={styles.container}>
      {/* Barra de pesquisa */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#888" />
          <TextInput
            style={styles.searchInput}
            value={texto}
            onChangeText={setTexto}
            placeholder="Buscar notícias..."
            placeholderTextColor="#555"
          />
          {texto.length > 0 && (
            <TouchableOpacity onPress={() => setTexto('')}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        {(ufSelecionada || tagSelecionada) && (
          <TouchableOpacity onPress={limpar} style={styles.limparBtn}>
            <Text style={styles.limparTexto}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Abas UF / Tag */}
      <View style={styles.abas}>
        <TouchableOpacity
          style={[styles.aba, abaAtiva === 'tag' && styles.abaAtiva]}
          onPress={() => setAbaAtiva('tag')}
        >
          <Ionicons name="pricetag-outline" size={15} color={abaAtiva === 'tag' ? '#E94560' : '#666'} />
          <Text style={[styles.abaTexto, abaAtiva === 'tag' && styles.abaTextoAtivo]}>
            Busca por Tag
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.aba, abaAtiva === 'uf' && styles.abaAtiva]}
          onPress={() => setAbaAtiva('uf')}
        >
          <Ionicons name="location-outline" size={15} color={abaAtiva === 'uf' ? '#E94560' : '#666'} />
          <Text style={[styles.abaTexto, abaAtiva === 'uf' && styles.abaTextoAtivo]}>
            Busca por UF
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      {abaAtiva === 'tag' ? (
        <View style={styles.filtros}>
          {TAGS.map((tag) => {
            const cor = COR_TAG[tag] ?? '#888';
            const ativo = tagSelecionada === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.chip, { borderColor: cor, backgroundColor: ativo ? cor : 'transparent' }]}
                onPress={() => setTagSelecionada(ativo ? '' : tag)}
              >
                <Text style={[styles.chipTexto, { color: ativo ? '#fff' : cor }]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.filtros}>
          {UFS.map((u) => {
            const ativo = ufSelecionada === u;
            return (
              <TouchableOpacity
                key={u}
                style={[styles.chipUf, ativo && styles.chipUfAtivo]}
                onPress={() => setUfSelecionada(ativo ? '' : u)}
              >
                <Text style={[styles.chipUfTexto, ativo && styles.chipUfTextoAtivo]}>{u}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Resultados */}
      <Text style={styles.resultadoLabel}>
        {resultados.length} resultado{resultados.length !== 1 ? 's' : ''}
      </Text>

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/noticia/${item.id}`)}
            activeOpacity={0.85}
          >
            <View style={styles.cardTopo}>
              <View style={[styles.tagBadge, { backgroundColor: (COR_TAG[item.tag] ?? '#888') + '22', borderColor: COR_TAG[item.tag] ?? '#888' }]}>
                <Text style={[styles.tagTexto, { color: COR_TAG[item.tag] ?? '#888' }]}>{item.tag}</Text>
              </View>
              <Text style={styles.uf}>{item.uf}</Text>
            </View>
            <Text style={styles.cardTitulo} numberOfLines={2}>{item.titulo}</Text>
            <Text style={styles.cardAutor}>por {item.autor} · {item.data}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="search" size={40} color="#333" />
            <Text style={styles.vazioTexto}>Nenhuma notícia encontrada</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 14 },
  limparBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E94560',
    borderRadius: 10,
  },
  limparTexto: { color: '#E94560', fontSize: 13 },
  abas: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#0F3460',
    marginHorizontal: 16,
  },
  aba: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  abaAtiva: { borderBottomColor: '#E94560' },
  abaTexto: { color: '#666', fontSize: 13 },
  abaTextoAtivo: { color: '#E94560', fontWeight: '600' },
  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
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
  resultadoLabel: {
    color: '#555',
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  lista: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tagBadge: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  tagTexto: { fontSize: 11, fontWeight: '600' },
  uf: { color: '#555', fontSize: 12 },
  cardTitulo: { color: '#fff', fontSize: 14, fontWeight: '600', lineHeight: 20, marginBottom: 4 },
  cardAutor: { color: '#666', fontSize: 12 },
  vazio: { alignItems: 'center', paddingTop: 40, gap: 12 },
  vazioTexto: { color: '#444', fontSize: 14 },
});
