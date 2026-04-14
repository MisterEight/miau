import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

type UF = {
  id: number;
  sigla: string;
  nome: string;
};

const UFS_INICIAL: UF[] = [
  { id: 1, sigla: 'AC', nome: 'Acre' },
  { id: 2, sigla: 'AL', nome: 'Alagoas' },
  { id: 3, sigla: 'AP', nome: 'Amapá' },
  { id: 4, sigla: 'AM', nome: 'Amazonas' },
  { id: 5, sigla: 'BA', nome: 'Bahia' },
  { id: 6, sigla: 'CE', nome: 'Ceará' },
  { id: 7, sigla: 'DF', nome: 'Distrito Federal' },
  { id: 8, sigla: 'ES', nome: 'Espírito Santo' },
  { id: 9, sigla: 'GO', nome: 'Goiás' },
  { id: 10, sigla: 'MA', nome: 'Maranhão' },
  { id: 11, sigla: 'MT', nome: 'Mato Grosso' },
  { id: 12, sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { id: 13, sigla: 'MG', nome: 'Minas Gerais' },
  { id: 14, sigla: 'PA', nome: 'Pará' },
  { id: 15, sigla: 'PB', nome: 'Paraíba' },
  { id: 16, sigla: 'PR', nome: 'Paraná' },
  { id: 17, sigla: 'PE', nome: 'Pernambuco' },
  { id: 18, sigla: 'PI', nome: 'Piauí' },
  { id: 19, sigla: 'RJ', nome: 'Rio de Janeiro' },
  { id: 20, sigla: 'RN', nome: 'Rio Grande do Norte' },
  { id: 21, sigla: 'RS', nome: 'Rio Grande do Sul' },
  { id: 22, sigla: 'RO', nome: 'Rondônia' },
  { id: 23, sigla: 'RR', nome: 'Roraima' },
  { id: 24, sigla: 'SC', nome: 'Santa Catarina' },
  { id: 25, sigla: 'SP', nome: 'São Paulo' },
  { id: 26, sigla: 'SE', nome: 'Sergipe' },
  { id: 27, sigla: 'TO', nome: 'Tocantins' },
];

export default function CrudUfScreen() {
  const [ufs, setUfs] = useState<UF[]>(UFS_INICIAL);
  const [busca, setBusca] = useState('');

  // Modal nova UF
  const [modalNova, setModalNova] = useState(false);
  const [novaSigla, setNovaSigla] = useState('');
  const [novoNome, setNovoNome] = useState('');

  // Modal editar UF
  const [ufEditando, setUfEditando] = useState<UF | null>(null);
  const [editSigla, setEditSigla] = useState('');
  const [editNome, setEditNome] = useState('');

  // Modal excluir
  const [ufExcluindo, setUfExcluindo] = useState<UF | null>(null);

  const ufsFiltradas = ufs.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.sigla.toLowerCase().includes(busca.toLowerCase())
  );

  function criarUF() {
    if (!novaSigla.trim() || !novoNome.trim()) return;
    const nova: UF = { id: Date.now(), sigla: novaSigla.trim().toUpperCase(), nome: novoNome.trim() };
    setUfs((prev) => [...prev, nova].sort((a, b) => a.nome.localeCompare(b.nome)));
    setNovaSigla('');
    setNovoNome('');
    setModalNova(false);
  }

  function abrirEdicao(uf: UF) {
    setUfEditando(uf);
    setEditSigla(uf.sigla);
    setEditNome(uf.nome);
  }

  function salvarEdicao() {
    if (!ufEditando || !editSigla.trim() || !editNome.trim()) return;
    setUfs((prev) =>
      prev.map((u) =>
        u.id === ufEditando.id ? { ...u, sigla: editSigla.trim().toUpperCase(), nome: editNome.trim() } : u
      )
    );
    setUfEditando(null);
  }

  function excluirUF() {
    if (!ufExcluindo) return;
    setUfs((prev) => prev.filter((u) => u.id !== ufExcluindo.id));
    setUfExcluindo(null);
  }

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.buscaBox}>
        <Ionicons name="search-outline" size={16} color="#555" />
        <TextInput
          style={styles.buscaInput}
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar UF..."
          placeholderTextColor="#555"
        />
      </View>

      {/* Botão adicionar */}
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalNova(true)}>
        <Ionicons name="add-circle-outline" size={18} color="#fff" />
        <Text style={styles.addBtnTexto}>Nova UF</Text>
      </TouchableOpacity>

      {/* Lista */}
      <FlatList
        data={ufsFiltradas}
        keyExtractor={(u) => String(u.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.ufCard}>
            <View style={styles.siglaBadge}>
              <Text style={styles.siglaTexto}>{item.sigla}</Text>
            </View>
            <Text style={styles.ufNome}>{item.nome}</Text>
            <TouchableOpacity style={styles.iconBtn} onPress={() => abrirEdicao(item)}>
              <Ionicons name="pencil-outline" size={18} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setUfExcluindo(item)}>
              <Ionicons name="trash-outline" size={18} color="#E94560" />
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="map-outline" size={36} color="#333" />
            <Text style={styles.vazioTexto}>Nenhuma UF encontrada</Text>
          </View>
        }
      />

      {/* Modal nova UF */}
      <Modal visible={modalNova} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Nova UF</Text>
            <Text style={styles.modalLabel}>Sigla (ex: SP)</Text>
            <TextInput
              style={styles.modalInput}
              value={novaSigla}
              onChangeText={setNovaSigla}
              placeholder="XX"
              placeholderTextColor="#555"
              autoCapitalize="characters"
              maxLength={3}
              autoFocus
            />
            <Text style={styles.modalLabel}>Nome completo</Text>
            <TextInput
              style={styles.modalInput}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Ex: São Paulo"
              placeholderTextColor="#555"
              autoCapitalize="words"
            />
            <TouchableOpacity style={styles.modalBotaoPrimario} onPress={criarUF} activeOpacity={0.8}>
              <Text style={styles.modalBotaoTexto}>Criar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => { setModalNova(false); setNovaSigla(''); setNovoNome(''); }}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal editar UF */}
      <Modal visible={ufEditando !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Editar UF</Text>
            <Text style={styles.modalLabel}>Sigla</Text>
            <TextInput
              style={styles.modalInput}
              value={editSigla}
              onChangeText={setEditSigla}
              placeholder="XX"
              placeholderTextColor="#555"
              autoCapitalize="characters"
              maxLength={3}
              autoFocus
            />
            <Text style={styles.modalLabel}>Nome completo</Text>
            <TextInput
              style={styles.modalInput}
              value={editNome}
              onChangeText={setEditNome}
              placeholder="Nome do estado"
              placeholderTextColor="#555"
              autoCapitalize="words"
            />
            <TouchableOpacity style={styles.modalBotaoPrimario} onPress={salvarEdicao} activeOpacity={0.8}>
              <Text style={styles.modalBotaoTexto}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setUfEditando(null)}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal excluir UF */}
      <Modal visible={ufExcluindo !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIcone}>
              <Ionicons name="warning-outline" size={32} color="#E94560" />
            </View>
            <Text style={styles.modalTitulo}>Excluir UF</Text>
            <Text style={styles.modalSubtitulo}>
              Remover <Text style={{ color: '#fff', fontWeight: '600' }}>{ufExcluindo?.sigla} — {ufExcluindo?.nome}</Text>?
            </Text>
            <TouchableOpacity style={styles.modalBotaoExcluir} onPress={excluirUF} activeOpacity={0.8}>
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={styles.modalBotaoTexto}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setUfExcluindo(null)}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E', padding: 16 },
  buscaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#16213E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  buscaInput: { flex: 1, color: '#fff', fontSize: 14 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E94560',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 14,
  },
  addBtnTexto: { color: '#fff', fontSize: 14, fontWeight: '600' },
  lista: { paddingBottom: 32 },
  ufCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  siglaBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#3498DB22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498DB66',
  },
  siglaTexto: { color: '#3498DB', fontSize: 14, fontWeight: 'bold' },
  ufNome: { flex: 1, color: '#fff', fontSize: 14 },
  iconBtn: { padding: 6 },
  vazio: { alignItems: 'center', paddingTop: 40, gap: 10 },
  vazioTexto: { color: '#444', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000bb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  modalIcone: { alignItems: 'center', marginBottom: 12 },
  modalTitulo: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  modalSubtitulo: { color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  modalLabel: {
    color: '#E94560',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 14,
  },
  modalBotaoPrimario: {
    backgroundColor: '#E94560',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 8,
  },
  modalBotaoExcluir: {
    backgroundColor: '#E94560',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  modalBotaoTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },
  modalBotaoCancelar: { borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  modalBotaoCancelarTexto: { color: '#888', fontSize: 14 },
});
