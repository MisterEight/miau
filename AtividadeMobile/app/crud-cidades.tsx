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

type Cidade = {
  id: number;
  nome: string;
  uf: string;
};

const CIDADES_INICIAL: Cidade[] = [
  { id: 1, nome: 'São Paulo', uf: 'SP' },
  { id: 2, nome: 'Campinas', uf: 'SP' },
  { id: 3, nome: 'Guarulhos', uf: 'SP' },
  { id: 4, nome: 'Rio de Janeiro', uf: 'RJ' },
  { id: 5, nome: 'Niterói', uf: 'RJ' },
  { id: 6, nome: 'Belo Horizonte', uf: 'MG' },
  { id: 7, nome: 'Uberlândia', uf: 'MG' },
  { id: 8, nome: 'Porto Alegre', uf: 'RS' },
  { id: 9, nome: 'Curitiba', uf: 'PR' },
  { id: 10, nome: 'Salvador', uf: 'BA' },
  { id: 11, nome: 'Fortaleza', uf: 'CE' },
  { id: 12, nome: 'Recife', uf: 'PE' },
  { id: 13, nome: 'Manaus', uf: 'AM' },
  { id: 14, nome: 'Brasília', uf: 'DF' },
  { id: 15, nome: 'Florianópolis', uf: 'SC' },
];

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export default function CrudCidadesScreen() {
  const [cidades, setCidades] = useState<Cidade[]>(CIDADES_INICIAL);
  const [busca, setBusca] = useState('');
  const [filtroUF, setFiltroUF] = useState('');
  const [mostrarFiltroUF, setMostrarFiltroUF] = useState(false);

  // Modal nova cidade
  const [modalNova, setModalNova] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaUF, setNovaUF] = useState('');
  const [mostrarUfsNova, setMostrarUfsNova] = useState(false);

  // Modal editar cidade
  const [cidadeEditando, setCidadeEditando] = useState<Cidade | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editUF, setEditUF] = useState('');
  const [mostrarUfsEditar, setMostrarUfsEditar] = useState(false);

  // Modal excluir
  const [cidadeExcluindo, setCidadeExcluindo] = useState<Cidade | null>(null);

  const cidadesFiltradas = cidades.filter((c) => {
    const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase());
    const matchUF = !filtroUF || c.uf === filtroUF;
    return matchBusca && matchUF;
  });

  function criarCidade() {
    if (!novoNome.trim() || !novaUF) return;
    const nova: Cidade = { id: Date.now(), nome: novoNome.trim(), uf: novaUF };
    setCidades((prev) => [...prev, nova].sort((a, b) => a.nome.localeCompare(b.nome)));
    setNovoNome('');
    setNovaUF('');
    setModalNova(false);
  }

  function abrirEdicao(c: Cidade) {
    setCidadeEditando(c);
    setEditNome(c.nome);
    setEditUF(c.uf);
    setMostrarUfsEditar(false);
  }

  function salvarEdicao() {
    if (!cidadeEditando || !editNome.trim() || !editUF) return;
    setCidades((prev) =>
      prev.map((c) =>
        c.id === cidadeEditando.id ? { ...c, nome: editNome.trim(), uf: editUF } : c
      )
    );
    setCidadeEditando(null);
  }

  function excluirCidade() {
    if (!cidadeExcluindo) return;
    setCidades((prev) => prev.filter((c) => c.id !== cidadeExcluindo.id));
    setCidadeExcluindo(null);
  }

  return (
    <View style={styles.container}>
      {/* Busca */}
      <View style={styles.buscaBox}>
        <Ionicons name="search-outline" size={16} color="#555" />
        <TextInput
          style={styles.buscaInput}
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar cidade..."
          placeholderTextColor="#555"
        />
        {!!busca && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={16} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtro por UF */}
      <TouchableOpacity style={styles.filtroUFBtn} onPress={() => setMostrarFiltroUF(!mostrarFiltroUF)}>
        <Ionicons name="map-outline" size={14} color="#888" />
        <Text style={styles.filtroUFTexto}>{filtroUF || 'Filtrar por UF'}</Text>
        <Ionicons name={mostrarFiltroUF ? 'chevron-up' : 'chevron-down'} size={14} color="#555" />
      </TouchableOpacity>

      {mostrarFiltroUF && (
        <View style={styles.ufGridFiltro}>
          {['', ...UFS].map((u) => (
            <TouchableOpacity
              key={u || '__todos'}
              style={[styles.ufChip, filtroUF === u && styles.ufChipAtivo]}
              onPress={() => { setFiltroUF(u); setMostrarFiltroUF(false); }}
            >
              <Text style={[styles.ufChipTexto, filtroUF === u && styles.ufChipTextoAtivo]}>
                {u || 'Todos'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Botão adicionar */}
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalNova(true)}>
        <Ionicons name="add-circle-outline" size={18} color="#fff" />
        <Text style={styles.addBtnTexto}>Nova Cidade</Text>
      </TouchableOpacity>

      {/* Lista */}
      <FlatList
        data={cidadesFiltradas}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.cidadeCard}>
            <View style={styles.cidadeIcone}>
              <Ionicons name="business-outline" size={18} color="#F39C12" />
            </View>
            <View style={styles.cidadeInfo}>
              <Text style={styles.cidadeNome}>{item.nome}</Text>
              <Text style={styles.cidadeUF}>{item.uf}</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn} onPress={() => abrirEdicao(item)}>
              <Ionicons name="pencil-outline" size={18} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setCidadeExcluindo(item)}>
              <Ionicons name="trash-outline" size={18} color="#E94560" />
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="business-outline" size={36} color="#333" />
            <Text style={styles.vazioTexto}>Nenhuma cidade encontrada</Text>
          </View>
        }
      />

      {/* Modal nova cidade */}
      <Modal visible={modalNova} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Nova Cidade</Text>
            <Text style={styles.modalLabel}>Nome da cidade</Text>
            <TextInput
              style={styles.modalInput}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Ex: Sorocaba"
              placeholderTextColor="#555"
              autoCapitalize="words"
              autoFocus
            />
            <Text style={styles.modalLabel}>Estado (UF)</Text>
            <TouchableOpacity style={styles.seletor} onPress={() => setMostrarUfsNova(!mostrarUfsNova)}>
              <Text style={novaUF ? styles.seletorTexto : styles.seletorPlaceholder}>
                {novaUF || 'Selecione a UF'}
              </Text>
              <Ionicons name={mostrarUfsNova ? 'chevron-up' : 'chevron-down'} size={16} color="#888" />
            </TouchableOpacity>
            {mostrarUfsNova && (
              <View style={styles.ufGridModal}>
                {UFS.map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.ufChip, novaUF === u && styles.ufChipAtivo]}
                    onPress={() => { setNovaUF(u); setMostrarUfsNova(false); }}
                  >
                    <Text style={[styles.ufChipTexto, novaUF === u && styles.ufChipTextoAtivo]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity style={[styles.modalBotaoPrimario, { marginTop: 12 }]} onPress={criarCidade} activeOpacity={0.8}>
              <Text style={styles.modalBotaoTexto}>Criar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => { setModalNova(false); setNovoNome(''); setNovaUF(''); }}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal editar cidade */}
      <Modal visible={cidadeEditando !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Editar Cidade</Text>
            <Text style={styles.modalLabel}>Nome da cidade</Text>
            <TextInput
              style={styles.modalInput}
              value={editNome}
              onChangeText={setEditNome}
              placeholder="Nome da cidade"
              placeholderTextColor="#555"
              autoCapitalize="words"
              autoFocus
            />
            <Text style={styles.modalLabel}>Estado (UF)</Text>
            <TouchableOpacity style={styles.seletor} onPress={() => setMostrarUfsEditar(!mostrarUfsEditar)}>
              <Text style={editUF ? styles.seletorTexto : styles.seletorPlaceholder}>
                {editUF || 'Selecione a UF'}
              </Text>
              <Ionicons name={mostrarUfsEditar ? 'chevron-up' : 'chevron-down'} size={16} color="#888" />
            </TouchableOpacity>
            {mostrarUfsEditar && (
              <View style={styles.ufGridModal}>
                {UFS.map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.ufChip, editUF === u && styles.ufChipAtivo]}
                    onPress={() => { setEditUF(u); setMostrarUfsEditar(false); }}
                  >
                    <Text style={[styles.ufChipTexto, editUF === u && styles.ufChipTextoAtivo]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity style={[styles.modalBotaoPrimario, { marginTop: 12 }]} onPress={salvarEdicao} activeOpacity={0.8}>
              <Text style={styles.modalBotaoTexto}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setCidadeEditando(null)}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal excluir cidade */}
      <Modal visible={cidadeExcluindo !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIcone}>
              <Ionicons name="warning-outline" size={32} color="#E94560" />
            </View>
            <Text style={styles.modalTitulo}>Excluir cidade</Text>
            <Text style={styles.modalSubtitulo}>
              Remover <Text style={{ color: '#fff', fontWeight: '600' }}>{cidadeExcluindo?.nome} — {cidadeExcluindo?.uf}</Text>?
            </Text>
            <TouchableOpacity style={styles.modalBotaoExcluir} onPress={excluirCidade} activeOpacity={0.8}>
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={styles.modalBotaoTexto}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setCidadeExcluindo(null)}>
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
    marginBottom: 8,
  },
  buscaInput: { flex: 1, color: '#fff', fontSize: 14 },
  filtroUFBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#16213E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  filtroUFTexto: { flex: 1, color: '#888', fontSize: 13 },
  ufGridFiltro: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  ufGridModal: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  ufChip: {
    borderWidth: 1,
    borderColor: '#0F3460',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#16213E',
  },
  ufChipAtivo: { backgroundColor: '#E94560', borderColor: '#E94560' },
  ufChipTexto: { color: '#888', fontSize: 12 },
  ufChipTextoAtivo: { color: '#fff', fontWeight: '600' },
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
  cidadeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  cidadeIcone: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F39C1222',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F39C1244',
  },
  cidadeInfo: { flex: 1 },
  cidadeNome: { color: '#fff', fontSize: 14, fontWeight: '500' },
  cidadeUF: { color: '#666', fontSize: 12, marginTop: 2 },
  iconBtn: { padding: 6 },
  vazio: { alignItems: 'center', paddingTop: 40, gap: 10 },
  vazioTexto: { color: '#444', fontSize: 14 },
  seletor: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seletorTexto: { color: '#fff', fontSize: 15 },
  seletorPlaceholder: { color: '#555', fontSize: 15 },
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
