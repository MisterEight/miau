import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

type Perfil = {
  id: number;
  nome: string;
  descricao: string;
  cor: string;
  icon: keyof typeof Ionicons.glyphMap;
  fixo: boolean;
  permissoes: string[];
};

const PERFIS_INICIAL: Perfil[] = [
  {
    id: 1,
    nome: 'Leitor',
    descricao: 'Pode ler notícias, buscar por tag/UF e deixar comentários.',
    cor: '#4A90D9',
    icon: 'book-outline',
    fixo: true,
    permissoes: ['Ler notícias', 'Buscar por tag/UF', 'Comentar', 'Curtir comentários'],
  },
  {
    id: 2,
    nome: 'Autor',
    descricao: 'Cria e gerencia seus próprios artigos.',
    cor: '#E94560',
    icon: 'create-outline',
    fixo: true,
    permissoes: ['Tudo do Leitor', 'Criar artigos', 'Editar próprios artigos', 'Excluir próprios artigos'],
  },
  {
    id: 3,
    nome: 'Editor',
    descricao: 'Modera todo o conteúdo da plataforma.',
    cor: '#2ECC71',
    icon: 'eye-outline',
    fixo: true,
    permissoes: ['Tudo do Autor', 'Publicar/despublicar qualquer artigo', 'Editar qualquer artigo', 'Moderar comentários'],
  },
  {
    id: 4,
    nome: 'Admin',
    descricao: 'Controle total do sistema.',
    cor: '#F0A500',
    icon: 'shield-checkmark-outline',
    fixo: true,
    permissoes: ['Tudo do Editor', 'Gerenciar usuários', 'Gerenciar tags', 'Gerenciar UFs e cidades', 'Acessar dashboard'],
  },
];

const CORES_EXTRA = ['#9B59B6', '#F39C12', '#1ABC9C', '#E74C3C'];

