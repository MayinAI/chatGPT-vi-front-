import { NextPage } from 'next';
import Head from 'next/head';

const FAQPage: NextPage = () => {
  const faqpage_jsonld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Mayin?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mayin is an AI visibility platform that measures how often and how brands are mentioned in AI chat and AI search (starting with ChatGPT). We provide a visibility score, sample AI answers, and step-by-step recommendations to improve visibility."
        }
      },
      {
        "@type": "Question",
        "name": "How does the ChatGPT visibility scan work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mayin runs a curated set of context-aware prompts against ChatGPT, analyzes responses for brand mentions and sentiment, validates cited sources, and produces a visibility score along with improvement guidance."
        }
      },
      {
        "@type": "Question",
        "name": "What should I expect from a visibility report?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You will receive an overall visibility score (0–100), sample AI responses that mention (or ignore) your brand, a location-wise breakdown (if requested), and an action plan with prioritized steps to improve AI visibility."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I update my site or the AI index file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For best results, update key pages and the AI index file after any major content, product, or press change. A practical cadence is weekly updates for active marketing, and at least monthly otherwise."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqpage_jsonld) }}
        />
      </Head>
      <div>
        <h1>Frequently Asked Questions</h1>
        {
          faqpage_jsonld.mainEntity.map((faq, index) => (
            <div key={index}>
              <h2>{faq.name}</h2>
              <p>{faq.acceptedAnswer.text}</p>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default FAQPage;
