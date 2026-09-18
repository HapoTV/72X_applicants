// src/pages/AIBusinessAnalyst.tsx
import React, { useEffect, useRef } from 'react';
import { LoaderCircle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAIBusinessAnalyst } from './hooks/useAIBusinessAnalyst';
import type { AnalysisTypeId } from '../services/aiBusinessAnalystTypes';

type ResponseSectionName = 'Headline' | 'Analysis' | 'Recommendation' | 'Supporting data' | 'Disclaimer' | 'Follow-up';

const responseSectionNames: ResponseSectionName[] = [
  'Headline',
  'Analysis',
  'Recommendation',
  'Supporting data',
  'Disclaimer',
  'Follow-up',
];

const parseMarkdownRow = (line: string) => line
  .trim()
  .replace(/^\||\|$/g, '')
  .split('|')
  .map((cell) => cleanResponseLine(cell.trim()));

const extractMarkdownTableBlock = (lines: string[]) => {
  for (let i = 0; i <= lines.length - 2; i++) {
    const headerCells = parseMarkdownRow(lines[i]);
    const separatorCells = parseMarkdownRow(lines[i + 1]);

    if (headerCells.length < 2 || separatorCells.length !== headerCells.length) continue;
    if (!separatorCells.every((cell) => /^:?-{3,}:?$/.test(cell))) continue;

    const tableLines = [lines[i], lines[i + 1]];
    const rows: string[][] = [];

    for (let j = i + 2; j < lines.length; j++) {
      const nextLine = lines[j];
      if (!nextLine.includes('|')) break;
      const rowCells = parseMarkdownRow(nextLine);
      if (rowCells.length !== headerCells.length) break;
      if (rowCells.every((cell) => !cell)) continue;
      rows.push(rowCells);
      tableLines.push(nextLine);
    }

    if (rows.length > 0 || (headerCells.length > 0 && separatorCells.length > 0)) {
      return {
        startIndex: i,
        endIndex: i + tableLines.length,
        headers: headerCells,
        rows,
      };
    }
  }

  return null;
};

