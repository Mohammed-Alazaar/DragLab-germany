'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const FAQ = require('./models/faq');

const MONGODB_URI = `mongodb+srv://mhmdalazr:${process.env.MONGO_PASSWORD}@cluster0.r8u1rna.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority&ssl=true`;

const faqs = [

  // ============ GENERAL ============
  {
    category: 'General',
    slug: 'what-is-draglab',
    order: 1,
    relatedProducts: [],
    relatedProductNames: [],
    translations: {
      en: { question: 'Who is DragLab and where are your products manufactured?', answer: 'DragLab is a German laboratory equipment brand based in Eschborn, Germany. Our instruments are designed and manufactured in compliance with international standards, certified to ISO 9001:2015, and carry the CE mark confirming conformity with European health, safety and environmental directives.', status: 'published' },
      es: { question: '¿Quién es DragLab y dónde se fabrican sus productos?', answer: 'DragLab es una marca alemana de equipos de laboratorio con sede en Eschborn, Alemania. Nuestros instrumentos se diseñan y fabrican conforme a normas internacionales, cuentan con la certificación ISO 9001:2015 y llevan el marcado CE, confirmando el cumplimiento de las directivas europeas de salud, seguridad y medio ambiente.', status: 'published' },
      de: { question: 'Wer ist DragLab und wo werden Ihre Produkte hergestellt?', answer: 'DragLab ist eine deutsche Marke für Laborgeräte mit Sitz in Eschborn, Deutschland. Unsere Geräte werden nach internationalen Standards entwickelt und gefertigt, sind nach ISO 9001:2015 zertifiziert und tragen das CE-Kennzeichen als Nachweis der Konformität mit den europäischen Gesundheits-, Sicherheits- und Umweltrichtlinien.', status: 'published' },
      tr: { question: 'DragLab kimdir ve ürünleriniz nerede üretiliyor?', answer: 'DragLab, merkezi Almanya Eschborn\'da bulunan bir Alman laboratuvar ekipmanları markasıdır. Cihazlarımız uluslararası standartlara uygun olarak tasarlanıp üretilmekte, ISO 9001:2015 sertifikasına sahip olup, Avrupa sağlık, güvenlik ve çevre direktiflerine uygunluğu onaylayan CE işaretini taşımaktadır.', status: 'published' },
      fr: { question: 'Qui est DragLab et où vos produits sont-ils fabriqués ?', answer: 'DragLab est une marque allemande d\'équipements de laboratoire basée à Eschborn, en Allemagne. Nos instruments sont conçus et fabriqués conformément aux normes internationales, certifiés ISO 9001:2015 et portent le marquage CE attestant de leur conformité aux directives européennes en matière de santé, de sécurité et d\'environnement.', status: 'published' }
    }
  },

  {
    category: 'General',
    slug: 'ce-certification-standards',
    order: 2,
    relatedProducts: [],
    relatedProductNames: [],
    translations: {
      en: { question: 'Which standards and directives do DragLab instruments comply with?', answer: 'All DragLab laboratory instruments comply with European directives 2014/35/EU (Low Voltage) and 2014/30/EU (EMC), and are built according to EN 61010-1, EN 61010-2-010/020 and EN 61326-1. Heated chambers additionally follow DIN 12880 for temperature homogeneity.', status: 'published' },
      es: { question: '¿Con qué normas y directivas cumplen los instrumentos DragLab?', answer: 'Todos los instrumentos de laboratorio DragLab cumplen con las directivas europeas 2014/35/UE (baja tensión) y 2014/30/UE (CEM), y se fabrican conforme a EN 61010-1, EN 61010-2-010/020 y EN 61326-1. Las cámaras calentadas cumplen además con DIN 12880 para la homogeneidad de temperatura.', status: 'published' },
      de: { question: 'Welche Normen und Richtlinien erfüllen DragLab-Geräte?', answer: 'Alle DragLab-Laborgeräte entsprechen den europäischen Richtlinien 2014/35/EU (Niederspannung) und 2014/30/EU (EMV) und werden nach EN 61010-1, EN 61010-2-010/020 sowie EN 61326-1 gefertigt. Beheizte Kammern erfüllen zusätzlich die DIN 12880 hinsichtlich der Temperaturhomogenität.', status: 'published' },
      tr: { question: 'DragLab cihazları hangi standart ve direktiflere uygundur?', answer: 'Tüm DragLab laboratuvar cihazları 2014/35/EU (Alçak Gerilim) ve 2014/30/EU (EMC) Avrupa direktiflerine uygundur ve EN 61010-1, EN 61010-2-010/020 ve EN 61326-1 standartlarına göre üretilmektedir. Isıtmalı hazneler ayrıca sıcaklık homojenliği için DIN 12880 standardını karşılar.', status: 'published' },
      fr: { question: 'À quelles normes et directives les instruments DragLab sont-ils conformes ?', answer: 'Tous les instruments de laboratoire DragLab sont conformes aux directives européennes 2014/35/UE (basse tension) et 2014/30/UE (CEM) et sont fabriqués selon les normes EN 61010-1, EN 61010-2-010/020 et EN 61326-1. Les enceintes chauffées respectent en outre la norme DIN 12880 concernant l\'homogénéité de la température.', status: 'published' }
    }
  },

  // ============ WARRANTY ============
  {
    category: 'Warranty',
    slug: 'warranty-coverage',
    order: 3,
    relatedProducts: [],
    relatedProductNames: ['Water Still Series', 'Water Bath Series', 'Incubator Series', 'Drying Oven Series', 'Centrifuge DF-12', 'Hotplate Magnetic Stirrer Series'],
    translations: {
      en: { question: 'What is the warranty on DragLab laboratory equipment?', answer: 'DragLab provides a 2-year worldwide warranty on its laboratory instruments, covering manufacturing defects under normal use. The warranty requires installation, operation and maintenance in accordance with the user manual. Consumables and damage caused by misuse, unauthorized repairs or improper installation are not covered.', status: 'published' },
      es: { question: '¿Cuál es la garantía de los equipos de laboratorio DragLab?', answer: 'DragLab ofrece una garantía mundial de 2 años en sus instrumentos de laboratorio, que cubre defectos de fabricación en condiciones de uso normal. La garantía requiere instalación, operación y mantenimiento conforme al manual del usuario. No cubre consumibles ni daños por mal uso, reparaciones no autorizadas o instalación incorrecta.', status: 'published' },
      de: { question: 'Welche Garantie bietet DragLab auf seine Laborgeräte?', answer: 'DragLab gewährt eine weltweite Garantie von 2 Jahren auf seine Laborgeräte, die Herstellungsfehler bei bestimmungsgemäßem Gebrauch abdeckt. Voraussetzung ist eine Installation, Bedienung und Wartung gemäß Bedienungsanleitung. Verbrauchsmaterialien sowie Schäden durch Missbrauch, nicht autorisierte Reparaturen oder unsachgemäße Installation sind ausgeschlossen.', status: 'published' },
      tr: { question: 'DragLab laboratuvar ekipmanlarının garantisi nedir?', answer: 'DragLab, laboratuvar cihazlarına normal kullanım koşullarında üretim hatalarını kapsayan 2 yıl dünya çapında garanti sunmaktadır. Garanti, kurulum, kullanım ve bakımın kullanım kılavuzuna uygun şekilde yapılmasını gerektirir. Sarf malzemeleri ve yanlış kullanım, yetkisiz onarımlar veya hatalı kurulumdan kaynaklanan hasarlar garanti kapsamı dışındadır.', status: 'published' },
      fr: { question: 'Quelle est la garantie des équipements de laboratoire DragLab ?', answer: 'DragLab offre une garantie mondiale de 2 ans sur ses instruments de laboratoire, couvrant les défauts de fabrication dans des conditions d\'utilisation normales. La garantie exige une installation, une utilisation et un entretien conformes au manuel d\'utilisation. Les consommables et les dommages dus à une mauvaise utilisation, à des réparations non autorisées ou à une installation incorrecte ne sont pas couverts.', status: 'published' }
    }
  },

  // ============ WATER STILL ============
  {
    category: 'Product Usage',
    slug: 'water-still-capacity-models',
    order: 10,
    relatedProducts: ['DS 2000', 'DS 4000', 'DS 8000', 'DS 8008', 'DS 8012', 'DS 8025'],
    relatedProductNames: ['Water Still Series'],
    translations: {
      en: { question: 'What distillation capacities are available in the DragLab Water Still Series?', answer: 'The DragLab Water Still Series offers production capacities from 2 L/h to 25 L/h across six models (DS 2000, DS 4000, DS 8000, DS 8008, DS 8012, DS 8025). Integrated storage tanks of 8, 16, 24 and 50 liters are available depending on the model. All units deliver distilled water with a conductivity of approximately 2.3–2.5 μS/cm at 25 °C.', status: 'published' },
      es: { question: '¿Qué capacidades de destilación ofrece la Serie Destiladores de Agua DragLab?', answer: 'La Serie Destiladores de Agua DragLab ofrece capacidades de producción de 2 L/h a 25 L/h en seis modelos (DS 2000, DS 4000, DS 8000, DS 8008, DS 8012, DS 8025). Según el modelo, incluye tanques de almacenamiento integrados de 8, 16, 24 y 50 litros. Todas las unidades producen agua destilada con una conductividad aproximada de 2,3–2,5 μS/cm a 25 °C.', status: 'published' },
      de: { question: 'Welche Destillationsleistungen bietet die DragLab Wasserdestillierer-Serie?', answer: 'Die DragLab Wasserdestillierer-Serie bietet Produktionsleistungen von 2 L/h bis 25 L/h in sechs Modellen (DS 2000, DS 4000, DS 8000, DS 8008, DS 8012, DS 8025). Je nach Modell sind integrierte Vorratstanks mit 8, 16, 24 und 50 Litern verfügbar. Alle Geräte liefern destilliertes Wasser mit einer Leitfähigkeit von etwa 2,3–2,5 μS/cm bei 25 °C.', status: 'published' },
      tr: { question: 'DragLab Su Distilatör Serisi hangi distilasyon kapasitelerinde sunulmaktadır?', answer: 'DragLab Su Distilatör Serisi, altı modelde (DS 2000, DS 4000, DS 8000, DS 8008, DS 8012, DS 8025) 2 L/saat ile 25 L/saat arasında üretim kapasitesi sunar. Modele bağlı olarak 8, 16, 24 ve 50 litrelik entegre depolama tankları mevcuttur. Tüm üniteler 25 °C\'de yaklaşık 2,3–2,5 μS/cm iletkenlikte distile su üretir.', status: 'published' },
      fr: { question: 'Quelles capacités de distillation propose la série distillateurs d\'eau DragLab ?', answer: 'La série distillateurs d\'eau DragLab propose des capacités de production de 2 L/h à 25 L/h sur six modèles (DS 2000, DS 4000, DS 8000, DS 8008, DS 8012, DS 8025). Selon le modèle, des réservoirs de stockage intégrés de 8, 16, 24 et 50 litres sont disponibles. Toutes les unités produisent de l\'eau distillée avec une conductivité d\'environ 2,3 à 2,5 μS/cm à 25 °C.', status: 'published' }
    }
  },

  {
    category: 'Installation',
    slug: 'water-still-installation-requirements',
    order: 11,
    relatedProducts: ['DS 2000', 'DS 4000', 'DS 8000', 'DS 8008', 'DS 8012', 'DS 8025'],
    relatedProductNames: ['Water Still Series'],
    translations: {
      en: { question: 'What are the installation requirements for a DragLab water still?', answer: 'DragLab water stills can be installed on a bench or wall-mounted. They require a cooling water supply with a pressure between 2 and 10 bar connected to a 3/4" inlet, a drain line, and a mains connection (230 V for DS 2000/4000/8000 or 400 V 3-phase for DS 8008/8012/8025). All mounting hardware, the inlet tube and the faucet are supplied with the unit.', status: 'published' },
      es: { question: '¿Cuáles son los requisitos de instalación de un destilador de agua DragLab?', answer: 'Los destiladores DragLab pueden instalarse sobre mesada o fijarse a la pared. Requieren suministro de agua de refrigeración con presión de 2 a 10 bar conectado a una entrada de 3/4", una línea de desagüe y conexión eléctrica (230 V para DS 2000/4000/8000 o 400 V trifásico para DS 8008/8012/8025). Se incluyen todos los accesorios de montaje, el tubo de entrada y el grifo.', status: 'published' },
      de: { question: 'Welche Installationsanforderungen hat ein DragLab-Wasserdestillierer?', answer: 'DragLab-Wasserdestillierer können auf der Arbeitsplatte oder an der Wand montiert werden. Sie benötigen eine Kühlwasserversorgung mit einem Druck zwischen 2 und 10 bar am 3/4"-Einlass, einen Abfluss sowie einen Netzanschluss (230 V bei DS 2000/4000/8000 bzw. 400 V Drehstrom bei DS 8008/8012/8025). Alle Montageteile, der Zulaufschlauch und der Wasserhahn sind im Lieferumfang enthalten.', status: 'published' },
      tr: { question: 'DragLab su distilatörü için kurulum gereksinimleri nelerdir?', answer: 'DragLab su distilatörleri tezgah üzerine veya duvara monte edilebilir. 3/4" girişe bağlanan 2–10 bar basınçta soğutma suyu beslemesi, bir tahliye hattı ve elektrik bağlantısı (DS 2000/4000/8000 için 230 V veya DS 8008/8012/8025 için 400 V üç fazlı) gerektirir. Tüm montaj donanımı, giriş hortumu ve musluk cihazla birlikte verilir.', status: 'published' },
      fr: { question: 'Quelles sont les exigences d\'installation d\'un distillateur d\'eau DragLab ?', answer: 'Les distillateurs DragLab peuvent être installés sur paillasse ou fixés au mur. Ils nécessitent une alimentation en eau de refroidissement entre 2 et 10 bars raccordée à une entrée de 3/4", une conduite d\'évacuation et un raccordement électrique (230 V pour DS 2000/4000/8000 ou 400 V triphasé pour DS 8008/8012/8025). Tout le matériel de montage, le tuyau d\'entrée et le robinet sont fournis avec l\'appareil.', status: 'published' }
    }
  },

  {
    category: 'Maintenance',
    slug: 'water-still-descaling',
    order: 12,
    relatedProducts: ['DS 2000', 'DS 4000', 'DS 8000', 'DS 8008', 'DS 8012', 'DS 8025'],
    relatedProductNames: ['Water Still Series'],
    translations: {
      en: { question: 'How often should I descale my DragLab water still and which descaler can I use?', answer: 'The inner tanks should be cleaned approximately every 160 operating hours, or whenever distillation performance decreases, depending on raw water hardness. A suitable descaling solution is 10% formic acid, 10% acetic acid and 80% distilled water, or a commercial descaler. Never use products containing hydrochloric acid. After descaling, discard the first few liters of distillate.', status: 'published' },
      es: { question: '¿Con qué frecuencia debo descalcificar el destilador DragLab y qué producto puedo usar?', answer: 'Los tanques internos deben limpiarse aproximadamente cada 160 horas de operación, o cuando disminuya el rendimiento de destilación, según la dureza del agua de red. Una solución adecuada es 10% de ácido fórmico, 10% de ácido acético y 80% de agua destilada, o un descalcificador comercial. No utilice nunca productos que contengan ácido clorhídrico. Tras la descalcificación, deseche los primeros litros de destilado.', status: 'published' },
      de: { question: 'Wie oft muss ich meinen DragLab-Destillierer entkalken und welches Mittel ist geeignet?', answer: 'Die inneren Tanks sollten je nach Rohwasserhärte etwa alle 160 Betriebsstunden bzw. bei nachlassender Destillationsleistung gereinigt werden. Geeignet ist eine Lösung aus 10% Ameisensäure, 10% Essigsäure und 80% destilliertem Wasser oder ein handelsübliches Entkalkungsmittel. Verwenden Sie niemals salzsäurehaltige Produkte. Nach dem Entkalken die ersten Liter Destillat verwerfen.', status: 'published' },
      tr: { question: 'DragLab su distilatörümü ne sıklıkla kireçten arındırmalıyım ve hangi ürünü kullanabilirim?', answer: 'İç tanklar, şebeke suyu sertliğine bağlı olarak yaklaşık her 160 çalışma saatinde bir veya distilasyon performansı düştüğünde temizlenmelidir. Uygun bir kireç çözücü, %10 formik asit, %10 asetik asit ve %80 distile sudan oluşan bir karışım ya da ticari bir kireç çözücüdür. Asla hidroklorik asit içeren ürünler kullanmayın. Kireç çözme sonrası ilk birkaç litre distilatı atın.', status: 'published' },
      fr: { question: 'À quelle fréquence faut-il détartrer le distillateur DragLab et quel produit utiliser ?', answer: 'Les cuves internes doivent être nettoyées environ toutes les 160 heures de fonctionnement, ou dès que les performances de distillation diminuent, selon la dureté de l\'eau brute. Une solution adaptée est composée de 10% d\'acide formique, 10% d\'acide acétique et 80% d\'eau distillée, ou un détartrant du commerce. N\'utilisez jamais de produits contenant de l\'acide chlorhydrique. Après détartrage, jetez les premiers litres de distillat.', status: 'published' }
    }
  },

  {
    category: 'Troubleshooting',
    slug: 'water-still-not-heating',
    order: 13,
    relatedProducts: ['DS 2000', 'DS 4000', 'DS 8000', 'DS 8008', 'DS 8012', 'DS 8025'],
    relatedProductNames: ['Water Still Series'],
    translations: {
      en: { question: 'My DragLab water still stops heating — what should I check?', answer: 'DragLab water stills include a thermostatic low-water cut-off that disables the heater when the water level in the evaporator is insufficient. First verify the cooling water supply, inlet filter and solenoid valve; low inlet pressure or a clogged filter will prevent the evaporator from filling. If the unit still does not heat after restoring water flow, consult the user manual troubleshooting section or contact a qualified technician.', status: 'published' },
      es: { question: 'Mi destilador DragLab deja de calentar — ¿qué debo revisar?', answer: 'Los destiladores DragLab incluyen un corte termostático por bajo nivel que desactiva la resistencia cuando el nivel de agua en el evaporador es insuficiente. Primero compruebe el suministro de agua de refrigeración, el filtro de entrada y la electroválvula; una presión baja o un filtro obstruido impiden el llenado del evaporador. Si tras restablecer el flujo el equipo sigue sin calentar, consulte la sección de solución de problemas del manual o contacte con un técnico calificado.', status: 'published' },
      de: { question: 'Mein DragLab-Destillierer heizt nicht mehr — was soll ich prüfen?', answer: 'DragLab-Destillierer verfügen über einen thermostatischen Wassermangelschutz, der die Heizung bei unzureichendem Wasserstand im Verdampfer abschaltet. Prüfen Sie zunächst Kühlwasserzufuhr, Einlassfilter und Magnetventil; niedriger Eingangsdruck oder ein verstopfter Filter verhindern das Befüllen des Verdampfers. Heizt das Gerät nach Wiederherstellung des Wasserflusses weiterhin nicht, konsultieren Sie den Fehlerbehebungsabschnitt der Bedienungsanleitung oder einen qualifizierten Techniker.', status: 'published' },
      tr: { question: 'DragLab su distilatörüm ısıtmayı durduruyor — neyi kontrol etmeliyim?', answer: 'DragLab su distilatörleri, buharlaştırıcıdaki su seviyesi yetersiz olduğunda ısıtıcıyı devre dışı bırakan termostatik düşük su koruma sistemine sahiptir. Önce soğutma suyu beslemesini, giriş filtresini ve solenoid valfi kontrol edin; düşük giriş basıncı veya tıkalı filtre buharlaştırıcının dolmasını engeller. Su akışı sağlandıktan sonra cihaz hâlâ ısıtmıyorsa kullanım kılavuzunun arıza giderme bölümüne bakın veya yetkili bir teknisyene başvurun.', status: 'published' },
      fr: { question: 'Mon distillateur DragLab ne chauffe plus — que dois-je vérifier ?', answer: 'Les distillateurs DragLab intègrent une sécurité thermostatique de niveau bas qui coupe la résistance lorsque le niveau d\'eau dans l\'évaporateur est insuffisant. Vérifiez d\'abord l\'alimentation en eau de refroidissement, le filtre d\'entrée et l\'électrovanne ; une pression faible ou un filtre obstrué empêche le remplissage de l\'évaporateur. Si l\'appareil ne chauffe toujours pas après rétablissement du débit, consultez la section dépannage du manuel ou un technicien qualifié.', status: 'published' }
    }
  },

  // ============ WATER BATH ============
  {
    category: 'Product Usage',
    slug: 'water-bath-capacity-temperature',
    order: 20,
    relatedProducts: [],
    relatedProductNames: ['Water Bath Series'],
    translations: {
      en: { question: 'What capacities and temperature range does the DragLab Water Bath Series offer?', answer: 'DragLab water baths are available with useful tank volumes from 6 to 50 liters and provide PID-controlled temperatures from ambient +5 °C up to 100 °C. A built-in circulation pump ensures homogeneous heating across the tank, and the AISI 304 stainless steel tank and heating element guarantee long service life.', status: 'published' },
      es: { question: '¿Qué capacidades y rango de temperatura ofrece la Serie Baños María DragLab?', answer: 'Los baños María DragLab están disponibles con volúmenes útiles de 6 a 50 litros y ofrecen control PID de temperatura desde ambiente +5 °C hasta 100 °C. Una bomba de circulación integrada garantiza un calentamiento homogéneo, y el tanque y la resistencia de acero inoxidable AISI 304 aseguran una larga vida útil.', status: 'published' },
      de: { question: 'Welche Volumina und welchen Temperaturbereich bietet die DragLab Wasserbad-Serie?', answer: 'DragLab-Wasserbäder sind mit Nutzvolumen von 6 bis 50 Litern erhältlich und bieten eine PID-geregelte Temperatur von Umgebung +5 °C bis 100 °C. Eine integrierte Umwälzpumpe sorgt für eine homogene Erwärmung, und Tank sowie Heizelement aus Edelstahl AISI 304 garantieren eine lange Lebensdauer.', status: 'published' },
      tr: { question: 'DragLab Su Banyosu Serisi hangi kapasite ve sıcaklık aralığını sunar?', answer: 'DragLab su banyoları 6–50 litre kullanışlı hacimlerde sunulmakta ve ortam +5 °C ile 100 °C arasında PID kontrollü sıcaklık sağlamaktadır. Dahili sirkülasyon pompası tankta homojen ısınmayı garanti eder; AISI 304 paslanmaz çelik tank ve ısıtıcı eleman uzun hizmet ömrü sağlar.', status: 'published' },
      fr: { question: 'Quelles capacités et quelle plage de température offre la série bains-marie DragLab ?', answer: 'Les bains-marie DragLab sont disponibles avec des volumes utiles de 6 à 50 litres et offrent un contrôle PID de la température, de la température ambiante +5 °C jusqu\'à 100 °C. Une pompe de circulation intégrée assure un chauffage homogène, et la cuve ainsi que la résistance en acier inoxydable AISI 304 garantissent une longue durée de vie.', status: 'published' }
    }
  },

  {
    category: 'Maintenance',
    slug: 'water-bath-cleaning',
    order: 21,
    relatedProducts: [],
    relatedProductNames: ['Water Bath Series'],
    translations: {
      en: { question: 'How should I clean and maintain my DragLab water bath?', answer: 'Always switch off and unplug the unit before cleaning. Drain the tank using the integrated drain tap and wipe the AISI 304 stainless steel surfaces with a mild, non-abrasive detergent. For mineral deposits, use a descaling agent suitable for stainless steel — never use chlorides or hydrochloric acid. Use distilled or deionized water to reduce scale build-up and extend heating element life.', status: 'published' },
      es: { question: '¿Cómo debo limpiar y mantener mi baño María DragLab?', answer: 'Apague y desconecte siempre el equipo antes de limpiarlo. Vacíe el tanque mediante el grifo de drenaje integrado y limpie las superficies de acero inoxidable AISI 304 con un detergente suave no abrasivo. Para depósitos minerales, utilice un descalcificador apto para acero inoxidable; nunca emplee cloruros ni ácido clorhídrico. Use agua destilada o desionizada para reducir la formación de incrustaciones y prolongar la vida de la resistencia.', status: 'published' },
      de: { question: 'Wie reinige und warte ich mein DragLab-Wasserbad?', answer: 'Schalten Sie das Gerät vor jeder Reinigung aus und ziehen Sie den Netzstecker. Entleeren Sie den Tank über den integrierten Ablasshahn und reinigen Sie die AISI-304-Edelstahlflächen mit einem milden, nicht scheuernden Reiniger. Bei Kalkablagerungen ein für Edelstahl geeignetes Entkalkungsmittel verwenden — niemals Chloride oder Salzsäure. Verwenden Sie destilliertes oder entionisiertes Wasser, um Kalkbildung zu reduzieren und die Heizung zu schonen.', status: 'published' },
      tr: { question: 'DragLab su banyomu nasıl temizleyip bakımını yapmalıyım?', answer: 'Temizlikten önce cihazı mutlaka kapatıp fişini çekin. Entegre tahliye musluğunu kullanarak tankı boşaltın ve AISI 304 paslanmaz çelik yüzeyleri yumuşak, aşındırıcı olmayan bir deterjanla silin. Mineral birikintileri için paslanmaz çeliğe uygun bir kireç çözücü kullanın; asla klorür veya hidroklorik asit kullanmayın. Kireç birikimini azaltmak ve ısıtıcı ömrünü uzatmak için distile veya deiyonize su tercih edin.', status: 'published' },
      fr: { question: 'Comment nettoyer et entretenir mon bain-marie DragLab ?', answer: 'Éteignez et débranchez toujours l\'appareil avant le nettoyage. Videz la cuve à l\'aide du robinet de vidange intégré et essuyez les surfaces en acier inoxydable AISI 304 avec un détergent doux non abrasif. Pour les dépôts minéraux, utilisez un détartrant adapté à l\'acier inoxydable ; n\'utilisez jamais de chlorures ni d\'acide chlorhydrique. Privilégiez l\'eau distillée ou déionisée pour limiter le tartre et préserver la résistance.', status: 'published' }
    }
  },

  // ============ INCUBATOR ============
  {
    category: 'Product Usage',
    slug: 'incubator-temperature-volumes',
    order: 30,
    relatedProducts: ['DI 30', 'DI 55', 'DI 80', 'DI 120', 'TI 30', 'TI 55', 'TI 80', 'TI 120'],
    relatedProductNames: ['Incubator Series'],
    translations: {
      en: { question: 'What is the temperature range and available volume of DragLab incubators?', answer: 'DragLab incubators operate from +20 °C to 100 °C with a programmable PID microprocessor and are available in useful chamber volumes of 30, 55, 80 and 120 liters. Both Digital Display (DI series) and Touch Screen (TI series) versions provide forced air circulation for homogeneous temperature distribution compliant with DIN 12880.', status: 'published' },
      es: { question: '¿Cuál es el rango de temperatura y los volúmenes disponibles de las incubadoras DragLab?', answer: 'Las incubadoras DragLab operan de +20 °C a 100 °C con un microprocesador PID programable y están disponibles en volúmenes útiles de 30, 55, 80 y 120 litros. Tanto las versiones con display digital (serie DI) como con pantalla táctil (serie TI) cuentan con circulación forzada de aire para una distribución homogénea de la temperatura conforme a DIN 12880.', status: 'published' },
      de: { question: 'Welchen Temperaturbereich und welche Volumina bieten DragLab-Inkubatoren?', answer: 'DragLab-Inkubatoren arbeiten von +20 °C bis 100 °C mit programmierbarem PID-Mikroprozessor und sind in Nutzvolumina von 30, 55, 80 und 120 Litern erhältlich. Sowohl die Digitalanzeige (DI-Serie) als auch die Touchscreen-Ausführung (TI-Serie) verfügen über Umluftbetrieb für eine homogene Temperaturverteilung nach DIN 12880.', status: 'published' },
      tr: { question: 'DragLab inkübatörlerinin sıcaklık aralığı ve hacim seçenekleri nelerdir?', answer: 'DragLab inkübatörleri programlanabilir PID mikroişlemci ile +20 °C ile 100 °C arasında çalışır ve 30, 55, 80 ve 120 litre kullanışlı hacimlerde sunulur. Hem dijital ekranlı (DI serisi) hem de dokunmatik ekranlı (TI serisi) versiyonlar, DIN 12880\'e uygun homojen sıcaklık dağılımı için cebri hava sirkülasyonuna sahiptir.', status: 'published' },
      fr: { question: 'Quelle est la plage de température et les volumes disponibles des incubateurs DragLab ?', answer: 'Les incubateurs DragLab fonctionnent de +20 °C à 100 °C avec un microprocesseur PID programmable et sont disponibles en volumes utiles de 30, 55, 80 et 120 litres. Les versions à affichage numérique (série DI) et à écran tactile (série TI) disposent d\'une circulation d\'air forcée assurant une répartition homogène de la température conforme à la norme DIN 12880.', status: 'published' }
    }
  },

  {
    category: 'Installation',
    slug: 'incubator-oven-clearance',
    order: 31,
    relatedProducts: [],
    relatedProductNames: ['Incubator Series', 'Drying Oven Series'],
    translations: {
      en: { question: 'How much clearance do I need around a DragLab incubator or drying oven?', answer: 'Leave at least 15 cm of clearance behind the unit, at least 5 cm on each side, and at least 20 cm above the top to allow proper ventilation and heat dissipation. Place the instrument on a level, non-combustible surface in a room kept between +5 °C and +55 °C with a maximum relative humidity of 80%.', status: 'published' },
      es: { question: '¿Qué espacio libre necesito alrededor de una incubadora o estufa DragLab?', answer: 'Deje al menos 15 cm de separación detrás del equipo, 5 cm mínimo a cada lado y al menos 20 cm por encima para asegurar una ventilación y disipación de calor adecuadas. Instale el instrumento sobre una superficie nivelada, no combustible, en un ambiente entre +5 °C y +55 °C con una humedad relativa máxima del 80%.', status: 'published' },
      de: { question: 'Welchen Abstand benötige ich um einen DragLab-Inkubator oder Trockenschrank?', answer: 'Halten Sie mindestens 15 cm Abstand hinter dem Gerät, mindestens 5 cm an jeder Seite und mindestens 20 cm nach oben ein, um eine ausreichende Belüftung und Wärmeabfuhr zu gewährleisten. Stellen Sie das Gerät auf eine ebene, nicht brennbare Fläche in einem Raum mit +5 °C bis +55 °C und maximal 80% relativer Luftfeuchte auf.', status: 'published' },
      tr: { question: 'DragLab inkübatör veya etüvün çevresinde ne kadar boşluk bırakmalıyım?', answer: 'Yeterli havalandırma ve ısı dağılımı için cihazın arkasında en az 15 cm, her iki yanında en az 5 cm ve üst kısmında en az 20 cm boşluk bırakın. Cihazı düz, yanıcı olmayan bir yüzeye, +5 °C ile +55 °C arasında ve en fazla %80 bağıl neme sahip bir ortama yerleştirin.', status: 'published' },
      fr: { question: 'Quel dégagement prévoir autour d\'un incubateur ou d\'une étuve DragLab ?', answer: 'Laissez au moins 15 cm de dégagement à l\'arrière de l\'appareil, au moins 5 cm sur chaque côté et au moins 20 cm au-dessus pour assurer une ventilation et une dissipation thermique correctes. Installez l\'instrument sur une surface plane et non combustible, dans une pièce maintenue entre +5 °C et +55 °C avec une humidité relative maximale de 80%.', status: 'published' }
    }
  },

  {
    category: 'Troubleshooting',
    slug: 'incubator-temperature-deviation',
    order: 32,
    relatedProducts: [],
    relatedProductNames: ['Incubator Series'],
    translations: {
      en: { question: 'Why does my DragLab incubator show a temperature deviation from the setpoint?', answer: 'Temperature deviations are usually caused by overloading the chamber, blocking the internal fan, opening the door too frequently, or placing the unit in a location with insufficient clearance. Verify that shelves are not obstructing airflow, keep the load within the permitted limit per shelf, and allow the chamber to stabilize after door openings. If deviations persist, an optional calibration at +100 °C is available.', status: 'published' },
      es: { question: '¿Por qué mi incubadora DragLab muestra una desviación de temperatura respecto al valor de consigna?', answer: 'Las desviaciones suelen deberse a una sobrecarga de la cámara, al bloqueo del ventilador interno, a aperturas frecuentes de la puerta o a una instalación sin espacio libre suficiente. Compruebe que las bandejas no obstruyan el flujo de aire, respete la carga permitida por estante y permita que la cámara se estabilice tras cada apertura. Si la desviación persiste, existe una calibración opcional a +100 °C.', status: 'published' },
      de: { question: 'Warum zeigt mein DragLab-Inkubator eine Temperaturabweichung vom Sollwert?', answer: 'Temperaturabweichungen entstehen meist durch Überladen der Kammer, Blockieren des Innenlüfters, häufiges Öffnen der Tür oder unzureichende Abstände am Aufstellort. Prüfen Sie, dass die Einschübe den Luftstrom nicht behindern, halten Sie die zulässige Last pro Einschub ein und lassen Sie die Kammer nach dem Öffnen stabilisieren. Bei anhaltenden Abweichungen ist optional eine Kalibrierung bei +100 °C verfügbar.', status: 'published' },
      tr: { question: 'DragLab inkübatörüm neden set değerinden sapma gösteriyor?', answer: 'Sıcaklık sapmaları genellikle haznenin aşırı doldurulması, iç fanın engellenmesi, kapının çok sık açılması veya cihazın yetersiz boşlukla konumlandırılmasından kaynaklanır. Rafların hava akışını engellemediğinden emin olun, raf başına izin verilen yükü aşmayın ve kapı açıldıktan sonra haznenin stabilize olmasını bekleyin. Sapma devam ederse +100 °C\'de opsiyonel kalibrasyon mevcuttur.', status: 'published' },
      fr: { question: 'Pourquoi mon incubateur DragLab présente-t-il un écart de température par rapport à la consigne ?', answer: 'Les écarts de température proviennent généralement d\'une surcharge de l\'enceinte, du blocage du ventilateur interne, d\'ouvertures fréquentes de la porte ou d\'un dégagement insuffisant. Vérifiez que les étagères n\'obstruent pas la circulation d\'air, respectez la charge autorisée par étagère et laissez l\'enceinte se stabiliser après chaque ouverture. Si l\'écart persiste, un étalonnage optionnel à +100 °C est disponible.', status: 'published' }
    }
  },

  // ============ DRYING OVEN ============
  {
    category: 'Product Usage',
    slug: 'drying-oven-temperature-range',
    order: 40,
    relatedProducts: ['DO 30', 'DO 55', 'DO 80', 'DO 120', 'TO 30', 'TO 55', 'TO 80', 'TO 120'],
    relatedProductNames: ['Drying Oven Series'],
    translations: {
      en: { question: 'What temperature range do DragLab drying ovens cover?', answer: 'The DragLab Drying Oven Digital Display (DO) series operates from +20 °C to 250 °C, while the Touch Screen (TO) series reaches up to 300 °C. Both series are available in 30, 55, 80 and 120 liter volumes and use forced air circulation for homogeneous drying compliant with DIN 12880.', status: 'published' },
      es: { question: '¿Qué rango de temperatura cubren las estufas DragLab?', answer: 'La serie de estufas con display digital (DO) de DragLab opera de +20 °C a 250 °C, mientras que la serie con pantalla táctil (TO) alcanza hasta 300 °C. Ambas series están disponibles en volúmenes de 30, 55, 80 y 120 litros y emplean circulación forzada de aire para un secado homogéneo conforme a DIN 12880.', status: 'published' },
      de: { question: 'Welchen Temperaturbereich decken DragLab-Trockenschränke ab?', answer: 'Die DragLab Trockenschrank-Serie mit Digitalanzeige (DO) arbeitet von +20 °C bis 250 °C, während die Touchscreen-Serie (TO) bis 300 °C reicht. Beide Serien sind in 30, 55, 80 und 120 Litern erhältlich und nutzen Umluftbetrieb für eine homogene Trocknung nach DIN 12880.', status: 'published' },
      tr: { question: 'DragLab etüvleri hangi sıcaklık aralığını kapsar?', answer: 'DragLab Dijital Ekranlı (DO) etüv serisi +20 °C ile 250 °C arasında çalışır; Dokunmatik Ekranlı (TO) seri ise 300 °C\'ye kadar ulaşır. Her iki seri de 30, 55, 80 ve 120 litre hacimlerde sunulmakta ve DIN 12880\'e uygun homojen kurutma için cebri hava sirkülasyonu kullanmaktadır.', status: 'published' },
      fr: { question: 'Quelle plage de température couvrent les étuves DragLab ?', answer: 'La série d\'étuves à affichage numérique (DO) DragLab fonctionne de +20 °C à 250 °C, tandis que la série à écran tactile (TO) atteint 300 °C. Les deux séries sont disponibles en volumes de 30, 55, 80 et 120 litres et utilisent la convection d\'air forcée pour un séchage homogène conforme à la norme DIN 12880.', status: 'published' }
    }
  },

  {
    category: 'Product Usage',
    slug: 'drying-oven-load-limits',
    order: 41,
    relatedProducts: ['DO 30', 'DO 55', 'DO 80', 'DO 120'],
    relatedProductNames: ['Drying Oven Series'],
    translations: {
      en: { question: 'What is the maximum load of a DragLab drying oven and per shelf?', answer: 'Maximum total load depends on the model: 75 kg for DO 30, 110 kg for DO 55, 150 kg for DO 80 and 170 kg for DO 120. Each shelf is limited to 15 kg regardless of the model. Distributing samples evenly across the chamber ensures proper airflow and temperature homogeneity.', status: 'published' },
      es: { question: '¿Cuál es la carga máxima de una estufa DragLab y por bandeja?', answer: 'La carga máxima total depende del modelo: 75 kg para DO 30, 110 kg para DO 55, 150 kg para DO 80 y 170 kg para DO 120. Cada bandeja admite un máximo de 15 kg independientemente del modelo. Distribuir las muestras de forma uniforme en la cámara garantiza un flujo de aire y una homogeneidad de temperatura adecuados.', status: 'published' },
      de: { question: 'Wie hoch ist die maximale Beladung eines DragLab-Trockenschranks und pro Einschub?', answer: 'Die maximale Gesamtbelastung hängt vom Modell ab: 75 kg beim DO 30, 110 kg beim DO 55, 150 kg beim DO 80 und 170 kg beim DO 120. Jeder Einschub ist unabhängig vom Modell auf 15 kg begrenzt. Eine gleichmäßige Verteilung der Proben in der Kammer gewährleistet Luftstrom und Temperaturhomogenität.', status: 'published' },
      tr: { question: 'DragLab etüvünün maksimum yükü ve raf başına yük limiti nedir?', answer: 'Maksimum toplam yük modele göre değişir: DO 30 için 75 kg, DO 55 için 110 kg, DO 80 için 150 kg ve DO 120 için 170 kg. Her raf, modelden bağımsız olarak 15 kg ile sınırlıdır. Numunelerin hazne içinde eşit dağıtılması uygun hava akışı ve sıcaklık homojenliği sağlar.', status: 'published' },
      fr: { question: 'Quelle est la charge maximale d\'une étuve DragLab et par étagère ?', answer: 'La charge totale maximale dépend du modèle : 75 kg pour la DO 30, 110 kg pour la DO 55, 150 kg pour la DO 80 et 170 kg pour la DO 120. Chaque étagère est limitée à 15 kg quel que soit le modèle. Répartir uniformément les échantillons dans l\'enceinte garantit une bonne circulation d\'air et une homogénéité de température optimales.', status: 'published' }
    }
  },

  // ============ CENTRIFUGE ============
  {
    category: 'Product Usage',
    slug: 'centrifuge-df12-specs',
    order: 50,
    relatedProducts: ['DF 12'],
    relatedProductNames: ['Centrifuge DF-12'],
    translations: {
      en: { question: 'What are the main specifications of the DragLab DF-12 centrifuge?', answer: 'The DragLab DF-12 is a benchtop centrifuge delivering up to 12,000 rpm with a brushless, maintenance-free motor. It accommodates up to 12 × 15 ml tubes depending on the rotor selected and features an LED display for real-time monitoring, adjustable speed and time settings, an electronic lid lock, imbalance detection and an emergency lid release. It operates on 230 V, 50/60 Hz.', status: 'published' },
      es: { question: '¿Cuáles son las especificaciones principales de la centrífuga DragLab DF-12?', answer: 'La DragLab DF-12 es una centrífuga de sobremesa que alcanza hasta 12.000 rpm con un motor sin escobillas libre de mantenimiento. Admite hasta 12 tubos de 15 ml según el rotor elegido e incluye display LED para monitoreo en tiempo real, ajuste de velocidad y tiempo, cierre electrónico de la tapa, detección de desequilibrio y liberación de emergencia. Funciona a 230 V, 50/60 Hz.', status: 'published' },
      de: { question: 'Was sind die wichtigsten technischen Daten der DragLab DF-12 Zentrifuge?', answer: 'Die DragLab DF-12 ist eine Tischzentrifuge mit bis zu 12.000 U/min und einem wartungsfreien, bürstenlosen Motor. Sie nimmt je nach Rotor bis zu 12 × 15 ml Röhrchen auf und verfügt über ein LED-Display zur Echtzeitanzeige, einstellbare Drehzahl- und Zeitparameter, elektronische Deckelverriegelung, Unwuchtkennung sowie eine Notentriegelung. Betrieb mit 230 V, 50/60 Hz.', status: 'published' },
      tr: { question: 'DragLab DF-12 santrifüjünün temel özellikleri nelerdir?', answer: 'DragLab DF-12, bakım gerektirmeyen fırçasız motoruyla 12.000 rpm\'e kadar hız sunan bir tezgah tipi santrifüjdür. Seçilen rotora bağlı olarak 12 adet 15 ml tüpe kadar kapasite sağlar; gerçek zamanlı izleme için LED ekran, ayarlanabilir hız ve zaman, elektronik kapak kilidi, dengesizlik algılama ve acil durum kapak açma özelliklerine sahiptir. 230 V, 50/60 Hz ile çalışır.', status: 'published' },
      fr: { question: 'Quelles sont les principales caractéristiques de la centrifugeuse DragLab DF-12 ?', answer: 'La DragLab DF-12 est une centrifugeuse de paillasse atteignant 12 000 tr/min grâce à un moteur sans balais sans entretien. Elle accueille jusqu\'à 12 tubes de 15 ml selon le rotor choisi et dispose d\'un afficheur LED pour un suivi en temps réel, de réglages de vitesse et de durée, d\'un verrouillage électronique du couvercle, d\'une détection de balourd et d\'un déverrouillage d\'urgence. Elle fonctionne en 230 V, 50/60 Hz.', status: 'published' }
    }
  },

  {
    category: 'Troubleshooting',
    slug: 'centrifuge-imbalance-alarm',
    order: 51,
    relatedProducts: ['DF 12'],
    relatedProductNames: ['Centrifuge DF-12'],
    translations: {
      en: { question: 'Why does my DragLab DF-12 centrifuge trigger an imbalance alarm?', answer: 'The DF-12 automatically stops when it detects rotor imbalance to protect the motor and operator. Always load tubes symmetrically with the same volume and tube type in opposite positions, verify that the rotor is properly seated and secured, place the unit on a stable level surface, and check that tube adapters match the rotor. Never open the lid until the rotor has stopped completely.', status: 'published' },
      es: { question: '¿Por qué mi centrífuga DragLab DF-12 activa la alarma de desequilibrio?', answer: 'La DF-12 se detiene automáticamente al detectar desequilibrio del rotor para proteger el motor y al operador. Cargue siempre los tubos de forma simétrica con el mismo volumen y tipo en posiciones opuestas, verifique que el rotor esté bien asentado y fijado, coloque la unidad sobre una superficie estable y nivelada, y compruebe que los adaptadores coincidan con el rotor. Nunca abra la tapa hasta que el rotor se haya detenido por completo.', status: 'published' },
      de: { question: 'Warum löst meine DragLab DF-12 Zentrifuge einen Unwuchtalarm aus?', answer: 'Die DF-12 stoppt automatisch bei erkannter Rotorunwucht, um Motor und Anwender zu schützen. Beladen Sie die Röhrchen stets symmetrisch mit gleichem Volumen und Typ in gegenüberliegenden Positionen, prüfen Sie den festen Sitz des Rotors, stellen Sie das Gerät auf eine ebene, stabile Fläche und achten Sie auf passende Adapter. Öffnen Sie den Deckel niemals, bevor der Rotor vollständig stillsteht.', status: 'published' },
      tr: { question: 'DragLab DF-12 santrifüjüm neden dengesizlik alarmı veriyor?', answer: 'DF-12, motoru ve operatörü korumak için rotor dengesizliği algıladığında otomatik olarak durur. Tüpleri her zaman karşılıklı konumlara aynı hacim ve tipte simetrik şekilde yerleştirin, rotorun doğru oturduğundan ve sabitlendiğinden emin olun, cihazı sabit ve düz bir yüzeye koyun ve tüp adaptörlerinin rotora uygun olduğunu kontrol edin. Rotor tamamen durmadan kapağı asla açmayın.', status: 'published' },
      fr: { question: 'Pourquoi ma centrifugeuse DragLab DF-12 déclenche-t-elle une alarme de balourd ?', answer: 'La DF-12 s\'arrête automatiquement en cas de détection de balourd du rotor afin de protéger le moteur et l\'utilisateur. Chargez toujours les tubes de manière symétrique avec le même volume et le même type dans des positions opposées, vérifiez que le rotor est bien en place et fixé, placez l\'appareil sur une surface stable et plane, et contrôlez la compatibilité des adaptateurs. N\'ouvrez jamais le couvercle avant l\'arrêt complet du rotor.', status: 'published' }
    }
  },

  {
    category: 'Maintenance',
    slug: 'centrifuge-rotor-care',
    order: 52,
    relatedProducts: ['DF 12'],
    relatedProductNames: ['Centrifuge DF-12'],
    translations: {
      en: { question: 'How should I care for the rotor of my DragLab DF-12 centrifuge?', answer: 'Inspect the rotor regularly for cracks, corrosion or deformation and replace it if any damage is found. Clean the rotor and rotor chamber after each use with a soft cloth and a mild, non-corrosive detergent, paying special attention to spills. Dry the rotor thoroughly before reinstalling it and ensure it is locked correctly on the motor shaft before starting a run.', status: 'published' },
      es: { question: '¿Cómo debo cuidar el rotor de mi centrífuga DragLab DF-12?', answer: 'Inspeccione regularmente el rotor en busca de grietas, corrosión o deformaciones y sustitúyalo si detecta algún daño. Limpie el rotor y la cámara tras cada uso con un paño suave y un detergente neutro no corrosivo, prestando especial atención a los derrames. Seque bien el rotor antes de reinstalarlo y asegúrese de que esté correctamente bloqueado en el eje del motor antes de iniciar una centrifugación.', status: 'published' },
      de: { question: 'Wie pflege ich den Rotor meiner DragLab DF-12 Zentrifuge?', answer: 'Prüfen Sie den Rotor regelmäßig auf Risse, Korrosion oder Verformung und tauschen Sie ihn bei Beschädigung aus. Reinigen Sie Rotor und Rotorkammer nach jeder Nutzung mit einem weichen Tuch und einem milden, nicht korrosiven Reiniger, besonders bei Verschüttungen. Trocknen Sie den Rotor vor dem Wiedereinbau gründlich und stellen Sie sicher, dass er vor dem Start korrekt auf der Motorwelle verriegelt ist.', status: 'published' },
      tr: { question: 'DragLab DF-12 santrifüjümün rotorunun bakımını nasıl yapmalıyım?', answer: 'Rotoru düzenli olarak çatlak, korozyon veya deformasyon açısından kontrol edin ve herhangi bir hasar görürseniz değiştirin. Her kullanımdan sonra rotoru ve rotor haznesini yumuşak bir bezle, aşındırıcı olmayan yumuşak bir deterjanla temizleyin; dökülmelere özellikle dikkat edin. Rotoru tekrar takmadan önce iyice kurutun ve çalıştırmadan önce motor miline doğru şekilde kilitlendiğinden emin olun.', status: 'published' },
      fr: { question: 'Comment entretenir le rotor de ma centrifugeuse DragLab DF-12 ?', answer: 'Inspectez régulièrement le rotor pour détecter fissures, corrosion ou déformations et remplacez-le en cas de dommage. Nettoyez le rotor et la chambre après chaque utilisation avec un chiffon doux et un détergent doux non corrosif, en portant une attention particulière aux déversements. Séchez soigneusement le rotor avant de le réinstaller et assurez-vous qu\'il est correctement verrouillé sur l\'arbre moteur avant de démarrer une centrifugation.', status: 'published' }
    }
  },

  // ============ HOTPLATE MAGNETIC STIRRER ============
  {
    category: 'Product Usage',
    slug: 'hotplate-models-temperature',
    order: 60,
    relatedProducts: ['DH 2', 'DH 7', 'DH 10'],
    relatedProductNames: ['Hotplate Magnetic Stirrer Series'],
    translations: {
      en: { question: 'Which models are available in the DragLab Hotplate Magnetic Stirrer Series?', answer: 'The series includes three models: DH 2 Compact (Ø150 mm ceramic-coated aluminum plate, 35–400 °C, 150–1500 rpm, up to 5 L), DH 7 Core (Ø160 mm ceramic plate, 35–550 °C, 150–1500 rpm, up to 10 L) and DH 10 Extended (Ø300 mm ceramic plate, 35–550 °C, 150–2000 rpm, up to 10 L). DH 7 and DH 10 support external PT1000 probe control for precise solution-temperature regulation.', status: 'published' },
      es: { question: '¿Qué modelos incluye la Serie Agitadores Magnéticos con Calefacción DragLab?', answer: 'La serie incluye tres modelos: DH 2 Compact (placa de aluminio con recubrimiento cerámico Ø150 mm, 35–400 °C, 150–1500 rpm, hasta 5 L), DH 7 Core (placa cerámica Ø160 mm, 35–550 °C, 150–1500 rpm, hasta 10 L) y DH 10 Extended (placa cerámica Ø300 mm, 35–550 °C, 150–2000 rpm, hasta 10 L). DH 7 y DH 10 admiten sonda externa PT1000 para un control preciso de la temperatura de la solución.', status: 'published' },
      de: { question: 'Welche Modelle umfasst die DragLab Heizplatten-Magnetrührer-Serie?', answer: 'Die Serie umfasst drei Modelle: DH 2 Compact (keramikbeschichtete Aluminiumplatte Ø150 mm, 35–400 °C, 150–1500 U/min, bis 5 L), DH 7 Core (Keramikplatte Ø160 mm, 35–550 °C, 150–1500 U/min, bis 10 L) und DH 10 Extended (Keramikplatte Ø300 mm, 35–550 °C, 150–2000 U/min, bis 10 L). DH 7 und DH 10 unterstützen eine externe PT1000-Sonde zur präzisen Regelung der Mediumstemperatur.', status: 'published' },
      tr: { question: 'DragLab Isıtıcılı Manyetik Karıştırıcı Serisinde hangi modeller vardır?', answer: 'Seri üç modelden oluşur: DH 2 Compact (Ø150 mm seramik kaplı alüminyum tabla, 35–400 °C, 150–1500 rpm, 5 L\'ye kadar), DH 7 Core (Ø160 mm seramik tabla, 35–550 °C, 150–1500 rpm, 10 L\'ye kadar) ve DH 10 Extended (Ø300 mm seramik tabla, 35–550 °C, 150–2000 rpm, 10 L\'ye kadar). DH 7 ve DH 10, çözelti sıcaklığının hassas kontrolü için harici PT1000 probunu destekler.', status: 'published' },
      fr: { question: 'Quels modèles comprend la série agitateurs magnétiques chauffants DragLab ?', answer: 'La série comprend trois modèles : DH 2 Compact (plateau aluminium à revêtement céramique Ø150 mm, 35–400 °C, 150–1500 tr/min, jusqu\'à 5 L), DH 7 Core (plateau céramique Ø160 mm, 35–550 °C, 150–1500 tr/min, jusqu\'à 10 L) et DH 10 Extended (plateau céramique Ø300 mm, 35–550 °C, 150–2000 tr/min, jusqu\'à 10 L). Les DH 7 et DH 10 acceptent une sonde externe PT1000 pour une régulation précise de la température de la solution.', status: 'published' }
    }
  },

  {
    category: 'Product Usage',
    slug: 'hotplate-pt1000-probe',
    order: 61,
    relatedProducts: ['DH 7', 'DH 10'],
    relatedProductNames: ['Hotplate Magnetic Stirrer Series'],
    translations: {
      en: { question: 'When should I use the external PT1000 probe with a DragLab hotplate?', answer: 'Use the external PT1000 probe when you need precise control of the solution temperature rather than the plate temperature. Plate Control regulates the ceramic surface setpoint, while Solution Control via the PT1000 directly measures the liquid and holds it at the target value with ±0.5 °C accuracy. The probe is recommended for temperature-sensitive reactions, buffer preparation and reproducible protocols.', status: 'published' },
      es: { question: '¿Cuándo debo utilizar la sonda externa PT1000 con una placa calefactora DragLab?', answer: 'Utilice la sonda externa PT1000 cuando necesite controlar con precisión la temperatura de la solución en lugar de la temperatura de la placa. El control de placa regula la consigna de la superficie cerámica, mientras que el control de solución mediante PT1000 mide directamente el líquido y lo mantiene en el valor objetivo con una precisión de ±0,5 °C. Se recomienda para reacciones sensibles a la temperatura, preparación de buffers y protocolos reproducibles.', status: 'published' },
      de: { question: 'Wann sollte ich den externen PT1000-Fühler mit einer DragLab-Heizplatte verwenden?', answer: 'Verwenden Sie den externen PT1000-Fühler, wenn Sie die Mediumstemperatur anstatt der Plattentemperatur präzise regeln möchten. Die Plattenregelung stellt den Sollwert der Keramikoberfläche, während die Mediumsregelung über den PT1000 die Flüssigkeit direkt misst und mit einer Genauigkeit von ±0,5 °C auf dem Zielwert hält. Empfohlen für temperaturempfindliche Reaktionen, Pufferpräparation und reproduzierbare Protokolle.', status: 'published' },
      tr: { question: 'DragLab ısıtıcı tabla ile harici PT1000 probunu ne zaman kullanmalıyım?', answer: 'Tabla sıcaklığı yerine çözelti sıcaklığını hassas şekilde kontrol etmeniz gerektiğinde harici PT1000 probunu kullanın. Tabla Kontrolü seramik yüzeyin set değerini ayarlarken, PT1000 ile Çözelti Kontrolü sıvıyı doğrudan ölçüp ±0,5 °C doğrulukla hedef değerde tutar. Prob, sıcaklığa duyarlı reaksiyonlar, tampon hazırlama ve tekrarlanabilir protokoller için önerilir.', status: 'published' },
      fr: { question: 'Quand utiliser la sonde externe PT1000 avec une plaque chauffante DragLab ?', answer: 'Utilisez la sonde externe PT1000 lorsque vous devez contrôler précisément la température de la solution plutôt que celle du plateau. Le contrôle de plateau régule la consigne de la surface céramique, tandis que le contrôle de solution via la PT1000 mesure directement le liquide et le maintient à la valeur cible avec une précision de ±0,5 °C. La sonde est recommandée pour les réactions sensibles à la température, la préparation de tampons et les protocoles reproductibles.', status: 'published' }
    }
  },

  {
    category: 'Maintenance',
    slug: 'hotplate-cleaning-safety',
    order: 62,
    relatedProducts: ['DH 2', 'DH 7', 'DH 10'],
    relatedProductNames: ['Hotplate Magnetic Stirrer Series'],
    translations: {
      en: { question: 'How do I safely clean a DragLab hotplate magnetic stirrer?', answer: 'Always switch off the hotplate and allow the ceramic plate to cool completely — the HOT surface indicator remains active after use to warn of residual heat. Unplug the unit and wipe the ceramic plate with a soft damp cloth and a mild detergent. Do not use abrasive pads or aggressive solvents. Clean spills promptly to prevent staining and keep the ventilation openings of the housing free of dust.', status: 'published' },
      es: { question: '¿Cómo limpio de forma segura un agitador magnético con calefacción DragLab?', answer: 'Apague siempre la placa y deje enfriar completamente la superficie cerámica; el indicador HOT permanece activo tras el uso para advertir del calor residual. Desenchufe el equipo y limpie la placa con un paño suave húmedo y detergente neutro. No utilice estropajos abrasivos ni disolventes agresivos. Limpie los derrames de inmediato para evitar manchas y mantenga libres de polvo las aberturas de ventilación de la carcasa.', status: 'published' },
      de: { question: 'Wie reinige ich einen DragLab-Magnetrührer mit Heizplatte sicher?', answer: 'Schalten Sie die Heizplatte immer aus und lassen Sie die Keramikoberfläche vollständig abkühlen — die HOT-Anzeige bleibt nach der Nutzung aktiv und warnt vor Restwärme. Ziehen Sie den Netzstecker und reinigen Sie die Platte mit einem weichen feuchten Tuch und mildem Reiniger. Keine Scheuerschwämme oder aggressive Lösungsmittel verwenden. Verschüttetes sofort entfernen, um Flecken zu vermeiden, und die Lüftungsöffnungen des Gehäuses staubfrei halten.', status: 'published' },
      tr: { question: 'DragLab ısıtıcılı manyetik karıştırıcıyı güvenli şekilde nasıl temizlerim?', answer: 'Cihazı her zaman kapatın ve seramik tablanın tamamen soğumasını bekleyin; HOT (Sıcak Yüzey) göstergesi, kalan ısıya karşı uyarı için kullanım sonrası aktif kalır. Fişi çekin ve tablayı yumuşak nemli bir bez ve yumuşak deterjanla silin. Aşındırıcı süngerler veya agresif çözücüler kullanmayın. Leke oluşmaması için dökülmeleri hemen temizleyin ve gövdedeki havalandırma deliklerini tozsuz tutun.', status: 'published' },
      fr: { question: 'Comment nettoyer en toute sécurité un agitateur magnétique chauffant DragLab ?', answer: 'Éteignez toujours la plaque chauffante et laissez la surface céramique refroidir complètement ; l\'indicateur HOT reste actif après utilisation pour signaler la chaleur résiduelle. Débranchez l\'appareil et nettoyez le plateau avec un chiffon doux humide et un détergent doux. N\'utilisez pas de tampons abrasifs ni de solvants agressifs. Nettoyez immédiatement les déversements pour éviter les taches et maintenez les ouvertures de ventilation du boîtier exemptes de poussière.', status: 'published' }
    }
  },

  // ============ GENERAL / INSTALLATION ============
  {
    category: 'Installation',
    slug: 'power-supply-voltage',
    order: 70,
    relatedProducts: [],
    relatedProductNames: ['Water Still Series', 'Water Bath Series', 'Incubator Series', 'Drying Oven Series', 'Centrifuge DF-12', 'Hotplate Magnetic Stirrer Series'],
    translations: {
      en: { question: 'What power supply do DragLab instruments require?', answer: 'Most DragLab instruments — water baths, incubators, drying ovens, the DF-12 centrifuge, hotplate stirrers and small water stills (DS 2000/4000/8000) — operate on single-phase 230 V, 50/60 Hz. High-capacity water stills DS 8008, DS 8012 and DS 8025 require a 400 V three-phase connection (400V/3/N/PE, 50/60 Hz). Always confirm the rating label before connecting the unit.', status: 'published' },
      es: { question: '¿Qué alimentación eléctrica requieren los instrumentos DragLab?', answer: 'La mayoría de instrumentos DragLab —baños María, incubadoras, estufas, centrífuga DF-12, agitadores con calefacción y destiladores pequeños (DS 2000/4000/8000)— funcionan con 230 V monofásica, 50/60 Hz. Los destiladores de alta capacidad DS 8008, DS 8012 y DS 8025 requieren conexión trifásica de 400 V (400V/3/N/PE, 50/60 Hz). Verifique siempre la placa de características antes de conectar el equipo.', status: 'published' },
      de: { question: 'Welche Stromversorgung benötigen DragLab-Geräte?', answer: 'Die meisten DragLab-Geräte — Wasserbäder, Inkubatoren, Trockenschränke, die DF-12 Zentrifuge, Heizplatten-Rührer und kleine Wasserdestillierer (DS 2000/4000/8000) — arbeiten mit einphasigem Netzanschluss 230 V, 50/60 Hz. Hochleistungs-Destillierer DS 8008, DS 8012 und DS 8025 benötigen einen 400-V-Drehstromanschluss (400V/3/N/PE, 50/60 Hz). Prüfen Sie vor dem Anschluss stets das Typenschild.', status: 'published' },
      tr: { question: 'DragLab cihazları hangi elektrik beslemesini gerektirir?', answer: 'DragLab cihazlarının çoğu —su banyoları, inkübatörler, etüvler, DF-12 santrifüj, ısıtıcılı karıştırıcılar ve küçük su distilatörleri (DS 2000/4000/8000)— tek fazlı 230 V, 50/60 Hz ile çalışır. Yüksek kapasiteli DS 8008, DS 8012 ve DS 8025 distilatörleri 400 V üç fazlı bağlantı (400V/3/N/PE, 50/60 Hz) gerektirir. Cihazı bağlamadan önce mutlaka etiket üzerindeki değerleri kontrol edin.', status: 'published' },
      fr: { question: 'Quelle alimentation électrique nécessitent les instruments DragLab ?', answer: 'La plupart des instruments DragLab — bains-marie, incubateurs, étuves, centrifugeuse DF-12, agitateurs chauffants et petits distillateurs (DS 2000/4000/8000) — fonctionnent en monophasé 230 V, 50/60 Hz. Les distillateurs haute capacité DS 8008, DS 8012 et DS 8025 nécessitent une alimentation triphasée 400 V (400V/3/N/PE, 50/60 Hz). Vérifiez toujours la plaque signalétique avant le raccordement.', status: 'published' }
    }
  },

  {
    category: 'General',
    slug: 'calibration-certificate',
    order: 71,
    relatedProducts: [],
    relatedProductNames: ['Incubator Series', 'Drying Oven Series'],
    translations: {
      en: { question: 'Can I order a calibration certificate for my DragLab incubator or drying oven?', answer: 'Yes. DragLab offers an optional calibration certificate at +100 °C for incubators and drying ovens. Calibration is performed according to DIN 12880 and provides traceable documentation of temperature performance at the time of delivery. Contact your distributor or DragLab directly to add this option to your order.', status: 'published' },
      es: { question: '¿Puedo solicitar un certificado de calibración para mi incubadora o estufa DragLab?', answer: 'Sí. DragLab ofrece un certificado de calibración opcional a +100 °C para incubadoras y estufas. La calibración se realiza conforme a DIN 12880 y proporciona documentación trazable del rendimiento de temperatura en el momento de la entrega. Contacte con su distribuidor o directamente con DragLab para añadir esta opción a su pedido.', status: 'published' },
      de: { question: 'Kann ich für meinen DragLab-Inkubator oder Trockenschrank ein Kalibrierzertifikat bestellen?', answer: 'Ja. DragLab bietet für Inkubatoren und Trockenschränke optional ein Kalibrierzertifikat bei +100 °C an. Die Kalibrierung erfolgt gemäß DIN 12880 und liefert eine rückverfolgbare Dokumentation der Temperaturleistung zum Zeitpunkt der Auslieferung. Wenden Sie sich an Ihren Distributor oder direkt an DragLab, um diese Option zu Ihrer Bestellung hinzuzufügen.', status: 'published' },
      tr: { question: 'DragLab inkübatörüm veya etüvüm için kalibrasyon sertifikası sipariş edebilir miyim?', answer: 'Evet. DragLab, inkübatörler ve etüvler için +100 °C\'de opsiyonel kalibrasyon sertifikası sunmaktadır. Kalibrasyon DIN 12880 standardına göre yapılır ve teslimat anındaki sıcaklık performansının izlenebilir dokümantasyonunu sağlar. Bu seçeneği siparişinize eklemek için distribütörünüzle veya doğrudan DragLab ile iletişime geçin.', status: 'published' },
      fr: { question: 'Puis-je commander un certificat d\'étalonnage pour mon incubateur ou étuve DragLab ?', answer: 'Oui. DragLab propose en option un certificat d\'étalonnage à +100 °C pour les incubateurs et les étuves. L\'étalonnage est réalisé conformément à la norme DIN 12880 et fournit une documentation traçable des performances en température au moment de la livraison. Contactez votre distributeur ou directement DragLab pour ajouter cette option à votre commande.', status: 'published' }
    }
  }

];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let inserted = 0;
  let skipped  = 0;

  for (const data of faqs) {
    const existing = await FAQ.findOne({ slug: data.slug });
    if (existing) {
      console.log(`  ⏭  Already exists: ${data.slug}`);
      skipped++;
      continue;
    }
    await FAQ.create(data);
    console.log(`  ✓  Inserted: [${data.category}] ${data.slug}`);
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
