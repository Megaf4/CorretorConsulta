import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Curso, listarCursosAtivos, pesquisarCursos } from '@/lib/cursos';

type Course = {
  acronym: string;
  badge: string;
  brand: string;
  color: string;
  duration: string;
  lessons: number;
  title: string;
};

function formatDuration(minutes?: number) {
  return `${minutes && minutes > 0 ? minutes : 0} min`;
}

function mapCursoToCard(curso: Curso): Course {
  return {
    acronym: curso.acronimo ?? curso.titulo.slice(0, 2).toUpperCase(),
    badge: curso.badge ?? (curso.destaque ? 'EM ALTA' : 'FAVORITO'),
    brand: curso.slug,
    color: curso.color ?? '#2559ac',
    duration: formatDuration(curso.duracao),
    lessons: curso.aulas ?? 0,
    title: curso.titulo,
  };
}

function CourseCard({ course }: { course: Course }) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={[styles.mediaPanel, { backgroundColor: course.color }]}>
        <View style={styles.badge}>
          <SymbolView name="graduationcap.fill" size={9} tintColor="#ffffff" />
          <Text style={styles.badgeText}>{course.badge}</Text>
        </View>
        <View style={styles.playCircle}>
          <SymbolView name="play.fill" size={18} tintColor="#ffffff" />
        </View>
        <Text style={styles.acronym}>{course.acronym}</Text>
      </View>

      <View style={styles.cardContent}>
        <View>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseCategory}>{course.brand}</Text>
          <Text style={styles.courseMeta}>
            {course.lessons} aulas - {course.duration}
          </Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({ pathname: '/course/[course]', params: { course: course.brand } })
          }
          style={[styles.courseButton, { backgroundColor: course.color }]}
        >
          <Text style={styles.courseButtonText}>Ver curso</Text>
          <SymbolView name="chevron.right" size={13} tintColor="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

function CourseSection({ courses, title }: { courses: Course[]; title: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {courses.map((course) => (
        <CourseCard course={course} key={course.title} />
      ))}
    </View>
  );
}

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        setError(null);
        const data = search.trim() ? await pesquisarCursos(search) : await listarCursosAtivos();
        if (active) setCourses(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar cursos');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, [search]);

  const { favoriteCourses, trendingCourses } = useMemo(() => {
    const cards = courses.map(mapCursoToCard);
    const trending = cards.filter((course) => course.badge === 'EM ALTA');
    const favorites = cards.filter((course) => course.badge !== 'EM ALTA');

    return {
      trendingCourses: trending.length ? trending : cards.slice(0, 3),
      favoriteCourses: favorites.length ? favorites : cards.slice(3),
    };
  }, [courses]);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.headerIconButton}>
          <SymbolView name="line.3.horizontal" size={24} tintColor="#ffffff" />
        </Pressable>
        <Text style={styles.logo}>
          corretor <Text style={styles.logoAccent}>consulta</Text>
        </Text>
        <Pressable style={styles.profileButton}>
          <Text style={styles.profileInitials}>CR</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.searchBox}>
          <SymbolView name="magnifyingglass" size={18} tintColor="#b7c0cf" />
          <TextInput
            onChangeText={setSearch}
            placeholder="Pesquisar cursos e aulas"
            placeholderTextColor="#a7b0c1"
            style={styles.searchInput}
            value={search}
          />
        </View>

        {loading ? (
          <View style={styles.feedbackBox}>
            <ActivityIndicator color="#172844" />
            <Text style={styles.feedbackText}>Carregando cursos...</Text>
          </View>
        ) : error ? (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{error}</Text>
          </View>
        ) : (
          <>
            <CourseSection courses={trendingCourses} title="EM ALTA" />
            <CourseSection courses={favoriteCourses} title="SEUS FAVORITOS" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#172844',
    flexDirection: 'row',
    height: 72,
    paddingHorizontal: 18,
  },
  headerIconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  logo: {
    color: '#ffffff',
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 6,
  },
  logoAccent: {
    color: '#87c7df',
    fontWeight: '500',
  },
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
  profileInitials: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchBox: {
    alignItems: 'center',
    borderColor: '#d4d9e3',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: '#1f2f4b',
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    color: '#7c8799',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  feedbackBox: {
    alignItems: 'center',
    marginTop: 28,
    padding: 16,
  },
  feedbackText: {
    color: '#7c8799',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#d9dde6',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 126,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#16243d',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  mediaPanel: {
    borderRadius: 8,
    height: 108,
    justifyContent: 'space-between',
    padding: 9,
    width: 108,
  },
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#17345e',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 4,
    left: -1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: -17,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  playCircle: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    justifyContent: 'center',
    marginTop: 30,
    width: 36,
  },
  acronym: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingVertical: 8,
  },
  courseTitle: {
    color: '#233653',
    fontSize: 17,
    fontWeight: '900',
  },
  courseCategory: {
    color: '#8d97a8',
    fontSize: 11,
    marginTop: 2,
  },
  courseMeta: {
    color: '#8d97a8',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  courseButton: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'center',
    minWidth: 152,
    paddingHorizontal: 16,
  },
  courseButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    marginRight: 8,
  },
});
