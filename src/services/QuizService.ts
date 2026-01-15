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
  static generateQuizQuestions(moduleTitle: string, _moduleDescription: string, category: string): QuizQuestion[] {
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
    
    return [...baseQuestions, ...categoryQuestions];
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
