// src/pages/learning/LearningMaterialViewer.tsx
import React from 'react';
import { X } from 'lucide-react';
import type { UserLearningModule } from '../../interfaces/LearningData';
import { lsGet, lsSet, lsDel } from './useLearningModules';

interface Props {
  material: UserLearningModule;
  modules: UserLearningModule[];
  materialReadyForQuiz: boolean;
  readTimerDone: boolean;
  quizPassedMaterialIds: string[];
  userEmail?: string;
  toAbsoluteResourceUrl: (url?: string) => string | undefined;
  detectViewerKind: (m: UserLearningModule) => 'video' | 'pdf' | 'office' | 'image' | 'url' | 'unknown';
  getIsLockedByGate: (id: string) => { isLocked: boolean; gateText: string };
  onClose: () => void;
  onContinue: (next: UserLearningModule) => void;
  onFinished: (m: UserLearningModule) => Promise<void>;
  onStartQuiz: (m: UserLearningModule) => void;
  setMaterialReadyForQuiz: (v: boolean) => void;
  setReadTimerDone: (v: boolean) => void;
}

const LearningMaterialViewer: React.FC<Props> = ({
  material, modules, materialReadyForQuiz, readTimerDone, quizPassedMaterialIds,
  userEmail, toAbsoluteResourceUrl, detectViewerKind, getIsLockedByGate,
  onClose, onContinue, onFinished, onStartQuiz, setMaterialReadyForQuiz, setReadTimerDone,
}) => {
  const kind = detectViewerKind(material);
  const url = material.resourceUrl;
  const absUrl: string = (url ? toAbsoluteResourceUrl(url) : undefined) ?? url ?? '';

  const isFinished = Boolean(material.progress === 100 || material.finishedAt || materialReadyForQuiz);
  const idx = modules.findIndex(m => m.id === material.id);
  const next = idx >= 0 ? modules[idx + 1] : undefined;
  const nextLocked = next ? (next.isLocked || getIsLockedByGate(next.id).isLocked) : false;
  const canContinue = Boolean(isFinished && next && !nextLocked);
  const canTakeQuiz = materialReadyForQuiz || quizPassedMaterialIds.includes(material.id) || material.progress === 100 || material.finishedAt;

  const handleFinished = async () => {
    setMaterialReadyForQuiz(true);
    setReadTimerDone(true);
    await onFinished(material);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 max-h-[95vh] overflow-y-auto learning-material-modal"
        onScroll={(e) => lsSet(`learning_scroll_${material.id}`, String((e.currentTarget as HTMLElement).scrollTop))}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{material.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{material.type || 'Learning Material'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          {!url ? (
            <div className="text-sm text-gray-700">No resource URL found for this material.</div>
          ) : kind === 'image' ? (
            <div>
              <img src={absUrl} alt={material.title} className="w-full max-h-[72vh] object-contain rounded-lg bg-white" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-gray-600">Review the image, then confirm when finished to unlock the next learning material.</p>
                <button onClick={handleFinished} disabled={!readTimerDone}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold ${readTimerDone ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  I finished reviewing
                </button>
              </div>
            </div>
          ) : kind === 'pdf' || kind === 'office' ? (
            <div>
              <iframe
                key={material.id}
                title="Document Viewer"
                src={kind === 'office' ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absUrl)}` : absUrl}
                className="w-full h-[72vh] rounded-lg bg-white"
                onLoad={(e) => {
                  const saved = lsGet(`learning_scroll_${material.id}`);
                  if (saved) {
                    const container = (e.currentTarget as HTMLIFrameElement).closest('.overflow-y-auto') as HTMLElement | null;
                    if (container) container.scrollTop = parseInt(saved, 10);
                  }
                }}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-gray-600">Read for a moment, then confirm when finished to unlock the next learning material.</p>
                <button onClick={handleFinished} disabled={!readTimerDone}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold ${readTimerDone ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  I finished reading
                </button>
              </div>
            </div>
          ) : kind === 'video' ? (
            <div>
              <video className="w-full rounded-lg bg-black" controls controlsList="nodownload"
                onEnded={async () => { setMaterialReadyForQuiz(true); await onFinished(material); }}>
                <source src={url} />
              </video>
              <p className="mt-2 text-xs text-gray-600">Watch until the end to unlock the next learning material.</p>
            </div>
          ) : (
            <div className="text-sm text-gray-700">
              <p>Click the link below to open the material:</p>
              <a className="text-primary-600 hover:underline break-all mt-2 inline-block" href={url} target="_blank" rel="noreferrer">{url}</a>
              <div className="mt-4">
                <button onClick={handleFinished} disabled={!readTimerDone}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${readTimerDone ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  I finished reviewing
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {next && (
            <button onClick={() => canContinue && onContinue(next)} disabled={!canContinue}
              className={`h-11 px-5 rounded-xl font-semibold transition-all ${canContinue ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              Continue to the next module
            </button>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button onClick={onClose}
              className="h-11 px-5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              Close
            </button>
            <button
              onClick={() => { if (userEmail) lsDel(`learning_open_material_${userEmail}`); onStartQuiz(material); }}
              disabled={!canTakeQuiz}
              className={`h-11 px-5 rounded-xl font-semibold transition-all ${canTakeQuiz ? 'bg-white text-primary-700 border border-primary-200 hover:bg-primary-50' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}>
              {quizPassedMaterialIds.includes(material.id) ? 'Retake Knowledge Check' : 'Take Knowledge Check'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningMaterialViewer;
