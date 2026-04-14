import {
  FlatList,
  Modal,
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

type Aba = 'resumo' | 'usuarios' | 'tags';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: string;
  uf: string;
  ativo: boolean;
};

const USUARIOS_INICIAL: Usuario[] = [
  { id: 1, nome: 'Ana Souza', email: 'ana@miau.com', role: 'autor', uf: 'SP', ativo: true },
  { id: 2, nome: 'Bruno Lima', email: 'bruno@miau.com', role: 'autor', uf: 'RJ', ativo: true },
  { id: 3, nome: 'Carla Nunes', email: 'carla@miau.com', role: 'leitor', uf: 'MG', ativo: true },
  { id: 4, nome: 'Diego Martins', email: 'diego@miau.com', role: 'leitor', uf: 'RS', ativo: false },
  { id: 5, nome: 'Elisa Ramos', email: 'elisa@miau.com', role: 'editor', uf: 'PR', ativo: true },
  { id: 6, nome: 'Felipe Torres', email: 'felipe@miau.com', role: 'leitor', uf: 'BA', ativo: true },
];

const COR_ROLE: Record<string, string> = {
  autor: '#E94560',
  leitor: '#4A90D9',
  editor: '#2ECC71',
  admin: '#F0A500',
};

export default function DashboardScreen() {
  const router = useRouter();
  const { noticias, tags, addTag, deleteTag, updateTag } = useAppStore();
  const [aba, setAba] = useState<Aba>('resumo');
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIAL);

  // Modal nova tag
  const [modalNovaTag, setModalNovaTag] = useState(false);
  const [novaTagNome, setNovaTagNome] = useState('');

  // Modal editar tag
  const [tagEditandoId, setTagEditandoId] = useState<number | null>(null);
  const [tagEditandoNome, setTagEditandoNome] = useState('');

  // Modal confirmar exclusão de usuário
  const [usuarioExcluindo, setUsuarioExcluindo] = useState<Usuario | null>(null);

  // Modal confirmar exclusão de tag
  const [tagExcluindo, setTagExcluindo] = useState<{ id: number; nome: string } | null>(null);

  const totalLeituras = noticias.reduce((s, n) => s + n.leituras, 0);
  const totalComentarios = noticias.reduce((s, n) => s + n.comentarios, 0);

  const ABAS: { key: Aba; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'resumo', label: 'Resumo', icon: 'bar-chart-outline' },
    { key: 'usuarios', label: 'Usuários', icon: 'people-outline' },
    { key: 'tags', label: 'Tags', icon: 'pricetags-outline' },
  ];

  function toggleUsuario(id: number) {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ativo: !u.ativo } : u))
    );
  }

  function confirmarExcluirUsuario() {
    if (!usuarioExcluindo) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== usuarioExcluindo.id));
    setUsuarioExcluindo(null);
  }

  function handleSalvarNovaTag() {
    if (!novaTagNome.trim()) return;
    addTag(novaTagNome.trim());
    setNovaTagNome('');
    setModalNovaTag(false);
  }

  function abrirEdicaoTag(id: number, nome: string) {
    setTagEditandoId(id);
    setTagEditandoNome(nome);
  }

  function salvarEdicaoTag() {
    if (!tagEditandoNome.trim() || tagEditandoId === null) return;
    updateTag(tagEditandoId, tagEditandoNome.trim());
    setTagEditandoId(null);
    setTagEditandoNome('');
  }

  function confirmarExcluirTag() {
    if (!tagExcluindo) return;
    deleteTag(tagExcluindo.id);
    setTagExcluindo(null);
  }

  const CRUDS = [
    {
      label: 'CRUD Notícias',
      icon: 'newspaper-outline',
      cor: '#4A90D9',
      count: noticias.length,
      onPress: () => router.push('/(tabs)/painel'),
    },
    {
      label: 'CRUD Usuários',
      icon: 'people-outline',
      cor: '#E94560',
      count: usuarios.length,
      onPress: () => setAba('usuarios'),
    },
    {
      label: 'CRUD Tags',
      icon: 'pricetags-outline',
      cor: '#9B59B6',
      count: tags.length,
      onPress: () => setAba('tags'),
    },
    {
      label: 'CRUD Perfis',
      icon: 'ribbon-outline',
      cor: '#2ECC71',
      count: 4,
      onPress: () => router.push('/crud-perfis'),
    },
    {
      label: 'CRUD Cidades',
      icon: 'business-outline',
      cor: '#F39C12',
      count: 10,
      onPress: () => router.push('/crud-cidades'),
    },
    {
      label: 'CRUD UF',
      icon: 'map-outline',
      cor: '#3498DB',
      count: 27,
      onPress: () => router.push('/crud-uf'),
    },
  ] as const;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.abas}>
        {ABAS.map((a) => (
          <TouchableOpacity
            key={a.key}
            style={[styles.aba, aba === a.key && styles.abaAtiva]}
            onPress={() => setAba(a.key)}
          >
            <Ionicons
              name={a.icon}
              size={18}
              color={aba === a.key ? '#E94560' : '#555'}
            />
            <Text style={[styles.abaTexto, aba === a.key && styles.abaTextoAtivo]}>
              {a.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* RESUMO */}
      {aba === 'resumo' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.statsGrid}>
            {[
              { label: 'Notícias', valor: noticias.length, icon: 'newspaper-outline', cor: '#4A90D9' },
              { label: 'Usuários', valor: usuarios.length, icon: 'people-outline', cor: '#E94560' },
              { label: 'Leituras', valor: totalLeituras.toLocaleString('pt-BR'), icon: 'eye-outline', cor: '#2ECC71' },
              { label: 'Comentários', valor: totalComentarios, icon: 'chatbubble-outline', cor: '#F0A500' },
            ].map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Ionicons name={s.icon as any} size={26} color={s.cor} />
                <Text style={[styles.statNum, { color: s.cor }]}>{s.valor}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.secaoTitulo}>CRUDs disponíveis</Text>
          {CRUDS.map((item) => (
            <TouchableOpacity key={item.label} style={styles.crudRow} onPress={item.onPress} activeOpacity={0.8}>
              <View style={[styles.crudIcon, { backgroundColor: item.cor + '22' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.cor} />
              </View>
              <Text style={styles.crudLabel}>{item.label}</Text>
              <View style={styles.crudCount}>
                <Text style={styles.crudCountTexto}>{item.count}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#444" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* USUÁRIOS */}
      {aba === 'usuarios' && (
        <FlatList
          data={usuarios}
          keyExtractor={(u) => String(u.id)}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => {
            const cor = COR_ROLE[item.role] ?? '#888';
            return (
              <View style={styles.usuarioCard}>
                <View style={[styles.usuarioAvatar, { backgroundColor: cor + '22', borderColor: cor }]}>
                  <Text style={[styles.usuarioLetra, { color: cor }]}>{item.nome[0]}</Text>
                </View>
                <View style={styles.usuarioInfo}>
                  <View style={styles.usuarioTopo}>
                    <Text style={styles.usuarioNome}>{item.nome}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: cor + '22', borderColor: cor }]}>
                      <Text style={[styles.roleTexto, { color: cor }]}>{item.role}</Text>
                    </View>
                  </View>
                  <Text style={styles.usuarioEmail}>{item.email}</Text>
                  <View style={styles.usuarioRodape}>
                    <View style={[styles.dot, { backgroundColor: item.ativo ? '#2ECC71' : '#666' }]} />
                    <Text style={styles.usuarioStatus}>{item.ativo ? 'Ativo' : 'Inativo'}</Text>
                    <Text style={styles.usuarioUf}>{item.uf}</Text>
                  </View>
                </View>
                <View style={styles.usuarioAcoes}>
                  <TouchableOpacity onPress={() => toggleUsuario(item.id)} style={styles.iconBtn}>
                    <Ionicons
                      name={item.ativo ? 'pause-circle-outline' : 'play-circle-outline'}
                      size={22}
                      color={item.ativo ? '#F0A500' : '#2ECC71'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setUsuarioExcluindo(item)} style={styles.iconBtn}>
                    <Ionicons name="trash-outline" size={20} color="#E94560" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}

      {/* TAGS */}
      {aba === 'tags' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalNovaTag(true)}>
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.addBtnTexto}>Nova Tag</Text>
          </TouchableOpacity>
          {tags.map((tag) => (
            <View key={tag.id} style={styles.tagCard}>
              <View style={[styles.tagDot, { backgroundColor: tag.cor }]} />
              <Text style={styles.tagNome}>{tag.nome}</Text>
              <Text style={styles.tagUsos}>{tag.usos} usos</Text>
              <TouchableOpacity style={styles.iconBtn} onPress={() => abrirEdicaoTag(tag.id, tag.nome)}>
                <Ionicons name="pencil-outline" size={18} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setTagExcluindo({ id: tag.id, nome: tag.nome })}>
                <Ionicons name="trash-outline" size={18} color="#E94560" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal nova tag */}
      <Modal visible={modalNovaTag} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Nova Tag</Text>
            <Text style={styles.modalLabel}>Nome da tag</Text>
            <TextInput
              style={styles.modalInput}
              value={novaTagNome}
              onChangeText={setNovaTagNome}
              placeholder="Ex: Esportes"
              placeholderTextColor="#555"
              autoCapitalize="words"
              autoFocus
            />
            <TouchableOpacity style={styles.modalBotaoSalvar} onPress={handleSalvarNovaTag} activeOpacity={0.8}>
              <Text style={styles.modalBotaoTexto}>Criar tag</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => { setModalNovaTag(false); setNovaTagNome(''); }} activeOpacity={0.8}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal editar tag */}
      <Modal visible={tagEditandoId !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Editar Tag</Text>
            <Text style={styles.modalLabel}>Nome da tag</Text>
            <TextInput
              style={styles.modalInput}
              value={tagEditandoNome}
              onChangeText={setTagEditandoNome}
              placeholder="Nome da tag"
              placeholderTextColor="#555"
              autoCapitalize="words"
              autoFocus
            />
            <TouchableOpacity style={styles.modalBotaoSalvar} onPress={salvarEdicaoTag} activeOpacity={0.8}>
              <Text style={styles.modalBotaoTexto}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setTagEditandoId(null)} activeOpacity={0.8}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal confirmar exclusão de usuário */}
      <Modal visible={usuarioExcluindo !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIcone}>
              <Ionicons name="warning-outline" size={32} color="#E94560" />
            </View>
            <Text style={styles.modalTitulo}>Excluir usuário</Text>
            <Text style={styles.modalSubtitulo}>
              Deseja remover <Text style={{ color: '#fff', fontWeight: '600' }}>{usuarioExcluindo?.nome}</Text> do sistema?
            </Text>
            <TouchableOpacity style={styles.modalBotaoExcluir} onPress={confirmarExcluirUsuario} activeOpacity={0.8}>
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={styles.modalBotaoTexto}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setUsuarioExcluindo(null)} activeOpacity={0.8}>
              <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal confirmar exclusão de tag */}
      <Modal visible={tagExcluindo !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIcone}>
              <Ionicons name="warning-outline" size={32} color="#E94560" />
            </View>
            <Text style={styles.modalTitulo}>Excluir tag</Text>
            <Text style={styles.modalSubtitulo}>
              Deseja remover a tag <Text style={{ color: '#fff', fontWeight: '600' }}>"{tagExcluindo?.nome}"</Text>?
            </Text>
            <TouchableOpacity style={styles.modalBotaoExcluir} onPress={confirmarExcluirTag} activeOpacity={0.8}>
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={styles.modalBotaoTexto}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setTagExcluindo(null)} activeOpacity={0.8}>
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
  abas: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#0F3460',
    backgroundColor: '#16213E',
  },
  aba: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 3,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  abaAtiva: { borderBottomColor: '#E94560' },
  abaTexto: { color: '#555', fontSize: 10 },
  abaTextoAtivo: { color: '#E94560', fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  lista: { padding: 16, paddingBottom: 32 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  statNum: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 12 },
  secaoTitulo: {
    color: '#888',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  crudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  crudIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crudLabel: { flex: 1, color: '#fff', fontSize: 14 },
  crudCount: {
    backgroundColor: '#0F3460',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  crudCountTexto: { color: '#888', fontSize: 12 },
  usuarioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  usuarioAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usuarioLetra: { fontSize: 18, fontWeight: 'bold' },
  usuarioInfo: { flex: 1 },
  usuarioTopo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  usuarioNome: { color: '#fff', fontSize: 14, fontWeight: '600' },
  roleBadge: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 1 },
  roleTexto: { fontSize: 10, fontWeight: '600' },
  usuarioEmail: { color: '#666', fontSize: 11, marginBottom: 4 },
  usuarioRodape: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  usuarioStatus: { color: '#888', fontSize: 11 },
  usuarioUf: { color: '#555', fontSize: 11, marginLeft: 4 },
  usuarioAcoes: { flexDirection: 'row', gap: 2 },
  iconBtn: { padding: 6 },
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
  tagCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  tagDot: { width: 12, height: 12, borderRadius: 6 },
  tagNome: { flex: 1, color: '#fff', fontSize: 15 },
  tagUsos: { color: '#666', fontSize: 12 },
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
  modalTitulo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitulo: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalLabel: {
    color: '#E94560',
    fontSize: 12,
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
    marginBottom: 16,
  },
  modalBotaoSalvar: {
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
