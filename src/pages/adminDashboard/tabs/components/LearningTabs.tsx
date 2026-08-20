import React from 'react';

type LearningSection = 'business-plan' | 'marketing' | 'finance' | 'operations' | 'leadership' | 'technical';

interface LearningTabsProps {
    sections: Record<LearningSection, string>;
    activeSection: LearningSection;
    onSectionChange: (section: LearningSection) => void;
    itemCounts: Record<LearningSection, number>;
}

export const LearningTabs: React.FC<LearningTabsProps> = ({
    sections,
    activeSection,
    onSectionChange,
    itemCounts
}) => {
    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex flex-wrap gap-2">
                {(Object.keys(sections) as LearningSection[]).map(section => (
                    <button 
                        key={section}
                        onClick={() => onSectionChange(section)}
                        className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeSection === section 
                                ? 'border-primary-600 text-primary-700' 
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        {sections[section]}
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            {itemCounts[section]}
                        </span>
                    </button>
                ))}
            </nav>
        </div>
    );
};