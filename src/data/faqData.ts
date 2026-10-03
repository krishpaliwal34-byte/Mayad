export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is MAYAD?',
    answer: 'MAYAD is a media and entertainment platform dedicated to delivering engaging content, promoting creativity, and creating meaningful experiences for its audience.',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: 'What services does MAYAD offer?',
    answer: 'MAYAD offers a range of media, entertainment, and digital content services. Our goal is to connect audiences with engaging content and innovative entertainment experiences.',
    category: 'Services',
  },
  {
    id: 'faq-3',
    question: 'How can I contact the MAYAD team?',
    answer: 'You can contact the MAYAD team through the Contact Us form available on our website. Simply fill in your details and message, and our team will get back to you.',
    category: 'Contact',
  },
  {
    id: 'faq-4',
    question: 'Does MAYAD offer career opportunities?',
    answer: "Yes! You can register through our website's registration form to explore opportunities and become part of the MAYAD community.",
    category: 'Careers',
  },
];

export function getStoredFaqs(): FAQItem[] {
  if (typeof window === 'undefined') return DEFAULT_FAQS;
  const stored = localStorage.getItem('mayad_faqs');
  if (!stored) {
    localStorage.setItem('mayad_faqs', JSON.stringify(DEFAULT_FAQS));
    return DEFAULT_FAQS;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
}

export function saveStoredFaqs(faqs: FAQItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mayad_faqs', JSON.stringify(faqs));
    window.dispatchEvent(new Event('faqUpdated'));
  }
}
