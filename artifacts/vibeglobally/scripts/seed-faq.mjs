/**
 * Script to seed FAQ data to the database
 * Run with: node scripts/seed-faq.mjs
 */

const FAQ_DATA = {
  sectionTitle: "Frequently Asked Questions",
  sectionDescription: "Get answers to common questions about our virtual staffing and outsourcing services",
  items: [
    {
      question: "What is Vibeglobally?",
      answer: "Vibeglobally is a virtual staffing and outsourcing company that provides trained remote professionals to support businesses across customer service, telemarketing, appointment setting, chat support, data entry, email marketing, SEO, and more."
    },
    {
      question: "What services do you offer?",
      answer: "We provide a wide range of remote business support services, including customer service support, telemarketing and outbound calling, appointment setting, live chat support, data entry and admin tasks, email marketing support, SEO and basic digital marketing assistance, and custom virtual assistant solutions."
    },
    {
      question: "Who can benefit from Vibeglobally's services?",
      answer: "We work with startups, small businesses, agencies, and established companies that want to scale operations, reduce costs, and access trained remote talent without the overhead of hiring in-house staff."
    },
    {
      question: "Where are your virtual staff based?",
      answer: "Our team members are primarily based in the Philippines, known for strong English communication skills, customer service experience, and adaptability to global business operations."
    },
    {
      question: "Are your virtual assistants trained?",
      answer: "Yes. All our virtual staff undergo training based on the specific role they will handle, whether it's customer service, outbound calling, admin work, or marketing support. We also align them with your processes and systems."
    },
    {
      question: "Can I hire for multiple roles at once?",
      answer: "Yes. You can build a full remote team with different roles under one setup. For example, a mix of customer support agents, appointment setters, and admin assistants."
    },
    {
      question: "Do you provide full-time or part-time staff?",
      answer: "We offer flexible arrangements depending on your needs. You can scale from part-time support to full-time dedicated virtual staff."
    },
    {
      question: "How do you ensure quality of work?",
      answer: "We focus on training, clear SOPs (standard operating procedures), and alignment with your business goals. We also recommend regular performance feedback to ensure consistent quality."
    },
    {
      question: "Can your team work in my systems and tools?",
      answer: "Yes. Our virtual staff are trained to work with common tools such as CRMs, email platforms, helpdesk systems, spreadsheets, and project management tools."
    },
    {
      question: "How fast can I get started?",
      answer: "Once we understand your requirements, we can typically match and onboard virtual staff within a few days, depending on role complexity and training needs."
    },
    {
      question: "How is pricing structured?",
      answer: "Pricing depends on the role, skill level, and number of staff required. We offer flexible monthly packages designed to fit different business sizes and scaling needs."
    },
    {
      question: "Why choose Vibeglobally over hiring directly?",
      answer: "Hiring through Vibeglobally removes the complexity of recruitment, training, and management. You get pre-vetted, trained professionals who are ready to support your business while you focus on growth."
    },
    {
      question: "Can I work with the freelancer directly and pay them directly?",
      answer: "No.\n\nVibeGlobally operates as a managed agency, meaning all engagements and payments must go through the company to ensure proper coordination, accountability, and service quality.\n\nUnder Philippine contract law (Civil Code Article 1306), agreements between parties are binding as long as they are not contrary to law, morals, public order, or public policy. This means contractual arrangements such as working exclusively through an agency are generally enforceable when clearly agreed upon.\n\nAllowing direct engagement outside the agency would bypass the agreed terms and the operational structure of the service.\n\nIf you wish to work directly with a freelancer from our team, we offer a buyout option for $1,000 USD."
    }
  ]
};

async function seedFAQ() {
  const API_URL = process.env.API_URL || 'http://localhost:8080';
  
  try {
    console.log('Seeding FAQ data...');
    console.log(`API URL: ${API_URL}/api/site-content/faq`);
    
    const response = await fetch(`${API_URL}/api/site-content/faq`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        section: 'faq',
        content: FAQ_DATA
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ FAQ data seeded successfully!');
    console.log(result);
  } catch (error) {
    console.error('❌ Error seeding FAQ data:', error.message);
    console.error('Make sure your API server is running and accessible.');
  }
}

seedFAQ();
