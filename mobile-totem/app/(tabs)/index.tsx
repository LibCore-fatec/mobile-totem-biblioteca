import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type TotemStep = 'home' | 'face' | 'rfid' | 'confirmation' | 'search' | 'support';
type Operation = 'loan' | 'return' | 'search' | 'support';
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// NOVA PALETA: Identidade Visual baseada em Vermelho e Branco
const cps = {
  red: '#B21D27',          // Cor Primária Principal
  redPressed: '#8A141B',   // Cor Primária para estado Pressionado
  redLight: '#FCE8E6',     // Fundo suave para alertas/badges vermelhos
  surface: '#FFFFFF',      // Superfície dos Cards (Branco)
  background: '#F9FAFB',   // Fundo Geral do App (Off-white bem limpo)
  text: '#1F2933',         // Texto Principal (Grafite escuro para legibilidade)
  muted: '#616E7C',        // Texto Secundário / Desativado
  border: '#E4E7EB',       // Bordas finas
  success: '#157347',      // Mantido verde apenas para feedback de sucesso estrito
  successLight: '#EAF7EE',
};

const mainOptions: {
  title: string;
  description: string;
  icon: IconName;
  action: Operation;
}[] = [
  {
    title: 'Empréstimo',
    description: 'Identifique-se e registre a saída do livro.',
    icon: 'book-arrow-right-outline',
    action: 'loan',
  },
  {
    title: 'Devolução',
    description: 'Registre a entrega de um livro emprestado.',
    icon: 'book-arrow-left-outline',
    action: 'return',
  },
  {
    title: 'Consulta e mapa',
    description: 'Encontre livros por estante, corredor e prateleira.',
    icon: 'map-search-outline',
    action: 'search',
  },
  {
    title: 'Suporte',
    description: 'Abra uma solicitação para a equipe da biblioteca.',
    icon: 'face-agent',
    action: 'support',
  },
];

const user = {
  name: 'Marina Oliveira',
  course: 'Desenvolvimento de Sistemas',
  ra: 'RA 240183',
};

const book = {
  title: 'Engenharia de Software Moderna',
  author: 'Marco Tulio Valente',
  rfid: 'RFID-09A7-2241',
  dueDate: '13/06/2026',
};

const mockBooks = [
  { id: '1', title: 'Engenharia de Software Moderna', author: 'Marco Tulio Valente', location: 'Corredor B - Estante 4 - Prateleira 2' },
  { id: '2', title: 'Código Limpo', author: 'Robert C. Martin', location: 'Corredor A - Estante 2 - Prateleira 1' },
  { id: '3', title: 'Padrões de Projetos', author: 'Erich Gamma', location: 'Corredor B - Estante 1 - Prateleira 3' },
];

