// src/services/QuizService.ts

export interface QuizQuestion {
  id: string;
  type?: 'multiple_choice' | 'match_pairs' | 'order_steps' | 'categorize' | 'fill_blank';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;

  pairs?: { term: string; definition: string }[];

  steps?: string[];

  categories?: string[];
  items?: { label: string; category: string }[];

  template?: string;
  wordBank?: string[];
  correctWord?: string;
}

class QuizService {
  private static readonly MAX_QUESTIONS = 20;

  private static normalizeCategory(category: string): string {
    const normalized = (category || '')
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, '-');

    if (normalized === 'business-planning' || normalized === 'businessplanning') return 'business-plan';

    return normalized;
  }

  /**
   * Generate quiz questions based on learning material content
   */
  static generateQuizQuestions(moduleTitle: string, moduleDescription: string, category: string): QuizQuestion[] {
    const content = [moduleTitle, moduleDescription].filter(Boolean).join('\n');
    const targetCount = this.computeTargetQuestionCount(content);

    // Base questions with category-specific logic
    const baseQuestions: QuizQuestion[] = [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: `What is the main purpose of ${this.extractMainTopic(moduleTitle)}?`,
        options: [
          'To understand key concepts',
          'To memorize information',
          'To apply skills practically',
          'To complete requirements'
        ],
        correctAnswer: 0,
        explanation: 'The main purpose of learning materials is to understand key concepts that can be applied in real scenarios.'
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: `Which of the following best describes your understanding of ${this.extractMainTopic(moduleTitle)}?`,
        options: [
          'I need more practice',
          'I understand the basics',
          'I feel confident applying this',
          'I could teach others'
        ],
        correctAnswer: 2,
        explanation: 'Self-assessment helps identify areas for improvement and builds confidence.'
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        question: `How would you rate the difficulty level of this ${this.extractMainTopic(moduleTitle)} material?`,
        options: [
          'Very Easy',
          'Easy', 
          'Just Right',
          'Challenging but manageable'
        ],
        correctAnswer: 3,
        explanation: 'Understanding difficulty helps set realistic learning expectations and goals.'
      }
    ];

    // Add category-specific questions
    const categoryQuestions = this.getCategorySpecificQuestions(category, moduleTitle);

    // Add content-derived questions (deterministic, based on terms present in the material)
    const contentQuestions = this.generateContentBasedQuestions(content);

    const all = [...baseQuestions, ...categoryQuestions, ...contentQuestions];
    const deduped = this.dedupeByQuestionText(all);
    return deduped.slice(0, Math.min(targetCount, this.MAX_QUESTIONS));
  }

  private static computeTargetQuestionCount(content: string): number {
    const wordCount = this.countWords(content);

    // Balanced defaults: not too short, not too long
    if (wordCount < 80) return 8;
    if (wordCount < 180) return 10;
    if (wordCount < 350) return 12;
    if (wordCount < 600) return 15;
    return 20;
  }

  private static countWords(text: string): number {
    return (text || '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean).length;
  }

  private static dedupeByQuestionText(questions: QuizQuestion[]): QuizQuestion[] {
    const seen = new Set<string>();
    const out: QuizQuestion[] = [];
    for (const q of questions) {
      const key = (q.question || '').trim().toLowerCase();
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(q);
    }
    return out;
  }

  private static generateContentBasedQuestions(content: string): QuizQuestion[] {
    const keywords = this.extractKeywords(content);
    if (keywords.length === 0) return [];

    const questions: QuizQuestion[] = [];
    const distractorPool = [...keywords];

    // A few "mentioned term" MCQs
    const mcqCount = Math.min(8, keywords.length);
    for (let i = 0; i < mcqCount; i++) {
      const correct = keywords[i];
      const options = this.buildOptions(correct, distractorPool, 4);
      questions.push({
        id: `c_mcq_${i + 1}`,
        type: 'multiple_choice',
        question: 'Which term is mentioned in this learning material?',
        options,
        correctAnswer: options.indexOf(correct),
        explanation: 'This question checks whether you noticed key terms and concepts from the material.'
      });
    }

    // A few fill-in-the-blank questions based on real sentences
    const sentences = this.extractSentences(content);
    const fillCount = Math.min(5, keywords.length);
    for (let i = 0; i < fillCount; i++) {
      const kw = keywords[i];
      const sentence = sentences.find((s) => new RegExp(`\\b${this.escapeRegExp(kw)}\\b`, 'i').test(s));
      if (!sentence) continue;
      const template = sentence.replace(new RegExp(`\\b${this.escapeRegExp(kw)}\\b`, 'i'), '____');
      const wordBank = this.buildOptions(kw, distractorPool, 4);
      questions.push({
        id: `c_fill_${i + 1}`,
        type: 'fill_blank',
        question: 'Fill in the blank using the word bank.',
        options: [],
        correctAnswer: 0,
        template,
        wordBank,
        correctWord: kw,
        explanation: 'This question checks recall of a key term in context.'
      });
    }

    return questions;
  }

  private static extractKeywords(content: string): string[] {
    const stop = new Set([
      'the','and','or','to','of','in','a','an','for','on','with','as','at','by','from','is','are','was','were','be','been','being',
      'this','that','these','those','it','its','their','your','you','we','our','they','them','i','me','my',
      'can','could','should','would','will','may','might','must','not','no','yes','do','does','did','done',
      'learn','learning','module','material','video','pdf','document','lesson','lessons'
    ]);

    const words = (content || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .filter((w) => w.length >= 4)
      .filter((w) => !stop.has(w));

    const freq = new Map<string, number>();
    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([w]) => w)
      .slice(0, 20);
  }

  private static extractSentences(content: string): string[] {
    const normalized = (content || '').replace(/\s+/g, ' ').trim();
    if (!normalized) return [];
    return normalized
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 40)
      .slice(0, 50);
  }

  private static escapeRegExp(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private static buildOptions(correct: string, pool: string[], count: number): string[] {
    const unique = Array.from(new Set(pool.filter(Boolean)));
    const others = unique.filter((w) => w !== correct);
    const options = [correct];
    while (options.length < count && others.length > 0) {
      const idx = Math.floor(Math.random() * others.length);
      options.push(others.splice(idx, 1)[0]);
    }
    // Fallback distractors (stable)
    while (options.length < count) options.push('none of the above');

    // Shuffle
    return options
      .map((o) => ({ o, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ o }) => o);
  }

  /**
   * Extract main topic from module title
   */
  private static extractMainTopic(title: string): string {
    // Remove common prefixes and get the core topic
    const topic = title
      .replace(/^(Understanding|Mastering|Introduction to|Guide to|Complete|Advanced)\s+/i, '')
      .replace(/\s+(for|in|of)\s+.*$/i, '')
      .trim();
    
    return topic || 'the material';
  }

  /**
   * Get category-specific quiz questions
   */
  private static getCategorySpecificQuestions(category: string, moduleTitle: string): QuizQuestion[] {
    const topic = this.extractMainTopic(moduleTitle);

    const normalizedCategory = this.normalizeCategory(category);
    switch (normalizedCategory) {
      case 'business-plan':
        return [
          {
            id: 'cat1',
            type: 'multiple_choice',
            question: `What's the most important takeaway from this ${topic} module for business planning?`,
            options: [
              'Strategic thinking skills',
              'Financial planning basics',
              'Market analysis techniques',
              'Operational efficiency tips'
            ],
            correctAnswer: 0,
            explanation: 'Business planning requires strategic thinking to create sustainable competitive advantages.'
          },
          {
            id: 'cat2',
            type: 'match_pairs',
            question: 'Match the business planning term to its definition.',
            options: [],
            correctAnswer: 0,
            pairs: [
              { term: 'Value Proposition', definition: 'The unique value you offer customers' },
              { term: 'Target Market', definition: 'The specific group you serve' },
              { term: 'Revenue Stream', definition: 'How the business earns money' }
            ],
            explanation: 'These concepts form the foundation of a clear and actionable business plan.'
          },
          {
            id: 'cat3',
            type: 'order_steps',
            question: 'Put the steps in order for building a basic business plan outline.',
            options: [],
            correctAnswer: 0,
            steps: ['Define goals', 'Research the market', 'Draft the plan', 'Validate assumptions'],
            explanation: 'A good flow is goals → research → draft → validate.'
          },
          {
            id: 'cat4',
            type: 'categorize',
            question: 'Categorize the items into the correct business plan section.',
            options: [],
            correctAnswer: 0,
            categories: ['Market', 'Finance'],
            items: [
              { label: 'Customer personas', category: 'Market' },
              { label: 'Competitor analysis', category: 'Market' },
              { label: 'Cash flow forecast', category: 'Finance' },
              { label: 'Break-even point', category: 'Finance' }
            ],
            explanation: 'Market items describe demand and competition; Finance items describe money and sustainability.'
          },
          {
            id: 'cat5',
            type: 'fill_blank',
            question: 'Fill in the blank using the word bank.',
            options: [],
            correctAnswer: 0,
            template: 'A business plan should include clear ____ and measurable milestones.',
            wordBank: ['objectives', 'advertising', 'discounts', 'headcount'],
            correctWord: 'objectives',
            explanation: 'Objectives and milestones help align execution with strategy.'
          }
        ];
      
      case 'marketing':
        return [
          {
            id: 'cat1',
            type: 'multiple_choice',
            question: `Which marketing principle from the ${topic} module will you apply first?`,
            options: [
              'Customer segmentation',
              'Content strategy',
              'Performance analytics',
              'Brand positioning'
            ],
            correctAnswer: 1,
            explanation: 'Content strategy is foundational - great content enables effective marketing across all channels.'
          }
        ];
      
      case 'finance':
        return [
          {
            id: 'cat1',
            type: 'multiple_choice',
            question: `What financial concept from ${topic} is most valuable for your role?`,
            options: [
              'Budget management',
              'Investment strategies',
              'Risk assessment',
              'Financial reporting'
            ],
            correctAnswer: 0,
            explanation: 'Budget management is the foundation of financial control and business sustainability.'
          }
        ];
      
      case 'operations':
        return [
          {
            id: 'cat1',
            type: 'multiple_choice',
            question: `Which operational efficiency tip from ${topic} will you implement?`,
            options: [
              'Process automation',
              'Quality control systems',
              'Team workflow optimization',
              'Resource allocation'
            ],
            correctAnswer: 2,
            explanation: 'Team workflow optimization creates immediate efficiency gains and improves collaboration.'
          }
        ];
      
      case 'leadership':
        return [
          {
            id: 'cat1',
            type: 'multiple_choice',
            question: `What leadership skill from ${topic} resonates most with your style?`,
            options: [
              'Communication',
              'Decision making',
              'Team motivation',
              'Strategic planning'
            ],
            correctAnswer: 3,
            explanation: 'Strategic planning combines all leadership skills and drives long-term success.'
          }
        ];
      
      default:
        return [
          {
            id: 'cat1',
            type: 'multiple_choice',
            question: `How will you use what you learned about ${topic}?`,
            options: [
              'In my current role',
              'For personal development',
              'To help my team',
              'In future projects'
            ],
            correctAnswer: 0,
            explanation: 'Applying learning in your current role creates immediate value and reinforces knowledge.'
          }
        ];
    }
  }

  /**
   * Calculate quiz score percentage
   */
  static calculateScorePercentage(score: number, totalQuestions: number): number {
    return Math.round((score / totalQuestions) * 100);
  }

  /**
   * Get performance message based on score
   */
  static getPerformanceMessage(score: number, totalQuestions: number): string {
    const percentage = this.calculateScorePercentage(score, totalQuestions);
    
    if (percentage >= 90) {
      return "Outstanding! You've mastered this material! 🏆";
    } else if (percentage >= 80) {
      return "Excellent! You have a strong understanding! ⭐";
    } else if (percentage >= 70) {
      return "Good job! You grasped the key concepts! 👍";
    } else if (percentage >= 60) {
      return "Nice effort! Review the material again to improve! 📚";
    } else {
      return "Keep learning! Review the material and try again! 💪";
    }
  }
}

export default QuizService;
