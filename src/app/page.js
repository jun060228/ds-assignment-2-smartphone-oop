"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  createPhones,
  getPhoneState,
  BarPhone,
  FoldablePhone,
} from "@/models/smartphone";

// ============================================
// 아이콘 컴포넌트들 (SVG)
// ============================================
function PhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="1" width="14" height="22" rx="3" />
      <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FoldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="1" width="8" height="22" rx="2" />
      <rect x="13" y="1" width="8" height="22" rx="2" />
      <line x1="11" y1="6" x2="13" y2="6" strokeDasharray="2 2" />
      <line x1="11" y1="12" x2="13" y2="12" strokeDasharray="2 2" />
      <line x1="11" y1="18" x2="13" y2="18" strokeDasharray="2 2" />
    </svg>
  );
}

function BatteryIcon({ level }) {
  const color = level > 60 ? "#10b981" : level > 30 ? "#f59e0b" : "#f43f5e";
  return (
    <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
      <rect x="0.5" y="0.5" width="24" height="13" rx="2" stroke={color} strokeWidth="1" />
      <rect x="25" y="4" width="2.5" height="6" rx="1" fill={color} opacity="0.5" />
      <rect x="2" y="2" width={Math.max(0, (level / 100) * 21)} height="10" rx="1" fill={color} />
    </svg>
  );
}

function ScreenIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <path d="M7 21h10M12 17v4" />
    </svg>
  );
}

function PocketIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12V20a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <path d="M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}

function ChargeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================
// UML 계층 구조 시각화 컴포넌트
// ============================================
function UMLHierarchy() {
  const classes = [
    {
      name: "SmartphoneADT",
      label: "추상 클래스 (ADT)",
      color: "from-indigo-500/20 to-violet-500/20",
      borderColor: "border-indigo-500/30",
      textColor: "text-indigo-400",
      tag: "«abstract»",
      properties: ["model: str [read-only]", "screen_size: float [read-only]", "durability: int [read-only]"],
      methods: ["use_screen()", "put_in_pocket()", "charge(amount: int)"],
    },
    {
      name: "Smartphone",
      label: "기본 클래스 (Base)",
      color: "from-violet-500/20 to-purple-500/20",
      borderColor: "border-violet-500/30",
      textColor: "text-violet-400",
      tag: "Base Class",
      properties: ["_model", "__battery", "_screen_size", "_weight", "_durability"],
      methods: ["use_screen()", "put_in_pocket()", "charge()", "__str__()"],
    },
  ];

  const subclasses = [
    {
      name: "BarPhone",
      label: "일반 스마트폰",
      color: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
      textColor: "text-cyan-400",
      tag: "Subclass",
      overrides: ["use_screen() → 고정 화면", "put_in_pocket() → 그대로", "charge() → 단일 배터리"],
    },
    {
      name: "FoldablePhone",
      label: "폴더블 스마트폰",
      color: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30",
      textColor: "text-pink-400",
      tag: "Subclass",
      overrides: ["screen_size → 상태별 동적", "use_screen() → 커버/메인", "charge() → 듀얼 배터리"],
      extras: ["fold()", "unfold()"],
    },
  ];

  return (
    <section className="mb-16 animate-fade-in-up delay-1" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          클래스 상속 구조
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          SmartphoneADT → Smartphone → BarPhone / FoldablePhone
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
        {/* ADT 클래스 */}
        <UMLClassBox cls={classes[0]} />

        {/* 상속 화살표 */}
        <div className="flex flex-col items-center">
          <div className="w-px h-6 bg-gradient-to-b from-indigo-500/50 to-violet-500/50" />
          <div className="w-3 h-3 border-l-2 border-b-2 border-violet-500/50 rotate-[-45deg] -mt-1.5" />
        </div>

        {/* Base 클래스 */}
        <UMLClassBox cls={classes[1]} />

        {/* 분기 화살표 */}
        <div className="relative h-12" style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }}>
          <div className="absolute left-1/2 top-0 w-px h-4 bg-violet-500/40" />
          <div className="absolute left-1/4 top-4 right-1/4 h-px bg-gradient-to-r from-cyan-500/40 via-violet-500/40 to-pink-500/40" />
          <div className="absolute left-1/4 top-4 w-px h-4 bg-cyan-500/40" />
          <div className="absolute right-1/4 top-4 w-px h-4 bg-pink-500/40" />
          <div className="absolute left-1/4 top-[30px] w-3 h-3 border-l-2 border-b-2 border-cyan-500/50 rotate-[-45deg] -translate-x-1.5" />
          <div className="absolute right-1/4 top-[30px] w-3 h-3 border-l-2 border-b-2 border-pink-500/50 rotate-[-45deg] -translate-x-1.5" />
        </div>

        {/* 하위 클래스들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ width: '100%', maxWidth: '42rem' }}>
          {subclasses.map((cls) => (
            <UMLSubclassBox key={cls.name} cls={cls} />
          ))}
        </div>
      </div>
    </section>
  );
}

function UMLClassBox({ cls }) {
  return (
    <div className={`border ${cls.borderColor} rounded-xl bg-gradient-to-br ${cls.color} backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/5`} style={{ width: '100%', maxWidth: '28rem' }}>
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/5">
        <span className="text-[10px] font-medium tracking-widest uppercase text-white/30">{cls.tag}</span>
        <h3 className={`text-lg font-bold ${cls.textColor}`}>{cls.name}</h3>
        <span className="text-xs text-white/40">{cls.label}</span>
      </div>
      {/* Properties */}
      <div className="px-5 py-2.5 border-b border-white/5">
        {cls.properties.map((p, i) => (
          <div key={i} className="text-xs text-white/50 font-mono py-0.5">
            {p}
          </div>
        ))}
      </div>
      {/* Methods */}
      <div className="px-5 py-2.5">
        {cls.methods.map((m, i) => (
          <div key={i} className="text-xs text-white/60 font-mono py-0.5">
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}

function UMLSubclassBox({ cls }) {
  return (
    <div className={`border ${cls.borderColor} rounded-xl bg-gradient-to-br ${cls.color} backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
      <div className="px-4 py-3 border-b border-white/5">
        <span className="text-[10px] font-medium tracking-widest uppercase text-white/30">{cls.tag}</span>
        <h3 className={`text-base font-bold ${cls.textColor}`}>{cls.name}</h3>
        <span className="text-xs text-white/40">{cls.label}</span>
      </div>
      <div className="px-4 py-2.5">
        <div className="text-[10px] uppercase tracking-wider text-white/25 mb-1">오버라이딩</div>
        {cls.overrides.map((o, i) => (
          <div key={i} className="text-xs text-white/55 font-mono py-0.5">
            ↻ {o}
          </div>
        ))}
        {cls.extras && (
          <>
            <div className="text-[10px] uppercase tracking-wider text-white/25 mt-2 mb-1">고유 메서드</div>
            {cls.extras.map((e, i) => (
              <div key={i} className={`text-xs ${cls.textColor} font-mono py-0.5`}>
                ★ {e}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================
// 스마트폰 인스턴스 카드 컴포넌트
// ============================================
function PhoneCard({ phone, phoneRef, index, onMethodCall, logs }) {
  const state = getPhoneState(phoneRef);
  const isFoldable = state.isFoldable;
  const gradientClass = isFoldable
    ? "from-pink-500/10 to-rose-500/10"
    : "from-cyan-500/10 to-blue-500/10";
  const borderClass = isFoldable
    ? "border-pink-500/20 hover:border-pink-500/40"
    : "border-cyan-500/20 hover:border-cyan-500/40";
  const accentText = isFoldable ? "text-pink-400" : "text-cyan-400";
  const tagBg = isFoldable
    ? "bg-pink-500/10 text-pink-400"
    : "bg-cyan-500/10 text-cyan-400";

  return (
    <div
      className={`animate-fade-in-up delay-${index + 2} border ${borderClass} rounded-2xl bg-gradient-to-br ${gradientClass} backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group`}
    >
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${isFoldable ? "from-pink-500/20 to-rose-500/20" : "from-cyan-500/20 to-blue-500/20"} flex items-center justify-center`}>
              {isFoldable ? (
                <FoldIcon className={`w-5 h-5 ${accentText}`} />
              ) : (
                <PhoneIcon className={`w-5 h-5 ${accentText}`} />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-white/90 transition-colors">{state.model}</h3>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagBg}`}>
                {state.typeName}
              </span>
            </div>
          </div>
          <BatteryIcon level={state.battery} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatPill label="화면" value={`${state.screenSize}″`} />
          <StatPill label="무게" value={`${state.weight}g`} />
          <StatPill label="내구도" value={`${state.durability}`} />
        </div>

        {/* Battery Bar */}
        <div className="mb-1">
          <div className="flex justify-between text-[10px] text-white/40 mb-1">
            <span>배터리</span>
            <span>{state.battery}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${state.battery}%`,
                background:
                  state.battery > 60
                    ? "linear-gradient(90deg, #10b981, #34d399)"
                    : state.battery > 30
                    ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                    : "linear-gradient(90deg, #f43f5e, #fb7185)",
              }}
            />
          </div>
        </div>

        {/* Foldable State */}
        {isFoldable && (
          <div className="mt-3 flex items-center gap-2">
            <div className={`text-xs px-2.5 py-1 rounded-lg ${state.isFolded ? "bg-violet-500/10 text-violet-400" : "bg-emerald-500/10 text-emerald-400"} transition-all duration-300`}>
              {state.isFolded ? "📱 접힌 상태" : "📖 펼친 상태"}
              <span className="ml-1 text-white/30">
                ({state.isFolded ? state.coverSize : state.mainSize}″)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Method Buttons */}
      <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01]">
        <div className="text-[10px] uppercase tracking-wider text-white/25 mb-2">
          다형성 메서드 호출
        </div>
        <div className="grid grid-cols-3 gap-2">
          <MethodButton
            icon={<ScreenIcon className="w-3.5 h-3.5" />}
            label="use_screen"
            onClick={() => onMethodCall(index, "useScreen")}
            color="indigo"
          />
          <MethodButton
            icon={<PocketIcon className="w-3.5 h-3.5" />}
            label="put_in_pocket"
            onClick={() => onMethodCall(index, "putInPocket")}
            color="violet"
          />
          <MethodButton
            icon={<ChargeIcon className="w-3.5 h-3.5" />}
            label="charge"
            onClick={() => onMethodCall(index, "charge")}
            color="amber"
          />
        </div>

        {/* Fold/Unfold Buttons */}
        {isFoldable && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <MethodButton
              icon={<span className="text-sm">📁</span>}
              label="fold"
              onClick={() => onMethodCall(index, "fold")}
              color="pink"
            />
            <MethodButton
              icon={<span className="text-sm">📂</span>}
              label="unfold"
              onClick={() => onMethodCall(index, "unfold")}
              color="emerald"
            />
          </div>
        )}
      </div>

      {/* Result Output */}
      {logs.length > 0 && (
        <div className="px-5 py-3 border-t border-white/5 bg-black/20">
          <div className="text-[10px] uppercase tracking-wider text-white/25 mb-2">
            실행 결과
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg animate-fade-in ${
                  i === logs.length - 1
                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    : "bg-white/[0.02] text-white/40"
                }`}
              >
                <span className="text-white/20 mr-2">{`>`}</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="flex flex-col items-center py-1.5 px-2 rounded-lg bg-white/[0.03] border border-white/5">
      <span className="text-[10px] text-white/30">{label}</span>
      <span className="text-sm font-semibold text-white/80">{value}</span>
    </div>
  );
}

function MethodButton({ icon, label, onClick, color }) {
  const colorMap = {
    indigo: "hover:bg-indigo-500/15 hover:border-indigo-500/30 hover:text-indigo-400 active:bg-indigo-500/25",
    violet: "hover:bg-violet-500/15 hover:border-violet-500/30 hover:text-violet-400 active:bg-violet-500/25",
    amber: "hover:bg-amber-500/15 hover:border-amber-500/30 hover:text-amber-400 active:bg-amber-500/25",
    pink: "hover:bg-pink-500/15 hover:border-pink-500/30 hover:text-pink-400 active:bg-pink-500/25",
    emerald: "hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-emerald-400 active:bg-emerald-500/25",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-white/5 bg-white/[0.02] text-white/50 transition-all duration-200 cursor-pointer ${colorMap[color]} active:scale-95`}
    >
      {icon}
      <span className="text-[9px] font-mono leading-none">{label}</span>
    </button>
  );
}

// ============================================
// 다형성 비교 테스트 컴포넌트
// ============================================
function PolymorphismDemo({ phonesRef, onUpdate }) {
  const [results, setResults] = useState([]);
  const [activeMethod, setActiveMethod] = useState(null);

  const runTest = (methodName) => {
    setActiveMethod(methodName);
    const newResults = phonesRef.current.map((phone) => {
      let result;
      if (methodName === "useScreen") result = phone.useScreen();
      else if (methodName === "putInPocket") {
        result = phone.putInPocket();
        if (phone instanceof FoldablePhone) onUpdate();
      } else if (methodName === "charge") result = phone.charge(20);
      return { model: phone.model, typeName: phone.typeName, result };
    });
    if (methodName === "charge") onUpdate();
    setResults(newResults);
  };

  return (
    <section className="mb-16 animate-fade-in-up delay-3">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          다형성 비교 테스트
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          같은 메서드를 호출해도 클래스마다 다른 결과가 나옵니다
        </p>
      </div>

      {/* Method Selector */}
      <div className="flex gap-3 mb-8 flex-wrap" style={{ justifyContent: 'center' }}>
        {[
          { key: "useScreen", label: "use_screen()", icon: <ScreenIcon className="w-4 h-4" />, color: "indigo" },
          { key: "putInPocket", label: "put_in_pocket()", icon: <PocketIcon className="w-4 h-4" />, color: "violet" },
          { key: "charge", label: "charge(20)", icon: <ChargeIcon className="w-4 h-4" />, color: "amber" },
        ].map(({ key, label, icon, color }) => (
          <button
            key={key}
            onClick={() => runTest(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer active:scale-95 ${
              activeMethod === key
                ? `bg-${color}-500/20 border-${color}-500/40 text-${color}-400 shadow-lg shadow-${color}-500/10`
                : "bg-white/[0.03] border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
            }`}
          >
            {icon}
            <span className="text-sm font-mono">{label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {results.map((r, i) => (
            <div
              key={i}
              className={`border rounded-xl p-4 backdrop-blur-sm transition-all duration-300 ${
                r.typeName === "BarPhone"
                  ? "border-cyan-500/20 bg-cyan-500/5"
                  : "border-pink-500/20 bg-pink-500/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  r.typeName === "BarPhone"
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "bg-pink-500/10 text-pink-400"
                }`}>
                  {r.typeName}
                </span>
                <span className="text-sm font-semibold text-white/80">{r.model}</span>
              </div>
              <div className="text-xs font-mono bg-black/30 rounded-lg px-3 py-2 text-emerald-400/80 whitespace-pre-wrap">
                {r.result}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ============================================
// 메인 페이지
// ============================================
export default function Home() {
  const phonesRef = useRef(null);
  const [, forceUpdate] = useState(0);
  const [phoneLogs, setPhoneLogs] = useState({});

  // 초기화
  if (phonesRef.current === null) {
    phonesRef.current = createPhones();
  }

  const triggerUpdate = useCallback(() => {
    forceUpdate((n) => n + 1);
  }, []);

  const handleMethodCall = useCallback(
    (phoneIndex, methodName) => {
      const phone = phonesRef.current[phoneIndex];
      let result;

      switch (methodName) {
        case "useScreen":
          result = phone.useScreen();
          break;
        case "putInPocket":
          result = phone.putInPocket();
          break;
        case "charge":
          result = phone.charge(20);
          break;
        case "fold":
          if (phone instanceof FoldablePhone) result = phone.fold();
          break;
        case "unfold":
          if (phone instanceof FoldablePhone) result = phone.unfold();
          break;
        default:
          return;
      }

      setPhoneLogs((prev) => {
        const key = phoneIndex;
        const existing = prev[key] || [];
        const updated = [...existing, result].slice(-5); // 최근 5개만 유지
        return { ...prev, [key]: updated };
      });

      forceUpdate((n) => n + 1);
    },
    []
  );

  return (
    <main className="flex-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Hero Section */}
      <header className="relative pt-16 pb-12 px-4 overflow-hidden" style={{ width: '100%', textAlign: 'center' }}>
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            자료구조 과제 2 · OOP + 배포
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Smartphone OOP
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Polymorphism Visualizer
            </span>
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed" style={{ maxWidth: '36rem', textAlign: 'center' }}>
            추상 클래스(ADT) → 기본 클래스 → 하위 클래스로 이어지는 OOP 상속 구조와
            <br className="hidden md:block" />
            다형성(Polymorphism)의 동작을 인터랙티브하게 시각화합니다.
          </p>
        </div>
      </header>

      <div className="px-4 pb-20" style={{ width: '100%', maxWidth: '64rem', margin: '0 auto' }}>
        {/* Section 1: UML 계층 구조 */}
        <UMLHierarchy />

        {/* Section 2: 인스턴스 카드 */}
        <section className="mb-16">
          <div className="animate-fade-in-up delay-2" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              인스턴스 인터랙션
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              각 스마트폰 카드의 메서드 버튼을 클릭하여 다형성을 확인하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {phonesRef.current.map((phone, index) => (
              <PhoneCard
                key={phone.model}
                phone={getPhoneState(phone)}
                phoneRef={phone}
                index={index}
                onMethodCall={handleMethodCall}
                logs={phoneLogs[index] || []}
              />
            ))}
          </div>
        </section>

        {/* Section 3: 다형성 비교 테스트 */}
        <PolymorphismDemo phonesRef={phonesRef} onUpdate={triggerUpdate} />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8" style={{ width: '100%', textAlign: 'center' }}>
        <p className="text-xs text-white/25">
          2026 자료구조 과제 2 · OOP 설계 기반 인터랙티브 웹앱 · Smartphone Polymorphism Visualizer
        </p>
      </footer>
    </main>
  );
}
