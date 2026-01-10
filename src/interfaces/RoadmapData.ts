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
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  progress?: number;
  createdBy: UserSimpleDTO;
  createdAt?: string;
  updatedAt?: string;
}

// Add UserSimpleDTO interface
export interface UserSimpleDTO {
  userId: string;
  fullName: string;
  email: string;
  businessReference?: string;
  profileImageUrl?: string;
}

export interface RoadmapPhase {
  phaseId: string;
  title: string;
  description?: string;
  duration: string;
  phaseOrder: number;  // Changed from 'order' to match backend
  tasks: RoadmapTask[];
  isCompleted?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoadmapTask {
  taskId: string;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  duration: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  taskOrder: number;  // Changed from 'order' to match backend
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  resources: RoadmapResource[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoadmapResource {
  resourceId: string;
  title: string;
  type: 'LINK' | 'DOCUMENT' | 'VIDEO' | 'TOOL' | 'TEMPLATE';
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

// ==================== USER ROADMAP ITEM (for list views) ====================
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
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt?: string;
  lastModified?: string;
}

// ==================== GENERATION ====================
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