/**
 * Utility to parse, decode, and paraphrase student submission notes and embedded quiz/assignment data.
 * Replaces unreadable raw JSON strings (like `[JAWABAN_JSON:%5B...]`) with human-readable structured info.
 */

export interface ParsedQuizAnswer {
  id?: string;
  submission_id?: string;
  question_id?: string;
  selected_option_id?: string | null;
  answer_text?: string | null;
  score?: number | null;
}

export interface ParsedSubmissionData {
  cleanNotes: string;
  figmaUrl: string | null;
  otherUrls: string[];
  hasQuizAnswers: boolean;
  totalAnswers: number;
  totalScoreCalculated: number | null;
  answers: ParsedQuizAnswer[];
  summaryBadge: string;
}

export function parseSubmissionNotes(rawNotes?: string | null): ParsedSubmissionData {
  if (!rawNotes || typeof rawNotes !== 'string') {
    return {
      cleanNotes: '',
      figmaUrl: null,
      otherUrls: [],
      hasQuizAnswers: false,
      totalAnswers: 0,
      totalScoreCalculated: null,
      answers: [],
      summaryBadge: 'Tugas Terkumpul',
    };
  }

  let text = rawNotes;
  let parsedAnswers: ParsedQuizAnswer[] = [];
  let hasQuiz = false;
  let calcScore: number | null = null;

  // 1. Extract and decode [JAWABAN_JSON:...]
  const jsonMatch = text.match(/\[JAWABAN_JSON:([^\]]+)\]/i);
  if (jsonMatch) {
    try {
      const decoded = decodeURIComponent(jsonMatch[1]);
      const json = JSON.parse(decoded);
      if (Array.isArray(json)) {
        parsedAnswers = json;
        hasQuiz = true;

        // Calculate score sum if scores are embedded
        let scoreSum = 0;
        let hasScoredItem = false;
        parsedAnswers.forEach((ans) => {
          if (ans.score !== null && ans.score !== undefined) {
            scoreSum += Number(ans.score) || 0;
            hasScoredItem = true;
          }
        });
        if (hasScoredItem) calcScore = scoreSum;
      }
    } catch {
      // Fallback if decoding or JSON parse fails
    }

    // Strip out the [JAWABAN_JSON:...] block from visible text
    text = text.replace(jsonMatch[0], '').trim();
  }

  // 2. Extract Figma link
  let figmaUrl: string | null = null;
  const figmaMatch = text.match(/https?:\/\/(?:www\.)?figma\.com\/[^\s]+/i);
  if (figmaMatch) {
    figmaUrl = figmaMatch[0];
    text = text.replace(figmaUrl, '').trim();
  }

  // 3. Extract other URLs
  const otherUrls: string[] = [];
  const urlMatches = text.match(/https?:\/\/[^\s]+/g);
  if (urlMatches) {
    urlMatches.forEach((url) => {
      otherUrls.push(url);
      text = text.replace(url, '').trim();
    });
  }

  // 4. Clean remaining notes
  const cleanNotes = text.trim();

  // 5. Generate human-readable summary badge
  let summaryBadge = 'Tugas Terkumpul';
  if (hasQuiz && figmaUrl) {
    summaryBadge = `${parsedAnswers.length} Jawaban Kuis & Proyek Figma`;
  } else if (hasQuiz) {
    summaryBadge = `${parsedAnswers.length} Jawaban Kuis Tersimpan`;
  } else if (figmaUrl) {
    summaryBadge = 'Lampiran Desain Figma';
  } else if (cleanNotes) {
    summaryBadge = 'Catatan Siswa';
  }

  return {
    cleanNotes,
    figmaUrl,
    otherUrls,
    hasQuizAnswers: hasQuiz,
    totalAnswers: parsedAnswers.length,
    totalScoreCalculated: calcScore,
    answers: parsedAnswers,
    summaryBadge,
  };
}
