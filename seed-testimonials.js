'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Testimonial = require('./models/testimonial');

const MONGODB_URI = `mongodb+srv://mhmdalazr:${process.env.MONGO_PASSWORD}@cluster0.r8u1rna.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority&ssl=true`;

const testimonials = [
  {
    name: 'Dr. Sarah Mitchell',
    company: 'University of Cambridge',
    country: 'United Kingdom',
    industry: 'Academic Research',
    rating: 5,
    featured: true,
    translations: {
      en: {
        quote: 'We integrated DragLab centrifuges into our haematology research lab six months ago and the difference has been remarkable. The precision and repeatability of results across runs is outstanding — something that is absolutely critical when working with sensitive biological samples. The build quality feels genuinely premium, and the technical support team responded to our calibration query within hours. Highly recommended for any serious research institution.',
        status: 'published'
      }
    }
  },
  {
    name: 'Marco Antonelli',
    company: 'Farma Italia S.p.A.',
    country: 'Italy',
    industry: 'Pharmaceutical',
    rating: 5,
    featured: true,
    translations: {
      en: {
        quote: 'Our QC laboratory processes hundreds of samples daily under strict GMP conditions. DragLab equipment has been running flawlessly for over a year without a single unplanned downtime. The documentation package they provided — calibration certificates, IQ/OQ protocols — made our FDA audit process significantly smoother. I would not hesitate to specify DragLab again for our new facility in Milan.',
        status: 'published'
      }
    }
  },
  {
    name: 'Prof. Klaus Weber',
    company: 'Technische Universität München',
    country: 'Germany',
    industry: 'Academic Research',
    rating: 5,
    featured: false,
    translations: {
      en: {
        quote: 'We evaluated three manufacturers before selecting DragLab for our analytical chemistry department. The deciding factors were the accuracy of the temperature control and the intuitive software interface. Our students and post-docs adapted to the equipment within days. After two years of intensive use, performance remains consistent with our initial measurements. Exceptional value for a research-grade instrument.',
        status: 'published'
      }
    }
  },
  {
    name: 'Dr. Priya Sharma',
    company: 'Biocon Biologics',
    country: 'India',
    industry: 'Biotechnology',
    rating: 5,
    featured: true,
    translations: {
      en: {
        quote: 'DragLab has become our preferred supplier for cell culture and separation equipment across all three of our R&D sites. What sets them apart is the consistency between units — when we validated a protocol on one instrument, it transferred directly to the others with minimal adjustment. Their local distributor in Bangalore has been equally professional. A genuinely reliable partner for biopharmaceutical development.',
        status: 'published'
      }
    }
  },
  {
    name: 'Dr. Emma Rousseau',
    company: 'Institut Pasteur',
    country: 'France',
    industry: 'Microbiology Research',
    rating: 5,
    featured: false,
    translations: {
      en: {
        quote: 'In a biosafety level 3 environment, equipment reliability is non-negotiable. We have been operating DragLab biosafety centrifuges for eighteen months and they have performed without fault. The sealed rotor design gives us complete confidence when handling high-risk pathogens. The maintenance schedule is straightforward and spare parts arrived faster than any other supplier we have dealt with. An excellent choice for infectious disease research.',
        status: 'published'
      }
    }
  },
  {
    name: 'Thomas Gruber',
    company: 'Bayer AG',
    country: 'Germany',
    industry: 'Pharmaceutical',
    rating: 5,
    featured: false,
    translations: {
      en: {
        quote: 'We replaced our legacy equipment across an entire production support laboratory with DragLab instruments. The transition was smoother than anticipated — their application specialists visited our site, helped revalidate our existing methods, and were available remotely throughout the go-live period. Eighteen months on, instrument uptime sits above 99.5%. For a manufacturing environment, that reliability is everything.',
        status: 'published'
      }
    }
  },
  {
    name: 'Dr. Ahmed Al-Rashidi',
    company: 'Kuwait Institute for Scientific Research',
    country: 'Kuwait',
    industry: 'Environmental Testing',
    rating: 5,
    featured: false,
    translations: {
      en: {
        quote: 'We use DragLab instruments for environmental water and soil analysis under demanding desert conditions — high ambient temperatures, dust, and frequent power fluctuations. The equipment has handled all of it without issue. We particularly appreciate the wide voltage input range and the robust housing. Customer service has always been responsive, even accounting for the time zone difference with Germany. Solid, dependable laboratory tools.',
        status: 'published'
      }
    }
  },
  {
    name: 'Carlos Mendoza',
    company: 'Laboratorio Nacional de Salud',
    country: 'Mexico',
    industry: 'Clinical Diagnostics',
    rating: 5,
    featured: true,
    translations: {
      en: {
        quote: 'Our public health laboratory processes clinical samples for a region of over two million people. Throughput and reliability are critical. DragLab equipment has become the backbone of our workflow — fast, consistent, and easy for technicians of all experience levels to operate. When we expanded our capacity last year, adding additional units was seamless because all instruments share the same interface and protocols. Truly a pleasure to work with.',
        status: 'published'
      }
    }
  },
  {
    name: 'Dr. Yuki Tanaka',
    company: 'Osaka University Hospital',
    country: 'Japan',
    industry: 'Clinical Research',
    rating: 5,
    featured: false,
    translations: {
      en: {
        quote: 'We selected DragLab after a rigorous six-month evaluation process comparing eight manufacturers. Their instruments delivered the tightest coefficient of variation across our test panel and the longest continuous run time without drift. The bilingual documentation and CE marking also simplified our internal procurement approval. Two years later, every instrument is still performing to specification. A quality product backed by a quality team.',
        status: 'published'
      }
    }
  },
  {
    name: 'Dr. Fatima Al-Zahrawi',
    company: 'King Faisal Specialist Hospital',
    country: 'Saudi Arabia',
    industry: 'Clinical Diagnostics',
    rating: 5,
    featured: true,
    translations: {
      en: {
        quote: 'We operate one of the busiest clinical laboratories in the Middle East and equipment failure is simply not an option. DragLab instruments have been running in our haematology and biochemistry sections for over two years with zero critical failures. The preventive maintenance programme they offered is thorough and unobtrusive. Their regional support team is knowledgeable and always on time. We are already planning to extend DragLab equipment to our oncology lab.',
        status: 'published'
      }
    }
  }
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let inserted = 0;
  let skipped  = 0;

  for (const data of testimonials) {
    const existing = await Testimonial.findOne({ name: data.name, company: data.company });
    if (existing) {
      console.log(`  ⏭  Already exists: ${data.name} — ${data.company}`);
      skipped++;
      continue;
    }

    // Build full translations object (unpublished for non-EN languages)
    const translations = {
      en: data.translations.en || { quote: '', status: 'none' },
      es: { quote: '', status: 'none' },
      de: { quote: '', status: 'none' },
      tr: { quote: '', status: 'none' },
      fr: { quote: '', status: 'none' }
    };

    await Testimonial.create({
      name:        data.name,
      company:     data.company,
      country:     data.country,
      industry:    data.industry,
      rating:      data.rating,
      featured:    data.featured,
      caseStudy:   false,
      translations
    });

    console.log(`  ✓  Inserted: ${data.name} — ${data.company}`);
    inserted++;
  }

  console.log('\n────────────────────────────────────');
  console.log(`Done.  Inserted: ${inserted}  |  Already existed: ${skipped}`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
