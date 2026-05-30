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
  View,
} from 'react-native';

type TotemStep = 'home' | 'face' | 'rfid' | 'confirmation';
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const cps = {
  blue: '#005C9F',
  bluePressed: '#004A80',
  cyan: '#00A6D6',
  red: '#B21D27',
  surface: '#FFFFFF',
  background: '#F4F7FA',
  text: '#1F2933',
  muted: '#5F6B7A',
  border: '#D8E1EA',
  success: '#157347',
  warning: '#B45309',
};

const mainOptions: {
  title: string;
  description: string;
  icon: IconName;
  action?: TotemStep;
}[] = [
  {
    title: 'Empréstimo',
    description: 'Identifique-se e registre a saída do livro.',
    icon: 'book-arrow-right-outline',
    action: 'face',
  },
  {
    title: 'Devolução',
    description: 'Registre a entrega de um livro emprestado.',
    icon: 'book-arrow-left-outline',
  },
  {
    title: 'Consulta e mapa',
    description: 'Encontre livros por estante, corredor e prateleira.',
    icon: 'map-search-outline',
  },
  {
    title: 'Suporte',
    description: 'Abra uma solicitação para a equipe da biblioteca.',
    icon: 'face-agent',
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

export default function HomeScreen() {
  const [step, setStep] = useState<TotemStep>('home');

  const currentProgress = useMemo(() => {
    if (step === 'face') return 1;
    if (step === 'rfid') return 2;
    if (step === 'confirmation') return 3;
    return 0;
  }, [step]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={cps.background} />
      <ScrollView contentContainerStyle={styles.page}>
        <Header step={step} onHome={() => setStep('home')} />

        {step === 'home' ? (
          <HomeOptions onSelect={(nextStep) => setStep(nextStep)} />
        ) : (
          <LoanFlow
            progress={currentProgress}
            step={step}
            onFaceConfirmed={() => setStep('rfid')}
            onBookRead={() => setStep('confirmation')}
            onHome={() => setStep('home')}
          />
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
          <MaterialCommunityIcons name="home-outline" size={22} color={cps.blue} />
          <Text style={styles.headerButtonText}>Início</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function HomeOptions({ onSelect }: { onSelect: (step: TotemStep) => void }) {
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
            disabled={!option.action}
            key={option.title}
            onPress={() => option.action && onSelect(option.action)}
            style={({ pressed }) => [
              styles.optionCard,
              pressed && option.action ? styles.optionCardPressed : null,
              !option.action ? styles.optionCardDisabled : null,
            ]}>
            <View style={styles.optionIcon}>
              <MaterialCommunityIcons name={option.icon} size={34} color={cps.blue} />
            </View>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
            {!option.action ? <Text style={styles.soon}>Em breve</Text> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function LoanFlow({
  progress,
  step,
  onFaceConfirmed,
  onBookRead,
  onHome,
}: {
  progress: number;
  step: TotemStep;
  onFaceConfirmed: () => void;
  onBookRead: () => void;
  onHome: () => void;
}) {
  return (
    <View style={styles.content}>
      <ProgressIndicator current={progress} />

      {step === 'face' ? (
        <ActionPanel
          icon="face-recognition"
          eyebrow="Etapa 1 de 3"
          title="Reconhecimento facial"
          description="Posicione o rosto no centro da câmera para confirmar sua identidade antes do empréstimo."
          status="Câmera pronta para validação"
          primaryLabel="Confirmar reconhecimento"
          onPrimary={onFaceConfirmed}
        >
          <View style={styles.faceFrame}>
            <MaterialCommunityIcons name="face-recognition" size={96} color={cps.blue} />
            <Text style={styles.faceHint}>Mantenha o rosto visível</Text>
          </View>
        </ActionPanel>
      ) : null}

      {step === 'rfid' ? (
        <ActionPanel
          icon="radio-tower"
          eyebrow="Etapa 2 de 3"
          title="Leitura RFID do livro"
          description="Aproxime o livro do leitor RFID para localizar a etiqueta e preparar o registro de empréstimo."
          status="Leitor RFID aguardando aproximação"
          primaryLabel="Simular leitura RFID"
          onPrimary={onBookRead}
        >
          <View style={styles.scanArea}>
            <View style={styles.rfidPulse}>
              <MaterialCommunityIcons name="book-open-page-variant-outline" size={76} color={cps.blue} />
            </View>
            <Text style={styles.faceHint}>Etiqueta detectada automaticamente</Text>
          </View>
        </ActionPanel>
      ) : null}

      {step === 'confirmation' ? <ConfirmationPanel onHome={onHome} /> : null}
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
          <MaterialCommunityIcons name={icon} size={30} color={cps.blue} />
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

function ConfirmationPanel({ onHome }: { onHome: () => void }) {
  return (
    <View style={styles.panel}>
      <View style={styles.successBadge}>
        <MaterialCommunityIcons name="check-circle-outline" size={58} color={cps.success} />
      </View>
      <Text style={styles.confirmTitle}>Empréstimo confirmado</Text>
      <Text style={styles.confirmDescription}>
        O registro foi concluído e o livro já consta como emprestado para o usuário identificado.
      </Text>

      <View style={styles.summary}>
        <SummaryRow label="Usuário" value={user.name} />
        <SummaryRow label="Curso" value={user.course} />
        <SummaryRow label="Identificação" value={user.ra} />
        <SummaryRow label="Livro" value={book.title} />
        <SummaryRow label="Autor" value={book.author} />
        <SummaryRow label="Etiqueta RFID" value={book.rfid} />
        <SummaryRow label="Devolução prevista" value={book.dueDate} highlight />
      </View>

      <PrimaryButton label="Voltar ao início" onPress={onHome} icon="home-outline" />
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
}: {
  icon?: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, pressed ? styles.primaryButtonPressed : null]}>
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
    backgroundColor: cps.blue,
    shadowColor: cps.blue,
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
    color: cps.blue,
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
    borderColor: cps.cyan,
    transform: [{ translateY: 1 }],
  },
  optionCardDisabled: {
    opacity: 0.58,
  },
  optionIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#EAF5FB',
  },
  optionTitle: {
    color: cps.text,
    fontSize: 24,
    fontWeight: '800',
  },
  optionDescription: {
    color: cps.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  soon: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    backgroundColor: '#FFF4E6',
    color: cps.warning,
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    backgroundColor: cps.blue,
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
    backgroundColor: '#EAF5FB',
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
    borderColor: cps.cyan,
    borderStyle: 'dashed',
    backgroundColor: '#F5FBFE',
    gap: 12,
  },
  scanArea: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F5FBFE',
    gap: 14,
  },
  rfidPulse: {
    width: 154,
    height: 154,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 77,
    borderWidth: 10,
    borderColor: '#D6EEF8',
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
    backgroundColor: cps.blue,
    paddingHorizontal: 18,
  },
  primaryButtonPressed: {
    backgroundColor: cps.bluePressed,
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
    backgroundColor: '#EAF7EE',
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
});
