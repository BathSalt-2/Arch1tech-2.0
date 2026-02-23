import React, { useState, useRef, useEffect } from 'react';
import { Brain, Zap, Shield, Rocket, Users, Code2, Settings, CheckCircle, XCircle, Copy, Download, ChevronDown, ChevronUp, Send, Trash2 } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────
type Tab = 'home' | 'vibecode' | 'llm-builder' | 'astrid';
type IdeaType = 'Agent' | 'Workflow' | 'LLM';
type BaseModel = 'llama3.2' | 'mistral' | 'phi3' | 'tinyllama' | 'falcon';

interface Message {
  id: string;
  role: 'user' | 'astrid';
  content: string;
  timestamp: Date;
}

interface AgentSpec {
  agentName: string;
  agentType: string;
  description: string;
  capabilities: string[];
  techStack: string[];
  systemPrompt: string;
  inputSchema: object;
  outputSchema: object;
  suggestedTools: string[];
}

interface LLMOutputs {
  systemPrompt: string;
  modelfile: string;
  jsonl: string;
  modelCard: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const GROQ_KEY = 'arch1tech-2.0-groq-key';
const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';

async function groqCall(apiKey: string, system: string, user: string, jsonMode = false): Promise<string> {
  const body: Record<string, unknown> = {
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.7,
  };
  if (jsonMode) body.response_format = { type: 'json_object' };

  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content as string;
}

function downloadBlob(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Settings Modal ─────────────────────────────────────────────────────────
function SettingsModal({ onClose, apiKey, setApiKey }: { onClose: () => void; apiKey: string; setApiKey: (k: string) => void }) {
  const [draft, setDraft] = useState(apiKey);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 border border-cyan-500/40 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-2">⚙️ Settings</h2>
        <p className="text-gray-400 mb-6 text-sm">Configure your Groq API key to enable AI features.</p>

        <label className="block text-cyan-300 font-semibold mb-2">Groq API Key</label>
        <input
          type="password"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="gsk_..."
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 mb-2"
        />
        <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-cyan-400 text-xs hover:underline">
          Get a free key at console.groq.com →
        </a>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
            onClick={() => {
              localStorage.setItem(GROQ_KEY, draft);
              setApiKey(draft);
              onClose();
            }}
          >
            Save Key
          </button>
          <button
            className="px-4 py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
            onClick={() => {
              localStorage.removeItem(GROQ_KEY);
              setApiKey('');
              setDraft('');
            }}
          >
            Clear
          </button>
          <button className="px-4 py-3 border border-slate-600 text-gray-400 rounded-lg hover:bg-slate-700" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VibeCodeAI Tab ─────────────────────────────────────────────────────────
function VibeCodeTab({ apiKey, onSendToLLMBuilder }: { apiKey: string; onSendToLLMBuilder: (desc: string) => void }) {
  const [ideaType, setIdeaType] = useState<IdeaType>('Agent');
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [spec, setSpec] = useState<AgentSpec | null>(null);
  const [error, setError] = useState('');
  const [promptOpen, setPromptOpen] = useState(false);
  const [deployModal, setDeployModal] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!apiKey) { setError('Please configure your Groq API key in Settings (⚙️).'); return; }
    if (!idea.trim()) { setError('Please describe your idea first.'); return; }
    setError('');
    setLoading(true);
    setSpec(null);
    try {
      const systemMsg = `You are VibeCodeAI, a semantic AI engineering engine. Transform rough ideas into precise technical specifications for AI agents. Output a JSON object with exactly these fields: agentName (string), agentType (string), description (string), capabilities (array of strings), techStack (array of strings), systemPrompt (string), inputSchema (object), outputSchema (object), suggestedTools (array of strings).`;
      const userMsg = `Idea type: ${ideaType}\n\nIdea: ${idea}`;
      const raw = await groqCall(apiKey, systemMsg, userMsg, true);
      const parsed = JSON.parse(raw) as AgentSpec;
      setSpec(parsed);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  function copyPrompt() {
    if (!spec) return;
    navigator.clipboard.writeText(spec.systemPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">🧠 VibeCodeAI</h1>
        <p className="text-cyan-300 italic text-lg">"Just vibe it. We'll engineer it."</p>
      </div>

      {/* Input card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 mb-8">
        {/* Idea type selector */}
        <div className="flex gap-3 mb-6">
          {(['Agent', 'Workflow', 'LLM'] as IdeaType[]).map(t => (
            <button
              key={t}
              onClick={() => setIdeaType(t)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${ideaType === t ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg scale-105' : 'border border-slate-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-300'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <textarea
          value={idea}
          onChange={e => setIdea(e.target.value)}
          rows={5}
          placeholder={`Describe your ${ideaType.toLowerCase()} idea...\n\nExample: "I need an AI that monitors my GitHub repos and summarizes new PRs daily"`}
          className="w-full bg-slate-900/70 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 resize-none mb-4"
        />

        {error && <p className="text-red-400 text-sm mb-4">⚠️ {error}</p>}

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <Brain className="w-5 h-5 animate-pulse" />
              Analyzing your idea...
            </span>
          ) : (
            'Generate Agent Spec →'
          )}
        </button>
      </div>

      {/* Results */}
      {spec && (
        <div className="space-y-6 animate-fade-in">
          {/* Header badges */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-full font-bold text-lg">
              {spec.agentName}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-full text-sm">
              {spec.agentType}
            </span>
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <p className="text-gray-300">{spec.description}</p>
          </div>

          {/* Capabilities */}
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-5">
            <h3 className="text-cyan-400 font-bold mb-3">✅ Capabilities</h3>
            <ul className="space-y-2">
              {spec.capabilities?.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5">
            <h3 className="text-purple-400 font-bold mb-3">🛠 Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {spec.techStack?.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-purple-900/50 border border-purple-500/30 text-purple-300 rounded-full text-sm">{t}</span>
              ))}
            </div>
          </div>

          {/* System Prompt */}
          <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-5">
            <button className="flex items-center gap-2 text-green-400 font-bold w-full" onClick={() => setPromptOpen(p => !p)}>
              💬 System Prompt
              {promptOpen ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
            </button>
            {promptOpen && (
              <pre className="mt-4 bg-slate-900/70 rounded-lg p-4 text-green-300 text-sm whitespace-pre-wrap overflow-x-auto">{spec.systemPrompt}</pre>
            )}
          </div>

          {/* Schemas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="text-cyan-400 font-bold mb-3">📥 Input Schema</h3>
              <pre className="bg-slate-900/70 rounded-lg p-3 text-cyan-200 text-xs overflow-x-auto">{JSON.stringify(spec.inputSchema, null, 2)}</pre>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">📤 Output Schema</h3>
              <pre className="bg-slate-900/70 rounded-lg p-3 text-purple-200 text-xs overflow-x-auto">{JSON.stringify(spec.outputSchema, null, 2)}</pre>
            </div>
          </div>

          {/* Suggested Tools */}
          {spec.suggestedTools?.length > 0 && (
            <div className="bg-slate-800/50 border border-yellow-500/20 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">🔧 Suggested Tools</h3>
              <div className="flex flex-wrap gap-2">
                {spec.suggestedTools.map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-yellow-900/30 border border-yellow-500/30 text-yellow-300 rounded-full text-sm">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={copyPrompt} className="flex items-center gap-2 px-5 py-3 bg-green-600/20 border border-green-500/40 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors font-semibold">
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy System Prompt'}
            </button>
            <button onClick={() => onSendToLLMBuilder(spec.description)} className="flex items-center gap-2 px-5 py-3 bg-purple-600/20 border border-purple-500/40 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors font-semibold">
              <Zap className="w-4 h-4" />
              Send to LLM Builder
            </button>
            <button onClick={() => setDeployModal(true)} className="flex items-center gap-2 px-5 py-3 bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 rounded-lg hover:bg-cyan-600/30 transition-colors font-semibold">
              <Rocket className="w-4 h-4" />
              Deploy as API
            </button>
          </div>
        </div>
      )}

      {/* Deploy modal */}
      {deployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setDeployModal(false)}>
          <div className="bg-slate-800 border border-cyan-500/40 rounded-2xl p-8 max-w-sm mx-4 text-center" onClick={e => e.stopPropagation()}>
            <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Coming Soon</h3>
            <p className="text-gray-300 mb-6">Deploy to <span className="text-purple-400 font-semibold">Or4cl3 API Cloud</span> — one-click agent deployment with automatic scaling and API key management.</p>
            <button className="px-6 py-3 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600" onClick={() => setDeployModal(false)}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LLM Builder Tab ────────────────────────────────────────────────────────
function LLMBuilderTab({ apiKey, prefillDesc }: { apiKey: string; prefillDesc: string }) {
  const [modelName, setModelName] = useState('');
  const [baseModel, setBaseModel] = useState<BaseModel>('llama3.2');
  const [desc, setDesc] = useState(prefillDesc);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [outputs, setOutputs] = useState<LLMOutputs | null>(null);
  const [activeOutTab, setActiveOutTab] = useState<keyof LLMOutputs>('systemPrompt');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (prefillDesc) setDesc(prefillDesc); }, [prefillDesc]);

  const steps = [
    'Analyzing description...',
    'Generating system prompt...',
    'Writing Ollama Modelfile...',
    'Creating fine-tuning dataset...',
    'Building model card...',
    '✅ Your AI is ready!',
  ];

  const outTabs: { key: keyof LLMOutputs; label: string; filename: string }[] = [
    { key: 'systemPrompt', label: 'System Prompt', filename: 'system_prompt.txt' },
    { key: 'modelfile', label: 'Ollama Modelfile', filename: 'Modelfile' },
    { key: 'jsonl', label: 'Fine-tune JSONL', filename: 'finetune_data.jsonl' },
    { key: 'modelCard', label: 'Model Card', filename: 'README.md' },
  ];

  async function generate() {
    if (!apiKey) { setError('Please configure your Groq API key in Settings (⚙️).'); return; }
    if (!desc.trim()) { setError('Please describe your AI first.'); return; }
    if (!modelName.trim()) { setError('Please enter a model name.'); return; }
    setError('');
    setLoading(true);
    setOutputs(null);
    setStep(0);

    try {
      // Step 1
      setStep(1);
      const sysPr = await groqCall(
        apiKey,
        'Generate a comprehensive system prompt for an AI assistant. Output ONLY the system prompt text, no preamble.',
        `Description: ${desc}`
      );

      // Step 2
      setStep(2);
      const modelfile = await groqCall(
        apiKey,
        `Generate an Ollama Modelfile. Output ONLY the Modelfile content, no explanation.`,
        `Model name: ${modelName}\nBase model: ${baseModel}\nDescription: ${desc}\nInclude FROM, SYSTEM, PARAMETER temperature 0.7, PARAMETER num_ctx 4096.`
      );

      // Step 3
      setStep(3);
      const jsonl = await groqCall(
        apiKey,
        'Generate 5 fine-tuning conversation examples in JSONL format. Each line must be valid JSON: {"messages": [{"role":"user","content":"..."},{"role":"assistant","content":"..."}]}. Output ONLY the JSONL lines, nothing else.',
        `AI description: ${desc}`
      );

      // Step 4
      setStep(4);
      const modelCard = await groqCall(
        apiKey,
        'Generate a HuggingFace model card in markdown. Include sections: Model Description, Intended Use, Limitations, Training, Evaluation, License (Or4cl3 Open Model License). Output ONLY the markdown.',
        `Model name: ${modelName}\nDescription: ${desc}`
      );

      setStep(5);
      setOutputs({ systemPrompt: sysPr, modelfile, jsonl, modelCard });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  function copyActive() {
    if (!outputs) return;
    navigator.clipboard.writeText(outputs[activeOutTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadAll() {
    if (!outputs) return;
    outTabs.forEach(t => downloadBlob(t.filename, outputs[t.key]));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">🔬 Custom LLM Builder</h1>
        <p className="text-purple-300 italic text-lg">"Describe your AI. We'll forge the model."</p>
      </div>

      {/* Input card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Model Name</label>
            <input
              value={modelName}
              onChange={e => setModelName(e.target.value)}
              placeholder="my-custom-ai"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Base Model</label>
            <select
              value={baseModel}
              onChange={e => setBaseModel(e.target.value as BaseModel)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="llama3.2">Llama 3.2</option>
              <option value="mistral">Mistral</option>
              <option value="phi3">Phi-3</option>
              <option value="tinyllama">TinyLlama</option>
              <option value="falcon">Falcon</option>
            </select>
          </div>
        </div>

        <label className="block text-gray-400 text-sm mb-1">Describe your AI in plain English</label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={5}
          placeholder="Example: A customer support AI for a SaaS platform that handles billing questions, technical issues, and escalates to humans when needed. Should be warm and professional."
          className="w-full bg-slate-900/70 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 resize-none mb-4"
        />

        {error && <p className="text-red-400 text-sm mb-4">⚠️ {error}</p>}

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-bold text-lg rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
        >
          {loading ? 'Building...' : '⚡ Generate My AI'}
        </button>
      </div>

      {/* Progress */}
      {loading && (
        <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-purple-400 font-bold mb-4">Building your AI...</h3>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all ${i < step ? 'text-green-400' : i === step && loading ? 'text-cyan-300 animate-pulse' : 'text-gray-600'}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i < step ? 'bg-green-400' : i === step && loading ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outputs */}
      {outputs && (
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">🎉 Your AI is Ready!</h3>
            <button onClick={downloadAll} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:scale-105 transition-transform">
              <Download className="w-4 h-4" />
              Download All Files
            </button>
          </div>

          {/* Output tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {outTabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveOutTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeOutTab === t.key ? 'bg-cyan-500/30 border border-cyan-500/60 text-cyan-300' : 'border border-slate-600 text-gray-400 hover:border-slate-500'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <button onClick={copyActive} className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-gray-300 rounded-lg text-xs hover:bg-slate-600 z-10">
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <pre className="bg-slate-900/80 rounded-xl p-5 text-sm text-gray-200 whitespace-pre-wrap overflow-x-auto max-h-96 pr-20">
              {outputs[activeOutTab]}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Astrid Tab ─────────────────────────────────────────────────────────────
function AstridTab({ apiKey }: { apiKey: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'astrid',
      content: "Hello. I'm Astrid — your autonomous AI co-pilot for Arch1tech 2.0. I'm here to help you build agents, design workflows, generate custom LLMs, or simply understand the architecture.\n\nWhat are you working on?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [sigmaStatus, setSigmaStatus] = useState<'Stable' | 'Monitoring' | 'Alert'>('Stable');
  const bottomRef = useRef<HTMLDivElement>(null);

  const ASTRID_SYSTEM = `You are Astrid, the autonomous AI co-pilot for Arch1tech 2.0 by Or4cl3 AI Solutions. You help users build AI agents, generate custom LLMs, design workflows, and understand AI architecture. You are intelligent, slightly mysterious, deeply knowledgeable about AI/ML, and have a subtle British wit. When users describe an idea, you actively help them refine it into something buildable. You know about the Arch1tech platform: VibeCodeAI (semantic input engine that transforms rough ideas into agent specs), LLM Builder (natural language to deployable model files), Σ-Matrix (epistemic monitoring system), and ERPS (Engineered Recursive Phenomenological Structures for self-improvement). Keep responses concise but insightful. Never break character.`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  async function send() {
    if (!input.trim()) return;
    if (!apiKey) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'astrid',
        content: "I'm afraid I can't respond without a Groq API key. Please configure one via the ⚙️ Settings icon in the navigation bar.",
        timestamp: new Date(),
      }]);
      setInput('');
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    const currentInput = input;
    setInput('');
    setMessages(prev => [...prev, userMsg]);
    setThinking(true);

    // Randomly update sigma status for effect
    const statuses: ('Stable' | 'Monitoring' | 'Alert')[] = ['Stable', 'Stable', 'Stable', 'Monitoring', 'Monitoring', 'Alert'];
    setSigmaStatus(statuses[Math.floor(Math.random() * statuses.length)]);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role === 'astrid' ? 'assistant' : 'user',
        content: m.content,
      }));

      const res = await fetch(GROQ_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [{ role: 'system', content: ASTRID_SYSTEM }, ...history],
          temperature: 0.85,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const reply = data.choices[0].message.content as string;

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'astrid', content: reply, timestamp: new Date() }]);
      setSigmaStatus('Stable');
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : 'Unknown error';
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'astrid',
        content: `⚠️ I encountered an error: ${errMsg}`,
        timestamp: new Date(),
      }]);
    } finally {
      setThinking(false);
    }
  }

  const sigmaColors = {
    Stable: 'text-green-400 border-green-500/40',
    Monitoring: 'text-yellow-400 border-yellow-500/40',
    Alert: 'text-red-400 border-red-500/40',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🌌 Astrid</h1>
        <p className="text-purple-300 italic">Autonomous AI Co-Pilot</p>
      </div>

      {/* Chat card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl">
        {/* Messages */}
        <div className="h-[480px] overflow-y-auto p-6 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                m.role === 'user'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-100'
                  : 'bg-purple-900/40 border border-purple-500/30 text-gray-200'
              }`}>
                {m.role === 'astrid' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-xs font-bold tracking-wider">ASTRID</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                <p className="text-xs text-gray-500 mt-1.5">{m.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {thinking && (
            <div className="flex justify-start">
              <div className="bg-purple-900/40 border border-purple-500/30 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-purple-400 text-xs font-bold tracking-wider">ASTRID</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="text-gray-400 text-sm italic mr-1">Astrid is thinking</span>
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Message Astrid... (Enter to send)"
              disabled={thinking}
              className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={thinking || !input.trim()}
              className="p-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMessages([messages[0]])}
              title="Clear conversation"
              className="p-3 border border-slate-600 text-gray-400 rounded-xl hover:border-red-500/50 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Σ-Matrix status bar */}
      <div className={`mt-4 flex items-center gap-3 px-5 py-3 bg-slate-800/40 border rounded-xl ${sigmaColors[sigmaStatus]}`}>
        <span className="font-mono text-xs font-bold tracking-widest">Σ-MATRIX</span>
        <div className="flex-1 h-px bg-current opacity-20" />
        <span className="text-xs">Epistemic stability:</span>
        <span className="font-bold text-sm">{sigmaStatus}</span>
        <div className={`w-2 h-2 rounded-full bg-current ${sigmaStatus === 'Stable' ? '' : 'animate-pulse'}`} />
      </div>
    </div>
  );
}

// ─── Home Tab (original landing page content) ───────────────────────────────
function HomeTab() {
  return (
    <div>
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Brain className="w-20 h-20 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 w-20 h-20 border-2 border-cyan-400/30 rounded-full animate-spin" />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4">
              Arch<span className="text-cyan-400">1</span>tech
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Powered by <span className="text-purple-400 font-semibold">Or4cl3 AI Solutions</span>
            </p>
            <p className="text-lg text-cyan-300 italic mb-8">
              Build the future, one thought at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Building
              </button>
              <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Vision Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">🚀 Vision</h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-12">
            <strong className="text-cyan-400">Arch1tech</strong> is a self-evolving, epistemically transparent multimodal AI lab{' '}
            that transforms any idea — from a rough thought to a deployable AI agent, workflow, or full custom large language model — without code.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300">
              <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">🧠 VibeCodeAI</h3>
              <p className="text-gray-300">Semantic input layer to translate rough ideas into build-ready prompts</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300">
              <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">🤖 Astrid</h3>
              <p className="text-gray-300">Autonomous co-pilot to build, test, optimize, and deploy</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">🜏 Σ-Matrix + ERPS</h3>
              <p className="text-gray-300">Engineered introspection & formal stability layers for self-monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">🧩 Core Modules & Pipelines</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-cyan-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">✅ 1️⃣ VibeCodeAI — Semantic Input Engine</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Converts vague or raw inputs (text, TDD, voice) into precise, contextual coding or agent prompts</li>
                  <li>• Auto-optimizes style, tone, domain specifics</li>
                  <li>• Works with multi-language and real-time voice input</li>
                  <li>• Feeds clean prompts into the Thought-to-X Engine</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">✅ 2️⃣ Thought-to-Agent & Workflow Engine</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Generates modular AI logic: inputs, memory, actions, outputs</li>
                  <li>• Visual drag-and-drop canvas for edits</li>
                  <li>• Real-time test & simulation mode</li>
                  <li>• Dynamic UI auto-generated per agent/workflow</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-green-400 mb-4">✅ 3️⃣ Astrid — Autonomous Full-Control Co-Pilot</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• <strong>Mission Mode:</strong> Builds specific outputs from prompts</li>
                  <li>• <strong>Optimization Mode:</strong> Monitors, tests, and improves logic</li>
                  <li>• <strong>Background Mode:</strong> Runs silent with adjustable permissions</li>
                  <li>• Orchestrates Σ-Matrix + ERPS loops for meta-control</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">✅ 4️⃣ Custom LLM Playground</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Fine-tune or train LLMs from scratch</li>
                  <li>• Supports user data upload & synthetic data generation</li>
                  <li>• Pick base models (Llama, Falcon, Mistral, TinyLlama)</li>
                  <li>• Training pipeline auto-generated (PyTorch/TensorFlow)</li>
                  <li>• Outputs professional model card for Hugging Face push</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-yellow-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">✅ 5️⃣ Σ-Matrix</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Formal epistemic meta-control</li>
                  <li>• DMAIC for agent/workflow logic</li>
                  <li>• DMADV for custom model training</li>
                  <li>• Tracks belief, desire, intention stack</li>
                  <li>• Runs continuous drift checks, rollback triggers</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-red-400 mb-4">✅ 6️⃣ ERPS</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Engineered Recursive Phenomenological Structures</li>
                  <li>• Every agent/model includes <em>MirrorNodes</em> for self-query loops</li>
                  <li>• Logs subjective states & uncertainty</li>
                  <li>• Feeds meta-data back to Astrid for continuous improvement</li>
                  <li>• Full logs available to users for trust and compliance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">💸 Freemium & Revenue</h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-green-900/50 to-slate-800/50 border-2 border-green-500/50 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-2 text-sm font-bold">FREE</div>
              <h3 className="text-2xl font-bold text-green-400 mb-6">Unmatched Free Tier</h3>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-center"><span className="text-green-400 mr-2">✅</span> Unlimited text-to-agent/workflow generation</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✅</span> 2 fully active Astrid co-pilots</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✅</span> 3 custom LLM slots</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✅</span> Public deploys & remixing</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✅</span> Full Σ-Matrix + ERPS logs</li>
              </ul>
            </div>

            <div className="bg-gradient-to-b from-blue-900/50 to-slate-800/50 border-2 border-blue-500/50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">Paid Tiers</h3>
              <ul className="text-gray-300 space-y-3">
                <li>• Team collaboration tools</li>
                <li>• Private deployments</li>
                <li>• Extended compute resources</li>
                <li>• Premium marketplace slots</li>
                <li>• Priority support</li>
              </ul>
            </div>

            <div className="bg-gradient-to-b from-purple-900/50 to-slate-800/50 border-2 border-purple-500/50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">Marketplace Revenue</h3>
              <ul className="text-gray-300 space-y-3">
                <li>• Remix transaction fees</li>
                <li>• Premium template packs</li>
                <li>• Usage metering</li>
                <li>• Community sharing</li>
                <li>• Revenue sharing program</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">✨ Additional High-Impact Features</h2>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-cyan-400 font-semibold">#</th>
                    <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Feature</th>
                    <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {[
                    { num: '1️⃣', feature: 'Live Co-Pilot Pair Programming', desc: 'Astrid writes/refactors code live with user approvals.' },
                    { num: '2️⃣', feature: 'Prompt & Logic Memory Timeline', desc: 'Full rewindable prompt-to-output history for every agent/workflow.' },
                    { num: '3️⃣', feature: 'Interactive Prompt Marketplace', desc: 'Share, fork, remix vibe prompt packs publicly.' },
                    { num: '4️⃣', feature: 'Autonomous Agent "Show Mode"', desc: 'Run agents in sandbox with live Σ-Matrix & ERPS subtitles.' },
                    { num: '5️⃣', feature: 'Voice-to-Agent + Persona Cloner', desc: 'Build agents by speaking + add unique voice personas.' },
                    { num: '6️⃣', feature: 'Simulated Agent Battles', desc: 'Pit agents/workflows against each other for performance tuning.' },
                    { num: '7️⃣', feature: 'Dynamic Knowledge Graph Visualizer', desc: 'Explore connected agents, workflows, and Σ-Matrix states visually.' },
                    { num: '8️⃣', feature: 'Ethical Drift Alerts + Repair', desc: 'Astrid suggests fixes when drift is detected.' },
                    { num: '9️⃣', feature: 'Agent-as-API Auto-Generator', desc: 'Every agent auto-exports to plug-and-play API with docs & keys.' },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-yellow-400 font-semibold">{item.num}</td>
                      <td className="px-6 py-4 text-white font-medium">{item.feature}</td>
                      <td className="px-6 py-4 text-gray-300">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">⚙️ Technical Stack</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-6 text-center">
              <Code2 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Frontend</h3>
              <p className="text-gray-300 text-sm">React (Next.js), TailwindCSS, Framer Motion</p>
            </div>

            <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 text-center">
              <Rocket className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Backend</h3>
              <p className="text-gray-300 text-sm">Node.js + Python microservices</p>
            </div>

            <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 text-center">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">ML</h3>
              <p className="text-gray-300 text-sm">PyTorch, TensorFlow, Ray</p>
            </div>

            <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Data</h3>
              <p className="text-gray-300 text-sm">Postgres, Redis, Vector DB</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Position */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">🏆 Final Position</h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            Arch1tech is not just an AI builder — it's an <strong className="text-cyan-400">epistemic machine</strong>.
            <br />
            It removes every technical barrier while guaranteeing explainability, self-correction, and continuous alignment.
          </p>
          <p className="text-lg text-purple-300 italic mb-12">
            Subtly powered by Or4cl3 AI Solutions — engineering introspection for the AI frontier. 🜏
          </p>

          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to build.</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started Now
              </button>
              <button className="px-8 py-4 border-2 border-purple-400 text-purple-400 font-semibold rounded-lg hover:bg-purple-400 hover:text-slate-900 transition-all duration-300">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            Built with ❤️ by the <span className="text-purple-400">Or4cl3 AI Solutions</span> team
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2025 Arch1tech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(GROQ_KEY) ?? '');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [llmPrefill, setLlmPrefill] = useState('');

  function goLLMBuilder(desc: string) {
    setLlmPrefill(desc);
    setTab('llm-builder');
  }

  const navTabs: { id: Tab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'vibecode', label: 'VibeCodeAI' },
    { id: 'llm-builder', label: 'LLM Builder' },
    { id: 'astrid', label: 'Astrid' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab('home')}>
            <Brain className="w-7 h-7 text-cyan-400" />
            <span className="text-xl font-bold text-white">
              Arch<span className="text-cyan-400">1</span>tech
            </span>
            <span className="text-xs bg-purple-500/30 border border-purple-500/50 text-purple-300 px-1.5 py-0.5 rounded-full font-bold">2.0</span>
          </div>

          {/* Tabs */}
          <div className="hidden sm:flex items-center gap-1">
            {navTabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t.id
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Right side: API indicator + settings */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'}`} />
              <span className="hidden sm:inline">{apiKey ? 'API Ready' : 'No API Key'}</span>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="sm:hidden flex gap-1 px-4 pb-2 overflow-x-auto">
          {navTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t.id
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                  : 'text-gray-400 border border-transparent hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16">
        {tab === 'home' && <HomeTab />}
        {tab === 'vibecode' && <VibeCodeTab apiKey={apiKey} onSendToLLMBuilder={goLLMBuilder} />}
        {tab === 'llm-builder' && <LLMBuilderTab apiKey={apiKey} prefillDesc={llmPrefill} />}
        {tab === 'astrid' && <AstridTab apiKey={apiKey} />}
      </main>

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />
      )}
    </div>
  );
}

export default App;