export default function CrudPerfisScreen() {
  const [perfis, setPerfis] = useState<Perfil[]>(PERFIS_INICIAL);
  const [expandido, setExpandido] = useState<number | null>(null);

  // Modal novo perfil
  const [modalNovo, setModalNovo] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoDesc, setNovoDesc] = useState('');

  // Modal editar perfil
  const [perfilEditando, setPerfilEditando] = useState<Perfil | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Modal excluir
  const [perfilExcluindo, setPerfilExcluindo] = useState<Perfil | null>(null);

  function criarPerfil() {
    if (!novoNome.trim()) return;
    const cor = CORES_EXTRA[perfis.length % CORES_EXTRA.length];
    const novo: Perfil = {
      id: Date.now(),
      nome: novoNome.trim(),
      descricao: novoDesc.trim() || 'Perfil personalizado.',
      cor,
      icon: 'person-outline',
      fixo: false,
      permissoes: ['Acesso personalizado'],
    };
    setPerfis((prev) => [...prev, novo]);
    setNovoNome('');
    setNovoDesc('');
    setModalNovo(false);
  }

  function abrirEdicao(p: Perfil) {
    setPerfilEditando(p);
    setEditNome(p.nome);
    setEditDesc(p.descricao);
  }

  function salvarEdicao() {
    if (!perfilEditando || !editNome.trim()) return;
    setPerfis((prev) =>
      prev.map((p) =>
        p.id === perfilEditando.id ? { ...p, nome: editNome.trim(), descricao: editDesc.trim() } : p
      )
    );
    setPerfilEditando(null);
  }

  function excluirPerfil() {
    if (!perfilExcluindo) return;
    setPerfis((prev) => prev.filter((p) => p.id !== perfilExcluindo.id));
    setPerfilExcluindo(null);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalNovo(true)}>
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={styles.addBtnTexto}>Novo Perfil</Text>
        </TouchableOpacity>

        {perfis.map((p) => (
          <View key={p.id} style={[styles.card, { borderLeftColor: p.cor }]}>
            <TouchableOpacity
              style={styles.cardTopo}
              onPress={() => setExpandido(expandido === p.id ? null : p.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: p.cor + '22' }]}>
                <Ionicons name={p.icon} size={22} color={p.cor} />
              </View>
              <View style={styles.cardTexto}>
                <View style={styles.cardNomeLinha}>
                  <Text style={styles.cardNome}>{p.nome}</Text>
                  {p.fixo && (
                    <View style={styles.fixoBadge}>
                      <Text style={styles.fixoTexto}>fixo</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardDesc} numberOfLines={expandido === p.id ? undefined : 1}>
                  {p.descricao}
                </Text>
              </View>
              <View style={styles.acoes}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => abrirEdicao(p)}>
                  <Ionicons name="pencil-outline" size={18} color="#888" />
                </TouchableOpacity>
                {!p.fixo && (
                  <TouchableOpacity style={styles.iconBtn} onPress={() => setPerfilExcluindo(p)}>
                    <Ionicons name="trash-outline" size={18} color="#E94560" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>

            {expandido === p.id && (
              <View style={styles.permissoesBox}>
                <Text style={styles.permissoesTitulo}>Permissões</Text>
                {p.permissoes.map((perm, i) => (
                  <View key={i} style={styles.permissaoLinha}>
                    <Ionicons name="checkmark-circle-outline" size={14} color={p.cor} />
                    <Text style={styles.permissaoTexto}>{perm}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Modal novo perfil */}
      <Modal visible={modalNovo} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Novo Perfil</Text>
            <Text style={styles.modalLabel}>Nome</Text>
            <TextInput
              style={styles.modalInput}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Ex: Moderador"
              placeholderTextColor="#555"
              autoCapitalize="words"
              autoFocus
            />
            <Text style={styles.modalLabel}>Descrição</Text>
            <TextInput
              style={[styles.modalInput, { height: 70 }]}
              value={novoDesc}
              onChangeText={setNovoDesc}
              placeholder="Descreva as responsabilidades..."
              placeholderTextColor="#555"
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.modalBotaoPrimario} onPress={criarPerfil} activeOpacity={0.8}>
              <Text style={styles.modalBotaoTexto}>Criar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => { setModalNovo(false); setNovoNome(''); setNovoDesc(''); }}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal editar perfil */}
      <Modal visible={perfilEditando !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Editar Perfil</Text>
            <Text style={styles.modalLabel}>Nome</Text>
            <TextInput
              style={styles.modalInput}
              value={editNome}
              onChangeText={setEditNome}
              placeholder="Nome do perfil"
              placeholderTextColor="#555"
              autoCapitalize="words"
              autoFocus
            />
            <Text style={styles.modalLabel}>Descrição</Text>
            <TextInput
              style={[styles.modalInput, { height: 70 }]}
              value={editDesc}
              onChangeText={setEditDesc}
              placeholder="Descrição..."
              placeholderTextColor="#555"
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.modalBotaoPrimario} onPress={salvarEdicao} activeOpacity={0.8}>
              <Text style={styles.modalBotaoTexto}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setPerfilEditando(null)}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal excluir perfil */}
      <Modal visible={perfilExcluindo !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIcone}>
              <Ionicons name="warning-outline" size={32} color="#E94560" />
            </View>
            <Text style={styles.modalTitulo}>Excluir perfil</Text>
            <Text style={styles.modalSubtitulo}>
              Remover o perfil <Text style={{ color: '#fff', fontWeight: '600' }}>"{perfilExcluindo?.nome}"</Text>?
            </Text>
            <TouchableOpacity style={styles.modalBotaoExcluir} onPress={excluirPerfil} activeOpacity={0.8}>
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={styles.modalBotaoTexto}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setPerfilExcluindo(null)}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  content: { padding: 16, paddingBottom: 40 },
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
  card: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#0F3460',
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTexto: { flex: 1 },
  cardNomeLinha: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  cardNome: { color: '#fff', fontSize: 15, fontWeight: '600' },
  fixoBadge: {
    backgroundColor: '#0F3460',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  fixoTexto: { color: '#555', fontSize: 10 },
  cardDesc: { color: '#666', fontSize: 12 },
  acoes: { flexDirection: 'row', gap: 2 },
  iconBtn: { padding: 6 },
  permissoesBox: {
    borderTopWidth: 1,
    borderTopColor: '#0F3460',
    padding: 14,
    paddingTop: 10,
  },
  permissoesTitulo: {
    color: '#888',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  permissaoLinha: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  permissaoTexto: { color: '#ccc', fontSize: 13 },
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
