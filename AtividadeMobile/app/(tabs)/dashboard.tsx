import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NOTICIAS } from './index';

type Aba = 'resumo' | 'usuarios' | 'tags' | 'comentarios';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: string;
  uf: string;
  ativo: boolean;
};

const USUARIOS: Usuario[] = [
  { id: 1, nome: 'Ana Souza', email: 'ana@miau.com', role: 'autor', uf: 'SP', ativo: true },
  { id: 2, nome: 'Bruno Lima', email: 'bruno@miau.com', role: 'autor', uf: 'RJ', ativo: true },
  { id: 3, nome: 'Carla Nunes', email: 'carla@miau.com', role: 'leitor', uf: 'MG', ativo: true },
  { id: 4, nome: 'Diego Martins', email: 'diego@miau.com', role: 'leitor', uf: 'RS', ativo: false },
  { id: 5, nome: 'Elisa Ramos', email: 'elisa@miau.com', role: 'editor', uf: 'PR', ativo: true },
  { id: 6, nome: 'Felipe Torres', email: 'felipe@miau.com', role: 'leitor', uf: 'BA', ativo: true },
];

const TAGS_CRUD = [
  { id: 1, nome: 'Tecnologia', usos: 12, cor: '#3498DB' },
  { id: 2, nome: 'Ciência', usos: 8, cor: '#2ECC71' },
  { id: 3, nome: 'Política', usos: 15, cor: '#E74C3C' },
  { id: 4, nome: 'Cultura', usos: 6, cor: '#9B59B6' },
  { id: 5, nome: 'Entretenimento', usos: 4, cor: '#F39C12' },
];

const COMENTARIOS = [
  { id: 1, autor: 'Diego Martins', texto: 'Incrível matéria! Muito bem escrita.', noticia: 'Desenvolvedor Afirma...', data: '8 abr', status: 'aprovado' },
  { id: 2, autor: 'Carla Nunes', texto: 'Não concordo com esse ponto de vista...', noticia: 'Prefeitura Anuncia...', data: '6 abr', status: 'pendente' },
  { id: 3, autor: 'Felipe Torres', texto: 'Compartilhei com meus amigos rsrs', noticia: 'Jesus Esclarece...', data: '1 abr', status: 'aprovado' },
  { id: 4, autor: 'Usuário Anon', texto: 'Fake news!!!', noticia: 'Cientistas Descobrem...', data: '3 abr', status: 'sinalizado' },
];

const COR_ROLE: Record<string, string> = {
  autor: '#E94560',
  leitor: '#4A90D9',
  editor: '#2ECC71',
  admin: '#F0A500',
};

const COR_COMMENT_STATUS: Record<string, string> = {
  aprovado: '#2ECC71',
  pendente: '#F0A500',
  sinalizado: '#E74C3C',
};

export default function DashboardScreen() {
  const [aba, setAba] = useState<Aba>('resumo');
  const [usuarios, setUsuarios] = useState(USUARIOS);

  const totalLeituras = NOTICIAS.reduce((s, n) => s + n.leituras, 0);
  const totalComentarios = NOTICIAS.reduce((s, n) => s + n.comentarios, 0);

  const ABAS: { key: Aba; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'resumo', label: 'Resumo', icon: 'bar-chart-outline' },
    { key: 'usuarios', label: 'Usuários', icon: 'people-outline' },
    { key: 'tags', label: 'Tags', icon: 'pricetags-outline' },
    { key: 'comentarios', label: 'Comentários', icon: 'chatbubbles-outline' },
  ];

  function toggleUsuario(id: number) {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ativo: !u.ativo } : u))
    );
  }

  function handleExcluirUsuario(id: number) {
    Alert.alert('Excluir usuário', 'Deseja remover este usuário do sistema?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => setUsuarios((prev) => prev.filter((u) => u.id !== id)),
      },
    ]);
  }

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
              { label: 'Notícias', valor: NOTICIAS.length, icon: 'newspaper-outline', cor: '#4A90D9' },
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
          {[
            { label: 'CRUD Notícias', icon: 'newspaper-outline', cor: '#4A90D9', count: NOTICIAS.length },
            { label: 'CRUD Usuários', icon: 'people-outline', cor: '#E94560', count: usuarios.length },
            { label: 'CRUD Tags', icon: 'pricetags-outline', cor: '#9B59B6', count: TAGS_CRUD.length },
            { label: 'CRUD Perfis', icon: 'ribbon-outline', cor: '#2ECC71', count: 4 },
            { label: 'CRUD Cidades', icon: 'business-outline', cor: '#F39C12', count: 27 },
            { label: 'CRUD UF', icon: 'map-outline', cor: '#3498DB', count: 27 },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.crudRow} activeOpacity={0.8}>
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
                  <TouchableOpacity onPress={() => handleExcluirUsuario(item.id)} style={styles.iconBtn}>
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
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.addBtnTexto}>Nova Tag</Text>
          </TouchableOpacity>
          {TAGS_CRUD.map((tag) => (
            <View key={tag.id} style={styles.tagCard}>
              <View style={[styles.tagDot, { backgroundColor: tag.cor }]} />
              <Text style={styles.tagNome}>{tag.nome}</Text>
              <Text style={styles.tagUsos}>{tag.usos} usos</Text>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="pencil-outline" size={18} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="trash-outline" size={18} color="#E94560" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* COMENTÁRIOS */}
      {aba === 'comentarios' && (
        <FlatList
          data={COMENTARIOS}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => {
            const cor = COR_COMMENT_STATUS[item.status] ?? '#888';
            return (
              <View style={styles.comentarioCard}>
                <View style={styles.comentarioTopo}>
                  <Text style={styles.comentarioAutor}>{item.autor}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: cor + '22', borderColor: cor }]}>
                    <Text style={[styles.statusTexto, { color: cor }]}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.comentarioTexto}>"{item.texto}"</Text>
                <Text style={styles.comentarioNoticia}>em: {item.noticia}</Text>
                <View style={styles.comentarioAcoes}>
                  <TouchableOpacity style={styles.acaoBotao}>
                    <Ionicons name="checkmark-outline" size={15} color="#2ECC71" />
                    <Text style={[styles.acaoTexto, { color: '#2ECC71' }]}>Aprovar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.acaoBotao}>
                    <Ionicons name="ban-outline" size={15} color="#E74C3C" />
                    <Text style={[styles.acaoTexto, { color: '#E74C3C' }]}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
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
  comentarioCard: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  comentarioTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  comentarioAutor: { color: '#E94560', fontSize: 13, fontWeight: '600' },
  statusBadge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusTexto: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  comentarioTexto: { color: '#ccc', fontSize: 13, lineHeight: 18, marginBottom: 4 },
  comentarioNoticia: { color: '#555', fontSize: 11, marginBottom: 10 },
  comentarioAcoes: { flexDirection: 'row', gap: 8 },
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
  acaoTexto: { fontSize: 13 },
});
