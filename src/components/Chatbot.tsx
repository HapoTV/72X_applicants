import { useEffect, useState, useRef } from "react";

type KBEntry = {
  keywords: string[];
  response: string | string[];
};

const KNOWLEDGE_BASE: Record<string, KBEntry> = {
  executive_summary: {
    keywords: ["executive", "summary", "overview", "what is bizboost"],
    response:
      "SeventyTwoX is a mobile-first, AI-enhanced platform tailored to accelerate the growth of small businesses, especially in South African townships and rural areas. By offering personalized tools, educational resources, and a vibrant community ecosystem, SeventyTwoX empowers local entrepreneurs to scale sustainably in a digital-first economy.",
  },
  problem_statement: {
    keywords: ["problem", "challenge", "issues", "barriers", "pain"],
    response:
      "Many small businesses face limited access to mentorship, language and cultural barriers, low digital adoption, and affordability/connectivity issues.",
  },
  solution: {
    keywords: ["solution", "our solution", "we offer", "what you do"],
    response:
      "SeventyTwoX provides localized content, AI-driven growth roadmaps, gamified learning, and affordable business tools to bridge these gaps.",
  },
  features: {
    keywords: ["features", "tools", "capabilities", "what can it do", "key features"],
    response:
      "Key features include a Growth Roadmap Generator, Performance Dashboard, mobile-first design, localized learning modules, mentorship hub, marketplace, and spreadsheets upload or manual entries for insight generation.",
  },
  growth_roadmap: {
    keywords: ["growth", "roadmap", "generator", "roadmap generator"],
    response:
      "The Growth Roadmap Generator uses AI to produce personalized action plans for entrepreneurs, guiding them step-by-step to improve business performance.",
  },
  performance_dashboard: {
    keywords: ["performance dashboard", "dashboard", "track progress", "metrics"],
    response:
      "The Performance Dashboard visualizes your revenue, customer data, KPIs, and progress, giving you clear insights into your business health.",
  },
  education: {
    keywords: ["education", "learning", "modules", "courses", "training"],
    response:
      "Interactive mobile-optimized learning modules (financial literacy, marketing, compliance), daily tips in multiple languages, and a resource library of videos and case studies.",
  },
  community: {
    keywords: ["community", "forum", "mentorship", "marketplace"],
    response:
      "A community ecosystem with a mentorship hub, forum for discussions, and a marketplace to list and discover local products and services.",
  },
  marketplace: {
    keywords: ["marketplace", "sell", "buy", "products", "services"],
    response:
      "The Marketplace lets you list, promote, and discover local products and services to grow your reach.",
  },
  mentorship: {
    keywords: ["mentorship", "mentorship hub", "mentor", "advice"],
    response:
      "The Mentorship Hub connects you with experienced mentors, peers, and expert groups for guidance and support.",
  },
  forum: {
    keywords: ["forum", "community forum", "discussions", "network"],
    response:
      "The Forum hosts industry-focused discussions, allowing entrepreneurs to share experiences, ask questions, and network.",
  },
  software_solutions: {
    keywords: ["software", "service desk", "inventory", "pos", "toolkit"],
    response:
      "SeventyTwoX offers proprietary tools like Service Desk, Inventory, and POS, plus integrations with third-party business tools to streamline operations.",
  },
  revenue_model: {
    keywords: ["revenue", "pricing", "model", "cost", "subscription"],
    response:
      "Revenue streams include a free tier, premium subscriptions, and paid modules like SeventyTwoX Service Desk, Inventory Portal, and POS system with add-ons for affiliate partnerships.",
  },
  ata_input: {
    keywords: ["data input", "upload data", "spreadsheets", "manual entry"],
    response:
      "The Data Input System allows you to upload spreadsheets or enter data manually, which SeventyTwoX uses to generate insights and recommendations.",
  },
  mobile_first: {
    keywords: ["mobile", "mobile-first", "offline", "low-bandwidth", "app"],
    response:
      "Designed mobile-first with thumb-friendly navigation, responsive components, and plans for offline mode to support low-connectivity environments.",
  },
  localization: {
    keywords: ["localization", "languages", "culture", "zulu", "xhosa", "sesotho"],
    response:
      "Localized experience with support for multiple South African languages, local currency (ZAR), and culturally-appropriate content and visuals.",
  },
  analytics: {
    keywords: ["analytics", "data", "insights", "dashboard", "performance"],
    response:
      "Analytics and data insights track engagement, learning progress, revenue conversion, and community interaction to inform improvements.",
  },
  impact: {
    keywords: ["impact", "goals", "mission", "vision"],
    response:
      "SeventyTwoX aims to digitally empower thousands of entrepreneurs, boost township economies, promote inclusive adoption, and be South Africa’s go-to SME support platform.",
  },
  future_enhancements: {
    keywords: ["future", "roadmap", "enhancements", "next", "plans"],
    response:
      "Planned enhancements include offline-first mode, WhatsApp integration, AI-powered business coaching, expanded payment gateways, and voice navigation for low-literacy users.",
  },
  contact: {
    keywords: ["contact", "support", "email", "help", "get in touch"],
    response: "For support and enquiries: support@bizboosthub.co.za or use the in-app forum and documentation library.",
  },
  default: {
    keywords: [],
    response: [
      "That's an interesting question! For complex queries try asking our OpenAI assistant. Click on this link: https://chat.openai.com/",
    ],
  },
};

