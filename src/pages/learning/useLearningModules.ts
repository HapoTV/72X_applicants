// src/pages/learning/useLearningModules.ts
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { learningService } from '../../services/LearningService';
import { adService } from '../../services/AdService';
import { useAuth } from '../../context/AuthContext';
import type { UserLearningModule } from '../../interfaces/LearningData';
import { EngagementType } from '../../interfaces/AdData';

// ─── localStorage helpers ─────────────────────────────────────────────────────
export const lsGet = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
export const lsSet = (key: string, val: string) => { try { localStorage.setItem(key, val); } catch { /* ignore */ } };
export const lsDel = (key: string) => { try { localStorage.removeItem(key); } catch { /* ignore */ } };

export const CATEGORIES = [
  { id: 'BUSINESS_PLANNING',    name: 'Business Planning' },
  { id: 'MARKETING_SALES',      name: 'Marketing & Sales' },
  { id: 'FINANCIAL_MANAGEMENT', name: 'Financial Management' },
  { id: 'OPERATIONS',           name: 'Operations' },
  { id: 'LEADERSHIP',           name: 'Leadership' },
  { id: 'TECHNICAL',            name: 'Technical' },
];

const CATEGORY_MAP: Record<string, string> = {
  'business-plan':  'BUSINESS_PLANNING',
  'marketing':      'MARKETING_SALES',
  'finance':        'FINANCIAL_MANAGEMENT',
  'operations':     'OPERATIONS',
  'leadership':     'LEADERSHIP',
  'technical':      'TECHNICAL',
  'standardbank':   'TECHNICAL',
};

