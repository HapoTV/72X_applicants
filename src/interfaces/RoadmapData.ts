// src/interfaces/RoadmapData.ts

// ==================== ROADMAP ====================
export interface Roadmap {
  roadmapId: string;
  title: string;
  businessType: string;
  industry: string;
  stage: string;
  revenue: string;
  employees: string;
  goals: string[];
  timeline: string;
  phases: RoadmapPhase[];
  isPublic?: boolean;
  isTemplate?: boolean;
  status: 'draft' | 'active' | 'completed' | 'archived';
  progress?: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoadmapPhase {
  phaseId: string;
  title: string;
  description?: string;
  duration: string; // e.g., "0-3 months"
  order: number;
  tasks: RoadmapTask[];
  isCompleted?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface RoadmapTask {
  taskId: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  duration: string; // e.g., "2 weeks"
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  order: number;
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  resources?: RoadmapResource[];
}

export interface RoadmapResource {
  resourceId: string;
  title: string;
  type: 'link' | 'document' | 'video' | 'tool' | 'template';
  url?: string;
  description?: string;
  isRequired?: boolean;
}

// ==================== FORM DATA ====================
export interface RoadmapFormData {
  title: string;
  businessType: string;
  industry: string;
  stage: string;
  revenue: string;
  employees: string;
  goals: string[];
  timeline: string;
  isPublic: boolean;
  isTemplate: boolean;
}

export interface PhaseFormData {
  title: string;
  description: string;
  duration: string;
  order: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  duration: string;
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
  order: number;
}

// ==================== ADMIN/USER ITEMS ====================
export interface AdminRoadmapItem {
  id: string;
  title: string;
  businessType: string;
  industry: string;
  stage: string;
  revenue: string;
  employees: string;
  goals: string[];
  timeline: string;
  phases: RoadmapPhase[];
  isPublic: boolean;
  isTemplate: boolean;
  status: 'draft' | 'active' | 'completed' | 'archived';
  progress?: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRoadmapItem {
  id: string;
  title: string;
  businessType: string;
  industry: string;
  stage: string;
  goals: string[];
  timeline: string;
  phaseCount: number;
  taskCount: number;
  completedTasks: number;
  progress: number;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt?: string;
  lastModified?: string;
}

// ==================== TEMPLATES ====================
export interface RoadmapTemplate {
  templateId: string;
  name: string;
  description: string;
  businessType: string;
  industry?: string;
  stage?: string;
  goals: string[];
  phases: Omit<RoadmapPhase, 'phaseId'>[];
  isPublic: boolean;
  usageCount: number;
  rating?: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateFormData {
  name: string;
  description: string;
  businessType: string;
  industry?: string;
  stage?: string;
  goals: string[];
  isPublic: boolean;
}

// ==================== GENERATION REQUEST ====================
export interface RoadmapGenerationRequest {
  businessType: string;
  industry: string;
  stage: string;
  revenue: string;
  employees: string;
  goals: string[];
  timeline: string;
  createdBy: string;
}

export interface RoadmapGenerationResponse {
  roadmapId: string;
  phases: Omit<RoadmapPhase, 'phaseId'>[];
  estimatedDuration: string;
  complexity: 'Simple' | 'Moderate' | 'Complex';
  recommendations?: string[];
}

// ==================== API RESPONSES ====================
export interface RoadmapApiResponse {
  roadmapId: string;
  title: string;
  businessType: string;
  industry: string;
  stage: string;
  revenue: string;
  employees: string;
  goals: string[];
  timeline: string;
  phases: RoadmapPhase[];
  isPublic: boolean;
  isTemplate: boolean;
  status: 'draft' | 'active' | 'completed' | 'archived';
  progress?: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PhaseApiResponse {
  phaseId: string;
  title: string;
  description?: string;
  duration: string;
  order: number;
  tasks: RoadmapTask[];
  isCompleted?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface TaskApiResponse {
  taskId: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  duration: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  order: number;
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  resources: RoadmapResource[];
}

// ==================== REQUEST PAYLOADS ====================
export interface RoadmapRequest {
  title: string;
  businessType: string;
  industry: string;
  stage: string;
  revenue: string;
  employees: string;
  goals: string[];
  timeline: string;
  phases: Omit<RoadmapPhase, 'phaseId'>[];
  isPublic?: boolean;
  isTemplate?: boolean;
  createdBy: string;
}

export interface PhaseRequest {
  title: string;
  description?: string;
  duration: string;
  order: number;
  tasks: Omit<RoadmapTask, 'taskId'>[];
}

export interface TaskRequest {
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  duration: string;
  order: number;
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
  resources?: Omit<RoadmapResource, 'resourceId'>[];
}

// ==================== ANALYTICS ====================
export interface RoadmapAnalytics {
  totalRoadmaps: number;
  activeRoadmaps: number;
  completedRoadmaps: number;
  averageCompletionTime: number;
  mostCommonGoals: Array<{ goal: string; count: number }>;
  businessTypeDistribution: Array<{ type: string; count: number }>;
  stageDistribution: Array<{ stage: string; count: number }>;
  successRate: number;
}

// ==================== SHARING ====================
export interface RoadmapShare {
  shareId: string;
  roadmapId: string;
  shareToken: string;
  isPublic: boolean;
  allowComments: boolean;
  allowCopy: boolean;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface ShareFormData {
  isPublic: boolean;
  allowComments: boolean;
  allowCopy: boolean;
  expiresAt?: string;
}
