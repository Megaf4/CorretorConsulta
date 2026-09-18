import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, DimensionValue, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AulaCurso, buscarCursoDetalhado, Curso, salvarProgressoAula } from '@/lib/cursos';

type Lesson = {
  duration: string;
  id: string;
  label: string;
  status: 'Não assistido' | 'Assistido';
  title: string;
};

function formatDuration(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} min`;
}

function lessonLabel(title: string) {
  if (/boleto/i.test(title)) return 'Emitir boleto';
  if (/dependente/i.test(title)) return 'Inclusão de dependente';
  if (/reembolso/i.test(title)) return 'Reembolso';
  if (/contrato|emissão|emissao/i.test(title)) return 'Emissão';
  if (/cotação|cotacao/i.test(title)) return 'Cotação';
  return 'Aula';
}

function mapLesson(aula: AulaCurso): Lesson {
  return {
    duration: formatDuration(aula.duracaoSegundos),
    id: aula.id,
    label: lessonLabel(aula.titulo),
    status: aula.status === 'assistido' ? 'Assistido' : 'Não assistido',
    title: aula.titulo,
  };
}

function LessonCard({
  color,
  index,
  lesson,
  onComplete,
}: {
  color: string;
  index: number;
  lesson: Lesson;
  onComplete: (lesson: Lesson) => void;
}) {
  const watched = lesson.status === 'Assistido';

  return (
    <View style={styles.lessonCard}>
      <View style={[styles.lessonVideo, { backgroundColor: color }]}>
        <View style={[styles.lessonStatus, { backgroundColor: watched ? '#ffffff' : '#172844' }]}>
          <Text style={[styles.statusText, watched && styles.watchedStatusText]}>
            {lesson.status}
          </Text>
        </View>
        <View style={styles.lessonPlay}>
          <SymbolView name="play.fill" size={22} tintColor="#ffffff" />
        </View>
        <Text style={styles.lessonLabel}>{lesson.label}</Text>
      </View>

      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.lessonMeta}>
          <SymbolView name="clock" size={14} tintColor="#a2adbd" />
          <Text style={styles.lessonDuration}>{lesson.duration}</Text>
          <Text style={styles.topic}>Saúde</Text>
        </View>
        <View style={styles.lessonProgress}>
          <View style={[styles.lessonProgressFill, { width: watched ? '100%' : index === 0 ? '18%' : '0%' }]} />
        </View>
        <Pressable
          onPress={() => onComplete(lesson)}
          style={[styles.watchButton, watched && styles.reviewButton]}
        >
          <Text style={[styles.watchButtonText, watched && styles.reviewButtonText]}>
            {watched ? 'Revisar' : 'Assistir'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function CourseDetailScreen() {
  const router = useRouter();
  const { course } = useLocalSearchParams<{ course?: string }>();
  const [courseData, setCourseData] = useState<Curso | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCourse() {
      try {
        setError(null);
        const data = await buscarCursoDetalhado(course ?? 'bradesco-saude');

        if (!active) return;

        if (!data) {
          setError('Curso não encontrado');
          return;
        }

        setCourseData(data.curso);
        setLessons(data.aulas.map(mapLesson));
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar curso');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCourse();

    return () => {
      active = false;
    };
  }, [course]);

  const watchedCount = lessons.filter((lesson) => lesson.status === 'Assistido').length;
  const totalMinutes = useMemo(() => {
    return lessons.reduce((sum, lesson) => sum + Number.parseInt(lesson.duration, 10), 0);
  }, [lessons]);
  const courseName = courseData?.titulo ?? 'Bradesco Saúde';
  const courseColor = courseData?.color ?? '#d30a36';
  const progressWidth: DimensionValue = lessons.length
    ? `${Math.round((watchedCount / lessons.length) * 100)}%`
    : '0%';

  async function handleComplete(lesson: Lesson) {
    setLessons((current) =>
      current.map((item) =>
        item.id === lesson.id ? { ...item, status: 'Assistido' } : item
      )
    );

    const minutes = Number.parseInt(lesson.duration, 10);
    try {
      await salvarProgressoAula(lesson.id, minutes * 60, true);
    } catch (err) {
      console.warn('Não foi possível salvar progresso da aula:', err);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <SymbolView name="chevron.left" size={23} tintColor="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>{courseName}</Text>
        <View style={styles.profileButton}>
          <Text style={styles.profileInitials}>CR</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.feedbackBox}>
            <ActivityIndicator color="#172844" />
            <Text style={styles.feedbackText}>Carregando curso...</Text>
          </View>
        ) : error ? (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{error}</Text>
          </View>
        ) : (
          <>
        <View style={styles.courseIntro}>
          <View style={[styles.courseLogo, { backgroundColor: courseColor }]}>
            <Text style={styles.courseLogoText}>{courseData?.acronimo ?? 'BS'}</Text>
          </View>
          <View>
            <Text style={styles.courseName}>{courseName}</Text>
            <Text style={styles.courseMeta}>
              {courseData?.categoria ?? 'saúde'} · {lessons.length} aulas · {totalMinutes} min no total
            </Text>
          </View>
        </View>

        <View style={styles.totalProgress}>
          <View style={[styles.totalProgressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressLabel}>
          {watchedCount} de {lessons.length} aulas concluídas
        </Text>
        <View style={styles.separator} />

        {lessons.map((lesson, index) => (
          <LessonCard
            color={courseColor}
            index={index}
            key={lesson.id}
            lesson={lesson}
            onComplete={handleComplete}
          />
        ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#ffffff', flex: 1 },
  header: {
    alignItems: 'center',
    backgroundColor: '#172844',
    flexDirection: 'row',
    height: 72,
    paddingHorizontal: 16,
  },
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 36 },
  headerTitle: { color: '#ffffff', flex: 1, fontSize: 16, fontWeight: '900', marginLeft: 8 },
  profileButton: {
    alignItems: 'center',
    backgroundColor: '#283c63',
    borderColor: '#50668f',
    borderRadius: 20,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  profileInitials: { color: '#ffffff', fontSize: 11, fontWeight: '900' },
  content: { paddingBottom: 34 },
  feedbackBox: {
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
    padding: 24,
  },
  feedbackText: {
    color: '#7c8799',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  courseIntro: { alignItems: 'center', flexDirection: 'row', padding: 16 },
  courseLogo: {
    alignItems: 'center',
    backgroundColor: '#d30a36',
    borderRadius: 9,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42,
  },
  courseLogoText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
  courseName: { color: '#243653', fontSize: 17, fontWeight: '900' },
  courseMeta: { color: '#8b96a8', fontSize: 11, marginTop: 3 },
  totalProgress: { backgroundColor: '#e6eaf0', height: 5, marginHorizontal: 16 },
  totalProgressFill: { backgroundColor: '#2380a1', height: 5, width: '33%' },
  progressLabel: { color: '#8d98a8', fontSize: 11, marginHorizontal: 16, marginTop: 7 },
  separator: { backgroundColor: '#edf0f4', height: 1, marginTop: 16 },
  lessonCard: {
    borderColor: '#d9dee7',
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 14,
    marginTop: 12,
    overflow: 'hidden',
  },
  lessonVideo: { backgroundColor: '#d30a36', height: 128, justifyContent: 'center', padding: 9 },
  lessonStatus: {
    alignSelf: 'flex-end',
    backgroundColor: '#4d1020',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusText: { color: '#ffffff', fontSize: 10, fontWeight: '900' },
  watchedStatusText: { backgroundColor: '#b7e8d1', color: '#176848', margin: -5, paddingHorizontal: 5, paddingVertical: 1 },
  lessonPlay: { alignItems: 'center', alignSelf: 'center', borderColor: '#ffffff', borderRadius: 22, borderWidth: 2, height: 44, justifyContent: 'center', width: 44 },
  lessonLabel: { backgroundColor: '#4d1020', color: '#ffffff', fontSize: 10, fontWeight: '800', marginTop: 10, paddingHorizontal: 6, paddingVertical: 4, alignSelf: 'flex-start' },
  lessonInfo: { padding: 10 },
  lessonTitle: { color: '#273752', fontSize: 14, fontWeight: '900' },
  lessonMeta: { alignItems: 'center', flexDirection: 'row', marginTop: 8 },
  lessonDuration: { color: '#929dad', fontSize: 11, marginLeft: 4 },
  topic: { backgroundColor: '#edf5f8', borderRadius: 5, color: '#3e829a', fontSize: 10, fontWeight: '800', marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 4 },
  lessonProgress: { backgroundColor: '#e0e5eb', height: 4, marginTop: 9 },
  lessonProgressFill: { backgroundColor: '#2380a1', height: 4 },
  watchButton: { alignItems: 'center', backgroundColor: '#172844', borderRadius: 8, height: 42, justifyContent: 'center', marginTop: 10 },
  reviewButton: { backgroundColor: '#ffffff', borderColor: '#d9dee7', borderWidth: 1 },
  watchButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '900' },
  reviewButtonText: { color: '#273752' },
});