export function useLearningModules() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>('BUSINESS_PLANNING');
  const [modules, setModules] = useState<UserLearningModule[]>([]);
  const [openMaterial, setOpenMaterial] = useState<UserLearningModule | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizMaterial, setQuizMaterial] = useState<UserLearningModule | null>(null);
  const [startedMaterialIds, setStartedMaterialIds] = useState<string[]>([]);
  const [quizPassedMaterialIds, setQuizPassedMaterialIds] = useState<string[]>([]);
  const [materialReadyForQuiz, setMaterialReadyForQuiz] = useState(false);
  const [readTimerDone, setReadTimerDone] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  const sessionRestoredRef = React.useRef(false);

  // ── Sync category from URL params ──────────────────────────────────────────
  useEffect(() => {
    const raw = searchParams.get('category') || 'BUSINESS_PLANNING';
    const normalized = CATEGORY_MAP[raw.toLowerCase()] ?? raw;
    if (normalized !== selectedCategory) setSelectedCategory(normalized);
  }, [searchParams, selectedCategory]);

  // ── Fetch modules ───────────────────────────────────────────────────────────
  const { isLoading: loading, error: queryError, data: queryData } = useQuery({
    queryKey: ['learning-modules', user?.email, selectedCategory],
    queryFn: async () => {
      if (!user?.email) throw new Error('User email not found');
      const modulesData = await learningService.getUserModules(user.email, { category: selectedCategory as any });
      const started = new Set<string>();
      const quizPassed = new Set<string>();
      modulesData.forEach(m => {
        if (m.openedAt || (m.progress && m.progress > 0)) started.add(m.id);
        if (m.quizPassedAt) quizPassed.add(m.id);
      });
      return { modules: modulesData, started: Array.from(started), quizPassed: Array.from(quizPassed) };
    },
    enabled: !!user?.email,
    staleTime: 3 * 60 * 1000,
  });

  // ── Sync local state from cache ─────────────────────────────────────────────
  useEffect(() => {
    if (!queryData) return;
    setModules(queryData.modules);
    setStartedMaterialIds(queryData.started);
    setQuizPassedMaterialIds(queryData.quizPassed);

    if (!sessionRestoredRef.current && user?.email) {
      sessionRestoredRef.current = true;
      const savedId = lsGet(`learning_open_material_${user.email}`);
      if (savedId) {
        const found = queryData.modules.find(m => m.id === savedId);
        if (found) {
          const wasReady = lsGet(`learning_ready_for_quiz_${savedId}`) === '1';
          setOpenMaterial(found);
          setMaterialReadyForQuiz(wasReady);
          setReadTimerDone(wasReady);
        }
      }
    }
  }, [queryData, user?.email]);

  // ── Restore scroll position when modal opens ────────────────────────────────
  useEffect(() => {
    if (!openMaterial) return;
    const savedScroll = lsGet(`learning_scroll_${openMaterial.id}`);
    if (!savedScroll) return;
    const raf = requestAnimationFrame(() => {
      const modal = document.querySelector('.learning-material-modal') as HTMLElement | null;
      if (modal) modal.scrollTop = parseInt(savedScroll, 10);
    });
    return () => cancelAnimationFrame(raf);
  }, [openMaterial]);

  // ── Read timer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!openMaterial) {
      setMaterialReadyForQuiz(false);
      setReadTimerDone(false);
      return;
    }
    if (openMaterial.progress === 100 || openMaterial.finishedAt) {
      setMaterialReadyForQuiz(true);
      setReadTimerDone(true);
      return;
    }
    setMaterialReadyForQuiz(false);
    setReadTimerDone(false);
    const type = (openMaterial.type || '').toLowerCase();
    const url = openMaterial.resourceUrl || '';
    const isVideo = type.includes('video') || /\.(mp4|webm|ogg)$/i.test(url);
    if (!isVideo) {
      const timer = window.setTimeout(() => setReadTimerDone(true), 15000);
      return () => window.clearTimeout(timer);
    }
  }, [openMaterial]);

  // ── Derived counts ──────────────────────────────────────────────────────────
  const completedCount = useMemo(() =>
    modules.filter(m => quizPassedMaterialIds.includes(m.id) || m.progress === 100 || m.finishedAt).length,
    [modules, quizPassedMaterialIds]
  );

  const inProgressCount = useMemo(() => {
    const startedSet = new Set<string>(startedMaterialIds);
    if (openMaterial?.id) startedSet.add(openMaterial.id);
    let count = 0;
    for (const m of modules) {
      if (!startedSet.has(m.id)) continue;
      if (m.progress === 100 || m.finishedAt) continue;
      count += 1;
    }
    return count;
  }, [modules, startedMaterialIds, openMaterial?.id]);

  // ── URL helpers ─────────────────────────────────────────────────────────────
  const toAbsoluteResourceUrl = useCallback((url?: string): string | undefined => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    const base = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_PRODUCTION_URL || 'http://localhost:8080';
    return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`;
  }, []);

  const getCardCoverKind = useCallback((material: UserLearningModule): 'pdf' | 'office' | 'image' | 'other' => {
    const type = (material.type || '').toLowerCase();
    const url = material.resourceUrl || '';
    if (type.includes('pdf') || /\.(pdf)$/i.test(url)) return 'pdf';
    if (type.includes('doc') || type.includes('ppt') || type.includes('xls') || /\.(doc|docx|ppt|pptx|xls|xlsx)$/i.test(url)) return 'office';
    if (type.includes('image') || /\.(png|jpe?g|webp|gif|svg)$/i.test(url)) return 'image';
    return 'other';
  }, []);

  const getCoverPreviewSrc = useCallback((material: UserLearningModule): string | undefined => {
    const kind = getCardCoverKind(material);
    const absUrl = toAbsoluteResourceUrl(material.resourceUrl);
    if (!absUrl) return undefined;
    if (kind === 'pdf') return absUrl;
    if (kind === 'office') return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absUrl)}`;
    if (kind === 'image') return absUrl;
    return undefined;
  }, [getCardCoverKind, toAbsoluteResourceUrl]);

  const detectViewerKind = useCallback((material: UserLearningModule): 'video' | 'pdf' | 'office' | 'image' | 'url' | 'unknown' => {
    const type = (material.type || '').toLowerCase();
    const url = material.resourceUrl || '';
    if (type.includes('video') || /\.(mp4|webm|ogg)$/i.test(url)) return 'video';
    if (type.includes('pdf') || /\.(pdf)$/i.test(url)) return 'pdf';
    if (type.includes('doc') || type.includes('ppt') || type.includes('xls') || /\.(doc|docx|ppt|pptx|xls|xlsx)$/i.test(url)) return 'office';
    if (type.includes('image') || /\.(png|jpe?g|webp|gif|svg)$/i.test(url)) return 'image';
    if (type.includes('url') || /^https?:\/\//i.test(url)) return 'url';
    return 'unknown';
  }, []);

  // ── Gate logic ──────────────────────────────────────────────────────────────
  const getIsLockedByGate = useCallback((moduleId: string): { isLocked: boolean; gateText: string } => {
    const idx = modules.findIndex(m => m.id === moduleId);
    if (idx <= 0) return { isLocked: false, gateText: '' };
    const prev = modules[idx - 1];
    const isLocked = prev ? !(prev.progress === 100 || prev.finishedAt) : false;
    return {
      isLocked,
      gateText: prev ? 'To continue to the next learning material, you must first finish the previous learning material.' : '',
    };
  }, [modules]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const openMaterialAndTrack = useCallback((material: UserLearningModule) => {
    setOpenMaterial(material);
    setStartedMaterialIds(prev => prev.includes(material.id) ? prev : [...prev, material.id]);
    setMaterialReadyForQuiz(false);
    setReadTimerDone(false);
    if (user?.email) {
      lsSet(`learning_open_material_${user.email}`, material.id);
      learningService.recordOpened(user.email, material.id);
    }
  }, [user?.email]);

  const closeMaterial = useCallback(() => {
    if (user?.email) lsDel(`learning_open_material_${user.email}`);
    setOpenMaterial(null);
  }, [user?.email]);

  const recordMaterialFinished = useCallback(async (material: UserLearningModule) => {
    lsSet(`learning_ready_for_quiz_${material.id}`, '1');
    setModules(prev => prev.map(m =>
      m.id === material.id ? { ...m, progress: 100, isCompleted: true, finishedAt: new Date().toISOString() } : m
    ));
    try { if (user?.email) await learningService.recordFinished(user.email, material.id); } catch { /* non-critical */ }
    try { await adService.recordEngagement(EngagementType.ACTION_COMPLETED, 5, `Finished: ${material.title}`); } catch { /* non-critical */ }
    queryClient.invalidateQueries({ queryKey: ['learning-modules', user?.email, selectedCategory] });
  }, [user?.email, queryClient, selectedCategory]);

  // ── Quiz helpers ─────────────────────────────────────────────────────────────
  const mapQuestionType = useCallback((type: string): string => {
    const map: Record<string, string> = {
      MULTIPLE_CHOICE: 'multiple_choice', TRUE_FALSE: 'multiple_choice',
      FILL_BLANK: 'fill_blank', MATCHING: 'match_pairs', MATCH_WORDING: 'match_pairs',
      ORDERING: 'order_steps', CATEGORIZE: 'categorize', DRAG_AND_DROP: 'categorize',
    };
    return map[type] || 'multiple_choice';
  }, []);

  const tryParseStructuredOptionPayload = useCallback((q: any): any | null => {
    const raw = Array.isArray(q?.options) ? q.options[0] : undefined;
    if (raw && typeof raw === 'object') return raw;
    if (typeof raw !== 'string' || !raw.trim()) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }, []);

  const transformQuestions = useCallback((backendQuestions: any[]): any[] => {
    if (!Array.isArray(backendQuestions) || backendQuestions.length === 0) return [];
    return backendQuestions.map((q, index) => {
      const questionType = String(q?.questionType || 'MULTIPLE_CHOICE').toUpperCase();
      const base: any = {
        id: q.id || `q${index + 1}`,
        type: mapQuestionType(questionType),
        question: q.questionText || 'Sample question',
        explanation: q.explanation || 'Review the material to understand this concept better.',
        correctAnswer: q.correctAnswerIndex || 0,
      };
      switch (questionType) {
        case 'MULTIPLE_CHOICE': case 'TRUE_FALSE':
          base.options = q.options || ['Option A', 'Option B', 'Option C', 'Option D']; break;
        case 'FILL_BLANK':
          base.template = q.questionText || '______ is a key concept.';
          base.wordBank = [q.correctAnswerText || 'answer', 'concept', 'process', 'method', 'strategy'];
          base.correctWord = q.correctAnswerText || 'answer'; break;
        case 'MATCHING': case 'MATCH_WORDING': {
          const payload = tryParseStructuredOptionPayload(q);
          base.pairs = Array.isArray(q.pairs) && q.pairs.length > 0 ? q.pairs
            : (Array.isArray(payload?.pairs) ? payload.pairs : (Array.isArray(payload?.matches) ? payload.matches : []));
          base.options = []; break;
        }
        case 'CATEGORIZE': case 'DRAG_AND_DROP': {
          const payload = tryParseStructuredOptionPayload(q);
          const pairsAny = Array.isArray(payload?.pairs) && payload.pairs.length > 0 ? payload.pairs
            : (Array.isArray(payload?.matches) ? payload.matches : []);
          if (pairsAny.length > 0) { base.type = 'match_pairs'; base.pairs = pairsAny; base.options = []; break; }
          base.categories = Array.isArray(q.categories) && q.categories.length > 0 ? q.categories : (Array.isArray(payload?.categories) ? payload.categories : []);
          base.items = Array.isArray(q.items) && q.items.length > 0 ? q.items : (Array.isArray(payload?.items) ? payload.items : []);
          base.options = []; break;
        }
        default: base.options = q.options || ['Option A', 'Option B', 'Option C', 'Option D'];
      }
      return base;
    });
  }, [mapQuestionType, tryParseStructuredOptionPayload]);

  const beginQuizForMaterial = useCallback(async (material: UserLearningModule) => {
    setQuizLoading(true);
    setQuizError(null);
    try {
      let quiz = await learningService.getQuiz(material.id);
      if (!quiz) quiz = await learningService.generateQuiz(material.id, 20);
      if (!quiz?.questions?.length) throw new Error('Server returned invalid quiz data');
      const transformed = transformQuestions(quiz.questions);
      if (!transformed.length) throw new Error('Failed to transform quiz questions');
      setQuizQuestions(transformed);
      setQuizMaterial(material);
      setShowQuiz(true);
      if (user?.email) await learningService.recordQuizStarted(user.email, material.id);
      try { await adService.recordEngagement(EngagementType.ACTION_COMPLETED, 5, `Started quiz: ${material.title}`); } catch { /* non-critical */ }
    } catch (err) {
      setQuizError(err instanceof Error ? err.message : 'Failed to generate quiz. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  }, [user?.email, transformQuestions]);

  const handleQuizPass = useCallback(async (score: number, totalQuestions: number, percentage: number) => {
    if (!quizMaterial) return;
    try {
      if (user?.email) await learningService.recordQuizPassed(user.email, quizMaterial.id, score, totalQuestions, percentage);
      try { await adService.recordEngagement(EngagementType.ACHIEVEMENT_UNLOCKED, 50, `Passed quiz: ${quizMaterial.title} (${Math.round(percentage)}%)`); } catch { /* non-critical */ }
      setQuizPassedMaterialIds(prev => prev.includes(quizMaterial.id) ? prev : [...prev, quizMaterial.id]);
      setModules(prev => prev.map(m => m.id === quizMaterial.id ? { ...m, progress: 100, isCompleted: true, quizPassedAt: new Date().toISOString() } : m));
      lsDel(`learning_ready_for_quiz_${quizMaterial.id}`);
      lsDel(`learning_quiz_question_${quizMaterial.id}`);
      queryClient.invalidateQueries({ queryKey: ['learning-modules', user?.email, selectedCategory] });
    } catch { /* non-critical */ } finally {
      setShowQuiz(false);
      setQuizMaterial(null);
      setQuizQuestions([]);
    }
  }, [user?.email, quizMaterial, queryClient, selectedCategory]);

  const handleCloseQuiz = useCallback(() => {
    setShowQuiz(false);
    setQuizMaterial(null);
    setQuizQuestions([]);
  }, []);

  return {
    // state
    selectedCategory, setSelectedCategory,
    modules, openMaterial, quizQuestions, quizLoading, showQuiz, quizMaterial,
    startedMaterialIds, quizPassedMaterialIds,
    materialReadyForQuiz, setMaterialReadyForQuiz,
    readTimerDone, setReadTimerDone,
    quizError,
    // derived
    completedCount, inProgressCount,
    loading, error: queryError ? 'Failed to load learning materials' : quizError,
    // helpers
    toAbsoluteResourceUrl, getCardCoverKind, getCoverPreviewSrc, detectViewerKind, getIsLockedByGate,
    // actions
    openMaterialAndTrack, closeMaterial, recordMaterialFinished,
    beginQuizForMaterial, handleQuizPass, handleCloseQuiz,
  };
}