const DEFAULT_RESPONSES: string[] = Array.isArray(KNOWLEDGE_BASE.default.response)
  ? KNOWLEDGE_BASE.default.response
  : [String(KNOWLEDGE_BASE.default.response)];

export default function BizBoostChatbot() {
  const [isOpen, setIsOpen] = useState(false);  // <-- changed from true to false
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ from: "user" | "bot"; text: string }[]>(() => {
    try {
      const raw = localStorage.getItem("bizboost_chat_history");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const maxHistoryItems = 10;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Locking is off by default; enable by setting localStorage.lockFeatures = '1'
  const userPackage = localStorage.getItem('userPackage') || 'premium';
  const lockingOn = localStorage.getItem('lockFeatures') === '1';
  const isLocked = lockingOn && userPackage === 'startup';

  useEffect(() => {
    localStorage.setItem("bizboost_chat_history", JSON.stringify(history));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  function addMessage(from: "user" | "bot", text: string) {
    setHistory((h) => {
      const newHist = [...h, { from, text }].slice(-maxHistoryItems);
      return newHist;
    });
  }

  function findResponse(query: string): string {
    const q = query.toLowerCase();

    for (const key of Object.keys(KNOWLEDGE_BASE)) {
      if (key === "default") continue;
      const entry = KNOWLEDGE_BASE[key];
      for (const kw of entry.keywords) {
        const normalizedKw = kw.toLowerCase();
        if (q.includes(normalizedKw) || normalizedKw.includes(q)) {
          return Array.isArray(entry.response) ? entry.response[0] : entry.response;
        }
      }
    }

    const resp = DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
    return resp;
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage("user", trimmed);
    setInput("");

    setTimeout(() => {
      const botResp = findResponse(trimmed);
      addMessage("bot", botResp);
    }, 350);
  }

  function handleQuickAsk(text: string) {
    addMessage("user", text);
    const botResp = findResponse(text);
    addMessage("bot", botResp);
  }

  const quickSuggestions = [
    "Tell me about the Growth Roadmap Generator",
    "What features does SeventyTwoX offer?",
    "How can I contact support?",
  ];

  // If locked, show upgrade message
  if (isLocked) {
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <div className="w-80 md:w-96 shadow-2xl rounded-2xl overflow-hidden bg-white border">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">🔒</div>
              <div>
                <div className="text-sm font-semibold">SeventyTwoX Assistant</div>
                <div className="text-xs opacity-90">Locked - Upgrade Required</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen((s) => !s)}
                className="text-xs bg-white/20 px-2 py-1 rounded-md"
              >
                {isOpen ? "Hide" : "Info"}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Chatbot Assistant</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get instant answers to your business questions with our AI-powered chatbot assistant.
                </p>
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-700 font-medium mb-2">Available with Essential & Premium packages:</p>
                  <ul className="text-xs text-gray-600 text-left space-y-1">
                    <li>✓ 24/7 instant support</li>
                    <li>✓ Business guidance and tips</li>
                    <li>✓ Quick answers to common questions</li>
                    <li>✓ Platform navigation help</li>
                  </ul>
                </div>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                  Upgrade to Essential
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="w-80 md:w-96 shadow-2xl rounded-2xl overflow-hidden bg-white border">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-600 to-sky-500 text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">72X</div>
            <div>
              <div className="text-sm font-semibold">SeventyTwoX Assistant</div>
              <div className="text-xs opacity-90">Ask about 72X</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen((s) => !s)}
              className="text-xs bg-white/20 px-2 py-1 rounded-md"
            >
              {isOpen ? "Hide" : "Open"}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {history.length === 0 && (
                <div className="text-xs text-gray-500">Hi — ask me anything about SeventyTwoX. Try quick suggestions below.</div>
              )}

              {history.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                      m.from === "user" ? "bg-indigo-100 text-slate-800" : "bg-gray-100 text-slate-800"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t bg-gray-50">
              <div className="flex gap-2 mb-2 flex-wrap">
                {quickSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleQuickAsk(s)}
                    className="text-xs bg-white border px-2 py-1 rounded-md shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder="Ask about SeventyTwoX (e.g. features, roadmap)..."
                  className="flex-1 px-3 py-2 rounded-md border focus:outline-none text-sm"
                />
                <button
                  onClick={handleSend}
                  className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
