'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X } from 'lucide-react';

const questions = [
  { title: 'What draws you in?', hint: 'Start with a note you love.', options: [
    { title: 'Dark cherry', detail: 'Juicy fruit with a little mystery.', id: 'night' },
    { title: 'Bergamot', detail: 'A bright, fresh citrus opening.', id: 'silver' },
    { title: 'Rose & pink pepper', detail: 'Soft petals with a gentle spark.', id: 'rose' },
  ] },
  { title: 'Choose your atmosphere.', hint: 'Follow the feeling, not the occasion.', options: [
    { title: 'A quiet evening', detail: 'Intimate, intriguing, a little unexpected.', id: 'night' },
    { title: 'An open window', detail: 'Airy, understated, effortlessly fresh.', id: 'silver' },
    { title: 'A velvet room', detail: 'Warm, expressive and enveloping.', id: 'rose' },
  ] },
  { title: 'What should linger?', hint: 'Choose the finish you would reach for.', options: [
    { title: 'Dry woods & powdery florals', detail: 'Cedarwood with the softness of iris.', id: 'night' },
    { title: 'Soft musk & smooth woods', detail: 'White musk wrapped in sandalwood.', id: 'silver' },
    { title: 'Warm amber & petals', detail: 'An amber finish around a rose heart.', id: 'rose' },
  ] },
];
type Fragrance = { id: string; name: string; notes: string; description: string; prices: number[] };
export function matchFragrance(answers: string[]) {
  const scores = answers.reduce<Record<string, number>>((all, id) => ({ ...all, [id]: (all[id] || 0) + 1 }), {});
  // A three-way tie follows the visitor's explicit opening-note preference.
  return answers.reduce((best, id) => scores[id] > scores[best] ? id : best, answers[0]);
}

export default function ScentFinder({ open, onOpen, onClose, onExplore, products }: { open: boolean; onOpen: () => void; onClose: () => void; onExplore: (id: string) => void; products: Fragrance[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  useEffect(() => {
    if (open) { dialog.current?.showModal(); heading.current?.focus({ preventScroll: true }); }
    else dialog.current?.close();
  }, [open]);
  useEffect(() => { if (open) { heading.current?.focus({ preventScroll: true }); if (dialog.current) dialog.current.scrollTop = 0; } }, [step, open]);
  const result = step === 3 ? products.find(p => p.id === matchFragrance(answers)) : undefined;
  const reasons = result ? answers.flatMap((id, i) => id === result.id ? [questions[i].options.find(o => o.id === id)!.title] : []) : [];
  function start() { setStep(0); setAnswers([]); onOpen(); }
  function close() { dialog.current?.close(); onClose(); }
  return <>
    <div className="scent-invitation"><div className="scent-seal" aria-hidden="true">S</div><div><span className="scent-kicker">A LITTLE INSTINCT. A LITTLE DISCOVERY.</span><h3>Which signature is <em>yours?</em></h3><p>Three questions. Find a fragrance to explore.</p></div><button className="scent-start" onClick={start}>Find my scent <ArrowUpRight size={18}/></button></div>
    <dialog ref={dialog} className="scent-dialog" aria-labelledby="scent-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) close(); }} data-lenis-prevent>
      <button className="scent-close" aria-label="Close scent finder" onClick={close}><X size={19}/></button>
      <div className="scent-dialog-top"><span>SHANNA / SCENT FINDER</span><span>{result ? 'YOUR DISCOVERY' : `0${step + 1} / 03`}</span></div>
      <div className="scent-progress" aria-hidden="true">{questions.map((_, i) => <span key={i} className={i <= step ? 'filled' : ''}/>)}</div>
      <div className="scent-step" key={step}>
        {result ? <><span className="scent-kicker">YOUR SIGNATURE TO EXPLORE</span><h2 id="scent-title" ref={heading} tabIndex={-1}>{result.name}</h2><p className="scent-result-notes">{result.notes}</p><p>{result.description}</p><div className="scent-reason"><span>WHY THIS ONE</span><p>Your choices leaned toward {reasons.map(s => s.toLowerCase()).join(' and ')}.</p>{new Set(answers).size === 3 && <p>Your tastes span all three scents, so your opening-note preference led the way.</p>}</div><span className="scent-result-price">From {result.prices[0].toLocaleString('en-US')} MAD · 30 / 50 / 100 ml</span><button className="scent-primary" onClick={() => { close(); onExplore(result.id); }}>Explore {result.name} <ArrowUpRight size={18}/></button><button className="scent-retake" onClick={() => { setAnswers([]); setStep(0); }}>Take it again</button><p className="scent-disclaimer">A suggestion based on your preferences, an invitation to discover.</p></> : <><h2 id="scent-title" ref={heading} tabIndex={-1}>{questions[step].title}</h2><p>{questions[step].hint}</p><fieldset className="scent-options"><legend className="sr-only">{questions[step].title}</legend>{questions[step].options.map((option, i) => <label key={option.id} className={answers[step] === option.id ? 'chosen' : ''}><input type="radio" name={`scent-question-${step}`} value={option.id} checked={answers[step] === option.id} onChange={() => setAnswers(old => { const next = [...old]; next[step] = option.id; return next; })}/><span className="scent-option-number">0{i + 1}</span><span><strong>{option.title}</strong><small>{option.detail}</small></span><Check className="scent-check" size={17}/></label>)}</fieldset><div className="scent-step-actions"><button className="scent-back" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={16}/> Back</button><button className="scent-primary" disabled={!answers[step]} onClick={() => setStep(step + 1)}>{step === 2 ? 'Reveal my scent' : 'Continue'} <ArrowRight size={17}/></button></div><p className="scent-disclaimer">No email needed. Just your instinct.</p></>}
      </div>
    </dialog>
  </>;
}