const renderMarkdownTable = (lines: string[]) => {
  const tableBlock = extractMarkdownTableBlock(lines);
  if (!tableBlock) return null;

  const { headers, rows } = tableBlock;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full table-fixed border-collapse text-left text-[12.5px] sm:text-sm">
        <thead className="bg-slate-50">
          <tr>{headers.map((header, index) => <th key={index} className="border-b border-gray-200 px-3 py-3 align-top font-semibold text-slate-700 first:rounded-tl-xl last:rounded-tr-xl">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0 odd:bg-white even:bg-slate-50/40">
              {headers.map((_, cellIndex) => <td key={cellIndex} className="px-3 py-2.5 align-top text-slate-700 leading-relaxed">{row[cellIndex] || ''}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const parseStructuredResponse = (text: string): Partial<Record<ResponseSectionName, string>> | null => {
  const sectionPattern = /^\*{0,2}(Headline|Analysis|Recommendation|Supporting data|Disclaimer|Follow-up):\*{0,2}\s*$/gm;
  const matches = [...text.matchAll(sectionPattern)];

  if (matches.length === 0 || matches.some((match, index) => (
    index > 0 && responseSectionNames.indexOf(match[1] as ResponseSectionName) <= responseSectionNames.indexOf(matches[index - 1][1] as ResponseSectionName)
  ))) {
    return null;
  }

  const sections: Partial<Record<ResponseSectionName, string>> = {};
  matches.forEach((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? text.length) : text.length;
    sections[match[1] as ResponseSectionName] = text.slice(start, end).trim();
  });

  return sections;
};

const renderSectionLines = (content: string, ordered: boolean = false) => {
  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean);

  const tableBlock = extractMarkdownTableBlock(lines);
  if (tableBlock) {
    const beforeLines = lines.slice(0, tableBlock.startIndex);
    const afterLines = lines.slice(tableBlock.endIndex);

    return (
      <div className="space-y-3">
        {beforeLines.length > 0 && (
          <div className="whitespace-pre-wrap">
            {beforeLines.map((line, index) => <React.Fragment key={index}>{cleanResponseLine(line)}{index < beforeLines.length - 1 && <br />}</React.Fragment>)}
          </div>
        )}
        {renderMarkdownTable(lines)}
        {afterLines.length > 0 && (
          <div className="whitespace-pre-wrap">
            {afterLines.map((line, index) => <React.Fragment key={index}>{cleanResponseLine(line)}{index < afterLines.length - 1 && <br />}</React.Fragment>)}
          </div>
        )}
      </div>
    );
  }

  const items = lines.filter((line) => ordered ? /^\d+\.\s+/.test(line) : /^[-*]\s+/.test(line));

  if (items.length > 0 && items.length === lines.length) {
    const normalizedItems = items.map((line) => cleanResponseLine(line.replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, '')));
    const ListTag = ordered ? 'ol' : 'ul';
    return (
      <ListTag className={`${ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1`}>
        {normalizedItems.map((item, index) => <li key={index}>{item}</li>)}
      </ListTag>
    );
  }

  return (
    <div className="whitespace-pre-wrap">
      {lines.map((line, index) => <React.Fragment key={index}>{cleanResponseLine(line)}{index < lines.length - 1 && <br />}</React.Fragment>)}
    </div>
  );
};

const renderRecommendation = (content: string) => (
  <div className="whitespace-pre-wrap">
    {content.split('\n').map((line) => cleanResponseLine(line.trim().replace(/^\d+\.\s+/, ''))).filter(Boolean).join('\n')}
  </div>
);

const cleanResponseLine = (line: string) => line
  .replace(/\*\*(.*?)\*\*/g, '$1')
  .replace(/__(.*?)__/g, '$1')
  .replace(/(^|\s)\*([^*\n]+)\*(?=\s|$)/g, '$1$2')
  .replace(/^[-*+]\s+/, '')
  .trim();

const hasSupportingData = (content: string) => (
  hasUsefulSectionContent(content) && !/^Not available\s*-/i.test(content.trim())
);

const hasRecommendation = (content: string) => (
  hasUsefulSectionContent(content) && !/^Not applicable[.!]?$/i.test(content.trim())
);

const hasUsefulSectionContent = (content: string) => (
  content.trim().length > 0 && !/^(Not applicable|Not provided|Not available|Not required|Data unavailable|Data not available)[.!:]?$/i.test(content.trim())
);

const removeUnavailableDataNotice = (text: string) => text
  .replace(/^\s*Data unavailable:\s*.*(?:\n|$)/gim, '')
  .replace(/^\s*No specific data available\..*(?:\n|$)/gim, '')
  .replace(/^\s*No supporting data (?:was )?provided\..*(?:\n|$)/gim, '')
  .replace(/^\s*Not available\s*-.*(?:\n|$)/gim, '');

const removeResponseLabels = (text: string) => text.replace(
  /^\s*\*{0,2}(Headline|Analysis|Recommendation|Supporting data|Disclaimer|Follow-up):\*{0,2}\s*$/gim,
  '',
).split('\n').map(cleanResponseLine).join('\n');

const StructuredAssistantMessage: React.FC<{ text: string }> = ({ text }) => {
  const cleanedText = removeUnavailableDataNotice(text);
  const sections = parseStructuredResponse(cleanedText);
  if (!sections) return <div className="whitespace-pre-wrap text-sm">{removeResponseLabels(cleanedText)}</div>;

  return (
    <div className="space-y-4 text-sm">
      {sections.Headline && hasUsefulSectionContent(sections.Headline) && (
        <section>
          <p className="font-medium text-gray-900">{sections.Headline}</p>
        </section>
      )}
      {sections.Analysis && hasUsefulSectionContent(sections.Analysis) && (
        <section>
          <div>{renderSectionLines(sections.Analysis)}</div>
        </section>
      )}
      {sections.Recommendation && hasRecommendation(sections.Recommendation) && (
        <section>
          <div>{renderRecommendation(sections.Recommendation)}</div>
        </section>
      )}
      {sections['Supporting data'] && hasSupportingData(sections['Supporting data']) && (
        <section>
          <div className="text-gray-700">{renderSectionLines(sections['Supporting data'])}</div>
        </section>
      )}
      {sections['Follow-up'] && hasUsefulSectionContent(sections['Follow-up']) && (
        <section className="border-t border-gray-200 pt-3 text-blue-700">
          <div>{sections['Follow-up']}</div>
        </section>
      )}
    </div>
  );
};

const AIBusinessAnalyst: React.FC = () => {
  const { user } = useAuth();
  const {
    query,
    setQuery,
    isAnalyzing,
    messages,
    runAnalysis,
    // clearConversation available in hook if needed later
    clearConversation: _clearConversation,
  } = useAIBusinessAnalyst();

  const convoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    if (convoRef.current) {
      convoRef.current.scrollTop = convoRef.current.scrollHeight;
    }
  }, [messages]);

  const quickPrompts: Array<{ text: string; type: AnalysisTypeId }> = [
    { text: 'Identify the top three growth opportunities for a township retail business', type: 'MARKET_RESEARCH' },
    { text: 'What are the key things I should understand about running a business?', type: 'REQUIREMENT_ANALYSIS' },
  ];

  const handleAnalyze = () => runAnalysis();
  const storedFirstName = (localStorage.getItem('firstName') || localStorage.getItem('userFirstName') || '').trim();
  const firstName = (user?.fullName || storedFirstName || 'there').split(' ')[0];

  return (
    <div className="min-h-screen relative bg-white">
      <div className="mx-auto max-w-6xl px-6 pt-4">
        <div className="animate-pulse rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
          This is a business insight based on the information you provide, not formal financial, tax, or legal advice. Review any assumptions and verify the output against your business records before acting on it.
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-0">
        <div ref={convoRef} className="max-h-[calc(100vh-320px)] overflow-y-auto pr-48">
          {(!messages || messages.length === 0) && (
            <div className="text-gray-500 text-center mt-48 font-medium">Hello {firstName} — ask me anything about your business. I can help you explore ideas, understand your business, solve problems, and make better decisions. Try a quick suggestion below.</div>
          )}

          <div className="flex flex-col gap-4 mt-6">
            {messages && messages.map((m, i) => (
              <div key={i} className={`max-w-[70%] ${m.role === 'user' ? 'ml-auto bg-blue-50 text-gray-900' : 'mr-auto bg-gray-100 text-gray-900'} p-4 rounded-lg shadow-sm`}>
                {m.role === 'assistant' ? <StructuredAssistantMessage text={m.text} /> : <div className="whitespace-pre-wrap text-sm">{m.text}</div>}
              </div>
            ))}
            {isAnalyzing && (
              <div
                className="mr-auto flex items-center gap-3 rounded-lg bg-gray-100 p-4 text-sm text-gray-600 shadow-sm"
                role="status"
                aria-live="polite"
              >
                <LoaderCircle className="h-4 w-4 animate-spin text-blue-600" aria-hidden="true" />
                <span>Thinking</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input bar pinned to bottom */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center pointer-events-none">
        <div className="max-w-6xl w-full px-6 pointer-events-auto">
          <div className="bg-white border border-gray-200 rounded-full p-3 flex items-center gap-3 shadow-lg">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      runAnalysis();
                    }
                  }}
                  placeholder="Ask anything"
                  className="flex-1 px-4 py-3 rounded-full resize-none h-12 border-none outline-none"
                />
            <button
              onClick={handleAnalyze}
              disabled={!query.trim() || isAnalyzing}
              className="ml-2 h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {quickPrompts.map((p, idx) => (
                <button key={idx} onClick={() => { setQuery(p.text); runAnalysis(p.text, p.type); }} className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                  {p.text}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBusinessAnalyst;