export default function HomeScreen() {
  const [step, setStep] = useState<TotemStep>('home');
  const [operation, setOperation] = useState<Operation>('loan');

  const currentProgress = useMemo(() => {
    if (step === 'face') return 1;
    if (step === 'rfid') return 2;
    if (step === 'confirmation') return 3;
    return 0;
  }, [step]);

  const handleSelectOperation = (nextOperation: Operation) => {
    setOperation(nextOperation);
    if (nextOperation === 'loan' || nextOperation === 'return') {
      setStep('face');
    } else if (nextOperation === 'search') {
      setStep('search');
    } else if (nextOperation === 'support') {
      setStep('support');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={cps.background} />
      <ScrollView contentContainerStyle={styles.page}>
        <Header step={step} onHome={() => setStep('home')} />

        {step === 'home' && (
          <HomeOptions onSelect={handleSelectOperation} />
        )}

        {(step === 'face' || step === 'rfid' || step === 'confirmation') && (
          <LoanFlow
            operation={operation as 'loan' | 'return'}
            progress={currentProgress}
            step={step}
            onFaceConfirmed={() => setStep('rfid')}
            onBookRead={() => setStep('confirmation')}
            onHome={() => setStep('home')}
          />
        )}

        {step === 'search' && (
          <SearchPanel onHome={() => setStep('home')} />
        )}

        {step === 'support' && (
          <SupportPanel onHome={() => setStep('home')} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ step, onHome }: { step: TotemStep; onHome: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.brandMark}>
        <Text style={styles.brandInitials}>CPS</Text>
      </View>
      <View style={styles.headerText}>
        <Text style={styles.kicker}>Biblioteca autônoma</Text>
        <Text style={styles.title}>Totem de autoatendimento</Text>
      </View>
      {step !== 'home' ? (
        <Pressable accessibilityRole="button" onPress={onHome} style={styles.headerButton}>
          <MaterialCommunityIcons name="home-outline" size={22} color={cps.red} />
          <Text style={styles.headerButtonText}>Início</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function HomeOptions({ onSelect }: { onSelect: (operation: Operation) => void }) {
  return (
    <View style={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Como podemos ajudar?</Text>
        <Text style={styles.heroDescription}>
          Escolha uma operação para iniciar o atendimento no totem da biblioteca.
        </Text>
      </View>

      <View style={styles.optionGrid}>
        {mainOptions.map((option) => (
          <Pressable
            accessibilityRole="button"
            key={option.title}
            onPress={() => onSelect(option.action)}
            style={({ pressed }) => [
              styles.optionCard,
              pressed ? styles.optionCardPressed : null,
            ]}>
            <View style={styles.optionIcon}>
              <MaterialCommunityIcons name={option.icon} size={34} color={cps.red} />
            </View>
            <Text style={option.title.length > 12 ? styles.optionTitleSmall : styles.optionTitle}>
              {option.title}
            </Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function LoanFlow({
  operation,
  progress,
  step,
  onFaceConfirmed,
  onBookRead,
  onHome,
}: {
  operation: 'loan' | 'return';
  progress: number;
  step: TotemStep;
  onFaceConfirmed: () => void;
  onBookRead: () => void;
  onHome: () => void;
}) {
  const isReturn = operation === 'return';

  return (
    <View style={styles.content}>
      <ProgressIndicator current={progress} />

      {step === 'face' ? (
        <ActionPanel
          icon="face-recognition"
          eyebrow="Etapa 1 de 3"
          title="Reconhecimento facial"
          description={`Posicione o rosto no centro da câmera para confirmar sua identidade antes ${isReturn ? 'da devolução' : 'do empréstimo'}.`}
          status="Câmera pronta para validação"
          primaryLabel="Confirmar reconhecimento"
          onPrimary={onFaceConfirmed}
        >
          <View style={styles.faceFrame}>
            <MaterialCommunityIcons name="face-recognition" size={96} color={cps.red} />
            <Text style={styles.faceHint}>Mantenha o rosto visível</Text>
          </View>
        </ActionPanel>
      ) : null}

      {step === 'rfid' ? (
        <ActionPanel
          icon="radio-tower"
          eyebrow="Etapa 2 de 3"
          title="Leitura RFID do livro"
          description={`Aproxime o livro do leitor RFID para localizar a etiqueta e preparar o registro de ${isReturn ? 'devolução' : 'empréstimo'}.`}
          status="Leitor RFID aguardando aproximação"
          primaryLabel="Simular leitura RFID"
          onPrimary={onBookRead}
        >
          <View style={styles.scanArea}>
            <View style={styles.rfidPulse}>
              <MaterialCommunityIcons name="book-open-page-variant-outline" size={76} color={cps.red} />
            </View>
            <Text style={styles.faceHint}>Etiqueta detectada automaticamente</Text>
          </View>
        </ActionPanel>
      ) : null}

      {step === 'confirmation' ? <ConfirmationPanel operation={operation} onHome={onHome} /> : null}
    </View>
  );
}

function ProgressIndicator({ current }: { current: number }) {
  const labels = ['Face', 'RFID', 'Confirmação'];

  return (
    <View style={styles.progressCard}>
      {labels.map((label, index) => {
        const number = index + 1;
        const active = current >= number;

        return (
          <View key={label} style={styles.progressItem}>
            <View style={[styles.progressDot, active ? styles.progressDotActive : null]}>
              <Text style={[styles.progressNumber, active ? styles.progressNumberActive : null]}>
                {number}
              </Text>
            </View>
            <Text style={[styles.progressLabel, active ? styles.progressLabelActive : null]}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function ActionPanel({
  children,
  description,
  eyebrow,
  icon,
  onPrimary,
  primaryLabel,
  status,
  title,
}: {
  children: ReactNode;
  description: string;
  eyebrow: string;
  icon: IconName;
  onPrimary: () => void;
  primaryLabel: string;
  status: string;
  title: string;
}) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.panelIcon}>
          <MaterialCommunityIcons name={icon} size={30} color={cps.red} />
        </View>
        <View style={styles.panelText}>
          <Text style={styles.panelEyebrow}>{eyebrow}</Text>
          <Text style={styles.panelTitle}>{title}</Text>
          <Text style={styles.panelDescription}>{description}</Text>
        </View>
      </View>

      {children}

      <View style={styles.statusRow}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <PrimaryButton label={primaryLabel} onPress={onPrimary} />
    </View>
  );
}

function ConfirmationPanel({
  operation,
  onHome,
}: {
  operation: 'loan' | 'return';
  onHome: () => void;
}) {
  const isReturn = operation === 'return';

  return (
    <View style={styles.panel}>
      <View style={styles.successBadge}>
        <MaterialCommunityIcons name="check-circle-outline" size={58} color={cps.success} />
      </View>
      <Text style={styles.confirmTitle}>
        {isReturn ? 'Devolução confirmada' : 'Empréstimo confirmado'}
      </Text>
      <Text style={styles.confirmDescription}>
        {isReturn
          ? 'O registro foi concluído e o livro já consta como devolvido no acervo da biblioteca.'
          : 'O registro foi concluído e o livro já consta como emprestado para o usuário identificado.'}
      </Text>

      <View style={styles.summary}>
        <SummaryRow label="Usuário" value={user.name} />
        <SummaryRow label="Curso" value={user.course} />
        <SummaryRow label="Identificação" value={user.ra} />
        <SummaryRow label="Livro" value={book.title} />
        <SummaryRow label="Autor" value={book.author} />
        <SummaryRow label="Etiqueta RFID" value={book.rfid} />
        <SummaryRow
          label={isReturn ? 'Status' : 'Devolução prevista'}
          value={isReturn ? 'Devolvido com sucesso' : book.dueDate}
          highlight
        />
      </View>

      <PrimaryButton label="Voltar ao início" onPress={onHome} icon="home-outline" />
    </View>
  );
}

function SearchPanel({ onHome }: { onHome: () => void }) {
  const [query, setQuery] = useState('');
  
  const filteredBooks = useMemo(() => {
    if (!query) return [];
    return mockBooks.filter(b => 
      b.title.toLowerCase().includes(query.toLowerCase()) || 
      b.author.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.panelIcon}>
          <MaterialCommunityIcons name="map-search-outline" size={30} color={cps.red} />
        </View>
        <View style={styles.panelText}>
          <Text style={styles.panelEyebrow}>Consulta Integrada</Text>
          <Text style={styles.panelTitle}>Buscar no acervo</Text>
          <Text style={styles.panelDescription}>Digite o título ou autor para localizar as coordenadas do exemplar físico.</Text>
        </View>
      </View>

      <View style={styles.searchBoxContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color={cps.muted} style={styles.searchIcon} />
        <TextInput
          placeholder="Ex: Engenharia de Software..."
          placeholderTextColor={cps.muted}
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      <View style={styles.resultsContainer}>
        {query === '' ? (
          <Text style={styles.searchPlaceholderText}>Digite algo acima para ver o mapa do livro.</Text>
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map(item => (
            <View key={item.id} style={styles.bookResultCard}>
              <View style={styles.bookResultInfo}>
                <Text style={styles.bookResultTitle}>{item.title}</Text>
                <Text style={styles.bookResultAuthor}>{item.author}</Text>
              </View>
              <View style={styles.locationBadge}>
                <MaterialCommunityIcons name="map-marker-radius" size={18} color={cps.red} />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.searchPlaceholderText}>Nenhum livro encontrado com esse termo.</Text>
        )}
      </View>

      <PrimaryButton label="Voltar ao início" onPress={onHome} icon="home-outline" />
    </View>
  );
}

function SupportPanel({ onHome }: { onHome: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [ticketType, setTicketType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (ticketType && description) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <View style={styles.panel}>
        <View style={styles.successBadge}>
          <MaterialCommunityIcons name="ticket-confirmation-outline" size={58} color={cps.success} />
        </View>
        <Text style={styles.confirmTitle}>Solicitação Aberta!</Text>
        <Text style={styles.confirmDescription}>
          Seu ticket foi gerado com sucesso. Um operador da biblioteca foi notificado e irá até o totem ou entrará em contato.
        </Text>
        <View style={styles.summary}>
          <SummaryRow label="Protocolo" value="Nº 2026-0892" highlight />
          <SummaryRow label="Categoria" value={ticketType} />
          <SummaryRow label="Status" value="Aguardando atendimento" />
        </View>
        <PrimaryButton label="Voltar ao início" onPress={onHome} icon="home-outline" />
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.panelIcon}>
          <MaterialCommunityIcons name="face-agent" size={30} color={cps.red} />
        </View>
        <View style={styles.panelText}>
          <Text style={styles.panelEyebrow}>Suporte ao Usuário</Text>
          <Text style={styles.panelTitle}>Abrir chamado</Text>
          <Text style={styles.panelDescription}>Relate problemas técnicos com o totem ou com suas pendências no acervo.</Text>
        </View>
      </View>

      <Text style={styles.inputLabel}>Selecione o tipo de problema:</Text>
      <View style={styles.ticketTypeGrid}>
        {['Problema com RFID', 'Erro no cadastro', 'Outros Assuntos'].map(type => (
          <Pressable
            key={type}
            onPress={() => setTicketType(type)}
            style={[styles.typeButton, ticketType === type ? styles.typeButtonActive : null]}
          >
            <Text style={[styles.typeButtonText, ticketType === type ? styles.typeButtonTextActive : null]}>
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.inputLabel}>Descrição da ocorrência:</Text>
      <TextInput
        placeholder="Descreva brevemente o que aconteceu..."
        placeholderTextColor={cps.muted}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textArea]}
      />

      <PrimaryButton 
        label="Enviar Solicitação" 
        onPress={handleSubmit} 
        icon="send" 
        disabled={!ticketType || !description} 
      />
    </View>
  );
}

function SummaryRow({
  highlight,
  label,
  value,
}: {
  highlight?: boolean;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, highlight ? styles.summaryHighlight : null]}>{value}</Text>
    </View>
  );
}

function PrimaryButton({
  icon = 'arrow-right',
  label,
  onPress,
  disabled = false,
}: {
  icon?: IconName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton, 
        pressed ? styles.primaryButtonPressed : null,
        disabled ? styles.primaryButtonDisabled : null
      ]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      <MaterialCommunityIcons name={icon} size={24} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cps.background,
  },
  page: {
    flexGrow: 1,
    padding: 20,
    gap: 22,
  },
  header: {
    minHeight: 76,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  brandMark: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: cps.red,
    shadowColor: cps.red,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  },
  brandInitials: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  headerText: {
    flex: 1,
  },
  kicker: {
    color: cps.red,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: cps.text,
    fontSize: 24,
    fontWeight: '800',
  },
  headerButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cps.border,
    backgroundColor: cps.surface,
    paddingHorizontal: 14,
  },
  headerButtonText: {
    color: cps.red,
    fontSize: 15,
    fontWeight: '700',
  },
  content: {
    gap: 20,
  },
  hero: {
    paddingVertical: 8,
    gap: 8,
  },
  heroTitle: {
    color: cps.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  heroDescription: {
    maxWidth: 620,
    color: cps.muted,
    fontSize: 17,
    lineHeight: 24,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  optionCard: {
    minHeight: 188,
    width: '48%',
    minWidth: 270,
    flexGrow: 1,
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cps.border,
    backgroundColor: cps.surface,
    padding: 20,
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  optionCardPressed: {
    borderColor: cps.red,
    transform: [{ translateY: 1 }],
  },
  optionIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: cps.redLight,
  },
  optionTitle: {
    color: cps.text,
    fontSize: 24,
    fontWeight: '800',
  },
  optionTitleSmall: {
    color: cps.text,
    fontSize: 20,
    fontWeight: '800',
  },
  optionDescription: {
    color: cps.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cps.border,
    backgroundColor: cps.surface,
    padding: 14,
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
  },
  progressDot: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#EDF2F7',
  },
  progressDotActive: {
    backgroundColor: cps.red,
  },
  progressNumber: {
    color: cps.muted,
    fontWeight: '800',
  },
  progressNumberActive: {
    color: '#FFFFFF',
  },
  progressLabel: {
    color: cps.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  progressLabelActive: {
    color: cps.text,
  },
  panel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cps.border,
    backgroundColor: cps.surface,
    padding: 22,
    gap: 20,
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
    elevation: 4,
  },
  panelHeader: {
    flexDirection: 'row',
    gap: 14,
  },
  panelIcon: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: cps.redLight,
  },
  panelText: {
    flex: 1,
    gap: 5,
  },
  panelEyebrow: {
    color: cps.red,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: cps.text,
    fontSize: 28,
    fontWeight: '800',
  },
  panelDescription: {
    color: cps.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  faceFrame: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: cps.red,
    borderStyle: 'dashed',
    backgroundColor: '#FFF8F7',
    gap: 12,
  },
  scanArea: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FFF8F7',
    gap: 14,
  },
  rfidPulse: {
    width: 154,
    height: 154,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 77,
    borderWidth: 10,
    borderColor: cps.redLight,
    backgroundColor: '#FFFFFF',
  },
  faceHint: {
    color: cps.muted,
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: cps.success,
  },
  statusText: {
    color: cps.muted,
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButton: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    borderRadius: 8,
    backgroundColor: cps.red,
    paddingHorizontal: 18,
  },
  primaryButtonPressed: {
    backgroundColor: cps.redPressed,
  },
  primaryButtonDisabled: {
    backgroundColor: cps.border,
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  successBadge: {
    alignSelf: 'center',
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 46,
    backgroundColor: cps.successLight,
  },
  confirmTitle: {
    color: cps.text,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
  },
  confirmDescription: {
    color: cps.muted,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 23,
  },
  summary: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cps.border,
    overflow: 'hidden',
  },
  summaryRow: {
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: cps.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryLabel: {
    color: cps.muted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: cps.text,
    fontSize: 17,
    fontWeight: '700',
  },
  summaryHighlight: {
    color: cps.success,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cps.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: cps.background,
    height: 54,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: cps.text,
    fontWeight: '600',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: cps.border,
    borderRadius: 8,
    padding: 14,
    backgroundColor: cps.background,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: cps.text,
    marginBottom: -10,
  },
  resultsContainer: {
    minHeight: 120,
    gap: 10,
  },
  searchPlaceholderText: {
    color: cps.muted,
    textAlign: 'center',
    fontSize: 15,
    paddingVertical: 20,
  },
  bookResultCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cps.border,
    backgroundColor: cps.background,
    gap: 10,
  },
  bookResultInfo: {
    gap: 2,
  },
  bookResultTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: cps.text,
  },
  bookResultAuthor: {
    fontSize: 14,
    color: cps.muted,
    fontWeight: '600',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: cps.redLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  locationText: {
    color: cps.red,
    fontSize: 14,
    fontWeight: '700',
  },
  ticketTypeGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cps.border,
    backgroundColor: cps.surface,
  },
  typeButtonActive: {
    backgroundColor: cps.red,
    borderColor: cps.red,
  },
  typeButtonText: {
    color: cps.muted,
    fontWeight: '700',
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
});